const ApiStatus = require('../handlers/apiStatus')
const cityService = require('../services/cityService')

class CityController {

    //!  http://localhost:5000/map/city/findCity
    async findCity (req,res,next) {
        try{
            const cityName = req.query.cityName
            console.log(cityName)
            if(!cityName){
                return next(ApiStatus.badRequest('Нет города', []))
            }
            const region = await cityService.findCity(cityName)
            console.log(region)
            return region
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CityController()