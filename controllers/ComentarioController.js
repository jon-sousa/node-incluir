const {comentario} = require('./../model')

module.exports = {
    async inserir(req, res){
        try{
            let usuarioLogado = req.session.usuarioLogado

            if(!usuarioLogado){
                return res.status(204).json('erro: usuario não encontrado')
            }
            
            let novoComentario = {}
            novoComentario.empresa_id = req.body.empresaId
            novoComentario.conteudo = req.body.comentario
            novoComentario.nome_usuario = usuarioLogado.nome
            novoComentario.usuario_id = usuarioLogado._id
            novoComentario.data = new Date(req.body.data)
    
            const comentarioInserido = await comentario.create(novoComentario)
            console.log('Comentario inserido: ' + JSON.stringify(comentarioInserido))
            if(!comentarioInserido) return res.status(500).send('Erro ao inserir comentario')

            const comentarioAEnviar = {nome_usuario: comentarioInserido.nome_usuario, conteudo: comentarioInserido.conteudo}
            res.status(200).json(JSON.stringify(comentarioAEnviar))
        }
        catch(e){
            res.status(500).json(`{erro: ${e}}`)
        }
    },

    async consultar(req, res){
        let empresaId = req.params.id
        
        if(!req.session.data) req.session.data = {}
        let ultimaData = req.session.data[empresaId] || new Date()

        try{
            let comentarios = await comentario.find({
                empresa_id: empresaId,
                data: {$lt: ultimaData}
            }, '_id nome_usuario conteudo data')
            .sort({data: -1})
            .limit(5)

            console.log(JSON.stringify(comentarios))

            if(comentarios.length)
                req.session.data[empresaId] = comentarios[comentarios.length-1].data

            res.status(200).json(JSON.stringify(comentarios))
        }
        catch(e){
            console.log(`Erro ao buscar comentário no servidor: ${e}`)
            res.status(500).send('')
        }
    },
    
    async excluir(req, res){
        try{
            await comentario.findByIdAndDelete({_id: `${req.params.id}`})
            res.status(203).send()
        }
        catch(e){
            console.log(`Erro ao excluir comentário no servidor: ${e}`)
            res.status(500).send('')
        }
    }
}