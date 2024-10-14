// src/components/AddLiquor.jsx
import { useState } from 'react';
import axios from 'axios';

function AddLiquor() {
  const [liquor, setLiquor] = useState({ name: '', quantity: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Post new liquor to backend
    axios.post('/api/liquors', liquor)
      .then(() => {
        setLiquor({ name: '', quantity: 0 });
        alert('Liquor added!');
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input 
          type="text" 
          value={liquor.name} 
          onChange={e => setLiquor({ ...liquor, name: e.target.value })} 
          required 
        />
      </label>
      <label>
        Quantity:
        <input 
          type="number" 
          value={liquor.quantity} 
          onChange={e => setLiquor({ ...liquor, quantity: parseInt(e.target.value) })} 
          required 
        />
      </label>
      <button type="submit">Add Liquor</button>
    </form>
  );
}

export default AddLiquor;
