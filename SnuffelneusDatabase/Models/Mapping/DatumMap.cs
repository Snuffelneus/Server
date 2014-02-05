using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SnuffelneusDatabase.Models.Mapping
{
    public class DatumMap : EntityTypeConfiguration<Datum>
    {
        public DatumMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Data");
            this.Property(t => t.Id).HasColumnName("Id");
            this.Property(t => t.SensorTypeId).HasColumnName("SensorTypeId");
            this.Property(t => t.Value).HasColumnName("Value");
            this.Property(t => t.ReadingId).HasColumnName("ReadingId");

            // Relationships
            this.HasRequired(t => t.Reading)
                .WithMany(t => t.Data)
                .HasForeignKey(d => d.ReadingId);
            this.HasRequired(t => t.SensorType)
                .WithMany(t => t.Data)
                .HasForeignKey(d => d.SensorTypeId);

        }
    }
}
