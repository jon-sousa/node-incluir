
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
        <div data-type="comentarios">
            <div class="" onclick="comentarios(this)">Comentários</div>
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn btn-outline-secondary" type="button" id="" onclick="comentar(this)" data-empresa = ${tagEmpresa.id}>Button</button>
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
        empresaId: empresaId
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
        console.log(`Response: ${response}`)
        if(response){
            response = JSON.parse(response)
            let comentarios = tagName.parentNode.previousElementSibling
            comentarios.innerHTML += `<div><strong>${response.nome}</strong>: ${response.conteudo}</div>`
        }
    })
    .catch(erro => console.log(`Ocorreu um erro ao inserir comentário: ${erro}`))
}

function comentarios(tagComentario){
    
}