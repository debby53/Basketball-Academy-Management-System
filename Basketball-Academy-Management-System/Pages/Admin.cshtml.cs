using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Basketball_Academy_Management_System.Pages.Shared;

namespace Basketball_Academy_Management_System.Pages
{
    public class AdminModel : ProtectedPageModel
    {
        // Consider moving this to configuration in production
        private readonly string connectionString =
            "Data Source=NOVA;Initial Catalog=BasketballAcademyDB;Integrated Security=True;TrustServerCertificate=True";

        public List<UserAccount> Users { get; set; } = new List<UserAccount>();
        public List<Player> Players { get; set; } = new List<Player>();
        public List<Payment> Payments { get; set; } = new List<Payment>();

        public string ErrorMessage { get; set; } = "";

        // Bind properties for forms (so edit handlers can populate fields)
        [BindProperty]
        public string FormEmail { get; set; } = "";
        [BindProperty]
        public string FormRole { get; set; } = "";
        [BindProperty]
        public string FormPassword { get; set; } = "";
        [BindProperty]
        public string FormFullname { get; set; } = "";
        [BindProperty]
        public string FormPhone { get; set; } = "";
        [BindProperty]
        public string OriginalEmail { get; set; } = ""; // used to track editing

        [BindProperty]
        public string PlayerId { get; set; } = "";
        [BindProperty]
        public string PlayerName { get; set; } = "";
        [BindProperty]
        public int PlayerAge { get; set; }
        [BindProperty]
        public string PlayerTeam { get; set; } = "";
        [BindProperty]
        public string PlayerParentEmail { get; set; } = "";
        [BindProperty]
        public string PlayerPhoto { get; set; } = "";

        [BindProperty]
        public DateTime PaymentDate { get; set; }
        [BindProperty]
        public decimal PaymentAmount { get; set; }
        [BindProperty]
        public string PaymentNotes { get; set; } = "";
        [BindProperty]
        public string PaymentPlayerId { get; set; } = "";

        public IActionResult OnGet()
        {
            var email = CurrentUserEmail;
            if (string.IsNullOrEmpty(email))
            {
                return RedirectToPage("/Account/Login");
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Verify role is Admin
                    string qRole = "SELECT Role FROM Users WHERE Email = @Email";
                    using (SqlCommand cmd = new SqlCommand(qRole, conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        var roleObj = cmd.ExecuteScalar();
                        if (roleObj == null || roleObj == DBNull.Value || !roleObj.ToString().Equals("Admin", StringComparison.OrdinalIgnoreCase))
                        {
                            return RedirectToPage("/Index");
                        }
                    }

                    LoadData(conn);
                }

                return Page();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error loading admin data: " + ex.Message;
                return Page();
            }
        }

        // --- User handlers ---

