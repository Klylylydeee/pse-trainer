const express = require('express');
const router = express.Router();
const authController = require('../Controller/controller.auth');

router.post('/signup', authController.authSignUp);

router.post('/signin', authController.authSignIn);

router.post('/social-media', authController.socialMedia);

// router.get(
//     '/profile', async (req, res, next) => {
//         passport.authenticate('jwt', function(err, user) {
//             if(!user){
//                 res.status(401).json({
//                     message: 'Error encountered!',
//                     user: err.message
//                 }); 
//             }
//             res.json({
//                 message: 'You made it to the secure route',
//                 user: req.user,
//                 token: req.query.secret_token
//             })
//         })(req, res, next);
//     }
//   );
  
module.exports = router;