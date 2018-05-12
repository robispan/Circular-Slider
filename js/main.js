
class Slider {
  constructor(options) {
      this._options = options;
      this.ctx;
      // call methods to create canvas and sliders
      this.createCanvas();
      this.drawObjects();
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

  // draw sliders, handles & data fields, move sliders
  drawObjects() {
    // global variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    const r = 10; // radius of handles
    let diff; // path from slider top to handle in radians
    // sliders center position
    let center = (canvas.width > canvas.height) ? {x: cw*2/3, y: ch/2} : {x: cw/2, y: ch*2/3};

    // draw sliders
    function drawSliders() {
      ctx.lineWidth = 15;
      ctx.strokeStyle = '#eee';
      for (let i = 0; i < options.sliders.length; i++) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, options.sliders[i].radius, 0, 2*pi, false);
        ctx.stroke();
      }
    }

    // make array of handles
    const handles = [];
    for (let i = 0; i < options.sliders.length; i++) {
      handles.push({r: options.sliders[i].radius, x: center.x, y: center.y - options.sliders[i].radius, color: options.sliders[i].color});
    }

    // draw handles & colored paths
    function drawHandles() {
      handles.forEach(function(handle) {
        // draw paths
        diff = Math.atan2(handle.y - center.y + 0.00001, handle.x - center.x + 0.00001);
        ctx.beginPath();
        ctx.arc(center.x, center.y, handle.r, 1.5*pi, diff, false);
        ctx.lineWidth = 10;
        ctx.strokeStyle = handle.color;
        ctx.stroke();
        // draw handles
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, r, 0, 2*pi, false);
        ctx.fillStyle = "#eeefef";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cfcfcf';
        ctx.stroke();
      });
    }

    // move handle
    function moveHandle() {
      let mouseX, mouseY;
      let x, y, z, z1;
      let mouseDown;
      console.log('moveHandles!');
      // listen to mouse up
      ctx.canvas.addEventListener('mouseup', function() {
        mouseDown = false;
        console.log('mouseup!');
      });

      function redrawHandles(z) {
        handles.forEach(function(handle) {
          // check if slider was clicked
          if (z < handle.r + 10 && z > handle.r - 10 && mouseDown) {
            // get mouse coordinates inside canvas
            mouseX = event.clientX - canvas.getBoundingClientRect().left;
            mouseY = event.clientY - canvas.getBoundingClientRect().top;
            // get x & y distance from slider center to mouse
            x = mouseX - center.x;
            y = mouseY - center.y;
            // get absolute distance from slider center to mouse
            z1 = (x**2 + y**2)**0.5;
            console.log('z1:' + z1);
            // draw handles
            handle.x = handle.r/z1 * x + center.x;
            handle.y = handle.r/z1 * y + center.y;
            // clear canvas
            ctx.clearRect(0, 0, cw, ch);
            // draw empty sliders
            drawSliders();
            // draw all handles
            drawHandles();
          }
        });
      }

      // move handle on mouse down
      ctx.canvas.addEventListener('mousedown', function() {
        mouseDown = true;
        console.log('mousedown!');
        // mouse coordinates inside canvas
        mouseX = event.clientX - canvas.getBoundingClientRect().left;
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
        // x & y distance from slider center to mouse
        x = mouseX - center.x;
        y = mouseY - center.y;
        // absolute distance from slider center to mouse
        z = (x**2 + y**2)**0.5;
        console.log('z:' + z);

        redrawHandles(z);

        if (mouseDown) {
          // drag handle on mouse down
          ctx.canvas.addEventListener("mousemove", function() {
            redrawHandles(z);
          });
        } else {
          ctx.canvas.removeEventListener("mousemove", function() {
            redrawHandles(z);
          });
        }
      });
    }

    // Add touch screen support
    document.addEventListener("touchstart", touch2Mouse, true);
    document.addEventListener("touchmove", touch2Mouse, true);
    document.addEventListener("touchend", touch2Mouse, true);
    function touch2Mouse(e) {
      console.log('touchtomouse');
      var theTouch = e.changedTouches[0];
      var mouseEv;
      switch(e.type) {
        case "touchstart": mouseEv="mousedown"; break;
        case "touchend":   mouseEv="mouseup"; break;
        case "touchmove":  mouseEv="mousemove"; break;
        default: return;
      }
      var mouseEvent = document.createEvent("MouseEvent");
      mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
      theTouch.target.dispatchEvent(mouseEvent);
      e.preventDefault();
    }

    // draw empty sliders
    drawSliders();
    // draw handles
    drawHandles();
    // listen for user input and adjust handles
    moveHandle();
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
    {radius: 50, color: 'red', max: 500, min: 0, step: 1},
    {radius: 150, color: 'red', max: 405, min: 100, step: 2},
    {radius: 80, color: 'green', max: 600, min: 105, step: 0.5},
    {radius: 110, color: 'blue', max: 660, min: 50, step: 10}]
};

// initialize slider object with options object
const slider = new Slider(options);




//
