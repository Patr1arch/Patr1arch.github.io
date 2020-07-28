/*
    x = Prey
    y = Predator 

    chart_1 = with time
    chart_2 = without time

    a = Prey birthrate
    b = Prey mortality rate
    c = Predator mortality rate
    d = Predator birthrate

    x0 = Initial Prey
    y0 = Initial Predators
*/

var chart_type = 1; // 1 or 2

let max_val_X = 0,
    max_val_Y = 0;

// TODO: get them form screen
let a = 0.42, 
    b = 0.14,
    c = 0.79,
    d = 0.17,
    x0 = 10,
    y0 = 5;

let t = 0,
  n = 0,
  step = 0;

if (chart_type == 1) {
  n = 1000;
  step = 0.1;
} else {
  n = 5000;
  step = 0.04;
}

let data_chart_1 = [],
    data_chart_2 = [];
function calculate_data() {
  for (let i = 0; i < n; i++) {
    if (x0 < 0 || y0 < 0)
      break;

    data_chart_1.push([t, x0, y0]);
    data_chart_2.push([x0, y0]);

    let x = x0 + step * (a*x0 - b*x0*y0),
        y = y0 + step * (-c*y0 + d*x0*y0);
    t += step;

    x0 = x;
    y0 = y;
    max_val_X = Math.max(max_val_X, x0);
    max_val_Y = Math.max(max_val_Y, y0);    
  }
}

calculate_data();

if (chart_type == 1) {
  chart_1 = new Dygraph(
    document.getElementById("chart_1"),
    data_chart_1,
    {
      valueRange: [0, Math.max(max_val_X, max_val_Y) + 20],  // for Y axis
      labels: [ "x", "prey", "predator" ],
      axes: {
      	x: {
  				pixelsPerLabel: 30
        }
      }
    }
  );
} else {
  chart_2 = new Dygraph(
    document.getElementById("chart_2"),
    data_chart_2,
    {
    	dateWindow: [0, max_val_X + 10],  // for X axis
      valueRange: [0, max_val_Y + 10],  // for Y axis
      labels: [ "x", "relationship" ],
      axes: {
      	x: {
  				pixelsPerLabel: 30
        }
      }
    }
  );
}