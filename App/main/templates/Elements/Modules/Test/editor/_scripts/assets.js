editor.assets = {
  _files: [],
  add: function(content) {
    var pos = this._files.length;
    this._files.push(content);

    return pos;
  },

  get: function(pos) {
    return this._files[pos];
  },

  replace: function(pos, content) {
    this._files[pos] = content;
  }
}
