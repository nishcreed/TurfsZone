const Turf=require('../models/turf');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const turf= await Turf.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    turf.reviews.push(review);
    await review.save();
    await turf.save();
    req.flash('success','Created new review');
    res.redirect(`/turfs/${turf._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const{id,reviewId}=req.params;
    await Turf.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/turfs/${id}`);
}