test_manager.publish = function() {
	console.log("publish");
	popup.show('{% include "Pages/Test/editor/_popup_texts/publish/exports.html" %}', function() {
		popup.$.find(".__max_ponts").text($(".preview .__answer-field").length)
	});
}