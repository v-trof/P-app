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