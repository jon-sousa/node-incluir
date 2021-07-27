
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
        
        tagEmpresa.innerHTML += `<div>
            <div>
                <p>Quantidade de votos</p>
                <p>${avaliacaoRecebida.quantidade}</p>
            </div>
            <div>
                <p>Rampa de acesso</p>
                <p>${avaliacaoRecebida.rampaAcesso}</p>
            </div>
            <div>
                <p>Placas em braille</p>
                <p>${avaliacaoRecebida.placasBraille}</p>
            </div>
            <div>
                <p>Possui equipe técnica?</p>
                <p>${avaliacaoRecebida.possuiEquipeTecnica}</p>
            </div>
            <div>
                <p>Competência da equipe técnica</p>
                <p>${avaliacaoRecebida.competenciaEquipeTecnica}</p>
            </div>
            <div>
                <p>Possui metodologia adequada?</p>
                <p>${avaliacaoRecebida.possuiMetodologiaAdequada}</p>
            </div>
        </div>
        <div>
            <div data-type="comentarios">
                <h3 class="pointer" onclick="comentarios(this)" data-empresa = ${tagEmpresa.id}>Comentários</h3>
                <div id="comentarios"></div>
            </div>
            <div class="hidden">
                <input type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="comentar(this)" data-empresa = ${tagEmpresa.id}> Inserir </button>
            </div>
        </div>
        `

        tagEmpresa.dataset.click = true
        tagEmpresa.className = 'container'
    })
}

function comentar(tagName){
    let comentario = tagName.previousElementSibling.value
    let empresaId = tagName.dataset.empresa
    let body = {
        comentario: comentario, 
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
                        `<div id=${comentario._id}>
                            <p><strong>${comentario.nome_usuario}</strong>: ${comentario.conteudo}</p>
                            <button class='btn btn-warning' onclick='excluirComentario(this)'>Excluir</button>
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