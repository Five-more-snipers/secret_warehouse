import { Link } from 'react-router-dom';

export default function Navbar() {
  const navStyle = {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#282c34',
    color: 'white',
    marginBottom: '20px'
  };

  const linkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' };

  return (
    <nav style={navStyle}>
      <Link style={linkStyle} to="/">Dashboard</Link>
      <Link style={linkStyle} to="/items">Master Items</Link>
      <Link style={linkStyle} to="/warehouse">Warehouse</Link>
      <Link style={linkStyle} to="/transactions">Transactions</Link>
      <Link style={linkStyle} to="/config">Config</Link>
    </nav>
  );
}