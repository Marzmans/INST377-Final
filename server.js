const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.use('/api', apiRoutes);


module.exports = app;
