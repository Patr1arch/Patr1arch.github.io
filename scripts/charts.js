function legendFormatter(data) {
  if (data.x == null) {
    // This happens when there's no selection and {legend: 'always'} is set.
    return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML }).join('<br>');
  }

  var html = this.getLabels()[0] + ': ' + data.xHTML;
  data.series.forEach(function(series) {
    if (!series.isVisible) return;
    var labeledData = series.labelHTML + ': ' + series.yHTML;
    if (series.isHighlighted) {
      labeledData = '<b>' + labeledData + '</b>';
    }
    html += '<br>' + series.dashHTML + ' ' + labeledData;
  });
  return html;
}

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

var GL_a = NaN,
GL_b = NaN,
GL_c = NaN,
GL_d = NaN,
GL_x = NaN,
GL_y = NaN;

function solve_and_draw(data){
  var chart_type = parseInt(data["ch_t"]); // 1 or 2

  let max_val_X = 0,
      max_val_Y = 0;


  let a = parseFloat(data["a"]), 
  b = parseFloat(data["b"]),//0.14,
  c = parseFloat(data["c"]),//0.79,
  d = parseFloat(data["d"]),//0.17,
  x0 = parseInt(data["x"]),//10,
  y0 = parseInt(data["y"])//5;

        
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
        valueRange: [-(Math.max(max_val_X, max_val_Y) + 20)/20, Math.max(max_val_X, max_val_Y) + 5],  // for Y axis
        labels: [ "x", "prey", "predator", "stationary_pos_prey", "stationary_pos_predator" ],
        axes: {
          x: {
            pixelsPerLabel: 30
          }
        },
        xlabel: 'time',
        ylabel: 'prey & predators',
        labelsDiv: document.getElementById('legend-div'),
        labelsSeparateLines: true,
        labelsKMB: true,
        hideOverlayOnMouseOut: false,
        colors: ["rgb(51,204,204)",
                  "rgb(255,100,100)",
                  "#00DD55",
                  "rgba(50,50,200,0.4)"],
        //highlightSeriesOpts: { strokeWidth: 2 },
        legend: 'always',
        legendFormatter: legendFormatter
      }
    );
  } else {
    chart_2 = new Dygraph(
      document.getElementById("chart"),
      data_chart_2,
      {
        dateWindow: [-(max_val_X + 10)/20, max_val_X + 5],  // for X axis
        valueRange: [-(max_val_X + 10)/20, max_val_Y + 5],  // for Y axis
        labels: [ "x", "relationship" ],
        axes: {
          x: {
            pixelsPerLabel: 30
          }
        },
        xlabel: 'prey',
        ylabel: 'predators',
        labelsDiv: document.getElementById('legend-div'),
        labelsSeparateLines: true,
        labelsKMB: true,
        hideOverlayOnMouseOut: false,  //
        colors: ["rgb(51,204,204)",
                  "rgb(255,100,100)",
                  "#00DD55",
                  "rgba(50,50,200,0.4)"],
        //highlightSeriesOpts: { strokeWidth: 2 },
        legend: 'always',
        legendFormatter: legendFormatter,

        zoomCallback: function(minDate, maxDate, yRange) {
          if (minDate >= maxDate)
            chart_2.updateOptions({dateWindow: [-(max_val_X + 10)/20, max_val_X + 5],
              valueRange: [-(max_val_X + 10)/20, max_val_Y + 5]});
        }
      }
    );
  }
}

solve_and_draw({"a" : "NaN", "b" : "NaN", "c" : "NaN", "d" : "NaN", "x" : "NaN", "y" : "NaN", "ch_t" : "1"});

function submit_data(){
  var data = [document.getElementById("alpha").value, document.getElementById("beta").value, document.getElementById("gamma").value,
  document.getElementById("delta").value, document.getElementById("startPrey").value, document.getElementById("startPred").value];

  document.getElementById("prey_alpha").textContent = data[0];
  document.getElementById("prey_beta").textContent = data[1];
  document.getElementById("pred_gamma").textContent = data[2];
  document.getElementById("pred_delta").textContent = data[3];
  document.getElementById("prey_init").textContent = data[4];
  document.getElementById("pred_init").textContent = data[5];

  GL_a = data[0];
  GL_b = data[1];
  GL_c = data[2];
  GL_d = data[3];
  GL_x = data[4];
  GL_y = data[5];

  // document.getElementById("prey_alpha").textContent = document.getElementById("alpha").value;
  // document.getElementById("prey_beta").textContent = document.getElementById("beta").value;
  // document.getElementById("pred_gamma").textContent = document.getElementById("gamma").value;
  // document.getElementById("pred_delta").textContent = document.getElementById("delta").value;
  // document.getElementById("prey_init").textContent = document.getElementById("startPrey").value;
  // document.getElementById("pred_init").textContent = document.getElementById("startPred").value;

  solve_and_draw({"a" : data[0], "b" : data[1], "c" : data[2], "d" : data[3], "x" : data[4], "y" : data[5], "ch_t" : "1"});
}

function change_chart(type) {
  var data = {"a" : GL_a, "b" : GL_b, "c" : GL_c, "d" : GL_d, "x" : GL_x, "y" : GL_y, "ch_t" : type};
  solve_and_draw(data);
}