using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Basketball_Academy_Management_System.Pages.Shared;

namespace Basketball_Academy_Management_System.Pages
{
    public class CoachAttendanceModel : ProtectedPageModel
    {
        private readonly string connectionString =
            "Data Source=NOVA;Initial Catalog=BasketballAcademyDB;Integrated Security=True;TrustServerCertificate=True";

        public Player[] PlayerList { get; set; } = Array.Empty<Player>();

        public class PlayerAttendance
        {
            public string PlayerId { get; set; } = "";
            public DateTime Date { get; set; }
            public string Status { get; set; }
        }

        public void OnGet()
        {
            var players = new List<Player>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string q = "SELECT PlayerID, Name, Age, Position, Photo FROM Players";
                    using (SqlCommand cmd = new SqlCommand(q, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            players.Add(new Player
                            {
                                Id = reader["PlayerID"]?.ToString() ?? "",
                                Name = reader["Name"]?.ToString() ?? "",
                                Age = reader["Age"] != DBNull.Value ? Convert.ToInt32(reader["Age"]) : 0,
                                Position = reader["Position"]?.ToString() ?? "",
                                Photo = reader["Photo"]?.ToString() ?? "/images/player1.jpg"
                            });
                        }
                    }
                }

                PlayerList = players.ToArray();
            }
            catch
            {
                PlayerList = Array.Empty<Player>();
            }
        }

        public IActionResult OnPost()
        {
            // presentIds contains the ids of players marked present
            var presentIds = Request.Form["presentIds"].ToArray();
            var presentSet = new HashSet<string>(presentIds);

            var attendances = new List<PlayerAttendance>();
            var today = DateTime.Today;

            try
            {
                // Load all player ids to ensure we record attendance for everyone
                var allPlayerIds = new List<string>();
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string q = "SELECT PlayerID FROM Players";
                    using (SqlCommand cmd = new SqlCommand(q, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            allPlayerIds.Add(reader["PlayerID"]?.ToString() ?? "");
                        }
                    }

                    // Build attendance records
                    foreach (var pid in allPlayerIds)
                    {
                        attendances.Add(new PlayerAttendance
                        {
                            PlayerId = pid,
                            Date = today,
                            Status = presentSet.Contains(pid) ? "Present" : "Absent"
                        });
                    }

                    string delQ = "DELETE FROM Attendance WHERE Date = @Date";
                    using (var del = new SqlCommand(delQ, conn))
                    {
                        del.Parameters.AddWithValue("@Date", today);
                        del.ExecuteNonQuery();
                    }

                    // Insert attendance rows
                    string insQ = "INSERT INTO Attendance (PlayerID, Date, Status) VALUES (@PlayerId, @Date, @Status)";
                    using (var tran = conn.BeginTransaction())
                    using (var ins = new SqlCommand(insQ, conn, tran))
                    {
                        ins.Parameters.Add(new SqlParameter("@PlayerId", System.Data.SqlDbType.NVarChar));
                        ins.Parameters.Add(new SqlParameter("@Date", System.Data.SqlDbType.Date));
                        ins.Parameters.Add(new SqlParameter("@Status", System.Data.SqlDbType.NVarChar));

                        foreach (var a in attendances)
                        {
                            ins.Parameters["@PlayerId"].Value = a.PlayerId;
                            ins.Parameters["@Date"].Value = a.Date.Date;
                            ins.Parameters["@Status"].Value = a.Status;
                            ins.ExecuteNonQuery();
                        }

                        tran.Commit();
                    }
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                // log or surface error
                ModelState.AddModelError("", "Could not save attendance: " + ex.Message);
                // reload players so page can render with errors
                OnGet();
                return Page();
            }
        }
    }
}
