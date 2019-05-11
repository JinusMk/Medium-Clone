const express = require('express')
const router = express.Router()
const { Topic } = require('../models/Topic')
const { Story} = require('../models/Story')

router.post('/', function(req, res){
    const body = req.body
    const topic = new Topic(body) 
    topic.save()
        .then((topic)=>{
            res.send(topic)
        })
        .catch(err => {
            res.send(err)
        })
})

router.get("/", function(req, res){
    Topic.find()
        .then((topics)=>{
            res.send(topics)
        })
        .catch(err => {
            res.send(err)
        })
})
router.get('/public', (req, res) => {
    Story.find({isPublished: true}).populate('tags').populate('author').populate('response.user').populate('topic')
        .then(stories => {
            res.send(stories)
        })
        .catch(err => {
            console.log('Error-TopicsController', err)
            res.status('401').send(err)
        })
})
router.get('/:id', function(req,res){
    //console.log('Inside Topics Controller Id:', req.params.id)
    const topic_id = req.params.id
    Story.find({topic: topic_id, isPublished: true}).populate('tags').populate('author').populate('responses.user').populate('topic')
        .then((stories) => {
            res.send(stories)
        })
        .catch(err => {
            res.send(err)
            console.log(err)
        })

})



router.put('/:id',function(req,res){
    const id = req.params.id
    const body = req.body
    Topic.findByIdAndUpdate(id, {$set:body}, {new:true, runValidator : true})
        .then(function(topic){
            res.send(topic)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/:id' , function(req,res){
    const id = req.params.id
    Topic.findByIdAndDelete(id) 
        .then(function(topic){
            res.send(topic)
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
topicsRouter : router
}