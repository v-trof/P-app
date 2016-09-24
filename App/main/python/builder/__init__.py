import os

import build
import core
import dependencies

path = build.path

message = input().split("/n")[0]

while message != "_exit":
  if message == "_all":
    pages_n_blocks = [directory[0] for directory in os.walk(path["page"])]
    pages = []

    for directory in pages_n_blocks:
      dependencies_json = dependencies.get(directory)
      if "template" in dependencies_json:
        directory_list = directory.split("\\")

        print(directory_list)
        if len(directory_list) > 1:
          page_name = directory_list[0].split("/")[-1] + "/" \
              + "/".join(directory_list[1:])
        else:
          page_name = directory_list[0].split("/")[-1]

        pages.append(page_name)

    print(pages)
    for page_name in pages:
      core.build_page(page_name)

  elif message == '_modules':
    pages_n_blocks = [directory[0]
                      for directory in os.walk(path["elements"])]
    pages = []

    for directory in pages_n_blocks:
      dependencies_json = dependencies.get(directory)
      if "template" in dependencies_json:
        directory_list = directory.split("\\")

        print(directory_list)
        if len(directory_list) > 1:
          page_name = directory_list[0].split("/")[-1] + "/" \
              + "/".join(directory_list[1:])
        else:
          page_name = directory_list[0].split("/")[-1]
        pages.append(page_name)
    for page_name in pages:
      core.build_page(page_name)
  else:
    core.build_page(message)
  print("\n ---- \n")
  message = input().split("/n")[0]
