// const multer = require('multer');
// const upload = multer({dest: __dirname + '/upload/images'});

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload/images/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});

const upload = multer({ storage });
module.exports = upload