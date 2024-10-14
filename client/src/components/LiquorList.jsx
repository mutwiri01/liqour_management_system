// src/components/LiquorList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function LiquorList() {
  const [liquors, setLiquors] = useState([]);

  useEffect(() => {
    // Fetch all liquors
    axios.get('/api/liquors')
      .then(response => setLiquors(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Liquor Inventory</h1>
      <ul>
        {liquors.map((liquor) => (
          <li key={liquor._id}>
            {liquor.name} - {liquor.quantity} units
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiquorList;
