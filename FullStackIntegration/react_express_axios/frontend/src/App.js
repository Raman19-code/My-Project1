import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="container">
      <h1 className="title">Product List</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
