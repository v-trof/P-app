generate.register.edit("question","text",{builder:function(e){var t=this.make_template();return t.prepend(loads.get("Elements/Inputs/text/textarea/")),t.find("label").text("Текст вопроса"),t.find(".__value").html(e.text),e.text&&t.find("label").addClass("m--top"),inline_editor.start(t.find(".__value")[0]),t},parser:function(e){return{text:e.find(".__value").html()}}});