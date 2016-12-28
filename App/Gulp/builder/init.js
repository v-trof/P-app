const path = require('path');
const readline = require('readline');
const config = require('./config');
const classify = require('./utility/classify');
const process_page = require('./process/page');
const fs_dig = require('./fs/dig');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  var real_path = path.join(config.path.page, path.normalize(input));
  real_path = path.normalize(real_path);

  var info = classify(real_path);
  if(info.type == 'page') {
    process_page(real_path);
  } else {
    fs_dig(real_path, function(path) {
      var info = classify(path);
      if(info.type == 'page') process_page(path);
    });
  }
});
