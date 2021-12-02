const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    let depth = 0;
    let position = 0;

    for(let i = 0; i < lines.length; i++) {
        const tokens = lines[i].split(" ");
        const value = parseInt(tokens[1], 10);
        switch(tokens[0]) {
            case 'forward':
                position += value;
                break;
            case 'down':
                depth += value;
                break;
            case 'up':
                depth -= value;
                break;
        }
    }
    
    console.log(`Problem 1 answer: ${depth*position}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    let depth = 0;
    let position = 0;
    let aim = 0;

    for(let i = 0; i < lines.length; i++) {
        const tokens = lines[i].split(" ");
        const value = parseInt(tokens[1], 10);
        switch(tokens[0]) {
            case 'forward':
                position += value;
                depth += aim*value
                break;
            case 'down':
                aim += value;
                break;
            case 'up':
                aim -= value;
                break;
        }
    }
    
    console.log(`\nProblem 2 answer: ${depth*position}`)
    console.timeEnd('Problem 2 run time');
}


problem1();
problem2();