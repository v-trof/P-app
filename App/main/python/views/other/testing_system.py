from django.test import Client
from django.shortcuts import render, render_to_response, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from .models import *
from main.forgiving_check import full_check
from django.test import TestCase, RequestFactory

def overall_test(request):
	c = Client()
	user = User.objects.get(email="ff@ff.ff")
	email="ff@ff.ff"
	password="ffffffff"
	course_id="3"
	subject="Русский язык"
	creator=user
	is_closed=True
	name="sdfdsf"
	test_id="1"
	course=Course.objects.get(id=course_id)
	json_file='{"title":"Новый Тест","author":"","tasks":[{"question_items":[{"class":"text-wrapper","value":"sdf"}],"answer_items":[{"class":"text-answer","value":{"label":"sdfdsf","answer":"d"}}]}],"mark_setting":{"3":50,"4":70,"5":85}}'
	pages = {"Login": page_login(c=c, user=user), "Change_user": page_change_user(c=c, user=user), "Home": page_home(c=c, user=user), "Register" : page_register(c=c, user=user),
			 "Forgot_password" : page_forgot_password(c=c, user=user), "Course" : page_course(c=c, user=user),
			 "Profile":page_profile(c=c, user=user)
			 }
	functions = {"User":{},"Course":{},"Test":{}}

	#functions["User"]["Login"]=user_login(email=email,password=password)
	functions["User"]["Change_permission_level"]=user_change_permission_level(user=user, permission_level=1)
	functions["User"]["Load_courses"]=user_load_courses(user=user)
	functions["User"]["Load_self_courses"]=user_load_self_courses(user=user)
	functions["User"]["Get_data"]=user_get_data(object=user,course_id=course_id)
	#functions["User"]["Change_data"]=user_change_data(user=user,data_list=data_list)
	functions["User"]["Get_view_permission"]=user_get_view_permission(user=user,requesting_user=user)
	functions["User"]["Reset_password"]=user_reset_password(email=email)
	#functions["User"]["Upload_avatar"]=user_upload_avatar(user=user, new_avatar=new_avatar)

	functions["Course"]["Create_course"]=course_create_course(name=name, subject=subject, creator=creator, is_closed=is_closed)
	#functions["Course"]["Edit_groups"]=course_edit_groups(course=course, groups_data=groups_data)
	#functions["Course"]["Add_announcement"]=course_add_announcement(heading=heading, text=text, course_id=course_id)
	#functions["Course"]["Task_set_undone"]=course_task_set_undone(assignment_id=assignment_id, task_id=task_id, course_id=course_id)
	#functions["Course"]["Task_set_done"]=course_task_set_done(assignment_id=assignment_id, task_id=task_id, course_id=course_id)
	#functions["Course"]["Add_announcement"]=course_add_announcement(heading=heading, text=text, course_id=course_id)
	#functions["Course"]["Invite_students"]=course_invite_students(course=course, user=user, group=group, email_list=email_list)
	#functions["Course"]["Invite_teacher"]=course_invite_teacher(course=course, user=user, email=email)
	functions["Course"]["Reg_user"]=course_reg_user(course=course, user=user)
	functions["Course"]["Get_data"]=course_get_data(user=user, course=course)
	functions["Course"]["Get_assignments"]=course_get_assignments(user=user, course=course)
	#functions["Course"]["Get_user_assignments"]=course_user_get_assignments(user=user, course=course)
	#functions["Course"]["Get_users_info"]=course_get_users_info(user_ids=user_ids)
	#functions["Course"]["Accept_request"]=course_accept_request(user=user, course_id=course_id)
	#functions["Course"]["Decline_request"]=course_decline_request(user=user, course_id=course_id)
	#functions["Course"]["Create_assignment"]=course_create_assignment(course_id=course_id, test_list=test_list, material_list=material_list, traditionals_list=traditionals_list, due_date=due_date)
	functions["Course"]["Get_group_list"]=course_get_group_list(course=course)
	functions["Course"]["Load_course_requests"]=course_load_course_requests(course_id=course_id)
	functions["Course"]["Check_participance"]=course_check_participance(course=course,user=user)
	functions["Course"]["Load_announcements"]=course_load_announcements(course=course)

	functions["Test"]["Create_test"]=test_create_test(course_id=course_id)
	functions["Test"]["Save_test"]=test_save(json_file=json_file,course_id=course_id, test_id=test_id)
	functions["Test"]["Publish_test"]=test_publish(course_id=course_id, test_id=test_id)
	functions["Test"]["Load_test"]=test_load(course_id=course_id,test_id=test_id)
	#functions["Test"]["Attempt"]=test_attempt(course_id=course_id,test_id=test_id,user=user)
	#functions["Test"]["Check_question"]=test_check_question(item=item)
	#functions["Test"]["Attempt_save"]=test_attempt_save(test_id=test_id,question_id=question_id,task_id=task_id,course_id=course_id,answer=answer)
	#functions["Test"]["Attempt_check"]=test_attempt_check(course_id=course_id,test_id=test_id)
	#functions["Test"]["Give_mark"]=test_give_mark(percentage=percentage, course_id=course_id, test_id=test_id)
	#functions["Test"]["Set_mark_quality"]=test_set_mark_quality(mark=mark)
	#functions["Test"]["Set_mark_quality"]=test_set_mark_quality(mark=mark)
	#functions["Test"]["Get_results"]=test_get_results(course_id=course_id, test_id=test_id,user=user)
	functions["Test"]["Get_test_info"]=test_get_test_info(course_id=course_id, test_id=test_id)
	functions["Test"]["Get_attempt_info"]=test_get_test_info(course_id=course_id, test_id=test_id)
	functions["Test"]["Unpublish_test"]=test_unpublish(course_id=course_id,test_id=test_id)
	functions["Test"]["Delete_test"]=test_delete(course_id=course_id, test_id=test_id)

	check_example="ancilliary"
	check_example_right="ancillary"
	check_result=full_check(check_example,check_example_right,True)
	context = {"pages": pages, "functions": functions, "check_example": check_example, "check_example_right": check_example_right, "check_result": check_result}
	return render(request, 'Pages/test_status.html', context)


