const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    let count = 0;
    for(let i = 0; i < lines.length; i++) {
        let digit = lines[i].split(' | ')[1].split(' ');
        for(let digitIndex = 0; digitIndex < digit.length; digitIndex++) {
            if(digit[digitIndex].length == 7 || digit[digitIndex].length == 3 || digit[digitIndex].length == 2 || digit[digitIndex].length == 4) {
                count++;
            } 
        }
    }

    console.log(`Problem 1 answer: ${count}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    let sum = 0;
    for(let i = 0; i < lines.length; i++) {
        let decodeDigit = lines[i].split(' | ')[0].split(' ');
        let signalPattern = getSignalPattern(decodeDigit);

        let output = lines[i].split(' | ')[1].split(' ').map(pattern => signalPattern[stringInAlphebetical(pattern)]).join('');
        output = parseInt(output, 10)
        sum += output;
    }

    console.log(`\nProblem 2 answer: ${sum}`)
    console.timeEnd('Problem 2 run time');
}


// 1 -> size 2, cf

// 7 -> size 3, acf

// 4 -> size 4, bcdf

// 2 -> size 5, acdeg
// 3 -> size 5, acdfg 
// 5 -> size 5, abdfg 
// >>> share adg
// 2 -> ce (ce not in 4 and not in 1)
// 3 -> cf (cf in 4 and 1)
// 5 -> bf (bf in 4 but not in 1)

// 0 -> size 6, abcefg
// 6 -> size 6, abdefg
// 9 -> size 6, abcdfg
// >>> share abfg
// 0 -> ce (only c in 1)
// 6 -> de (only d in 4)
// 9 -> cd (cd in 4)

// 8 -> size 7, abcdefg
function getSignalPattern(patterns) {
    let patternDict = {} 
    patterns = patterns.map(pattern => stringInAlphebetical(pattern));
    
    // easy digits
    patternDict[1] = patterns.find(el => el.length == 2)
    patternDict[7] = patterns.find(el => el.length == 3)
    patternDict[4] = patterns.find(el => el.length == 4)
    patternDict[8] = patterns.find(el => el.length == 7)

    // size 5 digits
    let digitsSize5 = patterns.reduce((arr, el) => {
        if(el.length == 5 && !arr.includes(el)) {
            arr.push([el,el])
        }
        return arr
    }, [])

    // removes commonly shared characters by all 5 letter digits
    for(let charIndex = 0; charIndex < digitsSize5[0][0].length; charIndex++) { 
        let inAll = true;
        for(let i = 0; i < digitsSize5.length; i++) {
            if(!digitsSize5[i][0].includes(digitsSize5[0][0][charIndex])) {
                inAll = false;
            }
        }
        if(inAll) {
            digitsSize5.map(digit=>digit[1] = digit[1].replace(digitsSize5[0][0][charIndex], ''))
        }
    }

    // 2 -> ce (ce not in 4 and not in 1)
    // 3 -> cf (cf in 4 and 1)
    // 5 -> bf (bf in 4 but not in 1)
    for(let i = 0; i < digitsSize5.length; i++) {
        let pattern = digitsSize5[i][1];

        let inFour = true;
        let inOne = true;
        for(let patternIndex = 0; patternIndex < pattern.length; patternIndex++) {
            if(!patternDict[4].includes(pattern[patternIndex])) {
                inFour = false;
            }

            if(!patternDict[1].includes(pattern[patternIndex])) {
                inOne = false;
            }
        }
        if(inFour && inOne) {
            patternDict[3] = digitsSize5[i][0]
        }
        else if(inFour && !inOne) {
            patternDict[5] = digitsSize5[i][0]
        }
        else {
            patternDict[2] = digitsSize5[i][0]
        }
    }


    // size 6 digits
    let digitsSize6 = patterns.reduce((arr, el) => {
        if(el.length == 6 && !arr.includes(el)) {
            arr.push([el,el])
        }
        return arr
    }, [])

    // removes commonly shared characters by all 5 letter digits
    for(let charIndex = 0; charIndex < digitsSize6[0][0].length; charIndex++) { 
        let inAll = true;
        for(let i = 0; i < digitsSize6.length; i++) {
            if(!digitsSize6[i][0].includes(digitsSize6[0][0][charIndex])) {
                inAll = false;
            }
        }
        if(inAll) {
            digitsSize6.map(digit=>digit[1] = digit[1].replace(digitsSize6[0][0][charIndex], ''))
        }
    }
    // 0 -> ce (only c in 1)
    // 6 -> de (only d in 4)
    // 9 -> cd (cd in 4)
    for(let i = 0; i < digitsSize6.length; i++) {
        let pattern = digitsSize6[i][1];

        let inFour = true;
        let partlyInOne = false;
        for(let patternIndex = 0; patternIndex < pattern.length; patternIndex++) {
            if(!patternDict[4].includes(pattern[patternIndex])) {
                inFour = false;
            }

            if(patternDict[1].includes(pattern[patternIndex])) {
                partlyInOne = true;
            }
        }

        if(inFour) {
            patternDict[9] = digitsSize6[i][0];
        }
        else if(partlyInOne) {
            patternDict[0] = digitsSize6[i][0];
        }
        else {
            patternDict[6] = digitsSize6[i][0];
        }
    }

    // invert key and value
    let ret = {};
    for(let key in patternDict) {
        ret[patternDict[key]] = key
    }
    
    return ret;
}


function stringInAlphebetical(str) {
    return [...str].sort().join("");
}

problem1();
problem2();