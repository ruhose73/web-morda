const ApiError = require('../handlers/apiStatus')
const db = require('../database/db')

class CityService {

    async findCity(cityName) {
        const city = await db.query("SELECT ST_AsGeoJSON(geometry) AS geometry FROM osm_cities WHERE name ~ $1", [cityName])
        if(!city) {
            throw ApiStatus.internal('Ошибка получения геометрии')
        }
        return city
    }
}

module.exports = new CityService();