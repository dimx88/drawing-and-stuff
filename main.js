//canvas

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
//Stage

let stage = new Node2d({x:0, y:0}, 'MainStage');     //root

//

let clear = clearScreenAlpha;



stage.addChild(new Level1());

let active_level = 1;

setInterval(update, 1000/60);

function update() {
	clear();

	stage.update();
	stage.render();

}



this.onmousedown = function(e) {
	if (active_level === 1) {
		
		stage.clearTree();
		stage.addChild(new Level2());
		
		active_level = 2;

	}else {
		
		stage.clearTree();
		stage.addChild(new Level1());

		active_level = 1;

	}
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function clearScreenAlpha() {
	ctx.fillStyle = "white";
	ctx.globalAlpha=0.2;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha=1;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

