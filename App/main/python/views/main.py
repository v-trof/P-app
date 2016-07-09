# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from main.models import User, Course
from main.python.views.functional import *
from main.python.views.test import *
import io
import json

class Main_group():

	def profile(request, user_id):
		user = User.objects.get(id=user_id)
		contacts_view_allowed=User.objects.get_view_permission(user=user, requesting_user=request.user)
		return render(request, 'Pages/Account/profile/exports.html', {
			   "user": user,
				"breadcrumbs": [{
					"href": "#",
					"link": "Профиль"
				}
				],
				"contacts_view_allowed": contacts_view_allowed,
				"contacts":User.objects.get_contacts(user=user),
				"possible_contacts": ["Мобильный телефон","ВКонтакте","Facebook","Дневник.py"],
			})

	def home(request):
		if request.user.is_anonymous():
			return render(request, 'Pages/home/exports.html')
		context={}
		with io.open('main/files/json/users/' + str(request.user.id) + '/settings.json', 'r', encoding='utf8') as settings_file:
				user_settings = json.load(settings_file)
		context["subjects"]=["Русский язык","Математика","Английский язык"]
		#sample_marks={"Русский язык":[{"course_marks":[{"test_id":1,"value":4,"quality":"positive","test_title":"Подготовка к ЕГЭ","right_answers":4,"questions_overall":6},{"test_id":2,"value":2,"quality":"negative","test_title":"Подготовка к ЕГЭ","right_answers":1,"questions_overall":6}],"course":Course.objects.get(id=1)}]}
		if request.user.participation_list:
			context["marks"] = User.objects.load_marks(string_array=request.user.participation_list, user_id=request.user.id)
			context["tasks"]={}
			if user_settings["assignments"]["sort_method"] == "by_course": 
				context["tasks"]["content"] = User.objects.load_assignments_by_course(string_array=request.user.participation_list, user=request.user)
			else:	
				context["tasks"]["content"] = User.objects.load_assignments_by_date(string_array=request.user.participation_list, user=request.user)
			context["tasks"]["sort_method"]=user_settings["assignments"]["sort_method"]
			context["courses"] = User.objects.load_courses_previews(string_array=request.user.participation_list)
		if request.user.courses:
			context["updates"] = User.objects.load_updates(user=request.user)
			context["own_courses"] = User.objects.load_courses_previews(string_array=request.user.courses)
		elif request.user.is_teacher:
			context["own_courses"] = []

		return render(request, 'Pages/home/exports.html', context)

class Auth_group():

	def login(request):
		if request.user.is_anonymous():      
			return render(request, 'Pages/Account/login/exports.html')
		else: return render(request, 'Pages/Account/login_info/exports.html')

	def login_with_reg(request, course_id=None):
		return render(request, 'Pages/Account/login/exports.html', {"course": Course.objects.get(id=course_id)})

	def change_user(request):
		if not request.user.is_anonymous():  
			logout(request)
		return render(request, 'Pages/Account/login/exports.html')

	def register(request, course_id=None):
		if not request.user.is_anonymous():  
			logout(request)
		if course_id is not None:
			return render(request, 'Pages/Account/registration/exports.html', {"course": Course.objects.get(id=course_id)})
		else:
			return render(request, 'Pages/Account/registration/exports.html')

	def forgot_password(request):
		return render(request, 'Pages/Account/password_recovery/exports.html')

	def secure_entry(request):
		type=request.GET['type']
		code=request.GET['code']
		approve_info=User.objects.approve(code=code,type=type)
		if approve_info==None:
			return render(request, 'Pages/404/exports.html')
		user_id=approve_info["user_id"]
		requesting_data=approve_info["requesting_data"]
		if User.objects.get(id=user_id):
			return render(request, 'Pages/Account/secure_entry/exports.html',{"user":User.objects.get(id=user_id),"type":type,"code":code,"requesting_data":requesting_data})

