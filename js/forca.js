import { validarLetraForca, gerarImagemForca, Forca, PlacarJogo } from './funcoes.js'
import { start } from './carregarJson.js'

//Mapeamento de Campos do DOM pelo browserAPI+
const lblMensagemInicio = document.getElementById('lblMensagemInicio')
const lblJogador = document.getElementById('lblJogador')
const btnTeclados = document.getElementsByClassName('teclado')
const btnInserir = document.getElementById('btnInserir')
const btnRestart = document.getElementById('btnRestart')
const txtForca = document.getElementById('txtForca')
const alerta = document.getElementById('alerta')
const jogadorCompleto = document.getElementById('jogadorCompleto')
// const usuario = document.getElementById('msgUsuario')
const imgForca = document.getElementById('imgForca')
// const mensagem = document.getElementById('mensagem')
// const mensagemForca = document.getElementById('mensagemForca')
// const mensagemForcaEscolhidas = document.getElementById('mensagemForcaEscolhidas')
const placarJogo = document.getElementById('placarJogo')
const tip = document.getElementById('tip')
let nomeJogador;


//Carregar arquivo pela API
const generateWord = async () => (
    await start()
)


lblMensagemInicio.innerText = "Digite seu nome:"
btnInserir.innerText = "Inserir Nome"


//Preencher variável com o nome do jogador
//const nomeJogador = prompt('Digite seu nome:')
//if (nomeJogador)
// usuario.innerText = `Olá : ${nomeJogador}`



//Instância inicial do objeto Forca
let jogoForca


const placar = new PlacarJogo()

//Preparar ação onclick para os botõesinserirPlacar
for (let i = 0; i < btnTeclados.length; i++) {
    const btnPosicao = btnTeclados[i]
    const letra = btnPosicao.getAttribute("data-letra")
    btnPosicao.onclick = function () {
        inserirLetra(letra)
        btnPosicao.setAttribute("disabled", true)
    }
};

const gerarPlacar = () => {
    placarJogo.innerHTML = ''
    var top5 = placar.getTop5Placar()
    for (let i of top5) {
        let tr = document.createElement('tr');
        tr.setAttribute('id', i);
        tr.setAttribute('class', "border-dark");
        tr.innerText = `Jogador : ${i.NomeJogador}, Tempo: ${i.Tempo} (segundos)`;
        placarJogo.appendChild(tr);
    }
}



//Gerar imagem inicial da forca com o carregamento da tela
imgForca.setAttribute('src', gerarImagemForca(6))
gerarPlacar()

//Tratativa do botão iniciar
const iniciarJogo = async () => {
    await carregarForca()
        .then(() => {
            txtForca.focus()
            txtForca.style = ''
            txtForca.disabled = false
            btnInserir.style = ''
            btnInserir.disabled = false
            btnRestart.classList.remove('d-none')
        })
}

//Função do botão reiniciar
btnRestart.onclick = () => {
    location.reload(true)
}


const inserirLetra = (letra) => {
    tratarInsercaoLetra(letra)
    recarregarCampos()
    verificarSeVenceu()
    if (jogoForca.QuantidadeVidas === 0)
        tratarPerdeuJogo()
}

const inserirPalavra = (palavra) => {
    if (jogoForca.PalavraEscolhida.toUpperCase() === palavra.toUpperCase()) {
        verificarSeVenceu(true);
    } else {
        tratarPerdeuJogo();
    }
}


btnInserir.addEventListener('click',
    (e) => {
        if (!nomeJogador) {

            if (!(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/g.test(txtForca.value))) {
                txtForca.value = ''
                alerta.innerText = 'Somente letras são permitidas!'
                return
            }

            e.preventDefault();
            nomeJogador = txtForca.value
            lblJogador.innerText = nomeJogador[0].toUpperCase() + nomeJogador.substring(1).toLowerCase() + ','
            lblMensagemInicio.innerText = "tente adivinhar a palavra:"
            btnInserir.innerText = "Verificar palavra completa"
            btnInserir.disabled = true
            txtForca.placeholder = "Palavra Completa"
            txtForca.value = ""
            txtForca.disabled = true

            iniciarJogo();


            return
        }

        inserirPalavra(txtForca.value)
        txtForca.value = ''
        txtForca.focus()
    })


//Método executado para validar a letra inserida pelo usuário
const tratarInsercaoLetra = (letra) => {
    if (validarLetraForca(letra)) {
        const resultado = jogoForca.verificarLetra(letra)
        alerta.innerText = resultado.Mensagem
    }
    else {
        alerta.innerText = 'Caractere inválido'
    }
}

const gerarCamposAdvinhados = (listaLetras) => {

    const divPalavra = document.getElementById('palavraForca');

    divPalavra.innerHTML = '';
    if (listaLetras)
        for (let i = 0; i < listaLetras.length; i++) {
            let span = document.createElement('span');
            span.setAttribute('id', i);
            span.innerText = listaLetras[i];

            divPalavra.appendChild(span);
        }
}

//Método com objetivo de sincronizar o FRONT com as alterações no objeto
const recarregarCampos = () => {
    gerarCamposAdvinhados(jogoForca.LetrasDecifradas);
    tip.innerText = `Dica: ${jogoForca.Dica}`;
    // mensagem.innerText = `Sua animal tem ${jogoForca.QuantidadeCaracteres} letras!`
    // mensagemForca.innerText = `Sua forca nesse momento: ${jogoForca.LetrasDecifradas.join(' ')}`
    // mensagemForcaEscolhidas.innerText = `Letras não encontradas: ${jogoForca.LetrasJaEscolhidas.join(',')}, Vidas Restantes: (${jogoForca.QuantidadeVidas})`
    imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))
    gerarPlacar()
}

//Método com função de reinstanciar o objeto de forca
const carregarForca = async () => {
    await generateWord()
        .then(word => {
            jogoForca = new Forca(nomeJogador, word)
            recarregarCampos()
            alerta.innerHTML = "Digite a palavra completa se souber ou clique em alguma letra!"
        })
}


//Método para verificar se a forca está completa
const verificarSeVenceu = async (jaVenceu) => {
    imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))
    if (jogoForca.verificarForcaCompleta() || jaVenceu) {
        alert(`Você venceu!!\n A Palavra é (${jogoForca.PalavraEscolhida})`)
        placar.inserirPlacar(nomeJogador, jogoForca.getTempoJogo())
        btnInserir.classList.add('d-none')
        txtForca.classList.add('d-none')
        jogadorCompleto.classList.add('d-none')
        alerta.innerHTML = 'Você venceu, caso queira jogar novamente, clique em reiniciar.'
    }
}

//Método para mostrar ao jogador quando ele perder o jogo
const tratarPerdeuJogo = () => {
    alert(`Você perdeu.... \n A palavra era: ${jogoForca.PalavraEscolhida}`)
    txtForca.style = 'display:none'
    btnInserir.style = 'display:none'  
    alerta.innerHTML = 'Você perdeu, caso queira jogar novamente, clique em reiniciar.'
}






