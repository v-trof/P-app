# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import sqlite3
import json
import pdb
import unicodedata
import os
import io
import random, string           
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
from .models import User, LoginForm, RegForm, FileForm, Course
from binascii import hexlify
import glob
from http import cookies
import collections

def login(request):
	def errorHandle(error):
		form = LoginForm()
		return render(request, 'Pages/login.html', {
			'error': error,
			'form': form,
		})
	if request.method == 'POST':
		form = LoginForm(request.POST)
		if form.is_valid():
			email = request.POST['email']
			password = request.POST['password']
			user = authenticate(username=email, password=password)
			if user is not None:
				if user.is_active:
					auth(request, user)
					request.session.set_expiry(36000)
					return redirect('/')
				else:
					error = u'Аккаунт отключен'
					return errorHandle(error)
			else:
				error = u'Неверный логин или пароль'
				return errorHandle(error)
		else:
			error = u'Форма незаполнена'
			return errorHandle(error)
	else:
		form = LoginForm()
		return render(request, 'Pages/login.html', {
			'form': form,
		})

def login_with_reg(request,course_id):
	login(request)
	course_reg(request, course_id)
	return redirect('/course/'+course_id+'/groups/')

def logout_view(request):
	logout(request);
	return redirect('/')

def reg(request):
	def errorHandle(error,email,password,name_last_name):
		form = RegForm()
		return render(request, 'Pages/registration.html', {
			'error': error,
			'form': form,
			'email': email,
			'password': password,
			'name_last_name':name_last_name,
		})
	if request.method == 'POST':
		form = RegForm(request.POST)
		course_id = request.POST.get('course_id', False)
		email = request.POST['email']
		is_teacher = request.POST.get('is_teacher', False)
		password = request.POST['password']
		name_last_name = request.POST['name_last_name']
		if not User.objects.filter(email=email):
			user = User.objects.create_user(
				username=email,
				email=email,
				password=password,
				name=name_last_name,
				is_teacher=is_teacher,
				avatar = 'avatar.png',
				permission_level = "0")
		else:
			error = u'Данный email уже зарегистрирован'
			return errorHandle(error,email,password,name_last_name)
		if user is not None:
				user.save()
				user = authenticate(username=email, password=password)
				auth(request, user)
				request.session.set_expiry(36000)
				if course_id and request.POST.get('course_reg', False):
					course_reg(request, course_id)
					return redirect('/course/'+course_id+'/groups/')
				return redirect('/')
		else:
			error = u'Неверный логин или пароль'
			return errorHandle(error,email,password,name_last_name)
	else:
		form = LoginForm()
		return render_to_response('Pages/login.html', {
			'form': form,
		})


def test(request):
	return render(request, "UI_elements/test.html")


def create_course(request):
	if request.method == 'POST':
		db = sqlite3.connect('db.sqlite3')
		name = request.POST['course_name']
		if not request.user.is_teacher:
			request.user.is_teacher=True
		request.user.save()
		subject = request.POST['subject']
		creator=request.user.id
		course=Course.objects.create_course(name=name, subject=subject, creator=creator)
		course.save()
		if request.user.courses:
			setattr(request.user, 'courses', request.user.courses+" "+str(course.id))
		else: setattr(request.user, 'courses', str(course.id))
		request.user.save()
		db.commit()
		os.makedirs('courses/'+str(course.id)+'/tests/')
		os.makedirs('main/files/media/courses/'+str(course.id)+'/assets/')
		with io.open('courses/'+str(course.id)+'/info.json', 'w+', encoding='utf8') as json_file:
			data={}
			data["pending_users"]={}
			data["groups"]={}
			data["groups"]["Нераспределенные"]={}
			data["pending_users"]["Нераспределенные"]=[]
			data["users"]=[request.user.id]
			data["tests"]={}
			data["tests"]["amount"]=0
			data["tests"]["published"]=[]
			data["tests"]["unpublished"]=[]
			data["administrators"]=[request.user.id]
			data["teachers"]={}
			data["teachers"][request.user.id]={}
			data["teachers"][request.user.id]["new_users"]=[]
			data["pending_users"]["Заявки"]=[]
			data["status"]="public"
			if request.POST.get('is_closed', False):
				data["status"]="closed"
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		os.makedirs('courses/'+str(course.id)+'/assignments/')
		redirect_url='/course/'+str(course.id)+'/'
		with io.open('courses/'+str(course.id)+'/announcements.json', 'w+', encoding='utf8') as json_file:
			data=[]
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return HttpResponse(redirect_url)


