<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you (the theme developer).
 * will need to copy the new files to your theme to maintain compatibility. We try to do this.
 * as little as possible, but it does happen. When this occurs the version of the template file will.
 * be bumped and the readme will list any important changes.
 *
 * @see     http://docs.woothemes.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 2.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product, $woocommerce_loop;

// Store loop count we're currently on
if ( empty( $woocommerce_loop['loop'] ) ) {
	$woocommerce_loop['loop'] = 0;
}

// Store column count for displaying the grid
if ( empty( $woocommerce_loop['columns'] ) ) {
	$woocommerce_loop['columns'] = apply_filters( 'loop_shop_columns', 4 );
}

// Ensure visibility
if ( ! $product || ! $product->is_visible() ) {
	return;
}

// Increase loop count
$woocommerce_loop['loop']++;

// Extra post classes
$classes = array();
if ( 0 === ( $woocommerce_loop['loop'] - 1 ) % $woocommerce_loop['columns'] || 1 === $woocommerce_loop['columns'] ) {
	$classes[] = 'first';
}
if ( 0 === $woocommerce_loop['loop'] % $woocommerce_loop['columns'] ) {
	$classes[] = 'last';
}

switch ($woocommerce_loop['columns']) {
	case 1:
		$classes[] = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
		break;
	case 2:
		$classes[] = 'col-xs-12 col-sm-6 col-md-6 col-lg-6';
		break;
	case 3:
		$classes[] = 'col-xs-12 col-sm-6 col-md-4 col-lg-4';
		break;
	case 4:
		$classes[] = 'col-xs-12 col-sm-6 col-md-3 col-lg-3';
		break;
	default:
		$classes[] = 'col-xs-12 col-sm-6 col-md-3 col-lg-3';
		break;
}

?>
<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
<div class="woocommerce tb-products-grid tpl2 ">
<article <?php post_class(); ?>>
	<div class="bt-thumb">
		<?php
			do_action('woocommerce_template_loop_product_link_open');
			do_action('woocommerce_show_product_loop_sale_flash');
			do_action('woocommerce_template_loop_product_thumbnail');			
			do_action('woocommerce_template_loop_product_link_close');
		?>
	</div>
	<div class="bt-content">
        <?php echo '<span class="line-box"></span>'; ?>
		<?php
			do_action('woocommerce_template_loop_product_link_open');
			do_action('woocommerce_template_loop_product_title');
			do_action('woocommerce_template_loop_product_link_close');
			do_action('woocommerce_template_loop_rating');
			do_action('woocommerce_template_loop_price');
			//do_action('woocommerce_template_loop_add_to_cart');
		?>
	</div>
</article>
</div>
</div>