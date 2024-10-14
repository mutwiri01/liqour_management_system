import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/LiquorPage.css'; // Import your CSS file for additional styling

function LiquorPage() {
  const [liquors, setLiquors] = useState([]);
  const [newLiquor, setNewLiquor] = useState({
    name: '',
    brand: '',
    quantity: 0,
    image: null,
  });
  const [message, setMessage] = useState(''); // State to hold success/error messages

  // Fetch liquors from the API when the component mounts
  useEffect(() => {
    const fetchLiquors = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/liquors'); // Ensure correct endpoint
        setLiquors(response.data);
      } catch (error) {
        console.error('Error fetching liquors:', error);
        setMessage('Error fetching liquors. Please try again.'); // Set error message
      }
    };
    fetchLiquors();
  }, []);

  // Handle adding new liquor
  const handleAddLiquor = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newLiquor.name);
    formData.append('brand', newLiquor.brand);
    formData.append('quantity', newLiquor.quantity);
    formData.append('image', newLiquor.image);

    try {
      const response = await axios.post('http://localhost:4000/api/liquors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLiquors([...liquors, response.data]); // Update the state with the new liquor
      setNewLiquor({ name: '', brand: '', quantity: 0, image: null }); // Reset the form
      setMessage('Liquor added successfully!'); // Set success message
    } catch (error) {
      console.error('Error adding liquor:', error);
      setMessage('Error adding liquor. Please try again.'); // Set error message
    }
  };

  // Handle removing liquor
  const handleRemoveLiquor = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/liquors/${id}`);
      setLiquors(liquors.filter((liquor) => liquor._id !== id)); // Update state to remove the deleted liquor
      setMessage('Liquor removed successfully!'); // Set success message
    } catch (error) {
      console.error('Error removing liquor:', error.response ? error.response.data : error);
      setMessage('Error removing liquor. Please try again.'); // Set error message
    }
  };

  // Handle updating liquor quantity
  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      await axios.patch(`http://localhost:4000/api/liquors/${id}`, { quantity: newQuantity });
      setLiquors(liquors.map(liquor => 
        liquor._id === id ? { ...liquor, quantity: newQuantity } : liquor
      )); // Update state with the new quantity
      setMessage('Liquor quantity updated successfully!'); // Set success message
    } catch (error) {
      console.error('Error updating liquor quantity:', error);
      setMessage('Error updating quantity. Please try again.'); // Set error message
    }
  };

  return (
    <div className="liquor-page">
      {message && <div className="message">{message}</div>} {/* Display message */}

      <form onSubmit={handleAddLiquor} className="add-liquor-form">
        <input
          type="text"
          placeholder="Liquor Name"
          value={newLiquor.name}
          onChange={(e) => setNewLiquor({ ...newLiquor, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={newLiquor.brand}
          onChange={(e) => setNewLiquor({ ...newLiquor, brand: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newLiquor.quantity || ''} // Ensure value is a string
          onChange={(e) => {
            const quantityValue = parseInt(e.target.value);
            setNewLiquor({ ...newLiquor, quantity: isNaN(quantityValue) ? 0 : quantityValue });
          }}
          required
        />
        <input
          type="file"
          accept="image/*" // Optional: restrict to image files
          onChange={(e) => setNewLiquor({ ...newLiquor, image: e.target.files[0] })}
          required
        />
        <button type="submit">Add Liquor</button>
      </form>

      <h2>Available Liquors</h2>
      <ul className="liquor-list">
        {liquors.map((liquor) => (
          <li key={liquor._id} className="liquor-item">
            <img src={liquor.imageUrl} alt={liquor.name} className="liquor-image" />
            <div className="liquor-details">
              <h3>{liquor.name}</h3>
              <p>Brand: {liquor.brand}</p>
              <p>Quantity: {liquor.quantity}</p>
              
              <div className="quantity-update">
                <label htmlFor={`quantity-${liquor._id}`}>Update Quantity:</label>
                <input 
                  type="number" 
                  id={`quantity-${liquor._id}`} 
                  min="0" 
                  value={liquor.quantity} 
                  onChange={(e) => handleUpdateQuantity(liquor._id, Number(e.target.value))} // Update quantity on change
                  className="quantity-input"
                />
              </div>
              
              <button onClick={() => handleRemoveLiquor(liquor._id)} className="remove-button">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiquorPage;
