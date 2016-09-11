test_manager.share = function() {
  if (test_manager.verify_test()){
    popup.show('{% include "Pages/Test/editor/_popup_texts/share/exports.html" %}', function() {

      inline_editor.start($('.popup--share .__description')[0]);

    $("#share").click(function() {
    	var type="{{type}}";
    	var tags={};
    	tags["general"]=$('.popup--share .tags')[0].value;
    	tags["objective"]=$('.popup--share .tags')[1].value;
    	console.log(tags)
    	var formData = new FormData();
		formData.append("description", $('.popup--share .__description')[0].value);
		formData.append("course_id", "{{course.id}}");
		formData.append("type", type);
		formData.append("tags", JSON.stringify(tags));
		{% if type == 'test' %}
			formData.append("item_id", "{{test.id}}");
		{% else %}
			formData.append("item_id", "{{material.id}}");
		{% endif %}
		formData.append('csrfmiddlewaretoken', '{{csrf_token}}');

        $.ajax({
		type:"POST",
		url:"/func/share/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response) {
			notification.show(response["type"], response["message"]);
			popup.hide();
		}
	});
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
