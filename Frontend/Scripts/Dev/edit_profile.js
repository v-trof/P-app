function change_password(){
    old_password = $("#old_password").val();
    new_password = $("#new_password").val();
    $.ajax({
            type:"GET",
            url:"/func/change_password/",
            data: {
                   'old_password': old_password,
                   'new_password': new_password
                  },
            success: function(){
                  popup.hide();
                  notification.change('success','Успешно','Пароль изменен' );
               }
            });
}






function create_contact() {
    contact_type = $("#new_contact_type").val();
    contact_info = $("#new_contact_info").val();
    console.log("create_contact");
    $.ajax({
            type:"GET",
            url:"/func/create_contact/",
            data: {
                   'contact_type': contact_type,
                   'contact_info': contact_info
                  },
            success: function(){
                  popup.hide();
                  notification.change('success','Успешно','Контакт добавлен' );
                               }
            });
    add_contact("<div class='card-contacts__item'><h5>" + contact_type + "</h5><span id='"+contact_type+"'>" + contact_info + "</span></div>");
    popup.hide();
}

function add_contact(new_contact) {
    new_contact = $(new_contact);
    $("#contacts").append($(new_contact));
    $(new_contact).children("span").attr("contenteditable", "true").css('border-bottom', '1px dashed #2196F3')
}





function upload_avatar(e) {
    var file = e.target.files[0];
    var formData = new FormData();
    formData.append('new_avatar', file);
    formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
    console.log(formData);
    $.ajax({
        type:"POST",
        url:"/func/upload_avatar/",
        data: formData,
        processData: false,
		contentType: false,
        success: function(){
            notification.change('success','Успешно','Данные были успешно изменены' );
        }
    });
}





$(document).ready(function() {
    //for transitions
    $(".card-contacts__item>span").css('border-bottom', '1px dashed transparent');
    var editing = false;

    function toggle_edit() {
        if(editing) {
            $("[contenteditable]").attr("contenteditable", "false").css('border-bottom', '1px dashed transparent');
            $("#add_contact").css('transform', 'scale(0)');
            $(".card-person__avatar").css('cursor', 'default');
            if ($('#email').html())
                email=$('#email').html();
            else email=null;

            if ($('#Skype').html())
                Skype=$('#Skype').html();
            else Skype=null;

            if ($('#VK').html())
                VK=$('#VK').html();
            else VK=null;

            if ($('#Facebook').html())
                Facebook=$('#Facebook').html();
            else Facebook=null;

            if ($('#Dnevnik').html())
                Dnevnik=$('#Dnevnik').html();
            else Dnevnik=null;

            if ($('#Codeforces').html())
                Codeforces=$('#Codeforces').html();
            else Codeforces=null;
            editing = false;
                        $.ajax({
                                 type:"GET",
                                 url:"/func/change_data/",
                                 data: {
                                        'email': email,
                                        'Skype': Skype,
                                        'VK': VK,
                                        'Facebook': Facebook,
                                        'Dnevnik': Dnevnik,
                                        'Codeforces': Codeforces
                                        },
                                 success: function(){
                                     notification.change('success','Успешно','Данные были успешно изменены' );
                                 }
                            });
        } else {
            $(".card-contacts__item>span").attr("contenteditable", "true").css('border-bottom', '1px dashed #2196F3');
            $("#add_contact").css('transform', 'scale(1)');
            $(".card-person__avatar").css('cursor', 'pointer');
            $(".card-person").append(new_avatar);
            editing = true;
        }
    }

    $("#fab").click(function(e) {
        toggle_edit();
    });





    var new_avatar = $("<input hidden type='file'>"); 

    $(".card-person__avatar").bind({
        click: function(e) {
            if(editing) {
                console.log("clicked");
                new_avatar.click();
            }
        },

        mouseenter: function(e) {
            if(editing) {
                tooltip.show(this, "Изменить");
            }
        },

        mouseleave: function(e) {
            if(editing) {
                tooltip.hide();
            }
        }

    });

    new_avatar.change(function(e) {
        upload_avatar(e);
    });
    





    $("#add_contact").click(function(e) {
        function contact_types() {
            var types = ["Skype", "Codeforces", "VK", "Facebook", "Dnevnik"];
            var html = "";
            types.forEach(function(contact_type) {
                html+= "<option value='" + contact_type + "'>" + contact_type + "</option>";
            });
            return html;
        }
        popup.show("<select id='new_contact_type'>" + contact_types() + "</select><br><input type='text' id='new_contact_info'><label>Контакная информация</label><br><button class='button--ghost' id='create_contact' onclick='create_contact()' style='float:right'>Добавить</button>",
            {
                "padding-bottom": "0.3rem",
                "width": "20rem"
            }, 
            function() {
                $("#popup").children('select')[0].focus();
        });
    });






    /*$("[name='contacts_see']").change(function(e) {
        //ajax
    });*/





    $("#change-password").click(function(e) {
        popup.show("<input type='password' value='' id='old_password' pattern='.{8,}'><label>Старый пароль</label><br><input type='password' id='new_password' pattern='.{8,}'><label>Новый Пароль</label><br><button class='button--ghost' onclick='change_password()' style='float:right'>Сменить</button>",
            {
                "padding-top": "0.3rem",
                "padding-bottom": "0.3rem",
                "width": "20rem"
            },
            function() {
                $("#popup").children('input')[0].focus();
        });
    });
});