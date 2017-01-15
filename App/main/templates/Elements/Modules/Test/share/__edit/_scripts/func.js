share.edit.funcs = {}

share.edit.funcs.save = function($new_edit, old_data) {
  var data = share.edit.parse($new_edit);
  data.shared_id = old_data.shared_id;
  data.assets[old_data.type + '_id'] = old_data.id;
  if(data) {
    share.ajax.share(data);
  }
}
share.edit.funcs.save_as = function($new_edit) {
  var data = share.edit.parse($new_edit);
  if(data) {
    share.ajax.share(data);
  }
}
share.edit.funcs.unshare = function(id) {
  share.ajax.unshare({'shared_id': id});
}
