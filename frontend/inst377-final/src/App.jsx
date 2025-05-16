import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fetchAndStoreYTD', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setMessage(`Stored ${result.inserted} records successfully.`);
      } else {
        setMessage('Data may have already been stored.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Fiscal Data Loader</h1>
      <button onClick={loadData} className="animated-button">
        {loading ? 'Loading...' : 'Load Data'}
      </button>
      {message && <p className="popup">{message}</p>}
    </div>
  );
}

export default App;
