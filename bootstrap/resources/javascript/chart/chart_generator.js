var chartGenerator = {
  create: function(target, additionalOption) {
    // create new chart
    var newChart = {
          target: null,
          object: null,
          method: {},
          option: {}
        }, 
        option = {},
        method = {};

    // default option setting
    option.chart = {
      height: 300,
      zoomType: 'x',
      type: 'spline',
      resetZoomButton: {
        position: {
          align: 'right', 
          verticalAlign: 'top',
          x: -10,
          y: 10
        },
        relativeTo: 'chart'
      }
    };
    option.title = {
      text: null
    };
    option.xAxis = {
      title: {
          text: null
      },
      type: 'datetime',
      dateTimeLabelFormats: { 
        day: '%m/%e'
      },
      events:{
        setExtremes: function(e){}
      }
    };
    option.yAxis = [{
      labels: {
        format: '{value}',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      title: {
        text: 'Temp. (F)',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      opposite: false
    }, { 
      title: {
        text: null,
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        format: null,
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      }
    }]
    option.legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 1,
      enabled: true
    };
    option.rangeSelector = { 
      enabled: false
    };
    option.plotOptions = {
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
      },
      column: {
        marker: {
          enabled: false
        },
        showInLegend: false
      },
      series: {
        dataGrouping: {
          enabled: false
        }
      }
    };
    option.navigator = {
      enabled: false
    }
    option.tooltip = {
      // positioner: function(boxWidth, boxHeight, point) {
      //   return {
      //       x: point.plotX + 200,
      //       y: point.plotY - 30
      //   };
      // },

      // positioner: function () {
      //   return { x: 500, y: 0 };
      // },
      useHTML: true,
      valueDecimals: 2,
      shared: true,
      valueSuffix: null,
      headerFormat: '<b>{point.key}</b></br></br>',
      backgroundColor: '#FCFFC5',
      borderColor: 'black',
      borderRadius: 10,
      borderWidth: 2,
      padding: 10
    };
    option.exporting = { 
      enabled: false 
    };
    option.series = [];

    // default method setting
    method.selectViewRange = function(chart, min, max) {
      chart.object.zoomOut();
      chart.object.xAxis[0].setExtremes(min, max);
      chart.object.showResetZoom();
    };

    newChart.target = target;
    newChart.method = method;
    newChart.option = chartGenerator.mergeOption(option, additionalOption);
    return newChart;
  },
  mergeOption: function(option1, option2) {
    for(var property in option2) {
      if((option1[property] != null)
        && (typeof option1[property] === 'object') 
        && (option1.hasOwnProperty(property))
        && (!$.isArray(option1[property]))) {
        option1[property] = chartGenerator.mergeOption(option1[property], option2[property]);
      }
      else {
        option1[property] = option2[property];
      }
    }
    return option1;
  }
};