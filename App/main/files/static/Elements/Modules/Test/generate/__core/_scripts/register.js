 /*****************************************************
 * Test/generate/core/(s)/register | Registers all data for elements
 * @method register
 * @param  {string} type (question|answer|task)
 * @param  {string} subtype (subtype)
 * @param  {object} element_data
 * @return void
 *****************************************************/
generate.register = {
  bind_data: function(type, subtype, data_type, data_value) {
    var data = generate.data[type][subtype] || {};
    generate.data[type][subtype] = data;
    data.type = type;
    data.subtype = subtype;

    data[data_type] = data_value;

    data[data_type].self = data;
    return data;
  },

  /**
   * Registers element to test_generate
   * @method element
   * @param  {string} type arhectype of created element
   * @param  {string} subtype type of created elemetn
   * @param  {Object} element_data how to parse and build it, sample values
   */
  element: function element(type, subtype, element_data) {
    if (!(type && subtype)) return false;

    var data = this.bind_data(type, subtype, 'element', element_data);

    //creates proper template build function
    data.element.make_template = function(args) {
      return generate.make_template.element[type](subtype, args);
    }

    //creates build wrapper
    data.element.build = function(value, is_sample) {
      var $element = data.element.builder(value);

      if(is_sample) return $element;

      if(defined(data.edit) &&
         typeof editor !== typeof undefined) {
           editor.edit.let($element);
      }

      if(defined(data.external)) {
        data.external.observe($element);
      }

      return $element;
    }

    //builds sample elemnet
    data.element.sample.build = function() {
      var $sample_element = data.element.build(data.element.sample.value, true);

      return $sample_element;
    }

    data.element.parse = this.element.parser;

    return true;
  },

  edit: function(type, subtype, edit_data) {
    if (!(type && subtype)) return false;

    var data = this.bind_data(type, subtype, 'edit', edit_data);

    data.edit.make_template = function(args) {
      return generate.make_template.edit[type](subtype, args);
    }

    //make API constant
    data.edit.build = function(value) {
      var $edit = data.edit.builder(value);

      if(type === 'answer') {
        var $worth = render.inputs.text('Макс. балл', 'worth', (value.worth || 1));
        $edit.append($worth);

        if(data.edit.can_random) {
          //TODO make randmness constructor
        }
      }

      return $edit;
    }
    data.edit.parse = function($edit) {
      var value = data.edit.parser($edit);

      if(type === 'answer') {
        value.worth = $edit.find('[name="worth"]').val();
      }

      value.type = type;
      value.subtype = subtype;

      return value;
    }

    return true;
  },

  external: function(type, subtype, external_data) {
    if (!(type && subtype)) return false;

    var data = this.bind_data(type, subtype, 'external', external_data);

    //creating observe shortcut for summary and send
    data.external.observe = function($element) {
      data.external.observer($element, function() {
        var value = data.external.value($element);
        var summary = data.external.summary($element);

        attempt.change(value, summary);
      });
    }

    return true;
  },

  task: function(subtype, task_data) {
    var data = this.bind_data('task', subtype, 'element', task_data);
    data.build = task_data.builder;
  }
}
