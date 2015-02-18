// this file is calculating the two data difference
var dataDifferenceInfomation = {};

dataDifferenceInfomation.getDifference = function(standardData, compareData, optionLow) {
  var plotBands,
      points,
      data,
      onGoing,
      j,
      k,
      standardDataIndex,
      compareDataIndex,
      sectionColor;

  plotBands = [];
  points = [];
  data = [];
  onGoing = false;
  optionLow = optionLow || false;
  k = j = standardDataIndex = compareDataIndex = 0;
  sectionColor = optionLow ? 'rgba(28, 186, 188, .6)' : 'rgba(206, 89, 115, .6)';

  while((compareDataIndex < compareData.length - 1) && (standardDataIndex < standardData.length - 1)) {
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
        from: dataDifferenceInfomation.calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex),
        color: sectionColor
      };
      data[j] = {
        startDate: standardData[standardDataIndex + 1][0],
        standardAverageTemperature: standardData[standardDataIndex][1],
        compareAverageTemperature: compareData[compareDataIndex][1],
        days: 1
      };
      points[k++] = [standardData[standardDataIndex][0], Math.abs((standardData[standardDataIndex][1] - compareData[compareDataIndex][1]))];
    } else if((onGoing) && ((standardData[standardDataIndex][1] <= compareData[compareDataIndex][1]) ^ optionLow)) {
      onGoing = false;
      plotBands[j].to = dataDifferenceInfomation.calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);
      data[j].endDate = standardData[standardDataIndex][0];
      data[j].standardAverageTemperature /= data[j].days;
      data[j].compareAverageTemperature /= data[j].days;
      j++;
    } else if(onGoing){
      data[j].standardAverageTemperature += standardData[standardDataIndex][1];
      data[j].compareAverageTemperature += compareData[compareDataIndex][1];
      data[j].days += 1;
      var sum = points[k - 1][1] + Math.abs((standardData[standardDataIndex][1] - compareData[compareDataIndex][1])); 
      points[k++] = [standardData[standardDataIndex][0], sum];
    }
    compareDataIndex++;
    standardDataIndex++;
  }

  if(onGoing) {
    if(compareDataIndex == compareData.length - 1) {
      data[j].endDate = standardData[standardDataIndex][0];
    } else {
      data[j].endDate = compareData[compareDataIndex][0];
    }

    plotBands[j].to = dataDifferenceInfomation.calCrossingPositon(standardData, compareData, standardDataIndex, compareDataIndex);

    data[j].standardAverageTemperature /= data[j].days;
    data[j].compareAverageTemperature /= data[j].days;
  }
  return { 
    plotBands: plotBands,
    data: data,
    points: points,
  };
};

dataDifferenceInfomation.getPoints = function(standardData, compareData, standardDataIndex, compareDataIndex) {
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
};

dataDifferenceInfomation.calCrossingPositon = function(standardData, compareData, standardDataIndex, compareDataIndex) {
  if(standardDataIndex == 0) {
    return standardData[0][0];
  } else if(compareDataIndex == 0) {
    return compareData[0][0];
  } else if(compareDataIndex == compareData.length) {
    return standardData[compareDataIndex - 1][0];
  } else if(standardDataIndex == standardData.length) {
    return standardData[standardDataIndex - 1][0];
  } else {
    var points = dataDifferenceInfomation.getPoints(standardData, compareData, standardDataIndex, compareDataIndex);
    return ((points[0].x * points[1].y - points[0].y * points[1].x) * (points[2].x - points[3].x) - (points[0].x - points[1].x) * (points[2].x * points[3].y - points[2].y * points[3].x)) / ((points[0].x - points[1].x) * (points[2].y - points[3].y) - (points[0].y - points[1].y) * (points[2].x - points[3].x));    
  }
};