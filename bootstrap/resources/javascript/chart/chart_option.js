var charts = [];

var serverInformation = {
  host: 'http://vines.cloudapp.net/Nickel',
  minDate: '2014-05-24',
  siteNumber: 7,
  depthNumber: 5,
};

function createDefaultChart() {
  return {
    target: null,
    object: null,
    method: {
      selectViewRange: function(chart, min, max) {
        chart.object.xAxis[0].setExtremes(min, max);
        chart.object.showResetZoom();
      }
    },
    option: {
      chart : {
        height: 200,
        zoomType: null,
        type: 'spline',
        resetZoomButton: {
          position: {
            align: 'right', // by default
            verticalAlign: 'top', // by default
            x: 0,
            y: 130
          }
        }
      },
      title : {
        text : null
      },
      xAxis: {
        title: {
            text: null
        },
        labels: null,
        events:{
          setExtremes: function(e){}
        }
      },
      yAxis: {
        title: {
          text: null
        },
        opposite: false
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 1,
        enabled: true
      },
      rangeSelector: { 
        enabled : false
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
          events: {
            legendItemClick: function () {
              return false; 
            }
          },
          states: {
            hover: {
              lineWidth: 2
            }
          },
          lineWidth: 2,
          showInLegend: true
        }
      },
      navigator: {
        enabled: false
      },
      tooltip: {
        valueDecimals: 2,
        shared: true,
        valueSuffix: null
      },
      exporting: { 
        enabled: false 
      },
      series: []
    }
  };
}

function createChartInformation(target, option) {
  var chartInformation = createDefaultChart();
  chartInformation.target = target;
  chartInformation.option = mergeChartOption(chartInformation.option, option);
  return chartInformation;
}

function mergeChartOption(option1, option2) {
  for(var property in option2) {
    if((option1[property] != null)
      && (typeof option1[property] === 'object') 
      && (option1.hasOwnProperty(property))
      && (!$.isArray(option1[property]))) {
      option1[property] = mergeChartOption(option1[property], option2[property]);
    }
    else {
      option1[property] = option2[property];
    }
  }
  return option1;
}