'use strict';
require('dotenv').config()

const express = require('express')
const app = express()
const db = require('./db')
const port = 3000

const stationRouter = require('./routes/stationRoute')

app.use('/station', stationRouter)

db.on('connected', () => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})
