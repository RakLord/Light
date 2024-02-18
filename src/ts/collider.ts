import p5 from "p5";

export class Collider {
  p: p5;
  pos1: p5.Vector;
  pos2: p5.Vector;
  color: p5.Color;
  width: number;
  colliderType: string;

  constructor(p: p5, pos1: p5.Vector, pos2: p5.Vector, color: p5.Color) {
    this.p = p;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.color = color;
    this.width = 6;
    this.colliderType = "mirror";
  }
  
  draw() {
    this.p.fill(this.color);
    this.p.stroke(this.color);
    this.p.strokeWeight(this.width);
    this.p.line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
  }

  onCollision(ray: any, dir: p5.Vector) {
    let normal = this.pos2.copy().sub(this.pos1).rotate(90).normalize();
    let incident = dir.copy();
    let reflection = incident.copy().sub(normal.copy().mult(2 * incident.dot(normal)));

    return ray.p.atan2(reflection.y, reflection.x)
  }
}
