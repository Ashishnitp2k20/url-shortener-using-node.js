const express = require('express')
const router = express.Router()
const {handleUserSignup, handleUserLogin, handleUserLogout} = require('../controllers/user')

// All users route
router.post('/', handleUserSignup);
router.post('/Login', handleUserLogin);

// Single user route
router.get('/Logout', handleUserLogout);
module.exports=router;