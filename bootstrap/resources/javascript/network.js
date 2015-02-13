var host = "http://192.168.1.103/Nickel";
var name = "Site";
function request(url, data, callback) {
  $.ajax({
    type: "POST",
    url: url,
    data: data
  }).done(callback);
}
$(document).on('ready page:load', function() {
  var currentYear = new Date().getFullYear();
  request(host + '/api/Logs/GetRangeByDepth', state, getRangeHandler);

  request(host + '/api/Weathers/GetMultiRange', {
    ranges: [
      {
        begin: (currentYear - 1) + "-01-01",
        end: currentYear + "-01-01",
        interval: 1,
        tag: (currentYear - 1) + ""
      },
      {
        begin: currentYear + "-01-01",
        end: (currentYear + 1) + "-01-01",
        interval: 1,
        tag: currentYear + ""
      }
    ]
  }, getWeatherHandler);
});

function getRangeHandler(res) {
  var i,
      length = res.result.length,
      series = [],
      data,
      j;

  for(i = 0 ; i < length ; i++) {
    data = [];
    for(j = 0 ; j < res.result[i].data.length ; j++) {
      data[j] = [moment(res.result[i].data[j][0]).valueOf(), res.result[i].data[j][1]]
    }
    series[i] = {
      name: name + res.result[i].siteId,
      data: data
    };
  }
  charts[0].option.series = series;
  drawChart(0);
}


function getWeatherHandler(res) {
  var i,
      length = res.result.length,
      series = [],
      standardData,
      compareData,
      data;

  for(i = 0 ; i < length ; i++) {
    data = [];
    for(j = 0 ; j < res.result[i].data.length ; j++) {
      data[j] = [Date.UTC(2012, 0, moment(res.result[i].data[j][0]).dayOfYear()), res.result[i].data[j][1]];
    }
    charts[1].option.series[i] = {
      name: res.result[i].tag,
      data: data
    };
  }

  standardData = charts[1].option.series[0].data;
  compareData = charts[1].option.series[1].data;

  charts[1].option.xAxis.plotBands = getPlotBandsGapTemperature(standardData, compareData);
  drawChart(1);
}

//처음시작할때 요청 URL 

/*
url: /api/Logs/GetRangeByDepth

data:
{
  sensorType: "temperature" | "moisture",
  begin: null | "1990-01-31" // 시간을 추가할 수도 있다 (13:00:22)
  end: null | "1990-01-31" // 정확한날짜를 원하면 end + 1일 
  interval: 1 | 7 | 30 | null (30분단위로 모두 줌)
  depth: 1..5 
}

response :
{
  "depth": 1..5,
  "result": [{
      "siteId": 1,
      "data": [
        ["2014-05-24T00:00:00", 0.09957521] ...
      ],
      "isInterExtrapolated": true,
      "depth": 1.3
  }]
}

url: api/Weathers/GetMultiRange
data: 
{
  "ranges": [
    {
      begin: null | "1990-01-31" // 시간을 추가할 수도 있다 (13:00:22)
      end: null | "1990-01-31" // 정확한날짜를 원하면 end + 1일 
      interval: 1 | 7 | 30 | null (30분단위로 모두 줌)
      tag: "aaaaaa"
    },
    {
      begin: null | "1990-01-31" // 시간을 추가할 수도 있다 (13:00:22)
      end: null | "1990-01-31" // 정확한날짜를 원하면 end + 1일 
      interval: 1 | 7 | 30 | null (30분단위로 모두 줌)
      tag: "bbbbbb"
    }
  ]
}

response:
{
  "result": [
    {
      "tag": "aaaaaa",
      "data": [
        ["2014-05-24T00:00:00", 0.09957521] ...
      ],
    },
    {
      "tag": "bbbbbbb",
      "data": [
        ["2014-05-24T00:00:00", 0.09957521] ...
      ],
    }
  ]
}*/


/*
url: /api/Logs/GetRangeBySiteId

data:
{
  sensorType: "temperature" | "moisture",
  begin: null | "1990-01-31" // 시간을 추가할 수도 있다 (13:00:22)
  end: null | "1990-01-31" // 정확한날짜를 원하면 end + 1일 
  interval: 1 | 7 | 30 | null (30분단위로 모두 줌)
  siteId: 1..7
}

returnData :
{
  "site": {
    "id": 2,
    "name": "Site2",
    "latitude": 0.0,
    "longitude": 0.0
  },
  "result": [{
      "siteId": 2,
      "data": [
        ["2014-05-24T00:00:00", 0.09957521] ...
      ],
      "isInterExtrapolated": true,
      "depth": 1..5
  }]
}
*/