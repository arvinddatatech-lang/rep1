<?php
/**
 * Render custom styles.
 *
 * @since 1.0.0
 */

if ( ! function_exists( 'jws_theme_custom_css' ) ) {
	function jws_theme_custom_css( $css = array() ) {
$cs = cs_get_option('body-color');

if(!empty($cs)) {
    

		// Logo width
		$logo_width = cs_get_option( 'logo-max-width' );
		if ( ! empty( $logo_width ) ) {
			$css[] = '
				.jws-logo {
					max-width: ' . esc_attr( $logo_width ) . 'px;
				}
			';
		}
		// Logo Height
		$logo_height = cs_get_option( 'logo-light-height' );
		if ( ! empty( $logo_height ) ) {
			$css[] = '
				.logo-kitgreen {
					line-height: ' . esc_attr( $logo_height ) . 'px;
				}
			';
		}
        // Logo Height
		$right_header_height = cs_get_option( 'right-header-light-height' );
		if ( ! empty( $right_header_height ) ) {
			$css[] = '
				#jws_header .right-header {
					height: ' . esc_attr( $right_header_height ) . 'px;
				}
			';
		}
		// Boxed layout
		$boxed_bg = cs_get_option( 'boxed-bg' );

		if ( ! empty( $boxed_bg['image'] ) ) {
			$css[] = '.boxed {';
				$css[] = '
					background-image:  url(' .  esc_url( $boxed_bg['image'] ) . ');
					background-size:       ' .  $boxed_bg['size'] .       ';
					background-repeat:     ' .  $boxed_bg['repeat'] .     ';
					background-position:   ' .  $boxed_bg['position'] .   ';
					background-attachment: ' .  $boxed_bg['attachment'] . ';
				';
				if ( ! empty( $boxed_bg['color'] ) ) {
					$css[] = 'background-color: ' .  $boxed_bg['color'] .';';
				}
			$css[] = '}';
		}

		// WC page title
		$wc_head_bg = cs_get_option( 'wc-pagehead-bg' );
        $is_shop = '';
        if ( class_exists( 'WooCommerce' ) ) { 
        $is_shop = is_shop();
        }
		if ( $is_shop && ! empty( $wc_head_bg ) ) {
			$css[] = '.woocommerce-page .title-bar-header {';
			
				if ( ! empty( $wc_head_bg['image'] ) ) {
   	                $css[] = '
					background-image:  url(' .  esc_url( $wc_head_bg['image'] ) . ');
					background-size:       ' .  $wc_head_bg['size'] .       ';
					background-repeat:     ' .  $wc_head_bg['repeat'] .     ';
					background-position:   ' .  $wc_head_bg['position'] .   ';
					background-attachment: ' .  $wc_head_bg['attachment'] . ';
				    ';
				}else {
				    $css[] = 'background-color: ' .  $wc_head_bg['color'] .';';
				}
			$css[] = '}';
		}
        $wc_head_single_bg = cs_get_option( 'wc-pagehead-single-bg');  
        if ( is_single() && ! empty( $wc_head_single_bg ) ) {
			$css[] = '.single-product .title-bar-header {';
				if ( ! empty( $wc_head_single_bg['image'] ) ) {
    	            $css[] = '
					background-image:  url(' .  esc_url( $wc_head_single_bg['image'] ) . ');
					background-size:       ' .  $wc_head_single_bg['size'] .       ';
					background-repeat:     ' .  $wc_head_single_bg['repeat'] .     ';
					background-position:   ' .  $wc_head_single_bg['position'] .   ';
					background-attachment: ' .  $wc_head_single_bg['attachment'] . ';
				    ';
				}else {
				    $css[] = 'background-color: ' .  $wc_head_single_bg['color'] .';';
				}
			$css[] = '}';
		} 
      

		// Portfolio page title
		$portfolio_head_bg = cs_get_option( 'pp-pagehead-bg' );
		if ( ! empty( $portfolio_head_bg ) ) {
			$css[] = '.single-portfolio .title-bar-header {';
				
				if ( ! empty( $portfolio_head_bg['image'] ) ) {
				    $css[] = '
					background-image:  url(' .  esc_url( $portfolio_head_bg['image'] ) . ');
					background-size:       ' .  $portfolio_head_bg['size'] .       ';
					background-repeat:     ' .  $portfolio_head_bg['repeat'] .     ';
					background-position:   ' .  $portfolio_head_bg['position'] .   ';
					background-attachment: ' .  $portfolio_head_bg['attachment'] . ';
				    ';
				}else {
				    $css[] = 'background-color: ' .  $portfolio_head_bg['color'] .';';
				}
			$css[] = '}';
		}
        //  page golobo title
        $option_tt = get_post_meta( get_the_ID(), '_custom_page_options', true );
        if(!isset($option_tt['page_title_pg'])) {
           $golobal_head_bg = cs_get_option( 'golobal-enable-page-title-bg' );
        }else {
            $golobal_head_bg = $option_tt['page_title_pg'];
        }
        
		if ( ! empty( $golobal_head_bg ) ) {
			$css[] = ' .title-bar-header {';
				
				if ( ! empty( $golobal_head_bg['image'] ) ) {
                    $css[] = '
					background-image:  url(' .  esc_url( $golobal_head_bg['image'] ) . ');
					background-size:       ' .  $golobal_head_bg['size'] .       ';
					background-repeat:     ' .  $golobal_head_bg['repeat'] .     ';
					background-position:   ' .  $golobal_head_bg['position'] .   ';
					background-attachment: ' .  $golobal_head_bg['attachment'] . ';
				';
				}else {
				  	$css[] = 'background-color: ' .  $golobal_head_bg['color'] .';';
				}
			$css[] = '}';
		}
        $header_bg = cs_get_option( 'header_bg' );
        if ( ! empty( $header_bg ) ) {
			$css[] = ' #jws_header.jws-header-v8 {';
				
				if ( ! empty( $header_bg['image'] ) ) {
                    $css[] = '
					background-image:  url(' .  esc_url( $header_bg['image'] ) . ');
					background-size:       ' .  $header_bg['size'] .       ';
					background-repeat:     ' .  $header_bg['repeat'] .     ';
					background-position:   ' .  $header_bg['position'] .   ';
					background-attachment: ' .  $header_bg['attachment'] . ';
				    ';
				}else {
				    $css[] = 'background-color: ' .  $header_bg['color'] .';';
				}
			$css[] = '}';
		}
		// Typography
        if ( cs_get_option( 'heading-color' ) ) {
			$css[] = 'h1, h2, h3, h4, h5, h6 ,a , body .booked-modal .bm-window .booked-form .field label.field-label , body .booked-modal .bm-window p.appointment-info , body .booked-modal .bm-window .booked-form #customerChoices .field .checkbox-radio-block label , body table.booked-calendar .booked-appt-list .timeslot .timeslot-people button , .twentytwenty-before-label:before, .twentytwenty-after-label:before ,.kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .item_loc .title h4 span , .kitgreen-kitchen-tabs-portfolio .kitgreen-tabs-header-portfolio .tabs-navigation-wrapper ul li .tab-label , .catalog-sidebar .widget_price_filter .price_slider_wrapper .price_slider_amount .price_label, .shop-detail-sidebar .widget_price_filter .price_slider_wrapper .price_slider_amount .price_label , .text-about .text_big strong, .testimonials-wrapper.layout2 .testimonial .slider_container .slider_inner .image span , .jws-blog-detail .blog-meta .social_share ul li a span , #wpsl-wrap #wpsl-result-list #wpsl-stores ul li .open_wpsl .wpsl-store-location .wpsl-opening-hours tr td:first-child{';
				$css[] = 'color:' . cs_get_option( 'heading-color' );
			$css[] = '}';
            $css[] = '.wpb-js-composer  .vc_tta-panel .vc_tta-panel-title>a{';
				$css[] = 'color:' . cs_get_option( 'heading-color' );
			$css[] = '!important}';
            
            
            
		}
         if ( cs_get_option( 'heading-color2' ) ) {
			$css[] = '.portfolio-footer .btn_load ,.kitgreen-portfolio-slider .portfolio-content-container .portfolio-content .content .cat a ,  .counter_up_out.layout2 .extra-counter .text_content .counter-label , .testimonials-wrapper.layout1 #content .testimonial-content , .btn_footer,  .kitgreen-blog-holder.border-bottom .post-item .content-blog .content-inner .blog-bottom .link_content a , .contact_footer li p , .kitgreen-price-table .kitgreen-plan-inner .kitgreen-plan-features .kitgreen-plan-feature .item , .wpcf7 h6{';
				$css[] = 'color:' . cs_get_option( 'heading-color2' );
			$css[] = '}';
		}
		$body_font    = cs_get_option( 'body-font' );
		$heading_font = cs_get_option( 'heading-font' );
        
		$css[] = 'body , .font-body {';
			// Body font family
			$css[] = 'font-family: "' . $body_font['family'] . '";';
			if ( '100italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 100;
					font-style: italic;
				';
			} elseif ( '300italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 300;
					font-style: italic;
				';
			} elseif ( '400italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 400;
					font-style: italic;
				';
			} elseif ( '700italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 700;
					font-style: italic;
				';
			} elseif ( '800italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 700;
					font-style: italic;
				';

			} elseif ( '900italic' == $body_font['variant'] ) {
				$css[] = '
					font-weight: 900;
					font-style: italic;
				';
			} elseif ( 'regular' == $body_font['variant'] ) {
				$css[] = 'font-weight: 400;';
			} elseif ( 'italic' == $body_font['variant'] ) {
				$css[] = 'font-style: italic;';
			} else {
				$css[] = 'font-weight:' . $body_font['variant'] . ';';
			}

			// Body font size
			if ( cs_get_option( 'body-font-size' ) ) {
				$css[] = 'font-size:' . cs_get_option( 'body-font-size' ) . 'px;';
			}

			// Body color
			if ( cs_get_option( 'body-color' ) ) {
				$css[] = 'color:' . cs_get_option( 'body-color' );
			}
            
		$css[] = '}';
        $css[] = 'body ,.kitgreen-blog-holder.image-left .post-item .content-blog .content-inner .blog-info , .service-single .nav-post .nav-box > a .text-nav > div , .portfolio-filter ul li a , #footer-jws .sub-menu li a , #footer-jws .sub-menu-heical li a , .icon_footer li a , .kitgreen-blog-holder.blog-menu .post-item .content-blog .content-inner .title h6 a , .kitgreen-portfolio-slider .portfolio-content-container .portfolio-content .content .readmore a:hover , body .vc_tta-tabs .vc_tta-tabs-container .vc_tta-tabs-list .vc_tta-tab a 
                , .sidebar_blog .widget.widget_categories ul li a , .jws-blog-detail .blog-about-author .blog-author-info .at-name .text , .jws-blog-detail .blog-about-author .blog-author-info .icon-author a , .catalog-sidebar .widget_product_categories .product-categories li a, .shop-detail-sidebar .widget_product_categories .product-categories li a , .woocommerce div.product .content-product-right .shop-top .woocommerce-product-rating .woocommerce-review-link 
                ,.catalog-sidebar .widget_jws_search_widget .search-modal.search-fix .modal-content form button, .shop-detail-sidebar .widget_jws_search_widget .search-modal.search-fix .modal-content form button , .my_nav_outter .my_nav .my_nav_arrow i:before
         {';
			// Body color
			if ( cs_get_option( 'body-color' ) ) {
				$css[] = 'color:' . cs_get_option( 'body-color' );
			}
		$css[] = '}';
		$css[] = 'h1, h2, h3, h4, h5, h6, .f__pop  ,.text-about div   {';
			$css[] = 'font-family: "' . $heading_font['family'] . '";';
			if ( '100italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 100;
					font-style: italic;
				';
			} elseif ( '300italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 300;
					font-style: italic;
				';
			} elseif ( '400italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 400;
					font-style: italic;
				';
			} elseif ( '500italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 500;
					font-style: italic;
				';
			} elseif ( '600italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 600;
					font-style: italic;
				';
			} elseif ( '700italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 700;
					font-style: italic;
				';
			} elseif ( '900italic' == $heading_font['variant'] ) {
				$css[] = '
					font-weight: 900;
					font-style: italic;
				';
			} elseif ( 'regular' == $heading_font['variant'] ) {
				$css[] = 'font-weight: 400;';
			} elseif ( 'italic' == $heading_font['variant'] ) {
				$css[] = 'font-style: italic;';
			} else {
				$css[] = 'font-weight:' . $heading_font['variant'];
			}
		$css[] = '}';
		
		
        if ( cs_get_option( 'body-font' ) ) {
            $font_ct = cs_get_option( 'body-font' );
            $font_ct['family'];
			$css[] = '.imapper-content { font-family:' . $font_ct['family'] . '!important; }';
		}
		if ( cs_get_option( 'h1-font-size' ) ) {
			$css[] = 'h1 { font-size:' . cs_get_option( 'h1-font-size' ) . 'px; }';
		}
		if ( cs_get_option( 'h2-font-size' ) ) {
			$css[] = 'h2 { font-size:' . cs_get_option( 'h2-font-size' ) . 'px; }';
		}
		if ( cs_get_option( 'h3-font-size' ) ) {
			$css[] = 'h3 { font-size:' . cs_get_option( 'h3-font-size' ) . 'px; }';
		}
		if ( cs_get_option( 'h4-font-size' ) ) {
			$css[] = 'h4 { font-size:' . cs_get_option( 'h4-font-size' ) . 'px; }';
		}
		if ( cs_get_option( 'h5-font-size' ) ) {
			$css[] = 'h5 { font-size:' . cs_get_option( 'h5-font-size' ) . 'px; }';
		}
		if ( cs_get_option( 'h6-font-size' ) ) {
			$css[] = 'h6 { font-size:' . cs_get_option( 'h6-font-size' ) . 'px; }';
		}
        $color_cuttom = get_post_meta( get_the_ID(), '_custom_page_options', true );
        if( isset($color_cuttom['top_menu_color']) && !empty($color_cuttom['top_menu_color'])) {
          $top_menu = $color_cuttom['top_menu_color']; 
        }else {
           $top_menu = cs_get_option( 'top_menu_color');
        }
        
        
        if( isset($color_cuttom['top_menu_hover_color']) && !empty($color_cuttom['top_menu_hover_color'])) {
          $top_menu_hover = $color_cuttom['top_menu_hover_color']; 
        }else {
           $top_menu_hover = cs_get_option( 'top_menu_hover_color');
        }
        
        
        if( isset($color_cuttom['background_sticky_header']) && !empty($color_cuttom['background_sticky_header'])) {
          $background_stiky = $color_cuttom['background_sticky_header']; 
        }else {
           $background_stiky = cs_get_option( 'background_sticky_header');
        }
        
         if( isset($color_cuttom['sub_menu_color']) && !empty($color_cuttom['sub_menu_color'])) {
          $sub_menu = $color_cuttom['sub_menu_color']; 
        }else {
           $sub_menu = cs_get_option( 'sub_menu_color');
        }
        
        
        if( isset($color_cuttom['primary-color-cutom2']) && !empty($color_cuttom['primary-color-cutom2'])) {
          $primary_color_2 = $color_cuttom['primary-color-cutom2']; 
        }else {
            $primary_color_2 = cs_get_option( 'primary-color-2' ); 
        }
        
        
        if( isset($color_cuttom['primary-color-cutom']) && !empty($color_cuttom['primary-color-cutom'])) {
          $primary_color = $color_cuttom['primary-color-cutom']; 
        }else {
          $primary_color = cs_get_option( 'primary-color' ); 
        }
        
        
        if( isset($color_cuttom['header-background']) && !empty($color_cuttom['header-background'])) {
          $header_color = $color_cuttom['header-background']; 
        }else {
          $header_color = cs_get_option( 'header-background' ); 
        }
        
        
        if( isset($color_cuttom['logo_color']) && !empty($color_cuttom['logo_color'])) {
          $logo_color1 = $color_cuttom['logo_color']; 
        }else {
          $logo_color1 = "";  
        }
        
        if( isset($color_cuttom['logo_color2']) && !empty($color_cuttom['logo_color2'])) {
          $logo_color2 = $color_cuttom['logo_color2']; 
        }else {
          $logo_color2 = "";  
        }
         if ( $logo_color2 && $logo_color1 ) { 
           	$css[] = '
				.logo_text {
    				background: -webkit-linear-gradient(to left, ' . esc_attr( $logo_color1 ) . ' , ' . esc_attr($logo_color2) . ');
                	background: linear-gradient(to left, ' . esc_attr( $logo_color1 ) . ' , ' . esc_attr($logo_color2) . ');
				}
			'; 
        }else {
            $css[] = '
				.logo_text {
                background: -webkit-linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
               	background: linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
                	}
			';
        }
        $css[] = '
				.title_end ins {
                background: -webkit-linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
               	background: linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent; 
                letter-spacing: 0.8px;
                margin-right:10px;
               	}
                .mobile_menu .logo_text {
                background: -webkit-linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
               	background: linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . ');
                	}
			';
        // Menu color
		if ( $sub_menu ) {
			$css[] = '
				#jws_header .sticky-wrapper .menu_nav .mainmenu >.nav >li .sub-menu-dropdown .sub-menu a {
					color: ' . esc_attr( $sub_menu ) . ';
				}
			';
		}
        // Menu color
		if ( $top_menu ) {
			$css[] = '
			    .add_menu , #jws_header .icon_footer li a i , #jws_header .sticky-wrapper .menu_nav .jws-action .search-form .action-search span ,  #jws_header .sticky-wrapper .menu_nav .mainmenu > .nav > li > a , #jws_header .sticky-wrapper .menu_nav .jws-action .jws-icon-cart .cart-contents > span:first-child , .button_menu {
					color: ' . esc_attr( $top_menu ) . '!important;
				}
			';
		}
            // Menu hover color
		if ( $top_menu_hover ) {
			$css[] = '
			 .button_menu:hover, #jws_header.jws-header-v2 .sticky-wrapper .menu_nav .mainmenu > .nav > li > a:hover ,  #jws_header .icon_footer li a i:hover ,  #jws_header .sticky-wrapper .menu_nav .jws-action .jws-icon-cart .cart-contents > span:first-child:hover , #jws_header .sticky-wrapper .menu_nav .jws-action .search-form .action-search span:hover ,  #jws_header .sticky-wrapper .menu_nav .mainmenu > .nav > li > a:hover  {
					color: ' . esc_attr( $top_menu_hover ) . '!important;
				}
                #jws_header .sticky-wrapper .menu_nav .mainmenu > .nav > li > a:before {
                   background: ' . esc_attr( $top_menu_hover ) . '; 
                }
			';
		}
        // Background Stiky color
		if ( $background_stiky ) {
			$css[] = '
			    #jws_header .is-sticky .mainmenu-area {
					background: '.esc_attr( $background_stiky ).' ;
                    box-shadow: 0 0 5px rgba(0,0,0,0.1);
                    -webkit-box-shadow: 0 0 5px rgba(0,0,0,0.1);
                    transition: 0.5s all;
                    -webkit-transition: 0.5s all;
				}
			';
		}
        // Primary Gradient Color
        if ( $primary_color && $primary_color_2 ) { 
           	$css[] = '
               .demo {
                  background: -webkit-linear-gradient(to left, ' . esc_attr( $primary_color ) . ' , ' . esc_attr($primary_color_2) . '); 
                }
                .demo {
                  background:linear-gradient(180deg, ' . esc_attr( $primary_color_2 ) . ' ,  ' . esc_attr( $primary_color ) . ');   
                }
				.logo_text {
                	-webkit-background-clip: text;
                	-webkit-text-fill-color: transparent;
                    font-family: penna;
                    font-size: 48px;
                    letter-spacing: 2.5px;
                    font-weight: bold;
				}
                .mobile_menu .logo_text {
                	-webkit-background-clip: text;
                	-webkit-text-fill-color: transparent;
                    font-family: penna;
                    font-size: 48px;
                    letter-spacing: 2.5px;
                    font-weight: bold;
				}
                .form2 .mc4wp-form button , .pricing-tables .kitgreen-price-table .kitgreen-plan-inner .kitgreen-plan-footer:after {
                    background-image: linear-gradient(to right,'.esc_attr( $primary_color ).' 0%,'.esc_attr( $primary_color_2 ).' 51%,'.esc_attr( $primary_color ).' 100%) !important;
                 }
			'; 
        }
		// Primary color
		if ( $primary_color ) {
			$css[] = '
	        .kitgreen-kitchen-tabs-portfolio .kitgreen-tabs-header-portfolio .tabs-navigation-wrapper ul li:hover .tab-label , .kitgreen-blog-holder.image-left .post-item .content-blog .content-inner .title h6 a:hover, .kitgreen-blog-holder.image-left .post-item .content-blog .content-inner .blog-info .cat a , .testimonials-wrapper.layout4 .testimonial .slider_container .slider_inner footer h5 , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .item_loc .title h4 , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .item_loc .redmore a:hover , .demo_con span.active  , #jws_header .sticky-wrapper .menu_nav .mainmenu >.nav >li .sub-menu-dropdown .sub-menu a.active , .cart-actions .updatecart .button:hover , .cart-actions .coupon .button:hover , .shop_table td.product-name a:hover , .cart-collaterals .continue:hover , .search-modal.search-fix .search-results ul li a .title:hover ,  .jws-push-menu .widget_shopping_cart_content .edit-cart:hover , .jws-push-menu .widget_shopping_cart_content .cart_list .mini_cart_item .quanty-ajax .quantity .jws-font:hover , .jws-push-menu .widget_shopping_cart_content .cart_list .mini_cart_item .jws-cart-panel-item-details .jws-cart-panel-product-title:hover , .catalog-sidebar .widget_products .product_list_widget .amount, .shop-detail-sidebar .widget_products .product_list_widget .amount , #jws_header .top_bar .icon_header li a:hover, .team-single .related_team .post-related .post-item .team-infomation .title h6 a:hover ,  .kitgreen-blog-holder.blog-footer .post-item .content-blog .title a:hover , .catalog-sidebar .widget_products .product_list_widget a:hover > span , .shop-detail-sidebar .widget_products .product_list_widget a:hover > span , .jws-blog-detail .blog-about-author .blog-author-info .icon-author a:hover, .portfolio-single .design_container .data_tab li a:hover , .portfolio-single .prp_bottom .nav-post .nav-box:hover h3 , .portfolio-single .social .social_share ul li a:hover, #jws_header .top_bar .jws-action .action-search a:hover  , #jws_header .top_bar .jws-action a.cart-contents:hover , .portfolio-single .defaul_container .content_meta .pp_meta_left .item .even i , .design_container .background_project #total , .woocommerce div.product .content-product-right .shop-bottom .info-product .product_meta >span a , .woocommerce div.product .content-product-right .shop-bottom .yith-btn .yith-wcwl-add-to-wishlist >div a , .woocommerce div.product .price .amount , .catalog-sidebar .widget_product_categories .product-categories li:hover a , .shop-detail-sidebar .widget_product_categories .product-categories li:hover a , .catalog-sidebar .widget_product_categories .product-categories li:hover , .shop-detail-sidebar .widget_product_categories .product-categories li:hover , .icon-get-link a:hover , .service-single .nav-post .nav-box > a:hover , .testimonials-wrapper.layout3 .testimonial .slider_container .slider_inner footer h5 , .custom_color .contact_footer li i ,  .text-about2 .text_big strong:last-child , .jws-blog-detail .blog-about-author .blog-author-info .at-name , .jws-blog-detail .blog-meta .social_share ul li a:hover , .jws-blog-detail .blog-meta .social_share ul li a:hover span  , .single-blog-page .blog-details .post-meta .info_post .author .name , .single-blog-page .blog-details .post-meta .info_post .like .zilla-likes.active, .single-blog-page .blog-details .post-meta .date_cat a , .sidebar_blog .widget.widget_zo-recent-posts-widget-with-thumbnails ul li .tb-recent-detail .post-content > a:hover, .sidebar_blog .widget.widget_zo-recent-posts-widget-with-thumbnails ul li .tb-recent-detail .post-content .date_cat .cat a , .sidebar_blog .widget.widget_categories ul li a:hover , .breadcrumbs > span:last-child > span  ,  #footer-jws .sub-menu li a:hover , #footer-jws .sub-menu-heical li a:hover , .category-content .inner h6:hover , .tb-products-grid article .product-content .item-top .product-title a:hover, .tb-products-grid article .product-thumb .btn-inner-center a , .tb-products-grid article .product-content .item-bottom .price , .kitgreen-price-table .kitgreen-plan-inner .kitgreen-plan-price .kitgreen-price-value , .kitgreen-service-holder.grid .service-item .service_inner .service-content .readmore a ,  .contact_top h6 a , #footer-jws.footer-v3 .sub-menu-heical li a:hover, #footer-jws.footer-v3 .kitgreen-blog-holder .post-item .content-blog .title a:hover , #footer-jws.footer-v3 .sub-menu li a:hover , .testimonials-wrapper.layout2 .testimonial .slider_container .slider_inner .testimonial-content footer h5 , body .vc_tta-tabs .vc_tta-tabs-container .vc_tta-tabs-list .vc_tta-tab a:hover  ,  body .vc_tta-tabs .vc_tta-tabs-container .vc_tta-tabs-list .vc_tta-tab.vc_active a ,  .kitgreen-portfolio-slider .portfolio-content-container .portfolio-content .content .title h4 a ,  .kitgreen-team-holder .team-item .item_inner:hover .team-infomation .title h6 a , .counter_up_out.layout2 .extra-counter .text_content .ct_icon ,  .kitgreen-info-box.process_icon2:hover .info-box-content .info-box-inner p , .kitgreen-info-box.process_icon2:hover .box-icon-wrapper .info-box-icon .has_icon , .kitgreen-blog-holder.blog-menu .post-item .content-blog .content-inner .blog-innfo .cat a , #jws_header .sticky-wrapper .menu_nav .mainmenu >.nav >li .sub-menu-dropdown .sub-menu a:hover , .copy_right ins , .kitgreen-blog-holder.border-bottom .post-item .content-blog .content-inner .blog-bottom .link_content a:hover , .kitgreen-blog-holder.border-bottom .post-item .content-blog .content-inner .title h6 a:hover , .kitgreen-blog-holder.border-bottom .post-item .content-blog .content-inner .blog-innfo .cat a , .text-about div strong , .phone_ct i , .portfolio-filter ul li a.filter-active , .portfolio-filter ul li a:hover  , .portfolio-footer .btn_load:hover  {
					color: ' . esc_attr( $primary_color ) . ';
				}
			
		    body .booked-modal .bm-window .booked-form .field input[type=text], body .booked-modal .bm-window .booked-form .field input[type=email], body .booked-modal .bm-window .booked-form .field input[type=password] , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .slick-arrow:hover , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .item_loc .redmore a , .cart-actions .updatecart .button:hover , .cart-actions .coupon .button:hover , .catalog-sidebar .widget_products .product_list_widget a:hover img, .shop-detail-sidebar .widget_products .product_list_widget a:hover img , .portfolio-single .design_container .content_tabs .tab-content li a.active .label_fl , .portfolio-single .design_container .content_tabs .tab-content li a.active .label_color , .design_container .data_tab li.active:before , .woocommerce div.product .content-product-right .shop-bottom .yith-btn .yith-wcwl-add-to-wishlist >div a:hover , .team-single .team_lf .nav-box a:hover ,  .comments-area .comment-respond .comment-form .form-submit .submit , .jws-blog-detail .blog-meta .post-tags a:hover , .sidebar_blog .widget.widget_tag_cloud .tagcloud a:hover , .kitgreen-info-box.process_icon3 .info-box-content .button_info:hover , .contact_top h6 a , #footer-jws.footer-v3 .mc4wp-form  .submit  , .kitgreen-portfolio-slider .portfolio-thumbnail-container .slick-arrow:hover , .kitgreen-portfolio-slider .portfolio-content-container .portfolio-content .content .readmore a ,  .kitgreen-service-holder .slick-dots li , .kitgreen-info-box.process_icon2:hover ,  .btn_footer:hover , .testimonials-wrapper .slick-arrow:hover , .testimonials-wrapper.layout1 #thmbnail-img .slick-center .testimonial-avatar .image img , .custom-1.tparrows:hover   , .kitgreen-portfolio-holder .pp_inner .redmore:after{
					border-color: ' . esc_attr( $primary_color ) . ';
				}
			
            body .booked-modal .bm-window .booked-form input[type="radio"]:after, body .booked-modal .bm-window .booked-form input[type="checkbox"]:after , .testimonials-wrapper.layout4 .testimonial .slider_container .slider_inner .client_info .info_bottom , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .slick-arrow:hover , .twentytwenty-handle , .kitgreen-kitchen-tabs-portfolio .kitgreen_content_container .item_loc .redmore a , .kitgreen-kitchen-tabs-portfolio .kitgreen-tabs-header-portfolio .tabs-navigation-wrapper ul li:before , .kitgreen-info-box.top_icon2 .box-icon-wrapper .info-box-icon .has_icon , .search-modal.search-fix .modal-content form button , #yith-wcwl-form .wishlist_table tr td a.button , .jws-push-menu .widget_shopping_cart_content .jws-cart-panel-summary .woocommerce-mini-cart__buttons.buttons.in_product a , .woocommerce-checkout .checkout_coupon .button ,  .woocommerce-checkout .woocommerce-form-login .form-row .button , .checkout-order-review .woocommerce-checkout-review-order .woocommerce-checkout-payment .place-order .button ,  .cart-collaterals .cart_totals .wc-proceed-to-checkout a , .portfolio-single .design_container .content_tabs .tab-content li a.active .label_fl , #yith-wcwl-popup-message ,  .my_nav_outter .my_nav:hover , .portfolio-single .booking_pp , .slider_banner .slick-arrow:hover , .design_container .background_project .detail .toget_detail a , .woocommerce .related-product .product-related-title , .woocommerce .related-product .product-related-title:after , .woocommerce .product-bottom .tab-product .woocommerce-tabs .panel .woocommerce-Reviews #respond input#submit , .woocommerce .product-bottom .tab-product .woocommerce-tabs .wc-tabs li a:after  , .woocommerce .product-bottom .tab-product .woocommerce-tabs .wc-tabs li a , .woocommerce div.product .content-product-right .shop-bottom .single_add_to_cart_button, .woocommerce div.product .content-product-right .shop-bottom .single_add_to_cart_buttons , .woocommerce div.product .content-product-right .shop-bottom .yith-btn .yith-wcwl-add-to-wishlist >div a:hover , .ui-slider-horizontal .ui-slider-range , .ui-slider .ui-slider-handle , .catalog-sidebar .widget-title:after, .shop-detail-sidebar .widget-title:after ,  .catalog-sidebar .widget-title, .shop-detail-sidebar .widget-title , .woocommerce .woocommerce-pagination ul.page-numbers li ul.page-numbers li a, .woocommerce-page .woocommerce-pagination ul.page-numbers li a ,  .service-single .service_single_inner .content_vc .container .service_sn:before , .kitgreen-countdown-timer .kitgreen-timer h4 span , .team-single .team_lf .nav-box a:hover , .team-single .content_team .content .social , #wpsl-wrap #wpsl-result-list #wpsl-stores ul li .open_wpsl .wpsl-direction-wrap .book , #wpsl-wrap .wpsl-search #wpsl-search-wrap form .wpsl-search-btn-wrap input ,  .wpcf7  .wpcf7-submit , .portfolio-footer .load-on-click , .kitgreen-portfolio-holder .grid2 .pp_inner .content_pp .content_pp_inner .popup .open_popup , .jws-blog-detail .comments-area .comment-respond .comment-form .form-submit .submit , .jws-blog-detail .blog-meta .post-tags a:hover , .single-blog-page  .blog-content blockquote:after , .sidebar_blog .widget.widget_tag_cloud .tagcloud a:hover , .sidebar_blog .widget .widget-title:after , .sidebar_blog .widget .widget-title , .blog-footer .kitgreen-blog-load-more , .tb-products-grid article .product-thumb .btn-inner-center a:hover , .kitgreen-price-table .kitgreen-plan-inner .kitgreen-plan-footer .price-plan-btn , .instagram-widget .instagram-pics li a:after , #footer-jws.footer-v3 .mc4wp-form  .submit , .kitgreen-portfolio-slider .portfolio-thumbnail-container .slick-arrow:hover , .kitgreen-portfolio-slider .portfolio-content-container .portfolio-content .content .readmore a , .kitgreen-service-holder .slick-dots li.slick-active , .custom_btn .btn_load , #back-to-top , .mc4wp-form .submit , .btn_footer:hover , .testimonials-wrapper.layout1 #thmbnail-img .testimonial-avatar .image:after , .testimonials-wrapper .slick-arrow:hover ,.custom-1.tparrows:hover , .kitgreen-info-box .number_process , .kitgreen-info-box .number_process .overlay , .kitgreen-info-box .info-box-content .button_info:hover , .testimonials-wrapper.layout1 #thmbnail-img .testimonial-avatar .image:after {
					background-color: ' . esc_attr( $primary_color ) . ';
				}
                
           body .booked-modal .bm-window .booked-form .field .booked-forgot-goback:hover , body .booked-modal .bm-window .booked-form .field .cancel:hover ,  body table.booked-calendar .booked-appt-list h2 , body .booked-modal .bm-window p.booked-title-bar , body .booked-modal .bm-window .booked-form .field .button-primary ,  body .booked-modal .bm-window .booked-form .booked-appointments .booked-icon , body table.booked-calendar td:hover .date span ,  body table.booked-calendar .booked-appt-list .timeslot .timeslot-people button:hover , body table.booked-calendar tr.entryBlock td , body table.booked-calendar td.today:hover .date span ,  body table.booked-calendar thead tr:first-child th  , .wpb-js-composer .vc_tta-color-grey.vc_tta-style-classic .vc_tta-panel.vc_active .vc_tta-panel-heading , .wpb-js-composer .vc_tta-color-grey.vc_tta-style-classic .vc_tta-panel .vc_tta-panel-heading:hover , .kitgreen-team-holder .team-item .item_inner:hover  .social  {
    					background-color: ' . esc_attr( $primary_color ) . '!important;
    				} 
            body .booked-modal .bm-window .booked-form .field select , body .booked-modal .bm-window .booked-form input[type="radio"], body .booked-modal .bm-window .booked-form input[type="checkbox"] , body .booked-modal .bm-window .booked-form .booked-appointments , body table.booked-calendar .booked-appt-list .timeslot .timeslot-people button ,  body table.booked-calendar td.today .date span , .kitgreen-service-holder .service-item .service_inner .service-image .redmore:after ,  .kitgreen-info-box .number_process:before , .kitgreen-info-box .number_process:after , .wpb-js-composer .vc_tta-color-grey.vc_tta-style-classic .vc_tta-panel.vc_active .vc_tta-panel-heading , .hvr-rectangle-in:hover  , input:focus , textarea:focus ,select:focus {
    					border-color: ' . esc_attr( $primary_color ) . '!important;
    				}  
            body table.booked-calendar thead tr th .page-right:hover, body table.booked-calendar thead tr th .page-left:hover , #jws_header .sticky-wrapper .menu_nav .mainmenu > .nav > li > a.active , .kitgreen-service-holder .service-item .service_inner .service-content .title h6 a:hover , .icon_footer li a i:hover , .kitgreen-blog-holder.blog-menu .post-item .content-blog .content-inner .title h6 a:hover  {
    					color: ' . esc_attr( $primary_color ) . '!important;
    				} 
           .searchform:hover {
    					border: 1px solid ' . esc_attr( $primary_color ) . ';
    				}                         
			';
		}
        if ( $primary_color_2 ) { 
          $css[] = ' 
            	.pricing-tables .kitgreen-price-table.layout1 .kitgreen-plan-inner .kitgreen-plan-price .kitgreen-price-suffix:before{
					background-color: ' . esc_attr( $primary_color_2 ) . ';
				}
                 .pricing-tables .kitgreen-price-table.layout1 .kitgreen-plan-inner .kitgreen-plan-footer a , .pricing-tables .kitgreen-price-table.layout1 .kitgreen-plan-inner .kitgreen-plan-price span {
                  color: ' . esc_attr( $primary_color_2 ) . ';  
                }
          
          ';      
        }
      
		// Header color
		if ( $header_color ) {
			$css[] = '.mainmenu-area { background-color: ' . esc_attr( $header_color ) . '}';
		}
        // Header color
		if ( cs_get_option( 'body-background-color' ) ) {
			$css[] = 'body .main-content { background-color: ' . esc_attr( cs_get_option( 'body-background-color' ) ) . '}';
		}
		// Custom css
		if ( cs_get_option( 'custom-css' ) ) {
			$css[] = cs_get_option( 'custom-css' );
		}

		return preg_replace( '/\n|\t/i', '', implode( '', $css ) );
        }
	}
}