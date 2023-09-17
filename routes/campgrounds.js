const express=require('express');
const Joi=require('joi');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const campground=require('../controllers/campgrounds');
const flash=require('connect-flash')
const {isLoggedIn,validateCampground,isAuthor}=require('../middleWare');
const {storage}=require('../cloudinary')
const multer=require('multer');
const upload=multer({storage});
// const {isLoggedIn}=require('../middleWare');
// const {validateCampground}=require('../middleWare');

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))
    
    
router.get('/new', isLoggedIn ,catchAsync(campground.renderNewForm))

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))

module.exports=router;