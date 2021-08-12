const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserSchema = require('../Model/schema.user');
const WalletSchema = require('../Model/schema.wallet');
const ListingSchema = require('../Model/schema.listing');

passport.use(
    'signup',
    new localStrategy(
        {
            passReqToCallback: true
        },
        // first_name and last_name are just props so that the 'done' parameter will result to done function
        async (req, first_name, last_name, done) => {
            try {
                const userData = await UserSchema.create({ 
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                const walletData = await WalletSchema.create({
                    _id: userData._id
                });
                const listingData = await ListingSchema.create({
                    _id: userData._id,
                    username: req.body.username
                });
                let objectDataResults = { userData, walletData, listingData }
                return done(null, objectDataResults);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'signin',
    new localStrategy(
      {
        passReqToCallback: true
      },
      async (req, username, password, done) => {
        try {
            const user = await UserSchema.findOne({ username: req.body.username });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            const validate = await user.isValidPassword(password, user.password);
            if (!validate) {
                return done(null, false, { message: 'Wrong Password' });
            }
            return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
            return done(error);
        }
      }
    )
);

passport.use(
    'social-media',
    new localStrategy(
      {
        passReqToCallback: true
      },
      async (req, first_name, last_name, done) => {
          try {
            if(Object.entries(req.body).length !== 6){
                throw new Error('Missing a body parameter');
            };
            const user = await UserSchema.findOne({ username: req.body.username });
            if(!user){
                const userData = await UserSchema.create({ 
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    type: req.body.type
                });
                const walletData = await WalletSchema.create({
                    _id: userData._id
                });
                const listingData = await ListingSchema.create({
                    _id: userData._id,
                    username: req.body.username
                });
                let objectDataResults = { userData, walletData, listingData }
                return done(null, objectDataResults);
            }
            if(req.body.type !== user.type){
                throw new Error(`Email is associated with a ${user.type} account. Please login through ${user.type}`)
            }
            const validate = await user.isValidPassword(req.body.password, user.password);
            if (!validate) {
                return done(null, false, { message: 'Wrong Password' });
            }
            return done(null, user, { message: 'Logged in Successfully' });
          } catch (err) {
            done(err);
          }
      }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: `${process.env.JWT_SECRET_KEY}`,
            // ?secret_token= 
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
            passReqToCallback: true
        },
        async (req, token, done) => {
            try {
                if(req.params.userId !== token.user._id){
                    throw new Error(`Authorization key does not match current user`)
                }
                return done(null, token.user);
            } catch (error) {
                done(error.message);
            }
        }
    )
);