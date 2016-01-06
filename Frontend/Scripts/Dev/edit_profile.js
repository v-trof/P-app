function change_password(){
	old_password = $("#old_password").val();
	new_password = $("#new_password").val();
	//ajax
	popup.hide();//on success
}






function create_contact() {
	contact_type = $("#new_contact_type").val();
	contact_info = $("#new_contact_info").val();

	add_contact("<div class='card-contacts__item'><h5>" + contact_type + "</h5><span>" + contact_info + "</span></div>");
	popup.hide();
}

function add_contact(new_contact) {
	new_contact = $(new_contact);
	$("#contacts").append($(new_contact));
	$(new_contact).children("span").attr("contenteditable", "true").css('border-bottom', '1px dashed #2196F3')
}





function upload_avatar(e) {
	var file = e.target.files[0];
	var reader = new FileReader();
	console.log(file, reader);
	reader.readAsText(file, 'UTF-8');
	reader.onload = function(e) {
		var result = e.target.result;
		console.log(result);
		$.post('УРЛ ЗАГРУЗКИ', {file: result});
	}
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
			editing = false;
			//ajax
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
			var types = ["Skype", "Codefrces", "VK", "Facebook", "Dnevnik.ru"];
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
		popup.show("<input type='password' name='old_password' pattern='.{8,}'><label>Старый пароль</label><br><input type='password' name='new_password' pattern='.{8,}'><label>Новый Пароль</label><br><button class='button--ghost' onclick='change_password()' style='float:right'>Сменить</button>",
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