using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Basketball_Academy_Management_System.Pages.Shared;

namespace Basketball_Academy_Management_System.Pages
{
    public class MessagesModel : ProtectedPageModel
    {
        private readonly string connectionString =
            "Data Source=NOVA;Initial Catalog=BasketballAcademyDB;Integrated Security=True;TrustServerCertificate=True";

        public List<Message> ReceivedMessages { get; set; } = new List<Message>();
        public string StatusMessage { get; set; } = "";

        public IActionResult OnGet()
        {
            var email = CurrentUserEmail;
            if (string.IsNullOrEmpty(email))
            {
                return RedirectToPage("/Account/Login");
            }

            try
            {
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Resolve current user's numeric id
                    int currentUserId = 0;
                    using (var ucmd = new SqlCommand("SELECT Id FROM Users WHERE Email = @Email", conn))
                    {
                        ucmd.Parameters.AddWithValue("@Email", email);
                        var idObj = ucmd.ExecuteScalar();
                        if (idObj == null || idObj == DBNull.Value)
                        {
                            // user not found
                            return RedirectToPage("/Account/Login");
                        }

                        currentUserId = Convert.ToInt32(idObj);
                    }

                    string q = @"SELECT m.MessageID, m.SenderID, m.UserID, m.Subject, m.Content, m.SentDate,
                                    su.Email AS SenderEmail, ISNULL(su.Role, '') AS SenderRole
                                 FROM Messages m
                                 LEFT JOIN Users su ON m.SenderID = su.Id
                                 WHERE m.UserID = @UserID
                                 ORDER BY m.SentDate DESC";

                    using (var cmd = new SqlCommand(q, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserID", currentUserId);
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ReceivedMessages.Add(new Message
                                {
                                    MessageID = reader["MessageID"] != DBNull.Value ? Convert.ToInt32(reader["MessageID"]) : 0,
                                    SenderID = reader["SenderID"] != DBNull.Value ? Convert.ToInt32(reader["SenderID"]) : 0,
                                    UserID = reader["UserID"] != DBNull.Value ? Convert.ToInt32(reader["UserID"]) : 0,
                                    Subject = reader["Subject"]?.ToString() ?? "",
                                    Content = reader["Content"]?.ToString() ?? "",
                                    SentDate = reader["SentDate"] != DBNull.Value ? Convert.ToDateTime(reader["SentDate"]) : DateTime.MinValue,
                                    SenderEmail = reader["SenderEmail"]?.ToString() ?? "",
                                    SenderRole = reader["SenderRole"]?.ToString() ?? ""
                                });
                            }
                        }
                    }
                }

                return Page();
            }
            catch (Exception ex)
            {
                StatusMessage = "Error loading messages: " + ex.Message;
                return Page();
            }
        }

        public IActionResult OnPost()
        {
            var senderEmail = CurrentUserEmail;
            if (string.IsNullOrEmpty(senderEmail)) return RedirectToPage("/Account/Login");

            var recipientType = Request.Form["recipientType"].ToString();
            var subject = Request.Form["subject"].ToString();
            var content = Request.Form["message"].ToString();

            if (string.IsNullOrEmpty(recipientType) || string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(content))
            {
                StatusMessage = "Please provide recipient type, subject and message.";
                return RedirectToPage();
            }

            try
            {
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // get current user's numeric id
                    int currentUserId = 0;
                    using (var ucmd = new SqlCommand("SELECT Id FROM Users WHERE Email = @Email", conn))
                    {
                        ucmd.Parameters.AddWithValue("@Email", senderEmail);
                        var idObj = ucmd.ExecuteScalar();
                        if (idObj == null || idObj == DBNull.Value)
                        {
                            StatusMessage = "Sender account not found.";
                            return RedirectToPage();
                        }

                        currentUserId = Convert.ToInt32(idObj);
                    }

                    // resolve recipient user ids by role
                    string qRecipients = "SELECT Id FROM Users WHERE Role = @Role";
                    var recipientIds = new List<int>();

                    using (var cmd = new SqlCommand(qRecipients, conn))
                    {
                        cmd.Parameters.AddWithValue("@Role", recipientType);
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                if (reader[0] != DBNull.Value)
                                {
                                    recipientIds.Add(Convert.ToInt32(reader[0]));
                                }
                            }
                        }
                    }

                    if (recipientIds.Count == 0)
                    {
                        StatusMessage = "No recipients found for role: " + recipientType;
                        return RedirectToPage();
                    }

                    string ins = "INSERT INTO Messages (SenderID, UserID, Subject, Content, SentDate) VALUES (@SenderID, @UserID, @Subject, @Content, @SentDate)";

                    using (var tran = conn.BeginTransaction())
                    using (var cmd = new SqlCommand(ins, conn, tran))
                    {
                        cmd.Parameters.Add(new SqlParameter("@SenderID", System.Data.SqlDbType.Int));
                        cmd.Parameters.Add(new SqlParameter("@UserID", System.Data.SqlDbType.Int));
                        cmd.Parameters.Add(new SqlParameter("@Subject", System.Data.SqlDbType.NVarChar));
                        cmd.Parameters.Add(new SqlParameter("@Content", System.Data.SqlDbType.NVarChar));
                        cmd.Parameters.Add(new SqlParameter("@SentDate", System.Data.SqlDbType.DateTime));

                        foreach (var rid in recipientIds)
                        {
                            cmd.Parameters["@SenderID"].Value = currentUserId;
                            cmd.Parameters["@UserID"].Value = rid;
                            cmd.Parameters["@Subject"].Value = subject;
                            cmd.Parameters["@Content"].Value = content;
                            cmd.Parameters["@SentDate"].Value = DateTime.Now;
                            cmd.ExecuteNonQuery();
                        }

                        tran.Commit();
                    }
                }

                return RedirectToPage();
            }
            catch (Exception ex)
            {
                StatusMessage = "Error sending message: " + ex.Message;
                return RedirectToPage();
            }
        }
    }

    public class Message
    {
        public int MessageID { get; set; }
        public int SenderID { get; set; }
        public int UserID { get; set; }
        public string Subject { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime SentDate { get; set; }

        // helper fields for display
        public string SenderEmail { get; set; } = "";
        public string SenderRole { get; set; } = "";
    }
}
