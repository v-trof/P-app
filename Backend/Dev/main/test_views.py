from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from .models import User, Course
# from django.core.servers.basehttp import FileWrapper
import os
import json
import io

def edit(request):
	#switch for create\load test, lauches test editor anyway
	if "test_id" in request.GET:
		return load(request)
	else:
		return create(request)




def create(request):
	#creates test environment (no test exists as file untill saved)
	course_id =request.GET["course_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as data_file:
		course_info = json.load(data_file)
		print("1234")
		test_id = str(course_info['tests']['amount']+1)
	course = {"id": course_id}
	test = {"id": test_id, "loaded": 0}
	context =  {"test": test, "course": course}
	context["breadcrumbs"] =[{
			"href" : "/course/"+str(course_id),
			"link" : Course.objects.get(id=course_id).name
		},{
			"href" : "#",
			"link" : "Новый тест"
		}]

	return render(request, 'Pages/test_editor.html', context)

def delete(request):
	#moves test to trash bin
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)

		if test_id in course_info['tests']['published']:
			course_info['tests']['published'].remove(test_id)

		if test_id in course_info['tests']['unpublished']:
			course_info['tests']['unpublished'].remove(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:

		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест удален")



def save(request):
	#saves test file
	print("save")
	if request.method == 'POST':
		json_file = request.POST["json_file"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		json_file_path = 'courses/'+course_id+'/Tests/'+test_id+'.json'
		if not os.path.isfile(json_file_path):
			with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				course_info['tests']['amount']+=1
				course_info['tests']['unpublished'].append(test_id)
				test_id = str(course_info['tests']['amount'])

			with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
				info_file.write(json.dumps(course_info, ensure_ascii=False))

		with io.open(json_file_path, 'w', encoding='utf8') as test_file:
			test_file.write(json_file)
	return HttpResponse("Тест сохранен")

def load(request):
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	with io.open('courses/'+course_id+'/Tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:

		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		course = {"id": course_id}
		test = {
			"id": test_id,
			"loaded": 1,
			"json": json.load(json_file),
			"published" : test_id in course_info["tests"]["published"]
		}
	context =  {"test": test, "course": course}
	context["breadcrumbs"] =[{
			"href" : "/course/"+str(course_id),
			"link" : Course.objects.get(id=course_id).name
		},{
			"href" : "#",
			"link" : test["json"]["title"]
		}]
	return render(request, 'Pages/test_editor.html', context)



def publish(request):
	#makes test visible in course screen
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)

	if test_id in course_info['tests']['unpublished']:
		course_info['tests']['unpublished'].remove(test_id)

	course_info['tests']['published'].append(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест опубликован")

def unpublish(request):
	#makes test invisible in course screen
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)
	if test_id in course_info['tests']['published']:
		course_info['tests']['published'].remove(test_id)

	course_info['tests']['unpublished'].append(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест скрыт")

def share(request):
	#make test avalible in package_catalog
	pass

def attempt(request):
	#creates or continues attempt
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	with io.open('courses/'+course_id+'/Tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:
		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
			course = {"id": course_id}
			test = {
				"id": test_id,
				"loaded": 1,
				"json": json.load(json_file),
				"published" : test_id in course_info["tests"]["published"]
			}
			context =  {"test": test, "course": course}
			context["breadcrumbs"] =[{
					"href" : "/course/"+str(course_id),
					"link" : Course.objects.get(id=course_id).name
				},{
					"href" : "#",
					"link" : test["json"]["title"]
				}]
	return render(request, 'Pages/attempt.html', context)

def attempt_save(request):
	#saves attempt data
	pass

def attempt_check(request):
	#checks attempts
	pass


def upload_asset(request):
	if request.method == 'POST':
		asset = request.FILES["asset"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)
		
		with open(path+asset.name, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse("ok")

def upload_downloadable(request):
	if request.method == 'POST':
		asset = request.FILES["asset"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)
		
		with open(path+asset.name, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse("ok")

#embmend
def upload_embmend(request):
	if request.method == 'POST':
		asset = request.POST["code"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)

		asset_id=1
		list_dir = os.listdir(path)
		for file in list_dir:
			if file.endswith(".html"):
				asset_id += 1

		with open(path+asset_id+".html", 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse(asset_id)

def load_embmend(request):
	course_id =request.GET["course_id"]
	test_id =request.GET["test_id"]
	asset_id =request.GET["asset_id"]
	path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
	f = open(path+asset_id+".html", 'r')
	asset = f.read()
	return HttpResponse(asset)

def load_asset_file(request, course_id, test_id, asset_name):
	path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
	f = open(path+asset_name, 'r')
	asset = f.read()
	response = HttpResponse(FileWrapper(asset.getvalue()), content_type='application/zip')
	response['Content-Disposition'] = 'attachment; filename=myfile.zip'
	return response