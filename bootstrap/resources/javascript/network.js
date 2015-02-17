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
    
    series[0] = {
      name: 'precipitation',
      type: 'column',
      yAxis: 1,
      data: convertDateFormat(res.weather)
    };

    for(var i = 1, j = 0, length = res.result.length ; i <= length ; i++, j++) {
      series[i] = {
        name: prefixName + names[j],
        type: 'spline',
        yAxis: 0,
        data: convertDateFormat(res.result[j].data)
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
          resultData = res.result[i].data,
          j;
      for(j = 0, dataLength = res.result[i].data.length ; j < dataLength ; j++) {
        convertedData[j] = [Date.UTC(2012, 0, moment(resultData[j][0]).dayOfYear()), resultData[j][1]];
      }

      if(i == 1) {
        makeData(convertedData, moment(resultData[j - 1][0]), j);
      }
      chart2.option.series[i] = {
        name: res.result[i].tag,
        data: convertedData,
        yAxis: 0
      };
    }

    chart2.method.setFlag();
    
    standardData = chart2.option.series[0].data;
    compareData = chart2.option.series[1].data;

    chart2.information.section.high = getPlotBandsGapTemperature(standardData, compareData, false);
    chart2.information.section.low = getPlotBandsGapTemperature(standardData, compareData, true);

    chart2.option.series[2] = chart2.option.series[0];

    chart2.option.series[0] = {
      name: 'Cusum',
      type: 'column',
      yAxis: 1,
      data: chart2.information.section.high.points
    };


    chart2.option.xAxis.plotBands = chart2.information.section.high.plotBands;
    chart2.method.drawChart();
    blockUI.unblock();
  }
};

function convertDateFormat(data) {
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
}


$(document).on('ready page:load', function() {
  for(var i = 0, length = serverInformation.siteNumber ; i < length ; i++) {
    chart1.information.checkboxsChecked[i] = true;
  }
  serverAjaxRequest['depth']();
  serverAjaxRequest['weather']();
});



startYear = parseInt(moment(serverInformation.minDate).format("YYYY"));
yesterYear = parseInt(moment().subtract(1, 'y').format("YYYY"));
endYear = parseInt(moment().format("YYYY"));

var yearSelectTemplate = '';


for(var year = startYear ; year <= endYear ; year++) {
  yearSelectTemplate += '<option value=' + year + '>' + year +'</option>';
}

$('#data-compare-year').html(yearSelectTemplate);
$('#data-standard-year').html(yearSelectTemplate);

$('#data-compare-year').find('[value="' + yesterYear + '"]').attr( "selected", 'selected' );
$('#data-standard-year').find('[value="' + endYear + '"]').attr( "selected", 'selected' );




function makeData(convertedData, resultData, j){
  for(var i = 0 ; i <= 200 ; i++) {
    convertedData[j] = [Date.UTC(2012, 0, moment(resultData).add(i, 'd').dayOfYear()), Math.random() * 100];
    j++
  }
  return convertedData;
}






