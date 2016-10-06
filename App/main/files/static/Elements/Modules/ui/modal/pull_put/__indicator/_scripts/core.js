var indicator = (function() {

  var template = loads["Elements/Modules/indicator/exports.html"];

  var icons = {
    add: loads["Elements/Icons/add.svg"],
    down: loads["Elements/Icons/angle_down.svg"]
  }

  var build = function(icon) {
    var $new_indicator = $(template);

    $new_indicator.find('button').html(icons[icon]);

    $new_indicator.addClass('m--' + icon);
    return $new_indicator;
  };

  var add = function($parent, icon, group) {
    if ($parent.children('.indicator.g' + group).length > 0) {
      return;
    }

    var $new_indicator = build(icon);
    $new_indicator.addClass('g' + group)
      // console.log($parent, $new_indicator);
    $parent.prepend($new_indicator);
    $new_indicator.hide();
  }

  var hide = function(group) {
    if (typeof group === "undefined") {
      $('.indicator').hide();
    } else {
      $('.indicator.g' + group).hide();
    }
  }

  var show = function(group) {
    if (typeof group === "undefined") {
      $('.indicator').show();
    } else {
      $('.indicator.g' + group).show();
    }

    $('.pull_put_ui .indicator').hide();
  }


  var exports = {
    add: add,
    hide: hide,
    show: show
  }

  return exports;
})();
