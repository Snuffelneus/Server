using System;
using System.Collections.Generic;

namespace SnuffelneusDatabase.Models
{
    public partial class User
    {
        public User()
        {
            this.Readings = new List<Reading>();
        }

        public int Id { get; set; }
        public string Secret { get; set; }
        public virtual ICollection<Reading> Readings { get; set; }
    }
}
