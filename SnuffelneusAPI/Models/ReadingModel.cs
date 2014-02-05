using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SnuffelneusAPI.Models
{
    public class ReadingModel
    {
        public string Secret { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime Measured { get; set; }

        public IEnumerable<DataModel> Values { get; set; }
    }
}