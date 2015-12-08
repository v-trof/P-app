# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from .models import User, LoginForm, RegForm
from django.db import models
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login as auth
def login(request):
        def errorHandle(error):
                form = LoginForm()
                return render(request,'Pages/login.html', {
                                'error' : error,
                                'form' : form,
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
                                        request.session.set_expiry(0)
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
                return render(request,'Pages/login.html', {
                        'form': form,
                })

def reg(request):
        if request.method == 'POST':
                form = RegForm(request.POST)
                if form.is_valid():
                        email = request.POST['email']
                        password = request.POST['password']
                        name = request.POST['name']
                        last_name = request.POST['last_name']
                        user = User.objects.create_user(username=email, email=email, password=password, first_name=name, last_name=last_name)
                        if user is not None:
                                user.save
                                return redirect('/')
                        else:
                                error = u'Неверный логин или пароль'
                                return errorHandle(error)
                else: 
                        error = u'Форма незаполнена'
                        return errorHandle(error)               
        else:
                form = LoginForm()
                return render_to_response('Pages/login.html', {
                        'form': form,
                })

def new_course(request):
        if request.method == 'POST':
                        import sqlite3
                        db = sqlite3.connect('db.sqlite3')
                        name = request.POST['name']
                        cursor = db.cursor()
                        cursor.execute('''CREATE TABLE '''+name+''' (id INTEGER PRIMARY KEY) ''')
                        db.commit()
                        return redirect('/')

def new_test(request):
        if request.method == 'POST':
                        import sqlite3
                        db = sqlite3.connect('db.sqlite3')
                        name = request.POST['name']
                        cursor = db.cursor()
                        cursor.execute('''CREATE TABLE '''+name+''' (id INTEGER PRIMARY KEY) ''')
                        db.commit()
                        return redirect('/')