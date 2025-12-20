<?php
require_once 'recent-posts-widget-with-thumbnails.php';
require_once 'catgory.php';
require_once 'search-jws.php';
require_once 'portfolio_list.php';

if (class_exists('Woocommerce')) {
	require_once 'minicart-widget.php';
    require_once 'widget_price_woo.php';
    require_once 'contact-header-top.php';
    require_once 'widget_filter_atribute.php';
    require_once 'widget_filter_pric_ajax.php';
    require_once 'product-cat.php';
    require_once 'product-sort-by.php';  
}
/**
 * Register widgets
 *
 * @since  1.0
 *
 * @return void
 */


function kitgreen_insert_widgetss() {
	if ( class_exists( 'WC_Widget' ) ) {
    	insert_widgets( 'kitgreen_Widget_Attributes_Filter' );
	   insert_widgets( 'kitgreen_Price_Filter_List_Widget' );
       insert_widgets( 'WC_Widget_Product_Categories2' );
       insert_widgets( 'kitgreen_Product_SortBy_Widget' );
	}
    
}

add_action( 'widgets_init', 'kitgreen_insert_widgetss' );