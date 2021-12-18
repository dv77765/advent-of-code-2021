const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
let dataSplit = data.split('x=')[1].split(', y=');

const targetX = dataSplit[0].split('..').map(x => parseInt(x, 10));
const targetY = dataSplit[1].split('..').map(y => parseInt(y, 10));

const GRAVITY = 1;
const DRAG = 1;

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

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    
    let optimalXVelocity = findOptimalXVelocity(targetX);
    let optimalYVelocity = findOptimalYVelocity(targetY);

    let highestY = simuateProjectile([optimalXVelocity, optimalYVelocity], [targetX, targetY], false).highest;

    console.log(`Problem 1 answer: ${highestY}`)
    console.timeEnd('Problem 1 run time');
}

function findOptimalXVelocity(target) {
    let optimalVelocity = 0;
    
    let found = false;
    while(!found) {
        optimalVelocity++;

        let x = 0;
        let velocity = optimalVelocity;
        while(velocity != 0) {
            x += velocity;
            velocity -= DRAG;
        }

        if(x >= target[0] && x <= target[1]) {
            found = true;
        }
    }

    return optimalVelocity;
}

function findOptimalYVelocity(target, searchMax = 1000) {
    let currentVelocity = searchMax;
    let found = false;
    while(!found && currentVelocity > 1) {
        currentVelocity--;

        let y = 0;
        let velocity = currentVelocity;
        while(y > target[1]) {
            y += velocity;
            velocity -= GRAVITY;
        }

        if(y >= target[0] && y <= target[1]) {
            found = true;
        }
    }

    return currentVelocity;
}

// initialVelocity: [x,y]
// target: [[x1,x2], [y1,y2]]
function simuateProjectile(initialVelocity, target, print = false) {
    if(initialVelocity[0] < 0) {
        return
    }

    let x = 0;
    let y = 0;
    let velocityX = initialVelocity[0];
    let velocityY = initialVelocity[1];

    // simulate
    let pastPositions = []
    while(x < target[0][1] && y > target[1][0]) {
        x += velocityX;
        y += velocityY;
        pastPositions.push([x,y]);

        if(velocityX > 0) {
            velocityX = velocityX-DRAG;
        }

        velocityY -= GRAVITY;
    }

    // print
    if(print) {
        let lowestX = 0;
        let lowestY = pastPositions[pastPositions.length-1][1] < target[1][0] ? pastPositions[pastPositions.length-1][1] : target[1][0];
        let highestX = pastPositions[pastPositions.length-1][0] > target[0][1] ? pastPositions[pastPositions.length-1][0] : target[0][1];
        let highestY = pastPositions.reduce((highest, pos) => {
            if(pos[1] > highest) {
                return pos[1];
            }
            return highest;
        }, 0);

        let str = '';
        for(let printY = highestY; printY >= lowestY; printY--) {
            for(let printX = lowestX; printX <= highestX; printX++) {
                if(printY == 0 && printX == 0) {
                    str += 'S';
                }
                else if(pastPositions.includesArray([printX, printY])) {
                    str += '#';
                }
                else if(printY >= target[1][0] && printY <= target[1][1] && printX >= target[0][0] && printX <= target[0][1]) {
                    str += 'T';
                }
                else {
                    str += '.';
                }
            }
            str += '\n';
        }
        console.log(str)
    }

    let result = {}
    result['valid'] = false;
    if(pastPositions.length > 0) {
        for(let i = 0; i < pastPositions.length; i++) {
            let validX = pastPositions[i][0];
            let validY = pastPositions[i][1];
            if(validY >= target[1][0] && validY <= target[1][1] && validX >= target[0][0] && validX <= target[0][1]) {
                result['valid'] = true;
                break;
            }
        } 
    }

    result['highest'] = pastPositions.reduce((highest, pos) => {
        if(pos[1] > highest) {
            return pos[1];
        }
        return highest;
    }, 0);

    return result;
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let count = 0;
    for(let i = 0; i < 500; i++) {
        for(let j = -500; j < 500; j++) {
            let valid = simuateProjectile([i, j], [targetX, targetY], false).valid;
            if(valid) {
                count++;
            }
        }
    }
    
    console.log(`\nProblem 2 answer: ${count}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();