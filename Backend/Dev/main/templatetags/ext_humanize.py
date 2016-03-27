from django import template

register = template.Library()

def humanize_date(value):
    """Converts date to humanlike format"""
    month_sting = {
    1 : "января",
    2 : "февраля",
    3 : "марта",
    4 : "апреля",
    5 : "мая",
    6 : "июня",
    7 : "июля",
    8 : "августа",
    9 : "сентября",
    10 : "октября",
    11 : "ноября",
    12 : "декабря"
    }
    day = value.split(".")[0]
    month = month_sting[int(value.split(".")[1])]
    if len(value.split(".")) > 2:
        year = value.split(".")[2]
    return day + " " + month + " " + year

def of(value, max_value):
    percent = round((int(value)/max_value)*100)
    return str(percent)+"%<span>("+str(value)+" из "+str(max_value)+")</span>";


def form_for_num(num, forms):
    forms = forms.split(" ")
    
    belongs_1 = forms[0]
    belongs_2_4 = forms[1]
    many = forms[2]

    form = ""
    if num == 0:
        return many+" нет"
    elif num < 10 or str(num)[-2] != "1":
        if num%10 == 0:
            form = many
        elif num%10 == 1:
            form = belongs_1
        elif num%10 <= 4:
            form = belongs_2_4
        else:
            form = many
    else:
        form = many
    return str(num) + " " + form
register.filter('of', of)
register.filter('humanize_date', humanize_date)
register.filter('form_for_num', form_for_num)