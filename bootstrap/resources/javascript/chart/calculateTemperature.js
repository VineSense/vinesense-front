
// 온도차이에 구간 구하는 함수 
function getPlotBandsGapTemperature(standardData, compareData, optionLow) {
  var plotBands,
      data,
      onGoing,
      j,
      standardDataIndex,
      compareDataIndex,
      sectionColor;

  plotBands = [];
  data = [];
  onGoing = false;
  optionLow = optionLow || false;
  j = standardDataIndex = compareDataIndex = 0;
  sectionColor = optionLow ? 'rgba(28, 186, 188, .6)' : 'rgba(206, 89, 115, .6)';

  while((compareDataIndex < compareData.length) && (standardDataIndex < standardData.length)) {
    if(standardData[standardDataIndex][0] > compareData[compareDataIndex][0]) {
      compareDataIndex++;
      continue;
    } else if(standardData[standardDataIndex][0] < compareData[compareDataIndex][0]){
      standardDataIndex++;
      continue;
    }

    if((!onGoing) && ((standardData[standardDataIndex][1] >= compareData[compareDataIndex][1]) ^ optionLow)) {
      onGoing = true;
      plotBands[j] = {
        from: calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex),
        color: sectionColor
      };
      data[j] = {
        startDate: standardData[standardDataIndex][0],
        standardAverageTemperature: standardData[standardDataIndex][1],
        compareAverageTemperature: compareData[compareDataIndex][1],
        days: 1
      };
    } else if((onGoing) && ((standardData[standardDataIndex][1] <= compareData[compareDataIndex][1]) ^ optionLow)) {
      onGoing = false;
      plotBands[j].to = calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);
      data[j].endDate = standardData[standardDataIndex][0];
      data[j].standardAverageTemperature += standardData[standardDataIndex][1];
      data[j].compareAverageTemperature += compareData[compareDataIndex][1];
      data[j].days += 1;

      data[j].standardAverageTemperature /= data[j].days;
      data[j].compareAverageTemperature /= data[j].days;

      j++;
    } else if(onGoing){
      data[j].standardAverageTemperature += standardData[standardDataIndex][1];
      data[j].compareAverageTemperature += compareData[compareDataIndex][1];
      data[j].days += 1;
    }
    compareDataIndex++;
    standardDataIndex++;
  }
  return { 
    plotBands: plotBands,
    data: data
  };
}

// function getPlotBandsGapTemperature3(standardData, compareData, optionLow) {
//   var plotBands = [],
//       sectionColor;
//   var value = getPlotBandsGapTemperature3(standardData, compareData);

//   sectionColor = optionLow ? 'rgba(28, 186, 188, .6)' : 'rgba(206, 89, 115, .6)';

//   if(optionLow) {
//     for(var j = 0 ; j < value.low.length ; j++) {
//       plotBands[j] = {
//         from: calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex),
//         color: sectionColor,
//         plotBands[j].to: calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);
//       };
//     }
//   } else {
//     for(var j = 0 ; j < value.high.length ; j++) {
//       plotBands[j] = {
//         from: calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex),
//         color: sectionColor,
//         plotBands[j].to: calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);
//       };
//     }
//   }
//   return plotBands;
// }

// // 온도차이에 구간 구하는 함수 
// function getPlotBandsGapTemperature2(standardData, compareData) {
//   var onGoing,
//       j,
//       standardDataIndex,
//       compareDataIndex,
//       isHighState,
//       high,
//       low,
//       item;


//   item = {
//     startDate: '',
//     endDate: '',
//     standardAverageTemperature: 0,
//     compareAverageTemperature: 0,
//     pointIndex: {
//       from: {

//       },
//       to: 0
//     }
//   };

//   high = [];
//   low = [];

//   onGoing = false;
//   isCurrentStateHigh = true;
//   j = standardDataIndex = compareDataIndex = 0;
  
//   while((compareDataIndex < compareData.length) && (standardDataIndex < standardData.length)) {
//     if(standardData[standardDataIndex][0] > compareData[compareDataIndex][0]) {
//       compareDataIndex++;
//       continue;
//     } else if(standardData[standardDataIndex][0] < compareData[compareDataIndex][0]){
//       standardDataIndex++;
//       continue;
//     }

//     console.log(item.standardAverageTemperature)
//     if(onGoing) {
//       if(standardData[standardDataIndex][1] == compareData[compareDataIndex][1]) {
//         onGoing = false;
//         item.endDate = standardData[standardDataIndex][0];
//         item.standardAverageTemperature += standardData[standardDataIndex][1]
//         item.compareAverageTemperature += compareData[compareDataIndex][1];
//         item.standardAverageTemperature = item.standardAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));
//         item.compareAverageTemperature = item.standardAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));


