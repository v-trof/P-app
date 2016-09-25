var search;

(function() {
  var request = function(search) {
    var query = search.$.find('.__query').val();
    //constructing types
    var search_types = {}

    if (search.types_active.indexOf("course") !== -1) {
      search_types.courses = {}
    }

    if (search.types_active.indexOf("user") !== -1) {
      if (search.course_id) {
        search_types.users = {
          course_id: search.course_id
        }
      } else {
        search_types.users = {}
      }
    }

    var add_tasks = (search.types_active.indexOf("test") !== -1);
    var add_material = (search.types_active.indexOf("material") !== -1);

    if (add_tasks && add_material) {
      search_types.elements = {}
    } else if (add_tasks) {
      search_types.elements = {
        type: "test"
      }
    } else if (add_material) {
      search_types.elements = {
        type: "material"
      }
    }

    if (search.course_id && search_types.elements) {
      search_types.elements.course_id = search.course_id;
    }
    return $.ajax({
        url: '/func/search/',
        type: 'POST',
        data: {
          'csrfmiddlewaretoken': '{{ csrf_token }}',
          'search_query': query,
          'search_types': JSON.stringify(search_types)
        },
    });

  }

  $(document).ready(function() {
    search = new Search(
      request,
      ['test', 'material', 'user', 'course'],
      ["Тесты", "Материалы", 'Пользователи', "Открытые курсы"],
      ['test', 'material']
    );

    $('.header>.__search>button').click(function() {
      if (!search.is_shown) {
        search.show();
      } else {
        search.hide();
      }
    });

    search.$.find('.m--close').click(function(event) {
      search.hide();
    });

    if (search.url.indexOf('course') > -1) {
      exports.course_id = '{{course.id}}';
    }
  });
} ());
