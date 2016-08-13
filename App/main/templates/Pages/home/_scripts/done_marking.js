$('input:checkbox').change(
    function() {
        if ($(this).is(':checked')) {
        	id=this.closest(".card").id.split("_");
        	// console.log('course_id',id[id.length-2]);
        	// console.log('assignment_id', id[id.length-1]);
        	// console.log('traditional_id', this.id);
			var formData = new FormData();
			formData.append('course_id', id[id.length-2]);
			formData.append('assignment_id', id[id.length-1]);
			formData.append('traditional_id', this.id);
			formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
			formData.append('tasks', '{{ course.tasks }}');
       	$.ajax({
					type:"POST",
					url:"/func/set_done/",
					data: formData,
					processData: false,
					contentType: false
        });
    }
    else{
        	id=this.closest(".card").id.split("_");
			var formData = new FormData();
			formData.append('course_id', id[id.length-2]);
			formData.append('assignment_id', id[id.length-1]);
			formData.append('traditional_id', this.id);
			formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
			formData.append('tasks', '{{ course.tasks }}');
        $.ajax({
					type:"POST",
					url:"/func/set_undone/",
					data: formData,
					processData: false,
					contentType: false
        });
    };
});