//         if(isCurrentStateHigh) {
//           console.log('끝 1');
//           var a = {};
//           $.extend(a, item);
//           high.push(item);
//           item = {
//     startDate: '',
//     endDate: '',
//     standardAverageTemperature: 0,
//     compareAverageTemperature: 0,
//     pointIndex: {
//       from: 0,
//       to: 0
//     }
//   };
//         } else {
//           console.log('끝 2');
//           var a = {};
//           $.extend(a, item);
//           low.push(item);
//           item = {
//     startDate: '',
//     endDate: '',
//     standardAverageTemperature: 0,
//     compareAverageTemperature: 0,
//     pointIndex: {
//       from: 0,
//       to: 0
//     }
//   };
//         }
//       } else if(isCurrentStateHigh && standardData[standardDataIndex][1] < compareData[compareDataIndex][1]) {
//         onGoing = false;
//         item.endDate = standardData[standardDataIndex - 1][0];
//         if(item.endDate - item.startDate != 0) {
//           item.standardAverageTemperature = item.standardAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));
//           item.compareAverageTemperature = item.standardAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));
//         }
        
//         console.log('끝 3');
//         var a = {};
//         $.extend(a, item);
//         high.push(item);
//         item = {
//     startDate: '',
//     endDate: '',
//     standardAverageTemperature: 0,
//     compareAverageTemperature: 0,
//     pointIndex: {
//       from: 0,
//       to: 0
//     }
//   };
      
//         continue;
//       } else if(!isCurrentStateHigh && standardData[standardDataIndex][1] > compareData[compareDataIndex][1]) {
//         onGoing = false;
//         item.endDate = standardData[standardDataIndex - 1][0];    

//         if(item.endDate - item.startDate != 0) {
//           item.standardAverageTemperature = item.standardAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));
//           item.compareAverageTemperature = item.compareAverageTemperature / ((item.endDate - item.startDate) / (3600 * 24 * 1000));
//         }
//         console.log('끝 4');
//         var a = {};
//         $.extend(a, item);
//         low.push(a);
//         item = {
//     startDate: '',
//     endDate: '',
//     standardAverageTemperature: 0,
//     compareAverageTemperature: 0,
//     pointIndex: {
//       from: 0,
//       to: 0
//     }
//   };
        
//         continue;
//       } else {
//         console.log('진행');
//         item.standardAverageTemperature += standardData[standardDataIndex][1]
//         item.compareAverageTemperature += compareData[compareDataIndex][1];
//       }
//     } else {
//       if(standardData[standardDataIndex][1] > compareData[compareDataIndex][1]) {
//         console.log('시작 1');
//         onGoing = true; 
//         isCurrentStateHigh = true;
//         item.startDate = standardData[standardDataIndex][0];
//         item.standardAverageTemperature += standardData[standardDataIndex][1]
//         item.compareAverageTemperature += compareData[compareDataIndex][1];
//       } else if(standardData[standardDataIndex][1] < compareData[compareDataIndex][1]) {
//         console.log('시작 2');
//         onGoing = true; 
//         isCurrentStateHigh = false;
//         item.startDate = standardData[standardDataIndex][0];
//         item.standardAverageTemperature += standardData[standardDataIndex][1]
//         item.compareAverageTemperature += compareData[compareDataIndex][1];
//       }
//     } 
//     compareDataIndex++;
//     standardDataIndex++;
//   }
//   return {
//     high: high,
//     low: low
//   }
// }



// 데이터로부터 점가져오는 함수 
function getPoints(standardData, compareData, standardDataIndex, compareDataIndex) {
  var points = [];
  points[0] = {
    x: standardData[standardDataIndex-1][0],
    y: standardData[standardDataIndex-1][1]  
  };

  points[1] = {
    x: standardData[standardDataIndex][0],
    y: standardData[standardDataIndex][1]  
  };

  points[2] = {
    x: compareData[compareDataIndex-1][0],
    y: compareData[compareDataIndex-1][1]
  };
  
  points[3] = {
    x: compareData[compareDataIndex][0],
    y: compareData[compareDataIndex][1]
  };
  return points;
}

// 온도차이에 교차하는 점 구하는 함수 
function calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex) {
  if(standardDataIndex == 0) {
    return standardData[0][0];
  } else if(compareDataIndex == 0) {
    return compareData[0][0];
  } else {
    var points = getPoints(standardData, compareData, standardDataIndex, compareDataIndex);
    return ((points[0].x * points[1].y - points[0].y * points[1].x) * (points[2].x - points[3].x) - (points[0].x - points[1].x) * (points[2].x * points[3].y - points[2].y * points[3].x)) / ((points[0].x - points[1].x) * (points[2].y - points[3].y) - (points[0].y - points[1].y) * (points[2].x - points[3].x));    
  }
}