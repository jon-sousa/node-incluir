const redis = require('redis')
const client = redis.createClient({
        host: process.env.REDIS_CONNECTION || 'localhost'
})
const {promisify} = require('util')
const hgetallAsync = promisify(client.hgetall).bind(client) 

module.exports = {
    incluir(avaliacao){
        client.multi([
            ['hincrby', avaliacao.id, 'rampaAcesso', avaliacao.rampaAcesso],
            ['hincrby', avaliacao.id, 'placasBraille', avaliacao.placasBraille],
            ['hincrby', avaliacao.id, 'possuiEquipeTecnica', avaliacao.possuiEquipeTecnica],
            ['hincrby', avaliacao.id, 'competenciaEquipeTecnica', avaliacao.competenciaEquipeTecnica],
            ['hincrby', avaliacao.id, 'possuiMetodologiaAdequada', avaliacao.possuiMetodologiaAdequada],
            ['hincrby', avaliacao.id, 'quantidade', 1],
        ])
        .exec(function(err, replies){
            if(err){
                throw new Error(`Erro ao inserir votação no servidor: ${err}`);
            }
        })
    },

    async buscar(chave){
        try{
            let avaliacao = await hgetallAsync(chave)
            return avaliacao
        }
        catch(e){
            console.log('Ocorreu um erro: ' + e)
        }
    }
}
