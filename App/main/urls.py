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
# from . import func_views
# from . import test_views
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import sys

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', views.login),
    url(r'^login/(?P<course_id>[0-9]+)/$', views.login_with_reg),
    url(r'^change_user/$', views.change_user),
    url(r'^register/$', views.register),
    url(r'^register/(?P<course_id>[0-9]+)/$', views.register),
    url(r'^forgot_password/$', views.forgot_password),

    url(r'^$', views.home, name='home'),
    url(r'^uikit/$', views.ui_kit),
    url(r'^profile/(?P<user_id>[0-9]+)/$', views.profile)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()