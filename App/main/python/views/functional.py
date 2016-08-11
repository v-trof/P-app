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
from main.models import *
from binascii import hexlify
import glob
from http import cookies
import collections


class User_views():

    def login(request):
        if request.method == 'POST':
            email = request.POST['email']
            password = request.POST['password']
            message = User.objects.login(
                request=request, email=email, password=password)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def login_with_reg(request, course_id):
        if request.method == 'POST':
            email = request.POST['email']
            password = request.POST['password']
            code=request.GET.get('code',None)
            message = User.objects.login(
                request=request, email=email, password=password)
            Course_views.register(request=request, course_id=course_id, code=code)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def change_permission_level(request):
        if request.method == 'POST':
            message = User.objects.change_permission_level(
                user=request.user, permission_level=request.POST['permission_level'])
            return HttpResponse(json.dumps(message), content_type="application/json")

    def logout(request):
        logout(request)
        return redirect('/')

    def reg(request):
        if request.method == 'POST':
            if not request.user.is_anonymous():
                logout(request)
            course_id = request.POST.get('course_id', False)
            email = request.POST['email']
            code=request.POST.get('code',None)
            is_teacher = request.POST.get('is_teacher', False)
            password = request.POST['password']
            name_last_name = request.POST['name_last_name']
            message = User.objects.reg(request=request, code=code, course_id=course_id, email=email,
                                       is_teacher=is_teacher, password=password, name_last_name=name_last_name)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def change_data(request):
        if request.method == 'POST':
            data_list = json.loads(request.POST["data_list"])
            message = User.objects.change_profile_data(
                user=request.user, data_list=data_list)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def create_contact(request):
        if request.method == 'POST':
            contact_type = request.POST['contact_type']
            contact_info = request.POST['contact_info']
            message = User.objects.create_contact(
                contact_type=contact_type, user=request.user, contact_info=contact_info)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def delete_contact(request):
        if request.method == 'POST':
            contact_type = request.POST['contact_type']
            message = User.objects.delete_contact(
                contact_type=contact_type, user=request.user)
            return HttpResponse(message)

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
                return HttpResponse(json.dumps({"type":"success","message":"Письмо для подтверждения отправлено вам на новую почту"}), content_type="application/json")
            else:
                return HttpResponse(json.dumps({"type":"error","message":"Email занят"}), content_type="application/json")

    def approve_email(request):
        if request.method == 'POST':
            if not User.objects.filter(id=int(user_id)).exists():
                return HttpResponse("Несуществующий пользователь")

            user = User.objects.get(id=int(request.POST['user_id']))
            if user.check_password(request.POST['password']):
                if User.objects.approve(type=request.POST['type'], code=request.POST['code'])["user_id"] == str(user.id):
                    setattr(user, 'username', request.POST['requesting_data'])
                    setattr(user, 'email', request.POST['requesting_data'])
                    user.save()
                    User.objects.login(request=request, email=request.POST['requesting_data'], password=request.POST['password'])
                    return HttpResponse("success")
            else:
                return HttpResponse("Неправильный пароль")

    def approve_password(request):
        if request.method == 'POST':
            user = User.objects.get(id=int(request.POST['user_id']))
            if User.objects.approve(type=request.POST['type'], code=request.POST['code'])["user_id"] == str(user.id):
                setattr(user, 'password', strip_tags(
                    make_password(request.POST['new_password'])))
                user.save()
                User.objects.login(request=request, email=user.email, password=request.POST['new_password'])
                return HttpResponse("success")
            else:
                return HttpResponse("Ошибка")

    def upload_avatar(request):
        if request.method == 'POST':
            return HttpResponse(User.objects.upload_avatar(user=request.user, new_avatar=request.FILES['new_avatar']))


