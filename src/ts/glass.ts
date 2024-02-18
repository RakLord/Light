import p5 from "p5";
import { Collider } from "./collider.js";

export class Glass extends Collider {
  constructor(p: p5, pos1: p5.Vector, pos2: p5.Vector, color: p5.Color) {
    super(p, pos1, pos2, color);
    this.colliderType = "glass";
  }

  onCollision(ray: any, dir: p5.Vector) {
    // blend the color of the ray between the current color and the mirrors color
    // let c = this.p.color(this.color);
    // c.setAlpha(255);
    // ray.color.setAlpha(255);
    // ray.color = this.p.lerpColor(ray.color, c, 0.5).setAlpha(255);
    
    return ray.angle
  }
}
