class Palette {
	constructor(canvas, global) {
		//parseInt('ff', 16))//
		this.canvas = canvas;
		this.global = global;
		this.ctx = canvas.getContext("2d");

		this.colorCycler = new ColorCycler(0, 100, 50, -14, 0, 0);
		this.colorCycler2 =  new ColorCycler(0, 0, 0, 0, 0, 1.3);
		this.divide_columns = false;	
		
	
	
		
		//this.rows = 10;
		//this.columns = 25;
		this.rows = 16;
		this.columns = 30;
		this.palette_array = new Array(this.columns);
		this.palette_switch = false;
		
		this.palette_number = 2;

		this.cell_width = this.canvas.width / this.columns;
		this.cell_height = this.canvas.height / this.rows;

		this.selected_col = 29;
		this.selected_row = 15;
		

		this.outer_border_color = '#000000';
		this.outer_border_width = 1;

		this.mouse_down_left = false;
		this.mouse_down_middle = false;
		this.mouse_down_right = false;
		this.mouse_x = 0;
		this.mouse_y = 0;

		this.selected_line_width = 3;
		this.selected_line_color = '#ffffff';
		
		
		
		addEventListener('mousedown', this.onMouseDown.bind(this));
		addEventListener('mouseup', this.onMouseUp.bind(this));
		addEventListener('mousemove', this.onMouseMove.bind(this));
		addEventListener('mousewheel', this.onMouseWheel.bind(this));
		addEventListener('dblclick', this.onDoubleClick.bind(this));
		
		this.initialize();
		this.global.selected_color = this.getColorAt(this.selected_col, this.selected_row);
		this.updateDisplay();
		//document.getElementById("colorDisplay").style.backgroundColor = this.global.selected_color;
		
	}
//-------------------------------------------------------------
	onMouseMove(e) {
		if (this.canvas != e.target) return;
		this.mouse_x = e.clientX - this.canvas.getBoundingClientRect().left;
		this.mouse_y = e.clientY - this.canvas.getBoundingClientRect().top;
		
		if (this.mouse_down_left) {
			this.selectColorAtCursor();
			this.updateDisplay();
		}
	}
//-------------------------------------------------------------
	onMouseDown(e) {
		if (this.canvas != e.target) return; 
		
		if (e.button === 0) {
			this.mouse_down_left = true;
			this.selectColorAtCursor();
			this.updateDisplay();
		}
		if (e.button === 1) {
			this.mouse_down_middle = true;
		}
		if (e.button === 2) {
			this.mouse_down_right = true;
			this.switchPalette();
		
		}
		
	}
//-------------------------------------------------------------
	onMouseUp(e) {
		if (e.button === 0) {
			this.mouse_down_left = false;
		}
		if (e.button === 1) {
			this.mouse_down_middle = false;
		}
		if (e.button === 2) {
			this.mouse_down_right = false;
		}
		
	}
//--------------------------------------------------------------
	onMouseWheel(e) {
			return;
			//e.preventDefault();
			if (e.target.id === 'reference' || e.target.id === 'undo') return; //make sure active only on palette & drawing board
			
			if (e.deltaY < 0) {           //up
				this.selected_row = this.selected_row > 0 ? this.selected_row-1 : 0;
				this.global.selected_color = this.getColorAt(this.selected_col, this.selected_row);
				
				//document.getElementById("colorDisplay").style.backgroundColor = this.global.selected_color;
				this.updateDisplay();
			}
			
			if (e.deltaY > 0) {           //down
				this.selected_row = this.selected_row < this.rows-1 ? this.selected_row+1 : this.rows-1;
				this.global.selected_color = this.getColorAt(this.selected_col, this.selected_row);
				
				//document.getElementById("colorDisplay").style.backgroundColor = this.global.selected_color;
				this.updateDisplay();
			}
	}
//-------------------------------------------------------------
	onDoubleClick(e) {
		// if (e.target === palette_canvas)
		// canvas.style.backgroundColor = this.global.selected_color;
	}			
//-------------------------------------------------------------
	selectColorAtCursor() {
		this.selected_col = Math.floor(this.mouse_x / this.cell_width);
		this.selected_row = Math.floor(this.mouse_y / this.cell_height);
		this.global.selected_color = this.getColorAt(this.selected_col, this.selected_row);
		
		
		
		
		
		//document.getElementById("colorDisplay").style.backgroundColor = this.global.selected_color;
		
	}
//-------------------------------------------------------------
	getColorAtCursor() {
		this.selected_col = Math.floor(this.mouse_x / this.cell_width);
		this.selected_row = Math.floor(this.mouse_y / this.cell_height);
		let result = this.getColorAt(this.selected_col, this.selected_row);
		return result;
		
		
		
		
		
		//document.getElementById("colorDisplay").style.backgroundColor = this.global.selected_color;
		
	}
//-------------------------------------------------------------
	updateDisplay() {
		this.clear();
		this.render();
		this.highlightSelectedColor();
		this.drawBorder();
	}
//-------------------------------------------------------------
	render() {
		this.ctx.save();
		
		for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				if (this.palette_array[i][j] === null) continue;
				
					this.ctx.fillStyle = this.palette_array[i][j];
				
				this.ctx.fillRect(i*this.cell_width, j*this.cell_height, this.cell_width+1, this.cell_height+1);
			
			
			}
			if (this.divide_columns) {
				this.ctx.strokeStyle = '#000000';
				this.ctx.lineWidth = 1;
				this.ctx.beginPath();
				this.ctx.moveTo(i*this.cell_width, 0);
				this.ctx.lineTo(i*this.cell_width, this.canvas.width);
				this.ctx.stroke();
			}
		}
		
		this.ctx.lineWidth = this.selected_line_width;
		this.ctx.strokeStyle = this.selected_line_color;
		
		
		this.ctx.restore();
		
		
		
	}
