<?php
/**
 * Shortcode attributes
 * @var $atts
 * @var $title
 * @var $onclick
 * @var $custom_links
 * @var $custom_links_target
 * @var $img_size
 * @var $images
 * @var $el_class
 * @var $mode
 * @var $slides_per_view
 * @var $wrap
 * @var $autoplay
 * @var $hide_pagination_control
 * @var $hide_prev_next_buttons
 * @var $speed
 * @var $partial_view
 * @var $css
 * Shortcode class
 * @var $this WPBakeryShortCode_VC_images_carousel
 */
$title = $onclick = $custom_links = $custom_links_target =
$img_size = $images = $el_class = $mode = $slides_per_view =
$wrap = $autoplay = $hide_pagination_control =
$hide_prev_next_buttons = $speed = $partial_view = $css = '';

$output = '';
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
extract( $atts );

$gal_images = '';
$link_start = '';
$link_end = '';
$el_start = '';
$el_end = '';
$slides_wrap_start = '';
$slides_wrap_end = '';
$pretty_rand = 'link_image' === $onclick ? ' rel="prettyPhoto[rel-' . get_the_ID() . '-' . rand() . ']"' : '';

// wp_enqueue_script( 'vc_carousel_js' );
wp_enqueue_style( 'vc_carousel_css' );
if ( 'link_image' === $onclick ) {
	wp_enqueue_script( 'prettyphoto' );
	wp_enqueue_style( 'prettyphoto' );
}

if ( '' === $images ) {
	$images = '-1,-2,-3';
}

if ( 'custom_link' === $onclick ) {
	$custom_links = explode( ',', $custom_links );
}

$images = explode( ',', $images );
$i = - 1;

$class_to_filter = 'wpb_images_carousel wpb_content_element vc_clearfix';
$class_to_filter .= vc_shortcode_custom_css_class( $css, ' ' ) . $this->getExtraClass( $el_class );
$css_class = apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, $class_to_filter, $this->settings['base'], $atts );

$carousel_id = 'vc_images-carousel-' . WPBakeryShortCode_VC_images_carousel::getCarouselIndex();
$slider_width = $this->getSliderWidth( $img_size );
wp_enqueue_script( 'carousel', URI_PATH.'/assets/js/js_jws/owl.carousel.min.js', array('jquery'), '', true  );
        wp_enqueue_style( 'carousel-css', URI_PATH.'/assets/css/css_jws/owl.carousel.css', false );
