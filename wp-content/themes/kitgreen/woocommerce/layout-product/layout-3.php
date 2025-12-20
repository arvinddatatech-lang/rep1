<?php
/**
 * The template for displaying product content in the single-product.php template
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-single-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you (the theme developer).
 * will need to copy the new files to your theme to maintain compatibility. We try to do this.
 * as little as possible, but it does happen. When this occurs the version of the template file will.
 * be bumped and the readme will list any important changes.
 *
 * @see 	    http://docs.woothemes.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
global $product;
$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );
wp_enqueue_script( 'stiky-sidebar', URI_PATH.'/assets/js/dev/jquery.sticky.js', array('jquery'), '', true  );
wp_enqueue_script( 'move-start', URI_PATH.'/assets/js/dev/start_move.js', array('jquery'), '', true  );
// Get image to display size guide
$banner = ( isset( $options['wc-single-banner'] ) && $options['wc-single-banner'] ) ? $options['wc-single-banner'] : cs_get_option( 'wc-single-banner' );
?>

<?php
	/**
	 * woocommerce_before_single_product hook.
	 *
	 * @hooked wc_print_notices - 10
	 */
	do_action( 'woocommerce_before_single_product' );

	if ( post_password_required() ) { echo get_the_password_form(); return;  }
?>

<div  id="product-<?php the_ID(); ?>" <?php post_class( ' layout-3 '); ?>> 
    <div class="product-top row row-same-height">
	<div class="content-product-left col-md-6 col-sm-6 col-xs-12">
		          <?php
					/**
					 * woocommerce_before_single_product_summary hook.
					 *
					 * @hooked woocommerce_show_product_sale_flash - 10
					 * @hooked woocommerce_show_product_images - 20
					 */
					do_action( 'woocommerce_before_single_product_summary' );
					?>
	</div>
    <div class="content-product-right col-md-6 col-sm-6 col-xs-12">
            <div class="sticky-move">
				<div class="shop-top">
                        <?php 
                            do_action( 'woocommerce_template_single_title' ); 
                            do_action( 'woocommerce_template_single_price' ); 
                            do_action( 'woocommerce_template_single_rating' );
                         ?>
				</div>
				<div class="shop-bottom action <?php if( !$product->is_type( 'grouped' ) &&  !$product->is_type( 'external' )  ){ echo "quick-view-modal"; } ?> ">
                    <div class="description">
					<?php 
                        the_excerpt();
                    ?>
                    </div>
                    <?php    
                        do_action( 'woocommerce_template_single_add_to_cart' );
                        
                     ?>
                      <?php jws_kitgreen_wc_add_extra_link_after_cart(); ?>
                     <div class="info-product">
                     
                     <?php 
                            do_action('woocommerce_template_single_meta');
                      ?>
                     </div>
				</div>
             </div>   
	</div>
    </div>
    </div>
    <div class="product-bottom row">
    <div class="<?php if(!$banner){ echo 'col-lg-12 col-md-12 col-sm-12 col-xs-12'; } else {echo 'col-lg-9 col-md-9 col-sm-12 col-xs-12';}  ?>">
            <div class="tab-product">
        		<?php do_action( 'woocommerce_output_product_data_tabs' ); ?>
        	</div>
    </div>
    <?php if($banner): ?>
    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-center">
            <div class="banner-product">
                <?php jws_add_banner(); ?>
            </div>
    </div>
    <?php endif; ?>         
    </div>
    <?php 
        echo woocommerce_output_related_products();
     ?>
	<meta itemprop="url" content="<?php the_permalink(); ?>" />
<!-- #product-<?php the_ID(); ?> -->
</div>
<?php do_action( 'woocommerce_after_single_product' ); ?>