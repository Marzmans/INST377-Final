import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Trends from './pages/Trends';
import './App.css';

function App() {
  const [fiscalData, setFiscalData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // REQUIREMENT: Fetch Data with API 
  // Fetch fiscal data 
  useEffect(() => {
    fetchFiscalData();
  }, []);
  
  // REQUIREMENT: Fetch #1
  const fetchFiscalData = async () => {
    try {
      const res = await fetch('/api/getStoredData');
      const data = await res.json();
      setFiscalData(data);
    } catch (err) {
      console.error('Error fetching fiscal data:', err);
    }
  };

  // REQUIREMENT: Fetch #2
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fetchAndStoreYTD', { method: 'POST' });
      const result = await res.json();
      
      if (result.success) {
        // Refresh data after loading new data
        await fetchFiscalData();
        return `Stored ${result.inserted} records successfully.`;
      } else {
        return 'Data may have already been stored.';
      }
    } catch (err) {
      console.error(err);
      return 'Error fetching data.';
    } finally {
      setLoading(false);
    }
  };

  // REQUIREMENT:  3 app pages using React Router
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  fiscalData={fiscalData} 
                  loadData={loadData} 
                  loading={loading}
                />
              } 
            />
            {/* REQUIREMENT: About Page */}
            <Route path="/about" element={<About />} />
            {/* REQUIREMENT: Project Specific Functionality Page with Chart.js*/}
            <Route 
              path="/trends" 
              element={<Trends fiscalData={fiscalData} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;