function request(url, data, callback) {
  console.log('-----------------------------------------');
  console.log('url : ' + url);
  console.log('sensorType : ' + data.sensorType);
  console.log('siteId : ' + data.siteId);
  console.log('depth : ' + data.depth);
  console.log('begin : ' + data.begin);
  console.log('end : ' + data.end);
  console.log('-----------------------------------------');

  // 블락 
  blockUI.block();
        
  $.ajax({
    type: "POST",
    url: url,
    data: data
  }).done(callback);
}

var serverAjaxRequest = {
  site: function() {
    request(serverInformation.host + '/api/Logs/GetRangeBySiteId',chart1.information.networkRequestParameter, chart1Handler['site']);
  },
  depth: function() {
    request(serverInformation.host + '/api/Logs/GetRangeByDepth',chart1.information.networkRequestParameter, chart1Handler['depth']);
  },
  weather: function(targetYear, compareYear) {
    var suffix;
    
    targetYear = targetYear || new Date().getFullYear();
    compareYear = compareYear || targetYear - 1;
    suffix = '-01-01';
    
    request(serverInformation.host + '/api/Weathers/GetMultiRange', {
      ranges: [
        {
          begin: compareYear + suffix,
          end: (compareYear + 1) + suffix,
          interval: 1,
          tag: compareYear.toString()
        },
        {
          begin: targetYear + suffix,
          end: (targetYear + 1) + suffix,
          interval: 1,
          tag: targetYear.toString()
        }
      ]
    }, chart2Handler['handler']);
  }
};

var chart1Handler = {
  handler: function(res, prefixName, names) {
    var series = [];
    var year,
        month,
        day;
    
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      var convertedData = [],
          resultData = res.result[i].data;
      for(var j = 0, dataLength = res.result[i].data.length ; j < dataLength ; j++) {
        year =  moment(resultData[j][0]).get('year' );
        month = moment(resultData[j][0]).get('month');
        day =   moment(resultData[j][0]).dayOfYear();

        convertedData[j] = [Date.UTC(year, 0, day), resultData[j][1]];
      }
      series[i] = {
        name: prefixName + names[i],
        data: convertedData
      }; 
    }
    chart1.option.series = series;
    chart1.method.drawChart();
    blockUI.unblock();
  },
  site: function(res) {
    var names = [];
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      names[i] = res.result[i].depth;
    }
    chart1Handler.handler(res, 'depth', names);
  },
  depth: function(res) {
    var names = [];
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      names[i] = res.result[i].siteId;
    }
    chart1Handler.handler(res, 'site', names);
  }
};

var chart2Handler = {
  handler: function (res) {
    var series = [],
        standardData,
        compareData;

    for(var i = 0, length = res.result.length ; i < length ; i++) {
      var convertedData = [],
          resultData = res.result[i].data;
      for(var j = 0, dataLength = res.result[i].data.length ; j < dataLength ; j++) {
        convertedData[j] = [Date.UTC(2012, 0, moment(resultData[j][0]).dayOfYear()), resultData[j][1]];
      }
      chart2.option.series[i] = {
        name: res.result[i].tag,
        data: convertedData
      };
    }
    
    standardData = chart2.option.series[0].data;
    compareData = chart2.option.series[1].data;

    chart2.option.xAxis.plotBands = getPlotBandsGapTemperature(standardData, compareData);
    chart2.method.drawChart();
    blockUI.unblock();
  }
};

$(document).on('ready page:load', function() {
  for(var i = 0, length = serverInformation.siteNumber ; i < length ; i++) {
    chart1.information.checkboxsChecked[i] = true;
  }
  serverAjaxRequest['depth']();
  serverAjaxRequest['weather']();
});