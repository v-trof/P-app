import io
import json
import os

import build

paths = build.path


def get(path):
  if not os.path.isfile(path + "/loads.json"):
    loads_json = set()
  else:
    with io.open(path + "/loads.json", 'r', encoding='utf8') as loads_file:
      loads_json = json.load(loads_file)

      for i in range(len(loads_json)):
        if loads_json[i][-1] == '/':
          loads_json[i] += 'exports.html'
      loads_json = set(loads_json)
      print(loads_json)

  return loads_json


def add(page_loads, new_loads):
  page_loads |= new_loads
