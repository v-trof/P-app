$(document).ready(function() {
  var request = function(search) {
    //getting types
    var query = search.$.find('.__query').val();
    var search_types = search.types_active;

    var own = search.$.find('.own_only input')[0].checked;
    var open = search.$.find('.open_only input')[0].checked;

    //add tags
    var global_tags=[];
    var subject_tags=[];

    return $.ajax({
        url: '/func/search/',
        type: 'POST',
        data: {
          'search_types': JSON.stringify({
            'shared': {
              'subject_tags': subject_tags,
              'global_tags': global_tags,
              'own': own,
              'open': open,
              'shared_query': search_types
            }
          }),
          'csrfmiddlewaretoken': loads.csrf_token,
          'search_query': query
        },
    });
  };

  share.search = new Search(
    request,
    ['test', 'material', 'templates'],
    ['Тесты', 'Материалы', 'Наборы шаблонов'],
    ['templates']
  );


  share.search.$.addClass('share-search');
  //adding own \ open only checkbox
  var $flags = $('<div class="card"></div>');
  var $own = $(loads.get('Elements/Inputs/checkbox/'));
  $own.addClass('own_only');
  $own.find('label').text('Только добавленные мной');
  $own.change(function() {request(share.search)});

  var $open = $(loads.get('Elements/Inputs/checkbox/'));
  $open.addClass('open_only');
  $open.find('label').text('Только с открытым доступом');
  $open.change(function() {request(share.search)});

  $flags.append($own);
  $flags.append($open);
  share.search.$.find('.__filters').parent().append($flags);

  //adding tags
  //
  //
  share.search.$.find('.m--close').click(function(event) {
    share.search.hide();
  });

  function decoreate_with_share($card, data) {
    var $changable = $card.find('.__content .m--grey');
    console.log(data);

    if(data.templates_number) {
      $changable.before('<div><b>' + data.templates_number + '</b> '
        + Search._.build.num_form(data.templates_number,
                                  { one: 'шаблон',
                                    few: 'шаблона',
                                    many: 'шаблонов'})
        + '</div>');
    }

    $changable.replaceWith('<div><span class="m--grey"> Добавил '
        + data.creator_name + '</span></div>');

    $card.find('.__content').append(
      '<span class="m--grey"> Изпользовали ' + data.popularity + ' раз</span>'
    );

    $card.find('.__extension').append(
      share.search.build['tag_list'](data.global_tags));

    $card.find('.__extension').append(
      share.search.build['tag_list'](data.subject_tags));

    if( ! data.open) {
      $card.find('.__icons .__neutral')
        .append(loads["Elements/Icons/locked.svg"])
        .attr('tip', 'Доступ по запросу');
    }

    var unbinded = $.extend({}, data);
    $card.click(function() {
      if(data.creator === parseInt(loads['user.id'])) {
        share.edit.show(unbinded);
      } else {
        share.display.show(unbinded, $card);
      }
    });
    setTimeout(function() {
      $card.parent().removeAttr('href');
    }, 300);
  }

  //custom card builders
  share.search.build['test'] = function(data) {
    console.log('share recived test', data);
    var $card = Search._.build.test(data);

    decoreate_with_share($card, data);

    return $card;
  }

  share.search.build['material'] = function(data) {
    console.log("SHARE RECIVED MATERIAL:", data);
    var $card = Search._.build.material(data);

    decoreate_with_share($card, data);

    $card.click(function() {
      share.display.show(data, $card);
    });
    return $card;
  }

  share.search.build['templates'] = function(data) {
    data.type = 'templates';
    var $card = Search._.build.test(data);
    var $save = $card.find('.__content').children('*:not(b)');
    $card.find('.__content').html('').append($save);
    $card.find('b').first().before('<span>Набор, </span>');

    decoreate_with_share($card, data);

    return $card;
  }

  share.search.build['tag'] = function(data) {
    return $('<div class="card m--small">' + data + '</div>');
  }

  share.search.build['tag_list'] = function(tag_list) {
    var $tags = $('<div class="row"></div>');
    tag_list.forEach(function(tag) {
      $tags.append(share.search.build['tag'](tag));
    });

    return $tags;
  }

});
