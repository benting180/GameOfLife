
let grid = createGrid();
let htmlElements = [];
let play = false;

let clearButton = document.querySelector(".clear-button");
clearButton.addEventListener("click", function() {
    console.log('clear')
    grid = createGrid();
    updateTable();
});

let playButton = document.querySelector(".play-button");
playButton.addEventListener("click", function() {
    play = !play;
    if (play) {
        playButton.textContent = "Pause";
    } else {
        playButton.textContent = "Play";
    }
});

let randomButton = document.querySelector(".random-button");
randomButton.addEventListener("click", function() {
    setRandomGrid();
    updateTable();
});
function cellOnClick(event) {
    try {
        let td = event.target
        let x = td.getAttribute('x');
        let y = td.getAttribute('y');
        console.log(y, x)
        grid[y][x] = !grid[y][x]
        updateTable();
    } catch (error) {
        console.log(error)
    }
}

let tableElement = document.getElementById("board");
tableElement.addEventListener("click", cellOnClick);




function setRandomGrid() {
    // set current grid into 1/0 by random
    let newGrid = createGrid()
    const N = newGrid.length;
    const M = newGrid[0].length;

    for (let j = 0; j < N; j++) { // vertical
        for (let i = 0; i < M; i++) { // horizontal
            if (Math.random() > 0.5) {
                newGrid[j][i] = true
            } else {
                newGrid[j][i] = false
            }
        }
    }
    grid = newGrid;
}

function createGrid(n=15, m=15) {
    // return a array of array
    let rows = [];
    for (let j = 1; j <= n; j++) { // vertical
        let row = [];
        for (let i = 1; i <= m; i++) {
            row.push(false) // horizontal
        }
        rows.push(row);
    }

    rows[3][1] = true;
    rows[3][2] = true;
    rows[3][3] = true;
    rows[2][3] = true;
    rows[1][2] = true;
    return rows;
}

function nextState(currentState, c) {
    // console.log(currentState, c)
    //given currentState: true or false
    // given c: number of live cell surrounding
    if (currentState == true) {
        // underpopulation
        if (c < 2) {
            return false
        }
        // next generation
        if (c == 2 || c == 3) {
            return true
        }
        // over population
        if (c > 3) {
            return false
        }
    }
    // reproduction
    if (currentState == false && c == 3) {
        return true
    }
    return currentState
}

function countSurroundLive(x, y, log) {
    let result = 0;
    const N = grid.length;
    const M = grid[0].length;
    // iterate over surrounding 9 location
    for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <=1; i++) {
            if (j == 0 && i == 0) {
                continue
            }
            
            let newX = x+i;
            let newY = y+j;
            // boundary condition?
            if (newX < 0 || newX > M-1 || newY < 0 || newY > N-1) {
                continue
            }
            if (grid[newY][newX] == true) {
                result += 1;
            }
            if (log) {
                console.log(newY, newX, grid[newY][newX])
            }
        }
    }
    return result
}

function nextGrid() {
    // given current state
    // return next state
    // let newGrid = grid.slice(); // deep copy
    let newGrid = createGrid()
    const N = newGrid.length;
    const M = newGrid[0].length;

    for (let j = 0; j < N; j++) { // vertical
        for (let i = 0; i < M; i++) { // horizontal
            let currentState = grid[j][i];
            let surroundLive = countSurroundLive(i, j)
            let newValue = nextState(currentState, surroundLive);
            if (newValue !== null) {
                newGrid[j][i] = newValue;
            }
            if (j == 4 && i == 2) {
                let surroundLive = countSurroundLive(i, j, true)
                console.log('j: ', j, 'i:', i, 'live: ', surroundLive, 'new:',  newGrid[j][i])
            }
        }
    }

    return newGrid
}

function drawTable() {
    // given 2D array, create table in HTML accordingly 
    const N = grid.length;
    const M = grid[0].length;
    var table = document.getElementById('board');
    
    for (let j = 0; j < N; j++) {
        var tr = document.createElement('tr');
        var tdElements = []
        for (let i = 0; i < M; i++) {
            var td = document.createElement('td');
            td.setAttribute('class', 'cell empty')
            td.setAttribute('y', j)
            td.setAttribute('x', i)
            tdElements.push(td);
            tr.appendChild(td);
        }
        htmlElements.push(tdElements);
        table.appendChild(tr);
    }
}

function updateTable() {
    // given new 2D array, update the table color accordingly
    const N = grid.length;
    const M = grid[0].length;
    for (let j = 0; j < N; j++) {
        for (let i = 0; i < M; i++) {
            if (grid[j][i] == true) {
                htmlElements[j][i].setAttribute('class', 'cell filled')
            } else {
                htmlElements[j][i].setAttribute('class', 'cell empty')
            }
            
        }
    }
}
function newGeneration() {
    if (play) {
        grid = nextGrid();
        updateTable()
    }

}

drawTable()
updateTable(grid);
setInterval(newGeneration, 100)