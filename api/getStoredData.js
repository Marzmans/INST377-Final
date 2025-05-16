const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { data, error } = await supabase
    .from('fiscal_data')
    .select('*')
    .order('fiscal_year', { ascending: false });

  if (error) {
    console.error('Supabase error (GET):', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};
