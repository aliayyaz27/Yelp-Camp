const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo}=require('../middleWare');
const users=require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

// router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
//     // req.flash('success','Welcome back');
//     req.flash('success',`Welcome back ${req.user.username}`);
//     const redirectUrl=req.session.returnTo || '/campgrounds'
//     // const redirectUrl=res.locals.returnTo || '/campgrounds';
//     // console.log('redirectUrl.....',redirectUrl);
//     res.redirect(redirectUrl);
// })

router.get('/logout',users.logout)

module.exports=router;