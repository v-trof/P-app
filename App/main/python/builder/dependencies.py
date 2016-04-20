import json

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
	
	return dependencies_json


def add(page_dependencies, dependencies):
	page_dependencies["elements"] |= dependencies["elements"]
	page_dependencies["scripts"]  |= dependencies["scripts"]
	page_dependencies["styles"]   |= dependencies["styles"]
	# print(page_dependencies)