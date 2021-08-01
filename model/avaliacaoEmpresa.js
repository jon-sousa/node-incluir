const redis = require('redis')
const client = redis.createClient({host: 'redis-incluir'})
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

            console.log(replies)
        })
    },

    async buscar(chave){
        try{
            let avaliacao = await hgetallAsync(chave)
            console.log(`Redis | id: ${chave}, avaliacao: ${JSON.stringify(avaliacao)}`)
            return avaliacao
        }
        catch(e){
            console.log('Ocorreu um erro: ' + e)
        }
        console.log('Fim do metodo')
    }
}
