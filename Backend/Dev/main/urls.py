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
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import sys

func_patterns = [
    url(r'^login/$', func_views.login),
    url(r'^templatetest/$', func_views.test),
    url(r'^reg/$', func_views.reg),
    url(r'^create_course/$', func_views.create_course),
    url(r'^new_material/$', func_views.new_material),
    url(r'^logout/$', func_views.logout_view),
    url(r'^change_data/$', func_views.change_data),
    url(r'^reset_password/$', func_views.reset_password),
    url(r'^change_password/$', func_views.change_password),
    url(r'^create_contact/$', func_views.create_contact),
    url(r'^upload_avatar/$', func_views.upload_avatar),
    url(r'^invite_students/$', func_views.invite_students),
    url(r'^invite_teacher/$', func_views.invite_teacher),
    url(r'^course_reg/(?P<course_id>[0-9]+)/$', func_views.course_reg),
]

course_patterns = [
    url(r'^(?P<course_id>[0-9]+)/groups/$', views.groups),
]

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.home, name='home'),
    url(r'^test_editor/$', views.test_editor),
    url(r'^register/$', views.register),
    url(r'^register/(?P<course_id>[0-9]+)/$', views.register),
    url(r'^forgot_password/$', views.forgot_password),
    url(r'^func/', include(func_patterns)),
    url(r'^login/$', views.login),
    url(r'^course/', include(course_patterns)),
    url(r'^user/(?P<user_id>[0-9]+)/$', views.profile),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()