const {empresa, avaliacao, usuario} = require('./../model')

module.exports = {
     async get(req, res){
        try{
            let empresas = await empresa.find({})

            let usuarioLogado = await usuario.findOne({email: 'mike@mike.com'})
            
            if(usuarioLogado){
                req.session.usuarioLogado = usuarioLogado
            }

            req.session.data = {}
            
            res.render('home', {title: 'Empresas Inclusivas', empresas: empresas})
        }
        catch(e){
            res.status(500).send('Algo deu errado: ' + e)
        }
    },

    async buscarAvaliacaoEmpresa(req, res){
        
        try{
            let usuario = req.session.usuarioLogado
            let habilitarVotacao = false

            let id = req.body.id;
            let avaliacaoDaEmpresa = await avaliacao.buscar(id);
            
            if(!avaliacaoDaEmpresa) return res.status(200).json({_id: id, habilitarVotacao: true})
            
            if(usuario){
                if(usuario.votouEm.indexOf(id) === -1){
                    habilitarVotacao = true
                } 
            }
    
            avaliacaoDaEmpresa.habilitarVotacao = habilitarVotacao
            avaliacaoDaEmpresa._id = id

            return res.status(200).json(avaliacaoDaEmpresa)
        }
        catch(e){
            res.status(500).send('Ocorreu um erro: ' + e)
        }
        
    },

    async votarEmpresa(req, res){
        try{
            let usuarioLogado = req.session.usuarioLogado

            if(!usuarioLogado){
                return res.status(203).send('Usuário não logado')
            }

            let votacaoRecebida = req.body
            avaliacao.incluir(votacaoRecebida)
            usuarioLogado.votouEm.push(votacaoRecebida.id)
            await usuario.updateOne({_id: usuarioLogado._id}, {$push: {votouEm: votacaoRecebida.id}})
            let avaliacaoAtualizada = await avaliacao.buscar(votacaoRecebida.id)
            res.status(200).json(avaliacaoAtualizada)
        }
        catch(err){
            res.status(500).send('Erro: ' + err)
        }
    }
}