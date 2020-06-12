// Kaleidoscope


let canvas = document.getElementById("canvas");
let palette_canvas = document.getElementById("palette");
let ctx = canvas.getContext("2d");

let global = {selected_color:null};

let bg_color = "#000000";


//------------------


let mouse = new Mouse(canvas);
let mouse_velocity = {};

let palette = new Palette(palette_canvas, global);


let origin_x = canvas.width/2;
let origin_y = canvas.height/2;

let num_steps = 6;

let history = [];
let max_history_steps = 20;
let snapshot_frequency = 20;
let snapshot_timer = 0;

let draw_opacity = 0.8;
let line_width = 10;

let control_key_down = false;

initialize();




function initialize() {
	addEventListener("mousemove", run);
	ctx.fillStyle = bg_color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawCenterPoint();

	
	history.push(takeSnapshot());
	
}



this.onmousedown = function(e) {
	if (canvas != e.target) return;

	if (e.button === 2) {
		origin_x = mouse.x;
		origin_y = mouse.y;
	}
}

function run() {
	if(!mouse.left_down) return;
	
	//drawSegment(origin_x, origin_y, mouse.x, mouse.y);
	//drawSegment(mouse.prev_x, mouse.prev_y, mouse.x, mouse.y);	
		
	ctx.translate(canvas.width/2, canvas.height/2);	
	let rotation_per_step = (2 * Math.PI) / num_steps;
	let rotation_counter = 0;
	for (let i = 0; i < num_steps; i++) {
		rotation_counter += rotation_per_step;
		ctx.rotate(rotation_per_step);
		drawSegment(mouse.prev_x - canvas.width/2, mouse.prev_y - canvas.height/2, mouse.x - canvas.width/2, mouse.y - canvas.height/2);
	}
	
	ctx.rotate(-rotation_counter);
	ctx.translate(-canvas.width/2, -canvas.height/2);

		
	record();
	
}

function drawSegment(x1, y1, x2, y2) {
	ctx.save();
	
	ctx.globalAlpha = draw_opacity;
	ctx.strokeStyle = global.selected_color;
	ctx.lineWidth = line_width;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	
	ctx.restore();
}

function record() { 
	if (++snapshot_timer % snapshot_frequency != 0) return;

	if (history.length >= max_history_steps) {	//trim snapshots above allowed max
		history.splice(0, 1)	
	}
	
	history.push(takeSnapshot());
	
}

function takeSnapshot() {
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function undo() {
	if (history.length <= 0) return;
	 
	ctx.putImageData(history.pop(), 0, 0);
	
	
}

function switchBackgroundColor() {
	if (bg_color === "#ffffff") {
		bg_color = "#000000";
	}else {
		bg_color = "#ffffff";
	}
	ctx.fillStyle = bg_color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	

}



this.onkeydown = function(e) {
	console.log(e.code);
	if (e.code === "KeyZ") {
		undo();
	}

	if (e.code === "KeyP") {
		switchBackgroundColor();
	}

	if (e.code==="ControlLeft") {
		control_key_down = true;
	}
}

this.onkeyup = function(e) {

	if (e.code==="ControlLeft") {
		control_key_down = false;
	}
	else if (e.code==="NumpadAdd") {
		num_steps++;
	}
	else if (e.code==="NumpadSubtract") {
		num_steps = num_steps > 2 ? num_steps-1 : num_steps;
	}
	
	
}

this.onmousewheel = function(e) {

	line_width += e.deltaY > 0 ? -1 : 1;
}

this.oncontextmenu = function(e) {
	if (!control_key_down)	
	e.preventDefault();
	control_key_down = false;
}

function drawCenterPoint() {
	ctx.save()
	ctx.fillStyle = "#ffffff";
	ctx.globalAlpha = 0.6;
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, 5, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();
}

function download()  {

  var element = document.createElement('a');
  element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
  element.setAttribute('download', 'drawing.png');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}