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