var bottomChart;
(function() {
  bottomChart = chartGenerator.create($('#bottom-chart'), {
    xAxis: {
      events:{
        setExtremes: function(e){
          var selectedHighLow = bottomChart.information.highLow.selected;

          bottomChart.information.xAxis.min = e.min;
          bottomChart.information.xAxis.max = e.max;

          bottomChart.method.showCompareInfomation[selectedHighLow]();
        }
      }
    },
    tooltip: {
      xDateFormat: '%m/%d'
    },
  });

  bottomChart.option.yAxis[1].title.text = 'Cusum';
  bottomChart.option.yAxis[1].labels.text = '{value} (F)';

  bottomChart.information = {
    highLow: {
      selected: 'high',
      high: null,
      low: null
    },
    networkRequestParameter: {
      targetYear: new Date().getFullYear(),
      compareYear: (new Date().getFullYear()) - 1,
      feature: 'Temperature'
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
        },
        start: {
          x: Date.UTC(2012, 0, 1),
          title: 'Start'
        },
        end: {
          x: Date.UTC(2012, 12, 31),
          title: 'End'
        }
      }
    }  
  };
})();

bottomChart.method.compareTypeChangeHandler = function(){
  var selectedValue = $(this).val(),
      standardData = bottomChart.option.series[0].data,
      compareData = bottomChart.option.series[1].data;

  bottomChart.method.setCompareType[selectedValue]();

  bottomChart.method.drawChart();
};

bottomChart.method.chartSectionChangeHandler = function(){
  var selectedValue = $(this).attr('data-event-change-chart-section'),
      flags = bottomChart.information.xAxis.flags,
      selectedHighLow = bottomChart.information.highLow.selected,
      min, 
      max;

  switch(selectedValue) {
  case 'all':
      min = flags.start.x;   
      max = flags.end.x;   
    break;
  case 'budBreak':
      min = flags.start.x;   
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

  bottomChart.information.xAxis.min = min;
  bottomChart.information.xAxis.max = max;
  bottomChart.method.selectViewRange(bottomChart, min, max);
  bottomChart.method.showCompareInfomation[selectedHighLow]();
};

bottomChart.method.viewFeatureSelectHandler = function() {
  bottomChart.information.networkRequestParameter.feature = $(this).val();

  serverAjaxRequest['weather']();
};

bottomChart.method.compareYearSelectHandler = function() {
  var selectTarget = $(this).attr('select-compare-year');

  if(selectTarget == 'standard') {
    bottomChart.information.networkRequestParameter.targetYear = $(this).val();
  } else {
    bottomChart.information.networkRequestParameter.compareYear = $(this).val();
  }

  serverAjaxRequest['weather']();
};

bottomChart.method.drawChart = function(){
  var option = {},
      selectedHighLow = bottomChart.information.highLow.selected;

  $.extend(option, bottomChart.option);
  bottomChart.target.highcharts('StockChart', option);
  bottomChart.object = bottomChart.target.highcharts();

  bottomChart.method.selectViewRange(bottomChart, bottomChart.information.xAxis.min, bottomChart.information.xAxis.max);
  bottomChart.method.showCompareInfomation[selectedHighLow]();

  console.log('abc');
};

bottomChart.method.setFlag = function() {
  var flags = bottomChart.information.xAxis.flags,
      series = {
        type: 'flags',
        showInLegend: false, 
        data: [flags.budBreak, flags.flowering, flags.veraison, flags.harvest],
        shape: 'squarepin'
      };

  bottomChart.option.series.push(series);
};

bottomChart.method.setCompareType = {
  setChartInfomation: function(sectionInfomation) {
    bottomChart.option.series[0] = {
      name: 'Cusum',
      type: 'column',
      yAxis: 1,
      data: sectionInfomation.points
    };

    bottomChart.option.xAxis.plotBands = sectionInfomation.plotBands;
  },
  high: function() {
    var selectedHighLow = bottomChart.information.highLow.high;

    bottomChart.method.setCompareType.setChartInfomation(selectedHighLow);
    bottomChart.information.highLow.selected = 'high';
  },
  low: function() {  
    var selectedHighLow = bottomChart.information.highLow.low;
  
    bottomChart.method.setCompareType.setChartInfomation(selectedHighLow);
    bottomChart.information.highLow.selected = 'low';
  }
};

bottomChart.method.showCompareInfomation = {
  getCompareInfomationHTML: function (data) {
    var min = bottomChart.information.xAxis.min || bottomChart.information.xAxis.flags.start.x,
        max = bottomChart.information.xAxis.max || bottomChart.information.xAxis.flags.end.x,
        compareInfomationHTML = '',
        totalDay = 0,
        adjustSpaces = bottomChart.method.showCompareInfomation.adjustSpaces;

    for(var i = 0, length = data.length ; i < length ; i++) {
      if(data[i].endDate < min) { continue; } 
      else if(data[i].startDate > max) { break; }
      var unit = '',
          average = ''
          gap = (data[i].standardAverageTemperature - data[i].compareAverageTemperature).toFixed(2);

      compareInfomationHTML += 
        '<li>' 
       + moment(data[i].startDate).format("MM/DD") + ' ~ ' + moment(data[i].endDate).format("MM/DD")
       + ' : ' + adjustSpaces(gap, 6) 
       + unit 
       + ' (' + average +' : ' + adjustSpaces(data[i].standardAverageTemperature.toFixed(2), 2) + unit + ')'
       + ' # days : '
       + adjustSpaces(data[i].days, 3)
       +'</li>';

       totalDay += data[i].days;
    }
    compareInfomationHTML = '<li><b>Total # of days : </b>' + totalDay + '</li>' + compareInfomationHTML;
    return compareInfomationHTML
  },
  adjustSpaces: function(number, digits) {
    var space = '';

    number = number.toString();
    if(number.length < digits){
      for(var i = 0; i < digits - number.length; i++) {
        space += '&nbsp;';
      }
    }

    return space + number;
  },
  high: function() {
    var data = bottomChart.information.highLow.high.data,
        compareInfomationHTML = bottomChart.method.showCompareInfomation.getCompareInfomationHTML(data);

    $('[data-weather-compare-infomation]').html(compareInfomationHTML); 
  },
  low: function() {
    var data = bottomChart.information.highLow.low.data,
        compareInfomationHTML = bottomChart.method.showCompareInfomation.getCompareInfomationHTML(data);

    $('[data-weather-compare-infomation]').html(compareInfomationHTML); 
  }
};

charts[1] = bottomChart;