def edit_groups(request):
	if request.method == 'POST':
		groups_data={}
		groups_data = json.loads(request.POST["new_groups"])
		course=Course.objects.get(id=request.POST["course_id"])	
		with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			data["groups"]=groups_data
			for heading in data["groups"]:
				for key, value in enumerate(data["groups"][heading]):
					user=User.objects.get(name=value)
					data["groups"][heading][key]=user.id
				if heading not in data["pending_users"]:
					data["pending_users"][heading]=[]
		with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return HttpResponse('ok')

def change_data(request):
	if request.method == 'POST':
		data_list = json.loads(request.POST["data_list"])
		for data_name in data_list:
			setattr(request.user, data_name, strip_tags(data_list[data_name]))
		request.user.save()
	return HttpResponse("ok")

def create_contact(request):
	if request.method == 'POST':
		contact_type = request.POST['contact_type']
		contact_info = request.POST['contact_info']
		setattr(request.user, contact_type, strip_tags(contact_info))
		request.user.save()
	return HttpResponse("ok")

def reset_password(request):
	def errorHandle(error,email):
		return render(request, 'Pages/forgot_password.html', {
			'error': error,
			'email': email
		})
	if request.method == 'POST':
		email = request.POST['email']
		if User.objects.filter(username=email):
			user=User.objects.get(username=email);
			length = 13
			chars = string.ascii_letters + string.digits
			random.seed = (os.urandom(1024))
			new_pass=''.join(random.choice(chars) for i in range(length))
			while User.objects.filter(password=new_pass):
				new_pass=''.join(random.choice(chars) for i in range(length))
			setattr(user, 'password', strip_tags(make_password(new_pass)))
			user.save()
			send_mail('Сброс пароля', 'Вы запрашивали сброс пароля на сервисе p-app, ваш временный пароль: '+new_pass+'. Зайдите в личный кабинет для его изменения', 'p.application.bot@gmail.com',
	[email], fail_silently=False)
			return redirect('/login/')
		else:
			error = u'Введенный email не существует'
			return render(request, 'Pages/forgot_password.html', {
			'error': 'Введенный email не существует',
		})

def change_password(request):
	if request.method == 'POST':
		old_password = request.POST['old_password']
		new_password = make_password(request.POST['new_password'])
		if request.user.check_password(old_password):
			print(old_password)
			setattr(request.user, 'password', strip_tags(new_password))
			user=User.objects.get(id=request.user.id)
			request.user.save()
			login(request)
			return render(request, 'Pages/profile.html', {
			'success_message': 'Пароль успешно изменен',
			})
		else: 
			return render(request, 'Pages/profile.html', {
			'error': 'Неверный пароль',
			})

def upload_avatar(request):
	os.remove(request.user.avatar.path)
	setattr(request.user, 'avatar', request.FILES['new_avatar'])
	request.user.save()
	return HttpResponse(request.user.avatar.path)

def invite_students(request):
	if request.method == 'POST':
		email_list = json.loads(request.POST["email_list"])
		group = request.POST['group']
		course=Course.objects.get(id=request.POST.get('course_id'))
		subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
		text_content_nonreg='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/'+str(course.id)
		text_content='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/'+str(course.id)
		for value in email_list:
			with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				data["pending_users"][group].append(value)
			with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
			if User.objects.filter(email=value):
				send_mail(subject, text_content, from_email,[value], fail_silently=False)
			else:
				send_mail(subject, text_content_nonreg, from_email,[value], fail_silently=False)
		return HttpResponse("ok")

