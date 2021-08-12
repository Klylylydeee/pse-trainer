const mongoose = require('mongoose');

let userWalletTransaction = new mongoose.Schema({
    amount_before_transaction: {
        type: Number,
        required: true
    },
    amount_after_transaction: {
        type: Number,
        required: true
    }
});

const transaction = new mongoose.Schema({
    userId: {
        type: String,
        lowercase: true,
        required: true
    },
    type: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['BUY', 'SELL']
    },
    stock_bought: {
        type: String,
        uppercase: true
    },
    stock_average_price: {
        type: Number,
        required: true
    },
    stock_amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    transaction_data: {
        type: userWalletTransaction,
        required: true
    }
});

const TransactionsSchema = mongoose.model('transactions', transaction);

module.exports = TransactionsSchema;