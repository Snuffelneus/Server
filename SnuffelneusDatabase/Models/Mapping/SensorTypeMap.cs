using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SnuffelneusDatabase.Models.Mapping
{
    public class SensorTypeMap : EntityTypeConfiguration<SensorType>
    {
        public SensorTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(24);

            // Table & Column Mappings
            this.ToTable("SensorType");
            this.Property(t => t.Id).HasColumnName("Id");
            this.Property(t => t.Name).HasColumnName("Name");
        }
    }
}
