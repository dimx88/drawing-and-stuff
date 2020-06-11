var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var mouse = {x:0, y:0};
var num_cells = 50;
var grid = createEmpty2dArray(num_cells);
var buffer_grid = createEmpty2dArray(num_cells);
var cell_size = 10;

var running = false;



console.log("running: " + running);
renderGrid(grid);
setInterval(run, 1000/20);








function run() {
	render();
	if (!running) return;

	advanceOneGeneration();	
}



function advanceOneGeneration() {
	for (let x = 0; x < num_cells; x++) {
		for (let y = 0; y < num_cells; y++) {
			let num_neighbors = getNumberOfLivingSurroundingCells(x, y, grid);
			buffer_grid[x][y] = (num_neighbors < 2 || num_neighbors > 3) ? 0 : 1;
		}
	}
	grid = buffer_grid;
	buffer_grid = createEmpty2dArray(num_cells);
}




this.onmousedown = function(e) {
	if (running) return;

	const clicked_cell_x = ~~(mouse.x / cell_size);
	const clicked_cell_y = ~~(mouse.y / cell_size);
	grid[clicked_cell_x][clicked_cell_y] = 1 - grid[clicked_cell_x][clicked_cell_y];
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
				ctx.strokeRect(x * cell_size, y * cell_size, cell_size, cell_size);
			}else {
				ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
			}
		} 
	}
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderGrid(grid);
}

