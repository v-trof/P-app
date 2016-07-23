function ajax_edit(data) {
    //adding ajax stuff
    data.assignment_id = task_id;
    $.ajax({
        type:"POST",
        url:"/func/edit_assignment/",
        data: data,
        success: function() {
            notification.show('success','Задание измененно' );
        }
    });
}