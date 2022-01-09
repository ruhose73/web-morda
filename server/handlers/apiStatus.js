module.exports = class ApiStatus extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    //Ошибки клиента
    static badRequest(message, errors = []){
        return new ApiStatus(400, message, errors)
    }

    static forbidden(message, errors = []){
        return new ApiStatus(403, message, errors)
    }

    //ошибки сервера
    static internal(message, errors = []){
        return new ApiStatus(500, message, errors)
    }

    //Успех
    static ok(message){
        return new ApiStatus(200,message)
    }

    static noContent(message){
        return new ApiStatus(204,message)
    }
}