class Course_group():

	def main(request, course_id):
		course = Course.objects.get(id=course_id)
		course_data = Course.objects.get_data(user=request.user, course=course)
		if not request.user.is_anonymous():  
			is_participant=Course.objects.check_participance(course=course,user=request.user)
		else: is_participant=False
		announcements=Course.objects.load_announcements(course_id=course.id)
		tests=Course.objects.get_tests(course_id=str(course.id))
		return render(request, 'Pages/Course/main/exports.html', {"tests":tests, "is_participant": is_participant, "announcements": announcements, "course": course, "course_data": course_data, "assignments": Course.objects.get_assignments(user=request.user, course=course),
													 "breadcrumbs": [{
														 "href": "#",
														 "link": course.name
													 }
		]})

	def updates(request, course_id):
		context={}
		context=Course.objects.load_updates(course=Course.objects.get(id=course_id), user=request.user)
		context["course"]=Course.objects.get(id=course_id)
		return render(request, 'Pages/Course/updates/exports.html', context)

	def requests(request, course_id):
		pending_users=Course.objects.load_course_requests(course_id=course_id)
		return render(request, 'Pages/Course/course_requests/exports.html', {"course_id": course_id, "pending_users": get_users_info(request, pending_users),
															  "breadcrumbs": [{
																  "href": "/course/" + str(course_id),
																  "link": Course.objects.get(id=course_id).name
															  }, {
																  "href": "#",
																  "link": "Заявки"
															  }]
														  })

	def groups(request, course_id):
		if course_id:
			course = Course.objects.get(id=course_id)
			course_data=Course.objects.get_data(user=request.user, course=course)
			course_data["group_list"]=list(course_data["groups"].keys())
			context = {"course": course, "course_data": course_data,
					   "breadcrumbs": [{
						   "href": "/course/" + str(course.id),
						   "link": course.name
					   }, {
						   "href": "#",
						   "link": "Группы"
					   }]}
			return render(request, 'Pages/Course/groups/exports.html', context)
		else:
			return render(request, 'Pages/Course/groups/exports.html')

	def new_task(request, course_id):
		if course_id:
			course = Course.objects.get(id=course_id)
			context={}
			context["course"]={}
			context["course"]["materials"]=Course.objects.get_tests(course_id=course_id)
			context["course"]["tests"]=Course.objects.get_tests(course_id=course_id)
			context["course"]["object"]=course
			context["course"]["group_list"]=Course.objects.get_group_list(course=course)
			context["course"]["material_list"] = [
				{
					"title": "!How to make bugs!",
					"href": "/1"
				}]
			context["breadcrumbs"] = [{
				"href": "/course/" + str(course.id),
				"link": course.name
			}, {
				"href": "#",
				"link": "Выдать задание"
			}]
			return render(request, 'Pages/Course/give_task/exports.html', context)
		else:
			return render(request, 'Pages/Course/give_task/exports.html')

	class Elements():

		def groups_content(request, course_id):
			if course_id:
				course = Course.objects.get(id=course_id)
				context = {"course": course, "course_data": Course.objects.get_data(
					user=request.user, course=course)}
				return render(request, 'Blocks/groups_content.html', context)
			else:
				return render(request, 'Blocks/groups_content.html')


def ui_kit(request):
	context = {
		"course": {
			"name": "sample_course",
			"data": {
				"materials": {
					"published": ["a","b","c"]
				},
				"tests": {
					"published": ["saple_test"]
				}
			}
		},
		"user": {
			"name": "Sample User"
		},
		"announcement": {
			"heading": "sample_announcement",
			"text": "sample_text"
		},
		"breadcrumbs" : [{
			"href" : "/Курсы",
			"link" : "/course/1"
		},{
			"href" : "#",
			"link" : "Заявки"
		}],
		"request": {
			"user": {
				"name": "Sample User"
			}
		},
		"options": [{
			"value": 1,
			"text" : "Option 1",
		}, {
			"value": 2,
			"text" : "Option 2",
		}, {
			"value": 3,
			"text" : "Option 3",
		}],
		"assignment": {
			"content": {
				"materials": [{
					"done": True,
					"link": "#",
					"title": "Test n"
				},{
					"done": False,
					"link": "#",
					"title": "Test n+m"
				}],
				"tests": [],
				"traditional": [{
					"done": False,
					"content": "This is traditional task"
				},{
					"done": True,
					"content": "This is done traditional task"
				}]
			},
			"due_date": {

			}
		}
	}
	return render(request, 'Pages/UI_kit/exports.html', context)