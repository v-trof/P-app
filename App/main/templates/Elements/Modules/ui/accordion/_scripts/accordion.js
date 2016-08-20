var accordion = (function() {
  
  toggle_template = '<button class="m--ghost m--icon m--accordion-toggle">'
    +'{% include "Elements/Icons/angle_down.svg" %}</button>';

  function expand($element, $indicator) {
    $element.children().removeClass('m--accordion-hidden');
    $element.children('.m--accordion-toggle').first()
      .removeClass('m--accordion-minimized')
  }

  function minimize($element, $indicator) {
    $element.children().addClass('m--accordion-hidden');
    
    $indicator.removeClass('m--accordion-hidden');

    $element.children('.m--accordion-toggle').first()
      .removeClass('m--accordion-hidden')
      .addClass('m--accordion-minimized');
  }

  exports = {
    add: function($element, indicator) {
      var $indicator = $element.find(indicator).first();

      var $toggle = $(toggle_template);
      $element.prepend($toggle);

      $toggle.css("top", $indicator.outerHeight()/2);

      $toggle.click(function(event) {
        if($(this).hasClass('m--accordion-minimized')) {
          expand($element, $indicator);
        } else {
          minimize($element, $indicator);
        }
      });

    }
  }
  return exports;
})();
