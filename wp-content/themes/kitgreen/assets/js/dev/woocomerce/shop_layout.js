(function($) {
    "use strict";
    // window.jws_theme_is_mobile_tablet = function() {
    $(document).ready(function() {
        // Init masonry layout
        var initMasonry = function() {
            var el = $('.jws-masonry');

            el.each(function(i, val) {
                var _option = $(this).data('masonry');

                if (_option !== undefined) {
                    var _selector = _option.selector,
                        _width = _option.columnWidth,
                        _layout = _option.layoutMode;

                    $(this).imagesLoaded(function() {
                        $(val).isotope({
                            layoutMode: _layout,
                            itemSelector: _selector,
                            percentPosition: true,
                            masonry: {
                                columnWidth: _width
                            }
                        });
                    });

                }
            });
        }
        initMasonry();
        // Init wc switch layout
        var wcInitSwitchLayout = function() {
            $('body').on('click', '.wc-col-filter a', function(e) {
                e.preventDefault();

                var _this = $(this),
                    _col = _this.data('col'),
                    _parent = _this.closest('.wc-col-filter'),
                    _products = $('.tb-products-grid')
                var _sizer = $('.product-list .grid-sizer');

                if (_this.hasClass('active')) {
                    return;
                }


                _parent.find('a').removeClass('active');
                _this.addClass('active');

                _products.removeClass(' col-md-3 col-md-2 col-md-4 col-md-20 col-md-6').addClass('col-md-' + _col);
                _sizer.removeClass('size-2 size-3 size-4 size-20 size-6 size-12').addClass('size-' + _col)

                initMasonry();


            });
        }
        wcInitSwitchLayout();

    });
})(window.jQuery)