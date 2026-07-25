import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Warehouse() {
  const [inventory, setInventory] = useState([]);
  
  // State untuk Fitur Search & Paging
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const API_URL = 'http://localhost:5265/api/Transactions/Inventory';

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(API_URL);
        setInventory(response.data);
      } catch (error) {
        console.error("Gagal mengambil data gudang:", error);
      }
    };
    fetchInventory();
  }, []);

  // Logika Filter (Search)
  const filteredInventory = inventory.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logika Paging
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const currentInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Inventory Gudang</h2>
      
      {/* Kontrol Search & Paging */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '20px' }}>
        <input 
          type="text" placeholder="🔍 Cari nama barang..." 
          value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          style={{ padding: '5px', width: '250px' }}
        />
        <div>
          Tampilkan: 
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{ marginLeft: '5px' }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>Kode Barang</th><th>Nama Barang</th><th>Poin per Unit</th><th>Qty</th><th>Total Poin</th>
          </tr>
        </thead>
        <tbody>
          {currentInventory.map((inv, index) => (
            <tr key={index}>
              <td><strong>{inv.code}</strong></td>
              <td>{inv.name}</td>
              <td>{inv.pointsPerUnit}</td>
              <td>{inv.quantity}</td>
              <td style={{ color: 'red', fontWeight: 'bold' }}>{inv.totalPoints}</td>
            </tr>
          ))}
          {currentInventory.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Barang tidak ditemukan.</td></tr>
          )}
        </tbody>
      </table>

      {/* Tombol Paging */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        <span> Halaman {currentPage} dari {totalPages || 1} </span>
        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}