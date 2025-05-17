import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import './Home.css';

function Home({ fiscalData, loadData, loading }) {
  const [message, setMessage] = useState('');
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalSpending: 0,
    totalDeficit: 0
  });

  useEffect(() => {
    if (fiscalData.length > 0) {
      calculateSummaryStats();
    }
  }, [fiscalData]);

  const calculateSummaryStats = () => {
    let totalRevenue = 0;
    let totalSpending = 0;

    fiscalData.forEach(row => {
      if (row.type === "Revenue") totalRevenue += row.amount;
      else if (row.type === "Spending") totalSpending += row.amount;
    });

    setSummaryStats({
      totalRevenue,
      totalSpending,
      totalDeficit: totalSpending - totalRevenue
    });
  };

  const handleLoadData = async () => {
    const result = await loadData();
    setMessage(result);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="home-container">
      <h1>Welcome to U.S. Fiscal Tracker</h1>
      <p>This tool helps users explore official government revenue and spending using data from the Treasury's Monthly Treasury Statement (MTS).</p>

      <h2>Summary Statistics</h2>
      <div className="summary">
        <p>Total Revenue: <span>{formatCurrency(summaryStats.totalRevenue)}</span></p>
        <p>Total Spending: <span>{formatCurrency(summaryStats.totalSpending)}</span></p>
        <p>Total Deficit: <span>{formatCurrency(summaryStats.totalDeficit)}</span></p>
      </div>

      <button 
        onClick={handleLoadData} 
        disabled={loading}
        className="load-button"
      >
        {loading ? 'Loading...' : 'Load 2024 Treasury Data'}
      </button>

      {message && <div className="message-popup">{message}</div>}

      <h2>All Fiscal Data</h2>
      <p className="table-description">
        Each row represents a line item from the U.S. Treasury's Monthly Treasury Statement (MTS) for FY2024. 
        The rows are the most recent cumulative totals of either total revenue collected or total spending to date.
      </p>

      <DataTable data={fiscalData} />
    </div>
  );
}

export default Home;