$(document).ready(function() {
  $("#material_save").click(function(event) {
    test_manager.save();
  });

  $("#material_publish").click(function(event) {
    test_manager.publish_material();
  });

  $("#material_unpublish").click(function(event) {
    test_manager.unpublish();
  });

  $("#material_delete").click(function(event) {
    test_manager.delete();
  });
});