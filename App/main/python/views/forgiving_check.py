#! /usr/bin/env python
# -*- coding: utf-8 -*-
import html
import re
import io
import json

def swap(c, i, j):
	c = list(c)
	c[i], c[j] = c[j], c[i]
	return ''.join(c)

def numbers(answer):
	rlist = romanList = [(1000, "M"),(900, "CM"),(500, "D"),(400, "CD"),(100, "C"),(90, "XC"),(50, "L"),(40, "XL"),(10, "X"),(9, "IX"),(5, "V"),(4, "IV"),(1, "I")]
	romanResult = ""
	num_string=""
	for char in answer:
		if char.isdigit():
			num_string+=char
		elif num_string!="":
			integer=int(num_string)
			for wholeNumber in rlist:
				while integer >= wholeNumber[0]:
					integer -= wholeNumber[0]
					romanResult += wholeNumber[1]
			num_string=""
	if num_string.isdigit():
		integer=int(num_string)
		for wholeNumber in rlist:
			while integer >= wholeNumber[0]:
				integer -= wholeNumber[0]
				romanResult += wholeNumber[1]
	return romanResult

def check(answer, answer_right, allowed):
	print(answer,answer_right)
	if answer == answer_right:
		return "right"
	if "word_order" in allowed:
		if forgiving["word_order"](answer=answer,answer_right=answer_right):
			return "forgiving"
	#print(allowed)
	for mistake in allowed:
		prev_answer=answer
		print(mistake)
		#simple replacements
		if mistake != "word_order":
			if mistake == "typo":
				print(mistake, forgiving[mistake](answer=answer,answer_right=answer_right))
				answer = forgiving[mistake](answer=answer,answer_right=answer_right)
				if answer == answer_right:
					return "forgiving"
			elif mistake == "numbers":
				if forgiving[mistake](answer=answer) == answer_right:
					return "forgiving"
			else:
				answer = forgiving[mistake](answer=answer)
				answer_right = forgiving[mistake](answer=answer_right)
				if answer == answer_right:
					return "forgiving"
	return "false"

def check_selected(answer, answer_right, allowed):
	print(answer,answer_right)
	if answer == answer_right:
		return "right"
	else: return "false"

def spaces(answer):
	answer = answer.replace(" ", "")
	return answer

def roman_nums(answer):
	# answer_map = ""
	# 	chunk = intToRoman(chunk)
	# answer
	return answer

def punctuation(answer):
	answer = answer.replace(".", "")
	answer = answer.replace(",", "")
	answer = answer.replace("-", "")
	return answer

def word_order(answer, answer_right):
	answer = set(re.split('\W+', answer))
	answer_right = set(re.split('\W+', answer_right))
	return answer==answer_right

def e(answer):
	answer = answer.replace("ё", "е")
	return answer

def single_delta(letter,right_letter):
	if not right_letter == " ":
		with io.open('main/python/other/delta_table.json', 'r', encoding='utf8') as info_file:
			delta_table=json.load(info_file)
			return letter in delta_table[right_letter]
	else: return True

def full_delta(answer, answer_right):
	k=answer
	it=0
	if len(answer)>len(answer_right):
		for letter in answer_right:
			if single_delta(answer[it].lower(),letter.lower()):
				k=k[:it] + answer_right[it] + k[it+1:]
			it+=1
	else: 
		for letter in answer:
			if single_delta(letter.lower(),answer_right[it].lower()):
				k=k[:it] + answer_right[it] + k[it+1:]
			it+=1
	if common_chars_percentage(answer,k) < 65:
		return answer
	return k

def register(answer):
	return answer.lower()

def correctness(answer, answer_right, delta=True):
	it=0
	right_letters=0
	if len(answer)>len(answer_right):
		letter_coefficient=len(answer_right)/len(answer)
		for letter in answer_right:
			if letter==answer[it]:
				right_letters+=1
			elif delta:
				if single_delta(answer[it].lower(),letter.lower()):
					right_letters+=1
			it+=1
	else: 
		letter_coefficient=1
		for letter in answer:
			if letter==answer_right[it]:
				right_letters+=1
			elif delta:
				if single_delta(letter.lower(),right_answer[it].lower()):
					right_letters+=1
			it+=1
	percentage=right_letters/len(right_answer)*letter_coefficient
	return percentage

def lost_chars(answer,right_answer):
	it=0
	k=answer
	max_var=k
	delta=False
	max=correctness(k,right_answer,delta)
	for char in answer:
		it+=1
		k=k[:it] + '_' + k[it:]
		if correctness(k,right_answer,delta)>=max:
			max=correctness(k,right_answer,delta)
			max_var=k
		k=answer
	return max_var

def replacement(answer,right_answer,delta):
	it=1
	k=answer
	max=correctness(answer,right_answer,delta)
	swap_streak=False
	for letter in answer:
		prev_string=k
		k=swap(k,it-1,it)
		if correctness(k,right_answer,delta)>max and not swap_streak:
			swap_streak=True
			max=correctness(k,right_answer,delta)
		else:
			k=prev_string
			swap_strak=False
		it+=1
		if it>=len(answer):
			break
	return k
	
def cutting(answer, right_answer, delta):
	it=-1
	miss_streak=False
	k=answer
	max=correctness(k,right_answer,delta)
	for letter in answer:
		prev_string=k
		it+=1
		k=k[:it] + k[it+1:]
		if correctness(k,right_answer,delta)>=max and not miss_streak:
			miss_streak=True
			max=correctness(k,right_answer,delta)
			k=full_delta(k,right_answer)
		else: 
			k=prev_string
			miss_streak=False
		if correctness(replacement(k,right_answer,delta),right_answer,delta)>max:
			max=correctness(replacement(k,right_answer,delta),right_answer,delta)
			k=replacement(k,right_answer,delta)
	return k

def typo(answer, right_answer, delta):
	k=answer
	if len(k)<len(right_answer):
		k=lost_chars(k,right_answer)
	max=correctness(k,right_answer,delta)
	if delta:
		k=full_delta(k,right_answer)
	if len(k)>len(right_answer) and correctness(cutting(k,right_answer,delta),right_answer,delta)>max:
		max=correctness(cutting(k,right_answer,delta),right_answer,delta)
		k=cutting(k,right_answer,delta)
	if correctness(replacement(k,right_answer,delta),right_answer,delta)>max:
		max=correctness(replacement(k,right_answer,delta),right_answer,delta)
		k=replacement(k,right_answer,delta)
	print("1")
	if common_chars_percentage(answer,k) > 35:
		return answer
	return k


def common_chars_percentage(first_string,second_string):
	common_chars=0
	it=0
	if len(first_string) < len(second_string):
		for char in first_string:
			if char==second_string[it]:
				common_chars+=1
			it+=1
		percentage=common_chars/len(second_string)*100
	else:
		for char in second_string:
			if char==first_string[it]:
				common_chars+=1
			it+=1
		percentage=common_chars/len(first_string)*100
	print("2",percentage)
	return percentage

def html_specialchars(answer):
	answer = answer.replace("&shy;","")
	answer = html.unescape(answer)
	return answer

forgiving = {
	"e": e,
	"word_order": word_order,
	"keyboard_delta": full_delta,
	"punctuation": punctuation,
	"spaces": spaces,
	"register": register,
	"html_specialchars": html_specialchars,
	"typo":full_delta,
	"numbers":numbers
}

