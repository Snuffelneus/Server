using System;
using System.Collections.Generic;

namespace SnuffelneusDatabase.Models
{
    public partial class Reading
    {
        public Reading()
        {
            this.Data = new List<Datum>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public System.DateTime Created { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public virtual ICollection<Datum> Data { get; set; }
        public virtual User User { get; set; }
    }
}
