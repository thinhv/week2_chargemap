'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stationSchema = new Schema({
    Title: String,
    Town: String,
    AddressLine1: String,
    StateOrProvince: String,
    Postcode: String,
    Location: { type: String, coordinates: [Number] },
    Connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }]
})

module.exports = mongoose.model('Station', stationSchema)
