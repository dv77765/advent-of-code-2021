const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    const STEPS = 100;
    const X_SIZE = lines[0].length;
    const Y_SIZE = lines.length;
    let energyArray = [];
    let numberOfFlashes = 0;
    for(let x = 0; x < X_SIZE; x++) {
        let column = [];
        for(let y = 0; y < Y_SIZE; y++) {
            column.push(parseInt(lines[x][y], 10));
        }
        energyArray.push(column);
    }

    for(let i = 0; i < STEPS; i++) {
        let flashedArray = [];

        for(let x  = 0; x < X_SIZE; x++) {
            let flashedArrayRow = [];
            for(let y = 0; y < Y_SIZE; y++) {
                energyArray[x][y]++;
                flashedArrayRow.push(energyArray[x][y] > 9);
            }
            flashedArray.push(flashedArrayRow);
        }

        
        let changed;
        do {
            changed = false;
            for(let x = 0; x < X_SIZE; x++) {
                for(let y = 0; y < Y_SIZE; y++) {
                    let value = energyArray[x][y];
                    for(let x_ = -1; x_ <= 1; x_++) {
                        for(let y_ = -1; y_ <= 1; y_++) {
                            if(
                                (x_ != 0 || y_ != 0) && 
                                (x+x_) >= 0 && 
                                (y+y_) >= 0 && 
                                (x+x_) < X_SIZE && 
                                (y+y_) < Y_SIZE
                            ) {
                                value = flashedArray[x+x_][y+y_]?value+1:value;
                            }
                        }
                    }
    
                    if(value > 9 && !flashedArray[x][y]) {
                        flashedArray[x][y] = true;
                        changed = true;
                    }
                }
            }
        } while(changed);

        for(let x  = 0; x < X_SIZE; x++) {
            for(let y = 0; y < Y_SIZE; y++) {
                for(let x_ = -1; x_ <= 1; x_++) {
                    for(let y_ = -1; y_ <= 1; y_++) {
                        if(
                            (x_ != 0 || y_ != 0) && 
                            (x+x_) >= 0 && 
                            (y+y_) >= 0 && 
                            (x+x_) < X_SIZE && 
                            (y+y_) < Y_SIZE
                        ) {
                            energyArray[x][y] = flashedArray[x+x_][y+y_]?energyArray[x][y]+1:energyArray[x][y];
                        }
                    }
                }

                if(flashedArray[x][y]) {
                    numberOfFlashes++;
                    energyArray[x][y] = 0;
                }
            }
        }
        // let str = ''
        // for(let x  = 0; x < X_SIZE; x++) {
        //     for(let y = 0; y < Y_SIZE; y++) {
        //         if(flashedArray[x][y]) {
        //             str += '\x1b[31m0\x1b[0m';
        //         }
        //         else {
        //             str += energyArray[x][y].toString();
        //         }
        //     }
        //     str += '\n';
        // }
        // console.log(str)
    }


    console.log(`Problem 1 answer: ${numberOfFlashes}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    let step = 0;
    const X_SIZE = lines[0].length;
    const Y_SIZE = lines.length;
    let energyArray = [];
    for(let x = 0; x < X_SIZE; x++) {
        let column = [];
        for(let y = 0; y < Y_SIZE; y++) {
            column.push(parseInt(lines[x][y], 10));
        }
        energyArray.push(column);
    }

    while(!energyArray.every((value) => value.every((value2) => value2 == 0))) {
        let flashedArray = [];

        for(let x  = 0; x < X_SIZE; x++) {
            let flashedArrayRow = [];
            for(let y = 0; y < Y_SIZE; y++) {
                energyArray[x][y]++;
                flashedArrayRow.push(energyArray[x][y] > 9);
            }
            flashedArray.push(flashedArrayRow);
        }

        
        let changed;
        do {
            changed = false;
            for(let x = 0; x < X_SIZE; x++) {
                for(let y = 0; y < Y_SIZE; y++) {
                    let value = energyArray[x][y];
                    for(let x_ = -1; x_ <= 1; x_++) {
                        for(let y_ = -1; y_ <= 1; y_++) {
                            if(
                                (x_ != 0 || y_ != 0) && 
                                (x+x_) >= 0 && 
                                (y+y_) >= 0 && 
                                (x+x_) < X_SIZE && 
                                (y+y_) < Y_SIZE
                            ) {
                                value = flashedArray[x+x_][y+y_]?value+1:value;
                            }
                        }
                    }
    
                    if(value > 9 && !flashedArray[x][y]) {
                        flashedArray[x][y] = true;
                        changed = true;
                    }
                }
            }
        } while(changed);

        for(let x  = 0; x < X_SIZE; x++) {
            for(let y = 0; y < Y_SIZE; y++) {
                for(let x_ = -1; x_ <= 1; x_++) {
                    for(let y_ = -1; y_ <= 1; y_++) {
                        if(
                            (x_ != 0 || y_ != 0) && 
                            (x+x_) >= 0 && 
                            (y+y_) >= 0 && 
                            (x+x_) < X_SIZE && 
                            (y+y_) < Y_SIZE
                        ) {
                            energyArray[x][y] = flashedArray[x+x_][y+y_]?energyArray[x][y]+1:energyArray[x][y];
                        }
                    }
                }

                if(flashedArray[x][y]) {
                    energyArray[x][y] = 0;
                }
            }
        }
        step++
    }
    
    console.log(`\nProblem 2 answer: ${step}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();