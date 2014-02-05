using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using SnuffelneusDatabase.Models.Mapping;

namespace SnuffelneusDatabase.Models
{
    public partial class snuffelneusdatabaseContext : DbContext
    {
        static snuffelneusdatabaseContext()
        {
            Database.SetInitializer<snuffelneusdatabaseContext>(null);
        }

        public snuffelneusdatabaseContext()
            : base("Name=snuffelneusdatabaseContext")
        {
        }

        public DbSet<Datum> Data { get; set; }
        public DbSet<Reading> Readings { get; set; }
        public DbSet<SensorType> SensorTypes { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new DatumMap());
            modelBuilder.Configurations.Add(new ReadingMap());
            modelBuilder.Configurations.Add(new SensorTypeMap());
            modelBuilder.Configurations.Add(new UserMap());
        }
    }
}
