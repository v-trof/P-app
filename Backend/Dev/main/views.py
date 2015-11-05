from django.shortcuts import render

def home(request):
	context = {}
	return render(request, 'Pages/home.html', context)