        public IActionResult OnPostSaveUser()
        {
            var email = Request.Form["Email"].ToString().Trim();
            var role = Request.Form["Role"].ToString().Trim();
            var password = Request.Form["Password"].ToString();
            var fullname = Request.Form["Fullname"].ToString();
            var phone = Request.Form["Phone"].ToString();
            var orig = Request.Form["OriginalEmail"].ToString();

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(role))
            {
                ErrorMessage = "Invalid user input.";
                return RedirectToPage();
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    if (!string.IsNullOrEmpty(orig))
                    {
                        // Update existing
                        if (!string.IsNullOrEmpty(password))
                        {
                            string q = "UPDATE Users SET Email=@Email, Role=@Role, Password=@Password, Fullname=@Fullname, Phone=@Phone WHERE Email=@Orig";
                            using (var cmd = new SqlCommand(q, conn))
                            {
                                cmd.Parameters.AddWithValue("@Email", email);
                                cmd.Parameters.AddWithValue("@Role", role);
                                cmd.Parameters.AddWithValue("@Password", password);
                                cmd.Parameters.AddWithValue("@Fullname", fullname ?? "");
                                cmd.Parameters.AddWithValue("@Phone", phone ?? "");
                                cmd.Parameters.AddWithValue("@Orig", orig);
                                cmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            string q = "UPDATE Users SET Email=@Email, Role=@Role, Fullname=@Fullname, Phone=@Phone WHERE Email=@Orig";
                            using (var cmd = new SqlCommand(q, conn))
                            {
                                cmd.Parameters.AddWithValue("@Email", email);
                                cmd.Parameters.AddWithValue("@Role", role);
                                cmd.Parameters.AddWithValue("@Fullname", fullname ?? "");
                                cmd.Parameters.AddWithValue("@Phone", phone ?? "");
                                cmd.Parameters.AddWithValue("@Orig", orig);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                    else
                    {
                        // Insert new
                        string qExist = "SELECT COUNT(*) FROM Users WHERE Email=@Email";
                        using (var cmd = new SqlCommand(qExist, conn))
                        {
                            cmd.Parameters.AddWithValue("@Email", email);
                            var exists = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                            if (exists)
                            {
                                ErrorMessage = "User already exists.";
                                return RedirectToPage();
                            }
                        }

                        string qIns = "INSERT INTO Users (Email, Password, Role, Fullname, Phone) VALUES (@Email, @Password, @Role, @Fullname, @Phone)";
                        using (var cmd = new SqlCommand(qIns, conn))
                        {
                            cmd.Parameters.AddWithValue("@Email", email);
                            cmd.Parameters.AddWithValue("@Password", password ?? "");
                            cmd.Parameters.AddWithValue("@Role", role);
                            cmd.Parameters.AddWithValue("@Fullname", fullname ?? "");
                            cmd.Parameters.AddWithValue("@Phone", phone ?? "");
                            cmd.ExecuteNonQuery();
                        }
                    }

                    LoadData(conn);
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error saving user: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostEditUser()
        {
            var email = Request.Form["Email"].ToString();
            if (string.IsNullOrEmpty(email)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    LoadData(conn);

                    string q = "SELECT Email, Role, Fullname, Phone FROM Users WHERE Email=@Email";
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                FormEmail = reader["Email"]?.ToString() ?? "";
                                FormRole = reader["Role"]?.ToString() ?? "";
                                FormFullname = reader["Fullname"]?.ToString() ?? "";
                                FormPhone = reader["Phone"]?.ToString() ?? "";
                                OriginalEmail = FormEmail;
                            }
                        }
                    }
                }

                return Page();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error loading user for edit: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostDeleteUser()
        {
            var email = Request.Form["Email"].ToString();
            if (string.IsNullOrEmpty(email)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string q = "DELETE FROM Users WHERE Email=@Email";
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        cmd.ExecuteNonQuery();
                    }

                    LoadData(conn);
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error deleting user: " + ex.Message;
                return RedirectToPage();
            }
        }

        // --- Player handlers ---

        public IActionResult OnPostSavePlayer()
        {
            var name = Request.Form["Name"].ToString();
            var ageStr = Request.Form["Age"].ToString();
            var team = Request.Form["Team"].ToString();
            var parentEmail = Request.Form["ParentEmail"].ToString();
            var photo = Request.Form["Photo"].ToString();

            if (string.IsNullOrEmpty(name) || !int.TryParse(ageStr, out var age))
            {
                ErrorMessage = "Invalid player input.";
                return RedirectToPage();
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // If PlayerId provided, update existing
                    var id = Request.Form["Id"].ToString();
                    if (!string.IsNullOrEmpty(id))
                    {
                        string q = "UPDATE Players SET Name=@Name, Age=@Age, Position=@Team, Photo=@Photo, ParentEmail=@ParentEmail WHERE Id=@Id";
                        using (var cmd = new SqlCommand(q, conn))
                        {
                            cmd.Parameters.AddWithValue("@Name", name);
                            cmd.Parameters.AddWithValue("@Age", age);
                            cmd.Parameters.AddWithValue("@Team", team ?? "");
                            cmd.Parameters.AddWithValue("@Photo", photo ?? "");
                            cmd.Parameters.AddWithValue("@ParentEmail", parentEmail ?? "");
                            cmd.Parameters.AddWithValue("@Id", id);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        string qInsert = "INSERT INTO Players (Name, Age, Position, Photo, ParentEmail) VALUES (@Name, @Age, @Team, @Photo, @ParentEmail)";
                        using (SqlCommand cmd = new SqlCommand(qInsert, conn))
                        {
                            cmd.Parameters.AddWithValue("@Name", name);
                            cmd.Parameters.AddWithValue("@Age", age);
                            cmd.Parameters.AddWithValue("@Team", team ?? "");
                            cmd.Parameters.AddWithValue("@Photo", photo ?? "");
                            cmd.Parameters.AddWithValue("@ParentEmail", parentEmail ?? "");
                            cmd.ExecuteNonQuery();
                        }
                    }

                    LoadData(conn);
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error saving player: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostEditPlayer()
        {
            var id = Request.Form["Id"].ToString();
            if (string.IsNullOrEmpty(id)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    LoadData(conn);

                    string q = "SELECT Id, Name, Age, Position, Photo, ParentEmail FROM Players WHERE Id=@Id";
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                PlayerId = reader["Id"]?.ToString() ?? "";
                                PlayerName = reader["Name"]?.ToString() ?? "";
                                PlayerAge = reader["Age"] != DBNull.Value ? Convert.ToInt32(reader["Age"]) : 0;
                                PlayerTeam = reader["Position"]?.ToString() ?? "";
                                PlayerPhoto = reader["Photo"]?.ToString() ?? "";
                                PlayerParentEmail = reader["ParentEmail"]?.ToString() ?? "";
                            }
                        }
                    }
                }

                return Page();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error loading player for edit: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostDeletePlayer()
        {
            var id = Request.Form["Id"].ToString();
            if (string.IsNullOrEmpty(id)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string q = "DELETE FROM Players WHERE Id=@Id";
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.ExecuteNonQuery();
                    }

                    LoadData(conn);
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error deleting player: " + ex.Message;
                return RedirectToPage();
            }
        }

        // --- Payment handlers ---

        public IActionResult OnPostEditPayment()
        {
            // For demo: load payment by date (not unique) — ideally use payment id
            var dateStr = Request.Form["Date"].ToString();
            if (!DateTime.TryParse(dateStr, out var dt)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    LoadData(conn);

                    string q = @"SELECT p.Date, p.Amount, p.Notes, p.PlayerId
                                 FROM Payments p
                                 WHERE p.Date = @Date";
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Date", dt);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                PaymentDate = reader["Date"] != DBNull.Value ? Convert.ToDateTime(reader["Date"]) : DateTime.MinValue;
                                PaymentAmount = reader["Amount"] != DBNull.Value ? Convert.ToDecimal(reader["Amount"]) : 0m;
                                PaymentNotes = reader["Notes"]?.ToString() ?? "";
                                PaymentPlayerId = reader["PlayerId"]?.ToString() ?? "";
                            }
                        }
                    }
                }

