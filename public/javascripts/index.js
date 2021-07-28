
function expandir(tagEmpresa){
    console.log(`Tag id: ${tagEmpresa.id} clicou: ${tagEmpresa.dataset.click}`)

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
        console.log(tagEmpresa)
        tagEmpresa.getElementsByClassName('card-body')[0].innerHTML += 
            `<ul class="group-list">
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
                    <p class="me-3">Possui equipe técnica?</p>
                    <p><strong>${avaliacaoRecebida.possuiEquipeTecnica}</strong></p>
                </li>
                <li class="list-group-item d-flex justify-content-start">
                    <p class="me-3">Equipe técnica competente?</p>
                    <p><strong>${avaliacaoRecebida.competenciaEquipeTecnica}</strong></p>
                </li>
                <li class="list-group-item d-flex justify-content-start">
                    <p class="me-3">Possui metodologia adequada?</p>
                    <p><strong>${avaliacaoRecebida.possuiMetodologiaAdequada}</strong></p>
                </li>
            </ul>
            <div class="">
                <div data-type="comentarios">
                    <h7 class="btn btn-info center-block pointer" onclick="comentarios(this)" data-empresa = ${tagEmpresa.id}>Comentários</h7>
                    <div id="comentarios"></div>
                </div>
                <div class="hidden">
                    <input type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="" onclick="comentar(this)" data-empresa = ${tagEmpresa.id}> Inserir </button>
                </div>
            </div>
            `

        tagEmpresa.dataset.click = true
    })
}

function comentar(tagName){
    let comentario = tagName.previousElementSibling
    let empresaId = tagName.dataset.empresa
    let body = {
        comentario: comentario.value, 
        empresaId: empresaId,
        data: new Date()
    }
    console.log(JSON.stringify(body))
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
        console.log(`Response: ${response}`)
        if(response){
            response = JSON.parse(response)
            let comentarios = tagName.parentNode.previousElementSibling.lastElementChild
            comentarios.innerHTML += 
                                `<div id=${response._id}>
                                    <p><strong>${response.nome_usuario}</strong>: ${response.conteudo}</p>
                                    <button class='btn btn-warning' onclick='excluirComentario(this)'>Excluir</button>
                                </div>`
        }

        comentario.value = ''
    })
    .catch(erro => console.log(`Ocorreu um erro ao inserir comentário: ${erro}`))
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
                        `<div class="d-flex justify-content-between mb-1" id=${comentario._id}>
                            <p><strong>${comentario.nome_usuario}</strong>: ${comentario.conteudo}</p>
                            <button class='btn btn-warning btn-sm' onclick='excluirComentario(this)'>Excluir</button>
                        </div>`,
                    ''
                )
            
            console.log('tag atual: ')
            console.log(tagComentario)

            console.log('tag pai: ')
            console.log(tagComentario.parentNode)

            console.log('tag tia: ')
            console.log(tagComentario.parentNode.nextElementSibling)

            console.log('tag irma: ')
            console.log(tagComentario.nextElementSibling)

            let tagComentar = tagComentario.parentNode.nextElementSibling
            tagComentar.className = 'input-group mb-3'
            tagComentario.innerHTML = 'Comentários mais antigos'
            tagComentario.nextElementSibling.innerHTML += comentariosInseridos
        })
        .catch(error => console.log(`Erro ao consultar comentários: ${error}`))
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