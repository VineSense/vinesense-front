// ajax request function
var serverAjaxRequest = {
  request: function(url, data, callback) {
    // on BlockUI
    vinesense.blockUI.block();
          
    $.ajax({
      type: "POST",
      url: url,
      data: data
    }).done(callback);
  },
  site: function() {
    serverAjaxRequest.request(serverInformation.host + '/api/Logs/GetRangeBySiteId',topChart.information.networkRequestParameter, responsehandler.topChart['site']);
  },
  depth: function() {
    serverAjaxRequest.request(serverInformation.host + '/api/Logs/GetRangeByDepth',topChart.information.networkRequestParameter, responsehandler.topChart['depth']);
  },
  weather: function() {
    var suffix = '-01-01',
        compareYear = bottomChart.information.networkRequestParameter.compareYear,
        standardYear = bottomChart.information.networkRequestParameter.targetYear;

    serverAjaxRequest.request(serverInformation.host + '/api/Weathers/GetMultiRange', {
      ranges: [
        {
          begin: compareYear + suffix,
          end: (compareYear + 1) + suffix,
          interval: 1,
          tag: compareYear.toString(),
          column: bottomChart.information.networkRequestParameter.feature
        },
        {
          begin: standardYear + suffix,
          end: (standardYear + 1) + suffix,
          interval: 1,
          tag: standardYear.toString()
        }
      ]
    }, responsehandler.bottomChart['handler']);
  }
};

// server response handler
var responsehandler = {};

// make series data from server response data 
responsehandler.getSeriesData = function(data) {
  var convertedData = [],
      day,
      month,
      year;

  for(var i = 0, dataLength = data.length ; i < dataLength ; i++) {
    year =  moment(data[i][0]).get('year' );
    month = moment(data[i][0]).get('month');
    day =   moment(data[i][0]).dayOfYear();
    convertedData[i] = [Date.UTC(year, 0, day), data[i][1]];
  }
  return convertedData;
};

// server response handler - top chart
responsehandler.topChart = {
  handler: function(res, prefixName, names) {
    var series = [],
        year,
        month,
        day;
    
    series[0] = {
      name: 'precipitation',
      type: 'column',
      yAxis: 1,
      data: responsehandler.getSeriesData(res.weather)
    };

    for(var i = 1, j = 0, length = res.result.length ; i <= length ; i++, j++) {
      series[i] = {
        name: prefixName + names[j],
        type: 'spline',
        yAxis: 0,
        data: responsehandler.getSeriesData(res.result[j].data),
        color: chartColors[j]
      }; 
    }
    topChart.option.series = series;

    topChart.method.drawChart();
    vinesense.blockUI.unblock();
  },
  site: function(res) {
    var names = [];
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      names[i] = res.result[i].depth;
    }
    responsehandler.topChart.handler(res, 'depth', names);
  },
  depth: function(res) {
    var names = [];
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      names[i] = res.result[i].siteId;
    }

    responsehandler.topChart.handler(res, 'site', names);
  }
};

// server response handler - bottom chart
responsehandler.bottomChart = {
  handler: function(res) {
    var series = [],
        standardData,
        compareData;

    //TODO * when get the 2 years data, remove this function *//
    for(var i = 0, length = res.result.length ; i < length ; i++) {
      var convertedData = [],
          resultData = res.result[i].data,
          j;
      for(j = 0, dataLength = res.result[i].data.length ; j < dataLength ; j++) {
        convertedData[j] = [Date.UTC(2012, 0, moment(resultData[j][0]).dayOfYear()), resultData[j][1]];
      }
      if(i == 1) {
        makeData(convertedData, moment(resultData[j - 1][0]), j);
      }
      series[i] = {
        name: res.result[i].tag,
        data: convertedData,
        yAxis: 0,
        color: chartColors[i]
      };
    }
    standardData = series[0].data;
    compareData = series[1].data;

    bottomChart.option.series[1] = series[0];
    bottomChart.option.series[2] = series[1];

    bottomChart.information.highLow.high = dataDifferenceInfomation.getDifference(standardData, compareData, false);
    bottomChart.information.highLow.low = dataDifferenceInfomation.getDifference(standardData, compareData, true);

    // bottomChart.option.series[2] = bottomChart.option.series[0];

    //TODO * when get the 2 years data, add this function *//

    // for(var i = 1, j = 0, length = res.result.length ; i <= length ; i++, j++) {
    //   series[i] = {
    //     name: prefixName + names[j],
    //     type: 'spline',
    //     yAxis: 0,
    //     data: responsehandler.getSeriesData(res.result[j].data)
    //   }; 
    // }
    // standardData = bottomChart.option.series[2].data;
    // compareData = bottomChart.option.series[1].data;
    // bottomChart.information.highLow.high = dataDifferenceInfomation.getDifference(standardData, compareData, false);
    // bottomChart.information.highLow.low = dataDifferenceInfomation.getDifference(standardData, compareData, true);

    bottomChart.option.series[0] = {
      name: 'Cusum',
      type: 'column',
      yAxis: 1,
      data: bottomChart.information.highLow.high.points
    };

    // bottomChart.option.series[1] = series[0];

    bottomChart.option.xAxis.plotBands = bottomChart.information.highLow.high.plotBands;
    bottomChart.method.setFlag();

    bottomChart.method.drawChart(true);

    // off BlockUI
    vinesense.blockUI.unblock();
  }
};

//TODO * when get the 2 years data, add this function *//
function makeData(convertedData, resultData, j){
  for(var i = 0 ; i <= 200 ; i++) {
    convertedData[j] = [Date.UTC(2012, 0, moment(resultData).add(i, 'd').dayOfYear()), Math.random() * 100];
    j++
  }
  return convertedData;
}






