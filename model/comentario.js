const mongoose = require('mongoose')

const comentarioSchema = new mongoose.Schema({
    conteudo: String,
    empresa_id: String,
    usuario_id: String,
    nome_usuario: String
})

module.exports = mongoose.model('Comentario', comentarioSchema)