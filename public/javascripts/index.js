
function expandir(tagEmpresa){
    if(tagEmpresa.dataset.click != 'false'){
        return
    }

    fetch('/empresa-selecionada',
        {
            headers: new Headers({'Content-Type': 'application/json'}),
            method: 'POST',
            body: JSON.stringify({id : tagEmpresa.id})
        }
    )
    .then(response => {
        if(!response){
            return ''
        }
        
        return response.json()
    })
    .then(avaliacaoRecebida => {
        tagEmpresa.getElementsByClassName('card-body')[0].innerHTML += (renderizarVotacao(avaliacaoRecebida) + renderizarCorpoEmpresa(avaliacaoRecebida))
        
        tagEmpresa.dataset.click = true
    })
    .catch(err => console.log(`Erro: ${err}`))
}

function renderizarVotacao(avaliacaoRecebida){
    if(avaliacaoRecebida.habilitarVotacao){
        return `<div class="accordion mt-3 mb-3" id="accordion${avaliacaoRecebida._id}">
            <div class="accordion-item">
            <h2 class="accordion-header" id="heading${avaliacaoRecebida._id}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#votacao${avaliacaoRecebida._id}" aria-expanded="true" aria-controls="votacao${avaliacaoRecebida._id}">
                Votar
            </button>
            </h2>
            <div id="votacao${avaliacaoRecebida._id}" class="accordion-collapse collapse" aria-labelledby="heading${avaliacaoRecebida._id}" data-bs-parent="#accordion${avaliacaoRecebida._id}">
            <div class="accordion-body">
                
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Possui Rampa de acesso?
                    </label>
                    <input class="form-check-input" type="checkbox" data-referencia='rampaAcesso' value=""">
                </div>
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Possui placas em braille?
                    </label>
                    <input class="form-check-input" type="checkbox" data-referencia='placasBraille' value="">
                </div>
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Possui equipe t??cnica?
                    </label>
                    <input class="form-check-input" type="checkbox" data-referencia='possuiEquipeTecnica' value="">
                </div>
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Equipe t??cnica ?? competente?
                    </label>
                    <input class="form-check-input" type="checkbox" data-referencia='competenciaEquipeTecnica' value="">
                </div>
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Possui metodologia adequada?
                    </label>
                    <input class="form-check-input" type="checkbox" data-referencia='possuiMetodologiaAdequada' value="">
                </div>
                <button class="btn btn-success" onclick="votar(this.parentNode, '${avaliacaoRecebida._id}')">Votar</button>

            </div>
            </div>
        </div>
      </div>`
    }

    return ''
}

function renderizarCorpoEmpresa(avaliacaoRecebida){
    return `${renderizarAvaliacaoLista(avaliacaoRecebida)}
            <div class="">
                <div data-type="comentarios">
                    <h7 class="btn btn-info w-100 mb-1 pointer" onclick="comentarios(this)" data-empresa = ${avaliacaoRecebida._id}>Coment??rios</h7>
                    <div id="comentarios"></div>
                </div>
                <div class="hidden">
                    <input type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="" onclick="comentar(this)" data-empresa = ${avaliacaoRecebida._id}> Inserir </button>
                </div>
            </div>
            `
}

function renderizarAvaliacaoLista(avaliacaoRecebida){
    return `<ul class="group-list">
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Quantidade de votos:</p>
            <p><strong>${avaliacaoRecebida.quantidade}</strong></p>
        </li">
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Rampa de acesso?</p>
            <p><strong>${avaliacaoRecebida.rampaAcesso}</strong></p>
        </li>
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Placas em braille?</p>
            <p><strong>${avaliacaoRecebida.placasBraille}</strong></p>
        </li>
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Possui equipe t??cnica?</p>
            <p><strong>${avaliacaoRecebida.possuiEquipeTecnica}</strong></p>
        </li>
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Equipe t??cnica competente?</p>
            <p><strong>${avaliacaoRecebida.competenciaEquipeTecnica}</strong></p>
        </li>
        <li class="list-group-item d-flex justify-content-start">
            <p class="me-3">Possui metodologia adequada?</p>
            <p><strong>${avaliacaoRecebida.possuiMetodologiaAdequada}</strong></p>
        </li>
    </ul>`
}

