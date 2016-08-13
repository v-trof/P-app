editor.check_empty = function() {

  var generate_selector = {
    question: '.__question-element',
    answer: '.__answer-field'
  }

  //loop through questions
  // console.log(this.content_selector);
  $('.preview ' + this.content_selector).each(function(index, el) {
    var $task = $(this);
    editor.active_types.forEach(function(type) {
      var empty_class = '.'+editor.empty[type].class;
      //loop check if empty questions
      if($task.children(generate_selector[type]).length == 0) {
        //empty
        if($task.children(empty_class).length == 0) {
          //empty not displayed
          var $empty = editor.create_empty(type);

          if(type === "question") {
            $task.prepend($empty);
          } else {
            $task.append($empty);
          }
        } 
      } else {
        //ok
        $task.children(empty_class).remove();
      }
    });
  });
}

editor.create_empty = function(type) {
  var $empty = this.empty[type].template.clone();
  
  generate.edit.add_put_zone($empty, function($this, $pulled) {
    $this.replaceWith($pulled);
  });
  indicator.add($empty, 'add', 1);
  
  return $empty;
}
