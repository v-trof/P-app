import os

import build
import dependencies
import loads

path = build.path


def build_page(page_name):
  print("PAGE_TO_BUILD:", page_name)
  print("==========================")
  page_path = path["page"] + page_name

  page_dependencies = dependencies.get(page_path)
  page_dependencies["priority"] = {}
  page_loads = set()

  if not "template" in page_dependencies:
    print("READ FAILED:", page_name)
    # return False

  page_dependencies["scripts_critical"] = set()

  template_path = path["page_template"] + page_dependencies["template"]
  template_dependencies = dependencies.get(template_path)
  dependencies.add(page_dependencies, template_dependencies)

  blocks = [block[0] for block in os.walk(page_path)]
  for block_path in blocks:
    block_path = block_path.replace("\\", "/")
    build.dev_file(block_path)

    block_dependencies = dependencies.get(block_path)
    dependencies.add(page_dependencies, block_dependencies)

    loads.add(page_loads, loads.get(block_path))

  # building all elements
  elements_done = set()
  elements_current = set()
  while elements_done != page_dependencies["elements"]:
    # fix for Card/{{cardname}} to work
    elements_current = page_dependencies["elements"] \
        - elements_done

    # print("....\n", "Todos", elements_current, "\n ....")

    for element in elements_current:
      element_path = path["elements"] + element

      build.dev_file(element_path)
      element_dependencies = dependencies.get(element_path)

      loads.add(page_loads, loads.get(element_path))

      element_arr = element.split("/")
      element_l = len(element_arr)

      if(element_l > 0 and
         (element_arr[-1][0].isupper() or element[-1][0] == '.')
         ):
        print("NOBLOCK:", element_arr)
        continue

      # do not add pages recursively
      if not (element_l > 1 and element_arr[1] == "Pages"):
        for i in range(element_l - 1):
          proto = "/".join(element_arr[:-i - 1])
          element_dependencies["elements"].add(proto)
      else:
        print("NOPROTO:", element_arr)

      dependencies.add(page_dependencies, element_dependencies)

      element_blocks = [block[0] for block in os.walk(element_path)]

      for block_path in element_blocks:
        block_path = block_path.replace("\\", "/")
        block_name = block_path.split("/")[-1]

        if (not (element_arr[-1] + '/__') in block_path):
          continue

        build.dev_file(block_path)

        block_dependencies = dependencies.get(block_path)
        dependencies.add(page_dependencies, block_dependencies)

        loads.add(page_loads, loads.get(block_path))
    elements_done |= elements_current

  build.template(page_dependencies, page_loads, page_path)

# page_name = input().split("/n")[0]
# build_page(page_name)
