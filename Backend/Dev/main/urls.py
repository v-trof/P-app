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

func_patterns = [
    url(r'^login/$', func_views.login),
   	url(r'^reg/$' , func_views.reg),
]

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
   	url(r'^$', views.home),
   	url(r'^login/$', views.login),
   	url(r'^register_student/$' , views.register_student),
   	url(r'^func/' , include(func_patterns)),
]