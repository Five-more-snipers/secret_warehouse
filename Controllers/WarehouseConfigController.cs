using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using secret_warehouse.Data;
using secret_warehouse.Models;

namespace secret_warehouse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WarehouseConfigController : ControllerBase
{
    private readonly AppDbContext _context;

    public WarehouseConfigController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/WarehouseConfig
    // Mengambil data kapasitas gudang saat ini
    [HttpGet]
    public async Task<ActionResult<WarehouseConfig>> GetConfig()
    {
        // Karena config hanya 1 baris (singleton), kita ambil yang pertama
        var config = await _context.WarehouseConfigs.FirstOrDefaultAsync();
        
        if (config == null)
        {
            return NotFound("Konfigurasi gudang tidak ditemukan.");
        }

        return config;
    }

    // PUT: api/WarehouseConfig
    // Mengubah kapasitas maksimal gudang
    [HttpPut]
    public async Task<IActionResult> UpdateCapacity([FromBody] int newCapacityPoints)
    {
        var config = await _context.WarehouseConfigs.FirstOrDefaultAsync();
        
        if (config == null)
        {
            return NotFound("Konfigurasi gudang tidak ditemukan.");
        }
        //Cek Validasi
        var allInventory = await _context.Inventories.Include(i => i.Item).ToListAsync();
        int currentTotalPoints = allInventory.Sum(i => i.Quantity * i.Item.PointsPerUnit);

        if (newCapacityPoints < currentTotalPoints)
        {
            return BadRequest($"Tidak bisa menurunkan kapasitas di bawah total poin barang yang ada ({currentTotalPoints} poin). Keluarkan barang terlebih dahulu.");
        }

        config.MaxCapacityPoints = newCapacityPoints;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kapasitas gudang berhasil diperbarui!", data = config });
    }
}