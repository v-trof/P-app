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
    form = LoginForm(request.POST)
    email = request.POST['email']
    password = request.POST['password']
    message = User.objects.login(request=request,email=email, password=password)
    if message is not 'success':
        return errorHandle(message)
    else:
        return redirect('/')


def login_with_reg(request, course_id):
    login(request)
    course_reg(request, course_id)
    return redirect('/course/' + course_id + '/groups/')


def logout_view(request):
    logout(request)
    return redirect('/')


def reg(request):
    def errorHandle(error, email, password, name_last_name):
        form = RegForm()
        return render(request, 'Pages/registration.html', {
            'error': error,
            'form': form,
            'email': email,
            'password': password,
            'name_last_name': name_last_name,
        })
    if request.method == 'POST':
        form = RegForm(request.POST)
        course_id = request.POST.get('course_id', False)
        email = request.POST['email']
        is_teacher = request.POST.get('is_teacher', False)
        password = request.POST['password']
        name_last_name = request.POST['name_last_name']
        message = User.objects.reg(form=form, course_id=course_id, email=email,
                                   is_teacher=is_teacher, password=password, name_last_name=name_last_name)
        if message == 'Данный email уже зарегистрирован':
            return errorHandle(error, email, password, name_last_name)
        elif message == 'Неверный логин или пароль':
            return errorHandle(error, email, password, name_last_name)
        elif message == 'groups':
            return redirect('/course/' + course_id + '/groups/')
        elif message == 'success':
            return redirect('/')
    else:
        form = LoginForm()
        return render_to_response('Pages/login.html', {
            'form': form,
        })


def create_course(request):
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


def edit_groups(request):
    if request.method == 'POST':
        groups_data = {}
        groups_data = json.loads(request.POST["new_groups"])
        course = Course.objects.get(id=request.POST["course_id"])
        course = Course.objects.edit_groups(
            course=course, groups_data=groups_data)
        return HttpResponse('ok')


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
        setattr(request.user, contact_type, strip_tags(contact_info))
        request.user.save()
    return HttpResponse("ok")


def reset_password(request):
    if request.method == 'POST':
        email = request.POST['email']
        if User.objects.reset_password(email=email):
            return redirect('/login/')
        else:
            return render(request, 'Pages/forgot_password.html', {
                'error': 'Введенный email не существует',
            })


def change_password(request):
    if request.method == 'POST':
        old_password = request.POST['old_password']
        new_password = make_password(request.POST['new_password'])
        user = User.objects.change_password(
            request, user=request.user, old_password=old_password, new_password=new_password)
        return render(request, 'Pages/profile.html', {
            'success_message': 'Пароль успешно изменен',
        })
    else:
        return render(request, 'Pages/profile.html', {
            'error': 'Неверный пароль',
        })


def upload_avatar(request):
    return HttpResponse(User.objects.upload_avatar(user=request.user, new_avatar=request.FILES['new_avatar']))


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


def course_reg(request, course_id):
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


def change_permission_level(request):
    if request.method == 'POST':
        User.objects.change_permission_level(
            user=request.user, permission_level=request.POST['permission_level'])
    return HttpResponse("ok")


def get_group_list(request, course_id=None):
    if request.method:
        course = Course.objects.get(id=course_id)
        Course.objects.get_group_list(course=course)
        return HttpResponse()


def set_done(request):
    if request.method == "POST":
        assignment_id = str(int(request.POST["assignment_id"]))
        task_id = int(request.POST["task_id"]) + 1
        course_id = int(request.POST["course_id"])
        Course.objects.task_set_done(
            assignment_id=assignment_id, task_id=task_id, course_id=course_id)
    return HttpResponse('ok')


def set_undone(request):
    if request.method == "POST":
        assignment_id = str(int(request.POST["assignment_id"]) - 1)
        task_id = int(request.POST["task_id"])
        course_id = int(request.POST["course_id"])
        Course.objects.task_set_undone(
            assignment_id=assignment_id, task_id=task_id, course_id=course_id)
    return HttpResponse('ok')


def add_announcement(request):
    if request.method == "POST":
        text = request.POST["text"]
        heading = request.POST["heading"]
        course_id = request.POST["course_id"]
        announcement = Course.objects.add_announcement(
            text=text, heading=heading, course_id=course_id)
    return HttpResponse('ok')
