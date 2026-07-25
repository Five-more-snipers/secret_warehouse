using Microsoft.EntityFrameworkCore;
using secret_warehouse.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// --- 1. TAMBAHKAN KONFIGURASI CORS DI SINI ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFE", policy =>
    {
        // Sesuaikan URL ini dengan localhost Vite Anda (biasanya port 5173)
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// ---------------------------------------------

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- 2. AKTIFKAN CORS SEBELUM MapControllers ---
app.UseCors("AllowReactFE"); 
// -----------------------------------------------

app.MapControllers(); 

app.Run();