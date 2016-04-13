using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PWApplication.Service;

namespace PWApplication.Service.Test
{
    [TestClass]
    public class PasswordEncryptionServiceTest
    {
        [TestMethod]
        public void EncryptTest()
        {
            var service = new PasswordEncryptionService();

            var password = "abc";

            var salt = service.GetSalt();

            var encrypted = service.Encrypt(password, salt);
            var newEncrypted = service.Encrypt("abc", salt);

            Assert.AreEqual(encrypted, encrypted);

        }
    }
}
