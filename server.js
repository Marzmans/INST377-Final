const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serves your index.html etc.

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
