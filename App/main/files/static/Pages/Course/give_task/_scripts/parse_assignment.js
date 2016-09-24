function parse_assignment() {
    var res = {
        material_list: [],
        test_list: [],
        traditionals_list: [],
        group_list: [],
        due_date: ""
    }
    var task;

    $("#assignment--new__materials .card.m--small").each(function(index, el) {
        task={};

        task.link=$(this).attr('href');
        task.title=$(this).html();
        res.material_list.push(task);
    });
    $("#assignment--new__tests .card.m--small").each(function(index, el) {
        task={};

        task.link=$(this).attr('href');
        task.title=$(this).html();
        task.done=false;
        res.test_list.push(task);
    });
    $("#assignment--new__traditional .card.m--small").each(function(index, el) {
        task={};

        task.done=false;
        task.text=$(this).html();
        res.traditionals_list.push(task);
    });

    res.due_date=$("#due_date").val();

    $('[name="group_choose"]').each(function(index, el) {
        if( $(this).is(":checked") ) {
            res.group_list.push($(this).val());
        }    
    });

    for(key in res) {
        if(typeof res[key] !== 'string') {
            res[key] = JSON.stringify(res[key]);
        }
    }

    return res;
}


