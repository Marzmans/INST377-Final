const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/getStoredData', async (req, res) => {
  const { data, error } = await supabase
    .from('fiscal_data')
    .select('*')
    .order('fiscal_year', { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

module.exports = router;
