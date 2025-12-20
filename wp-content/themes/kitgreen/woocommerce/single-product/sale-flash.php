<?php
/**
 * Single Product Sale Flash
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/sale-flash.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
global $post, $product;
?>
<?php if ( $product->is_on_sale() ) : ?>

	<?php echo apply_filters( 'woocommerce_sale_flash', '<span class="onsale">' . esc_html__( 'Sale!', 'kitgreen' ) . '</span>', $post, $product ); ?>

<?php endif;
/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */
if ( ! $product->is_in_stock() ) {
			echo '<span class="sold-out pa db left">' . esc_html__( 'Sold Out', 'kitgreen' ) . '</span>';
		} else {
			// Get page options
			$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );

			// Get time to set new product (day(s))
			$new = isset( $options['wc-single-new-arrival'] ) ? $options['wc-single-new-arrival'] : '5';

			$postdate      = get_the_time( 'Y-m-d' );
			$postdatestamp = strtotime( $postdate );

			if ( ( time() - ( 60 * 60 * 24 * (int) $new ) ) < $postdatestamp ) {
				echo '<span class="new pa db left">' . esc_html__( 'New', 'kitgreen' ) . '</span>';
			}
		}
?>        