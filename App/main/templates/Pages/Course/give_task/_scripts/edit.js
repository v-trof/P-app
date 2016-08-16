var False = false;

{% if task %}
    var loaded_assignment = {{task|safe}};
{% endif %}

$(document).ready(function() {
    if(typeof loaded_assignment === 'undefined') return;

    var make_card_small = function(text) {
       var $new_card = $('{% include "Elements/card/exports.html" %}');
       $new_card.addClass('m--small');
       $new_card.html(text);
       return $new_card;
    };
    
    //fills due_date
    $('#due_date').val(loaded_assignment.due_date);

    //fills traditionals
    loaded_assignment.content.traditionals.forEach(function(task) {
        $('#assignment--new__add_traditional').before(
            make_card_small(task.text)
        );
    });

    //fills group names
    $('[name="group_choose"]').attr('checked', false);

    loaded_assignment.group_list.forEach(function(group_name) {
        $('[name="group_choose"][value="' + group_name + '"]').prop('checked', true);
    });

    //fills tests | materials
    var load_item = function(item) {
        used_links.push( item.link );
        var $new_item = make_card_small(item.title);
        $new_item.attr('href', item.link);
        return $new_item;
    }

    //tests
    loaded_assignment.content.tests.forEach(function(item) {
        $('#assignment--new__add_test').before(
            load_item(item)
        )
    });

    //materials
    loaded_assignment.content.materials.forEach(function(item) {
        $('#assignment--new__add_material').before(
            load_item(item)
        )
    });
})
