const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);
const player1StartPos = parseInt(lines[0].split('Player 1 starting position: ')[1], 10);
const player2StartPos = parseInt(lines[1].split('Player 2 starting position: ')[1], 10);

const NUM_SIDED_DIE = 100;
const NUM_ROLLS = 3;
const BOARD_SIZE = 10;
const WIN_POINTS = 1000;
const WIN_POINTS_QUANTAM = 21;

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    let result = playGame(player1StartPos, player2StartPos);

    console.log(`Problem 1 answer: ${(result.player1Points > result.player2Points ? result.player2Points : result.player1Points) * result.rollsTaken}`)
    console.timeEnd('Problem 1 run time');
}

function playGame(player1StartPos, player2StartPos) {
    let result = {'rollsTaken': 0, 'player1Points': 0, 'player2Points': 0};

    let player1Pos = player1StartPos;
    let player2Pos = player2StartPos;
    let player1Points = 0;
    let player2Points = 0;
    let currentPlayerTurn = 1;

    let dieState = 1;

    while(player1Points < WIN_POINTS || player1Points < WIN_POINTS) {
        let roll = 0;
        for(let i = 0; i < NUM_ROLLS; i++) {
            roll += dieState;
            dieState++;
            if(dieState > NUM_SIDED_DIE) {
                dieState = 1;
            }
        }

        if(currentPlayerTurn == 1) {
            player1Pos += roll;
            while(player1Pos > BOARD_SIZE) {
                player1Pos -= BOARD_SIZE;
            }
            player1Points += player1Pos;
            currentPlayerTurn = 2;
        }
        else {
            player2Pos += roll;
            while(player2Pos > BOARD_SIZE) {
                player2Pos -= BOARD_SIZE;
            }
            player2Points += player2Pos;
            currentPlayerTurn = 1;
        }

        result.rollsTaken+=NUM_ROLLS; 
    }

    result.player1Points = player1Points;
    result.player2Points = player2Points;
    return result;
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');

    let gamesWon = playQuantumGame(player1StartPos, player2StartPos);

    console.log(`\nProblem 2 answer: ${gamesWon.player1Win > gamesWon.player2Win ? gamesWon.player1Win : gamesWon.player2Win}`)
    console.timeEnd('Problem 2 run time');
}

// stores 'player1Pos,player2Pos,player1Points,player2Points' as a key for count in dictionary
function playQuantumGame(player1StartPos, player2StartPos) {
    const POSSIBLE_ROLLS = getPossibleRolls();
    
    let ongoingUniverses = {};
    let finishedUniverses = {'player1Win': 0, 'player2Win': 0};

    ongoingUniverses[`${player1StartPos},${player2StartPos},0,0`] = 1


    let currentPlayerTurn = 1;

    while(!(JSON.stringify(ongoingUniverses) === '{}')) {
        let nextUniverses = {};
        for(let universe in ongoingUniverses) {
            const tokens = universe.split(',');
            for(let roll in POSSIBLE_ROLLS) {
                let player1Pos = parseInt(tokens[0],10);
                let player2Pos = parseInt(tokens[1],10);
                let player1Points = parseInt(tokens[2],10);
                let player2Points = parseInt(tokens[3],10);

                if(currentPlayerTurn == 1) {
                    player1Pos += parseInt(roll, 10);
                    while(player1Pos > BOARD_SIZE) {
                        player1Pos -= BOARD_SIZE;
                    }
                    player1Points += player1Pos;
                }
                else {
                    player2Pos += parseInt(roll, 10);
                    while(player2Pos > BOARD_SIZE) {
                        player2Pos -= BOARD_SIZE;
                    }
                    player2Points += player2Pos;
                }

                if(player1Points >= WIN_POINTS_QUANTAM) {
                    finishedUniverses.player1Win += ongoingUniverses[universe]*POSSIBLE_ROLLS[roll];
                }
                else if(player2Points >= WIN_POINTS_QUANTAM) {
                    finishedUniverses.player2Win += ongoingUniverses[universe]*POSSIBLE_ROLLS[roll];
                }
                else {
                    nextUniverses[`${player1Pos},${player2Pos},${player1Points},${player2Points}`] = (nextUniverses[`${player1Pos},${player2Pos},${player1Points},${player2Points}`] || 0) + ongoingUniverses[universe]*POSSIBLE_ROLLS[roll];
                }
            }
        }
        ongoingUniverses = nextUniverses;
        currentPlayerTurn = currentPlayerTurn == 1 ? 2 : 1;
    }

    return finishedUniverses;
}

function getPossibleRolls() {
    let possibleRolls = {}
    for(let i = 1; i <= 3; i++) {
        for(let j = 1; j <= 3; j++) {
            for(let k = 1; k <= 3; k++) {
                possibleRolls[i+j+k] = (possibleRolls[i+j+k] || 0) + 1;
            }
        }        
    }
    return possibleRolls;
}

problem1();
problem2();