'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('./connection')
require('./connectionType')
require('./currentType')
require('./level')

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })

const stationSchema = new Schema({
    Title: String,
    Town: String,
    AddressLine1: String,
    StateOrProvince: String,
    Postcode: String,
    Location: pointSchema,
    Connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }]
})

module.exports = mongoose.model('Station', stationSchema)
