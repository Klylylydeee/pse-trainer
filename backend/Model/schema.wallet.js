const mongoose = require('mongoose');

const wallet = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    currency: {
        type: String,
        required: true,
        default: 'PHP'
    },
    amount: {
        type: Number,
        required: true,
        default: 100000
    }
});

const WalletSchema = mongoose.model('wallets', wallet);

module.exports = WalletSchema;