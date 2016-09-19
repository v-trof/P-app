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
import main.python.views
from main.python.views import main
from main.python.views import functional
from main.python.views import test
from main.python.views import material
from main.python.views import testing_system
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import sys

test_patterns = [
    url(r'^edit/$', test.edit, name="edit_test"),

    url(r'^delete/$', test.delete, name="delete_test"),
    url(r'^save/$', test.save, name="save_test"),

    url(r'^publish/$', test.publish, name="publish_test"),
    url(r'^unpublish/$', test.unpublish, name="unpublish_test"),

    url(r'^change_answer_status/$', test.change_answer_status, name="change_answer_status"),
    url(r'^change_score/$', test.change_score, name="change_score"),

    url(r'^attempt/$', test.attempt, name="attempt"),
    url(r'^attempt/save/$', test.attempt_save, name="save_attempt"),
    url(r'^attempt/check/$', test.attempt_check, name="check_attempt"),
    url(r'^attempt/results/$', test.results, name="test_results"),
    url(r'^get_results/$', test.get_results),
    url(r'^get_test_info/$', test.get_test_info),
    url(r'^get_attempt_info/$', test.get_attempt_info),
]

material_patterns = [
    url(r'^edit/$', material.edit, name="edit_material"),

    url(r'^delete/$', material.delete, name="delete_material"),
    url(r'^save/$', material.save, name="save_material"),

    url(r'^publish/$', material.publish, name="publish_material"),
    url(r'^unpublish/$', material.unpublish, name="unpublish_material"),

    url(r'^read/$', material.read, name="read"),
]

func_patterns = [
    url(r'^login/$', functional.User_views.login, name="func_login"),
    url(r'^login/(?P<course_id>[0-9]+)/$', functional.User_views.login_with_reg, name="login_with_reg"),
    url(r'^login/(?P<course_id>[0-9]+)/exit/$', functional.Course_views.exit, name="exit"),
    url(r'^reg/$', functional.User_views.reg, name="reg"),
    url(r'^create_course/$', functional.Course_views.create, name="create_course"),
    url(r'^edit_course/$', functional.Course_views.edit, name="edit_course"),
    url(r'^delete_course/$', functional.Course_views.delete, name="delete_course"),
    url(r'^set_done/$', functional.Task_views.set_done, name="set_done"),
    url(r'^set_undone/$', functional.Task_views.set_undone, name="set_undone"),
    url(r'^logout/$', functional.User_views.logout, name="func_logout"),
    url(r'^change_data/$', functional.User_views.change_data, name="change_data"),
    url(r'^reset_password/$', functional.User_views.reset_password, name="reset_password"),
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
    url(r'^edit_assignment/$', functional.Course_views.edit_assignment, name="edit_assignment"),
    url(r'^change_permission_level/$', functional.User_views.change_permission_level, name="change_permission_level"),
    url(r'^add_section/$', functional.Course_views.add_section, name="add_section"),
    url(r'^edit_sections/$', functional.Course_views.edit_sections, name="edit_sections"),
    url(r'^add_announcement/$', functional.Course_views.add_announcement, name="add_announcement"),
    url(r'^edit_announcement/$', functional.Course_views.edit_announcement, name="edit_announcement"),
    url(r'^delete_announcement/$', functional.Course_views.delete_announcement, name="delete_announcement"),
    url(r'^add_source/$', functional.Course_views.add_source, name="add_source"),
    url(r'^edit_source/$', functional.Course_views.edit_source, name="edit_source"),
    url(r'^delete_source/$', functional.Course_views.delete_source, name="delete_source"),
    url(r'^course_reg/(?P<course_id>[0-9]+)/$', functional.Course_views.register, name="register_on_course"),
    url(r'^delete/$', functional.Utility_views.delete_file, name="delete_file"),
    url(r'^upload/$', functional.Utility_views.upload_file, name="upload_file"),
    url(r'^upload_by_url/$', functional.Utility_views.upload_file_by_url, name="upload_file_by_url"),
    url(r'^delete_assignment/$', functional.Course_views.delete_assignment, name="delete_assignment"),
    url(r'^delete_notification/$', functional.Utility_views.delete_notification, name="delete_notification"),
    url(r'^delete_last_page/$', functional.Utility_views.delete_last_page, name="delete_last_page"),
    url(r'^share/$', functional.Universal_views.share, name="share"),
    url(r'^unshare/$', functional.Universal_views.unshare, name="unshare"),
    url(r'^search/$', functional.Universal_views.search, name="search"),
    url(r'^import_shared/$', functional.Universal_views.import_shared, name="import_shared"),
    url(r'^lib_search/$', functional.Universal_views.lib_search, name="lib_search"),
    url(r'^exit/(?P<course_id>[0-9]+)/$', functional.Course_views.exit, name="exit"),
    url(r'^parse/$', functional.Experimental_views.parse_fipi, name="parse"),
]

course_patterns = [
    url(r'^(?P<course_id>[0-9]+)/groups/$', main.Course_group.groups, name="groups"),
    url(r'^(?P<course_id>[0-9]+)/give_task/$', main.Course_group.new_task, name="give_task"),
    url(r'^(?P<course_id>[0-9]+)/$', main.Course_group.main, name="course"),
    url(r'^(?P<course_id>[0-9]+)/updates/$', main.Course_group.updates, name="updates"),
    url(r'^(?P<course_id>[0-9]+)/sources/$', main.Course_group.sources, name='sources'),
    url(r'^(?P<course_id>[0-9]+)/results/$', main.Course_group.results, name='results'),
    url(r'^(?P<course_id>[0-9]+)/marks/$', main.Course_group.marks, name='marks'),
    url(r'^(?P<course_id>[0-9]+)/marks/groups/$', main.Course_group.marks_by_groups, name='marks_by_groups'),
    url(r'^(?P<course_id>[0-9]+)/marks/tests/$', main.Course_group.marks_by_tests, name='marks_by_tests'),

    url(r'^(?P<course_id>[0-9]+)/manage/$', main.Course_group.manage, name='manage'),
    url(r'^(?P<course_id>[0-9]+)/manage/edit_task/$', main.Course_group.edit_assignment, name="change_task")
]

urlpatterns = [
    url(r'^search/$', main.Main_group.search),
    url(r'^uikit/$', main.Testing_group.ui_kit),
    url(r'^test_suit/(?P<module>.*)/', main.Testing_group.test_suit),
    url(r'^course/', include(course_patterns)),
    url(r'^func/', include(func_patterns)),
    url(r'^test/', include(test_patterns)),
    url(r'^material/', include(material_patterns)),
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

if settings.DEBUG:
    import django_jasmine.urls
    urlpatterns += url(r'^jasmine/', include('django_jasmine.urls')),