function comentar(tagName){
    let comentario = tagName.previousElementSibling
    let empresaId = tagName.dataset.empresa
    let body = {
        comentario: comentario.value, 
        empresaId: empresaId,
        data: new Date()
    }
    fetch('/comentario/inserir', {
        headers: new Headers({'Content-Type': 'application/json'}),
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }

        return ''
    })
    .then(response => {
        if(response){
            response = JSON.parse(response)
            let comentarios = tagName.parentNode.previousElementSibling.lastElementChild
            comentarios.innerHTML += 
                                `<div class="d-flex justify-content-between mb-1 border border-1" id=${response._id}>
                                    <p class="text-break" ><strong>${response.nome_usuario}</strong>: ${response.conteudo}</p>
                                    <button class='btn btn-warning btn-sm' onclick='excluirComentario(this)'>Excluir</button>
                                </div>`
        }

        comentario.value = ''
    })
    .catch(erro => console.log(`Ocorreu um erro ao inserir coment??rio: ${erro}`))
}

function comentarios(tagComentario){
    let empresa = tagComentario.dataset.empresa

    fetch(`/comentario/consultar/${empresa}`)
        .then(response => response.json())
        .then(response => {
            let comentarios = JSON.parse(response)
            let comentariosInseridos =comentarios.reduce(
                (acumulador, comentario) => 
                    acumulador += 
                        `<div class="d-flex justify-content-between mb-1 border border-1" id=${comentario._id}>
                            <p class="text-break"><strong>${comentario.nome_usuario}</strong>: ${comentario.conteudo}</p>
                            <button class='btn btn-warning btn-sm' onclick='excluirComentario(this)'>Excluir</button>
                        </div>`,
                    ''
                )
            
            let tagComentar = tagComentario.parentNode.nextElementSibling
            tagComentar.className = 'input-group mb-3'
            tagComentario.innerHTML = 'Coment??rios mais antigos'
            tagComentario.nextElementSibling.innerHTML += comentariosInseridos
        })
        .catch(error => console.log(`Erro ao consultar coment??rios: ${error}`))
}

function excluirComentario(tagName){
    let comentario = tagName.parentNode
    fetch(`/comentario/excluir/${comentario.id}`, {method: 'DELETE'})
    .then(result => {
        if(result.ok){
            comentario.remove()
        }
    })
    .catch(err => console.log(`Erro> ${err}`))
}

function votar(tagName, id){
    let itens = tagName.getElementsByTagName('input')
    let voto = {}
    voto.id = id

    for(let i = 0; i < itens.length; i++){
        let item = itens[i]
        voto[item.dataset.referencia] = Number(item.checked)    
    }

    fetch('/votar-empresa',
        {
            headers: new Headers({'Content-Type': 'application/json'}),
            method: 'POST',
            body: JSON.stringify(voto)
        }
    )
    .then(response =>{
            if(response.ok){
                return response.json()
            }
        })
    .then(response => {
        let flashMessage = document.createElement('div')
        flashMessage.className = 'alert alert-success'
        flashMessage.innerHTML = 'Voto inclu??do com sucesso'

        let avaliacaoAtualizada = document.createElement('ul')
        avaliacaoAtualizada.className = 'group-list'
        avaliacaoAtualizada.innerHTML = renderizarAvaliacaoLista(response)

        let votacaoDiv = tagName.parentNode.parentNode.parentNode
        let body = votacaoDiv.parentNode
        body.replaceChild(flashMessage, votacaoDiv)

        let avaliacaoDiv = body.getElementsByTagName('ul')[0]
        body.replaceChild(avaliacaoAtualizada, avaliacaoDiv)

    })
    .catch(err => console.log(`Erro ao incluir vota????o: ${err}`))
}