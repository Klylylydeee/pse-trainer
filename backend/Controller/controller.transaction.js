const axios = require('axios');
const jwt = require('jsonwebtoken');
const UserSchema = require('../Model/schema.user');
const WalletSchema = require('../Model/schema.wallet');
const TransactionsSchema = require('../Model/schema.transaction');
const ListingSchema = require('../Model/schema.listing');

exports.getTransactions = async (req, res, next) => {
    try{ 
        let transactionData = await TransactionsSchema.find({ userId: req.params.userId});
        res.status(401).json({
            message: `Transactions of user ${req.params.userId}!`,
            payload: transactionData
        });
    } catch (err) {
        next(err)
    };
};

exports.postTransaction = async (req, res, next) => {
    try { 
        if(Object.entries(req.body).length !== 5){
            throw new Error('Missing a body parameter');
        };
        let stockePriceChecker = await axios.get(`https://phisix-api3.appspot.com/stocks/${req.body.stock_bought}.json`)
        // Cannot apply this as the api updates its price every 10 minutes which may cause distortion
        // .then((res) => {
        //     if(req.body.stock_average_price !== res.data.stock[0].price.amount){
        //         throw new Error(`${req.body.stock_bought} stock average price is not equal with the current data thus has been tampered!`);
        //     };
        // })
        .catch((err) => {
            throw new Error(err.message === "Request failed with status code 404" ? `Stock does not exist in PSE. Please do not tamper with data` : err.message)
        })
        let userData = await UserSchema.find({ _id: req.params.userId });
        await WalletSchema.findById({ _id: req.params.userId },
            async (err, document)=>{
                try {
                    let newToken = {
                        _id: userData[0]._id,
                        first_name: userData[0].first_name,
                        last_name: userData[0].last_name,
                        username: userData[0].username,
                        email: userData[0].email,
                        wallet: document
                    };
                    if(err) {
                        throw new Error(`${err.message}`);
                    };
                    if(document.amount < req.body.stock_average_price * req.body.stock_amount && req.body.type === 'buy' ){
                        throw new Error('User buying power is not enought. Please add more credits to your account!')
                    }
                    if(req.body.user_cash !== document.amount){
                        throw new Error(`User's buying power is tampered. Please avoid this!`)
                    }
                    let beforeTransactionAmount = document.amount;
                    if(req.body.type === 'buy') document.amount -= (req.body.stock_amount*req.body.stock_average_price);
                    if(req.body.type === 'sell') document.amount += (req.body.stock_amount*req.body.stock_average_price);
                    let afterTransactionAmount = document.amount;
                    await document.save();
                    let transactionData = await TransactionsSchema.create({
                        userId: req.params.userId,
                        type: req.body.type,
                        stock_bought: req.body.stock_bought,
                        stock_average_price: req.body.stock_average_price,
                        stock_amount: req.body.stock_amount,
                        transaction_data: {
                            amount_before_transaction: beforeTransactionAmount,
                            amount_after_transaction: afterTransactionAmount
                        }
                    });
                    let listingData = await ListingSchema.findById({_id:req.params.userId})
                    let listingStock;
                    if(listingData.stocks){
                        if(!listingData.stocks.some(data => data.stock_name === req.body.stock_bought) && req.body.type === 'buy'){
                            let createListingStock = await ListingSchema.findOneAndUpdate(
                                { _id: req.params.userId },
                                {  $push: { 
                                        stocks: {
                                            stock_name: req.body.stock_bought,
                                            stock_average_price: req.body.stock_average_price,
                                            stock_amount: req.body.stock_amount
                                        }
                                    } 
                                },
                                { new: true }
                            )
                            listingStock = createListingStock;
                            let refToken = jwt.sign({
                                user: {
                                    ...newToken,
                                    listing: listingStock
                                }
                            }, process.env.JWT_SECRET_KEY);
                            res.status(200).json({
                                message: 'Purchase/Created Succesful!',
                                wallet: document,
                                transaction: transactionData,
                                listing: listingStock,
                                token: refToken
                            }); 
                        } else {
                            if(req.body.type === 'buy'){
                                let createListingStock = await ListingSchema.findOneAndUpdate(
                                    { "_id": req.params.userId, "stocks.stock_name": req.body.stock_bought },
                                    { new: true },
                                    // { 
                                    //     "$inc": {
                                    //         "stocks.$.stock_amount": req.body.stock_amount
                                    //     }
                                    // },
                                    async (errs, docs) => {
                                        let nestedPosition = docs.stocks.map(function(e) { return e.stock_name; }).indexOf(req.body.stock_bought);
                                        let total = (docs.stocks[nestedPosition].stock_amount * docs.stocks[nestedPosition].stock_average_price) + (req.body.stock_amount * req.body.stock_average_price);
                                        let cost = docs.stocks[nestedPosition].stock_amount + req.body.stock_amount;
                                        let totalCost = total/cost;
                                        docs.stocks[nestedPosition].stock_amount += req.body.stock_amount;
                                        docs.stocks[nestedPosition].stock_average_price = totalCost;
                                        await docs.save().then((savedDoc) => {
                                            let refToken = jwt.sign({
                                                user: {
                                                    ...newToken,
                                                    listing: savedDoc
                                                }
                                            }, process.env.JWT_SECRET_KEY);
                                            res.status(200).json({
                                                message: 'Purchase Succesful!',
                                                wallet: document,
                                                transaction: transactionData,
                                                listing: savedDoc,
                                                token: refToken
                                            }); 
                                        })
                                    }
                                );
                            };
                            if(req.body.type === 'sell'){
                                let createListingStock = await ListingSchema.findOneAndUpdate(
                                    { "_id": req.params.userId, "stocks.stock_name": req.body.stock_bought },
                                    { new: true },
                                    async (errs, docs) => {
                                        let nestedPosition = docs.stocks.map(function(e) { return e.stock_name; }).indexOf(req.body.stock_bought);
                                        let totalCurrentStock = (docs.stocks[nestedPosition].stock_amount * docs.stocks[nestedPosition].stock_average_price);
                                        let transactionStock = (req.body.stock_amount * req.body.stock_average_price);
                                        let getCurrentAmount = totalCurrentStock - transactionStock;
                                        let currentStockQuantity = docs.stocks[nestedPosition].stock_amount - req.body.stock_amount;
                                        let totalCost = getCurrentAmount/currentStockQuantity;
                                        if(currentStockQuantity !== 0) {
                                            docs.stocks[nestedPosition].stock_amount = currentStockQuantity;
                                            docs.stocks[nestedPosition].stock_average_price = totalCost;
                                        }
                                        if(currentStockQuantity === 0) {
                                            docs.stocks.splice(nestedPosition, 1);
                                        }
                                        await docs.save().then( (savedDoc) => {
                                            let refToken = jwt.sign({
                                                user: {
                                                    ...newToken,
                                                    listing: savedDoc
                                                }
                                            }, process.env.JWT_SECRET_KEY);
                                            res.status(200).json({
                                                message: 'Selling Succesful!',
                                                wallet: document,
                                                transaction: transactionData,
                                                listing: savedDoc,
                                                token: refToken
                                            }); 
                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                    }
                                );
                            };
                        };
                    };
                } catch (err) {
                    next(err);
                }
            }
        );
    } catch (err) {
        next(err);
    };
};