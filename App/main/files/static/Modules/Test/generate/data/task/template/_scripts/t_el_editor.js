$(document).ready(function(){generate.data.task.template.edit={observe_new_vars:function(e){e.find(".task .__value").keyup(function(){var t=[];e.find(".task .__value").each(function(){var e=generate.data.task.template.edit.check_for_vars($(this));e.forEach(function(e){t.indexOf(e)===-1&&t.push(e)})}),generate.data.task.template.edit.update_variables(t,e)})},check_for_vars:function(e){var t=/%\(([^()]+)\)/g,a="",i=[];for(e.val()?a=e.val():e.text()&&(a=e.text());result=t.exec(a);)i.push(result[1]);return i},build_variables:function(e,t){var a=t.find(".__variables");return 0===e.length?void a.html("Переменных нет.<br>Они создаются выражением:<br><i>%(название пременной)</i>"):(a.html(""),void e.forEach(function(e){function i(){var e=[];return a.find("input").each(function(){e.push({name:$(this).attr("name"),value:$(this).val()})}),e}var n=render.inputs.text(e.name,e.name,e.value);a.append(n),n.keyup(function(){if(editor.active_template.variables=i(),"preview"===editor.template_editor_mode){var e=generate.data.task.template.build(editor.active_template.parts,editor.active_template.variables,editor.active_template.group);e.find(".__actions button").css("pointer-events","none"),e.find(".__content").children().each(function(){$(this).unbind("click")}),t.find(".task").html(e),console.log("preview -> rebuilt",t)}})}))},update_variables:function(e,t){var a=[];editor.active_template.variables.forEach(function(t){var i=e.indexOf(t.name);i>-1&&(a.push(t),e.splice(i,1))}),e.forEach(function(e){a.push({name:e,value:""})}),editor.active_template.variables=a,generate.data.task.template.edit.build_variables(a,t)},build_editor:function(e,t){var a=$(loads["Elements/Modules/Test/generate/data/task/template/__edit/exports.html"]);return a.css("width","100%"),a},launch:function(e,t){editor.active_template=e,editor.template_editor_mode="edit";var a=generate.data.task.template.edit.build_editor(e.parts,e.variables);a.find(".task").html(generate.data.task.template.element.build_edit(e.parts,e.group)),popup.show(a,function(){},{width:"64rem"},!0),generate.data.task.template.edit.observe_new_vars(a),generate.data.task.template.edit.handle_actions(a,t),generate.data.task.template.edit.build_variables(e.variables,a)}}});