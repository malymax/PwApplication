using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public interface ITransactionRepository: IPwRepository<Transaction>
    {
        IEnumerable<Transaction> GetByUser(int userId);
    }
}
