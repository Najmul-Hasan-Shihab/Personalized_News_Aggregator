import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/ping/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching from backend:', error);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>📰 Personalized News Aggregator</h1>
      <p>Backend says: <strong>{message}</strong></p>
    </div>
  );
};

export default App;
