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


  let a = parseFloat(document.getElementById("alpha").value), 
  b = parseFloat(document.getElementById("beta").value),//0.14,
  c = parseFloat(document.getElementById("gamma").value),//0.79,
  d = parseFloat(document.getElementById("delta").value),//0.17,
  x0 = parseInt(document.getElementById("startPrey").value),//10,
  y0 = parseInt(document.getElementById("startPred").value)//5;

        
  //stationary position of the system
  let st_pos = [
    a / b,
    c / d
  ];

  let t = 0,
    n = 0,
    step = 0;

  if (chart_type == 1) {
    n = 2000;
    step = 0.06;
  } else {
    n = 5000;
    step = 0.04;
  }

  let data_chart_1 = [],
      data_chart_2 = [];
      
  function calculate_data() {
    for (let i = 0; i < n; i++) {

      if (x0 < 0 || y0 < 0) {
        var n_ = n - i;
        for (; i < Math.min(55, n_); i++) {
          data_chart_1.push([t, 0, 0, st_pos[0], st_pos[1]]);
          data_chart_2.push([0, 0]);
          t += step;
        }
        break;
      } else {
        data_chart_1.push([t, x0, y0, st_pos[0], st_pos[1]]);
        data_chart_2.push([x0, y0]);
      }

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
      document.getElementById("chart"),
      data_chart_1,
      {
        valueRange: [-(Math.max(max_val_X, max_val_Y) + 20)/20, Math.max(max_val_X, max_val_Y) + 20],  // for Y axis
        labels: [ "x", "prey", "predator", "stationary_pos_prey", "stationary_pos_predator" ],
        axes: {
          x: {
            pixelsPerLabel: 30
          }
        },
        legend: "always",
        labelsDiv: document.getElementById('legend-div'),
        labelsSeparateLines: true,
        labelsKMB: true,
        colors: ["rgb(51,204,204)",
                  "rgb(255,100,100)",
                  "#00DD55",
                  "rgba(50,50,200,0.4)"]
      }
    );
  } else {
    chart_2 = new Dygraph(
      document.getElementById("chart"),
      data_chart_2,
      {
        dateWindow: [-(max_val_X + 10)/20, max_val_X + 10],  // for X axis
        valueRange: [-(max_val_X + 10)/20, max_val_Y + 10],  // for Y axis
        labels: [ "x", "predators-prey relationship" ],
        axes: {
          x: {
            pixelsPerLabel: 30
          }
        },
        legend: "always",
        labelsDiv: document.getElementById('legend-div'),
        labelsSeparateLines: true,
        labelsKMB: true,
        colors: ["rgb(51,204,204)",
                  "rgb(255,100,100)",
                  "#00DD55",
                  "rgba(50,50,200,0.4)"]
      }
    );
  }
}

solve_and_draw();

function submit_data(){
  document.getElementById("prey_alpha").textContent = document.getElementById("alpha").value;
  document.getElementById("prey_beta").textContent = document.getElementById("beta").value;
  document.getElementById("pred_gamma").textContent = document.getElementById("gamma").value;
  document.getElementById("pred_delta").textContent = document.getElementById("delta").value;
  document.getElementById("prey_init").textContent = document.getElementById("startPrey").value;
  document.getElementById("pred_init").textContent = document.getElementById("startPred").value;

  solve_and_draw();
}