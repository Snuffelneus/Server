using SnuffelneusAPI.Models;
using SnuffelneusDatabase.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SnuffelneusAPI.Controllers
{
    public class ValuesController : ApiController
    {
        private snuffelneusdatabaseContext db = new snuffelneusdatabaseContext();

        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public IEnumerable<GetReadingModel> Get(string id)
        {
            User user = this.db.Users.FirstOrDefault(u => u.Secret == id);
            List<GetReadingModel> readingModel = new List<GetReadingModel>();
            if (user == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }
            else
            {
                List<Reading> readings = this.db.Readings.Where(r => r.UserId.Equals(user.Id)).ToList();

                foreach (Reading r in readings)
                {
                    GetReadingModel model = new GetReadingModel();
                    model.Longitude = r.Longitude;
                    model.Latitude = r.Latitude;
                    model.Measured = r.Created;

                    foreach(Datum d in r.Data)
                    {
                        if (d.SensorType.Name.Equals("temp"))
                        {
                            model.TemperatureValue = d.Value.ToString();
                        }
                        else if (d.SensorType.Name.Equals("hum"))
                        {
                            model.HumidityValue = d.Value.ToString();
                        }
                        else if (d.SensorType.Name.Equals("dust"))
                        {
                            model.NO2Value = d.Value.ToString();
                        }
                    }
                    readingModel.Add(model);
                }

            }

            return readingModel;
        }

        // POST api/values
        public HttpResponseMessage Post([FromBody]ReadingModel value)
        {
            User user = this.db.Users.FirstOrDefault(u => u.Secret == value.Secret);

            if (user == null)
            {
                user = new User()
                {
                    Secret = value.Secret
                };

                this.db.Users.Add(user);
                this.db.SaveChanges();
            }

            List<Datum> data = new List<Datum>();

            Reading reading = new Reading()
            {
                UserId = user.Id,
                Latitude = value.Latitude,
                Longitude = value.Longitude,
                Created = value.Measured,
                Data = data
            };

            foreach (var item in value.Values)
            {
                SensorType type = this.db.SensorTypes.FirstOrDefault(t => t.Name == item.Sensor);

                if (type != null)
                {
                    data.Add(new Datum()
                    {
                        Reading = reading,
                        Value = item.Value,
                        SensorTypeId = type.Id
                    });
                }
            }

            this.db.Readings.Add(reading);
            this.db.SaveChanges();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private new void Dispose()
        {
            this.db.Dispose();
            base.Dispose();
        }
    }
}