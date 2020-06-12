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


let history = [];
let max_history_steps = 100;
let snapshot_frequency = 25;
let snapshot_timer = 0;

let draw_opacity = 0.2;
let line_width = 1;

let control_key_down = false;

initialize();




function initialize() {
	addEventListener("mousemove", run);
	ctx.fillStyle = bg_color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	history.push(takeSnapshot());
}



this.onmousedown = function(e) {
	console.log(e.target);
	if (canvas != e.target) return;

	if (e.button === 2) {
		origin_x = mouse.x;
		origin_y = mouse.y;
	}
}

function run() {
	if(mouse.left_down) {
		drawSegment(origin_x, origin_y, mouse.x, mouse.y);
		drawSegment(mouse.prev_x, mouse.prev_y, mouse.x, mouse.y);
		record();
	}
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
	console.log("snapshot taken");
}

function takeSnapshot() {
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function undo() {
	if (history.length <= 0) return;
	 
	ctx.putImageData(history.pop(), 0, 0);
	
	console.log("history left: " + history.length);
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
}

this.onmousewheel = function(e) {

	line_width += e.deltaY > 0 ? -1 : 1;
}

this.oncontextmenu = function(e) {
	if (!control_key_down)	
	e.preventDefault();
	control_key_down = false;
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