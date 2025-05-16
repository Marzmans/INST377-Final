require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const router = express.Router();

// Supabase init
console.log('ENV URL:', process.env.SUPABASE_URL);
console.log('ENV KEY:', process.env.SUPABASE_KEY ? 'LOADED' : 'MISSING');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/getStoredData', async (req, res) => {
  const { data, error } = await supabase
    .from('fiscal_data')
    .select('*')
    .order('fiscal_year', { ascending: false });

  console.error('Supabase error (GET):', error);
  if (error) return res.status(500).json({ error });

  res.json(data);
});

router.post('/storeData', async (req, res) => {
  const { fiscal_year, category, amount, type } = req.body;

  const { data, error } = await supabase.from('fiscal_data').insert([
    { fiscal_year, category, amount, type }
  ]);

  if (error) return res.status(500).json({ error });
  res.json({ success: true, data });
});

router.post('/fetchAndStoreYTD', async (req, res) => {
  try {
   const treasuryURL =
  'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?' +
  'filter=record_type_cd:eq:SL,classification_desc:eq:Year-to-Date,record_fiscal_year:eq:2024';


    const response = await axios.get(treasuryURL);
    const records = response.data.data;

    console.log('RAW Treasury records:', records.length);

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
      console.error('Insert error:', error);
      return res.status(500).json({ error });
    }

    res.json({ success: true, inserted: data.length });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: "Failed to fetch or store data" });
  }
});


module.exports = router;
