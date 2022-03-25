const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postsController = require('./controllers/postController')
const upload = require('./middlewares/upload')
const uploadAudio = require('./middlewares/uploadAudio')
///get///
router.get('/', userController.home )
router.get('/sign-up', userController.registerPage )
router.get('/login', userController.loginPage )
router.get('/profile/:_id',userController.mustBeLogedIn,userController.userExsist,userController.profile)
router.get('/edit-profile/:_id',userController.mustBeLogedIn,userController.logedUser,userController.editProfile)
router.get('/posts', postsController.getPosts )
///post///
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/upload', upload.single('photo'), userController.upload);
router.post('/record',uploadAudio.single('audio'),postsController.uploadAudio)
router.post('/post',postsController.createPost)
router.post('/mod-profile/:_id',userController.mustBeLogedIn,userController.editProfileEnfo)
module.exports = router