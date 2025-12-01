using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Data.SqlClient;

namespace Basketball_Academy_Management_System.Pages.Account
{
    public class LoginModel : PageModel
    {

        public string ErrorMessage = "";

        public string connectionString =
            "Data Source=NOVA;Initial Catalog=BasketballAcademyDB;Integrated Security=True;TrustServerCertificate=True";


        public class LoginInput
        {
            public string Email { get; set; } = "";
            public string Password { get; set; } = "";
        }

        public void OnGet()
        {
        }

        public IActionResult OnPost()
        {
            string email = Request.Form["Input.Email"];
            string password = Request.Form["Input.Password"];

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                ErrorMessage = "Please enter both email and password.";
                return Page();
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = "SELECT * FROM Users WHERE Email = @Email AND Password = @Password";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        cmd.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // User found
                                // Redirect to dashboard or save session
                                HttpContext.Session.SetString("UserEmail", email);
                                if(reader["Role"] != DBNull.Value)
                                {
                                    HttpContext.Session.SetString("UserRole", reader["Role"].ToString() ?? "");
                                    if(reader["Role"].ToString() == "Admin")
                                    {
                                        return RedirectToPage("/Admin");
                                    }
                                    if(reader["Role"].ToString() == "Coach")
                                    {
                                        return RedirectToPage("/CoachAttendance");
                                    }
                                    if(reader["Role"].ToString() == "Parent")
                                    {
                                        return RedirectToPage("/ParentPortal");
                                    }
                                }
                                return RedirectToPage("/Index");
                            }
                            else
                            {
                                ErrorMessage = "Invalid login credentials.";
                                return Page();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error: "+ ex.Message;
                return Page();
            }
        }
    }
}
