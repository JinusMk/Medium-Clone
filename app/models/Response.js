const mongoose = require("mongoose")
const Schema = mongoose.Schema

const responseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: new Date(),
        required: true
    }
})

const Response = mongoose.model("Response", responseSchema)

module.exports = {
    responseSchema,
    Response
}