var express = require('express');
var router = express.Router();
let {comentarioController} = require('./../controllers')

/* GET users listing. */
router.post('/inserir', comentarioController.inserir);

module.exports = router;
