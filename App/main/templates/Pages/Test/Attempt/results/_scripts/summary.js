
Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}

$(document).ready(function() {
	var results = {{results|safe}};
	var attempt = {{attempt|safe}};

	console.log(attempt, results);
	results_display.init(false, attempt, results);
});