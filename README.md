# words-ranking

This application is still a work-in-progress.
I will keep this Readme.md updated as I add further changes.

# What this application does

For now, this application simply reads two types of data from the *testData.json* file... namely a *wordList* and a *scoresList*.

### wordList
Each word has an *id* and a *type*. we're more concerned about the word type for the purpose of this application.
### scoresList
A simple list of numbers between 0 to 100 representing the scores of the users of our app. Note that we sort the scoresList by ascending order at the very beginning of the app to help in rank calculation.

# Endpoints

### '/words'
This endpoint does the following.
1. Creates a deep copy of the wordList (newWords)
2. Pulls one of each wordType out of the deep copied array and into the output array (wordsOutput) (note that, as stated in the code's comments, this step assumes there is at least one of each word type in the data file)
3. If there are no words left to pull, we return from the function
4. In the second for loop, we have two random choices
  4.1. First, we choose a random available wordType from the choices array
  4.2. Next, We choose a random word object from the corresponding sublist in the newWords array
5. Lastly, we send the wordsOutput array as our response

### '/rank'
This endpoint is pretty simple
1. Read the score (as string) from the request body
2. Get the index of the first occurence of this score in the *scoresList* array
3. Calculates the percentage of this index relative to the total number of indices. Then rounds it to two decimal points

#### That's about it for now, remember to check in later to see the completed version!
