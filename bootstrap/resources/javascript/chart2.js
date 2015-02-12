
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
      ignoreHiddenSeries: false,
      height: 200,
      zoomType: 'x',
      type: 'line'
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

  $('[data-event-change-view]').on('change', function(){
    var selectedValue = $(this).val();
    selectViewHandler[selectedValue]();
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

  charts[1].target
  charts[1].target

  var standardData = charts[1].option.series[0].data;
  var compareData = charts[1].option.series[1].data;
  var isBiging = false;
  var plotBands = [],
      j = 0;

  var startPoint1 = {
      x: null,
      y: null
    }, startPoint2 = {
      x: null,
      y: null
    };
  var endPoint1 = {
      x: null,
      y: null
    }, endPoint2 = {
      x: null,
      y: null
    };


  
  var crossingArea;
  for(var i = 1 ; i < 365 ; i++) {
    if(!isBiging && standardData[i][1] >= compareData[i][1]) {
      crossingArea = {
        type: 'arearange',
        // showInLegend: false,
        showTooltip: false,
        // color: 'rgba(68, 170, 213, .2)',
        color: 'red',
        data: []
      };

      isBiging = true;
      startPoint1.x = standardData[i-1][0];
      startPoint1.y = standardData[i-1][1];

      startPoint2.x = compareData[i-1][0];
      startPoint2.y = compareData[i-1][1];

      endPoint1.x = standardData[i][0];
      endPoint1.y = standardData[i][1];

      endPoint2.x = compareData[i][0];
      endPoint2.y = compareData[i][1];

      var crossingPoint;

      crossingPoint = calCrossing(startPoint1, endPoint1, startPoint2, endPoint2);

      console.log(crossingPoint.x);
      var item = [];
      item[0] = crossingPoint.x;
      item[1] = crossingPoint.y;
      item[2] = crossingPoint.y;
      crossingArea.data.push(item);

      var item = [];
      item[0] = standardData[i][0];
      item[1] = compareData[i][1];
      item[2] = standardData[i][1];
      crossingArea.data.push(item);

      plotBands[j] = {
        from: crossingPoint.x, //- (standardData[i][0] - standardData[i - 1][0]) / 2,
        color: 'red'
      };
    } else if(isBiging && standardData[i][1] <= compareData[i][1]) {
      isBiging = false;

      startPoint1.x = standardData[i-1][0];
      startPoint1.y = standardData[i-1][1];

      startPoint2.x = compareData[i-1][0];
      startPoint2.y = compareData[i-1][1];

      endPoint1.x = standardData[i][0];
      endPoint1.y = standardData[i][1];

      endPoint2.x = compareData[i][0];
      endPoint2.y = compareData[i][1];

      var crossingPoint;

      crossingPoint = calCrossing(startPoint1, endPoint1, startPoint2, endPoint2);

      var item = [];
      item[0] = crossingPoint.x;
      item[1] = crossingPoint.y;
      item[2] = crossingPoint.y;
      crossingArea.data.push(item);
      // return ;
      
      // Shallow copy
      var newObject = jQuery.extend({}, crossingArea);

      charts[1].option.series.push(newObject);

    } else if(isBiging) {
      var item = [];
      item[0] = standardData[i][0];
      item[1] = compareData[i][1];
      item[2] = standardData[i][1];
      console.dir(item);
      crossingArea.data.push(item);
    }
  }

  charts[1].target.highcharts('StockChart', charts[1].option);
  charts[1].object = charts[1].target.highcharts();

  today = Date.UTC(1970, 0, 365);

  charts[0].object.xAxis[0].setExtremes(Date.UTC(1970, 0, 354), today);
});


function calCrossing(point1, point2, point3, point4) {
  var resultPoint = {
    x: null,
    y: null
  };

  resultPoint.x = ((point1.x * point2.y - point1.y * point2.x) * (point3.x - point4.x) - (point1.x - point2.x) * (point3.x * point4.y - point3.y * point4.x)) / ((point1.x - point2.x) * (point3.y - point4.y) - (point1.y - point2.y) * (point3.x - point4.x));
  resultPoint.y = ((point1.x * point2.y - point1.y * point2.x) * (point3.y - point4.y) - (point1.y - point2.y) * (point3.x * point4.y - point3.y * point4.x)) / ((point1.x - point2.x) * (point3.y - point4.y) - (point1.y - point2.y) * (point3.x - point4.x));

  console.log("x : " + resultPoint.x);
  return resultPoint;
}
