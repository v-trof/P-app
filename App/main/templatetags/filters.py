from django import template
from django.template.defaultfilters import stringfilter
from main.models import User, Course
register = template.Library()


@register.filter
def return_item(l, i):
    try:
        return l[i]
    except:
        return None

@register.filter
def get_obj(value,pk):
	obj = Course.objects.get(pk=int(value))
	return obj

@register.filter
def keyvalue(dict, key):    
    return dict[key]

@register.filter
def makelist(dict):
	dictlist=[]
	for key, value in dict.items():
	    dictlist.append(value)
	return dictlist

@register.filter
def makeuser(user_id):
	return User.objects.get(id=int(user_id))