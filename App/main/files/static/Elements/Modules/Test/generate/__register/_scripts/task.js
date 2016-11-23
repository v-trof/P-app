generate.register.task = function(subtype, task_data) {
  var data = this.bind_data('task', subtype, 'element', task_data);
  data.build = task_data.builder;
}
