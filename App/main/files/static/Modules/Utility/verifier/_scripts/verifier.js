var verifier=function(){function e(e,s){if(e.val()){if(s.test(e.val()))return e.addClass("m--valid"),e.removeClass("m--invalid"),!0;e.removeClass("m--valid"),e.addClass("m--invalid")}else e.removeClass("m--valid"),e.removeClass("m--invalid");return!1}var s={email:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,words2:/^[^\s]+\s[^\s]+$/,password:/.{8,}/},i=2e3;return exports={verify:e,expressions:s,add:function(a,r){"string"==typeof r&&(r=s[r]),e(a,r);var n;a.keydown(function(){clearTimeout(n),n=setTimeout(function(){e(a,r)},i)}),a.blur(function(){e(a,r)})}},exports}();