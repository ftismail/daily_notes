const Post = require("../modules/Posts");
exports.uploadAudio = (req,res)=>{
    let post = new Post()
    post.voicePost(req,req.session.user.user_id)
    .then((result) => {
        res.send({ 'wow': true })
        console.log(result)
    }).catch((err) => {
        console.log(err)
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
    posts.findPosts(req.profile._id)
    .then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
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
        console.log(result)
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
        console.log(err)
    });
}
exports.singlePostView = (req,res)=>{
    console.log(req.author)
    res.render('single-post',{post:req.post,author:req.author,currentUser:req.session.user})
}
