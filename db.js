const mongodb = require("mongodb").MongoClient;
require('dotenv').config()
const connect_string = process.env.CONNECT_STRING

mongodb.connect(connect_string,{useNewUrlParser:true},function(err,client){
    module.exports = client
    const app = require('./app')
    app.listen(process.env.PORT, () => console.log(`db.donnected`))
})