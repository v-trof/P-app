test_manager.replace_json_value = function(element_class, value) {
  if(element_class === 'answer--classify') {
    return '(Вопрос)Классификация';
  } else if(value.join) {
    return value.join(', ');
  }
}
