const mongodb = require("mongodb").MongoClient;
require('dotenv').config()
const connect_string = "mongodb://ismail:loocatortor@cluster0-shard-00-00.ickzv.mongodb.net:27017,cluster0-shard-00-01.ickzv.mongodb.net:27017,cluster0-shard-00-02.ickzv.mongodb.net:27017/dailyNote?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"

mongodb.connect(connect_string,{useNewUrlParser:true},function(err,client){
    module.exports = client
    const app = require('./app')
    app.listen(5000, () => console.log(`db.donnected`))
})