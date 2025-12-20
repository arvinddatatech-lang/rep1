<?php
add_theme_support( 'woocommerce' );

/** Template pages ********************************************************/

if (!function_exists('jwsthemes_woocommerce_content')) {
    
    function jwsthemes_woocommerce_content() {

        if (is_singular('product')) {
            wc_get_template_part('single', 'product');
        } else {
            wc_get_template_part('archive', 'product');
        }
    }

}

/*
 * Show rating on all products
*/ 
remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10 ); 
add_filter( 'woocommerce_product_get_rating_html','jwsthemes_get_rating_html', 10,2 );
function jwsthemes_get_rating_html( $rating_html, $rating ) {
	
	if($rating == '') $rating = 0;
	
	$rating_html = '';

			$rating_html  = '<div class="star-rating" title="' . sprintf( __( 'Rated %s out of 5', 'kitgreen' ), $rating ) . '">';

			$rating_html .= '<span style="width:' . ( ( $rating / 5 ) * 100 ) . '%"><strong class="rating">' . $rating . '</strong> ' . __( 'out of 5', 'kitgreen' ) . '</span>';

			$rating_html .= '</div>';

	return $rating_html;

}

/**
* Change number of related products on product page
* Set your own value for 'posts_per_page'
*/ 
add_filter( 'woocommerce_output_related_products_args', 'jwsthemes_related_products_args' );
function jwsthemes_related_products_args( $args ) {
    $args['posts_per_page'] = -1; // 3 related products
    return $args;
}
if ( ! function_exists( 'tb_woocommerce_page_title' ) ) {

	/**
	 * woocommerce_page_title function.
	 *
	 * @param  boolean $echo
	 * @return string
	 */
	function jwsthemes_woocommerce_page_title() {

		if ( is_search() ) {
			$page_title = sprintf( __( 'Search Results: &ldquo;%s&rdquo;', 'kitgreen' ), get_search_query() );

			if ( get_query_var( 'paged' ) )
				$page_title .= sprintf( __( '&nbsp;&ndash; Page %s', 'kitgreen' ), get_query_var( 'paged' ) );

		} elseif ( is_tax() ) {

			$page_title = single_term_title( "", false );

		} elseif ( is_archive() ) {

			$page_title = __( 'Archives Products', 'kitgreen' );

		} elseif ( is_single() ) {

			$page_title = __( 'Single Product', 'kitgreen' );

		} else {

			$shop_page_id = wc_get_page_id( 'shop' );
			$page_title   = get_the_title( $shop_page_id );

		}
		
		return $page_title;
	}
}
/**
 * Add quick view button in wc product loop
 */
function jws_theme_add_quick_view_button() {

	global $product;

	echo '<a href="#" class="button yith-wcqv-button" data-product_id="' . $product->get_id() . '">Quick Look</span></a>';
}
/**
 * Get a coupon value
 *
 * @access public
 * @param string $coupon
 */
function wc_cart_totals_coupon_html_custom( $coupon ) {
	if ( is_string( $coupon ) ) {
		$coupon = new WC_Coupon( $coupon );
    }

	$value  = array();

	if ( $amount = WC()->cart->get_coupon_discount_amount( $coupon->code, WC()->cart->display_cart_ex_tax ) ) {
		$discount_html = '-' . wc_price( $amount );
	} else {
		$discount_html = '-' . wc_price( $amount );
	}

	$value[] = apply_filters( 'woocommerce_coupon_discount_amount_html', $discount_html, $coupon );

	if ( $coupon->enable_free_shipping() ) {
		$value[] = __( 'Free shipping coupon', 'kitgreen' );
    }

    // get rid of empty array elements
    $value = array_filter( $value );
	$value = implode( ', ', $value );

	echo apply_filters( 'woocommerce_cart_totals_coupon_html', $value, $coupon );
}

/**
 * Get a shipping methods full label including price
 * @param  object $method
 * @return string
 */
