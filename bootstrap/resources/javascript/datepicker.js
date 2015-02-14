$(function () {
    var yesterDay = moment().subtract(1, 'd').format("YYYY-MM-DD"),
        coupleOfDayAgo = moment().subtract(2, 'd').format("YYYY-MM-DD"),
        minDate = serverInformation.minDate;

    $('#datepicker-start').datetimepicker({
        maxDate: coupleOfDayAgo,
        minDate: minDate,
        defaultDate: minDate,
        format: 'YYYY-MM-DD'
    });
    
    $('#datepicker-end').datetimepicker({
        minDate: minDate,
        maxDate: yesterDay,
        defaultDate: yesterDay,
        format: 'YYYY-MM-DD'
    });

    $("#datepicker-start").on("dp.change", function (e) {
        $('#datepicker-end').data("DateTimePicker").minDate(e.date);
        chart1.information.networkRequestParameter.begin = moment(e.date).format("YYYY-MM-DD");
        serverAjaxRequest[chart1.information.selectedView]();
    });
    $("#datepicker-end").on("dp.change", function (e) {
        $('#datepicker-start').data("DateTimePicker").maxDate(e.date.subtract(1, 'd'));
        chart1.information.networkRequestParameter.end = moment(e.date).add(2, 'd').format("YYYY-MM-DD");
        serverAjaxRequest[chart1.information.selectedView]();
    });

    $('[data-event-request-chart-btn]').on('click', function(){
        
    });
});