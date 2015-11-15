from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext

def home(request):
	return render_to_response('HTML/login.html', context_instance=RequestContext(request))

def login(request):
	return render_to_response('HTML/login.html', context_instance=RequestContext(request))

def register_student(request):
	return render_to_response('HTML/registration.html', context_instance=RequestContext(request))
