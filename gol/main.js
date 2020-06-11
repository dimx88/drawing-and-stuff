var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var mouse = {x:0, y:0};
var num_cells = 100;
var grid = createEmpty2dArray(num_cells);
var buffer_grid = createEmpty2dArray(num_cells);
var cell_size = 5;

var running = false;

var spacing = .5;

console.log("running: " + running);
console.log("space to pause/run");
console.log("escape to clear");
renderGrid(grid);
let fps = setInterval(run, 1000/20);








function run() {
	render();
	if (!running) return;

	advanceOneGeneration();	
	//running = false;
}



function advanceOneGeneration() {
	for (let x = 0; x < num_cells; x++) {
		for (let y = 0; y < num_cells; y++) {
			let num_neighbors = getNumberOfLivingSurroundingCells(x, y, grid);
			//buffer_grid[x][y] = (num_neighbors < 2 || num_neighbors > 3) ? 0 : 1;
			let rule1 = grid[x][y] === 0 && num_neighbors === 3;
			let rule2 = grid[x][y] === 1 && num_neighbors > 1 && num_neighbors < 4;
			if (rule1 || rule2) {
				buffer_grid[x][y] = 1;
			}else {
				buffer_grid[x][y] = 0;
			}
		}
	}

	grid = buffer_grid;
	buffer_grid = createEmpty2dArray(num_cells);
}




this.onmousedown = function(e) {
	if (running || e.button === 2) running = false; //return;

	const clicked_cell_x = ~~(mouse.x / cell_size);
	const clicked_cell_y = ~~(mouse.y / cell_size);
	grid[clicked_cell_x][clicked_cell_y] = 1 - grid[clicked_cell_x][clicked_cell_y];
}

this.oncontextmenu = function(e) {
	e.preventDefault();
	const clicked_cell_x = ~~(mouse.x / cell_size);
	const clicked_cell_y = ~~(mouse.y / cell_size);
	console.log(getNumberOfLivingSurroundingCells(clicked_cell_x, clicked_cell_y, grid)); 
}

this.onmouseup = function(e) {
	return	
}


this.onmousemove = function(e) {
	mouse.x = e.clientX - canvas.getBoundingClientRect().left;
	mouse.y = e.clientY - canvas.getBoundingClientRect().top;
}


this.onkeydown = function(e) {
	if (e.code === "Space") {
		running = !running;
		console.log("running: " + running);
	}

	if (e.code === "Escape") {
		running = false;
		grid = createEmpty2dArray(num_cells);
		buffer_grid = createEmpty2dArray(num_cells);
		render();
	}

	if (e.code === "ArrowDown") {
		clearInterval(fps);
		fps = setInterval(run, 1000/5);
	}
}


function display2dArray(arr) {
	for (let x = 0; x < arr.length; x++) {
		let line = "";
		for (let y = 0; y < arr.length; y++) {
			line += arr[y][x] + "  ";	
		}
	}
}

function createEmpty2dArray(size) {
	let temp_array = new Array(size);
	for (let i = 0; i < size; i++) {
		temp_array[i] = new Array(size)
		for (let j = 0; j < size; j++) {
			temp_array[i][j] = 0; //Math.round(Math.random());
		}
	}
	return temp_array;
}

function getNumberOfLivingSurroundingCells(cell_x, cell_y, _grid) {
	let num = 0
	
	if (cell_x > 0 && cell_y > 0) {					
		num = _grid[cell_x-1][cell_y-1] === 1 ? num+1 : num;	//diagonal left up
	}
	
	if (cell_y > 0) {						
		num = _grid[cell_x][cell_y-1] === 1 ? num+1 : num;	//up
	}

	if (cell_x < _grid.length-1 && cell_y > 0) {			
		num = _grid[cell_x+1][cell_y-1] === 1 ? num+1 : num;	//diagonal right up
	}

	if (cell_x > 0) {
		num = _grid[cell_x-1][cell_y] === 1 ? num+1 : num;	//left
	}

	if (cell_x < _grid.length-1) {
		num = _grid[cell_x+1][cell_y] === 1 ? num+1 : num;	//right
	}

	if (cell_x > 0 && cell_y < _grid.length-1) {					
		num = _grid[cell_x-1][cell_y+1] === 1 ? num+1 : num;	//diagonal left down
	}

	if (cell_x < _grid.length-1 && cell_y < _grid.length-1) {					
		num = _grid[cell_x+1][cell_y+1] === 1 ? num+1 : num;	//diagonal right down
	}

	if (cell_y < _grid.length-1) {						
		num = _grid[cell_x][cell_y+1] === 1 ? num+1 : num;	//down
	}

	return num;
}

function renderGrid(_grid) {
	for (let x = 0; x < _grid.length; x++) {
		for (let y = 0; y < _grid.length; y++) {
			if (_grid[x][y] === 0) {
				ctx.strokeRect(x * cell_size, y * cell_size, cell_size - spacing, cell_size - spacing);
			}else {
				ctx.fillRect(x * cell_size, y * cell_size, cell_size - spacing, cell_size - spacing);
			}
		} 
	}
}

function render() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = running ? "#aaaaaa" : "#dddddd";
	renderGrid(grid);
}

