'use strict';
const express = require('express')
const router = express.Router()
const stationController = require('../controllers/stationController')
const bodyParser = require('body-parser')
router.get('/', stationController.station_list_get)
router.get('/:id', stationController.station_get)

router.delete('/:id', stationController.station_delete)
router.patch('/:id', bodyParser.urlencoded({ extended: false }),stationController.station_update)
router.post('/', stationController.station_create)

module.exports = router
