const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    votouEm: Array
})

module.exports = mongoose.model('Usuario', usuarioSchema)