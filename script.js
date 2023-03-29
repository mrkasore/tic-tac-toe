let turnPlr1 = true;
let p = 0;
let gameboard = ['_','_','_','_','_','_','_','_','_'];

const Gameboard = (() => {
    let btns = document.querySelectorAll('.btn');
    const score = document.querySelector('#score');

    const pc = document.querySelector('#pc');


    let num = 0;

    const arrWin = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const players = (player, score, mark) => {
        return {player, score, mark}
    }

    let player1 = players('Player1', 0, 'x');
    let player2 = players('Player2', 0, 'o');


    document.querySelector('#restart').addEventListener('click', () => {
        document.querySelectorAll('.btn').forEach(item => {
            item.innerHTML = '';
        });
        document.querySelector('#result').innerHTML = '';
        turnPlr1 = true;
        gameboard.length = 0;
        gameboard = ['_','_','_','_','_','_','_','_','_'];
        p = 0;
    });

    btns.forEach(item => {
        item.addEventListener('click', (e) => {
            if (gameboard.length === 0) {
                gameboard = ['_','_','_','_','_','_','_','_','_'];
            }
            if (turnPlr1 && e.target.innerHTML === '' ) {
                // AI behavior
                e.target.innerHTML = player1.mark;
                gameboard[e.target.id] = player1.mark;
                p++;
                if (pc.checked === false) {
                    turnPlr1 = turn(turnPlr1);
            } else if (pc.checked === true && gameboard.includes('_')) {
                let bestScore = -Infinity;
                let bestMove = -1;
                for (let h = 0; h < gameboard.length; h++) {
                    if (gameboard[h] === '_') {
                        gameboard[h] = player2.mark;
                        let score = minimax(gameboard, 0, false);
                        gameboard[h] = '_';
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = h;
                        }
                    }
                }
                gameboard[bestMove] = player2.mark;
                btns[bestMove].innerHTML = player2.mark;
                p++;        
            }
            } else if (e.target.innerHTML === '' && pc.checked === false) {
                e.target.innerHTML = player2.mark;
                gameboard[e.target.id] = player2.mark;
                turnPlr1 = turn(turnPlr1);
            }

            if (checkWin(gameboard, arrWin)) {
                Interface.result.innerHTML = checkWin(gameboard, arrWin);
                if (document.querySelector('#result').innerHTML === `${player1.player} Win!`) {
                    player1.score++;
                }
                else if(document.querySelector('#result').innerHTML === `${player2.player} Win!`) {
                    player2.score++;
                } 
                score.innerHTML = `Score: ${player1.score} | ${player2.score}`;
                    
            }
        })
    })

    function restart() {
        gameboard = ['_','_','_','_','_','_','_','_','_'];
    }

    return {
        num,
        player1,
        player2,
        gameboard,
        turnPlr1,
        p,
        arrWin,
        btns,
        restart
    }

})();

const Interface = (() => {
    const restart = document.querySelector('#restart');

    const startInp = document.querySelector('#start');
    const player1Inp = document.querySelector('#player1Inp');
    const player2Inp = document.querySelector('#player2Inp');

    startInp.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Start');
        document.querySelector('.gameboard').classList.add('active');
        document.querySelector('#startMenu').classList.add('not_active');

        Gameboard.player1.player = player1Inp.value;
        Gameboard.player2.player = player2Inp.value;

        console.log(player1Inp.value);
        console.log(player2Inp.value);
    });
    



    return {
        result,
        player1Inp,
        player2Inp,
        score
    }
    
})();


function turn(turnPlr1) {
    if(turnPlr1) {
        turnPlr1 = false;
    } else {
        turnPlr1 = true;
    }
    return turnPlr1;
}

function checkWin(gameboard, arrWin) {
    let win1 = 0;
    let win2 = 0;
    for (let i = 0; i < arrWin.length; i++) {
        for(let x = 0; x < 3; x++) {
            if (gameboard[arrWin[i][x]] === Gameboard.player1.mark) {
                win1++;
            } else if(gameboard[arrWin[i][x]] === Gameboard.player2.mark) {
                win2++;
            }
        }
        if (win1 === 3) {
            Interface.score.innerHTML = `Score ${Gameboard.player1.score} | ${Gameboard.player2.score}`;
            return `${Gameboard.player1.player} Win!`;
        } else if (win2 === 3) {
            Interface.score.innerHTML = `Score ${Gameboard.player1.score} | ${Gameboard.player2.score}`;
            return `${Gameboard.player2.player} Win!`;
        } 
        win1 = 0;
        win2 = 0;
    }
    if (!gameboard.includes('_')) {
        Interface.score.innerHTML = 'We are even';
        return 'We are even';
    }
    win1 = 0;
    win2 = 0;

    return null;
}

function minimax(board, depth, is_maximazing) {
    let result = checkWin(gameboard, Gameboard.arrWin);
    let bestScore;
    if (result !== null) {
        if (checkWin(gameboard, Gameboard.arrWin) === `${Gameboard.player1.player} Win!`) {
            return -1;
        }
        else if (checkWin(gameboard, Gameboard.arrWin) === `${Gameboard.player2.player} Win!`) {
            return 1;
        } else if (checkWin(gameboard, Gameboard.arrWin) === 'We are even') {
            return 0;
        }

    }

    if (is_maximazing) {
        bestScore = -Infinity;
        for (let h = 0; h < gameboard.length; h++) {
            if (gameboard[h] === '_') {
                gameboard[h] = Gameboard.player2.mark;
                let score = minimax(gameboard, depth + 1, false);
                gameboard[h] = '_';
                if (score > bestScore) {
                    bestScore = score;
                }
            }
        }
        return bestScore;
    } else {
        bestScore = Infinity;
        for (let h = 0; h < gameboard.length; h++) {
            if (gameboard[h] === '_') {
                gameboard[h] = Gameboard.player1.mark;
                let score = minimax(gameboard, depth + 1, true);
                gameboard[h] = '_';
                if (score < bestScore) {
                    bestScore = score;
                }
            }
        }
        return bestScore;
    }

}