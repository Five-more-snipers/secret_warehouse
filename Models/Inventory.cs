namespace secret_warehouse.Models;

public class Inventory
{
    public int Id { get; set; }
    
    // Relasi ke Master Item (Foreign Key)
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    
    // Jumlah fisik barang di gudang
    public int Quantity { get; set; }
}