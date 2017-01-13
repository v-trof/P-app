describe('Test editor', function() {

  var test = editor.test_data;

  beforeEach(function() {
    test.tasks = [];
  });

  describe('Datastruct',  function() {
    it('should be defined', function() {
      expect(test).toBeDefined();
    });
    describe('Adding', function() {
      it('to empty', function() {
        var item = {val:'sample'};

        test.add(item);
        expect(test.tasks.length).toEqual(1);
        expect(test.tasks[0].content[0]).toEqual(item);
      });

      it('to big test', function() {
        var item = {val:'sample'};

        for(var i=0;i<10;i++) {
          test.add(i);
        }

        test.add(item);
        expect(test.tasks.length).toEqual(11);
        expect(test.tasks[10].content[0]).toEqual(item);
      });
    });

    describe('Deleting', function() {
      it('from signle blank task', function() {
        var item = {val:'sample'};

        test.add(item);

        test.delete({
          task: 0,
          number: 0
        });

        expect(test.tasks.length).toEqual(1);
        expect(test.tasks[0].content.length).toEqual(0);
      });

      it('from end of big task', function() {
        var item = {val:'sample'};

        test.add(item);
        for(var i=0; i<10; i++) {
          test.change(undefined, {
            task: 0,
            number: i+1
          }, {i: i+1});
        }

        test.delete({
          task: 0,
          number: 10
        });

        expect(test.tasks.length).toEqual(1);
        expect(test.tasks[0].content.length).toEqual(10);
        expect(test.tasks[0].content[9].i).toEqual(9);
      });

      it('from start of big task', function() {
        var item = {val:'sample'};

        test.add(item);
        for(var i=0; i<10; i++) {
          test.change(undefined, {
            task: 0,
            number: i+1
          }, {i: i+1});
        }

        test.delete({
          task: 0,
          number: 0
        });

        expect(test.tasks.length).toEqual(1);
        expect(test.tasks[0].content.length).toEqual(10);
        expect(test.tasks[0].content[9].i).toEqual(10);
        expect(test.tasks[0].content[0].i).toEqual(1);
      });

      it('from middle of big task', function() {
        var item = {val:'sample'};

        test.add(item);
        for(var i=0; i<10; i++) {
          test.change(undefined, {
            task: 0,
            number: i+1
          }, {i: i+1});
        }

        test.delete({
          task: 0,
          number: 5
        });

        expect(test.tasks.length).toEqual(1);
        expect(test.tasks[0].content.length).toEqual(10);
        expect(test.tasks[0].content[9].i).toEqual(10);
        expect(test.tasks[0].content[0]).toEqual(item);
      });

      it('task', function() {
        for(var i=0; i<10; i++) {
          test.add({i: i+1});
        }

        test.delete_task(0);
        expect(test.tasks.length).toEqual(9);
        expect(test.tasks[0].content[0].i).toEqual(2);

        test.delete_task(8);
        expect(test.tasks.length).toEqual(8);
        expect(test.tasks[7].content[0].i).toEqual(9);

        test.delete_task(3);
        expect(test.tasks.length).toEqual(7);
        expect(test.tasks[3].content[0].i).toEqual(6);
      });
    });

    describe('Chnaging', function() {

      var val_1 = {val: "a"};
      var val_2 = {val: "b"};
      var val_3 = {val: "c"};

      beforeEach(function() {
        test.add(val_1);
        test.add(val_2);
      });

      it('should move across tasks', function() {

        test.change({
          task: 1,
          number: 0
        }, {
          task: 0,
          number: 1
        }, val_2);

        expect(test.tasks[0].content[0]).toEqual(val_1);
        expect(test.tasks[0].content[1]).toEqual(val_2);

        expect(test.tasks[1].content.length).toEqual(0);
      });

      it('should insert in empty task', function() {

        test.change({
          task: 1,
          number: 0
        }, {
          task: 0,
          number: 1
        }, val_2);

        test.change(undefined, {
          task: 1,
          number: 0
        }, val_3);

        expect(test.tasks[1].content[0]).toEqual(val_3);
        expect(test.tasks[1].content.length).toEqual(1);
      });

      it('should insert in full task', function() {

        test.change({
          task: 1,
          number: 0
        }, {
          task: 0,
          number: 1
        }, val_2);

        test.change(undefined, {
          task: 0,
          number: 1
        }, val_3);


        expect(test.tasks[0].content[0]).toEqual(val_1);
        expect(test.tasks[0].content[1]).toEqual(val_3);
        expect(test.tasks[0].content[2]).toEqual(val_2);
      });

      it('should update value', function() {
        test.update({
          task: 0,
          number: 0
        }, val_3);

        expect(test.tasks[0].content[0]).toEqual(val_3);
      });

      it('should redirect update from cahnge', function() {
        test.change({
          task: 0,
          number: 0
        }, {
          task: 0,
          number: 0
        }, val_3);

        expect(test.tasks[0].content[0]).toEqual(val_3);
        expect(test.tasks[0].content.length).toEqual(1);
      });
    });
  });
});
