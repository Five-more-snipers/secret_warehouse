using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using secret_warehouse.Data;
using secret_warehouse.Models;

namespace secret_warehouse.Controllers;

// Kelas DTO (Data Transfer Object) untuk mempermudah input JSON
public class TransactionRequest
{
    public int ItemId { get; set; }
    public string Type { get; set; } = string.Empty; // "IN" atau "OUT"
    public int Quantity { get; set; }
}

[Route("api/[controller]")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/Transactions
    // Endpoint untuk memproses barang masuk (IN) dan keluar (OUT)
    [HttpPost]
    public async Task<IActionResult> ProcessTransaction([FromBody] TransactionRequest request)
    {
        if (request.Quantity <= 0)
            return BadRequest("Quantity transaksi harus lebih dari 0.");

        // 1. Cek apakah barangnya ada di Master Item
        var item = await _context.Items.FindAsync(request.ItemId);
        if (item == null)
            return NotFound("Barang tidak ditemukan di Master Item.");

        // 2. Ambil konfigurasi gudang untuk mengecek kapasitas maksimal
        var config = await _context.WarehouseConfigs.FirstOrDefaultAsync();
        if (config == null)
            return StatusCode(500, "Konfigurasi gudang belum di-setup.");

        // 3. Cek stok barang ini di tabel Inventory (jika sudah ada sebelumnya)
        var inventory = await _context.Inventories.FirstOrDefaultAsync(i => i.ItemId == request.ItemId);

        // LOGIKA BARANG MASUK (IN)
        if (request.Type.ToUpper() == "IN")
        {
            // Hitung total poin terpakai saat ini dari seluruh barang di gudang
            var allInventory = await _context.Inventories.Include(i => i.Item).ToListAsync();
            int currentTotalPoints = allInventory.Sum(i => i.Quantity * i.Item.PointsPerUnit);

            // Hitung poin tambahan dari barang yang akan masuk
            int incomingPoints = request.Quantity * item.PointsPerUnit;

            // Validasi Over-Capacity
            if (currentTotalPoints + incomingPoints > config.MaxCapacityPoints)
            {
                int sisaPoin = config.MaxCapacityPoints - currentTotalPoints;
                return BadRequest($"Kapasitas Gudang Tidak Mencukupi. (Sisa Kapasitas: {sisaPoin} poin, Butuh: {incomingPoints} poin)");
            }

            // Jika aman, tambahkan ke stok
            if (inventory == null)
            {
                inventory = new Inventory { ItemId = request.ItemId, Quantity = request.Quantity };
                _context.Inventories.Add(inventory);
            }
            else
            {
                inventory.Quantity += request.Quantity;
            }
        }
        // LOGIKA BARANG KELUAR (OUT)
        else if (request.Type.ToUpper() == "OUT")
        {
            if (inventory == null || inventory.Quantity < request.Quantity)
            {
                return BadRequest("Stok di gudang tidak mencukupi untuk dikeluarkan.");
            }

            inventory.Quantity -= request.Quantity;
            
            // Bersihkan data jika stok barang menjadi 0
            if (inventory.Quantity == 0)
            {
                _context.Inventories.Remove(inventory);
            }
        }
        else
        {
            return BadRequest("Tipe transaksi tidak valid. Gunakan 'IN' atau 'OUT'.");
        }

        await _context.SaveChangesAsync();
        return Ok(new { 
            message = $"Transaksi {request.Type} berhasil diproses.", 
            currentQuantity = inventory?.Quantity ?? 0 
        });
    }

    // GET: api/Transactions/Inventory
    // Endpoint Laporan untuk melihat isi gudang saat ini (Halaman Warehouse)
    [HttpGet("Inventory")]
    public async Task<ActionResult> GetWarehouseInventory()
    {
        var data = await _context.Inventories
            .Include(i => i.Item)
            .Select(i => new {
                i.Item.Code,
                i.Item.Name,
                i.Item.PointsPerUnit,
                i.Quantity,
                TotalPoints = i.Quantity * i.Item.PointsPerUnit
            })
            .ToListAsync();
            
        return Ok(data);
    }
}