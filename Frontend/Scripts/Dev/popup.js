$(document).ready(function() {
	$("#overlay__bg").click(function(e) {
		popup.hide();
	});
});

var popup = {
	is_shown : false,
	show: function(content, css, callback) {
		$("#popup").html(content);
		$("#overlay").addClass("shown");
		$('#popup').css(css);
		$("#popup input").each(function(index, el) {
			add_emptiness_checker(this);	
		});
		callback();
	},

	hide: function() {
		$("#overlay").removeClass("shown");
		$("#popup").attr("style", "");
	}
} 