function wc_cart_totals_shipping_method_label_custom( $method ) {
	$label = '';//$method->label;

	if ( $method->cost > 0 ) {
		if ( WC()->cart->tax_display_cart == 'excl' ) {
			$label .= wc_price( $method->cost );
			if ( $method->get_shipping_tax() > 0 && WC()->cart->prices_include_tax ) {
				$label .= ' <small class="tax_label">' . WC()->countries->ex_tax_or_vat() . '</small>';
			}
		} else {
			$label .= wc_price( $method->cost + $method->get_shipping_tax() );
			if ( $method->get_shipping_tax() > 0 && ! WC()->cart->prices_include_tax ) {
				$label .= ' <small class="tax_label">' . WC()->countries->inc_tax_or_vat() . '</small>';
			}
		}
	} elseif ( $method->id !== 'free_shipping' ) {
		$label .= ' (' . __( 'Free', 'kitgreen' ) . ')';
	}

	return apply_filters( 'woocommerce_cart_shipping_method_full_label', $label, $method );
}
function wc_gallery () {
    if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post, $product;

$attachment_ids = $product->get_gallery_image_ids();

if ( $attachment_ids && has_post_thumbnail() ) {
	foreach ( $attachment_ids as $attachment_id ) {
		$full_size_image = wp_get_attachment_image_src( $attachment_id, 'shop_single' );
		$thumbnail       = wp_get_attachment_image_src( $attachment_id, 'shop_single' );
		$attributes      = array(
			'title'                   => get_post_field( 'post_title', $attachment_id ),
			'data-caption'            => get_post_field( 'post_excerpt', $attachment_id ),
			'data-src'                => $full_size_image[0],
			'data-large_image'        => $full_size_image[0],
			'data-large_image_width'  => $full_size_image[1],
			'data-large_image_height' => $full_size_image[2],
		);

		$html  = '<div  class="woocommerce-product-gallery__image"><a href="' . esc_url( $full_size_image[0] ) . '">';
		$html .= wp_get_attachment_image( $attachment_id, 'shop_single');
 		$html .= '</a></div>';

		echo apply_filters( 'woocommerce_single_product_image_thumbnail_html', $html, $attachment_id );
	}
}
}

function wc_gallery_carousel() { 
 if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post, $product;
$columns           = apply_filters( 'woocommerce_product_thumbnails_columns', 4 );
$thumbnail_size    = apply_filters( 'shop_single');
$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
$full_size_image   = wp_get_attachment_image_src( $post_thumbnail_id, $thumbnail_size );
$placeholder       = has_post_thumbnail() ? 'with-images' : 'without-images';
$wrapper_classes   = apply_filters( 'woocommerce_single_product_image_gallery_classes', array(
	'woocommerce-product-gallery',
	'woocommerce-product-gallery--' . $placeholder,
	'woocommerce-product-gallery--columns-' . absint( $columns ),
	'images',
) );
?>
		<?php
		$attributes = array(
			'title'                   => get_post_field( 'post_title', $post_thumbnail_id ),
			'data-caption'            => get_post_field( 'post_excerpt', $post_thumbnail_id ),
			'data-src'                => $full_size_image[0],
			'data-large_image'        => $full_size_image[0],
			'data-large_image_width'  => $full_size_image[1],
			'data-large_image_height' => $full_size_image[2],
		);

		if ( has_post_thumbnail() ) {
		  	$html  = '<div data-thumb="' . esc_url( $thumbnail[0] ) . '" class="woocommerce-product-gallery__image"><a href="' . esc_url( $full_size_image[0] ) . '">';
			$html .= get_the_post_thumbnail( $post->ID, 'shop_single');
			$html .= '</a></div>';
		} else {
			$html  = '<div class="woocommerce-product-gallery__image--placeholder">';
			$html .= sprintf( '<img src="%s" alt="%s" />', esc_url( wc_placeholder_img_src() ), esc_html__( 'Awaiting product image', 'kitgreen' ) );
			$html .= '</div>';
		}

		echo apply_filters( 'woocommerce_single_product_image_thumbnail_html', $html, get_post_thumbnail_id( $post->ID ) );
        echo wc_gallery ();
	
		?> <?php
}
/**
 * Change number of products displayed per page.
 *
 * @since  1.0
 *
 * @return  number
 *
 */
function jws_kitgreen_wc_change_product_per_page() {
	$number = cs_get_option( 'wc-number-per-page' );
	return $number;
}
add_filter( 'loop_shop_per_page', 'jws_kitgreen_wc_change_product_per_page' , 20 );
/** 
 * Change the Description tab link text for single products
 */
add_filter( 'woocommerce_product_description_tab_title', 'isa_wc_description_tab_link_text', 999, 2 );
 
function isa_wc_description_tab_link_text( $text, $tab_key ) {
 
    return esc_html( 'Product Description' );
 
}
/** 
 * Change the "Additional Information" tab link text for single products
 */
add_filter( 'woocommerce_product_additional_information_tab_title', 'isa_wc_additional_info_tab_link_text', 999, 2 );
 
function isa_wc_additional_info_tab_link_text( $text, $tab_key ) {
 
    return esc_html( 'Additional Information' );
 
}
 function jws_kitgreen_wc_currency() {
	if ( ! class_exists( 'kitgreen_Addons_Currency' ) ) return;
	$currencies = kitgreen_Addons_Currency::getCurrencies();
					
	if ( count( $currencies > 0 ) ) :
		$woocurrency = kitgreen_Addons_Currency::woo_currency();
		$woocode = $woocurrency['currency'];
		if ( ! isset( $currencies[$woocode] ) ) {
			$currencies[$woocode] = $woocurrency;
		}
		$default = kitgreen_Addons_Currency::woo_currency();
		$current = isset( $_COOKIE['jws_currency'] ) ? $_COOKIE['jws_currency'] : $default['currency'];

		$output = '';

		$output .= '<div class="jws-currency dib pr cg">';
			$output .= '<span class="current dib">' . esc_html( $current ) . '<i class="fa fa-angle-down ml__5"></i></span>';
			$output .= '<ul class="pa ts__03 bgbl">';
				foreach( $currencies as $code => $val ) :
					$output .= '<li>';
						$output .= '<a class="currency-item cg db" href="javascript:void(0);" data-currency="' . esc_attr( $code ) . '">' . esc_html( $code ) . '</a>';
					$output .= '</li>';
				endforeach;
			$output .= '</ul>';
		$output .= '</div>';
	endif;
	return apply_filters( 'jws_kitgreen_wc_currency', $output );
}
/**
 * Shopping cart in header.
 *
 * @since 1.0.0
 */
