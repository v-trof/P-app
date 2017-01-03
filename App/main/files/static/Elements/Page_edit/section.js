section_editor.add_section=function(e){return $new_section=section_editor.$section_template.clone(),section_editor.$parent.append($new_section),accordion.add($new_section,section_editor.heading_selector),section_editor.start_section_editing($new_section),section_editor.check_empty($new_section),section_editor.move_unordered(),$("body").scrollTo($new_section,{offset:-80}),section_editor.fix_pull_put(),$new_section},section_editor.block_editing=function(){pull_put.puller.cancel(),pull_put.is_pulled=!0,section_editor.$add_button.hide()},section_editor.check_empty=function(e){return"_all"===e?(section_editor.$parent.find(section_editor.section_selector).each(function(e,t){section_editor.check_empty($(this))}),section_editor.move_unordered(),!1):void(0==e.children(section_editor.item_selector).length?0==e.children(".m--empty").length&&e.append(section_editor.create_empty()):e.children(".m--empty").remove())},section_editor.create_empty=function(){var e=$('<div class="m--empty">'+section_editor.empty_message+"</div>");return indicator.add(e,"add",1),pull_put.put_zone.add(e,function(e,t,i){t.after(i),pull_put.reset(),section_editor.check_empty("_all")},section_editor._put_callback),e},section_editor={},section_editor.init_done=!1,section_editor.init=function(arguments){section_editor.$parent=arguments.$parent.first(),defined(arguments.$section_template)?section_editor.$section_template=arguments.$section_template:section_editor.$section_template=$('<section class="course-part"><h3>Новая секция</h3></section>'),section_editor.section_selector=arguments.section_selector,section_editor.heading_selector=arguments.heading_selector,section_editor.item_selector=arguments.item_selector,defined(arguments.empty_message)?section_editor.empty_message=arguments.empty_message:section_editor.empty_message="Пустая секция",defined(arguments.add_button_text)?section_editor.add_button_text=arguments.add_button_text:section_editor.add_button_text="Добавить секцию",defined(arguments.replace)?section_editor.replace=arguments.replace:section_editor.replace=!1,defined(arguments.no_publish)?section_editor.no_publish=arguments.no_publish:section_editor.no_publish=!1,defined(arguments.accordion)?section_editor.accordion=arguments.accordion:section_editor.accordion=!1,defined(arguments.edit_start)?section_editor.edit_start=arguments.edit_start:section_editor.edit_start=function(){},defined(arguments.edit_end)?section_editor.edit_end=arguments.edit_end:section_editor.edit_end=function(){},defined(arguments._save_callback)?section_editor._save_callback=arguments._save_callback:section_editor._save_callback=function(){},defined(arguments._put_callback)?section_editor._put_callback=arguments._put_callback:section_editor._put_callback=function(){},defined(arguments.pull)?(defined(arguments.pull.actions)?section_editor.pull=arguments.pull:section_editor.pull.actions=[],section_editor.pull.func=arguments.pull.func||function(){}):section_editor.pull={actions:[],func:function(){}};var e=arguments.unordered_heading;section_editor.$parent.find(section_editor.section_selector).each(function(t,i){$(this).find(section_editor.heading_selector).text()===e&&(section_editor.$unordered=$(this),section_editor.$parent.prepend(section_editor.$unoredered))}),setTimeout(function(){defined(section_editor.$unordered)||(section_editor.$unordered=section_editor.add_section(),section_editor.$unordered.find(section_editor.heading_selector).text(e),section_editor.end_section_editing(section_editor.$unordered)),section_editor.no_publish&&section_editor.$unordered.find(section_editor.item_selector).addClass("m--was-unpublished")},100),section_editor.$add_button=$('<a class="m--card"><button class="m--flat" id="edit_toggle">'+section_editor.add_button_text+"</button></a>"),$(".linkbox").last().append(section_editor.$add_button),section_editor.$add_button.click(function(e){section_editor.add_section()}),section_editor.block_editing(),section_editor.$parent.find(".m--empty").remove(),section_editor.check_empty("_all"),pull_put.cancel_action=indicator.hide,section_editor.init_done=!0},edit.end=function(){section_editor.block_editing(),section_editor.edit_end(),section_editor.$parent.find(section_editor.section_selector).each(function(e,t){section_editor.end_section_editing($(this))}),section_editor._save_callback()},section_editor.end_section_editing=function(e,t){var i=e.children(section_editor.item_selector);i.each(function(e,t){$(this).removeAttr("tip")}),e.find(section_editor.heading_selector).removeClass("m--editing").attr("contenteditable","false"),e.find(".m--button-delete").remove(),!section_editor.replace||defined(t)&&t||i.replaceTag(section_editor.items_old_tag,!0)},section_editor.fix_pull_put=function(){$(".m--stand-out").removeClass("m--stand-out"),$(".indicator").slice(-4).each(function(){$(this).parent().addClass("m--stand-out")}),pull_put.ui.additional_margin=24},section_editor.move_unordered=function(){defined(section_editor.$unordered)&&section_editor.$unordered.children(".m--empty").length>0&&section_editor.$parent.append(section_editor.$unordered)},edit.start=function(){pull_put.is_pulled=!1,section_editor.$add_button.show(),section_editor.$parent.find(section_editor.section_selector).each(function(e,t){section_editor.start_section_editing($(this))}),section_editor.end_section_editing(section_editor.$unordered,!0),section_editor.edit_start(),section_editor.fix_pull_put()},section_editor.start_section_editing=function(e){if("function"!=typeof e){var t=e.children(section_editor.item_selector);e.find(section_editor.heading_selector).addClass("m--editable").addClass("m--editing").attr("contenteditable","true"),button_delete.add(e,function(){section_editor.$unordered.append(t),section_editor.check_empty(section_editor.$unordered)}),e.find(".m--button-delete").addClass("m--l-2").addClass("m--top-centered").css("top",e.find(".m--accordion-toggle").css("top")),section_editor.replace&&(defined(t[0])&&(section_editor.items_old_tag=t[0].tagName),t.replaceTag("div",!0),t=e.children(section_editor.item_selector)),t.each(function(e,t){$(this).attr("tip","Кликните, чтобы перемещать");var i=$(this).hasClass("m--was-unpublished");pull_put.puller.add($(this),section_editor.pull.actions,section_editor.pull.additional,function(){indicator.show(2),i||(indicator.show(1),section_editor.pull.func())}),i?indicator.add($(this),"down",2):indicator.add($(this),"down",1),pull_put.put_zone.add($(this),function(e,t,o){o.hasClass("m--was-unpublished")&&!i||(t.after(o),pull_put.reset(),section_editor.fix_pull_put())},function(e){section_editor.check_empty("_all"),section_editor._put_callback(e)})})}};