class Course_views():

    def create(request):
        if request.method == 'POST':
            db = sqlite3.connect('db.sqlite3')
            name = request.POST.get('course_name', None)
            if not request.user.is_teacher:
                request.user.is_teacher = True
                request.user.save()
            subject = request.POST.get('subject', None)
            creator = User.objects.get(id=request.user.id)
            is_closed = request.POST.get('is_closed', False)
            course = Course.objects.create_course(
                name=name, subject=subject, creator=creator, is_closed=is_closed)
            redirect_url = '/course/' + str(course.id) + '/'
            return HttpResponse(redirect_url)

    def edit(request):
        if request.method == 'POST':
            db = sqlite3.connect('db.sqlite3')
            name = request.POST.get('course_name', None)
            subject = request.POST.get('subject', None)
            course = Course.objects.get(id=request.POST.get('course_id', None))
            is_closed = request.POST.get('is_closed', False)
            message = Course.objects.edit(
                name=name, subject=subject, course=course, is_closed=is_closed)
            return HttpResponse(json.dumps(message), content_type="application/json")
        else:
            return HttpResponse('Нет полномочий')

    def delete(request):
        if request.method == 'POST':
            course_id = request.POST.get('course_id', None)
            message = Course.objects.delete(course_id=course_id)
            request.session['notifications']=[{"type":"success","message":message}]
            return HttpResponse(message)
        else:
            return HttpResponse('Нет полномочий')

    def add_source(request):
        if request.method == "POST":
            name = request.POST.get("name", None)
            size = request.POST.get("size", None)
            link = request.POST.get("link", None)
            course_id = request.POST.get("course_id", None)
            source_id = Course.objects.add_source(
                course_id=course_id, user=request.user, name=name, size=size, link=link)
            return HttpResponse(source_id)

    def edit_source(request):
        if request.method == "POST":
            link = request.POST.get("link", None)
            name = request.POST.get("name", None)
            size = request.POST.get("size", None)
            source_id = request.POST.get("source_id", None)
            course_id = request.POST.get("course_id", None)
            message = Course.objects.edit_source(
                link=link, name=name, size=size, course_id=course_id, source_id=source_id, user=request.user)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def delete_source(request):
        if request.method == "POST":
            source_id = request.POST.get("source_id", None)
            course_id = request.POST.get("course_id", None)
            message = Course.objects.delete_source(
                course_id=course_id, source_id=source_id)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def add_section(request):
        if request.method == "POST":
            section = request.POST.get("section", None)
            type = request.POST.get("type", None)
            course_id = request.POST.get("course_id", None)
            message = Course.objects.add_section(
                section=section, course_id=course_id, type=type)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def edit_sections(request):
        if request.method == "POST":
            sections = json.loads(request.POST.get("sections", None))
            course_id = request.POST.get("course_id", None)
            message = Course.objects.edit_sections(
                sections=sections, course_id=course_id)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def add_announcement(request):
        if request.method == "POST":
            text = request.POST.get("text", None)
            heading = request.POST.get("heading", None)
            course_id = request.POST.get("course_id", None)
            announcement_id = Course.objects.add_announcement(
                text=text, heading=heading, course_id=course_id, user=request.user)
            return HttpResponse(announcement_id)

    def edit_announcement(request):
        if request.method == "POST":
            announcement_id = request.POST.get("announcement_id", None)
            text = request.POST.get("text", None)
            heading = request.POST.get("heading", None)
            course_id = request.POST.get("course_id", None)
            message = Course.objects.edit_announcement(
                text=text, heading=heading, course_id=course_id, announcement_id=announcement_id, user=request.user)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def delete_announcement(request):
        if request.method == "POST":
            announcement_id = request.POST.get("announcement_id", None)
            course_id = request.POST.get("course_id", None)
            announcement = Course.objects.delete_announcement(
                course_id=course_id, announcement_id=announcement_id)
            return HttpResponse(announcement)

    def edit_groups(request):
        if request.method == 'POST':
            groups_data = json.loads(request.POST.get("groups_data", None))
            renames = json.loads(request.POST.get("renames", None))
            course = Course.objects.get(id=request.POST.get("course_id", None))
            message = Course.objects.edit_groups(
                course=course, groups_data=groups_data, renames=renames)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def invite_students(request):
        if request.method == 'POST':
            email_list = json.loads(request.POST.get("email_list", None))
            group = request.POST.get('group', None)
            course = Course.objects.get(id=request.POST.get('course_id', None))
            message = Course.objects.invite_students(
                email_list=email_list, group=group, course=course, user=request.user)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def invite_teacher(request):
        if request.method == 'POST':
            email = request.POST.get('email', None)
            course = Course.objects.get(id=request.POST.get('course_id', None))
            message = Course.objects.invite_teacher(
                user=request.user, course=course, email=email)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def register(request, course_id):
        if request.user.is_anonymous():
            return redirect('/login/' + course_id)
        code=request.GET.get('code',None)
        course = Course.objects.get(id=course_id)
        message = Course.objects.reg_user(user=request.user, course=course, code=code)
        request.session['notifications']=message
        return redirect('/course/' + str(course_id) + '/')

    def exit(request, course_id):
        if request.user.is_anonymous():
            return redirect('/login/' + course_id+'/exit/')
        course = Course.objects.get(id=course_id)
        message = Course.objects.exit(user=request.user, course=course)
        request.session['notifications']=message
        return redirect('/course/' + str(course_id) + '/')

    def accept_request(request):
        if request.method == 'POST':
            user_id = request.POST.get('user_id', None)
            if not User.objects.filter(id=int(user_id)).exists():
                return HttpResponse('Пользователь не существует')
            user = User.objects.get(id=user_id)
            course_id = request.POST.get('course_id', None)
            message = Course.objects.accept_request(
                user=user, course_id=course_id)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def decline_request(request):
        if request.method == 'POST':
            user_id = request.POST.get('user_id', None)
            user = User.objects.get(id=int(user_id))
            course_id = request.POST.get('course_id', None)
            message = Course.objects.decline_request(
                user=user, course_id=course_id)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def create_assignment(request):
        if request.method == 'POST':
            course_id = request.POST.get('course_id', None)
            test_list = request.POST.get('test_list', None)
            material_list = request.POST.get('material_list', None)
            traditionals_list = request.POST.get('traditionals_list', None)
            group_list = request.POST.get('group_list', None)
            due_date = request.POST.get('due_date', None)
            message = Course.objects.create_assignment(course_id=course_id, test_list=test_list, group_list=group_list,
                                                       material_list=material_list, traditionals_list=traditionals_list, due_date=due_date)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def edit_assignment(request):
        if request.method == 'POST':
            course_id = request.POST.get('course_id', None)
            assignment_id = request.POST.get("assignment_id", None)
            test_list = request.POST.get('test_list', None)
            material_list = request.POST.get('material_list', None)
            traditionals_list = request.POST.get('traditionals_list', None)
            group_list = request.POST.get('group_list', None)
            due_date = request.POST.get('due_date', None)
            message = Course.objects.edit_assignment(course_id=course_id, assignment_id=assignment_id, test_list=test_list, group_list=group_list,
                                                     material_list=material_list, traditionals_list=traditionals_list, due_date=due_date)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def delete_assignment(request):
        if request.method == 'POST':
            course_id = request.POST.get('course_id', None)
            assignment_id = request.POST.get("assignment_id", None)
            message = Course.objects.delete_assignment(
                course_id=course_id, assignment_id=assignment_id)
            return HttpResponse(json.dumps(message), content_type="application/json")


