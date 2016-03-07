# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from .models import User, Course
import os
import json

def edit(request, course_id):
	print(course_id)
	#switch for create\load test, lauches test editor anyway
	if "test_id" in request.GET:
		return load(request, course_id)
	else:
		return create(request, course_id)




def create(request, course_id):
	#creates test environment (no test exists as file untill saved)
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	test_id = str(course_info['tests']['amount']+1)
	info_file.close()
	
	course = {"id": course_id}
	test = {"id": test_id, "loaded": 0}
	context =  {"test": test, "course": course}

	return render(request, 'Pages/test_editor.html', context)

def delete(request, course_id):
	#moves test to trash bin
	test_id =request.POST["test_id"]
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
	return HttpResponse("Тест удален")



def save(request, course_id):
	#saves test file
	if request.method == 'POST':
		print("df")
		json_file = request.POST["json_file"]
		test_id = request.POST["test_id"]
		json_file_path = 'courses/'+course_id+'/Tests/'+test_id+'.json'
		if not os.path.isfile(json_file_path):
			info_file = open('courses/'+course_id+'/info.json', 'r')
			course_info = json.loads(info_file.read())
			course_info['tests']['amount']+=1
			course_info['tests']['unpublished'].append(test_id)
			test_id = str(course_info['tests']['amount'])
			info_file.close()

			info_file = open('courses/'+course_id+'/info.json', 'w+')
			info_file.write(json.dumps(course_info, ensure_ascii=False))
			info_file.close()
		test_file = open(json_file_path, 'w')
		test_file.write(json_file)
	return HttpResponse("Тест сохранен")

def load(request, course_id):
	#loads test file
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



def publish(request, course_id):
	#makes test visible in course screen
	test_id =request.POST["test_id"]
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()
	if test_id in course_info['tests']['unpublished']:
		course_info['tests']['unpublished'].remove(test_id)

	course_info['tests']['published'].append(test_id)

	info_file = open('courses/'+course_id+'/info.json', 'w+')
	info_file.write(json.dumps(course_info, ensure_ascii=False))
	info_file.close()

	return HttpResponse("Тест опубликован")

def unpublish(request, course_id):
	#makes test invisible in course screen
	test_id =request.POST["test_id"]
	info_file = open('courses/'+course_id+'/info.json', 'r')
	course_info = json.loads(info_file.read())
	info_file.close()
	if test_id in course_info['tests']['published']:
		course_info['tests']['published'].remove(test_id)

	course_info['tests']['unpublished'].append(test_id)

	info_file = open('courses/'+course_id+'/info.json', 'w+')
	info_file.write(json.dumps(course_info, ensure_ascii=False))
	info_file.close()
	return HttpResponse("Тест скрыт")

def share(request, course_id):
	#make test avalible in package_catalog
	pass



def attempt(request, course_id):
	#creates or continues attempt
	pass

def attempt_save(request, course_id):
	#saves attempt data
	pass

def attempt_check(request, course_id):
	#checks attempts
	pass


def upload_asset(request, course_id):
	if request.method == 'POST':
		asset = request.FILES["asset"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
		    os.makedirs(path)
		
		with open(path+asset.name, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse("ok")