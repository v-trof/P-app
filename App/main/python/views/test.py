#! /usr/bin/env python
# -*- coding: utf-8 -*-
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
		course_id = request.GET['course_id']
		if request.user.is_anonymous():
			request.session['notifications']=[{"type": "error", "message": "Вы должны зайти в систему"}]
			return redirect('/login/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id)
		if "test_id" in request.GET:
			return load(request)
		else:
			return create(request)
	else:
		return redirect('/')


def create(request):
	# creates test environment (no test exists as file untill saved)
	course_id = request.GET.get("course_id", None)
	context = Test.create(course_id=course_id,user_id=str(request.user.id))
	context["breadcrumbs"] = [{
		"href": "/course/" + str(course_id),
		"link": Course.objects.get(id=course_id).name
	}, {
		"href": "#",
		"link": "Новый тест"
	}]
	context["sections"] = Course.objects.get_sections_list(course_id=course_id)
	context["sections"].append('Новая...')
	context["type"] = "test"
	print(context)
	return render(request, 'Pages/Test/editor/exports.html', context)


def delete(request):
	# moves test to trash bin
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		message = Test.delete(course_id=course_id, test_id=test_id)
		return HttpResponse(json.dumps(message), content_type="application/json")


def save(request):
	# saves test file
	if request.method == 'POST':
		json_file = request.POST.get("json_file", None)
		compiled_json = request.POST.get("compiled_test", None)
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", False)
		message = Test.save(
			json_file=json_file, compiled_json=compiled_json, course_id=course_id, test_id=test_id, user=request.user)
		return HttpResponse(json.dumps(message), content_type="application/json")


def load(request):
	# loads test file
	course_id = request.GET.get("course_id", None)
	test_id = request.GET.get("test_id", None)
	test = Test.load(course_id=course_id, test_id=test_id)
	context = {}
	context["test"] = test
	context["test"]["id"] = test_id
	context["course"] = Course.objects.get(id=course_id)
	context["breadcrumbs"] = [{
		"href": "/course/" + str(course_id),
		"link": Course.objects.get(id=course_id).name
	}, {
		"href": "#",
		"link": test["json"]["title"]
	}]
	context["sections"] = Course.objects.get_sections_list(course_id=course_id)
	context["sections"].append('Новая...')
	context["type"] = "test"
	context["test"]["json"]=json.dumps(context["test"]["json"])
	return render(request, 'Pages/Test/editor/exports.html', context)


def publish(request):
	# makes test visible in course screen
	if request.method == 'POST':
		publish_data=json.loads(request.POST["publish_data"])
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		message = Test.publish(course_id=course_id, test_id=test_id,publish_data=publish_data)
		return HttpResponse(json.dumps(message), content_type="application/json")


def unpublish(request):
	# makes test invisible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		message = Test.unpublish(course_id=course_id, test_id=test_id)
		return HttpResponse(json.dumps(message), content_type="application/json")


def attempt(request):
	# creates or continues attempt
	# loads test file
	course_id = request.GET.get("course_id", None)
	test_id = request.GET.get("test_id", None)
	if request.user.is_anonymous():
		request.session['notifications']=[{"type": "error", "message": "Вы должны зайти в систему"}]
		return redirect('/login')
	if Utility.is_teacher(user=request.user,course_id=course_id):
		return redirect("/test/edit/?course_id=" + course_id + "&test_id=" + test_id)
	if Utility.is_member(user=request.user, course_id=course_id) and Test.is_published(test_id=test_id, course_id=course_id):
		if Test.is_finished(user_id=request.user.id, test_id=test_id, course_id=course_id):
			return redirect("/test/attempt/results/?course_id=" + course_id + "&test_id=" + test_id)
		context = Test.attempt(
			user=request.user, course_id=course_id, test_id=test_id)
		context["type"] = "test"
		context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		},{
			"href": "#",
			"link": "Попытка"
		}]
		return render(request, 'Pages/Test/Attempt/main/exports.html', context)
	else:
		request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
		return redirect('/')

def reset_attempt(request):
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		user_id = request.POST.get("user_id", None)
		message = Test.reset_attempt(test_id=test_id,user_id=user_id,course_id=course_id)
		return HttpResponse(json.dumps(message), content_type="application/json") 

def request_reset(request):
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		user_id = str(request.POST.get("user_id", request.user.id))
		message = Test.request_reset(test_id=test_id,user_id=user_id,course_id=course_id)
		return HttpResponse(json.dumps(message), content_type="application/json")

def check_question(request, item):
	return Test.check_question(item=item)


