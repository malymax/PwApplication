using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.Contracts
{
    public class TransactionInfo
    {
        public int ID { get; set; }
        public UserInfo OwnerUser { get; set; }
        public decimal Amount { get; set; }
        public UserInfo CorrespondentUser { get; set; }
        public DateTime DateTime { get; set; }
        public decimal ResultingBalance { get; set; }
    }
}
