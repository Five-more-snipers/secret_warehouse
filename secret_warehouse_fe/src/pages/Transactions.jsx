import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    type: 'IN',
    quantity: 1
  });

  const API_URL_ITEMS = 'http://localhost:5265/api/Items';
  const API_URL_TRANSACTIONS = 'http://localhost:5265/api/Transactions';

  // Ambil data Master Item untuk mengisi dropdown
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL_ITEMS);
        setItems(response.data);
      } catch (error) {
        console.error("Gagal mengambil data items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemId) {
      alert("Silakan pilih barang terlebih dahulu!");
      return;
    }

    try {
      const payload = {
        itemId: parseInt(formData.itemId),
        type: formData.type,
        quantity: parseInt(formData.quantity)
      };

      const response = await axios.post(API_URL_TRANSACTIONS, payload);
      alert(response.data.message || "Transaksi Berhasil!");
      
      // Reset jumlah setelah sukses, biarkan item dan tipe tetap
      setFormData({ ...formData, quantity: 1 }); 
    } catch (error) {
      // Menampilkan pesan error dari backend (misal: Over-capacity atau stok tidak cukup)
      alert(error.response?.data || "Terjadi kesalahan saat memproses transaksi.");
    }
  };

  return (
    <div>
      <h2>Transaksi Gudang</h2>
      <p>Formulir untuk memasukkan barang ke gudang (IN) atau mengeluarkan barang (OUT).</p>

      <div style={{ padding: '20px', border: '1px solid #ccc', display: 'inline-block', marginTop: '10px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pilih Barang:</label>
            <select name="itemId" value={formData.itemId} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} required>
              <option value="" disabled>-- Pilih Master Barang --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  [{item.code}] {item.name} ({item.pointsPerUnit} Poin)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jenis Transaksi:</label>
            <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
              <option value="IN">MASUK (IN)</option>
              <option value="OUT">KELUAR (OUT)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Jumlah (Quantity):</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleInputChange} 
              min="1" 
              style={{ width: '90%', padding: '1px', marginRight: '0px' }}
              required 
            />
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: '#282c34', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            PROSES TRANSAKSI
          </button>
        </form>
      </div>
    </div>
  );
}