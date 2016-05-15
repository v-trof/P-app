$(document).on('click', '[name="contacts_see"]', function () {
        lastSelected = $(this).val();
        console.log(this.id.substr(this.id.length - 1));
        $.ajax({
             type:"POST",
             url:"/func/change_permission_level/",
             data: {'csrfmiddlewaretoken': '{{ csrf_token }}',
                'permission_level':this.id.substr(this.id.length - 1),
                    },
             success: function(){
                 notification.show('success','Разрешения были успешно изменены' );
             }
        });
    });