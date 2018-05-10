
class Slider {
  constructor(options) {
      this._options = options;
      this.ctx;
      // call methods to create canvas and sliders
      this.createCanvas();
      this.makeSliders();
  }

  // create canvas and append it to DOM container defined in options parameter
  createCanvas() {
    const container = document.getElementById(this._options.container);
    let contW = container.getBoundingClientRect().width;
    let contH = container.getBoundingClientRect().height;
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    // layout - vertical / horizontal
    if (contW > contH) {
      canvas.height = contH * .95;
      canvas.width = canvas.height * 1.5;
    }
    else {
      canvas.width = contW * .95;
      canvas.height = canvas.width * 1.5;
    }
    // canvas styles
    canvas.style.position = 'relative';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.border = '1px dashed grey';
    // create canvas in DOM
    container.appendChild(canvas);
    // get ctx
    this.ctx = canvas.getContext('2d');
  }

  makeSliders() {
    // variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    // sliders' center position (right or bottom)
    let center = (canvas.width > canvas.height) ? {x: cw*2/3, y: ch/2} : {x: cw/2, y: ch*2/3};

    // draw empty sliders
    function drawSliders() {
      ctx.lineWidth = 15;
      ctx.strokeStyle = '#eee';
      let r;
      for (let i = 0; i < options.sliders.length; i++) {
        r = options.sliders[i].radius;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, 2*pi, false);
        ctx.stroke();
      }
    }

    // draw handles with default positions
    function drawHandles() {
      // handle radius
      const r = 10;
      // handle coordinates
      let x = center.x;
      let y;
      // draw handles
      for (let i = 0; i < options.sliders.length; i++) {
        y = center.y - options.sliders[i].radius;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*pi, false);
        ctx.fillStyle = "#eeefef";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cfcfcf';
        ctx.stroke();
      }
    }

    function animateHandles() {
      // if clicked on radius of one of the sliders, redraw handle on that position
    }

    drawSliders();
    drawHandles();
    animateHandles();
  }




  // // draw values on the left
  // const value = 50;  // to be added
  // ctx.textAlign = 'left';
  // const fontSize = cw * 0.05 + 'px';
  // ctx.font="fontSize Arial";
  // ctx.fillText('$'+value, cw/5, ch*0.4);

};

// enter options
const options = {
  container: 'container',
  sliders: [
    {radius: 80},
    {radius: 120}]
};

// initialize slider object with options defined above
const slider = new Slider(options);



// options:
//   container
//   color
//   max
//   min
//   step
//   radius
