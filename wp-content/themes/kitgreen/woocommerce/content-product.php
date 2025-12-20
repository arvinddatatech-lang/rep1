<?php
/**
 * The template for displaying product content within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product.php
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $product, $woocommerce_loop;
// Get product options
$options = get_post_meta( get_the_ID(), '_custom_wc_thumb_options', true );
$options2 = get_post_meta( get_the_ID(), '_custom_wc_options', true );
$layout = cs_get_option( 'wc-style' ) ;
$columns_layout = "";
if( isset( $_GET['columns'] ) && $_GET['columns'] == "2" ){ 
    $columns_layout = "6";
}elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "3") {
    $columns_layout = "4";
}elseif(isset( $_GET['columns'] ) && $_GET['columns'] == "4") {
    $columns_layout = "3";
}else {
    $columns_layout =  cs_get_option( 'wc-column' ) ;
};
$content_layout =  cs_get_option( 'content-inner' ) ;
$metro = '';
   $attributes = $product->get_attributes(); 
if ( ! $attributes ) {
       $attributes = "";
}
// Flip thumbnail
$flip_thumb =  cs_get_option( 'wc-flip-thumb' );
if ( isset( $options['wc-thumbnail-size'] ) && $options['wc-thumbnail-size']  && $layout == 'metro'  )  {
	$large = 2;
	$metro = ' metro-item';
} else {
	$large = 1;
}

// Ensure visibility
if ( ! $product || ! $product->is_visible() )
	return;
$class_see = '';
if($content_layout) {
    $class_see = "inner-flip";
}
$start_row = $end_row = $woo_columns = '';

// Extra post classes
$classes = array();
$classes[] = 'tb-product-items';

?>
<?php
 
		$woo_columns = "tb-products-grid ".$class_see." col-md-" . (int) $columns_layout * $large . $metro . " col-sm-6 col-xs-12 col-xs-66 ";



?>
<div class="<?php echo esc_attr($woo_columns); ?>">
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
        <?php if($content_layout): ?>
        <div class="content-inner-bt">
             <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            <?php
            do_action('woocommerce_template_loop_price');  
    		?>
        </div>
        <?php endif; ?>
        </div>
        <?php
				if ( isset($options2['wc-attr']) && $options2['wc-attr'] ) {
					echo '<div class="product-attr">';
		
							foreach ( $options2['wc-attr'] as $attr ) {
							$attr_op = 'pa_' . $attr;
							foreach ( $attributes as $attribute ) {
								$values = wc_get_product_terms( absint( $product->get_id() ), $attribute['name'], array( 'fields' => 'names' ) );
								if ( $attr_op == $attribute['name'] ) {
									echo apply_filters( 'woocommerce_attribute', wpautop( wptexturize( implode( ', ', $values ) ) ), $attribute, $values );
								}
							}
						  }
						
					echo '</div>';
				} ?>
	</div>
    <?php if(!$content_layout): ?>
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
    <?php endif; ?>
</article>
</div>