//wp_enqueue_script( 'sider-carousel-start-js', URI_PATH.'/assets/js/start-owl.js', array('jquery'), '', true  );
?>
<div
	class="<?php echo esc_attr( apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, $css_class, $this->settings['base'], $atts ) ); ?>">
	<div class="wpb_wrapper">
		<?php echo wpb_widget_title( array( 'title' => $title, 'extraclass' => 'wpb_gallery_heading' ) ) ?>
		<div id="<?php echo wp_kses_post($carousel_id) ?>" data-ride="vc_carousel"
		     data-wrap="<?php echo 'yes' === $wrap ? 'true' : 'false' ?>" style="width: <?php echo wp_kses_post($slider_width) ?>;"
		     data-interval="<?php echo 'yes' === $autoplay ? $speed : 0 ?>" data-auto-height="yes"
		     data-mode="<?php echo wp_kses_post($mode) ?>" data-partial="<?php echo 'yes' === $partial_view ? 'true' : 'false' ?>"
		     data-per-view="<?php echo wp_kses_post($slides_per_view) ?>"
		     data-hide-nav="<?php echo wp_kses_post($hide_prev_next_buttons ==='yes' ? 'true' : 'false');?>"
		     data-hide-on-end="<?php echo 'yes' === $autoplay ? 'false' : 'true' ?>" class="vc_slide vc_images_carousel">
			<?php if ( 'yes' !== $hide_pagination_control ) :  ?>
				<!-- Indicators -->
				<ol class="vc_carousel-indicators">
					<?php for ( $z = 0; $z < count( $images ); $z ++ ) :  ?>
						<li data-target="#<?php echo wp_kses_post($carousel_id) ?>" data-slide-to="<?php echo wp_kses_post($z) ?>"></li>
					<?php endfor; ?>
				</ol>
			<?php endif ?>
			<!-- Wrapper for slides -->
			<div class="vc_carousel-inner">
				<div class="vc_carousel-slideline">
					<div class="vc_carousel-slideline-inner">
						<?php foreach ( $images as $attach_id ) :  ?>
							<?php
							$i ++;
							if ( $attach_id > 0 ) {
								$post_thumbnail = wpb_getImageBySize( array(
									'attach_id' => $attach_id,
									'thumb_size' => $img_size,
								) );
							} else {
								$post_thumbnail = array();
								$post_thumbnail['thumbnail'] = '<img src="' . vc_asset_url( 'vc/no_image.png' ) . '" />';
								$post_thumbnail['p_img_large'][0] = vc_asset_url( 'vc/no_image.png' );
							}
							$thumbnail = $post_thumbnail['thumbnail'];
							?>
							<div class="vc_item">
								<div class="vc_inner">
									<?php if ( 'link_image' === $onclick ) :  ?>
										<?php $p_img_large = $post_thumbnail['p_img_large']; ?>
										<a class="prettyphoto"
										   href="<?php echo wp_kses_post($p_img_large[0]) ?>" <?php echo wp_kses_post($pretty_rand); ?>>
											<?php echo wp_kses_post($thumbnail) ?>
										</a>
									<?php elseif ( 'custom_link' === $onclick && isset( $custom_links[ $i ] ) && '' !== $custom_links[ $i ] ) :  ?>
										<a
											href="<?php echo wp_kses_post($custom_links[ $i ]) ?>"<?php echo wp_kses_post(( ! empty( $custom_links_target ) ? ' target="' . $custom_links_target . '"' : '' )) ?>>
											<?php echo wp_kses_post($thumbnail) ?>
										</a>
									<?php else : ?>
										<?php echo wp_kses_post($thumbnail) ?>
									<?php endif ?>
								</div>
							</div>
						<?php endforeach ?>
					</div>
				</div>
			</div>
			<?php if ( 'yes' === $hide_prev_next_buttons ) echo '<div style="visibility:hidden">'; ?>
				<!-- Controls -->
				<a class="vc_left vc_carousel-control" href="#<?php echo wp_kses_post($carousel_id) ?>" data-slide="prev">
					<span class="icon-prev"></span>
				</a>
				<a class="vc_right vc_carousel-control" href="#<?php echo wp_kses_post($carousel_id) ?>" data-slide="next">
					<span class="icon-next"></span>
				</a>
			<?php if ( 'yes' === $hide_prev_next_buttons ) echo '</div>'; ?>
		</div>
	</div>
</div>
   <script>
           	    jQuery(document).ready(function($) {
            	function jws_theme_owl_carousel(){
			// setTimeout(function(){
			 $( window ).resize(function() {
				$('.vc_images_carousel').each(function(){
					var _this = $(this),
						items = _this.data('per-view'),
						show_nav = ! _this.data('hide-nav');
					   _this.find('.vc_carousel-slideline-inner').owlCarousel({
						items:items,
						loop:true,
						navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
						dots:true,
						responsiveClass:true,
						responsive:{
							0:{
								items:(2 < items) ? 2 : items,
							},
							768:{
								items:(3 < items) ? 3 : items,
							},
							992:{
								items:( 4 < items) ? 4 : items,
								nav:show_nav
							},
                            1200:{
								items:( 2 < items) ? 2 : 2,
								nav:show_nav
							},
							1560:{
								items:items,
								nav:show_nav,
							}
						}
					});
				})});

			// }, 1000);
		};
          jws_theme_owl_carousel();                                                                                 
               	});
            </script>
