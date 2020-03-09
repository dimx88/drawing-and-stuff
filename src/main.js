//canvas

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
//Stage

let stage = new Node2d({x:0, y:0}, 'MainStage');     //root

//




stage.addChild(new Level1());

let active_level = 1;

setInterval(update, 1000/60);

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	//ctx.fillRect(canvas.width/2 -5, canvas.height/2 -5, 10, 10);	//dot at screen center

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

