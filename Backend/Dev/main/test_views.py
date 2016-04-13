from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from .models import User, Course
from . import transliterate
# from django.core.servers.basehttp import FileWrapper
import os
import json
import io

def edit(request):
	#switch for create\load test, lauches test editor anyway
	if "test_id" in request.GET:
		return load(request)
	else:
		return create(request)




def create(request):
	#creates test environment (no test exists as file untill saved)
	course_id =request.GET["course_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as data_file:
		course_info = json.load(data_file)
		test_id = str(course_info['tests']['amount']+1)
	course = {"id": course_id}
	test = {"id": test_id, "loaded": 0}
	context =  {"test": test, "course": course}
	context["breadcrumbs"] =[{
			"href" : "/course/"+str(course_id),
			"link" : Course.objects.get(id=course_id).name
		},{
			"href" : "#",
			"link" : "Новый тест"
		}]

	return render(request, 'Pages/test_editor.html', context)

def delete(request):
	#moves test to trash bin
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)

		if test_id in course_info['tests']['published']:
			course_info['tests']['published'].remove(test_id)

		if test_id in course_info['tests']['unpublished']:
			course_info['tests']['unpublished'].remove(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:

		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест удален")



def save(request):
	#saves test file
	print("save")
	if request.method == 'POST':
		json_file = request.POST["json_file"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		json_file_path = 'courses/'+course_id+'/Tests/'+test_id+'.json'
		if not os.path.isfile(json_file_path):
			with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
				course_info = json.load(info_file)
				course_info['tests']['amount']+=1
				course_info['tests']['unpublished'].append(test_id)
				test_id = str(course_info['tests']['amount'])

			with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
				info_file.write(json.dumps(course_info, ensure_ascii=False))

		with io.open(json_file_path, 'w', encoding='utf8') as test_file:
			test_file.write(json_file)
	return HttpResponse("Тест сохранен")

def load(request):
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	with io.open('courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:

		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)

		course = {"id": course_id}
		test = {
			"id": test_id,
			"loaded": 1,
			"json": json.load(json_file),
			"published" : test_id in course_info["tests"]["published"]
		}
	context =  {"test": test, "course": course}
	context["breadcrumbs"] =[{
			"href" : "/course/"+str(course_id),
			"link" : Course.objects.get(id=course_id).name
		},{
			"href" : "#",
			"link" : test["json"]["title"]
		}]
	return render(request, 'Pages/test_editor.html', context)



def publish(request):
	#makes test visible in course screen
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)

	if test_id in course_info['tests']['unpublished']:
		course_info['tests']['unpublished'].remove(test_id)

	course_info['tests']['published'].append(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест опубликован")

def unpublish(request):
	#makes test invisible in course screen
	course_id =request.POST["course_id"]
	test_id =request.POST["test_id"]
	with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
		course_info = json.load(info_file)
	if test_id in course_info['tests']['published']:
		course_info['tests']['published'].remove(test_id)

	course_info['tests']['unpublished'].append(test_id)

	with io.open('courses/'+course_id+'/info.json', 'w+', encoding='utf8') as info_file:
		info_file.write(json.dumps(course_info, ensure_ascii=False))

	return HttpResponse("Тест скрыт")

def share(request):
	#make test avalible in package_catalog
	pass

def attempt(request):
	#creates or continues attempt
	#loads test file
	course_id =request.GET["course_id"]
	test_id =  request.GET["test_id"]
	with io.open('courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as json_file:
		with io.open('courses/'+course_id+'/info.json', 'r', encoding='utf8') as info_file:
			course_info = json.load(info_file)
			course = {"id": course_id}
			test = {
				"id": test_id,
				"loaded": 1,
				"json": json.load(json_file),
				"published" : test_id in course_info["tests"]["published"]
			}
			context =  {"test": test, "course": course}
			context["breadcrumbs"] =[{
					"href" : "/course/"+str(course_id),
					"link" : Course.objects.get(id=course_id).name
				},{
					"href" : "#",
					"link" : test["json"]["title"]
				}]
	if not os.path.exists('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'):
		os.makedirs('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/')
	if not os.path.exists('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/results/'):
		os.makedirs('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/results/')
	if os.path.exists('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json'):
		with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
	with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
		test={}
		test["tasks"]=[]
		with io.open('courses/'+course_id+'/tests/'+test_id+'.json', 'r', encoding='utf8') as info_file:
			test_info=json.load(info_file)
			for question in test_info["tasks"]:
				user_question=[]
				for item in question["answer_items"]:
					value=check_question(request,item)
					user_question.append(value)
				test["tasks"].append(user_question)
		data = json.dumps(test, ensure_ascii=False)
		json_file.write(data)

	return render(request, 'Pages/test_attempt.html', context)



def check_question(request,item):
	value={}
	type=item["class"]
	if type=="text-answer":
		value["label"] = item["value"]["label"]
		value["answer"] = item["value"]["answer"]
		value["user_answer"] = None
	elif type=="textarea":
		pass
		#textarea
	elif type=="select-answer":
		value["options"] = []
		value["options"] = item["value"]["values"]
		value["answer"] = item["value"]["answer"]
		value["user_answer"] = None
	elif type=="radio-answer":
		value["options"] = []
		value["options"] = item["value"]["values"]
		value["answer"] = item["value"]["answer"]
		value["user_answer"] = None
	elif type=="checkbox-answer":
		value["options"] = []
		value["options"] = item["value"]["values"]
		value["answer"] = item["value"]["answers"]
		value["user_answer"] = None
	return value

def attempt_save(request):
	if request.method == 'POST':
		test_id=request.POST.get("test_id")
		question_id=int(request.POST.get("question"))
		task_id=int(request.POST.get("task_number"))-1
		course_id=request.POST.get("course_id")
		answer=request.POST.get("answer",None)
		with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)

		with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'w', encoding='utf8') as json_file:
			data["tasks"][task_id][question_id]["user_answer"]=answer
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return HttpResponse("ok")

def attempt_check(request):
	if request.method == 'POST':
		test_id=request.POST.get("test_id")
		course_id=request.POST.get("course_id")
		right=0
		missed=0
		mistakes=0
		test_results={}
		test_results["test_id"]=test_id
		test_results["right"]=[]
		test_results["mistakes"]=[]
		test_results["missed"]=[]
		test_results["unseen_by"]=[]
		with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+test_id+'.json', 'r', encoding='utf8') as json_file:
			data=json.load(json_file)
			it=-1
			for task in data["tasks"]:
				it+=1
				test_results["right"].append(it)
				test_results["right"][it]=[]
				test_results["missed"].append(it)
				test_results["missed"][it]=[]
				test_results["mistakes"].append(it)
				test_results["mistakes"][it]=[]
				counter=-1
				for question in task:
					counter+=1
					if question["user_answer"] == None:
						missed+=1
						test_results["missed"][it].append(counter)
					elif check_correctness(question["user_answer"],question["answer"]):
						right+=1
						test_results["right"][it].append(counter)
					else: 
						mistakes+=1
						test_results["mistakes"][it].append(counter)
		with io.open('courses/' + str(course_id) + '/info.json', 'r', encoding='utf8') as data_file:
			data=json.load(data_file)
			for key in data["teachers"].keys():
				test_results["unseen_by"].append(key)
		test_results["mark"]=give_mark(request,right/(right+mistakes+missed)*100, course_id, test_id)
		test_results["mark_quality"]=set_mark_quality(test_results["mark"])
		with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/tests/results/'+test_id+'.json', 'w+', encoding='utf8') as json_file:
			data=test_results
			saving_data = json.dumps(data, ensure_ascii=False)
			json_file.write(saving_data)
		return HttpResponse("ok")

