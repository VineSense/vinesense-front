
// -------------------------- chart 정보 --------------------------

var chartColors =[
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628'];

var charts = [],
    serverInformation = {
      host: 'http://vines.cloudapp.net/Nickel',
      minDate: '2014-05-24',
      currentYear: 2015,
      siteNumber: 7,
      depthNumber: 5
    };

$(document).on('ready page:load', function() {

  // document-handler : topChart
  $('#radio-group').on('change', '[data-event-select-item]', topChart.method.radioChangeEventHandler);
  $('#checkbox-group').on('change', '[data-event-check]', topChart.method.checkboxChangeEventHandler);
  $('[data-event-change-type]').on('change', topChart.method.typeChangeEventHandler);
  $('[data-event-change-view-day]').on('change', topChart.method.viewDayChangeEventHandler);
  $('[data-event-change-view-option]').on('change', topChart.method.viewChangeEventHanler);
  $('[data-event-on-off-precipitation]').on('change', topChart.method.onOffPrecipitationEventHandler);
  
  // document-handler : bottomChart
  $('[data-event-change-compare-type]').on('change', bottomChart.method.compareTypeChangeHandler);
  $('[data-event-change-chart-section]').on('change', bottomChart.method.chartSectionChangeHandler);
  $('#view-feature-select').on('change', bottomChart.method.viewFeatureSelectHandler);
  $('[select-compare-year]').on('change', bottomChart.method.compareYearSelectHandler);

  // datapicker 
  (function() {
    var yesterDay = moment().subtract(1, 'd').format('MM/DD/YYYY'),
        coupleOfDayAgo = moment().subtract(2, 'd').format('MM/DD/YYYY'),
        minDate = serverInformation.minDate;

    $('#datepicker-start').datetimepicker({
        maxDate: coupleOfDayAgo,
        minDate: minDate,
        defaultDate: minDate,
        format: 'MM/DD/YYYY'
    });
    
    $('#datepicker-end').datetimepicker({
        minDate: minDate,
        maxDate: yesterDay,
        defaultDate: yesterDay,
        format: 'MM/DD/YYYY'
    });
  })();

  // document-handler : date-picker
  $("#datepicker-start").on("dp.change", function (e) {
      $('#datepicker-end').data("DateTimePicker").minDate(e.date);
      topChart.information.networkRequestParameter.begin = moment(e.date).format('MM/DD/YYYY');
      serverAjaxRequest[topChart.information.selectedView]();
  });
  $("#datepicker-end").on("dp.change", function (e) {
      $('#datepicker-start').data("DateTimePicker").maxDate(e.date.subtract(1, 'd'));
      topChart.information.networkRequestParameter.end = moment(e.date).add(2, 'd').format('MM/DD/YYYY');
      serverAjaxRequest[topChart.information.selectedView]();
  });


  // init bottomChart compare year
  (function() {
    var startYear = parseInt(moment(serverInformation.minDate).format("YYYY")),
        yesterYear = parseInt(moment().subtract(1, 'y').format("YYYY")),
        endYear = parseInt(moment().format("YYYY")),
        yearSelectTemplate = '';

    for(var year = startYear ; year <= endYear ; year++) {
      yearSelectTemplate += '<option value=' + year + '>' + year +'</option>';
    }

    $('[select-compare-year="compare"]').html(yearSelectTemplate);
    $('[select-compare-year="standard"]').html(yearSelectTemplate);

    $('[select-compare-year="compare"]').find('[value="' + yesterYear + '"]').attr( "selected", 'selected' );
    $('[select-compare-year="standard"]').find('[value="' + endYear + '"]').attr( "selected", 'selected' );
  })();
  
  // common vinesense init
  vinesense.init();

  // init 
  for(var i = 0, length = serverInformation.siteNumber ; i < length ; i++) {
    topChart.information.checkboxsChecked[i] = true;
  }
  serverAjaxRequest['weather']();
  serverAjaxRequest['depth']();

});

