!function($){"use strict";$(document).ready(function(){
        function wcStickySidebar() {
        var window_width = jQuery(window).width();

        if (window_width < 991) {
            jQuery(".sticky-move").trigger("sticky_kit:detach");
        } else {
            make_sticky();
        }

        jQuery(window).resize(function() {

            window_width = jQuery(window).width();

            if (window_width < 991) {
                jQuery(".sticky-move").trigger("sticky_kit:detach");
            } else {
                make_sticky();
            }

        });

        function make_sticky() {
            jQuery(".sticky-move").stick_in_parent();
        }


    };
    wcStickySidebar();
})}(window.jQuery);