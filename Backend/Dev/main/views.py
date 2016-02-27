# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from .models import User, Course
from main.func_views import course_getdata,course_get_assignments
from main.func_views import get_users_info
from main.func_views import logout_view
import io
import json

def home(request):
    # sample data
    """
    breadcrumbs = request.path
    # print(breadcrumbs)
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
                        "warning": [
                            {
                                "icon": "in_progress",
                                "text": "Вы начали проходить тест и не закончили попытку!"
                            }
                        ],
                        "neutral": [],
                        "positive": []
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
                    }, {
                        "traditional": True,
                        "done": False,
                        "content": "Прочитать книгу Б"
                    }],
                    "due_date": "12 ноября"
                }
            ]
        }
    ]
    marks = [
        {
            "name": "Предмет 1",
            "courses": [
                {
                    "title": "Курс А",
                    "title_lat": "kurs-a",
                    "marks": [
                        {
                        #good, medium, bad
                            "quality": "good",
                            "value": 5
                        }
                    ]
                }
            ]
        }
    ]
    """
    # context = {"breadcrumbs": breadcrumbs, "courses": courses, "homework": homework, "marks": marks}
    context = {}
    # print(context)
    if request.user.is_anonymous():
        return render(request, 'Pages/home.html', context)
    if request.user.is_teacher:
        courses=[]
        if request.user.courses:
            courses=request.user.courses.split(" ")
            for i,course in enumerate(courses):
                print (courses[i])
                courses[i]=Course.objects.get(id=int(course))
        return render(request, 'Pages/home.html', {"courses":courses})
    else: return render(request, 'Pages/home.html', context)

# login group
def login(request):
    return render(request, 'Pages/login.html')

def login_with_reg(request, course_id=None):
    return render(request, 'Pages/login.html', {"course":Course.objects.get(id=course_id)})

def change_user(request):
    logout_view(request)
    return render(request, 'Pages/login.html')

def register(request, course_id=None):
    if course_id is not None:
            return render(request, 'Pages/registration.html', {"course":Course.objects.get(id=course_id)})
    else:
        return render(request, 'Pages/registration.html')

def forgot_password(request):
    return render(request, 'Pages/forgot_password.html')

def profile(request, user_id):
    try: 
        return render(request, 'Pages/profile.html', {"user":User.objects.get(id=user_id)})
    except:
        return render(request, 'Pages/404.html')

def course(request, course_id):
    course=Course.objects.get(id=course_id)
    return render(request, 'Pages/course.html',{"course":course, "course_data":course_getdata(request,course), "assignments":course_get_assignments(request,course)})

def course_requests(request, course_id):
    with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
        data = json.load(data_file)
        pending_users=data["pending_users"]["Заявки"]
    return render(request, 'Pages/course_requests.html', {"course_id":course_id, "pending_users":get_users_info(request,pending_users)})

def groups(request, course_id):
    if course_id:
            course=Course.objects.get(id=course_id)
            return render(request, 'Pages/groups.html', {"course":course, "course_data":course_getdata(request,course)})
    else:
        return render(request, 'Pages/groups.html')