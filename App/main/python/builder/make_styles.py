import os
dirs = [dire[0] for dire in os.walk("../../templates/")]
for dire in dirs:
	files = os.listdir(dire)
	print(files)
	has_sass = False
	for file in files:
		if file.endswith(".js"):
			has_sass = True
	if has_sass:
		if not os.path.isdir(dire + "/_scripts"):
			os.mkdir(dire + "/_scripts")
	for file in files:
		if file.endswith(".js"):
			os.rename(dire+"/"+file, dire+"/_scripts/"+file)
