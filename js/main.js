
class Slider {
  constructor(options) {
    this._scale = options.container;
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.canvas.width = this._scale;
    this.canvas.height = this._scale;
  }
}


// when creating new instance of the slider, pass in the options object

const options = {
  container: 400
}

const slider = new Slider(options);
