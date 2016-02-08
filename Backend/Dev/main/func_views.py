# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import sqlite3
from django.core.files import File
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response, redirect
from django.template import RequestContext
from django.core.mail import send_mail
from django.db import models
from django.contrib.auth import authenticate, login as auth
import os
import io
from .models import User, LoginForm, RegForm, FileForm, Course
from django.contrib.auth import logout
from django.utils.html import strip_tags
from binascii import hexlify
from django.contrib.auth.hashers import make_password, check_password
from django.core.urlresolvers import reverse
from django.core.mail import EmailMultiAlternatives
import json
import pdb
import unicodedata
from django.core import serializers
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
				avatar = 'avatar.png')
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
		subject = request.POST['subject']
		#   cursor = db.cursor()
		#   cursor.execute(
		#       ''' CREATE TABLE "''' + name +
		#        ''' " ( "id" integer PRIMARY KEY NOT NULL,"name" varchar(30))''')
		course=Course.objects.create_course(name=name, subject=subject)
		course.save()
		db.commit()
		os.makedirs('courses/'+str(course.id)+'/Tests/')
		with io.open('courses/'+str(course.id)+'/info.json', 'a', encoding='utf8') as json_file:
			data={}
			data["pending_users"]=[]
			data["groups"]=["Нераспределенные"]
			data["users"]=[]
			data["tests"]={}
			data["tests"]["amount"]=None;
			data["tests"]["active"]=[];
			data["administrators"]=[str(request.user.id)]
			data["teachers"]=[str(request.user.id)]
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return redirect('/course/'+str(course.id)+'/groups/')

def create_group(request, course):
	name = request.POST.get('subject')
	with open('courses/'+str(course.id)+'/info.json',"r") as data_file:
		data = json.load(data_file)
		data["groups"].append({name})
		with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
			print(data)
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return HttpResponse("ok")

def change_data(request):
	if request.method == 'GET':
		email = request.GET['email']
		setattr(request.user, 'email', strip_tags(email))
		if request.GET['Skype']:
			Skype = request.GET['Skype']
			setattr(request.user, 'Skype', strip_tags(Skype))
		if request.GET['VK']:
			VK = request.GET['VK']
			setattr(request.user, 'VK', strip_tags(VK))
		if  request.GET['Facebook']:
			Facebook = request.GET['Facebook']
			setattr(request.user, 'Facebook', strip_tags(Facebook))
		if request.GET['Dnevnik']:
			Dnevnik = request.GET['Dnevnik']
			setattr(request.user, 'Dnevnik', strip_tags(Dnevnik))
		if request.GET['Codeforces']:
			Codeforces = request.GET['Codeforces']
			setattr(request.user, 'Codeforces', strip_tags(Codeforces))
		request.user.save()
	return HttpResponse("ok")

def create_contact(request):
	if request.method == 'GET':
		contact_type = request.GET['contact_type']
		contact_info = request.GET['contact_info']
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
			import os, random, string           
			import hashlib
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
			return redirect('/')
		else:
			error = u'Введенный email не существует'
			return render(request, 'Pages/forgot_password.html', {
			'success_message': 'Временный пароль был отправлен вам на почту',
		})

def change_password(request):
	if request.method == 'GET':
		old_password = request.GET['old_password']
		new_password = make_password(request.GET['new_password'])
		if request.user.check_password(old_password):
			setattr(request.user, 'password', strip_tags(new_password))
			request.user.save()
			return render(request, 'Pages/profile.html', {
			'success_message': 'Пароль успешно изменен',
			})
		else: 
			return render(request, 'Pages/profile.html', {
			'error': 'Неверный пароль',
			})

def upload_avatar(request):
	setattr(request.user, 'avatar', request.FILES['new_avatar'])
	request.user.save()
	return HttpResponse("ok")

def invite_students(request):
	email_list = request.POST.getlist('email_list')
	group = request.POST.get('group')
	course=Course.objects.get(id=request.POST.get('course_id'))
	subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
	text_content_nonreg='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/'+str(course.id)
	text_content='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/'+str(course.id)
	print(group)
	for email in email_list:
		with open('courses/'+str(course.id)+'/info.json',"r") as data_file:
			data = json.load(data_file)
			data["pending_users"].append({'email':email, 'group':group})
		with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		if User.objects.filter(email=email):
			msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
			msg.send()
		else: 
			msg = EmailMultiAlternatives(subject, text_content_nonreg, from_email, [email])
			msg.send()
	return HttpResponse("ok")

def invite_teacher(request):
	email = request.POST.get('email')
	course=Course.objects.get(id=request.POST.get('course_id'))
	subject, from_email = 'Приглашение на курс', 'p.application.bot@gmail.com'
	print (request.user.name)
	text_content_nonreg='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/register/'+str(course.id)
	text_content='Вам поступило приглашение на курс '+course.name+' от '+request.user.name+' . Перейдите по ссылке для регистрации на курс 127.0.0.1:8000/func/course_reg/'+str(course.id)
	with open('courses/'+str(course.id)+'/info.json',"r") as data_file:
		data = json.load(data_file)
		data["pending_users"].append({'email':email, 'group':'teachers'})
	print ("ffff")
	with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
		saving_data = json.dumps(data, ensure_ascii=False)
		json_file.write(saving_data)
	if User.objects.filter(email=email):
		msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
		msg.send()
	else: 
		msg = EmailMultiAlternatives(subject, text_content_nonreg, from_email, [email])
		msg.send()
	return HttpResponse("ok")

def course_reg(request, course_id):
	# print "chut_bolee_chem_ok"
	if not request.user.name:
		return redirect('/login/')
	# print "sovsem_ok"
	course=Course.objects.get(id=course_id)
	with open('courses/'+str(course.id)+'/info.json',"r") as data_file:
		data = json.load(data_file)
		if request.user.email in data["pending_users"]:
			group="Нераспределенные"
		else: group="Нераспределенные"
		data["users"].append({'Имя':request.user.name, 'Группа':group})
	with io.open('courses/'+str(course.id)+'/info.json', 'w', encoding='utf8') as json_file:
		print(data)
		saving_data = json.dumps(data, ensure_ascii=False)
		json_file.write(saving_data)
	return redirect('/course/'+str(course_id)+'/groups/')

class Struct(object):
		def __init__(self, **entries):
			self.__dict__.update(entries)

def course_getdata(request, course):
	with open('courses/'+str(course.id)+'/info.json',"r") as data_file:
		data = json.load(data_file)
		# print "1"
		course_data={}
		course_data["groups"]=data["groups"]
		course_data["teachers"]=[]
		course_data["users"]=[]
		course_data["groups"]=[]
		course_data["user_status"]=[]
		print(course_data["user_status"])
		for teacher_id in data["teachers"]:
			course_data["teachers"].append(User.objects.get(id=teacher_id))
		#for user in data["users"]:
		#	group=user["Группа"]
		#	if course_data[group]:
		#		course_data[group].append(User.objects.get(name=user["Имя"]))
		#	else: 
		#		course_data[group]={}
		if str(request.user.id) in data["administrators"]:
			course_data["user_status"]="administrator"
		elif str(request.user.id) in data["teachers"]:
			course_data["user_status"]="teacher"
		elif str(request.user.id) in data["moderators"]:
			course_data["user_status"]="moderator"
		elif str(request.user.id) in data["spectators"]:
			course_data["user_status"]="spectator"
		elif str(request.user.name) in data["users"]:
			course_data["user_status"]="user"
		else: course_data["user_status"]="guest"
		return course_data
