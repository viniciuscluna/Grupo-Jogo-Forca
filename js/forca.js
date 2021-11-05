import { validarLetraForca, gerarImagemForca, Forca, PlacarJogo } from './funcoes.js'
import { start } from './carregarJson.js'

//Mapeamento de Campos do DOM pelo browserAPI+
const lblMensagemInicio = document.getElementById('lblMensagemInicio')
const lblJogador = document.getElementById('lblJogador')
const btnTeclados = document.getElementsByClassName('teclado')
const btnIniciar = document.getElementById('btnIniciar')
const btnInserir = document.getElementById('btnInserir')
const txtForca = document.getElementById('txtForca')
// const alerta = document.getElementById('mensagemAlerta')
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


for (let i = 0; i < btnTeclados.length; i++) {
    const btnPosicao = btnTeclados[i]
    const letra = btnPosicao.getAttribute("data-letra")
    btnPosicao.onclick = function () {
        inserirLetra(letra)
        btnPosicao.setAttribute("disabled", true)
    }
};


//Gerar imagem inicial da forca com o carregamento da tela
imgForca.setAttribute('src', gerarImagemForca(6))

//Tratativa do botão iniciar
btnIniciar.onclick = async () => {
    await carregarForca()
        .then(() => {
            txtForca.focus()
            txtForca.style = ''
            btnInserir.style = ''
            btnIniciar.innerText = 'Reiniciar'
        })
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

//Tratativa do botão inserir
btnInserir.onclick = (e) => {
    if (!nomeJogador) {
        e.preventDefault();
        nomeJogador = txtForca.value
        lblJogador.innerText = nomeJogador[0].toUpperCase() + nomeJogador.substring(1).toLowerCase() + ','
        lblMensagemInicio.innerText = "tente adivinhar a palavra:"
        btnInserir.innerText = "Verificar palavra"
        txtForca.value = ""
        return
    }

    inserirPalavra(txtForca.value)
    txtForca.value = ''
    txtForca.focus()

}

//Método para mostrar ao jogador quando ele perder o jogo
const tratarPerdeuJogo = () => {
    alert(`Você perdeu.... \n A palavra era: ${jogoForca.PalavraEscolhida}`)
    txtForca.style = 'display:none'
    btnInserir.style = 'display:none'
    // mensagem.innerText = ``
    // mensagemForca.innerText = ``
    // mensagemForcaEscolhidas.innerText = ``
    // alerta.innerHTML = 'Você perdeu, caso queira jogar novamente, clique acima.'
}

//Método executado para validar a letra inserida pelo usuário
const tratarInsercaoLetra = (letra) => {
    if (validarLetraForca(letra)) {
        const resultado = jogoForca.verificarLetra(letra)
        // alerta.innerText = resultado.Mensagem
    }
    else {
        alerta.innerText = 'Caractere inválido'
    }
}

const gerarCamposAdvinhados = (listaLetras) => {

    const divPalavra = document.getElementById('palavraForca');

    divPalavra.innerHTML = '';

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
    // placarJogo.innerText = JSON.stringify(placar.getTop5Placar())
}

//Método com função de reinstanciar o objeto de forca
const carregarForca = async () => {
    await generateWord()
        .then(word => {
            jogoForca = new Forca(nomeJogador, word)
            recarregarCampos()
            // alerta.innerHTML = "Insira uma letra abaixo e clique em 'Verificar Letra'!"
        })
}


//Método para retornar o texto final por meio de uma repetição
const gerarTextoFinal = (texto) => {
    let retorno = ''
    for (let t of texto) {
        retorno = retorno + `\n => ${t}`
    }
    return retorno
}

//Método para verificar se a forca está completa
const verificarSeVenceu = async (jaVenceu) => {
    imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))
    if (jogoForca.verificarForcaCompleta() || jaVenceu) {
        alert(`Você venceu!!\n A Palavra é (${jogoForca.PalavraEscolhida}): ${gerarTextoFinal(jogoForca.LetrasDecifradas)}`)
        placar.inserirPlacar(nomeJogador, jogoForca.getTempoJogo())
        await carregarForca()
            .then(() => {
                txtForca.style = 'display:none'
                btnInserir.style = 'display:none'
                // mensagem.innerText = ``
                // mensagemForca.innerText = ``
                // mensagemForcaEscolhidas.innerText = ``
                // alerta.innerHTML = 'Reinicie o jogo clicando acima'
            })

    }
}






