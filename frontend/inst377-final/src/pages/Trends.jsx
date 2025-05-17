import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './Trends.css';

function Trends({ fiscalData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalSpending: 0,
    totalDeficit: 0
  });

  useEffect(() => {
    if (fiscalData.length > 0) {
      calculateSummaryStats();
      renderChart();
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [fiscalData]);

  const calculateSummaryStats = () => {
    let totalRevenue = 0;
    let totalSpending = 0;

    fiscalData.forEach(row => {
      if (row.type === 'Revenue') totalRevenue += row.amount;
      if (row.type === 'Spending') totalSpending += row.amount;
    });

    setSummaryStats({
      totalRevenue,
      totalSpending,
      totalDeficit: totalSpending - totalRevenue
    });
  };

  const renderChart = () => {
    const categoryMap = {
      "140": "Revenue",
      "280": "Spending"
    };

    const categoryData = {};
    fiscalData.forEach(row => {
      const label = categoryMap[row.category] || "Other";
      if (!isNaN(row.amount)) {
        categoryData[label] = (categoryData[label] || 0) + row.amount;
      }
    });

    const barLabels = Object.keys(categoryData);
    const barValues = Object.values(categoryData);
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{
          label: 'Amount by Category',
          data: barValues,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Amount by Category'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let value = context.raw;
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(value);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="trends-container">
      <h1>Fiscal Data Trends</h1>
      
      <div className="summary">
        <p>Total Revenue: <span>{formatCurrency(summaryStats.totalRevenue)}</span></p>
        <p>Total Spending: <span>{formatCurrency(summaryStats.totalSpending)}</span></p>
        <p>Total Deficit: <span>{formatCurrency(summaryStats.totalDeficit)}</span></p>
      </div>

      <div className="chart-container">
        <h2>Amount by Category</h2>
        <canvas ref={chartRef} id="barChart"></canvas>
      </div>
    </div>
  );
}

export default Trends;