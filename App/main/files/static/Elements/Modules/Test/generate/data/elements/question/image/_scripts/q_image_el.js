generate.register.element('question', 'image', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    var $image = $(document.createElement('img'));

    $image.attr("src", value.url || value.href);
    $image.css('max-width', '100%');
    $new_element.css({
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });

    $new_element.append($image);

    return $new_element;
  },
  sample: {
    value: {
      url: "/media/samples/image.jpg"
    }
  }
});
