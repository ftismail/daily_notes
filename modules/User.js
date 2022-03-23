const multer = require('multer');
const upload = multer({dest: __dirname + '/upload/images'});
const validator = require('validator');
const usersCollection = require('../db').db().collection('users')
const ObjectId = require('mongodb').ObjectId
class User {
    constructor(data){
        this.data=data,
        this.errors= []
    }

    cleanUp(){
        if(typeof(this.data.username) != 'string' ){this.data.username=""}
        if(typeof(this.data.email) != 'string' ){this.data.email=""}
        if(typeof(this.data.password) != 'string' ){this.data.username=""}
        this.data={
            username:this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password:this.data.password,
            day:this.data.day
        }
    }
    validation(){
        return new Promise(async(resolve,reject)=>{
           if (this.data.username == '') {this.errors.push('you must entre a name')}
           if (!validator.isEmail(this.data.email)) {this.errors.push('you must  entre an email')}
           if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) {this.errors.push('user name should include only lettres and numbers')}
           if (this.data.password == '') {this.errors.push('you must should entre a password')}
           if (this.data.password.length > 0 && this.data.password.length < 4) {this.errors.push('your password must be more than 3 characters')}
           if (this.data.password.length > 12) {this.errors.push('your password must be less than 12 characters')}
           if (this.data.username.length > 0 && this.data.username.length < 4) {this.errors.push('your username must be more than 3 characters')}
           if (this.data.username.length > 12) {this.errors.push('your username must be less than 12 characters')}
           //////////////only if username valid///////////////
           
             let userExists = await usersCollection.findOne({username:this.data.username})
             if (userExists) {this.errors.push('sorry this username is already token')}
           
           //////////////only if email valid///////////////
           if (validator.isEmail(this.data.email)) {
             let emailExists = await usersCollection.findOne({email:this.data.email})
             if (emailExists) {this.errors.push('sorry this email is already token')}
           }
           resolve()
        })
          
      }

    register(){
        return new Promise(async (resolve,reject)=>{
            this.cleanUp()
            await this.validation()
            if (!this.errors.length) {
                let results = await usersCollection.insertOne(this.data)
                resolve(results)
            }
            else{
            reject(this.errors)
            }
        })
         
      }
    uploadImg(id,req){
        return new Promise(async(resolve,reject)=>{
            console.log(req.file)
            try {
                if(req.file) {
                let user = await usersCollection.findOneAndUpdate({_id:new ObjectId(id)},{$set:{"img":req.file.filename}},{returnNewDocument: true})
                resolve(user.value)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    login(){
        return new Promise((resolve,reject)=>{
            usersCollection.findOne({email:this.data.email},(err,attemptedUser)=>{
                if( attemptedUser && attemptedUser.password == this.data.password ){
                    resolve(attemptedUser)
                }
                else{
                    reject('your email or password is wrong')
                }
            })
        })
    }
    
    findById(id){
        return new Promise((resolve,reject)=>{
            if ( typeof(id) != 'string' || !ObjectId.isValid(id) ) {
                reject()
                return
            }
            usersCollection.findOne({_id:new ObjectId(id),})
            .then((result)=>{
                if (result) {
                    let doc={
                        _id:result._id,
                        username:result.username,
                        email:result.email,
                        day:result.day,
                        img:result.img
                    }
                    resolve(doc)
                }
                else{
                    reject()
                    console.log("first")
                }
            })
            .catch((err)=>{
                reject(err)
                console.log("second")
            })

        })
    }
}

module.exports=User