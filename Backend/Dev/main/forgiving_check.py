import html
import re

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

def keyboard_delta(answer, answer_right):
	pass

def caps(answer):
	return answer.lower()

def html_specialchars(answer):
	answer = answer.replace("&shy;","")
	answer = html.unescape(answer)
	return answer

forgiving = {
	"letters_alike": letters_alike,
	"replacements": replacements,
	"keyboard_delta": keyboard_delta,
	"punctuation": punctuation,
	"spaces": spaces,
	"caps": caps,
	"html_specialchars": html_specialchars,
}

print(check("a&nbsp;3", "a 3", {
	"easy": ["caps", "letters_alike", "html_specialchars"],
	"advanced": ["replacements"],
	"breakpoints": ["punctuation", "spaces"]
	}))