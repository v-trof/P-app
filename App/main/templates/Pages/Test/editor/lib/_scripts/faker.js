search.fill([{"type":"test","conformity":15.384615384615385,"content":{"title":"ЕГЭ задания 1-4","done":true,"link":"/test/attempt/?course_id=22&test_id=1","id":"1","type":"test","questions_number":4,"course_name":"Русский язык 9-11 класс"}}]);

search.$.find('a').removeAttr('href').click(function() {
  test_manager.import();
});

search.$.find('.__content .m--grey').remove();
search.$.find('.__content').append('<div class="row" style="margin-bottom: -1.5rem">  <div class="card m--small">    ЕГЭ  </div>  <div class="card m--small" style="margin-left:0.5rem;">    Определение темы</div><div class="card m--small" style="margin-left:0.5rem;">  Ударения  </div></div>');
