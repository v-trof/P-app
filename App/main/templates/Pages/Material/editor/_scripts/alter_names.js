(function() {
  var alter_paths = [
    "Elements/Modules/Test/manage/__popup_texts/__no_publish/exports.html",
    "Elements/Modules/Test/manage/__popup_texts/__no_save/exports.html",
    "Elements/Modules/Test/manage/__popup_texts/__save/exports.html"];

  alter_paths.forEach(function(path) {
    loads[path] = loads[path].replace('Тест', 'Материал');
    loads[path] = loads[path].replace('тест', 'материал');
  });

  generate.data.question.text.element.sample.value.text = 'Текст';
} ());
