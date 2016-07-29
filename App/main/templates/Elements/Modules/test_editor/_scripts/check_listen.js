$("body").on("click", ".--button-delete, .pull_put_ui .__actions button", function() {
  editor.check_self();
});

$("body").on('click', '.pull_put_ui .__actions>div>button', function() {
  indicator.hide(1);
});
