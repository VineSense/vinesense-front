
// 온도차이에 구간 구하는 함수 
function getPlotBandsGapTemperature(standardData, compareData, optionLow) {
  var plotBands,
      onGoing,
      j,
      standardDataIndex,
      compareDataIndex,
      sectionColor;

  plotBands = [];
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
    } else if((onGoing) && ((standardData[standardDataIndex][1] <= compareData[compareDataIndex][1]) ^ optionLow)) {
      onGoing = false;
      plotBands[j].to = calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);
      j++;
    }
    compareDataIndex++;
    standardDataIndex++;
  }
  return plotBands;
}

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