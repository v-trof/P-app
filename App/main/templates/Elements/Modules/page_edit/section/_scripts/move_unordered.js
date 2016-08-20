//check if unordered is empty to put it in the end
//this command is used by function that creates $unordered
//if they didn't exist
section_editor.move_unordered = function() {
  if(defined(section_editor.$unordered)) {
    if(section_editor.$unordered.children('.m--empty').length > 0 ) {
      section_editor.$parent.append(section_editor.$unordered)
    }
  }
}
