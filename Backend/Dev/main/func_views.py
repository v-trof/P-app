# -*- coding: utf-8 -*-
import sqlite3
from django.core.files import File
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response, redirect
from django.template import RequestContext
from django.core.mail import send_mail
from django.db import models
from django.contrib.auth import authenticate, login as auth
import os
from .models import User, LoginForm, RegForm, FileForm
from django.contrib.auth import logout
from django.utils.html import strip_tags
from binascii import hexlify
from django.contrib.auth.hashers import make_password, check_password

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
        email = request.POST['email']
        is_teacher = request.POST['is_teacher']
        password = request.POST['password']
        name_last_name = request.POST['name_last_name']
        if not User.objects.filter(email=email):
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                name=name_last_name,
                is_teacher=is_teacher,
                avatar = 'Images/avatar.png')
        else:
            error = u'Данный email уже зарегистрирован'
            return errorHandle(error,email,password,name_last_name)
        if user is not None:
                user.save
                user = authenticate(username=email, password=password)
                auth(request, user)
                request.session.set_expiry(36000)
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


def new_course(request):
    if request.method == 'POST':
        db = sqlite3.connect('db.sqlite3')
        name = request.POST['name']
        cursor = db.cursor()
        cursor.execute(
            ''' CREATE TABLE ''' + name +
            ''' ( "id" integer PRIMARY KEY NOT NULL,"name" varchar(30)
                NOT NULL,"link" varchar(30) NOT NULL)''')
        db.commit()
        return redirect('/')

def new_material(request):
    if request.method == 'POST':
        db = sqlite3.connect('db.sqlite3')
        course_name = request.POST['course_name']
        material_name = request.POST['material_name']
        link = course_name+'/'+material_name+'.json'
        cursor = db.cursor()
        cursor.execute(
            ''' INSERT INTO ''' + course_name +
            ''' (name,link) VALUES (' ''' + material_name +
            ''' ', ' ''' + link + ''' ');''')
        db.commit()
        if not os.path.exists('json/'+course_name+'/'):
            os.makedirs('json/'+course_name+'/')
        f = open('json/'+course_name+'/'+material_name+'.json', 'a')
        material = File(f)
        material.write('Hello World')
        material.close()
        f.close()
        return redirect('/')

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
    return redirect('/')

def create_contact(request):
    if request.method == 'GET':
        contact_type = request.GET['contact_type']
        contact_info = request.GET['contact_info']
        setattr(request.user, contact_type, strip_tags(contact_info))
        request.user.save()
    return redirect('/')

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
    destination = open('main/Static/Images/'+str(request.user.id)+'.jpg', 'wb+')
    destination.write(request.FILES['new_avatar'].read())
    setattr(request.user, avatar, strip_tags('Images/'+str(request.user.id)+'.jpg'))
    request.user.save()
    return HttpResponse("ok")