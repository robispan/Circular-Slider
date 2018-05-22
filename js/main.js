
// +++++++++++++++++++++++++++++++++++ CLASS START +++++++++++++++++++++++++++++++++++


class Slider {


  // +++++++++++++++++++++++++++++++++++ CONSTRUCTOR +++++++++++++++++++++++++++++++++++


  constructor(options) {
      this._options = options;
      this.ctx;  // declare canvas context
      this.sliders = [];  // declare sliders array
      this.dpi;  // declare devicePixelRatio
      this.slidersCenter;  // declare sliders center position
      this.dataPosition;  // declare data position
      this.instructionsY;  // declare instructions y coordinate
      this.scale;  // declare scaling factor for drawing object on resize

      // make sliders
      this.createCanvas();
      this.makeSliders();
      this.drawObjects();

      // listen to resize event
      window.addEventListener('resize', this.onResize.bind(this));
  }


  // +++++++++++++++++++++++++++++++++++ WINDOW RESIZE +++++++++++++++++++++++++++++++++++


  // recreate canvas and edit sliders
  onResize() {
    canvas.parentNode.removeChild(canvas);
    this.createCanvas();
    this.editSlidersOnResize();
    this.drawObjects();
  }


  // +++++++++++++++++++++++++++++++++++ CREATE CANVAS +++++++++++++++++++++++++++++++++++


  createCanvas() {

    // ----------------- CREATE CANVAS ELEMENT -----------------

    // get DOM container
    const container = document.getElementById(this._options.container);
    // get container dimensions
    let contW = container.getBoundingClientRect().width;
    let contH = container.getBoundingClientRect().height;
    // get pixel ratio
    this.dpi = window.devicePixelRatio;
    // create canvas element in DOM
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';

    // ----------------- DEFINE CANVAS SIZE -----------------

    // canvas height/width in css pixels
    let h, w;
    if (contH / contW < 0.65) {
      h = Math.round(contH * .95);
      w = Math.round(h / 0.65);
    }
    else if (contH / contW >= 0.65 && contH / contW < 1) {
      w = Math.round(contW * .95);
      h = Math.round(w * 0.65);
    }
    else if (contH / contW >= 1 && contW / contH > 0.65) {
      h = Math.round(contH * .95);
      w = Math.round(h * 0.65);
    }
    else {
      w = Math.round(contW * .95);
      h = Math.round(w / 0.65);
    }
    // set canvas height/width in actual pixels
    canvas.width = w * this.dpi;
    canvas.height = h * this.dpi;
    // set canvas css height/width if needed
    if (this.dpi !== 1) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    // ----------------- SET POSITION OF ELEMENTS AND SCALING FACTOR -----------------

    if (w >= h) {
      this.scale = w * this.dpi;
      this.slidersCenter = {x: w*this.dpi*0.67, y: h*this.dpi*0.46};
      this.dataPosition = {x: w*this.dpi*0.02, y: h*this.dpi*0.25};
      this.instructionsY = h * this.dpi * 0.97;
    }
    else {
      this.scale = h * this.dpi;
      this.slidersCenter = {x: w*this.dpi*0.5, y: h*this.dpi*0.35};
      this.dataPosition = {x: w*this.dpi*0.23, y: h*this.dpi*0.7};
      this.instructionsY = h * this.dpi * 0.04;
    }

    // ----------------- DEFINE STYLES -----------------

    canvas.style.position = 'relative';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    // canvas.style.border = '1px dashed grey';
    canvas.style.touchAction = 'none';

    // ----------------- APPEND CANVAS TO CONTAINER -----------------

    // create canvas in DOM
    container.appendChild(canvas);
    // get 2d context
    this.ctx = canvas.getContext('2d');
  }  // createCanvas --- END


  // +++++++++++++++++++++++++++++++++++ MAKE SLIDERS ARRAY +++++++++++++++++++++++++++++++++++


