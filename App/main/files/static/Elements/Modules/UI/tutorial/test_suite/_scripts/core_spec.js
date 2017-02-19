$(document).ready(function() {
  describe('Tutorial', function() {
    describe('Overlay', function() {
      beforeEach(function() {
        $('.tutorial-overlay').remove();
      });

      it('should show on 1 item', function() {

      })

      it('should show on array of items', function() {

      })

      it('should hide', function() {

      });

      it('should be added hidden', function() {

      })
    });

    describe('Highlight', function() {

    });

    describe('Modal', function() {

    });

    describe('Next', function() {
      it('should add overlay', function() {
        tutorial.start([
          {
            overlay: $('body')
          }
        ]);
        expect($('body').find('.tutorial-overlay').length).toEqual(1);
      });

      it('should add highlight', function() {

      });

      it('should add hook', function() {

      });

      it('should run js', function() {

      });

      it('should add continue_btn', function() {

      });

      it('should add modal', function() {

      });
    });

    describe('Undo', function() {
      //fake handlers for utility purpose

      beforeEach(function() {
        tutorial.overlay.active = []
        tutorial.overlay.orig_show = tutorial.overlay.show;
        tutorial.overlay.show = function(n) {
          tutorial.overlay.active.push(n);
        }

        tutorial.overlay.hide = function(n) {
          tutorial.overlay.active.remove(n);
        }
      });

      //actual testing
      it('should undo 1 last step', function() {
        tutorial.start([
          {
            overlay: 1
          }, {
            overlay: 2
          }
        ]);

        expect(tutorial.overlay.active).toContain(1);

        tutorial.prepare_for_next();

        expect(tutorial.overlay.active).toContain(2);
        expect(tutorial.overlay.active).not.toContain(1);
      });

      it('should undo kept steps after last', function() {

      });

      it('should undo after series of kept steps', function() {

      });

      it('should undo series after series of kept steps', function() {

      });

      it('should not undo behind last', function() {

      });

      it('should not undo break if all are kept', function() {

      });

      afterEach(function() {
        tutorial.overlay.show = tutorial.overlay.orig_show;
      });

      //get handlers back to normal
    });
  });
})
