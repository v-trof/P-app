var ripple=function(){function t(){e.removeAttr("style"),e.removeClass("m--hide").removeClass("m--shown"),$(".ripple_target").removeClass("ripple_target")}var e=$('<div id="ripple_effect"></div>');return exports={$:e,show:function(i,s,r){t(),i.append(e),i.addClass("ripple_target");var n=Math.max(i.width(),i.height())*Math.PI;e.css({width:n,height:n}),s.left-=n/2,s.top-=n/2,e.css(s),"undefined"!=typeof r&&e.css(r),e.addClass("m--shown")},hide:function(){e.addClass("m--hide")}},exports}();$(document).ready(function(){$("body").on({mousedown:function(t){var e=this.getBoundingClientRect(),i={left:t.clientX-e.left,top:t.clientY-e.top};ripple.show($(this),i)},mouseup:function(){ripple.hide()},mouseout:function(){ripple.hide()}},"button, a.m--card .card")}),"undefined"==typeof processing&&(processing={}),processing.button={spinner:"<svg class='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'><circle cx='50' cy='50' r='38' fill='none' stroke-width='6' stroke-linecap='round'><animate attributeName='stroke-dashoffset' dur='2s' repeatCount='indefinite' from='0' to='476.9'></animate><animate attributeName='stroke-dasharray' dur='2s' repeatCount='indefinite' values='143.07 95.38;1 237.5;143.07 95.38'></animate></circle></svg>",start:function(t){t=$(t).first(),t.attr("o-html",t.html());var e=t.attr("style");e&&t.attr("o-style",e),t.css({width:t.outerWidth(),height:t.outerHeight(),dispaly:"flex","align-items":"center","justifiy-content":"center"}).html(processing.button.spinner),t.attr("disabled","disabled")},stop:function(t){t.html(t.attr("o-html")),t.removeAttr("disabled"),t.attr("o-style")?t.attr("style",t.attr("o-style")):t.removeAttr("style"),t.attr("o-style",void 0)}};