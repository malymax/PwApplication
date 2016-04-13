using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public class UserRepository: PwRepository<User>, IUserRepository
    {
        public User Get(string email)
        {
            using (var context = new PwContext())
            {
                return context.Set<User>().FirstOrDefault(e => e.Email == email);
            };
        }
    }
}
