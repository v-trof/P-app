generate.register.element('question', 'file', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    var $file_template = $(loads.get("Elements/card/file/exports.html"));

    $file_template.attr("href", value.url);
    $file_template.find(".__name").text(value.name);
    $file_template.find(".__size").text(value.size);

    $new_element.append($file_template);

    return $new_element;
  },
  sample: {
    value: {
      name: "Файл для скачивания",
      size: "3.21МБ",
      pos: undefined,
      url: "https://thetomatos.com/wp-content/uploads/2016/05/file-clipart-3.png"
    }
  }
});
