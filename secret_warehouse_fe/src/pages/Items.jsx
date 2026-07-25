import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Items() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', pointsPerUnit: 0, description: '' });
  const [editId, setEditId] = useState(null); // State untuk mode Edit
  
  // State untuk Fitur Search & Paging
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const API_URL = 'http://localhost:5265/api/Items'; 

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Logika Submit (Bisa untuk Create baru atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Mode EDIT
        await axios.put(`${API_URL}/${editId}`, formData);
        alert('Barang berhasil diupdate!');
        setEditId(null);
      } else {
        // Mode CREATE
        await axios.post(API_URL, formData);
        alert('Barang berhasil ditambahkan!');
      }
      setFormData({ name: '', pointsPerUnit: 0, description: '' });
      fetchItems();
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan barang.');
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({ name: item.name, pointsPerUnit: item.pointsPerUnit, description: item.description });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ name: '', pointsPerUnit: 0, description: '' });
  };

  // Logika Filter (Search)
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logika Paging
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h2>Master Data Barang</h2>
      
      {/* Form Tambah/Edit */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>{editId ? `Edit Barang` : `Tambah Item Baru (Nama|Point|Deskripsi)`}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" name="name" placeholder="Nama Barang" required value={formData.name} onChange={handleInputChange} />
          <input type="number" name="pointsPerUnit" placeholder="Poin/Unit" required min="1" value={formData.pointsPerUnit} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Deskripsi" value={formData.description} onChange={handleInputChange} />
          <button type="submit" style={{ backgroundColor: editId ? 'orange' : '#282c34', color: 'white' }}>
            {editId ? 'Update Barang' : 'Simpan Barang'}
          </button>
          {editId && <button type="button" onClick={handleCancelEdit}>Batal</button>}
        </form>
      </div>

      {/* Kontrol Search & Paging */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <input 
          type="text" placeholder="🔍 Cari nama atau kode..." 
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
            <th>Kode</th><th>Nama Barang</th><th>Poin / Unit</th><th>Deskripsi</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.code}</strong></td>
              <td>{item.name}</td>
              <td>{item.pointsPerUnit}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Data tidak ditemukan.</td></tr>
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