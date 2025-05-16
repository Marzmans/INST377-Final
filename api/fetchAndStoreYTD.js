const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const treasuryURL =
      'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?' +
      'filter=record_type_cd:eq:SL,classification_desc:eq:Year-to-Date,record_fiscal_year:eq:2024';

    const response = await axios.get(treasuryURL);

    // Debugging line
    console.log('Treasury raw response:', JSON.stringify(response.data, null, 2));

    const records = response?.data?.data;

    if (!records || !Array.isArray(records)) {
      console.error('Treasury API returned no valid records.');
      return res.status(500).json({ error: 'Treasury API returned no valid records.' });
    }

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

    console.log('Formatted records:', formatted.length);

    const { data, error } = await supabase.from('fiscal_data').insert(formatted);

if (error) {
  console.error('Supabase insert error:', error);
  return res.status(500).json({ error: 'Supabase insert error', detail: error });
}

res.json({ success: true, inserted: data ? data.length : 0 });

  } catch (err) {
    console.error('API fetch/store error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};
