context_menu.build_section_select = function(sections, el, chosen) {
  context_menu.$.html("");
  context_menu.$.attr("style", "");

  var option_template = function(option_data) {
    var $new_option = $('<div class="__option" value="'
                        + option_data.value + '">'
                        + option_data.text + '</div>');
    if(option_data.chosen) {
      $new_option.addClass('default');
    }

    return $new_option;
  }

  context_menu.$.append(option_template(chosen));

  var section_template = function(heading, options) {
    var $new_section = $('<section><h3>'
                          + heading +
                         '</h3></section>');

    options.forEach(function(option_data) {
      var $option = option_template(option_data);
      $new_section.append($option);
    });

    return $new_section;
  }

  for(var title in sections) {
    var options = sections[title];
    var $new_section = section_template(title, options);
    context_menu.$.append($new_section);
  }

  
  context_menu.$.find('section').each(function(index, el) {
    accordion.add($(this), 'h3');
    $(this).addClass('--show');
  });
  

  context_menu.$.find('.--accordion-toggle').click();
  context_menu.bind_selects(el);
}
