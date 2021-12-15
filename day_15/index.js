const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);
const Y_MAX = lines.length;
const X_MAX = lines[0].length;
let risk = [];
for(let x = 0; x < X_MAX; x++) {
    let column = [];
    for(let y = 0; y < Y_MAX; y++) {
        column.push(parseInt(lines[y][x], 10));
    }
    risk.push(column);
}

Array.prototype.equals = function(array) {
    if(JSON.stringify(array) == JSON.stringify(this)) {
        return true;
    }
    return false;
}

Array.prototype.includesArray = function(array) {
    for(let i = 0; i < this.length; i++) {
        if(array.equals(this[i])) {
            return true;
        }
    }
    return false;
}

Array.prototype.removeArray = function(array) {
    return this.filter(el => !el.equals(array))
}

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let totalRisk = [];
    let unvisited = [];
    for(let x = 0; x < X_MAX; x++) {
        let column = [];
        for(let y = 0; y < Y_MAX; y++) {
            column.push(Number.MAX_SAFE_INTEGER);
        }
        totalRisk.push(column);
    }
    totalRisk[0][0] = 0;
    unvisited.push([0,0]);

    while(unvisited.length > 0) {
        let smallest = Number.MAX_SAFE_INTEGER;
        let smallestPosition = null;

        for(let i = 0; i < unvisited.length; i++) {
            let x = unvisited[i][0];
            let y = unvisited[i][1];
            if(totalRisk[x][y] < smallest) {
                smallest = totalRisk[x][y];
                smallestPosition = [x,y];
            }
        }
        
        for(let i = 0; i < unvisited.length; i++) {
            if(unvisited[i].equals(smallestPosition)) {
                unvisited.splice(i, 1)
                break;
            }
        }

        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++){
                let x = smallestPosition[0] + i;
                let y = smallestPosition[1] + j;
                if(
                    (x >= 0) && (x < X_MAX) &&
                    (y >= 0) && (y < Y_MAX) &&
                    (i != 0 || j != 0)      &&
                    (i == 0 || j == 0)
                ) {
                    let neighbourRisk = totalRisk[smallestPosition[0]][smallestPosition[1]] + risk[x][y];
                    if(totalRisk[x][y] == Number.MAX_SAFE_INTEGER) {
                        unvisited.push([x,y])
                    }

                    if(!totalRisk[x][y] || neighbourRisk < totalRisk[x][y]) {
                        totalRisk[x][y] = neighbourRisk;
                    }
                }   
            }
        }
    }

    console.log(`Problem 1 answer: ${totalRisk[X_MAX-1][Y_MAX-1]}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    const X_MAX_LARGE = X_MAX*5;
    const Y_MAX_LARGE = Y_MAX*5;
    let largeRisk = [];
    for(let x = 0; x < X_MAX_LARGE; x++) {
        let largeRiskRow = [];
        for(let y = 0; y < Y_MAX_LARGE; y++) {
            let riskValue = risk[x%X_MAX][y%Y_MAX] + Math.floor(x/X_MAX) + Math.floor(y/Y_MAX);
            riskValue = riskValue > 9 ? riskValue-9 : riskValue;
            largeRiskRow.push(riskValue);
        }
        largeRisk.push(largeRiskRow);
    }

    let totalRisk = [];
    let unvisited = [];
    for(let x = 0; x < X_MAX_LARGE; x++) {
        let column = [];
        for(let y = 0; y < Y_MAX_LARGE; y++) {
            column.push(Number.MAX_SAFE_INTEGER);
        }
        totalRisk.push(column);
    }
    totalRisk[0][0] = 0;
    unvisited.push([0,0]);

    while(unvisited.length > 0) {
        let smallest = Number.MAX_SAFE_INTEGER;
        let smallestPosition = null;

        for(let i = 0; i < unvisited.length; i++) {
            let x = unvisited[i][0];
            let y = unvisited[i][1];
            if(totalRisk[x][y] < smallest) {
                smallest = totalRisk[x][y];
                smallestPosition = [x,y];
            }
        }
        
        for(let i = 0; i < unvisited.length; i++) {
            if(unvisited[i].equals(smallestPosition)) {
                unvisited.splice(i, 1)
                break;
            }
        }

        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++){
                let x = smallestPosition[0] + i;
                let y = smallestPosition[1] + j;
                if(
                    (x >= 0) && (x < X_MAX_LARGE) &&
                    (y >= 0) && (y < Y_MAX_LARGE) &&
                    (i != 0 || j != 0)      &&
                    (i == 0 || j == 0)
                ) {
                    let neighbourRisk = totalRisk[smallestPosition[0]][smallestPosition[1]] + largeRisk[x][y];
                    if(totalRisk[x][y] == Number.MAX_SAFE_INTEGER) {
                        unvisited.push([x,y])
                    }

                    if(!totalRisk[x][y] || neighbourRisk < totalRisk[x][y]) {
                        totalRisk[x][y] = neighbourRisk;
                    }
                }   
            }
        }
    }

    console.log(`\nProblem 2 answer: ${totalRisk[X_MAX_LARGE-1][Y_MAX_LARGE-1]}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();