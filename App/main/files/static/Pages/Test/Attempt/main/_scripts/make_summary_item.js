var attempt = attempt || {};

attempt.icons = {

}

attempt.make_summary_item = function(show_index, value, real_index, $sync_element) {
  var $summary_item = $(loads.get("Pages/Test/attempt/main/summary_item/"));
  var data = generate.data[$sync_element.attr('type')]
                [$sync_element.attr('subtype')].external;
  var $value = $summary_item.find('.__value');
  var $icon = $summary_item.find('.__icon');

  function _check() {
    $value.html(data.get_summary($sync_element));


    //set spinner
    attempt.send_value(
     real_index, data.get_value($sync_element),
     function() {
       //set synced
     },
     function() {
       //set failed
     });
  }

  console.log(generate.data[$sync_element.attr('type')]
                [$sync_element.attr('subtype')]);

  $summary_item.find('.__number').html(show_index + " ");

  $value.html(value);
  $icon.html(loads['Elements/Icons/minus.svg']);

  data.observer($sync_element, _check);

  return $summary_item;
}