//-------------------------------------------------------------
	highlightSelectedColor() {
		this.ctx.save();
		this.ctx.lineWidth = this.selected_line_width;
		//this.ctx.strokeStyle = this.selected_line_color;
		//this.ctx.strokeStyle = this.getInvertedColor(this.global.selected_color);
		this.ctx.strokeStyle = '#000000';
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(this.selected_col*this.cell_width, this.selected_row*this.cell_height, 
					this.cell_width, this.cell_height);
		
		this.ctx.strokeStyle = '#ffffff';
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(this.selected_col*this.cell_width-2, this.selected_row*this.cell_height-2, 
					this.cell_width+4, this.cell_height+4);
		this.ctx.restore();
	}

//------------------------------------------------------------

	initialize() {
		
		for (var i = 0; i < this.columns; i++) {
			this.palette_array[i] = new Array(this.rows);
		}
		switch(this.palette_number) {
			case 1:
				this.fillPalette1();
			break;
			case 2:
				this.fillPalette2();
			break;
			case 3:
				this.fillPalette3();
			break;
		}
		
		this.fillPaletteGreyScale();
		
		//this.palette_array[0][0] = this.palette_array[0][1] = null;
	

	}
	
//--------------------------------------------------------------
//--------------------------------------------------------------
	fillPalette1() { //cycles only lightness
		for (var i = 0; i < this.rows; i++) {
			this.colorCycler.reset();
			this.colorCycler.setLightness(((i+1)/this.rows)*80  +15);
			//this.colorCycler.setSaturation(((i+1)/this.rows)*80  +15);
			for (var j = 0; j < this.columns-5; j++) {
				this.palette_array[j][i] = this.colorCycler.getNextColor();	
			}		
		}
	}
//--------------------------------------------------------------
	fillPalette2() {  //contains both lightness and saturation cycle 
		for (var i = 0; i < this.rows; i++) {
			this.colorCycler.reset();
			this.colorCycler.setLightness(((i+1)/this.rows)*50  +15);
			this.colorCycler.setSaturation(30);
			for (var j = 0; j < this.columns-5; j++) {
				this.palette_array[j][i] = this.colorCycler.getNextColor();	
			}		
		}
	}
//--------------------------------------------------------------
	fillPalette3() { //muddy palette
		for (var i = 0; i < this.rows; i++) {
			this.colorCycler.reset();
			this.colorCycler.setLightness(((i+1)/this.rows)*50  +15);
			this.colorCycler.setSaturation(15);
			for (var j = 0; j < this.columns-5; j++) {
				this.palette_array[j][i] = this.colorCycler.getNextColor();	
			}		
		}
	}
//-------------------------------------------------------------

	fillPaletteGreyScale() {
		this.colorCycler2.reset();
		for (var i = this.columns-5; i < this.columns; i++) {   ///    GREYSCALE
			for (var j = 0; j < this.rows; j++) {
				this.palette_array[i][j] = this.colorCycler2.getNextColor();	
			}
		}
	}
//-------------------------------------------------------------
	drawBorder() {
		this.ctx.save();
		this.ctx.lineWidth = this.outer_border_width;
		this.ctx.strokeStyle = this.outer_border_color;
		this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
	}
//-------------------------------------------------------
		switchPalette() {
			this.palette_number = ++this.palette_number > 3 ? 1 : this.palette_number;
			this.initialize();
			this.updateDisplay();
		}

//-------------------------------------------------------------
	getColorAt(col, row) {
		return this.palette_array[col][row];
	}
//-------------------------------------------------------------
	getCellByColor(color) {
		
		for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				if (this.palette_array[i][j] === color) {
					this.selected_col = i;
					this.selected_row = j;
					this.updateDisplay();
					return;				
				}	
			}
		}	
		
		// if still haven't found the color, switch palette and search again:
			this.switchPalette();
			
			for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				if (this.palette_array[i][j] === color) {
					this.selected_col = i;
					this.selected_row = j;
					this.updateDisplay();
					return;				
				}	
			}
		}	
		
		//same thing, if still haven't found the color, switch palette and search again:
			this.switchPalette();
			
			for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				if (this.palette_array[i][j] === color) {
					this.selected_col = i;
					this.selected_row = j;
					this.updateDisplay();
					return;				
				}	
			}
		}
		
	}
//-------------------------------------------------------------
	getInvertedColor(color) {
		if (!color) 
			return  '#000000';
		
		let r, g, b, inverted;
		r = parseInt((color[1] + color[2]), 16);
		g = parseInt((color[3] + color[4]), 16);
		b = parseInt((color[5] + color[6]), 16);
		r = 255 - r;
		g = 255 - g;
		b = 255 - b;
		r = r.toString(16);
		g = g.toString(16);
		b = b.toString(16);
		if (r.length < 2) r = 0 + r;
		if (g.length < 2) g = 0 + g;
		if (b.length < 2) b = 0 + b;
		
		
		inverted = '#' + r + g + b;
		
	//	console.log(inverted);
		return inverted;
	}
//-------------------------------------------------------------
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
//------------------------------------------------------------------------

	normalize (val, min, max){
		return (val - min) / (max - min);
	}

}  