using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.Model
{
    public class Transaction: IEntity
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public virtual User OwnerUser { get; set; }
        [Required]
        public virtual User CorrespondentUser { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Amount { get; set; }
        public decimal ResultingBalance { get; set; }
    }
}
