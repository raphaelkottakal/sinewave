var offset = 0;
var firstSinewave;

function setup() {
  createCanvas(windowWidth, windowHeight);
  firstSinewave = new Sinewave({
    x: (windowWidth / 2) - 100,
    y: windowHeight / 2,
    length: 200,
    angle: 0,
    color: 255,
    weight: 3,
    // showPoints: true,
    // segments: 5
  });
}

function draw() {
  background(0);
  firstSinewave.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Sinewave(opts) {
  this.pos = {
    x: opts.x,
    y: opts.y
  };
  this.segments = opts.segments || 10;
  this.showPoints = opts.showPoints || false;
  this.length = opts.length / TWO_PI;
  this.angle = opts.angle || 0;
  this.color = opts.color || color(random(360), 80, 60, 0.75);
  this.offset = 0;
  this.weight = opts.weight || random(2,7);
  this.offsetRate = map(this.weight, 2, 7, 5, 0.1) / this.length;
}

Sinewave.prototype.display = function() {
    var slice = TWO_PI / this.segments;
		push();
		translate(this.pos.x, this.pos.y);
		noFill();
		stroke(this.color);
		strokeWeight(this.weight);
		rotate(this.angle);
		beginShape();
		for (var i = 0 - slice; i <= TWO_PI + slice; i += slice) {
			var x = i * this.length;
			var y = sin(i) * sin(this.offset) * this.length;
      curveVertex(x, y);
      if (this.showPoints) {
        ellipse(x, y, 3);
      }
		}
		endShape();
		pop();
		this.offset += this.offsetRate;
}