const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);
// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    const DAYS_PASSED = 80;

    let fishes = lines[0].split(',');
    let fishesDict = {};
    for(let i = 0; i < fishes.length; i++) {
        let fishDay = parseInt(fishes[i], 10)
        fishesDict[fishDay] = ++fishesDict[fishDay] || 1;
    }

    for(let i = 0; i < DAYS_PASSED; i++) {
        let newDict = {};
        for(let k in fishesDict) {
            let newDay = parseInt(k,10)-1;
            if(newDay == -1) {
                newDict[6] = newDict[6]+fishesDict[k] || fishesDict[k];
                newDict[8] = newDict[8]+fishesDict[k] || fishesDict[k];
            }
            else {
                newDict[newDay] = newDict[newDay]+fishesDict[k] || fishesDict[k];
            }
        }
        fishesDict = newDict;
    }

    let sum = 0;
    for(let k in fishesDict) {
        sum += fishesDict[k];
    }
    
    console.log(`Problem 1 answer: ${sum}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    const DAYS_PASSED = 256;

    let fishes = lines[0].split(',');
    let fishesDict = {};
    for(let i = 0; i < fishes.length; i++) {
        let fishDay = parseInt(fishes[i], 10)
        fishesDict[fishDay] = ++fishesDict[fishDay] || 1;
    }

    for(let i = 0; i < DAYS_PASSED; i++) {
        let newDict = {};
        for(let k in fishesDict) {
            let newDay = parseInt(k,10)-1;
            if(newDay == -1) {
                newDict[6] = newDict[6]+fishesDict[k] || fishesDict[k];
                newDict[8] = newDict[8]+fishesDict[k] || fishesDict[k];
            }
            else {
                newDict[newDay] = newDict[newDay]+fishesDict[k] || fishesDict[k];
            }
        }
        fishesDict = newDict;
    }

    let sum = 0;
    for(let k in fishesDict) {
        sum += fishesDict[k];
    }
    
    console.log(`\nProblem 2 answer: ${sum}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();