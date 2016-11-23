generate.register.element = function element(type, subtype, element_data) {
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
}
