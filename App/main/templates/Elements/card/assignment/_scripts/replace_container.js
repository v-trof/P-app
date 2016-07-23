$(document).ready(function() {
	//let other modules startup
	setTimeout(function() {
		$('.card.--assignment').each(function() {
	        $parent = $(this).parent()
	        if($parent.is('div.--card')) {
	            $parent.replaceTag('a');
	        }
	    });
	}, 100);
    
});