from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context
from main.models import *
from main.python.other import transliterate
# from django.core.servers.basehttp import FileWrapper
import os
import json
import io


def edit(request):
	# switch for create\load material, launches material editor anyway
	if request.GET['course_id']:
		course_id=request.GET['course_id']
		if request.user.is_anonymous():
			return redirect('/login')
		if not Utility.is_teacher(user=request.user,course_id=course_id):
			return redirect('/course/'+course_id)
		if "material_id" in request.GET:
			return load(request)
		else:
			return create(request)
	else:
		return redirect('/')


def create(request):
	# creates material environment (no material exists as file untill saved)
	course_id = request.GET.get("course_id",None)
	context = Material.create(course_id=course_id)
	context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		}, {
			"href": "#",
			"link": "Новый материал"
		}]
	context["sections"] = Course.objects.get_sections(course_id=course_id,material=True)
	context["type"]= "material"
	return render(request, 'Pages/Material/editor/exports.html', context)


def delete(request):
	# moves material to trash bin
	course_id = request.POST.get("course_id",None)
	material_id = request.POST.get("material_id",None)
	Material.delete(course_id=course_id, material_id=material_id)
	return HttpResponse("Материал удален")


def save(request):
	# saves material file
	if request.method == 'POST':
		json_file = request.POST.get("json_file",None)
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",None)
		Material.save(json_file=json_file, course_id=course_id, material_id=material_id, user=request.user)
	return HttpResponse("Материал сохранен")


def load(request):
	# loads material file
	course_id = request.GET.get("course_id",None)
	material_id = request.GET.get("material_id",None)
	material=Material.load(course_id=course_id, material_id=material_id)
	context={}
	context["material"]=material
	context["material"]["id"]=material_id
	context["course"]=Course.objects.get(id=course_id)
	context["breadcrumbs"] = [{
			"href": "/course/" + str(course_id),
			"link": Course.objects.get(id=course_id).name
		}, {
			"href": "#",
			"link": material["json"]["title"]
		}]
	context["sections"] = Course.objects.get_sections(course_id=course_id)
	context["type"]= "material"
	context["read"]= True
	return render(request, 'Pages/Material/editor/exports.html', context)


def publish(request):
	# makes material visible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",None)
		section = request.POST.get("section","Нераспределенные")
		allowed_mistakes=[]
		mark_setting={}
		for setting in request.POST:
			if setting.startswith('min_for'):
				if request.POST[setting]!='':
					mark_setting[setting[-1]]=int(request.POST[setting])
				else: mark_setting[setting[-1]]=101
			elif setting.startswith('autocorrect_'):
				if request.POST[setting]=="true":
					allowed_mistakes.append(setting[12:])
		Material.publish(course_id=course_id, material_id=material_id,section=section)
	return HttpResponse("Материал опубликован")


def unpublish(request):
	course_id = request.POST.get("course_id",None)
	material_id = request.POST.get("material_id",None)
	Material.unpublish(course_id=course_id, material_id=material_id)
	return HttpResponse("Тест скрыт")


def share(request):
	pass

def read(request):
	course_id = request.GET.get("course_id",None)
	material_id = request.GET.get("material_id",None)
	if request.user.is_anonymous():
		return redirect('/login')
	if Material.is_creator(user=request.user,material_id=material_id,course_id=course_id):
		return redirect("/material/edit/?course_id="+course_id+"&material_id="+material_id)
	if Utility.is_member(user=request.user,material_id=material_id,course_id=course_id):
		context = Material.read(user=request.user,course_id=course_id, material_id=material_id)
		context["reading"] = True
		context["type"]= "material"
		return render(request, 'Pages/Material/Read/main/exports.html', context)
	else:
		return redirect('/')

def upload_asset(request):
	if request.method == 'POST':
		asset=request.FILES.get("asset",None)
		course_id=request.POST.get("course_id",None)
		material_id=request.POST.get("material_id",None)
		path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
		filename=Material.upload_asset(
		    asset=asset, course_id=course_id, material_id=material_id, path=path)
		return HttpResponse(filename)

def upload_asset_by_url(request):
	if request.method == 'POST':
		asset_url=request.POST.get("asset_url",None)
		course_id=request.POST.get("course_id",None)
		material_id=request.POST.get("material_id",None)
		path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
		filepath=Material.upload_asset_by_url(asset_url=asset_url, course_id=course_id, material_id=material_id, path=path)
		return HttpResponse(filepath)

def upload_downloadable(request):
	if request.method == 'POST':
		asset=request.FILES.get("asset",None)
		course_id=request.POST.get("course_id",None)
		material_id=request.POST.get("material_id",None)
		path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
		Material.upload_downloadable(
		    asset=asset, course_id=course_id, material_id=material_id, path=path)
	return HttpResponse("ok")

# embmend
def upload_embmend(request):
	if request.method == 'POST':
		asset=request.POST["code"]
		course_id=request.POST["course_id"]
		material_id=request.POST["material_id"]
		path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
		asset_id=Material.upload_embmend(
		    path=path, asset=asset, course_id=course_id, material_id=material_id)
		return HttpResponse(asset_id)

def load_embmend(request):
	course_id=request.GET["course_id"]
	material_id=request.GET["material_id"]
	asset_id=request.GET["asset_id"]
	path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
	f=open(path + asset_id + ".html", 'r')
	asset=f.read()
	return HttpResponse(asset)

def load_asset_file(request, course_id, material_id, asset_name):
	path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
	f=open(path + asset_name, 'r')
	asset=f.read()
	response=HttpResponse(FileWrapper(asset.getvalue()),
	                      content_type='application/zip')
	response['Content-Disposition']='attachment; filename=myfile.zip'
	return response
