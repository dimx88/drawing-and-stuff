var canvas = document.getElementById("canvas");
canvas.width = canvas.height = 1600;

var ctx = canvas.getContext("2d");

let mouse = {x:null, y:null};

let num_cells = 400;
let grid = createEmpty2dArray(num_cells);

let cell_size = canvas.width / num_cells;

populateGrid(grid, 20000);
grid = mirrorHorizontal(grid);

render();

function render() {
	
	renderGrid2(grid);
}

function processGrid(arr) {
	let buffer_grid = copyArray(arr);
	for (let x = 0; x < arr.length; x++) {
		for (let y = 0; y < arr[x].length; y++) {
			let cells = getNeighborValues({x:x, y:y}, arr);
			for (let i in cells) {
				buffer_grid[x][y] += cells[i];
			}
		}
	}
	return buffer_grid;
		
}

function mirrorHorizontal(arr) {
	let buffer_grid = copyArray(arr);
	for (let x = 0, limit = ~~(arr.length*0.5); x < limit; x++) {
		for (let y = 0; y < arr[x].length; y++) {
			buffer_grid[x][y] = buffer_grid[arr.length-x-1][y];
		}
	}
	return buffer_grid;

}

function copyArray(arr) {
	let copy = [];
	for (let i in arr) {
		copy.push(arr[i].slice());
	}
	return copy;
}
function populateGrid(arr, length) {
	let px = ~~(Math.random()* num_cells);
	let py = ~~(Math.random()* num_cells);
	px = py = ~~(num_cells/2);
	
	let i = 0;
	while (i < length) {
		let move_x = getRand();
		let move_y = getRand();
		
		
		let new_x = px + move_x;
		let new_y = py + move_y;

		if (new_x >= 0 && new_x < grid.length && new_y >= 0 && new_y < grid.length) {	//if within array bounds
			px = new_x;
			py = new_y;
			
			arr[px][py] = 1;
			i++;
		}
	
	}
}

function getRand() { //returns 0, -1 or 1 randomly;
	if (Math.random() > 0.5) return 0;
	else return Math.random() > 0.5 ? 1 : -1;
}


function getNeighborValues(cell, arr) {
	let result = [];
	for (let x = -1; x <= 1; x++) {
		let temp_cell_x = cell.x + x;
		
		if (temp_cell_x < 0 || temp_cell_x > arr.length-1) continue; //out of x bounds
		
		for (let y = -1; y <= 1; y++) {
			if (x === 0 && y === 0) continue; //exclude original cell
			let temp_cell_y = cell.y + y;
			if (temp_cell_y < 0 || temp_cell_y > arr.length-1) continue; //out of y bounds
			
			result.push(arr[temp_cell_x][temp_cell_y]);
		}
	}
	return result;
}

function printGrid(arr) {
	for (let i in arr) {
		let line = '';
		for (let j in arr[i]) {
			line += arr[i][j];
		}
		console.log(i + ':', line);
		
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



function renderGrid(arr) {
	for (let x = 0; x < arr.length; x++) {
		for (let y = 0; y < arr[x].length; y++) {
			let v = arr[x][y];
			let color = '#' + v+v+v+v+v+v;
			ctx.fillStyle = arr[x][y] === 0 ? 'gray' : color;
			ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
		}
	}
}
function renderGrid2(arr) {
	for (let x = 0; x < arr.length; x++) {
		for (let y = 0; y < arr[x].length; y++) {
			let v = arr[x][y];
			v = v > 9 ? 9 : v;
			let color = '#' + v+v+v+v+v+v;
			ctx.fillStyle = arr[x][y] === 0 ? 'gray' : color;
			ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
		}
	}
}




function getCellAtMouse() {
	let x,y;
	x = ~~(mouse.x / cell_size);
	y = ~~(mouse.y / cell_size);
	return {x:x, y:y};
}

this.onmousedown = function(e) {
	let cell = getCellAtMouse();
	grid = processGrid(grid);
	render();
	
}


this.onmousemove = function(e) {
	mouse.x = e.clientX - canvas.getBoundingClientRect().left;
	mouse.y = e.clientY - canvas.getBoundingClientRect().top;
}
