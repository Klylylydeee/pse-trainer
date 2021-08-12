const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../Authorization/auth');

exports.getJWTQueryParams = async (req, res, next) => {
    passport.authenticate('jwt', function(err, user) {
        try {
            if(err){
                throw new Error(err)
            }
            if(!user){
                throw new Error(`Wrong or Expired JWT authorization query parameter.`)
            }
            next();
        } catch (err) {
            res.status(401).json({
                message: 'Error encountered!',
                payload: {
                    authorization: err.message !== undefined ? err.message : 'Wrong or Expired JWT authorization query parameter.'
                }
            }); 
        }
    })(req, res, next);
}