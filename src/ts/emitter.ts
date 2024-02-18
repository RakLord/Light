import p5 from "p5";
import { LightRay } from "./ray";

export class Emitter {
  p: p5;
  pos: p5.Vector;
  interval: number;
  i: number;
  timer: any;
  sketch: any;

  constructor(p: p5, pos: p5.Vector, sketch: any) {
    this.pos = pos;
    this.p = p;
    this.interval = 10000;
    this.i = 0;
    this.sketch = sketch;

    this.timer = setInterval(this.emit.bind(this), this.interval);
    this.emit();

  }
  
    emit(sketch: any = this.sketch) {
      if (this.sketch.rays.length < this.sketch.maxRays) {
        let ray = new LightRay(this.p, this.pos, this.p.random(0, 360), this.sketch.colors.white);
        sketch.rays.push(ray);
      }
    }
  
    draw() {
      this.p.fill(255);
      this.p.ellipse(this.pos.x, this.pos.y, 20, 20);
    }
  }