var option = {
  chart : {
    height: 200,
    type: 'line'
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
        text: 'Temperature (°C)'
    }
  },
  tooltip: {
    shared: true,
    valueSuffix: '°C'
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
      showInLegend: true
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    borderWidth: 0,
  },
  series: [{
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
  }]
};
var option2 = {
  chart : {
      height: 200,
      type: 'spline'
  },
  title: {
      text: ''
  },
  xAxis: {
      type: 'datetime',
      labels: {
          overflow: 'justify'
      }
  },
  yAxis: {
    title: {
        text: 'Wind speed (m/s)'
    }
  },
  tooltip: {
      shared: true,
      valueSuffix: ' m/s'
  },
  plotOptions: {
    spline: {
      lineWidth: 4,
      states: {
          hover: {
              lineWidth: 5
          }
      },
      marker: {
          enabled: false
      },
      pointInterval: 3600000, // one hour
      pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    borderWidth: 0,
  }
};


$(document).on('ready page:load', function() {
  var selectRadioHandler = {};
  // 
  selectRadioHandler['site'] = function(){
    var data = [{
            name: 'Level 1',
            data: [13, 5.9, 3.5, 1.5, 34.2, 5.5, 23.2, 23.5, 22.3, 8.3, 15.9, 9.6]
        }, {
            name: 'Level 2',
            data: [5.2, 6.8, 8.7, 91.3, 7.0, 22.0, 24.8, 45.1, 23.1, 43.1, 81.6, 32.5]
        }, {
            name: 'Level 3',
            data: [3.9, 4.6, 12.5, 24.4, 23.5, 31.0, 22.6, 33.9, 11.3, 3.0, 4.9, 5.0]
        }, {
            name: 'Level 4',
            data: [5.9, 2.2, 4.7, 4.5, 15.9, 5.2, 4.0, 2.6, 42.2, 33.3, 63.6, 24.8]
        }, {
            name: 'Level 5',
            data: [3.9, 2.2, 5.7, 7.5, 18.9, 32.2, 4.0, 16.6, 7.2, 8.3, 4.6, 3.8]
        }, {
            name: 'Level 6',
            data: [3.9, 4.2, 345.7, 4.5, 1.9, 22.2, 45.0, 46.6, 5.2, 8.3, 4.6, 3.8]
        }];
    $('[data-selectbox-title]').text('Site: ');
    makeCheckBox(6);
    drawChart(data);
  };

  selectRadioHandler['depth'] = function(){
    var data = [{
            name: 'Level 1',
            data: [13, 5.9, 3.5, 1.5, 34.2, 5.5, 23.2, 23.5, 22.3, 8.3, 15.9, 9.6]
        }, {
            name: 'Level 2',
            data: [5.2, 6.8, 8.7, 91.3, 7.0, 22.0, 24.8, 45.1, 23.1, 43.1, 81.6, 32.5]
        }, {
            name: 'Level 3',
            data: [3.9, 4.6, 12.5, 24.4, 23.5, 31.0, 22.6, 33.9, 11.3, 3.0, 4.9, 5.0]
        }, {
            name: 'Level 4',
            data: [5.9, 2.2, 4.7, 4.5, 15.9, 5.2, 4.0, 2.6, 42.2, 33.3, 63.6, 24.8]
        }, {
            name: 'Level 5',
            data: [3.9, 2.2, 5.7, 7.5, 18.9, 32.2, 4.0, 16.6, 7.2, 8.3, 4.6, 3.8]
        }];

    $('[data-selectbox-title]').text('Depth: ');
    makeCheckBox(5);
    drawChart(data);
  };

  function drawChart(data){
    option.series = data;
    $('#graph1').highcharts(option);
  }

  function makeCheckBox(number){
    var template, i,
        dataCheckboxGroup = $('[data-checkbox-group]');

    dataCheckboxGroup.html('');
    for(i = 0 ; i < number ; i++){
      template = '<label class="checkbox-inline"><input type="checkbox" data-event-check="' + i + '" checked><span>' + (i + 1) + '</span></label>'
      dataCheckboxGroup.append(template);
    }
  }


  $('[data-checkbox-group]').on('change', '[data-event-check]', function(){
    console.log('change')
    var target = $(this);
        isChecked = target.is(':checked'),
        level = target.attr('data-event-check'), 
        chart = $('#graph1').highcharts();
    if(isChecked) {
        chart.series[level].show();
    } else {
        chart.series[level].hide();
    }
  });

  $('[data-event-radio]').on('change', function(){
    var selectedValue = $(this).val();
    selectRadioHandler[selectedValue]();
  });
  $('#map').hide();
});






$(function () {
  $('#graph1').highcharts(option)

var data = [{
    name: 'Level 1',
    data: [13, 5.9, 3.5, 1.5, 34.2, 5.5, 23.2, 23.5, 22.3, 8.3, 15.9, 9.6]
}, {
    name: 'Level 2',
    data: [5.2, 6.8, 8.7, 91.3, 7.0, 22.0, 24.8, 45.1, 23.1, 43.1, 81.6, 32.5]
}, {
    name: 'Level 3',
    data: [3.9, 4.6, 12.5, 24.4, 23.5, 31.0, 22.6, 33.9, 11.3, 3.0, 4.9, 5.0]
}, {
    name: 'Level 4',
    data: [5.9, 2.2, 4.7, 4.5, 15.9, 5.2, 4.0, 2.6, 42.2, 33.3, 63.6, 24.8]
}, {
    name: 'Level 5',
    data: [3.9, 2.2, 5.7, 7.5, 18.9, 32.2, 4.0, 16.6, 7.2, 8.3, 4.6, 3.8]
}];
option2.series = data;        
$('#graph2').highcharts(option2);
});