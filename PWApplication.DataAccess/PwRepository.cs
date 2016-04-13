using PWApplication.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PWApplication.DataAccess
{
    public class PwRepository<T> : IPwRepository<T> where T : class, IEntity
    {
        public void Create(T entity)
        {
            using (var context = new PwContext())
            {
                context.Set<T>().Add(entity);
                context.SaveChanges();
            }
        }

        public T Get(int id)
        {
            using (var context = new PwContext())
            {
                return context.Set<T>().FirstOrDefault<T>(e => e.ID == id);
            }
        }

        public void Update(T entity)
        {
            using (var context = new PwContext())
            {
                context.Entry<T>(entity).State = EntityState.Modified;
                context.SaveChanges();
            }
        }

        public void Remove(int id)
        {
            using (var context = new PwContext())
            {
                var entity = context.Set<T>().FirstOrDefault(e => e.ID == id);
                if (entity != null)
                {
                    context.Set<T>().Remove(entity);
                    context.SaveChanges();
                }
            }
        }


        public IEnumerable<T> GetAll()
        {
            using (var context = new PwContext())
            {
                var result = context.Set<T>().ToList();
                return result;
            }
        }
    }
}
