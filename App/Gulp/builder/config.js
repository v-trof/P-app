module.exports = {
  log: {
    dependencies: {
      list: false,
      read_error: false,
      parse_error: true
    },
    loads: {
      list: false,
      read_error: false,
      parse_error: false
    },
    exports: {
      read_error: false,
      parse_error: false,
      start: false
    },
    build: {
      read_error: true,
      parse_error: true,
      start: true,
      compress: true
    },
    item: {
      path: false,
      class: false
    },
    walk: {
      full: false,
      each: false
    },
    info: {
      page: true,
      item: false,
      utlity: false
    },
    resolved: true,
    current: false
  },

  path: {
    main: '../../main/templates/',
    template: '../../main/templates/Page_templates/',
    page: '../../main/templates/Pages/',
    element: '../../main/templates/Elements/',
    module: '../../main/templates/Elements/Modules/',
  },

  name: {
    page: 'Pages',
    element: 'Elements',
    module: "Modules",
    exports: "exports.html",
    loads: 'loads.json',
    dependencies: 'dependencies.json',
    blocks_dir: 'data',
  },
  keys: {
    //what to swap with current path
    relative: '#&/',

    //what to load as variable
    variable: '{{',
  }
}
