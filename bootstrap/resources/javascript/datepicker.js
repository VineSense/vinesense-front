$(function () {
    var currentDate = moment().format("YYYY-MM-DD");

    $('#datepicker-start').datetimepicker({
        minDate: "2015-02-01",
        defaultDate: currentDate,
        format: 'YYYY-MM-DD'
    });
    $('#datepicker-end').datetimepicker({
        maxDate: currentDate,
        defaultDate: currentDate,
        format: 'YYYY-MM-DD'
    });

    $("#datepicker-start").on("dp.change", function (e) {
        $('#datepicker-end').data("DateTimePicker").minDate(e.date);
    });
    $("#datepicker-end").on("dp.change", function (e) {
        $('#datepicker-start').data("DateTimePicker").maxDate(e.date);
    });

    $('[data-event-request-chart-btn]').on('click', function(){
        $.blockUI({ css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        } });

        setTimeout($.unblockUI, 2000);
    });
});