using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public interface IPwRepository<T> where T : class, IEntity
    {
        void Create(T entity);
        T Get(int id);
        void Update(T entity);
        void Remove(int id);
        IEnumerable<T> GetAll();
    }
}
