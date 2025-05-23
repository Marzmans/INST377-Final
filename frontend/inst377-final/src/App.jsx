import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Trends from './pages/Trends';
import PageTransition from './components/PageTransition';
import './App.css';

// REQUIREMENT: Extra Credit - React with dynamic updates
function App() {
  const [fiscalData, setFiscalData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch fiscal data on component mount
  useEffect(() => {
    fetchFiscalData();
  }, []);
  
  const fetchFiscalData = async () => {
    try {
      const res = await fetch('/api/getStoredData');
      const data = await res.json();
      setFiscalData(data);
    } catch (err) {
      console.error('Error fetching fiscal data:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fetchAndStoreYTD', { method: 'POST' });
      const result = await res.json();
      
      if (result.success) {
        // Refresh data after successfully loading new data
        await fetchFiscalData();
        return `Stored records successfully.`;
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

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          {/* REQUIREMENT: Advanced CSS animations - Page Transitions */}
          <PageTransition>
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
              <Route path="/about" element={<About />} />
              <Route 
                path="/trends" 
                element={<Trends fiscalData={fiscalData} />} 
              />
            </Routes>
          </PageTransition>
        </div>
      </div>
    </Router>
  );
}

export default App;