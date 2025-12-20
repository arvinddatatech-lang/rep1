(function($) {

    'use strict';

    if (!$.nmThemeExtensions)
        $.nmThemeExtensions = {};


    function NmTheme() {
        var self = this;

        // Page width "breakpoints"
        //self.BREAKPOINT_SMALL = 0;
        //self.BREAKPOINT_MEDIUM = 0;
        self.BREAKPOINT_LARGE = 864;

        // CSS Classes
        self.classWidgetPanelOpen = 'widget-panel-open';

        // Page elements
        self.$window = $(window);
        self.$document = $(document);
        self.$html = $('html');
        self.$body = $('body');



        // Page overlays
        self.$widgetPanelOverlay = $('#jws-widget-panel-overlay');

        // Header
        self.$header = $('#jws-header');

        // Mobile menu
        self.$shopBrowseWrap = $('.bt-product-items');
        // Widget panel
        self.$widgetPanel = $('.jws-mini-cart');
        self.widgetPanelAnimSpeed = 250;

        // Slide panels animation speed
        self.panelsAnimSpeed = 200;

        // Initialize scripts
        self.init();
        self.bind();

    };


    NmTheme.prototype = {



        /**
         *	Initialize
         */
        init: function() {
            var self = this;
            // Init widget panel
            self.widgetPanelPrep();

            // Load extension scripts
            self.loadExtension();



            // "Add to cart" redirect: Show cart panel
            if (self.$body.hasClass('jws-added-to-cart')) {
                self.$body.removeClass('jws-added-to-cart')

                self.$window.load(function() {
                    // Is widget/cart panel enabled?
                    if (self.$widgetPanel.length) {
                        // Show cart panel
                        self.widgetPanelShow(true); // Args: showLoader
                        // Hide cart panel "loader" overlay
                        setTimeout(function() {
                            self.widgetPanelCartHideLoader();
                        }, 1000);
                    }
                });
            }
        },
        /**
         *	Extensions: Load scripts
         */
        loadExtension: function() {
            var self = this;

            if ($.nmThemeExtensions.singleProduct) {
                $.nmThemeExtensions.singleProduct.call(self);
            }
            // Shop scripts
            if ($.nmThemeExtensions.add_to_cart) {
                $.nmThemeExtensions.add_to_cart.call(self);
            }
            // Load Pagination scripts
            if ($.nmThemeExtensions.infload) {
                $.nmThemeExtensions.infload.call(self);
            }
            if ($.nmThemeExtensions.cart) {
                $.nmThemeExtensions.cart.call(self);
            }

        },
        /**
         *  Helper: Add/update a key-value pair in the URL query parameters 
         */
        updateUrlParameter: function(uri, key, value) {
            // Remove #hash before operating on the uri
            var i = uri.indexOf('#'),
                hash = i === -1 ? '' : uri.substr(i);
            uri = (i === -1) ? uri : uri.substr(0, i);

            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
                separator = (uri.indexOf('?') !== -1) ? "&" : "?";

            if (uri.match(re)) {
                uri = uri.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                uri = uri + separator + key + "=" + value;
            }

            return uri + hash; // Append #hash
        },
        /**
         *	Bind scripts
         */
        bind: function() {
            var self = this;




            /* Bind: Page overlay */
            $('#jws-page-overlay, #jws-widget-panel-overlay , .close-cart ').bind('click', function() {
                var $this = $(this);

                self.widgetPanelHide();


                $this.addClass('fade-out');
                setTimeout(function() {
                    $this.removeClass('show fade-out');
                }, self.panelsAnimSpeed);
            });

            /* Bind: Widget panel */
            if (self.$widgetPanel.length) {
                self.widgetPanelBind();
            }
        },




        /**
         *	Widget panel: Prepare
         */
        widgetPanelPrep: function() {
            var self = this;


            // Cart panel: Set Ajax state
            self.cartPanelAjax = null;

            // Cart panel: Bind quantity-input buttons
            self.quantityInputsBindButtons(self.$widgetPanel);


            // Quantity inputs: Bind "blur" event
            self.$widgetPanel.on('blur', 'input.qty', function() {
                var $quantityInput = $(this),
                    currentVal = parseFloat($quantityInput.val()),
                    max = parseFloat($quantityInput.attr('max'));

                // Validate input values
                if (currentVal === '' || currentVal === 'NaN') {
                    currentVal = 0;
                }
                if (max === 'NaN') {
                    max = '';
                }

                // Make sure the value is not higher than the max value
                if (currentVal > max) {
                    $quantityInput.val(max);
                    currentVal = max;
                };

                // Is the quantity value more than 0?
                if (currentVal > 0) {
                    self.widgetPanelCartUpdate($quantityInput);
                }
            });

            // Quantity inputs: Bind "nm_qty_change" event
            self.$document.on('nm_qty_change', function(event, quantityInput) {
                // Is the widget-panel open?

                self.widgetPanelCartUpdate($(quantityInput));

            });
        },

        /**
         *	Widget panel: Bind
         */
        widgetPanelBind: function() {
            var self = this;



            /* Bind: "Cart" buttons */
            $('.cart-contents  ').bind('click', function(e) {
                e.preventDefault();
                    self.$body.removeClass('.open-mobile-menu');
                    self.widgetPanelShow();
                
            });

            /* Bind: "Close" button */
            $('.close-cart').bind('click.close-cart', function(e) {
                e.preventDefault();
                $('#jws-widget-panel-overlay').trigger('click');
            });

            /* Bind: "Continue shopping" button */
            self.$widgetPanel.on('click.close-cart', '#jws-cart-panel-continue', function(e) {
                e.preventDefault();
                $('#jws-widget-panel-overlay').trigger('click');
            });

            /* Bind: Cart panel - Remove product */
            self.$widgetPanel.on('click', '#jws-cart-panel .cart_list .remove', function(e) {
                e.preventDefault();
                // Is an Ajax request already running?

                self.widgetPanelCartRemoveProduct(this);

            });
        },

        /**
         *	Widget panel: Show
         */
        widgetPanelShow: function(showLoader) {
            var self = this;

            if (showLoader) {
                self.widgetPanelCartShowLoader();
            }

            self.$body.addClass('widget-panel-opening ' + self.classWidgetPanelOpen);
            self.$widgetPanelOverlay.addClass('show');

            setTimeout(function() {
                self.$body.removeClass('widget-panel-opening');
            }, self.widgetPanelAnimSpeed);
        },


        /**
         *	Widget panel: Hide
         */
        widgetPanelHide: function() {
            var self = this;

            self.$body.addClass('widget-panel-closing');
            self.$body.removeClass(self.classWidgetPanelOpen);

            setTimeout(function() {
                self.$body.removeClass('widget-panel-closing');
            }, self.widgetPanelAnimSpeed);
        },


        /**
         *	Widget panel: Cart - Show loader
         */
        widgetPanelCartShowLoader: function() {
            $('#jws-cart-panel-loader').addClass('show');
        },


        /**
         *	Widget panel: Cart - Hide loader
         */
        widgetPanelCartHideLoader: function() {
            var self = this;

            $('#jws-cart-panel-loader').addClass('fade-out');
            setTimeout(function() {
                $('#jws-cart-panel-loader').removeClass('fade-out show');
            }, 200);
        },

        /**
         *	Widget panel: Cart - Remove product
         */
        widgetPanelCartRemoveProduct: function(button) {
            var self = this,
                $button = $(button),
                $itemLi = $button.closest('li'),
                $itemUl = $itemLi.parent('ul'),
                cartItemKey = $button.data('cart-item-key');

            // Show thumbnail loader
            $itemLi.closest('li').addClass('loading');

            self.cartPanelAjax = $.ajax({
                type: 'POST',
                url: MS_Ajax.ajaxurl,
                data: {
                    action: 'nm_cart_panel_remove_product',
                    cart_item_key: cartItemKey
                },
                dataType: 'json',
                // Note: Disabling these to avoid "origin policy" AJAX error in some cases
                //cache: false,
                //headers: {'cache-control': 'no-cache'},
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('NM: AJAX error - widgetPanelCartRemoveProduct() - ' + errorThrown);
                    $itemLi.closest('li').removeClass('loading'); // Hide thumbnail loader
                },
                complete: function(response) {
                    self.cartPanelAjax = null; // Reset Ajax state

                    var json = response.responseJSON;

                    if (json && json.status === '1') {
                        // Fade-out cart item
                        $itemLi.css({
                            '-webkit-transition': '0.2s opacity ease',
                            transition: '0.2s opacity ease',
                            opacity: '0'
                        });

                        setTimeout(function() {
                            // Slide-up cart item
                            $itemLi.css('display', 'block').slideUp(150, function() {
                                $itemLi.remove();

                                // Show "cart empty" elements?
                                var $cartLis = $itemUl.children('li');
                                if ($cartLis.length == 1) {
                                    $('#jws-cart-panel').addClass('jws-cart-panel-empty');
                                }

                                // Replace cart/shop fragments
                                self.shopReplaceFragments(json.fragments);

                                // Trigger "added_to_cart" event to make sure the HTML5 "sessionStorage" fragment values are updated
                                self.$body.trigger('added_to_cart', [json.fragments, json.cart_hash]);
                            });
                        }, 160);
                    } else {
                        console.log("NM: Couldn't remove product from cart");
                    }
                }
            });
        },


        /**
         *	Widget panel: Cart - Update quantity
         */
        widgetPanelCartUpdate: function($quantityInput) {
            var self = this;

            // Is an Ajax request already running?
            if (self.cartPanelAjax) {
                self.cartPanelAjax.abort(); // Abort current Ajax request
            }

            // Show thumbnail loader
            $quantityInput.closest('li').addClass('loading');

            // Ajax data
            var data = {
                action: 'nm_cart_panel_update'
            };
            data[$quantityInput.attr('name')] = $quantityInput.val();

            self.cartPanelAjax = $.ajax({
                type: 'POST',
                url: MS_Ajax.ajaxurl,
                data: data,
                dataType: 'json',
                complete: function(response) {
                    //self.cartPanelAjax = null; // Reset Ajax state

                    var json = response.responseJSON;

                    if (json && json.status === '1') {
                        self.shopReplaceFragments(json.fragments); // Replace cart/shop fragments
                    }

                    // Hide any visible thumbnail loaders
                    $('#jws-cart-panel .cart_list').children('.loading').removeClass('loading');
                }
            });
        },


        /**
         *	Shop: Replace fragments
         */
        shopReplaceFragments: function(fragments) {
            var $fragment;
            $.each(fragments, function(selector, fragment) {
                $fragment = $(fragment);
                if ($fragment.length) {
                    $(selector).replaceWith($fragment);
                }
            });
        },


        /**
         *	Quantity inputs: Bind buttons
         */
        quantityInputsBindButtons: function($container) {
            var self = this;

            // Add buttons
            // Note: Added these to the "../global/quantity-input.php" template instead (required for the Ajax Cart)
            //$container.find('.quantity').append('<div class="jws-qty-plus jws-font jws-font-media-play rotate-270"></div>').prepend('<div class="jws-qty-minus jws-font jws-font-media-play rotate-90"></div>');

            /* 
             *	Bind buttons click event
             *	Note: Modified code from WooCommerce core (v2.2.6)
             */
            $container.off('click.nmQty').on('click.nmQty', '.jws-qty-plus, .jws-qty-minus', function() {
                // Get elements and values
                var $this = $(this),
                    $qty = $this.closest('.quantity').find('.qty'),
                    currentVal = parseFloat($qty.val()),
                    max = parseFloat($qty.attr('max')),
                    min = parseFloat($qty.attr('min')),
                    step = $qty.attr('step');

                // Format values
                if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
                if (max === '' || max === 'NaN') max = '';
                if (min === '' || min === 'NaN') min = 0;
                if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

                // Change the value
                if ($this.hasClass('jws-qty-plus')) {
                    if (max && (max == currentVal || currentVal > max)) {
                        $qty.val(max);
                    } else {
                        $qty.val(currentVal + parseFloat(step));
                        self.quantityInputsTriggerEvents($qty);
                    }
                } else {
                    if (min && (min == currentVal || currentVal < min)) {
                        $qty.val(min);
                    } else if (currentVal > 0) {
                        $qty.val(currentVal - parseFloat(step));
                        self.quantityInputsTriggerEvents($qty);
                    }
                }
            });
        },
        /**
         *    Quantity inputs: Trigger events
         */
        quantityInputsTriggerEvents: function($qty) {
            var self = this;

            // Trigger quantity input "change" event
            $qty.trigger('change');

            // Trigger custom event
            self.$document.trigger('nm_qty_change', $qty);
        },

    };
    // Add core script to $.nmTheme so it can be extended
    $.nmTheme = NmTheme.prototype;
    $(document).ready(function() {
        // Initialize script
        new NmTheme();
    });
})(jQuery);