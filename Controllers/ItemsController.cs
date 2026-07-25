using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using secret_warehouse.Data;
using secret_warehouse.Models;

namespace secret_warehouse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Items (Menampilkan semua barang)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Item>>> GetItems()
    {
        return await _context.Items.ToListAsync();
    }

    // POST: api/Items (Menambah barang baru)
    [HttpPost]
    public async Task<ActionResult<Item>> PostItem(Item item)
    {
        // Logika Generate Kode Otomatis (A000 - Z999)
        var lastItem = await _context.Items
            .OrderByDescending(i => i.Id)
            .FirstOrDefaultAsync();

        string newCode = "A000";

        if (lastItem != null && !string.IsNullOrEmpty(lastItem.Code))
        {
            char letter = lastItem.Code[0]; // Ambil karakter pertama (Huruf)
            int number = int.Parse(lastItem.Code.Substring(1)); // Ambil tiga angka terakhir

            number++;
            
            // Jika angka melebihi 999, hurufnya naik (A -> B) dan angka kembali 0
            if (number > 999)
            {
                letter++;
                number = 0;
            }
            
            // Format ulang menjadi 1 Huruf + 3 Angka (contoh: A016)
            newCode = $"{letter}{number:D3}";
        }

        // Paksa isi properti yang di-generate sistem
        item.Code = newCode;
        item.Status = "ACTIVE"; 

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
    }
    // PUT: api/Items/5 (Mengedit data barang)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutItem(int id, Item updatedItem)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
            return NotFound("Barang tidak ditemukan.");

        // Kita hanya mengizinkan update Nama, Poin, dan Deskripsi
        // Kode (A000) dan Status tidak boleh diubah
        item.Name = updatedItem.Name;
        item.PointsPerUnit = updatedItem.PointsPerUnit;
        item.Description = updatedItem.Description;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Barang berhasil diupdate!", data = item });
    }
}
