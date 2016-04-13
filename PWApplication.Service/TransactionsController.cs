using Microsoft.AspNet.SignalR;
using Microsoft.Practices.ServiceLocation;
using PWApplication.Contracts;
using PWApplication.DataAccess;
using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace PWApplication.Service
{
    [System.Web.Http.Authorize]
    public class TransactionsController : ApiController
    {
        private ITransactionRepository _repository;
        private IUserRepository _userRepository;

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);

            _repository = ServiceLocator.Current.GetInstance<ITransactionRepository>();
            _userRepository = ServiceLocator.Current.GetInstance<IUserRepository>(); 
        }

        public IEnumerable<TransactionInfo> Get()
        {
            return _repository
                    .GetAll().Select(t => ToInfo(t));
        }

        public IEnumerable<TransactionInfo> Get(string email)
        {
            var user = _userRepository.Get(email);
            var transactionInfos = _repository
                                    .GetByUser(user.ID)
                                    .Select(t => ToInfo(t));

            return transactionInfos;
        }

        public void Post([FromBody]TransactionInfo value)
        {
            var transaction = FromInfo(value);
            transaction.DateTime = DateTime.Now;
            transaction.ResultingBalance = transaction.CorrespondentUser.Balance - transaction.Amount;

            _repository.Create(transaction);
            var correspondentUser = transaction.CorrespondentUser;
            correspondentUser.Balance += transaction.Amount;

            _userRepository.Update(correspondentUser);
            UpdateWithHub(correspondentUser);
            
            var user = transaction.OwnerUser;
            user.Balance -= transaction.Amount;
            _userRepository.Update(user);
            UpdateWithHub(user);
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

        private TransactionInfo ToInfo(Transaction t)
        {
            return new TransactionInfo
            {
                ID = t.ID,
                Amount = t.Amount,
                CorrespondentUser = ToUserInfo(t.CorrespondentUser),
                OwnerUser = ToUserInfo(t.OwnerUser),
                DateTime = t.DateTime,
                ResultingBalance = t.ResultingBalance
            };
        }


        private Transaction FromInfo(TransactionInfo t)
        {
            return new Transaction
            {
                Amount = t.Amount,
                CorrespondentUser = _userRepository.Get(t.CorrespondentUser.ID),
                OwnerUser = _userRepository.Get(t.OwnerUser.ID),
                DateTime = t.DateTime,
                ResultingBalance = t.ResultingBalance
            };
        }

        private UserInfo ToUserInfo(User u){
            return new UserInfo{
                ID = u.ID,
                Balance = u.Balance,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            };
        }

        private void UpdateWithHub(User user)
        {
            var hub = GlobalHost.ConnectionManager.GetHubContext<SubscribtionHub>();
            if (hub != null) { 
                var subscribed = hub.Clients.Group(user.ID.ToString());
                subscribed.updateItem(user);
            }
            
        }
    }
}