  makeSliders() {
    // define variables
    const options = this._options;
    const ctx = this.ctx;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const scale = this.scale;
    const pi = Math.PI;
    // define sliders center position
    const center = this.slidersCenter;
    // get sliders array
    const sliders = this.sliders;

    // fill sliders array
    for (let i = 0; i < options.sliders.length; i++) {
      sliders.push({
        category: options.sliders[i].category,
        r: options.sliders[i].radius * scale / 450,
        color: options.sliders[i].color,
        max: options.sliders[i].max,
        min: options.sliders[i].min,
        value: options.sliders[i].min,
        step: options.sliders[i].step,
        diff: -0.5*pi,
        // default position of handles
        x: center.x,
        y: center.y - options.sliders[i].radius * scale / 450
      });
    }
    // add dashes (step angle in radians) to sliders
    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i];
      const r = slider.r;
      const max = slider.max;
      const min = slider.min;
      const step = slider.step;
      const remainder = (max - min) % step;
      slider.dash = 2*pi*r * (step / (max - min)) - scale*0.003;
    }
  }  // makeSliders --- END


  // +++++++++++++++++++++++++++++++++++ EDIT SLIDERS PROPERTIES ON RESIZE +++++++++++++++++++++++++++++++++++


  editSlidersOnResize() {
    let slider;
    // get canvas scale
    const scale = this.scale;
    // get sliders' center position
    const center = this.slidersCenter;
    // edit sliders' properties
    for (let i = 0; i < options.sliders.length; i++) {
      slider = this.sliders[i];
      slider.r = options.sliders[i].radius * scale / 450;
      slider.dash = 2*Math.PI*slider.r * (slider.step / (slider.max - slider.min)) - scale*0.003;
      slider.x = Math.cos(slider.diff) * slider.r + center.x;
      slider.y = Math.sin(slider.diff) * slider.r + center.y;
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
    const scale = this.scale;
    const dpi = this.dpi;  // devicePixelRatio
    const sliders = this.sliders;  // sliders array
    const pi = Math.PI;
    const r = scale * 0.019;  // handle radius
    const fontColor = '#333';
    const lineWidth = scale * 0.032;  // sliders' path width
    // sliders center position
    const center = this.slidersCenter;
    // data position
    const dataPosition = this.dataPosition;
    // instructions y coordinate
    const instructionsY = this.instructionsY;


    // ----------------- DRAW OBJECTS -----------------

    let dash, fontSize, instruction, color1, color2, gradient;
    function drawsliders() {

      // draw background
      ctx.save();
      color1 = '#efeff0';
      color2 = '#cacbcd';
      gradient = ctx.createLinearGradient(cw/2, ch, cw/2, 0);
      gradient.addColorStop(0, color2);
      gradient.addColorStop(1, color1);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();

      // draw instructions
      ctx.save();
      fontSize = scale * 0.02;
      instruction = 'ADJUST DIAL TO ENTER EXPENSES';
      ctx.font = '900 italic ' + fontSize + 'px Arial';
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.fillText(instruction, center.x, instructionsY);
      ctx.restore();

      // draw sliders and data
      sliders.forEach(function(slider, index) {
        // draw sliders backgrounds (full grey circles)
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([slider.dash, cw*0.003]);
        color1 = '#d7d7d7';
        color2 = lightenDarkenColor(color1, -1);
        gradient = ctx.createLinearGradient(0, center.y-slider.r, 0, center.y+slider.r);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, 1.5*pi, false);
        ctx.stroke();
        ctx.restore();
        // draw colored paths - background
        ctx.save();
        color2 = lightenDarkenColor(slider.color, 0.5);
        color1 = lightenDarkenColor(color2, 1);
        gradient = ctx.createLinearGradient(0, center.y-slider.r, 0, center.y+slider.r);
        gradient.addColorStop(0, color2);
        gradient.addColorStop(1, color1);
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, slider.diff, false);
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.restore();
        // draw colored paths - foreground
        ctx.save();
        color2 = slider.color;
        color1 = lightenDarkenColor(slider.color, 1);
        gradient = ctx.createLinearGradient(0, center.y-slider.r, 0, center.y+slider.r);
        gradient.addColorStop(0, color2);
        gradient.addColorStop(1, color1);
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([slider.dash, cw*0.003]);
        ctx.beginPath();
        ctx.arc(center.x, center.y, slider.r, -.5*pi, slider.diff, false);
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.restore();
        // draw handles
        ctx.save();
        color1 = '#ffffff';
        color2 = lightenDarkenColor(color1, -1);
        gradient = ctx.createLinearGradient(slider.x, slider.y + r, slider.x, slider.y - r);
        gradient.addColorStop(0, color2);
        gradient.addColorStop(1, color1);
        ctx.setLineDash([]);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(slider.x, slider.y, r, 0, 2*pi, false);
        ctx.fill();
        ctx.lineWidth = scale*0.002;
        ctx.strokeStyle = '#c2c6c9';
        ctx.stroke();
        ctx.restore();
        // draw data
        ctx.save();
        fontSize = scale * 0.06;
        ctx.font = 'bold ' + fontSize + 'px Arial';
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'left';
        ctx.fillText('$' + slider.value, dataPosition.x, dataPosition.y + index*scale*0.06);
        ctx.restore();
        // draw data: menu
        ctx.save();
        fontSize = scale * 0.02;
        ctx.font = '400 ' + fontSize + 'px Arial';
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'left';
        ctx.fillText(slider.category, dataPosition.x + 0.2*scale, dataPosition.y + index*scale*0.06);
        ctx.restore();
        // draw data: colored rectangles
        ctx.save();
        ctx.fillStyle = slider.color;
        ctx.fillRect(dataPosition.x + 0.16*scale, dataPosition.y + index*scale*0.06 - scale*0.014, scale*0.025, scale*0.015);
        ctx.restore();
      });
    }  // drawsliders --- END
    // draw sliders with default properties on load
    drawsliders();


    // ----------------- HELPER FUNCTIONS -----------------

    // darken/lighten color (allowed formats: 'rgb(x,x,x)', '#xxxxxx')
    // enter amt (0 to 10: lighten, 0 to -10: darken)
    function lightenDarkenColor(col,amt) {
      let cols, change, changeMax, r, g, b, max;
      // check format and get r, g, b values
      if (col.length > 7) {
        // format: 'rgb(x,x,x)'
        cols = col.match(/\d+/g).map(Number);
        r = Number(cols[0]);
        g = Number(cols[1]);
        b = Number(cols[2]);
      }
      else {
        // format: '#xxxxxx'
        r = col.substr(1,2);
        g = col.substr(3,2);
        b = col.substr(5,2);
        cols = [r, g, b];
        // to decimal
        cols = cols.map(function(col) { return parseInt(col,16); });
      }
      // lighten/darken color
      max = Math.max(...cols);
      change = amt * 25.5;
      changeMax = max + change;
      change = changeMax - max;
      cols = cols.map(function(col) {
        col = Math.round(col + change * (col / max));
        // correct col if not in 0-255 range
        return (col > 255) ? 255 : (col < 0) ? 0 : col;
      });
      // return color in 'rgb(x,x,x)' format
      return `rgb(${cols[0]}, ${cols[1]}, ${cols[2]})`;
    }

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


    // ----------------- ANIMATE OBJECTS -----------------

    // edit slider's properties and redraw sliders
    function moveSlider(slider, event) {
      let mouseX, mouseY, x, y, z, xh, yh, diff, diffRound;
      // get mouse coordinates inside canvas
      mouseX = event.clientX - canvas.getBoundingClientRect().left;
      mouseY = event.clientY - canvas.getBoundingClientRect().top;
      // get x & y distance from slider center to mouse
      // multiply by device pixel ratio to get canvas pixels
      x = mouseX * dpi - center.x;
      y = mouseY * dpi - center.y;
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
      x = mouseX * dpi - center.x;
      y = mouseY * dpi - center.y;
      // absolute distance from slider center to mouse
      z = ((x**2 + y**2)**0.5);

      // check if user clicked on one of the sliders
      sliders.forEach(function(slider) {
        if (z < slider.r + scale*0.022 && z > slider.r - scale*0.022) {
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
    function onTouchStart(event) {
      event.preventDefault();
      let mouseX, mouseY, x, y, z;
      // variable used to break out of forEach loop
      let brk = false;
      // get mouse coordinates inside canvas
      mouseX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
      mouseY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
      // x & y distance from slider center to mouse
      x = mouseX * dpi - center.x;
      y = mouseY * dpi - center.y;
      // absolute distance from slider center to mouse
      z = ((x**2 + y**2)**0.5);

      // check if user clicked on one of the sliders
      sliders.forEach(function(slider) {
        if (!brk && z < slider.r + scale*0.025 && z > slider.r - scale*0.025) {
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
      event.preventDefault();
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
      event.preventDefault();
      // stop listening to mousemove
      ctx.canvas.removeEventListener('touchmove', onTouchMove);
    }

    // listen to touch down
    ctx.canvas.addEventListener('touchstart', onTouchStart);
    // listen to mouse down
    ctx.canvas.addEventListener('mousedown', onMouseDown);
    // listen to touch end
    ctx.canvas.addEventListener('touchend', onTouchUp);
    // listen to mouse up
    ctx.canvas.addEventListener('mouseup', onMouseUp);


  }  // drawObjects --- END

}; // Slider class --- END


// ++++++++++++++++++++++++++++++++++++++++ INSTANTIATE SLIDER CLASS ++++++++++++++++++++++++++++++++++++++++


// options
const options = {
  container: 'container',
  sliders: [
    {category: 'Transportation', radius: 35, color: '#fc4346', max: 200, min: 50, step: 4},
    {category: 'Food', radius: 55, color: '#f37a1d', max: 200, min: 40, step: 3},
    {category: 'Insurance', radius: 75, color: '#009915', max: 250, min: 30, step: 3},
    {category: 'Entertainment', radius: 95, color: '#0078b4', max: 300, min: 20, step: 3},
    {category: 'Health care', radius: 115, color: '#603d72', max: 350, min: 0, step: 3}
  ]
};

// initialize slider with options object
const slider = new Slider(options);


//
