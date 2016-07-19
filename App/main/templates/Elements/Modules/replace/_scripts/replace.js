
$.extend({
	replaceTag: function (currentElem, newTagObj, keepProps) {
		var $currentElem = $(currentElem);
		var i, $newTag = $(newTagObj).clone();
		if (keepProps) {//{{{
			var nodes=[], values=[];
			newTag = $newTag[0];
			for (var att, i = 0, atts = currentElem.attributes, n = atts.length; i < n; i++) {
				att = atts[i];
				newTag.setAttribute(att.nodeName, att.value);
			}
			$.extend(newTag.classList, currentElem.classList);
			$.extend(newTag.attributes, currentElem.attributes);
		}//}}}
		$currentElem.wrapAll($newTag);
		$currentElem.contents().unwrap();
		// return node; (Error spotted by Frank van Luijn)
		return this; // Suggested by ColeLawrence
	}
});

$.fn.extend({
	replaceTag: function (newTagObj, keepProps) {
		// "return" suggested by ColeLawrence
		return this.each(function() {
			jQuery.replaceTag(this, newTagObj, keepProps);
		});
	}
});


(function (a) {
    a.fn.replaceTagName = function (f) {
        var g = [],
            h = this.length;
        while (h--) {
            var k = document.createElement(f),
                b = this[h],
                d = b.attributes;
            for (var c = d.length - 1; c >= 0; c--) {
                var j = d[c];
                k.setAttribute(j.name, j.value)
            }
            k.innerHTML = b.innerHTML;
            a(b).after(k).remove();
            g[h - 1] = k
        }
        return a(g)
    }
})(window.jQuery);