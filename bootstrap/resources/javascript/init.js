$(document).on('ready page:load', function() {
  for(var i = 0, length = serverInformation.siteNumber ; i < length ; i++) {
    chart1.information.checkboxsChecked[i] = true;
  }
  serverAjaxRequest['depth']();
  serverAjaxRequest['weather']();
});