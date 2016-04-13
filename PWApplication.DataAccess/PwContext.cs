using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Annotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public class PwContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasRequired(c => c.OwnerUser)
                .WithMany()
                .WillCascadeOnDelete(false);
            
            modelBuilder.Entity<Transaction>()
                .HasRequired(s => s.CorrespondentUser)
                .WithMany()
                .WillCascadeOnDelete(false);
        } 
    }
}
