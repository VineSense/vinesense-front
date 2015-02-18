var topChart;
(function() {
  topChart = chartGenerator.create($('#chart-1'), {
    xAxis: {
      events:{
        setExtremes: function(e){
          topChart.information.xAxis.min = e.min;
          topChart.information.xAxis.max = e.max;
          topChart.method.selectViewRange(topChart, e.min, e.max);
          topChart.object.xAxis[0].setTitle({ text: moment(e.min).get('year') });
        }
      }
    },
    tooltip: {
      xDateFormat: '%m/%d/%Y'
    },
  });

  topChart.option.yAxis[1].title.text = 'Rainfall';
  topChart.option.yAxis[1].labels.text = '{value} inch';

  topChart.information = {
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
})(); 

topChart.method.radioChangeEventHandler = function(){
  var selectedValue = parseInt($(this).val()) + 1,
      selectedView = topChart.information.selectedView;
  
  topChart.method.setSelectedValue[selectedView](selectedValue);
  serverAjaxRequest[selectedView]();

  topChart.method.serverRequest();
};

topChart.method.viewChangeEventHanler = function(){
  var selectedValue = $(this).val();
  
  topChart.method.changeViewType[selectedValue]();
};

topChart.method.checkboxChangeEventHandler = function() {
  var target = $(this);
      isChecked = target.is(':checked'),
      index = parseInt(target.attr('data-event-check')) + 1;
  
  topChart.method.toggleSeries(index, isChecked);
};

topChart.method.typeChangeEventHandler = function(){
  var selectedValue = $(this).val();

  topChart.method.cahngeType[selectedValue]();
};

topChart.method.viewDayChangeEventHandler = function(){
  var selectedValue = $(this).val();

  topChart.information.networkRequestParameter.interval = selectedValue;
  
  topChart.method.setXAxisMinMax(selectedValue);
  topChart.method.serverRequest();
};

topChart.method.onOffPrecipitationEventHandler = function(isNotSetAxisMinMax){
  var isChecked = $(this).val() == 'on';

  topChart.method.toggleSeries(0, isChecked);
};
 
topChart.method.drawChart = function(isNotSetAxisMinMax){
  var xAxis,
      option = {},
      selectedView = topChart.information.selectedView,
      currentChartState = topChart.information.networkRequestParameter;

  topChart.option.title.text  = selectedView + ' ';
  topChart.option.title.text += selectedView == 'depth' ? currentChartState.depth : currentChartState.siteId;

  $.extend(option, topChart.option);

  topChart.target.highcharts('StockChart', option);
  topChart.object = topChart.target.highcharts();
  
  if(!isNotSetAxisMinMax){
    topChart.method.setXAxisMinMax(currentChartState.interval);
  }

  xAxis = topChart.information.xAxis;

  topChart.method.selectViewRange(topChart, xAxis.min, xAxis.max);
  topChart.method.hideSeries();
};

topChart.method.hideSeries = function() {
  for(var i = 0, length = topChart.information.checkboxsChecked.length ; i < length ; i++) {
    if(!topChart.information.checkboxsChecked[i]) {
      topChart.object.series[i].hide();
    }
  }  
};

topChart.method.toggleSeries = function(index, isChecked) {
  if(isChecked) {
    topChart.object.series[index].show();
    topChart.information.checkboxsChecked[index] = true;
  } else {
    topChart.object.series[index].hide();
    topChart.information.checkboxsChecked[index] = false;
  }
};

topChart.method.serverRequest = function() {
  var selectedView = topChart.information.selectedView;

  serverAjaxRequest[selectedView]();
};

topChart.method.setXAxisMinMax = function(selectedValue) {
  extremes = topChart.object.xAxis[0].getExtremes();
  max = extremes.max;
  min = max - (3600 * 24 * 1000 * 11 * selectedValue);
  min = extremes.min < min ? min : extremes.min;

  topChart.information.xAxis.min = min;
  topChart.information.xAxis.max = max;
};

topChart.method.setSelectedValue = {
  site: function(selectedValue) {
    topChart.information.networkRequestParameter.siteId = selectedValue;
  },
  depth: function(selectedValue) {
    topChart.information.networkRequestParameter.depth = selectedValue;
  }
};

topChart.method.changeViewType = {
  getCheckBoxHTML: function(checkbox) {
    var checkboxTemplate = '';

    topChart.information.checkboxsChecked = [];

    checkboxTemplate += '<th>' + checkbox.title + '</th>';
    
    for(var i = 0, checkBoxNumber = checkbox.groupNumber ; i < checkBoxNumber ; i++){
      checkboxTemplate += '<td><label class="checkbox-inline"><input type="checkbox" data-event-check="' + i + '" checked>' + (i + 1) + '</label><td>'
      topChart.information.checkboxsChecked[i] = true;
    }

    return checkboxTemplate
  },
  getRaidoHTML: function(radio) {
    var radioTemplate = '';

    radioTemplate += '<th>' + radio.title + '</th>';
    
    for(var i = 0, radioNumber = radio.groupNumber ; i < radioNumber ; i++){
      radioTemplate += '<td><label class="radio-inline"><input type="radio" name="inlineRadioOptions" data-event-select-item value="' + i + '">' + (i + 1) + '</label><td>'
    }

    return radioTemplate;
  },
  setHTML: function(radio, checkbox){
    
    var checkboxHTML = topChart.method.changeViewType.getCheckBoxHTML(checkbox);
        raidoHTML = topChart.method.changeViewType.getRaidoHTML(radio);

    $('#checkbox-group').html(checkboxHTML);
    $('#radio-group').html(raidoHTML);

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
    
    topChart.method.changeViewType.setHTML(radio, checkbox);

    topChart.information.selectedView = "site";
    topChart.information.networkRequestParameter.siteId = 1;
    topChart.method.serverRequest();
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
    
    topChart.method.changeViewType.setHTML(radio, checkbox);
    
    topChart.information.selectedView = "depth";
    topChart.information.networkRequestParameter.depth = 1;
    topChart.method.serverRequest();
  }
};

topChart.method.cahngeType = {
  changeyAxisTitle: function(title) {
    topChart.option.yAxis[0].title.text = title;
  },
  temperature: function() {
    topChart.information.networkRequestParameter.sensorType = "temperature";
    topChart.method.cahngeType.changeyAxisTitle('Tem (F)');
    topChart.method.serverRequest();
  },
  moisture: function() {  
    topChart.information.networkRequestParameter.sensorType = "moisture";
    topChart.method.cahngeType.changeyAxisTitle('Moisture (m3/m3)');
    topChart.method.serverRequest();
  }
};

charts[0] = topChart;