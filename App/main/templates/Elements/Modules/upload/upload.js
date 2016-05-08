function upload(formData, url, success) {
    formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
    
    if(typeof success === "undefined") {
        success = "Выполнено";
    }

    $.ajax({
        type:"POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: function(){
            notification.show('success', success);
        },
        error: function(){
            notification.show('error', "Произошла ошибка");
        },
    });
}