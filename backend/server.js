const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./Configuration/db');

dotenv.config({ path:'./Configuration/config.env' });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Working in ${process.env.NODE_ENV} at port http://localhost:${process.env.PORT}`)
});

app.use('/auth', require('./Route/path.auth'));
app.use('/transaction', require('./Route/path.transaction'));
app.use(require('./Route/path.controller').notFound);
app.use(require('./Route/path.controller').errorHandler);
