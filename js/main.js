
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
    // sliders center position
    const center = (canvas.width > canvas.height) ? {x: cw*2/3, y: ch/2} : {x: cw/2, y: ch*2/3};

    // make array of sliders
    const sliders = [];
    for (let i = 0; i < options.sliders.length; i++) {
      sliders.push({
        r: options.sliders[i].radius,
        x: center.x,
        y: center.y - options.sliders[i].radius,
        color: options.sliders[i].color,
        max: options.sliders[i].max,
        min: options.sliders[i].min,
        step: options.sliders[i].step
      });
    }

    // get user value from radians
    function getValue(diff, max, min) {
      if (diff + pi/2 < 0) {
        return (2.5*pi + diff) * (max-min) / 20*pi + min;
      } else {
        return (diff + pi/2) * (max-min) / 20*pi + min;
      }
    }

    const r = 5;  // handle radius
    let diff;  // distance from slider top to handle in radians
    let value;  // slider value in user units
    let max;  // user defined max value
    let fontSize;  // data font size
    let bigDash;  // dashes on slider
    let smallDash; // transparent dashes on slider
    // data position
    const dataPosition = (canvas.width > canvas.height) ? {x: cw*0.2, y: ch/3} : {x: cw/4, y: ch*0.1};

    // draw sliders, handles & colored paths
    function drawsliders() {
      sliders.forEach(function(slider, index) {
        // draw sliders backgrounds
        bigDash = ((pi*2*slider.r/(slider.max - slider.min)) * 1.0001) - 2;
        smallDash = 2;
        ctx.setLineDash([bigDash, smallDash]);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#aaa';
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, 1.5*pi, false);
        ctx.stroke();
        // draw paths
        diff = Math.atan2(slider.y - center.y, slider.x - center.x);
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, 1.5*pi, diff + 0.00001, false);
        ctx.lineWidth = 15;
        ctx.strokeStyle = slider.color;
        ctx.stroke();
        // draw handles
        ctx.beginPath();
        ctx.arc(slider.x, slider.y, r, 0, 2*pi, false);
        ctx.fillStyle = "#eeefef";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cfcfcf';
        ctx.stroke();
        // draw data
        value = Math.floor(getValue(diff, slider.max, slider.min) * 1.013);
        fontSize = cw * 0.03;
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = 'left';
        ctx.fillText('$' + value, dataPosition.x, dataPosition.y + index*cw/20);
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

      function redrawsliders(z) {
        sliders.forEach(function(handle) {
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
            // adjust handle position
            handle.x = handle.r/z1 * x + center.x;
            handle.y = handle.r/z1 * y + center.y;
            // clear canvas
            ctx.clearRect(0, 0, cw, ch);
            // draw  sliders
            drawsliders();
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

        redrawsliders(z);

        if (mouseDown) {
          // drag handle on mouse down
          ctx.canvas.addEventListener("mousemove", function() {
            redrawsliders(z);
          });
        } else {
          ctx.canvas.removeEventListener("mousemove", function() {
            redrawsliders(z);
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

    // draw sliders
    drawsliders();
    // listen for user input and adjust handles
    moveHandle();
  }

};

// enter options
const options = {
  container: 'container',
  sliders: [
    {radius: 100, color: 'teal', max: 20, min: 5, step: 1},
    {radius: 150, color: 'red', max: 20, min: 10, step: 2}]
};

// initialize slider object with options object
const slider = new Slider(options);




//
