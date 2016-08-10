search.request = function() {
  var query = search.$.find('.__query').val();

  console.log(search.types_active);
  //comstricting types
  var search_types = {}

  if(search.types_active.indexOf("courses") !== -1) {
    search_types.courses = {}
  }

  if(search.types_active.indexOf("users") !== -1) {
    if(search.course_id) {
      search_types.users = {
        course_id: search.course_id
      }
    } else {
      search_types.users = {}
    }
  }

  var add_tasks = (search.types_active.indexOf("tests") !== -1);
  var add_material = (search.types_active.indexOf("materials") !== -1);

  if(add_tasks && add_material) {
    search_types.elements = {}
  } else if(add_tasks) {
    search_types.elements = {type:"test"}
  } else if(add_material){
    search_types.elements = {type:"material"}
  }

  if(search.course_id && search_types.elements) {
    search_types.elements.course_id = search.course_id;
  }
  
  $.ajax({
    url: '/func/search/',
    type: 'POST',
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'search_query': query,
      'search_types': JSON.stringify(search_types)
    },
  })
  .success(function(data) {
    search.fill(data);
  })
  .fail(function() {
    notification.show('error', 'Не удалось подключиться к поиску')
  }); 
}