                return Page();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error loading payment for edit: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostDeletePayment()
        {
            var dateStr = Request.Form["Date"].ToString();
            if (!DateTime.TryParse(dateStr, out var dt)) return RedirectToPage();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string q = "DELETE FROM Payments WHERE Date=@Date"; // demo only
                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@Date", dt);
                        cmd.ExecuteNonQuery();
                    }

                    LoadData(conn);
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error deleting payment: " + ex.Message;
                return RedirectToPage();
            }
        }

        public IActionResult OnPostGenerateReport()
        {
            var type = Request.Form["ReportType"].ToString();
            // Placeholder — real report generation would return a file or page
            ErrorMessage = "Requested report: " + type;
            return RedirectToPage();
        }

        private void LoadData(SqlConnection conn)
        {
            Users.Clear();
            Players.Clear();
            Payments.Clear();

            // Load all users
            string qUsers = "SELECT Email, Role, Fullname, Phone FROM Users";
            using (SqlCommand cmd = new SqlCommand(qUsers, conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Users.Add(new UserAccount
                    {
                        Email = reader["Email"]?.ToString() ?? "",
                        Role = reader["Role"]?.ToString() ?? "",
                        Fullname = reader["Fullname"]?.ToString() ?? "",
                        Phone = reader["Phone"]?.ToString() ?? ""
                    });
                }
            }

            // Load players
            string qPlayers = "SELECT PlayerID, Name, Age, Position, Photo, ParentID FROM Players";
            using (SqlCommand cmd = new SqlCommand(qPlayers, conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Players.Add(new Player
                    {
                        Id = reader["PlayerID"]?.ToString() ?? "",
                        Name = reader["Name"]?.ToString() ?? "",
                        Age = reader["Age"] != DBNull.Value ? Convert.ToInt32(reader["Age"]) : 0,
                        Position = reader["Position"]?.ToString() ?? "",
                        Photo = reader["Photo"]?.ToString() ?? "",
                        ParentID = reader["ParentID"]?.ToString() ?? ""
                    });
                }
            }

            // Load payments with optional player name
            string qPayments = @"SELECT p.Date, p.Amount, p.Notes, p.PlayerId, pl.Name AS PlayerName, pl.ParentID as ParentID
                                         FROM Payments p
                                         LEFT JOIN Players pl ON p.PlayerId = pl.Id
                                         ORDER BY p.Date DESC";
            using (SqlCommand cmd = new SqlCommand(qPayments, conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Payments.Add(new Payment
                    {
                        Date = reader["Date"] != DBNull.Value ? Convert.ToDateTime(reader["Date"]) : DateTime.MinValue,
                        Amount = reader["Amount"] != DBNull.Value ? Convert.ToDecimal(reader["Amount"]) : 0m,
                        Notes = reader["Notes"]?.ToString() ?? "",
                        PlayerName = reader["PlayerName"]?.ToString() ?? "",
                        ParentID = reader["ParentID"]?.ToString() ?? ""
                    });
                }
            }
        }
    }

    public class UserAccount
    {
        public string Email { get; set; } = "";
        public string Role { get; set; } = "";
        public string Fullname { get; set; } = "";
        public string Phone { get; set; } = "";
    }
}
