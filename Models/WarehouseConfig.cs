namespace secret_warehouse.Models;

public class WarehouseConfig
{
    public int Id { get; set; }
    
    // Kapasitas maksimum dalam poin (default misal: 0 atau bisa diubah nanti di config)
    public int MaxCapacityPoints { get; set; } = 0; 
}