const regionService = require('../services/regionService')
const ApiStatus = require('../handlers/apiStatus')
const db = require('../database/db')

class RegionController {

    //!  http://localhost:5000/map/region/findRegion
    async findRegion (req,res,next) {
        try{
            const regionName = req.query.regionName
            if(!regionName){
                return next(ApiStatus.badRequest('Нет региона', []))
            }
            const region = await db.query("SELECT ST_AsGeoJSON(geometry) AS geometry FROM osm_boundaries WHERE name ~ $1", [regionName])
            console.log(region.rows)
            return res.json(region.rows)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new RegionController()