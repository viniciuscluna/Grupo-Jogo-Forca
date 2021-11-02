import { gerarPalavraAleatoria, validarLetraForca, gerarImagemForca, Forca, PlacarJogo } from './funcoes.js'
import { carregarJson } from './carregarJson'

//Carregar arquivo pela API
const listaPalavras = await carregarJson();

//Preencher variável com o nome do jogador
const nomeJogador = prompt('Digite seu nome:')
if (nomeJogador)
    usuario.innerText = `Olá : ${nomeJogador}`

//Instância inicial do objeto Forca
let jogoForca = new Forca(nomeJogador, gerarPalavraAleatoria(listaPalavras))


const placar = new PlacarJogo()


//Mapeamento de Campos do DOM pelo browserAPI
const btnIniciar = document.getElementById('btnIniciar')
const btnInserir = document.getElementById('btnInserir')
const txtForca = document.getElementById('txtForca')
const alerta = document.getElementById('mensagemAlerta')
const usuario = document.getElementById('msgUsuario')
const imgForca = document.getElementById('imgForca')
const mensagem = document.getElementById('mensagem')
const mensagemForca = document.getElementById('mensagemForca')
const mensagemForcaEscolhidas = document.getElementById('mensagemForcaEscolhidas')
const placarJogo = document.getElementById('placarJogo')


//Gerar imagem inicial da forca com o carregamento da tela
imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))

//Tratativa do botão iniciar
btnIniciar.onclick = () => {
    carregarForca()
    txtForca.focus()
    txtForca.style = ''
    btnInserir.style = ''
    btnIniciar.innerText = 'Reiniciar'
}


//Tratativa do botão inserir
btnInserir.onclick = () => {
    tratarInsercaoLetra(txtForca.value)
    recarregarCampos()
    txtForca.value = ''
    txtForca.focus()
    verificarSeVenceu()
    if (jogoForca.QuantidadeVidas === 0)
        tratarPerdeuJogo()
}

//Método para mostrar ao jogador quando ele perder o jogo
const tratarPerdeuJogo = () => {
    alert(`Você perdeu.... \n A palavra era: ${jogoForca.PalavraEscolhida}`)
    txtForca.style = 'display:none'
    btnInserir.style = 'display:none'
    mensagem.innerText = ``
    mensagemForca.innerText = ``
    mensagemForcaEscolhidas.innerText = ``
    alerta.innerHTML = 'Você perdeu, caso queira jogar novamente, clique acima.'
}

//Método executado para validar a letra inserida pelo usuário
const tratarInsercaoLetra = (letra) => {
    if (validarLetraForca(letra)) {
        var resultado = jogoForca.verificarLetra(letra)
        alerta.innerText = resultado.Mensagem
    }
    else {
        alerta.innerText = 'Caractere inválido'
    }
}

//Método com objetivo de sincronizar o FRONT com as alterações no objeto
const recarregarCampos = () => {
    mensagem.innerText = `Sua animal tem ${jogoForca.QuantidadeCaracteres} letras!`
    mensagemForca.innerText = `Sua forca nesse momento: ${jogoForca.LetrasDecifradas.join(' ')}`
    mensagemForcaEscolhidas.innerText = `Letras não encontradas: ${jogoForca.LetrasJaEscolhidas.join(',')}, Vidas Restantes: (${jogoForca.QuantidadeVidas})`
    imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))
    placarJogo.innerText = JSON.stringify(placar.getTop5Placar())
}

//Método com função de reinstanciar o objeto de forca
const carregarForca = () => {
    jogoForca = new Forca(nomeJogador, gerarPalavraAleatoria(listaPalavras))
    recarregarCampos()
    alerta.innerHTML = "Insira uma letra abaixo e clique em 'Verificar Letra'!"
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
const verificarSeVenceu = () => {
    imgForca.setAttribute('src', gerarImagemForca(jogoForca.QuantidadeVidas))
    if (jogoForca.verificarForcaCompleta()) {
        alert(`Você venceu!!\n A Palavra é (${jogoForca.PalavraEscolhida}): ${gerarTextoFinal(jogoForca.LetrasDecifradas)}`)
        carregarForca()
        txtForca.style = 'display:none'
        btnInserir.style = 'display:none'
        mensagem.innerText = ``
        mensagemForca.innerText = ``
        mensagemForcaEscolhidas.innerText = ``
        alerta.innerHTML = 'Renicie o jogo clicando acima'
        placar.inserirPlacar(nomeJogador, jogoForca.getTempoJogo())
    }
}






