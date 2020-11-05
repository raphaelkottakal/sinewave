var offset = 0;
var waves = [];
var firstSinewave;
var tapReleased = true;
var tapStart;
var ghostOffet = 0;
var ghostWidth = 0;
var ghostSinewave;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100, 1);
  firstSinewave = new Sinewave({
    x: (windowWidth / 2) - 100,
    y: windowHeight / 2,
    length: 200
  });
  waves.push(firstSinewave);
}

function draw() {
  background(0);
  for (var i = 0; i < waves.length; i++) {
    waves[i].display();
  }
  if (mouseIsPressed && tapStart) {
    drawGhostLine(tapStart);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  if (!tapReleased) {
    return;
  }
  tapReleased = false;
  ghostSinewave = null;
  ghostOffet = 0;
  ghostWidth = 0;
  tapStart = createVector(mouseX, mouseY);
}

function touchMoved(e) {
  e.preventDefault();
}

function touchEnded() {
  if (ghostSinewave.mag() > 20) {
    // if (waves.length === 30) {
    //   waves.shift();
    // }
    var newWave = new Sinewave({
      x: tapStart.x,
      y: tapStart.y,
      angle: ghostSinewave.mult(-1).heading(),
      length: ghostSinewave.mag(),
      weight: ghostWidth
    });
    waves.push(newWave);
  }
  tapStart = null;
  tapReleased = true;
  return false;
}

function drawGhostLine(start) {
  const currentPoint = createVector(mouseX, mouseY);
  const currentVector = p5.Vector.sub(start, currentPoint);
  stroke(100, 0.5);
  ghostWidth = abs((cos(ghostOffet) * 6)) + 2;
  strokeWeight(ghostWidth);
  line(start.x, start.y, currentPoint.x, currentPoint.y);
  ghostOffet += 0.05;
  ghostSinewave = currentVector;
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