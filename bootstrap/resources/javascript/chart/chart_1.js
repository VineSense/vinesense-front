
// createChart-1
var chart1 = createChartInformation($('#chart-1'), {
  chart: {
    zoomType: 'x'
  },
  xAxis: {
    title: {
        text: null
    },
    events:{
      setExtremes: function(e){
        chart1.information.xAxis.min = e.min;
        chart1.information.xAxis.max = e.max;
        chart1.object.xAxis[0].setTitle({ text: moment(e.min).get('year') });
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
      format: '{value} inch',
      style: {
        color: Highcharts.getOptions().colors[0]
      }
    }
  }],
  tooltip: {
    useHTML: true,
    xDateFormat: '%m/%d/%Y',
    headerFormat: '<b>{point.key}</b></br></br>',
    shared: true
  },
});

chart1.information = {
  selectedView: 'depth',
  checkboxsChecked: [],
  xAxis: {
    min: null,
    max: null
  },
  networkRequestParameter: {
    sensorType: "temperature",
    begin: serverInformation.minDate,
    end: moment().format("MM/DD/YYYY"),
    interval: 1,
    siteId: 1,
    depth: 1
  }
};

chart1.method.checkboxChangeEventHandler = function() {
  var target = $(this);
      isChecked = target.is(':checked'),
      index = parseInt(target.attr('data-event-check')) + 1;

  if(isChecked) {
    chart1.object.series[index].show();
    chart1.information.checkboxsChecked[index] = true;
  } else {
    chart1.object.series[index].hide();
    chart1.information.checkboxsChecked[index] = false;
  }
}; 

chart1.method.radioChangeEventHandler = function(){
  var selectedValue = ($(this).val() - 0) + 1;
  selectItemHandler[chart1.information.selectedView](selectedValue);
  serverAjaxRequest[chart1.information.selectedView]();
};

chart1.method.viewChangeEventHanler = function(){
  var selectedValue = $(this).val();
  selectViewHandler[selectedValue]();
};

chart1.method.typeChangeEventHandler = function(){
  var selectedValue = $(this).val();
  selectTypeHandler[selectedValue]();
};

chart1.method.viewDayChangeEventHandler = function(){
  var selectedValue,
      extremes,
      max,
      min;
  selectedValue = $(this).val();

  chart1.information.networkRequestParameter.interval = selectedValue;
  
  setXAxisMinMax(selectedValue);
  serverAjaxRequest[chart1.information.selectedView]();
};

chart1.method.hideCheckBoxUnChecked = function() {
  for(var i = 0, length = chart1.information.checkboxsChecked.length ; i < length ; i++) {
    if(!chart1.information.checkboxsChecked[i]) {
      chart1.object.series[i].hide();
    }
  }  
};

chart1.method.drawChart = function(isNotSetAxisMinMax){
  var xAxis;

  var option = {};
  var selectedView = chart1.information.selectedView;

  chart1.option.title.text  = selectedView + ' ';
  chart1.option.title.text += selectedView == 'depth' ? chart1.information.networkRequestParameter.depth : chart1.information.networkRequestParameter.siteId;

  console.dir(chart1.option);
  $.extend(option, chart1.option);

  chart1.target.highcharts('StockChart', option);
  chart1.object = chart1.target.highcharts();
  
  if(!isNotSetAxisMinMax){
    setXAxisMinMax(chart1.information.networkRequestParameter.interval);
  }

  xAxis = chart1.information.xAxis;

  chart1.method.selectViewRange(chart1, xAxis.min, xAxis.max);
  chart1.method.hideCheckBoxUnChecked();
}

chart1.method.onOffPrecipitationEventHandler = function(isNotSetAxisMinMax){
  var selected = $(this).val();

  if(selected == 'on') {
    chart1.object.series[0].show();
    chart1.information.checkboxsChecked[0] = true;
  } else {
    chart1.object.series[0].hide();
    chart1.information.checkboxsChecked[0] = false;
  }
  
};




var selectItemHandler = {
  site: function(selectedValue) {
    chart1.information.networkRequestParameter.siteId = selectedValue;
  },
  depth: function(selectedValue) {
    chart1.information.networkRequestParameter.depth = selectedValue;
  }
};

var selectViewHandler = {
  changeViewType: function(radio, checkbox){
    var checkboxTemplate = '',
        radioTemplate = '';


    radioTemplate += '<th>' + radio.title + '</th>';
    checkboxTemplate += '<th>' + checkbox.title + '</th>';
    
    chart1.information.checkboxsChecked = [];


    for(var i = 0, checkBoxNumber = checkbox.groupNumber ; i < checkBoxNumber ; i++){
      checkboxTemplate += '<td><label class="checkbox-inline"><input type="checkbox" data-event-check="' + i + '" checked>' + (i + 1) + '</label><td>'
      chart1.information.checkboxsChecked[i] = true;
    }

    for(var i = 0, radioNumber = radio.groupNumber ; i < radioNumber ; i++){
      radioTemplate += '<td><label class="radio-inline"><input type="radio" name="inlineRadioOptions" data-event-select-item value="' + i + '">' + (i + 1) + '</label><td>'
    }

    $('#checkbox-group').html(checkboxTemplate);
    $('#radio-group').html(radioTemplate);

    $('[data-event-select-item][value=0]').prop( "checked", true );
  },
  site: function(){
    var radio = {
          title: 'site:',
          groupNumber: serverInformation.siteNumber
        },
        checkbox = {
          title: 'depth:',
          groupNumber: serverInformation.depthNumber
        };
    
    selectViewHandler.changeViewType(radio, checkbox);

    chart1.information.selectedView = "site";
    chart1.information.networkRequestParameter.siteId = 1;
    serverAjaxRequest[chart1.information.selectedView]();
  },
  depth: function(){
    var radio = {
          title: 'depth:',
          groupNumber: serverInformation.depthNumber
        },
        checkbox = {
          title: 'site:',
          groupNumber: serverInformation.siteNumber
        };
    
    selectViewHandler.changeViewType(radio, checkbox);
    
    chart1.information.selectedView = "depth";
    chart1.information.networkRequestParameter.depth = 1;
    serverAjaxRequest[chart1.information.selectedView]();
  }
};

var selectTypeHandler = {
  handler: function(title) {
    chart1.option.yAxis[0].title.text = title;
  },
  temperature: function() {
    selectTypeHandler.handler('Tem (F)');
    chart1.information.networkRequestParameter.sensorType = "temperature";
    serverAjaxRequest[chart1.information.selectedView]();
  },
  moisture: function() {  
    selectTypeHandler.handler('Moisture (m3/m3)');
    chart1.information.networkRequestParameter.sensorType = "moisture";
    serverAjaxRequest[chart1.information.selectedView]();
  }
};

function setXAxisMinMax(selectedValue) {
  extremes = chart1.object.xAxis[0].getExtremes();
  max = extremes.max;
  min = max - (3600 * 24 * 1000 * 11 * selectedValue);
  min = extremes.min < min ? min : extremes.min;

  chart1.information.xAxis.min = min;
  chart1.information.xAxis.max = max;
}


charts[0] = chart1;