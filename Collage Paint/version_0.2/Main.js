var canvas = document.getElementById('main-canvas');
canvas.width = 800;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var image_canvas = document.getElementById('image-canvas');
var palette_canvas = document.getElementById('palette-canvas');




var alpha_slider = document.getElementById('alpha-slider');

var mouse = new Mouse(canvas);

var global = {selected_color:null};

var palette = new Palette(palette_canvas, global, 500, 140);
var imageCropper = new ImageCropper(image_canvas, 500, 500);

let history = [];
let max_history_steps = 20;
let snapshot_frequency = 50;
let snapshot_timer = 0;

let brush_alpha = 1;

let drawing = false;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 10;


function sampleColor() {
	   let _data = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
	   let r = _data[0];
	   let g = _data[1];
	   let b = _data[2];
	   if (r + g + b === 0) return null;
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	
}

function drawSegment() {
	ctx.globalAlpha = brush_alpha;
	ctx.beginPath();
	ctx.moveTo(mouse.prev_x, mouse.prev_y);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();
	ctx.globalAlpha = 1;
	// console.log(brush_alpha);
}



function loadImage(e) {
	var output = document.getElementById('reference');
    let img = URL.createObjectURL(event.target.files[0]);
	imageCropper.setImage(img);

}

this.onmousemove = function(e) {
	if (e.target !== canvas) return;
	
	if (mouse.left_down && drawing) {
		drawSegment();
		record();
	}
	
	
}

this.onmousewheel = function(e) {
	ctx.lineWidth += e.deltaY > 0 ? -2 : 2;
	ctx.lineWidth = ctx.lineWidth < 1 ? 1 : ctx.lineWidth;
	
}

this.onmousedown = function(e) {
	if (e.target !== canvas) return;
	
	ctx.strokeStyle = global.selected_color;
	if (e.target !== canvas) return;
	
	history.push(takeSnapshot());
	
	if (e.button === 2) {
		//global.selected_color = sampleColor();
		ctx.globalAlpha = brush_alpha;
		let midpoint = imageCropper.getMidPoint();
		ctx.drawImage(imageCropper.buffer_canvas, mouse.x - midpoint.x, mouse.y - midpoint.y);	
		ctx.globalAlpha = 1;
	}
	
	if (e.button === 0) {
		drawSegment();
		drawing = true;
	}
	
	
}

this.onmouseup = function() {
	drawing = false;
}

this.oncontextmenu = function(e) {
	e.preventDefault();
}

function onAlphaSliderChange() {
	
	let linear_alpha = parseInt(alpha_slider.value)/100;
	brush_alpha = easeInSine(linear_alpha);
	// console.log(brush_alpha);
}

function easeInSine(x) {
	return 1 - Math.cos((x * Math.PI) / 2);
}

function easeInCubic(x) {
	return x * x * x;
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

function undo() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (history.length <= 0) return;
	 
	flattenImage();
	ctx.putImageData(history.pop(), 0, 0);
}

function record() { 
	//return;	//currently not working

	if (++snapshot_timer % snapshot_frequency != 0) return;

	if (history.length >= max_history_steps) {	//trim snapshots above allowed max
		history.splice(0, 1)	//delete oldest snapshot to make room for a new one
	}
	
	history.push(takeSnapshot());
	
	// console.log('snapshot');
	
}

function takeSnapshot() {
	//console.log('snapshot');
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function undo() {
	if (history.length <= 0) return;
	 
	//flattenImage();
	ctx.putImageData(history.pop(), 0, 0);
	// console.log('undo');
	
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

function createCanvas(id, width, height, bool_border = true) {
		let _canvas = document.createElement('canvas');
		_canvas.id = id;
		_canvas.width = width;
		_canvas.height = height;
		if (bool_border) { _canvas.style.border = '1px solid black'; }
		//document.body.appendChild(_canvas);
		return _canvas;
}
