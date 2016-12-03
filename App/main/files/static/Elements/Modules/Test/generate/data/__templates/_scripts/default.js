/**
 * Modules/Test/generate/data/__template/(s)/default | Create wrappers for generated elements
 * @type {Object}
 */
generate.make_template = {
  element: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype +
       '" class="generate-item"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
         '" class="generate-item"></div>');
    }
  },
  edit: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype +
       '" class="generate-edit"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
       '"class="generate-edit"></div>');
    }
  }
}
