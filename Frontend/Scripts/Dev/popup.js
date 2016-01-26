$(document).ready(function() {
	$("#popup__close").click(function(e) {
		popup.hide();
	});
});

var popup = {
	is_shown : false,
	show: function(content, css, callback) {
		$("#popup__content").html(content);
		$("#overlay").addClass("shown");
		$('#popup').css(css);
		callback();
		$("#popup input").each(function(index, el) {
			add_emptiness_checker(this);	
		});
		$("#popup input").first().focus();
	},

	hide: function() {
		$("#overlay").removeClass("shown");
		$("#popup").attr("style", "");
	}
} 