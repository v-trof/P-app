generate.register.edit('answer', 'checkbox', {
  random_possible: true,
  builder: function(value) {
    var $new_edit = this.make_template();

    var create_field = function(label) {
      var $checkbox = $(loads.get('Elements/Inputs/checkbox/'));
      var $input = render.inputs.text('', '', label);

      var $field = $("<div class='__edit_item'></div>");
      $field.append($checkbox).append($input);
      button_delete.add($field);

      return $field;
    }

    if(value.items && value.items.length) {
      value.items.forEach(function(label, index) {
        var $field = create_field(label);

        $new_edit.append($field);
        if(value.answer.has(index)) {
          $field.find('[type="checkbox"]')[0].checked = true;
        }
      });
    } else {
      $new_edit.append(create_field());
    }


    var $add_option = $("<button class='__add_option'>Ещё вариант</button>");

    $new_edit.append($add_option);

    $add_option.click(function() {
      $add_option.before(create_field());
    });

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      items: [],
      answer: []
    }

    $edit.find(".m--checkbox").each(function(index, el) {
      var label = $(el).siblings().find(".__value").val();

      value.items.push(label);

      if($(el).find("input").is(":checked")) {
        value.answer.push(index);
      }
    });

    return value;
  }
});
