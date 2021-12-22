const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n\r?\n/);
const IMAGE_ENHANCE_ALGO = lines[0];
const inputImage = lines[1].split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');

    let image = trimImage(inputImage)

    image = enhanceImage(image)

    image = trimImage(image)

    image = enhanceImage(image, '#')

    let count = image.reduce((count, curr) => {
        for(let i = 0; i < curr.length; i++) {
            if(curr[i] == '#') {
                count++;
            }
        }
        return count;
    }, 0)

    console.log(`Problem 1 answer: ${count}`)
    console.timeEnd('Problem 1 run time');
}

function enhanceImage(image, defaultChar = '.') {
    const imageSizeY = image.length;
    const imageSizeX = image[0].length;
    const newImageSizeY = imageSizeY + 2;
    const newImageSizeX = imageSizeX + 2; 
    let newImage = [];
    for(let y = 0; y < newImageSizeY; y++) {
        let line = '';
        for(let x = 0; x < newImageSizeX; x++) {
            let directions = [-1,0,1];
            let binary = '';

            for(let dy = 0; dy < directions.length; dy++) {
                for(let dx = 0; dx < directions.length; dx++) {
                    let char = defaultChar;
                    if(y+directions[dy]-1 >= 0 && y+directions[dy]-1 < imageSizeY && x+directions[dx]-1 >= 0 && x+directions[dx]-1 < imageSizeX) {
                        char = image[y+directions[dy]-1][x+directions[dx]-1];
                    }
                    binary += char == '#' ? '1' : '0'; 
                }
            }

            let decimal = parseInt(binary, 2);
            line += IMAGE_ENHANCE_ALGO[decimal];
        }
        newImage.push(line);
    }
    return newImage;
}

function printImage(image) {
    console.log();
    for(let y = 0; y < image.length; y++) {
        console.log(image[y])
    }
    console.log();
}

function trimImage(image) {
    let imageCopy = [...image]
    // trim top
    while(/^\.+$/.test(imageCopy[0])) {
        imageCopy.shift();
    }

    // trim bottom
    while(/^\.+$/.test(imageCopy[imageCopy.length-1])) {
        imageCopy.pop();
    }

    // trim left
    let leftTrimCount = imageCopy.reduce((min, curr) => {
        let dotsCount = curr.match(/^(\.*)([\#\.]*)$/)[1].length;
        return dotsCount < min ? dotsCount : min;
    }, Number.MAX_SAFE_INTEGER)
    imageCopy = imageCopy.map(line => line.substring(leftTrimCount));

    // trim right
    let rightTrimCount = imageCopy.reduce((min, curr) => {
        let count = 0;
        for(let i = curr.length-1; i >= 0; i--) {
            if(curr[i] == '.') {
                count++;
            }
            else {
                break;
            }
        }
        return count < min ? count : min;
    }, Number.MAX_SAFE_INTEGER);
    imageCopy = imageCopy.map(line => line.substring(0, line.length-rightTrimCount));

    return imageCopy;
}
// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let steps = 50;

    let infinityChar = '.';
    let image = trimImage(inputImage)

    for(let i = 0; i < steps; i++) {
        image = enhanceImage(image, infinityChar)
        image = trimImage(image)

        if(infinityChar == '.') {
            infinityChar = IMAGE_ENHANCE_ALGO[0] == '#' ? '#' : '.';
        }
        else {
            infinityChar = IMAGE_ENHANCE_ALGO[IMAGE_ENHANCE_ALGO.length-1] == '.' ? '.' : '#';
        }
    }

    let count = image.reduce((count, curr) => {
        for(let i = 0; i < curr.length; i++) {
            if(curr[i] == '#') {
                count++;
            }
        }
        return count;
    }, 0)

    console.log(`\nProblem 2 answer: ${count}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();