console.log("Hello World");
import p5 from "p5";
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(800, 600);
    };
    p.draw = () => {
        p.background(0);
        p.fill(50);
        p.ellipse(p.width / 2, p.height / 2, 50, 50);
    };
};
console.log("init");
new p5(sketch);
//# sourceMappingURL=main.js.map