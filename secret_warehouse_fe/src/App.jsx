import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Config from './pages/Config';
import Items from './pages/Items';
import Warehouse from './pages/Warehouse';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar akan selalu muncul di setiap halaman */}
      <Navbar />
      
      {/* Area konten yang berubah-ubah sesuai rute */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/config" element={<Config />} />
          <Route path="/items" element={<Items />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;