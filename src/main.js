//canvas

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
//Stage

let stage = new Node2d({x:0, y:0}, 'MainStage');     //root

//




stage.addChild(new Level1());


setInterval(update, 1000/60);

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height); //draw border


	stage.update();
	stage.render();

}

