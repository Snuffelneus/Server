using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SnuffelneusAPI.Models
{
    public class GetReadingModel
    {
        public string TemperatureValue { get; set; }

        public string NO2Value { get; set; }

        public string HumidityValue { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime Measured { get; set; }
    }
}