if ( ! function_exists( ' jws_kitgreen_shopping_cart' ) ) {
	function  jws_kitgreen_shopping_cart() {
		global $woocommerce;
		
		// Catalog mode
		$catalog_mode = cs_get_option( 'wc-catalog' );

		if ( $catalog_mode ) return;
        
        if ( ! wp_script_is( 'wc-cart-fragments' ) ) {
			wp_enqueue_script( 'wc-cart-fragments' );
		}
		$output = '';
		$output .= '<div  class="jws-icon-cart">';
			$output .= '<a class="cart-contents" href="#" title="' . esc_html( 'View your shopping cart', 'kitgreen' ) . '">';
				$output .= '<span class="lnr lnr-cart"></span>';
				$output .= nm_get_cart_contents_count();
			$output .= '</a>';
		$output .= '</div>';
		return apply_filters( ' jws_kitgreen_shopping_cart', $output );
	}
}

/**
 * Shopping cart.
 *
 * @since 1.0.0
 */
if ( ! function_exists( 'jws_kitgreen_wc_my_account' ) ) {
	function jws_kitgreen_wc_my_account() {
		$output = '';
        if ( is_user_logged_in() ) {
                $current_user = wp_get_current_user();
                $name = $current_user->display_name ? $current_user->display_name : ( $current_user->user_firstname ? $current_user->user_firstname : $current_user->user_login );
                $loged = "logged";
                $hidden_md = "hidden-md";
        }else {
         $name = ''; 
         $loged = '';
         $hidden_md = '';  
        }
		$output .= '<div class=" '.$loged.' jws-my-account  ">';
			$output .= '<a class="account" href="' . esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) ) . '"><span class="hidden-xs hidden-sm '.$hidden_md.'">'.esc_html('account' , 'kitgreen').'</span><i class="clo25 ml fz24 midde pe-7s-user"></i><span class="acount-tt">'.$name.'</span></a>';
			$output .= '<ul class="account-content">';
				if ( is_user_logged_in() ) {
					$output .= '<li class="button button--white"><a class="item-ac" href="' . esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) ) . '">' . esc_html__( 'Dashboard', 'kitgreen' ) . '</a></li>';
					$output .= '<li class="button button--white"><a class="item-ac" href="' . esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) ) . '">' . esc_html__( 'Order Tracking', 'kitgreen' ) . '</a></li>';
					$output .= '<li class="button button--white"><a class="item-ac" href="' . esc_url( wc_logout_url(  ) ) . '">' . esc_html__( 'Logout', 'kitgreen' ) . '</a></li>';
				} else {
					$output .= '<li class="button button--white"><a class="item-ac " href="' . esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) ) . '">' . esc_html__( 'Login', 'kitgreen' ) . '</a></li>';
                    $output .= '<li class=" button button--white-reversed"><a class="item-ac " href="' . esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) ) . '">' . esc_html__( 'Sign up', 'kitgreen' ) . '</a></li>';
				}
			$output .= '</ul>';
		$output .= '</div>';

		return apply_filters( 'ws_kitgreen_wc_my_account', $output );
	}
}
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
remove_action( 'woocommerce_after_shop_loop_item',  'yith_add_quick_view_button',30 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
/**
 * ------------------------------------------------------------------------------------------------
 * WishList button
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_wishlist_btn' ) ) {
	function kitgreen_wishlist_btn() {
		if( class_exists('YITH_WCWL_Shortcode')) echo YITH_WCWL_Shortcode::add_to_wishlist(array());
	}
}
/**
 * ------------------------------------------------------------------------------------------------
 * Compare button
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_configure_compare' ) ) {
	add_action( 'init', 'kitgreen_configure_compare' );
	function kitgreen_configure_compare() {
		global $yith_woocompare;
		if( ! class_exists( 'YITH_Woocompare' ) ) return;

		$compare = $yith_woocompare->obj;

		if ( get_option('yith_woocompare_compare_button_in_products_list') == 'yes' ) {
			remove_action( 'woocommerce_after_shop_loop_item', array( $compare, 'add_compare_link' ), 20 );
			#add_action( 'woocommerce_before_shop_loop_item', array( $compare, 'add_compare_link' ), 20 );
		}

        if ( get_option('yith_woocompare_compare_button_in_product_page') == 'yes' ) {
        	add_action( 'woocommerce_single_product_summary', 'kitgreen_before_compare_button', 33 );
        	add_action( 'woocommerce_single_product_summary', 'kitgreen_after_compare_button', 37 );
        }

	}
}

if( ! function_exists( 'kitgreen_before_compare_button' ) ) {
	function kitgreen_before_compare_button() {
		echo '<div class="compare-btn-wrapper">';
	}
}

if( ! function_exists( 'kitgreen_after_compare_button' ) ) {
	function kitgreen_after_compare_button() {
		echo '</div>';
	}
}

if( ! function_exists( 'kitgreen_compare_btn' ) ) {
	function kitgreen_compare_btn() {

		echo '<div class="product-compare-button">';
            global $product;
            $product_id = $product->get_id() ;

            // return if product doesn't exist
            if ( empty( $product_id ) || apply_filters( 'yith_woocompare_remove_compare_link_by_cat', false, $product_id ) )
	            return;

            $is_button = ! isset( $button_or_link ) || ! $button_or_link ? get_option( 'yith_woocompare_is_button' ) : $button_or_link;

            if ( ! isset( $button_text ) || $button_text == 'default' ) {
                $button_text = get_option( 'yith_woocompare_button_text', __( 'Compare', 'kitgreen' ) );
                yit_wpml_register_string( 'Plugins', 'plugin_yit_compare_button_text', $button_text );
                $button_text = yit_wpml_string_translate( 'Plugins', 'plugin_yit_compare_button_text', $button_text );
            }

            printf( '<a href="%s" class="%s" data-product_id="%d" rel="nofollow">%s</a>', kitgreen_compare_add_product_url( $product_id ), 'compare' . ( $is_button == 'button' ? ' button' : '' ), $product_id, $button_text );
        
		echo '</div>';
	}
}


if( ! function_exists( 'kitgreen_compare_add_product_url' ) ) {
    function kitgreen_compare_add_product_url( $product_id ) {
    	$action_add = 'yith-woocompare-add-product';
        $url_args = array(
            'action' => 'asd',
            'id' => $product_id
        );
        return apply_filters( 'yith_woocompare_add_product_url', esc_url_raw( add_query_arg( $url_args ) ), $action_add );
    }
}


if( ! function_exists( 'kitgreen_compare_styles' ) ) {
	add_action( 'wp_print_styles', 'kitgreen_compare_styles', 200 );
	function kitgreen_compare_styles() {
		if( ! class_exists( 'YITH_Woocompare' ) ) return;
		$view_action = 'yith-woocompare-view-table';
		if ( ( ! defined('DOING_AJAX') || ! DOING_AJAX ) && ( ! isset( $_REQUEST['action'] ) || $_REQUEST['action'] != $view_action ) ) return;
		wp_enqueue_style( 'kitgreen-style' );
	}
}

/**
 * ------------------------------------------------------------------------------------------------
 * Custom thumbnail function for slider
 * ------------------------------------------------------------------------------------------------
 */

if ( ! function_exists( 'kitgreen_template_loop_product_thumbnail' ) ) {
	function kitgreen_template_loop_product_thumbnail() {
		echo kitgreen_get_product_thumbnail();
	}
}

if ( ! function_exists( 'kitgreen_get_product_thumbnail' ) ) {
	function kitgreen_get_product_thumbnail( $size = 'shop_catalog_2', $attach_id = false ) {
		global $post, $kitgreen_loop;

		if( ! empty( $kitgreen_loop['double_size'] ) && $kitgreen_loop['double_size'] ) {
			$size = 'shop_catalog_x2';
		}

		if ( has_post_thumbnail() ) {

			if( function_exists( 'wpb_getImageBySize' ) ) {
				if( ! $attach_id ) $attach_id = get_post_thumbnail_id();
				if( ! empty( $kitgreen_loop['img_size'] ) ) {
					$size = $kitgreen_loop['img_size'];
				}  
				
				$img = wpb_getImageBySize( array( 'attach_id' => $attach_id, 'thumb_size' => $size, 'class' => 'content-product-image' ) );
				$img = $img['thumbnail'];

			} else {
				$img = get_the_post_thumbnail( $post->ID, $size );
			}

			return $img;

		} elseif ( wc_placeholder_img_src() ) {
			return wc_placeholder_img( $size );
		}
	}
}


/**
 * ------------------------------------------------------------------------------------------------
 * Check if WooCommerce is active
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_woocommerce_installed' ) ) {
	function kitgreen_woocommerce_installed() {
	    return class_exists( 'WooCommerce' );
	}
}
/**
 * ------------------------------------------------------------------------------------------------
 * Custom thumbnail for category (wide items)
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_category_thumb_double_size' ) ) {
	function kitgreen_category_thumb_double_size( $category ) {
		global $kitgreen_loop;
		$small_thumbnail_size  	= apply_filters( 'subcategory_archive_thumbnail_size', 'shop_catalog2' );
		$dimensions    			= wc_get_image_size( $small_thumbnail_size );
		$thumbnail_id  			= get_term_meta( $category->term_id, 'thumbnail_id', true  );


		if ( $thumbnail_id ) {
			$image = wp_get_attachment_image_src( $thumbnail_id, $small_thumbnail_size  );
			$image = $image[0];
		} else {
			$image = wc_placeholder_img_src();
		}

		if ( $image ) {
			$image = str_replace( ' ', '%20', $image );

			echo '<img src="' . esc_url( $image ) . '" alt="' . esc_attr( $category->name ) . '"   />';
		}
	}
}

remove_action( 'woocommerce_before_subcategory_title', 'woocommerce_subcategory_thumbnail');
add_action( 'woocommerce_before_subcategory_title', 'kitgreen_category_thumb_double_size', 10 );
/**
 * ------------------------------------------------------------------------------------------------
 * Display categories menu
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_product_categories_nav' ) ) {
	function kitgreen_product_categories_nav() {
		global $wp_query, $post;

		//$show_subcategories = kitgreen_get_opt( 'shop_categories_ancestors' );

		$list_args = array(  
			'taxonomy' => 'product_cat', 
			'hide_empty' => false 
		);

		// Menu Order
		$list_args['menu_order'] = false;
		$list_args['menu_order'] = 'asc';

		// Setup Current Category
		$current_cat   = false;
		$cat_ancestors = array();

		if ( is_tax( 'product_cat' ) ) {

			$current_cat   = $wp_query->queried_object;
			$cat_ancestors = get_ancestors( $current_cat->term_id, 'product_cat' );

		}

		$list_args['depth']            = 5;
		$list_args['child_of']         = 0;
		$list_args['title_li']         = '';
		$list_args['hierarchical']     = 1;
		$list_args['use_desc_for_title']= false;


		$shop_link = get_post_type_archive_link( 'product' );

		include_once( WC()->plugin_path() . '/includes/walkers/class-product-cat-list-walker.php' );

		echo '<a href="#" class="kitgreen-show-categories">' . __('Categories', 'kitgreen') . '</a>';

		echo '<ul class="kitgreen-product-categories">';
		
		echo '<li class="cat-link shop-all-link"><a href="' . esc_url( $shop_link ) . '">' . __('All', 'kitgreen') . '</a></li>';

		if( $show_subcategories ) {
		//	kitgreen_show_category_ancestors();
		} else {
			wp_list_categories( $list_args  );
		}

		echo '</ul>';
	}
}
/**
	 * Display a tool bar on top of product archive
	 *
	 * @since 1.0
	 */

    /**
	 * show categories filter
	 *
	 * @return string
	 */
	function get_categories_filter() {

		$filters = '';
		$output  = array();
		$number  = apply_filters( 'kitgreen_product_cats_filter_number', 4 );

		$term_id    = 0;
		$args       = array(
			'parent'  => $term_id,
			'number'  => $number,
			'orderby' => 'count',
			'order'   => 'desc'
		);
		$categories = get_terms( 'product_cat', $args );

		$current_id = '';
		if ( is_tax( 'product_cat' ) ) {
			$queried_object = get_queried_object();
			if ( $queried_object ) {
				$current_id = $queried_object->term_id;
			}
		}

		$found = false;

		if ( ! is_wp_error( $categories ) && $categories ) {
			foreach ( $categories as $cat ) {

				$css_class = '';
				if ( $cat->term_id == $current_id ) {
					$css_class = 'selected';
					$found     = true;
				}
				$filters .= sprintf( '<li><a class="%s" href="%s">%s</a></li>', esc_attr( $css_class ), esc_url( get_term_link( $cat ) ), esc_html( $cat->name ) );
			}
		}

		$css_class = $found ? '' : 'selected';

		if ( $filters ) {
			$output[] = sprintf(
				'<ul class="option-set" data-option-key="filter">
				<li><a href="%s" class="%s">%s</a></li>
				 %s
			</ul>',
				esc_url( get_permalink( get_option( 'woocommerce_shop_page_id' ) ) ),
				esc_attr( $css_class ),
				esc_html__( 'All', 'kitgreen' ),
				$filters
			);
		}


		return '<div class="blas-filter-cat"><div class="container"><div id="jws-categories-filter" class="jws-categories-filter">' . implode( "\n", $output ) . '</div></div></div>';

	}
    function get_colunm_shop() { 
        $columns = "";
        if( isset( $_GET['columns'] ) && $_GET['columns'] == "2" ){ 
            $columns = "6";
        }elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "3") {
            $columns = "4";
        }elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "4") {
            $columns = "3";
        }elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "5") {
            $columns = "5";
        }elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "6") {
            $columns = "2";
        }else {
           $columns = cs_get_option( 'wc-column' );
        };
        
         $abc = cs_get_option( 'shop-column-filter' ) ;
          wp_enqueue_script( 'layoutshop', URI_PATH.'/assets/js/dev/woocomerce/shop_layout.js', array('jquery'), '', true  );
        ?>
            <div class="layout-shop">
            <div class="wc-col-filter button-group flex ">
            <span><?php esc_html_e('See' , 'kitgreen') ?></span>
            <a class="hidden-md hidden-sm hidden-lg visible-xs one <?php echo wp_kses_post($columns == '12' ? ' active' : '') ; ?>" data-col="12" data-filter="*" ></a>
            <?php if(isset($abc[ 'wc-2' ]) && $abc[ 'wc-2' ] == '1') { ?>
                    <a class=" two <?php echo wp_kses_post($columns == '6' ? ' active' : '') ; ?> "  data-col="6" data-filter=".col-md-6">2</a>
            <?php } ?>  
            <?php if(isset($abc[ 'wc-3' ]) && $abc[ 'wc-3' ] == '1') { ?>
                    <a class=" hidden-xs three <?php echo wp_kses_post($columns == '4' ? ' active' : '') ; ?> "  data-col="4" data-filter=".col-md-4">3</a>
            <?php } ?>
            <?php if(isset($abc[ 'wc-4' ]) && $abc[ 'wc-4' ] == '1') { ?>
                    <a class=" hidden-xs four <?php echo wp_kses_post($columns == '3' ? ' active' : '') ; ?>   "  data-col="3" data-filter=".col-md-3">4</a>
            <?php } ?>
            <?php if(isset($abc[ 'wc-5' ]) && $abc[ 'wc-5' ] == '1') { ?>
                    <a class=" hidden-xs four <?php echo wp_kses_post($columns == '5' ? ' active' : '') ; ?>   "  data-col="20" data-filter=".col-md-20">5</a>
            <?php } ?>
            <?php if(isset($abc[ 'wc-6' ]) && $abc[ 'wc-6' ] == '1') { ?>
                    <a class=" hidden-xs four <?php echo wp_kses_post($columns == '2' ? ' active' : '') ; ?>   "  data-col="2" data-filter=".col-md-2">6</a>
            <?php } ?>
            </div>
            </div>
        
        <?php   
    }
    /*
	 *	Add-to-cart (AJAX) redirect: Include custom template
	 */
	function nm_ajax_add_to_cart_redirect_template() {
		if ( isset( $_REQUEST['jws-ajax-add-to-cart'] ) ) {
			wc_get_template( 'ajax-add-to-cart-fragments.php' );
			exit;
		}
	}
	add_action( 'wp', 'nm_ajax_add_to_cart_redirect_template', 1000 );
    add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );
