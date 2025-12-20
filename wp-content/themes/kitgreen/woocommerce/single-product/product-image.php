<?php
/**
 * Single Product Image
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/product-image.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// Get page options
$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );

// Get product single style
$style = ( is_array( $options ) && $options['wc-single-style'] ) ? $options['wc-single-style'] : ( cs_get_option( 'wc-single-style' ) ? cs_get_option( 'wc-single-style' ) : '1' );
$class_lo2 = '';
$data_masonry = '';
if($style == 3) {
  $class_lo2 = 'jws-masonry item-product'; 
  $data_masonry = 'data-masonry=\'{"selector":".woocommerce-product-gallery__image",  "layoutMode":"masonry"}\''; 
}
$thumb_position = ( is_array( $options ) && $options['wc-single-style'] == 1 && $options['wc-thumbnail-position'] ) ? $options['wc-thumbnail-position'] : ( cs_get_option( 'wc-thumbnail-position' ) ? cs_get_option( 'wc-thumbnail-position' ) : 'left' );
$classes        = array(  );
if ( $thumb_position && $style == 1 ) {
	$classes[] = $thumb_position;
}
  $data_slick = 'data-slick=\'{ "slidesToScroll": 1, "asNavFor": ".thumbnails", "fade":true}\'';  

global $post, $product;
$columns           = apply_filters( 'woocommerce_product_thumbnails_columns', 4 );
$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
$full_size_image   = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
$image_title       = get_post_field( 'post_excerpt', $post_thumbnail_id );
$placeholder       = has_post_thumbnail() ? 'with-images' : 'without-images';
$wrapper_classes   = apply_filters(
	'woocommerce_single_product_image_gallery_classes', array(
		'woocommerce-product-gallery',
		'woocommerce-product-gallery--' . $placeholder,
		'woocommerce-product-gallery--columns-' . absint( $columns ),
		'images',
		'kitgreen-images'
	)
);
$gallery = get_post_gallery( get_the_ID(), false );

// Get page options
$options = get_post_meta( get_the_ID(), '_custom_wc_options', true );
?>
<div class="product-images-content <?php if(!$product->get_gallery_image_ids()) {echo "no_galley";} ?> <?php echo esc_attr( implode( ' ', $classes ) ); ?>" id="product-images-content ">
	<div class="<?php echo esc_attr( implode( ' ', array_map( 'sanitize_html_class', $wrapper_classes ) ) ); ?>" data-columns="<?php echo esc_attr( $columns ); ?>" >
     <?php 
    do_action('woocommerce_show_product_sale_flash');
     ?>
		<figure class="woocommerce-product-gallery__wrapper   <?php echo wp_kses_post( $class_lo2); ?>" id="<?php if($style == 1 )  { echo "product-images"; } ?>" <?php echo wp_kses_post( $data_masonry); ?>  >
			<?php
			$attributes = array(
				'title'                   => $image_title,
				'data-src'                => $full_size_image[0],
				'data-large_image'        => $full_size_image[0],
				'data-large_image_width'  => $full_size_image[1],
				'data-large_image_height' => $full_size_image[2],
			);

			if ( has_post_thumbnail() ) {
				$html = '<div data-thumb="' . get_the_post_thumbnail_url( $post->ID, 'shop_thumbnail' ) . '" class="woocommerce-product-gallery__image jws-image-zoom "><a class="photoswipe" href="' . esc_url( $full_size_image[0] ) . '">';
				$html .= get_the_post_thumbnail( $post->ID, 'shop_single', $attributes );
				$html .= '</a></div>';
			} else {
				$html = '<div class="woocommerce-product-gallery__image--placeholder">';
				$html .= sprintf( '<img src="%s" alt="%s" class="wp-post-image" />', esc_url( wc_placeholder_img_src() ), esc_html__( 'Awaiting product image', 'kitgreen' ) );
				$html .= '</div>';
			}
            
			echo apply_filters( 'woocommerce_single_product_image_thumbnail_html', $html, get_post_thumbnail_id( $post->ID ) );
            
            
               do_action( 'woocommerce_product_thumbnails' );     
            
			?>
		</figure>
        <div class="product-advanced">

    <?php if ( isset( $options ) && ! empty( $options['wc-single-video-url'] ) ) : ?>
		<div class="ad-item video-popup">
			<?php
	
					echo '<a href="' . esc_url( $options['wc-single-video-url'] ) . '" class="action-popup-url"><i class="pe-7s-play pr"></i>' . esc_html__( 'Watch Video', 'kitgreen' ) . '</a>';

			?>
		</div>
 	  <?php endif; ?>
        <?php 
         if(isset($options['gallery_2'] ) &&  $options['gallery_2']) {
            wp_enqueue_script( '360product', URI_PATH.'/assets/js/dev/360-threesixty.js', array('jquery'), '', true  );
            wp_enqueue_style( '360productcss', URI_PATH.'/assets/css/360product.css', false );
            wp_enqueue_style( 'video-popup', URI_PATH.'/assets/css/css_jws/magnific-popup.css', false );
            wp_enqueue_script( 'popup', URI_PATH.'/assets/js/dev/jquery.magnific-popup.min.js', array('jquery'), '', true  );
         if( ! empty( $options['gallery_2']) ) {              
         $ids = explode( ',', $options['gallery_2']);
         $i = '';                   
         foreach ( $ids as $id ) {
            $i++;
         }   
         }
        ?>
        <div class="360-image ad-item text-center">
        <a href="#360-view"><span class="pe-7s-refresh-2"></span><?php esc_html_e('360 product view' , 'kitgreen') ?></a> 
        </div>
        
        <div class="product-360-view-wrapper threesixty mfp-hide" data-mfp-src="#360-view" id="360-view">
            <div class="360-view-container">
            <div class="spinner">
            <span>0%</span>
            </div>
            <ol class="threesixty_images"> </ol> 
            </div>
            <script style="text/javascript">
                jQuery(document).ready(function ($) {
                    $('.360-image a').magnificPopup({
                		type: 'inline',
                		mainClass: 'mfp-fade',
                		removalDelay: 160,
                		disableOn: false,
                		preloader: false,
                		fixedContentPos: false,
                		callbacks: {
                			open: function() {
                				$(window).resize()
                			},
                		},
                	});
                    $('.360-view-container').ThreeSixty({
                        totalFrames: <?php echo wp_kses_post($i); ?> ,
                        endFrame: <?php echo wp_kses_post($i); ?> ,
                        currentFrame: 1,
                        imgList: '.threesixty_images',
                        progress: '.spinner',
                        imgArray: [<?php 
                            if( ! empty( $options['gallery_2']) ) {
                              $ids = explode( ',', $options['gallery_2']);
                              foreach ( $ids as $id ) {
                                $attachment = wp_get_attachment_image_url( $id, 'full' );
                                echo "'" .$attachment. "'" . ",";
                              }
                            
                            }
                        
                         ?>],
                        width: 840,
                        responsive: true,
                        navigation: true
                    });
                });
            </script></div>
        <?php
        } ?></div> 
	</div>
    <?php if($thumb_position != 'outside' ) {
	do_action( 'kitgreen_after_single_product_image' ); }
    ?>
    
    
</div>