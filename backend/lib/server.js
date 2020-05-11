'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3005;
    app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
  }
};