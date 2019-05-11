const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }]
})

const Tags = mongoose.model("Tags", tagSchema)

module.exports = {
    Tags
}