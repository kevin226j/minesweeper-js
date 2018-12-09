//************************************************************************/
//SET ELEMENTS FOR BOARD:
//************************************************************************/
const BOARD = document.getElementById('board');
const ROWS = COLS = 10;


//************************************************************************/
//BUILD BOARD:
//************************************************************************/
(function createBoard() {
    for(let i = 0; i < ROWS; i++){
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        for(let j = 0; j < COLS; j++){
            let col = document.createElement('div');
            col.setAttribute('data-row', `${i}`);
            col.setAttribute('data-col', `${j}`);
            col.classList += 'col hidden ';
            if(Math.random() < 0.2) col.classList += 'mine';

            row.appendChild(col);
        }
        BOARD.appendChild(row);
    }
})()




//************************************************************************/
//CLICK:
//************************************************************************/
BOARD.addEventListener('click', function(e) {
    const target = e.target.classList;
    console.log(target);
})