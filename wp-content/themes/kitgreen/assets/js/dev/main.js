jQuery(document).on('ready', function($) {
    "use strict";

    function totop() {

        if ($('#back-to-top').length) {
            var scrollTrigger = 100, // px
                backToTop = function() {
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop > scrollTrigger) {
                        $('#back-to-top').addClass('show');
                    } else {
                        $('#back-to-top').removeClass('show');
                    }
                };
            backToTop();
            $(window).on('scroll', function() {
                backToTop();
            });
            $('#back-to-top').on('click', function(e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            });
        };
        var path = window.location.protocol + "//" + window.location.host + window.location.pathname;
         // Account for home page with empty path
        if ( path == '' ) {
            path = 'index.php';
        }
         var target_menu = $('.nav li a[href="'+path+'"]');
         var target_demo = $('.demo_con a[href="'+path+'"]');
          // Add active class to target link
         target_menu.addClass('active');
         target_demo.next().addClass('active');
    }
    totop();
    /**
     *  Toggle modal
     */
    function toggleModal() {
        $('body').on('click', '.action-search a', function(e) {
            e.preventDefault();

            openModal($('#search-modal'));
            $('#search-modal').addClass('show');


        });

        $('body').on('click', '.close-modal , .moal-overlay ', function(e) {
            e.preventDefault();
            closeModal($('#search-modal'));
            $('#search-modal').removeClass('show');

        });

    };
    toggleModal();
    /**
     * Team Click
     */
    function teamclick() {
        $('body').on('click', '.action_team', function(e) {
            e.preventDefault();
            $(this).toggleClass('active');
            $(this).parent('.team_inner').find('.member-social , .member-bio').slideToggle('slow');
        });

    };
    teamclick();
    /**
     * Sidetoget Mobile
     */
    function sidebar_drop() {
        $(window).on('resize', function() {
            if ($(window).width() < 991) {
                $('.sidebar_blog').addClass('on-mobile');
            } else {
                $('.sidebar_blog').removeClass('on-mobile');
            }
        }).trigger('resize');
        $('.sidebar_blog').on('click', '.widget-title', function(e) {
            if ($(this).closest('.sidebar_blog').hasClass('on-mobile')) {
                e.preventDefault();
                $(this).parent('.widget').find('ul , .tagcloud').slideToggle('slow');
            }
        });
    };
    sidebar_drop();
    /**
     * Product instance search
     */
    function instanceSearch() {
        var xhr = null,
            searchCache = {},
            $modal = $('#search-modal'),
            $form = $modal.find('form'),
            $search = $form.find('input.search-field'),
            $results = $modal.find('.search-results');

        $modal.on('keyup', '.search-field', function(e) {
            var valid = false;

            if (typeof e.which == 'undefined') {
                valid = true;
            } else if (typeof e.which == 'number' && e.which > 0) {
                valid = !e.ctrlKey && !e.metaKey && !e.altKey;
            }

            if (!valid) {
                return;
            }

            if (xhr) {
                xhr.abort();
            }

            search();
        }).on('change', '.product-cats input', function() {
            if (xhr) {
                xhr.abort();
            }

            search();
        }).on('focusout', '.search-field', function() {
            if ($search.val().length < 2) {
                $results.find('.woocommerce, .buttons').slideUp(function() {
                    $modal.removeClass('searching searched actived found-products found-no-product invalid-length');
                });
            }
        });
        /**
         * LazyLoad
         */
        function lazyLoad() {
            $('body').find('img').lazyload();
        };
        //lazyLoad();
        /**
         * Private function for search
         */
        function search() {
            var keyword = $search.val(),
                cat = '';

            if ($modal.find('.product-cats').length > 0) {
                cat = $modal.find('.product-cats input:checked').val();
            }


            if (keyword.length < 1) {
                $modal.removeClass('searching found-products found-no-product').addClass('invalid-length');
                return;
            }

            $modal.removeClass('found-products found-no-product').addClass('searching');

            var keycat = keyword + cat;

            if (keycat in searchCache) {
                var result = searchCache[keycat];

                $modal.removeClass('searching');

                $modal.addClass('found-products');

                $results.find('.woocommerce').html(result.products);

                $(document.body).trigger('jws_ajax_search_request_success', [$results]);

                $results.find('.woocommerce, .buttons').slideDown(function() {
                    $modal.removeClass('invalid-length');
                });

                $modal.addClass('searched actived');
            } else {
                xhr = $.ajax({
                    url: MS_Ajax.ajaxurl,
                    dataType: 'json',
                    method: 'post',
                    data: {
                        action: 'jws_search_products',
                        nonce: MS_Ajax.nextNonce,
                        term: keyword,
                        cat: cat
                    },
                    success: function(response) {
                        var $products = response.data;

                        $modal.removeClass('searching');


                        $modal.addClass('found-products');

                        $results.find('.woocommerce').html($products);

                        $results.find('.woocommerce, .buttons').slideDown(function() {
                            $modal.removeClass('invalid-length');
                        });

                        $(document.body).trigger('jws_ajax_search_request_success', [$results]);

                        // Cache
                        searchCache[keycat] = {
                            found: true,
                            products: $products
                        };


                        $modal.addClass('searched actived');
                    }
                });
            }

            $(document.body).on('jws_ajax_search_request_success', function(e, $results) {
                $results.find('img').lazyload({
                    threshold: 1000
                });
            });
        }

    };
    instanceSearch();

    function selectoption() {
        $(".woocommerce-ordering .current ").on("click", function() {
            $(this).find("ul").slideToggle();
        });

    }
    selectoption();

    function masonryaction() {
        $('.masonry-container.kitgreen-portfolio-holder').isotope({
            layoutMode: 'packery'
        });
        var el = $('.jws-masonry');

        el.each(function(i, val) {
            var _option = $(this).data('masonry');

            if (_option !== undefined) {
                var _selector = _option.selector,
                    _width = _option.columnWidth,
                    _layout = _option.layoutMode;
               

                $(this).imagesLoaded(function() {
                    $(val).isotope({
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
    masonryaction();


    function menumobi() {
        var body = $("body"),
            mobileNav = $(".mobile_menu"),
            dropDownCat = $(".mobile_menu .mobile_inner .menu-item-has-children"),
            elementIcon = '<span class="icon-sub-menu"></span>',
            butOpener = $(".icon-sub-menu");

        dropDownCat.append(elementIcon);

        mobileNav.on("click", ".icon-sub-menu", function(e) {
            e.preventDefault();

            if ($(this).parent().hasClass("opener-page")) {
                $(this).parent().removeClass("opener-page").find("> ul").slideUp(200);
                $(this).parent().removeClass("opener-page").find(".sub-menu-dropdown  > ul").slideUp(200);
                $(this).parent().find('> .icon-sub-menu').removeClass("up-icon");
            } else {
                $(this).parent().addClass("opener-page").find("> ul").slideDown(200);
                $(this).parent().addClass("opener-page").find(".sub-menu-dropdown  > ul").slideDown(200);
                $(this).parent().find('> .icon-sub-menu').addClass("up-icon");
            }
        });


        $(".button_menu").click(function() {

            if (body.hasClass("open-mobile-menu")) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        body.on("click touchstart", ".mobile-overplay", function() {
            closeMenu();
        });

        function openMenu() {
            body.addClass("open-mobile-menu");
        }

        function closeMenu() {
            body.removeClass("open-mobile-menu");
        }
    }
    menumobi();
    /*----------------------------
        Video Button
    ----------------------------*/
    function youtubevideo() {
        $(".kitgreen-video , .about-video-button").on("click", function() {
            var b = $(this),
                c = b.siblings("iframe"),
                d = c.attr("src"),
                e = d + "&autoplay=1";
            d.indexOf("vimeo.com") + 1 && (e = d + "?autoplay=1"), c.attr("src", e), b.addClass("hidden-video-bg")
        })
    }
    youtubevideo();
    /*----------------------------
        Header sticky
    ----------------------------*/
    function headerstyky() {
        $(".mainmenu-area").sticky({
            topSpacing: 0
        });;
    };
    headerstyky();

    // Get price js slider
    function priceSlider() {
        // woocommerce_price_slider_params is required to continue, ensure the object exists
        if (typeof woocommerce_price_slider_params === 'undefined') {
            return false;
        }

        if ($('.catalog-sidebar').find('.widget_price_filter').length <= 0 && $('#jws-shop-topbar').find('.widget_price_filter').length <= 0) {
            return false;
        }

        // Get markup ready for slider
        $('input#min_price, input#max_price').hide();
        $('.price_slider, .price_label').show();

        // Price slider uses jquery ui
        var min_price = $('.price_slider_amount #min_price').data('min'),
            max_price = $('.price_slider_amount #max_price').data('max'),
            current_min_price = parseInt(min_price, 10),
            current_max_price = parseInt(max_price, 10);

        if ($('.price_slider_amount #min_price').val() != '') {
            current_min_price = parseInt($('.price_slider_amount #min_price').val(), 10);
        }
        if ($('.price_slider_amount #max_price').val() != '') {
            current_max_price = parseInt($('.price_slider_amount #max_price').val(), 10);
        }

        $(document.body).bind('price_slider_create price_slider_slide', function(event, min, max) {
            if (woocommerce_price_slider_params.currency_pos === 'left') {

                $('.price_slider_amount span.from').html(woocommerce_price_slider_params.currency_symbol + min);
                $('.price_slider_amount span.to').html(woocommerce_price_slider_params.currency_symbol + max);

            } else if (woocommerce_price_slider_params.currency_pos === 'left_space') {

                $('.price_slider_amount span.from').html(woocommerce_price_slider_params.currency_symbol + ' ' + min);
                $('.price_slider_amount span.to').html(woocommerce_price_slider_params.currency_symbol + ' ' + max);

            } else if (woocommerce_price_slider_params.currency_pos === 'right') {

                $('.price_slider_amount span.from').html(min + woocommerce_price_slider_params.currency_symbol);
                $('.price_slider_amount span.to').html(max + woocommerce_price_slider_params.currency_symbol);

            } else if (woocommerce_price_slider_params.currency_pos === 'right_space') {

                $('.price_slider_amount span.from').html(min + ' ' + woocommerce_price_slider_params.currency_symbol);
                $('.price_slider_amount span.to').html(max + ' ' + woocommerce_price_slider_params.currency_symbol);

            }

            $(document.body).trigger('price_slider_updated', [min, max]);
        });
        if (typeof $.fn.slider !== 'undefined') {
            $('.price_slider').slider({
                range: true,
                animate: true,
                min: min_price,
                max: max_price,
                values: [current_min_price, current_max_price],
                create: function() {

                    $('.price_slider_amount #min_price').val(current_min_price);
                    $('.price_slider_amount #max_price').val(current_max_price);

                    $(document.body).trigger('price_slider_create', [current_min_price, current_max_price]);
                },
                slide: function(event, ui) {

                    $('input#min_price').val(ui.values[0]);
                    $('input#max_price').val(ui.values[1]);

                    $(document.body).trigger('price_slider_slide', [ui.values[0], ui.values[1]]);
                },
                change: function(event, ui) {

                    $(document.body).trigger('price_slider_change', [ui.values[0], ui.values[1]]);
                }
            });
        }
    };
    // Show Filter widget
    function showFilterContent() {
        var $shopToolbar = $('#jws-shop-toolbar'),
            $shopTopbar = $('#jws-shop-topbar'),
            $catsFilter = $('#jws-categories-filter'),
            $ordering = $shopToolbar.find('.woocommerce-ordering'),
            $catalogSideBar = $('.catalog-sidebar');

        $(window).on('resize', function() {
            if ($(window).width() < 991) {

                $catalogSideBar.addClass('on-mobile');
            } else {
                $catsFilter.removeAttr('style');
                $('#jws-toggle-cats-filter').removeClass('active');
                $shopToolbar.removeClass('on-mobile');
                $shopTopbar.removeClass('on-mobile');
                $catalogSideBar.removeClass('on-mobile');
                $shopTopbar.find('.widget-title').next().removeAttr('style');
                $catalogSideBar.find('.widget-title').next().removeAttr('style');
            }
        }).trigger('resize');

        $(document.body).find('.shop-toolbar, .shop-bottombar').on('click', '.jws-filter', function(e) {
            e.preventDefault();

            if ($(this).closest('.shop-toolbar').hasClass('on-mobile')) {
                $catsFilter.slideUp(200);
                $ordering.slideUp(200);
                $('#jws-toggle-cats-filter').removeClass('active');
                $('#jws-ordering').removeClass('active');
                setTimeout(function() {
                    $shopTopbar.slideToggle(200);
                }, 200);
            } else {
                $shopTopbar.slideToggle();
            }

            $shopTopbar.toggleClass('active');
            $(this).toggleClass('active');
            $shopTopbar.closest('.shop-bottombar').toggleClass('show');
            $('#jws-filter-overlay').toggleClass('show');

            $(document.body).toggleClass('show-filters-content');
        });

        $(document.body).on('click', '#jws-filter-overlay', function(e) {
            e.preventDefault();
            $shopTopbar.slideToggle();
            $('.jws-filter').removeClass('active');
            $shopTopbar.closest('.shop-bottombar').toggleClass('show');
            $('#jws-filter-overlay').toggleClass('show');
            $shopTopbar.removeClass('active');

            $(document.body).removeClass('show-filters-content');
        });

        $(document.body).on('click', '#jws-toggle-cats-filter', function(e) {
            e.preventDefault();
            if ($(this).closest('.shop-toolbar').hasClass('on-mobile')) {

                $shopTopbar.slideUp(200);
                setTimeout(function() {
                    $catsFilter.slideToggle(200);
                }, 200);

                $(this).toggleClass('active');
                $('.jws-filter').removeClass('active');
                $shopTopbar.removeClass('active');
            }
        });

        $(document.body).on('click', '#jws-ordering', function(e) {
            e.preventDefault();
            if ($(this).closest('.shop-toolbar').hasClass('on-mobile')) {

                $shopTopbar.slideUp(200);
                setTimeout(function() {
                    $ordering.slideToggle(200);
                }, 200);

                $(this).toggleClass('active');
                $('.jws-filter').removeClass('active');
                $shopTopbar.removeClass('active');
            }
        });

        $shopTopbar.on('click', '.widget-title', function(e) {
            if ($(this).closest('.shop-topbar').hasClass('on-mobile')) {
                e.preventDefault();

                $(this).closest('.widget').siblings().find('.widget-title').next().slideUp('slow');
                $(this).closest('.widget').siblings().removeClass('active');

                $(this).next().slideToggle('slow');
                $(this).closest('.widget').toggleClass('active');


            }
        });

        $catalogSideBar.on('click', '.widget-title', function(e) {
            if ($(this).closest('.catalog-sidebar').hasClass('on-mobile')) {
                e.preventDefault();

                $(this).closest('.widget').siblings().find('.widget-title').next().slideUp(200);
                $(this).closest('.widget').siblings().removeClass('active');

                $(this).next().slideToggle(200);
                $(this).closest('.widget').toggleClass('active');


            };
        });

    };
    showFilterContent();
    // Filter Ajax
    function filterAjax() {



        $(document.body).on('price_slider_change', function(event, ui) {
            var form = $('.price_slider').closest('form').get(0),
                $form = $(form),
                url = $form.attr('action') + '?' + $form.serialize();

            $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));
        });


        $(document.body).on('click', ' #remove-filter-actived', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));
        });

        $(document.body).find('#jws-shop-product-cats').on('click', '.cat-link', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));
        });

        $(document.body).find('#jws-shop-toolbar').find('.woocommerce-ordering').on('click', 'a', function(e) {
            e.preventDefault();
            $(this).addClass('active');
            var url = $(this).attr('href');
            $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));
        });

        $(document.body).find('#jws-categories-filter').on('click', 'a', function(e) {
            e.preventDefault();
            $(this).addClass('selected');
            var url = $(this).attr('href');
            $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));

        });


        $(document.body).find('#jws-shop-topbar, .catalog-sidebar').on('click', 'a', function(e) {
            var $widget = $(this).closest('.widget');
            if ($widget.hasClass('widget_product_tag_cloud') ||
                $widget.hasClass('widget_product_categories') ||
                $widget.hasClass('widget_layered_nav_filters') ||
                $widget.hasClass('widget_layered_nav') ||
                $widget.hasClass('product-sort-by') ||
                $widget.hasClass('kitgreen-price-filter-list')) {
                e.preventDefault();
                $(this).closest('li').addClass('chosen');
                var url = $(this).attr('href');
                $(document.body).trigger('kitgreen_catelog_filter_ajax', url, $(this));
            }

            if ($widget.hasClass('widget_product_tag_cloud')) {
                $(this).addClass('selected');
            }

            if ($widget.hasClass('product-sort-by')) {
                $(this).addClass('active');
            }
        });

        $(document.body).on('kitgreen_catelog_filter_ajax', function(e, url, element) {

            var $container = $('.bt-product-items'),
                $container_nav = $('.catalog-sidebar'),
                $categories = $('#jws-categories-filter'),
                $shopTopbar = $('#jws-shop-topbar'),
                $titlebar = $('.page-breadcrumbs'),
                $ordering = $('.shop-toolbar .woocommerce-ordering');
            if ($('#jws-shop-toolbar').length > 0) {
                var position = $('#jws-shop-toolbar').offset().top - 200;
                $('html, body').stop().animate({
                        scrollTop: position
                    },
                    1200
                );
            }

            $('.kitgreen-products-loaders').addClass('show');
            if ('?' == url.slice(-1)) {
                url = url.slice(0, -1);
            }

            url = url.replace(/%2C/g, ',');

            history.pushState(null, null, url);

            $(document.body).trigger('kitgreen_ajax_filter_before_send_request', [url, element]);



            $.get(url, function(res) {

                $container.replaceWith($(res).find('.bt-product-items'));
                $container_nav.html($(res).find('.catalog-sidebar').html());
                $categories.html($(res).find('#jws-categories-filter').html());
                $shopTopbar.html($(res).find('#jws-shop-topbar').html());
                $ordering.html($(res).find('.shop-toolbar .woocommerce-ordering').html());
                $titlebar.html($(res).find('.page-breadcrumbs').html());
                $('.kitgreen-products-loaders').removeClass('show');
                masonryaction();
                priceSlider();
                selectoption();
                instanceSearch();
                countDownTimer();
                $('#jws-shop-loading').removeClass('show');
                $(document.body).trigger('kitgreen_ajax_filter_request_success', [res, url]);

            }, 'html');


        });

        $(document.body).on('kitgreen_ajax_filter_before_send_request', function() {
            if ($('#jws-shop-toolbar').hasClass('on-mobile') || $('#jws-shop-topbar').hasClass('on-mobile')) {
                $('#jws-categories-filter').slideUp();
                $('#jws-shop-topbar').slideUp();
                $('#jws-toggle-cats-filter').removeClass('active');
                $('.jws-filter').removeClass('active');
            }
        });

    };
    filterAjax();
    /*------------------------
       Swacth Color
    -------------------------*/
    // Product Attribute
    function kitgreenproductAttribute() {
        $(document.body).on('click', '.jws-swatch-variation-image', function(e) {
            e.preventDefault();
            $(this).siblings('.jws-swatch-variation-image').removeClass('selected');
            $(this).addClass('selected');
            var imgSrc = $(this).data('src'),
                $mainImages = $(this).parents('.tb-products-grid').find('article > .product-thumb'),
                $image = $mainImages.find('img').first(),
                imgWidth = $image.first().width(),
                imgHeight = $image.first().height();

            $mainImages.addClass('image-loading');
            $mainImages.css({
                width: imgWidth,
                height: imgHeight,
                display: 'block'
            });

            $image.attr('src', imgSrc);

            $image.load(function() {
                $mainImages.removeClass('image-loading');
                $mainImages.removeAttr('style');
            });
        });
    }
    $('.jws-carousel').slick({
        prevArrow: '<span class="ion-ios-arrow-left"></span>',
        nextArrow: '<span class="ion-ios-arrow-right"></span>'

    });
    kitgreenproductAttribute();
     function instagram_widget() {
        $('.instagram-widget').each(function() {
              var userid = $(this).find('ul').data('name'),
                number = $(this).find('ul').data('number'),
                token = $(this).find('ul').data('token'),
                target = $(this).find('ul').data('target'),
                i = 1,
                edges = '',
                taget = $(this).find('ul').attr('id');
                var userFeed = new Instafeed({
                target: taget,
                accessToken:token,
                limit: 20,
               
                template:  '<li><a target="'+ target +'"  href="{{link}}"><span class="ion-social-instagram-outline"></span></a><div class="wrapp-pics"><img src="{{image}}" alt=""><div class="hover-mask"></div></div></li>',
                after: function() {
                     $('.jws-carousel-in').slick({
                            prevArrow: '<span class="ion-ios-arrow-left"></span>',
                            nextArrow: '<span class="ion-ios-arrow-right"></span>'
                            
                   });
                },

            });
            userFeed.run();
        });
    }
    instagram_widget();
    // Product Thumbail Slick
    function productThumbnailSlick() {

        var $thumbnails = $('#product-thumbnails').find('.thumbnails'),
            $images = $('#product-images');

        // Product thumnails and featured image slider
        $images.not('.slick-initialized').slick({
            slidesToScroll: 1,
            fade: true,
adaptiveHeight: true ,
            prevArrow: '<span class="ion-ios-arrow-left"></span>',
            nextArrow: '<span class="ion-ios-arrow-right"></span>'
        });

        $thumbnails.not('.slick-initialized').slick({

        });


    };
    if ($('.product-images-content').hasClass("no_galley") === false) {
        productThumbnailSlick();
    }

    function wcInitImageZoom() {
        if ($('.jws-image-zoom').length > 0) {
            var img = $('.jws-image-zoom');
            img.zoom({
                touch: false
            });
        }
    };
    wcInitImageZoom();

    //Product swatch
    // Style Variation
    function productVatiation() {
        // soopas_variation_swatches_form
        $('body').on('tawcvs_initialized', function() {
            $('.variations_form').unbind('tawcvs_no_matching_variations');
            $('.variations_form').on('tawcvs_no_matching_variations', function(event, $el) {
                event.preventDefault();
                $el.addClass('selected');

                $('.variations_form').find('.woocommerce-variation.single_variation').show();
                if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                    $('.variations_form').find('.single_variation').slideDown(200).html('<p>' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>');
                }
            });

        });
        if (($('.woocommerce-product-gallery__wrapper .slick-slide').length > 1)) {
            $(document).on('found_variation', 'form.variations_form', function(event, variation) {
                event.preventDefault();
                $('#product-images').slick('slickGoTo', 0, true);
            }).on('reset_image', function() {
                $('#product-images').slick('slickGoTo', 0, true);
            });
        };
        $('.variations_form').find('td.value').each(function() {
            if (!$(this).find('.variation-selector').hasClass('hidden')) {
                $(this).addClass('show-select');
            } else {
                $(this).prev().addClass('show-label');
            }
        });
    };
    productVatiation();
    // Loading Ajax
    function kitgreenloadingAjax() {



        // Shop Page
        $(document.body).on('click', '#kitgreen-shop-infinite-loading a.next', function(e) {
            e.preventDefault();

            if ($(this).data('requestRunning')) {
                return;
            }

            $(this).data('requestRunning', true);
            $('.dots-loading').addClass('show');
            var $products = $(this).closest('.woocommerce-pagination').prev('.product-list'),
                $pagination = $(this).closest('.woocommerce-pagination');

            $.get(
                $(this).attr('href'),
                function(response) {
                    var content = $(response).find('.product-list').children('.tb-products-grid'),
                        $pagination_html = $(response).find('.woocommerce-pagination').html();


                    $pagination.html($pagination_html);
                    if ($(document.body).hasClass('catalog-board-content')) {
                        content.imagesLoaded(function() {
                            $products.isotope('insert', content);
                            $pagination.find('.page-numbers.next').data('requestRunning', false);
                            $(document.body).trigger('kitgreen_shop_ajax_loading_success');

                        });
                    } else {
                        $products.append(content);
                        $pagination.find('.page-numbers.next').data('requestRunning', false);
                        $(document.body).trigger('kitgreen_shop_ajax_loading_success');
                        $products.isotope('insert', content);
                    }

                    if (!$pagination.find('li .page-numbers').hasClass('next')) {
                        $pagination.addClass('loaded');
                    }
                }
            );
        });

        // Shop loading suceess
        $(document.body).on('kitgreen_shop_ajax_loading_success', function() {
            //	animationProduct();
            $('.kitgreen-products-loader').removeClass('show');
            masonryaction();
            countDownTimer();

        });
    };
    kitgreenloadingAjax();
    /*---------------------
        QickView Product
    ----------------------*/
    /**
     * Toggle product quick view
     */
    // Style Variation

    /**
     * Open modal
     *
     * @param $modal
     * @param tab
     */
    function openModal($modal) {
        $(document.body).addClass('modal-open');
        $modal.fadeIn("slow");
        $modal.addClass('open');
    };

    /**
     * Close modal
     */
    function closeModal() {
        $(document.body).removeClass('modal-open');
        $('#quick-view-modal').removeClass('open');
    };
    $(document.body).on('click', '.close-modal', function(e) {
        e.preventDefault();
        closeModal();
    });

    function productQuickView() {
        $(document.body).on('click', '.product-quick-view', function(e) {
            e.preventDefault();

            var $a = $(this),
                url = $a.attr('href'),
                $modal = $('#quick-view-modal'),
                $product = $modal.find('.product'),
                $button = $modal.find('.close-modal').first().clone();


            $product.hide().html('').addClass('invisible');
            $modal.addClass('loading');
            openModal($modal);

            $.get(url, function(response) {
                var $html = $(response),
                    $summary = $html.find('#content').find('.product-top '),
                    $social = $summary.find('.info-product'),
                    $script = $summary.find('script'),
                    $product_thumbnails = $summary.find('.product-thumbnails'),
                    $variations = $summary.find('.variations_form'),
                    $carousel = $summary.find('.woocommerce-product-gallery__wrapper'),
                    $advenced = $summary.find('.product-advanced'),
                    productClasses = $html.find('.product').attr('class');


                // Remove unused elements
                $product_thumbnails.remove();
                $advenced.remove();
                $product.addClass(productClasses);
                $product.show().html($summary).prepend($button);

                //Force height for images
                $carousel.not('.slick-initialized').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    prevArrow: '<span class="ion-ios-arrow-left"></span>',
                    nextArrow: '<span class="ion-ios-arrow-right"></span>'
                });

                $modal.removeClass('loading');
                $product.removeClass('invisible');
                $carousel.find('.photoswipe').on('click', function(e) {
                    e.preventDefault();
                });


            
                $carousel.find('.woocommerce-product-gallery__image a').on('click', function(e) {
                    e.preventDefault();
                });

                if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                    $variations.wc_variation_form();
                    $variations.find('.variations select').change();
                }

                if (typeof $.fn.tawcvs_variation_swatches_form !== 'undefined') {
                    $variations.tawcvs_variation_swatches_form();
                }
                $carousel.imagesLoaded(function() {
                    $carousel.addClass('loaded');
                });
                productVatiation();
                $(".yith-wfbt-item input").removeAttr('type');
                $(".yith-wfbt-item input").attr("type", "checkbox");
            }, 'html');
        });

        $('#quick-view-modal').on('click', function(e) {
            var target = e.target;
            if ($(target).closest('div.product').length <= 0) {
                closeModal();
            }

        });
    };
    productQuickView();
    /*----------------------------
        SERVICE AND PORTFOLIO SLIDER
    ----------------------------*/
    $('.service_slider').slick();
   	function portfolioSlider() {   
        $('.portfolio-content-container').slick();
        $('.portfolio-thumbnail-container').slick({
            nextArrow: '<span class="lnr lnr-chevron-right"></span>',
            prevArrow: '<span class="lnr lnr-chevron-left"></span>',
        });
    }
   	portfolioSlider();
    function imageSlider() {   
    $(".slider_banner").each(function() {
        var $this = $(this);
        $(this).find('.image_active').slick(
        {
            nextArrow: '<span class="lnr lnr-chevron-right"></span>',
            prevArrow: '<span class="lnr lnr-chevron-left"></span>',
            asNavFor: $this.find('.image_thumbnail')
        }
        );
        $(this).find('.image_thumbnail').slick(
        {
                 asNavFor: $this.find('.image_active')
        }
        );
        
        });
    }
    imageSlider();
    /*----------------------------
        OPEN SEARCH FORM
    ----------------------------*/

    $(".action-search a ").click(function() {
        $(".content-search").addClass('active');
        $(".dgwt-wcas-search-input").focus();
    })
    $(".content-search .close i , .background-search").click(function() {
        $(".content-search").removeClass('active');
    })
    /*---------------------------
        SMOOTH SCROLL
    -----------------------------*/
    $('a.scrolltotop').on('click', function(event) {
        var id = $(this).attr("href");
        var offset = 40;
        var target = $(id).offset().top - offset;
        $('html, body').animate({
            scrollTop: target
        }, 1500, "easeInOutExpo");
        event.preventDefault();
    });
    /**
     *-------------------------------------------------------------------------------------------------------------------------------------------
     * Sale final date countdown
     *-------------------------------------------------------------------------------------------------------------------------------------------
     */
    function countDownTimer() {
        $('.kitgreen-timer').each(function() {
            $(this).countdown($(this).data('end-date'), function(event) {
                $(this).html(event.strftime('' +
                    '<h4 class="countdown-days">%-D <span>days</span></h4> ' +
                    '<h4 class="countdown-hours">%H <span>hours</span></h4> ' +
                    '<h4 class="countdown-min">%M <span>minutes</span></h4> ' +
                    '<h4 class="countdown-sec">%S <span>seconds</span></h4>'));
            });
        });

    };
    countDownTimer();
}(jQuery));