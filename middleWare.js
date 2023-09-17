const {reviewSchema,campgroundSchema}=require('./schemas');

const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground');
const Review = require('./models/review');

const isLoggedIn=(req,res,next)=>{
    // console.log('REQ.USER.....', req.user);
    if(!req.isAuthenticated()){
        // console.log(req.path,req.originalUrl);
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}

const isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateCampground=(req, res, next)=>{
    // NOTE-I am using the bigger code as i came across an error which was solved when i used the bigger code
    // ERROR-in the error part it was showing that campgroundSchema.validate is not a function defined on campgroundSchema
    // SOLUTION TO THE ERROR 
    // const campgroundSchema=Joi.object({
        //     campground:Joi.object({
            //         title: Joi.string().required(),
            //         price: Joi.number().required().min(0),
            //         image: Joi.string().required(),
            //         location: Joi.string().required(),
            //         description: Joi.string().required()
            //     }).required()
            // })
            // const {error}=campgroundSchema.validate(req.body);
            
            const {error}=campgroundSchema.validate(req.body);
            if(error){
                const msg=error.details.map(el=>el.message).join(',')
                throw new ExpressError(msg,400)
            } else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    } else{
        next();
    }
}

module.exports.validateCampground=validateCampground;
module.exports.isAuthor=isAuthor;
module.exports.isReviewAuthor=isReviewAuthor;
module.exports.isLoggedIn=isLoggedIn;
module.exports.storeReturnTo=storeReturnTo;
module.exports.validateReview=validateReview;