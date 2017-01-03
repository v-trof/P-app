var context_menu = (function() {
  var $menu = $("<div id='context_menu' class='m--hidden m--hiding'></div>");
  var is_shown = false;

  var build = function(options, el, chosen) {
    $menu.html("");
    $menu.attr("style", "");
    if (el) {
      $menu.append("<div class='__option default' value='" + chosen.value + "'>" + chosen.text + "</div>")

      options.forEach(function(option) {
        $menu.append("<div class='__option' value='" + option.value + "'>" + option.text + "</div>");
      });


    } else {
      options.forEach(function(option) {
        $menu.append("<div class='__option' onclick='" + option.func + "()'>" + option.text + "</div>");
      });
    }
    context_menu.bind_selects(el);
  }

  function reposition(el) {
    c_rect = el.getBoundingClientRect();
    $menu.removeAttr('style');

    $menu.css({
      "top": c_rect.top + "px",
      "left": c_rect.left + "px",
      "width": c_rect.width + "px",
    });

    menu_rect = $menu[0].getBoundingClientRect();


    if (menu_rect.top + menu_rect.height > $(window).height()) {
      $menu.css({
        "bottom": 0,
        "top": "auto",
      })
    }

    if (menu_rect.left + menu_rect.width > $(window).width()) {
      $menu.css({
        "right": 0,
        "left": "auto",
      })
    }
  }

  exports = {
    $: $menu,
    reposition: reposition,
    bind_selects: function(el) {
      $menu.find(".__option").click(function(event) {
        context_menu.hide();
        $(el).find('input').val($(this).attr('value')).change();
        $(el).children('.__display').text($(this).text());
        ($(el).find('input').val(), $(el).find('input'));
      });
    },
    show: function(options, el, chosen, sectioned) {
      $("body").append($menu);
      if (is_shown) {
        context_menu.hide();
      }

      if (sectioned) {
        context_menu.build_section_select(options, el, chosen);
      } else {
        build(options, el, chosen);
      }

      reposition(el);

      $menu.removeClass('m--hidden')
      $menu.removeClass('m--hiding')
    },

    hide: function() {
      $menu.addClass('m--hiding')
      setTimeout(function() {
        $menu.addClass('m--hidden')
        $menu.removeAttr('style')
      }, 150);
    }
  }
  return exports;
})();

$(document).scroll(function(event) {
  context_menu.hide();
});

context_menu.build_section_select = function(sections, el, chosen) {
  context_menu.$.html("");
  context_menu.$.attr("style", "");

  var option_template = function(option_data) {
    var $new_option = $('<div class="__option" value="' +
      option_data.value + '">' +
      option_data.text + '</div>');
    if (option_data.chosen) {
      $new_option.addClass('default');
    }

    return $new_option;
  }

  context_menu.$.append(option_template(chosen));

  var section_template = function(heading, options) {
    var $new_section = $('<section><h3>' +
      heading +
      '</h3></section>');

    options.forEach(function(option_data) {
      var $option = option_template(option_data);
      $new_section.append($option);
    });

    return $new_section;
  }

  for (var title in sections) {
    var options = sections[title];
    var $new_section = section_template(title, options);
    context_menu.$.append($new_section);
  }


  context_menu.$.find('section').each(function(index, el) {
    accordion.add($(this), 'h3');
    $(this).addClass('m--show');
  });

  context_menu.$.find('.m--accordion-toggle').click();

  context_menu.$.find('.m--accordion-toggle').click(function() {
    context_menu.reposition(el);
  });

  context_menu.bind_selects(el);
}
