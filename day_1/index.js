const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let current = lines[0];
    let count = 0;
    for(let i = 1; i < lines.length; i++) {
        let parsedInt = parseInt(lines[i], 10);
        if(parsedInt > current) {
            count++;
        }
        current = parsedInt;
    }
    
    console.log(`Problem 1 answer: ${count}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let current = parseInt(lines[0], 10) + parseInt(lines[1], 10) + parseInt(lines[2], 10);
    let count = 0;
    for(let i = 1; i < lines.length-2; i++) {
        let parsedInt = parseInt(lines[i], 10) + parseInt(lines[i+1], 10) + parseInt(lines[i+2], 10);
        if(parsedInt > current) {
            count++;
        }
        current = parsedInt;
    }
    
    console.log(`\nProblem 2 answer: ${count}`)
    console.timeEnd('Problem 2 run time');
}


problem1();
problem2();