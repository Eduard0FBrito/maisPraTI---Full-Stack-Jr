const formAdicionar = document.getElementById('formAdicionar');
const inputItem = document.getElementById('inputItem');
const listaItens = document.getElementById('listaItens');
const btnLimpar = document.getElementById('btnLimpar');
const filtroExclusivo = document.querySelectorAll('.filtroExclusivo');
const ordemExclusiva = document.querySelectorAll('.ordemExclusiva');
const itensPendentesSpan = document.getElementById('itensPendentes');
const itensCompradosSpan = document.getElementById('itensComprados');
const totalItensSpan = document.getElementById('totalItens');


let itens = []; // Formato: [['nome do item', true/false (comprado)]]

// Os contadores serão calculados dinamicamente ou incrementados/decrementados
let contadorTotal = 0;
let contadorPendentes = 0;
let contadorComprados = 0;

// Parâmetros para filtros e ordenação. 0 = desativado, 1 = ativado
let parametros = [
    ['ordemAlfabetica', 0], // index 0
    ['ordemStatus', 0],     // index 1
    ['filtroPendentes', 0], // index 2
    ['filtroComprados', 0]  // index 3
];

//Gerenciamento de Dados (LocalStorage)

// Carrega os dados do localStorage ao iniciar a página
window.addEventListener('DOMContentLoaded', () => {
    const dados = localStorage.getItem('listaItens');
    if (dados) {
        itens = JSON.parse(dados);
    }
    // Carrega os parâmetros de filtro/ordenação
    const paramsSalvos = localStorage.getItem('parametros');
    if (paramsSalvos) {
        parametros = JSON.parse(paramsSalvos);
        // Atualiza os checkboxes no HTML para refletir o estado salvo
        filtroExclusivo.forEach(checkbox => {
            const param = parametros.find(p => p[0] === checkbox.name);
            if (param) checkbox.checked = param[1] === 1;
        });
        ordemExclusiva.forEach(checkbox => {
            const param = parametros.find(p => p[0] === checkbox.name);
            if (param) checkbox.checked = param[1] === 1;
        });
    }
    renderizarLista(); // Renderiza a lista inicial
});

// Salva os dados (itens e parâmetros) no localStorage
function salvarDados() {
    localStorage.setItem('listaItens', JSON.stringify(itens));
    localStorage.setItem('parametros', JSON.stringify(parametros)); // Salva também os parâmetros
}

// Funções de Manipulação da Lista

// Adiciona um novo item
formAdicionar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const itemTexto = inputItem.value.trim();
    if (itemTexto === '') return;

    itens.push([itemTexto, false]); // Adiciona o item com status "pendente"
    salvarDados();
    inputItem.value = '';
    renderizarLista();
});

// Remove um item
function removerItem(indice) {
    itens.splice(indice, 1); // Remove o item do array
    salvarDados();
    renderizarLista(); // renderiza a lista
}

// Limpa toda a lista
btnLimpar.addEventListener('click', () => {
    if (confirm('Deseja realmente limpar toda a lista?')) {
        itens = []; // Esvazia o array de itens
        salvarDados();
        renderizarLista(); // renderiza a lista vazia
    }
});

// Lógica de Filtro e Ordenação

// Gerencia os checkboxes de ordenação (exclusivos)
ordemExclusiva.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        const clickedCheckboxName = event.target.name;

        if (event.target.checked) {
            // Se o checkbox foi marcado, desmarca os outros
            ordemExclusiva.forEach(outraOpcao => {
                if (outraOpcao !== event.target && outraOpcao.checked) {
                    outraOpcao.checked = false;
                    const outroParametroIndex = parametros.findIndex(param => param[0] === outraOpcao.name);
                    if (outroParametroIndex !== -1) {
                        parametros[outroParametroIndex][1] = 0; // Atualiza o parâmetro desmarcado
                    }
                }
            });
            // Atualiza o parâmetro do checkbox que foi marcado
            const parametroMarcadoIndex = parametros.findIndex(param => param[0] === clickedCheckboxName);
            if (parametroMarcadoIndex !== -1) {
                parametros[parametroMarcadoIndex][1] = 1;
            }
        } else {
            // Se o checkbox foi desmarcado (pelo usuário)
            const parametroDesmarcadoIndex = parametros.findIndex(param => param[0] === clickedCheckboxName);
            if (parametroDesmarcadoIndex !== -1) {
                parametros[parametroDesmarcadoIndex][1] = 0;
            }
        }
        salvarDados(); // Salva os parâmetros atualizados
        renderizarLista(); // renderiza com a nova ordenação/filtro
    });
});

