const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fiscal_year, category, amount, type } = req.body;

  const { data, error } = await supabase.from('fiscal_data').insert([
    { fiscal_year, category, amount, type }
  ]);

  if (error) return res.status(500).json({ error });

  res.status(200).json({ success: true, data });
};