/**
 * Add extra link after single cart.
 *
 * @since 1.0.0
 */
function jws_kitgreen_wc_add_extra_link_after_cart() {
	// Get page options
	$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );

	// Get image to display size guide
	$size_guide = ( isset( $options['wc-single-size-guide'] ) && $options['wc-single-size-guide'] ) ? $options['wc-single-size-guide'] : cs_get_option( 'wc-single-size-guide' );

    if($size_guide) {
        	echo '<div class="my-size">';
		if ( ! empty( $size_guide ) ) {
			echo '<a class="jws-magnific-image" href="' . esc_url( $size_guide ) . '">' . esc_html__( 'What my size?', 'kitgreen' ) . '</a>';
		}
	echo '</div>';
    ?>
        <script type="text/javascript">
        jQuery(document).ready(function ($) {
          
        		if ( $( '.jws-magnific-image' ).length > 0 ) {
        			$( '.jws-magnific-image' ).magnificPopup({
        				type: 'image',
        				image: {
        					verticalFit: true
        				},
        				mainClass: 'mfp-fade',
        				removalDelay: 0,
        				callbacks: {
        					beforeOpen: function() {
        						$( '#jws-wrapper' ).after( '<div class="loader"><div class="loader-inner"></div></div>' );
        					},
        					open: function() {
        						$( '.loader' ).remove();
        					},
        				}
        			});
        		}
        	
            });
        </script> 
   <?php }

   
}
/**
 * Add banner single product.
 *
 * @since 1.0.0
 */
