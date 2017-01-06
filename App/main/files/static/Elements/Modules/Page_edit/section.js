section_editor = {}

section_editor.init_done = false
section_editor.init = function(arguments) {
  /*

  *-> required

  ARGUMENTS:
  ---
  *$parent           | jQuery object | where all sections are contained
  *$section_template | jQuery object | empty section for creating new sections
  *section_selector  | string        | if other tag was used etc.
  *heading_selector  | string        | for finding heading in sections
  *item_selector     | string        | how to find what is in sections

  empty_message      | string        | what to dispaly in empty section
  add_button_text    | string        | what to write on add_button

  replace            | bool(false)   | turn items into divs for blocking actions
  accordion          | bool(true)    | adds accordion to new_group
  no_publish         | bool(false)   | items in urorderd cannout be moved elsewhere

  edit_start         | fucntion      | additinal fucntion for edit start
  edit_end           | fucntion      | additinal fucntion for edit end

  unordered_heading* | function      | if there is no unoredered create it
  _save_callback     | function      | what to do on save_changes
  _put_callback      | function      | what to do when item was moved


  pull {
    actions        | array   ([])  | default pull put actions
    additional     | object        | pull_put additional action | if needed
    func           | function      |
  }
  */

  // console.log(arguments)

  //accept required arguments
  section_editor.$parent = arguments.$parent.first()
  if (defined(arguments.$section_template)) {
    //maginificatn hotifx
    section_editor.$section_template = arguments.$section_template
  } else {
    section_editor.$section_template = $('<section class="course-part"><h3>Новая секция</h3></section>')
  }

  section_editor.section_selector = arguments.section_selector
  section_editor.heading_selector = arguments.heading_selector
  section_editor.item_selector = arguments.item_selector

  //set empty_message
  if (!defined(arguments.empty_message)) {
    section_editor.empty_message = 'Пустая секция'
  } else {
    section_editor.empty_message = arguments.empty_message
  }

  //set add_button_text
  if (!defined(arguments.add_button_text)) {
    section_editor.add_button_text = 'Добавить секцию'
  } else {
    section_editor.add_button_text = arguments.add_button_text
  }

  //set repalce
  if (!defined(arguments.replace)) {
    section_editor.replace = false
  } else {
    section_editor.replace = arguments.replace
  }

  if (!defined(arguments.no_publish)) {
    section_editor.no_publish = false
  } else {
    section_editor.no_publish = arguments.no_publish
  }


  //set accordion
  if (!defined(arguments.accordion)) {
    section_editor.accordion = false
  } else {
    section_editor.accordion = arguments.accordion
  }

  //set edit_start
  if (!defined(arguments.edit_start)) {
    section_editor.edit_start = function() {}
  } else {
    section_editor.edit_start = arguments.edit_start
  }


  //set edit_end
  if (!defined(arguments.edit_end)) {
    section_editor.edit_end = function() {}
  } else {
    section_editor.edit_end = arguments.edit_end
  }


  //set _save_callback
  if (!defined(arguments._save_callback)) {
    section_editor._save_callback = function() {}
  } else {
    section_editor._save_callback = arguments._save_callback
  }


  //set _put_callback
  if (!defined(arguments._put_callback)) {
    section_editor._put_callback = function() {}
  } else {
    section_editor._put_callback = arguments._put_callback
  }


  if (defined(arguments.pull)) {
    if (!defined(arguments.pull.actions)) {
      section_editor.pull.actions = []
    } else {
      section_editor.pull = arguments.pull
    }
    section_editor.pull.func = arguments.pull.func || function() {};
  } else {
    section_editor.pull = {
      actions: [],
      func: function() {}
    }
  }
  //pull func

  var unordered_heading = arguments.unordered_heading

  //find unordered
  section_editor.$parent.find(section_editor.section_selector)
    .each(function(index, el) {
      if ($(this).find(section_editor.heading_selector)
        .text() === unordered_heading) {
        section_editor.$unordered = $(this)

        section_editor.$parent.prepend(section_editor.$unoredered)
      }
    })

  setTimeout(function() {
    if (!defined(section_editor.$unordered)) {
      section_editor.$unordered = section_editor.add_section()

      section_editor.$unordered.find(section_editor.heading_selector)
        .text(unordered_heading)

      section_editor.end_section_editing(section_editor.$unordered)
    }

    if (section_editor.no_publish) {
      section_editor.$unordered.find(section_editor.item_selector)
        .addClass('m--was-unpublished')
    }
  }, 100)


  //finish startup
  section_editor.$add_button = $('<a class="m--card">' +
    '<button class="m--flat" id="edit_toggle">' + section_editor.add_button_text +
    '</button></a>')

  $(".linkbox").last().append(section_editor.$add_button)

  section_editor.$add_button.click(function(event) {
    section_editor.add_section()
  })

  section_editor.block_editing()

  //repalceing native empties
  section_editor.$parent
    .find('.m--empty').remove();

  section_editor.check_empty('_all');

  pull_put.cancel_action = indicator.hide;

  section_editor.init_done = true
}

section_editor.add_section = function(edit_start) {
  // console.log('resutn');
  $new_section = section_editor.$section_template.clone()

  section_editor.$parent.append($new_section)

  accordion.add($new_section, section_editor.heading_selector)
  section_editor.start_section_editing($new_section)

  section_editor.check_empty($new_section)
  section_editor.move_unordered()
  $('body').scrollTo($new_section, {
    offset: -80
  });

  section_editor.fix_pull_put();
  return $new_section;
}

