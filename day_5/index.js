const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    let pointsDict = {}
    
    for(let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let points = lines[lineIndex].split(' -> ');
        points = points.map(outer => outer.split(',').map(inner => parseInt(inner, 10)))

        if(points[0][0] == points[1][0] || points[0][1] == points[1][1]) {
            let x1 = points[0][0];
            let y1 = points[0][1];
            
            const x2 = points[1][0];
            const y2 = points[1][1];

            pointsDict[`${x1}-${y1}`] = ++pointsDict[`${x1}-${y1}`] || 1;

            while(x1 != x2 || y1 != y2) {
                x1+=(x2-x1)/Math.abs(x2-x1) || 0;
                y1+=(y2-y1)/Math.abs(y2-y1) || 0;

                pointsDict[`${x1}-${y1}`] = ++pointsDict[`${x1}-${y1}`] || 1;
            }

        }
    }
    let sum = 0;
    for(let k in pointsDict) {
        if(pointsDict[k] > 1) {
            sum++;
        }
    }
    console.log(`Problem 1 answer: ${sum}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    let pointsDict = {}
    
    for(let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let points = lines[lineIndex].split(' -> ');
        points = points.map(outer => outer.split(',').map(inner => parseInt(inner, 10)))

        let x1 = points[0][0];
        let y1 = points[0][1];
        
        const x2 = points[1][0];
        const y2 = points[1][1];

        pointsDict[`${x1}-${y1}`] = ++pointsDict[`${x1}-${y1}`] || 1;

        while(x1 != x2 || y1 != y2) {
            x1+=(x2-x1)/Math.abs(x2-x1) || 0;
            y1+=(y2-y1)/Math.abs(y2-y1) || 0;

            pointsDict[`${x1}-${y1}`]  = ++pointsDict[`${x1}-${y1}`] || 1;
        }
    }
    let sum = 0;
    for(let k in pointsDict) {
        if(pointsDict[k] > 1) {
            sum++;
        }
    }
    
    console.log(`\nProblem 2 answer: ${sum}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();