# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from .models import User, Course
from main.func_views import course_getdata,course_get_assignments,user_getdata
from main.func_views import get_users_info
from main.func_views import logout_view
from main.func_views import *
import io
import json

def home(request):
    # sample data
    # """
    # breadcrumbs = request.path
    # print(breadcrumbs)
    """ courses = [
        {
            "subject": "История",
            "courses": [
                {
                    "name": "Зарубежная история",
                    "id": "3",
                    "teacher": "smb",
                    "tests":{
                        "done": 0,
                        "total": 3
                    },
                    "materials":{
                        "done": 1,
                        "total": 9
                    },
                },
                {
                    "name": "История России",
                    "id": "4",
                    "teacher": "smb",
                    "tests":{
                        "done": 14,
                        "total": 16
                    },
                    "materials":{
                        "done": 37,
                        "total": 37
                    },
                }
            ]
        },

    ]"""
    homework = [
        {
            "name": "История",
            "courses": [
                {
                    "name": "Зарубежная история",
                    "course_title_lat": "kurs-a",
                    "course_teacher": "smb",
                    "tasks": [{"tasks": [{
                        "traditional": False,
                        "content": {
                            "tests": [{
                                "done": False,
                                "title": "Короли Швеции",
                                "link": "?course_id=3&test_id=3"
                            }],
                            "materials": []
                        },
                        "done": False
                    }], "due_date": "10 апреля"}]
                }
            ]
        }
    ]
    marks = [
        {
            "name": "История",
            "courses": [
                {
                    "name": "Зарубжная история",
                    "id": "3",
                    "marks": [
                        # {
                        # #good, medium, bad
                        #     "quality": "good",
                        #     "value": 5
                        # }
                    ]
                },
                 {
                    "name": "История России",
                    "id": "4",
                    "marks": [
                            #good, medium, bad
                        {
                            "quality": "good",
                            "value": 5
                        },
                        {
                            "quality": "good",
                            "value": 5
                        },
                        {
                           "quality": "good",
                            "value": 4
                        },
                        {
                            "quality": "good",
                            "value": 5
                        },
                        {
                            "quality": "medium",
                            "value": 3
                        },
                        {
                            "quality": "bad",
                            "value": 2
                        },
                        {
                           "quality": "good",
                            "value": 4
                        },
                        {
                            "quality": "good",
                            "value": 4
                        }
                    ]
                }
            ]
        }
    ]
    if request.user.is_anonymous():
        return render(request, 'Pages/home.html')
    courses=[]
    if request.user.participation_list:
        courses=load_courses(request)
    context = {"courses": courses, "homework": homework, "marks":marks}
    # context = {}
    # print(context)
    if request.user.is_teacher:
        return render(request, 'Pages/home.html', {"user_data":user_getdata(request,request.user)})
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
    user=User.objects.get(id=user_id)
    if user.participation_list and request.user.participation_list:
        classmates=any(i in user.participation_list.split(' ') for i in request.user.participation_list.split(' '))
    else: classmates=False
    if request.user.id == user.id or (user.permission_level == '0') or (user.permission_level == '1' and request.user.is_teacher) or (user.permission_level == '2' and not request.user.is_teacher) or (user.permission_level == '3' and classmates):
        contacts_view_allowed=True
    else: contacts_view_allowed=False
    try:
        return render(request, 'Pages/profile.html', {
            "user":user,
            "breadcrumbs" : [{
                "href" : "#",
                "link" : "Профиль"
                }
            ],
            "contacts_view_allowed":contacts_view_allowed,
            })
    except:
        return render(request, 'Pages/404.html')

def course(request, course_id):
    course=Course.objects.get(id=course_id)
    course_data = course_getdata(request,course)
    return render(request, 'Pages/course.html',{"course":course, "course_data":course_data, "assignments":course_get_assignments(request,course),
            "breadcrumbs" : [{
                "href" : "#",
                "link" : course.name
            }
            ]})

def course_requests(request, course_id):
    with io.open('courses/'+str(course_id)+'/info.json', 'r', encoding='utf8') as data_file:
        data = json.load(data_file)
        pending_users=data["pending_users"]["Заявки"]
    return render(request, 'Pages/course_requests.html', {"course_id":course_id, "pending_users":get_users_info(request,pending_users),
        "breadcrumbs" : [{
            "href" : "/course/"+str(course_id),
            "link" : Course.objects.get(id=course_id).name
        },{
            "href" : "#",
            "link" : "Заявки"
        }]
        })

def groups(request, course_id):
    if course_id:
        course=Course.objects.get(id=course_id)
        context = {"course":course, "course_data":course_getdata(request,course),
        "breadcrumbs" : [{
            "href" : "/course/"+str(course.id),
            "link" : course.name
        },{
            "href" : "#",
            "link" : "Группы"
        }]}
        return render(request, 'Pages/groups.html', context)
    else:
        return render(request, 'Pages/groups.html')

def give_task(request, course_id):
    if course_id:
        course=Course.objects.get(id=course_id)
        context = {"course":course, "course_data":course_getdata(request,course)}
        context["course_data"]["material_list"] = [
            {
                "title": "!How to make bugs!",
                "href": "/1"
            }]
        context["breadcrumbs"] =[{
            "href" : "/course/"+str(course.id),
            "link" : course.name
        },{
            "href" : "#",
            "link" : "Выдать задание"
        }]
        return render(request, 'Pages/give_task.html', context)
    else:
        return render(request, 'Pages/give_task.html')


def fake(request):
    return render(request, 'Pages/fake_res.html')