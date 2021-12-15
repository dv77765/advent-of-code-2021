const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const sections = data.split(/\r?\n\r?\n/);

const rules = sections[1].split(/\r?\n/).reduce((rules, value) => {
    let tokens = value.split(' -> ');
    rules[tokens[0]] = tokens[1];
    return rules;
}, {})
const start = sections[0];



// ------------ PROBLEM 1 ------------
// super inefficient
// creates string and replaces each pair with rule
function problem1() {
    console.time('Problem 1 run time');
    const NUM_STEPS = 10;
    let str = start;

    for(let steps = 0; steps < NUM_STEPS; steps++) {
        for(let i = 0; i < str.length-1; i++) {
            let element = rules[str[i]+str[i+1]];
            if(element) {
                str = str.substring(0, i+1) + element + str.substring(i+1);
                i++;
            }
        }
    }

    str = str.split('');
    
    let elementCount = str.reduce((map, value) => {
        map[value] = (map[value] || 0) + 1;
        return map; 
    }, {})

    let mostCommonCount = 0;
    let lowestCommonCount = Number.MAX_SAFE_INTEGER;

    for(let element in elementCount) {
        if(elementCount[element] > mostCommonCount) {
            mostCommonCount = elementCount[element];
        }

        if(elementCount[element] < lowestCommonCount) {
            lowestCommonCount = elementCount[element];
        }
    }

    console.log(`Problem 1 answer: ${mostCommonCount - lowestCommonCount}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
// stores letter count and pair count in a map
// simulates rule counts
function problem2() {
    console.time('Problem 2 run time');
    const NUM_STEPS = 40;
    let str = start;
    let pairCountMap = {};
    let letterCountMap = {}

    for(let i = 0; i < str.length; i++) {
        letterCountMap[str[i]] = (letterCountMap[str[i]]||0) + 1;
    }

    for(let i = 0; i < str.length-1; i++) {
        pairCountMap[str[i]+str[i+1]] = (pairCountMap[str[i]+str[i+1]]||0) + 1;
    }

    for(let steps = 0; steps < NUM_STEPS; steps++) {
        let newPairCountMap = {};
        for(let o in pairCountMap) {
            let element = rules[o];
            letterCountMap[element] = (letterCountMap[element]||0) + pairCountMap[o];
            newPairCountMap[o[0]+element] = (newPairCountMap[o[0]+element]||0) + pairCountMap[o];
            newPairCountMap[element+o[1]] = (newPairCountMap[element+o[1]]||0) + pairCountMap[o];
        }
        pairCountMap = newPairCountMap;
    }

    let mostCommonCount = 0;
    let lowestCommonCount = Number.MAX_SAFE_INTEGER;
    for(let letter in letterCountMap) {
        if(letterCountMap[letter] > mostCommonCount) {
            mostCommonCount = letterCountMap[letter];
        }

        if(letterCountMap[letter] < lowestCommonCount) {
            lowestCommonCount = letterCountMap[letter];
        }
    }

    console.log(`\nProblem 2 answer: ${mostCommonCount-lowestCommonCount}`)
    console.timeEnd('Problem 2 run time');
}

problem1();
problem2();