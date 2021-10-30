export const escolherPalavraAleatoria = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const verificarLetraForca = (letra, palavraEscolhida, palavraDecrifrada, letrasJaEscolhidas, qtdVidas) => {
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
        qtdVidas --;
        return {
            Sucesso: false,
            QtdVidas: qtdVidas,
            Mensagem: `Letra (${letra}) não encontrada :(`
        }
    }
}

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
const inserirLetraForca = (letra, palavraEscolhida, palavraDecrifrada) => {
    palavraEscolhida.forEach((letraIdx, idx) => {
        if (letraIdx == letra) {
            palavraDecrifrada[idx] = letraIdx
        }
    })
}


export const  gerarImagemForca = (vidas) => {
    if(vidas > 0)
    return `assets/imgForca/${vidas}.png`
    else return `assets/imgForca/0.png`
}