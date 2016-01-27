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
		if(css){
			$('#popup').css(css);
		}
		if(callback){
			callback();
		}
		$("#popup input").each(function(index, el) {
			add_emptiness_checker(this);	
		});
		$("#popup input").first().focus();

		$("#popup .file").each(function(index, el) {
			console.log(this);
			add_file_boundary(this);
		});

		$("#popup .select").each(function(index, el) {
			console.log(this);
			add_menu_caller(this);
		});
	},

	hide: function() {
		$("#overlay").removeClass("shown");
		$("#popup").attr("style", "");
	}
} 