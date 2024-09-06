const mongoose = require("mongoose")
require('dotenv').config()

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URL
console.log(url)


mongoose.connect(url).then(result => {
    console.log("connected")
})
.catch(error => {
    console.log(error)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: (v) => {
            let [firstHalf] = v.split("-")
            return firstHalf.length > 2
        },
        required: true
    },
})

module.exports = mongoose.model("Person", personSchema)