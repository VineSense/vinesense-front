
// -------------------------- chart 정보 --------------------------
var charts = [];
    
charts[0] = {
  target: $('#chart-1'),
  object: null,
  option: {
    chart : {
      height: 200,
      type: 'spline'
    },
    // 차트의 제목 관리 
    title : {
      text : null
    },
    // 차트의 x축 관리 
    xAxis: {
      events:{
        setExtremes: function(e){}
      }
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      },
      opposite: false
    },
    tooltip: {
      shared: true,
      valueSuffix: '°C'
    },
    rangeSelector : { 
      enabled : false
    },
    plotOptions: {
      line: {
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
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 1,
      enabled: true
    },
    // 차트의 navigator 관리 
    navigator : {
        enabled : false
    }
  }
};

charts[1] = {
  target: $('#chart-2'),
  object: null,
  option: {
    // 차트의 전반적인 내용 관리 
    chart : {
      height: 200,
      zoomType: 'x',
      type: 'spline'
    },
    // 차트의 제목 관리 
    title : {
      text : null
    },
    // 차트의 x축 관리 
    xAxis: {
      // type: 'datetime',
      tickPixelInterval: 150,
      dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
      },
      title: {
          text: 'Date'
      },
      events:{
        setExtremes: function(e){
          console.log( "min : " + Highcharts.dateFormat(null, e.min));
          console.log( "max : " + Highcharts.dateFormat(null, e.max));
        }
      }
    },
    // 차트의 y축 관리 
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      },
      opposite: false
    },
    // 차트의 y축 관리 
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 1,
      enabled: true
    },
    // 차트의 범위 선택 관리 
    rangeSelector : { 
      enabled : false
    },
    // 차트의 구성 관리 
    plotOptions: {
      spline: {
        marker: {
          enabled: false
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2
          }
        }
      }
    },
    // 차트의 navigator 관리 
    navigator : {
        enabled : false
    },
    tooltip: {
      valueDecimals: 2
    },
    // 차트의 data 관리 
    series : [{
      name : '2014',
      data : makeData()
    },{
      name : '2013',
      data : makeData()
    },{
      type: 'flags',
      showInLegend: false, 
      // name: 'Flags on axis',
      data: [{
          x: Date.UTC(1970, 3, 1),
          title: '씨뿌리는기간'
      }, {
          x: Date.UTC(1970, 6, 1),
          title: '꽃피는기간'
      }, {
          x: Date.UTC(1970, 9, 1),
          title: '추수기간'
      }],
      shape: 'squarepin'
    }]
    // series : data
  }
}

// -------------------------- chart-1 관련 메소드 --------------------------
$(document).on('ready page:load', function() {
  var selectViewHandler = {},
      selectTypeHandler = {};
      
  selectViewHandler['site'] = function(){
    var chart = charts[0],
        option = chart.option,
        title = $('[data-selectbox-title]');
    makeCheckBox(6);
    title.text('Site: ');

    //데이터 받는 곳 (수정요망)
    option.series = [{
      name : 'Level 1',
      data : makeData()
    },{
      name : 'Level 2',
      data : makeData()
    },{
      name : 'Level 3',
      data : makeData()
    },{
      name : 'Level 4',
      data : makeData()
    },{
      name : 'Level 5',
      data : makeData()
    }];
    drawChart(chart, option);
  };

  selectViewHandler['depth'] = function(){
    var chart = charts[0],
        option = chart.option,
        title = $('[data-selectbox-title]');
    makeCheckBox(5);
    title.text('Depth: ');
    option.series = [{
      name : 'Level 1',
      data : makeData()
    },{
      name : 'Level 2',
      data : makeData()
    },{
      name : 'Level 3',
      data : makeData()
    },{
      name : 'Level 4',
      data : makeData()
    },{
      name : 'Level 5',
      data : makeData()
    } ];
    drawChart(chart, option);
  };

  selectTypeHandler['temperature'] = function() {
    var chart = charts[0],
        option = chart.option,
        yAxis = {
          title: {
            text: 'Temperature (°C)'
          },
          opposite: false
        };
    option.series = [{
      name : 'Level 1',
      data : makeData()
    },{
      name : 'Level 2',
      data : makeData()
    },{
      name : 'Level 3',
      data : makeData()
    },{
      name : 'Level 4',
      data : makeData()
    },{
      name : 'Level 5',
      data : makeData()
    } ];
    option.yAxis = yAxis;
    drawChart(chart, option);
  };

  selectTypeHandler['moisture'] = function() {  
    var chart = charts[0],
        option = chart.option,
        yAxis = {
          title: {
            text: 'Moisture'
          },
          opposite: false
        };
    option.series = [{
      name : 'Level 1',
      data : makeData()
    },{
      name : 'Level 2',
      data : makeData()
    },{
      name : 'Level 3',
      data : makeData()
    },{
      name : 'Level 4',
      data : makeData()
    },{
      name : 'Level 5',
      data : makeData()
    } ];
    option.yAxis = yAxis;
    drawChart(chart, option);
  };

  function drawChart(chart, option){
    chart.target.highcharts('StockChart', option);
    chart.object = chart.target.highcharts();
  }

  $('[data-event-change-view-option]').on('change', function(){
    var selectedValue = $(this).val();
    selectViewHandler[selectedValue]();
  });

  $('[data-event-change-view-day]').on('change', function(){
    var selectedValue = $(this).val();
    selectViewRange(selectedValue);
  });

  $('[data-event-change-type]').on('change', function(){
    var selectedValue = $(this).val();
    selectTypeHandler[selectedValue]();
  });

  $('[data-checkbox-group]').on('change', '[data-event-check]', function(){
    var target = $(this);
        isChecked = target.is(':checked'),
        level = target.attr('data-event-check'), 
        chartObject = charts[0].object;

    console.dir(chartObject);
    if(isChecked) {
        chartObject.series[level].show();
    } else {
        chartObject.series[level].hide();
    }
  });  

  // 수정요망 (핸들바스 사용)
  function makeCheckBox(number){
    var template = '',
        i,
        dataCheckboxGroup = $('[data-checkbox-group]');
    dataCheckboxGroup.html('');
    for(i = 0 ; i < number ; i++){
      template += '<label class="checkbox-inline"><input type="checkbox" data-event-check="' + i + '" checked><span>' + (i + 1) + '</span></label>'
    }
    dataCheckboxGroup.append(template);
  }

// -------------------------- date-picker 관련 메소드 --------------------------
    $('#reportrange2 span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange2').daterangepicker({
        opens: 'center'
    });
});