function jws_add_banner() {
	// Get page options
	$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );

	// Get image to display size guide
	$banner = ( isset( $options['wc-single-banner'] ) && $options['wc-single-banner'] ) ? $options['wc-single-banner'] : cs_get_option( 'wc-single-banner' );
    $banner_link = ( isset( $options['wc-single-banner-link'] ) && $options['wc-single-banner-link'] ) ? $options['wc-single-banner-link'] : cs_get_option( 'wc-single-banner-link' );
    

    if($banner) {
			echo '<a class="jws-banner-single" href="' . esc_url( $banner_link ) . '"><img src = "'.esc_url( $banner ).'">'.'</a>';
		
    ?>
   <?php }

   
}
/**
 * Change product image thumbnail size.
 *
 * @since 1.0.0
 */

function jws_kitgreen_wc_change_image_thumbnail_size( $size ) {
	// Get product list style
	$style = cs_get_option( 'wc-style' ) ;
	// Get image size
	$shop_catalog = wc_get_image_size( 'shop_catalog' );

	// Get product options
	$options = get_post_meta( get_the_ID(), '_custom_wc_thumb_options', true );
	if ( is_shop() && $style == 'metro' &&  ( isset( $options['wc-thumbnail-size'] ) && $options['wc-thumbnail-size'] ) ) {
		add_image_size( 'jws_shop_metro', $shop_catalog['width'] * 2, $shop_catalog['height'] * 2, true );
		$size = 'shop_catalog';
	}
    elseif (is_shop() &&  $style == 'masonry' ) {
		add_image_size( 'jws_shop_masonry', $shop_catalog['width'] * 1, $shop_catalog['height'] * 1, true );
		$size = 'jws_shop_masonry';
	}
     else {
		$size = 'shop_catalog';
	}
	return $size;
    
}
add_filter( 'single_product_archive_thumbnail_size', 'jws_kitgreen_wc_change_image_thumbnail_size' );
/**
 * ------------------------------------------------------------------------------------------------
 * My account sidebar
 * ------------------------------------------------------------------------------------------------
 */

