// src/pages/AddLiquorPage.jsx
import { useState } from 'react';
import axios from 'axios';
import '../css/AddLiquorPage.css'; // Import your CSS file for additional styling

function AddLiquorPage() {
  const [liquor, setLiquor] = useState({
    name: '',
    brand: '',
    quantity: 0,
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', liquor.name);
    formData.append('brand', liquor.brand);
    formData.append('quantity', liquor.quantity);
    formData.append('image', liquor.image);

    try {
      await axios.post('/api/liquors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Liquor added successfully!');
      setLiquor({ name: '', brand: '', quantity: 0, image: null });
    } catch (error) {
      console.error('Error adding liquor:', error);
    }
  };

  return (
    <div className="add-liquor-page">
      <form onSubmit={handleSubmit}>
        <label>
          Liquor Name:
          <input
            type="text"
            value={liquor.name}
            onChange={(e) => setLiquor({ ...liquor, name: e.target.value })}
            required
          />
        </label>
        <label>
          Brand:
          <input
            type="text"
            value={liquor.brand}
            onChange={(e) => setLiquor({ ...liquor, brand: e.target.value })}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={liquor.quantity}
            onChange={(e) => setLiquor({ ...liquor, quantity: parseInt(e.target.value) })}
            required
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            onChange={(e) => setLiquor({ ...liquor, image: e.target.files[0] })}
            required
          />
        </label>
        <button type="submit">Add Liquor</button>
      </form>
    </div>
  );
}

export default AddLiquorPage;
