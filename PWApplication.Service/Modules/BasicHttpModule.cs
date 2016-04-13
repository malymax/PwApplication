using Microsoft.Practices.ServiceLocation;
using PWApplication.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;

namespace PWApplication.Service
{
    public class BasicAuthHttpModule : IHttpModule
    {
        private const string Realm = "PwApplicationWebAPI";

        public void Init(HttpApplication context)
        {
            context.AuthenticateRequest += OnApplicationAuthenticateRequest;
            context.EndRequest += OnApplicationEndRequest;
        }

        private static void SetPrincipal(IPrincipal principal)
        {
            Thread.CurrentPrincipal = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }

        private static bool AuthenticateUser(string credentials)
        {
            var encoding = Encoding.GetEncoding("iso-8859-1");
            credentials = encoding.GetString(Convert.FromBase64String(credentials));

            var credentialsArray = credentials.Split(':');
            var login = credentialsArray[0];
            var password = credentialsArray[1];

            var userRepository = ServiceLocator.Current.GetInstance<IUserRepository>();
            var user = userRepository.Get(login);
            if (user == null)
                return false;

            var encryptionService = ServiceLocator.Current.GetInstance<IPasswordEncryptionService>();
            var encryptedPassword = encryptionService.Encrypt(password, user.Salt);
            if (encryptedPassword != user.Password)
                return false;

            var identity = new GenericIdentity(login);
            SetPrincipal(new GenericPrincipal(identity, null));

            return true;
        }

        private static void OnApplicationAuthenticateRequest(object sender, EventArgs e)
        {
            var authHeader = HttpContext.Current.Request.Headers["Authorization"];
            if (authHeader != null)
            {
                var authHeaderVal = AuthenticationHeaderValue.Parse(authHeader);

                if (authHeaderVal.Scheme.Equals("basic", StringComparison.OrdinalIgnoreCase) && authHeaderVal.Parameter != null)
                {
                    if (!AuthenticateUser(authHeaderVal.Parameter))
                        HttpContext.Current.Response.StatusCode = 401;
                }
            }
        }

        private static void OnApplicationEndRequest(object sender, EventArgs e)
        {
            var response = HttpContext.Current.Response;
            if (response.StatusCode == 401)
            {
                response.Headers.Add("WWW-Authenticate", string.Format("Basic realm=\"{0}\"", Realm));
            }
        }

        public void Dispose()
        {
        }
    }
}