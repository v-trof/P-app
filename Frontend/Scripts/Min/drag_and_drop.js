function check_bg_height(){$(".test__bg").outerHeight()!=$(".test")[0].scrollHeight&&$(".test__bg").css("height",$(".test")[0].scrollHeight+"px")}function drag_reset(){counter=0,$(".drop--accept").removeClass("drop--accept"),$(".moved").removeClass("moved"),indicator.hide(),ripple.dissolve(),original_el=void 0,$(".test>svg").css({transform:"",opacity:0}),editor.check_for_emptiness(),editor.hide_delete()}function drag_over(t){return t.preventDefault&&(t.preventDefault(),t.stopPropagation()),!1}var counter=0,original_el=void 0,drop_el=void 0,e_data={data:[],setData:function(t,e){this.data[t]=e},getData:function(t){return this.data[t]}},indicator={original_el:{},show:function(t){$("#indicator").css({width:t.width+"px",height:t.height+"px",left:t.left+"px",top:t.top+"px"})},hide:function(){$("#indicator").css({width:0,height:0,left:0,top:0})}},editor={editing:!1,verify_type:function(){$("#move").is(":checked")?($(".task__answer__item, .task__question>*").attr("draggable","true"),$(".task__answer__item, .task__answer__item *, .task__question>*").css("cursor","move"),editor.editing=!1):($(".test__preview [draggable]").removeAttr("draggable"),$(".task__answer__item, .task__answer__item *, .task__question>*").css("cursor","pointer"),editor.editing=!0)},check_for_emptiness:function(){$(".task__question").each(function(t,e){0==$(this).children().length&&($(this).append("<div class='block--empty'>Добавьте сюда вопрос</div>"),add_boundary.block_empty($(this).children(".block--empty")))}),$(".task__answer").each(function(t,e){0==$(this).children().length&&($(this).append("<div class='block--empty'>Добавьте сюда поле ответа</div>"),add_boundary.block_empty($(this).children(".block--empty")))})},show_delete:function(){$("#delete").addClass("shown")},hide_delete:function(){$("#delete").removeClass("shown").removeClass("delete")}},add_boundary={draggable:function(t){t.bind({dragover:function(t){drag_over(t)},dragstart:function(t){this.classList.add("moved"),t.originalEvent.dataTransfer.setData("useless","stupid firefox")},dragend:function(t){drag_reset()}})},question:function(t){t.bind({dragenter:function(t){"question"==e_data.getData("el_type")&&($(this).find("*").css("pointer-events","none"),this.classList.add("drop--accept"),c_rect=this.getBoundingClientRect(),indicator.original_el=this,indicator.show(c_rect))},dragleave:function(t){this.classList.remove("drop--accept"),indicator.hide(),$(this).find("*").css("pointer-events","all"),console.log("leave")},dragstart:function(t){editor.show_delete(),e_data.setData("el_type","question"),e_data.setData("el_class",$(this).attr("class").split(" ")[0]),original_el=this},drop:function(t){"question"==e_data.getData("el_type")&&(original_el?($(this).after($(original_el)),editor.check_for_emptiness()):append_test_item($(this),e_data.getData("el_class"),e_data.getData("el_type")))},click:function(e){editor.editing&&(t=generate[this.classList[0]](void 0,$(this)),$(this).replaceWith(t))}})},answer:function(t){t.bind({dragenter:function(t){"answer"==e_data.getData("el_type")&&(this.classList.add("drop--accept"),c_rect=this.getBoundingClientRect(),indicator.original_el=this,indicator.show(c_rect),$(this).find("*").css("pointer-events","none"))},dragstart:function(t){editor.show_delete(),e_data.setData("el_type","answer"),e_data.setData("el_class",$(this).children("input").attr("class")),original_el=this},dragleave:function(t){"answer"==e_data.getData("el_type")&&(console.log("leave"),this.classList.remove("drop--accept"),indicator.hide())},drop:function(t){"answer"==e_data.getData("el_type")&&(original_el?($(this).after($(original_el)),editor.check_for_emptiness()):append_test_item($(this),e_data.getData("el_class"),e_data.getData("el_type")))},click:function(e){editor.editing&&(t=generate[this.classList[0]](void 0,void 0,$(this)),$(this).replaceWith(t))}})},block_empty:function(t){t.bind({dragover:function(t){drag_over(t)},dragenter:function(t){$(this).parent().attr("class").split(" ")[0].split("__")[1]==e_data.getData("el_type")&&this.classList.add("drop--accept")},dragleave:function(t){$(this).parent().attr("class").split(" ")[0].split("__")[1]==e_data.getData("el_type")&&this.classList.remove("drop--accept")},drop:function(t){var e=$(this).parent();e.attr("class").split(" ")[0].split("__")[1]==e_data.getData("el_type")&&(original_el?($(this).replaceWith($(original_el)),editor.check_for_emptiness()):($(this).replaceWith(generate[e_data.getData("el_class")]()),new_el=$(e.children()[0]),add_boundary.draggable(new_el),add_boundary[e_data.getData("el_type")](new_el))),editor.verify_type()}})},new_task:function(t){t.bind({dragover:function(t){drag_over(t)},dragenter:function(t){ripple.force_show(t.originalEvent,test_bg,"accent"),$(".test>svg").css({transform:"translateY(-50px)",opacity:1}),$(this).find("*").css("pointer-events","none")},dragleave:function(t){ripple.dissolve(),$(".test>svg").css({transform:"",opacity:0}),$(this).find("*").css("pointer-events","all")},drop:function(t){console.log("drop",counter),t.stopPropagation&&t.stopPropagation(),create_task(e_data.getData("el_type"),e_data.getData("el_class"),original_el)}})}};$(document).ready(function(){editor.verify_type(),$("#editor__type").click(function(t){editor.verify_type()}),$(".answer__field").bind({dragstart:function(t){e_data.setData("el_type","answer"),e_data.setData("el_class",this.classList[0]),t.originalEvent.dataTransfer.setData("useless","stupid firefox")},dragend:function(t){drag_reset()}}),$(".question-elements>*").bind({dragstart:function(t){e_data.setData("el_type","question"),e_data.setData("el_class",$(this).attr("class")),t.originalEvent.dataTransfer.setData("useless","stupid firefox")},dragend:function(t){drag_reset()}}),test_bg=$(".test__bg").get(0),$(".test__bg, .test>svg").each(function(t,e){add_boundary.new_task($(this))}),$("#indicator").bind({dragover:function(t){drag_over(t)},dragenter:function(t){indicator.original_el.classList.add("drop--accept")},dragleave:function(t){indicator.original_el.classList.remove("drop--accept"),indicator.hide()},drop:function(t){t.stopPropagation&&t.stopPropagation(),$(indicator.original_el).trigger("drop",[{e:t}])}}),$("#delete").bind({dragover:function(t){drag_over(t)},drop:function(t){t.stopPropagation&&(t.stopPropagation(),$(original_el).remove(),drag_reset())},dragenter:function(t){$(this).find("*").css("pointer-events","none"),this.classList.add("delete")},dragleave:function(t){this.classList.remove("delete"),$(this).find("*").css("pointer-events","all")}})});