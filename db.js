const mongodb = require("mongodb").MongoClient;
require('dotenv').config()
mongodb.connect(process.env.CONNECT_STRING,{useNewUrlParser:true},function(err,client){
    module.exports = client
    const app = require('./app')
    app.listen(process.env.PORT, () => console.log(`db.donnected`))
})
