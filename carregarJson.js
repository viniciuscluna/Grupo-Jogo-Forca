const urlArquivo = 'urlAqui'

//Função para retornar JSON de forma assíncrona
export const carregarJson = () => {
    return new Promise((resolve, reject) => {
        fetch(urlArquivo)
            .then(response => response.text())
            .then(text => {
                resolve(text.split('\n'))
            })
            .catch(error => {
                reject(error)
            })
    })

}