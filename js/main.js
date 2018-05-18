
// +++++++++++++++++++++++++++++++++++ CLASS START +++++++++++++++++++++++++++++++++++

class Slider {


  // +++++++++++++++++++++++++++++++++++ CONSTRUCTOR METHOD +++++++++++++++++++++++++++++++++++


  constructor(options) {
      this._options = options;
      this.ctx;  // declare canvas context
      this.sliders = [];  // declare sliders array
      this.ratio;  // declare devicePixelRatio

      // run methods to draw canvas and sliders
      this.createCanvas();
      this.createSliders();
      this.drawObjects();

      // recreate canvas and edit sliders on resize
      window.addEventListener('resize', this.onResize.bind(this));
  }


  // +++++++++++++++++++++++++++++++++++ WINDOW RESIZE METHOD +++++++++++++++++++++++++++++++++++


  onResize() {
    canvas.parentNode.removeChild(canvas);
    this.createCanvas();
    this.editSliderOnResize();
    this.drawObjects();
  }


  // +++++++++++++++++++++++++++++++++++ CREATE CANVAS +++++++++++++++++++++++++++++++++++


  createCanvas() {
    const container = document.getElementById(this._options.container);
    let contW = container.getBoundingClientRect().width;
    let contH = container.getBoundingClientRect().height;
    this.ratio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';

    // canvas sizing
    var h, w;  // css pixels height/width
    if (contH / contW < 0.55) {
      h = Math.round(contH * .95);
      w = Math.round(h / 0.55);
    }
    else {
      w = Math.round(contW * .95);
      h = Math.round(w * 0.55);
    }

    if (this.ratio !== 1) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    // canvas styles
    canvas.width = w * this.ratio;
    canvas.height = h * this.ratio;
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
  }  // createCanvas - END


