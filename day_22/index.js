const { count } = require('console');
const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

const STEPS = lines.map(line => {
    line = line.split(' ');
    let on = line[0] == 'on' ? true : false;
    let coords = line[1].split(',').map(coord => {
        coord = coord.split('..');
        return [parseInt(coord[0].substring(2), 10), parseInt(coord[1])];
    })
    return {'on': on, 'region':coords};
});

// ------------ PROBLEM 1 ------------
// brute force
function problem1() {
    console.time('Problem 1 run time');

    const REGION = [[-50,50],[-50,50],[-50,50]];
    let cubes = runSteps(STEPS, REGION);

    
    console.log(`Problem 1 answer: ${countCubes(cubes)}`)
    console.timeEnd('Problem 1 run time');
}

function runSteps(steps, region) {
    const sizeX = region[0][1]-region[0][0]+1;
    const offsetX = -region[0][0];

    const sizeY = region[1][1]-region[1][0]+1;
    const offsetY = -region[1][0];

    const sizeZ = region[2][1]-region[2][0]+1;
    const offsetZ = -region[2][0];
    
    let cubes = []
    for(let x = 0; x < sizeX; x++) {
        let cubesY = []
        for(let y = 0; y < sizeY; y++) {
            let cubesZ = []
            for(let z = 0; z < sizeZ; z++) {
                cubesZ.push(false)
            }
            cubesY.push(cubesZ)
        }
        cubes.push(cubesY)
    }

    for(let i = 0; i < steps.length; i++) {
        let stepRegion = steps[i].region;
        let newStepRegion = [
                                [stepRegion[0][0] >= region[0][0] ? stepRegion[0][0]+offsetX : region[0][0]+offsetX, stepRegion[0][1] <= region[0][1] ? stepRegion[0][1]+offsetX : region[0][1]+offsetX],
                                [stepRegion[1][0] >= region[1][0] ? stepRegion[1][0]+offsetY : region[1][0]+offsetY, stepRegion[1][1] <= region[1][1] ? stepRegion[1][1]+offsetY : region[1][1]+offsetY],
                                [stepRegion[2][0] >= region[2][0] ? stepRegion[2][0]+offsetZ : region[2][0]+offsetZ, stepRegion[2][1] <= region[2][1] ? stepRegion[2][1]+offsetZ : region[2][1]+offsetZ]
                            ];
        for(let x = newStepRegion[0][0]; x <= newStepRegion[0][1]; x++) {
            for(let y = newStepRegion[1][0]; y <= newStepRegion[1][1]; y++) {
                for(let z = newStepRegion[2][0]; z <= newStepRegion[2][1]; z++) {
                    cubes[x][y][z] = steps[i].on;
                }
            }
        }
    }
    return cubes
}

function countCubes(cubes) {
    let count = 0;
    for(let x = 0; x < cubes.length; x++) {
        for(let y = 0; y < cubes[x].length; y++) {
            for(let z = 0; z < cubes[x][y].length; z++) {
                if(cubes[x][y][z]) {
                    count++;
                }
            }
        }
    }

    return count;
}

// ------------ PROBLEM 2 ------------
// calculate volume of each step
function problem2() {
    console.time('Problem 2 run time');

    let volume = calclateVolume(STEPS);
    console.log(`\nProblem 2 answer: ${volume}`)
    console.timeEnd('Problem 2 run time');
}

function calclateVolume(steps) {
    let totalVolume = 0;
    for(let i = 0; i < steps.length; i++) {
        let previousSteps = JSON.parse(JSON.stringify(steps.slice(0, i)));
        totalVolume += calclateVolumeStep(steps[i], previousSteps)
    }
    return totalVolume;
}

function calclateVolumeStep(step, previousSteps) {
    let stepVolume = step.on ? regionVolume(step.region) : 0;
    while(previousSteps.length > 0) {
        let prevStep = previousSteps.pop();
        let interceptRegion = getInterceptRegion(step.region, prevStep.region);
        if(interceptRegion != null) {
            stepVolume -= calclateVolumeStep({'region': interceptRegion, 'on': prevStep.on}, JSON.parse(JSON.stringify(previousSteps)))
        } 
    }
    return stepVolume;
}

function regionVolume(region) {
    const sizeX = region[0][1]-region[0][0]+1;
    const sizeY = region[1][1]-region[1][0]+1;
    const sizeZ = region[2][1]-region[2][0]+1;
    return sizeX*sizeY*sizeZ;
}

function getInterceptRegion(region1, region2) {
    // x axis
    let leftX = region1[0][0] > region2[0][0] ? region1[0][0] : region2[0][0];
    let rightX = region1[0][1] < region2[0][1] ? region1[0][1] : region2[0][1];

    // y axis
    let leftY = region1[1][0] > region2[1][0] ? region1[1][0] : region2[1][0];
    let rightY = region1[1][1] < region2[1][1] ? region1[1][1] : region2[1][1];
    
    // // z axis
    let leftZ = region1[2][0] > region2[2][0] ? region1[2][0] : region2[2][0];
    let rightZ = region1[2][1] < region2[2][1] ? region1[2][1] : region2[2][1];


    if(leftX > rightX || leftY > rightY || leftZ > rightZ) {
            return null;
    }

    return [
        [leftX, rightX],
        [leftY, rightY],
        [leftZ, rightZ]
    ]; 
}
problem1();
problem2();