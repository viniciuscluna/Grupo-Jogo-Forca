
//Objeto de forca com suas respectivas funções
export class Forca {
    static NomePadrao = 'Não definido'
    constructor(nome, word) {
        if (word) {
            if (!nome)
                this.NomeJogador = this.NomePadrao
            else this.NomeJogador = nome

            this.PalavraEscolhida = word.word
            this.Dica = word.tip
            this.QuantidadeCaracteres = word.getLengthSentence()
            this.LetrasDecifradas = this.PalavraEscolhida.split("").map(() => "_")
            this.LetrasJaEscolhidas = []
            this.QuantidadeVidas = 6
            this.InicioJogo = new Date()
        }
    }

    getTempoJogo() {
        const fimJogo = new Date()
        return ((fimJogo.getTime() - this.InicioJogo.getTime()) / 1000)
    }

    getPalavraEscolhidaArray() {
        return this.PalavraEscolhida.split('')
    }

    verificarForcaCompleta() {
        return JSON.stringify(this.getPalavraEscolhidaArray()) === JSON.stringify(this.LetrasDecifradas)
    }

    verificarLetra(letra) {
        const resultado = verificarLetraForca(letra, this.getPalavraEscolhidaArray(), this.LetrasDecifradas, this.LetrasJaEscolhidas, this.QuantidadeVidas)
        this.QuantidadeVidas = resultado.QtdVidas
        return resultado
    }

}

export class PlacarJogo {
    static nomePlacar = 'PlacarJogo'
    constructor() {
        if (!localStorage.getItem(PlacarJogo.nomePlacar))
            localStorage.setItem(PlacarJogo.nomePlacar, JSON.stringify([]))
    }


    inserirPlacar(nome, tempo) {
        const lista = this.getPlacar()
        lista.push({ NomeJogador: nome, Tempo: tempo })
        localStorage.setItem(PlacarJogo.nomePlacar, JSON.stringify(lista.sort((s1, s2) => s1.Tempo - s2.Tempo)))
    }

    getTop5Placar() {
        return this.getPlacar().slice(0, 5)
    }

    getPlacar() {
        return JSON.parse(localStorage.getItem(PlacarJogo.nomePlacar))
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