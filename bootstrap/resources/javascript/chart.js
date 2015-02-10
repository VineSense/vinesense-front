
// -------------------------- chart 정보 --------------------------
var charts = [];
    
charts[0] = {
  target: $('#chart-1'),
  object: null,
  option: {
    chart : {
      height: 200,
      type: 'line'
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
    },
    scrollbar : {
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
  for(var i = 0 ; i <= 10 ; i++) {
    item = [Date.UTC(1971, 12, i + 1), Math.random()];
    data[i] = item;
  }
  return data;
}

charts[0].option.series = [{
  name: 'Level 1',
  data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
}, {
  name: 'Level 2',
  data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
}, {
  name: 'Level 3',
  data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
}, {
  name: 'Level 4',
  data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
}, {
  name: 'Level 5',
  data: [3.9, 2.2, 5.7, 7.5, 18.9, 32.2, 4.0, 16.6, 7.2, 8.3, 4.6, 3.8]
}];

// -------------------------- chart 초기 그리기 --------------------------
$(function () {

  charts[0].target.highcharts('StockChart', charts[0].option);
  charts[0].object = charts[0].target.highcharts();

  
  charts[1].target.highcharts('StockChart', charts[1].option);
  charts[1].object = charts[1].target.highcharts();

  //chart.xAxis[0].setExtremes(Date.UTC(1971, 12, 1), Date.UTC(1971, 12, 2));
});
