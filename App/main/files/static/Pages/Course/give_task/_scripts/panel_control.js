Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var used_links = []


$(document).ready(function() {
  panel.actions.html('<button class="m--ghost" id="cancel">Отмена</button><button class="m--ghost m--negative" id="delete">Удалить</button>');
    $("#delete").css('color', '#F44336');

  panel.content.on("click", ".card.m--small", function(event) {
    if(as_g.original) {
      as_g.original.replaceWith($(this))
      used_links.push( $(this).attr("href") );
      used_links.remove( as_g.original.attr("href") );
    } else {
      // console.log($(this));
      $("#assignment--new__add_"+as_g.current_type).before($(this))
    }
    used_links.push( $(this).attr("href") )
    panel.hide();
  });

  $("#delete").click(function(event) {
    as_g.original.remove();
    used_links.remove( as_g.original.attr("href") );
  });

  panel.actions.on("click", "button", function(event) {
    panel.hide()
  });
});