section_editor.block_editing = function() {
  //disable puller
  pull_put.puller.cancel()
  pull_put.is_pulled = true
  section_editor.$add_button.hide()
}

section_editor.check_empty = function($section) {
  //all
  if ($section === '_all') {
    section_editor.$parent.find(section_editor.section_selector)
      .each(function(index, el) {
        section_editor.check_empty($(this))
      })
    section_editor.move_unordered()
    return false
  }

  //one
  if ($section.children(section_editor.item_selector).length == 0) {
    //is_empty
    if ($section.children('.m--empty').length == 0) {
      //empty state is not displayed
      $section.append(section_editor.create_empty())
    }
  } else {
    //is not empty
    $section.children('.m--empty').remove()
  }
}


section_editor.create_empty = function() {
  var $empty = $('<div class="m--empty">' +
    section_editor.empty_message +
    '</div>')

  indicator.add($empty, 'add', 1)

  //putzone
  pull_put.put_zone.add($empty, function(event, $this, $put) {
    $this.after($put)
    pull_put.reset()
    section_editor.check_empty('_all')
  }, section_editor._put_callback)

  return $empty
}

$(document).ready(function() {
  edit.end = function() {
    section_editor.block_editing()
    section_editor.edit_end()

    section_editor.$parent
      .find(section_editor.section_selector).each(function(index, el) {
        section_editor.end_section_editing($(this))
      })

    section_editor._save_callback()
  }
});

section_editor.end_section_editing = function($section, dont_replace) {
  var $items = $section.children(section_editor.item_selector)
  $items.each(function(index, el) {
    $(this).removeAttr("tip");
  });

  //end heading edition
  $section.find(section_editor.heading_selector)
    .removeClass('m--editing')
    .attr('contenteditable', 'false')

  //remove button_delete
  $section.find('.m--button-delete').remove()

  //replace_tags
  if (section_editor.replace &&
    (!defined(dont_replace) || !dont_replace)) {
    $items.replaceTag(section_editor.items_old_tag, true)
  }
}

section_editor.fix_pull_put = function() {
  $(".m--stand-out").removeClass('m--stand-out');

  $('.indicator').slice(-4).each(function() {
    $(this).parent().addClass("m--stand-out");
  });

  pull_put.ui.additional_margin = 24;
}

//check if unordered is empty to put it in the end
//this command is used by function that creates $unordered
//if they didn't exist
section_editor.move_unordered = function() {
  if (defined(section_editor.$unordered)) {
    if (section_editor.$unordered.children('.m--empty').length > 0) {
      section_editor.$parent.append(section_editor.$unordered)
    }
  }
}

$(document).ready(function() {
  edit.start = function() {
    //enable puller
    pull_put.is_pulled = false
    section_editor.$add_button.show()

    section_editor.$parent
      .find(section_editor.section_selector).each(function(index, el) {
        section_editor.start_section_editing($(this))
      })

    section_editor.end_section_editing(section_editor.$unordered, true)

    section_editor.edit_start();

    section_editor.fix_pull_put();
  }
});

section_editor.start_section_editing = function($section) {
  // console.log(typeof $section, $section);
  if (typeof $section === 'function') return;

  var $items = $section.children(section_editor.item_selector)

  //start heading edition
  $section.find(section_editor.heading_selector)
    .addClass('m--editable')
    .addClass('m--editing')
    .attr('contenteditable', 'true')

  //add button_delete
  button_delete.add($section, function() {
    section_editor.$unordered.append($items)
    section_editor.check_empty(section_editor.$unordered)
  })

  $section.find('.m--button-delete')
    .addClass('m--l-2')
    .addClass('m--top-centered')
    .css('top', $section.find('.m--accordion-toggle').css('top'))

  //replace_tags
  if (section_editor.replace) {
    if (defined($items[0])) {
      section_editor.items_old_tag = $items[0].tagName
    }

    $items.replaceTag('div', true)
    $items = $section.children(section_editor.item_selector)
  }

  /*  console.log(
      $section !== section_editor.$unordered,
      $section,
      section_editor.$unordered)
  */
  //pull_put things for items
  $items.each(function(index, el) {
    $(this).attr("tip", "Кликните, чтобы перемещать");
    var was_unpublished = $(this).hasClass('m--was-unpublished');
    //add pullers
    // console.log(this);
    pull_put.puller.add(
      $(this),
      section_editor.pull.actions,
      section_editor.pull.additional,
      function() {
        // console.log('2')
        indicator.show(2);
        if (!was_unpublished) {
          // console.log('1')
          indicator.show(1)
          section_editor.pull.func();
        }
      }
    )

    if (was_unpublished) {
      indicator.add($(this), 'down', 2)
    } else {
      indicator.add($(this), 'down', 1)
    }

    pull_put.put_zone.add($(this), function(event, $this, $put) {
      if ($put.hasClass('m--was-unpublished')) {
        // console.log("WUNP", $this.parent() === section_editor.$unordered);
        if (!was_unpublished) return;
      }
      $this.after($put);
      pull_put.reset();
      section_editor.fix_pull_put();
    }, function($put_zone) {
      section_editor.check_empty('_all')
      section_editor._put_callback($put_zone)
    })
  })
}
