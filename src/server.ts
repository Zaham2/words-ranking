import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

const data = require("../TestData.json"); 
const wordList = data.wordList;
const scoresList: number[] = data.scoresList;

// We use an enum to make adding new word types easy (if needed)
// To add new word types, just add to this enum... the app will take care of the rest
enum WordTypes {
  noun = 0,
  verb = 1,
  adverb = 2,
  adjective = 3,
}

// 2D Array of wordTypes... each sub-array represents a list of its corresponding word types
// eg the first sub array is nouns, the second is verbs, etc....
let words: Object[][] = [];
let nTypes: number = 0;

// Now all we need to do to add another word type is to add its enum value and
// this function will automaticallly allocate its values to the 2D Array
function initializeData() {
  const types: String[] = Object.keys(WordTypes);
  nTypes = Math.ceil(types.length / 2);

  //   initializing the 2D Array
  for (let i = 0; i < nTypes; i++) words.push([]);

  //   Sequentially allocating the words to the 2D Array
  for (let word of wordList) {
    let wordType: string = word.pos;
    // @ts-ignore
    let wordTypeNum: number = WordTypes[wordType];
    words[wordTypeNum].push(word);
  }
  //   We are done with the wordsList
  // ------------------
  // ------------------
  // Here we just sort the scoresList for easier rank calculation
  scoresList.sort(function (a: number, b: number) {
    return a - b;
  });
}

initializeData();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

/*
My solution is to create a deep copy of the words 2D Array and pull items out of it, rather than use the original words array...
Although this is a lengthy operation given small nature of this application, I believe that
in a much bigger application with thousands or even millions of words to choose from, this implementation would
be much more efficient, as we won't have to keep re-rolling randomly if we get the same word twice
*/
app.get("/words", (req: Request, res: Response) => {
  let newWords = JSON.parse(JSON.stringify(words)); // deep copy
  let wordsOutput: string[] = []; // the words we will return to the user
  let choices: number[] = []; // we'll use this array to choose the word types to pull

  // This loop assumes there is at least 1 of each word type
  // To guarantee we get at least one of each word type, we pull one of each at the
  // very beginning of the endpoint's execution... then we pull the rest randomly
  for (let i = 0; i < nTypes; i++) {
    let wordToAdd = newWords[i].splice(
      Math.floor(Math.random() * newWords[i].length),
      1
    );
    wordsOutput.push(wordToAdd);

    // If there are still words of this type, add this type to the list
    if (newWords.length > 0) choices.push(i);
  }

  //   In case we don't have any words left... stop execution
  if (choices.length === 0) return;

  //   Now to pull random elements from the 2D Array
  for (let i = 0; i < 10 - nTypes; i++) {
    // first we choose a word type to pull
    let chosenType: number =
      choices[Math.floor(Math.random() * choices.length)];

    // Now we take one of this wordType
    let wordToAdd = newWords[chosenType].splice(
      Math.floor(Math.random() * newWords[chosenType].length),
      1
    );
    wordsOutput.push(wordToAdd);

    // If this was the last word of its type, exclude this type from the next random pull
    if (newWords[chosenType].length === 0) choices.splice(chosenType, 1);
  }
  res.send(wordsOutput);
});

/*
This part was fairly straightforward... although it did keep reading the numbers as status codes... so I decided to
take the request body input as a string, parse it, do the calculation, then back to string once more to avoid getting
any error messages
*/
app.post("/rank", (req: Request, res: Response) => {
  let score: string = req.body.score;
  let intScore: number = parseInt(score);
  let scoreIndex: number = scoresList.indexOf(intScore);
  let rank: string = ((scoreIndex / scoresList.length) * 100).toFixed(2);
  res.send(rank);
});

app.listen(port, () => {
  console.log(`Starting app on port: ${port}`);
});
