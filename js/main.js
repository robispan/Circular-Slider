
class Slider {
  constructor(options) {
      this._options = options;
      // get canvas from HTML
      this.ctx = document.getElementById(this._options.containerId).getContext('2d');
      // set canvas scale
      this.ctx.canvas.width = this._options.width;
      this.ctx.canvas.height = this._options.height;
      // call method to draw empty sliders
      this.drawSliders();
  }

  // draw empty sliders defined in options parameter
  drawSliders() {
    let r;
    const pi = Math.PI;
    const cw = this.ctx.canvas.width;
    const ch = this.ctx.canvas.height;
    this.ctx.lineWidth = 15;
    this.ctx.strokeStyle = '#eee';
    for (let i = 0; i < this._options.sliders.length; i++) {
      // define radius
      r = this._options.sliders[i].radius;
      // draw empty slider
      this.ctx.beginPath();
      this.ctx.arc(cw*2/3, ch/2, r, 0, 2*pi, false);
      this.ctx.stroke();
    }
  }
};

// enter options
const options = {
  containerId: 'canvas',
  width: 600,
  height: 400,
  sliders: [
    {radius: 80},
    {radius: 150},
    {radius: 120},
    {radius: 30}]
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
