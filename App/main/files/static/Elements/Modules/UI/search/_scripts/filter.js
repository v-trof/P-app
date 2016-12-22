Search._.filter = function(search) {
  search.types.forEach(function(type) {
    if (search.types_active.indexOf(type) === -1) {
      search.$.find('.__links').children('.m--' + type).hide();
    } else {
      search.$.find('.__links').children('.m--' + type).show();
    }
  });
}
