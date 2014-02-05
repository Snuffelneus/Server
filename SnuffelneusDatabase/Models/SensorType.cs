using System;
using System.Collections.Generic;

namespace SnuffelneusDatabase.Models
{
    public partial class SensorType
    {
        public SensorType()
        {
            this.Data = new List<Datum>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Datum> Data { get; set; }
    }
}
