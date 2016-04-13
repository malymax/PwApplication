using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.Service
{
    public interface IPasswordEncryptionService
    {
        string Encrypt(string password, string salt);
        string GetSalt();
    }
}
