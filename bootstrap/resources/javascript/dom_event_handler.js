
// -------------------------- chart 정보 --------------------------

$(document).on('ready page:load', function() {
  $('#checkbox-group').on('change', '[data-event-check]', charts[0].method.checkboxChangeEventHandler);
  
  $('#radio-group').on('change', '[data-event-select-item]', charts[0].method.radioChangeEventHandler);

  $('[data-event-change-view-option]').on('change', charts[0].method.viewChangeEventHanler);

  $('[data-event-change-type]').on('change', charts[0].method.typeChangeEventHandler);

  $('[data-event-change-view-day]').on('change', charts[0].method.viewDayChangeEventHandler);

  $('[data-event-change-compare-temperature]').on('change', charts[1].method.compareTemperatureChangeHandler);
});