  // +++++++++++++++++++++++++++++++++++ MAKE SLIDERS ARRAY +++++++++++++++++++++++++++++++++++


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
        category: options.sliders[i].category,
        r: options.sliders[i].radius * cw * 0.045,
        color: options.sliders[i].color,
        max: options.sliders[i].max,
        min: options.sliders[i].min,
        value: options.sliders[i].min,
        step: options.sliders[i].step,
        // default position of handles
        diff: -0.5*pi,
        x: center.x,
        y: center.y - options.sliders[i].radius * cw * 0.045
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
      slider.dashGap = 1*this.ratio;
      slider.dash = 2*pi*r * (step / (max - min)) - slider.dashGap;
    }
  }  // createSliders - END


  // +++++++++++++++++++++++++++++++++++ EDIT SLIDERS ON RESIZE +++++++++++++++++++++++++++++++++++


  editSliderOnResize() {
    let r, slider;
    const cw = this.ctx.canvas.width;
    const ch = this.ctx.canvas.height;
    // sliders center position
    const center = {x: cw * 0.67, y: ch * 0.46};
    // edit sliders' properties
    for (let i = 0; i < options.sliders.length; i++) {
      slider = this.sliders[i];
      // edit radius
      r = options.sliders[i].radius * cw * 0.045;
      slider.r = r;
      // edit dash
      slider.dashGap = 1*this.ratio;
      slider.dash = 2*Math.PI*r * (slider.step / (slider.max - slider.min)) - slider.dashGap;
      // edit handle coordinates
      slider.x = Math.cos(slider.diff) * r + center.x;
      slider.y = Math.sin(slider.diff) * r + center.y;
    };
  }


  // +++++++++++++++++++++++++++++++++++ DRAW & ANIMATE OBJECTS +++++++++++++++++++++++++++++++++++


  // ----------------- PARENT METHOD WITH GLOBAL VARIABLES -----------------

  drawObjects() {
    // global variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const pi = Math.PI;
    const r = cw * 0.018;  // handle radius
    const ratio = this.ratio;  // devicePixelRatio
    // sliders center position
    const center = {x: cw*0.67, y: ch*0.46};
    // data position
    const dataPosition = {x: cw*0.02, y: ch*0.25};
    const sliders = this.sliders;


    // ----------------- DRAW SLIDERS, DATA & INSTRUCTIONS -----------------

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
        ctx.setLineDash([slider.dash, slider.dashGap]);
        ctx.strokeStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, 1.5*pi, false);
        ctx.stroke();
        ctx.restore();

        // draw colored paths
        ctx.save();
        ctx.lineWidth = cw * 0.03;
        ctx.setLineDash([slider.dash, slider.dashGap]);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, slider.diff, false);
        ctx.strokeStyle = slider.color;
        ctx.stroke();
        ctx.restore();

        // draw handles
        ctx.save();
        ctx.setLineDash([]);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(slider.x, slider.y, r, 0, 2*pi, false);
        ctx.fill();
        ctx.lineWidth = 1*ratio;
        ctx.strokeStyle = '#c7c7c7';
        ctx.stroke();
        ctx.restore();

        // draw data
        ctx.save();
        fontSize = cw * 0.06;
        ctx.font = 'bold ' + fontSize + 'px Calibri';
        ctx.fillStyle = '#111';
        ctx.textAlign = 'left';
        ctx.fillText('$' + slider.value, dataPosition.x, dataPosition.y + index* cw * 0.06);
        ctx.restore();
        // menu
        ctx.save();
        fontSize = cw * 0.025;
        ctx.font = '400 ' + fontSize + 'px Calibri';
        ctx.fillStyle = '#111';
        ctx.textAlign = 'left';
        ctx.fillText(slider.category, dataPosition.x * 11, dataPosition.y + index * cw * 0.06);
        ctx.restore();
        // color rectangles
        ctx.save();
        ctx.fillStyle = slider.color;
        ctx.rect(dataPosition.x * 8.5, dataPosition.y - cw*0.015 + index * cw * 0.06, cw * 0.025, cw * 0.015);
        ctx.fill();
        ctx.restore();
      });
    }  // drawsliders - END

    // draw sliders with default properties on load
    drawsliders();


    // ----------------- HELPER FUNCTIONS -----------------

    // round angle to nearest step
    function roundAngle(angle, max, min, step) {
      let parts, diff, wholeSteps, remainder, remainderD, stepD;
      // convert diff to range from zero to 2PI clockwise starting from top position
      diff = (angle > -pi && angle < -pi/2) ? angle + 2.5*pi : angle + pi/2;
      // number of whole steps from min to max
      wholeSteps = (max - min) % step;
      // remainder when dividing whole range (min to max) by step
      remainder = (max - min) % step;
      // remainder in radians
      remainderD = (remainder / (max - min)) * 2*pi;
      // step in radians
      stepD = (step / (max-min)) * 2*pi;
      // round diff to nearest step
      diff = Math.round(diff / stepD) * stepD;
      // convert diff back to original format (starting at right position)
      diff = (diff > pi && diff < 1.5*pi) ? diff - 2.5*pi : diff - pi/2;
      // correction for max value to show (full circle):
      // if there is a remainder between last full step and max,
      // show full circle on last half of the remainder.
      if (remainderD && angle <= -0.5*pi && angle > -0.5*pi - remainderD/2) {
        diff = 1.5*pi;  // full circle
      }
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
        value = max;
      }
      else {
        value = valueRound;
      }
      // return rounded and max-correcter value
      return value;
    }


    // ----------------- MOVE SLIDERS -----------------

    // edit slider's properties and redraw sliders
    function moveSlider(slider, event) {
      let mouseX, mouseY, x, y, z, xh, yh, diff, diffRound;
      // get mouse coordinates inside canvas
      mouseX = event.clientX - canvas.getBoundingClientRect().left;
      mouseY = event.clientY - canvas.getBoundingClientRect().top;
      // get x & y distance from slider center to mouse
      // multiply by device pixel ratio to get canvas pixels
      x = mouseX * ratio - center.x;
      y = mouseY * ratio - center.y;
      // get distance from slider center to mouse
      z = (x**2 + y**2)**0.5;
      // get handle coordinates
      xh = slider.r/z * x + center.x;
      yh = slider.r/z * y + center.y;
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
      drawsliders();
    }


    // ----------------- EVENT LISTENERS -----------------

    // mousedown function
    let pickedSlider;  // slider that is dragged
    function onMouseDown(event) {
      let mouseX, mouseY, x, y, z;
      // variable used to break out of forEach loop
      let brk = false;
      // get mouse coordinates inside canvas
      mouseX = event.clientX - canvas.getBoundingClientRect().left;
      mouseY = event.clientY - canvas.getBoundingClientRect().top;
      // x & y distance from slider center to mouse
      x = mouseX * ratio - center.x;
      y = mouseY * ratio - center.y;
      // absolute distance from slider center to mouse
      z = ((x**2 + y**2)**0.5);

      // check if user clicked on one of the sliders
      sliders.forEach(function(slider) {
        if (z < slider.r + cw*0.023 && z > slider.r - cw*0.017) {
          // change slider position on click
          pickedSlider = slider;
          moveSlider(slider, event);
          // listen to mousemove
          ctx.canvas.addEventListener('mousemove', onMouseMove);
          // stop the loop
          brk = true;
        }
      });
    }
    // touchdown function
    let touchedSlider;  // slider that is dragged
    function onTouchDown(event) {
      let mouseX, mouseY, x, y, z;
      // variable used to break out of forEach loop
      let brk = false;
      // get mouse coordinates inside canvas
      mouseX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
      mouseY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
      // x & y distance from slider center to mouse
      x = mouseX * ratio - center.x;
      y = mouseY * ratio - center.y;
      // absolute distance from slider center to mouse
      z = ((x**2 + y**2)**0.5);

      // check if user clicked on one of the sliders
      sliders.forEach(function(slider) {
        if (!brk && z < slider.r + cw*0.025 && z > slider.r - cw*0.025) {
          // change slider position on click
          touchedSlider = slider;
          moveSlider(slider, event.touches[0]);
          // listen to touchmove
          ctx.canvas.addEventListener('touchmove', onTouchMove);
          // stop the loop
          brk = true;
        }
      });
    }

    // mousemove function
    function onMouseMove(event) {
      moveSlider(pickedSlider, event);
    }
    // touchmove function
    function onTouchMove(event) {
      var touch = event.touches[0];
      moveSlider(touchedSlider, touch);
    }

    // mouseup function
    function onMouseUp() {
      // stop listening to mousemove
      ctx.canvas.removeEventListener('mousemove', onMouseMove);
    }
    // touchup function
    function onTouchUp() {
      // stop listening to mousemove
      ctx.canvas.removeEventListener('touchmove', onTouchMove);
    }

    // listen to touch down
    ctx.canvas.addEventListener('touchstart', onTouchDown);
    // listen to mouse down
    ctx.canvas.addEventListener('mousedown', onMouseDown);
    // listen to touch end
    ctx.canvas.addEventListener('touchend', onTouchUp);
    // listen to mouse up
    ctx.canvas.addEventListener('mouseup', onMouseUp);


  }  // drawObjects - END

}; // Slider class - END


// ++++++++++++++++++++++++++++++++++++++++ INSTANTIATE SLIDER CLASS ++++++++++++++++++++++++++++++++++++++++


// options
const options = {
  container: 'container',
  sliders: [
    {category: 'Transportation', radius: 1, color: 'red', max: 100, min: 0, step: 2},
    {category: 'Food', radius: 2, color: '#f3771c', max: 100, min: 0, step: 2},
    {category: 'Insurance', radius: 3, color: '#009b19', max: 100, min: 0, step: 2},
    {category: 'Entertainment', radius: 4, color: '#0080bb', max: 860, min: 152, step: 2},
    {category: 'Health care', radius: 5, color: '#6a427c', max: 100, min: 0, step: 2}
  ]
};

// initialize slider with options object
const slider = new Slider(options);


//
