const express = require('express')
const router = express.Router()
const {User} = require('../models/User')
const {authenticateUser} = require('../middleware/authentication')
const {Story} = require('../models/Story')
// const localStorage = require('local-storage')

router.post('/register',function(req,res){
    const body = req.body
    const user = new User(body)
    
    user.save()
    .then(function(user){
        console.log('successfully registered')
        res.send(user)
    })
    .catch(function(err){
        console.log('error - register', err)
        res.send(err)
    })
   // res.send('Registration successful')
})
router.get('/account',authenticateUser,function(req,res){
    //console.log('inside account controller')
     const {user} = req
     res.send(user)
 
 })

router.get('/profile/:id', function(req,res){
    User.findById(req.params.id).populate('clappedStories')
        .then((_user)=>{
           //console.log('profile controller -> user ->', _user)
            return User.find({'following': req.params.id})
                .then((_users)=>{
                   // console.log('followers ->', _users)
                    _users.forEach(user_ => {
                        _user.addFollower(user_._id)
                    })
                    return Story.find({author: req.params.id})
                                .then((_stories)=>{
                                    //console.log('stories ->', _stories)
                                    return res.json({user: _user, stories:_stories})
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.send(err)
                                })
                })
                .catch((err) => {
                    console.log('ERROR - profile controller')
                    res.send(err)
                })
        })
        .catch(err => {
            console.log('ERROR - this', err)

        })
})
router.get('/:id', function(req, res){
    const id = req.params.id
    User.findById(id)
        .then(function(user){
            res.send(user)
        })
        .catch((err)=>{
            res.send(err)
        })
})




router.post('/follow',authenticateUser, function(req, res){
   
    if(req.user._id == req.body.user_id){
        return res.json({msg: "you can't follow yourself"})
    }
    User.findById(req.user._id) //current user req.user._id
        .then((user) => {
            return user.follow(req.body.user_id) //user_id -> user to follow
                        .then(() => {
                            res.json({msg: "followed"})
                        })
                        .catch(err => {
                            res.json({err})
                        })
            
        })
})
router.post('/unfollow', authenticateUser, function(req, res){
    User.findById(req.user._id)
        .then((user) => {
            return user.unfollow(req.body.user_id)
                        .then(()=>{
                            res.json({msg: "Unfollowed"})
                        })
                        .catch(err => {
                            res.json({err})
                        })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/login',function(req, res){
    const body = req.body

    User.findByCredentials(body.email, body.password) 
        .then(function(user){
            return user.generateToken() 
        })
        .then(function(token){
            //console.log('token generated:', token)
            res.send({token}) 
        })
        
        .catch(function(err){ 
          //  console.log(err)
            res.status(404).send(err)
        })
     
})


router.delete('/logout',authenticateUser,function(req,res){
    const {user,token} = req
    User.findByIdAndUpdate(user._id, { $pull: {tokens:{token:token}}}) // $pull -> to remove an element from an array//tokens array -> token property -> token incoming token info:(matching)
            .then(function(){
                res.send('Successfully logged out!')
            })
            .catch(function(err){
                res.send(err)
            })
})


module.exports = {
    usersRouter: router
}




