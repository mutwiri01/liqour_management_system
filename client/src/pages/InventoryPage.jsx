import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Inventory.css'; // Add CSS for styling the sales history page

function InventoryPage() {
  const [salesHistory, setSalesHistory] = useState([]);

  // Fetch sales history from the backend
  useEffect(() => {
    const fetchSalesHistory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sales'); // Ensure the correct endpoint
        setSalesHistory(response.data);
      } catch (error) {
        console.error('Error fetching sales history:', error);
      }
    };
    fetchSalesHistory();
  }, []);

  // Sort sales history by dateSold in descending order (recent first)
  const sortedSalesHistory = [...salesHistory].sort((a, b) => new Date(b.dateSold) - new Date(a.dateSold));

  return (
    <div className="inventory-page">
      <h1>Sales History</h1>
      {sortedSalesHistory.length > 0 ? (
        <ul className="sales-list">
          {sortedSalesHistory.map((sale) => (
            <li key={sale._id} className="sales-item">
              <div>
                <span><strong>Liquor:</strong> {sale.liquor.name}</span>
                <span><strong>Brand:</strong> {sale.liquor.brand}</span>
              </div>
              <div>
                <span><strong>Quantity Sold:</strong> {sale.quantitySold}</span>
                <span><strong>Date:</strong> {new Date(sale.dateSold).toLocaleDateString()}</span>
              </div>
            </li>
          ))} 
        </ul>
      ) : (
        <p>No sales have been made yet.</p>
      )}
    </div>
  );
}

export default InventoryPage;
