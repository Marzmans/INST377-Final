router.post('/fetchAndStoreYTD', async (req, res) => {
  try {
    const treasuryURL =
      'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?' +
      'filter=record_type_cd:eq:SL,classification_desc:eq:Year-to-Date,record_fiscal_year:eq:2024';

    const response = await axios.get(treasuryURL);
    const records = response.data.data;

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

    const { error } = await supabase
      .from('fiscal_data')
      .insert(formatted, { returning: 'minimal' }); // or 'representation' if needed

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: 'Supabase insert error', detail: error });
    }

    res.json({ success: true, inserted: formatted.length });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch or store data' });
  }
});
