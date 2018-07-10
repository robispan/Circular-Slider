# Circular-Slider (job application task)

## Usage

- link javascript file (js/main.js) in your html

- edit 'options' object at the end of main.js to configure Slider options (container ID & options for each individual slider: category, radius, color, max, min, step):
```javascript
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
```

- initialize Slider:
```javascript
const slider = new Slider(options);
```

## Specification

- when creating new instance of the slider, pass in the options object
- multiple sliders can be rendered in the same container
- each slider should have his own max/min limit and step value
- value number should change in real time based on the slider’s position
- make sure touch events on one slider don’t affect others (even if finger goes out of touched slider range)
- slider value should change when you drag the handle or if you tap the spot on a slider
- the solution should work on mobile devices
- without the use of any external JS libraries

Options

- container
- color
- max/min value
- step
- radius


