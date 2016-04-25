import json
import os
import build

paths = build.path

def get(path):
	dependencies_file = open(path + "/dependencies.json", "r")
	dependencies_json = json.loads(dependencies_file.read())
	real_path = path[len("../../templates/"):]

	for kind in dependencies_json:
		if type(dependencies_json[kind])  is list:
			for n in range(len(dependencies_json[kind])):
				dependencies_json[kind][n] = \
					dependencies_json[kind][n].replace('#&', real_path)

	dependencies_json["elements"] = set(dependencies_json["elements"])
	dependencies_json["scripts"]  = set(dependencies_json["scripts"])
	dependencies_json["styles"]   = set(dependencies_json["styles"])
	
	styles_path = paths["styles"] + real_path
	
	if os.path.isfile(styles_path + ".css"):
		dependencies_json["styles"].add(real_path)
	elif os.path.exists(styles_path + "/main.css"):
		dependencies_json["styles"].add(real_path+"/main")

	return dependencies_json


def add(page_dependencies, dependencies):
	page_dependencies["elements"] |= dependencies["elements"]
	page_dependencies["scripts"]  |= dependencies["scripts"]
	page_dependencies["styles"]   |= dependencies["styles"]
	# print(page_dependencies)