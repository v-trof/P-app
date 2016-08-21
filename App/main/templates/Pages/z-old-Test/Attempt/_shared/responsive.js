function adapt_layout() {
  var width = window.innerWidth
  var body = $("body");

  // console.log(width);

  if(width > 1600) {
    // console.log("l");
    panel.show();
    body.css('padding-right', '0');
  } else if(width >= 800) {
    // console.log(panel.content.width());
    panel.show();
    body.css('padding-right', panel.$.width()+24);
  } else if(width < 800) {
    // console.log("s");
    panel.hide();
    body.css('padding-right', '0');
  }
}

$(window).resize(function(event) {
  /* 3 states: 
     1600+ search align 
     1366-1600
     1100-960 test gets smaller
     960 - panel is hidden
  */
  adapt_layout();

});

$(document).ready(function() {
  setTimeout(adapt_layout, 200);
});