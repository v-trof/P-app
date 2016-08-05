#! /usr/bin/env python
# -*- coding: utf-8 -*-
def ru_en(string):
    table1 = ["абвгдеёзийклмнопрстуфхъыьэАБВГДЕЁЗИЙКЛМНОПРСТУФХЪЫЬЭ","abvgdeezijklmnoprstufh'y'eABVGDEEZIJKLMNOPRSTUFH'Y'E"]
    table2 = {'ж':'zh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ю':'ju','я':'ja','Ж':'Zh','Ц':'Ts','Ч':'Ch'}
    for k in table2.keys():
        string = string.replace(k, table2[k])
    return string.translate({ord(x): y for (x, y) in zip(table1[0], table1[1])})