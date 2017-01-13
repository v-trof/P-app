var pull_put = {
  is_pulled: false,
  reset_sync: false,
  reset_default: function() {},
  reset: function() {
    pull_put.pre_actions.reset();
    //real reset
    pull_put.ui.element = undefined;
    pull_put.ui.hide();
    $placeholder.remove();
    indicator.hide();
    pull_put.ui.$.find(".__content").removeAttr('state');
    if (typeof tooltip !== 'undefiend') {
      tooltip.hide();
    }
    pull_put.cancel_action();
  },
  /**
   * Contains all functinos invoked before actual action
   * @type {Object}
   */
  pre_actions: {
    cancel: function() {},
    save: function() {},
    delete: function() {},
    add: function() {},
    reset: function() {},
    pull: function($pulled) {},
    put: function($put_zone, $pulled) {}
  },

  actions: {
    add: function() {}
  },
  cancel_action: function() {}
}

var indicator = (function() {

  var template = loads["Elements/Modules/UI/pull_put/__indicator/exports.html"];

  var icons = {
    add: loads["Elements/Icons/add.svg"],
    down: loads["Elements/Icons/angle_down.svg"]
  }

  var build = function(icon) {
    var $new_indicator = $(template);

    $new_indicator.find('button').html(icons[icon]);

    $new_indicator.addClass('m--' + icon);
    $new_indicator.css('pointer-events', 'all');
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

$(document).ready(function() {
  $("body").append(pull_put.ui.$)

  $(".pull_put_ui .__actions .m--cancel").click(function(event) {
    pull_put.pre_actions.cancel();

    //restoring defaut element
    pull_put.ui.element = pull_put.ui.proto_element;

    pull_put.ui.element.removeClass('m--pullable');
    pull_put.ui.element.removeClass('m--put-zone');

    pull_put.puller.cancel();
  });

  $(".pull_put_ui .__actions .m--save").click(function(event) {
    pull_put.pre_actions.save();

    pull_put.puller.cancel();
  });

  $(".pull_put_ui .__actions .m--delete").click(function(event) {
    pull_put.pre_actions.delete();

    pull_put.ui.element = $("");
    pull_put.reset();
  });

  $(".pull_put_ui .__actions .m--add").click(function(event) {
    pull_put.pre_actions.add();

    pull_put.actions.add();
    pull_put.reset();
  });
});

pull_put.puller = (function() {

  $placeholder = $("<div class='m--pull_put_empty'></div>")

  function replace($element) {
    if (pull_put.ui.element) {
      pull_put.puller.cancel();
    }

    $placeholder.html('');

    $placeholder.css({
      width: $element.outerWidth(),
      height: $element.outerHeight(),
      marginBottom: $element.css("margin-bottom"),
      marginTop: $element.css("margin-top"),
      marginLeft: $element.css("margin-left"),
      marginRight: $element.css("margin-right")
    });

    $element.after($placeholder);
  }


  exports = {
    had_clone: false,
    cancel: function() {
      $placeholder.replaceWith(pull_put.ui.element);
      pull_put.reset();
    },

    add: function($element, actions, action_additional, _callback, clone, card) {

      $element = $($element).first(); //fault-tolerance

      $element.addClass('m--pullable');

      $element.click(function(event) {
        $element = $(this);
        // console.log($element);
        if (!pull_put.is_pulled) {
          pull_put.pre_actions.pull($element);
          var element_width = this.getBoundingClientRect().width;

          if (clone) {
            var $element = $(this).clone();
            pull_put.puller.had_clone = true;
          } else {
            var $element = $(this);
            replace($element);
          }

          pull_put.ui.get($element, element_width, actions, _callback, card);

          if (action_additional) {
            pull_put.ui.add_action(
              action_additional.icon,
              action_additional.tip,
              action_additional._action
            );
          }
        }
      });
    }
  }
  return exports;

})();

pull_put.put_zone = (function() {

  var exports = {
    add: function($element, _action, _callback) {
      $element = $($element).first(); //fault-tolerance
      $element.addClass('m--put-zone');

      $element.click(function(event) {

        if (pull_put.is_pulled && !pull_put.ui.$.find(($(this)))[0]) {
          var $put_zone = $(this);

          pull_put.pre_actions.put($put_zone, pull_put.ui.element);
          // console.log($put_zone);
          _action(event, $put_zone, pull_put.ui.element);

          // pull_put.reset();

          // console.log($put_zone);
          if (_callback) {
            _callback($put_zone);
          }
        }
      });
    }
  }

  return exports;
})();

pull_put.ui = (function() {

  $ui = $(loads.get("Elements/Modules/UI/pull_put/"));

  $ui.__actions__additional = $ui.find(".__actions>.__additional");
  $ui.__content = $ui.find(".__content");

  function make_button(icon, tip, _action) {
    var $button = $('<div class="card m--circle" tip="' +
      tip + '">' +
      '<button class="m--ghost m--icon">' +
      icon +
      '</button></div>');
    $button.click(function(event) {
      _action(event);
    });

    return $button;
  }


  exports = {
    added_card: false,
    $: $ui,
    element: undefined,
    proto_element: undefined,
    additional_margin: 0,
    add_action: function(icon, tip, _action) {
      if (typeof icon === "object") {
        var action_obj = icon;
        icon = action_obj.icon;
        tip = action_obj.tip;
        _action = action_obj._action;
      }

      $new_button = make_button(icon, tip, _action);

      $ui.__actions__additional.html($new_button);
    },
    get: function($element, element_width, actions, _callback, card) {
      // console.log('got', $element);
      if (typeof actions === "undefined") {
        actions = []
      }

      $ui.removeAttr('style');

      if (card) {
        $ui.__content.addClass('card');
      } else {
        $ui.__content.removeClass('card');
      }

      $ui.__content.html($element);
      $ui.__actions__additional.html("");

      $ui.css("margin-left", -element_width / 2 +
        pull_put.ui.additional_margin)
      $ui.__content.css("width", element_width -
        pull_put.ui.additional_margin)

      pull_put.ui.element = $element;



      if (actions.indexOf("delete") > -1) {
        $ui.find(".__actions button.m--delete").parent().show();
      } else {
        $ui.find(".__actions button.m--delete").parent().hide();
      }

      if (actions.indexOf("add") > -1) {
        $ui.find(".__actions button.m--add").parent().show();
      } else {
        $ui.find(".__actions button.m--add").parent().hide();
      }

      if (actions.indexOf("save") > -1) {
        pull_put.ui.proto_element = $element.clone();
        $ui.find(".__actions button.m--save").parent().show();
      } else {
        pull_put.ui.proto_element = $element;
        $ui.find(".__actions button.m--save").parent().hide();
      }

      if (_callback) {
        _callback();
      }

      pull_put.ui.show(element_width);
    },
    show: function(element_width) {
      // console.log('showing up');
      if (typeof editor !== "undefined") {
        $(".__task").slice(-2).addClass("m--stand-out");
        $(".__put-margin").last().addClass("m--stand-out");
      }
      $ui.removeClass('m--hidden');

      setTimeout(function() {
        pull_put.is_pulled = true;

        var screen_width = window.innerWidth;
        var dropout = ($ui.width() - element_width / 2 +
          pull_put.ui.additional_margin) - screen_width / 2;

        if (dropout > 0) {
          $ui.css('right', '16px');
        }

      }, 300)

    },
    hide: function() {
      if (typeof editor !== "undefined") {
        $(".m--stand-out").removeClass("m--stand-out");
      }
      $ui.addClass('m--hidden');
      setTimeout(function() {
        pull_put.is_pulled = false;
        setTimeout(tooltip.hide, 100);
      }, 300)
    }
  }
  return exports;
})();
