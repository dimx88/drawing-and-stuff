var canvas = document.getElementById('main-canvas');
canvas.width = 800;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var image_canvas = document.getElementById('image-canvas');
var palette_canvas = document.getElementById('palette-canvas');

var mouse = new Mouse(canvas);

var global = {selected_color:null};

var palette = new Palette(palette_canvas, global, 500, 140);
var imageCropper = new ImageCropper(image_canvas, 500, 500);

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 10;



function drawSegment() {
	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(mouse.prev_x, mouse.prev_y);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();
	ctx.globalAlpha = 1;
}



function loadImage(e) {
	var output = document.getElementById('reference');
    let img = URL.createObjectURL(event.target.files[0]);
	imageCropper.setImage(img);

}

this.onmousemove = function() {
	if (mouse.left_down) {
		drawSegment();
	}
}

this.onmousewheel = function(e) {
	ctx.lineWidth += e.deltaY > 0 ? -2 : 2;
	ctx.lineWidth = ctx.lineWidth < 1 ? 1 : ctx.lineWidth;
}

this.onmousedown = function(e) {
	ctx.strokeStyle = global.selected_color;
	if (e.target !== canvas) return;
	
	if (e.button === 2) {
		let midpoint = imageCropper.getMidPoint();
		ctx.drawImage(imageCropper.buffer_canvas, mouse.x - midpoint.x, mouse.y - midpoint.y);
		
	}
	
	if (e.button === 0) {
		drawSegment();
	}
}

this.oncontextmenu = function(e) {
	e.preventDefault();
}