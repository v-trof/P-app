# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from .models import User, Course
from main.func_views import *
from main.test_views import *
import io
import json

class Main_group():

	def profile(request, user_id):
		user = User.objects.get(id=user_id)
		contacts_view_allowed=User.objects.get_view_permission(user=user, requesting_user=request.user)
		try:
			return render(request, 'Pages/profile.html', {
				"user": user,
				"breadcrumbs": [{
					"href": "#",
					"link": "Профиль"
				}
				],
				"contacts_view_allowed": contacts_view_allowed,
			})
		except:
			return render(request, 'Pages/404.html')

	def updates(request, course_id):
		return render(request, 'Pages/updates.html', {"course": Course.objects.get(id=course_id), "course": User.objects.get_data(object=request.user, course_id=course_id)})

	def home(request):
		if request.user.is_anonymous():
			return render(request, 'Pages/home.html')
		courses = []
		user_courses = []
		if request.user.participation_list:
			courses = User.objects.load_courses(user=request.user)
		if request.user.courses:
			user_courses = User.objects.load_self_courses(user=request.user)
		if request.user.is_teacher:
			context = {"courses": courses, "user_courses": user_courses,
					   "user_data": User.objects.get_data(object=request.user, course_id=False)}
			return render(request, 'Pages/home.html', context)
		else:
			context = {"courses": courses}
			return render(request, 'Pages/home.html', context)

class Auth_group():

	def login(request):
		return render(request, 'Pages/login.html')

	def login_with_reg(request, course_id=None):
		return render(request, 'Pages/login.html', {"course": Course.objects.get(id=course_id)})

	def change_user(request):
		logout(request)
		return render(request, 'Pages/login.html')

	def register(request, course_id=None):
		if course_id is not None:
			return render(request, 'Pages/registration.html', {"course": Course.objects.get(id=course_id)})
		else:
			return render(request, 'Pages/registration.html')

	def forgot_password(request):
		return render(request, 'Pages/forgot_password.html')

class Course_group():

	def main(request, course_id):
		course = Course.objects.get(id=course_id)
		course_data = Course.objects.get_data(user=request.user, course=course)
		is_participant=Course.objects.check_participance(course=course,user=request.user)
		announcements=Course.objects.load_announcements(course=course)
		return render(request, 'Pages/course.html', {"is_participant": is_participant, "announcements": announcements, "course": course, "course_data": course_data, "assignments": Course.objects.get_assignments(user=request.user, course=course),
													 "breadcrumbs": [{
														 "href": "#",
														 "link": course.name
													 }
		]})

	def requests(request, course_id):
		pending_users=Course.objects.load_course_requests(course_id=course_id)
		return render(request, 'Pages/course_requests.html', {"course_id": course_id, "pending_users": get_users_info(request, pending_users),
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
			context = {"course": course, "course_data": Course.objects.get_data(user=request.user, course=course),
					   "breadcrumbs": [{
						   "href": "/course/" + str(course.id),
						   "link": course.name
					   }, {
						   "href": "#",
						   "link": "Группы"
					   }]}
			return render(request, 'Pages/groups.html', context)
		else:
			return render(request, 'Pages/groups.html')

	def new_task(request, course_id):
		if course_id:
			course = Course.objects.get(id=course_id)
			context = {"course": course, "course_data": Course.objects.get_data(
				user=request.user, course=course)}
			context["course_data"]["material_list"] = [
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
			return render(request, 'Pages/give_task.html', context)
		else:
			return render(request, 'Pages/give_task.html')

	class Elements():

		def groups_content(request, course_id):
			if course_id:
				course = Course.objects.get(id=course_id)
				context = {"course": course, "course_data": Course.objects.get_data(
					user=request.user, course=course)}
				return render(request, 'Blocks/groups_content.html', context)
			else:
				return render(request, 'Blocks/groups_content.html')

class Test_group():
	def results(request):
		course_id = request.GET["course_id"]
		test_id = request.GET["test_id"]
		context = {"course": Course.objects.get(id=course_id), "test_id": test_id, "results": get_results(
			request, course_id, test_id), "attempt": get_attempt_info(request, course_id, test_id), "test": get_test_info(request, course_id, test_id)}
		return render(request, 'Pages/results.html', context)
