'use strict';
const Station = require('../models/station');
const Connection = require('../models/connection');

const getPolygonCoordinates = req => {
    const { topLeft, topRight, bottomRight, bottomLeft } = req.query
    if (topLeft === undefined || topRight === undefined || bottomRight === undefined || bottomLeft === undefined) {
        return null
    }

    return [topLeft, topRight, bottomRight, bottomLeft]
        .map(coordinate => JSON.parse(coordinate))
        .map(coordinate => [coordinate.lng, coordinate.lat])
}

const station_list_get = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const coordinates = getPolygonCoordinates(req)

    let query = {}

    if (coordinates) {
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
        return res.json(await Station
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
        const s = await Station
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
        const updatedStation = await Station.findOneAndUpdate({ _id: id }, update)
        if (updatedStation === undefined || updatedStation == null) {
            return res.status(404).json({message: 'Not found'})
        }
        return res.status(202).json()
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const station_post = async (req, res) => {
    try {
        const connections = req.body.Connections;
        const newConnections = await Promise.all(connections.map(async conn => {
            let newConnections = new Connection(conn);
            const result = await newConnection.save();
            return result._id;
        }));

        const station = req.body.Station;
        station.Connections = newConnections;
        station.Location.type = 'Point';

        const newStation = new Station(station);
        const rslt = await newStation.save();
        res.status(201).json(rslt);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const station_delete = async (req, res) => {
    try {
        const stat = await stationModel.findById(req.params.id);
        const delResult = await Promise.all(
            stat.Connections.map(async (conn) => {
              return await Connection.findByIdAndDelete(conn._id);
            }));
        const rslt = await Station.findByIdAndDelete(req.params.id);
        res.json({message: 'station deleted', _id: rslt._id});
    } catch (e) {
        res.status(500).json({message: e.message});
    }    
}

module.exports = {
    station_list_get,
    station_get,
    station_delete,
    station_post,
    station_update
}
