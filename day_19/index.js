const fs = require('fs');
const { e } = require('mathjs');

const data = fs.readFileSync('data.txt', 'utf8');
let scanners = data.split(/\r?\n\r?\n/);

scanners = scanners.map(scanner => {
    let s = scanner.split(/\r?\n/);
    s.shift();
    return s.map(posStr => {
        let positions = posStr.split(',');
        return positions.map(pos => parseInt(pos, 10));
    })
})

const math = require('mathjs')
/*
    ---- Rotation ----
    0
    [x,y,z] -> [x,y,z]
    [
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ]

    90
    [x,y,z] -> [-y,x,z]
    [
        [0,1,0],
        [-1,0,0],
        [0,0,1]
    ]

    180
    [x,y,z] -> [-x,-y,z]
    [
        [-1,0,0],
        [0,-1,0],
        [0,0,1]
    ]

    270
    [x,y,z] -> [y,-x,z]
    [
        [0,-1,0],
        [1,0,0],
        [0,0,1]
    ]
*/
const rotationMatrices = [
    [
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ],
    [
        [0,1,0],
        [-1,0,0],
        [0,0,1]
    ],
    [
        [-1,0,0],
        [0,-1,0],
        [0,0,1]
    ],
    [
        [0,-1,0],
        [1,0,0],
        [0,0,1]
    ]
]


/*
    ---- Facing up ---
       o--------o
      /        /|
     /    2   / |
    o--------o 3|
    |        |  o
    |   1    | /
    |        |/
    o--------o
      ---
      |2|
    -------
    |5|1|3|
    -------
      |4|
      ---
      |6|
      ---

    2
    [x,y,z] -> [x,y,z]
    [
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ]

    1
    [x,y,z] -> [x,z,-y]
    [
        [1,0,0],
        [0,0,-1],
        [0,1,0]
    ]

    4
    [x,y,z] -> [x,-y,-z]
    [
        [1,0,0],
        [0,-1,0],
        [0,0,-1]
    ]

    6
    [x,y,z] -> [x,-z,y]
    [
        [1,0,0],
        [0,0,1],
        [0,-1,]
    ]

    5
    [x,y,z] -> [-y,z,-x]
    [
        [0,0,-1],
        [-1,0,0],
        [0,1,0]
    ]

    3
    [x,y,z] -> [y,z,x]
    [
        [0,0,1],
        [1,0,0],
        [0,1,0]
    ]
*/
const faceMatrices = [
    [
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ],
    [
        [1,0,0],
        [0,0,-1],
        [0,1,0]
    ],
    [
        [1,0,0],
        [0,-1,0],
        [0,0,-1]
    ],
    [
        [1,0,0],
        [0,0,1],
        [0,-1,0]
    ],
    [
        [0,0,-1],
        [-1,0,0],
        [0,1,0]
    ],
    [
        [0,0,1],
        [1,0,0],
        [0,1,0]
    ]
]

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let relativeBeacons = scanners.shift();

    while(scanners.length > 0) {
        let scanner = scanners.shift();
        let found = false;
        for(let f = 0; f < faceMatrices.length; f++) {
            let faceBeacons = [...scanner];
            faceBeacons = faceBeacons.map(beacon => {
                let matrix = math.matrix(beacon);
                return math.multiply(matrix, faceMatrices[f]).toArray();
            })
    
            for(let r = 0; r < rotationMatrices.length; r++) {
                let rotationBeacons = [...faceBeacons];
                rotationBeacons = rotationBeacons.map(beacon => {
                    let matrix = math.matrix(beacon);
                    return math.multiply(matrix, rotationMatrices[r]).toArray();
                }) 
                let nonOverlapping = getNonOverlapping(relativeBeacons, rotationBeacons).nonOverlapping;
                if(nonOverlapping != null) {
                    relativeBeacons.push(...nonOverlapping);
                    found = true;
                }
            }
        }

        if(!found) {
            scanners.push(scanner);
        }
    }


    console.log(`Problem 1 answer: ${relativeBeacons.length}`)
    console.timeEnd('Problem 1 run time');
}

function getNonOverlapping(beacons1, beacons2) {
    let ret = {scanner: null, nonOverlapping: null}
    const OVERLAPPING_COUNT = 12;
    let beacons1JSON = beacons1.map(el => JSON.stringify(el));

    for(let i = 0; i < beacons1.length; i++) {
        let originX = beacons1[i][0];
        let originY = beacons1[i][1];
        let originZ = beacons1[i][2];

        for(let j = 0; j < beacons2.length; j++) {
            let differenceX = originX-beacons2[j][0];
            let differenceY = originY-beacons2[j][1];
            let differenceZ = originZ-beacons2[j][2];
            let count = 0;
            let nonOverlapping = []
            for(let k = 0; k < beacons2.length; k++) {
                let beaconX = beacons2[k][0] + differenceX;
                let beaconY = beacons2[k][1] + differenceY;
                let beaconZ = beacons2[k][2] + differenceZ;
                if(beacons1JSON.includes(JSON.stringify([beaconX, beaconY, beaconZ]))) {
                    count++;
                }
                else {
                    nonOverlapping.push([beaconX, beaconY, beaconZ])
                }
            }
            if(count >= OVERLAPPING_COUNT) {
                ret.nonOverlapping = nonOverlapping;
                ret.scanner = [differenceX, differenceY, differenceZ]
                return ret;
            }
        }
    }

    return ret;
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    let relativeBeacons = scanners.shift();
    let scannerLocations = [[0,0,0]];

    while(scanners.length > 0) {
        let scanner = scanners.shift();
        let found = false;
        for(let f = 0; f < faceMatrices.length; f++) {
            let faceBeacons = [...scanner];
            faceBeacons = faceBeacons.map(beacon => {
                let matrix = math.matrix(beacon);
                return math.multiply(matrix, faceMatrices[f]).toArray();
            })
    
            for(let r = 0; r < rotationMatrices.length; r++) {
                let rotationBeacons = [...faceBeacons];
                rotationBeacons = rotationBeacons.map(beacon => {
                    let matrix = math.matrix(beacon);
                    return math.multiply(matrix, rotationMatrices[r]).toArray();
                }) 
                let ret = getNonOverlapping(relativeBeacons, rotationBeacons);
                if(ret.nonOverlapping != null) {
                    relativeBeacons.push(...(ret.nonOverlapping));
                    scannerLocations.push(ret.scanner);
                    found = true;
                }
            }
        }

        if(!found) {
            scanners.push(scanner);
        }
    }

    let maxDistance = 0;
    for(let i = 0; i < scannerLocations.length; i++) {
        for(let j = i+1; j < scannerLocations.length; j++) {
            let distance = manhattanDistance(scannerLocations[i], scannerLocations[j]);
            maxDistance = distance > maxDistance ? distance : maxDistance;
        }
    }

    console.log(`\nProblem 2 answer: ${maxDistance}`)
    console.timeEnd('Problem 2 run time');
}

function manhattanDistance(pos1, pos2) {
    return Math.abs(pos1[0]-pos2[0])+Math.abs(pos1[1]-pos2[1])+Math.abs(pos1[2]-pos2[2]);
}

problem1();
problem2();