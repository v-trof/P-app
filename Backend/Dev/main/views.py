from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext

def home(request):
	return render('Pages/home.html')

def login(request):
	return render('Pages/login.html')

def register_student(request):
	return render('Pages/registration.html')
