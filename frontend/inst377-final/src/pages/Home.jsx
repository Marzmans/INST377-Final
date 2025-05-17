import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

function Home({ fiscalData, loadData, loading }) {
  const [message, setMessage] = useState('');
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalSpending: 0,
    totalDeficit: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (fiscalData.length > 0) {
      calculateSummaryStats();
      setDataLoading(false);
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

  // REQUIREMENT: Advanced CSS animations - Button click ripple effect
  const createRipple = (event) => {
    const button = event.currentTarget;
    
    // Remove any existing ripples
    const ripples = button.getElementsByClassName("ripple");
    if (ripples.length > 0) {
      ripples[0].remove();
    }

    // Create new ripple
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    // Get position relative to the button
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    // Style the ripple
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add("ripple");
    
    // Add the ripple to the button
    button.appendChild(circle);

    // Remove the ripple after animation completes
    setTimeout(() => {
      if (circle && circle.parentElement === button) {
        button.removeChild(circle);
      }
    }, 600); // Match the animation duration
  };

  // REQUIREMENT: Using both API endpoints from the frontend
  // 1. fetchAndStoreYTD API (called through loadData)
  // 2. getStoredData API (called in the parent component to get fiscalData)
  const handleLoadData = async (event) => {
    createRipple(event);
    setDataLoading(true);
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

      {/* REQUIREMENT: Advanced CSS animations - Button with ripple effect */}
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

      {/* REQUIREMENT: Advanced CSS animations - Loading spinner */}
      {dataLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable data={fiscalData} />
      )}
    </div>
  );
}

export default Home;