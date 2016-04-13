using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;

namespace PWApplication.Service
{
    public class PasswordEncryptionService: IPasswordEncryptionService
    {        
        public string Encrypt(string password, string salt)
        {
            var saltedPassword = string.Concat(password, salt);
            var saltedPasswordInBytes = Encoding.UTF8.GetBytes(saltedPassword);

            using(var provider = SHA256.Create())
            {
                var hash = provider.ComputeHash(saltedPasswordInBytes);
                return Convert.ToBase64String(hash);
            }
        }

        public string GetSalt()
        {
            var buffer = new byte[10];
            using (var provider = new RNGCryptoServiceProvider())
            {
                provider.GetBytes(buffer);
                return Convert.ToBase64String(buffer);
            }
        }
    }
}