path = {
	"page": "../../templates/Pages/",
	"page_template": "../../templates/Page_templates/",
	"elements": "../../templates/Elements/",
	"scripts": "../../templates/Scripts/",
	"styles": "../../templates/Styles/",
}

def dev_file(path):
	template_path = path[len("../../templates/"):]
	print("Building:", template_path)
	file_dev = open(path + "/dev.html", "r")
	html = file_dev.read()
	file_dev.close()

	html = html.replace('#&', template_path)
	html = html.replace('/"', '/main.html"')
	
	file_main = open(path + "/main.html", "w")
	file_main.write(html)
	file_main.close()
	return html

def template(dependencies, page_path):
	template_path = path["page_template"] + dependencies["template"]
	template_file = open(template_path + "/main.html", "r")
	template_html = template_file.read()

	page_dev_html = dev_file(page_path)

	#for readability add tabs in lines
	page_dev_html_lines = page_dev_html.split("\n")
	for n in range(1, len(page_dev_html_lines)):
		page_dev_html_lines[n] = "	"+page_dev_html_lines[n]
	page_dev_html = "\n".join(page_dev_html_lines)

	fixes_html = ""
	for fix in dependencies["fixes"]:
		fixes_html += '		{% include "Elements/'+ fix +'/main.html" %} \n'

	styles_html = "<style> \n"
	for style in dependencies["styles"]:
		styles_html += '		{% include "Styles/'+ style +'.css" %} \n'
	styles_html += "	</style>"

	scripts_html = "<script> \n"
	for script in dependencies["scripts"]:
		scripts_html += '		{% include "Scripts/'+ script +'.js" %} \n'
	scripts_html += "	</script>"

	page_html = template_html \
					.replace("{ ###title }", dependencies["title"]) \
					.replace("{ #*#fixes }", fixes_html)  \
					.replace("{ **#styles }", styles_html) \
					.replace("{ *#*content }", page_dev_html)\
					.replace("{ ##*js }", scripts_html)
	
	page_file = open(page_path + "/main.html", "w")
	page_file.write(page_html)