render.inputs.textarea = function(label, name, value, inject_editor) {
  var $input = $(loads.get("Elements/Inputs/text/textarea/"));
  $input.find('label').text(label);
  $input.find('.__value').attr('name', name).html(value);

  check_if_filled($input.find('.__value'));
  if(inject_editor) inline_editor.start($input.find('.__value')[0]);

  return $input;
}
