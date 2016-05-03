from __future__ import unicode_literals
from django.db import models
import sqlite3
from django.contrib.auth.models import (
	AbstractBaseUser, PermissionsMixin, UserManager
)
from django.contrib import auth
from django.contrib.auth.hashers import (
	check_password, is_password_usable, make_password,
)
from django.contrib.auth.signals import user_logged_in
from django.contrib.contenttypes.models import ContentType

from django.core import validators
from django.core.exceptions import PermissionDenied
from django.core.mail import send_mail

from django.utils import six, timezone
from django.utils.crypto import get_random_string, salted_hmac
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from django import forms
from django.forms.models import modelform_factory
import io
import json
import glob
from http import cookies
import collections
import sqlite3
import json
import pdb
import unicodedata
import os
import io
import random
import string
import hashlib
from django.conf import settings
from django.core import serializers
from django.core.files import File
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response, redirect
from django.template import RequestContext
from django.core.mail import send_mail
from django.db import models
from django.contrib.auth import logout
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login as auth
from django.contrib.auth.hashers import make_password, check_password
from django.core.urlresolvers import reverse
from django.core.mail import EmailMultiAlternatives
from binascii import hexlify
import glob
from http import cookies
import collections


class MediaModel(models.Model):
	media_file = models.FileField(upload_to='media')


class RegForm(forms.Form):
	email = models.EmailField(_('email address'), blank=True)
	password = forms.CharField(widget=forms.PasswordInput(
		render_value=False), max_length=100)
	username = models.CharField(_('username'), max_length=30, unique=True)


class LoginForm(forms.Form):
	name = models.EmailField(_('email address'), blank=True)
	email = models.EmailField(_('email address'), blank=True)
	password = forms.CharField(widget=forms.PasswordInput(
		render_value=False), max_length=100)


class FileForm(forms.Form):
	file = forms.FileField(
		label='Select a file',
		help_text='max. 42 megabytes'
	)


