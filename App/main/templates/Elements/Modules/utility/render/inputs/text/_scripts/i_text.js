render.inputs.text = function(label, name, value) {
  var $input = $(loads.get("Elements/Inputs/text/"));
  $input.find('label').text(label);
  $input.find('input').attr('name', name).val(value);

  check_if_filled($input.find('input'));

  return $input;
}
