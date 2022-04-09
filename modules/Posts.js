const postsCollection = require('../db').db().collection('posts')
const userCollection = require('../db').db().collection('users')
const ObjectId = require('mongodb').ObjectId
const sanitizeHtml = require('sanitize-html')
class Post {
    constructor(data,userId){
        this.data = data
        this.error = []
        this.userId = userId
    }
    cleanUp(){
        if(typeof(this.data.post) != 'string') {this.data.post=''}
        this.data = {
            post:sanitizeHtml(this.data.post.trim(),{allowedTags:[],allowedAttributes:{}}),
            type:'text',
            show:'private',
            date:new Date(),
            author:ObjectId(this.userId)
        }
    }
    validation(){
        if(this.data.post == ""){this.error.push('you should write something')}
    }

    voicePost(req,id){
        return new Promise(async(resolve,reject)=>{
            try {
                let voice = await postsCollection.insertOne({post:req.file.filename,type:'audio',show:'private',date:new Date(),author:new ObjectId(id)})
                resolve(voice)
            } catch (error) {
                reject(error)
            }
        })
    }

    uploadFiles(req,id){
        return new Promise(async(resolve,reject)=>{
            try {
                if(req.file){
                let file = await postsCollection.insertOne({post:req.file.filename,type:'file',show:'private',date:new Date(),author:new ObjectId(id)})
                resolve(file)
                }
                
            } catch (error) {
                reject(error)
            }
        })
    }

    createPost(){
        return new Promise(async(resolve,reject)=>{
            this.cleanUp()
            this.validation()
            if (!this.error.length) {
                try {
                let post = await postsCollection.insertOne(this.data)
                resolve(post) 
                }
                catch (er) {
                    this.error.push('try again')
                    reject(this.error)
                }
            } else {
                reject(this.error)
            }
            
        })
    }
    findPosts(authorId){
        return new Promise( async(resolve,reject)=>{
            try {
                let posts = await postsCollection.aggregate([
                    {$match:{author:authorId}},
                    {$sort:{date:-1}}
                ]).toArray()
                resolve(posts)
            } catch (error) {
                reject(error)
            }
            
        })
    }
    findPost(authorId){
        return new Promise( async(resolve,reject)=>{
            try {
                let post = await postsCollection.findOne({_id:new ObjectId(authorId)})
                resolve(post)
            } catch (error) {
                reject(error)
            }
            
        })
    }

    findAuthor(authorId){
        return new Promise( async(resolve,reject)=>{
            try {
                let post = await userCollection.findOne({_id:new ObjectId(authorId)})
                resolve(post)
            } catch (error) {
                reject(error)
            }
            
        })
    }

    isAuthor(post_id,visitor_id){
        return new Promise(async(resolve,reject)=>{
            if ( typeof(post_id) != 'string' || !ObjectId.isValid(post_id) ) {
                reject()
                return
            }
            try {
                let post = await postsCollection.findOne({_id:new ObjectId(post_id)})
                if (post.author  == visitor_id ) {
                    resolve(post)
                } else {
                    reject('you dont have the permission to delet post')
                }
            } catch (error) {
                reject('from sec')
            }
        })
    }
    deletPost(post_id){
        return new Promise(async (resolve,reject)=>{
            try {
                let post = await postsCollection.deleteOne({_id:new ObjectId(post_id)})
                resolve(post)
            } catch (error) {
                reject(error)
            }
        })
    }
    editPost(post_id,body){
        return new Promise(async(resolve,reject)=>{
            try {
                let pos = await postsCollection.findOne({_id: new ObjectId( post_id)})
                
                if (pos.type == 'text') {
                    let post = await postsCollection.findOneAndUpdate({_id: new ObjectId( pos._id)},{$set:{post:body.post,show:body.show}},{returnNewDocument: true})
                    resolve(post)
                } else {
                    let post = await postsCollection.findOneAndUpdate({_id: new ObjectId( pos._id)},{$set:{show:body.show}},{returnNewDocument: true})
                    resolve(post)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}


module.exports=Post