def invite_teacher(request):
	if request.method == 'POST':
		email = request.POST.get('email')
		course=Course.objects.get(id=request.POST.get('course_id'))
		subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
		text_content_nonreg='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/'+str(course.id)
		text_content='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/'+str(course.id)
		with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			if "teachers" in data["pending_users"].keys():
				data["pending_users"]["teachers"].append(email)
			else:
				data["pending_users"]["teachers"]=[]
				data["pending_users"]["teachers"].append(email)
		with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		if User.objects.filter(email=email):
			send_mail(subject, text_content, from_email,[email], fail_silently=False)
		else:
			send_mail(subject, text_content_nonreg, from_email,[email], fail_silently=False)
	return HttpResponse("ok")

def course_reg(request, course_id):
	if request.user.is_anonymous():
		return redirect('/login/'+course_id)
	course=Course.objects.get(id=course_id)
	with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
		data = json.load(data_file)
		if request.user.id not in data["users"]:
			if request.user.email not in data["pending_users"]["Заявки"]:
				checker=0
				is_invited=False
				for group in data["pending_users"]:
					if request.user.email in data["pending_users"][group]:
						is_invited = True
						checker=1
						if group=="teachers":
							if request.user.id in data["teachers"]:
								return redirect('/login/')
							data["teachers"][str(request.user.id)]={}
							data["teachers"][str(request.user.id)]["new_users"]=[]
							data["pending_users"]["teachers"].remove(request.user.email)
						else:
							if request.user.id in data["groups"][group]:
								return redirect('/login/')
							data["users"].append(request.user.id)
							data["groups"][group][str(request.user.id)]={}
							data["pending_users"][group].remove(request.user.email)
							data["groups"][group][str(request.user.id)]["unseen_by"]=len(data["teachers"])
							for teacher in data["teachers"]:
								data["teachers"][teacher]["new_users"].append(request.user.id)
				if not data["status"]=="closed" and not checker and not is_invited:
					group="Нераспределенные"
					data["groups"][group][str(request.user.id)]={}
					data["groups"][group][str(request.user.id)]["unseen_by"]=len(data["teachers"])
					for teacher in data["teachers"]:
						data["teachers"][teacher]["new_users"].append(request.user.id)
					data["users"].append(request.user.id)
					if request.user.participation_list:
						setattr(request.user, 'participation_list', request.user.participation_list+" "+str(course.id))
					else: setattr(request.user, 'participation_list', str(course.id))
					request.user.save()
				elif data["status"]=="closed": data["pending_users"]["Заявки"].append(request.user.id)
			with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
			if not os.path.exists('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/'):
				os.makedirs('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/')
				os.makedirs('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/assignments/')
				data={}
				with io.open('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/assignments/done.json', 'a', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
				data={}
				with io.open('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'a', encoding='utf8') as json_file:
					saving_data = json.dumps(data, ensure_ascii=False)
					json_file.write(saving_data)
	return redirect('/course/'+str(course_id)+'/groups/')

def course_getdata(request, course):
	with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
		data = json.load(data_file)
		course_data={}
		course_data["course_id"]=course.id
		course_data["teachers"]=[]
		course_data["status"]=data["status"]
		course_data["users"]=[]
		course_data["groups"]={}
		course_data["user_status"]=[]
		for teacher_id in data["teachers"]:
			course_data["teachers"].append(User.objects.get(id=teacher_id))
		for group in data["groups"]:
			course_data["groups"][group]=[]
			for user_id in data["groups"][group]:
				course_data["groups"][group].append(User.objects.get(id=user_id))
		if request.user.is_anonymous():
			course_data["user_status"]="guest"
		elif request.user.id in data["administrators"]:
			course_data["user_status"]="administrator"
		elif request.user.id in data["teachers"]:
			course_data["user_status"]="teacher"
		#	course_data["user_status"]="moderator"
		#elif str(request.user.id) in data["moderators"]:
		#	course_data["user_status"]="moderator"
		#elif str(request.user.id) in data["spectators"]:
		#	course_data["user_status"]="spectator"
		elif str(request.user.name) in data["users"]:
			course_data["user_status"]="user"
		else: course_data["user_status"]="guest"
		course_data["material_list"]=[]
		course_data["test_list"]=[]
		it=0
		for test in glob.glob('courses/'+str(course.id)+'/tests/*.json'):
			it=it+1
			if str(it) in data["tests"]["published"]:
				with io.open(test, 'r', encoding='utf8') as data_file:
					test_data=json.load(data_file)
					test_d={}
					test_d["title"]=test_data["title"]
					test_d["link"]='?course_id='+str(course.id)+'&test_id='+str(it)
					course_data["test_list"].append(test_d)
		return course_data

def user_getdata(request, user, course_id=False):
	user_data = {}
	if course_id:
		course = Course.objects.get(id=course_id)
		user_data = {}
		with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			user_data["updates"] = {}
			user_data["updates"]["new_students"]=[]
			for user_id in data["teachers"][str(request.user.id)]["new_users"]:
				user_data["updates"]["new_students"].append(User.objects.get(id=user_id))
				user_data["object"] = course
				user_data["status"] = data["status"]
				if user_data["status"] == "closed":
					user_data["updates"]["requesting_users"] = data["pending_users"]["Заявки"]
			user_data["updates"]["new_marks"]={}
			user_data["updates"]["new_marks"]["value"]=[]
			user_data["updates"]["new_marks"]["quality"]=[]
			for user in data["users"]:
				for test_result in glob.glob('courses/' + str(course.id) + '/users/'+str(user)+'/tests/results/*.json'):
					print(test_result)
					with io.open(test_result, 'r', encoding='utf8') as result_file:
						result=json.load(result_file)
						if request.user.id in result["unseen_by"]:
							user_data["updates"]["new_marks"]["value"].append(result["marks"])
							user_data["updates"]["new_marks"]["quality"].append(result["mark_quality"])
			data["teachers"][str(request.user.id)]["new_users"]={}
		with io.open('courses/' + str(course.id) + '/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	elif user.courses:
		user_data["course_list"] = []
		for course in user.courses.split(' '):
			course = Course.objects.get(id=course)
			user_data["course_list"].append(course)
			user_data["courses"]={}
			user_data["courses"][str(course.id)] = {}
			with io.open('courses/' + str(course.id) + '/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
				user_data["courses"][str(course.id)]["updates"] = {}
				user_data["courses"][str(course.id)]["updates"]["new_students"]=[]
				for user_id in data["teachers"][str(request.user.id)]["new_users"]:
					user_data["courses"][str(course.id)]["updates"]["new_students"].append(User.objects.get(id=user_id))
				user_data["courses"][str(course.id)]["object"] = course
				user_data["courses"][str(course.id)]["status"] = data["status"]
				if user_data["courses"][str(course.id)]["status"] == "closed":
					user_data["courses"][str(course.id)]["updates"]["requesting_users"] = data["pending_users"]["Заявки"]
				user_data["courses"][str(course.id)]["updates"]["new_marks"]={}
				user_data["courses"][str(course.id)]["updates"]["new_marks"]["value"]=[]
				user_data["courses"][str(course.id)]["updates"]["new_marks"]["quality"]=[]
				for user in data["users"]:
					for test_result in glob.glob('courses/' + str(course.id) + '/users/'+str(user)+'/tests/results/*.json'):
						with io.open(test_result, 'r', encoding='utf8') as result_file:
							result=json.load(result_file)
							if request.user.id in result["unseen_by"]:
								user_data["courses"][str(course.id)]["updates"]["new_marks"]["value"].append(result["marks"])
								user_data["courses"][str(course.id)]["updates"]["new_marks"]["quality"].append(result["mark_quality"])
	return user_data

def course_get_assignments(request, course):
	assignments=[]
	if request.user.is_anonymous():
		return assignments
	for assignment in glob.glob('courses/'+str(course.id)+'/assignments/*'):
		with io.open(assignment, 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			assignments.append(data)
	return sorted(assignments, key=lambda k: k['due_date'])

def user_get_course_assignments(request, course):
	assignments=[]
	if request.user.is_anonymous():
		return assignments
	with io.open('courses/'+str(course.id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = json.load(json_file)
	global_it=0
	for assignment in glob.glob('courses/'+str(course.id)+'/assignments/*'):
		file_name=os.path.basename(assignment).split('.')[0]
		if file_name in data.keys():
			with io.open(assignment, 'r', encoding='utf8') as data_file:
				new_data = json.load(data_file)
				done=True
				it=0
				global_it+=1
				for task in new_data["tasks"]:
					it+=1
					if task["traditional"] and not it in data[file_name]:
						task["done"]=True
				new_data["id"]=global_it
				if os.path.basename(assignment).split('.')[0] in data.keys():
					assignments.append(new_data)
	return sorted(assignments, key=lambda k : k['due_date'])

def get_users_info(request, user_ids):
	users=[]
	for user_id in user_ids:
		users.append(User.objects.get(id=user_id))
	return users

def accept_request(request):
	if request.method == 'POST':
		user_id=request.POST.get('user_id')
		user=User.objects.get(id=user_id)
		course_id=request.POST.get('course_id')
		with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			for pending_user in data["pending_users"]["Заявки"]:
				if pending_user==user.id:
					data["pending_users"]["Заявки"].remove(pending_user)
			group="Нераспределенные"
			data["users"].append(user.id)
			data["groups"][group].append(user.id)
			if user.participation_list:
				setattr(user, 'participation_list', user.participation_list+" "+str(course.id))
			else: setattr(user, 'participation_list', str(course.id))
			user.save()
		with io.open('courses/'+str(course_id)+'/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	return HttpResponse("ok")

def decline_request(request):
	if request.method == 'POST':
		user_id=request.POST.get('user_id')
		user=User.objects.get(id=user_id)
		course_id=request.POST.get('course_id')
		with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			del data["pending_users"]["Заявки"][user.id]
		with io.open('courses/'+str(course_id)+'/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	return HttpResponse("ok")

def create_assignment(request):
	if request.method == 'POST':
		course_id=request.POST.get('course_id')
		assignment={}
		assignment["due_date"]=request.POST.get('due_date')
		assignment["tasks"]=[]
		assignment_id=str(len(glob.glob('courses/'+str(course_id)+'/assignments/*'))+1)
		non_traditional_task={}
		non_traditional_task["traditional"]=False
		non_traditional_task["content"]={}
		non_traditional_task["content"]["tests"]=[]
		non_traditional_task["content"]["materials"]=[]
		non_traditional_task["content"]["tests"]=json.loads(request.POST.get('test_list'))
		non_traditional_task["content"]["materials"]=json.loads(request.POST.get('material_list'))
		assignment["tasks"].append(non_traditional_task)
		if json.loads(request.POST.get('traditionals_list')):
			for traditional in json.loads(request.POST.get('traditionals_list')):
				traditional_task={}
				traditional_task["traditional"]=True
				traditional_task["content"]=traditional
				assignment["tasks"].append(traditional_task)
		with io.open('courses/'+str(course_id)+'/assignments/'+assignment_id+'.json', 'a+', encoding='utf8') as json_file:
			saving_data = json.dumps(assignment, ensure_ascii=False)
			json_file.write(saving_data)
		for in_process_file in glob.glob('courses/'+str(course_id)+'/users/*/assignments/in_process.json'):
			with io.open(in_process_file, 'r', encoding='utf8') as json_file:
				data = json.load(json_file)
				data[assignment_id]=[]
				it=0
				for task in assignment["tasks"]:
					it+=1
					data[assignment_id].append(it)
			with io.open(in_process_file, 'w', encoding='utf8') as json_file:
				saving_data = json.dumps(data, ensure_ascii=False)
				json_file.write(saving_data)
	return HttpResponse("ok")

def change_permission_level(request):
	if request.method == 'POST':
		setattr(request.user, 'permission_level', request.POST["permission_level"])
		request.user.save()
	return HttpResponse("ok")

def load_courses(request, user):
	courses={}
	if user.participation_list:
		course_list=user.participation_list.split(" ")
		for course_id in course_list:
			course=Course.objects.get(id=course_id)
			courses[course.subject]=[]
		for course_id in course_list:
			course_data={}
			course=Course.objects.get(id=course_id)
			course_data["object"]=course
			homework=user_get_course_assignments(request,course)
			print(course.name)
			print(homework)
			with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
					data = json.load(data_file)
			course_data["data"]=data;
			marks=[]
			for marks_file in glob.glob('courses/'+str(course.id)+'/users/'+str(user.id)+'/tests/results/*.json'):
				with io.open(marks_file, 'r', encoding='utf8') as data_file:
					data=json.load(data_file)
					mark={}
					mark["test_id"]=data["test_id"]
					mark["value"]=data["mark"]
					mark["quality"]=data["mark_quality"]
					marks.append(mark)
			course_data["marks"]=marks
			course_data["tasks"]=homework
			courses[course.subject].append(course_data)
	return courses

def load_user_courses(request, user):
	user_courses={}
	if user.courses:
		course_list=request.user.courses.split(" ")
		for course_id in course_list:
			course=Course.objects.get(id=course_id)
			user_courses[course.subject]=[]
		for course_id in course_list:
			course_data={}
			course=Course.objects.get(id=course_id)
			course_data["object"]=course
			with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
				data = json.load(data_file)
			course_data["data"]=data
			user_courses[course.subject].append(course_data)
	return user_courses

def get_group_list(request,course_id=None):
	if request.method:
		course=Course.objects.get(id=course_id)
		with io.open('courses/'+str(course.id)+'/info.json', 'r', encoding='utf8') as data_file:
			data = json.load(data_file)
			course_groups=[]
			for group in data["groups"]:
				course_groups.append(group)
		return HttpResponse(json.dumps(course_groups, ensure_ascii=False))

def set_done(request):
	if request.method=="POST":
		assignment_id=str(int(request.POST["assignment_id"]))
		task_id=int(request.POST["task_id"])+1
		course_id=int(request.POST["course_id"])
		print("assignment : "+assignment_id)
		print("task_id : "+str(task_id))
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = collections.OrderedDict(sorted(json.load(json_file).items()))
			keys=list(data.keys())
			print(keys[::-1])
			index=keys[int(assignment_id)-1]
			task=data[index].index(task_id)
			print(data[index][task])
			del data[index][task]
			if len(data[index])==0:
				del data[index]
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	return HttpResponse('ok')

def set_undone(request):
	if request.method=="POST":
		assignment_id=str(int(request.POST["assignment_id"])-1)
		task_id=int(request.POST["task_id"])
		course_id=int(request.POST["course_id"])
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'r', encoding='utf8') as json_file:
			data = collections.OrderedDict(sorted(json.load(json_file).items()))
			keys=list(data.keys())
			index=keys[::-1][int(assignment_id)]
			data[index].append(task_id+1)
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/assignments/in_process.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	return HttpResponse('ok')

def add_announcement(request):
	if request.method=="POST":
		text=request.POST["text"]
		print(text)
		heading=request.POST["heading"]
		course_id=request.POST["course_id"]
		with io.open('courses/'+str(course_id)+'/announcements.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
		data.append({"heading":heading,"text":text})
		with io.open('courses/'+str(course_id)+'/announcements.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
	return HttpResponse('ok')
