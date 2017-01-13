const fs = require('fs');
const path = require('path');
const config = require('../config');
const replace = require('../utility/replace');

function build_exports(dir, page_info) {
  dir = path.normalize(dir);
  if(dir[dir.length - 1] !== path.sep) {
    dir += path.sep;
  }

  if(config.log.build.start) console.log('exporting:', dir);

  var end = dir.split(path.sep).slice(-2)[0];
  //reading
  try {
    var proto_file = fs.readFileSync(dir + end + '.html', 'utf8', 'r');
  } catch (err) {
    if(config.log.build.read_error) {
      console.error('No exports at', dir, '\n\n', err);}
  }

  //building
  try {
    var exports_file = wrap_template(proto_file, page_info);
    exports_file = add_scripts(exports_file, page_info);
    exports_file = add_styles(exports_file, page_info);
    exports_file = replace_all(exports_file, dir);

    if(config.log.build.compress) {
      exports_file = replace.whitespace(exports_file);
    }
    fs.writeFile(dir + config.name.exports, exports_file, function() {});
  } catch (err) {
    if(config.log.build.read_error) {
      console.error('tempalte error at', dir, '\n\n', err);}
  }
}

module.exports = build_exports;

//local utility
function replace_all(exports_file, dir) {
  exports_file = replace.relative(exports_file, dir);
  exports_file = replace.exports(exports_file);

  return exports_file;
}

function wrap_template(proto_file, page_info) {
  var exports_file = fs.readFileSync(config.path.template +
                                     page_info.template + path.sep
                                     + config.name.exports, 'utf8');

  exports_file = exports_file.replace('{ ###title }', page_info.title);
  exports_file = exports_file.replace('{ *#*content }', proto_file);
  return exports_file;
}

function add_scripts(exports_file, page_info) {
  var scripts_html = bake_loads(page_info);

  //modules
  var modules_html = '';
  for(let dir of page_info.dependencies.scripts.module) {
    dir = dir.split(path.sep).join('/');
    if( ! dir.endsWith('.js')) {
      dir += '.js';
    } else {
      dir = dir.replace(config.path.main, '');
      modules_html += `<script src='{% static "` + dir + `"%}' defer>
                       </script> \n`;
      continue;
    }


    //loads are TOP priority
    if(dir.endsWith('loads.js')) {
      modules_html = `<script src='{% static "` + dir + `"%}'></script> \n`
                     + modules_html;
    } else {
      modules_html += `<script src='{% static "` + dir + `"%}'></script> \n`;
    }
  }
  //elements
  var elements_html = '';
  for(let dir of page_info.dependencies.scripts.element) {
    dir = path.normalize(dir);
    dir = dir.replace(path.normalize(config.path.main), '');
    dir = dir.split(path.sep).join('/');
    elements_html += `<script src='{% static "` + dir + `"%}'></script> \n`;
  }
  //page
  var page_html = '<script> \n';
  for(let dir of page_info.dependencies.scripts.page) {
    dir = path.normalize(dir);
    dir = dir.replace(path.normalize(config.path.main), '');
    dir = dir.split(path.sep).join('/');
    page_html += '{% include "' + dir + '" %} \n';
  }
  page_html += '</script> \n'

  scripts_html += modules_html + elements_html + page_html;

  exports_file = exports_file.replace('{ ##*js }', scripts_html);
  return exports_file;
}

function add_styles(exports_file, page_info) {
  var styles_html = '';

  //modules
  var modules_html = '';
  for(let dir of page_info.dependencies.styles.module) {
    dir = dir.split(path.sep).join('/');
    dir += '.css';
    modules_html += `<link rel='stylesheet' href='{% static "` + dir + `"%}'>
                    \n`;
  }

  var other_html = '';
  //tempalte
  for(let dir of page_info.dependencies.styles.template) {
    dir = path.normalize(dir);
    dir = dir.replace(path.normalize(config.path.main), '');
    dir = dir.split(path.sep).join('/');
    dir = dir.replace('sass', 'css');
    other_html += `<link rel='stylesheet' href='{% static "` + dir + `"%}'> \n`;
  }
  //elements
  for(let dir of page_info.dependencies.styles.element) {
    dir = path.normalize(dir);
    dir = dir.replace(path.normalize(config.path.main), '');
    dir = dir.split(path.sep).join('/');
    dir = dir.replace('sass', 'css');
    dir = dir.replace('scss', 'css');
    other_html += `<link rel='stylesheet' href='{% static "` + dir + `"%}'> \n`;
  }

  //page
  for(let dir of page_info.dependencies.styles.page) {
    dir = path.normalize(dir);
    dir = dir.replace(path.normalize(config.path.main), '');
    dir = dir.split(path.sep).join('/');
    dir = dir.replace('sass', 'css');
    other_html += `<link rel='stylesheet' href='{% static "` + dir + `"%}'> \n`;
  }


  styles_html += modules_html + other_html;
  exports_file = exports_file.replace('{ **#styles }', styles_html);
  return exports_file;
}

function bake_loads(page_info) {
  var loads_html = '<script> loads = {';

  //variables
  for(let variable of page_info.loads.variable) {
    let name = variable.replace(/(?:{{)\s*/g, '').replace(/\s*(?:}})/g, '');
    console.log(variable, name);
    loads_html += '"' + name + '": "' + variable + '",';
  }
  //elements
  for(let dir of page_info.loads.element) {
    dir = path.normalize(dir);
    dir = dir.split(path.sep).join('/');
    if(dir.endsWith('/')) {
      dir += config.name.exports;
    }
    loads_html += `'` + dir + `': '{% include "` + dir + `" %}', \n`;
  }

  loads_html += '} </script>'

  return loads_html;
}
