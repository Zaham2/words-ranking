"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
const data = require("../TestData.json");
const wordList = data.wordList;
const scoresList = data.scoresList;
// We use an enum to make adding new word types easy (if needed)
// To add new word types, just add to this enum... the app will take care of the rest
var WordTypes;
(function (WordTypes) {
    WordTypes[WordTypes["noun"] = 0] = "noun";
    WordTypes[WordTypes["verb"] = 1] = "verb";
    WordTypes[WordTypes["adverb"] = 2] = "adverb";
    WordTypes[WordTypes["adjective"] = 3] = "adjective";
})(WordTypes || (WordTypes = {}));
// 2D Array of wordTypes... each sub-array represents a list of its corresponding word types
// eg the first sub array is nouns, the second is verbs, etc....
let words = [];
let nTypes = 0;
// Now all we need to do to add another word type is to add its enum value and
// this function will automaticallly allocate its values to the 2D Array
function initializeData() {
    const types = Object.keys(WordTypes);
    nTypes = Math.ceil(types.length / 2);
    //   initializing the 2D Array
    for (let i = 0; i < nTypes; i++)
        words.push([]);
    //   Sequentially allocating the words to the 2D Array
    for (let word of wordList) {
        let wordType = word.pos;
        // @ts-ignore
        let wordTypeNum = WordTypes[wordType];
        words[wordTypeNum].push(word);
    }
    //   We are done with the wordsList
    // ------------------
    // ------------------
    // Here we just sort the scoresList for easier rank calculation
    scoresList.sort(function (a, b) {
        return a - b;
    });
}
initializeData();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
/*
My solution is to create a deep copy of the words 2D Array and pull items out of it, rather than use the original words array...
Although this is a lengthy operation given small nature of this application, I believe that
in a much bigger application with thousands or even millions of words to choose from, this implementation would
be much more efficient, as we won't have to keep re-rolling randomly if we get the same word twice
*/
app.get("/words", (req, res) => {
    let newWords = JSON.parse(JSON.stringify(words)); // deep copy
    let wordsOutput = []; // the words we will return to the user
    let choices = []; // we'll use this array to choose the word types to pull
    // This loop assumes there is at least 1 of each word type
    // To guarantee we get at least one of each word type, we pull one of each at the
    // very beginning of the endpoint's execution... then we pull the rest randomly
    for (let i = 0; i < nTypes; i++) {
        let wordToAdd = newWords[i].splice(Math.floor(Math.random() * newWords[i].length), 1);
        wordsOutput.push(wordToAdd);
        // If there are still words of this type, add this type to the list
        if (newWords.length > 0)
            choices.push(i);
    }
    //   In case we don't have any words left... stop execution
    if (choices.length === 0)
        return;
    //   Now to pull random elements from the 2D Array
    for (let i = 0; i < 10 - nTypes; i++) {
        // first we choose a word type to pull
        let chosenType = choices[Math.floor(Math.random() * choices.length)];
        // Now we take one of this wordType
        let wordToAdd = newWords[chosenType].splice(Math.floor(Math.random() * newWords[chosenType].length), 1);
        wordsOutput.push(wordToAdd);
        // If this was the last word of its type, exclude this type from the next random pull
        if (newWords[chosenType].length === 0)
            choices.splice(chosenType, 1);
    }
    res.send(wordsOutput);
});
/*
This part was fairly straightforward... although it did keep reading the numbers as status codes... so I decided to
take the request body input as a string, parse it, do the calculation, then back to string once more to avoid getting
any error messages
*/
app.post("/rank", (req, res) => {
    let score = req.body.score;
    let intScore = parseInt(score);
    let scoreIndex = scoresList.indexOf(intScore);
    let rank = ((scoreIndex / scoresList.length) * 100).toFixed(2);
    res.send(rank);
});
app.listen(port, () => {
    console.log(`Starting app on port: ${port}`);
});
