using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public interface IUserRepository: IPwRepository<User>
    {
        User Get(string email);
    }
}
