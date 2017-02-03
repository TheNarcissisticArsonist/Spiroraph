//Constants
var outerGearRadius = 225; //The radius of the outer gear.
var epsilon = 0.00001;
var resolutionFactor = 10;
var interationsPerDrawCycle = 100;

//Global Variables
var htmlElements = {};
var context;

function setup() {
	htmlElements.outerTeeth = document.getElementById("outerTeeth");
	htmlElements.innerTeeth = document.getElementById("innerTeeth");
	htmlElements.innerRadius = document.getElementById("innerRadius");
	htmlElements.penHoleRadius = document.getElementById("penHoleRadius");
	htmlElements.drawButton = document.getElementById("drawButton");
	htmlElements.canvas = document.getElementById("drawingArea");
	htmlElements.clearButton = document.getElementById("clearButton");

	context = htmlElements.canvas.getContext("2d");
	resetCanvas();

	htmlElements.drawButton.addEventListener("click", draw);
	htmlElements.clearButton.addEventListener("click", resetCanvas);
}
function resetCanvas() {
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, htmlElements.canvas.width, htmlElements.canvas.height);
	context.transform(1, 0, 0, 1, htmlElements.canvas.width/2, htmlElements.canvas.height/2);
	context.transform(1, 0, 0, -1, 0, 0);
	context.beginPath();
}
function draw() {
	innerGearRadius = htmlElements.innerRadius.value;
	outerGearTeeth = htmlElements.outerTeeth.value;
	innerGearTeeth = htmlElements.innerTeeth.value;
	penHoleRadius = htmlElements.penHoleRadius.value;

	innerRadPerTooth = (2*Math.PI)/innerGearTeeth;
	outerRadPerTooth = (2*Math.PI)/outerGearTeeth;


	initialPenPosition = [outerGearRadius-Number(innerGearRadius)+Number(penHoleRadius), 0];
	console.log(initialPenPosition);
	currentPenPosition = initialPenPosition.slice(0);
	currentGearPosition = [outerGearRadius-innerGearRadius, 0];
	
	context.moveTo(initialPenPosition[0], initialPenPosition[1]);
	context.beginPath();

	iteration = 0;
	drawLoop(0, 0);
}
function drawLoop(currentGearPositionRad, currentGearRad) {
	currentGearPositionRad += outerRadPerTooth/10;
	currentGearRad += innerRadPerTooth/10;
	var currentGearPosition = [(outerGearRadius-innerGearRadius)*Math.cos(currentGearPositionRad), (outerGearRadius-innerGearRadius)*Math.sin(currentGearPositionRad)];
	var currentPenPosition = [penHoleRadius*Math.cos(currentGearRad), penHoleRadius*Math.sin(currentGearRad)];
	currentPenPosition[0] += currentGearPosition[0];
	currentPenPosition[1] += currentGearPosition[1];

	context.lineTo(currentPenPosition[0], currentPenPosition[1]);
	context.stroke();

	++iteration;

	currentGearRad %= 2*Math.PI;
	currentGearPositionRad %= 2*Math.PI;

	var diff = Math.sqrt(Math.pow(currentPenPosition[0] - initialPenPosition[0], 2) + Math.pow(currentPenPosition[1] - initialPenPosition[1], 2));

	console.log(currentPenPosition);

	if(diff > epsilon) {
		//console.log(diff);
		if(iteration > interationsPerDrawCycle) {
			window.setTimeout(function() { drawLoop(currentGearPositionRad, currentGearRad); }, 0);
			iteration = 0;
		}
		else {
			drawLoop(currentGearPositionRad, currentGearRad);
		}
	}
}

setup();