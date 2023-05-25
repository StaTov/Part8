const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 5
    },
    favoriteGenre:
        { type: String }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)