class CourseManager(models.Manager):

	def create_course(self, name, subject, creator, is_closed):
		course = self.create(name=name, subject=subject, creator=creator.id)
		course.save()
		if creator.courses:
			setattr(creator, 'courses', creator.courses + " " + str(course.id))
		else: setattr(creator, 'courses', str(course.id))
		creator.save()
		os.makedirs('courses/' + str(course.id) + '/tests/')
		os.makedirs('main/files/media/courses/' + str(course.id) + '/assets/')
		with io.open('courses/' + str(course.id) + '/info.json', 'w+', encoding='utf8') as json_file:
			data = {}
			data["pending_users"] = {}
			data["groups"] = {}
			data["groups"]["Нераспределенные"] = {}
			data["pending_users"]["Нераспределенные"] = []
			data["users"] = [creator.id]
			data["tests"] = {}
			data["tests"]["amount"] = 0
			data["tests"]["published"] = []
			data["tests"]["unpublished"] = []
			data["administrators"] = [creator.id]
			data["teachers"] = {}
			data["teachers"][creator.id] = {}
			data["teachers"][creator.id]["new_users"] = []
			data["pending_users"]["Заявки"] = []
			data["status"] = "public"
			if is_closed:
				data["status"] = "closed"
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		os.makedirs('courses/' + str(course.id) + '/assignments/')
		with io.open('courses/' + str(course.id) + '/announcements.json', 'w+', encoding='utf8') as json_file:
			data = []
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return course

	def edit_groups(self, course, groups_data):
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["groups"] = groups_data
			for heading in data["groups"]:
				for key, value in enumerate(data["groups"][heading]):
					user = User.objects.get(name=value)
					data["groups"][heading][key] = user.id
				if heading not in data["pending_users"]:
					data["pending_users"][heading] = []
		with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def add_announcement(self, heading, text, course_id):
		with io.open('courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		data.append({"heading": heading, "text": text})
		with io.open('courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def task_set_undone(self,user,assignment_id, task_id, course_id):
		with io.open('courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = collections.OrderedDict(
				sorted(json.load(json_file).items()))
			keys = list(data.keys())
			index = keys[::-1][int(assignment_id)]
			data[index].append(task_id + 1)
		with io.open('courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def task_set_done(self,assignment_id, task_id, course_id):
		with io.open('courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = collections.OrderedDict(
				sorted(json.load(json_file).items()))
			keys = list(data.keys())
			index = keys[int(assignment_id) - 1]
			task = data[index].index(task_id)
			del data[index][task]
			if len(data[index]) == 0:
				del data[index]
		with io.open('courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def invite_students(self, course, user, group, email_list):
		subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
		text_content_nonreg = 'Вам поступило приглашение на курс ' + course.name + ' от ' + user.name + \
			' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/' + \
				str(course.id)
		text_content = 'Вам поступило приглашение на курс ' + course.name + ' от ' + user.name + \
			' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/' + \
				str(course.id)
		for value in email_list:
			with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data["pending_users"][group].append(value)
			with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
			if User.objects.filter(email=value):
				send_mail(subject, text_content, from_email,
						  [value], fail_silently=False)
			else:
				send_mail(subject, text_content_nonreg,
						  from_email, [value], fail_silently=False)
		return 0

	def invite_teacher(self, course, user, email):
		subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
		text_content_nonreg = 'Вам поступило приглашение на курс ' + course.name + ' от ' + user.name + \
			' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/' + \
				str(course.id)
		text_content = 'Вам поступило приглашение на курс ' + course.name + ' от ' + user.name + \
			' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/' + \
				str(course.id)
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			if "teachers" in data["pending_users"].keys():
				data["pending_users"]["teachers"].append(email)
			else:
				data["pending_users"]["teachers"] = []
				data["pending_users"]["teachers"].append(email)
		with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		if User.objects.filter(email=email):
			send_mail(subject, text_content, from_email,
					  [email], fail_silently=False)
		else:
			send_mail(subject, text_content_nonreg,
					  from_email, [email], fail_silently=False)
		return 0

	def reg_user(self, course, user):
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			if user.id not in data["users"]:
				if user.email not in data["pending_users"]["Заявки"]:
					checker = 0
					is_invited = False
					for group in data["pending_users"]:
						if user.email in data["pending_users"][group]:
							is_invited = True
							checker = 1
							if group == "teachers":
								if user.id in data["teachers"]:
									return redirect('/login/')
								data["teachers"][str(user.id)] = {}
								data["teachers"][str(user.id)][
													 "new_users"] = []
								data["pending_users"][
									"teachers"].remove(user.email)
							else:
								if user.id in data["groups"][group]:
									return redirect('/login/')
								data["users"].append(user.id)
								data["groups"][group][str(user.id)] = {}
								data["pending_users"][group].remove(user.email)
								data["groups"][group][str(user.id)][
														  "unseen_by"] = len(data["teachers"])
								for teacher in data["teachers"]:
									data["teachers"][teacher][
										"new_users"].append(user.id)
					if not data["status"] == "closed" and not checker and not is_invited:
						group = "Нераспределенные"
						data["groups"][group][str(user.id)] = {}
						data["groups"][group][str(user.id)][
												  "unseen_by"] = len(data["teachers"])
						for teacher in data["teachers"]:
							data["teachers"][teacher][
								"new_users"].append(user.id)
						data["users"].append(user.id)
						if user.participation_list:
							setattr(user, 'participation_list',
									user.participation_list + " " + str(course.id))
						else: setattr(user, 'participation_list', str(course.id))
						user.save()
					elif data["status"] == "closed": data["pending_users"]["Заявки"].append(user.id)
				with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
				if not os.path.exists('courses/' + str(course.id) + '/users/' + str(user.id) + '/'):
					os.makedirs('courses/' + str(course.id) +
								'/users/' + str(user.id) + '/')
					os.makedirs('courses/' + str(course.id) +
								'/users/' + str(user.id) + '/assignments/')
					data = {}
					with io.open('courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/done.json', 'a', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)
					data = {}
					with io.open('courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'a', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)
		return 0

	def get_data(self, user, course):
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_data = {}
			course_data["course_id"] = course.id
			course_data["teachers"] = []
			course_data["status"] = data["status"]
			course_data["users"] = []
			course_data["groups"] = {}
			course_data["user_status"] = []
			for teacher_id in data["teachers"]:
				course_data["teachers"].append(User.objects.get(id=teacher_id))
			for group in data["groups"]:
				course_data["groups"][group] = []
				for user_id in data["groups"][group]:
					course_data["groups"][group].append(
						User.objects.get(id=user_id))
			if user.is_anonymous():
				course_data["user_status"] = "guest"
			elif user.id in data["administrators"]:
				course_data["user_status"] = "administrator"
			elif user.id in data["teachers"]:
				course_data["user_status"] = "teacher"
			#   course_data["user_status"]="moderator"
			# elif str(user.id) in data["moderators"]:
			#   course_data["user_status"]="moderator"
			# elif str(user.id) in data["spectators"]:
			#   course_data["user_status"]="spectator"
			elif str(user.name) in data["users"]:
				course_data["user_status"] = "user"
			else: course_data["user_status"] = "guest"
			course_data["material_list"] = []
			course_data["test_list"] = []
			it = 0
			for test in glob.glob('courses/' + str(course.id) + '/tests/*.json'):
				it = it + 1
				if str(it) in data["tests"]["published"]:
					with io.open(test, 'r', encoding='utf8') as data_file:
						test_data = json.load(data_file)
						test_d = {}
						test_d["title"] = test_data["title"]
						test_d["link"] = '?course_id=' + \
							str(course.id) + '&test_id=' + str(it)
						course_data["test_list"].append(test_d)
		return course_data

	def get_assignments(self, user, course):
		assignments = []
		if user.is_anonymous():
			return assignments
		for assignment in glob.glob('courses/' + str(course.id) + '/assignments/*'):
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				assignments.append(data)
		return sorted(assignments, key=lambda k: k['due_date'])

	def user_get_assignments(self, user, course):
		assignments = []
		if user.is_anonymous():
			return assignments
		try:
			with io.open('courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
					data = json.load(json_file)
			global_it = 0
			for assignment in glob.glob('courses/' + str(course.id) + '/assignments/*'):
				file_name = os.path.basename(assignment).split('.')[0]
				if file_name in data.keys():
					with io.open(assignment, 'r', encoding='utf8') as data_file:
						new_data = json.load(data_file)
						done = True
						it = 0
						global_it += 1
						for task in new_data["tasks"]:
							it += 1
							if task["traditional"] and not it in data[file_name]:
								task["done"] = True
						new_data["id"] = global_it
						if os.path.basename(assignment).split('.')[0] in data.keys():
							assignments.append(new_data)
			return sorted(assignments, key=lambda k: k['due_date'])
		except: return assignments

	def get_users_info(self, user_ids):
		users = []
		for user_id in user_ids:
			users.append(User.objects.get(id=user_id))
		return users

	def accept_request(self, user, course_id):
		with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			for pending_user in data["pending_users"]["Заявки"]:
				if pending_user == user.id:
					data["pending_users"]["Заявки"].remove(pending_user)
			group = "Нераспределенные"
			course=Course.objects.get(id=course_id)
			data["users"].append(user.id)
			data["groups"][group]={}
			data["groups"][group][str(user.id)] = {}
			data["groups"][group][str(user.id)]["unseen_by"] = len(data["teachers"])
			if user.participation_list:
				setattr(user, 'participation_list',
						user.participation_list + " " + str(course.id))
			else: setattr(user, 'participation_list', str(course.id))
			user.save()
		with io.open('courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def decline_request(self, user, course_id):
		with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			del data["pending_users"]["Заявки"][data["pending_users"]["Заявки"].index(user.id)]
		with io.open('courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def create_assignment(self, course_id, test_list, material_list, traditionals_list, due_date):
		assignment = {}
		assignment["due_date"] = due_date
		assignment["tasks"] = []
		assignment_id = str(
			len(glob.glob('courses/' + str(course_id) + '/assignments/*')) + 1)
		non_traditional_task = {}
		non_traditional_task["traditional"] = False
		non_traditional_task["content"] = {}
		non_traditional_task["content"]["tests"] = []
		non_traditional_task["content"]["materials"] = []
		non_traditional_task["content"]["tests"] = json.loads(test_list)
		non_traditional_task["content"][
			"materials"] = json.loads(material_list)
		assignment["tasks"].append(non_traditional_task)
		if json.loads(traditionals_list):
			for traditional in json.loads(traditionals_list):
				traditional_task = {}
				traditional_task["traditional"] = True
				traditional_task["content"] = traditional
				assignment["tasks"].append(traditional_task)
		with io.open('courses/' + str(course_id) + '/assignments/' + assignment_id + '.json', 'a+', encoding='utf8') as json_file:
			saving_data = json.dumps(assignment, ensure_ascii=False)
			json_file.write(saving_data)
		for in_process_file in glob.glob('courses/' + str(course_id) + '/users/*/assignments/in_process.json'):
			with io.open(in_process_file, 'r', encoding='utf8') as json_file:
				data = json.load(json_file)
				data[assignment_id] = []
				it = 0
				for task in assignment["tasks"]:
					it += 1
					data[assignment_id].append(it)
			with io.open(in_process_file, 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
		return 0

	def get_group_list(self, course):
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_groups = []
			for group in data["groups"]:
				course_groups.append(group)
		return json.dumps(course_groups, ensure_ascii=False)

	def load_course_requests(self,course_id):
		with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			pending_users = data["pending_users"]["Заявки"]
		return pending_users

	def check_participance(self,course,user):
		if user.participation_list:
			if str(course.id) in user.participation_list.split(' '):
				is_participant = True
			else:
				is_participant = False
		else:
			is_participant = False
		return is_participant

	def load_announcements(self,course):
		with io.open('courses/' + str(course.id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			announcements = json.load(json_file)
		return announcements

class Course(models.Model):
	name = models.CharField(_('name'), max_length=30)
	subject = models.CharField(_('subject'), max_length=30)
	creator = models.CharField(_('creator'), max_length=30)
	objects = CourseManager()


class UserManager(UserManager):

	def login(self, request, email, password):
		user = authenticate(username=email, password=password)
		if user is not None:
			auth(request, user)
			request.session.set_expiry(36000)
			return 'success'
		else:
			return 'Неверный логин или пароль'

	def reg(self, request, form, course_id, email, is_teacher, password, name_last_name):
		if not User.objects.filter(email=email):
			user = User.objects.create_user(
				username=email,
				email=email,
				password=password,
				name=name_last_name,
				is_teacher=is_teacher,
				avatar='avatar.png',
				permission_level="0")
		else:
			return 'Данный email уже зарегистрирован'
		if user is not None:
				user.save()
				user = authenticate(username=email, password=password)
				auth(request, user)
				request.session.set_expiry(36000)
				if course_id and request.POST.get('course_reg', False):
					course_reg(request, course_id)
					return 'groups'
				return 'success'
		else:
			return 'Неверный логин или пароль'

	# change profile visibility settings
	def change_permission_level(self, user, permission_level):
		setattr(user, 'permission_level', permission_level)
		user.save()
		return 0

	# password change

	def change_password(self, request, user, old_password, new_password):
		if user.check_password(old_password):
			setattr(user, 'password', strip_tags(new_password))
			request.user.save()
			login(request)
			return user

	# loading courses for home page

	def load_courses(self,user):
		courses = {}
		if user.participation_list:
			course_list = user.participation_list.split(" ")
			for course_id in course_list:
				course = Course.objects.get(id=course_id)
				courses[course.subject] = []
			for course_id in course_list:
				course_data = {}
				course = Course.objects.get(id=course_id)
				course_data["object"] = course
				homework = Course.objects.user_get_assignments(user=user,course=course)
				with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
						data = json.load(data_file)
				course_data["data"] = data;
				marks = []
				for marks_file in glob.glob('courses/' + str(course.id) + '/users/' + str(user.id) + '/tests/results/*.json'):
					with io.open(marks_file, 'r', encoding='utf8') as data_file:
						data = json.load(data_file)
						mark = {}
						mark["test_id"] = data["test_id"]
						mark["value"] = data["mark"]
						mark["quality"] = data["mark_quality"]
						marks.append(mark)
				course_data["marks"] = marks
				course_data["tasks"] = homework
				courses[course.subject].append(course_data)
		return courses

	# loading self-created courses

	def load_self_courses(self, user):
		user_courses = {}
		if user.courses:
			course_list = user.courses.split(" ")
			for course_id in course_list:
				course = Course.objects.get(id=course_id)
				user_courses[course.subject] = []
			for course_id in course_list:
				course_data = {}
				course = Course.objects.get(id=course_id)
				course_data["object"] = course
				with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
					data = json.load(data_file)
				course_data["data"] = data
				user_courses[course.subject].append(course_data)
		return user_courses

	# getting data for home page

	def get_data(self, object, course_id=False):
		user_data = {}
		user = object
		if course_id:
			course = Course.objects.get(id=course_id)
			user_data = {}
			with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				user_data["updates"] = {}
				user_data["updates"]["new_students"] = []
				for user_id in data["teachers"][str(user.id)]["new_users"]:
					user_data["updates"]["new_students"].append(
						User.objects.get(id=user_id))
					user_data["object"] = course
					user_data["status"] = data["status"]
					if user_data["status"] == "closed":
						user_data["updates"]["requesting_users"] = data[
							"pending_users"]["Заявки"]
				user_data["updates"]["new_marks"] = {}
				user_data["updates"]["new_marks"]["value"] = []
				user_data["updates"]["new_marks"]["quality"] = []
				for user in data["users"]:
					if os.path.exists('courses/' + str(course.id) + '/users/' + str(user) + '/tests/results/'):
						for test_result in glob.glob('courses/' + str(course.id) + '/users/' + str(user) + '/tests/results/*.json'):
							print(test_result)
							with io.open(test_result, 'r', encoding='utf8') as result_file:
								result = json.load(result_file)
								if user.id in result["unseen_by"]:
									user_data["updates"]["new_marks"][
										"value"].append(result["marks"])
									user_data["updates"]["new_marks"][
										"quality"].append(result["mark_quality"])
				data["teachers"][str(object.id)]["new_users"] = {}
			with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
		elif user.courses:
			user_data["course_list"] = []
			for course in user.courses.split(' '):
				course = Course.objects.get(id=course)
				user_data["course_list"].append(course)
				user_data["courses"] = {}
				user_data["courses"][str(course.id)] = {}
				with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
					data = json.load(data_file)
					user_data["courses"][str(course.id)]["updates"] = {}
					user_data["courses"][str(course.id)]["updates"][
											 "new_students"] = []
					for user_id in data["teachers"][str(object.id)]["new_users"]:
						user_data["courses"][str(course.id)]["updates"][
												 "new_students"].append(User.objects.get(id=user_id))
					user_data["courses"][str(course.id)]["object"] = course
					user_data["courses"][str(course.id)][
											 "status"] = data["status"]
					if user_data["courses"][str(course.id)]["status"] == "closed":
						user_data["courses"][str(course.id)]["updates"]["requesting_users"] = data[
												 "pending_users"]["Заявки"]
					user_data["courses"][str(course.id)]["updates"][
											 "new_marks"] = []
					mark={}
					for user in data["users"]:
						for test_result in glob.glob('courses/' + str(course.id) + '/users/' + str(user) + '/tests/results/*.json'):
							with io.open(test_result, 'r', encoding='utf8') as result_file:
								result = json.load(result_file)
								if user.id in result["unseen_by"]:
									mark["value"]=result["marks"]
									mark["quality"]=result["mark_quality"]
							user_data["courses"][str(course.id)]["updates"][
											 "new_marks"].append(mark)
					print(user_data)
		return user_data

	def change_data(self, user, data_list):
		for data_name in data_list:
			setattr(user, data_name, strip_tags(data_list[data_name]))
		user.save()
		return 0

	def get_view_permission(self,user,requesting_user):
		if user.participation_list and requesting_user.participation_list:
			classmates = any(i in user.participation_list.split(' ')
				for i in user.participation_list.split(' '))
		else:
			classmates = False
		if requesting_user.id == user.id or (user.permission_level == '0') or (user.permission_level == '1' and requesting_user.is_teacher) or (user.permission_level == '2' and not requesting_user.is_teacher) or (user.permission_level == '3' and classmates):
			contacts_view_allowed = True
		else:
			contacts_view_allowed = False
		return contacts_view_allowed

	def reset_password(self, email):
		if User.objects.filter(username=email):
			user = User.objects.get(username=email);
			length = 13
			chars = string.ascii_letters + string.digits
			random.seed = (os.urandom(1024))
			new_pass = ''.join(random.choice(chars) for i in range(length))
			while User.objects.filter(password=new_pass):
				new_pass = ''.join(random.choice(chars)
					for i in range(length))
				setattr(user, 'password', strip_tags(make_password(new_pass)))
				user.save()
				send_mail('Сброс пароля', 'Вы запрашивали сброс пароля на сервисе p-app, ваш временный пароль: ' + new_pass + '. Зайдите в личный кабинет для его изменения', 'p.application.bot@gmail.com',
		[email], fail_silently=False)
				return True
			else:
				return False

	def upload_avatar(self, user, new_avatar):
		os.remove(user.avatar.path)
		setattr(user, 'avatar', new_avatar)
		user.save()
		return user.avatar.path


class User(AbstractBaseUser, PermissionsMixin):
	username = models.CharField(
		_('username'), max_length=30, unique=True,
		help_text=_(
			'Required. 30 characters or fewer. Letters, digits and \@/./+/-/_ only.'),
		validators=[
			validators.RegexValidator(
				r'^[\w.@+-]+$',
				_('Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.'), 'invalid'),
		],
		error_messages={
			'unique': _("The username already exists"),
		}
	)
	name = models.CharField(_('name'), max_length=30, blank=True)
	Skype = models.CharField(_('skype'), max_length=30, blank=True)
	courses = models.CharField(_('courses'), max_length=300, blank=True)
	participation_list = models.CharField(
		_('participation_list'), max_length=300, blank=True)
	Codeforces = models.CharField(_('codeforces'), max_length=30, blank=True)
	VK = models.CharField(_('vk'), max_length=30, blank=True)
	Facebook = models.CharField(_('facebook'), max_length=30, blank=True)
	Dnevnik = models.CharField(_('dnevnik'), max_length=30, blank=True)
	avatar = models.ImageField(
		_('avatar'), upload_to='Avatars/', max_length=120, blank=True)
	permission_level = models.CharField(
		_('permission_level'), max_length=120, default="0")
	is_changing = models.BooleanField(default=False)
	is_teacher = models.BooleanField(default=False)
	email = models.EmailField(_('email address'), blank=True, unique=True)
	is_staff = models.BooleanField(_('staff status'), default=False)
	is_active = models.BooleanField(_('active'), default=True)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def get_full_name(self):
		"""
		Returns the first_name plus the last_name, with a space in between.
		"""
		full_name = '%s %s' % (self.first_name, self.last_name)
		return full_name.strip()

	def get_short_name(self):
		"""
		Returns the short name for the user.
		"""
		return self.first_name

	def email_user(self, subject, message, from_email=None, **kwargs):
		"""
		Sends an email to this User.
		"""
		send_mail(subject, message, from_email, [self.email], **kwargs)


class TestManager(models.Manager):

	def create(self, course_id):
		with io.open('courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			course_info = json.load(data_file)
			test_id = str(course_info['tests']['amount'] + 1)
		course = {"id": course_id}
		test = {"id": test_id, "loaded": 0}
		context = {"test": test, "course": course}
		return context

	def delete(self, course_id, test_id):
		# moves test to trash bin
		with io.open('courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

			if test_id in course_info['tests']['published']:
				course_info['tests']['published'].remove(test_id)

			if test_id in course_info['tests']['unpublished']:
				course_info['tests']['unpublished'].remove(test_id)
		with io.open('courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		print("dfgdfgg")
		return 0

	def save(self, json_file,course_id, test_id):
		json_file_path = 'courses/' + course_id + '/tests/' + test_id + '.json'
		with io.open('courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		course_info['tests']['amount'] += 1
		course_info['tests']['unpublished'].append(test_id)
		test_id = str(course_info['tests']['amount'])
		with io.open('courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		with io.open(json_file_path, 'w', encoding='utf8') as test_file:
			test_file.write(json_file)
		print(json_file_path)
		return 0

	def load(self, course_id, test_id):
		with io.open('courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			with io.open('courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				course = {"id": course_id}
				test = {
					"id": test_id,
					"loaded": 1,
					"json": json.load(json_file),
					"published": test_id in course_info["tests"]["published"]
				}
		context =  {"test": test, "course": course}
		return context

	def publish(self,course_id,test_id):
		# makes test visible in course screen
		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		if test_id in course_info['tests']['unpublished']:
			course_info['tests']['unpublished'].remove(test_id)

		course_info['tests']['published'].append(test_id)

		with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return 0

	def unpublish(self,course_id,test_id):
		# makes test invisible in course screen
		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		if test_id in course_info['tests']['published']:
			course_info['tests']['published'].remove(test_id)

		course_info['tests']['unpublished'].append(test_id)

		with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
			return 0
			
	def check_question(self,item):
		value={}
		type=item["class"]
		if type=="text-answer":
			value["label"] = item["value"]["label"]
			value["answer"] = item["value"]["answer"]
			value["user_answer"] = None
		elif type=="textarea":
			pass
			# textarea
		elif type=="select-answer":
			value["options"] = []
			value["options"] = item["value"]["values"]
			value["answer"] = item["value"]["answer"]
			value["user_answer"] = None
		elif type=="radio-answer":
			value["options"] = []
			value["options"] = item["value"]["values"]
			value["answer"] = item["value"]["answer"]
			value["user_answer"] = None
		elif type=="checkbox-answer":
			value["options"] = []
			value["options"] = item["value"]["values"]
			value["answer"] = item["value"]["answers"]
			value["user_answer"] = None
		return value

	def attempt(self,course_id,user,test_id):
		# creates or continues attempt
		# loads test file
		with io.open('courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:
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
		if not os.path.exists('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'):
			os.makedirs('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/')
		if not os.path.exists('courses/'+course_id+'/users/'+str(user.id)+'/tests/results/'):
			os.makedirs('courses/'+course_id+'/users/'+str(user.id)+'/tests/results/')
		if os.path.exists('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json'):
			with io.open('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
				data=json.load(json_file)
		with io.open('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
			test={}
			test["tasks"]=[]
			with io.open('courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as info_file:
				test_info=json.load(info_file)
				for question in test_info["tasks"]:
					user_question=[]
					for item in question["answer_items"]:
						value=Test.objects.check_question(item=item)
						user_question.append(value)
					test["tasks"].append(user_question)
			data = json.dumps(test, ensure_ascii=False)
			json_file.write(data)
			context["test"]["user_answers"]=data
			return context

	def attempt_save(self,test_id,question_id,task_id,course_id,answer,user):
		with io.open('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
		with io.open('courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'w', encoding='utf8') as json_file:
			data["tasks"][task_id][question_id]["user_answer"]=answer
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def attempt_check(self,request,test_id,course_id):
		right=0
		missed=0
		mistakes=0
		test_results={}
		test_results["test_id"]=test_id
		test_results["right"]=[]
		test_results["mistakes"]=[]
		test_results["missed"]=[]
		test_results["unseen_by"]=[]
		with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
			it=-1
			for task in data["tasks"]:
				it+=1
				test_results["right"].append(it)
				test_results["right"][it]=[]
				test_results["missed"].append(it)
				test_results["missed"][it]=[]
				test_results["mistakes"].append(it)
				test_results["mistakes"][it]=[]
				counter=-1
				for question in task:
					counter+=1
					if question["user_answer"] == None:
						missed+=1
						test_results["missed"][it].append(counter)
					elif check_correctness(question["user_answer"],question["answer"]):
						right+=1
						test_results["right"][it].append(counter)
					else: 
						mistakes+=1
						test_results["mistakes"][it].append(counter)
		with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data=json.load(data_file)
			for key in data["teachers"].keys():
				test_results["unseen_by"].append(key)
		test_results["mark"]=give_mark(request,right/(right+mistakes+missed)*100, course_id, test_id)
		test_results["mark_quality"]=set_mark_quality(test_results["mark"])
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/tests/results/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
			data=test_results
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def give_mark(self, percentage, course_id, test_id):
		with io.open('courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			test_info=json.load(info_file)
		if percentage>=test_info["mark_setting"]["5"]:
			mark="5"
		elif percentage >= test_info["mark_setting"]["4"]:
			mark="4"
		elif percentage >= test_info["mark_setting"]["3"]:
			mark="3"
		else: mark="2"
		return mark

	def set_mark_quality(self,mark):
		if mark == "4" or mark == "5":
			mark_quality = "good"
		elif mark == "3":
			mark_quality ="medium"
		else: mark_quality = "bad"
		return mark_quality
	
	def get_results(self,course_id,test_id,user):
		with io.open('courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/results/'+test_id+'.json', 'r', encoding='utf8') as info_file:
			test_info=json.load(info_file)
		return test_info
	
	def get_test_info(self, course_id, test_id):
		with io.open('courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			test_info = json.load(info_file)
		return test_info
		
	def get_attempt_info(self, course_id, test_id, user):
		with io.open('courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/attempts/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			test_info=json.load(info_file)
		return test_info
		
	def upload_asset(self,asset,course_id,test_id,path):
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		if not os.path.exists(path):
			os.makedirs(path)
		filename = transliterate.ru_en(asset.name)
		with open(path+filename, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
		return filename
		
	def upload_downloadable(self,asset,course_id,test_id,path):
		if not os.path.exists(path):
			os.makedirs(path)
		with open(path+asset.name, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
		return 0
	
	def upload_embmend(self,path,asset,course_id,test_id):
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
		return asset_id
	
class Test(models.Model):
	objects = TestManager()
	

	

	

	
	
	
	
		
