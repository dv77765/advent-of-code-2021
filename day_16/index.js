const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
let binary = '';
for(let i = 0; i < data.length; i++) {
    binary += parseInt(data[i], 16).toString(2).padStart(4, '0');
}

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');



    console.log(`Problem 1 answer: ${getTotalPacketVersionNumber(binary).totalVersion}`)
    console.timeEnd('Problem 1 run time');
}

function getTotalPacketVersionNumber(packet) {
    let version = parseInt(packet.substring(0,3), 2);
    let typeID = parseInt(packet.substring(3,6), 2);
    let ret = {totalVersion: version, lastIndex: -1};

    if(typeID == 4) {
        let literalValue = '';

        for(let i = 6; i < packet.length-((packet.length-6)%5); i+=5) {
            literalValue += packet.substring(i+1, i+5);
            if(packet[i] == '0') {
                ret.lastIndex = i+5;
                break;
            }
        }
        literalValue = parseInt(literalValue, 2);

    }
    else {
        let lengthTypeID = parseInt(packet.substring(6,7), 2);
        if(lengthTypeID == 0) {
            let subPacketLength = parseInt(packet.substring(7, 22), 2);
            let isLastIndex = false; 
            let currentIndex = 0;
            while(!isLastIndex) {
                let subPacketRet = getTotalPacketVersionNumber(packet.substring(22+currentIndex, 22+subPacketLength));
                ret.totalVersion += subPacketRet.totalVersion;

                currentIndex += subPacketRet.lastIndex;
                if(currentIndex >= subPacketLength) {
                    isLastIndex = true;
                }
            } 
            ret.lastIndex = 22 + currentIndex;
        }
        else if(lengthTypeID == 1) {
            let subPacketNum = parseInt(packet.substring(7, 18), 2);
            let currentIndex = 0;
            for(let i = 0; i < subPacketNum; i++) {
                let subPacketRet = getTotalPacketVersionNumber(packet.substring(18+currentIndex));
                ret.totalVersion += subPacketRet.totalVersion;
                currentIndex += subPacketRet.lastIndex;
            }
            ret.lastIndex = 18 + currentIndex;
        }
    }
    return ret;   
} 

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    
    console.log(`\nProblem 2 answer: ${calculatePacket(binary).value}`)
    console.timeEnd('Problem 2 run time');
}

function calculatePacket(packet) {
    let version = parseInt(packet.substring(0,3), 2);
    let typeID = parseInt(packet.substring(3,6), 2);
    let ret = {value: null, lastIndex: -1};

    if(typeID == 4) {
        let literalValue = '';

        for(let i = 6; i < packet.length-((packet.length-6)%5); i+=5) {
            literalValue += packet.substring(i+1, i+5);
            if(packet[i] == '0') {
                ret.lastIndex = i+5;
                break;
            }
        }
        ret.value = parseInt(literalValue, 2);
    }
    else {
        let lengthTypeID = parseInt(packet.substring(6,7), 2);
        if(lengthTypeID == 0) {
            let subPacketLength = parseInt(packet.substring(7, 22), 2);
            let isLastIndex = false; 
            let currentIndex = 0;
            let values = [];
            while(!isLastIndex) {
                let subPacketRet = calculatePacket(packet.substring(22+currentIndex, 22+subPacketLength));
                values.push(subPacketRet.value);

                currentIndex += subPacketRet.lastIndex;
                if(currentIndex >= subPacketLength) {
                    isLastIndex = true;
                }
            } 
            ret.lastIndex = 22 + currentIndex;
            ret.value = calculatePacketValue(typeID, values)
        }
        else if(lengthTypeID == 1) {
            let subPacketNum = parseInt(packet.substring(7, 18), 2);
            let currentIndex = 0;
            let values = [];
            for(let i = 0; i < subPacketNum; i++) {
                let subPacketRet = calculatePacket(packet.substring(18+currentIndex));
                values.push(subPacketRet.value);
                currentIndex += subPacketRet.lastIndex;
            }
            ret.lastIndex = 18 + currentIndex;
            ret.value = calculatePacketValue(typeID, values)
        }
    }
    return ret;   
}

function calculatePacketValue(typeId, values) {
    switch(typeId) {
        case 0:
            return values.reduce((sum, value) => sum + value, 0);
        
        case 1:
            return values.reduce((product, value) => product*value, 1);

        case 2:
            return values.reduce((min, value) => value < min ? value : min, Number.MAX_SAFE_INTEGER);

        case 3: 
            return values.reduce((max, value) => value > max ? value : max, 0);

        case 5:
            return values[0] > values[1] ? 1 : 0;

        case 6:
            return values[0] < values[1] ? 1 : 0;

        case 7:
            return values[0] == values[1] ? 1 : 0;
    }

    return null;
}

problem1();
problem2(); 