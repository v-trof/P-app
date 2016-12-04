generate.register = {
  bind_data: function(type, subtype, data_type, data_value) {
    var data = generate.data[type][subtype] || {};
    generate.data[type][subtype] = data;
    data.type = type;
    data.subtype = subtype;

    data[data_type] = data_value;

    data[data_type].self = data;

    generate.counter[subtype] = 10;
    return data;
  }
}
