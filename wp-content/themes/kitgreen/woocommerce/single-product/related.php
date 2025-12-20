<?php
/**
 * Related Products
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/related.php.
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
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $product;
// Get page options
$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );
// Get product single style
$style = ( is_array( $options ) && $options['wc-single-style'] ) ? $options['wc-single-style'] : ( cs_get_option( 'wc-single-style' ) ? cs_get_option( 'wc-single-style' ) : '1' );
if ( empty( $product ) || ! $product->exists() ) {
	return;
}

// Get page options
//$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );

// Get product single style
//$style = ( is_array( $options ) && $options['wc-single-style'] ) ? $options['wc-single-style'] : ( cs_get_option( 'wc-single-style' ) ? cs_get_option( 'wc-single-style' ) : '1' );

if ( version_compare( WC_VERSION, '3.0.0', '<' ) ) {
	$related = $product->get_related( $posts_per_page );
    
	if ( sizeof( $related ) === 0 ) return;

	$args = apply_filters( 'woocommerce_related_products_args', array(
		'post_type'            => 'product',
		'ignore_sticky_posts'  => 1,
		'no_found_rows'        => 1,
		'posts_per_page'       => $posts_per_page,
		'orderby'              => $orderby,
		'post__in'             => $related,
		'post__not_in'         => array( $product->id )
	) );

	$products = new WP_Query( $args );

	if ( $products->have_posts() ) : ?>

		<div class="related product-extra mt__60">
			
			<div class="product-extra-title tc">
				<h2 class="tu mg__0 fs__24 pr dib fwsb"><?php esc_html_e( 'Related product', 'kitgreen' ); ?></h2>
			</div>
		
			<div class="jws-carousel" data-slick='{"slidesToShow": <?php if($style == '1' && isset($options['enble-sidebar']) && $options['enble-sidebar'] ) {echo "3";}else {echo "4";} ?> ,"slidesToScroll": 1,"responsive":[{"breakpoint": 1024,"settings":{"slidesToShow": 3}},{"breakpoint": 480,"settings":{"slidesToShow": 2}}]}'>
            
				<?php while ( $products->have_posts() ) : $products->the_post(); ?>

					<?php wc_get_template_part( 'content', 'product' ); ?>

				<?php endwhile; // end of the loop. ?>
			</div>

		</div>

	<?php endif;
} else {
	if ( $related_products ) : ?>
		<div class="related-product">
			<div class="product-related-title">
                <?php 
                    $title = cs_get_option( 'wc-shortcode-title' );
                   echo do_shortcode(''.$title.'') ;
                 ?>
			</div>

			<div class="jws-carousel row" data-slick='{"slidesToShow":<?php if($style == '1' && isset($options['enble-sidebar']) && $options['enble-sidebar']  ) {echo "3";}else {echo "3";} ?>,"slidesToScroll": 1,"responsive":[{"breakpoint": 1024,"settings":{"slidesToShow": 2}},{"breakpoint": 480,"settings":{"slidesToShow": 1}}]}'>

				<?php
                    
                    
					foreach ( $related_products as $related_product ) :
					 	$post_object = get_post( $related_product->get_id() );
						setup_postdata( $GLOBALS['post'] =& $post_object );

						wc_get_template_part( 'content', 'product' );
					endforeach;
				?>
			</div>
		</div>
	<?php endif;
}

wp_reset_postdata();
