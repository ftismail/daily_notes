const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const multer = require('multer');
const upload = multer({dest: __dirname + '/upload/images'});
///get///
router.get('/', userController.home )
router.get('/sign-up', userController.registerPage )
router.get('/login', userController.loginPage )
router.get('/profile/:_id',userController.mustBeLogedIn,userController.userExsist,userController.profile)
///post///
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/upload', upload.single('photo'), userController.upload);

module.exports = router