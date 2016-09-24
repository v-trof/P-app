var editor ;

describe('Test generate', function() {
  var test_type;
  var test_subtype;

  describe('Core',  function() {
    it('should be all defined', function() {
      expect(generate).toBeDefined();
      expect(generate.register).toBeDefined();
      expect(generate.data).toBeDefined();
    });
  });

  describe('Register',  function() {
    beforeEach(function() {
      editor = undefined;
      test_type = 'question';
      test_subtype = 'text';
    });
    describe('Elements', function() {
      it('should be registered over empty subtype', function() {
        expect(generate.data[test_type][test_subtype]).toBeDefined();
      });

      it('should be registered over empty existing el\edit', function() {
        expect(generate.data[test_type][test_subtype].element).toBeDefined();
        expect(generate.data[test_type][test_subtype].edit).toBeDefined();
      });

      it('should contain sample builder', function() {
        var sample_build = generate.data[test_type][test_subtype].
          element.sample.build;
        expect(sample_build).toBeDefined();
        expect(sample_build()).toBeNode();
      });

      it('should make right simple build', function() {
        var sample_build = generate.data[test_type][test_subtype].
          element.sample.build;
        expect(sample_build).toBeDefined();

        var value = sample_build().find('.__value').text();

        expect(value).toEqual(
          generate.data[test_type][test_subtype].element.sample.value
        )
      });

      it('should make custom build', function() {
        var build = generate.data[test_type][test_subtype].
          element.build;
        expect(build).toBeDefined();

        var val = "Test Val <b>))</b>";

        var value = build(val).find('.__value').html();

        expect(value).toEqual(val);
      });

      it('should bind editing', function() {

        var edit_value = '1';
        editor = {
          let_edit: function($el) {$el.attr('edit', edit_value);}
        }

        console.log(editor);

        var build = generate.data[test_type][test_subtype].
          element.build;
        expect(build).toBeDefined();

        var value = build(edit_value).attr('edit');

        expect(value).toEqual(edit_value);
      });
    });
  });
});
