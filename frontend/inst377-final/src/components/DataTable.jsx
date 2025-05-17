import { useEffect, useRef } from 'react';
import { DataTable as SimpleDataTable } from 'simple-datatables';
import './DataTable.css';

function DataTable({ data }) {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    // Check if we need to initialize or update the table
    if (data.length > 0) {
      if (dataTableRef.current) {
        // If table already exists, update it
        dataTableRef.current.destroy();
      }

      // Initialize new table
      dataTableRef.current = new SimpleDataTable(tableRef.current, {
        searchable: true,
        fixedHeight: true,
        labels: {
          placeholder: "Search fiscal data...",
          perPage: "entries per page",
          noRows: "No fiscal data found",
        },
      });
    }

    // Cleanup function
    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
      }
    };
  }, [data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="table-container">
      <table id="fiscalTable" ref={tableRef}>
        <thead>
          <tr>
            <th>Fiscal Year</th>
            <th>Amount (YTD)</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.fiscal_year}</td>
              <td>{formatCurrency(row.amount)}</td>
              <td>{row.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;