pull_put.put_zone=function(){var u={add:function(u,t,l){u=$(u).first(),u.addClass("m--put-zone"),u.click(function(u){if(pull_put.is_pulled&&!pull_put.ui.$.find($(this))[0]){var p=$(this);pull_put.pre_actions.put(p,pull_put.ui.element),t(u,p,pull_put.ui.element),l&&l(p)}})}};return u}();