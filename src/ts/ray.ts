import p5 from 'p5';
import { Collider } from './collider';
import { ScriptElementKind } from 'typescript';

export class LightRay {
  p: p5;
  pos: p5.Vector;
  angle: number;
  path: p5.Vector[];
  color: p5.Color;
  maxCollisions: number;
  angleEntropy: number;
  previousCollider: Collider | undefined;
  closestPoint: p5.Vector | undefined;
  closestCollider: Collider | null | undefined;
  closestDistance: number;
  teleportIndex: number | undefined;
  teleporting: boolean;

  constructor(p: p5, pos: p5.Vector, angle: number, color: p5.Color) {
    this.p = p;
    this.pos = pos;
    this.angle = angle;
    this.path = [];
    this.color = color;
    this.maxCollisions = 2000;
    this.angleEntropy = 0.0;
    this.previousCollider = undefined;
    this.closestPoint = undefined;
    this.closestCollider = undefined;
    this.closestDistance = Infinity;
    this.teleportIndex;
    this.teleporting = false;
  }

  rayTick(colliders: Collider[]) {
    this.path.push(this.pos);
    let dir: p5.Vector = this.p.createVector(this.p.cos(this.angle), this.p.sin(this.angle));
    let maxEnd: p5.Vector = dir.copy().mult(5000).add(this.pos);
    
    // loop over all the colliders and find when the ray intersects
    this.closestPoint = undefined;
    this.closestDistance = Infinity;
    this.closestCollider = undefined;
    
    
    for (const collider of colliders) {
      if (collider !== this.previousCollider) {
        const point = this.getIntersectionPoint(collider, maxEnd);
        if (point) {
          const distance = this.pos.dist(point);
          if (distance < this.closestDistance && distance > 0.1) {
            this.closestDistance = distance;
            this.closestPoint = point;
            this.closestCollider = collider;
          }
        }
      }
    }
    // console.log(this.path.length, this.teleportIndex)

    if (this.path.length-1 == this.teleportIndex) {
      // console.log("Teleporting")
      this.teleporting = true;
      this.path[this.teleportIndex] = this.pos;
    } else {
      this.teleporting = false;
    }
    // If there is a collision
    // console.log("Colllision: \nPoint:", this.closestPoint,"\nCollider:", this.closestCollider)
    if (this.closestPoint && this.closestCollider) {
      this.previousCollider = this.closestCollider;
      this.path.push(this.closestPoint);

      if (this.teleporting) {
        this.p.stroke(this.p.color(255, 0, 0));
        this.p.strokeWeight(2);
        this.p.line(this.pos.x, this.pos.y, this.closestPoint.x, this.closestPoint.y);
      } else {
        this.p.stroke(this.color);
        this.p.strokeWeight(2);
        this.p.line(this.pos.x, this.pos.y, this.closestPoint.x, this.closestPoint.y);
      }

  
      this.angle = this.previousCollider.onCollision(this, dir);
      if (this.angleEntropy != 0) {
        this.angle += this.p.random(-this.angleEntropy, this.angleEntropy);
      }

      dir = this.p.createVector(this.p.cos(this.angle), this.p.sin(this.angle));
      maxEnd = dir.copy().mult(5000).add(this.closestPoint);
      this.pos = this.closestPoint;        
    }
    this.maxCollisions--;
  }
    
  getIntersectionPoint(collider: Collider, maxEnd: p5.Vector) {
    // Colider line start/end points
    let colliderPos1 = collider.pos1;
    let colliderPos2 = collider.pos2;

    // Ray start/end points
    let pos1: p5.Vector = this.pos;
    let pos2: p5.Vector = maxEnd;

    // Calculate if the collider lines intersect witht he ray and return the position of intersection
    let denominator = (colliderPos2.y - colliderPos1.y) * (pos2.x - pos1.x) - (colliderPos2.x - colliderPos1.x) * (pos2.y - pos1.y);
    if (denominator === 0) {
      return null;
    }
    let intersectionParameter1 = ((colliderPos2.x - colliderPos1.x) * (pos1.y - colliderPos1.y) - (colliderPos2.y - colliderPos1.y) * (pos1.x - colliderPos1.x)) / denominator;
    let intersectionParameter2 = ((pos2.x - pos1.x) * (pos1.y - colliderPos1.y) - (pos2.y - pos1.y) * (pos1.x - colliderPos1.x)) / denominator;
    if (intersectionParameter1 < 0 || intersectionParameter1 > 1 || intersectionParameter2 < 0 || intersectionParameter2 > 1) {
      return null;
    }
    let x = pos1.x + intersectionParameter1 * (pos2.x - pos1.x);
    let y = pos1.y + intersectionParameter1 * (pos2.y - pos1.y);
    return this.p.createVector(x, y);
  }
  
  draw() {
    // Function currently un-used

    this.p.stroke(this.color);
    this.p.strokeWeight(2);
    // loop over the path and draw the line
    for (let i = 0; i < this.path.length - 1; i++) {
      // if the z index is 1 then ignore this line
      if (this.path[i].z != 1) {
        this.p.line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y);
      }
      else {
        console.log("z=1", this.path[i])
      }
    }
  }
}