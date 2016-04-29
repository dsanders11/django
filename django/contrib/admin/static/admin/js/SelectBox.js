var SelectBox = {
    cache: new Object(),
    init: function(id) {
        var box = document.getElementById(id);
        var node;
        SelectBox.cache[id] = new Array();
        var cache = SelectBox.cache[id];
        for (var i = 0; (node = box.options[i]); i++) {
            cache.push({value: node.value, text: node.text, displayed: 1});
        }
    },
    redisplay: function(id) {
        // Repopulate HTML select box from cache
        var box = document.getElementById(id);
        box.innerHTML = "";
        var new_options = box.outerHTML.slice(0, -9);
        for (var i = 0, j = SelectBox.cache[id].length; i < j; i++) {
            var node = SelectBox.cache[id][i];
            if (node.displayed) {
                var new_option = new Option(node.text, node.value, false, false);
                // Shows a tooltip when hovering over the option
                new_option.setAttribute("title", node.text);
                new_options += new_option.outerHTML;
            }
        }
        box.outerHTML = new_options;
    },
    filter: function(id, text) {
        // Redisplay the HTML select box, displaying only the choices containing ALL
        // the words in text. (It's an AND search.)
        var cache = SelectBox.cache[id];
        var tokens = text.toLowerCase().split(/\s+/);
        var node, token;
        for (var i = 0; (node = cache[i]); i++) {
            var node_text = node.text.toLowerCase();
            node.displayed = 1;

            for (var j = 0; (token = tokens[j]); j++) {
                if (node_text.indexOf(token) == -1) {
                    node.displayed = 0;
                    break;
                }
            }
        }
        SelectBox.redisplay(id);
    },
    delete_from_cache: function(id, value) {
        var node, delete_index = null;
        var cache = SelectBox.cache[id];
        for (var i = 0, j = cache.length; i < j; i++) {
            node = cache[i];
            if (node.value === value) {
                delete_index = i;
                break;
            }
        }
        cache.splice(delete_index, 1);
    },
    add_to_cache: function(id, option) {
        SelectBox.cache[id].push({value: option.value, text: option.text, displayed: 1});
    },
    cache_contains: function(id, value) {
        // Check if an item is contained in the cache
        var cache = SelectBox.cache[id];
        var node;
        for (var i = 0; (node = cache[i]); i++) {
            if (node.value == value) {
                return true;
            }
        }
        return false;
    },
    move: function(from, to) {
        $('#' + from + ' option:selected').each(function(idx, option) {
            var value = option.value;

            if (SelectBox.cache_contains(from, value)) {
                SelectBox.add_to_cache(to, {value: value, text: option.text, displayed: 1});
                SelectBox.delete_from_cache(from, value);
            }
        });
        SelectBox.redisplay(from);
        SelectBox.redisplay(to);
    },
    move_all: function(from, to) {
        $('#' + from + ' option').each(function(idx, option) {
            var value = option.value;

            if (SelectBox.cache_contains(from, value)) {
                SelectBox.add_to_cache(to, {value: value, text: option.text, displayed: 1});
                SelectBox.delete_from_cache(from, value);
            }
        });
        SelectBox.redisplay(from);
        SelectBox.redisplay(to);
    },
    sort: function(id) {
        SelectBox.cache[id].sort( function(a, b) {
            a = a.text.toLowerCase();
            b = b.text.toLowerCase();
            try {
                if (a > b) return 1;
                if (a < b) return -1;
            }
            catch (e) {
                // silently fail on IE 'unknown' exception
            }
            return 0;
        } );
    },
    select_all: function(id) {
        $('#' + id + ' option').prop('selected', 'selected');
    }
}
