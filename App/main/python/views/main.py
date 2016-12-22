# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from main.models import *
from main.python.views.functional import *
from main.python.views.test import *
import io
import json


class Main_group():

	def profile(request, user_id):
		if not User.objects.filter(id=int(user_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Профиль не существует"}]
			return redirect('/')
		user = User.objects.get(id=user_id)
		contacts_view_allowed = User.objects.get_view_permission(
			user=user, requesting_user=request.user)
		return render(request, 'Pages/Account/profile/exports.html', {
			"user": user,
			"breadcrumbs": [{
							"href": "#",
							"link": "Профиль"
							}
							],
			"contacts_view_allowed": contacts_view_allowed,
			"contacts": User.objects.get_contacts(user=user),
			"possible_contacts": ["Мобильный телефон", "ВКонтакте", "Facebook", "Дневник.py", "email"],
		})

	def home(request):
		if request.user.is_anonymous():
			return render(request, 'Pages/promo/exports.html')
		context = {}
		user_settings={}
		if os.path.isfile('main/files/json/users/' + str(request.user.id) + '/settings.json'):
			with io.open('main/files/json/users/' + str(request.user.id) + '/settings.json', 'r', encoding='utf8') as settings_file:
				user_settings = json.load(settings_file)
		else: user_settings["assignments"]["sort_method"] == "by_date"
		context["subjects"] = {"Гуманитарные науки":["Литература","История","Обществознание"],"Языки":["Русский язык","Английский язык","Немецкий язык","Французский язык","Испанский язык"],"Точные науки":["Математика","Информатика"], "Естественные науки":["Физика","Химия","Биология","География"]}
		if request.user.participation_list:
			context["marks"] = User.objects.load_marks(
				string_array=request.user.participation_list, user_id=request.user.id)
			context["tasks"] = {}
			if user_settings["assignments"]["sort_method"] == "by_course":
				context["tasks"]["content"] = User.objects.load_assignments_by_course(
					string_array=request.user.participation_list, user=request.user)
			else:
				context["tasks"]["content"] = User.objects.load_assignments_by_date(
					string_array=request.user.participation_list, user=request.user)
			context["tasks"]["sort_method"] = user_settings[
				"assignments"]["sort_method"]
			context["courses"] = User.objects.load_courses_previews(
				string_array=request.user.participation_list, user_id=request.user.id)
		if request.user.courses:
			context["updates"] = User.objects.load_updates(user=request.user)
			context["own_courses"] = User.objects.load_courses_previews(
				string_array=request.user.courses)
		elif request.user.is_teacher:
			context["own_courses"] = []

		return render(request, 'Pages/home/exports.html', context)

	def search(request):
		search_query=request.GET.get('query','')
		course=request.GET.get('course',None)
		context={}
		if course:
			context["search_results"]=Search.in_courses_materials(search_query=search_query, user=request.user, course=course)
		else: context["search_results"]=Search.complex(search_query=search_query, user=request.user)
		return render(request, 'Pages/search/exports.html', context)

	def promo(request):
		context={}
		return render(request, 'Pages/promo/exports.html', context)
class Auth_group():

	def login(request):
		if request.user.is_anonymous():
			return render(request, 'Pages/Account/login/exports.html')
		else:
			return render(request, 'Pages/Account/login_info/exports.html')

	def login_with_reg(request, course_id=None):
		if Course.objects.filter(id=course_id).exists():
			return render(request, 'Pages/Account/login/exports.html', {"course": Course.objects.get(id=course_id)})
		else:
			return render(request, 'Pages/Account/login/exports.html', {"notifications": [{"type": "error", "message": "Курс не существует"}]})

	def change_user(request):
		if not request.user.is_anonymous():
			logout(request)
		return render(request, 'Pages/Account/login/exports.html')

	def register(request, course_id=None):
		if Course.objects.filter(id=course_id).exists():
			code=request.GET.get('code',None)
			return render(request, 'Pages/Account/registration/exports.html', {"course": Course.objects.get(id=course_id),"code":code})
		else:
			return render(request, 'Pages/Account/registration/exports.html', {"notifications": [{"type": "error", "message": "Курс не существует"}]})

	def forgot_password(request):
		return render(request, 'Pages/Account/password_recovery/exports.html')

	def secure_entry(request):
		type = request.GET['type']
		code = request.GET['code']
		approve_info = User.objects.approve(code=code, type=type)
		if approve_info == None:
			request.session['notifications']=[{"type": "error", "message": "Код не подходит"}]
			return redirect('/')
		user_id = approve_info["user_id"]
		requesting_data = approve_info["requesting_data"]
		if User.objects.filter(id=int(user_id)).exists():
			return render(request, 'Pages/Account/secure_entry/exports.html', {"user": User.objects.get(id=int(user_id)), "type": type, "code": code, "requesting_data": requesting_data})
		else:
			request.session['notifications']=[{"type": "error", "message": "Пользователь не существует"}]
			return redirect('/')


class Course_group():

	def main(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/'
			return redirect('/login/')
		if not Course.objects.filter(id=course_id).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		course = Course.objects.get(id=course_id)
		is_participant = Course.objects.check_participance(
			course=course, user=request.user)
		sources = Course.objects.load_sources(
			course_id=course.id, user=request.user)
		announcements = Course.objects.load_announcements(
			course_id=course.id, user=request.user)
		sections = Course.objects.get_sections(course_id=str(course.id), user=request.user)
		assignments = Course.objects.get_assignments(
			user=request.user, course=course)
		return render(request, 'Pages/Course/main/exports.html', {"user_status":Course.objects.load_user_status(user=request.user, course=course),"sections": sections, "sources": sources, "is_participant": is_participant, "announcements": announcements, "course": course, "assignments": assignments,
																  "breadcrumbs": [{
																	  "href": "#",
																	  "link": course.name
																  }
																  ]})

	def updates(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/updates/'
			return redirect('/login/')
		if not Course.objects.filter(id=course_id).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		context = {}
		context = Course.objects.load_updates(
			course=Course.objects.get(id=course_id), user=request.user)
		context["tasks_info"] = Marks.tasks_info(course_id=course_id)
		context["course"] = Course.objects.get(id=course_id)
		context["breadcrumbs"] = [{"href": "#", "link": "Обновления"}]
		return render(request, 'Pages/Course/updates/exports.html', context)

	def sources(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/sources/'
			return redirect('/login/')
		if not Course.objects.filter(id=course_id).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["sources"] = Course.objects.load_sources(
			course_id=course_id, user=request.user)
		context["course"] = Course.objects.get(id=course_id)
		context["user_status"] = Course.objects.load_user_status(
			user=request.user, course=course)
		context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "#", "link": "Источники"}]
		return render(request, 'Pages/Course/sources/exports.html', context)

	def manage(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/manage/'
			return redirect('/login/')
		if not Course.objects.filter(id=course_id).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["subjects"] = {"Гуманитарные науки":["Литература","История","Обществознание"],"Языки":["Русский язык","Английский язык","Немецкий язык","Французский язык","Испанский язык"],"Точные науки":["Математика","Информатика"], "Естественные науки":["Физика","Химия","Биология","География"]}
		context["course"] = course
		context["assignments"] = Course.objects.get_assignments(
			user=request.user, course=course)
		context["is_closed"] = course.is_closed
		context["sections"] = Course.objects.get_sections(
			course_id=str(course.id))
		context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "#", "link": "Управление курсом"}]
		return render(request, 'Pages/Course/manage/exports.html', context)

	def results(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/results/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["course"] = course
		context["from_task"] = True
		context["read"] = True
		if 'task_id' in request.GET:
			task_id = request.GET['task_id']
			context["marks"] = Marks.get_marks_by_task(
				course_id=course_id, task_id=task_id)
			context["tests"] = Test.get_tests_in_task_info(task_id=task_id,course_id=course_id)
			for test in context["tests"]:
				context["tests"][test]["summary"]=Statistics.get_test_statistics(test_id=test,course_id=course_id)
			context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "/course/" + str(course.id) + "/marks/", "link": "Задания"}, {"href": "#", "link": "Результаты"}]
		elif 'test_id' in request.GET:
			test_id = request.GET['test_id']
			context["marks"] = Marks.get_marks_for_test_list(
				course_id=course_id, test_list=[test_id])
			context["test_id"] = test_id
			context["summary"] = Statistics.get_test_statistics(test_id=test_id,course_id=course_id)
			context["tests"] = {str(test_id):Test.get_test_info(course_id=course_id,test_id=test_id)}
			context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "/course/" + str(course.id) + "/marks/tests/", "link": "Тесты"}, {"href": "#", "link": "Результаты"}]
		else:
			request.session['notifications']=[{"type": "error", "message": "Недостаточно данных"}]
			return redirect('/')
		context["groups"] = Course.objects.load_groups(
			course=Course.objects.get(id=int(course_id)))
		return render(request, 'Pages/Course/Marks/results/exports.html', context)

	def marks(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/marks/'
			return redirect('/login/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["from_task"] = True
		context["course"] = course
		context["tasks"] = Marks.by_tasks(course_id=course_id)
		context["tasks_info"] = Marks.tasks_info(course_id=course_id)
		context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "#", "link": "Оценки за задания"}]
		return render(request, 'Pages/Course/Marks/tasks/exports.html', context)

	def marks_by_groups(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/marks/by_groups/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["course"] = course
		context["from_task"] = False
		context["tasks"] = Marks.by_groups(
			course_id=course_id, test_id=test_id)
		context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "#", "link": "Результаты"}]
		return render(request, 'Pages/Course/Marks/tests/exports.html', context)

	def marks_by_tests(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/marks/by_tests/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["course"] = course
		context["from_task"] = False
		context["tests"] = Marks.tests_info(course_id=course_id)
		context["breadcrumbs"] = [
			{"href": "/course/" + str(course.id), "link": course.name}, {"href": "#", "link": "Оценки за тесты"}]
		return render(request, 'Pages/Course/Marks/tests/exports.html', context)

	def groups(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/groups/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		course = Course.objects.get(id=course_id)
		course_data = {}
		course_data["user_status"] = Course.objects.load_user_status(
			user=request.user, course=course)
		course_data["course_id"] = course.id
		course_data["teachers"] = Course.objects.load_teachers(
			user=request.user, course=course)
		course_data["status"] = Course.objects.get_status(course=course)
		course_data["groups"] = Course.objects.load_groups(
			user=request.user, course=course)
		if course_data["user_status"] == "guest":
			return redirect('/')
		if course.is_closed:
			course_data["requests"]=Course.objects.load_requests(course=course)
		course_data["group_list"] = Course.objects.get_group_list(
			course=course)
		context = {"course": course, "course_data": course_data,
				   "breadcrumbs": [{
					   "href": "/course/" + str(course.id),
								   "link": course.name
								   }, {
							   "href": "#",
								   "link": "Группы"
								   }]}
		return render(request, 'Pages/Course/groups/exports.html', context)

	def new_task(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/give_task/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		context = {}
		context["course"] = {}
		context["edit"] = False
		context["course"]["materials"] = Course.objects.get_materials(
			course_id=course_id)
		context["course"]["tests"] = Course.objects.get_tests(
			course_id=course_id)
		context["course"]["object"] = course
		context["course"][
			"group_list"] = Course.objects.get_group_list(course=course)
		context["breadcrumbs"] = [{
			"href": "/course/" + str(course.id),
			"link": course.name
		}, {
			"href": "#",
			"link": "Выдать задание"
		}]
		return render(request, 'Pages/Course/give_task/exports.html', context)

	def edit_assignment(request, course_id):
		if request.user.is_anonymous():
			request.session['last_page']='/course/'+course_id+'/edit_task/'
			return redirect('/login/')
		if not Course.objects.filter(id=int(course_id)).exists():
			request.session['notifications']=[{"type": "error", "message": "Курс не существует"}]
			return redirect('/')
		if not Utility.is_teacher(user=request.user, course_id=course_id):
			request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
			return redirect('/course/' + course_id + '/')
		course = Course.objects.get(id=course_id)
		task_id = request.GET['task_id']
		context = {}
		context["task"] = Course.objects.get_assignment(
			user=request.user, course=course, task_id=task_id)
		context["course"] = {}
		context["edit"] = True
		context["course"]["materials"] = Course.objects.get_tests(
			course_id=course_id)
		context["course"]["tests"] = Course.objects.get_tests(
			course_id=course_id)
		context["course"]["object"] = course
		context["course"][
			"group_list"] = Course.objects.get_group_list(course=course)
		context["course"]["materials"] = Course.objects.get_materials(
			course_id=course_id)
		context["breadcrumbs"] = [{
			"href": "/course/" + str(course.id),
			"link": course.name
		}, {
			"href": "#",
			"link": "Изменить задание"
		}]
		return render(request, 'Pages/Course/give_task/exports.html', context)

class Testing_group():

	def test_suit(request, module):
		module = module.replace('.', '/')
		return render(request, 'Elements/Modules/'+module+'/test_suite/exports.html')

	def ui_kit(request):
		context = {
			"course": {
				"name": "sample_course",
				"data": {
					"materials": {
						"published": ["a", "b", "c"]
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
			"breadcrumbs": [{
				"href": "/Курсы",
				"link": "/course/1"
			}, {
				"href": "#",
				"link": "Заявки"
			}],
			"request": {
				"user": {
					"name": "Sample User"
				}
			},
			"options": [{
				"value": 1,
						"text": "Option 1",
						}, {
				"value": 2,
						"text": "Option 2",
						}, {
				"value": 3,
						"text": "Option 3",
						}],
			"assignment": {
				"content": {
					"materials": [{
						"done": True,
						"link": "#",
						"title": "Test n"
					}, {
						"done": False,
						"link": "#",
						"title": "Test n+m"
					}],
					"tests": [],
					"traditional": [{
						"done": False,
						"content": "This is traditional task"
					}, {
						"done": True,
						"content": "This is done traditional task"
					}]
				},
				"due_date": {

				}
			}
		}
		return render(request, 'Pages/UI_kit/exports.html', context)
