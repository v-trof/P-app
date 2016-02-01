# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from .models import User, Course
from main.func_views import course_getdata

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
    return render(request, 'Pages/home.html', context)

# login group
def login(request):
    return render(request, 'Pages/login.html')


def register(request, course_id=None):
    if course_id is not None:
            return render(request, 'Pages/registration.html', {"course":Course.objects.get(id=course_id)})
    else:
        return render(request, 'Pages/registration.html')


def forgot_password(request):
    return render(request, 'Pages/forgot_password.html')

def test_editor(request):
    test = {"heading":"Sample"}
    context =  Context({"test":test})
    return render(request, 'Pages/test_editor.html', context)

def profile(request, user_id):
    try: 
        return render(request, 'Pages/profile.html', {"user":User.objects.get(id=user_id)})
    except:
        return render(request, 'Pages/404.html')

def course(request):
    return render(request, 'Pages/course.html')

def groups(request, course_id):
    if course_id:
            course=Course.objects.get(id=course_id)
            return render(request, 'Pages/groups.html', {"course":course, "course_data":course_getdata(request,course)})
    else:
        return render(request, 'Pages/groups.html')