function defined(variable) {
	if(typeof variable !== typeof undefined) {
		return true
	} else {
		return false
	}
}
 
section_editor = {}

section_editor.init = function(arguments) {
	/*

	*-> required

	ARGUMENTS:
	---
	*$parent           | jQuery object | where all sections are contained
	*$section_template | jQuery object | empty section for creating new sections
	*section_selector  | string        | if other tag was used etc.
	*heading_selector  | string        | for finding heading in sections
	*item_selector     | string        | how to find what is in sections
	
	empty_message      | string        | what to dispaly in empty section
	add_button_text    | string        | what to write on add_button

	replace            | bool(false)   | turn items into divs for blocking actions
	accordion          | bool(true)    | adds accordion to new_group
	
	edit_start         | fucntion      | additinal fucntion for edit start
	edit_end           | fucntion      | additinal fucntion for edit end

	unordered_finder   | function      | return unordered group for deletion cases
	unordered_heading* | function      | if there is no unoredered create it
	_save_callback     | function      | what to do on save_changes
	_put_callback      | function      | what to do when item was moved
	

	pull {
		actions        | array   ([])  | default pull put actions
		additional     | object        | pull_put additional action | if needed
	}
	*/


	//accept required arguments
	section_editor.$parent = arguments.$parent.first()
	section_editor.$section_template = arguments.$section_template

	section_editor.section_selector = arguments.section_selector
	section_editor.heading_selector = arguments.heading_selector
	section_editor.item_selector = arguments.item_selector

	//set empty_message
	if( ! defined(arguments.empty_message)) {
		section_editor.empty_message = 'Пустая секция'
	} else {
		section_editor.empty_message = arguments.empty_message
	}

	//set add_button_text
	if( ! defined(arguments.add_button_text)) {
		section_editor.add_button_text = 'Добавить секцию'
	} else {
		section_editor.add_button_text = arguments.add_button_text
	}

	//set repalce
	if( ! defined(arguments.replace)) {
		section_editor.replace = false
	} else {
		section_editor.replace = arguments.replace
	}


	//set accordion
	if( ! defined(arguments.accordion)) {
		section_editor.accordion = false
	} else {
		section_editor.accordion = arguments.accordion
	}

	//set edit_start
	if( ! defined(arguments.order)) {
		section_editor.edit_start = function(){}
	} else {
		section_editor.edit_start = arguments.edit_start
	}


	//set edit_end
	if( ! defined(arguments.order)) {
		section_editor.edit_end = function(){}
	} else {
		section_editor.edit_end = arguments.edit_end
	}
	

	//set _save_callback
	if( ! defined(arguments.order)) {
		section_editor._save_callback = function(){}
	} else {
		section_editor._save_callback = arguments._save_callback
	}


	//set _put_callback
	if( ! defined(arguments.order)) {
		section_editor._put_callback = function(){}
	} else {
		section_editor._put_callback = arguments._put_callback
	}

	if(defined(arguments.pull)) {
		if( ! defined(arguments.pull.actions)) {
			section_editor.pull.actions = []
		} else {
			section_editor.pull = arguments.pull
		}
	} else {
		section_editor.pull = {
			actions: []
		}
	}

	//find unordered
	if(defined(arguments.unordered_finder)) {
		section_editor.$unordered = arguments.unordered_finder()
	}

	if( ! defined(section_editor.$unordered)) {
		section_editor.$unordered = section_editor.add_section()

		section_editor.$unordered.find(section_editor.heading_selector)
			.text(arguments.unordered_heading)

		section_editor.end_section_editing(section_editor.$unordered)
	} else {
		section_editor.$parent.prepend($unordered)
	}


	//finish startup
	section_editor.$add_button = $('<a class="--card">'
		+ '<button class="--flat" id="edit_toggle">' + section_editor.add_button_text
		+ '</button></a>');

	$(".linkbox").last().append(section_editor.$add_button);

	section_editor.$add_button.click(function(event) {
		section_editor.add_section();
	});

	section_editor.block_editing()
}