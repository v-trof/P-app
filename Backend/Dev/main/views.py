from django.shortcuts import render
from django.template import Context

def home(request):
	#sample data
	user = {"name": "Имя", "last_name":"Фамилия"}
	breadcumbs = [{"href":"av","link":"alalalal"},{"href":"a","link":"b"}]
	#end saplpe data
	context = Context({"user" : user, "breadcumbs" : breadcumbs})
	return render(request,'Pages/home.html',context)

def login(request):
	return render(request,'Pages/login.html')

def register_student(request):
	return render(request,'Pages/registration.html')
