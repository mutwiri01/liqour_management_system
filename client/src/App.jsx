// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddLiquorPage from './pages/AddLiquorPage';
import InventoryPage from './pages/InventoryPage';
import LiquorPage from './pages/LiqourPage'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-liquor" element={<AddLiquorPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/liqour" element={<LiquorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
