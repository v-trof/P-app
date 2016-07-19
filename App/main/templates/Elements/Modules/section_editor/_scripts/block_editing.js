section_editor.block_editing = function() {
	//disable puller
	pull_put.puller.cancel()
	pull_put.is_pulled = true
	section_editor.$add_button.hide()
}