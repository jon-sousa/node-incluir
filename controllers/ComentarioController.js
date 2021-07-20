const {comentario} = require('./../model')

module.exports = {
    async inserir(req, res){
        try{
            let usuarioLogado = req.session.usuarioLogado

            if(!usuarioLogado){
                return res.status(204).json('erro: usuario não encontrado')
            }
            
            console.log(JSON.stringify(usuarioLogado))
            let novoComentario = {}
            novoComentario.empresa_id = req.body.empresaId
            novoComentario.conteudo = req.body.comentario
            novoComentario.nome_usuario = usuarioLogado.Nome
            novoComentario.usuario_id = usuarioLogado._id
    
            await comentario.create(novoComentario)
            res.status(200).json(JSON.stringify({nome: usuarioLogado.nome, conteudo: req.body.comentario}))
        }
        catch(e){
            res.status(500).json(`{erro: ${e}}`)
        }
    }
}
