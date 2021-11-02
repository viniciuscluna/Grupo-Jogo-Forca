import { address } from './api.js';

export class GetWord {
    
    constructor(id, word, tip) {
        this.id = id;
        this.word = word;
        this.tip = tip;
    }

    printData() {
        console.log(this.word);
    }

};

export const start = () => {

    let savedData = localStorage.getItem('data');

    if (savedData) {

        savedData = JSON.parse(savedData);

        const randomId = Math.floor(Math.random() * savedData.characters.character[savedData.characters.character.length-1].id);

        for (let character of savedData.characters.character) {
            if (character.id === randomId) {
                let newCharacter = new GetWord(character.id, character.name, character.tip)
                newCharacter.printData();
            };
        };

    } else {

        fetch(address)
        .then(res => {
            if (!res.ok) throw new Error('Error');
            return res.json()
        })
        .then(data => {
            localStorage.setItem('data', JSON.stringify(data));
            const randomId = Math.floor(Math.random() * data.characters.character[data.characters.character.length-1].id);
            // console.log(randomId);

            for (let character of data.characters.character) {
                if (character.id === randomId) {
                    let newCharacter = new GetWord(character.id, character.name, character.tip)
                    newCharacter.printData();
                };
            };

        })
        .catch(Error => console.log("Error:" + Error));

    };

};