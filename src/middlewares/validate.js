module.exports = (scheme) => {

    return (req, res, next) => {
        let result = scheme.validate(req.body)//aqui valida los datos de entrada de el esquema
        if (result.error) {
            next(result.error)
        } else {
            console.log("Si valida")
            next()//con next continia con la siguiente instrucción
        }
    }
}