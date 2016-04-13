using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public class TransactionRepository : PwRepository<Transaction>, ITransactionRepository
    {
        public new void Create(Transaction entity)
        {
            using (var context = new PwContext())
            {
                context.Set<User>().Attach(entity.CorrespondentUser);
                context.Set<User>().Attach(entity.OwnerUser);
                context.Set<Transaction>().Add(entity);
                context.SaveChanges();
            }
        }

        public IEnumerable<Transaction> GetByUser(int userId)
        {
            using (var context = new PwContext())
            {
                var result = context.Set<Transaction>()
                                .Include("OwnerUser")
                                .Include("CorrespondentUser")
                                .Where(t => t.OwnerUser.ID == userId)
                                .ToList();
                return result;
            }
        }
    }
}
