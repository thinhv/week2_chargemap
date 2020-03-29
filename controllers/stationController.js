'use strict';
const station = require('../models/station')

const station_list_get = (async (req, res) => {   
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    return res.json(await station
        .find({})
        .skip(page * limit)
        .limit(limit)
        .populate({ 
            path: "Connections", 
            populate: [ 'ConnectionTypeID', 'CurrentTypeID', 'LevelID' ]
        })
    )
})

module.exports = {
    station_list_get,
}
