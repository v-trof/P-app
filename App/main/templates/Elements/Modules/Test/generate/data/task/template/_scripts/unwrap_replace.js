$(document).ready(function() {
  generate.data.task.template.unwrap_replace = function(obj, variables) {
    if(typeof obj === 'string') {
      variables.forEach(function(variable) {
        obj = obj.replaceAll('%(' + variable.name + ')', variable.value);
      });
    } else if(obj instanceof Array) {
      obj.forEach(function(part) {
          part = generate.data.task.template.unwrap_replace(part, variables);
      });

      for(var i = 0; i < obj.length; i++) {
        obj[i] = generate.data.task.template.unwrap_replace(obj[i], variables);
      }
    } else if(typeof obj === "object") {
      for(key in obj) {
        obj[key] = generate.data.task.template.unwrap_replace(obj[key], variables)
      }
    }

    return obj;
  }
});