// Gerencia os checkboxes de filtro (exclusivos)
filtroExclusivo.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        const clickedCheckboxName = event.target.name;

        if (event.target.checked) {
            // Se o checkbox foi MARCADO, desmarca os outros
            filtroExclusivo.forEach(outraOpcao => {
                if (outraOpcao !== event.target && outraOpcao.checked) {
                    outraOpcao.checked = false;
                    const indexOutraOpcao = parametros.findIndex(param => param[0] === outraOpcao.name);
                    if (indexOutraOpcao !== -1) {
                        parametros[indexOutraOpcao][1] = 0; // Desmarca o parâmetro correspondente
                    }
                }
            });
            // Atualiza o parâmetro do checkbox que foi MARCADO
            const indexParametroMarcado = parametros.findIndex(param => param[0] === clickedCheckboxName);
            if (indexParametroMarcado !== -1) {
                parametros[indexParametroMarcado][1] = 1;
            }
        } else {
            // Se o checkbox foi DESMARCADO (pelo usuário)
            const indexParametroDesmarcado = parametros.findIndex(param => param[0] === clickedCheckboxName);
            if (indexParametroDesmarcado !== -1) {
                parametros[indexParametroDesmarcado][1] = 0; // Desmarca o parâmetro correspondente
            }
        }
        salvarDados(); // Salva os parâmetros atualizados
        renderizarLista(); // renderiza com a nova ordenação/filtro
    });
});

//Renderização da Lista e Contadores

function renderizarLista() {
    // 1. Resetar Contadores
    contadorTotal = 0;
    contadorPendentes = 0;
    contadorComprados = 0;

    // 2. Aplicar Filtros
    let listaFiltrada = [...itens]; // Cria uma cópia para não modificar o array original 'itens'

    const filtroCompradosAtivo = parametros.find(p => p[0] === 'filtroComprados')[1] === 1;
    const filtroPendentesAtivo = parametros.find(p => p[0] === 'filtroPendentes')[1] === 1;

    if (filtroCompradosAtivo) {
        listaFiltrada = listaFiltrada.filter(item => item[1] === true);
    } else if (filtroPendentesAtivo) {
        listaFiltrada = listaFiltrada.filter(item => item[1] === false);
    }

    // 3. Aplicar Ordenação
    const ordemAlfabeticaAtiva = parametros.find(p => p[0] === 'ordemAlfabetica')[1] === 1;
    const ordemStatusAtiva = parametros.find(p => p[0] === 'ordemStatus')[1] === 1;

    if (ordemAlfabeticaAtiva) {
        listaFiltrada.sort((a, b) => a[0].localeCompare(b[0])); // Ordena por nome (string)
    } else if (ordemStatusAtiva) {
        // Ordena por status: pendentes primeiro (false) e depois comprados (true)
        listaFiltrada.sort((a, b) => {
            if (a[1] === b[1]) {
                return a[0].localeCompare(b[0]); // Se o status for igual, ordena alfabeticamente
            }
            return a[1] === false ? -1 : 1; // False (pendente) vem antes de True (comprado)
        });
    }

    // 4. Limpar a lista atual no HTML
    listaItens.innerHTML = '';

    // 5. Renderizar a lista filtrada e ordenada, e atualizar contadores
    listaFiltrada.forEach((item, indexOriginal) => {
        const li = document.createElement('li');
        li.textContent = item[0]; // Nome do item

        // Cria o botão Remover
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.id = 'btnRemover';
        btnRemover.addEventListener('click', () => {
            const actualIndex = itens.findIndex(i => i[0] === item[0] && i[1] === item[1]);
            if (actualIndex !== -1) {
                removerItem(actualIndex);
            }
        });

        // Cria o checkbox de "Comprado"
        const checkBoxComprado = document.createElement('input');
        checkBoxComprado.type = 'checkbox';
        checkBoxComprado.id = `checkBoxComprado-${item[0]}-${Date.now()}`; // ID único para cada checkbox
        checkBoxComprado.name = 'checkBoxComprado';
        checkBoxComprado.checked = item[1]; // Define o estado inicial do checkbox

        checkBoxComprado.addEventListener('change', (event) => {
            // Ao mudar o estado, atualiza o item no array 'itens' original
            const actualIndex = itens.findIndex(i => i[0] === item[0] && i[1] === !event.target.checked); // Encontra pelo estado anterior
            if (actualIndex !== -1) {
                itens[actualIndex][1] = event.target.checked; // atualiza o status
                salvarDados();
                renderizarLista(); // renderiza para atualizar contadores e possível ordenação/filtro
            }
        });

        li.appendChild(checkBoxComprado);
        li.appendChild(btnRemover);
        listaItens.appendChild(li);
    });

    // 6. Atualizar os contadores de exibição após a renderização
    contadorTotal = itens.length;
    contadorComprados = itens.filter(item => item[1]).length;
    contadorPendentes = itens.filter(item => !item[1]).length;

    totalItensSpan.textContent = `Total: ${contadorTotal}`;
    itensPendentesSpan.textContent = `Pendentes: ${contadorPendentes}`;
    itensCompradosSpan.textContent = `Comprados: ${contadorComprados}`;
}