let canvas = createCanvas('canvas', 700, 500, true);
let ctx = canvas.getContext('2d');


let mouse = new Mouse(canvas);



let line_tool = new LineTool(canvas, mouse);
let arch_tool = new ArchTool(canvas, mouse);
let state_arch_tool = new StateArchTool(canvas, mouse);
let exp_tool = new ExpTool(canvas, mouse);

changeToolTo(exp_tool);
ctx.save();
ctx.fillStyle = "#E4E2CA";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();

this.onmousemove = function(e) {
	selected_tool.onMouseMove(e);
}	

this.onmousedown = function(e) {
	e.preventDefault();
	selected_tool.onMouseDown(e);
}

this.onmouseup = function(e) {
	selected_tool.onMouseUp(e);
}

this.oncontextmenu = function(e) {
	e.preventDefault();
}

this.onkeydown = function(e) {
	
	switch(e.code) {
		case 'Digit1':
			changeToolTo(line_tool);
		break;
		case 'Digit2':
			changeToolTo(arch_tool);
		break;
		case 'Digit3':
			changeToolTo(state_arch_tool);
		break;
		case 'Digit4':
			changeToolTo(exp_tool);
		break;
	}
}

function changeToolTo(tool) {
	selected_tool = tool;
	selected_tool.onEnter();
	console.log('selected tool: ' + tool.name);
}



function createCanvas(id, width, height, bool_border) {
	let canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = width;
	canvas.height = height;
	if (bool_border) canvas.style = "border:1px solid black";
	document.body.appendChild(canvas);
	return canvas;
}

