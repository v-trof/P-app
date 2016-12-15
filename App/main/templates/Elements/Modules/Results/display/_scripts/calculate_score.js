results_display.calculate_score = function() {
  var $current = $('.set_mark .__current');
  var $max = $('.set_mark .__max');

  var current = 0, max = 0;

  $current.each(function() {
    current += parseInt(this.innerHTML);
  });

  $max.each(function() {
    max += parseInt(this.innerHTML);
  });

  return {
    'score': current,
    'overall_score': max
  }
}
