(function() {
    'use strict';
    var SelectBox = {
        cache: {},
        init: function(id) {
            var box = document.getElementById(id);
            var node;
            SelectBox.cache[id] = [];
            var cache = SelectBox.cache[id];
            for (var i = 0, j = box.options.length; i < j; i++) {
                node = box.options[i];
                cache.push({value: node.value, text: node.text, displayed: 1});
            }
        },
        redisplay: function(id) {
            // Repopulate HTML select box from cache
            var box = document.getElementById(id);
            var node;
            $(box).empty(); // clear all options
            var new_options = box.outerHTML.slice(0, -9);  // grab just the opening tag
            var cache = SelectBox.cache[id];
            for (var i = 0, j = cache.length; i < j; i++) {
                node = cache[i];
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
            var tokens = text.toLowerCase().split(/\s+/);
            var node, token;
            var cache = SelectBox.cache[id];
            for (var i = 0, j = cache.length; i < j; i++) {
                node = cache[i];
                node.displayed = 1;
                var node_text = node.text.toLowerCase();
                var numTokens = tokens.length;
                for (var k = 0; k < numTokens; k++) {
                    token = tokens[k];
                    if (node_text.indexOf(token) === -1) {
                        node.displayed = 0;
                        break;  // Once the first token isn't found we're done
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
            var node;
            var cache = SelectBox.cache[id];
            for (var i = 0, j = cache.length; i < j; i++) {
                node = cache[i];
                if (node.value === value) {
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
            SelectBox.cache[id].sort(function(a, b) {
                a = a.text.toLowerCase();
                b = b.text.toLowerCase();
                try {
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1;
                    }
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
    };
    window.SelectBox = SelectBox;
})();
