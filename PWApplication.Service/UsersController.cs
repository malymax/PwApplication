using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PWApplication.Model;
using PWApplication.DataAccess;
using System.Web.Http.Controllers;
using Microsoft.Practices.ServiceLocation;
using System.Web;
using System.Security.Principal;
using System.Threading;
using PWApplication.Contracts;

namespace PWApplication.Service
{
    [Authorize]
    public class UsersController : ApiController
    {
        private IUserRepository _repository;
        private IPasswordEncryptionService _encryptionService;
        
        protected override void Initialize(HttpControllerContext controllerContext)
        {
 	        base.Initialize(controllerContext);

            _repository = ServiceLocator.Current.GetInstance<IUserRepository>();
            _encryptionService = ServiceLocator.Current.GetInstance<IPasswordEncryptionService>();
        }

        public IEnumerable<UserInfo> Get()
        {
            return _repository
                    .GetAll()
                    .Select(u => ToInfo(u));
        }

        public UserInfo Get(int id)
        {
            var user = _repository.Get(id);
            if (user == null)
                return null;
            return ToInfo(user);
        }

        [AllowAnonymous]
        public UserInfo Get(string email)
        {
            var user = _repository.Get(email);
            if (user == null)
                return null;
            return ToInfo(user);
        }

        [HttpPost]
        [AllowAnonymous]
        public void Post([FromBody]User user)
        {
            user.Salt = _encryptionService.GetSalt();
            user.Password = _encryptionService.Encrypt(user.Password, user.Salt);
            user.Balance = 500;

            _repository.Create(user);
        }

        [HttpPut]
        public void Put(int id, [FromBody]User value)
        {
            var user = _repository.Get(value.Email);

            user.Balance = value.Balance;

            _repository.Update(user);
        }

        public void Delete(int id)
        {
            _repository.Remove(id);
        }

        [HttpOptions]
        [AllowAnonymous]
        public void Options()
        {

        }
        
        private UserInfo ToInfo(User u)
        {
            return new UserInfo
            {
                ID = u.ID,
                Balance = u.Balance,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            };
        }
    }
}