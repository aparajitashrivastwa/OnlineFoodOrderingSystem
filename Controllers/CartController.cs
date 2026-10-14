
using Microsoft.AspNetCore.Mvc;

namespace OnlineFoodOrderingSystem.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

