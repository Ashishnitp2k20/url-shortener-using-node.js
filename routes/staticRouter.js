const express = require('express');
const { restrictToWhom } = require('../middleware/auth');
const URL = require("../models/url");
const router = express.Router();

const requestIp = require('request-ip');

router.get('/admin/urls', restrictToWhom(["ADMIN"]), async (req, res) => {
    const user = req.user;
    const allUrls = await URL.find({});
    
    return res.render('home', {
        urls: allUrls,
        username: user.name,
        ip: requestIp.getClientIp(req)

    });
});

router.get('/', restrictToWhom(["NORMAL","ADMIN"]), async (req, res) => {
    const user = req.user;
    console.log(user._id)
    const allUrls = await URL.find({createdBy:req.user._id});
    
    return res.render('home', {
        username: user.name,
        urls: allUrls,
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    })

});



router.get('/signup', async (req, res) => {
    return res.render('signup');
});

router.get('/login', async (req, res) => {
    return res.render('login');
});

module.exports = router;