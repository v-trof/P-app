var context_menu=function(){function t(t){c_rect=t.getBoundingClientRect(),e.removeAttr("style"),e.css({top:c_rect.top+"px",left:c_rect.left+"px",width:c_rect.width+"px"}),menu_rect=e[0].getBoundingClientRect(),menu_rect.top+menu_rect.height>$(window).height()&&e.css({bottom:0,top:"auto"}),menu_rect.left+menu_rect.width>$(window).width()&&e.css({right:0,left:"auto"})}var e=$("<div id='context_menu' class='m--hidden m--hiding'></div>"),n=!1,i=function(t,n,i){e.html(""),e.attr("style",""),n?(e.append("<div class='__option default' value='"+i.value+"'>"+i.text+"</div>"),t.forEach(function(t){e.append("<div class='__option' value='"+t.value+"'>"+t.text+"</div>")})):t.forEach(function(t){e.append("<div class='__option' onclick='"+t.func+"()'>"+t.text+"</div>")}),context_menu.bind_selects(n)};return exports={$:e,reposition:t,bind_selects:function(t){e.find(".__option").click(function(e){context_menu.hide(),$(t).find("input").val($(this).attr("value")).change(),$(t).children(".__display").text($(this).text()),$(t).find("input").val(),$(t).find("input")})},show:function(c,o,d,u){$("body").append(e),n&&context_menu.hide(),u?context_menu.build_section_select(c,o,d):i(c,o,d),t(o),e.removeClass("m--hidden"),e.removeClass("m--hiding")},hide:function(){e.addClass("m--hiding"),setTimeout(function(){e.addClass("m--hidden"),e.removeAttr("style")},150)}},exports}();$(document).scroll(function(t){context_menu.hide()});