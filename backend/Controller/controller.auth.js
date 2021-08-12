const passport = require('passport');
const jwt = require('jsonwebtoken');
const WalletSchema = require('../Model/schema.wallet');
const ListingSchema = require('../Model/schema.listing');
require('../Authorization/auth');

exports.authSignUp = async (req, res, next) => {
    passport.authenticate('signup', function(err, objectResponse ) {
        try {
            if (err) { 
                throw new Error (`${err.message}`);
            };
            if(objectResponse) {
                res.status(200).json({
                    message: 'Succesful!',
                    user: objectResponse.userData,
                    wallet: objectResponse.walletData,
                    listing: objectResponse.listingData
                }); 
            };
        } catch (err) {
            next(err);
        }
    })(req, res, next);
};

exports.authSignIn = async (req, res, next) => {
    passport.authenticate('signin', async (err, user, info) => {
        try {
            if (err) {
                throw new Error (`${err.message}`);
            }
            if (!user){
                throw new Error (`${info.message}`);
            }
            req.login(user, { session: false }, async (error) => {
                if(error){
                    res.status(401).json({
                        message: 'Error encountered!',
                        user: error.message
                    }); 
                }
                let walletData = await WalletSchema.find({ _id: user._id });
                let listingData = await ListingSchema.find({ _id: user._id });
                const body = { 
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                    wallet: walletData[0],
                    listing: listingData[0]
                };
                const token = jwt.sign({ user: body }, `${process.env.JWT_SECRET_KEY}`);
                return res.json({
                    message: `Sucessful!`,
                    payload: user,
                    wallet: walletData,
                    listing: listingData,
                    token: token
                });
            })
        } catch (err) {
            next(err);
        };
    })(req, res, next);
};


exports.socialMedia = async (req, res, next) => {
    passport.authenticate('social-media', async (err, objectResponse, message) => {
        try {
            if (err) { 
                throw new Error (`${err.message}`);
            };
            if(objectResponse === false){
                throw new Error(message.message)
            }
            req.login(objectResponse, { session: false }, async (error) => {
                if(error){
                    res.status(401).json({
                        message: 'Error encountered!',
                        user: error.message
                    }); 
                }
                let walletData = await WalletSchema.find({ _id: objectResponse._id });
                let listingData = await ListingSchema.find({ _id: objectResponse._id });
                const body = { 
                    _id: objectResponse._id,
                    first_name: objectResponse.first_name,
                    last_name: objectResponse.last_name,
                    username: objectResponse.username,
                    email: objectResponse.email,
                    wallet: walletData[0],
                    listing: listingData[0]
                };
                const token = jwt.sign({ user: body }, `${process.env.JWT_SECRET_KEY}`);
                return res.json({
                    message: message === undefined ? `Created and Sign-in Sucessful!` :`Sign-in Sucessful!`,
                    payload: objectResponse,
                    wallet: walletData,
                    listing: listingData,
                    token: token
                });
            })
        } catch (err) {
            next(err);
        };
    })(req, res, next);
};
