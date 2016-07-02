# -*- coding: utf-8 -*-
from __future__ import unicode_literals
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
from main.models import User, LoginForm, RegForm, FileForm, Course
from binascii import hexlify
import glob
from http import cookies
import collections

class User_views():

	def login(request):
		if request.method == 'POST':
			email = request.POST['email']
			password = request.POST['password']
			message = User.objects.login(request=request,email=email, password=password)
			return HttpResponse(message)


	def login_with_reg(request, course_id):
		if request.method == 'POST':
			email = request.POST['email']
			password = request.POST['password']
			message = User.objects.login(request=request,email=email, password=password)
			Course_views.register(request, course_id)
		return redirect('/course/' + course_id + '/groups/')

	def change_permission_level(request):
		if request.method == 'POST':
			User.objects.change_permission_level(
				user=request.user, permission_level=request.POST['permission_level'])
		return HttpResponse("ok")

	def logout(request):
		logout(request)
		return redirect('/')


	def reg(request):
		if request.method == 'POST':
			course_id = request.POST.get('course_id', False)
			email = request.POST['email']
			is_teacher = request.POST.get('is_teacher', False)
			password = request.POST['password']
			name_last_name = request.POST['name_last_name']
			message = User.objects.reg(request=request, course_id=course_id, email=email,
									   is_teacher=is_teacher, password=password, name_last_name=name_last_name)
			return HttpResponse(message)

	def change_data(request):
		if request.method == 'POST':
			data_list = json.loads(request.POST["data_list"])
			User.objects.change_profile_data(
				user=request.user, data_list=data_list)
		return HttpResponse("ok")


	def create_contact(request):
		if request.method == 'POST':
			contact_type = request.POST['contact_type']
			contact_info = request.POST['contact_info']
			User.objects.create_contact(contact_type=contact_type,user=request.user,contact_info=contact_info)
		return HttpResponse("ok")

	def delete_contact(request):
		if request.method == 'POST':
			contact_type = request.POST['contact_type']
			User.objects.delete_contact(contact_type=contact_type,user=request.user)
		return HttpResponse("ok")

	def reset_password(request):
		if request.method == 'POST':
			email = request.POST['email']
			if User.objects.reset_password(email=email):
				return HttpResponse("success")
			else:
				return HttpResponse("Введен несуществующий email")

	def change_email(request):
		if request.method == 'POST':
			new_email = request.POST['new_email']
			if User.objects.change_email(user=request.user, new_email=new_email):
				return HttpResponse("success")
			else:
				return HttpResponse("Email занят")

	def approve_email(request):
		if request.method == 'POST':
			user=User.objects.get(id=int(request.POST['user_id']))
			if user.check_password(request.POST['password']):
				if User.objects.approve(type=request.POST['type'],code=request.POST['code'])["user_id"]==str(user.id):
					setattr(user, 'username', request.POST['requesting_data'])
					setattr(user, 'email', request.POST['requesting_data'])
					user.save()
					return HttpResponse("success")
			else:
				return HttpResponse("Неправильный пароль")

	def approve_password(request):
		if request.method == 'POST':
			user=User.objects.get(id=int(request.POST['user_id']))
			if User.objects.approve(type=request.POST['type'],code=request.POST['code'])["user_id"]==str(user.id):
				setattr(user, 'password', strip_tags(make_password(request.POST['new_password'])))
				user.save()
				return HttpResponse("success")



	def upload_avatar(request):
		return HttpResponse(User.objects.upload_avatar(user=request.user, new_avatar=request.FILES['new_avatar']))

