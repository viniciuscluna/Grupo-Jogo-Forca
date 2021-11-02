import { address } from './api.js';

class GetWord {

    constructor(id, word, tip) {
        this.id = id;
        this.word = word;
        this.tip = tip;
    }

    printData() {
        console.log(this.word);
    }

};

fetch(address)
.then(res => {
    if (!res.ok) throw new Error('Error');
    return res.json()
})
.then(data => {
    const randomId = Math.floor(Math.random() * data.characters.character[data.characters.character.length-1].id);
    console.log(randomId);

    for (let i of data.characters.character) {
        if (i.id === randomId) {
            let newCharacter = new GetWord(i.id, i.name, i.tip)
            newCharacter.printData();
        };
    };

})
.catch(Error => console.log("Error:" + Error));