const formAdicionar = document.getElementById('formAdicionar')
const inputItem = document.getElementById('inputItem')
const listaItens = document.getElementById('listaItens')
const btnLimpar = document.getElementById('btnLimpar')
const opcoesExclusivas = document.querySelectorAll('.opcaoExclusiva')


let itens = []
let contador = 0
let parametros = [
    ['ordemAlfabetica', 0],
    ['ordemStatus', 0],
    ['filtroPendentes', 0],
    ['filtroComprados', 0]
];

function atualizarParametros() {
    parametros.forEach(parametro => {
        const idDoParametro = parametro[0]; // Pega o ID (nome) que você associou ao parâmetro
        const checkboxElement = document.getElementById(idDoParametro); // Encontra o checkbox pelo ID

        if (checkboxElement) {
            // Atualiza o valor do parâmetro: 1 se marcado, 0 se não
            parametro[1] = checkboxElement.checked ? 1 : 0;
        } else {
            console.warn(`Checkbox com ID '${idDoParametro}' não encontrado no DOM. Verifique seu HTML.`);
        }
    });
    console.log("Parâmetros atualizados:", parametros); // Para depuração
}

opcoesExclusivas.forEach((checkbox,index) => {
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                opcoesExclusivas.forEach(outraOpcao => {
                    if (outraOpcao !== event.target && outraOpcao.checked) {
                        outraOpcao.checked = false;
                        parametros[index] = 0
                    }
                });
            }
        })

})

window.addEventListener('DOMContentLoaded', () => {
    const dados = localStorage.getItem('listaItens')
    if(dados) {
        itens = JSON.parse(dados)
    } 
    renderizarLista()
})

function salvarDados() {
    localStorage.setItem('listaItens', JSON.stringify(itens))
}

function renderizarLista() {
    
    listaItens.innerHTML = ''
    
    itens.forEach((item, index) => {
        const li = document.createElement('li')
        li.textContent = item[0]

        const btnRemover = document.createElement('button')
        btnRemover.textContent = 'Remover'
        btnRemover.id = 'btnRemover'
        btnRemover.addEventListener('click', () => {
            removerItem(index)
        })
        
        const checkBoxComprado = document.createElement('input')
        checkBoxComprado.type = 'checkbox'
        checkBoxComprado.id = 'checkBoxComprado'
        checkBoxComprado.name = 'checkBoxComprado'
        checkBoxComprado.checked = item[1]
        checkBoxComprado.addEventListener('change', (event) => {
            if (event.target.checked) {
                itens[index] = [item[0],true]
                salvarDados()
            } else {
                itens[index] = [item[0],false]
                salvarDados()
            }
        })


        li.appendChild(checkBoxComprado)
        li.appendChild(btnRemover)
        listaItens.appendChild(li)
    })

    const contadorTotal = document.createElement('li')
    contadorTotal.textContent = contador
    listaItens.appendChild(contadorTotal)
}

formAdicionar.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const itemTexto = inputItem.value.trim()
    if (itemTexto === '') return

    itens.push([itemTexto, false])
    salvarDados()
    inputItem.value = ''
    renderizarLista()
})

function removerItem(indice) {
    itens.splice(indice, 1)
    salvarDados()
    contador -= 1
    renderizarLista()
}

btnLimpar.addEventListener('click', () => {
    if(confirm('Deseja realmente limpar toda a lista?')) { 
        itens = []
        salvarDados()
        contador = 0
        renderizarLista()
    }
})


// Funcionalidades:

// Marcar como comprado - Salvar esse Estado no localStorage - Done
// Contador de Itens - Mostrar quantos itens tem na lista, atualizando em tempo real - Done
// Adicione filtros para itens 'comprados' e 'pedentes' - 
// Permita ordenar alfabeticamente ou por status