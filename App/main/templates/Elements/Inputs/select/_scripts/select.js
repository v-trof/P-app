function select_init(select) {
  $(select).append('<option value="">Выберите...</option>')

  var last_option = $(select).find('option').last();
  
  setTimeout(function() {
    var max_w = 0;
    $(select).find('option').each(function(index, el) {
      max_w = Math.max($(this).outerWidth(), max_w);
    });
    $(select).children('.__display').css('min-width', max_w + "px");
  }, 300);
  
  $(select).children('input').val(last_option.attr("value"));
  $(select).children(".__display").text(last_option.text());
}

function add_menu_caller(select) {

  select_init(select);
  
  $(select).click(function(e) {
    var options = [];
    var chosen = {};
    var is_disabled = $(this).attr('disabled');

    if(is_disabled == "disabled") {
      return 0
    }
    var current_value = $(this).children('input').val();
    $(this).children('option').each(function(index, el) {
      if($(this).attr("value") != current_value) {
        options.push({
          text : $(this).text(),
          value: $(this).attr("value")
        })
      } else {
        chosen = {
          text : $(this).text(),
          value: $(this).attr("value")
        }
      }
    });

    if(is_disabled != "disabled" && is_disabled !="true") {
      context_menu.show(options, this, chosen);
    }
  });
}

$(document).ready(function() {
  $(".m--select:not(.m--sectioned)").each(function(index, el) {
    add_menu_caller(this);
  });
});
