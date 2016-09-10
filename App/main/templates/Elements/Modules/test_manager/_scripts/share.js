test_manager.share = function() {
  if (test_manager.verify_test()){
    popup.show('{% include "Pages/Test/editor/_popup_texts/share/exports.html" %}', function() {

      inline_editor.start($('.popup--share .__description')[0]);
      $("#share").click(function() {
        //share ajax
        $("#{{type}}_share").hide();
        $("#{{type}}_unshare").show();
      });
    });
  } else {
    popup.show('{% include "Pages/Test/editor/_popup_texts/no_publish/exports.html" %}',
			function() {
			$(".__ok").click(function(event) {
				popup.hide();
			});
		});
  }
}
