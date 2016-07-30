function defined(variable) {
	if(typeof variable !== typeof undefined) {
		return true
	} else {
		return false
	}
}
 
section_editor = {}

section_editor.init_done = false
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
	no_publish         | bool(false)   | items in urorderd cannout be moved elsewhere

	edit_start         | fucntion      | additinal fucntion for edit start
	edit_end           | fucntion      | additinal fucntion for edit end

	unordered_heading* | function      | if there is no unoredered create it
	_save_callback     | function      | what to do on save_changes
	_put_callback      | function      | what to do when item was moved
	

	pull {
		actions        | array   ([])  | default pull put actions
		additional     | object        | pull_put additional action | if needed
	}
	*/

	console.log(arguments)

	//accept required arguments
	section_editor.$parent = arguments.$parent.first()
	if(defined(arguments.$section_template)) {
		//maginificatn hotifx
		section_editor.$section_template = arguments.$section_template
	} else {
		section_editor.$section_template = $('<section class="course-part"><h3>Новая секция</h3></section>')
	}

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

	if( ! defined(arguments.no_publish)) {
		section_editor.no_publish = false
	} else {
		section_editor.no_publish = arguments.no_publish
	}


	//set accordion
	if( ! defined(arguments.accordion)) {
		section_editor.accordion = false
	} else {
		section_editor.accordion = arguments.accordion
	}

	//set edit_start
	if( ! defined(arguments.edit_start)) {
		section_editor.edit_start = function(){}
	} else {
		section_editor.edit_start = arguments.edit_start
	}


	//set edit_end
	if( ! defined(arguments.edit_end)) {
		section_editor.edit_end = function(){}
	} else {
		section_editor.edit_end = arguments.edit_end
	}
	

	//set _save_callback
	if( ! defined(arguments._save_callback)) {
		section_editor._save_callback = function(){}
	} else {
		section_editor._save_callback = arguments._save_callback
	}


	//set _put_callback
	if( ! defined(arguments._put_callback)) {
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
	var unordered_heading = arguments.unordered_heading

	//find unordered
	section_editor.$parent.find(section_editor.section_selector)
	.each(function(index, el) {
		if($(this).find(section_editor.heading_selector)
			.text() === unordered_heading) {
			section_editor.$unordered = $(this)

			section_editor.$parent.prepend(section_editor.$unoredered)
		}
	})

	setTimeout(function(){
		if(!defined(section_editor.$unordered)) {
			section_editor.$unordered = section_editor.add_section()

			section_editor.$unordered.find(section_editor.heading_selector)
				.text(unordered_heading)

			section_editor.end_section_editing(section_editor.$unordered)
		}

	}, 100)
	
	if(section_editor.no_publish) {
		section_editor.$unordered.find(section_editor.item_selector)
			.addClass('--was-unpublished')
	}

	//finish startup
	section_editor.$add_button = $('<a class="--card">'
		+ '<button class="--flat" id="edit_toggle">' + section_editor.add_button_text
		+ '</button></a>')

	$(".linkbox").last().append(section_editor.$add_button)

	section_editor.$add_button.click(function(event) {
		section_editor.add_section()
	})

	section_editor.block_editing()

	//repalceing native empties
	section_editor.$parent
		.find('.--empty').remove();

	section_editor.check_empty('_all');

	pull_put.cancel_action = indicator.hide;
	
	section_editor.init_done = true
}
