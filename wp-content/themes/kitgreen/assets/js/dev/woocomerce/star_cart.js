(function($) {
    "use strict";
    // Init mini cart on header
    var initMiniCart = function() {
        $('body').on('click', '.single_add_to_cart_button , .ajax_add_to_cart', function(e) {
            if (!$(this).hasClass('disabled')) {
                e.preventDefault();
                $('body').addClass('widget-panel-open');
                $('#jws-widget-panel-overlay').addClass('show');
                $('body').removeClass('modal-open');
                $('.cart_list').addClass('show');
            };
        });
    }
    /**
     * DOMready event.
     */
    $(document).ready(function() {
        initMiniCart();
    });
})(jQuery);