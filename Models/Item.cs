namespace secret_warehouse.Models;

public class Item
{
    public int Id { get; set; }
    
    // Format Kode: A000 - Z999 (Generated via Service/API)
    public string Code { get; set; } = string.Empty; 
    public string Name { get; set; } = string.Empty;
    public int PointsPerUnit { get; set; }
    
    // Status: ACTIVE / INACTIVE
    public string Status { get; set; } = "ACTIVE"; 
    public string Description { get; set; } = string.Empty;
}