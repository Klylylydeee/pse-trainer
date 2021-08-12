const mongoose = require('mongoose');

const stockData = new mongoose.Schema({
    stock_name: {
        type: String,
        uppercase: true,
        required: true
    },
    stock_average_price: {
        type: Number,
        required: true
    },
    stock_amount: {
        type: Number,
        required: true
    }

})

const listing = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    stocks: {
        type: [stockData]
    }
})

const ListingSchema = mongoose.model('listings', listing);

module.exports = ListingSchema;