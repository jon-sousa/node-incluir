var express = require('express');
var router = express.Router();
const {empresa, avaliacao, usuario} = require('./../model')
const {homeController} = require('./../controllers');
const app = require('../app');


/* GET home page. */
router.get('/incluir-avaliacao', async function(req, res, next) {
  let empresas = await empresa.find({})
  console.log(JSON.stringify(empresas))

  avaliacao.incluir(
    {
      id: empresas[0]._id.toString(),
      rampaAcesso: 1,
      placasBraille: 0,
      possuiEquipeTecnica: 0,  
      competenciaEquipeTecnica: 0,
      possuiMetodologiaAdequada: 0,
    }
  )

  avaliacao.incluir(
    {
      id: empresas[1]._id.toString(),
      rampaAcesso: 0,
      placasBraille: 1,
      possuiEquipeTecnica: 1,  
      competenciaEquipeTecnica: 0,
      possuiMetodologiaAdequada: 1,
    }
  )

  avaliacao.incluir(
    {
      id: empresas[2]._id.toString(),
      rampaAcesso: 1,
      placasBraille: 1,
      possuiEquipeTecnica: 0,  
      competenciaEquipeTecnica: 0,
      possuiMetodologiaAdequada: 0,
    }
  )

  avaliacao.incluir(
    {
      id: empresas[3]._id.toString(),
      rampaAcesso: 1,
      placasBraille: 0,
      possuiEquipeTecnica: 0,  
      competenciaEquipeTecnica: 1,
      possuiMetodologiaAdequada: 0,
    }
  )

  avaliacao.incluir(
    {
      id: empresas[4]._id.toString(),
      rampaAcesso: 1,
      placasBraille: 0,
      possuiEquipeTecnica: 0,  
      competenciaEquipeTecnica: 0,
      possuiMetodologiaAdequada: 0,
    }
  )

  res.status(200).send('Tudo certo');
});

router.get('/incluir-empresa', async function(req, res){
  
   await empresa.deleteMany({})

   empresa.insertMany([
     {nome: 'Escola So Inclui no Instagram', cnpj: '0000000000790'}, 
     {nome: 'Escola Inclusiva', cnpj: '0000000000110'}, 
     {nome: 'Escola Quase La', cnpj: '0000000000230'}, 
     {nome: 'Escola Pessima', cnpj: '0000000000450'}, 
     {nome: 'Academia Se Vira', cnpj: '0000000000750'}, 
    
   ],

     function(err){
       if(err){
         res.status(500).send('Algo deu errado...')
       }
      }
  )  

  res.status(200).send('Tudo certo');
})

router.get('/inserir-usuario', async function(req, res){
  try{
    await usuario.create({nome: 'Jonas', email: 'jonas@jonas.com', votou: []})
    res.status(200).send('Tudo certo')
  }
  catch(e){
    res.status(500).send('Erro no servidor')
  }
})


router.get('/consultar', function(req, res){
  empresa.find({}, function(error, docs){
    if(error){
      return res.status(500).send('Algo deu errado')
    }

    return res.status(200).send(docs)
  })
})

router.get('/', homeController.get)
router.post('/empresa-selecionada', homeController.buscarAvaliacaoEmpresa)

module.exports = router;
