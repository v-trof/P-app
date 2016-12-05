generate.data["question--file"] = {
  element: {
    type: "question",
    parse: function($original) {
      return {
        url: $original.find("a.m--card").attr("d-href"),
        class: "question--file",
        id: $original.find("a.m--card").attr("id"),
        size: $original.find(".__size").text(),
        name: $original.find(".__name").text(),
        type: "question"
      }
    },
    build: function(value) {
      var file_template = $('{% include "Elements/card/file/exports.html" %}');

      //turning link off
      if(typeof editor !== "undefined") {
        file_template.removeAttr('href');
        file_template.removeAttr('download');
        file_template.find(".card").removeAttr('tip');
        //d-disabled
        file_template.attr("d-href", value.url);
      } else {
        file_template.attr("href", value.url);
      }


      file_template.find(".__name").text(value.name);

      file_template.find(".__size").text(value.size);
      file_template.attr("id", value.id);


      return $(generate.build.template.question("question--file"))
        .append(file_template);
    },
    value_sample: {
      name: "Файл для скачивания",
      size: "3.21МБ",
      id: undefined,
      url: "http://science-all.com/images/wallpapers/hipster-wallpaper/hipster-wallpaper-21.jpg"
    }
  },
  edit: {
    text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__file/exports.html" %}',
    parse: function() {
      var original_id = $("#new_file").attr("original-id");
      var url, name, size, id;
      if(generate.data.shared.file_changed) {
        id = generate.data.shared.assets.last_id;
      } else {
        if(generate.data.shared.assets[original_id]) {
          id = original_id;
        } else {
          var sample =  generate.data["question--file"]
            .element.value_sample;
          return sample;
        }
      }

      name = $("#new_file_name").val();
      if(url = generate.data.shared.assets[id].urls) {
        url = generate.data.shared.assets[id].urls[0]
        size = Math.floor(generate.data.shared.assets[id]
          .files[0].size/1024/1024*100)/100 + "MB";

        // console.log(name);
        return {
          url: url,
          name: name,
          size: size,
          id: id
        }
      } else {
        var sample =  generate.data["question--file"]
            .element.value_sample;
          return sample;
      }
    },
    fill: function(value) {
      // console.log(value);
      if((! value.url) && generate.data.shared.assets[value.id]) {
        value.url = generate.data.shared.assets[value.id].name;
      }
      var full_link = value.url;
      var file_link = full_link.split("/")[full_link.split("/").length-1];

      $("#new_file_name").val(value.name).focus();
      $("#new_file").parent().find(".__text").text(file_link);
      $("#new_file").attr("original-id", value.id);
    },
    middleware: function() {
      generate.data.shared.catch_asset_file()
    }
  }
}
