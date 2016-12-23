var customMatchers = {
  toBeNode: function(util, customEqualityTesters) {
    return {
      compare: function(actual) {
        var result = {
          pass: actual instanceof Node,
        };

        if(result.pass) {
          result.message = 'Expected ' + jasmine.pp(actual) + ' to be a DOM node.'
        } else {
          result.message = 'Expected ' + jasmine.pp(actual) + ' NOT to be a DOM node.'
        }

        return result;
      }
    };
  }
};
