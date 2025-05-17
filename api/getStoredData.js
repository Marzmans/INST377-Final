const { createClient } = require('@supabase/supabase-js');

// REQUIREMENT: connection to external DB
// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// REQUIREMENT: API endpoint that retrieves data from Supabase database
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // REQUIREMENT: Retrieving data from DB
  const { data, error } = await supabase
    .from('fiscal_data')
    .select('*')
    .order('fiscal_year', { ascending: false });

  if (error) {
    console.error('Supabase error (GET):', error);
    return res.status(500).json({ error: error.message });
  }

    // REQUIREMENT: Returning data to be used by frontend
  res.status(200).json(data);
};
