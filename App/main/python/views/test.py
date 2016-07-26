from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from main.models import *
from main.python.other import transliterate
# from django.core.servers.basehttp import FileWrapper
import os
import json
import io


def edit(request):
	# switch for create\load test, launches test editor anyway
	if request.GET['course_id']:
		course_id=request.GET['course_id']
		if request.user.is_anonymous():
			return redirect('/login')
		if not Utility.is_teacher(user=request.user,course_id=course_id):
			return redirect('/course/'+course_id)
		if "test_id" in request.GET:
			return load(request)
		else:
			return create(request)
	else:
		return redirect('/')


def create(request):
	# creates test environment (no test exists as file untill saved)
	course_id = request.GET.get("course_id",None)
	context = Test.create(course_id=course_id)
	context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		}, {
			"href": "#",
			"link": "Новый тест"
		}]
	context["sections"] = Course.objects.get_sections(course_id=course_id)
	context["type"]= "test"
	return render(request, 'Pages/Test/editor/exports.html', context)


def delete(request):
	# moves test to trash bin
	course_id = request.POST.get("course_id",None)
	test_id = request.POST.get("test_id",None)
	Test.delete(course_id=course_id, test_id=test_id)
	return HttpResponse("Тест удален")


def save(request):
	# saves test file
	if request.method == 'POST':
		json_file = request.POST.get("json_file",None)
		course_id = request.POST.get("course_id",None)
		test_id = request.POST.get("test_id",None)
		Test.save(json_file=json_file, course_id=course_id, test_id=test_id, user=request.user)
	return HttpResponse("Тест сохранен")


def load(request):
	# loads test file
	course_id = request.GET.get("course_id",None)
	test_id = request.GET.get("test_id",None)
	test=Test.load(course_id=course_id, test_id=test_id)
	context={}
	context["test"]=test
	context["test"]["id"]=test_id
	context["course"]=Course.objects.get(id=course_id)
	context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		}, {
			"href": "#",
			"link": test["json"]["title"]
		}]
	context["sections"] = Course.objects.get_sections(course_id=course_id)
	context["type"]= "test"
	return render(request, 'Pages/Test/editor/exports.html', context)


def publish(request):
	# makes test visible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id",None)
		test_id = request.POST.get("test_id",None)
		section = request.POST.get("section","Нераспределенные")
		allowed_mistakes=[]
		mark_setting={}
		for setting in request.POST:
			if setting.startswith('min_for'):
				if request.POST[setting]!='':
					mark_setting[setting[-1]]=int(request.POST[setting])
			elif setting.startswith('autocorrect_'):
				if request.POST[setting]=="true":
					allowed_mistakes.append(setting[12:])
		Test.publish(course_id=course_id, test_id=test_id,allowed_mistakes=allowed_mistakes,mark_setting=mark_setting,section=section)
	return HttpResponse("Тест опубликован")


def unpublish(request):
	# makes test invisible in course screen
	course_id = request.POST.get("course_id",None)
	test_id = request.POST.get("test_id",None)
	Test.unpublish(course_id=course_id, test_id=test_id)
	return HttpResponse("Тест скрыт")


def share(request):
	# make test avalible in package_catalog
	pass


def attempt(request):
	# creates or continues attempt
	# loads test file
	course_id = request.GET.get("course_id",None)
	test_id = request.GET.get("test_id",None)
	if request.user.is_anonymous():
		return redirect('/login')
	if Test.is_creator(user=request.user,test_id=test_id,course_id=course_id):
		return redirect("/test/edit/?course_id="+course_id+"&test_id="+test_id)
	if Utility.is_member(user=request.user,course_id=course_id) and Test.is_published(test_id=test_id,course_id=course_id):
		context = Test.attempt(user=request.user,course_id=course_id, test_id=test_id)
		context["attempt"] = True
		context["type"]= "test"
		return render(request, 'Pages/Test/Attempt/main/exports.html', context)
	else:
		return redirect('/')


