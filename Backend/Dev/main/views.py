from django.shortcuts import render
from django.template import Context

def home(request):
	#sample data
	user = {"name": "Имя", "last_name": "Фамилия"}
	breadcumbs = [{"href": "av","link": "alalalal"},{"href": "a","link": "b"}]
	courses = [
		{
			"name": "Предмет 1",
			"courses": [
				{
					"title": "Курс А",
					"title_lat": "kurs-a",
					"teacher": "smb",
					"tests":{
						"done": 4,
						"total": 10
					},
					"materials":{
						"done": 2,
						"total": 4
					},
					"messages": {
						"warning": [],
						"neutral": [] 
					}
				}
			]
		},
	]
	homework = [
		{
			"name": "Предмет 1",
			"assignments": [
				{
					"course_title": "Курс А",
					"course_title_lat": "kurs-a",
					"course_teacher": "smb",
					"tasks": [{
						"traditional": False,
						"done": False,
						"content": {
							"tests": [
								{
									"title": "Test 1",
									"link": "test-1",
									"done": True
								},
								{
									"title": "Test 2",
									"link": "test-2",
									"done": False
								}
							],
							"materials": [
								{
									"title": "Material 1",
									"link": "material-1",
									"done": True
								}
							]
						}
					},{
						"traditional": True,
						"done": False,
						"content": "Прочитать книгу Б"
					}],
					"due_date": "12 ноября"
				}
			]
		}
	]
	#end sample data
	context = Context({"user": user, "breadcumbs": breadcumbs, "courses": courses, "homework": homework})
	return render(request,'Pages/home.html',context)

def login(request):
	return render(request,'Pages/login.html')

def register_student(request):
	return render(request,'Pages/registration.html')