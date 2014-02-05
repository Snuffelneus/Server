using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SnuffelneusDatabase.Models.Mapping
{
    public class ReadingMap : EntityTypeConfiguration<Reading>
    {
        public ReadingMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Reading");
            this.Property(t => t.Id).HasColumnName("Id");
            this.Property(t => t.UserId).HasColumnName("UserId");
            this.Property(t => t.Created).HasColumnName("Created");
            this.Property(t => t.Latitude).HasColumnName("Latitude");
            this.Property(t => t.Longitude).HasColumnName("Longitude");

            // Relationships
            this.HasRequired(t => t.User)
                .WithMany(t => t.Readings)
                .HasForeignKey(d => d.UserId);

        }
    }
}
