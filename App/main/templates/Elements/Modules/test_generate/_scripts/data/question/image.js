generate.data["question--image"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				url: $original.find("img").attr("src")
			}
		},
		build: function(value) {

			return $(generate.build.template.question("question--image")).append("<img src="
				+value.url+">")
		},
		value_sample: {
			url: "http://science-all.com/images/wallpapers/hipster-wallpaper/hipster-wallpaper-21.jpg"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__image/exports.html" %}',
		parse: function() {
			return {
				url: $("#new_element_url").val()
			}
			// else if($("#new_el_file") != "" ) {
			// 	return generate.shared.upload_asset($("#new_el_file").val())
			// }
		},
		fill: function(value) {
			$("#new_element_url").val(value.url).focus()
		}
		// middleware: generate.shared.catch_asset_file
	}
},