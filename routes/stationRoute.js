'use strict';
const express = require('express')
const router = express.Router()
const stationController = require('../controllers/stationController')

router.get('/', stationController.station_list_get)

module.exports = router
