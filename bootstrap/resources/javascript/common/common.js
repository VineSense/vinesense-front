if ( typeof (vinesense) == typeof (undefined)) {
    vinesense = {};
}

vinesense = {
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

  selectPanelHandler : {
    'top-chart' : function(e) {
      var mainPanel = $('#top-chart-panel'),
          sidePanel = $("#top-chart-side-panel"),
          mainSpan = $('#top-chart-span'),
          index = 0;
      vinesense.togglePanelSpanClass(mainPanel, mainSpan, sidePanel, index);
    },
    'bottom-chart' : function() {
      var mainPanel = $('#bottom-chart-panel'),
          sidePanel = $("#bottom-chart-side-panel"),
          mainSpan = $('#bottom-chart-span'),
          index = 1;
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
    }
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
  },
  
  blockUI: {
    block: function() {
      $.blockUI({ 
        css: {
          border: 'none',
          padding: '15px',
          backgroundColor: '#000',
          '-webkit-border-radius': '10px',
          '-moz-border-radius': '10px',
          opacity: .5,
          color: '#fff'
        }
      });
    },
    unblock: function() {
      $.unblockUI();
    }
  }
}