def attempt_save(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		question_id = int(request.POST.get("question", None))
		course_id = request.POST.get("course_id", None)
		answer = request.POST.get("answer", None)
		message=Test.attempt_save(test_id=test_id, question_id=question_id,
						  course_id=course_id, answer=answer, user=request.user)
		return HttpResponse(json.dumps(message), content_type="application/json")


def change_answer_status(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		question_id = int(request.POST.get("question_id", None))
		course_id = request.POST.get("course_id", None)
		user_id = request.POST.get("user_id", None)
		question_result = request.POST.get("question_status", None)
		message = Test.change_answer_status(
			user_id=user_id, test_id=test_id, course_id=course_id, question_id=question_id, question_result=question_result)
		return HttpResponse(json.dumps(message), content_type="application/json")

def change_score(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		answer_id = int(request.POST.get("answer_id", None))
		course_id = request.POST.get("course_id", None)
		user_id = request.POST.get("user_id", None)
		score = request.POST.get("score", None)
		response = Test.change_score(user_id=user_id, test_id=test_id, course_id=course_id, answer_id=answer_id, score=score)
		return HttpResponse(json.dumps(response, ensure_ascii=False), content_type="application/json")


def results(request):
	if request.user.is_anonymous():
		return redirect('/login/')
	course_id = request.GET.get("course_id", None)
	test_id = request.GET.get("test_id", None)
	user_id = request.GET.get("user_id", request.user.id)
	if Utility.is_teacher(user=request.user, course_id=course_id) or user_id == request.user.id:
		if not User.objects.filter(id=user_id).exists():
			request.session['notifications']=[{"type": "error", "message": "Пользователь не существует"}]
			return redirect('/')
		user = User.objects.get(id=user_id)
		context = {"course": Course.objects.get(id=course_id),
				   "results": Test.get_results(user_id=str(user.id), course_id=course_id, test_id=test_id),
				   "attempt": Test.get_attempt_info(user_id=str(user.id), course_id=course_id, test_id=test_id),
				   "test": {"json":Test.get_test_info(course_id=course_id, test_id=test_id, compiled=True, user_id=user_id),"id":test_id}, 
				   "user_status": Course.objects.load_user_status(course=Course.objects.get(id=course_id), user=request.user)}
		context["breadcrumbs"] = [{
		"href": "/course/" + str(course_id),
		"link": Course.objects.get(id=course_id).name
	}, {
		"href": "/test/attempt/?course_id="+course_id+"&test_id="+test_id,
		"link": context["test"]["json"]["title"]
	},{
		"href": "#",
		"link": "Результаты"
	}]
		context["is_results"] = True
		return render(request, 'Pages/Test/Attempt/results/exports.html', context)
	else:
		request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
		return redirect('/')


def attempt_check(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		course_id = request.POST.get("course_id", None)
		message = Test.attempt_check(
			test_id=test_id, course_id=course_id, user=request.user)
		return HttpResponse(json.dumps(message), content_type="application/json")


def give_mark(request, percentage, course_id, test_id):
	return Test.give_mark(percentage=percentage, course_id=course_id, test_id=test_id)


def set_mark_quality(mark):
	return Test.object.set_mark_quality(mark=mark)

def get_results(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		course_id = request.POST.get("course_id", None)
		user_id = request.POST.get("user_id", None)
		return HttpResponse(json.dumps(Test.get_results(course_id=course_id, test_id=test_id, user_id=user_id), ensure_ascii=False), content_type="application/json")

def get_test_info(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		course_id = request.POST.get("course_id", None)
		compiled = request.POST.get("compiled", False)
		user_id = request.POST.get("user_id", False)
		if compiled:
			compiled=True
		return HttpResponse(json.dumps(Test.get_test_info(course_id=course_id, test_id=test_id,user_id=user_id,compiled=compiled), ensure_ascii=False), content_type="application/json")

def get_attempt_info(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		course_id = request.POST.get("course_id", None)
		user_id = request.POST.get("user_id", None)
		return HttpResponse(json.dumps(Test.get_attempt_info(course_id=course_id, test_id=test_id, user_id=user_id), ensure_ascii=False), content_type="application/json")

# def load_embmend(request):
#	course_id=request.GET["course_id"]
#	test_id=request.GET["test_id"]
#	asset_id=request.GET["asset_id"]
#	path='main/files/media/courses/' + course_id + '/assets/' + test_id + "/"
#	f=open(path + asset_id + ".html", 'r')
#	asset=f.read()
#	return HttpResponse(asset)
#
# def load_asset_file(request, course_id, test_id, asset_name):
#	path='main/files/media/courses/' + course_id + '/assets/' + test_id + "/"
#	f=open(path + asset_name, 'r')
#	asset=f.read()
#	response=HttpResponse(FileWrapper(asset.getvalue()),
#	                      content_type='application/zip')
#	response['Content-Disposition']='attachment; filename=myfile.zip'
#	return response
