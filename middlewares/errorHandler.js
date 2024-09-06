const errorHandler = (error, request, response, next) => {
    if (error.name === "NotUniquePerson") {
        return response.status(400).json({
            error: "The person already exists in the Phonebook"
        })
    }

    if (error.name === "CastError") {
        return response.status(400).send({
            error: "malformatted id"
        })
    }

    if (error.name === "ValidationError") {
        return response.status(400).send({
           error: error.message 
        })
    }

    next(error)
}

module.exports = errorHandler