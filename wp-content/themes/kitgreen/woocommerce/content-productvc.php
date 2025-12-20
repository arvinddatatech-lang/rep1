<?php
/**
 * The template for displaying product content within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product.php
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $product, $woocommerce_loop;
// Get product options
$options2 = get_post_meta( get_the_ID(), '_custom_wc_options', true );
$layout = cs_get_option( 'wc-style' ) ;
$flip_thumb = cs_get_option( 'wc-flip-thumb' );
$metro = '';
   $attributes = $product->get_attributes(); 
if ( ! $attributes ) {
       $attributes = "";
}

// Ensure visibility
if ( ! $product || ! $product->is_visible() )
	return;

// Extra post classes
$classes = array();
$classes[] = 'tb-product-items';

?>
<article <?php post_class(); ?>>
	<div class="product-thumb">
                                <div class="overlay-loader">
                                    <div>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
	       <?php

					echo '<a  href="' . esc_url( get_permalink() ) . '">';
						/**
						 * woocommerce_before_shop_loop_item_title hook.
						 *
						 * @hooked woocommerce_show_product_loop_sale_flash - 10
						 * @hooked woocommerce_template_loop_product_thumbnail - 10
						 */
						do_action( 'woocommerce_before_shop_loop_item_title' );
                        if ( $flip_thumb ) {
                        if ( version_compare( WC_VERSION, '3.0.0', '<' ) ) {
                        	$attachment_ids = $product->get_gallery_image_ids();
                        } else {
                        	$attachment_ids = $product->get_gallery_image_ids();
                        }
                        if ( isset( $attachment_ids[0] ) ) {

                    		$attachment_id = $attachment_ids[0];
                    
                    		$title = get_the_title();
                    		$link  = get_the_permalink();
                    		$image = wp_get_attachment_image( $attachment_id, 'shop_catalog' );
                    
                    		echo apply_filters( 'woocommerce_single_product_image_thumbnail_html', sprintf( '<a href="%s" class="gallery" title="%s">%s</a>', $link, $title, $image ), $attachment_id, $post->ID );
                    	}
                        }
					echo '</a>';
				
			?>
        <div class="inner">
        <div class="btn-inner-center">
            <?php 
                do_action('woocommerce_template_loop_add_to_cart');
                echo '<a href="' . $product->get_permalink() . '"  class="product-quick-view"><span class="ion-android-search"></span></a>';
                if( function_exists('YITH_WCWL') ){
                    echo kitgreen_wishlist_btn();
                }  
             ?>
        </div>
        </div>
	   </div>
    	<div class="product-content">
            <div class="item-top">
                <h6 class="product-title"> <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
                <?php //do_action( 'woocommerce_after_shop_loop_item' ); ?>
            </div>
            <div class="item-bottom">
    		<?php
            do_action('woocommerce_template_loop_price');
            $rating_count = $product->get_rating_count();
            if ( $rating_count > 0 ) {
               echo wc_get_rating_html( $product->get_average_rating() ); 
                ?> <span>( <?php echo wp_kses_post($rating_count); esc_html_e(" reviews" , "kitgreen");  ?> )</span><?php 
            }
            
    		?>
            </div>
    	</div>
</article>