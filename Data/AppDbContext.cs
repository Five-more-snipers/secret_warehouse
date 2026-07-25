using Microsoft.EntityFrameworkCore;
using secret_warehouse.Models;

namespace secret_warehouse.Data; // <-- PASTIKAN HANYA ADA SATU BARIS INI DI SELURUH FILE

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<WarehouseConfig> WarehouseConfigs { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Inventory> Inventories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<WarehouseConfig>().HasData(
            new WarehouseConfig { Id = 1, MaxCapacityPoints = 0 }
        );
    }
}