class Task_views():

    def set_done(request):
        if request.method == "POST":
            assignment_id = str(int(request.POST.get("assignment_id", None)))
            traditional_id = int(request.POST.get("traditional_id", None))
            course_id = int(request.POST.get("course_id", None))
            message = Course.objects.task_set_done(
                assignment_id=assignment_id, traditional_id=traditional_id, course_id=course_id, user=request.user)
            return HttpResponse(json.dumps(message), content_type="application/json")

    def set_undone(request):
        if request.method == "POST":
            assignment_id = str(int(request.POST.get("assignment_id", None)))
            traditional_id = int(request.POST.get("traditional_id", None))
            course_id = int(request.POST.get("course_id", None))
            message = Course.objects.task_set_undone(
                assignment_id=assignment_id, traditional_id=traditional_id, course_id=course_id, user=request.user)
            return HttpResponse(json.dumps(message), content_type="application/json")


def get_group_list(request, course_id=None):
    if request.method:
        course = Course.objects.get(id=course_id)
        message = Course.objects.get_group_list(course=course)
        return HttpResponse(json.dumps(message), content_type="application/json")


def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get("file", None)
        path = request.POST.get("path", None)
        filename = Utility.upload_file(file=file, path=path)
        return HttpResponse(filename)


def upload_file_by_url(request):
    if request.method == 'POST':
        file_url = request.POST.get("file_url", None)
        path = request.POST.get("path", None)
        filepath = Utility.upload_file_by_
        url(url=file_url, path=path)
        return HttpResponse(filepath)


def delete_file(request):
    if request.method == 'POST':
        path = request.POST.get("path", None)
        status = Utility.delete_file(path=path)
        return HttpResponse(status)

def delete_notification(request):
    if request.method == 'POST':
        del request.session['notifications']
        return HttpResponse('ok')

def delete_last_page(request):
    if request.method == 'POST':
        del request.session['last_page']
        return HttpResponse('ok')

def search(request):
    if request.method == "POST":
        search_query=request.POST.get("search_query","")
        print("123123",request.POST)
        if "search_types" in request.POST.keys():
            search_types=json.loads(request.POST["search_types"])
        else: search_types=None
        cards=Search.complex(search_query=search_query,search_types=search_types,user=request.user)
        return HttpResponse(json.dumps(cards), content_type="application/json")

class Universal_views():

    def share(request):
        if request.method == 'POST':
            course_id = request.POST.get("course_id", None)
            item_id = request.POST.get("item_id", None)
            name=request.POST.get("name", None)
            type=request.POST.get("type", None)
            response= Sharing.share(course_id=course_id,item_id=item_id,type=type,name=name)
            return HttpResponse(response)

    def unshare(request):
        if request.method == 'POST':
            course_id = request.POST.get("course_id", None)
            item_id = request.POST.get("item_id", None)
            shared_id=request.POST.get("shared_id", None)
            type=request.POST.get("type", None)
            response= Sharing.unshare(course_id=course_id,item_id=item_id,type=type,shared_id=shared_id)
            return HttpResponse(response)

