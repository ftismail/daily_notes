exports.textPosts = (array)=>{
    let postsText =array.filter((e)=>{return e.type == 'text'})
    return postsText
}
exports.voicePosts = (array)=>{
    let postsText =array.filter((e)=>{ return e.type == 'audio'})
    return postsText
}