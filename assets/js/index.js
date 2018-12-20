//************************************************************************/
//SET ELEMENTS FOR BOARD: JS
//************************************************************************/
const BOARD = document.getElementById('board');
const WIDGETS = document.getElementById('widget');
const ROWS = COLS = 10;


//************************************************************************/
//CREATE TIMER: (HTML)
//************************************************************************/

(function createTimer() {
    let div = document.createElement('div');
    div.classList += 'clock'
    let p = document.createElement('p');
    p.classList += 'timer';
    p.innerText = '00:00:00';
    div.append(p);
    WIDGETS.prepend(div);
})()




//************************************************************************/
//SET ELEMENTS FOR TIMER:
//************************************************************************/
let TIMER = document.querySelector('.timer');
let TIMER_ARRAY = [0, 0, 0, 0];




//************************************************************************/
//SET ELEMENTS FOR SELECT:
//************************************************************************/
let SELECT = document.getElementById('select');
let selectVal = SELECT.value;
SELECT.addEventListener('change', () => {
    selectVal = SELECT.value
})



//************************************************************************/
//BUILD BOARD:
//************************************************************************/
function createBoard(difficulty = 'Easy') {

    let threshold = null;

    switch (difficulty) {
        case 'Demo' :
            threshold = 0.3
        case 'Easy':
            threshold = 0.1;
            break;
        case 'Medium':
            threshold = 0.23;
            break;
        case 'Hard':
            threshold = 0.5;
            break;
        default:
            threshold = 0.15;
    }

    //clear any existing board
    BOARD.innerHTML = "";
    for (let i = 0; i < ROWS; i++) {
        //create row with new div element
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        for (let j = 0; j < COLS; j++) {
            //create col with new div element
            let col = document.createElement('div');
            col.setAttribute('data-row', `${i}`);
            col.setAttribute('data-col', `${j}`);
            col.classList += 'col hidden ';

            //randomize mines on board
            if (Math.random() < threshold) {
                col.classList += 'mine';
                
                //color background red if 'Demo'
                if(difficulty === 'Demo')
                    col.style.backgroundColor = '#c74848';
            }

            row.appendChild(col);
        }
        BOARD.appendChild(row);
    }
}
createBoard(selectVal);



//************************************************************************/
//GAME OVER:
//************************************************************************/
function gameOver(isWin) {
    let msg = icon = null;

    if (isWin) {
        msg = 'YOU WON!';
        icon = './assets/images/flag-icon.png';
    } else {
        msg = 'YOU LOST!';
        icon = './assets/images/bomb-icon.png';
    }

    //reveal hidden cells to show icon and count
    let hiddenCells = document.querySelectorAll('.col.hidden')

    for (let i = 0, n = hiddenCells.length; i < n; i++) {
        let cell = hiddenCells[i];

        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');

        let count = getMineCount(+row, +col);

        if (!cell.classList.contains('mine')) {
            cell.innerHTML = count === 0 ? "" : count;
        } else {
            let iconElem = document.createElement('img');
            iconElem.setAttribute('src', icon);
            cell.appendChild(iconElem);
        }

        cell.classList.remove('hidden');
    }
    setTimeout(() => {
        alert(msg)
        createBoard();
        BUTTON.disabled = false //un-disable button 
        disableDropDown(false);
        boardListen(false);
        resetTimer();
    }, 500)
}


//************************************************************************/
//REVEAL:
//************************************************************************/
function reveal(row, col) {
    let hasSeen = {};

    function search(i, j) {
        if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
        const key = `${i}${j}`

        //check to see if cell has been seen, if not run commands
        if (hasSeen[key]) {
            return
        } else {
            hasSeen[key] = true;
            let cell = document.querySelector(`.col.hidden[data-row="${i}"][data-col="${j}"]`);
            if (!cell) return;

            //Get surrounding mine count
            let mineCount = getMineCount(i, j);

            if (!cell.classList.contains('hidden') || cell.classList.contains('mine')) return;
            cell.classList.remove('hidden')

            //if count exists, write to cell
            if (mineCount) {
                cell.innerHTML = mineCount;
                return;
            }

            // Implement recursive FloodFill to check surroundings
            for (let ii = -1; ii <= 1; ii++) {
                for (let jj = -1; jj <= 1; jj++) {
                    search(i + ii, j + jj);
                }
            }
        }
    }
    //cast to number and call search function
    search(+row, +col)
}

