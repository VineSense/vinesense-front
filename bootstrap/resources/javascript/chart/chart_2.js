
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
  defaultYear: 2012,
  section: {
    high: null,
    low: null
  },
  xAxis: {
    min: null,
    max: null,
    flags: {
        budBreak: {
          x: Date.UTC(2012, 3, 1),
          title: 'BudBreak'
      }, 
        flowering: {
          x: Date.UTC(2012, 4, 19),
          title: 'Flowering/fruit set'
      }, 
        veraison: {
          x: Date.UTC(2012, 6, 12),
          title: 'Veraison'
      }, 
        harvest: {
          x: Date.UTC(2012, 8, 20),
          title: 'Harvest'
      }
    }
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
  var option = {};

  $.extend(option, chart2.option);
  chart2.target.highcharts('StockChart', option);
  chart2.object = chart2.target.highcharts();

  chart2.method.selectViewRange(chart2, chart2.information.xAxis.min, chart2.information.xAxis.max);
};

chart2.method.chartSectionChangeHandler = function(){
  var selectedValue = $(this).attr('data-event-change-chart-section'),
      flags = chart2.information.xAxis.flags,
      min, max;
  console.log(selectedValue);
  console.dir(flags);
  switch(selectedValue) {
  case 'all':
      min = null;
      max = null;
    break;
  case 'budBreak':
      min = null
      max = flags.budBreak.x;   
    break;
  case 'flowering':
      min = flags.budBreak.x;
      max = flags.flowering.x;
    break;
  case 'veraison':
      min = flags.flowering.x;
      max = flags.veraison.x;
    break;
  case 'harvest':
      min = flags.veraison.x;
      max = flags.harvest.x;
    break;
  }

  chart2.information.xAxis.min = min;
  chart2.information.xAxis.max = max;
  chart2.method.selectViewRange(chart2, min, max);
};



// Bud Break: April 1
// Flowering/fruit set: May 19
// Veraison:  July 12

// ksa1999 [9:46 AM]
// Harvest: Sep 20

chart2.method.setFlag = function() {
  var flag = {
    type: 'flags',
    showInLegend: false, 
    // name: 'Flags on axis',
    data: [chart2.information.xAxis.flags.budBreak,
           chart2.information.xAxis.flags.flowering,
           chart2.information.xAxis.flags.veraison,
           chart2.information.xAxis.flags.harvest
          ],
    shape: 'squarepin'
  };

  chart2.option.series.push(flag);
}



var compareTemperatureHandler = {
  high: function(standardData, compareData) {
    chart2.option.xAxis.plotBands = chart2.information.section.high.plotBands;

  },
  low: function(standardData, compareData) {  
    chart2.option.xAxis.plotBands = chart2.information.section.low.plotBands;
    // getPlotBandsGapTemperature2(standardData, compareData);
  }
};

charts[1] = chart2;