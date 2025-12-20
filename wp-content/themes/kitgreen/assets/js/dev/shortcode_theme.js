var kitgreenThemeModule;

(function($) {
    "use strict";

    kitgreenThemeModule = (function() {



        return {

            init: function() {


                this.productsLoadMore();
                this.productsTabs();
                this.blogLoadMore();
                this.productImages();
                this.blogMasonry();
                this.portfolioLoadMore();
                this.stickyFooter();
                this.getSliderSettings();
                $(window).resize();

                $('body').addClass('document-ready');

                $(document.body).on('updated_cart_totals', function() {
                    kitgreenThemeModule.woocommerceWrappTable();
                });

            },

            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * add class in wishlist   
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */

            wishList: function() {
                var body = $("body");

                body.on("click", ".add_to_wishlist", function() {

                    $(this).parent().addClass("feid-in");

                });

            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Google map
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */

            googleMap: function() {
                var gmap = $(".google-map-container-with-content");

                $(window).resize(function() {
                    gmap.css({
                        'height': gmap.find('.kitgreen-google-map.with-content').outerHeight()
                    })
                });

            },

            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * mobile responsive navigation 
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */

            woocommerceWrappTable: function() {

                var wooTable = $(".woocommerce .shop_table");

                var cartTotals = $(".woocommerce .cart_totals table");

                var wishList = $("#yith-wcwl-form .shop_table");

                wooTable.wrap("<div class='responsive-table'></div>");

                cartTotals.wrap("<div class='responsive-table'></div>");

                wishList.wrap("<div class='responsive-table'></div>");

            },



            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * mobile responsive navigation 
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */

            mobileNavigation: function() {

                var body = $("body"),
                    mobileNav = $(".mobile-nav"),
                    wrapperSite = $(".website-wrapper"),
                    dropDownCat = $(".mobile-nav .site-mobile-menu .menu-item-has-children"),
                    elementIcon = '<span class="icon-sub-menu"></span>',
                    butOpener = $(".icon-sub-menu");

                dropDownCat.append(elementIcon);

                mobileNav.on("click", ".icon-sub-menu", function(e) {
                    e.preventDefault();

                    if ($(this).parent().hasClass("opener-page")) {
                        $(this).parent().removeClass("opener-page").find("> ul").slideUp(200);
                        $(this).parent().removeClass("opener-page").find(".sub-menu-dropdown .container > ul").slideUp(200);
                        $(this).parent().find('> .icon-sub-menu').removeClass("up-icon");
                    } else {
                        $(this).parent().addClass("opener-page").find("> ul").slideDown(200);
                        $(this).parent().addClass("opener-page").find(".sub-menu-dropdown .container > ul").slideDown(200);
                        $(this).parent().find('> .icon-sub-menu').addClass("up-icon");
                    }
                });


                body.on("click", ".mobile-nav-icon", function() {

                    if (body.hasClass("act-mobile-menu")) {
                        closeMenu();
                    } else {
                        openMenu();
                    }

                });

                body.on("click touchstart", ".kitgreen-close-side", function() {
                    closeMenu();
                });

                function openMenu() {
                    body.addClass("act-mobile-menu");
                    wrapperSite.addClass("left-wrapp");
                }

                function closeMenu() {
                    body.removeClass("act-mobile-menu");
                    wrapperSite.removeClass("left-wrapp");
                }
            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Function to make columns the same height 
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            equalizeColumns: function() {

                $.fn.kitgreen_equlize = function(options) {

                    var settings = $.extend({
                        child: "",
                    }, options);

                    var that = this;

                    if (settings.child != '') {
                        that = this.find(settings.child);
                    }

                    var resize = function() {

                        var maxHeight = 0;
                        var height;
                        that.each(function() {
                            $(this).attr('style', '');
                            if ($(window).width() > 767 && $(this).outerHeight() > maxHeight)
                                maxHeight = $(this).outerHeight();
                        });

                        that.each(function() {
                            $(this).css({
                                minHeight: maxHeight
                            });
                        });

                    }

                    $(window).bind('resize', function() {
                        resize();
                    });
                    setTimeout(function() {
                        resize();
                    }, 200);
                    setTimeout(function() {
                        resize();
                    }, 500);
                    setTimeout(function() {
                        resize();
                    }, 800);
                }

                $('.equal-columns').each(function() {
                    $(this).kitgreen_equlize({
                        child: '> [class*=col-]'
                    });
                });
            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Enable masonry grid for blog
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            blogMasonry: function() {
                if (typeof($.fn.isotope) == 'undefined' || typeof($.fn.imagesLoaded) == 'undefined') return;
                var $container = $('.masonry-container.kitgreen-portfolio-holder');

                // initialize Masonry after all images have loaded  
                $container.imagesLoaded(function() {
                    $container.isotope({
                        gutter: 0,
                        isOriginLeft: !$('body').hasClass('rtl'),
                        itemSelector: '.item_portfolio',
                        hiddenStyle: {
                            opacity: 0
                            /* , transform: 'scale(0.001)' -- disabled scaling */
                        },
                        visibleStyle: {
                            opacity: 1
                            /* , transform: 'scale(1)' -- disabled scaling */
                        },
                        transitionDuration: "0.8s",

                    });
                });

                $('.masonry-filter').on('click', 'a', function(e) {
                    e.preventDefault();
                    $('.masonry-filter').find('.filter-active').removeClass('filter-active');
                    $(this).addClass('filter-active');
                    var filterValue = $(this).attr('data-filter');
                    $container.isotope({
                        filter: filterValue
                    });
                });


            },
            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Load more button for blog shortcode
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */

            blogLoadMore: function() {

                $('.kitgreen-blog-load-more').on('click', function(e) {
                    e.preventDefault();

                    var $this = $(this),
                        holder = $this.parent().siblings('.kitgreen-blog-holder'),
                        atts = holder.data('atts'),
                        paged = holder.data('paged');
                    var $loaded = $('.posts-loaded');
                    $this.addClass('loading');

                    $.ajax({
                        url: MS_Ajax.ajaxurl,
                        data: {
                            atts: atts,
                            paged: paged,
                            action: 'kitgreen_get_blog_shortcode'
                        },
                        dataType: 'json',
                        method: 'POST',
                        success: function(data) {
                            if (data.items) {

                                // initialize Masonry after all images have loaded  
                                var items = $(data.items);

                                holder.append(items).isotope('appended', items);
                                holder.imagesLoaded().progress(function() {
                                    holder.isotope('layout');

                                });
                                holder.data('paged', paged + 1);
                            }
                            if (data.status == 'no-more-posts') {
                                $this.hide();
                                $loaded.addClass('active');
                            }

                        },
                        error: function(data) {
                            console.log('ajax error');
                        },
                        complete: function() {
                            $this.removeClass('loading');
                        },
                    });

                });

            },

            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Load more button for products shortcode
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            productsLoadMore: function() {

                var process = false,
                    intervalID;

                $('.kitgreen-products-element').each(function() {
                    var $this = $(this),
                        cache = [],
                        inner = $this.find('.kitgreen-products-holder');

                    if (!inner.hasClass('pagination-arrows') && !inner.hasClass('pagination-more-btn')) return;

                    cache[1] = {
                        items: inner.html(),
                        status: 'have-posts'
                    };

                    $this.on('recalc', function() {
                        calc();
                    });

                    // if( inner.hasClass('pagination-arrows') ) {
                    //$(window).resize(function() {
                    //calc();
                    //});
                    //}

                    var calc = function() {
                        var height = inner.outerHeight();
                        $this.stop().css({
                            height: height
                        });
                    };

                    // sticky buttons

                    var body = $('body'),
                        btnWrap = $this.find('.products-footer'),
                        btnLeft = btnWrap.find('.kitgreen-products-load-prev'),
                        btnRight = btnWrap.find('.kitgreen-products-load-next'),
                        loadWrapp = $this.find('.kitgreen-products-loader'),
                        scrollTop,
                        holderTop,
                        btnOffsetContainer,
                        holderBottom,
                        holderHeight,
                        btnsHeight,
                        offsetArrow = 50,
                        offset,
                        windowWidth;

                    if (body.hasClass('rtl')) {
                        btnLeft = btnRight;
                        btnRight = btnWrap.find('.kitgreen-products-load-prev');
                    }

                    $(window).scroll(function() {
                        buttonsPos();
                    });

                    function buttonsPos() {

                        offset = $(window).height() / 2;

                        windowWidth = $(window).outerWidth(true) + 17;

                        // length scroll
                        scrollTop = $(window).scrollTop();

                        // distance from the top to the element
                        holderTop = $this.offset().top - offset;

                        // offset left to button
                        btnOffsetContainer = $this.offset().left - offsetArrow;

                        // height of buttons
                        btnsHeight = btnLeft.outerHeight();

                        // height of elements
                        holderHeight = $this.height() - 50 - btnsHeight;

                        // and height of element
                        holderBottom = holderTop + holderHeight;

                        if (windowWidth <= 1047 && windowWidth >= 992 || windowWidth <= 825 && windowWidth >= 768) {
                            btnOffsetContainer = btnOffsetContainer + 18;
                        }

                        if (windowWidth < 768 || body.hasClass('wrapper-boxed') || body.hasClass('wrapper-boxed-small') || $('.main-header').hasClass('header-vertical')) {
                            btnOffsetContainer = btnOffsetContainer + 51;
                        }


                        btnLeft.css({
                            'left': btnOffsetContainer + 'px'
                        });

                        // Right arrow position for vertical header
                        if ($('.main-header').hasClass('header-vertical') && !body.hasClass('rtl')) {
                            btnOffsetContainer -= $('.main-header').outerWidth();
                        } else if ($('.main-header').hasClass('header-vertical') && body.hasClass('rtl')) {
                            btnOffsetContainer += $('.main-header').outerWidth();
                        }

                        btnRight.css({
                            'right': btnOffsetContainer + 'px'
                        });


                        if (scrollTop < holderTop || scrollTop > holderBottom) {
                            btnWrap.removeClass('show-arrow');
                            loadWrapp.addClass('hidden-loader');
                        } else {
                            btnWrap.addClass('show-arrow');
                            loadWrapp.removeClass('hidden-loader');
                        }

                    };

                    $this.find('.kitgreen-products-load-more').on('click', function(e) {
                        e.preventDefault();

                        if (process) return;
                        process = true;
                        
                        var $this = $(this),
                            holder = $this.parent().siblings('.kitgreen-products-holder'),
                            atts = holder.data('atts'),
                            paged = holder.data('paged');

                        paged++;

                        loadProducts(atts, paged, holder, $this, [], function(data) {
                            if (data.items) {
                                if (holder.hasClass('grid-masonry')) {
                                    isotopeAppend(holder, data.items);
                                } else {
                                    holder.append(data.items);
                                }

                                holder.data('paged', paged);
                            }

                            if (data.status == 'no-more-posts') {
                                $this.hide();
                                $('.loaded-all').show();
                            }
                        });

                    });

                    $this.find('.kitgreen-products-load-prev, .kitgreen-products-load-next').on('click', function(e) {
                        e.preventDefault();

                        if (process || $(this).hasClass('disabled')) return;
                        process = true;

                        clearInterval(intervalID);

                        var $this = $(this),
                            holder = $this.parent().siblings('.kitgreen-products-holder'),
                            next = $this.parent().find('.kitgreen-products-load-next'),
                            prev = $this.parent().find('.kitgreen-products-load-prev'),
                            atts = holder.data('atts'),
                            paged = holder.attr('data-paged');
                        if ($this.hasClass('kitgreen-products-load-prev')) {
                            if (paged < 2) return;
                            paged = paged - 2;
                        }

                        paged++;

                        loadProducts(atts, paged, holder, $this, cache, function(data) {
                            holder.addClass('kitgreen-animated-products');

                            if (data.items) {
                                holder.html(data.items).attr('data-paged', paged);
                            }

                            if ($(window).width() < 768) {
                                $('html, body').stop().animate({
                                    scrollTop: holder.offset().top - 150
                                }, 400);
                            }


                            var iter = 0;
                            intervalID = setInterval(function() {
                                holder.find('.tb-products-grid').eq(iter).addClass('kitgreen-animated');
                                iter++;
                            }, 100);

                            if (paged > 1) {
                                prev.removeClass('disabled');
                            } else {
                                prev.addClass('disabled');
                            }

                            if (data.status == 'no-more-posts') {
                                next.addClass('disabled');
                            } else {
                                next.removeClass('disabled');
                            }
                        });

                    });
                });

                var loadProducts = function(atts, paged, holder, btn, cache, callback) {

                    if (cache[paged]) {
                        holder.addClass('loading');
                        setTimeout(function() {
                            callback(cache[paged]);
                            holder.removeClass('loading');
                            process = false;
                        }, 300);
                        return;
                    }

                    holder.addClass('loading').parent().addClass('element-loading');

                    btn.addClass('loading');

                    $.ajax({
                        url: MS_Ajax.ajaxurl,
                        data: {
                            atts: atts,
                            paged: paged,
                            action: 'kitgreen_get_products_shortcode'
                        },
                        dataType: 'json',
                        method: 'POST',
                        success: function(data) {
                            cache[paged] = data;
                            callback(data);
                        },
                        error: function(data) {
                            console.log('ajax error');
                        },
                        complete: function() {
                            holder.removeClass('loading').parent().removeClass('element-loading');
                            btn.removeClass('loading');
                            process = false; 

                        },
                    });
                };
                var isotopeAppend = function(el, items) {
                    // initialize Masonry after all images have loaded  
                    var items = $(items);
                    el.append(items).isotope('appended', items);
                    el.isotope('layout');
                    setTimeout(function() {
                        el.isotope('layout');
                    }, 100);
                    el.imagesLoaded().progress(function() {
                        el.isotope('layout');
                    });
                };

            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Products tabs element AJAX loading
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            productsTabs: function() {


                var process = false;

                $('.kitgreen-products-tabs , .kitgreen-kitchen-tabs-portfolio').each(function() {
                    var $this = $(this),
                        $inner = $this.find('.kitgreen-tab-content'),
                        cache = [];

                    if ($inner.find('.owl-carousel').length < 1) {
                        cache[0] = {
                            html: $inner.html()
                        };
                    }

                    $this.find('.products-tabs-title li').on('click', function(e) {
                        e.preventDefault();

                        var $this = $(this),
                            atts = $this.data('atts'),
                            index = $this.index();

                        if (process || $this.hasClass('active-tab-title')) return;
                        process = true;

                        loadTab(atts, index, $inner, $this, cache, function(data) {
                            if (data.html) {
                                $inner.html(data.html);
                                kitgreenThemeModule.shopMasonry();
                                kitgreenThemeModule.productsLoadMore();
                            }
                        });

                    });
                    
                    $this.find('.kitchen-tabs-title li').on('click', function(e) {
                        e.preventDefault();

                        var $this = $(this),
                            atts = $this.data('atts'),
                            index = $this.index();

                        if (process || $this.hasClass('active-tab-title')) return;
                        process = true;

                         loadTab2(atts, index, $inner, $this, cache, function(data) {
                            var getSliderSettings  = {
                                slidesToScroll: 1,
                                draggable: false,
                                prevArrow: '<span class="lnr lnr-chevron-left"></span>',
                                nextArrow: '<span class="lnr lnr-chevron-right"></span>',
                            }; 
                            if (data.html) {
                              
                               $('.kitgreen-tab-portfolio').slick('unslick'); /* ONLY remove the classes and handlers added on initialize */
                                $inner.html(data.html);
                                $('.image_before_after').imagesLoaded( function() {
                                        $('.image_before_after').twentytwenty();
                               });
                                $('.kitgreen-tab-portfolio').slick(getSliderSettings); /* Initialize the slick again */
                            
                               
                                
                            }
                        });

                    });

                    var $nav = $this.find('.tabs-navigation-wrapper'),
                        $subList = $nav.find('ul'),
                        time = 300;

                    $nav.on('click', '.open-title-menu', function() {
                            var $btn = $(this);

                            if ($subList.hasClass('list-shown')) {
                                $btn.removeClass('toggle-active');
                                $subList.removeClass('list-shown');
                            } else {
                                $btn.addClass('toggle-active');
                                $subList.addClass('list-shown');
                                setTimeout(function() {
                                    $('body').one('click', function(e) {
                                        var target = e.target;
                                        if (!$(target).is('.tabs-navigation-wrapper') && !$(target).parents().is('.tabs-navigation-wrapper')) {
                                            $btn.removeClass('toggle-active');
                                            $subList.removeClass('list-shown');
                                            return false;
                                        }
                                    });
                                }, 10);
                            }

                        })
                        .on('click', 'li', function() {
                            var $btn = $nav.find('.open-title-menu'),
                                text = $(this).text();

                            if ($subList.hasClass('list-shown')) {
                                $btn.removeClass('toggle-active').text(text);
                                $subList.removeClass('list-shown');
                            }
                        });

                });

                var loadTab = function(atts, index, holder, btn, cache, callback) {

                    btn.parent().find('.active-tab-title').removeClass('active-tab-title');
                    btn.addClass('active-tab-title')

                    if (cache[index]) {
                        holder.addClass('loading');
                        setTimeout(function() {
                            callback(cache[index]);
                            holder.removeClass('loading');
                            process = false;
                        }, 300);
                        return;
                    }

                    holder.addClass('loading').parent().addClass('element-loading');

                    btn.addClass('loading');

                    $.ajax({
                        url: MS_Ajax.ajaxurl,
                        data: {
                            atts: atts,
                            action: 'kitgreen_get_products_tab_shortcode'
                        },
                        dataType: 'json',
                        method: 'POST',
                        success: function(data) {
                            cache[index] = data;
                            callback(data);
                        },
                        error: function(data) {
                            console.log('ajax error');
                        },
                        complete: function() {
                            holder.removeClass('loading').parent().removeClass('element-loading');
                            btn.removeClass('loading');
                            process = false;
                        },
                    });
                };

                  var loadTab2 = function(atts, index, holder, btn, cache, callback) {

                    btn.parent().find('.active-tab-title').removeClass('active-tab-title');
                    btn.addClass('active-tab-title')
                    
                    if (cache[index]) {
                        holder.addClass('loading');
                        setTimeout(function() {
                            callback(cache[index]);
                            holder.removeClass('loading');
                            process = false;
                        }, 300);

                        return;
                    }

                    holder.addClass('loading').parent().addClass('element-loading');

                    btn.addClass('loading');

                    $.ajax({
                        url: MS_Ajax.ajaxurl,
                        data: {
                            atts: atts,
                            action: 'kitgreen_get_kitchen_tab_shortcode'
                        },
                        dataType: 'json',
                        method: 'POST',
                        success: function(data) {
                            cache[index] = data;
                            callback(data);
                        },
                        error: function(data) {
                            console.log('ajax error');
                        },
                        complete: function() {
                               setTimeout(function() {
                                 holder.removeClass('loading').parent().removeClass('element-loading');
                               }, 800);
                            
                            btn.removeClass('loading');
                            process = false;

                        },
                    });
                };
            },

            galleryIlightbox: function() {
                         if (jQuery(".masonry-container").length) {
                            jQuery("a.open_popup").iLightBox({
                               skin: "metro-black",
                               path: "horizontal",
                               type: "inline, video, image",
                               maxScale: 1,
                               controls: {
                                  slideshow: true,
                                  arrows: true
                               },
                               overlay: {
                                  opacity: "0.7"
                               }
                            });
                         }
                      },
             getSliderSettings: function() {
                   $('.kitgreen-tab-portfolio').slick({
                        slidesToScroll: 1,
                        draggable: false,
                        prevArrow: '<span class="lnr lnr-chevron-left"></span>',
                        nextArrow: '<span class="lnr lnr-chevron-right"></span>',
                     });  
             },         
            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Load more button for portfolio shortcode
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            portfolioLoadMore: function() {
                var waypoint = $('.kitgreen-portfolio-load-more.load-on-scroll').waypoint(function() {
                        $('.kitgreen-portfolio-load-more.load-on-scroll').trigger('click');
                    }, {
                        offset: '100%'
                    }),
                    process = false;

                $('.kitgreen-portfolio-load-more').on('click', function(e) {
                    e.preventDefault();

                    if (process) return;

                    process = true;

                    var $this = $(this),
                        holder = $this.parent().parent().find('.kitgreen-portfolio-holder'),
                        source = holder.data('source'),
                        action = 'kitgreen_get_portfolio_' + source,
                        ajaxurl = MS_Ajax.ajaxurl,
                        dataType = 'json',
                        method = 'POST',
                        timeout,
                        atts = holder.data('atts'),
                        paged = holder.data('paged');

                    $this.addClass('loading');

                    var data = {
                        atts: atts,
                        paged: paged,
                        action: action
                    };

                    if (source == 'main_loop') {
                        ajaxurl = $(this).attr('href');
                        method = 'GET';
                        data = {};
                    }


                    $.ajax({
                        url: ajaxurl,
                        data: data,
                        dataType: dataType,
                        method: method,
                        success: function(data) {

                            var items = $(data.items);

                            if (items) {
                                if (holder.hasClass('masonry-container')) {
                                    // initialize Masonry after all images have loaded  
                                    holder.append(items).isotope('appended', items);
                                    holder.imagesLoaded().progress(function() {
                                        holder.isotope('layout');

                                        clearTimeout(timeout);

                                        timeout = setTimeout(function() {
                                            $('.kitgreen-portfolio-load-more.load-on-scroll').waypoint('destroy');
                                            waypoint = $('.kitgreen-portfolio-load-more.load-on-scroll').waypoint(function() {
                                                $('.kitgreen-portfolio-load-more.load-on-scroll').trigger('click');
                                            }, {
                                                offset: '100%'
                                            });
                                        }, 1000);
                                    });
                                } else {
                                    holder.append(items);
                                }

                                holder.data('paged', paged + 1);

                                $this.attr('href', data.nextPage);
                            }

                            //kitgreenThemeModule.mfpPopup();

                            if (data.status == 'no-more-posts') {
                                $this.hide();
                            }

                        },
                        error: function(data) {
                            console.log('ajax error');
                        },
                        complete: function() {
                            $this.removeClass('loading');
                            process = false;
                            kitgreenThemeModule.galleryIlightbox();
                        },
                    });

                });

            },
            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Enable masonry grid for shop isotope type
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            shopMasonry: function() {
                if (typeof($.fn.isotope) == 'undefined' || typeof($.fn.imagesLoaded) == 'undefined') return;
                var $container = $('.elements-grid.grid-masonry');
                // initialize Masonry after all images have loaded  
                $container.imagesLoaded(function() {
                    $container.isotope({
                        isOriginLeft: !$('body').hasClass('rtl'),
                        itemSelector: '.category-grid-item, .product-grid-item',
                    });
                });
                
         
                    var el = $('.kitgreen-products-holder.jws-masonry');
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
                        
                // Categories masonry
                $(window).resize(function() {
                    var $catsContainer = $('.categories-masonry');
                    var colWidth = ($catsContainer.hasClass('categories-style-masonry')) ? '.category-grid-item' : '.col-md-3.category-grid-item';
                    $catsContainer.imagesLoaded(function() {
                        $catsContainer.isotope({
                            resizable: false,
                            isOriginLeft: !$('body').hasClass('rtl'),
                            layoutMode: 'packery',
                            packery: {
                                gutter: 0,
                                columnWidth: colWidth
                            },
                            itemSelector: '.category-grid-item',
                            // masonry: {
                            // gutter: 0
                            // }
                        });
                    });
                });

            },



            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Product thumbnail images & photo swipe gallery
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            productImages: function() {
                var currentImage,
                    mainImage = $('.woocommerce-main-image'),
                    thumbs = $('.product-images .thumbnails'),
                    currentClass = 'current-image',
                    gallery = $('.photoswipe-images'),
                    galleryType = 'photo-swipe'; // magnific photo-swipe

                thumbs.addClass('thumbnails-ready');

                mainImage.on('click', function(e) {
                    e.preventDefault();

                    currentImage = $(this).attr('href');

                    if (galleryType == 'magnific') {
                        $.magnificPopup.open({
                            type: 'image',
                            image: {
                                verticalFit: false
                            },
                            items: getProductItems(),
                            gallery: {
                                enabled: true,
                                navigateByImgClick: false
                            },
                        }, 0);
                    }

                    if (galleryType == 'photo-swipe') {

                        // build items array
                        var items = getProductItems();

                        callPhotoSwipe(0, items, mainImage);

                    }

                });

                thumbs.on('click', '.image-link', function(e) {
                    e.preventDefault();

                    if (thumbs.hasClass('thumbnails-large')) {
                        var index = $(e.currentTarget).index() + 1;
                        var items = getProductItems();
                        callPhotoSwipe(index, items, $(e.currentTarget));
                        return;
                    }

                    var href = $(this).attr('href'),
                        src = $(this).attr('data-single-image'),
                        width = $(this).attr('data-width'),
                        height = $(this).attr('data-height'),
                        title = $(this).attr('title');

                    thumbs.find('.' + currentClass).removeClass(currentClass);
                    $(this).addClass(currentClass);

                    if (mainImage.find('img').attr('src') == src) return;

                    mainImage.addClass('loading-image').attr('href', href).find('img').attr('src', src).attr('srcset', src).one('load', function() {
                        mainImage.removeClass('loading-image').data('width', width).data('height', height).attr('title', title);
                    });

                });

                gallery.each(function() {
                    var $this = $(this);
                    $this.on('click', 'a', function(e) {
                        e.preventDefault();
                        var index = $(e.currentTarget).data('index') - 1;
                        var items = getGalleryItems($this, []);
                        callPhotoSwipe(index, items, $(e.currentTarget));
                    });
                })

                var callPhotoSwipe = function(index, items, $target) {
                    var pswpElement = document.querySelectorAll('.pswp')[0];

                    if ($('body').hasClass('rtl')) {
                        index = items.length - index - 1;
                        items = items.reverse();
                    }

                    // define options (if needed)
                    var options = {
                        // optionName: 'option value'
                        // for example:
                        index: index, // start at first slide
                        getThumbBoundsFn: function(index) {

                            // // get window scroll Y
                            // var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                            // // optionally get horizontal scroll

                            // // get position of element relative to viewport
                            // var rect = $target.offset(); 

                            // // w = width
                            // return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};

                        }
                    };

                    // Initializes and opens PhotoSwipe
                    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.init();
                };

                var getProductItems = function() {
                    var src = mainImage.attr('href'),
                        width = mainImage.data('width'),
                        height = mainImage.data('height'),
                        items = getGalleryItems(thumbs, [{
                            src: src,
                            w: width,
                            h: height,
                            title: (MS_Ajax.product_images_captions == 'yes') ? mainImage.attr('title') : false
                        }]);

                    return items;
                };

                var getGalleryItems = function($gallery, items) {
                    var src, width, height, title;

                    $gallery.find('a').each(function() {
                        src = $(this).attr('href');
                        width = $(this).data('width');
                        height = $(this).data('height');
                        title = $(this).attr('title');
                        if (!isItemInArray(items, src)) {
                            items.push({
                                src: src,
                                w: width,
                                h: height,
                                title: (MS_Ajax.product_images_captions == 'yes') ? title : false
                            });
                        }
                    });

                    return items;
                };

                var isItemInArray = function(items, src) {
                    var i;
                    for (i = 0; i < items.length; i++) {
                        if (items[i].src == src) {
                            return true;
                        }
                    }

                    return false;
                };
            },

            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Banner hover effect with jquery panr
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            bannersHover: function() {
                $(".promo-banner.hover-4").panr({
                    sensitivity: 20,
                    scale: false,
                    scaleOnHover: true,
                    scaleTo: 1.15,
                    scaleDuration: .34,
                    panY: true,
                    panX: true,
                    panDuration: 0.5,
                    resetPanOnMouseLeave: true
                });
            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Scroll top button
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            scrollTop: function() {
                //Check to see if the window is top if not then display button
                $(window).scroll(function() {
                    if ($(this).scrollTop() > 100) {
                        $('.scrollToTop').addClass('button-show');
                    } else {
                        $('.scrollToTop').removeClass('button-show');
                    }
                });

                //Click event to scroll to top
                $('.scrollToTop').click(function() {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 800);
                    return false;
                });
            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Sticky footer: margin bottom for main wrapper
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            stickyFooter: function() {

                if (!$('.footer-main').hasClass('sticky-footer-on') || $(window).width() < 991) return;

                var $footer = $('.footer-main'),
                    $footerContent = $footer.find('#footer-jws'),
                    footerHeight = $footer.outerHeight(),
                    $page = $('.main-content'),
                    $doc = $(document),
                    $window = $(window),
                    docHeight = $doc.outerHeight(),
                    windowHeight = $window.outerHeight(),
                    position,
                    bottomSpace;
                //opacity;

                var footerOffset = function() {
                    $page.css({
                        marginBottom: $footer.outerHeight()
                    })
                };

                var footerEffect = function() {
                    position = $doc.scrollTop();
                    docHeight = $doc.outerHeight();
                    windowHeight = $window.outerHeight();
                    bottomSpace = (docHeight - (position + windowHeight));
                    footerHeight = $footer.outerHeight();
                    //opacity         = parseFloat( (bottomSpace ) / footerHeight).toFixed(5);

                    // If scrolled to footer
                    if (bottomSpace > footerHeight) return;


                };

                $window.on('resize', footerOffset);
                $window.on('scroll', footerEffect);

                $footer.imagesLoaded(function() {
                    footerOffset();
                });

            },




            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * init shop page JS functions
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            shopPageInit: function() {
                this.shopMasonry();
                //this.filtersArea();
                this.ajaxSearch();
                this.btnsToolTips();
                this.filterDropdowns();
                this.categoriesMenuBtns();
                this.categoriesAccordion();
                this.woocommercePriceSlider();
                this.updateCartWidgetFromLocalStorage(); // refresh cart in sidebar
                this.nanoScroller();

                $('.woocommerce-ordering').on('change', 'select.orderby', function() {
                    $(this).closest('form').find('[name="_pjax"]').remove();
                    $(this).closest('form').submit();
                });
            },



            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Sale final date countdown
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            countDownTimer: function() {

                $('.kitgreen-timer').each(function() {
                    $(this).countdown($(this).data('end-date'), function(event) {
                        $(this).html(event.strftime('' +
                            '<span class="countdown-days">%-D <span>' + MS_Ajax.countdown_days + '</span></span> ' +
                            '<span class="countdown-hours">%H <span>' + MS_Ajax.countdown_hours + '</span></span> ' +
                            '<span class="countdown-min">%M <span>' + MS_Ajax.countdown_mins + '</span></span> ' +
                            '<span class="countdown-sec">%S <span>' + MS_Ajax.countdown_sec + '</span></span>'));
                    });
                });

            },


            /**
             *-------------------------------------------------------------------------------------------------------------------------------------------
             * Remove click delay on mobile
             *-------------------------------------------------------------------------------------------------------------------------------------------
             */
            mobileFastclick: function() {

                if ('addEventListener' in document) {
                    document.addEventListener('DOMContentLoaded', function() {
                        FastClick.attach(document.body);
                    }, false);
                }

            },


        }
    }());

})(jQuery);


jQuery(document).ready(function() {

    kitgreenThemeModule.init();


});