if( ! function_exists( 'kitgreen_before_my_account_navigation' ) ) {
	function kitgreen_before_my_account_navigation() {
		echo '<div class="jws-my-account-sidebar">';
		the_title( '<h3 class="woocommerce-MyAccount-title entry-title">', '</h3>' );
	}

	add_action( 'woocommerce_account_navigation', 'kitgreen_before_my_account_navigation', 1 );
}

if( ! function_exists( 'kitgreen_after_my_account_navigation' ) ) {
	function kitgreen_after_my_account_navigation() {
		$sidebar_name = 'sidebar-my-account';
		if ( is_active_sidebar( $sidebar_name ) ) : ?>
			<aside class="sidebar-container" role="complementary">
				<div class="sidebar-inner">
					<div class="widget-area">
						<?php dynamic_sidebar( $sidebar_name ); ?>
					</div><!-- .widget-area -->
				</div><!-- .sidebar-inner -->
			</aside><!-- .sidebar-container -->
		<?php endif;
		echo '</div><!-- .kitgreen-my-account-sidebar -->';
	}

	add_action( 'woocommerce_account_navigation', 'kitgreen_after_my_account_navigation', 30 );
}
/**
* @snippet Remove the Postcode Field on the WooCommerce Checkout
* @how-to Watch tutorial @ https://businessbloomer.com/?p=19055
* @sourcecode https://businessbloomer.com/?p=461
* @author Rodolfo Melogli
* @testedwith WooCommerce 2.5.5
*/
 
