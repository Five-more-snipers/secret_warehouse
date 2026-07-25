import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [capacity, setCapacity] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ambil data kapasitas maksimal
        const configRes = await axios.get('http://localhost:5265/api/WarehouseConfig');
        setCapacity(configRes.data.maxCapacityPoints);

        // Ambil data inventory untuk menghitung poin terpakai
        const invRes = await axios.get('http://localhost:5265/api/Transactions/Inventory');
        
        // Hitung total poin dari seluruh barang di gudang
        const total = invRes.data.reduce((sum, item) => sum + item.totalPoints, 0);
        setUsedPoints(total);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Hitung persentase untuk Progress Bar
  const percentage = capacity > 0 ? ((usedPoints / capacity) * 100).toFixed(1) : 0;
  
  // Tentukan warna progress bar (Merah jika hampir penuh, hijau jika aman)
  const barColor = percentage > 80 ? 'red' : percentage > 50 ? 'orange' : 'green';

  return (
    <div>
      <h2>Dashboard Secret Warehouse</h2>
      <p>Laporan kapasitas dan penggunaan poin gudang saat ini.</p>

      <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', borderRadius: '8px' }}>
        <h3>Status Kapasitas Gudang</h3>
        <p style={{ fontSize: '18px' }}>
          Terpakai: <strong>{usedPoints}</strong> / {capacity} Poin
        </p>

        {/* Visualisasi Progress Bar */}
        <div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '30px', borderRadius: '5px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: barColor, 
              height: '100%', 
              transition: 'width 0.5s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {percentage}%
          </div>
        </div>
      </div>
    </div>
  );
}