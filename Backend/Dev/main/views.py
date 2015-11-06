from django.shortcuts import render

def home(request):
	items100 = []
	for i in range(500):
		items100.append(i)
	context = {"items100":items100}
	return render(request, 'Pages/home.html', context)