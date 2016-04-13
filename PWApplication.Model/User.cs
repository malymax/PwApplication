using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.Model
{
    public class User: IEntity
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        [Index("EmailUniqueIndex", IsUnique = true)]
        [Required]
        [MaxLength(60)]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Salt { get; set; }
        [Required]
        public decimal Balance { get; set; }
    }
}
