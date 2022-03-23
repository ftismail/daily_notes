const session = require('express-session')
const User = require('../modules/User')
exports.login = (req,res)=>{
    let user = new User(req.body)
    user.login()
    .then((result)=>{
        req.session.user={username:result.username,user_id:result._id}
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    }).catch((error)=>{
        req.flash('errors',error)
        req.session.save(function(){
            res.redirect('/login')
        })
        console.log(error)
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
    // let user = new User()
    // user.uploadImg(req.session.user.user_id,req)
    // .then((results)=>{
    //     req.userImg = results.img
    //     req.session.save(()=>{
    //         res.redirect(`/profile/${req.session.user.user_id}`)
    //     })
    // })
    // .catch((err)=>{
    //     res.redirect('error')
    // })
    try {
        await res.send({ success: true })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
    
    // res.redirect('/')
}

exports.loginPage = (req,res)=>{
    res.render('login-page',{errors:req.flash('errors')})
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
    res.render('register-page',{regerr:req.flash('regerr')})
}
exports.profile = (req,res)=>{
    res.render('profile',{user:req.profileUser,correntUser:req.session.user,postErr:req.flash('posrtErr')})
    console.log(req.profileUser)
}

exports.home = (req,res)=>{
    if (req.session.user) {
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    } else {
        res.render('home-guests',{errors:req.flash('errors')})
    }
    //  res.render('home-guests')
}