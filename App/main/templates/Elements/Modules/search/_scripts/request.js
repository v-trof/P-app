search.request = function() {
  var query = search.$.find('input').val();

  $.ajax({
    url: '/func/search/',
    type: 'POST',
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'search_query': query,
      'search_types': {
        'courses': {}
      }
    },
  })
  .success(function(data) {
    search.fill(data);
  })
  .fail(function() {
    notification.show('error', 'Не удалось подключиться к поиску')
  }); 
}
