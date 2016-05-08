import os

import dependencies
import build

path = build.path

page_name = input().split()[0]
page_path = path["page"] + page_name

page_dependencies = dependencies.get(page_path)

template_path = path["page_template"] + page_dependencies["template"]
template_dependencies = dependencies.get(template_path)
dependencies.add(page_dependencies, template_dependencies)

blocks = [block[0] for block in os.walk(page_path)]
for block_path in blocks:
	block_path = block_path.replace("\\", "/")
	build.dev_file(block_path)

	block_dependencies = dependencies.get(block_path)
	dependencies.add(page_dependencies, block_dependencies)

#building all elements
elements_done = set()
elements_current = set()
while elements_done != page_dependencies["elements"]:
	#fix for Card/{{cardname}} to work
	elements_current = page_dependencies["elements"] \
						- elements_done

	print("Todos", page_dependencies["elements"] - elements_done)

	for element in elements_current:
		element_path = path["elements"] + element

		build.dev_file(element_path)
		element_dependencies =  dependencies.get(element_path)
		
		element_arr = element.split("/")
		element_l = len(element_arr)
		for i in range(element_l-1):
			proto = "/".join(element_arr[:-i-1])
			element_dependencies["elements"].add(proto)

		dependencies.add(page_dependencies, element_dependencies)

		element_blocks = [block[0] for block in os.walk(element_path)]

		for block_path in element_blocks:
			block_path = block_path.replace("\\", "/")
			block_name = block_path.split("/")[-1]

			if not block_name.startswith("__"):
				continue
			

			build.dev_file(block_path)

			block_dependencies = dependencies.get(block_path)
			dependencies.add(page_dependencies, block_dependencies)
	elements_done |= elements_current

build.template(page_dependencies, page_path)