#! /usr/bin/env python
# -*- coding: utf-8 -*-
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
			request.session['notifications']=[{"type": "error", "message": "Вы должны зайти в систему"}]
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
	context["sections"] = Course.objects.get_sections_list(course_id=course_id)
	context["sections"].append('Новая...')
	context["type"]= "material"
	return render(request, 'Pages/Material/editor/exports.html', context)


def delete(request):
	# moves material to trash bin
	if request.method == 'POST':
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",None)
		response=Material.delete(course_id=course_id, material_id=material_id)
		return HttpResponse(json.dumps(response), content_type="application/json")

def load(request):
	# loads material file
	course_id = request.GET.get("course_id",None)
	material_id = request.GET.get("material_id",None)
	material=Material.load(course_id=course_id, material_id=material_id)["material"]
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
	context["sections"] = Course.objects.get_sections_list(course_id=course_id)
	context["sections"].append('Новая...')
	context["type"]= "material"
	return render(request, 'Pages/Material/editor/exports.html', context)

def save(request):
	# saves material file
	if request.method == 'POST':
		json_file = request.POST.get("json_file",None)
		compiled_json = request.POST.get("compiled_material",None)
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",False)
		response = Material.save(json_file=json_file, course_id=course_id, material_id=material_id, user=request.user,compiled_json=compiled_json)
		return HttpResponse(json.dumps(response), content_type="application/json")


def publish(request):
	# makes material visible in course screen
	if request.method == 'POST':
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",None)
		section = json.loads(request.POST.get("publish_data"))["section"]
		response = Material.publish(course_id=course_id, material_id=material_id,section=section)
		return HttpResponse(json.dumps(response), content_type="application/json")


def unpublish(request):
	if request.method == 'POST':
		course_id = request.POST.get("course_id",None)
		material_id = request.POST.get("material_id",None)
		response = Material.unpublish(course_id=course_id, material_id=material_id)
		return HttpResponse(json.dumps(response), content_type="application/json")

def read(request):
	course_id = request.GET.get("course_id",None)
	material_id = request.GET.get("material_id",None)
	if request.user.is_anonymous():
		request.session['notifications']=[{"type": "error", "message": "Вы должны зайти в систему"}]
		return redirect('/login')
	if Utility.is_teacher(user=request.user,course_id=course_id):
		return redirect("/material/edit/?course_id="+course_id+"&material_id="+material_id)
	if Utility.is_member(user=request.user,course_id=course_id) and Material.is_published(material_id=material_id,course_id=course_id):
		context = Material.load(course_id=course_id, material_id=material_id)
		context["reading"] = True
		context["type"]= "material"
		return render(request, 'Pages/Material/read/exports.html', context)
	else:
		request.session['notifications']=[{"type": "error", "message": "Доступ ограничен"}]
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
		response = Material.upload_downloadable(
			asset=asset, course_id=course_id, material_id=material_id, path=path)
		return HttpResponse(json.dumps(response), content_type="application/json")

# embmend
def upload_embmend(request):
	if request.method == 'POST':
		asset=request.POST.get("code",None)
		course_id=request.POST.get("course_id",None)
		material_id=request.POST.get("material_id",None)
		path='main/files/media/courses/' + course_id + '/assets/' + material_id + "/"
		asset_id=Material.upload_embmend(
			path=path, asset=asset, course_id=course_id, material_id=material_id)
		return HttpResponse(asset_id)

def load_embmend(request):
	course_id=request.GET.get("course_id",None)
	material_id=request.GET.get("material_id",None)
	asset_id=request.GET.get("asset_id",None)
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
	return HttpResponse(json.dumps(response), content_type="application/json")
