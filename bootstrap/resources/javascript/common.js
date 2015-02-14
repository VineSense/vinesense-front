if ( typeof (vinesense) == typeof (undefined)) {
    vinesense = {};
}

vinesense = {
    selectPanelHandler : {
        'chart-1' : function(e) {
            var mainPanel = $('#chart-1-panel'),
                sidePanel = $("#chart-1-side-panel"),
                mainSpan = $('#chart-1-span'),
                index = 0;

            vinesense.togglePanelSpanClass(mainPanel, mainSpan, sidePanel, index);
        },
        'map' : function() {
            var mainSpan = $('#map-span'),
                mainPanelBody = $('#map-panel .panel-body');
            if(mainSpan.attr('class').indexOf('glyphicon-resize-full') != -1) {
                mainSpan.removeClass('glyphicon-resize-full');
                mainSpan.addClass('glyphicon-resize-small');
                mainPanelBody.show();

            } else {
                mainSpan.removeClass('glyphicon-resize-small');
                mainSpan.addClass('glyphicon-resize-full');
                mainPanelBody.hide();
            }

        },
        'chart-2' : function() {
            var mainPanel = $('#chart-2-panel'),
                sidePanel = $("#chart-2-side-panel"),
                mainSpan = $('#chart-2-span'),
                index = 1;

            vinesense.togglePanelSpanClass(mainPanel, mainSpan, sidePanel, index);
        }
    },

    selectBottomSideMenuBtnHandler : {
        'all' : function() {
//            $('[data-bottom-side-menu-list]').css('background-color', 'white');
        },

        'budBreak' : function() {

        },

        'flowering' : function() {

        },

        'veraison' : function() {

        },

        'harvest' : function() {

        }
    },

    init : function() {
      this.addEventListener();
    },

    addEventListener : function() {
        this.togglePanelWindow();
    },

    togglePanelWindow : function() {
        $('[data-event-change-panel]').on('click', function () {
            var selectedValue = $(this).attr('data-event-change-panel');
            vinesense.selectPanelHandler[selectedValue]();
        });
    },

    togglePanelSpanClass : function(mainPanel, mainSpan, sidePanel, index) {
        if(mainPanel.attr('class') == 'col-lg-8') {
            mainPanel.removeClass('col-lg-8');
            mainPanel.addClass('col-lg-12')
            mainSpan.removeClass('glyphicon-resize-full');
            mainSpan.addClass('glyphicon-resize-small');
            sidePanel.hide();

        } else {
            mainPanel.removeClass('col-lg-12');
            mainPanel.addClass('col-lg-8')
            mainSpan.removeClass('glyphicon-resize-small');
            mainSpan.addClass('glyphicon-resize-full');
            sidePanel.show();
        }
        charts[index].method.drawChart(true);
    }
}

$(document).on('ready page:load', function() {
    vinesense.init();
});