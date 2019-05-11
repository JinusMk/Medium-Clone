const express = require('express')
const router = express.Router()
const {Story} = require('../models/Story')
const {authenticateUser} = require('../middleware/authentication')

const { User } = require('../models/User')



router.get('/drafts',authenticateUser,function(req, res){
   // console.log(req.user)
    Story.find({author: req.user._id, isPublished: false}).populate('author')
        .then(function(stories){
            res.send(stories)
        })
        .catch(function(err){
            res.send(err)
        })
})
router.get('/public', authenticateUser, (req, res) => {
    Story.find({author: req.user._id, isPublished: true}).populate('tags').populate('author').populate('responses.user').populate('topic')
        .then((stories)=>{
            res.send(stories)
        })
        .catch(err => {
            res.send(err)
        })
})


router.get('/bookmarks', authenticateUser, (req, res) => {
    User.findOne({_id: req.user._id}).populate('bookmarks')
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.send(err)
        })
})





router.get('/public/:id', (req, res) => {
    const storyId = req.params
    Story.findOne({isPublished: true, _id: req.params.id}).populate('tags').populate('author').populate('responses.user').populate('topic')
        .then(stories => {
            res.send(stories)
        })
        .catch(err => {
            console.log('/public/id error', err)
            res.send({msg: "error in finding the public story", err})
        })
})


// router.get('/:id', authenticateUser, function(req, res){
//     const id = req.params.id
//     const user = req.user
//     Story.findOne({_id: id}).populate({path: 'author'}).populate('topic').populate('responses.user').exec()
//         .then(function(story){
//            // console.log('stories cntrlr -',story)
//             res.send(story)
//         })
//         .catch(function(err){
//             console.log(err)
//             res.send(err)
//         })
// })


router.post('/new', authenticateUser, function(req,res){
        console.log('/new cntrlr', req.body)
    const body = req.body
    const story = new Story(body.formData)
    story.author = req.user._id
    story.save()
        .then(function(story){
            console.log('story saved', story)
            res.send(story)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    
})

router.post('/:id/clap', authenticateUser, function(req, res){
    console.log('inside /clap', req.body)
    Story.findOne({_id: req.body.story_id})
        .then(story => {
            return story.clap(req.user._id)
                        .then((story)=>{
                            console.log('/clap response', story)

                            return res.send({msg: "Done", claps: story.claps})
                        })
                        .catch(err => {
                            console.log('this error', err)
                            return res.send({msg: "clap failed", error: err.err})
                        })
    
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    })

router.post('/:id/bookmark', authenticateUser, (req, res) => {
    User.findOne({_id: req.user._id})
        .then(user => {
           // console.log(user)
           return user.addBookmark(req.body.story_id)
                    .then(user => {
                        return res.send({msg: "Done", bookmarks: user.bookmarks})
                    })
                    .catch(err => {
                        console.log('/bookmark1 Error', err)
                        return res.send({msg: "Bookmark failed", error: err})
                    })
        })
        .catch(err => {
            console.log('/bookmark2 Err', err)
        })
})


router.post('/:id/comment', authenticateUser, function(req, res){
    console.log('comment req.body', req.body)
    const story_id = req.body.story_id
    
    const comment = {
        user : req.user._id,
        text: req.body.comment
    }
    Story.findById(story_id).then(story => {
        return story.comment(comment).then( () => {
            res.send({response: {text: comment.text, user: req.user }, msg: "Comment done successfully "})
        })

    }).catch(err => {
        res.send(err)
        console.log(err)
    })
})

router.get('/edit/:id', authenticateUser, function(req, res){
    const id = req.params.id
    Story.findById(id).populate('tags')
        .then(function(story){
            let sendData = {
                story: story,
                userId: req.user._id
            }
            res.send(sendData)
        })
        .catch(err => {
            res.send(err)
        })
})


router.put('/:id', authenticateUser, function(req, res){
    const body = req.body
    const id = req.params.id
    Story.findOneAndUpdate({
        author: req.user._id,
        _id: id
    }, {$set : body},{new: true, runValidators: true})
        .then(story => {
            res.send(story)
        })
        .catch(err => {
            res.send(err)
        })
})

router.delete('/:id', authenticateUser, function(req,res){
const id = req.params.id
const user = req.user
Story.findOneAndDelete({_id: id,user: user._id})
    .then(deletedStory => {
        res.send(deletedStory)
    })
    .catch(err => {
        res.send(err)
    })
})

// router.post('/:id/clap', authenticateUser, function(req, res){
// Story.findById(req.body.story_id)
//     .then(story => {
//         return story.clap()
//                     .then(()=>{
//                         return res.json({msg: "Done"})
//                     })

//     })
//     .catch(err => {
//         res.send(err)
//     })
// })
module.exports = {
    storiesRouter : router
}

