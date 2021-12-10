const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let sum = 0;
    for(let i = 0; i < lines.length; i++) {
        sum += getCorruptedValue(lines[i]);
    }
    console.log(`Problem 1 answer: ${sum}`)
    console.timeEnd('Problem 1 run time');
}

function getCorruptedValue(chunk) {
    const OPEN_BRACKETS = "{(<[";
    const BRACKETS = {"}":"{", ")":"(", ">":"<", "]":"["};
    const BRACKET_VALUE = {")":3, "]":57, "}":1197, ">":25137};

    let stack = [];
    for(let i = 0; i < chunk.length; i++) {
        if(OPEN_BRACKETS.includes(chunk[i])) {
            stack.push(chunk[i]);
        }
        else {
            if(BRACKETS[chunk[i]] != stack.pop()) {
                return BRACKET_VALUE[chunk[i]];
            }
        }
    }
    return 0;
}


// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let uncomplete = []

    // delete corrupted lines
    for(let i = 0; i < lines.length; i++) {
        if(!isCorrupted(lines[i])) {
            uncomplete.push(lines[i]);
        }
    }

    let scores = []
    for(let i = 0; i < uncomplete.length; i++) {
        scores.push(getCompletedChunkValue(uncomplete[i]));
    }

    scores = scores.sort((a,b) => a - b)
    
    console.log(`\nProblem 2 answer: ${scores[Math.trunc(scores.length/2)]}`)
    console.timeEnd('Problem 2 run time');
}

function isCorrupted(chunk) {
    const OPEN_BRACKETS = "{(<[";
    const BRACKETS = {"}":"{", ")":"(", ">":"<", "]":"["};

    let stack = [];
    for(let i = 0; i < chunk.length; i++) {
        if(OPEN_BRACKETS.includes(chunk[i])) {
            stack.push(chunk[i]);
        }
        else {
            if(BRACKETS[chunk[i]] != stack.pop()) {
                return true;
            }
        }
    }
    return false;
}

function getCompletedChunkValue(chunk) {
    const OPEN_BRACKETS = "{(<[";
    const BRACKETS = {"{":"}", "(":")", "<":">", "[":"]"};
    const BRACKET_VALUES = {")":1, "]":2, "}":3, ">":4};

    let stack = [];
    for(let i = 0; i < chunk.length; i++) {
        if(OPEN_BRACKETS.includes(chunk[i])) {
            stack.push(chunk[i]);
        }
        else {
            stack.pop();
        }
    }

    let completedChunk = "";
    while(stack.length > 0) {
        completedChunk += BRACKETS[stack.pop()];
    }

    let score = 0;
    for(let i = 0; i < completedChunk.length; i++) {
        score = score*5 + BRACKET_VALUES[completedChunk[i]]
    }

    return score;
}

problem1();
problem2();