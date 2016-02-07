from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from .models import User, Course
import html

def edit(request):
	print(request.GET["test_id"])
	if request.GET["test_id"]:
		return load(request)
	else:
		return create(request)




def create(request):
	#creates new test
	return HttpResponse("sample")

def delete(request):
	#deletes test file
	pass



def save(request):
	#saves test file
	if request.method == 'POST':
		json_file = request.POST["json_file"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		print(json_file, course_id, test_id)
		test_file = open('courses/'+course_id+'/Tests/'+test_id+'.json', 'w')
		test_file.write(json_file)

	return HttpResponse("ok")

def load(request):
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	json_file = open('courses/'+course_id+'/Tests/'+test_id+'.json', 'r')
	json_file = json_file.read()
	course = {"id": course_id}
	test = {"id": test_id, "loaded": 1, "json": json_file}
	context =  {"test": test, "course": course}
	return render(request, 'Pages/test_editor.html', context)



def publish(request):
	#make test visible in course
	pass

def unpublish(request):
	#makes test invisible in test
	pass

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
