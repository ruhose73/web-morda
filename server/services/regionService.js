const ApiStatus = require('../handlers/apiStatus')
const db = require('../database/db')

class RegionService {

    async findRegion(regionName) {
        const region = await db.query("SELECT st_asgeojson(geometry) AS geometry FROM osm_boundaries WHERE name ~ $1", [regionName])
        if(!region) {
            throw ApiStatus.internal('Ошибка получения геометрии')
        }
        return region.rows
    }
}

module.exports = new RegionService();

