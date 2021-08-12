const express = require('express');
const router = express.Router();
const jwtAuthenticate = require('../Middleware/JWT');
const transactionController = require('../Controller/controller.transaction');

router.get('/:userId', jwtAuthenticate.getJWTQueryParams, transactionController.getTransactions);

router.post('/:userId', jwtAuthenticate.getJWTQueryParams, transactionController.postTransaction);
  
module.exports = router;