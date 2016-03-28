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
from . import views
from . import func_views
from . import test_views
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import sys

test_patterns = [
    url(r'^edit/$', test_views.edit),

    url(r'^delete/$', test_views.delete),

    url(r'^save/$', test_views.save),

    url(r'^publish/$', test_views.publish),
    url(r'^unpublish/$', test_views.unpublish),
    url(r'^share/$', test_views.share),

    url(r'^attempt/$', test_views.attempt),
    url(r'^attempt/save/$', test_views.attempt_save),
    url(r'^attempt/check/$', test_views.attempt_check),

    url(r'^upload/$', test_views.upload_asset),
]

func_patterns = [
    url(r'^login/$', func_views.login),
    url(r'^login/(?P<course_id>[0-9]+)/$', func_views.login_with_reg),
    url(r'^templatetest/$', func_views.test),
    url(r'^reg/$', func_views.reg),
    url(r'^create_course/$', func_views.create_course),
    url(r'^logout/$', func_views.logout_view),
    url(r'^change_data/$', func_views.change_data),
    url(r'^reset_password/$', func_views.reset_password),
    url(r'^change_password/$', func_views.change_password),
    url(r'^edit_groups/$', func_views.edit_groups),
    url(r'^create_contact/$', func_views.create_contact),
    url(r'^upload_avatar/$', func_views.upload_avatar),
    url(r'^invite_students/$', func_views.invite_students),
    url(r'^invite_teacher/$', func_views.invite_teacher),
    url(r'^accept_request/$', func_views.accept_request),
    url(r'^decline_request/$', func_views.decline_request),
    url(r'^create_assignment/$', func_views.create_assignment),
    url(r'^change_permission_level/$', func_views.change_permission_level),
    url(r'^course_reg/(?P<course_id>[0-9]+)/$', func_views.course_reg),
]

course_patterns = [
    url(r'^(?P<course_id>[0-9]+)/groups/$', views.groups),
    url(r'^(?P<course_id>[0-9]+)/give_task/$', views.give_task),
    url(r'^(?P<course_id>[0-9]+)/requests/$', views.course_requests),
    url(r'^(?P<course_id>[0-9]+)/$', views.course),
]

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^course/', include(course_patterns)),
    url(r'^func/', include(func_patterns)),
    url(r'^test/', include(test_patterns)),

    url(r'^login/$', views.login),
    url(r'^login/(?P<course_id>[0-9]+)/$', views.login_with_reg),
    url(r'^change_user/$', views.change_user),
    url(r'^register/$', views.register),
    url(r'^register/(?P<course_id>[0-9]+)/$', views.register),
    url(r'^forgot_password/$', views.forgot_password),

    url(r'^$', views.home, name='home'),
    url(r'^user/(?P<user_id>[0-9]+)/$', views.profile),


    #fake
    url(r'^results/$', views.fake),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()