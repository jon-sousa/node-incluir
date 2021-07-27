var express = require('express');
var router = express.Router();
let {comentarioController} = require('./../controllers')

/* GET users listing. */
router.post('/inserir', comentarioController.inserir)
router.get('/consultar/:id', comentarioController.consultar)
router.delete('/excluir/:id', comentarioController.excluir)

module.exports = router;
