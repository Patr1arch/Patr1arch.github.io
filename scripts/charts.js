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
function solve_and_draw(){
  var chart_type = 1; // 1 or 2

  let max_val_X = 0,
      max_val_Y = 0;

  // TODO: get them form screen
  let a = parseFloat(document.getElementById("alpha").value), 
      b = parseFloat(document.getElementById("beta").value),//0.14,
      c = parseFloat(document.getElementById("gamma").value),//0.79,
      d = parseFloat(document.getElementById("delta").value),//0.17,
      x0 = parseInt(document.getElementById("startPrey").value),//10,
      y0 = parseInt(document.getElementById("startPred").value)//5;

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
    document.getElementById("chart_2").hidden = true;
    document.getElementById("chart_1").hidden = false;
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
    document.getElementById("chart_1").hidden = true;
    document.getElementById("chart_2").hidden = false;
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
}

solve_and_draw();