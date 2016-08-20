generate.data["question--image"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				url: $original.find("img").attr("src"),
				class: "question--image",
				type: "question"
			}
		},
		build: function(value) {
			return $(generate.build.template.question("question--image")).append("<img src="
				+value.url+">")
		},
		value_sample: {
			url: "/media/samples/image.jpg"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__image/exports.html" %}',
		parse: function() {

			var url;
			// console.log($("#new_element_file").val());

			if($("#new_element_file").val() != "") {
				url = generate.data.shared.assets[
					generate.data.shared.assets.last_id
				].urls[0];
			} else {
				url = $("#new_element_url").val();
			}

			return {
				url: url 
			}
		},
		fill: function(value) {
			$("#new_element_url").val(value.url).focus()
		},
		middleware: function() {
			generate.data.shared.catch_asset_file()
		}
	}
}
