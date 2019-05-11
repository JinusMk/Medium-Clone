const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/medium-blog', {useNewUrlParser: true})
    .then(function(){
        console.log('Connected to db!')
    })
    .catch(function(err){
        console.log('OOPS!something went wrong with the db connection!')
    })
module.exports = {
    mongoose
}