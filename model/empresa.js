const mongoose = require('mongoose')

const empresaSchema = new mongoose.Schema({
    cnpj: String,
    nome: String,
})

module.exports = mongoose.model('Empresa', empresaSchema)