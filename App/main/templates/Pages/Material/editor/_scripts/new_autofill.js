$(document).ready(function() {
	setTimeout(function() {
		var material_content = $(document).find(".preview .__content");
		if(material_content.children().length == 0) {
			var $starter_element = $('<div class="--empty">Добавьте сюда что-нибудь</div>');
			
			pull_put.put_zone.add($starter_element, function(e, $element, $pulled) {
				$element.replaceWith($pulled);
				add_pullers($pulled);
				pull_put.reset();
			});

			material_content.append($starter_element);
		}
	}, 100);
});