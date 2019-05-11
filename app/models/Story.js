const mongoose = require('mongoose')
const {User} = require('../models/User')
const {responseSchema} = require('./Response')
const Schema = mongoose.Schema

const storySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false,
        required: true
    },
    previewImage: {
        type: String
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
         required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tags"
    }],
    responses: [{
            user:{
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            text : String //[responseSchema]
        
    }],
    claps: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        count: {
            type: Number,
            max: 5
        }
    }]
})

storySchema.methods.clap = function(user_id) {
    const author_id = this.author
  const flag =  JSON.stringify(user_id) === JSON.stringify(author_id) ? true : false
   console.log('flag', flag)
    if(flag){
        //console.log('inside promise reject')
        return Promise.reject({err: "you can't like your story"})
    }else{
       const clap = this.claps.find(clap => {
            return clap.user = user_id
        })
        //console.log('/clap', clap)
        if(clap){
             if(clap.count < 5){
                      clap.count += 1
                      return this.save()
                 }else{
                      return Promise.reject({err: "Maximum clap is 5"})
             }
        }else{
            const storyId = this._id
            const user = user_id
            const count = 1
            this.claps.push({user,count})
            User.findOne({_id: user_id})
                .then((user) => {
                    //console.log('User clap()',user )
                    const index = user.clappedStories.indexOf(storyId)
                    //console.log('clap() index', index)
                   if( index == -1){
                       //not present
                       user.clappedStories.push(storyId)
                       return user.save()
                   }
                   else return user.save()
                })
                .catch(err => {
                    console.log('clap()error',err)
                })
            return this.save()
        }
    }
    
}

storySchema.methods.comment = function(c) {
    this.responses.push(c)
    return this.save()
}

storySchema.methods.getUserStory = function(_id){
    Story.find({author: _id}).then(story => {
        return story
    })
}


storySchema.post('save', function(next){
   const story = this
   const userid = story.author
    User.findOne({_id: userid})
        .then(user => {
            const index = user.stories.indexOf(story._id)
            console.log('post save index()', index)
            if(index == -1) {
                user.stories.push(story._id)
                return user.save()
            }else{
                return user.save()
            }
            // user.stories.push(story._id)
            // User.findOneAndUpdate({
            //     _id: user._id
            // }, {$set: user})
            //     .then(() => {
            //         console.log("update successful")
            //     })
            //     .catch((err) => {
            //         console.log("not successful")
            //     })
        })
        .catch((err) => {
            console.log(" findbyId not working ")
        })
})



const Story = mongoose.model('Story', storySchema)

module.exports = {
    Story
}