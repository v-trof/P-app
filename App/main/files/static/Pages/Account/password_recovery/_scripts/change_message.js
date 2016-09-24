function change_message (email) {
  $(".initial").hide();
  $(".end").show();
  $(".end .email").text(email);
}

function reset() {
  var email = $(".end .email").text();
  $(".end").hide();
  $(".initial").show();
  $(".initial .__value").val(email);
}

$(document).ready(function() {
  $(".reset").css('margin-top', '16px').click(reset);
  $(".end").hide();
});
