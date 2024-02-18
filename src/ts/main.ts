console.log("Pre Imports");
import p5 from "p5";
import { LightRay } from "./ray";
import { Collider } from "./collider";
import { Emitter } from "./emitter";
import { Glass } from "./glass";
import { Splitter } from "./splitter";

window.addEventListener("contextmenu", e => e.preventDefault());


const canvasSize: number = 1200;

class Sketch {
  p: p5;
  canvas: p5.Renderer | undefined;
  canvasSize: p5.Vector;

  canvasCenter: p5.Vector | undefined;

  clickState: boolean;
  clickPos1: p5.Vector | null;
  clickPos2: p5.Vector | null;
  clickAngle: number | null;

  emitterPos: p5.Vector;
  emitters: Emitter[];

  colliders: Collider[];
  rays: LightRay[];
  maxRays: number;
  maxCollisions: number;
  emitterInterval: number;
  colors: { [key: string]: p5.Color };

  constructor(p: p5) { 
    this.p = p;
    this.canvasSize = this.p.createVector(canvasSize, canvasSize);
    
    this.clickState = false;
    this.clickPos1 = null;
    this.clickPos2 = null;
    this.clickAngle = null;
    this.emitterPos = p.createVector(150, canvasSize / 2);
    this.emitters = [];
    this.colliders = [];
    this.rays = [];
    this.maxRays = 5;
    this.maxCollisions = 10;
    this.emitterInterval = 10000;
    this.colors = {
      "background": this.p.color(30, 30, 30, 10),
      "red": this.p.color(255, 0, 0, 255),
      "green": this.p.color(0, 255, 0, 255),
      "blue": this.p.color(0, 0, 255, 255),
      "white": this.p.color(255, 255, 255, 255),
      "black": this.p.color(0, 0, 0, 255)};
  }

  initialize() {
    this.p.background(this.colors.background);
    this.canvasCenter = this.p.createVector(this.canvasSize.x / 2, this.canvasSize.y / 2);
    this.emitterPos = this.canvasCenter;

    this.colliders = [];
    let tmpColor: p5.Color = this.colors.red;
    
    // Wall colliders setup
    this.colliders.push(new Collider(this.p, this.p.createVector(0, 0), this.p.createVector(this.canvasSize.x, 0), tmpColor));
    this.colliders.push(new Collider(this.p, this.p.createVector(0, 0), this.p.createVector(0, this.canvasSize.y), tmpColor));
    this.colliders.push(new Collider(this.p, this.p.createVector(this.canvasSize.x, 0), this.p.createVector(this.canvasSize.x, this.canvasSize.y), tmpColor));
    this.colliders.push(new Collider(this.p, this.p.createVector(0, this.canvasSize.y), this.p.createVector(this.canvasSize.x, this.canvasSize.y), tmpColor));
    
    tmpColor = this.colors.blue;
    tmpColor.setAlpha(100);
    this.colliders.push(new Glass(this.p, this.p.createVector(200, 200), this.p.createVector(1100, 200), tmpColor));
    this.colliders.push(new Glass(this.p, this.p.createVector(200, 500), this.p.createVector(1100, 500), tmpColor));
    this.colliders.push(new Glass(this.p, this.p.createVector(200, 900), this.p.createVector(1100, 900), tmpColor));
    
    new Splitter(this.p, this, this.p.createVector(this.canvasSize.x / 2, 400), 0, 100, this.p.color(255, 255, 255, 255));
    
    this.emitters = [];
    // this.emitters.push(new Emitter(this.p, this.emitterPos, this));
    this.rays.push(new LightRay(this.p, this.canvasCenter, 270, this.colors.white));
  }

  setup() {
    this.canvas = this.p.createCanvas(this.canvasSize.x, this.canvasSize.y);

    this.canvas.addClass("p5-canvas")

    this.p.background(this.colors.background);
    this.p.noiseDetail(4, 0.25);
    this.p.angleMode(this.p.DEGREES);
    
    this.p.frameRate(5);
    this.initialize();
  }

  draw() {
    this.p.noStroke();
    this.p.fill(255);
    this.p.background(this.colors.background);

    this.rays.forEach(ray => ray.rayTick(this.colliders));

    for (let i = this.rays.length - 1; i >= 0; i--) {
      if (this.rays[i].maxCollisions <= 1) {
        console.log("Remove", this.rays[i])
        this.rays.splice(i, 1);
      }
    }
    

    this.emitters.forEach(emitter => emitter.draw());
    this.colliders.forEach(collider => collider.draw());

    this.p.fill(255);
    this.p.stroke(255);
    this.p.textSize(20);
    this.p.textAlign(this.p.CENTER, this.p.TOP);

  }
  keyPressed() {
    if (this.p.mouseButton === this.p.LEFT) {
      this.clickState = true;
      this.clickPos1 = this.p.createVector(this.p.mouseX, this.p.mouseY);
    }

    if (this.p.mouseButton === this.p.RIGHT) {
      if (this.clickState && this.clickPos1) {
        this.clickState = false;
        this.clickPos2 = this.p.createVector(this.p.mouseX, this.p.mouseY);
        this.clickAngle = this.p.degrees(this.p.atan2(this.clickPos2.y - this.clickPos1.y, this.clickPos2.x - this.clickPos1.x));
        this.colliders.push(new Collider(this.p, this.clickPos1, this.clickPos2, this.colors.green));
      }
    }
  }
}

new p5((p: p5) => {
  let sketch = new Sketch(p);
  p.setup = () => sketch.setup();
  p.draw = () => sketch.draw();
  p.keyPressed = () => sketch.keyPressed();
  (window as any).sketch = sketch;
});
