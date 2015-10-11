var icon = {
	error: '<path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16 9.913 5 16 5zm-3.78 5.78l-1.44 1.44L14.564 16l-3.782 3.78 1.44 1.44L16 17.437l3.78 3.78 1.44-1.437L17.437 16l3.78-3.78-1.437-1.44L16 14.564l-3.78-3.782z"/>',
	warning: '<path d="M 16 3 C 8.8321429 3 3 8.8321429 3 16 C 3 23.167857 8.8321429 29 16 29 C 23.167857 29 29 23.167857 29 16 C 29 8.8321429 23.167857 3 16 3 z M 16 5 C 22.086977 5 27 9.9130231 27 16 C 27 22.086977 22.086977 27 16 27 C 9.9130231 27 5 22.086977 5 16 C 5 9.9130231 9.9130231 5 16 5 z M 15 10 L 15 18 L 17 18 L 17 10 L 15 10 z M 15 20 L 15 22 L 17 22 L 17 20 L 15 20 z"/>',
	success: ' <path style="text-indent:0;text-align:start;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans" d="M 16 3 C 8.8321429 3 3 8.8321429 3 16 C 3 23.167857 8.8321429 29 16 29 C 23.167857 29 29 23.167857 29 16 C 29 8.8321429 23.167857 3 16 3 z M 16 5 C 22.086977 5 27 9.9130231 27 16 C 27 22.086977 22.086977 27 16 27 C 9.9130231 27 5 22.086977 5 16 C 5 9.9130231 9.9130231 5 16 5 z M 22.28125 11.28125 L 15 18.5625 L 10.71875 14.28125 L 9.28125 15.71875 L 14.28125 20.71875 L 15 21.40625 L 15.71875 20.71875 L 23.71875 12.71875 L 22.28125 11.28125 z" color="#000" overflow="visible" enable-background="accumulate" font-family="Bitstream Vera Sans"/>',
	info: '<path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16 9.913 5 16 5zm-1 5v2h2v-2h-2zm0 4v8h2v-8h-2z"/>'
};

var notification = {
	change: function(type,heading,text){
		$("#notification").attr('class', 'hidden');
		$("#notification").addClass('notification__'+type);
		$("#notification>svg").html(icon[type]);
		$("#notification>h3").html(heading);
		$("#notification>span").html(text);
		notification.show();
	},
	show: function(){
		$("#notification").removeClass('hidden');
	},
	hide: function(){
		$("#notification").addClass('hidden');
	}
} 
