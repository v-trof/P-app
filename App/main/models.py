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
from main.python.views.forgiving_check import check, check_selected
import datetime
from django.utils import timezone
from collections import OrderedDict
from operator import itemgetter
import operator
from sortedcontainers import SortedListWithKey
import shutil


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


class Utility():

	def upload_file(file, path):
		custom_path = path
		path = 'main/files/media/' + path
		if not os.path.exists(path):
			os.makedirs(path)
		filename = file.name
		it = 1
		while os.path.exists(path + filename):
			if not os.path.getsize(path + filename) == file._size:
				filename = str(filename.rsplit('.', 1)[
							   0]) + '(' + str(it) + ')' + '.' + str(filename.split('.')[-1])
				it += 1
			else:
				break
		with open(path + filename, 'wb+') as destination:
			for chunk in file.chunks():
				destination.write(chunk)
		url = '/media/' + custom_path + filename
		return url

	def upload_file_by_url(url, path):
		custom_path = path
		path = 'main/files/media/' + path
		if not os.path.exists(path):
			os.makedirs(path)
		request = requests.get(url, stream=True)
		filename = url.split('/')[-1]
		temp = tempfile.NamedTemporaryFile()
		while os.path.exists(path + filename):
			filename = str(filename.rsplit('.', 1)[
						   0]) + '(' + str(it) + ')' + '.' + str(filename.split('.')[-1])
			it += 1
		for block in request.iter_content(1024 * 8):
			if not block:
				break
			temp.write(block)

		with open(path + filename, 'wb+') as destination:
			for chunk in files.File(temp).chunks():
				destination.write(chunk)
		url = '/media/' + custom_path + filename
		return url

	def delete_file(path):
		custom_path = path
		path = 'main/files/media/' + path
		if os.path.exists(path):
			os.remove(path)
			return 'ok'

	def is_member(user, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		return user.id in course_info["users"]

	def is_teacher(user, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		return str(user.id) in course_info["teachers"].keys()

	def sort_by_year(item):
		if not item == "":
			return item.split("-")[2]
		else:
			return item

	def sort_by_month(item):
		if not item == "":
			return item.split("-")[1]
		else:
			return item

	def sort_by_day(item):
		if not item == "":
			return item.split("-")[0]
		else:
			return item

	def transform_date(date):
		date=date.split("-")
		new_date=date[2]+"-"+date[1]+"-"+date[0]
		return new_date

	def sort_by_date(object, indicator, raising=True):
		items = []
		sorted_list = []
		no_date_list = []
		if isinstance(object, list):
			for item in object:
				if isinstance(item, dict):
					if not item[indicator] == "":
						print(item[indicator])
						items.append(item[indicator])
					else:
						no_date_list.append(item)
			if raising:
				items.sort(key=Utility.sort_by_day)
				items.sort(key=Utility.sort_by_month)
				items.sort(key=Utility.sort_by_year)
			else:
				#print(items.sort(key=Utility.sort_by_day, reverse=True),items.sort(key=Utility.sort_by_day))
				items.sort(key=Utility.sort_by_day, reverse=True)
				items.sort(key=Utility.sort_by_month, reverse=True)
				items.sort(key=Utility.sort_by_year, reverse=True)
			for placing_item in items:
				for item in object:
					print(item,placing_item)
					if item[indicator] == placing_item:
						sorted_list.append(item)
						object.remove(item)
						break
			sorted_list += no_date_list
			return sorted_list
		return object

	def sort_by_name(item):
		return item["object"].name

	def sort_by_alphabet(object, indicator=False):
		if (len(object) > 1):
			if isinstance(object, dict):
				if indicator:
					object[indictator] = collections.OrderedDict(
						sorted(object[indictator].items()))
				else:
					object = collections.OrderedDict(sorted(object.items()))
			else:
				object.sort(key=Utility.sort_by_name, reverse=False)
		return object

	def send_response(message, type=None):
		if type:
			response = {"message": message, "type": type}
			return HttpResponse(json.dumps(response), content_type="application/json")
		else:
			return HttpResponse(message)


class CourseManager(models.Manager):

	def create_course(self, name, subject, creator, is_closed):
		if is_closed == "false":
			is_closed = False
		course = self.create(name=name, subject=subject, creator=creator.id, is_closed=is_closed)
		course.save()
		if creator.courses:
			setattr(creator, 'courses', creator.courses + " " + str(course.id))
		else:
			setattr(creator, 'courses', str(course.id))
		creator.save()
		os.makedirs('main/files/json/courses/' + str(course.id) + '/tests/')
		os.makedirs('main/files/json/courses/' +
					str(course.id) + '/assignments/')
		os.makedirs('main/files/json/courses/' +
					str(course.id) + '/materials/')
		os.makedirs('main/files/media/courses/' + str(course.id) + '/assets/')
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w+', encoding='utf8') as json_file:
			data = {}
			data["pending_users"] = {}
			data["groups"] = {}
			data["groups"]["Нераспределенные"] = {}
			data["pending_users"]["Нераспределенные"] = []
			data["users"] = [creator.id]
			data["sections"] = {}
			data["sections"]["unpublished"] = []
			data["sections"]["published"] = {}
			data["sections"]["published"]["Нераспределенные"] = []
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
		with io.open('main/files/json/courses/' + str(course.id) + '/announcements.json', 'w+', encoding='utf8') as json_file:
			data = {}
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course.id) + '/sources.json', 'w+', encoding='utf8') as json_file:
			data = {}
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return course

	def edit(self, name, subject, course, is_closed):
		if is_closed == "false":
			is_closed = False
		if is_closed:
			status = "closed"
		else:
			status = "public"
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		if not course.name == name:
			setattr(course, 'name', name)
		if not is_closed == course.is_closed:
			setattr(course, 'is_closed', is_closed)
		if not course.subject == subject and not subject == "Неопределенный предмет":
			setattr(course, 'subject', subject)
		if not data["status"] == status:
			data["status"] = status
		course.save()
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Курс успешно изменен"

	def delete(self, course_id):
		course_id=str(course_id)
		shutil.rmtree('main/files/json/courses/' + str(course_id))
		shutil.rmtree('main/files/media/courses/' + str(course_id))
		course = Course.objects.get(id=int(course_id))
		for user_object in User.objects.all():
			user_object = User.objects.get(username=str(user_object))
			if isinstance(user_object.participation_list, str):
				if course_id in user_object.participation_list.split(' '):
					participation_list = user_object.participation_list.split(
						' ').remove(course_id)
					if isinstance(user_object.participation_list, list):
						participation_str = participation_list[:]
					else:
						participation_str = ''
					setattr(user_object, 'participation_list',
							participation_str)
			if isinstance(user_object.courses, str):
				if course_id in user_object.courses.split(' '):
					courses = user_object.courses.split(' ')
					del courses[courses.index(course_id)]
					courses_str = ''
					if isinstance(courses, list):
						for course in courses:
							courses_str+=course+" "
						courses_str=courses_str[:-1]
					setattr(user_object, 'courses', courses_str)
			user_object.save()
		course = Course.objects.get(id=int(course_id))
		course.delete()
		return "Курс удален"

	def is_closed(self, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		if data["status"] == "closed":
			return True
		else:
			return False

	def edit_groups(self, course, groups_data, renames):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["groups"] = {}
			for group, members in groups_data.items():
				data["groups"][group] = {}
				for member in members:
					user = User.objects.get(name=member)
					data["groups"][group][str(user.id)] = {}
				if not group in data["pending_users"]:
					data["pending_users"][group] = []
			for prev_name, new_name in renames.items():
				data["pending_users"][new_name] = data[
					"pending_users"][prev_name]
				del data["pending_users"][prev_name]

		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Группы изменены"

	def add_source(self, course_id, name, link, size, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		if len(data.keys()):
			maximum = max(k for k, v in data.items())
		else:
			maximum = 0
		maximum = int(maximum)
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as info_file:
			info = json.load(info_file)
			course_users = info["users"]
		if user:
			course_users.remove(user.id)
		data[str(maximum + 1)] = {"unseen_by": course_users,
								  "name": name, "size": size, "link": link}
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return len(data)

	def edit_source(self, course_id, source_id, name, link, size, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		link = '/media/courses/' + str(course_id) + '/sources/' + link
		source_id = str(source_id)
		if not link == data[source_id]["link"]:
			Utility.delete_file(path=data[source_id]["link"])
		else:
			size = data[source_id]["size"]
		data[source_id] = {"unseen_by": data[source_id][
			"unseen_by"], "name": name, "size": size, "link": link}
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def delete_source(self, course_id, source_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		Utility.delete_file(path=data[str(source_id)]["link"])
		data.pop(str(source_id), None)
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def add_section(self, course_id, section):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["published"][section] = []
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w+', encoding='utf8') as data_file:
			data_file.write(json.dumps(data, ensure_ascii=False))
		return "Секция добавлена"

	def edit_sections(self, course_id, sections):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["sections"] = sections
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w+', encoding='utf8') as data_file:
			data_file.write(json.dumps(data, ensure_ascii=False))
		return "Секции изменены"

	def add_announcement(self, heading, text, course_id, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		if len(data.keys()):
			maximum = max(k for k, v in data.items())
		else:
			maximum = 0
		maximum = int(maximum)
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as info_file:
			info = json.load(info_file)
			course_users = info["users"]
		if user:
			course_users.remove(user.id)
		data[str(maximum + 1)] = ({"heading": heading,
								   "text": text, "unseen_by": course_users})
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return len(data)

	def edit_announcement(self, heading, text, course_id, announcement_id, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as info_file:
			info = json.load(info_file)
			course_users = info["users"]
		if user:
			course_users.remove(user.id)
		data[announcement_id] = {"heading": heading,
								 "text": text, "unseen_by": course_users}
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def delete_announcement(self, course_id, announcement_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		data.pop(str(announcement_id), None)
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return data

	def task_set_undone(self, user, assignment_id, traditional_id, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
			data[assignment_id]["in_process"][
				"traditionals"].append(traditional_id)
			del data[assignment_id]["done"]["traditionals"][
				data[assignment_id]["done"]["traditionals"].index(traditional_id)]
			data[assignment_id]["finished"] = False
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return 0

	def task_set_done(self, assignment_id, traditional_id, course_id, user):
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
			data[assignment_id]["done"]["traditionals"].append(traditional_id)
			del data[assignment_id]["in_process"]["traditionals"][
				data[assignment_id]["in_process"]["traditionals"].index(traditional_id)]
			if len(data[assignment_id]["in_process"]["tests"]) + len(data[assignment_id]["in_process"]["traditionals"]) + len(data[assignment_id]["in_process"]["unfinished_tests"]) == 0:
				data[assignment_id]["finished"] = True
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'w', encoding='utf8') as json_file:
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
		return "Ученики приглашены"

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
		return "Учитель приглашен"

	def reg_user(self, course, user):

		request=False

		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)

			#Пользователь уже зарегистрирован в курсе
			if not user.id in data["users"]:

				#Пользователь уже отправил заявку
				if not user.id in data["pending_users"]["Заявки"]:
					is_invited = False

					#Проверка: ученик был приглашен
					for group in data["pending_users"]:
						if user.email in data["pending_users"][group]:
							is_invited = True
							if group == "teachers":
								if user.id in data["teachers"]:
									return [{"type":"error","message":'Вы уже являетесь учителем в этом курсе'}]
								data["teachers"][str(user.id)] = {}
								data["users"].append(user.id)
								data["teachers"][str(user.id)][
									"new_users"] = []  
								data["pending_users"][
									"teachers"].remove(user.email)
							else:
								if user.id in data["groups"][group].keys():
									return [{"type":"error","message":'Вы уже состоите в этом курсе'}]
								data["users"].append(user.id)
								data["groups"][group][str(user.id)] = {}
								data["pending_users"][group].remove(user.email)
								data["groups"][group][str(user.id)][
									"unseen_by"] = len(data["teachers"])
								for teacher in data["teachers"]:
									data["teachers"][teacher][
										"new_users"].append(user.id)

					#Проверка: открытый вход в группу
					if not course.is_closed and not is_invited:
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
						else:
							setattr(user, 'participation_list', str(course.id))
						user.save()

					#Создание заявки
					elif course.is_closed:
						request=True
						data["pending_users"]["Заявки"].append(user.id)

					#Пользователь был приглашен
					else:
						if user.participation_list:
							setattr(user, 'participation_list',
									user.participation_list + " " + str(course.id))
						else:
							setattr(user, 'participation_list', str(course.id))
						user.save()

					with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)

					if not os.path.exists('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/'):

						os.makedirs('main/files/json/courses/' + str(course.id) +
									'/users/' + str(user.id) + '/')
						data = {}
						for assignment_path in glob.glob('main/files/json/courses/' + str(course.id) + '/assignments/*.json'):
							assignment_id = assignment_path[:-5].split("/")[5][12:]
							with io.open(assignment_path, 'r', encoding='utf8') as data_file:
								assignment = json.load(data_file)
								assignment_map = {}
								data[str(assignment_id)] = {}
								assignment_map["unfinished_tests"] = []
								assignment_map["tests"] = []
								assignment_map["traditionals"] = []
								for task in assignment["content"]["tests"]:
									assignment_map["tests"].append(
										task["link"].split('&')[1].split('=')[1])
								it = 0
								for task in assignment["content"]["traditionals"]:
									it += 1
									assignment_map["traditionals"].append(it)
								data[str(assignment_id)][
									"in_process"] = assignment_map
								data[str(assignment_id)]["done"] = {}
								data[str(assignment_id)]["done"]["tests"] = []
								data[str(assignment_id)]["done"][
									"traditionals"] = []
								data[str(assignment_id)]["finished"] = False
						with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments.json', 'w+', encoding='utf8') as json_file:
							saving_data = json.dumps(data, ensure_ascii=False)
							json_file.write(saving_data)
						with io.open('main/files/json/courses/' + str(course.id) + '/announcements.json', 'r', encoding='utf8') as data_file:
							data = json.load(data_file)
							for id, announcement in data.items():
								announcement["unseen_by"].append(user.id)
						with io.open('main/files/json/courses/' + str(course.id) + '/announcements.json', 'w+', encoding='utf8') as data_file:
							saving_data = json.dumps(data, ensure_ascii=False)
							data_file.write(saving_data)

				else: return [{"type":"error","message":"Вы уже отправили заявку в этот курс"}]

			else: return [{"type":"error","message":"Вы уже состоите в этом курсе"}]

		if request:
			return [{"type":"success","message":"Вы успешно отправили заявку на вступление в курс"}]

		return [{"type":"success","message":"Вы были успешно зарегистрированы в курсе"}]


	def exit(self,course,user):

		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)

		if user.id in data["users"]:
			data["users"].remove(user.id)
			for teacher_id,content in data["teachers"].items():
				if str(user.id)==teacher_id:
					data["teachers"].pop(teacher_id,None)
				elif user.id in content["new_users"]:
					content["new_users"].remove(user.id)
			for group_name,content in data["groups"].items():
				if str(user.id) in content.keys():
					content.pop(str(user.id),None)
			list=user.participation_list.split(' ')
			list.remove(str(course.id))
			string=""
			for element in list:
				string+=element+' '
			print(string)
			setattr(user, 'participation_list', string)
			user.save()
			with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as data_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				data_file.write(saving_data)

			return [{"type":"success","message":"Вы успешно покинули курс"}]

		else: return [{"type":"error","message":"Вы не состоите в этом курсе"}]

	def get_test_list(self, course):
		it = 0
		test_list = []
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		test_ids = []
		for section, value in sdata["sections"]["published"].items():
			for element in value:
				if element["type"] == "test":
					test_ids.append(element["id"])
		for test in glob.glob('main/files/json/courses/' + str(course.id) + '/tests/*.json'):
			it = it + 1
			if str(it) in test_ids:
				with io.open(test, 'r', encoding='utf8') as data_file:
					test_data = json.load(data_file)
					test_preview = {}
					test_preview["title"] = test_data["title"]
					test_preview["link"] = '?course_id=' + \
						str(course.id) + '&test_id=' + str(it)
					test_list.append(test_preview)
		return test_list

	def get_material_list(self, course):
		it = 0
		material_list = []
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		material_ids = []
		for section, value in data["sections"]["published"].items():
			for element in value:
				if element["type"] == "material":
					material_ids.append(element["id"])
		for material in glob.glob('main/files/json/courses/' + str(course.id) + '/materials/*.json'):
			it = it + 1
			if str(it) in material_ids:
				with io.open(material, 'r', encoding='utf8') as data_file:
					material_data = json.load(data_file)
					material_preview = {}
					material_preview["title"] = material_data["title"]
					material_preview["link"] = '?course_id=' + \
						str(course.id) + '&material_id=' + str(it)
					material_list.append(material_preview)
		return material_list

	def get_assignments(self, user, course):
		assignments = []
		if user.is_anonymous():
			return assignments
		for assignment in glob.glob('main/files/json/courses/' + str(course.id) + '/assignments/*'):
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data["id"] = assignment[:-5].split("/")[5][12:]
				data.pop("course_id", None)
				assignments.append(data)
		return Utility.sort_by_date(object=assignments, indicator="due_date")

	def get_assignment(self, user, course, task_id):
		if user.is_anonymous():
			return assignment
		with io.open('main/files/json/courses/' + str(course.id) + '/assignments/' + str(task_id) + '.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["id"] = task_id
			data.pop("course_id", None)
			assignment = data
		return assignment

	def user_get_tasks(self, user, course):
		tasks = {"done": [], "undone": []}
		if user.is_anonymous():
			return tasks
		with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user.id) + '/assignments.json', 'r', encoding='utf8') as json_file:
			assignments_data = json.load(json_file)
		for task, content in assignments_data.items():
			with io.open('main/files/json/courses/' + str(course.id) + '/assignments/' + str(task) + '.json', 'r', encoding='utf8') as data_file:
				new_data = json.load(data_file)
				for test in new_data["content"]["tests"]:
					if test["id"] in assignments_data[task]["done"]["tests"]:
						test["done"] = True
					else:
						test["done"] = False
					if test["id"] in assignments_data[task]["in_process"]["unfinished_tests"]:
						test["unfinished"] = True
					else:
						test["unfinished"] = False
				it = 0
				for traditional in new_data["content"]["traditionals"]:
					it += 1
					if it in assignments_data[task]["done"]["traditionals"]:
						traditional["done"] = True
					else:
						traditional["done"] = False
				new_data.pop("course_id", None)
				new_data["course"] = course
				new_data["id"] = task
			if content["finished"] == False:
				date = str(datetime.datetime.now())[:10]
				if len(new_data["due_date"]) > 0:
					new_data["urgent"] = False
					if int(new_data["due_date"].split("-")[2]) > int(date.split("-")[0]):
						new_data["relevant"] = True
					elif int(new_data["due_date"].split("-")[2]) < int(date.split("-")[0]):
						new_data["relevant"] = False
					else:
						if int(new_data["due_date"].split("-")[1]) > int(date.split("-")[1]):
							new_data["relevant"] = True
						elif int(new_data["due_date"].split("-")[1]) < int(date.split("-")[1]):
							new_data["relevant"] = False
						else:
							if int(new_data["due_date"].split("-")[0]) >= int(date.split("-")[2]):
								new_data["relevant"] = True
								if int(new_data["due_date"].split("-")[0]) - int(date.split("-")[2]) <= 1:
									new_data["urgent"] = True
							else:
								new_data["relevant"] = False
				else:
					new_data["relevant"] = True
				tasks["undone"].append(new_data)
			else:
				new_data["relevant"] = True
				new_data["urgent"] = False
				tasks["done"].append(new_data)
		tasks["undone"] = Utility.sort_by_date(
			object=tasks["undone"], indicator="due_date")
		return tasks

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
			course = Course.objects.get(id=course_id)
			data["users"].append(user.id)
			data["groups"][group] = {}
			data["groups"][group][str(user.id)] = {}
			data["groups"][group][str(user.id)][
				"unseen_by"] = len(data["teachers"])
			if user.participation_list:
				setattr(user, 'participation_list',
						user.participation_list + " " + str(course.id))
			else:
				setattr(user, 'participation_list', str(course.id))
			user.save()
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Заявка принята"

	def decline_request(self, user, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			del data["pending_users"]["Заявки"][
				data["pending_users"]["Заявки"].index(user.id)]
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Заявка отклонена"

	def create_assignment(self, course_id, group_list, test_list, material_list, traditionals_list, due_date):
		assignment = {}
		assignment["due_date"] = due_date
		assignment["publish_date"]=Utility.transform_date(date=str(datetime.datetime.now())[:10])
		assignment["group_list"] = json.loads(group_list)
		assignment["content"] = {}
		assignment["course_id"] = course_id
		ids=[]
		paths=glob.glob('main/files/json/courses/' + str(course_id) + '/assignments/*')
		for path in paths:
			ids.append(path[:-5].split("/")[5][12:])
		if len(ids)>0:
			assignment_id = max(k for k in ids)
		else:
			assignment_id = 1
		assignment_id=str(assignment_id)
		assignment["content"]["tests"] = []
		assignment["content"]["materials"] = []
		assignment["content"]["traditionals"] = []
		assignment["content"]["tests"] = json.loads(test_list)
		for test in assignment["content"]["tests"]:
			test["id"] = test["link"].split('&')[1].split('=')[1]
		assignment["content"]["materials"] = json.loads(material_list)
		assignment["content"]["traditionals"] = json.loads(traditionals_list)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(assignment_id) + '.json', 'w+', encoding='utf8') as json_file:
			saving_data = json.dumps(assignment, ensure_ascii=False)
			json_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as json_file:
			course_info = json.load(json_file)
		for group in json.loads(group_list):
			for user_id in course_info["groups"][group].keys():
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
					data = json.load(json_file)
				assignment_map = {}
				data[assignment_id] = {}
				assignment_map["unfinished_tests"] = []
				assignment_map["tests"] = []
				assignment_map["traditionals"] = []
				for task in assignment["content"]["tests"]:
					assignment_map["tests"].append(
						task["link"].split('&')[1].split('=')[1])
				it = 0
				for task in assignment["content"]["traditionals"]:
					it += 1
					assignment_map["traditionals"].append(it)
				data[assignment_id]["in_process"] = assignment_map
				data[str(assignment_id)]["done"] = {}
				data[str(assignment_id)]["done"]["tests"] = []
				data[str(assignment_id)]["done"]["traditionals"] = []
				data[str(assignment_id)]["finished"] = False
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'w', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
		return "Задание создано"

	def edit_assignment(self, course_id, assignment_id, group_list, test_list, material_list, traditionals_list, due_date):
		assignment = {}
		assignment["due_date"] = due_date
		assignment["group_list"] = json.loads(group_list)
		assignment["content"] = {}
		assignment["course_id"] = course_id
		assignment["content"]["tests"] = []
		assignment["content"]["materials"] = []
		assignment["content"]["traditionals"] = []
		assignment["content"]["tests"] = json.loads(test_list)
		for test in assignment["content"]["tests"]:
			test["id"] = test["link"].split('&')[1].split('=')[1]
		assignment["content"]["materials"] = json.loads(material_list)
		assignment["content"]["traditionals"] = json.loads(traditionals_list)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(assignment_id) + '.json', 'r', encoding='utf8') as json_file:
			old_assignment = json.load(json_file)
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(assignment_id) + '.json', 'w+', encoding='utf8') as json_file:
			saving_data = json.dumps(assignment, ensure_ascii=False)
			json_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as json_file:
			course_info = json.load(json_file)
		for group in json.loads(group_list):
			for user_id in course_info["groups"][group].keys():
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
					data = json.load(json_file)
					if assignment_id in data.keys():
						for task in assignment["content"]["tests"]:
							test = task["link"].split('&')[1].split('=')[1]
							if not test in data[assignment_id]["done"]["tests"] and not test in data[assignment_id]["in_process"]["tests"] and not test in data[assignment_id]["in_process"]["unfinished_tests"]:
								data[assignment_id]["in_process"][
									"tests"].append(test)
						it = 0
						equals = []
						for traditional in old_assignment["content"]["traditionals"]:
							if it in data[str(assignment_id)]["done"]["traditionals"]:
								if traditional in assignment["content"]["traditionals"]:
									print(assignment["content"][
												  "traditionals"])
									equals.append(assignment["content"][
												  "traditionals"][it])
							it += 1
						data[str(assignment_id)]["done"]["traditionals"] = []
						data[str(assignment_id)]["in_process"]["traditionals"] = []
						it = 1
						for traditional in assignment["content"]["traditionals"]:
							if it in equals:
								data[str(assignment_id)]["done"][
									"traditionals"].append(it)
							else:
								data[str(assignment_id)]["in_process"][
									"traditionals"].append(it)
							it += 1
						data[str(assignment_id)]["finished"] = False
					else:
						assignment_map = {}
						data[assignment_id] = {}
						assignment_map["unfinished_tests"] = []
						assignment_map["tests"] = []
						assignment_map["traditionals"] = []
						for task in assignment["content"]["tests"]:
							assignment_map["tests"].append(
								task["link"].split('&')[1].split('=')[1])
						it = 0
						for task in assignment["content"]["traditionals"]:
							it += 1
							assignment_map["traditionals"].append(it)
						data[assignment_id]["in_process"] = assignment_map
						data[assignment_id]["done"] = {}
						data[assignment_id]["done"]["tests"] = []
						data[assignment_id]["done"]["traditionals"] = []
						data[assignment_id]["finished"] = False
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'w', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)

		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as json_file:
			course_info = json.load(json_file)
		for group in course_info["groups"]:
			if not group in group_list:
				for user_id in course_info["groups"][group].keys():
					with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
						data = json.load(json_file)
						data.pop(assignment_id, None)
					with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'w', encoding='utf8') as json_file:
						saving_data = json.dumps(data, ensure_ascii=False)
						json_file.write(saving_data)

		return "Задание изменено"

	def delete_assignment(self, course_id, assignment_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(assignment_id) + '.json', 'r', encoding='utf8') as json_file:
			assignment = json.load(json_file)
		group_list = assignment["group_list"]
		os.remove('main/files/json/courses/' + str(course_id) +
				  '/assignments/' + str(assignment_id) + '.json')
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as json_file:
			course_info = json.load(json_file)
		for group in group_list:
			for user_id in course_info["groups"][group].keys():
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
					data = json.load(json_file)
					data.pop(assignment_id, None)
				with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'w', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
		return "Задание удалено"

	def get_group_list(self, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_groups = []
			for group in data["groups"]:
				course_groups.append(group)
		return course_groups

	def get_status(self, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		return data["status"]

	def load_user_status(self, user, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			if user.is_anonymous():
				user_status = "guest"
			elif user.id in data["administrators"]:
				user_status = "administrator"
			elif user.id in data["teachers"]:
				user_status = "teacher"
			# elif str(user.id) in data["moderators"]:
			#	user_status = "moderator"
			# elif str(user.id) in data["spectators"]:
			#	user_status = "spectator"
			elif str(user.id) in data["users"]:
				user_status = "user"
			else:
				user_status = "guest"
		return user_status

	def load_groups(self, course, user=None):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		groups = {}
		for group in data["groups"]:
			groups[group] = []
			for user_id in data["groups"][group]:
				groups[group].append(
					User.objects.get(id=user_id))
		return groups

	def load_requests(self, course):
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		requests=[]
		for user_id in data["pending_users"]["Заявки"]:
			requests.append(User.objects.get(id=user_id))
		return requests

	def load_teachers(self, user, course):
		teachers = []
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		for teacher_id, value in data["teachers"].items():
			teachers.append(User.objects.get(id=teacher_id))
		return teachers

	def get_sections_list(self, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_sections = []
			for section in data["sections"]["published"].keys():
				course_sections.append(section)
		return course_sections

	def get_tests(self, course_id):
		tests = {}
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			tests = data["sections"]["published"]
		for section_name, values in tests.items():
			tests[section_name] = []
			for element in list(values):
				if element["type"] == "test":
					test_id = element["id"]
					with io.open('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
						test_data = json.load(info_file)
						tests[section_name].append({"title": test_data["title"], "id": test_id, "questions_number": test_data[
												   "questions_number"], "link": '?course_id=' + course_id + "&test_id=" + test_id})
		return tests

	def get_materials(self, course_id):
		materials = {}
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			materials = data["sections"]["published"]
		for section_name, values in materials.items():
			materials[section_name] = []
			for element in list(values):
				if element["type"] == "material":
					material_id = element["id"]
					with io.open('main/files/json/courses/' + course_id + '/materials/' + material_id + '.json', 'r', encoding='utf8') as info_file:
						material_data = json.load(info_file)
						materials[section_name].append({"title": material_data[
													   "title"], "id": material_id, "link": '?course_id=' + course_id + "&material_id=" + material_id})
		return materials

	def get_sections(self, course_id, user=None):
		context = {}
		context["published"] = {}
		context["unpublished"] = []
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		for section, elements in data["sections"]["published"].items():
			context["published"][section] = []
			for element in elements:
				if element["type"] == "test":
					test_id = element["id"]
					with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as info_file:
						test_data = json.load(info_file)
					test={"type": "test", "title": test_data["title"], "id": test_id, "questions_number": test_data[
															 "questions_number"], "link": '?course_id=' + course_id + "&test_id=" + test_id, "publish_date": element["publish_date"]}
					if user:
						started=Test.is_started(course_id=course_id,user_id=str(user.id), test_id=test_id)
						finished=Test.is_finished(course_id=course_id,user_id=str(user.id), test_id=test_id)
						if finished:
							test["done"]=True
						elif started:
							test["unfinished"]=True
					context["published"][section].append(test)
				else:
					material_id = element["id"]
					with io.open('main/files/json/courses/' + course_id + '/materials/' + material_id + '.json', 'r', encoding='utf8') as info_file:
						material_data = json.load(info_file)
						context["published"][section].append({"type": "material", "title": material_data[
															 "title"], "id": material_id, "link": '?course_id=' + course_id + "&material_id=" + material_id, "publish_date": element["publish_date"]})
			if len(context["published"][section]) > 0:
				context["published"][section]=Utility.sort_by_date(object=context["published"][section],indicator="publish_date",raising=False)
			else: context["published"].pop(section,None)
		for element in data["sections"]["unpublished"]:
			if element["type"] == "test":
				test_id = element["id"]
				with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as info_file:
					test_data = json.load(info_file)
					context["unpublished"].append({"type": "test", "title": test_data["title"], "id": test_id, "questions_number": test_data[
												  "questions_number"], "link": '?course_id=' + course_id + "&test_id=" + test_id, "unpublish_date": element["unpublish_date"]})
			else:
				material_id = element["id"]
				with io.open('main/files/json/courses/' + course_id + '/materials/' + material_id + '.json', 'r', encoding='utf8') as info_file:
					material_data = json.load(info_file)
					context["unpublished"].append({"type": "material", "title": material_data[
												  "title"], "id": material_id, "link": '?course_id=' + course_id + "&material_id=" + material_id, "unpublish_date": element["unpublish_date"]})
		context["unpublished"]=Utility.sort_by_date(object=context["unpublished"], indicator="unpublish_date",raising=False)
		return context

	def load_course_requests(self, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			pending_users = data["pending_users"]["Заявки"]
		return pending_users

	def check_participance(self, course, user):
		if user.participation_list:
			if str(course.id) in user.participation_list.split(' '):
				is_participant = True
			else:
				is_participant = False
		else:
			is_participant = False
		return is_participant

	def load_announcements(self, course_id, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'r', encoding='utf8') as json_file:
			announcements = json.load(json_file)
		if user:
			for id, announcement in announcements.items():
				if user.id in announcement["unseen_by"]:
					announcement["unseen_by"].remove(user.id)
		with io.open('main/files/json/courses/' + str(course_id) + '/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(announcements, ensure_ascii=False)
			json_file.write(saving_data)
		return announcements

	def load_sources(self, course_id, user=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'r', encoding='utf8') as json_file:
			sources = json.load(json_file)
		if user:
			for id, source in sources.items():
				if user.id in source["unseen_by"]:
					source["unseen_by"].remove(user.id)
		with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(sources, ensure_ascii=False)
			json_file.write(saving_data)
		return sources

	def load_preview(self, course_id, user_id=None):
		course_data = {}
		course = Course.objects.get(id=course_id)
		course_data["object"] = course
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		if user_id:
			with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
				assignments_data = json.load(json_file)
			course_data["undone_counter"] = 0
			for task, content in assignments_data.items():
				if not content["finished"]:
					course_data["undone_counter"] += 1
			with io.open('main/files/json/courses/' + str(course.id) + '/announcements.json', 'r', encoding='utf8') as json_file:
				announcements = json.load(json_file)
			course_data["new_announcements"] = 0
			for announcement_id, content in announcements.items():
				if user_id in content["unseen_by"]:
					course_data["new_announcements"] += 1
			with io.open('main/files/json/courses/' + str(course_id) + '/sources.json', 'r', encoding='utf8') as json_file:
				sources = json.load(json_file)
			course_data["new_sources"] = 0
			for source_id, content in sources.items():
				if user_id in content["unseen_by"]:
					course_data["new_sources"] += 1
		course_data["tests_number"] = 0
		course_data["materials_number"] = 0
		for section, elements in data["sections"]["published"].items():
			for element in elements:
				if element["type"] == "test":
					course_data["tests_number"] += 1
				else:
					course_data["materials_number"] += 1
		return course_data

	def load_results(self, course_id, user_id):
		results = []
		for results_file in glob.glob('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/*.json'):
			with io.open(results_file, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data["course"] = Course.objects.get(id=course_id)
				results.append(data)
		if len(results) == 0:
			results = None
		return results

	def load_updates(self, course, user):
		updates = {}
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		updates["new_students"] = []
		updates["course"] = {}
		if data["status"] == "closed":
			updates["course"]["is_closed"] = True
		else:
			updates["course"]["is_closed"] = False
		for user_id in data["teachers"][str(user.id)]["new_users"]:
			updates["new_students"].append(User.objects.get(id=user_id))
		data["teachers"][str(user.id)]["new_users"] = []
		if data["status"] == "closed":
			updates["requesting_users"] = []
			for requesting_user_id in data["pending_users"]["Заявки"]:
				updates["requesting_users"].append(
					User.objects.get(id=requesting_user_id))
		updates["new_results"] = []
		updates["expired"] = {}
		for user_id in data["users"]:
			if os.path.exists('main/files/json/courses/' + str(course.id) + '/users/' + str(user_id) + '/assignments.json'):
				with io.open('main/files/json/courses/' + str(course.id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
					assignments_data = json.load(json_file)
				for task, content in assignments_data.items():
					with io.open('main/files/json/courses/' + str(course.id) + '/assignments/' + task + '.json', 'r', encoding='utf8') as data_file:
						new_data = json.load(data_file)
					if content["finished"] == False:
						date = str(datetime.datetime.now())[:10]
						if len(new_data["due_date"]) > 0:
							new_data["urgent"] = False
							if int(new_data["due_date"].split("-")[2]) > int(date.split("-")[0]):
								new_data["relevant"] = True
							elif int(new_data["due_date"].split("-")[2]) < int(date.split("-")[0]):
								new_data["relevant"] = False
							else:
								if int(new_data["due_date"].split("-")[1]) > int(date.split("-")[1]):
									new_data["relevant"] = True
								elif int(new_data["due_date"].split("-")[1]) < int(date.split("-")[1]):
									new_data["relevant"] = False
								else:
									if int(new_data["due_date"].split("-")[0]) >= int(date.split("-")[2]):
										new_data["relevant"] = True
									else:
										new_data["relevant"] = False
						else:
							new_data["relevant"] = True
						if new_data["relevant"] == False:
							updates["expired"][user_id] = task
			for test_result in glob.glob('main/files/json/courses/' + str(course.id) + '/users/' + str(user_id) + '/tests/results/*.json'):
				with io.open(test_result, 'r', encoding='utf8') as result_file:
					result = json.load(result_file)
					if user.id in result["unseen_by"]:
						result_preview = result
						result_preview["user"] = User.objects.get(id=user_id)
						result_preview["course"] = course
						updates["new_results"].append(result_preview)
						result["unseen_by"].remove(user.id)
				with io.open(test_result, 'w', encoding='utf8') as result_file:
					saving_data = json.dumps(result, ensure_ascii=False)
					result_file.write(saving_data)
		with io.open('main/files/json/courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as data_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			data_file.write(saving_data)
		return updates


class Course(models.Model):
	name = models.CharField(_('name'), max_length=30)
	subject = models.CharField(_('subject'), max_length=30)
	creator = models.CharField(_('creator'), max_length=30)
	is_closed = models.BooleanField(_('is_closed'), default=False)
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
			if is_teacher == "false":
				is_teacher = False
			user = User.objects.create_user(
				username=email,
				email=email,
				password=password,
				name=name_last_name,
				is_teacher=is_teacher,
				avatar='Avatars/default_avatar.png',
				permission_level="0")
			os.makedirs('main/files/json/users/' + str(user.id) + '/')
			with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'w+', encoding='utf8') as json_file:
				data = {}
				data["contacts"] = {}
				data["contacts"]["email"] = user.email
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
			with io.open('main/files/json/users/' + str(user.id) + '/settings.json', 'w+', encoding='utf8') as settings_file:
				data = {}
				data["assignments"] = {}
				data["assignments"]["sort_method"] = "by_date"
				saving_data = json.dumps(data, ensure_ascii=False)
				settings_file.write(saving_data)
		else:
			return 'Данный email уже зарегистрирован'
		if user is not None:
			user.save()
			user = authenticate(username=email, password=password)
			auth(request, user)
			request.session.set_expiry(36000)
			if course_id:
				course = Course.objects.get(id=course_id)
				Course.objects.reg_user(course=course, user=user)
				return 'groups'
			return 'success'
		else:
			return 'Неверный логин или пароль'

	# change profile visibility settings
	def change_permission_level(self, user, permission_level):
		setattr(user, 'permission_level', permission_level)
		user.save()
		return "Изменения сохранены"

	def create_contact(self, user, contact_info, contact_type):
		with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'w', encoding='utf8') as json_file:
			if contact_type in data["contacts"].keys():
				it = 2
				while contact_type + " " + str(it) in data["contacts"]:
					it += 1
				contact_type = contact_type + " " + str(it)
			data["contacts"][contact_type] = contact_info
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Контакт создан"

	def delete_contact(self, user, contact_type):
		with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'w', encoding='utf8') as json_file:
			data["contacts"].pop(contact_type, None)
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Контакт удален"

	def get_contacts(self, user):
		with io.open('main/files/json/users/' + str(user.id) + '/info.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
			return data["contacts"]

	# password change

	def change_password(self, request, user, old_password, new_password):
		if user.check_password(old_password):
			user.set_password(new_password)
			user.save()
			User.objects.login(
				request=request, email=user.email, password=new_password)
			return True
		else:
			return False

	def load_courses_previews(self, string_array, user_id=None):
		courses = {}
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				courses[course.subject] = []
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				courses[course.subject].append(Course.objects.load_preview(
					course_id=course_id, user_id=user_id))
			for subject in courses:
				courses[subject] = Utility.sort_by_alphabet(
					object=courses[subject])
			courses = Utility.sort_by_alphabet(object=courses)
		return courses

	def load_marks(self, string_array, user_id):
		if string_array:
			subject_has_marks = {}
			course_array = string_array.split(" ")
			marks = {}
			for course_id in course_array:
				print(course_id)
				course = Course.objects.get(id=course_id)
				if not course.subject in marks.keys():
					marks[course.subject] = {}
					subject_has_marks[course.subject] = False
				marks[course.subject][course_id] = Course.objects.load_results(
					course_id=course_id, user_id=user_id)
				if marks[course.subject][course_id] != None:
					subject_has_marks[course.subject] = True
				else:
					marks[course.subject].pop(course_id, None)
			for subject, has_marks in subject_has_marks.items():
				if not has_marks:
					marks.pop(subject, None)
		return marks

	def load_assignments_by_course(self, string_array, user):
		assignments = {}
		has_assignments = False
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				if not course.subject in assignments.keys():
					assignments[course.subject] = {}
				assignments[course.subject][course_id] = {}
				assignments[course.subject][course_id]["course"] = course
				assignments[course.subject][course_id][
					"tasks"] = Course.objects.user_get_tasks(user=user, course=course)
				if len(assignments[course.subject][course_id]["tasks"]) != 0:
					has_assignments = True
		if not has_assignments:
			assignments = None
		return assignments

	def load_assignments_by_date(self, string_array, user):
		assignments = {"done": [], "undone": []}
		if string_array:
			course_array = string_array.split(" ")
			for course_id in course_array:
				course = Course.objects.get(id=course_id)
				assignment = Course.objects.user_get_tasks(
					user=user, course=course)
				assignments["done"] += assignment["done"]
				assignments["undone"] += assignment["undone"]
		if len(assignments["done"]) + len(assignments["undone"]) == 0:
			return None
		return assignments

	def load_updates(self, user):
		updates = {}
		has_updates = False
		for course_id in user.courses.split(' '):
			updates[course_id] = {}
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				updates[course_id]["course"] = Course.objects.get(id=course_id)
				updates[course_id]["new_students"] = []
				updates[course_id]["expired"] = []
				for user_id in data["teachers"][str(user.id)]["new_users"]:
					updates[course_id]["new_students"].append(
						User.objects.get(id=user_id))
				if data["status"] == "closed":
					updates[course_id]["requesting_users"] = data[
						"pending_users"]["Заявки"]
				updates[course_id]["new_results"] = 0
				for user_id in data["users"]:
					if os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json'):
						with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/assignments.json', 'r', encoding='utf8') as json_file:
							assignments_data = json.load(json_file)
						for task, content in assignments_data.items():
							with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + task + '.json', 'r', encoding='utf8') as data_file:
								new_data = json.load(data_file)
							if content["finished"] == False:
								date = str(datetime.datetime.now())[:10]
								if len(new_data["due_date"]) > 0:
									new_data["urgent"] = False
									if int(new_data["due_date"].split("-")[2]) > int(date.split("-")[0]):
										new_data["relevant"] = True
									elif int(new_data["due_date"].split("-")[2]) < int(date.split("-")[0]):
										new_data["relevant"] = False
									else:
										if int(new_data["due_date"].split("-")[1]) > int(date.split("-")[1]):
											new_data["relevant"] = True
										elif int(new_data["due_date"].split("-")[1]) < int(date.split("-")[1]):
											new_data["relevant"] = False
										else:
											if int(new_data["due_date"].split("-")[0]) >= int(date.split("-")[2]):
												new_data["relevant"] = True
											else:
												new_data["relevant"] = False
								else:
									new_data["relevant"] = True
								if new_data["relevant"] == False:
									if not user_id in updates[course_id]["expired"]:
										updates[course_id][
											"expired"].append(user_id)
					for test_result in glob.glob('main/files/json/courses/' + course_id + '/users/' + str(user_id) + '/tests/results/*.json'):
						with io.open(test_result, 'r', encoding='utf8') as test_data_file:
							result = json.load(test_data_file)
							if user.id in result["unseen_by"]:
								updates[course_id]["new_results"] += 1
				updates_count = updates[course_id]["new_results"]
				for key in updates[course_id].keys():
					if key is not "course" and key is not "new_results":
						updates_count += len(updates[course_id][key])
				if updates_count == 0:
					updates[course_id] = {}
				else:
					has_updates = True
		if not has_updates:
			updates = None
		return updates

	def change_data(self, user, data_list):
		for data_name in data_list:
			setattr(user, data_name, strip_tags(data_list[data_name]))
		user.save()
		return "Изменения сохранены"

	def get_view_permission(self, user, requesting_user):
		if requesting_user.is_anonymous():
			if user.permission_level == '0':
				contacts_view_allowed = True
			else:
				contacts_view_allowed = False
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
			user = User.objects.get(username=email)
			password_code = User.objects.generate_code(type="password")
			with io.open('main/files/json/other/code_bank.json', 'r', encoding='utf8') as codes_file:
				codes_dict = json.load(codes_file)
			if not str(user.id) in codes_dict.keys():
				codes_dict[str(user.id)] = {}
			codes_dict[str(user.id)]["password"] = password_code
			with io.open('main/files/json/other/code_bank.json', 'w', encoding='utf8') as codes_file:
				codes_file.write(json.dumps(codes_dict, ensure_ascii=False))
			send_mail('Сброс пароля', 'Вы запрашивали сброс пароля на сервисе p-app, перейдите по ссылке для подтверждения: 127.0.0.1:8000/secure_entry/?code=' + password_code + '&type=password.', 'p.application.bot@gmail.com',
					  [email], fail_silently=False)
			return True
		else:
			return False

	def generate_code(self, type):
		length = 13
		chars = string.ascii_letters + string.digits
		random.seed = (os.urandom(1024))
		code = ''.join(random.choice(chars) for i in range(length))
		with io.open('main/files/json/other/code_bank.json', 'r', encoding='utf8') as codes_file:
			codes_dict = json.load(codes_file)
		for user_id, codes in codes_dict.items():
			if type in codes.keys():
				if codes[type] == code:
					code = ''.join(random.choice(chars)
								   for i in range(length))
				else:
					break
		return code

	def change_email(self, new_email, user):
		if User.objects.filter(email=new_email):
			return False

		email_code = User.objects.generate_code(type="email")
		with io.open('main/files/json/other/code_bank.json', 'r', encoding='utf8') as codes_file:
			codes_dict = json.load(codes_file)
		if not str(user.id) in codes_dict.keys():
			codes_dict[str(user.id)] = {}
		codes_dict[str(user.id)]["email"] = email_code
		codes_dict[str(user.id)]["requesting_email"] = new_email
		with io.open('main/files/json/other/code_bank.json', 'w', encoding='utf8') as codes_file:
			codes_file.write(json.dumps(codes_dict, ensure_ascii=False))
		send_mail('Изменение email', 'Вы запрашивали изменение email на сервисе p-app, перейдите по ссылке для подтверждения: 127.0.0.1:8000/secure_entry/?code=' + email_code + '&type=email.', 'p.application.bot@gmail.com',
				  [new_email], fail_silently=False)
		return True

	def approve(self, code, type):
		with io.open('main/files/json/other/code_bank.json', 'r', encoding='utf8') as codes_file:
			codes_dict = json.load(codes_file)
		for user_id, codes in codes_dict.items():
			if codes[str(type)] == code:
				if "requesting_" + type in codes.keys():
					return {"user_id": user_id, "requesting_data": codes["requesting_" + type]}
				else:
					return {"user_id": user_id, "requesting_data": None}
		return None

	def upload_avatar(self, user, new_avatar):
		if user.avatar != "Avatars/default_avatar.png":
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
	courses = models.CharField(
		_('main/files/json/courses'), max_length=300, blank=True)
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


class Material():

	def create(course_id):
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			course_info = json.load(data_file)
			material_id = 1
			for section, elements in course_info['sections']['published'].items():
				for element in elements:
					if element["type"] == "material":
						material_id += 1
			for unpublished in course_info['sections']['unpublished']:
				if unpublished["type"] == "material":
					material_id += 1
		course = {"id": course_id}
		material = {"id": str(material_id), "loaded": 0}
		context = {"material": material, "course": course}
		return context

	def delete(course_id, material_id):
		# moves material to trash bin
		os.remove('main/files/json/courses/' + course_id +
				  '/materials/' + material_id + '.json')
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())

		for section in sections:
			it = 0
			for element in section:
				if material_id == course_info['sections']['published'][section][it]["id"] and course_info['sections']['published'][section][it]["type"] == "material":
					del(course_info['sections']['published'][section][it])
				it += 1

		for unpublished in course_info['sections']['unpublished']:
			if material_id == unpublished["id"] and unpublished["type"] == "material":
				course_info['sections']['unpublished'].remove(unpublished)

		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		for assignment_path in glob.glob('main/files/json/courses/' + str(course_id) + '/assignments/*.json'):
			with io.open(assignment_path, 'r', encoding='utf8') as assignment_file:
				assignment_info = json.load(assignment_file)
			for material in assignment_info["content"]["materials"]:
				if str(material_id) == material["id"]:
					del assignment_info["content"]["materials"][
						assignment_info["content"]["materials"].index(material)]
				with io.open(assignment_path, 'w', encoding='utf8') as assignment_file:
					assignment_file.write(json.dumps(
						assignment_info, ensure_ascii=False))
		material_id = str(material_id)
		for user_assignments_path in glob.glob('main/files/json/courses/' + str(course_id) + '/users/*/assignments.json'):
			with io.open(user_assignments_path, 'r', encoding='utf8') as assignment_file:
				assignments_map = json.load(assignment_file)
			for assignment_id in list(assignments_map):
				if assignment_removed:
					assignments_map.pop(assignment_id, None)
				else:
					if material_id in assignments_map[assignment_id]["done"]["materials"]:
						del assignments_map[assignment_id]["done"]["materials"][
							assignments_map[assignment_id]["done"]["materials"].index(material_id)]
					elif material_id in assignments_map[assignment_id]["in_process"]["materials"]:
						del assignments_map[assignment_id]["in_process"]["materials"][
							assignments_map[assignment_id]["in_process"]["materials"].index(material_id)]
			with io.open(user_assignments_path, 'w', encoding='utf8') as assignment_file:
				assignment_file.write(json.dumps(
					assignments_map, ensure_ascii=False))
		return "Материал удален"

	def save(json_file, course_id, material_id, user):
		json_file = json.loads(json_file)
		json_file["creator"] = user.id
		with io.open('main/files/json/courses/' + course_id + '/materials/' + material_id + '.json', 'w+', encoding='utf8') as material_file:
			material_file.write(json.dumps(json_file, ensure_ascii=False))
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		material_unpublished = False
		for unpublished in course_info['sections']['unpublished']:
			if material_id == unpublished["id"] and unpublished["type"] == "material":
				material_unpublished = True
		material_published = Material.is_published(material_id=material_id, course_id=course_id)
		if not material_unpublished and not material_published:
			course_info['sections']['unpublished'].append(
				{"id": material_id, "type": "material"})
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return "Материал сохранен"

	def load(course_id, material_id):
		with io.open('main/files/json/courses/' + course_id + '/materials/' + material_id + '.json', 'r', encoding='utf8') as json_file:
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				material = {
					"id": material_id,
					"loaded": 1,
					"json": json.load(json_file),
					"published": Material.is_published(material_id=material_id, course_id=course_id)
				}
		context = {}
		context["material"] = material
		context["material"]["id"] = material_id
		context["course"] = Course.objects.get(id=course_id)
		context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		}, {
			"href": "#",
			"link": material["json"]["title"]
		}]
		context["sections"] = Course.objects.get_sections_list(
			course_id=course_id)
		context["type"] = "material"
		context["read"] = True
		return context

	def publish(course_id, material_id, section):
		# makes material visible in course screen
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		for unpublished in course_info['sections']['unpublished']:
			if material_id == unpublished["id"] and unpublished["type"] == "material":
				course_info['sections']['unpublished'].remove(unpublished)
		if not section in course_info['sections']['published'].keys():
			course_info['sections']['published'][section] = []
		is_published=False
		for section,elements in course_info['sections']['published'].items():
			for element in elements:
				if element["id"] == material_id and element["type"] == "material":
					is_published=True
		if not is_published:
			course_info['sections']['published'][section].append(
			{"id": material_id, "type": "material", "publish_date": Utility.transform_date(date=str(datetime.datetime.now())[:10])})
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))

		return "Материал опубликован"

	def unpublish(course_id, material_id):
		# makes material invisible in course screen
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())
		for section in sections:
			it = 0
			for element in course_info['sections']['published'][section]:
				if material_id == element["id"] and element["type"] == "material":
					del(course_info['sections']['published'][section][it])
				it+=1
		is_unpublished=False
		for section,element in course_info['sections']['unpublished'].items():
			if element["id"] == material_id and element["type"] == "material":
				is_unpublished=True

		if not is_unpublished:
			course_info['sections']['unpublished'].append(
				{"id": material_id, "type": "material", "unpublish_date": Utility.transform_date(date=str(datetime.datetime.now())[:10])})

		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return "Материал скрыт"

	def get_material_info(course_id, material_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/materials/' + str(material_id) + '.json', 'r', encoding='utf8') as info_file:
			material_info = json.load(info_file)
		return material_info

	def is_creator(user, material_id, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/materials/' + str(material_id) + '.json', 'r', encoding='utf8') as info_file:
			material_info = json.load(info_file)
		return material_info["creator"] == user.id

	def is_published(material_id, course_id):
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())

		for section in sections:
			for element in course_info['sections']['published'][section]:
				if material_id == element["id"] and element["type"] == "material":
					return True
		return False


class Test():

	def create(course_id):
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			course_info = json.load(data_file)
			max=0
			for section, elements in course_info['sections']['published'].items():
				for element in elements:
					if element["type"] == "test" and int(element["id"])>max:
						max=int(element["id"])
			for unpublished in course_info['sections']['unpublished']:
				if unpublished["type"] == "test" and int(unpublished["id"])>max:
					max=int(unpublished["id"])
		course = {"id": course_id}
		test = {"id": str(max+1), "loaded": 0}
		context = {"test": test, "course": course}
		return context

	def delete(course_id, test_id):
		# moves test to trash bin
		os.remove('main/files/json/courses/' +
				  course_id + '/tests/' + test_id + '.json')
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())

		for section, elements in course_info['sections']['published'].items():
			it = 0
			for element in elements:
				if test_id == course_info['sections']['published'][section][it]["id"] and course_info['sections']['published'][section][it]["type"] == "test":
					del(course_info['sections']['published'][section][it])
				it += 1

		for unpublished in course_info['sections']['unpublished']:
			if test_id == unpublished["id"] and unpublished["type"] == "test":
				course_info['sections']['unpublished'].remove(unpublished)

		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		for assignment_path in glob.glob('main/files/json/courses/' + str(course_id) + '/assignments/*.json'):
			with io.open(assignment_path, 'r', encoding='utf8') as assignment_file:
				assignment_info = json.load(assignment_file)
			for test in assignment_info["content"]["tests"]:
				if str(test_id) == test["id"]:
					del assignment_info["content"]["tests"][
						assignment_info["content"]["tests"].index(test)]
			if len(assignment_info["content"]["tests"]) + len(assignment_info["content"]["traditionals"]) == 0:
				os.remove(assignment_path)
				assignment_removed = True
			else:
				assignment_removed = False
				with io.open(assignment_path, 'w', encoding='utf8') as assignment_file:
					assignment_file.write(json.dumps(
						assignment_info, ensure_ascii=False))
		test_id = str(test_id)
		for user_assignments_path in glob.glob('main/files/json/courses/' + str(course_id) + '/users/*/assignments.json'):
			with io.open(user_assignments_path, 'r', encoding='utf8') as assignment_file:
				assignments_map = json.load(assignment_file)
			for assignment_id in list(assignments_map):
				if assignment_removed:
					assignments_map.pop(assignment_id, None)
				else:
					if test_id in assignments_map[assignment_id]["done"]["tests"]:
						del assignments_map[assignment_id]["done"]["tests"][
							assignments_map[assignment_id]["done"]["tests"].index(test_id)]
					elif test_id in assignments_map[assignment_id]["in_process"]["tests"]:
						del assignments_map[assignment_id]["in_process"]["tests"][
							assignments_map[assignment_id]["in_process"]["tests"].index(test_id)]
					elif test_id in assignments_map[assignment_id]["in_process"]["unfinished_tests"]:
						del assignments_map[assignment_id]["in_process"]["unfinished_tests"][
							assignments_map[assignment_id]["in_process"]["unfinished_tests"].index(test_id)]
					if len(assignments_map[assignment_id]["in_process"]["tests"]) + len(assignments_map[assignment_id]["in_process"]["unfinished_tests"]) + len(assignments_map[assignment_id]["in_process"]["traditionals"]) == 0:
						assignments_map[assignment_id]["finished"] = True
			with io.open(user_assignments_path, 'w', encoding='utf8') as assignment_file:
				assignment_file.write(json.dumps(
					assignments_map, ensure_ascii=False))
		return "Тест удален"

	def save(json_file, course_id, test_id, user):
		json_file = json.loads(json_file)
		json_file["allowed_mistakes"] = []
		json_file["creator"] = user.id
		questions_number = 0
		for task in json_file["tasks"]:
			for question in task:
				if question["type"] == "answer":
					questions_number += 1
		json_file["questions_number"] = questions_number
		json_file["mark_setting"] = {"2": 0, "3": 25, "4": 50, "5": 75}
		if os.path.exists('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json'):
			with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as test_file:
				data=json.load(test_file)
				if data["allowed_mistakes"]:
					json_file["allowed_mistakes"]=data["allowed_mistakes"]
			for attempt in glob.glob('main/files/json/courses/' + course_id + '/users/*/tests/attempts/' + test_id + '.json'):
				with io.open(attempt, 'r', encoding='utf8') as attempt_file:
					attempt_data=json.load(attempt_file)
				test = {}
				question_id = 0
				for task in json_file["tasks"]:
					if task in data["tasks"]:
						test[str(question_id)] = attempt_data[str(data["tasks"].index(task))]
						question_id+=1
					else:			
						for item in task:
							if item["type"] == "question":
								current_question = item
							else:
								value = Test.build_question(item=item)
								test[str(question_id)] = value
								question_id += 1
				with io.open(attempt, 'w', encoding='utf8') as attempt_file:
					attempt_file.write(json.dumps(test, ensure_ascii=False))
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'w+', encoding='utf8') as test_file:
			test_file.write(json.dumps(json_file, ensure_ascii=False))
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
		test_unpublished = False
		for unpublished in course_info['sections']['unpublished']:
			if test_id == unpublished["id"] and unpublished["type"] == "test":
				test_unpublished = True
		test_published = Test.is_published(test_id=test_id, course_id=course_id)
		if not test_unpublished and not test_published:
			course_info['sections']['unpublished'].append(
				{"id": test_id, "type": "test"})
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))
		return "Тест сохранен"

	def load(course_id, test_id):
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				test = {
					"id": test_id,
					"loaded": 1,
					"json": json.load(json_file),
					"published": Test.is_published(test_id=test_id, course_id=course_id)
				}
		return test

	def publish(course_id, test_id, section, allowed_mistakes, mark_setting):
		# makes test visible in course screen
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		it=0
		for element in course_info['sections']['unpublished']:
			if element["id"] == str(test_id) and element["type"] == "test":
				del(course_info['sections']['unpublished'][it])
			it+=1

		if not section in course_info['sections']['published'].keys():
			course_info['sections']['published'][section] = []

		is_published=False

		for section,elements in course_info['sections']['published'].items():
			for element in elements:
				if element["id"] == test_id and element["type"] == "test":
					is_published=True
		if not is_published:
			course_info['sections']['published'][
				section].append({"id": test_id, "type": "test", "publish_date": Utility.transform_date(date=str(datetime.datetime.now())[:10])})
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))

		if os.path.exists('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json'):
			with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as info_file:
				test_data = json.load(info_file)
		else:
			test_data={}
		test_data["allowed_mistakes"] = allowed_mistakes
		if "marks_setting" in test_data.keys():
			for key in mark_setting:
				test_data["mark_setting"][key] = mark_setting[key]
		else: test_data["mark_setting"]=mark_setting
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(test_data, ensure_ascii=False))

		return "Тест был опубликован"

	def unpublish(course_id, test_id):
		# makes test invisible in course screen
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())

		for section in sections:
			it = 0
			for element in course_info["sections"]["published"][section]:
				if test_id == course_info['sections']['published'][section][it]["id"] and course_info['sections']['published'][section][it]["type"] == "test":
					del(course_info['sections']['published'][section][it])
				it += 1

		is_unpublished=False
		for element in course_info['sections']['unpublished']:
			if element["id"] == str(test_id) and element["type"] == "test":
				is_unpublished=True
		if not is_unpublished:
			course_info['sections']['unpublished'].append(
				{"id": test_id, "type": "test", "unpublish_date": Utility.transform_date(date=str(datetime.datetime.now())[:10])})

		with io.open('main/files/json/courses/' + course_id + '/info.json', 'w+', encoding='utf8') as info_file:
			info_file.write(json.dumps(course_info, ensure_ascii=False))

		return "Тест был скрыт"

	def is_published(test_id, course_id):
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		sections = list(course_info['sections']['published'].keys())

		for section in sections:
			for element in course_info['sections']['published'][section]:
				if test_id == element["id"] and element["type"] == "test":
					return True
		return False

	def build_question(item):
		value = {}
		type = item["class"]
		item["worth"]=int(item["worth"])
		value["type"] = type.split("--")[1]
		if type == "answer--text":
			value["answer"] = item["answer"]
			value["user_answer"] = None
			value["worth"] = item["worth"]
			value["user_score"] = 0
		elif type == "answer--textarea":
			value["user_answer"] = None
			value["worth"] = item["worth"]
			value["user_score"] = 0
			# textarea
		elif type == "answer--select":
			value["options"] = []
			value["options"] = item["values"]
			value["answer"] = item["answer"]
			value["user_answer"] = None
			value["worth"] = item["worth"]
			value["user_score"] = 0
		elif type == "answer--radio":
			value["options"] = []
			value["options"] = item["values"]
			value["answer"] = item["answer"]
			value["user_answer"] = None
			value["worth"] = item["worth"]
			value["user_score"] = 0
		elif type == "answer--checkbox":
			value["options"] = []
			value["options"] = item["values"]
			value["answer"] = item["answer"]
			value["user_answer"] = None
			value["worth"] = item["worth"]
			value["user_score"] = 0
		return value

	def build_answer(item, data):
		type = item["class"]
		if type == "answer--text":
			item["value"] = data["user_answer"]
		elif type == "answer--textarea":
			item["value"] = data["user_answer"]
		elif type == "answer--select":
			item["value"] = data["user_answer"].split(', ')
			item["filled"] = data["user_answer"]
		elif type == "answer--radio":
			item["value"] = data["user_answer"]
		elif type == "answer--checkbox":
			item["value"] = data["user_answer"].split(', ')
		return item

	def attempt(course_id, user, test_id):
		# creates or continues attempt
		# loads test file
		if not os.path.exists('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/'):
			os.makedirs('main/files/json/courses/' + course_id +
						'/users/' + str(user.id) + '/tests/attempts/')
		if not os.path.exists('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/results/'):
			os.makedirs('main/files/json/courses/' + course_id +
						'/users/' + str(user.id) + '/tests/results/')
		if os.path.exists('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json'):
			with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'r', encoding='utf8') as json_file:
				data = json.load(json_file)
		else:
			data = None
		with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				course = {"id": course_id}
				test = {
					"id": test_id,
					"loaded": 1,
					"json": json.load(json_file),
					"published": Test.is_published(test_id=test_id, course_id=course_id)
				}
				it = 0
				for task in test["json"]["tasks"]:
					for item in task:
						if not data == None and item["type"] == "answer" and str(it) in data and not data[str(it)]["user_answer"] == None:
							item = Test.build_answer(
								item=item, data=data[str(it)])
							it += 1
						elif item["type"] == "answer":
							item["value"] = ""
							it += 1
				context = {"test": test, "course": course}
				context["breadcrumbs"] = [{
					"href": "/course/" + str(course_id),
					"link": Course.objects.get(id=course_id).name
				}, {
					"href": "#",
					"link": test["json"]["title"]
				}]
		for element in context["test"]["json"]["tasks"]:
			for item in element:
				if item["type"] == "answer":
					item.pop("answer", None)
		if data == None:
			with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'w+', encoding='utf8') as json_file:
				test = {}
				question_id = 0
				with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as info_file:
					test_info = json.load(info_file)
					for task in test_info["tasks"]:
						for item in task:
							if item["type"] == "question":
								current_question = item
							else:
								value = Test.build_question(item=item)
								test[str(question_id)] = value
								question_id += 1
				data = json.dumps(test, ensure_ascii=False)
				json_file.write(data)
		return context

	def attempt_save(test_id, question_id, course_id, answer, user):
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'r', encoding='utf8') as assignments_file:
			assignment_map = json.load(assignments_file)
		for assignment_id, content in assignment_map.items():
			if not test_id in content["in_process"]["unfinished_tests"] and test_id in content["in_process"]["tests"]:
				content["in_process"]["unfinished_tests"].append(test_id)
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'w', encoding='utf8') as assignments_file:
			assignments_file.write(json.dumps(
				assignment_map, ensure_ascii=False))
		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'w', encoding='utf8') as json_file:
			data[str(question_id - 1)]["user_answer"] = answer
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return "Ответ сохранен"

	def give_mark(percentage, course_id, test_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
			test_info = json.load(info_file)
		if percentage >= test_info["mark_setting"]["5"]:
			mark = "5"
		elif percentage >= test_info["mark_setting"]["4"]:
			mark = "4"
		elif percentage >= test_info["mark_setting"]["3"]:
			mark = "3"
		else:
			mark = "2"
		return mark

	def set_mark_quality(mark):
		if mark["value"] == "4" or mark["value"] == "5":
			mark_quality = "positive"
		elif mark["value"] == "3":
			mark_quality = "neutral"
		else:
			mark_quality = "negative"
		return mark_quality

	def check_question_correctness(question, allowed_mistakes):
		if question["type"]=="checkbox":
			return check_selected(answer_right=question["answer"], answer=question["user_answer"].split(', '), allowed=allowed_mistakes)
		elif question["type"]=="select" or question["type"]=="radio":
			return check_selected(answer_right=str(question["answer"]), answer=str(question["user_answer"]), allowed=allowed_mistakes)
		return check(answer_right=question["answer"], answer=question["user_answer"], allowed=allowed_mistakes)

	def attempt_check(user, test_id, course_id):
		if not os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json'):
			right = 0
			missed = 0
			mistakes = 0
			forgiving = 0
			score=0
			overall_score=0
			test_results = {}
			test_results["right"] = []
			test_results["mistakes"] = []
			test_results["forgiving"] = []
			test_results["missed"] = []
			test_results["unseen_by"] = []
			with io.open('main/files/json/courses/' + course_id + '/tests/' + test_id + '.json', 'r', encoding='utf8') as info_file:
				test_data = json.load(info_file)
			test_results["test"] = {"id": test_id, "title": test_data["title"]}
			with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'r', encoding='utf8') as json_file:
				attempt_data = json.load(json_file)
				for question_id, question in attempt_data.items():
					overall_score += question["worth"]
					if question["user_answer"] == None:
						missed += 1
						test_results["missed"].append(int(question_id))
						question["result"] = "missed"
						question["user_score"] = 0 
					elif Test.check_question_correctness(question=question, allowed_mistakes=test_data["allowed_mistakes"]) == "right":
						right += 1
						score+= question["worth"]
						test_results["right"].append(int(question_id))
						question["result"] = "right"
						question["user_score"] = question["worth"]
					elif Test.check_question_correctness(question=question, allowed_mistakes=test_data["allowed_mistakes"]) == "forgiving":
						forgiving += 1
						test_results["forgiving"].append(int(question_id))
						question["result"] = "forgiving"
						question["user_score"] = question["worth"]
						score+= question["worth"]
					else:
						mistakes += 1
						test_results["mistakes"].append(int(question_id))
						question["result"] = "wrong"
						question["user_score"] = 0
			with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
				course_data = json.load(data_file)
			for teacher in course_data["teachers"]:
				test_results["unseen_by"].append(int(teacher))
			with io.open('main/files/json/courses/' + course_id + '/users/' + str(user.id) + '/tests/attempts/' + test_id + '.json', 'w', encoding='utf8') as json_file:
				json_file.write(json.dumps(attempt_data, ensure_ascii=False))
			test_results["mark"] = {}
			test_results["mark"]["value"] = Test.give_mark(percentage=(score) / (overall_score) * 100, course_id=course_id, test_id=test_id)
			test_results["mark"]["quality"] = Test.set_mark_quality(test_results[
																	"mark"])
			test_results["score"]=score
			test_results["overall_score"]=overall_score
			test_results["right_answers"] = right + forgiving
			test_results["questions_overall"] = right + \
				mistakes + missed + forgiving
			with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/tests/results/' + test_id + '.json', 'w+', encoding='utf8') as json_file:
				saving_data = json.dumps(test_results, ensure_ascii=False)
				json_file.write(saving_data)
			with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'r', encoding='utf8') as assignment_map:
				assignment_map = json.load(assignment_map)
				for assignment_id, content in assignment_map.items():
					if test_id in content["in_process"]["tests"]:
						del content["in_process"]["tests"][
							content["in_process"]["tests"].index(test_id)]
						content["done"]["tests"].append(test_id)
					if test_id in content["in_process"]["unfinished_tests"]:
						del content["in_process"]["unfinished_tests"][
							content["in_process"]["unfinished_tests"].index(test_id)]
						content["done"]["tests"].append(test_id)
					if len(content["in_process"]["tests"]) + len(content["in_process"]["unfinished_tests"]) + len(content["in_process"]["traditionals"]) == 0:
						content["finished"] = True
			with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user.id) + '/assignments.json', 'w+', encoding='utf8') as assignment:
				assignment.write(json.dumps(assignment_map, ensure_ascii=False))
		return "Попытка проверена"

	def change_answer_status(user_id, test_id, course_id, question_id, question_result):
		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user_id) + '/tests/attempts/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			attempt_data = json.load(json_file)
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'r', encoding='utf8') as results_file:
			test_results = json.load(results_file)
		attempt_data[question_id]["result"] = question_result
		if int(question_id) in test_results["right"]:
			test_results["right"].remove(int(question_id))
		elif int(question_id) in test_results["forgiving"]:
			test_results["forgiving"].remove(int(question_id))
		elif int(question_id) in test_results["missed"]:
			test_results["missed"].remove(int(question_id))
		else:
			test_results["mistakes"].remove(int(question_id))
		test_results[question_result].append(int(question_id))
		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user_id) + '/tests/attempts/' + test_id + '.json', 'w+', encoding='utf8') as json_file:
			json_file.write(json.dumps(attempt_data, ensure_ascii=False))
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'w+', encoding='utf8') as results_file:
			results_file.write(json.dumps(test_results, ensure_ascii=False))
		return "Статус ответа изменен"

	def change_score(user_id, test_id, course_id, answer_id, score):
		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user_id) + '/tests/attempts/' + test_id + '.json', 'r', encoding='utf8') as json_file:
			attempt_data = json.load(json_file)
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'r', encoding='utf8') as results_file:
			test_results = json.load(results_file)

		test_results["score"]-=attempt_data[answer_id]["user_score"]
		test_results["score"]+=int(score)
		answer_id=int(answer_id)
		if answer_id in test_results["right"]:
			test_results["right"].remove(answer_id)
		elif answer_id in test_results["forgiving"]:
			test_results["forgiving"].remove(answer_id)
		elif answer_id in test_results["missed"]:
			test_results["missed"].remove(answer_id)
		else:
			test_results["mistakes"].remove(answer_id)
		attempt_data[str(answer_id)]["user_score"]=int(score)
		if attempt_data[str(answer_id)]["user_score"]==attempt_data[str(answer_id)]["worth"]:
			test_results["right"].append(answer_id)
			attempt_data[str(answer_id)]["result"]="right"
		elif attempt_data[str(answer_id)]["user_score"]==0:
			test_results["mistakes"].append(answer_id)
			attempt_data[str(answer_id)]["result"]="wrong"
		else: 
			test_results["forgiving"].append(answer_id)
			attempt_data[str(answer_id)]["result"]="forgiving"

		test_results["mark"]["value"] = Test.give_mark(percentage=(test_results["score"]) / (test_results["overall_score"]) * 100, course_id=course_id, test_id=test_id)
		test_results["mark"]["quality"] = Test.set_mark_quality(test_results[
																"mark"])

		with io.open('main/files/json/courses/' + course_id + '/users/' + str(user_id) + '/tests/attempts/' + test_id + '.json', 'w+', encoding='utf8') as json_file:
			json_file.write(json.dumps(attempt_data, ensure_ascii=False))
		with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'w+', encoding='utf8') as results_file:
			results_file.write(json.dumps(test_results, ensure_ascii=False))	

		return test_results["mark"]

	def get_results(course_id, test_id, user_id):
		if os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json'):
			with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'r', encoding='utf8') as info_file:
				test_info = json.load(info_file)
			return test_info
		else:
			return "Тест не был выполнен"

	def get_test_info(course_id, test_id):
		if os.path.exists('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json'):
			with io.open('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
				test_info = json.load(info_file)
			return test_info
		else:
			return "Тест не существует"

	def get_tests_in_task_info(course_id, task_id):
		test_list = []
		tests_info={}
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(task_id) + '.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		for test in data["content"]["tests"]:
			test_list.append(test["id"])
		for test in test_list:
			tests_info[test]=Test.get_test_info(test_id=test,course_id=course_id)
		return tests_info


	def get_attempt_info(course_id, test_id, user_id):
		if os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/attempts/' + str(test_id) + '.json'):
			with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/attempts/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
				attempt_info = json.load(info_file)
			return attempt_info
		else:
			return "Попытка не существует"

	def is_creator(user, test_id, course_id):
		with io.open('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
			test_info = json.load(info_file)
		return test_info["creator"] == user.id

	def is_started(user_id,test_id,course_id):
		return os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/attempts/' + test_id + '.json')

	def is_finished(user_id, test_id, course_id):
		return os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json')

class Marks():

	def by_groups(course_id, test_id, group_list=None):
		course = Course.objects.get(id=int(course_id))
		marks = {}
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		if not group_list:
			group_list = data["groups"].keys()
		for group in group_list:
			marks[group] = {}
			for user_id in data["groups"][group]:
				marks[group][str(user_id)] = Test.get_results(
					course_id=course_id, test_id=test_id, user=User.objects.get(id=int(user_id)))
		return marks

	def by_tasks(course_id, group_list=None):
		course = Course.objects.get(id=int(course_id))
		marks = {}
		for assignment in glob.glob('main/files/json/courses/' + str(course.id) + '/assignments/*'):
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				id = assignment[:-5].split("/")[5][12:]
				marks[id]=Marks.get_marks_by_task(course_id=course_id,task_id=id)
		return marks

	def by_tests(course_id):
		course = Course.objects.get(id=int(course_id))
		test_list=[]
		for test in glob.glob('main/files/json/courses/' + str(course.id) + '/tests/*'):
			test_id=test[:-5].split("/")[5][6:]
			test_list.append(test_id)
		marks=Marks.get_marks_for_test_list(course_id=course_id, test_list=test_list, with_info=True)
		return marks

	def tests_info(course_id):
		tests_info={}
		with io.open('main/files/json/courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			course_data = json.load(data_file)
		for section in course_data["sections"]["published"]:
			tests_info[section]={}
			for test in course_data["sections"]["published"][section]:
				with io.open('main/files/json/courses/' + str(course_id) + '/tests/'+test["id"]+'.json', 'r', encoding='utf8') as data_file:
					data = json.load(data_file)
					tests_info[section][test["id"]]=data
					tests_info[section][test["id"]]["publish_date"]=test["publish_date"]
			tests_info[section]=Utility.sort_by_date(object=tests_info[section],indicator="publish_date",raising=False)
		return tests_info

	def get_tests(course_id, task_id):
		test_list = []
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + str(task_id) + '.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		for test in data["content"]["tests"]:
			test_list.append(test["id"])
		return test_list

	def tasks_info(course_id):
		tasks_info = {}
		for assignment in glob.glob('main/files/json/courses/' + str(course_id) + '/assignments/*'):
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				id = assignment[:-5].split("/")[5][12:]
				tasks_info[id] = data
		return tasks_info

	def get_marks_for_test_list(course_id, test_list, group_list=None, with_info=False):
		marks = {}
		with io.open('main/files/json/courses/' + course_id + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		if not group_list:
			group_list = data["groups"].keys()
		for group in group_list:
			marks[group] = {}
			for user_id in data["groups"][group]:
				marks[group][str(user_id)]={"tests":{}}
				for test_id in test_list:
					if os.path.exists('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json'):
						with io.open('main/files/json/courses/' + str(course_id) + '/users/' + str(user_id) + '/tests/results/' + test_id + '.json', 'r', encoding='utf8') as info_file:
							test_info = json.load(info_file)
						marks[group][str(user_id)]["tests"][test_id] = test_info["mark"]
						if with_info:
							with io.open('main/files/json/courses/' + str(course_id) + '/tests/' + str(test_id) + '.json', 'r', encoding='utf8') as info_file:
								test_info = json.load(info_file)
							marks[group][str(user_id)]["tests"][test_id]["info"]=test_info
					else: marks[group][str(user_id)]["tests"][test_id]=0
		return marks


	def get_marks_by_task(course_id, task_id, group_list=None):
		with io.open('main/files/json/courses/' + str(course_id) + '/assignments/' + task_id + '.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
		test_list = []
		for test in data["content"]["tests"]:
			test_list.append(test["id"])
		if not group_list:
			group_list = data["group_list"]
		marks=Marks.get_marks_for_test_list(course_id=course_id,test_list=test_list, group_list=group_list)
		return marks

class Sharing():

	def share(course_id, item_id, type, name=None):
		with io.open('main/files/json/shared.json', 'r', encoding='utf8') as shared_file:
			shared_table = json.load(shared_file)
		course=Course.objects.get(id=course_id)
		shared_item={}
		shared_item["course_id"]=course_id
		shared_item["id"]=item_id
		shared_item["type"]=type
		with io.open('main/files/json/courses/' + course_id + '/'+type+'s/'+item_id+'.json', 'r', encoding='utf8') as info_file:
			item_info = json.load(info_file)
		if len(shared_table[course.subject].keys()):
			maximum = max(k for k, v in shared_table[course.subject].items())
		else:
			maximum = 0
		shared_id=maximum+1
		item_info["shared"]=True
		item_info["shared_id"]=shared_id
		if name:
			shared_item["name"]=name
		else: shared_item["name"]=item_info["name"]
		if not course.subject in shared_table.keys():
			shared_table[course.subject]={}
		shared_table[course.subject][shared_id]=shared_item
		with io.open('main/files/json/courses/' + course_id + '/'+type+'s/'+item_id+'.json', 'w', encoding='utf8') as info_file:
			saving_data = json.dumps(item_info, ensure_ascii=False)
			info_file.write(saving_data)
		with io.open('main/files/json/shared.json', 'w', encoding='utf8') as shared_file:
			saving_data = json.dumps(item_info, ensure_ascii=False)
			shared_file_file.write(saving_data)
		return 'Успешно'

	def unshare(course_id, item_id, shared_id, type):
		with io.open('main/files/json/shared.json', 'r', encoding='utf8') as shared_file:
			shared_table = json.load(shared_file)
		course=Course.objects.get(id=course_id)
		with io.open('main/files/json/courses/' + course_id + '/'+type+'s/'+item_id+'.json', 'r', encoding='utf8') as info_file:
			item_info = json.load(info_file)
		item_info["shared"]=False
		item_info.pop("shared_id",None)
		shared_table.pop(shared_id,None)
		with io.open('main/files/json/courses/' + course_id + '/'+type+'s/'+item_id+'.json', 'w', encoding='utf8') as info_file:
			saving_data = json.dumps(item_info, ensure_ascii=False)
			info_file.write(saving_data)
		with io.open('main/files/json/shared.json', 'w', encoding='utf8') as shared_file:
			saving_data = json.dumps(item_info, ensure_ascii=False)
			shared_file_file.write(saving_data)
		return 'Успешно'

	#def load_shared_by_name(search_string):
	#	shared={}
	#	shared[""]
	#	with io.open('main/files/json/shared.json', 'r', encoding='utf8') as shared_file:
	#		shared_table = json.load(shared_file)
	#	for id, shared in shared_table.items():
	#		if shared["name"]


class Statistics():

	def get_test_statistics(course_id,test_id):
		summary={}
		summary["frequent_mistakes"]=Statistics.frequent_mistakes(course_id=course_id,test_id=test_id)
		return summary

	def frequent_mistakes(course_id,test_id):
		questions={}
		most_frequent={}
		results_count=0
		for results in glob.glob('main/files/json/courses/' + str(course_id) + '/users/*/tests/attempts/' + test_id + '.json'):
			results_count+=1
			with io.open(results, 'r', encoding='utf8') as info_file:
				test_info = json.load(info_file)
			for question_id,question in test_info.items():
				if "result" in question.keys():
					if question["result"] == "forgiving" or question["result"] == "wrong" or question["result"] == "missed":
						question_id=str(int(question_id)+1)
						if not question_id in questions.keys():
							questions[question_id]=0
						questions[question_id]+=1

		for question_id,frequency in questions.items():
			if results_count/frequency*100 > 50:
				most_frequent[question_id]=int(results_count/frequency*100)
		return most_frequent
			#user_id= results[:-5].split("/")[5][6:]
			#user=User.objects.get(id=user_id)

