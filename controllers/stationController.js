'use strict';
const station = require('../models/station')

const station_list_get = (async (req, res) => {
    return res.json(await station.find({}))
})

module.exports = {
    station_list_get,
}
