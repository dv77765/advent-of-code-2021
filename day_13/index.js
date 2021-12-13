const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const sections = data.split(/\r?\n\r?\n/);
const dots = sections[0].split(/\r?\n/);
const instructions = sections[1].split(/\r?\n/);

// ------------ PROBLEM 1 AND 2 ------------
function problem() {
    console.time('Problem 1 run time');
    console.time('Problem 2 run time');

    let locations = [];


    // initialise array of dot positions
    for(let i = 0; i < dots.length; i++) {
        const tokens = dots[i].split(',');
        const x = parseInt(tokens[0], 10);
        const y = parseInt(tokens[1], 10);


        locations.push([parseInt(tokens[0], 10), parseInt(tokens[1], 10)]);
    }


    for(let i = 0; i < 1; i++) {
        let foldValue = parseInt(instructions[i].replace(/fold along (x|y)=/, ''), 10);
        locations = /x/.test(instructions[i]) ? foldX(locations, foldValue) : foldY(locations, foldValue);
    }

    locations = getUniqueArray(locations);

    console.log(`Problem 1 answer: ${locations.length}`)
    console.timeEnd('Problem 1 run time');


    for(let i = 1; i < instructions.length; i++) {
        let foldValue = parseInt(instructions[i].replace(/fold along (x|y)=/, ''), 10);
        locations = /x/.test(instructions[i]) ? foldX(locations, foldValue) : foldY(locations, foldValue);
    }

    // print grid
    let maxPaperX = locations.reduce((biggest, value) => value[0] > biggest ? value[0] : biggest, 0);
    let maxPaperY = locations.reduce((biggest, value) => value[1] > biggest ? value[1] : biggest, 0);
    let gridStr = '';
    for(let y = 0; y <= maxPaperY; y++) {
        gridStr += '\n';
        for(let x = 0; x <= maxPaperX; x++) {
            gridStr += includesPosition([x,y], locations)?'#':'.';
        }
    }

    console.log(`\nProblem 2 answer: ${gridStr}`)
    console.timeEnd('Problem 2 run time');
}

function includesPosition(position, array) {
    // for(let i = 0; i < array.length; i++) {
    //     if(array[i][0] == position[0] && array[i][1] == position[1]) {
    //         return true;
    //     }
    // }

    for(let i = 0; i < array.length; i++) {
        if(JSON.stringify(array[i]) == JSON.stringify(position)) {
            return true;
        }
    }

    return false;
}

function getUniqueArray(array) {
    let returnArr = []
    for(let i = 0; i < array.length; i++) {
        if(!includesPosition(array[i], returnArr)) {
            returnArr.push(array[i])
        }
    }

    return returnArr;
}

function foldX(array, foldedX) {
    array = [...array];
    let maxPaperX = array.reduce((biggest, value) => value[0] > biggest ? value[0] : biggest, 0);

    for(let i = 0; i < array.length; i++) {
        if(array[i][0] > foldedX) {
            array[i][0] = maxPaperX - array[i][0];
        }
    }

    return array;
}

function foldY(array, foldedY) {
    array = [...array];
    let maxPaperY = array.reduce((biggest, value) => value[1] > biggest ? value[1] : biggest, 0);

    for(let i = 0; i < array.length; i++) {
        if(array[i][1] > foldedY) {
            array[i][1] = maxPaperY - array[i][1];
        }
    }

    return array;
}


problem();