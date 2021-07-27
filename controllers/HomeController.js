const {empresa, avaliacao, usuario} = require('./../model')

module.exports = {
     async get(req, res){
        try{
            let empresas = await empresa.find({})

            let usuarioLogado = await usuario.findOne({email: 'jonas@jonas.com'})
            
            if(usuarioLogado){
                req.session.usuarioLogado = usuarioLogado
            }

            req.session.data = {}
            
            res.render('home', {title: 'Home', empresas: empresas})
        }
        catch(e){
            res.status(500).send('Algo deu errado: ' + e)
        }
    },

    async buscarAvaliacaoEmpresa(req, res){
        
        try{
            let id = req.body.id;
            let avaliacaoDaEmpresa = await avaliacao.buscar(id);

            if(!avaliacaoDaEmpresa){
                return res.status(204).send('Não encontrado')
            }

            return res.status(200).json(avaliacaoDaEmpresa)
        }
        catch(e){
            res.status(500).send('Ocorreu um erro: ' + e)
        }
        
    }
}