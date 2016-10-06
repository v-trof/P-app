editor.edit.let = function($element) {
  pull_put.puller.add(
    $element,
    ['add', 'delete', 'save'],
    editor.edit.pull_put_actions.edit,
    function() {
      indicator.show(1);
    },
    false,
    true
  )

  pull_put.put_zone.add(
    $element,
    function(e, $this, $pulled) {
      $this.after($pulled);
      pull_put.reset();
    }

  )
  indicator.add($element, 'down', 1);
}
