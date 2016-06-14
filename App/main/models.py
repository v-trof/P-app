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
import requests
import tempfile
from django.core import files
from main.python.views.forgiving_check import check

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
		if is_closed=="false":
				is_closed=False
		course = self.create(name=name, subject=subject, creator=creator.id)
		course.save()
		if creator.courses:
			setattr(creator, 'courses', creator.courses + " " + str(course.id))
		else: setattr(creator, 'courses', str(course.id))
		creator.save()
		os.makedirs('main/files/json/courses/' + str(course.id) + '/tests/')
		os.makedirs('main/files/json/courses/' + str(course.id) + '/materials/')
		os.makedirs('main/files/media/courses/' + str(course.id) + '/assets/')
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w+', encoding='utf8') as json_file:
			data = {}
			data["pending_users"] = {}
			data["groups"] = {}
			data["groups"]["Нераспределенные"] = {}
			data["pending_users"]["Нераспределенные"] = []
			data["users"] = [creator.id]
			data["tests"] = {}
			data["tests"]["published"] = []
			data["tests"]["unpublished"] = []
			data["materials"]={}
			data["materials"]["published"] = []
			data["materials"]["unpublished"] = []
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
		os.makedirs('main/files/json/courses/' + str(course.id) + '/assignments/')
		with io.open('main/files/json/courses/' + str(course.id) + '/announcements.json', 'w+', encoding='utf8') as json_file:
			data = []
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return course

	def edit_groups(self, course, groups_data,renames):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["groups"]={}
			for group,members in groups_data.items():
				data["groups"][group]={}
				for member in members:
					user=User.objects.get(name=member)
					data["groups"][group][str(user.id)]={}
				if not group in data["pending_users"]:
					data["pending_users"][group]=[]
			for prev_name,new_name in renames.items():
				data["pending_users"][new_name]=data["pending_users"][prev_name]
				del data["pending_users"][prev_name]

		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def add_announcement(self, heading, text, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		data.append({"heading": heading, "text": text})
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def task_set_undone(self,user,assignment_id, traditional_id, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
			data[assignment_id]["traditionals"].append(traditional_id)
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/'+str(assignment_id)+'.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["content"]["traditionals"][traditional_id-1]["done"]=False
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/'+str(assignment_id)+'.json', 'w', encoding='utf8') as json_file:
			json_file.write(json.dumps(data, ensure_ascii=False))
		return 0

	def task_set_done(self,assignment_id, traditional_id, course_id, user):
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
			task = data[assignment_id]["traditionals"].index(traditional_id)
			del data[assignment_id]["traditionals"][task]
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/'+assignment_id+'.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["content"]["traditionals"][traditional_id-1]["done"]=True
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/'+assignment_id+'.json', 'w', encoding='utf8') as json_file:
			json_file.write(json.dumps(data, ensure_ascii=False))
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
			with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data["pending_users"][group].append(value)
			with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
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
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			if "teachers" in data["pending_users"].keys():
				data["pending_users"]["teachers"].append(email)
			else:
				data["pending_users"]["teachers"] = []
				data["pending_users"]["teachers"].append(email)
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
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
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
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
								if user.id in data["groups"][group].keys():
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
				with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
				if not os.path.exists('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/'):
					os.makedirs('main/files/json/courses/' + str(course.id) +
								'/users/' + str(user.id) + '/')
					os.makedirs('main/files/json/courses/' + str(course.id) +
								'/users/' + str(user.id) + '/assignments/')
					data = {}
					with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/done.json', 'a', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)
					data = {}
					with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'a', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)
		return 0

	def get_data(self, user, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_data = {}
			course_data["course_id"] = course.id
			course_data["teachers"] = []
			course_data["status"] = data["status"]
			course_data["users"] = []
			course_data["groups"] = {}
			course_data["user_status"] = []
			for teacher_id, value in data["teachers"].items():
				course_data["teachers"].append(User.objects.get(id=teacher_id))
			for group in data["groups"]:
				course_data["groups"][group] = []
				print(data["groups"][group])
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
			for test in glob.glob('main/files/json/courses/' + str(course.id) + '/tests/*.json'):
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

	def get_test_list(self,course):
		it=0
		test_list=[]
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data=json.load(data_file)
		for test in glob.glob('main/files/json/courses/' + str(course.id) + '/tests/*.json'):
			it = it + 1
			if str(it) in data["tests"]["published"]:
				with io.open(test, 'r', encoding='utf8') as data_file:
					test_data = json.load(data_file)
					test_preview = {}
					test_preview["title"] = test_data["title"]
					test_preview["link"] = '?course_id=' + \
						str(course.id) + '&test_id=' + str(it)
					test_list.append(test_preview)
		return test_list

	def get_material_list(self,course):
		it=0
		material_list=[]
		for test in glob.glob('main/files/json/courses/' + str(course.id) + '/materials/*.json'):
			it = it + 1
			if str(it) in data["materials"]["published"]:
				with io.open(test, 'r', encoding='utf8') as data_file:
					material_data = json.load(data_file)
					material_preview = {}
					material_preview["title"] = material_data["title"]
					material_preview["link"] = '?course_id=' + \
						str(course.id) + '&test_id=' + str(it)
					material_list.append(material_preview)
		return material_list
						
	def get_assignments(self, user, course):
		assignments = []
		if user.is_anonymous():
			return assignments

		for assignment in glob.glob('main/files/json/courses/' + str(course.id) + '/assignments/*'):
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data.pop("course_id", None)
				assignments.append(data)
		return sorted(assignments, key=lambda k: k['due_date'])

	def user_get_tasks(self, user, course):
		tasks = []
		if user.is_anonymous():
			return tasks
		try:
			with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'r', encoding='utf8') as json_file:
					data = json.load(json_file)
			for task in data.keys():
				print(len(data[task]["traditionals"]))
				if len(data[task]["traditionals"])+len(data[task]["tests"]) == 0:
					del data[task]
					with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments/in_process.json', 'w', encoding='utf8') as json_file:
						json_file.write(json.dumps(data, ensure_ascii=False))
				else: 
					with io.open('main/files/json/courses/' + str(course.id) + '/assignments/'+task+'.json', 'r', encoding='utf8') as data_file:
						new_data = json.load(data_file)
						new_data.pop("course_id",None)
						new_data["course"]=course
						new_data["id"]=task
						tasks.append(new_data)
			return sorted(tasks, key=lambda k: k['due_date'])
		except: return tasks

	def get_users_info(self, user_ids):
		users = []
		for user_id in user_ids:
			users.append(User.objects.get(id=user_id))
		return users

	def accept_request(self, user, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
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
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def decline_request(self, user, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			del data["pending_users"]["Заявки"][data["pending_users"]["Заявки"].index(user.id)]
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def create_assignment(self, course_id, test_list, material_list, traditionals_list, due_date):
		assignment = {}
		assignment["due_date"] = due_date
		assignment["content"] = {}
		assignment["course_id"]=course_id
		assignment_id = str(len(glob.glob('main/files/json/courses/' + str(course_id) + '/assignments/*'))+1)
		assignment["content"]["tests"] = []
		assignment["content"]["materials"] = []
		assignment["content"]["traditionals"] = []
		print(test_list)
		assignment["content"]["tests"] = json.loads(test_list)
		assignment["content"]["materials"] = json.loads(material_list)
		assignment["content"]["traditionals"] = json.loads(traditionals_list)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + assignment_id + '.json', 'a+', encoding='utf8') as json_file:
			saving_data = json.dumps(assignment, ensure_ascii=False)
			json_file.write(saving_data)
		for in_process_file in glob.glob('main/files/json/courses/' + str(course_id) + '/users/*/assignments/in_process.json'):
			with io.open(in_process_file, 'r', encoding='utf8') as json_file:
				data = json.load(json_file)
				assignment_map={}
				data[assignment_id] = {}
				assignment_map["tests"]=[]
				assignment_map["traditionals"]=[]
				it = 0
				for task in assignment["content"]["tests"]:
					it += 1
					assignment_map["tests"].append(it)
				it = 0
				for task in assignment["content"]["traditionals"]:
					it += 1
					assignment_map["traditionals"].append(it)
				data[assignment_id]=assignment_map
			with io.open(in_process_file, 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
		return 0

	def get_group_list(self, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_groups = []
			for group in data["groups"]:
				course_groups.append(group)
		return json.dumps(course_groups, ensure_ascii=False)

	def load_course_requests(self,course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
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

	def load_announcements(self,course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			announcements = json.load(json_file)
		return announcements

	def load_preview(self,course_id):
		course_data = {}
		course = Course.objects.get(id=course_id)
		course_data["object"] = course
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		course_data["materials_number"]=len(data["materials"]["published"])
		course_data["tests_number"]=len(data["tests"]["published"])
		return course_data

	def load_marks(self,course_id,user_id):
		marks = []
		for marks_file in glob.glob('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/*.json'):
			with io.open(marks_file, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				mark = data
				marks.append(mark)
		if len(marks)==0:
			marks=None
		return marks

	def load_updates(self,course,user):
		updates={}
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			updates["new_students"] = []
			updates["course"]={}
			if data["status"] == "closed":
				updates["course"]["is_closed"]=True
			else: updates["course"]["is_closed"]=False
			for user_id in data["teachers"][str(user.id)]["new_users"]:
				updates["new_students"].append(User.objects.get(id=user.id))
			data["teachers"][str(user.id)]["new_users"]=[]
			if data["status"] == "closed":
				updates["requesting_users"]=[]
				for requesting_user_id in data["pending_users"]["Заявки"]:
					updates["requesting_users"].append(User.objects.get(id=requesting_user_id))
			updates["new_marks"] = []
			mark={}
			for user_id in data["users"]:
				for test_result in glob.glob('main/files/json/courses/' + str(course.id) + '/users/' + str(course.id) + '/tests/results/*.json'):
					with io.open(test_result, 'r', encoding='utf8') as result_file:
						result = json.load(result_file)
						if user.id in result["unseen_by"]:
							mark["value"]=result["marks"]
							mark["quality"]=result["mark_quality"]
					updates["new_marks"].append(mark)
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as data_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			data_file.write(saving_data)			
		return updates


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

	def reg(self, request, course_id, email, is_teacher, password, name_last_name):
		if not User.objects.filter(email=email):
			if is_teacher=="false":
				is_teacher=False
			user = User.objects.create_user(
				username=email,
				email=email,
				password=password,
				name=name_last_name,
				is_teacher=is_teacher,
				avatar='default_avatar.png',
				permission_level="0")
			os.makedirs('main/files/json/users/'+str(user.id)+'/')
			with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'w+', encoding='utf8') as json_file:
				data={}
				data["contacts"]={}
				data["contacts"]["email"]=user.email
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
			with io.open('main/files/json/users/'+str(user.id)+'/settings.json', 'w+', encoding='utf8') as settings_file:
				data={}
				data["assignments"]={}
				data["assignments"]["sort_method"]="by_date"
				saving_data = json.dumps(data, ensure_ascii=False)
				settings_file.write(saving_data)
		else:
			return 'Данный email уже зарегистрирован'
		if user is not None:
				user.save()
				user = authenticate(username=email, password=password)
				auth(request, user)
				request.session.set_expiry(36000)
				if course_id and request.POST.get('course_reg', False):
					reg_user(request, course_id)
					return 'groups'
				return 'success'
		else:
			return 'Неверный логин или пароль'

	# change profile visibility settings
	def change_permission_level(self, user, permission_level):
		setattr(user, 'permission_level', permission_level)
		user.save()
		return 0

	def create_contact(self,user,contact_info,contact_type):
		with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'r', encoding='utf8') as json_file:
				data=json.load(json_file)
		with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'w', encoding='utf8') as json_file:
				if contact_type in data["contacts"].keys():
					it=2
					while contact_type+" "+str(it) in data["contacts"]:
						it+=1
					contact_type=contact_type+" "+str(it)
				data["contacts"][contact_type]=contact_info
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
		return 0

	def delete_contact(self,user,contact_type):
		with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
		with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'w', encoding='utf8') as json_file:
			data["contacts"].pop(contact_type, None)
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def get_contacts(self, user):
		with io.open('main/files/json/users/'+str(user.id)+'/info.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
			return data["contacts"]

	# password change

	def change_password(self, request, user, old_password, new_password):
		if user.check_password(old_password):
			setattr(user, 'password', strip_tags(new_password))
			user.save()
			login(request)
			return True
		else:   
			return False

	def load_courses_previews(self,string_array):
		courses = {}
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				courses[course.subject] = []
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				courses[course.subject].append(Course.objects.load_preview(course_id=course_id))
		return courses

	def load_marks(self, string_array, user_id):
		if string_array:
			has_marks=False
			course_array = string_array.split(" ")
			marks={}
			for course_id in course_array:
				course=Course.objects.get(id=course_id)
				marks[course.subject]=Course.objects.load_marks(course_id=course_id,user_id=user_id)
				if marks[course.subject] != None:
					has_marks=True
		if not has_marks:
			marks=None
		return marks

	def load_assignments_by_course(self, string_array, user):
		assignments={}
		has_assignments=False
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course=Course.objects.get(id=course_id)
				if not course.subject in assignments.keys():
					assignments[course.subject]={}
				assignments[course.subject][course_id]={}
				assignments[course.subject][course_id]["course"]=course
				assignments[course.subject][course_id]["tasks"] = Course.objects.user_get_tasks(user=user,course=course)
				if len(assignments[course.subject][course_id]["tasks"])!=0:
					has_assignments=True
		if not has_assignments:
			assignments=None
		return assignments

	def load_assignments_by_date(self, string_array, user):
		assignments=[]
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course=Course.objects.get(id=course_id)
				assignments= assignments + Course.objects.user_get_tasks(user=user,course=course)
		if len(assignments)==0:
			return None
		return sorted(assignments, key=lambda k: k['due_date'])

	def load_updates(self,user):
		updates={}
		has_updates=False
		for course_id in user.courses.split(' '):
			updates[course_id]={}
			print("user",user)
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				updates[course_id]["course"]=Course.objects.get(id=course_id)
				updates[course_id]["new_students"] = []
				for user_id in data["teachers"][str(user.id)]["new_users"]:
					updates[course_id]["new_students"].append(User.objects.get(id=user_id))
				if data["status"] == "closed":
					updates[course_id]["requesting_users"] = data["pending_users"]["Заявки"]
				updates[course_id]["new_marks"] = []
				mark={}
				for user_id in data["users"]:
					for test_result in glob.glob('main/files/json/courses/' + course_id + '/users/' + course_id + '/tests/results/*.json'):
						with io.open(test_result, 'r', encoding='utf8') as result_file:
							result = json.load(result_file)
							if user.id in result["unseen_by"]:
								mark["value"]=result["marks"]
								mark["quality"]=result["mark_quality"]
						updates[course_id]["new_marks"].append(mark)
				updates_count=0
				for key in updates[course_id].keys():
					if key is not "course":
						updates_count+=len(updates[course_id][key])
				if updates_count==0:
					updates[course_id]={}
				else: has_updates=True
		if not has_updates:
			updates=None
		return updates

	def change_data(self, user, data_list):
		for data_name in data_list:
			setattr(user, data_name, strip_tags(data_list[data_name]))
		user.save()
		return 0

	def get_view_permission(self,user,requesting_user):
		if requesting_user.is_anonymous():
			if user.permission_level == '0':
				contacts_view_allowed = True
			else: contacts_view_allowed = False
		else:
			if user.participation_list and requesting_user.participation_list:
				classmates = any(i in user.participation_list.split(' ')
					for i in user.participation_list.split(' '))
			else:
				classmates = False
			if requesting_user.id == user.id or (user.permission_level == '0') or (user.permission_level == '1' and requesting_user.is_teacher) or (user.permission_level == '2' 
				and not requesting_user.is_teacher) or (user.permission_level == '3' and classmates):
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
		if user.avatar != "default_avatar.png":
			os.remove(user.avatar.path)
		setattr(user, 'avatar', new_avatar)
		user.save()
		return user.avatar


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
	courses = models.CharField(_('main/files/json/courses'), max_length=300, blank=True)
	participation_list = models.CharField(
		_('participation_list'), max_length=300, blank=True)
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
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			course_info = json.load(data_file)
			test_id=str(len(course_info['tests']['published']) + len(course_info['tests']['unpublished']) + 1)
		course = {"id": course_id}
		test = {"id": test_id, "loaded": 0}
		context = {"test": test, "course": course}
		return context

	def delete(self, course_id, test_id):
		# moves test to trash bin
		os.remove('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json')
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

			if test_id in course_info['tests']['published']:
				course_info['tests']['published'].remove(test_id)

			if test_id in course_info['tests']['unpublished']:
				course_info['tests']['unpublished'].remove(test_id)
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return 0

	def save(self, json_file,course_id, test_id):
		json_file=json.loads(json_file)
		json_file["allowed_mistakes"]=[]
		json_file["mark_setting"]={"2":0,"3":25,"4":50,"5":75}
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'w+', encoding='utf8') as test_file:
			test_file.write(json.dumps(json_file, ensure_ascii=False))

		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		if not test_id in course_info['tests']['unpublished']:
			course_info['tests']['unpublished'].append(test_id)
		test_id=str(len(course_info['tests']['published'])+len(course_info['tests']['unpublished']) + 1)
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return 0

	def load(self, course_id, test_id):
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				test = {
					"id": test_id,
					"loaded": 1,
					"json": json.load(json_file),
					"published": test_id in course_info["tests"]["published"]
				}
		return test
		
	def publish(self,course_id,test_id,allowed_mistakes,mark_setting):
		# makes test visible in course screen
		with io.open('main/files/json/courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		if test_id in course_info['tests']['unpublished']:
			course_info['tests']['unpublished'].remove(test_id)

		course_info['tests']['published'].append(test_id)

		with io.open('main/files/json/courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))

		with io.open('main/files/json/courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as info_file:
			test_data=json.load(info_file)

		test_data["allowed_mistakes"]=allowed_mistakes

		for key in mark_setting:
			test_data["mark_setting"][key]=mark_setting[key]

		with io.open('main/files/json/courses/'+course_id+'/tests/'+test_id+'.json', 'w', encoding='utf8') as info_file:
			info_file.write(json.dumps(test_data, ensure_ascii=False))

		return 0

	def unpublish(self,course_id,test_id):
		# makes test invisible in course screen
		with io.open('main/files/json/courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		if test_id in course_info['tests']['published']:
			course_info['tests']['published'].remove(test_id)

		course_info['tests']['unpublished'].append(test_id)

		with io.open('main/files/json/courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
			return 0
			
	def build_question(self,item):
		value={}
		type=item["class"]
		print("item",item)
		value["type"] = type.split("--")[1]
		if type=="answer--text":
			value["answer"] = item["answer"]
			value["user_answer"] = None
		elif type=="answer--textarea":
			value["user_answer"] = None
			# textarea
		elif type=="answer--select":
			value["options"] = []
			value["options"] = item["values"]
			value["answer"] = item["answer"]
			value["user_answer"] = None
		elif type=="answer--radio":
			value["options"] = []
			value["options"] = item["values"]
			value["user_answer"] = None
		elif type=="answer--checkbox":
			value["options"] = []
			value["options"] = item["values"]
			value["answer"] = item["answers"]
			value["user_answer"] = None
		return value

	def attempt(self,course_id,user,test_id):
		# creates or continues attempt
		# loads test file
		with io.open('main/files/json/courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			with io.open('main/files/json/courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
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
		for element in context["test"]["json"]["tasks"]:
			for item in element:
				if item["type"]=="answer": 
					item.pop("answer",None)
		if not os.path.exists('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'):
			os.makedirs('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/')
		if not os.path.exists('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/results/'):
			os.makedirs('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/results/')
		if os.path.exists('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json'):
			with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
				data=json.load(json_file)
		with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
			test=[]
			with io.open('main/files/json/courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as info_file:
				test_info=json.load(info_file)
				for task in test_info["tasks"]:
					for item in task:
						if item["type"]=="question":
							current_question=item
						else:
							value=Test.objects.build_question(item=item)
							test.append(value)
			data = json.dumps(test, ensure_ascii=False)
			json_file.write(data)
			print(test)
			context["test"]["compiled_tasks"]=test
		return context

	def attempt_save(self,test_id,question_id,course_id,answer,user):
		with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
		with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'w', encoding='utf8') as json_file:
			data[question_id-1]["user_answer"]=answer
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def give_mark(self, percentage, course_id, test_id):
		with io.open('main/files/json/courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
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
			mark_quality = "positive"
		elif mark == "3":
			mark_quality ="neutral"
		else: mark_quality = "negative"
		return mark_quality

	def check_question_correctness(self,question,allowed_mistakes):
		return check(answer_right=question["answer"],answer=question["user_answer"],allowed=allowed_mistakes)

	def attempt_check(self,user,test_id,course_id):
		right=0
		missed=0
		mistakes=0
		forgiving=0
		test_results={}
		test_results["test_id"]=test_id
		test_results["right"]=[]
		test_results["mistakes"]=[]
		test_results["forgiving"]=[]
		test_results["missed"]=[]
		test_results["unseen_by"]=[]
		with io.open('main/files/json/courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as info_file:
				test_data=json.load(info_file)
		with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			attempt_data=json.load(json_file)
			counter=0
			for question in attempt_data:
				if question["user_answer"] == None:
					missed+=1
					test_results["missed"].append(counter)
					question["result"]="missing"
				elif Test.objects.check_question_correctness(question=question, allowed_mistakes=test_data["allowed_mistakes"])=="right":
					right+=1
					test_results["right"].append(counter)
					question["result"]="right"
				elif Test.objects.check_question_correctness(question=question, allowed_mistakes=test_data["allowed_mistakes"])=="forgiving":
					forgiving+=1
					test_results["forgiving"].append(counter)
					question["result"]="forgiving"
				else:
					mistakes+=1
					test_results["mistakes"].append(counter)
					question["result"]="false"
				counter+=1
		with io.open('main/files/json/courses/'+course_id+'/users/'+str(user.id)+'/tests/attempts/'+test_id+'.json', 'w', encoding='utf8') as json_file:
			json_file.write(json.dumps(attempt_data, ensure_ascii=False))
		test_results["mark"]=Test.objects.give_mark(percentage=(right+forgiving)/(right+mistakes+missed+forgiving)*100, course_id=course_id, test_id=test_id)
		test_results["mark_quality"]=Test.objects.set_mark_quality(test_results["mark"])
		test_results["right_answers"]=right+forgiving
		test_results["questions_overall"]=right+mistakes+missed+forgiving
		with io.open('main/files/json/courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/results/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
			saving_data = json.dumps(test_results, ensure_ascii=False)
			json_file.write(saving_data)

		return 0

	def get_results(self,course_id,test_id,user):
		with io.open('main/files/json/courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/results/'+test_id+'.json', 'r', encoding='utf8') as info_file:
			test_info=json.load(info_file)
		return test_info
	
	def get_test_info(self, course_id, test_id):
		with io.open('main/files/json/courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			test_info = json.load(info_file)
		return test_info
		
	def get_attempt_info(self, course_id, test_id, user):
		with io.open('main/files/json/courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/attempts/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			attempt_info=json.load(info_file)
		with io.open('main/files/json/courses/'+str(course_id)+'/users/'+str(user.id)+'/tests/results/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
			attempt_result=json.load(info_file)
		test_info=attempt_result
		test_info["tasks"]=attempt_info
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

	def upload_asset_by_url(self,asset_url,course_id,test_id,path):
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+'/'
		if not os.path.exists(path):
			os.makedirs(path)
		request = requests.get(asset_url, stream=True)
		asset_name = asset_url.split('/')[-1]
		temp = tempfile.NamedTemporaryFile()
		for block in request.iter_content(1024 * 8):
			if not block:
				break
			temp.write(block)

		with open(path+asset_name, 'wb+') as destination:
			for chunk in files.File(temp).chunks():
				destination.write(chunk)
		url='/media/courses/'+course_id+'/assets/'+test_id+'/'+asset_name
		return url
		
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
