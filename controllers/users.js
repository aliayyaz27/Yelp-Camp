const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        const user=new User({username,email});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    // req.flash('success','Welcome back');
    req.flash('success',`Welcome back ${req.user.username}`)
    // console.log('res.local.returnTo---->',res.locals.returnTo);
    // console.log('req.session.returnTo---->',req.session.returnTo);
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    // delete res.locals.returnTo;
    return res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds');
    })
}