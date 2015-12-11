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
    year = value.split(".")[2]
    return day + " " + month + " " + year

def of(value, max_value):
    percent = round((int(value)/max_value)*100)
    return str(percent)+"%<span>("+str(value)+" из "+str(max_value)+")</span>";

register.filter('of', of)
register.filter('humanize_date', humanize_date)