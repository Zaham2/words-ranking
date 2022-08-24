import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const data = require("../TestData.json");
const wordList = data.wordList;
const scoresList = data.scoresList;

// We use an enum to make adding new word types easy (if needed)
enum WordTypes {
    noun = 0,
    verb = 1,
    adverb = 2,
    adjective = 3
}

// 2D Array of wordTypes... incase we add other word types
let words: Object[][] = []
let nTypes: number = 0

// Now all we need to do to add another word type is to add its enum value and
// this function will automaticallly allocate its values to the 2D Array
function assign(){
    
    const types = Object.keys(WordTypes)
    nTypes = Math.ceil(types.length/2)

    for(let i=0;i<nTypes;i++)
        words.push([])

    for(let word of wordList){
        let wordType: string = word.pos
        // @ts-ignore
        let wordNum : number = WordTypes[wordType]
        words[wordNum].push(word)
    }
}

assign()

app.get("/", (req, res) => {
  res.send(words);
});

app.listen(port, () => {
  console.log(`Starting app on port: ${port}`);
});
