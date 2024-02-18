import p5 from "p5";
import { LightRay } from "./ray.js";
import { Collider } from "./collider.js";


export class Splitter {
    p: p5;
    pos: p5.Vector;
    angle: number;
    size: number;
    color: p5.Color;
    width: number;
    colliderType: string;
    normals: p5.Vector[];
    parts: SplitterPart[];
    sketch: any;

    constructor(p: p5, sketch: any, pos: p5.Vector, angle: number, size: number, color: p5.Color) {
        this.p = p;
        this.sketch = sketch;
        this.pos = pos;
        this.angle = angle;
        this.size = size;
        this.color = color;
        this.width = 6;  // Line draw width (not splitter size)
        this.colliderType = "splitter";

        this.normals = [];
        this.parts = [];

        this.setup();
    }

    calculateNormal(pos1: p5.Vector, pos2: p5.Vector): number {
        let direction = p5.Vector.sub(pos2, pos1);
        let angle = direction.heading() + this.p.HALF_PI; // Rotate by 90 degrees to get normal
        return this.p.degrees(angle); // Return the angle in degrees
    }

    setup() {
        let angleOffsetRadians = this.p.radians(120);
        let initialDir = this.p.createVector(1, 0);

        console.log("size", this.size)
        console.log("Center", this.pos);
        const center: p5.Vector = this.pos.copy();

        this.p.strokeWeight(this.width);
        this.p.stroke(this.p.color(255, 0, 0, 255));
        this.p.point(center.x, center.y);
        
        let pos1: p5.Vector = this.p.createVector(center.x + this.size * this.p.cos(0),
                                                  center.y + this.size * this.p.sin(0));

        let pos2: p5.Vector = this.p.createVector(center.x + this.size * this.p.cos(angleOffsetRadians),
                                                  center.y + this.size * this.p.sin(angleOffsetRadians));

        let pos3: p5.Vector = this.p.createVector(center.x + this.size * this.p.cos(angleOffsetRadians * 2),
                                                  center.y + this.size * this.p.sin(angleOffsetRadians * 2));


        console.log('Pos1:', pos1.x, ',', pos1.y,'\n',
                    'Pos2:', pos2.x, ',', pos2.y,'\n',
                    'Pos3:', pos3.x, ',', pos3.y,'\n')

        this.p.stroke(this.p.color(255, 0, 0, 255));
        this.p.point(pos1.x, pos1.y);
        this.p.point(pos2.x, pos2.y);
        this.p.point(pos3.x, pos3.y);

        let mid1: p5.Vector = p5.Vector.lerp(pos1, pos2, 0.5);
        let mid2: p5.Vector = p5.Vector.lerp(pos2, pos3, 0.5);
        let mid3: p5.Vector = p5.Vector.lerp(pos3, pos1, 0.5);
    
        let normal1: number = this.calculateNormal(pos1, pos2);
        let normal2: number = this.calculateNormal(pos2, pos3);
        let normal3: number = this.calculateNormal(pos3, pos1);
       
        this.parts.push(new SplitterPart(this.p, this.sketch, pos1, pos2, this.color, [mid2, normal2], [mid3, normal3]));
        this.parts.push(new SplitterPart(this.p, this.sketch, pos2, pos3, this.color, [mid3, normal3], [mid1, normal1]));
        this.parts.push(new SplitterPart(this.p, this.sketch, pos3, pos1, this.color, [mid1, normal1], [mid2, normal2]));

        this.parts.forEach((part) => {
            this.sketch.colliders.push(part);
        });
    }
}


export class SplitterPart extends Collider {
    center: p5.Vector;
    exit1: [p5.Vector, number]; // [pos, normal]
    exit2: [p5.Vector, number]; // [pos, normal]
    sketch: any;
    constructor(p: p5, sketch: any, pos1: p5.Vector, pos2: p5.Vector, color: p5.Color, exit1: [p5.Vector, number], exit2: [p5.Vector, number]) {
        super(p, pos1, pos2, color);
        this.sketch = sketch;
        this.center = this.pos1.copy().add(this.pos2).div(2);
        this.exit1 = exit1;
        this.exit2 = exit2;
        console.log(' Ex1 Pos:', this.exit1[0].x, ',', this.exit1[0].y,'\n',
                    'Ex1 Normal:', this.exit1[1], '\n',
                    'Ex2 Pos:', this.exit2[0].x, ',',this.exit2[0].y,'\n',
                    'Ex2 Normal:', this.exit2[1])

        this.colliderType = "splitterPart";
    }


    draw() {
        this.p.fill(this.color);
        this.p.stroke(this.color);
        this.p.strokeWeight(this.width);
        this.p.line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    }

  onCollision(ray: any, dir: p5.Vector) {
    if (this.sketch.rays.length > this.sketch.maxRays) {
        ray.pos = this.exit1[0].copy();
        ray.angle = this.exit1[1];
        return ray.angle;
    }

    let newRay = new LightRay(this.p, this.exit1[0].copy(), this.exit1[1], this.color);
    this.sketch.rays.push(newRay);
    ray.pos = this.exit2[0].copy();
    ray.angle = this.exit2[1];

    return ray.angle;
  }
}