class Course_views():

	def create(request):
		if request.method == 'POST':
			db = sqlite3.connect('db.sqlite3')
			name = request.POST['course_name']
			if not request.user.is_teacher:
				request.user.is_teacher = True
				request.user.save()
			subject = request.POST['subject']
			creator = User.objects.get(id=request.user.id)
			is_closed = request.POST.get('is_closed', False)
			course = Course.objects.create_course(
				name=name, subject=subject, creator=creator, is_closed=is_closed)
			redirect_url = '/course/' + str(course.id) + '/'
		return HttpResponse(redirect_url)

	def add_announcement(request):
		if request.method == "POST":
			text = request.POST["text"]
			heading = request.POST["heading"]
			course_id = request.POST["course_id"]
			announcement = Course.objects.add_announcement(
				text=text, heading=heading, course_id=course_id)
		return HttpResponse('ok')

	def edit_announcement(request):
		if request.method == "POST":
			announcement_id = request.POST["announcement_id"]
			text = request.POST["text"]
			heading = request.POST["heading"]
			course_id = request.POST["course_id"]
			announcement = Course.objects.edit_announcement(
				text=text, heading=heading, course_id=course_id, announcement_id=announcement_id)
		return HttpResponse('ok')

	def edit_groups(request):
		if request.method == 'POST':
			groups_data = json.loads(request.POST["groups_data"])
			renames= json.loads(request.POST["renames"])
			course = Course.objects.get(id=request.POST["course_id"])
			course = Course.objects.edit_groups(
				course=course, groups_data=groups_data, renames=renames)
			return HttpResponse('ok')


	def invite_students(request):
		if request.method == 'POST':
			email_list = json.loads(request.POST["email_list"])
			group = request.POST['group']
			course = Course.objects.get(id=request.POST.get('course_id'))
			Course.objects.invite_students(
				email_list=email_list, group=group, course=course, user=request.user)
			return HttpResponse("ok")


	def invite_teacher(request):
		if request.method == 'POST':
			email = request.POST.get('email')
			course = Course.objects.get(id=request.POST.get('course_id'))
			Course.objects.invite_teacher(
				user=request.user, course=course, email=email)
		return HttpResponse("ok")


	def register(request, course_id):
		if request.user.is_anonymous():
			return redirect('/login/' + course_id)
		course = Course.objects.get(id=course_id)
		if request.user.is_anonymous():
			return redirect('/login/' + course_id)
		course = Course.objects.get(id=course_id)
		Course.objects.reg_user(user=request.user, course=course)
		return redirect('/course/' + str(course_id) + '/groups/')


	def accept_request(request):
		if request.method == 'POST':
			user_id = request.POST.get('user_id')
			user = User.objects.get(id=user_id)
			course_id = request.POST.get('course_id')
			Course.objects.accept_request(user=user, course_id=course_id)
		return HttpResponse("ok")


	def decline_request(request):
		if request.method == 'POST':
			user_id = request.POST.get('user_id')
			user = User.objects.get(id=user_id)
			course_id = request.POST.get('course_id')
			Course.objects.decline_request(user=user, course_id=course_id)
		return HttpResponse("ok")


	def create_assignment(request):
		if request.method == 'POST':
			course_id = request.POST.get('course_id')
			test_list = request.POST.get('test_list')
			material_list = request.POST.get('material_list')
			traditionals_list = request.POST.get('traditionals_list')
			due_date = request.POST.get('due_date')
			Course.objects.create_assignment(course_id=course_id, test_list=test_list,
											 material_list=material_list, traditionals_list=traditionals_list, due_date=due_date)
		return HttpResponse("ok")

class Task_views():

	def set_done(request):
		if request.method == "POST":
			assignment_id = str(int(request.POST["assignment_id"]))
			traditional_id = int(request.POST["traditional_id"])
			course_id = int(request.POST["course_id"])
			Course.objects.task_set_done(
				assignment_id=assignment_id, traditional_id=traditional_id, course_id=course_id, user=request.user)
		return HttpResponse('ok')


	def set_undone(request):
		if request.method == "POST":
			assignment_id = str(int(request.POST["assignment_id"]))
			traditional_id = int(request.POST["traditional_id"])
			course_id = int(request.POST["course_id"])
			Course.objects.task_set_undone(
				assignment_id=assignment_id, traditional_id=traditional_id, course_id=course_id, user=request.user)
		return HttpResponse('ok')

def get_group_list(request, course_id=None):
	if request.method:
		course = Course.objects.get(id=course_id)
		Course.objects.get_group_list(course=course)
		return HttpResponse()
