section_editor.fix_pull_put = function() {
  $(".m--stand-out").removeClass('m--stand-out');

  $('.indicator').slice(-4).each(function() {
    $(this).parent().addClass("m--stand-out");
  });

  pull_put.ui.additional_margin = 24;
}
