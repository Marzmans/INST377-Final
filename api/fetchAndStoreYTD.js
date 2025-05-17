const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// REQUIREMENT:  connection to external data source - Supabase Database
// Initialize Supabase with env vars
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// REQUIREMENT: API endpoint that fetches from external provider (Treasury API) and manipulates that data to Supabase

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

// REQUIREMENT: Getting data from external provider (Treasury API)
  try {
    const treasuryURL = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?' +
                        'filter=record_type_cd:eq:SL,classification_desc:eq:Year-to-Date,record_fiscal_year:eq:2024';

    const response = await axios.get(treasuryURL);
    const records = response?.data?.data;

    if (!Array.isArray(records)) {
      return res.status(500).json({ error: 'Invalid data from Treasury API' });
    }

    // REQUIREMENT: data manipulation before storing in database
    const formatted = records
      .filter(r =>
        r.record_fiscal_year &&
        (r.current_month_dfct_sur_amt || r.current_month_gross_rcpt_amt || r.current_month_gross_outly_amt)
      )
      .map(r => ({
        fiscal_year: parseInt(r.record_fiscal_year),
        category: r.line_code_nbr || r.src_line_nbr || 'Unknown',
        amount: parseFloat(
          r.current_month_dfct_sur_amt ||
          r.current_month_gross_rcpt_amt ||
          r.current_month_gross_outly_amt
        ),
        type: r.line_code_nbr === '140' ? 'Revenue' :
              r.line_code_nbr === '280' ? 'Spending' : 'Other'
      }));

    // REQUIREMENT: Writing data to DB
    const { data, error } = await supabase
      .from('fiscal_data')
      .insert(formatted);

    if (error) {
      return res.status(500).json({ error: 'Supabase insert error', detail: error.message });
    }

    return res.status(200).json({ success: true, inserted: formatted.length });
  } catch (err) {
    console.error('Fetch/store error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};
