var popup=function(){return $popup=$(loads.get("Elements/Modules/UI/modal/popup/exports.html")),exports={$:$popup,show:function(p,o,e,n){$popup.find(".__content").children().remove(),$popup.find(".__content").append(p),$popup.removeClass("m--hidden"),$popup.removeClass("m--hiding"),$popup.find(".m--select").each(function(p,o){add_menu_caller(this)}),$popup.find(".m--sectioned").each(function(p,o){add_menu_caller_sectioned(this)}),e&&$popup.find(".__modal").css(e),n||$popup.find("input").first().focus(),o&&o()},hide:function(){$popup.addClass("m--hiding"),$popup.find("__modal").removeAttr("style"),"undefined"!=typeof tooltip&&tooltip.hide(),"undefined"!=typeof context_menu&&context_menu.hide(),setTimeout(function(){$popup.addClass("m--hidden")},300)}},exports}();$(document).ready(function(){$("body").append(popup.$),popup.$.find(".__close").click(function(p){popup.hide()})});