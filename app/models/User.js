const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
            type: String,
            required: true,
            unique: true,
            validate:{
                validator: function(value){
                    return validator.isEmail(value)
                },
                message: function(){
                    return 'Invalid email'
                }
            }
        },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref:"Story"
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    clappedStories: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }],
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

userSchema.methods.follow = function(user_id){
    
if(this.following.indexOf(user_id) === -1) {
    this.following.push(user_id)
    return this.save()
    }
   else return Promise.reject('Already following')

}

userSchema.methods.unfollow = function (user_id)  {
    const index = this.following.indexOf(user_id)
    if(index != -1){
        this.following.splice(index, 1)
        return this.save()
    }else if(this.following.indexOf(user_id) === -1){
       return  Promise.reject('Not following this user')
    }
}

userSchema.methods.addFollower = function(fs) {
    this.followers.push(fs)
}

userSchema.methods.addBookmark = function(story_id){
   console.log('inside addbookmark')
   if(this.bookmarks.indexOf(story_id) === -1){
       this.bookmarks.push(story_id)
       return this.save()
   }else return Promise.reject('Already Bookmarked') 
}

userSchema.pre('save',function(next){
    const user = this //referring to the particular record
    if(user.isNew){
        bcryptjs.genSalt(10) //10 -> no of rounds
        .then(function(salt){
            bcryptjs.hash(user.password,salt)
                  .then(function(encryptedPassword){
                      user.password = encryptedPassword
                      next()
                  })
        })
    }else{
        next()
    }
   
})

userSchema.statics.findByCredentials = function(email, password){
    const User = this //this will be referring to the model
    return User.findOne({email}) //User.findOne({email:email}) //es6 feature
        .then(function(user){
            //console.log(user)
            if(!user){
                return Promise.reject('Invalid email/password')
            }
            return bcryptjs.compare(password, user.password)
                .then(function(result){
                    if(result){
                       return Promise.resolve(user)
                       //new Promise(function (resolve, reject){ resolve(user)})
                    }else{
                     return Promise.reject('Invalid password/email')
                    }
                })
     })
     .catch(function(err){
         return Promise.reject(err)
     })
}

userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token, 'jwt@123')
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}

userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
    _id : user._id,
    username: user.username,
    createdAt: Number(new Date()) //epoc time
    }
    const token = jwt.sign(tokenData,'jwt@123')
    user.tokens.push({ //pushing token in to tokens property of user
        token
    })

    return user.save()
        .then(function(user){ //when the user is saved, we get a user record back. But we are resolve the promise with the token
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}



const User = mongoose.model('User', userSchema)
module.exports = {
User
}