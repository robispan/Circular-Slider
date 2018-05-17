
class Slider {
  constructor(options) {
      this._options = options;
      this.ctx;
      this.sliders = [];
      // create canvas and objects
      this.createCanvas();
      this.createSliders();
      this.drawObjects();

      // listen to resize
      window.addEventListener('resize', this.onResize.bind(this));
  }

  // onresize function
  onResize() {
    canvas.parentNode.removeChild(canvas);
    this.createCanvas();
    this.editSliderOnResize();
    this.drawObjects();
  }

  // create canvas and append it to DOM container defined in options parameter
  createCanvas() {
    const container = document.getElementById(this._options.container);
    let contW = container.getBoundingClientRect().width;
    let contH = container.getBoundingClientRect().height;
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    // canvas sizing
    if (contH / contW < 0.65) {
      canvas.height = contH * .95;
      canvas.width = canvas.height / 0.65;
    }
    else {
      canvas.width = contW * .95;
      canvas.height = canvas.width * 0.65;
    }
    // styles
    canvas.style.position = 'relative';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.border = '1px dashed grey';
    canvas.style.touchAction = 'none';
    // create canvas in DOM
    container.appendChild(canvas);
    // get ctx
    this.ctx = canvas.getContext('2d');
  }  // createCanvas() end

  createSliders() {
    // global variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    // sliders center position
    const center = {x: cw*0.67, y: ch*0.46};
    const sliders = this.sliders;

    // make array of sliders
    for (let i = 0; i < options.sliders.length; i++) {
      sliders.push({
        r: options.sliders[i].radius * cw * 0.05,
        color: options.sliders[i].color,
        max: options.sliders[i].max,
        min: options.sliders[i].min,
        value: options.sliders[i].min,
        step: options.sliders[i].step,
        // default position of handles
        diff: -0.5*pi,
        x: center.x,
        y: center.y - options.sliders[i].radius * cw * 0.05
      });
    }

    // add dashes to sliders
    for (let i = 0; i < options.sliders.length; i++) {
      const slider = sliders[i];
      const r = sliders[i].r;
      const max = sliders[i].max;
      const min = sliders[i].min;
      const step = sliders[i].step;
      const remainder = (max - min) % step;
      slider.dash = 2*pi*r * (step / (max - min)) - 1;
    }
  }

  // edit sliders' radius on resize
  editSliderOnResize() {
    let r, slider;
    const cw = this.ctx.canvas.width;
    const ch = this.ctx.canvas.height;
    // sliders center position
    const center = {x: cw*0.67, y: ch*0.46};
    for (let i = 0; i < options.sliders.length; i++) {
      slider = this.sliders[i];
      r = options.sliders[i].radius * cw * 0.05;
      // edit radius
      slider.r = r;
      // edit dash
      slider.dash = 2*Math.PI*r * (slider.step / (slider.max - slider.min)) - 1;
      // edit handle coordinates
      slider.x = Math.cos(slider.diff) * r + center.x;
      slider.y = Math.sin(slider.diff) * r + center.y;
    };
  }

  // draw sliders, handles & data fields, move sliders on input
  drawObjects() {

    // global variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    const r = cw * 0.017;  // handle radius
    // sliders center position
    const center = {x: cw*0.67, y: ch*0.46};
    // data position
    const dataPosition = {x: cw*0.02, y: ch*0.33};
    const sliders = this.sliders;

    // draw sliders, data and instructions
    let dash, fontSize, instruction;
    function drawsliders() {
      // draw instructions under slider
      ctx.save();
      fontSize = cw * 0.03;
      instruction = 'ADJUST DIAL TO ENTER EXPENSES';
      ctx.font = '900 italic ' + fontSize + 'px Calibri';
      ctx.fillStyle = "#111";
      ctx.textAlign = 'center';
      ctx.fillText(instruction, center.x, ch * 0.97);
      ctx.restore();

      // draw sliders
      sliders.forEach(function(slider, index) {
        // draw sliders backgrounds (full grey circles)
        ctx.save();
        ctx.lineWidth = cw * 0.03;
        ctx.setLineDash([slider.dash, 1]);
        ctx.strokeStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, 1.5*pi, false);
        ctx.stroke();
        ctx.restore();

        // draw colored paths
        ctx.save();
        ctx.lineWidth = cw * 0.03;
        ctx.setLineDash([slider.dash, 1]);
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
        fontSize = cw * 0.07;
        ctx.font = 'bold ' + fontSize + 'px Calibri';
        ctx.fillStyle = "#111";
        ctx.textAlign = 'left';
        ctx.fillText('$' + slider.value, dataPosition.x, dataPosition.y + index* cw * 0.07);
        ctx.restore();
        // menu
        ctx.save();
        fontSize = cw * 0.03;
        ctx.font = '400 ' + fontSize + 'px Calibri';
        ctx.fillStyle = "#111";
        ctx.textAlign = 'left';
        ctx.fillText('Food', dataPosition.x * 10, dataPosition.y + index* cw * 0.07);
        ctx.restore();
      });
    }  // drawsliders() end

    // draw default sliders on load
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
    function redrawsliders(z, event) {
      let mouseX, mouseY, x, y, z1, xh, yh, diff, diffRound, value;
      // iterate sliders
      sliders.forEach(function(slider) {
        // check if z is equal to slider radius +15/-12 px
        if (z < slider.r + slider.r*0.15 && z > slider.r - slider.r*0.12) {
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
    function onMouseDown(event) {
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
      redrawsliders(z, event);
      // start listening to mousemove
      ctx.canvas.addEventListener('mousemove', onMouseMove);
    }

    // mousemove function
    function onMouseMove(event) {
      // redraw sliders on mousemove
      redrawsliders(z, event);
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


  }  // drawObjects() end

}; // Slider class end

// enter options
const options = {
  container: 'container',
  sliders: [
    {radius: 1, color: 'red', max: 100, min: 0, step: 2},
    {radius: 2, color: '#f3771c', max: 100, min: 0, step: 2},
    {radius: 3, color: '#009b19', max: 100, min: 0, step: 2},
    {radius: 4, color: '#0080bb', max: 860, min: 152, step: 2},
    {radius: 5, color: '#6a427c', max: 100, min: 0, step: 2}
  ]
};

// initialize slider object with options object
const slider = new Slider(options);






//
