<?php
/**
 * Content Wrappers
 *
 * @see woocommerce_output_content_wrapper()
 * @see woocommerce_output_content_wrapper_end()
 */
add_action( 'woocommerce_output_content_wrapper', 'woocommerce_output_content_wrapper', 10 );
add_action( 'woocommerce_output_content_wrapper_end', 'woocommerce_output_content_wrapper_end', 10 );
/**
 * @see woocommerce_breadcrumb()
 */
add_action( 'woocommerce_breadcrumb', 'woocommerce_breadcrumb', 20, 0 );

/**
 * @hooked woocommerce_template_loop_product_link_open - 10
 */
add_action( 'woocommerce_template_loop_product_link_open', 'woocommerce_template_loop_product_link_open', 10 );
/**
 * @hooked woocommerce_template_loop_product_link_close - 5
 */
add_action( 'woocommerce_template_loop_product_link_close', 'woocommerce_template_loop_product_link_close', 5 );
/**
 * @hooked woocommerce_show_product_loop_sale_flash - 10
 */
add_action( 'woocommerce_show_product_loop_sale_flash', 'woocommerce_show_product_loop_sale_flash', 10 );
/**
 * @hooked woocommerce_template_loop_product_thumbnail - 10
 */
add_action( 'woocommerce_template_loop_product_thumbnail', 'woocommerce_template_loop_product_thumbnail', 10 );
/**
 * @hooked woocommerce_template_loop_product_title - 10
 */
add_action( 'woocommerce_template_loop_product_title', 'woocommerce_template_loop_product_title', 10 );
/**
 * @hooked woocommerce_template_loop_rating - 5
 */
add_action( 'woocommerce_template_loop_rating', 'woocommerce_template_loop_rating', 5 );
 /**
 * @hooked woocommerce_template_loop_price - 10
 */
add_action( 'woocommerce_template_loop_price', 'woocommerce_template_loop_price', 10 );
/**
 * @hooked woocommerce_template_loop_add_to_cart - 10
 */
add_action( 'woocommerce_template_loop_add_to_cart', 'woocommerce_template_loop_add_to_cart', 10 );

/**
 * @hooked woocommerce_show_product_sale_flash - 10
 */
add_action( 'woocommerce_show_product_sale_flash', 'woocommerce_show_product_sale_flash', 10 );
 /**
 * @hooked woocommerce_show_product_images - 20
 */
add_action( 'woocommerce_show_product_images', 'woocommerce_show_product_images', 20 );
/**
 * @hooked woocommerce_template_single_title - 5
 */
add_action( 'woocommerce_template_single_title', 'woocommerce_template_single_title', 5 );	
/**
 * @hooked woocommerce_template_single_rating - 10
 */
add_action( 'woocommerce_template_single_rating', 'woocommerce_template_single_rating', 10 );	
/**
 * @hooked woocommerce_template_single_price - 10
 */
add_action( 'woocommerce_template_single_price', 'woocommerce_template_single_price', 10 );
/**
 * @hooked woocommerce_template_single_excerpt - 20
 */
add_action( 'woocommerce_template_single_excerpt', 'woocommerce_template_single_excerpt', 20 );
/**
 * @hooked woocommerce_template_single_add_to_cart - 30
 */
add_action( 'woocommerce_template_single_add_to_cart', 'woocommerce_template_single_add_to_cart', 30 );
/**
 * @hooked woocommerce_template_single_meta - 40
 */
add_action( 'woocommerce_template_single_meta', 'woocommerce_template_single_meta', 40 );
/**
 * @hooked woocommerce_template_single_sharing - 50
 */
add_action( 'woocommerce_template_single_sharing', 'woocommerce_template_single_sharing', 50 );
/**
 * @hooked woocommerce_output_product_data_tabs - 10
 */
add_action( 'woocommerce_output_product_data_tabs', 'woocommerce_output_product_data_tabs', 10 );
/**
 * @hooked woocommerce_upsell_display - 15
 */
add_action( 'woocommerce_upsell_display', 'woocommerce_upsell_display', 15 );
/**
 * @hooked woocommerce_output_related_products - 20
 */
add_action( 'woocommerce_output_related_products', 'woocommerce_output_related_products', 20 );
