'use strict';
const station = require('../models/station')

const getPolygonCoordinates = req => {
    const { topLeft, topRight, bottomRight, bottomLeft } = req.query
    if (topLeft === undefined || topRight === undefined || bottomRight === undefined || bottomLeft === undefined) {
        return null
    }

    return [topLeft, topRight, bottomRight, bottomLeft]
        .map(coordinate => JSON.parse(coordinate))
        .map(coordinate => [coordinate.lat, coordinate.lng])
}

const station_list_get = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const coordinates = getPolygonCoordinates(req)

    let query = {}

    if (coordinates) {
        console.log(coordinates)
        const polygon = {
            type: 'Polygon',
            coordinates: [coordinates]
        }

        query = {
            Location: {
                $geoWithin: {
                  $geometry: polygon
                }
            }
        }
    }

    try {
        return res.json(await station
            .find(query)
            .skip(page * limit)
            .limit(limit)
            .populate({
                path: "Connections",
                populate: ['ConnectionTypeID', 'CurrentTypeID', 'LevelID']
            })
        )
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const station_get = async (req, res) => {
    const { id } = req.params
    try {
        const s = await station
        .findById(id)
        .populate({
            path: "Connections",
            populate: ['ConnectionTypeID', 'CurrentTypeID', 'LevelID']
        })
        return res.status(200).json(s)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const station_update = async (req, res) => {
    const { id } = req.params
    const update = req.body
    try {
        const updatedStation = await station.findOneAndUpdate({ _id: id }, update)
        if (updatedStation === undefined || updatedStation == null) {
            return res.status(404).json({message: 'Not found'})
        }
        return res.status(202).json()
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const station_create = async (req, res) => {
    return res.status(500).json({message: 'Underconstruction'})
}

const station_delete = async (req, res) => {
    const { id } = req.params
    try {
        // TODO: findOneAndDelete?
        await station.findOneAndDelete({ _id: id })
        return res.status(202).json()
    } catch (e) {
        return res.status(500).json()
    }
}

module.exports = {
    station_list_get,
    station_get,
    station_delete,
    station_create,
    station_update
}
