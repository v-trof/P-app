import os
import io

path = {
	"page": "../../templates/Pages/",
	"page_template": "../../templates/Page_templates/",
	"elements": "../../templates/Elements/"
}

def get_filename(path):
	return path.split("/")[-1] 

def dev_file(path):

	filename = get_filename(path) + ".html"

	if not os.path.isfile(path + "/" + filename):
		return ""
	template_path = path[len("../../templates/"):]
	# print("Building:", filename)

	file_dev = open(path + "/" + filename, "r", encoding="utf-8")
	html = file_dev.read()
	file_dev.close()

	html = html.replace('#&', template_path)
	html = html.replace('/"', '/exports.html"')
	html = html.replace('\n', '')

	with io.open(path + "/exports.html", 'w+', encoding='utf8') as file_main:
		file_main.write(html)
	return html

def template(dependencies, page_path):
	template_path = path["page_template"] + dependencies["template"]

	template_file = open(template_path + "/exports.html", "r")
	template_html = template_file.read()

	page_dev_html = dev_file(page_path)

	#for readability add tabs in lines
	page_dev_html_lines = page_dev_html.split("\n")
	for n in range(1, len(page_dev_html_lines)):
		page_dev_html_lines[n] = "	" + page_dev_html_lines[n]
	page_dev_html = "\n".join(page_dev_html_lines)

	def make_link(style, critical):
		style = '{% static "' + style + '" %}'

		async_attr = "if(media!='all')media='all'"

		# if critical:
		tag = '<link rel="stylesheet" href="' + style + \
			'"> \n'
		# else:
		# 	tag= '<link rel="stylesheet" href="' + style + \
		# 	'" media="none" onload="' + async_attr + '"> \n'

		return tag

	styles_html="{% load staticfiles %}"

	styles_critical = []
	styles_secondary = []

	for style in dependencies["styles"]:
		#check if is critical
		if(style.lower().find("layout") > -1 or 
			 style.lower().find("adaptive") > -1 or
			 style.lower().find("card") > -1 or
			 style.lower().find("main") > -1):
			styles_critical.append(style)
		else:
			styles_secondary.append(style)

	print(styles_critical)

	for style in styles_critical:
		styles_html += make_link(style, True)

	for style in styles_secondary:
		styles_html += make_link(style, False)
		

	scripts_critical= "<script> \n"
	scripts_html = ""
	scripts_pages = ""

	for script in dependencies["scripts_critical"]:
		scripts_critical += '		{% include "' + script +'.js" %} \n'

	for script in dependencies["scripts"]:
		if script.startswith("Elements/Modules"):
			scripts_html += '		{% include "' + script +'.js" %} \n'
		else:
			scripts_pages += '		{% include "' + script +'.js" %} \n'
	
	scripts_critical += scripts_html + scripts_pages
	scripts_critical += "	</script>"

	page_html = template_html \
					.replace("{ ###title }", dependencies["title"]) \
					.replace("{ **#styles }", styles_html) \
					.replace("{ *#*content }", page_dev_html)\
					.replace("{ ##*js }", scripts_critical)
	
	with io.open(page_path + "/exports.html", 'w+', encoding='utf8') as page_file:
		page_file.write(page_html)