// -------------------------- 나중에 지울 것  --------------------------

function makeData(){
  var data = [],
      item;
  for(var i = 0 ; i < 365 ; i++) {
    item = [Date.UTC(1970, 0, i + 1), Math.random()];
    data[i] = item;
  }
  return data;
}

charts[0].option.series = [{
  name: 'Level 1',
  data : makeData()
}, {
  name: 'Level 2',
  data : makeData()
}, {
  name: 'Level 3',
  data : makeData()
}, {
  name: 'Level 4',
  data : makeData()
}, {
  name: 'Level 5',
  data : makeData()
}];

// -------------------------- chart 초기 그리기 --------------------------
$(function () {
  charts[0].target.highcharts('StockChart', charts[0].option);
  charts[0].object = charts[0].target.highcharts();
  
  var standardData = charts[1].option.series[0].data,
      compareData = charts[1].option.series[1].data;
 
  charts[1].option.xAxis.plotBands = getPlotBandsGapTemperature(standardData, compareData, true);

  charts[1].target.highcharts('StockChart', charts[1].option);
  charts[1].object = charts[1].target.highcharts();

});

function selectViewRange(day) {
  charts[0].object.xAxis[0].setExtremes(Date.UTC(1970, 0, 366 - day), Date.UTC(1970, 0, 365));
}


// 온도차이에 구간 구하는 함수 
function getPlotBandsGapTemperature(standardData, compareData, optionLow) {
  var plotBands = [],
      i,
      length = standardData.length,
      isBiging = false,
      j = 0;

  optionLow = optionLow || false;

  for(i = 0 ; i < length ; i++) {
    if(!isBiging && ((standardData[i][1] >= compareData[i][1]) ^ optionLow)) {
      isBiging = true;
      plotBands[j] = {
        from: calCrossing(standardData, compareData, i),
        color: optionLow ? 'rgba(0, 0, 255, .6)' : 'rgba(255, 0, 0, .6)'
      };
    } else if(isBiging && ((standardData[i][1] <= compareData[i][1]) ^ optionLow)) {
      isBiging = false;
      plotBands[j].to = calCrossing(standardData, compareData, i);
      j++;
    }
  }
  return plotBands;
}

// 데이터로부터 점가져오는 함수 
function getPointFromData(standardData, compareData, index) {
  var points = [];
  points[0] = {
    x: standardData[index-1][0],
    y: standardData[index-1][1]  
  };

  points[1] = {
    x: standardData[index][0],
    y: standardData[index][1]  
  };

  points[2] = {
    x: compareData[index-1][0],
    y: compareData[index-1][1]
  };
  
  points[3] = {
    x: compareData[index][0],
    y: compareData[index][1]
  };
  return points;
}

// 온도차이에 교차하는 점 구하는 함수 
function calCrossing(standardData, compareData, index) {
  if(index == 0) {
    return standardData[0][0];
  } else {
    var points = getPointFromData(standardData, compareData, index);
    return ((points[0].x * points[1].y - points[0].y * points[1].x) * (points[2].x - points[3].x) - (points[0].x - points[1].x) * (points[2].x * points[3].y - points[2].y * points[3].x)) / ((points[0].x - points[1].x) * (points[2].y - points[3].y) - (points[0].y - points[1].y) * (points[2].x - points[3].x));    
  }
}