def check_question(request, item):
	return Test.check_question(item=item)


def attempt_save(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		question_id = int(request.POST.get("question",None))
		course_id = request.POST.get("course_id",None)
		answer = request.POST.get("answer", None)
		Test.attempt_save(test_id=test_id, question_id=question_id, course_id=course_id, answer=answer, user=request.user)
		return HttpResponse("ok")

def change_answer_status(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		question_id = str(request.POST.get("question_id",None))
		course_id = request.POST.get("course_id",None)
		user=request.POST.get("user",None)
		question_result=request.POST.get("question_status",None)
		Test.change_answer_status(user=user,test_id=test_id,course_id=course_id,question_id=question_id,question_result=question_result)
		return HttpResponse("ok")

def results(request):
	if request.user.is_anonymous():
		return redirect('/login')
	course_id = request.GET["course_id"]
	test_id = request.GET["test_id"]
	user_id=request.GET.get("user_id",request.user.id)
	if Utility.is_teacher(user=request.user,course_id=course_id) or user_id==request.user.id:
		user=User.objects.get(id=user_id)
		context = {"course": Course.objects.get(id=course_id), 
		"results": Test.get_results(user=user, course_id=course_id, test_id=test_id), 
		"attempt": Test.get_attempt_info(user=user, course_id=course_id, test_id=test_id), 
		"test": Test.get_test_info(course_id=course_id, test_id=test_id), "user_status": Course.objects.load_user_status(course=Course.objects.get(id=course_id), user=request.user)}
		test=Test.load(course_id=course_id, test_id=test_id)
		context["test"]["json"]=test["json"]
		context["is_results"] = True
		return render(request, 'Pages/Test/Attempt/results/exports.html', context)
	else: return redirect('/')

def attempt_check(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		course_id = request.POST.get("course_id",None)
		Test.attempt_check(test_id=test_id, course_id=course_id, user=request.user)
		return HttpResponse("ok")

def give_mark(request, percentage, course_id, test_id):
	return Test.give_mark(percentage=percentage, course_id=course_id, test_id=test_id)

def set_mark_quality(mark):
	return Test.object.set_mark_quality(mark=mark)

def get_results(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		course_id = request.POST.get("course_id",None)
		user_id=request.POST.get("user_id",None)
		return HttpResponse(json.dumps(Test.get_results(course_id=course_id, test_id=test_id, user_id=user_id),ensure_ascii=False))

def get_test_info(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		course_id = request.POST.get("course_id",None)
		return HttpResponse(json.dumps(Test.get_test_info(course_id=course_id, test_id=test_id),ensure_ascii=False))

def get_attempt_info(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id",None)
		course_id = request.POST.get("course_id",None)
		user_id=request.POST.get("user_id",None)
		return HttpResponse(json.dumps(Test.get_attempt_info(course_id=course_id, test_id=test_id, user_id=user_id),ensure_ascii=False))

def load_embmend(request):
	course_id=request.GET["course_id"]
	test_id=request.GET["test_id"]
	asset_id=request.GET["asset_id"]
	path='main/files/media/courses/' + course_id + '/assets/' + test_id + "/"
	f=open(path + asset_id + ".html", 'r')
	asset=f.read()
	return HttpResponse(asset)

def load_asset_file(request, course_id, test_id, asset_name):
	path='main/files/media/courses/' + course_id + '/assets/' + test_id + "/"
	f=open(path + asset_name, 'r')
	asset=f.read()
	response=HttpResponse(FileWrapper(asset.getvalue()),
	                      content_type='application/zip')
	response['Content-Disposition']='attachment; filename=myfile.zip'
	return response


def get_results(request):
	if request.method == 'POST':
		course_id=request.POST["course_id"]
		test_id=request.POST["test_id"]
		user_id=request.POST["user_id"]
		return HttpResponse(json.dumps(Test.get_results(course_id=course_id,test_id=test_id,user=User.objects.get(id=int(user_id))),ensure_ascii=False))

