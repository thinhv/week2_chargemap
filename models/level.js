const mongoose = require('mongoose')
const Schema = mongoose.Schema

const levelSchema = new Schema({
    Title: String,
    Comments: String,
    IsFastChargeCapable: Boolean
})

module.exports = mongoose.model('Level', levelSchema)