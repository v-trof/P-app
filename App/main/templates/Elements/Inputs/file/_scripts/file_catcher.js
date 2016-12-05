var file_catcher = {}

file_catcher.add = function($file_input) {
  console.log('catching at', $file_input);
  $file_input = $($file_input).first();

  $input_button = $file_input.find(".__choose");
  $input_text = $file_input.find(".__text");
  $input_value = $file_input.find(".__value");

  var container = {
    button: $input_button,
    value: $input_value,
    text: $input_text,
    name: ""
  };

  $input_button.click(function(event) {
    $input_value.click();
  });

  $input_value.change(function(event) {
    container.files = event.target.files;
    container.urls = []
    var file_name = $input_value.val().replace( "C:\\fakepath\\", '' );

    for (var i = 0; i < container.files.length; i++) {
      container.urls.push(
        URL.createObjectURL(container.files[i])
      );
      container.name = file_name;
    }

    $input_text.text(file_name);
  });

  return container;
}
