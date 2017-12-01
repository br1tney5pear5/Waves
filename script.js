document.getElementsByTagName("body")[0].style = "background-color: #666666";
var canvas = document.getElementById("canvas");
canvas.width = 500; canvas.height = 500;
canvas.style = "border-style: dotted; border-width: 2px";
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
canvas2.width = 500; canvas2.height = 200;
canvas2.style = "border-style: dotted; border-width: 2px";
var ctx2 = canvas2.getContext("2d");

var text0 = document.getElementById("text0");
var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");

var imageData = ctx.createImageData(500,500);	
class Vector2{
	constructor(_x,_y){this.x = _x; this.y = _y;}
}
class Wave{
	constructor(_x,_y,_length =100, _force = 1,_offset = 0){
		this.x = _x; this.y = _y;
		this.deltaX = 0; this.deltaY = 0;
		this.length = _length;
		this.offset = _offset;
		this.value = 10;
		this.force = _force;
		this.test = [];
	}
}
var mousePos = new Vector2(-1,-1);
var mouseDelta = new Vector2(0,0);
var mousedownFlag = false;
var waves = [];
waves.push(new Wave(100,250,5));
//waves.push(new Wave(400,250,5));
var off = 0 ;

window.onload = function(){
	setInterval(recalculate, 100);
	setInterval(update,100);
	setInterval(tick, 100);	
	canvas.addEventListener("mousedown", function(event){mousedownFlag=true;},false);
	canvas.addEventListener("mouseup", function(event){mousedownFlag=false;},false);
	canvas.addEventListener("mousemove", function(event){
		mouseDelta.x = event.layerX - mousePos.x; mouseDelta.y = event.layerY - mousePos.y;
		mousePos.x = event.layerX; mousePos.y = event.layerY;},false);
		
}
function tick(){
	off += 0.1;
}
function recalculate(){
	
	for(let j = 0; j < imageData.data.length; j+= 4){
			imageData.data[j+3] = 0;}
	for(let i = 0; i < waves.length; i++){
		waves[i].test.unshift(waves[i].deltaX);
		waves[i].test.length = 100;
		waves[i].x += waves[i].deltaX; waves[i].deltaX = 0;
		waves[i].y += waves[i].deltaY; waves[i].deltaY = 0;
		
		for(let j = 0; j < imageData.data.length; j+= 4){
			var tempX = getXCoord(Math.floor(j/4), imageData.width)-waves[i].x;
			var tempY = getYCoord(Math.floor(j/4), imageData.height)-waves[i].y;
			var Distance = Math.sqrt(Math.pow(tempX,2)+Math.pow(tempY,2));
			imageData.data[j+3] += (1+Math.cos(Distance/waves[i].length -off))*50;
		}
	}
}
function update(){
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.putImageData(imageData ,0,0);
	//text0.innerHTML = "waves[" + 0 + "].test.length = " + waves[0].test.length + " ; " + "waves[" + 1 + "].test.length = " + waves[1].test.length;
	text1.innerHTML = "mouseDelta = " + mouseDelta.x + ":" + mouseDelta.y; 
	text2.innerHTML = "mousePos = " + mousePos.x + ":" + mousePos.y; 
	for(let i = 0; i < waves.length; i++){	
		
		drawGraph(10,10,480,85,waves[i].test,ctx2,10,1);
		drawGraph(10,105,480,85,waves[i].test,ctx2, 10,1);
 		if(Math.abs(waves[i].x - mousePos.x) < 30 & Math.abs(waves[i].y - mousePos.y) < 30){
 			if(mousedownFlag == true){
 				waves[i].deltaX += mouseDelta.x;
 				waves[i].deltaY += mouseDelta.y;		
 			}
			ctx.beginPath();
			ctx.fillStyle="rgba(100,100,0,150)";
			ctx.arc(waves[i].x,waves[i].y,29,0,Math.PI*2);
			ctx.fill();	
		}
	}
	mouseDelta.x =0; mouseDelta.y =0;		
		
}
function drawGraph(x,y,width,height,data,context,peroid=1, magnif = 10){
	context.clearRect(x,y,width,height);
	
	context.beginPath();
	
	context.strokeRect(x,y,width,height);
	for(let i = 0; i < Math.floor(width/peroid); i +=1){
		if(i == 0){
			context.moveTo(x, y+0.5*height + data[i])
		}
		context.lineTo(x+i*peroid, y + 0.5*height + data[i]* magnif);
	}
	context.stroke();
}
function getXCoord(point, width, offset = 0){return point-(Math.floor(point/width)*width);}
function getYCoord(point, width, offset = 0){return Math.floor(point/width);}
function pithagorean(a,b){return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));}

