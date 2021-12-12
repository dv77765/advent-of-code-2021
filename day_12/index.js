const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

let map = {};
for(let i = 0; i < lines.length; i++) {
    let tokens = lines[i].split('-');
    map[tokens[0]] = !!map[tokens[0]]?[...map[tokens[0]], tokens[1]]:[tokens[1]]
    map[tokens[1]] = !!map[tokens[1]]?[...map[tokens[1]], tokens[0]]:[tokens[0]]
}

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let paths = DFS('start', []);

    console.log(`Problem 1 answer: ${paths.length}`)
    console.timeEnd('Problem 1 run time');
}

function DFS(current, path) {
    path.push(current);
    if(current == 'end') {
        return [[...path]];
    }

    let movablePositions = map[current] || [];
    
    let paths = []
    for(let i = 0; i < movablePositions.length; i++) {
        if(movablePositions[i].toUpperCase() == movablePositions[i] || !path.includes(movablePositions[i])) {
            paths.push(...DFS(movablePositions[i], [...path]))
        }
    }
    return paths;
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let paths = DFS2('start', []);
    
    console.log(`\nProblem 2 answer: ${paths.length}`)
    console.timeEnd('Problem 2 run time');
}

function DFS2(current, path) {
    path.push(current);
    if(current == 'end') {
        return [[...path]];
    }

    let movablePositions = map[current] || [];
    let pathCount = path.reduce((m, value) => {
        m[value] = (m[value] || 0) + 1;
        return m;
    }, {});

    let visitedTwice = false;
    for(let k in pathCount) {
        if(k.toLowerCase() == k && pathCount[k] > 1) {
            visitedTwice = true;
        }
    }
    
    let paths = []
    for(let i = 0; i < movablePositions.length; i++) {
        if((movablePositions[i].toUpperCase() == movablePositions[i] || !visitedTwice || !path.includes(movablePositions[i])) && movablePositions[i] != 'start') {
            paths.push(...DFS2(movablePositions[i], [...path]))
        }
    }
    return paths;
}

problem1();
problem2();