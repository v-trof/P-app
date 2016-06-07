$(document).ready(function() {
	$("#test_save").click(function(event) {
		test_manager.save();
	});

	$("#test_publish").click(function(event) {
		console.log("p");
		test_manager.publish();
	});

	$("#test_unpublish").click(function(event) {
		test_manager.unpublish();
	});

	$("#test_delete").click(function(event) {
		test_manager.delete();
	});
});