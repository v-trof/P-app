def edit(request):
    test = {"heading":"Sample"}
    context =  Context({"test":test})
    return render(request, 'Pages/test_editor.html', context)

def save(request):
	#saves test file
	json_file = request.POST["json_file"]
	course_id = request.POST["course_id"]
	test_id = request.POST["test_id"]
	test_file = open('courses/'+course_id+'/Tests/'+test_id+'.json', 'w')
	test_file.write(json_file)

	return HttpResponse("ok")

def load(request):
	#loads test file
	pass

def delete(request):
	#deletes test file
	pass

def publish(request):
	#make test visible in course
	pass

def unpublish(request):
	#makes test invisible in test
	pass

def share(request):
	#make test avalible in package_catalog
	pass

def attempt(request):
	#creates or continues attempt
	pass

def save_attempt(request):
	#saves attempt data
	pass

def check(request):
	#checks attempts
	pass
