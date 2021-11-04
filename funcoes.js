
//Objeto de forca com suas respectivas funções
export class Forca {
    static NomePadrao = 'Não definido'
    constructor(nome, word) {
        if (word) {
            if (!nome)
                this.NomeJogador = this.NomePadrao
            else this.NomeJogador = nome

            this.PalavraEscolhida = word.word
            this.Dica = dica
            this.QuantidadeCaracteres = word.getLengthSentence()
            this.LetrasDecifradas = this.PalavraEscolhida.map(() => "_")
            this.LetrasJaEscolhidas = []
            this.QuantidadeVidas = 6
            this.InicioJogo = new Date()
        }
    }

    get getTempoJogo() {
        const fimJogo = new Date()
        return this.InicioJogo.getTime() - fimJogo.getTime()
    }

    get getPalavraEscolhidaArray() {
        return this.PalavraEscolhida.split('')
    }

    get verificarForcaCompleta() {
        return JSON.stringify(this.LetrasJaEscolhidas) === JSON.stringify(this.LetrasDecifradas)
    }

    verificarLetra(letra) {
        const resultado = verificarLetraForca(letra, this.getPalavraEscolhidaArray(), this.PalavraEscolhida, this.LetrasJaEscolhidas, this.QuantidadeVidas)
        this.QuantidadeVidas = resultado.QtdVidas
        return resultado
    }

}

export class PlacarJogo {
    static nomePlacar = 'PlacarJogo'
    constructor() {
        if (!localStorage.getItem(this.nomePlacar))
            localStorage.setItem(this.nomePlacar, [])
    }


    inserirPlacar(nome, tempo) {
        const lista = this.getPlacar()
        lista.push({ NomeJogador: nome, Tempo: tempo })
        localStorage.setItem(nomePlacar, lista.sort(s => s.Tempo))
    }

    getTop5Placar() {
        return this.getPlacar().slice(0, 5)
    }
    getPlacar() {
        return localStorage.getItem(nomePlacar)
    }
}

//Função que valida a letra dentro da forca
function verificarLetraForca(letra, palavraEscolhida, palavraDecrifrada, letrasJaEscolhidas, qtdVidas) {
    if (palavraDecrifrada.includes(letra) || letrasJaEscolhidas.includes(letra)) {
        return {
            Sucesso: false,
            QtdVidas: qtdVidas,
            Mensagem: 'Letra já escolhida!!'
        }
    }
    else if (palavraEscolhida.includes(letra)) {
        inserirLetraForca(letra, palavraEscolhida, palavraDecrifrada)
        return {
            Sucesso: true,
            QtdVidas: qtdVidas,
            Mensagem: `Letra (${letra}) encontrada!`
        }
    }
    else {
        letrasJaEscolhidas.push(letra)
        qtdVidas--;
        return {
            Sucesso: false,
            QtdVidas: qtdVidas,
            Mensagem: `Letra (${letra}) não encontrada :(`
        }
    }
}

//Função para validar forca por meio de regex
export const validarLetraForca = (letra) => {
    if (letra) {
        const regexAlfabeto = /[a-zA-Z]*$/g
        if (regexAlfabeto.test(letra) && letra.split('').length === 1) {
            return true
        }
        return false
    }
    console.log('Letra inválida')
    return false
}

//Método que insere letra na posição do array resolvido
const inserirLetraForca = (letra, palavraEscolhida, palavraDecrifrada) => {
    palavraEscolhida.forEach((letraIdx, idx) => {
        if (letraIdx == letra) {
            palavraDecrifrada[idx] = letraIdx
        }
    })
}

//Função que retorna caminho onde imagem da forca com base na quantidade de vidas
export const gerarImagemForca = (vidas) => {
    if (vidas > 0)
        return `assets/imgForca/${vidas}.png`
    else return `assets/imgForca/0.png`
}