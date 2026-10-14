
using Microsoft.AspNetCore.Mvc;

namespace OnlineFoodOrderingSystem.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Foods()
        {
            return View();
        }

        public IActionResult Orders()
        {
            return View();
        }

        public IActionResult Reports()
        {
            return View();
        }
    }
}

