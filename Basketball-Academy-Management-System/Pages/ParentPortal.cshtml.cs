using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Basketball_Academy_Management_System.Pages.Shared;
using System.Linq.Expressions;

namespace Basketball_Academy_Management_System.Pages
{
    public class ParentPortalModel : ProtectedPageModel
    {
        // You may want to move this to configuration in a real app
        private readonly string connectionString =
            "Data Source=NOVA;Initial Catalog=BasketballAcademyDB;Integrated Security=True;TrustServerCertificate=True";

        public Player CurrentPlayer { get; set; } = new Player { Name = "Aarav Sharma", Age = 14, Position = "Point Guard", Photo = "/images/player1.jpg" };
        public List<AttendanceRecord> Attendance { get; set; } = new List<AttendanceRecord>();
        public List<Payment> Payments { get; set; } = new List<Payment>();
        public string ErrorMessage { get; set; } = "";

        public int AttendancePercentage
        {
            get
            {
                if (Attendance == null || Attendance.Count == 0) return 0;
                var present = 0;
                foreach (var a in Attendance) if (a.Status == "Present") present++;
                return (int)Math.Round(100.0 * present / Attendance.Count);
            }
        }

        public void OnGet()
        {
            var email = CurrentUserEmail;
            if (string.IsNullOrEmpty(email))
            {
                // ProtectedPageModel should have redirected already, but be defensive
                ErrorMessage = "User not logged in.";
                return;
            }
            int userId;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string qGetId = "SELECT UserID FROM Users WHERE Email = @Email";
                    using (SqlCommand cmd = new SqlCommand(qGetId, conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        var idObj = cmd.ExecuteScalar();
                        if (idObj == null || idObj == DBNull.Value)
                        {
                            // User not found
                            ErrorMessage = "User account not found.";
                            return;
                        }
                        userId = Convert.ToInt32(idObj);

                    }
                }
            } catch (Exception e) {
                ErrorMessage = "Error, could not find user Id: " + e.Message;
                return;
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Try to find player by parent email

                    string qPlayerByParent = "SELECT TOP 1 PlayerID, Name, Age, Position, Photo, ParentID FROM Players WHERE ParentID = @ID";
                    using (SqlCommand cmd = new SqlCommand(qPlayerByParent, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", userId);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                CurrentPlayer = new Player
                                {
                                    Id = reader["PlayerID"]?.ToString() ?? "",
                                    Name = reader["Name"]?.ToString() ?? CurrentPlayer.Name,
                                    Age = reader["Age"] != DBNull.Value ? Convert.ToInt32(reader["Age"]) : CurrentPlayer.Age,
                                    Position = reader["Position"]?.ToString() ?? CurrentPlayer.Position,
                                    Photo = reader["Photo"]?.ToString() ?? CurrentPlayer.Photo,
                                    ParentID = reader["ParentID"]?.ToString() ?? ""
                                };
                            }
                        }
                    }

                   

                    // Load attendance (if player id present)
                    if (!string.IsNullOrEmpty(CurrentPlayer?.Id))
                    {
                        string qAttendance = "SELECT Date, Status FROM Attendance WHERE PlayerID = @PlayerId ORDER BY Date DESC";
                        using (SqlCommand cmd = new SqlCommand(qAttendance, conn))
                        {
                            cmd.Parameters.AddWithValue("@PlayerId", CurrentPlayer.Id);
                            using (var reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    var rec = new AttendanceRecord
                                    {
                                        Date = reader["Date"] != DBNull.Value ? Convert.ToDateTime(reader["Date"]) : DateTime.MinValue,
                                        Status = reader["Status"] != DBNull.Value ? Convert.ToString(reader["Status"]) : "Absent"
                                    };
                                    Attendance.Add(rec);
                                }
                            }
                        }

                        // Load payments
                        string qPayments = "SELECT Date, Amount, Notes, (SELECT Name FROM Players WHERE PlayerID = Payments.PlayerID) as PlayerName, (SELECT ParentID FROM Players WHERE PlayerID = Payments.PlayerID) as ParentID FROM Payments WHERE PlayerID = @PlayerId ORDER BY Date DESC";
                        using (SqlCommand cmd = new SqlCommand(qPayments, conn))
                        {
                            cmd.Parameters.AddWithValue("@PlayerId", CurrentPlayer.Id);
                            using (var reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    var pay = new Payment
                                    {
                                        Date = reader["Date"] != DBNull.Value ? Convert.ToDateTime(reader["Date"]) : DateTime.MinValue,
                                        Amount = reader["Amount"] != DBNull.Value ? Convert.ToDecimal(reader["Amount"]) : 0m,
                                        Notes = reader["Notes"]?.ToString() ?? "",
                                        PlayerName = reader["PlayerName"]?.ToString() ?? "",
                                        ParentID = reader["ParentID"]?.ToString() ?? ""
                                    };
                                    Payments.Add(pay);
                                }
                            }
                        }
                    }
                }

                // If we couldn't pull any real data, keep the sample data and some sample attendance/payments
                if (Attendance.Count == 0)
                {
                    Attendance = new List<AttendanceRecord>
                    {
                        new AttendanceRecord { Date = DateTime.Today.AddDays(-3), Status = "Present" },
                        new AttendanceRecord { Date = DateTime.Today.AddDays(-2), Status = "Present" },
                        new AttendanceRecord { Date = DateTime.Today.AddDays(-1), Status = "Present" },
                        new AttendanceRecord { Date = DateTime.Today, Status = "Present" }
                    };
                }

                if (Payments.Count == 0)
                {
                    Payments = new List<Payment>
                    {
                        new Payment { Date = DateTime.Today.AddMonths(-2), Amount = 150.00m, Notes = "Monthly fee", PlayerName = CurrentPlayer.Name, ParentID = CurrentPlayer.ParentID },
                        new Payment { Date = DateTime.Today.AddMonths(-1), Amount = 150.00m, Notes = "Monthly fee", PlayerName = CurrentPlayer.Name, ParentID = CurrentPlayer.ParentID }
                    };
                }
            }
            catch (Exception ex)
            {
                // Log or surface a friendly error
                ErrorMessage = "Could not load parent portal data: " + ex.Message;
            }
        }
    }

    public class Player
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public int Age { get; set; }
        public string Position { get; set; } = "";
        public string Photo { get; set; } = "";
        public string ParentID { get; set; } = "";
    }

    public class AttendanceRecord
    {
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

    public class Payment
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; } = "";
        public string PlayerName { get; set; } = "";
        public string ParentID { get; set; } = "";
    }
}
