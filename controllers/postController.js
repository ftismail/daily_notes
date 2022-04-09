const weekPosts = require('../middlewares/weekPosts')
const Post = require("../modules/Posts");
exports.uploadAudio = (req,res)=>{
    let post = new Post()
    post.voicePost(req,req.session.user.user_id)
    .then((result) => {
        res.send({ 'wow': true })
    }).catch((err) => {
        res.render('error')
    });
}
exports.createPost = (req,res)=>{
    let post = new Post(req.body,req.session.user.user_id)
    post.createPost()
    .then((result) => {
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    }).catch((err) => {
        req.flash('posrtErr',err)
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    });
}
exports.getPosts = (req,res,next)=>{
    let posts = new Post()
    posts.findPosts(req.profileUser)
    .then((result) => {
        req.posts = result
        next()
    }).catch((err) => {
        res.send(err)
    });
}
exports.getPost=(req,res,next)=>{
    let post = new Post()
    post.findPost(req.params._id)
    .then((result) => {
        req.post = result
        next()
    }).catch((err) => {
        res.send(err)
    });
}
exports.isAuthor = (req,res,next)=>{
        let post = new Post()
        post.isAuthor(req.params._id,req.session.user.user_id)
        .then((result) => {
            req.post=result
            next()
        }).catch((err) => {
            req.flash('posrtErr',err)
            req.session.save(()=>{
                res.redirect(`/profile/${req.session.user.user_id}`)
            })
        });
}
exports.getAuthor = (req,res,next)=>{
    let author = new Post()
    author.findAuthor(req.post.author)
    .then((result) => {
        req.author = result
        next()
    }).catch((err) => {
        res.send(err)
    });
}
exports.deletPost = (req,res)=>{
    let post = new Post()
    post.deletPost(req.params._id)
    .then((result) => {
        res.redirect(`/profile/${req.session.user.user_id}`)
    }).catch((err) => {
        req.flash('posrtErr',err)
        req.session.save(()=>{
            res.redirect(`/profile/${req.session.user.user_id}`)
        })
    });
}
exports.editPostView = (req,res)=>{
    res.render('edit-post',{post:req.post})
    }
exports.editPost = (req,res)=>{
    let post = new Post()
    post.editPost(req.params._id,req.body)
    .then((result) => {
        res.redirect('/')
    }).catch((err) => {
        res.render('error')
    });
}
exports.singlePostView = (req,res)=>{
    res.render('single-post',{post:req.post,author:req.author,currentUser:req.session.user})
}

exports.weekPage = async (req,res)=>{
    try {
        let post = new Post()
        let posts = await post.findPosts(req.profileUser._id)
        let weekPost = weekPosts.weeks(posts)
        req.posts = posts
        res.render('week-posts',{posts: weekPost ,user:req.profileUser})
    }
    catch (error) {
        res.redirect('error')
    }
}

exports.uploadFiles = (req,res)=>{
    let file = new Post()
    file.uploadFiles(req,req.session.user.user_id)
    .then((result) => {
        res.redirect('/')
        console.log(result)
    }).catch((err) => {
        console.log(err)
    });
}