$(document).ready(function() {
  var results = {{results|safe}};

  mark = results.mark;

  panel.actions.html("Оценка: <b class='m--" + mark.quality + 
    " result-mark'> " + 
    mark.value +"</b>");
});
