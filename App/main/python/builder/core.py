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

for element in page_dependencies["elements"]:
	#fix for Card/person to work
	if element.split("/")[0][-1] != "s":
		element_arr = element.split("/")
		element_arr[0] += "s"
		element = "/".join(element_arr)
	element_path = path["elements"] + element
	build.dev_file(element_path)
	
	element_dependencies =  dependencies.get(element_path)
	dependencies.add(page_dependencies, element_dependencies)

build.dev_file(page_path)
build.template(page_dependencies, page_path)