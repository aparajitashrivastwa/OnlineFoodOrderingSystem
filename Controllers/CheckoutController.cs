
using Microsoft.AspNetCore.Mvc;

namespace OnlineFoodOrderingSystem.Controllers
{
    public class CheckoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
