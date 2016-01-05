var new_avatar = $("<input hidden type='file'>"); 

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
		} else {
			$(".card-contacts__item>span").attr("contenteditable", "true").css('border-bottom', '1px dashed #2196F3');
			$("#add_contact").css('transform', 'scale(1)');
			$(".card-person__avatar").css('cursor', 'pointer');
			$(".card-person").append(new_avatar);
			editing = true;
			$("[contenteditable]").bind("blur", function() {
				//ajax
			});
		}
	}

	$("#fab").click(function(e) {
		toggle_edit();
	});

	$(".card-person__avatar").click(function(e) {
		if(editing) {
			console.log("clicked");
			new_avatar.click();
		}
	});

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
	new_contact = '<div class="card-contacts__item"><h5>Сервис</h5>Ваши данные</div>';
	$("#add_contact").click(function(e) {
		$("#contacts").append($(new_contact).attr("contenteditable", "true").css('border-bottom', '1px dashed #2196F3'));
	});


	$("[name='contacts_see']").change(function(e) {
		//ajax
	});

	$("#change-password").click(function(e) {
		popup.show("Старый пароль<br><input type='password' name='old_password'><br>Новый Пароль<br><input type='password' name='new_password'>", {}, function() {
			$("#popup").children('input')[0].focus();
		});
	});
});