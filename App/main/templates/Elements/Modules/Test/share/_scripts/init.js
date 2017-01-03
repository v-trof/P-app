$(document).ready(function() {
  var request = function(search) {
    //getting types
    var query = search.$.find('.__query').val();
    var search_types = search.types_active;

    var own = search.$.find('.own_only input')[0].checked;
    var open = search.$.find('.open_only input')[0].checked;

    return $.ajax({
        url: '/func/search/',
        type: 'POST',
        data: {
          'search_types': JSON.stringify(['shared']),
          'csrfmiddlewaretoken': loads.csrf_token,
          'search_query': query,
          'shared_query': JSON.stringify(search_types),
          'own': own,
          'open': open
        },
    });
  };

  share.search = new Search(
    request,
    ['test', 'material', 'template_collection'],
    ['Тесты', 'Материалы', 'Наборы шаблонов'],
    ['template_collection']
  );


  //adding own \ open only checkbox
  var $flags = $('<div class="card"></div>');
  var $own = $(loads.get('Elements/Inputs/checkbox/'));
  $own.addClass('own_only');
  $own.find('label').text('Только добавленные мной');

  var $open = $(loads.get('Elements/Inputs/checkbox/'));
  $open.addClass('open_only');
  $open.find('label').text('Только с открытым доступом');

  $flags.append($own);
  $flags.append($open);
  share.search.$.find('.__filters').parent().append($flags);


  share.search.$.find('.m--close').click(function(event) {
    share.search.hide();
  });
  //custom card builders
  share.search.build['test'] = function(data) {
    console.log("SHARE RECIVED TEST:", data);
    return $('<b>HERE IS SEARCH TEST CARD');
  }

  share.search.build['material'] = function(data) {
    console.log("SHARE RECIVED MATERIAL:", data);
    return $('<b>HERE IS SEARCH MATERIAL CARD');
  }

  share.search.build['templates'] = function(data) {
    console.log("SHARE RECIVED TEMPLATE:", data);
    return $('<b>HERE IS SEARCH TEMPLATE CARD');
  }

});
