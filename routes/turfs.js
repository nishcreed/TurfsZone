const express = require('express');
const router = express.Router();
const turfs = require('../controllers/turfs');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTurf } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(turfs.index))
    .post(isLoggedIn, upload.array('image'),validateTurf,catchAsync(turfs.createTurf))

router.get('/new', isLoggedIn, turfs.renderNewForm);

router.route('/:id')
    .get(catchAsync(turfs.showTurf)) 
    .put(isLoggedIn, isAuthor,upload.array('image'), validateTurf, catchAsync(turfs.updateTurf))
    .delete(isLoggedIn, isAuthor, catchAsync(turfs.deleteTurf));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(turfs.renderEditForm))

module.exports = router;