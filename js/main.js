
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


  // draw sliders, handles & data field
  makeSliders() {
    // common variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    // sliders center position
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


    // array of handles with coordinates that can be changed with user input (click, drag... )
    let handles = [];
    for (let i = 0; i < options.sliders.length; i++) {
      handles.push({r: options.sliders[i].radius, x: center.x, y: center.y - options.sliders[i].radius});
    }


    // draw handles
    function drawHandles() {
      const r = 10;
      // draw handles
      handles.forEach(function(handle) {
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, r, 0, 2*pi, false);
        ctx.fillStyle = "#eeefef";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cfcfcf';
        ctx.stroke();
      });
    }


    // animate handles
    function animateHandles() {
      let mouseX, mouseY;
      let x, y, z;

      // move handle if clicked on a slider
      ctx.canvas.addEventListener('click', function(event) {
        // mouse coordinates inside canvas
        mouseX = event.clientX - canvas.getBoundingClientRect().left;
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
        // x & y distance from slider center to mouse
        x = mouseX - center.x;
        y = mouseY - center.y;
        // absolute distance from slider center to mouse
        z = (x**2 + y**2)**0.5;

        // draw handles
        handles.forEach(function(handle) {
          // if a slider was clicked, adjust position of its handle
          if (z < handle.r + 10 && z > handle.r - 10) {
            handle.x = handle.r/z * x + center.x;
            handle.y = handle.r/z * y + center.y;
            // clear canvas
            ctx.clearRect(0, 0, cw, ch);
            // draw empty sliders
            drawSliders();
            // draw all handles
            drawHandles();
          }
        });
      });
    }


    // draw empty sliders
    drawSliders();
    // draw handles
    drawHandles();
    // listen for user input and adjust handles
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
    {radius: 50, color: 'red'},
    {radius: 80, color: 'green'},
    {radius: 110, color: 'blue'}]
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
