const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    const positions = lines[0].split(',').map(x=>parseInt(x, 10));
    const min = positions.reduce((min, val) => min < val ? min : val);
    const max = positions.reduce((max, val) => max > val ? max : val);

    let lowestFuel = null;
    let lowestPosition = null;
    for(let positionValue = min; positionValue <= max; positionValue++) {
        let tempPosition = [...positions];
        let fuel = 0;

        for(let i = 0; i < tempPosition.length; i++) {
            while(tempPosition[i] != positionValue) {
                if(tempPosition[i] < positionValue) {
                    tempPosition[i]++;
                    fuel++;
                }
                else if(tempPosition[i] > positionValue) {
                    tempPosition[i]--;
                    fuel++;
                }
            }
        }

        lowestPosition = (!(!!lowestPosition) || fuel < lowestFuel)?positionValue:lowestPosition;
        lowestFuel = (!(!!lowestFuel) || fuel < lowestFuel)?fuel:lowestFuel;
    }

    console.log(`Problem 1 answer: position=${lowestPosition} fuel=${lowestFuel}`)
    console.timeEnd('Problem 1 run time');
}


// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    const positions = lines[0].split(',').map(x=>parseInt(x, 10));
    const min = positions.reduce((min, val) => min < val ? min : val);
    const max = positions.reduce((max, val) => max > val ? max : val);

    let lowestFuel = null;
    let lowestPosition = null;
    for(let positionValue = min; positionValue <= max; positionValue++) {
        let tempPosition = [...positions];
        let fuel = 0;
        
        for(let i = 0; i < tempPosition.length; i++) {
            let cost = 1;
            while(tempPosition[i] != positionValue) {
                if(tempPosition[i] < positionValue) {
                    tempPosition[i]++;
                    fuel+=cost;
                }
                else if(tempPosition[i] > positionValue) {
                    tempPosition[i]--;
                    fuel+=cost;
                }
                cost++;
            }
        }
        lowestPosition = (!(!!lowestPosition) || fuel < lowestFuel)?positionValue:lowestPosition;
        lowestFuel = (!(!!lowestFuel) || fuel < lowestFuel)?fuel:lowestFuel;
    }

    console.log(`\nProblem 2 answer: position=${lowestPosition} fuel=${lowestFuel}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();