var humanize = {
	date : function(date){
		function month_sting(month_num){
			switch(month_num){
				case(1):
					return "января"
				case(2):
					return "февраля"
				case(3):
					return "марта"
				case(4):
					return "апреля"
				case(5):
					return "мая"
				case(6):
					return "июня"
				case(7):
					return "июля"
				case(8):
					return "августа"
				case(9):
					return "сентября"
				case(10):
					return "октября"
				case(11):
					return "ноября"
				case(12):
					return "декабря"
			}
		}
		parsed = {
			day : date.split(".")[0],
			month : month_sting(parseInt(date.split(".")[1])),
			year : date.split(".")[2]
		}
		return parsed.day + " " + parsed.month + " " + parsed.year;
	}
}