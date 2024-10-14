import { useState, useEffect } from 'react';
import '../css/Dashboard.css'; // Separate CSS file for styling
import bannerImage from '../assets/l1.jpg'; // Import the image from assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBeer, faWineBottle, faCocktail } from '@fortawesome/free-solid-svg-icons'; // Import beverage icons
import axios from 'axios'; // Import axios for making API requests

function Dashboard() {
  const [sales, setSales] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [quantityToSell, setQuantityToSell] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  // Fetch inventory data from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/liquors'); // Ensure the correct endpoint
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  // Handle selling liquor
  const sellLiquor = async (id) => {
    try {
      const liquorToSell = inventory.find(item => item._id === id); // Find liquor by ID
      const quantity = quantityToSell[id] || 0;

      if (liquorToSell && quantity > 0 && liquorToSell.quantity >= quantity) {
        // Send a POST request to record the sale
        const saleResponse = await axios.post('http://localhost:4000/api/sales', {
          liquorId: id,
          quantitySold: quantity
        });

        if (saleResponse.status === 201) {
          // Update local state: reduce the quantity in the UI and increase sales count
          setInventory(inventory.map(item => 
            item._id === id ? { ...item, quantity: item.quantity - quantity } : item
          ));
          setSales(sales + quantity);

          // Reset the quantity to sell for this liquor
          setQuantityToSell(prev => ({ ...prev, [id]: 0 }));

          // Set success message
          setSuccessMessage(`Sale made successfully! ${quantity} units of ${liquorToSell.name} sold.`);
          setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        }
      } else {
        setErrorMessage('Insufficient stock or invalid quantity.');
        setTimeout(() => setErrorMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      console.error('Error selling liquor:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to process sale.');
      setTimeout(() => setErrorMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (id, value) => {
    setQuantityToSell(prev => ({ ...prev, [id]: value }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      <div className="dashboard-header">
        <img
          className="dashboard-image"
          src={bannerImage} 
          alt="Liquor Store"
        />
        <h1>Liquor Store Dashboard</h1>
      </div>

      <div className="theme-toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          Toggle Dark Mode
        </label>
      </div>

      <div className="stats">
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      </div>

      <h2>Liquor Inventory</h2>
      <ul className="inventory-list">
        {inventory.length > 0 ? inventory.map((item) => (
          <li key={item._id} className="inventory-item">
            <div className="liquor-info">
              <img src={item.imageUrl} alt={item.name} className="liquor-image" />
              <FontAwesomeIcon 
                icon={item.brand === 'Beer' ? faBeer : item.brand === 'Wine' ? faWineBottle : faCocktail} 
                className="liquor-icon"
              />
              <span>{item.name} - {item.brand} - {item.quantity} units</span>
            </div>
            <div>
              <label htmlFor={`quantity-${item._id}`}>Quantity to Sell:</label> {/* Label for quantity input */}
              <input 
                id={`quantity-${item._id}`}
                type="number" 
                min="1" 
                max={item.quantity} 
                value={quantityToSell[item._id] || ''} 
                onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                className="quantity-input"
              />
            </div>
            <button 
              className="sell-button" 
              onClick={() => sellLiquor(item._id)}
              disabled={item.quantity <= 0}
            >
              Sell
            </button>
          </li>
        )) : <p>No inventory available</p>}
      </ul>
    </div>
  );
}

export default Dashboard;
