'use strict';

// 1st party modules

// 3rd party modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// local modules
const userRoutes = require('../routes/userRoutes.js');
const reviewRoutes = require('../routes/reviewRoutes.js');
const itemRoutes = require('../routes/itemRoutes.js');
const rentalRoutes = require('../routes/rentalRoutes.js');


const app = express();
dotenv.config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(userRoutes);
app.use(reviewRoutes);
app.use(itemRoutes);
app.use(rentalRoutes);

module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3005;
    app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
  },
};