def page_login(c, user):
	response = c.post('/login/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code
def page_home(c, user):
	c.force_login(user)
	response = c.post('/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code
def page_change_user(c, user):
	c.force_login(user)
	response = c.post('/change_user/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code
def page_register(c, user):
	c.force_login(user)
	response = c.post('/register/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code
def page_forgot_password(c, user):
	c.force_login(user)
	response = c.post('/forgot_password/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code
def page_course(c, user):

	return "OK"
def page_profile(c, user):
	c.force_login(user)
	response = c.post('/user/14/')
	if response.status_code==200 :
		return "OK"
	else : return response.status_code

def user_login(email, password):
	response = User.objects.login(email=email,password=password)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_change_permission_level(user, permission_level):
	response = User.objects.change_permission_level(user=user,permission_level=0)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_load_courses(user):
	response = User.objects.load_courses(user=user)
	if response or response==0 or response==[]or response=={}:
		return "OK"
	else : return "ERROR"
def user_load_self_courses(user):
	response = User.objects.load_self_courses(user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_get_data(object, course_id=False):
	response = User.objects.get_data(object=object, course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_change_data(user, data_list):
	response = User.objects.change_data(user=user, data_list=data_list)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_get_view_permission(user,requesting_user):
	response = User.objects.get_view_permission(user=user, requesting_user=requesting_user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_reset_password(email):
	response = User.objects.reset_password(email=email)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def user_upload_avatar(user, new_avatar):
	response = User.objects.upload_avatar(user=user, new_avatar=new_avatar)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"

def test_create_test(course_id):
	response = Test.objects.create(course_id=course_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_delete(course_id, test_id):
	response = Test.objects.delete(course_id=course_id,test_id=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_save(json_file, course_id, test_id):
	response = Test.objects.save(json_file=json_file,course_id=course_id,test_id=test_id)
	print(response)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_load(course_id, test_id):
	response = Test.objects.load(course_id=course_id,test_id=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_publish(course_id,test_id):
	response = Test.objects.publish(course_id=course_id,test_id=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_unpublish(course_id,test_id):
	response = Test.objects.unpublish(course_id=course_id,test_id=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_attempt(course_id,test_id,user):
	response = Test.objects.attempt(course_id=course_id,user=user,test_id=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_check_question(item):
	response = Test.objects.check_question(item=item)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_attempt_save(test_id,question_id,task_id,course_id,answer):
	response = Test.objects.attempt_save(test_id=test_id,question_id=test_id,task_id=test_id,course_id=test_id,answer=test_id)
	if response or response==0:
		return "OK"
	else : return "ERROR"
def test_attempt_check(test_id,course_id):
	response = Test.objects.attempt_check(course_id=course_id,test_id=test_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def test_give_mark(percentage, course_id, test_id):
	response = Test.objects.give_mark(percentage=percentage,course_id=course_id,test_id=test_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def test_set_mark_quality(mark):
	response = Test.objects.set_mark_quality(mark=mark)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def test_get_results(course_id,test_id,user):
	response = Test.objects.get_results(course_id=course_id,test_id=test_id,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def test_get_test_info(course_id, test_id):
	response = Test.objects.get_test_info(course_id=course_id,test_id=test_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def test_get_attempt_info(course_id, test_id, user):
	response = Test.objects.get_attempt_info(course_id=course_id,test_id=test_id, user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"

def course_create_course(name, subject, creator, is_closed):
	response = Course.objects.create_course(name=name, subject=subject,creator=creator,is_closed=is_closed)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_edit_groups(course, groups_data):
	response = Course.objects.edit_groups(course=course,groups_data=groups_data)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_add_announcement(heading, text, course_id):
	response = Course.objects.add_announcement(heading=heading,text=text,course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_task_set_undone(assignment_id, task_id, course_id):
	response = Course.objects.set_undone(assignment_id=assignment_id,task_id=task_id,course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_task_set_done(assignment_id, task_id, course_id):
	response = Course.objects.set_done(assignment_id=assignment_id,task_id=task_id,course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_invite_students(course, user, group, email_list):
	response = Course.objects.invite_students(course=course,user=user,group=group, email_list=email_list)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_invite_teacher(course, user, email):
	response = Course.objects.invite_teacher(course=course,user=user,email=email)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_reg_user(course, user):
	response = Course.objects.reg_user(course=course,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_get_data(user, course):
	response = Course.objects.get_data(course=course,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_get_assignments(user, course):
	response = Course.objects.get_assignments(course=course,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_user_get_assignments(user, course):
	response = Course.objects.user_get_assignments(course=course,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_get_users_info(user_ids):
	response = Course.objects.get_users_info(user_ids=user_ids)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_accept_request(user, course_id):
	response = Course.objects.accept_request(user=user,course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_decline_request(user, course_id):
	response = Course.objects.decline_request(user=user,course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_create_assignment(course_id, test_list, material_list, traditionals_list, due_date):
	response = Course.objects.create_assignment(test_list=test_list,material_list=material_list,traditionals_list=traditionals_list, due_date=due_date, course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_get_group_list(course):
	response = Course.objects.get_group_list(course=course)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_load_course_requests(course_id):
	response = Course.objects.load_course_requests(course_id=course_id)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_check_participance(course,user):
	response = Course.objects.check_participance(course=course,user=user)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"
def course_load_announcements(course):
	response = Course.objects.load_announcements(course=course)
	if response or response==0 or response==[]:
		return "OK"
	else : return "ERROR"