def give_mark(request, percentage, course_id, test_id):
	with io.open('courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
		test_info=json.load(info_file)
	if percentage>=test_info["mark_setting"]["5"]:
		mark="5"
	elif percentage >=test_info["mark_setting"]["4"]:
		mark="4"
	elif percentage >=test_info["mark_setting"]["3"]:
		mark="3"
	else:mark="2"
	return mark

def set_mark_quality(mark):
	if mark == "4" or mark=="5":
		return "good"
	elif mark == "3":
		return "medium"
	else: return "bad"
	return mark_quality

def check_correctness(user_version, ideal_version):
	if user_version == ideal_version:
		return True
	else: return False

def get_results(request, course_id, test_id):
	with io.open('courses/'+str(course_id)+'/users/'+str(request.user.id)+'/tests/results/'+test_id+'.json', 'r', encoding='utf8') as info_file:
		test_info=json.load(info_file)
	return test_info

def get_test_info(request, course_id, test_id):
	with io.open('courses/'+str(course_id)+'/tests/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
		test_info=json.load(info_file)
	return test_info

def get_attempt_info(request, course_id, test_id):
	with io.open('courses/'+course_id+'/users/'+str(request.user.id)+'/tests/attempts/'+str(test_id)+'.json', 'r', encoding='utf8') as info_file:
		test_info=json.load(info_file)
	return test_info

def upload_asset(request):
	if request.method == 'POST':
		asset = request.FILES["asset"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)
		filename = transliterate.ru_en(asset.name)
		with open(path+filename, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse(filename)

def upload_downloadable(request):
	if request.method == 'POST':
		asset = request.FILES["asset"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)
		
		with open(path+asset.name, 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse("ok")

#embmend
def upload_embmend(request):
	if request.method == 'POST':
		asset = request.POST["code"]
		course_id = request.POST["course_id"]
		test_id = request.POST["test_id"]
		path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
		
		if not os.path.exists(path):
			os.makedirs(path)

		asset_id=1
		list_dir = os.listdir(path)
		for file in list_dir:
			if file.endswith(".html"):
				asset_id += 1

		with open(path+asset_id+".html", 'wb+') as destination:
			for chunk in asset.chunks():
				destination.write(chunk)
	return HttpResponse(asset_id)

def load_embmend(request):
	course_id =request.GET["course_id"]
	test_id =request.GET["test_id"]
	asset_id =request.GET["asset_id"]
	path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
	f = open(path+asset_id+".html", 'r')
	asset = f.read()
	return HttpResponse(asset)

def load_asset_file(request, course_id, test_id, asset_name):
	path = 'main/files/media/courses/'+course_id+'/assets/'+test_id+"/"
	f = open(path+asset_name, 'r')
	asset = f.read()
	response = HttpResponse(FileWrapper(asset.getvalue()), content_type='application/zip')
	response['Content-Disposition'] = 'attachment; filename=myfile.zip'
	return response