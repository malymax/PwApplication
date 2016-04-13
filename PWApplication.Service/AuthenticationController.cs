using Microsoft.Practices.ServiceLocation;
using PWApplication.DataAccess;
using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace PWApplication.Service
{
    public class AuthData
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }

    [AllowAnonymous]
    public class AuthenticationController: ApiController
    {
        [HttpPost]
        public IHttpActionResult Post([FromBody]AuthData data)
        {
            var repository = ServiceLocator.Current.GetInstance<IUserRepository>();
            var savedUser = repository.Get(data.Login);
            if (savedUser == null)
                return Ok(new { success = false, message = "User code or password is incorrect" });

            var encryptionService = ServiceLocator.Current.GetInstance<IPasswordEncryptionService>();
            var encryptedPassword = encryptionService.Encrypt(data.Password, savedUser.Salt);
            if (encryptedPassword != savedUser.Password)
                return Ok(new { success = false, message = "User code or password is incorrect" });
            
            return Ok(new { success = true });
        }

        [HttpOptions]
        public void Options()
        {

        }
    }
}