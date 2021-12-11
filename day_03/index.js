const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    const BIT_LENGTH = lines[0].length;
    let bits = '';

    for(let bitNum = 0; bitNum < BIT_LENGTH; bitNum++) {
        let zerosCount = 0;
        let onesCount = 0;

        for(let lineNum = 0; lineNum < lines.length; lineNum++) {
            lines[lineNum][bitNum] === '0' ? zerosCount++ : onesCount++;
        }
        
        bits += zerosCount>onesCount?'0':'1';
    }

    let inverseBits = bits.split('').map(char => char==='0'?'1':'0').join('');
    const gammaRate = parseInt(bits, 2);
    const epsilonRate = parseInt(inverseBits, 2);

    console.log(`Problem 1 answer: ${gammaRate*epsilonRate}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    console.log(`\nProblem 2 answer: ${findRating(lines, true)*findRating(lines, false)}`)
    console.timeEnd('Problem 2 run time');
}

function findRating(bits, oxygen) {
    return parseInt(findRatingRecursive(bits, 0, oxygen), 2);
}

function findRatingRecursive(bits, bitIndex, oxygen) {
    if(bits.length === 1) {
        return bits[0];
    }

    let zerosCount = 0;
    let onesCount = 0;

    for(let i = 0; i < bits.length; i++) {
        bits[i][bitIndex] === '0' ? zerosCount++ : onesCount++;
    }

    let bitToKeep;
    if(oxygen) {
        bitToKeep = onesCount >= zerosCount ? '1':'0';
    }
    else {
        bitToKeep = onesCount < zerosCount ? '1':'0';
    }
    
    let newBits = [];
    for(let i = 0; i < bits.length; i++) {
        if(bits[i][bitIndex] === bitToKeep) {
            newBits = [...newBits, bits[i]];
        }
    }
    
    return findRatingRecursive(newBits, bitIndex+1, oxygen);
}

problem1();
problem2();