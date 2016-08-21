/**
 * Modules/Test/generate/data/__template/(s)/default | Create wrappers for generated elements
 * @type {Object}
 */
generate.make_template = {
  element: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype + '"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
        '" worth="' + args.worth + '"></div>');
    }
  },
  edit: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype + '"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
        '></div>');
    }
  }
}
