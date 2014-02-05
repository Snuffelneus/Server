using System;
using System.Collections.Generic;

namespace SnuffelneusDatabase.Models
{
    public partial class Datum
    {
        public int Id { get; set; }
        public int SensorTypeId { get; set; }
        public double Value { get; set; }
        public int ReadingId { get; set; }
        public virtual Reading Reading { get; set; }
        public virtual SensorType SensorType { get; set; }
    }
}
