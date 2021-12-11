const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let heightmap = [];
    
    for(let i = 0; i < lines.length; i++) {
        let row = lines[i].split('').map(x=> parseInt(x, 10))
        heightmap.push(row);
    }
    let sum = 0;
    for(let y = 0; y < heightmap.length; y++) {
        for(let x = 0; x < heightmap[y].length; x++) {
            let lowest = true;
            let current = heightmap[y][x];

            if(
                ((y > 0) && (current >= heightmap[y-1][x])) ||
                ((y < heightmap.length-1) && (current >= heightmap[y+1][x])) || 
                ((x > 0) && (current >= heightmap[y][x-1])) ||
                ((x < heightmap[y].length-1) && (current >= heightmap[y][x+1]))
            ) {
                lowest = false;
            }

            if(lowest) {
                sum += current+1;
            }
        }
    }

    console.log(`Problem 1 answer: ${sum}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let heightmap = [];
    let lowestPoints = [];

    for(let i = 0; i < lines.length; i++) {
        let row = lines[i].split('').map(x=> parseInt(x, 10))
        heightmap.push(row);
    }

    for(let y = 0; y < heightmap.length; y++) {
        for(let x = 0; x < heightmap[y].length; x++) {
            let lowest = true;
            let current = heightmap[y][x];

            if(
                ((y > 0) && (current >= heightmap[y-1][x])) ||
                ((y < heightmap.length-1) && (current >= heightmap[y+1][x])) || 
                ((x > 0) && (current >= heightmap[y][x-1])) ||
                ((x < heightmap[y].length-1) && (current >= heightmap[y][x+1]))
            ) {
                lowest = false;
            }

            if(lowest) {
                lowestPoints.push([x,y])
            }
        }
    }
    let sizes = []
    for(let i = 0; i < lowestPoints.length; i++) {
        const lowestX = lowestPoints[i][0];
        const lowestY = lowestPoints[i][1];

        let visited = [];
        let queue = [[lowestX, lowestY]];
        let size = 1;
        while(queue.length > 0) {
            let point = queue.shift();
            let pointX = point[0];
            let pointY = point[1];
            let currentDepth = heightmap[pointY][pointX];
            
            if(
                (pointY > 0) && 
                (currentDepth < heightmap[pointY-1][pointX]) && 
                (heightmap[pointY-1][pointX] != 9) && 
                !arrayIncludesArray(visited, [pointX, pointY-1]) &&
                !arrayIncludesArray(queue, [pointX, pointY-1])
            ) {
                queue.push([pointX, pointY-1])
                size++;
            }

            if(
                ((pointY < heightmap.length-1) && 
                (currentDepth < heightmap[pointY+1][pointX])) && 
                (heightmap[pointY+1][pointX] != 9) && 
                !arrayIncludesArray(visited, [pointX, pointY+1]) &&
                !arrayIncludesArray(queue, [pointX, pointY+1])
            ) {
                queue.push([pointX, pointY+1])
                size++;
            }

            if(
                (pointX > 0) && 
                (currentDepth < heightmap[pointY][pointX-1]) && 
                (heightmap[pointY][pointX-1] != 9) && 
                !arrayIncludesArray(visited, [pointX-1, pointY]) &&
                !arrayIncludesArray(queue, [pointX-1, pointY])
            ) {
                queue.push([pointX-1, pointY])
                size++;
            }

            if(
                ((pointX < heightmap[pointY].length-1) && 
                (currentDepth < heightmap[pointY][pointX+1])) && 
                (heightmap[pointY][pointX+1] != 9) && 
                !arrayIncludesArray(visited, [pointX+1, pointY]) &&
                !arrayIncludesArray(queue, [pointX+1, pointY])
            ) {
                queue.push([pointX+1, pointY])
                size++;
            }

            visited.push(point);
        }
        sizes.push(size)
    }

    sizes = sizes.sort((a,b) => b-a)

    console.log(`\nProblem 2 answer: ${sizes[0]*sizes[1]*sizes[2]}`)
    console.timeEnd('Problem 2 run time');
}

function arrayIncludesArray(array, value) {
    for(let i = 0; i < array.length; i++) {
        if(arrayEqual(array[i], value)) {
            return true;
        }
    }
    return false;
}

function arrayEqual(array1, array2) {
    if(array1.length != array2.length) {
        return false;
    }

    for(let i = 0; i < array1.length; i++) {
        if(array1[i] != array2[i]) {
            return false;
        }
    } 
    
    return true;
}
problem1();
problem2();