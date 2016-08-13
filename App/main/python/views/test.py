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
	context = Test.create(course_id=course_id)
	context["breadcrumbs"] = [{
		"href": "/course/" + str(course_id),
		"link": Course.objects.get(id=course_id).name
	}, {
		"href": "#",
		"link": "Новый тест"
	}]
	context["sections"] = Course.objects.get_sections_list(course_id=course_id)
	context["type"] = "test"
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
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		message = Test.save(
			json_file=json_file, course_id=course_id, test_id=test_id, user=request.user)
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
	context["type"] = "test"
	return render(request, 'Pages/Test/editor/exports.html', context)


def publish(request):
	# makes test visible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		section = request.POST.get("section", "Нераспределенные")
		max_score=request.POST.get("max_score",False)
		allowed_mistakes = []
		mark_setting = {}
		for setting in request.POST:
			if setting.startswith('min_for'):
				if request.POST[setting] != '':
					mark_setting[setting[-1]] = int(request.POST[setting])
			elif setting.startswith('autocorrect_'):
				if request.POST[setting] == "true":
					allowed_mistakes.append(setting[12:])
		message = Test.publish(course_id=course_id, test_id=test_id,
								allowed_mistakes=allowed_mistakes, mark_setting=mark_setting, max_score=max_score, section=section)
		return HttpResponse(json.dumps(message), content_type="application/json")


def unpublish(request):
	# makes test invisible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id", None)
		test_id = request.POST.get("test_id", None)
		message = Test.unpublish(course_id=course_id, test_id=test_id)
		return HttpResponse(json.dumps(message), content_type="application/json")


def share(request):
	# make test avalible in package_catalog
	pass


def attempt(request):
	# creates or continues attempt
	# loads test file
	course_id = request.GET.get("course_id", None)
	test_id = request.GET.get("test_id", None)
	if request.user.is_anonymous():
		request.session['notifications']=[{"type": "error", "message": "Вы должны зайти в систему"}]
		return redirect('/login')
	if Test.is_creator(user=request.user, test_id=test_id, course_id=course_id):
		return redirect("/test/edit/?course_id=" + course_id + "&test_id=" + test_id)
	if Utility.is_member(user=request.user, course_id=course_id) and Test.is_published(test_id=test_id, course_id=course_id):
		if Test.is_finished(user_id=request.user.id, test_id=test_id, course_id=course_id):
			return redirect("/test/attempt/results/?course_id=" + course_id + "&test_id=" + test_id)
		context = Test.attempt(
			user=request.user, course_id=course_id, test_id=test_id)
		print(context)
		context["attempt"] = True
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
		question_id = str(request.POST.get("question_id", None))
		course_id = request.POST.get("course_id", None)
		user_id = request.POST.get("user_id", None)
		question_result = request.POST.get("question_status", None)
		message = Test.change_answer_status(
			user_id=user_id, test_id=test_id, course_id=course_id, question_id=question_id, question_result=question_result)
		return HttpResponse(json.dumps(message), content_type="application/json")

def change_score(request):
	if request.method == 'POST':
		test_id = request.POST.get("test_id", None)
		answer_id = str(request.POST.get("answer_id", None))
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
				   "test": Test.get_test_info(course_id=course_id, test_id=test_id), "user_status": Course.objects.load_user_status(course=Course.objects.get(id=course_id), user=request.user)}
		context["breadcrumbs"] = [{
		"href": "/course/" + str(course_id),
		"link": Course.objects.get(id=course_id).name
	}, {
		"href": "/test/attempt/?course_id="+course_id+"&test_id="+test_id,
		"link": context["test"]["title"]
	},{
		"href": "#",
		"link": "Результаты"
	}]
		test = Test.load(course_id=course_id, test_id=test_id)
		context["test"]["json"] = test["json"]
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
		return HttpResponse(json.dumps(Test.get_test_info(course_id=course_id, test_id=test_id), ensure_ascii=False), content_type="application/json")


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
