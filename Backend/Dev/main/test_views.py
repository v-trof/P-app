from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from .models import User, Course
import os
import json

def edit(request):
	#switch for create\load test, lauches test editor anyway
	if "test_id" in request.GET:
		return load(request)
	else:
		return create(request)




def create(request):
	#creates test environment (no test exists as file untill saved)
	course_id =request.GET["course_id"]
	
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	test_id = str(course_info['tests']['amount']+1)
	info_file.close()
	
	course = {"id": course_id}
	test = {"id": test_id, "loaded": 0}
	context =  {"test": test, "course": course}

	return render(request, 'Pages/test_editor.html', context)

def delete(request):
	#moves test to trash bin
	course_id =request.GET["course_id"]
	test_id =request.GET["test_id"]
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()

	if test_id in course_info['tests']['published']:
		course_info['tests']['published'].remove(test_id)

	if test_id in course_info['tests']['unpublished']:
		course_info['tests']['unpublished'].remove(test_id)

	info_file = open('courses/'+course_id+'/info.json', 'w+')
	info_file.write(json.dumps(course_info, ensure_ascii=False))
	info_file.close()
	return HttpResponse("ok")



def save(request):
	#saves test file
	if request.method == 'POST':
		json_file = request.POST["json_file"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		json_file_path = 'courses/'+course_id+'/Tests/'+test_id+'.json'
		if not os.path.isfile(json_file_path):
			info_file = open('courses/'+course_id+'/info.json', 'r')
			course_info = json.loads(info_file.read())
			course_info['tests']['amount']+=1
			course_info['tests']['inactive'].append(test_id)
			test_id = str(course_info['tests']['amount'])
			info_file.close()

			info_file = open('courses/'+course_id+'/info.json', 'w+')
			info_file.write(json.dumps(course_info, ensure_ascii=False))
			info_file.close()
		test_file = open(json_file_path, 'w')
		test_file.write(json_file)
	return HttpResponse("ok")

def load(request):
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	json_file = open('courses/'+course_id+'/Tests/'+test_id+'.json', 'r')
	json_file = json_file.read()

	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()

	course = {"id": course_id}
	test = {
		"id": test_id,
		"loaded": 1,
		"json": json_file,
		"published" : test_id in course_info["tests"]["published"]
	}

	context =  {"test": test, "course": course}
	return render(request, 'Pages/test_editor.html', context)



def publish(request):
	#makes test visible in course screen
	course_id =request.GET["course_id"]
	test_id =request.GET["test_id"]
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()

	course_info['tests']['unpublished'].remove(test_id)

	course_info['tests']['published'].append(test_id)

	info_file = open('courses/'+course_id+'/info.json', 'w+')
	info_file.write(json.dumps(course_info, ensure_ascii=False))
	info_file.close()
	return HttpResponse("ok")

def unpublish(request):
	#makes test invisible in course screen
	course_id =request.GET["course_id"]
	test_id =request.GET["test_id"]
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()

	course_info['tests']['published'].remove(test_id)

	course_info['tests']['unpublished'].append(test_id)

	info_file = open('courses/'+course_id+'/info.json', 'w+')
	info_file.write(json.dumps(course_info, ensure_ascii=False))
	info_file.close()
	return HttpResponse("ok")

def share(request):
	#make test avalible in package_catalog
	pass



def attempt(request):
	#creates or continues attempt
	pass

def attempt_save(request):
	#saves attempt data
	pass

def attempt_check(request):
	#checks attempts
	pass
