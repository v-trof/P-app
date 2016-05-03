import html
import re
import io
import json

def swap(c, i, j):
	c = list(c)
	c[i], c[j] = c[j], c[i]
	return ''.join(c)

def intToRoman(integer):
    rlist = romanList = [(1000, "M"),(900, "CM"),(500, "D"),(400, "CD"),(100, "C"),(90, "XC"),(50, "L"),(40, "XL"),(10, "X"),(9, "IX"),(5, "V"),(4, "IV"),(1, "I")]
    romanResult = ""
    for wholeNumber in rlist:
            while integer >= wholeNumber[0]:
                    integer -= wholeNumber[0]
                    romanResult += wholeNumber[1]
    return romanResult

def check(answer, answer_right, allowed):
	if answer == answer_right:
		return True
	for mistake in allowed["easy"]:
		#simple replacements
		answer = forgiving[mistake](answer)
		answer_right = forgiving[mistake](answer_right)
		if answer == answer_right:
			return True

	for mistake in allowed["advanced"]:
		#high_end comparisons
		if forgiving[mistake](answer, answer_right):
			return True

	for mistake in allowed["breakpoints"]:
		#punctuation, spaces
		answer = forgiving[mistake](answer)
		answer_right = forgiving[mistake](answer_right)
		if answer == answer_right:
			return True
	#sry, but it's wrong
	return False

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

def replacements(answer, answer_right):
	answer = set(re.split('\W+', answer))
	answer_right = set(re.split('\W+', answer_right))
	# print(answer, answer_right)
	return answer == answer_right

def letters_alike(answer):
	answer = answer.replace("ё", "е")
	return answer

def single_delta(letter,right_letter):
	with io.open('delta_table.json', 'r', encoding='utf8') as info_file:
		delta_table=json.load(info_file)
		return letter in delta_table[right_letter]

def full_delta(answer, right_answer):
	k=answer
	it=0
	if len(answer)>len(right_answer):
		for letter in right_answer:
			if single_delta(answer[it].lower(),letter.lower()):
				k=k[:it] + right_answer[it] + k[it+1:]
			it+=1
	else: 
		for letter in answer:
			if single_delta(letter.lower(),right_answer[it].lower()):
				k=k[:it] + right_answer[it] + k[it+1:]
				print(k)
			it+=1
	return k

def caps(answer):
	return answer.lower()

def correctness(answer, right_answer, delta):
	it=0
	right_letters=0
	if len(answer)>len(right_answer):
		letter_coefficient=len(right_answer)/len(answer)
		for letter in right_answer:
			if letter==answer[it]:
				right_letters+=1
			elif delta:
				if single_delta(answer[it].lower(),letter.lower()):
					right_letters+=1
			it+=1
	else: 
		letter_coefficient=1
		for letter in answer:
			if letter==right_answer[it]:
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
			print(max_var)
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

def full_check(answer, right_answer, delta):
	k=answer
	if len(k)<len(right_answer):
		k=lost_chars(k,right_answer)
	#print(k)
	max=correctness(k,right_answer,delta)
	if delta:
		k=full_delta(k,right_answer)
	#print(k)
	if len(k)>len(right_answer) and correctness(cutting(k,right_answer,delta),right_answer,delta)>max:
		max=correctness(cutting(k,right_answer,delta),right_answer,delta)
		k=cutting(k,right_answer,delta)
	#print(k)
	print(correctness(k,right_answer,delta))
	print(correctness(replacement(k,right_answer,delta),right_answer,delta))
	if correctness(replacement(k,right_answer,delta),right_answer,delta)>max:
		max=correctness(replacement(k,right_answer,delta),right_answer,delta)
		k=replacement(k,right_answer,delta)
		print(k)
	#print(k)
	return k



def html_specialchars(answer):
	answer = answer.replace("&shy;","")
	answer = html.unescape(answer)
	return answer

forgiving = {
	"letters_alike": letters_alike,
	"replacements": replacements,
	"keyboard_delta": full_delta,
	"punctuation": punctuation,
	"spaces": spaces,
	"caps": caps,
	"html_specialchars": html_specialchars,
}

