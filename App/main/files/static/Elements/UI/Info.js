var notification=function(){function t(t,e){var i=$(o.notification);return i.addClass("m--"+t),i.find(".__icon").html(o.icon[t]),i.find(".__text").html(e),i}function e(){$(".notification").each(function(t,e){$(this).css("transform","translateY("+3.5*t+"rem)")})}var o={notification:'<div class="notification m--hidden"><div class="__icon"></div><div class="__text"></div></div>',icon:{error:loads["Elements/Icons/cancel.svg"],warning:loads["Elements/Icons/warning.svg"],success:loads["Elements/Icons/done.svg"],info:loads["Elements/Icons/info.svg"]}},i={show:function(o,i){var n=t(o,i);$("body").append(n),setTimeout(function(){n.removeClass("m--hidden")},10),n.click(function(){notification.hide(n)}),e(),setTimeout(function(){notification.hide(n)},1e4)},hide:function(t){t.addClass("m--hidden"),setTimeout(function(){t.remove(),e()},150)}};return i}(),tooltip=function(){function t(t){t=$(t)[0],element_rect=t.getBoundingClientRect(),tooltip_rect=$tooltip[0].getBoundingClientRect(),exports={top:{top:element_rect.top-tooltip_rect.height+"px",left:element_rect.left+"px",class:"m--top"},top_centered:{top:element_rect.top-tooltip_rect.height+"px",left:element_rect.left-(tooltip_rect.width/2-element_rect.width/2)+"px",class:"m--top"},top_right:{top:element_rect.top-tooltip_rect.height+"px",left:element_rect.left+element_rect.width-2*tooltip_rect.width+"px",class:"m--top"},right:{height:element_rect.height+"px",top:element_rect.top+"px",left:element_rect.left+element_rect.width+"px",class:"m--right"},left:{height:element_rect+"px",top:element_rect.top+"px",left:element_rect.left-tooltip_rect.width+"px",class:"m--left"},bottom:{top:element_rect.top+element_rect.height+"px",left:element_rect.left+"px",class:"m--bottom"},bottom_centered:{top:element_rect.top+element_rect.height+"px",left:element_rect.left-(tooltip_rect.width/2-element_rect.width/2)+"px",class:"m--bottom"}};var e=Math.abs(tooltip_rect.height-element_rect.height);return tooltip_rect.width>element_rect.width?exports.auto=exports.top_centered:e<16?exports.auto=exports.right:exports.auto=exports.top,exports}function e(e,i){var n=!1,l=$tooltip[0].getBoundingClientRect();"-"==$tooltip.css("left")[0]&&("m--left"==i.class?n=t(e).top_right:$tooltip.css("left",0)),"-"==$tooltip.css("top")[0]&&("m--top"==i.class?n=t(e).bottom:$tooltip.css("top",0)),l.top+l.height>$(window).height()&&("m--bottom"==i.class?n=t(e).top:$tooltip.css({bottom:0,top:"auto"})),l.left+l.width>$(window).width()&&("m--right"==i.class?n=t(e).top_right:$tooltip.css({right:0,left:"auto"})),n&&($tooltip.css(n),o(),$tooltip.addClass(n.class))}function o(){$tooltip.removeClass("m--left"),$tooltip.removeClass("m--right"),$tooltip.removeClass("m--top"),$tooltip.removeClass("m--bottom")}return $tooltip=$('<div id="tooltip" class="m--hidden"><div class="__content"></div></div>'),exports={$:$tooltip,input_made:!1,show:function(i,n,l){var s;$tooltip.find(".__content").html(n),s=l?t(i)[l]:t(i).auto,$tooltip.css(s),o(),$tooltip.addClass(s.class),e(i,s),$tooltip.removeClass("m--hidden")},hide:function(){$tooltip.addClass("m--hidden"),$tooltip.removeAttr("style"),$("header").click()}},exports}();$(document).ready(function(){$("body").append(tooltip.$),$("body").on({focus:function(){"BUTTON"!==this.tagName&&"A"!==this.tagName&&"DIV"!==this.tagName&&(tooltip.input_made=!0),tooltip.show(this,$(this).attr("tip"))},mouseenter:function(){tooltip.input_made||tooltip.show(this,$(this).attr("tip"))},mouseleave:function(){tooltip.input_made||tooltip.hide()},blur:function(){tooltip.input_made=!1,tooltip.hide()}},"[tip]"),$(document).scroll(function(t){tooltip.hide()})});