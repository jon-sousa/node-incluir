const mongoose = require('mongoose')

const comentarioSchema = new mongoose.Schema({
    conteudo: String,
    empresa_id: String,
    usuario_id: String,
    nome_usuario: String,
    data: Date
})

module.exports = mongoose.model('Comentario', comentarioSchema)