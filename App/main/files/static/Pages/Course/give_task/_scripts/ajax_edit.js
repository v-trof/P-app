function ajax_edit(data) {
    //adding ajax stuff
    data.assignment_id = task_id;
    $.ajax({
        type:"POST",
        url:"/func/edit_assignment/",
        data: data,
        success: function(response) {
            if(response && response["type"]) {
                notification.show(response["type"], response["message"]);
            }   else {
                notification.show('success','Задание измененно' );
            }
        }
    });
}
