import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Config() {
  const [capacity, setCapacity] = useState(0);
  const [newCapacity, setNewCapacity] = useState('');

  // Pastikan port sesuai dengan backend .NET Anda (contoh: 5265)
  const API_URL = 'http://localhost:5265/api/WarehouseConfig';

  const fetchConfig = async () => {
    try {
      const response = await axios.get(API_URL);
      setCapacity(response.data.maxCapacityPoints);
      setNewCapacity(response.data.maxCapacityPoints);
    } catch (error) {
      console.error("Gagal mengambil config:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mengirim angka saja sesuai desain PUT API kita
      await axios.put(API_URL, parseInt(newCapacity), {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Kapasitas gudang berhasil diperbarui!');
      fetchConfig();
    } catch (error) {
      // Menampilkan error validasi dari backend (misal: gagal turun kapasitas)
      alert(error.response?.data || 'Terjadi kesalahan saat mengubah kapasitas.');
    }
  };

  return (
    <div>
      <h2>Pengaturan Kapasitas Gudang</h2>
      <div style={{ padding: '20px', border: '1px solid #ccc', display: 'inline-block' }}>
        <p>Kapasitas Maksimal Saat Ini: <strong style={{ fontSize: '20px' }}>{capacity} Poin</strong></p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input 
            type="number" 
            value={newCapacity} 
            onChange={(e) => setNewCapacity(e.target.value)} 
            required 
            min="0"
          />
          <button type="submit">Update Kapasitas</button>
        </form>
      </div>
    </div>
  );
}