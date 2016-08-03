function add_menu_caller_sectioned(select) {
  
  select_init(select);

  $(select).click(function(e) {
    var sections = {};
    var chosen = {};
    var is_disabled = $(this).attr('disabled');
    
    if(is_disabled == "disabled") return;

    var current_value = $(this).children('input').val();

    var title;

    $(this).children('.section').each(function() {

      title = $(this).find('h3').text();

      sections[title] = [];

      $(this).children('option').each(function(index, el) {
        if($(this).attr("value") != current_value) {
          sections[title].push({
            text : $(this).text(),
            value: $(this).attr("value")
          })
        } else {
          chosen = {
            text : $(this).text(),
            value: $(this).attr("value"),
            chosen: true
          }
        }
      });
    });

     if(!chosen.text) {
      chosen = {
        text : $(this).children('option').first().text(),
        value : $(this).children('option').first().attr("value"),
        chosen: true
      }
    }
    
    if(is_disabled != "disabled" && is_disabled !="true") {

      console.log(sections);
      context_menu.show(sections, this, chosen, true);
    }
  });
}

$(document).ready(function() {
  $(".--sectioned").each(function(index, el) {
    add_menu_caller_sectioned(this);
  });
});