add_filter( 'woocommerce_checkout_fields' , 'bbloomer_remove_billing_postcode_checkout' );
 
function bbloomer_remove_billing_postcode_checkout( $fields ) {
  unset($fields['account']['account_username']);
  unset($fields['account']['account_password']);
  unset($fields['account']['account_password-2']);
  unset($fields['billing']['billing_address_2']);
  return $fields;
}
/**
 * Auto update cart after quantity change
 *
 * @return  string
 **/
  /*
	 *	Get cart contents count
	 */
	function nm_get_cart_contents_count() {
        $cart_count = apply_filters( 'nm_cart_count', WC()->cart->cart_contents_count );
        $count_class = ( $cart_count > 0 ) ? '' : ' jws-count-zero';
        
		return '<span class="jws-menu-cart-count count' . $count_class . '">' . $cart_count . '</span>';
	}
    /*
	 *	Cart: Get refreshed header fragment
	 */
	if ( ! function_exists( 'nm_header_add_to_cart_fragment' ) ) {
		function nm_header_add_to_cart_fragment( $fragments ) {
            $cart_count = nm_get_cart_contents_count();
			$fragments['.count'] = $cart_count;
            
			return $fragments;
		}
	}
	add_filter( 'woocommerce_add_to_cart_fragments', 'nm_header_add_to_cart_fragment' ); // Ensure cart contents update when products are added to the cart via Ajax
	
    function nm_get_cart_fragments( $return_array = array() ) {
		// Get cart count
		$cart_count = nm_header_add_to_cart_fragment( array() );
		
		// Get cart panel
		ob_start();
		woocommerce_mini_cart();
		$cart_panel = ob_get_clean();
		
		return apply_filters( 'woocommerce_add_to_cart_fragments', array(
			'.count' 				=> reset( $cart_count ),
			'div.widget_shopping_cart_content'	=> '<div class="widget_shopping_cart_content">' . $cart_panel . '</div>'
		) );
	}
    /*
	 *	Cart: Get refreshed hash
	 */
	function nm_get_cart_hash() {
		return apply_filters( 'woocommerce_add_to_cart_hash', WC()->cart->get_cart_for_session() ? md5( json_encode( WC()->cart->get_cart_for_session() ) ) : '', WC()->cart->get_cart_for_session() );
	}
	/*
	 *	Cart panel: AJAX - Remove product from cart
	 */
	function nm_cart_panel_remove_product() {
		$cart_item_key = $_POST['cart_item_key'];
		
		$cart = WC()->instance()->cart;
		$removed = $cart->remove_cart_item( $cart_item_key ); // Note: WP 2.3 >
        
		if ( $removed )	{
			$json_array['status'] = '1';
			
            // Not replacing whole cart-panel by default (thumbnails "flicker" when they're replaced)
            if ( defined( 'NM_CART_PANEL_REPLACE' ) ) {
                $json_array['fragments'] = nm_get_cart_fragments();
            } else {
                $json_array['fragments'] = apply_filters( 'woocommerce_add_to_cart_fragments', array(
                    '.jws-menu-cart-count'                              => nm_get_cart_contents_count(), // Cart count
                    '.jws-mini-cart .jws-cart-panel-summary-subtotal' => '<span class="jws-cart-panel-summary-subtotal">' . WC()->cart->get_cart_subtotal() . '</span>' // Cart subtotal
                ) );
            }
			
            $json_array['cart_hash'] = nm_get_cart_hash();
		} else {
			$json_array['status'] = '0';
		}
		
		echo json_encode( $json_array );
				
		exit;
	}
	add_action( 'wp_ajax_nm_cart_panel_remove_product' , 'nm_cart_panel_remove_product' );
	add_action( 'wp_ajax_nopriv_nm_cart_panel_remove_product', 'nm_cart_panel_remove_product' );
    /*
	 *	Cart panel: AJAX - Update quantity
	 */
	function nm_cart_panel_update_quantity() {
        $nm_json_array = array();
        
        // WooCommerce: Code copied from the "../woocommerce/includes/class-wc-form-handler.php" source file
        $cart_updated = false;
        $cart_totals  = isset( $_POST['cart'] ) ? $_POST['cart'] : '';

        //if ( ! WC()->cart->is_empty() && is_array( $cart_totals ) ) {
        if ( is_array( $cart_totals ) ) {
            foreach ( WC()->cart->get_cart() as $cart_item_key => $values ) {

                $_product = $values['data'];

                // Skip product if no updated quantity was posted
                if ( ! isset( $cart_totals[ $cart_item_key ] ) || ! isset( $cart_totals[ $cart_item_key ]['qty'] ) ) {
                    continue;
                }

                // Sanitize
                $quantity = apply_filters( 'woocommerce_stock_amount_cart_item', wc_stock_amount( preg_replace( "/[^0-9\.]/", '', $cart_totals[ $cart_item_key ]['qty'] ) ), $cart_item_key );

                if ( '' === $quantity || $quantity == $values['quantity'] )
                    continue;

                // Update cart validation
                $passed_validation 	= apply_filters( 'woocommerce_update_cart_validation', true, $cart_item_key, $values, $quantity );

                // is_sold_individually
                if ( $_product->is_sold_individually() && $quantity > 1 ) {
                    //wc_add_notice( sprintf( __( 'You can only have 1 %s in your cart.', 'kitgreen' ), $_product->get_title() ), 'error' );
                    $passed_validation = false;
                }

                if ( $passed_validation ) {
                    WC()->cart->set_quantity( $cart_item_key, $quantity, false );
                    $cart_updated = true;
                    
                    // NM
                    // Save "cart item key" ("$cart_item_key" is overwritten)
                    $nm_cart_item_key = $cart_item_key;
                    // Code from "../kitgreen/woocommerce/cart/cart.php" (variable names changed)
                    $nm_cart_item_subtotal = apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $quantity ), $values, $cart_item_key );
                    // /NM
                }

            }
        }
        
        // Trigger action - let 3rd parties update the cart if they need to and update the $cart_updated variable
        $cart_updated = apply_filters( 'woocommerce_update_cart_action_cart_updated', $cart_updated );

        if ( $cart_updated ) {
            // Recalc our totals
            WC()->cart->calculate_totals();
            
            // NM
            $nm_json_array['status'] = '1';
			$nm_json_array['fragments'] = apply_filters( 'woocommerce_add_to_cart_fragments', array(
                '.menu-cart-count'                                                       => nm_get_cart_contents_count(), // Cart count
                '#jws-cart-panel-item-' . $nm_cart_item_key . ' .jws-cart-panel-item-price'   => '<div class="jws-cart-panel-item-price">' . $nm_cart_item_subtotal .  '</div>', // Cart item subtotal
                '.jws-mini-cart  .jws-cart-panel-summary-subtotal'                          => '<span class="jws-cart-panel-summary-subtotal">' . WC()->cart->get_cart_subtotal() . '</span>' // Cart subtotal
            ) );
        } else {
            $nm_json_array['status'] = '0';
		}
        // /NM
        // /WooCommerce
        
        echo json_encode( $nm_json_array );
        
		exit;
	}
	add_action( 'wp_ajax_nm_cart_panel_update' , 'nm_cart_panel_update_quantity' );
	add_action( 'wp_ajax_nopriv_nm_cart_panel_update', 'nm_cart_panel_update_quantity' );  