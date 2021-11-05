import { address } from './api.js';

export class GetWord {
    #character = 'Personagem: ';
    #tip = 'Dica: ';

    constructor(id, word, tip) {
        this.id = id;
        this.word = word.toUpperCase();
        this.tip = tip;
    };

    get guessingTip() {
        return this.#tip;
    };

    get sentence() {
        return this.#character;
    };

    getLengthSentence() {
        return this.word.length
    };

};

const fetchData = async () => {

    return await fetch(address)
        .then(res => {
            if (!res.ok) throw new Error('Error');
            return res.json()
        })
        .then(data => {
            localStorage.setItem('data', JSON.stringify(data));
            const randomId = Math.floor(Math.random() * data.characters.character[data.characters.character.length - 1].id);

            for (let character of data.characters.character) {
                if (character.id === randomId) {
                    return new GetWord(character.id, character.name, character.tip)
                };
            };

        })
        .catch(Error => console.log("Error:" + Error));

};

export const start = () => {

    let savedData = localStorage.getItem('data');

    if (savedData) {

        savedData = JSON.parse(savedData);

        const randomId = Math.floor(Math.random() * savedData.characters.character[savedData.characters.character.length - 1].id);

        for (let character of savedData.characters.character) {
            if (character.id === randomId) {
                return new GetWord(character.id, character.name, character.tip)
            };
        };
    } else {
        const word = fetchData();
        return word;
    };

};