const Turf = require('../models/turf');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index=async (req, res) => {
    const turfs = await Turf.find({});
    res.render('turfs/index', { turfs })
}

module.exports.renderNewForm = (req, res) => {
    res.render('turfs/new');
}

module.exports.createTurf=async (req, res, next) => {
   const geoData = await geocoder.forwardGeocode({
       query: req.body.turf.location,
       limit:1
   }).send()

    const turf = new Turf(req.body.turf);
    turf.geometry = geoData.body.features[0].geometry;
    turf.images=req.files.map(f => ({url:f.path, filename:f.filename}));
    turf.author = req.user._id;
    await turf.save();
    req.flash('success', 'Successfully made a new turf!');
    res.redirect(`/turfs/${turf._id}`)
}

module.exports.showTurf=async (req, res,) => {
    const turf = await Turf.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!turf) {
        req.flash('error', 'Cannot find that turf!');
        return res.redirect('/turfs');
    }
    res.render('turfs/show', { turf });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const turf = await Turf.findById(id)
    if (!turf) {
        req.flash('error', 'Cannot find that turf!');
        return res.redirect('/turfs');
    }
    res.render('turfs/edit', { turf });
}

module.exports.updateTurf = async (req, res) => {
    const { id } = req.params;
    const turf = await Turf.findByIdAndUpdate(id, { ...req.body.turf });
    const images = req.files.map(f => ({url:f.path, filename:f.filename}));
    turf.images.push(...images);
    await turf.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
       await turf.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        
    }
    req.flash('success', 'Successfully updated turf!');
    res.redirect(`/turfs/${turf._id}`)
}

module.exports.deleteTurf=async (req, res) => {
    const { id } = req.params;
    await Turf.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted turf')
    res.redirect('/turfs');
}