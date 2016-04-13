using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(PWApplication.Service.Startup))]

namespace PWApplication.Service
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}