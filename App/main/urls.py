# -*- coding: utf-8 -*-
"""main URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from .python.views import main
from .python.views import functional
from .python.views import test
from .python.views import testing_system
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import sys

test_patterns = [
    url(r'^edit/$', test.edit, name="edit_test"),

    url(r'^delete/$', test.delete, name="delete_test"),
    url(r'^save/$', test.save, name="save_test"),

    url(r'^publish/$', test.publish, name="publish_test"),
    url(r'^unpublish/$', test.unpublish, name="unpublish_test"),
    url(r'^share/$', test.share, name="share_test"),

    url(r'^attempt/$', test.attempt, name="attempt"),
    url(r'^attempt/save/$', test.attempt_save, name="save_attempt"),
    url(r'^attempt/check/$', test.attempt_check, name="check_attempt"),
    url(r'^attempt/results/$', test.results, name="test_results"),
    
    url(r'^upload/$', test.upload_asset, name="upload_asset"),
    url(r'^upload_by_url/$', test.upload_asset_by_url, name="upload_asset_by_url"),
]

func_patterns = [
    url(r'^login/$', functional.User_views.login, name="func_login"),
    url(r'^login/(?P<course_id>[0-9]+)/$', functional.User_views.login_with_reg, name="login_with_reg"),
    url(r'^reg/$', functional.User_views.reg, name="reg"),
    url(r'^create_course/$', functional.Course_views.create, name="create_course"),
    url(r'^set_done/$', functional.Task_views.set_done, name="set_done"),
    url(r'^set_undone/$', functional.Task_views.set_undone, name="set_undone"),
    url(r'^logout/$', functional.User_views.logout, name="func_logout"),
    url(r'^change_data/$', functional.User_views.change_data, name="change_data"),
    url(r'^reset_password/$', functional.User_views.reset_password, name="reset_password"),
    url(r'^change_password/$', functional.User_views.change_password, name="change_password"),
    url(r'^change_email/$', functional.User_views.change_email, name="change_email"),
    url(r'^approve_email/$', functional.User_views.approve_email, name="approve_email"),
    url(r'^approve_password/$', functional.User_views.approve_password, name="approve_password"),
    url(r'^edit_groups/$', functional.Course_views.edit_groups, name="edit_groups"),
    url(r'^create_contact/$', functional.User_views.create_contact, name="create_contact"),
    url(r'^delete_contact/$', functional.User_views.delete_contact, name="delete_contact"),
    url(r'^upload_avatar/$', functional.User_views.upload_avatar, name="upload_avatar"),
    url(r'^invite_students/$', functional.Course_views.invite_students, name="invite_students"),
    url(r'^invite_teacher/$', functional.Course_views.invite_teacher, name="invite_teacher"),
    url(r'^accept_request/$', functional.Course_views.accept_request, name="accept_request"),
    url(r'^decline_request/$', functional.Course_views.decline_request, name="decline_request"),
    url(r'^create_assignment/$', functional.Course_views.create_assignment, name="create_assignment"),
    url(r'^change_permission_level/$', functional.User_views.change_permission_level, name="change_permission_level"),
    url(r'^add_announcement/$', functional.Course_views.add_announcement, name="add_announcement"),
    url(r'^course_reg/(?P<course_id>[0-9]+)/$', functional.Course_views.register, name="register_on_course"),
]

course_patterns = [
    url(r'^(?P<course_id>[0-9]+)/groups/$', main.Course_group.groups, name="groups"),
    url(r'^(?P<course_id>[0-9]+)/groups_content/$', main.Course_group.Elements.groups_content, name="groups_content"),
    url(r'^(?P<course_id>[0-9]+)/give_task/$', main.Course_group.new_task, name="give_task"),
    url(r'^(?P<course_id>[0-9]+)/requests/$', main.Course_group.requests, name="course_requests"),
    url(r'^(?P<course_id>[0-9]+)/$', main.Course_group.main, name="course"),
    url(r'^(?P<course_id>[0-9]+)/updates/$', main.Course_group.updates, name="updates"),
]

urlpatterns = [
    url(r'^uikit/$', main.ui_kit),
    url(r'^course/', include(course_patterns)),
    url(r'^func/', include(func_patterns)),
    url(r'^test/', include(test_patterns)),
    url(r'^login/$', main.Auth_group.login, name="login"),
    url(r'^login/(?P<course_id>[0-9]+)/$', main.Auth_group.login_with_reg, name="login+course"),
    url(r'^secure_entry/$', main.Auth_group.secure_entry, name="secure_entry"),
    url(r'^change_user/$', main.Auth_group.change_user, name="change_user"),
    url(r'^register/$', main.Auth_group.register, name="register"),
    url(r'^register/(?P<course_id>[0-9]+)/$', main.Auth_group.register, name="register+course"),
    url(r'^forgot_password/$', main.Auth_group.forgot_password, name="forgot_password"),

    url(r'^$', main.Main_group.home, name='home'),
    url(r'^profile/(?P<user_id>[0-9]+)/$', main.Main_group.profile, name="profile"),
    url(r'^run_test/$', testing_system.overall_test, name="overall_test")
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()