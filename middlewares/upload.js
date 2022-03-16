const multer = require('multer');
const { nextTick } = require('process');
const upload = multer({dest: __dirname + '/upload/images'});
exports.uploadImg = (res,req,next)=>{
    upload.single('photo')
    next()
}

