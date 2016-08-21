/*****************************************************
 * Test/generate/core/register | Registers element
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

    data[data_type] = data_value;

    data[data_type].self = data;
    return data;
  },

  element: function element(type, subtype, element_data) {
    if (!(type && subtype)) return false;

    //args are fine
    var data = this.bind_data(type, subtype, 'element', element_data);

    //creates proper build function
    data.element.make_template = function() {
      return generate.make_template.element[type](subtype);
    }

    //builds sample elemnet for parse ingorance
    data.element.sample.build = function() {
      var $sample_element = data.element.build(this.value);
      $sample_element.attr('no_parse', 'true');

      return $sample_element;
    }

    data.element.parse = function($element) {
      var value = {};

      if (!$el.attr('no_parse')) {
        value = this.parser($element);
      }

      //types for back
      value.type = type;
      value.subtype = subtype;

      return value;
    }

    return true;
  },
  edit: function(type, subtype, edit_data) {
    if (!(type && subtype)) return false;

    var data = this.bind_data(type, subtype, 'edit', edit_data);

    data.edit.make_template = function() {
      return generate.make_template.edit[type](subtype);
    }
  },
  external: function(type, subtype, external_data) {
    this.bind_data(type, subtype, 'external', external_data);
  }
}
