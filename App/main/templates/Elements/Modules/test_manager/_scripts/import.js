test_manager.import = function() {
  popup.show('{% include "Pages/Test/editor/_popup_texts/share_item/exports.html" %}',
    function() {
    $("button").click(function(event) {
      popup.hide();
    });
  });
}