//************************************************************************/
//GET MINE COUNT:
//************************************************************************/
function getMineCount(i, j) {
    let count = 0;

    // Implement recursive FloodFill to check surroundings
    for (let ii = -1; ii <= 1; ii++) {
        for (let jj = -1; jj <= 1; jj++) {
            const ni = i + ii;
            const nj = j + jj;

            if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
            const cell = document.querySelector(`.col.hidden[data-row="${ni}"][data-col="${nj}"]`)

            if (!cell) continue;

            //If class contains 'mine', increase the count
            if (cell.classList.contains('mine')) count++;
        }
    }
    return count;
}


//************************************************************************/
//BOARD CLICK:
//************************************************************************/
function boardListen(bool) {
    (bool) ? BOARD.addEventListener('click', boardEvent, false) : 
        BOARD.removeEventListener('click', boardEvent, false);
}


function boardEvent(e) {
    const targetClass = e.target.classList;
    if (targetClass.contains('hidden') && targetClass.contains('col')) {
        if (targetClass.contains('mine')) {
            gameOver(false)
        } else {
            const cell = e.target
            const row = cell.dataset.row;
            const col = cell.dataset.col;

            //Reveal function
            reveal(row, col);

            //Collect remaining hidden and mine elements for comparison
            const collectHiddenElems = document.querySelectorAll('.col.hidden');
            const collectMineElems = document.querySelectorAll('.col.mine');
            const isGameOver = collectHiddenElems.length === collectMineElems.length;
            if (isGameOver) {
                gameOver(true);
            }
        }
    }
}



//************************************************************************/
//TIMER:
//************************************************************************/
var interval;

function insertZero(time) {
    return (time <= 9) ? time = "0" + time : time;
}

function runTimer() {

    let timeStr = insertZero(TIMER_ARRAY[0]) + ":" + insertZero(TIMER_ARRAY[1]) + ":" + insertZero(TIMER_ARRAY[2]);

    TIMER.innerHTML = timeStr;

    TIMER_ARRAY[3]++;

    TIMER_ARRAY[0] = Math.floor(((TIMER_ARRAY[3]) / 100) / 60); //minutes
    TIMER_ARRAY[1] = Math.floor((TIMER_ARRAY[3] / 100) - (TIMER_ARRAY[0] * 60)); //seconds
    TIMER_ARRAY[2] = Math.floor((TIMER_ARRAY[3] - TIMER_ARRAY[1] * 100) - (TIMER_ARRAY[0] * 6000)); //milliseconds
}

function resetTimer() {
    clearInterval(interval);
    TIMER.innerHTML = "00:00:00";
    TIMER_ARRAY = [0, 0, 0, 0];
}

function startTimer() {
    interval = setInterval(runTimer, 10);
}

//************************************************************************/
//START BUTTON:
//************************************************************************/
const BUTTON = document.getElementById('btn');

function start() {
    createBoard(selectVal);

    startTimer();

    //disable button functionality until game is over
    BUTTON.disabled = true;

    //disable drop down items until game is over
    disableDropDown(true);

    //add event listener to board
    boardListen(true);

}

function disableDropDown(bool) {
    let options = SELECT.querySelectorAll('option');
    for (let i = 1, n = options.length; i < n; i++) {
        const option = options[i];
        (bool) ? option.setAttribute('disabled', bool): option.removeAttribute('disabled');
    }
}