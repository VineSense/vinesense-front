
// createChart-2
var chart2 = createChartInformation($('#chart-2'),{
  chart: {
    zoomType: 'x'
  },
  xAxis: {
    title: {
      text: 'Date'
    },
    events:{
      setExtremes: function(e){
        chart2.information.xAxis.min = e.min;
        chart2.information.xAxis.max = e.max;
        showWeatherCompareInfomation[chart2.information.section.checked]();
      }
    }
  },
  yAxis: [{ // Primary yAxis
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
    gridLineWidth: 0,
    title: {
      text: 'Rainfall',
      style: {
        color: Highcharts.getOptions().colors[0]
      }
    },
    labels: {
      format: '{value} (F)',
      style: {
        color: Highcharts.getOptions().colors[0]
      }
    }
  }],
  tooltip: {
    useHTML: true,
    xDateFormat: '%m/%d/%Y',
    headerFormat: '',
    shared: true
  }, 
});

chart2.information = {
  defaultYear: 2012,
  section: {
    checked: 'high',
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

  compareTemperatureHandler[selectedValue]();

  chart2.method.drawChart();
};

chart2.method.drawChart = function(){
  var option = {};

  $.extend(option, chart2.option);
  chart2.target.highcharts('StockChart', option);
  chart2.object = chart2.target.highcharts();

  chart2.method.selectViewRange(chart2, chart2.information.xAxis.min, chart2.information.xAxis.max);
  showWeatherCompareInfomation[chart2.information.section.checked]();
};

chart2.method.chartSectionChangeHandler = function(){
  var selectedValue = $(this).attr('data-event-change-chart-section'),
      flags = chart2.information.xAxis.flags,
      min, max;
  console.log(selectedValue);
  console.dir(flags);
  switch(selectedValue) {
  case 'all':
      min = Date.UTC(2012, 0, 1);
      max = Date.UTC(2012, 12, 31);
    break;
  case 'budBreak':
      min = Date.UTC(2012, 0, 1)
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
  showWeatherCompareInfomation[chart2.information.section.checked]();
};

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
  high: function() {
    chart2.option.xAxis.plotBands = chart2.information.section.high.plotBands;
    chart2.information.section.checked = 'high';
  },
  low: function() {  
    chart2.option.xAxis.plotBands = chart2.information.section.low.plotBands;
    chart2.information.section.checked = 'low';
  }
};

var showWeatherCompareInfomation = {
  handler: function (data) {
    var min = chart2.information.xAxis.min || Date.UTC(2012, 0, 1),
        max = chart2.information.xAxis.max || Date.UTC(2012, 12, 31);

    var sectionTemplate = '';

    var totalDay = 0;
    for(var i = 0, length = data.length ; i < length ; i++) {
      
      if(data[i].endDate < min) {
        continue;
      } else if(data[i].startDate > max) {
        break;
      }
      
      var unit = '°C';
      var average = "average";
      sectionTemplate += 
        '<li>' 
       + moment(data[i].startDate).format("MM/DD") + ' ~ ' + moment(data[i].endDate).format("MM/DD")
       + ' : ' + leadingSpaces((data[i].standardAverageTemperature - data[i].compareAverageTemperature).toFixed(2), 6) 
       + unit 
       + ' (' + average +' : ' + leadingSpaces(data[i].standardAverageTemperature.toFixed(2), 2) + unit + ')'
       + ' # days : '
       + leadingSpaces(data[i].days, 3)
       +'</li>';

       totalDay += data[i].days;
    }
    sectionTemplate = '<li><b>Total # of days : </b>' + totalDay + '</li>' + sectionTemplate;
    $('[data-weather-compare-infomation]').html(sectionTemplate); 
    
  },
  high: function() {
    showWeatherCompareInfomation.handler(chart2.information.section.high.data);
  },
  low: function() {
    showWeatherCompareInfomation.handler(chart2.information.section.low.data);
  }
}

function leadingSpaces(n, digits) {
  var space = '';
  n = n.toString();
  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      space += '&nbsp;';
  }
  return space + n;
}


charts[1] = chart2;