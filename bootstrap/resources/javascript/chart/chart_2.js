
// createChart-2
var chart2 = createChartInformation($('#chart-2'),{
  chart: {
    zoomType: 'x'
  },
  xAxis: {
    title: {
      text: 'Date'
    },
    labels: {
      formatter: function () {
          return Highcharts.dateFormat('%d/%m', this.value);
      }
    },
    events:{
      setExtremes: function(e){
        chart2.information.xAxis.min = e.min;
        chart2.information.xAxis.max = e.max;
      }
    }
  },
  yAxis: {
    title: {
      text: 'Temperature (°C)'  
    }
  } 
});

chart2.information = {
  xAxis: {
    min: null,
    max: null  
  }  
};

chart2.method.compareTemperatureChangeHandler = function(){
  var selectedValue = $(this).val(),
      standardData = chart2.option.series[0].data,
      compareData = chart2.option.series[1].data;
  compareTemperatureHandler[selectedValue](standardData, compareData);
  chart2.method.drawChart();
};

chart2.method.drawChart = function(){
  var series = chart2.option.series,
      xAxis = chart2.information.xAxis;
  chart2.target.highcharts('StockChart', chart2.option);
  chart2.object = chart2.target.highcharts();
  chart2.option.series = series;

  chart2.method.selectViewRange(chart2, xAxis.min, xAxis.max);
}


var compareTemperatureHandler = {
  high: function(standardData, compareData) {
    chart2.option.xAxis.plotBands = getPlotBandsGapTemperature(standardData, compareData, false);
  },
  low: function(standardData, compareData) {  
    chart2.option.xAxis.plotBands = getPlotBandsGapTemperature(standardData, compareData, true);
  }
};

charts[1] = chart2;