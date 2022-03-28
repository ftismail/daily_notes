const session = require('express-session')
const Post = require("../modules/Posts");
const User = require('../modules/User')
const postsType = require('../middlewares/postsType')
exports.login = (req,res)=>{
    let user = new User(req.body)
    user.login()
    .then((result)=>{
        req.session.user={username:result.username,user_id:result._id,img:result.img}
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    }).catch((error)=>{
        req.flash('errors',error)
        req.session.save(function(){
            res.redirect('/login')
        })
        
    })
}

exports.mustBeLogedIn = (req,res,next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors','you must be logedin to see this content')
        req.session.save(function(){
            res.redirect('/')
        })
    }
}
exports.logedUser = async (req,res,next)=>{
    let user = new User()
    try {
        let results = await user.findById(req.params._id)
        req.profileUser = results
        if (results._id == req.session.user.user_id) {
            next()
        } else {
            req.flash('postError','you dont have permission to access')
            req.session.save(function(){
                res.redirect(`/profile/${results._id}`)
            })
        }
    } catch (error) {
        res.render('error')
    }
}
exports.userExsist = async (req,res,next)=>{
    let user = new User()
    try {
        let results = await user.findById(req.params._id)
        req.profileUser = results
        next()
    } catch (error) {
        res.render('error')
    }
}
exports.upload = (req,res)=>{
    let user = new User(req.body)
    user.uploadImg(req.session.user.user_id,req)
    .then((results)=>{
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    })
    .catch((err)=>{
        res.redirect('error')
    })
}

exports.uploadAudio = async (req,res,next)=>{
    try {
        await res.send({ success: true })
        res.redirect('/')
    } catch (error) {
        res.render('err')
    }
    
    // res.redirect('/')
}

exports.loginPage = (req,res)=>{
    if (req.session.user) {
        req.session.save(()=>{
            res.redirect(`/`)
        })
    } else {
        res.render('login-page',{errors:req.flash('errors')})
    }
}

exports.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}

exports.register = (req,res)=>{
    let user = new User(req.body)
    user.register()
    .then((result)=>{
        req.session.user = {username:user.data.username,user_id:result.insertedId}
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    })
    .catch((err)=>{
        req.flash('regerr',err)
        req.session.save(()=>{
            res.redirect('/sign-up')
        })
    })
}
exports.registerPage = (req,res)=>{
    if (req.session.user) {
        req.session.save(()=>{
            res.redirect(`/`)
        })
    } else {
        res.render('register-page',{regerr:req.flash('regerr')})
    }
}
exports.profile = async (req,res)=>{
    try {
        let post = new Post()
        let posts = await post.findPosts(req.profileUser._id)
        req.posts = posts
        req.posts_text = postsType.textPosts(posts)
        req.posts_audio = postsType.voicePosts(posts)
        res.render('profile',{
            user:req.profileUser,
            correntUser:req.session.user,
            posts:posts,
            voice_posts:req.posts_audio,
            text_posts:req.posts_text,
            postErr:req.flash('posrtErr'),
        })
    } 
    catch (error) {
        console.log(error)
    }
    
    
}
exports.editProfile = (req,res)=>{
    res.render('edit-profile',{user:req.profileUser,postErr:req.flash('posrtErr')})
}
exports.editProfileEnfo = (req,res)=>{
    let user = new User(req.body)
    user.editProfileInfo(req.params._id)
    .then((result) => {
        req.session.user = {username:result.username,user_id:result._id}
        req.session.save(()=>{
            res.redirect(`/`)
        })
    }).catch((err) => {
        req.flash('postError',err)
        req.session.save(function(){
            res.redirect(`/edit-profile/${req.session.user.user_id}}`)
        })
    });
}

exports.home = (req,res)=>{
    if (req.session.user) {
        req.session.save(()=>{
            res.redirect(`profile/${req.session.user.user_id}`)
        })
    } else {
        res.render('home-guests',{errors:req.flash('errors')})
    }
    //  res.render('home-guests')
}