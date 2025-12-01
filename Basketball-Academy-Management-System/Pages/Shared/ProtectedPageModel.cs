using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Basketball_Academy_Management_System.Pages.Shared
{
    public class ProtectedPageModel : PageModel
    {
        public override void OnPageHandlerExecuting(PageHandlerExecutingContext context)
        {
            if (string.IsNullOrEmpty(context.HttpContext.Session.GetString("UserEmail")))
            {
                context.Result = new RedirectToPageResult("/Account/Login");
            }

            base.OnPageHandlerExecuting(context);
        }

        public string CurrentUserEmail => HttpContext.Session.GetString("UserEmail") ?? "";
    }
}
