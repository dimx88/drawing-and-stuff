// CharocalPaint


let canvas = document.getElementById("canvas");
let palette_canvas = document.getElementById("palette");
let ctx = canvas.getContext("2d");

let global = {selected_color:null};

let bg_color = "#E4E2CA";


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

let num_strokes = 3;
let spacing = 5;

let alpha = 0.2;



initialize();




function initialize() {
	addEventListener("mousemove", run);
	canvas.style.backgroundColor = bg_color;
	ctx.globalAlpha = alpha;
	
	history.push(takeSnapshot());
	
}



this.onmousedown = function(e) {
	ctx.strokeStyle = palette.global.selected_color;
	if (canvas != e.target) return;


}

function run() {
	if(!mouse.left_down) return;
	
	draw();

		
	record();
	
}

function draw() {

		

		let length = Math.sqrt(mouse.vel_x * mouse.vel_x + mouse.vel_y * mouse.vel_y);
		let x_factor = Math.sin(length) * spacing;
		let y_factor = Math.cos(length) * spacing;
		for (let i = 0; i < num_strokes; i++) {
			if (i === 0) continue;
			ctx.beginPath();
			ctx.moveTo(mouse.prev_x + i * x_factor, mouse.prev_y + i * y_factor);
			ctx.lineTo(mouse.x + i * x_factor, mouse.y + i * y_factor);
			ctx.stroke();
				
		}
		
	
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
	//console.log(e.code);
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

		if (e.deltaY <= 0) {
			spacing += 1;
		}else {
			spacing -= 1;
		}
		if (spacing < 1) spacing = 1;
	
}

this.oncontextmenu = function(e) {
	if (!control_key_down)	
	e.preventDefault();
	control_key_down = false;
}


function download()  {

	var element = document.createElement('a');
	//element.setAttribute('href', canvas.toDataURL('image/png'));
 
	let img = mergeImageWithBackground();
  
	element.setAttribute('href', img.toDataURL('image/png'));
	element.setAttribute('download', 'drawing.png');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);

}

function mergeImageWithBackground() {
	
	let buffer_canvas = createCanvas('buffer', canvas.width, canvas.height);
	let buffer_ctx = buffer_canvas.getContext('2d');
	buffer_ctx.fillStyle = canvas.style.backgroundColor;
	buffer_ctx.fillRect(0, 0, buffer_canvas.width, buffer_canvas.height);
	let img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	buffer_ctx.drawImage(canvas, 0, 0);
	return buffer_canvas;
	
	
}

function createCanvas(id, width, height) {
	let cnvs = document.createElement('canvas');
	cnvs.id = id;
	cnvs.width = width;
	cnvs.height = height;
		//cnvs.style = "border: 1px solid black";
		//document.body.appendChild(canvas);
	return cnvs;
}