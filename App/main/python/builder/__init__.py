import os

import core
import build
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
				pages.append(directory)
				print(directory)

		for page_path in pages:
			pagel_list = page_path.split("\\")
			if len(pagel_list) > 1:
				page_name = pagel_list[0].split("/")[-1] + "/" \
					 + page_path.split("\\")[1]
			else:
				page_name = pagel_list[0].split("/")[-1]

			core.build_page(page_name)

	else:
		core.build_page(message)
	print("\n ---- \n")
	message = input().split("/n")[0]