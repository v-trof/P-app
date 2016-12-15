results_display.update_mark = function(mark, test_score) {
  panel.actions.show();
  panel.actions.html('<b class="summary-mark">' + mark.value
                    + "</b>" + '(' + test_score.score + ' из '
                    + test_score.overall_score + ')');
  $('.summary-mark').addClass('m--' + mark.quality);
  $('.summary-mark').css('margin-right', '.5em');
}
