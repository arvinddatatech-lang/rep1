<?php
/**
 * 	NM: The template for including AJAX add-to-cart replacement elements/fragments
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
echo nm_get_cart_contents_count();
woocommerce_mini_cart();
?>
