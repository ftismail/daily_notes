const postsCollection = require('../db').db().collection('posts')
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
}


module.exports=Post