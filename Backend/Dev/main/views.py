from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext

def home(request):
	return render_to_response('Pages/home.html', context_instance=RequestContext(request))

def login(request):
	return render_to_response('Pages/login.html', context_instance=RequestContext(request))

def register_student(request):
	return render_to_response('Pages/registration.html', context_instance=RequestContext(request))
