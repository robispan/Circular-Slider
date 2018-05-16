
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
    const r = 12;  // handle radius
    const fontSize = (canvas.width > canvas.height) ? cw * 0.07 : ch * 0.07;
    ctx.font = 'bold ' + fontSize + 'px Calibri';
    ctx.textAlign = 'left';
    // sliders center position
    const center = (canvas.width > canvas.height) ? {x: cw*2/3, y: ch/2} : {x: cw/2, y: ch*2/3};
    // data position
    const dataPosition = (canvas.width > canvas.height) ? {x: cw*0.03, y: ch*0.33} : {x: cw*0.03, y: ch*0.07};

    // make array of sliders
    const sliders = [];
    for (let i = 0; i < options.sliders.length; i++) {
      sliders.push({
        r: options.sliders[i].radius,
        color: options.sliders[i].color,
        max: options.sliders[i].max,
        min: options.sliders[i].min,
        value: options.sliders[i].min,
        step: options.sliders[i].step,
        // default position of handles
        diff: -0.5*pi,
        x: center.x,
        y: center.y - options.sliders[i].radius
      });
    }

    // add dash property to sliders
    for (let i = 0; i < options.sliders.length; i++) {
      const slider = sliders[i];
      const r = sliders[i].r;
      const max = sliders[i].max;
      const min = sliders[i].min;
      const step = sliders[i].step;
      const remainder = (max - min) % step;
      slider.dash = 2*pi*r * (step / (max - min)) - 2;
    }

    // draw sliders, handles & colored paths
    let dash;
    function drawsliders() {
      sliders.forEach(function(slider, index) {
        // draw sliders backgrounds
        ctx.save();
        ctx.lineWidth = 20;
        ctx.setLineDash([slider.dash, 2]);
        ctx.strokeStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, 1.5*pi, false);
        ctx.stroke();
        ctx.restore();

        // draw paths
        // background path
        ctx.save();
        ctx.lineWidth = 20;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, slider.diff, false);
        ctx.strokeStyle = slider.color;
        ctx.stroke();
        ctx.restore();
        // colored path
        ctx.save();
        ctx.lineWidth = 20;
        ctx.setLineDash([slider.dash, 2]);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, slider.diff, false);
        ctx.strokeStyle = slider.color;
        ctx.stroke();
        ctx.restore();

        // draw handles
        ctx.save();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(250,250,250,1)';
        ctx.beginPath();
        ctx.arc(slider.x, slider.y, r, 0, 2*pi, false);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#c7c7c7';
        ctx.stroke();
        ctx.restore();

        // draw data
        ctx.save();
        ctx.fillStyle = "#111";
        ctx.fillText('$' + slider.value, dataPosition.x, dataPosition.y + index*fontSize*0.9);
        ctx.restore();
      });
    }
    // draw sliders with default positions
    drawsliders();

    // round angle to nearest step
    function roundAngle(angle, max, min, step) {
      let parts, diff, wholeSteps, remainder, remainderD, stepD;
      console.log(angle)
      // convert diff to range from zero to 2PI clockwise starting from top position
      diff = (angle > -pi && angle < -pi/2) ? angle + 2.5*pi : angle + pi/2;
      // number of whole steps from min to max
      wholeSteps = (max - min) % step;
      // remainder when dividing whole range (min to max) by step
      remainder = (max - min) % step;
      // remainder in radians
      remainderD = (remainder / (max - min)) * 2*pi;
      console.log('remainderD:' + remainderD);
      // step in radians
      stepD = (step / (max-min)) * 2*pi;
      console.log('stepD:' + stepD);
      // round diff to nearest step
      diff = Math.round(diff / stepD) * stepD;
      console.log('round diff:' + diff);
      // convert diff back to original format (starting at right position)
      diff = (diff > pi && diff < 1.5*pi) ? diff - 2.5*pi : diff - pi/2;
      console.log('converted diff:' + diff);
      // correction for max value to show (full circle):
      // if there is a remainder between last full step and max,
      // show full circle on last half of the remainder.
      if (remainderD && angle <= -0.5*pi && angle > -0.5*pi - remainderD/2) {
        diff = 1.5*pi;  // full circle
      }
      console.log('max corr diff:' + diff);
      console.log('');
      // return rounded and max-correcter diff
      return diff;
    }

    // calculate user value from radians
    function getValue(angle, max, min, step) {
      let value, valueRound, remainder;
      // calculate exact value (correction of factor 1.013 is needed)
      if (angle + pi/2 < 0) {
        value = ((angle + pi*2.5) * (max-min) / 20*pi) * 1.013 + min;
      } else {
        value = ((angle + pi/2) * (max-min) / 20*pi) * 1.013 + min;
      }
      // round value to nearest step
      valueRound = (Math.round((value-min) / step) * step) + min;
      // remainder when dividing whole range (min to max) by step
      remainder = (max - min) % step;
      // correction for max value to show:
      // if there is a remainder between last full step and max,
      // show max value if mouse is on last half of the remainder.
      if (remainder && value <= max && value > max - remainder/2) {
        console.log('case1')
        value = max;
      }
      else {
        value = valueRound;
      }
      // return rounded and max-correcter value
      return value;
    }

    // iterate through sliders. if mouse was on the slider when clicked, edit its
    // properties (distance of path, handle position) and redraw sliders.
    function redrawsliders(z) {
      let mouseX, mouseY, x, y, z1, xh, yh, diff, diffRound, value;
      // iterate sliders
      sliders.forEach(function(slider) {
        // check if z is equal to slider radius +/- 10 px
        if (z < slider.r + 10 && z > slider.r - 10) {
          // get mouse coordinates inside canvas
          mouseX = event.clientX - canvas.getBoundingClientRect().left;
          mouseY = event.clientY - canvas.getBoundingClientRect().top;
          // get x & y distance from slider center to mouse
          x = mouseX - center.x;
          y = mouseY - center.y;
          // get distance from slider center to mouse
          z1 = (x**2 + y**2)**0.5;
          // get handle coordinates
          xh = slider.r/z1 * x + center.x;
          yh = slider.r/z1 * y + center.y;
          // calculate angle between top position and handle
          diff = Math.atan2(yh - center.y, xh - center.x);
          // round angle to nearest step (snapping effect) and save it
          diffRound = roundAngle(diff, slider.max, slider.min, slider.step);
          // set new slider angle
          slider.diff = diffRound;
          // adjust handle position to rounded angle and save it to slider object
          slider.x = Math.cos(diffRound) * slider.r + center.x;
          slider.y = Math.sin(diffRound) * slider.r + center.y;
          // get rounded value and save it to slider object
          slider.value = getValue(diff, slider.max, slider.min, slider.step);

          // redraw sliders with new positions
          ctx.clearRect(0, 0, cw, ch);
          drawsliders(z);
        }
      });
    }

    // mousedown function
    let z; // declare z
    function onMouseDown() {
      let mouseX, mouseY, x, y;
      // get mouse coordinates inside canvas
      mouseX = event.clientX - canvas.getBoundingClientRect().left;
      mouseY = event.clientY - canvas.getBoundingClientRect().top;
      // x & y distance from slider center to mouse
      x = mouseX - center.x;
      y = mouseY - center.y;
      // absolute distance from slider center to mouse
      z = (x**2 + y**2)**0.5;
      // pass mousedown coordinates to redrawsliders()
      redrawsliders(z);
      // start listening to mousemove
      ctx.canvas.addEventListener('mousemove', onMouseMove);
    }

    // mousemove function
    function onMouseMove() {
      // redraw sliders on mousemove
      redrawsliders(z);
    }

    // mouseup function
    function onMouseUp() {
      // stop listening to mousemove
      ctx.canvas.removeEventListener('mousemove', onMouseMove);
    }

    // listen to mouse down
    ctx.canvas.addEventListener('mousedown', onMouseDown);
    // listen to mouse up
    ctx.canvas.addEventListener('mouseup', onMouseUp);



    // Add touch screen support
    document.addEventListener("touchstart", touch2Mouse, true);
    document.addEventListener("touchmove", touch2Mouse, true);
    document.addEventListener("touchend", touch2Mouse, true);
    function touch2Mouse(e) {
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
  }
};

// enter options
const options = {
  container: 'container',
  sliders: [
    {radius: 40, color: 'red', max: 10, min: 0, step: 2},
    {radius: 70, color: '#f3771c', max: 100, min: 50, step: 5},
    {radius: 100, color: '#009b19', max: 100, min: 0, step: 2},
    {radius: 130, color: '#0080bb', max: 860, min: 152, step: 2},
    {radius: 160, color: '#6a427c', max: 10, min: 1, step: 4}
  ]
};

// initialize slider object with options object
const slider = new Slider(options);






//
