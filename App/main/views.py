# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context
from .models import User, Course
import io
import json

def home(request):
    if request.user.is_anonymous():
        return render(request, 'Pages/home.html')
    courses=[]
    user_courses=[]
    if request.user.participation_list:
        courses=load_courses(request,request.user)
    if request.user.courses:
        user_courses=load_user_courses(request,request.user)
    if request.user.is_teacher:
        context = {"courses": courses, "user_courses": user_courses, "user_data":user_getdata(request,request.user)}
        return render(request, 'Pages/home.html', context)
    else:
        context = {"courses": courses}
        return render(request, 'Pages/home.html', context)

# login group
def login(request):
    return render(request, 'Pages/login.html')

def updates(request, course_id):
    return render(request, 'Pages/updates.html', {"course": Course.objects.get(id=course_id), "course": user_getdata(request, request.user, course_id)})

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
    return render(request, 'Pages/Account/profile/main.html', {
        "user": user,
        "breadcrumbs" : [{
            "href" : "#",
            "link" : "Профиль"
            }
        ],
        "contacts_view_allowed": contacts_view_allowed,
        })

def course(request, course_id):
    # course=Course.objects.get(id=course_id)
    # course_data = course_getdata(request,course)
    # if request.user.participation_list:
    #     if str(course.id) in request.user.participation_list.split(' '):
    #         is_participant=True
    #     else: is_participant = False
    # else: is_participant=False
    return render(request, 'Pages/Сourse/main.html', {
            "is_participant": True,
            "course": course,
            "course_data":course_data,
            "breadcrumbs" : [{
                "href" : "#",
                "link" : "Курс"
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

def groups_content(request, course_id):
    if course_id:
        course=Course.objects.get(id=course_id)
        context = {"course":course, "course_data":course_getdata(request,course)}
        return render(request, 'Blocks/groups_content.html', context)
    else:
        return render(request, 'Blocks/groups_content.html')

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


def results(request):
    course_id =request.GET["course_id"]
    test_id =  request.GET["test_id"]
    context = {"course":Course.objects.get(id=course_id), "test_id":test_id, "results":get_results(request, course_id, test_id), "attempt":get_attempt_info(request, course_id, test_id), "test":get_test_info(request, course_id, test_id)}
    return render(request, 'Pages/results.html', context)

def ui_kit(request):
    context = {
        "course": {
            "name": "sample_course",
            "data": {
                "materials": {
                    "published": ["a","b","c"]
                },
                "tests": {
                    "published": ["saple_test"]
                }
            }
        },
        "user": {
            "name": "Sample User"
        },
        "announcement": {
            "heading": "sample_announcement",
            "text": "sample_text"
        },
        "breadcrumbs" : [{
            "href" : "/Курсы",
            "link" : "/course/1"
        },{
            "href" : "#",
            "link" : "Заявки"
        }],
        "request": {
            "user": {
                "name": "Sample User"
            }
        },
        "options": [{
            "value": 1,
            "text" : "Option 1",
        }, {
            "value": 2,
            "text" : "Option 2",
        }, {
            "value": 3,
            "text" : "Option 3",
        }],
    }
    return render(request, 'Pages/UI_kit/main.html', context)