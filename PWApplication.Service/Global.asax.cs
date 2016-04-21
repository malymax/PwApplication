using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using PWApplication.DataAccess;
using PWApplication.Model;
using Microsoft.Practices.Unity;
using Microsoft.Practices.ServiceLocation;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;

namespace PWApplication.Service
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            var unity = new UnityContainer();
            unity.RegisterType(typeof(IUserRepository), typeof(UserRepository));
            unity.RegisterType(typeof(ITransactionRepository), typeof(TransactionRepository));
            unity.RegisterType<IPasswordEncryptionService, PasswordEncryptionService>();
            var locator = new UnityServiceLocator(unity);
            ServiceLocator.SetLocatorProvider(() => locator);

            WebApiConfig.Register(GlobalConfiguration.Configuration);

            GlobalConfiguration.Configuration.EnsureInitialized();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}