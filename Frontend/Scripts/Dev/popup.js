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
		console.log(css,callback);
		callback();
	},

	hide: function() {
		$("#overlay").removeClass("shown");
	}
} 