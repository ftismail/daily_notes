const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postsController = require('./controllers/postController')
const upload = require('./middlewares/upload')
const uploadAudio = require('./middlewares/uploadAudio')
const uploadFiles = require('./middlewares/uploadFiles')
///get///
router.get('/', userController.home )
router.get('/sign-up', userController.registerPage )
router.get('/login', userController.loginPage )
router.get('/profile/:_id',userController.mustBeLogedIn,userController.userExsist,userController.profile)
router.get('/edit-profile/:_id',userController.mustBeLogedIn,userController.logedUser,userController.editProfile)
router.get('/edit-post/:_id',postsController.isAuthor,postsController.editPostView)
router.get('/single-post/:_id',postsController.getPost,postsController.getAuthor,postsController.singlePostView)
router.get('/week-notes/:_id',userController.mustBeLogedIn,userController.logedUser,postsController.weekPage)
router.get('/download/:filename',(req,res)=>{
    res.download(`upload/files/${req.params.filename}`)
})
///post///
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/upload', upload.single('photo'), userController.upload);
router.post('/record',uploadAudio.single('audio'),postsController.uploadAudio)
router.post('/upload-files',uploadFiles.single('files'),postsController.uploadFiles)
router.post('/post',postsController.createPost)
router.post('/mod-profile/:_id',userController.mustBeLogedIn,userController.editProfileEnfo)
router.post('/delet-post/:_id',postsController.isAuthor,postsController.deletPost)
router.post('/edit-post/:_id',postsController.isAuthor,postsController.editPost)

module.exports = router