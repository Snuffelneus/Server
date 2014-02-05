using SnuffelneusAPI.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace SnuffelneusTest
{
    class Program
    {
        static string secret;
        static HttpClient client;

        static void Main(string[] args)
        {
            secret = "ABCDEFGHIJKLMOP";

            client = new HttpClient();

            if (Debugger.IsAttached)
            {
                client.BaseAddress = new Uri("http://localhost:6199/");
            }
            else
            {
                client.BaseAddress = new Uri("http://snuffelneus.azurewebsites.net/");
            }

            Timer tmr = new Timer(TimeSpan.FromSeconds(10).TotalMilliseconds);
            tmr.Elapsed += tmr_Elapsed;
            tmr.Enabled = true;

            Console.Read();
        }

        static void tmr_Elapsed(object sender, ElapsedEventArgs e)
        {
            List<DataModel> list = new List<DataModel>();

            list.Add(new DataModel()
            {
                Sensor = "temp",
                Value = 44.44
            });

            list.Add(new DataModel()
            {
                Sensor = "hum",
                Value = 55.55
            });

            list.Add(new DataModel()
            {
                Sensor = "dust",
                Value = 66.66
            });

            ReadingModel reading = new ReadingModel()
            {
                Latitude = 10,
                Longitude = 10,
                Measured = DateTime.UtcNow,
                Secret = secret,
                Values = list
            };

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(reading);
            HttpContent content = new StringContent(json);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            Console.WriteLine(json);

            HttpResponseMessage result = client.PostAsync("api/Values/", content).Result;

            Console.WriteLine(result);
        }

        static Location GetRandomLocation()
        {
            Location ret = new Location();

            // Rotterdam:
            // Lat: 51.92421599999999
            // Lon: 4.481775999999968




            return ret;
        }

        private class Location
        {
            public double Longitude { get; set; }
            public double Latitude { get; set; }
        }
    }
}
