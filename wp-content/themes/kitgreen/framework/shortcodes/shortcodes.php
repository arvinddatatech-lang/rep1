<?php if ( ! defined('ABSPATH')) exit('No direct script access allowed');

/* ------------------------------------------------------------------------------------------------
* Video Poppup shortcode
* ------------------------------------------------------------------------------------------------
*/
if( ! function_exists( 'kitgreen_shortcode_button' ) ) {
	function kitgreen_shortcode_button( $atts ) {
	   wp_enqueue_style( 'lightbox-css', URI_PATH.'/assets/css/css_jws/lightbox.css', false );
       wp_enqueue_style( 'black-css', URI_PATH.'/assets/css/css_jws/skin/black.css', false );
       wp_enqueue_script( 'lightbox-js', URI_PATH.'/assets/js/dev/lightbox.js', array('jquery'), '', true  );
       wp_enqueue_script( 'lightbox-ac', URI_PATH.'/assets/js/dev/start-video.js', array('jquery'), '', true  );
		extract( shortcode_atts( array(
			'img' 	 => '',
			'link' 	 	 => '',
			'align' 	 => 'center',
			'el_class' 	 => '',
		), $atts) );
        ob_start();
		$btn_class = 'action-popup-url';
		if( $el_class != '' ) {
			$btn_class .= ' ' . $el_class;
		}
        $attrs = "";
		if( $link != '' ) {
			$attrs .= ' href="' . esc_attr( $link ) . '"';
		}
        ?>
		<div class="kitgreen-button-wrapper video-popup text-<?php echo esc_attr( $align ) ?>"><a class=" <?php echo wp_kses_post($btn_class); ?> " <?php echo wp_kses_post($attrs);  ?> data-options="width:1920, height:1080" ><?php echo wp_get_attachment_image($img, 'full'); ?></a></div>
        <?php
        return ob_get_clean(); 
	}

	insert_shortcode( 'kitgreen_button', 'kitgreen_shortcode_button' );
}
        /**
		 * ------------------------------------------------------------------------------------------------
		 *  Demo theme shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
if( ! function_exists( 'kitgreen_shortcode_demo_theme' ) ) {
	function kitgreen_shortcode_demo_theme( $atts ) {
		extract( shortcode_atts( array(
			'img' 	 => '',
			'link' 	 	 => '',
			'name' 	 => '',
		), $atts) );
        ob_start();
        $url = wp_get_attachment_image_url($img, 'full');
        ?>
        <div class="demo_con">
            <a href="<?php echo esc_url($link); ?>" class="demo_theme" style="background-image: url('<?php echo wp_kses_post($url); ?>');">   
            </a>
            <span class="link">
                    <?php echo esc_html($name) ?>
            </span>
        </div>    
        <?php  
        return ob_get_clean(); 
	}

	insert_shortcode( 'kitgreen_demo_theme', 'kitgreen_shortcode_demo_theme' );
}

/**
* ------------------------------------------------------------------------------------------------
* instagram shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_instagram' ) ) {
	function kitgreen_shortcode_instagram( $atts, $content = '' ) {
		$output = '';
        $parsed_atts = shortcode_atts( array_merge( kitgreen_get_owl_atts(), array(
			'title' => '',
			'username' => 'flickr',
			'number' => 9,
            'slides_per_view' => 8 ,
			'size' => 'thumbnail',
			'target' => '_self',
			'link' => '',
			'design' => 'default',
			'space' => 0,
			'rounded' => 0,
			'per_row' => 3,
            'spacing' => '',
		) ), $atts );

        
        extract( $parsed_atts );	

		$carousel_id = 'carousel-' . rand(100,999);

		ob_start();
		$class = 'instagram-widget';


		if( $spacing == 1 ) {
			$class .= ' instagram-with-spaces';
		}

		if( $rounded == 1 ) {
			$class .= ' instagram-rounded';
		}

		$class .= ' instagram-per-row-' . $per_row;

		echo '<div class="' . $class." ".$design.'">';

		if ($username != '') {

	
				?><ul id="<?php echo esc_attr($carousel_id); ?>" class="instagram-pics<?php if( $design == 'slider') echo ' jws-carousel-in'; ?>"  data-token="<?php echo esc_attr($username); ?>" data-number="<?php echo esc_attr($number); ?>" data-target="<?php echo esc_attr($target); ?>"  data-slick='{"slidesToShow": <?php echo wp_kses_post($slides_per_view); ?> , "autoplay": true, "autoplaySpeed": 2000,"slidesToScroll": 1,"responsive":[{"breakpoint": 1024,"settings":{"slidesToShow": 3}},{"breakpoint": 480,"settings":{"slidesToShow": 2}}]}'><?php

				?></ul><?php
		
		}

		if ($link != '') {
			?><p class="clear"><a href="//instagram.com/<?php echo trim($username); ?>" rel="me" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html($link); ?></a></p><?php
		}

	

		echo '</div>';

		$output = ob_get_contents();
		ob_end_clean();

		return $output;

	}

	insert_shortcode( 'kitgreen_instagram', 'kitgreen_shortcode_instagram' );
}



/**
* ------------------------------------------------------------------------------------------------
* Google Map shortcode
* ------------------------------------------------------------------------------------------------
*/
function jwsthemes_maps_render($params) {
    extract(shortcode_atts(array(
    	'api'					=>	'AIzaSyAq7OU88Rn2LmYOJrBKwlhdr7VmoP4oYiY',
    	'address'				=>	'New York, United States',
    	'infoclick'				=>	'',
    	'coordinate'			=>	'',
    	'markercoordinate'		=>	'',
    	'markertitle'			=>	'',
    	'markerdesc'			=>	'',
    	'markerlist'			=>	'',
    	'markericon'			=>	'',
    	'infowidth'				=>	'200',
    	'width' 				=> 	'auto',
    	'height' 				=> 	'350px',
    	'type'					=>	'ROADMAP',
    	'style'					=>	'',
    	'zoom'					=>	'13',
    	'scrollwheel'			=>	'',
    	'pancontrol'			=>	'',
    	'zoomcontrol'			=>	'',
    	'scalecontrol'			=>	'',
    	'maptypecontrol'		=>	'',
    	'streetviewcontrol'		=>	'',
    	'overviewmapcontrol'	=>	'',
	), $params));
	
    /* API Key */
    if(!$api){
        $api = 'AIzaSyAq7OU88Rn2LmYOJrBKwlhdr7VmoP4oYiY';
    }
    $api_js = "https://maps.googleapis.com/maps/api/js?key=$api&sensor=false";
    wp_enqueue_script('maps-googleapis',$api_js,array(),'3.0.0');
    wp_enqueue_script('maps-apiv3', URI_PATH_FR . "/shortcodes/maps.js",array(),'1.0.0');
    /* Map Style defualt */
    $map_styles = array(
    	'Subtle-Grayscale'=>'[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]',
    	'Shades-of-Grey'=>'[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]',
    	'Blue-water'=>'[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]',
    	'Pale-Dawn'=>'[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]',
    	'Blue-Essence'=>'[{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]',
    	'Apple-Maps-esque'=>'[{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}]',
    );
    /* Select Template */
    $map_template = '';
    switch ($style){
    	case '':
    		$map_template = '';
    		break;
    	default:
    		$map_template = rawurlencode($map_styles[$style]);
    		break;
    }
    /* marker render */
    $marker = new stdClass();
    if($markercoordinate){
    	$marker->markercoordinate = $markercoordinate;
    	if($markerdesc || $markertitle){
    	$marker->markerdesc = 	'<div class="ro-maps-info-content">'.
    							'<hp>'.$markertitle.'</p>'.
    							'<span>'.$markerdesc.'</span>'.
    							'</div>';
    	}
    	if($markericon){
    		$marker->markericon = wp_get_attachment_url($markericon);
    	}
    }
    if($markerlist){
    	$marker->markerlist = $markerlist;
    }
    $marker = rawurlencode(json_encode($marker));
    /* control render */
    $controls = new stdClass();
    if($scrollwheel == true){ $controls->scrollwheel = 1; } else { $controls->scrollwheel = 0; }
    if($pancontrol == true){ $controls->pancontrol = true; } else { $controls->pancontrol = false; }
    if($zoomcontrol == true){ $controls->zoomcontrol = true; } else { $controls->zoomcontrol = false; }
    if($scalecontrol == true){ $controls->scalecontrol = true; } else { $controls->scalecontrol = false; }
    if($maptypecontrol == true){ $controls->maptypecontrol = true; } else { $controls->maptypecontrol = false; }
    if($streetviewcontrol == true){ $controls->streetviewcontrol = true; } else { $controls->streetviewcontrol = false; }
    if($overviewmapcontrol == true){ $controls->overviewmapcontrol = true; } else { $controls->overviewmapcontrol = false; }
    if($infoclick == true){ $controls->infoclick = true; } else { $controls->infoclick = false; }
    $controls->infowidth = $infowidth;
    $controls->style = $style;
    $controls = rawurlencode(json_encode($controls));
    /* data render */
    $setting = array(
    	"data-address='$address'",
    	"data-marker='$marker'",
    	"data-coordinate='$coordinate'",
    	"data-type='$type'",
     	"data-zoom='$zoom'",
    	"data-template='$map_template'",
    	"data-controls='$controls'"
    );
    ob_start();
	$maps_id = uniqid('maps-');
    ?>
    <div class="ro_maps">
    	<div id="<?php echo wp_kses_post($maps_id); ?>" class="maps-render" <?php echo implode(' ', $setting); ?> style="width:<?php echo esc_attr($width); ?>;height: <?php echo esc_attr($height); ?>"></div>
    </div>
	<?php
	return ob_get_clean();
}
 insert_shortcode('maps', 'jwsthemes_maps_render'); 
/**
* ------------------------------------------------------------------------------------------------
* Blog shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_blog' ) ) {
	function kitgreen_shortcode_blog( $atts ) {
		global $kitgreen_loop;
	    $parsed_atts = shortcode_atts( array(
	        'post_type'  => 'post',
	        'include'  => '',
	        'custom_query'  => '',
	        'taxonomies'  => '',
	        'pagination'  => '',
	        'parts_title'  => true,
	        'parts_meta'  => true,
	        'parts_text'  => true,
	        'parts_btn'  => true,
	        'items_per_page'  => 12,
	        'offset'  => '',
	        'orderby'  => 'date',
            'blog_design' => 'border-bottom',
	        'order'  => 'DESC',
	        'meta_key'  => '',
	        'exclude'  => '',
	        'ajax_page' => '',
	        'img_size' => 'medium',
            'blog_columns' =>'2',
            'review' => false,
            'like' => false,
            'thumbnail_show' => false,
            'animation' => '',
            'text_remore' => 'Continue Reading',
	    ), $atts );

	    extract( $parsed_atts );

	    $encoded_atts = json_encode( $parsed_atts );
        if ($blog_columns == '2') {
         $class_column = ' col-lg-6 col-md-6 col-sm-12 col-xs-12'; 
         $size_col = "size-6" ;
        }elseif($blog_columns == '3') {
         $class_column = ' col-lg-4 col-md-4 col-sm-6 col-xs-12'; 
         $size_col = "size-4" ;  
        }
        elseif($blog_columns == '4') {
         $class_column = ' col-lg-3 col-md-3 col-sm-6 col-xs-12'; 
         $size_col = "size-3" ;   
        }elseif($blog_columns == '5'){
        $class_column = 'col-lg-55 col-sm-6 col-xs-12'; 
        $size_col = "size-5" ;      
        }elseif($blog_columns == '6'){
        $class_column = ' col-lg-2 col-md-2 col-sm-6 col-xs-12'; 
        $size_col = "size-2" ;      
        }else {
          $class_column = ' col-lg-12 col-md-12 col-sm-16 col-xs-12'; 
        $size_col = "size-1" ;   
        }
	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);
      
        $animation_classes = getCSSAnimation( $animation );
	    $output = '';

		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

		if( $ajax_page > 1 ) $paged = $ajax_page;

	    $args = array(
	    	'post_type' => ''.$post_type.'',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => $items_per_page
		);
		if( $post_type == 'ids' && $include != '' ) {
			$args['post__in'] = explode(',', $include);
		}
       
		if( ! empty( $exclude ) ) {
			$args['post__not_in'] = explode(',', $exclude);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies( $post_type );
            
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
		));
                
		if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}

		if( ! empty( $order ) ) {
			$args['order'] = $order;
		}

		if( ! empty( $offset ) ) {
			$args['offset'] = $offset;
		}

		if( ! empty( $meta_key ) ) {
			$args['meta_key'] = $meta_key;
		}

		if( ! empty( $orderby ) ) {
			$args['orderby'] = $orderby;
		}

	    $blog_query = new WP_Query($args);

	    ob_start();
       
        
	    $kitgreen_loop['img_size'] = $img_size;
        $kitgreen_loop['like'] = $like;
        $kitgreen_loop['review'] = $review;
        $kitgreen_loop[ 'thumbnail_show'] = $thumbnail_show;
        $kitgreen_loop[ 'text_remore'] = $text_remore;
	    $kitgreen_loop['loop'] = 0;
    
	    $kitgreen_loop['parts']['title'] = $parts_title;
	    $kitgreen_loop['parts']['meta'] = $parts_meta;
	    $kitgreen_loop['parts']['text'] = $parts_text;
     
	    if( ! $parts_btn )
    	$kitgreen_loop['parts']['btn'] = false;
        $class = 'jws-masonry '.$blog_design.$animation_classes.'';
    	$data  = 'data-masonry=\'{"selector":".post-item ", "columnWidth":".grid-sizer","layoutMode":"packery"}\'';
    	$sizer = '<div class="grid-sizer '.$size_col.'"></div>';
	    if(!$is_ajax) echo '<div class="kitgreen-blog-holder row ' . esc_attr( $class) . '" data-paged="1" data-atts="' . esc_attr( $encoded_atts ) . '" '.wp_kses_post( $data ).' >';
	    echo wp_kses_post( $sizer );
		while ( $blog_query->have_posts() ) {
			$blog_query->the_post();
            if( $post_type == 'ids' && $include != '' ) {
    	        ?>
                    <div class="post-item <?php echo wp_kses_post($class_column ); ?>">
                    	<?php get_template_part( 'framework/templates/blog/entry' ); ?>
                    </div>
                   
                <?php 
		    }
            if($blog_design == "border-bottom") {
                ?>
                <div class="post-item layout-2 <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/blog/entry2' ); ?>   
                </div>
            <?php
            }elseif($blog_design == "blog-menu"){
                ?>
                 <div class="post-item layout-4 <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/blog/entry4' ); ?>   
                </div>
                <?php
            }elseif($blog_design == 'image-left') {
              ?>
                 <div class="post-item layout-5 <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/blog/entry5' ); ?>   
                </div>
              <?php  
            }
            else {
                ?>
                 <div class="post-item layout-3 <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/blog/entry3' ); ?>   
                </div>
                <?php
            }
			
		}

    	if(!$is_ajax) echo '</div>';
        
		if ( $blog_query->max_num_pages > 1 && !$is_ajax && ! empty( $pagination ) ) {
			?>
		    	<div class="blog-footer <?php echo esc_attr($blog_design); ?>">
		    		<?php if ($pagination == 'more-btn'): ?>
		    			<a href="#" class=" kitgreen-blog-load-more"><span class="text_label"><?php _e('Load More', 'kitgreen'); ?></span><span class="lnr lnr-arrow-down"></span></a>
                        <p  class="posts-loaded"><?php _e('All Posts Loaded.', 'kitgreen'); ?></p>
	    			<?php elseif( $pagination == 'pagination' ): ?>
		    			<?php query_pagination( $blog_query->max_num_pages ); ?>
		    		<?php endif ?>
		    	</div>
		    <?php 
		}
         ?>
        <?php
	    unset( $kitgreen_loop );
	    
	    wp_reset_postdata();
	    $output .= ob_get_clean();
	    ob_flush();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'items' => $output,
	    		'status' => ( $blog_query->max_num_pages > $paged ) ? 'have-posts' : 'no-more-posts'
	    	);
	    }
	     
	    return $output;

	}

	insert_shortcode( 'kitgreen_blog', 'kitgreen_shortcode_blog' );
}

/**
* ------------------------------------------------------------------------------------------------
* Team shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_team' ) ) {
	function kitgreen_shortcode_team( $atts ) {
		global $kitgreen_loop;
	    $parsed_atts = shortcode_atts( array(
	        'custom_query'  => '',
	        'taxonomies'  => '',
	        'pagination'  => '',
	        'items_per_page'  => 12,
	        'offset'  => '',
	        'orderby'  => 'date',
            'team_design' => 'default',
	        'order'  => 'DESC',
	        'meta_key'  => '',
	        'exclude'  => '',
	        'ajax_page' => '',
	        'img_size' => 'medium',
            'team_columns' =>'2',
            'animation' => '',
	    ), $atts );

	    extract( $parsed_atts );

	    $encoded_atts = json_encode( $parsed_atts );
        if ($team_columns == '2') {
         $class_column = ' col-lg-6 col-md-6 col-sm-12 col-xs-12'; 
         $size_col = "size-6" ;
        }elseif($team_columns == '3') {
         $class_column = ' col-lg-4 col-md-4 col-sm-6 col-xs-12'; 
         $size_col = "size-4" ;  
        }
        elseif($team_columns == '4') {
         $class_column = ' col-lg-3 col-md-3 col-sm-6 col-xs-12'; 
         $size_col = "size-3" ;   
        }elseif($team_columns == '5'){
        $class_column = 'col-lg-5 col-md-2 col-sm-6 col-xs-12'; 
        $size_col = "size-5" ;      
        }elseif($team_columns == '6'){
        $class_column = ' col-lg-2 col-md-2 col-sm-6 col-xs-12'; 
        $size_col = "size-2" ;      
        }else {
          $class_column = ' col-lg-12 col-md-12 col-sm-16 col-xs-12'; 
        $size_col = "size-1" ;   
        }
	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);
      
        $animation_classes = getCSSAnimation( $animation );
	    $output = '';

		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

		if( $ajax_page > 1 ) $paged = $ajax_page;

	    $args = array(
	    	'post_type' => 'team',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => $items_per_page
		);
		if( ! empty( $exclude ) ) {
			$args['post__not_in'] = explode(',', $exclude);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies('team');
            
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
		));
                
		if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}

		if( ! empty( $order ) ) {
			$args['order'] = $order;
		}

		if( ! empty( $offset ) ) {
			$args['offset'] = $offset;
		}

		if( ! empty( $meta_key ) ) {
			$args['meta_key'] = $meta_key;
		}

		if( ! empty( $orderby ) ) {
			$args['orderby'] = $orderby;
		}

	    $blog_query = new WP_Query($args);

	    ob_start();
       
        
	    $kitgreen_loop['img_size'] = $img_size;
	    $kitgreen_loop['loop'] = 0;
    
     
        $class = 'jws-masonry '.$team_design.$animation_classes.'';
    	$data  = 'data-masonry=\'{"selector":".team-item ","layoutMode":"packery"}\'';
    	$sizer = '<div class="grid-sizer '.$size_col.'"></div>';
	    if(!$is_ajax) echo '<div class="kitgreen-team-holder row ' . esc_attr( $class) . '" data-paged="1" data-atts="' . esc_attr( $encoded_atts ) . '" '.wp_kses_post( $data ).' >';
	    
		while ( $blog_query->have_posts() ) {
			$blog_query->the_post();
            if($team_design == "default") {
               ?>
                <div class="team-item <?php echo wp_kses_post($class_column ); ?>">
                	<?php get_template_part( 'framework/templates/team/entry' ); ?>
                </div>
               
            <?php 
            }else {
                ?>
                 <div class="team-item <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/team/entry2' ); ?>   
                </div>
                <?php
            }
			
		}

    	if(!$is_ajax) echo '</div>';
        
		if ( $blog_query->max_num_pages > 1 && !$is_ajax && ! empty( $pagination ) ) {
			?>
		    	<div class="team-footer <?php echo esc_attr($blog_design); ?>">
		    		<?php if ($pagination == 'more-btn'): ?>
		    			<a href="#" class=" kitgreen-blog-load-more"><span class="text_label"><?php _e('LOAD MORE', 'kitgreen'); ?></span><span class="icon ion-ios-arrow-thin-down"></span></a>
                        <p  class="posts-loaded"><?php _e('All Posts Loaded.', 'kitgreen'); ?></p>
	    			<?php elseif( $pagination == 'pagination' ): ?>
		    			<?php query_pagination( $blog_query->max_num_pages ); ?>
		    		<?php endif ?>
		    	</div>
		    <?php 
		}
         ?>
        <?php
	    unset( $kitgreen_loop );
	    
	    wp_reset_postdata();
	    $output .= ob_get_clean();
	    ob_flush();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'items' => $output,
	    		'status' => ( $blog_query->max_num_pages > $paged ) ? 'have-posts' : 'no-more-posts'
	    	);
	    }
	     
	    return $output;

	}

	insert_shortcode( 'kitgreen_team', 'kitgreen_shortcode_team' );
}


/**
* ------------------------------------------------------------------------------------------------
* Team shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_search' ) ) {
	function kitgreen_shortcode_search( $atts ) {
		global $kitgreen_loop;
	    $parsed_atts = shortcode_atts( array(
            'el_class' => '',
	    ), $atts );

	    extract( $parsed_atts );
        
	    $output = '';
	    ob_start();
        ?>
       	<div id="search-modal" class="search-modal search-fix" tabindex="-1" role="dialog">
    		<div class="modal-content">
    				<form method="get" class="instance-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <div class="loading">
    					</div>
    					<div class="search-fields">
    						<input type="text" name="s" placeholder="<?php esc_attr_e( 'Search Product ...', 'kitgreen' ); ?>" class="search-field" autocomplete="off">
    						<input type="hidden" name="post_type" value="product">
    						<span class="search-submit">
                            <button type="submit" class="lnr lnr-magnifier"></button>
    						</span>
    					</div>
    				</form>
    
    				<div class="search-results">
    					<div class="woocommerce"></div>
    				</div>
    		</div>
    	</div>
        <?php

	    $output .= ob_get_clean();
	    ob_flush();
	     
	    return $output;
	}
	insert_shortcode( 'kitgreen_search', 'kitgreen_shortcode_search' );
}



/**
* ------------------------------------------------------------------------------------------------
* Service shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_service' ) ) {
	function kitgreen_shortcode_service( $atts ) {
		global $kitgreen_loop;
	    $parsed_atts = shortcode_atts( array(
	        'custom_query'  => '',
	        'taxonomies'  => '',
	        'pagination'  => '',
	        'items_per_page'  => 12,
	        'offset'  => '',
	        'orderby'  => 'date',
            'service_design' => 'slider',
	        'order'  => 'DESC',
	        'meta_key'  => '',
	        'exclude'  => '',
	        'ajax_page' => '',
	        'img_size' => 'medium',
            'service_columns' =>'2',
            'number_show' => '3',
            'animation' => '',
            'text_more' => 'Continue Reading',
	    ), $atts );

	    extract( $parsed_atts );

	    $encoded_atts = json_encode( $parsed_atts );
        if ($service_columns == '2') {
         $class_column = ' col-lg-6 col-md-6 col-sm-12 col-xs-12'; 
         $size_col = "size-6" ;
        }elseif($service_columns == '3') {
         $class_column = ' col-lg-4 col-md-4 col-sm-6 col-xs-12'; 
         $size_col = "size-4" ;  
        }
        elseif($service_columns == '4') {
         $class_column = ' col-lg-3 col-md-3 col-sm-6 col-xs-12'; 
         $size_col = "size-3" ;   
        }elseif($service_columns == '5'){
        $class_column = 'col-lg-5 col-md-2 col-sm-6 col-xs-12'; 
        $size_col = "size-5" ;      
        }elseif($service_columns == '6'){
        $class_column = ' col-lg-2 col-md-2 col-sm-6 col-xs-12'; 
        $size_col = "size-2" ;      
        }else {
          $class_column = ' col-lg-12 col-md-12 col-sm-16 col-xs-12'; 
        $size_col = "size-1" ;   
        }
	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);
      
        $animation_classes = getCSSAnimation( $animation );
	    $output = '';

		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

		if( $ajax_page > 1 ) $paged = $ajax_page;

	    $args = array(
	    	'post_type' => 'service',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => $items_per_page
		);
		if( ! empty( $exclude ) ) {
			$args['post__not_in'] = explode(',', $exclude);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies('service');
            
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
		));
                
		if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}

		if( ! empty( $order ) ) {
			$args['order'] = $order;
		}

		if( ! empty( $offset ) ) {
			$args['offset'] = $offset;
		}

		if( ! empty( $meta_key ) ) {
			$args['meta_key'] = $meta_key;
		}

		if( ! empty( $orderby ) ) {
			$args['orderby'] = $orderby;
		}

	    $blog_query = new WP_Query($args);

	    ob_start();
       
        $kitgreen_loop['text_more'] = $text_more;
	    $kitgreen_loop['img_size'] = $img_size;
	    $kitgreen_loop['loop'] = 0;
    
        if($service_design != "slider") {
           $data  = 'data-masonry=\'{"selector":".service-item ", "columnWidth":".grid-sizer","layoutMode":"packery"}\'';
    	   $sizer = '<div class="grid-sizer '.$size_col.'"></div>'; 
           $slider = "";  
        }else {
           $data = 'data-slick=\'{"slidesToShow":'.$number_show.', "slidesToScroll":1 , "arrows":false , "speed":700 , "dots":true,"responsive":[{"breakpoint": 1024,"settings":{"slidesToShow": '.round($number_show - 1) .'}},{"breakpoint": 480,"settings":{"slidesToShow": 1}}] }\''; 
    	   $sizer = ''; 
           $slider = " service_slider ";  
           $class_column = "";
            
        }
        $class = 'jws-masonry '.$service_design.$animation_classes.$slider.'';
	    if(!$is_ajax) echo '<div class="kitgreen-service-holder row ' . esc_attr( $class) .  '" data-paged="1" data-atts="' . esc_attr( $encoded_atts ) . '" '.wp_kses_post( $data ).' >';
	    echo wp_kses_post( $sizer );
		while ( $blog_query->have_posts() ) {
			$blog_query->the_post();
            if($service_design == "slider" || $service_design == "grid2" ) {
               ?>
                <div class="service-item <?php echo wp_kses_post($class_column ); ?>">
                	<?php get_template_part( 'framework/templates/service/entry' ); ?>
                </div>
               
            <?php 
            }else {
                ?>
                 <div class="service-item <?php echo wp_kses_post($class_column ); ?>">
                     	<?php get_template_part( 'framework/templates/service/entry2' ); ?>   
                </div>
                <?php
            }
			
		}
    	if(!$is_ajax) echo '</div>';
        
		if ( $blog_query->max_num_pages > 1 && !$is_ajax && ! empty( $pagination ) ) {
			?>
		    	<div class="service-footer <?php echo esc_attr($blog_design); ?>">
		    		<?php if ($pagination == 'more-btn'): ?>
		    			<a href="#" class=" kitgreen-blog-load-more"><span class="text_label"><?php _e('LOAD MORE', 'kitgreen'); ?></span><span class="icon ion-ios-arrow-thin-down"></span></a>
                        <p  class="posts-loaded"><?php _e('All Posts Loaded.', 'kitgreen'); ?></p>
	    			<?php elseif( $pagination == 'pagination' ): ?>
		    			<?php query_pagination( $blog_query->max_num_pages ); ?>
		    		<?php endif ?>
		    	</div>
		    <?php 
		}
         
	    unset( $kitgreen_loop );
	    wp_reset_postdata();
	    $output .= ob_get_clean();
	    ob_flush();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'items' => $output,
	    		'status' => ( $blog_query->max_num_pages > $paged ) ? 'have-posts' : 'no-more-posts'
	    	);
	    }
	     
	    return $output;

	}

	insert_shortcode( 'kitgreen_service', 'kitgreen_shortcode_service' );
}

/**
* ------------------------------------------------------------------------------------------------
* Service shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_portfolio_slider' ) ) {
	function kitgreen_shortcode_portfolio_slider( $atts ) {
		global $kitgreen_loop;
	    $parsed_atts = shortcode_atts( array(
	        'custom_query'  => '',
	        'taxonomies'  => '',
	        'offset'  => '',
	        'orderby'  => 'date',
	        'order'  => 'DESC',
	        'meta_key'  => '',
	        'exclude'  => '',
	        'img_size' => 'medium',
            'number_show' => '3',
            'animation' => '',
            'items_per_page' => '-1',
	    ), $atts );

	    extract( $parsed_atts );

	    $encoded_atts = json_encode( $parsed_atts );
      
        $animation_classes = getCSSAnimation( $animation );
        
		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

	    $args = array(
	    	'post_type' => 'portfolio',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => $items_per_page
		);
		if( ! empty( $exclude ) ) {
			$args['post__not_in'] = explode(',', $exclude);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies('portfolio');
            
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
		));
                
		if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}

		if( ! empty( $order ) ) {
			$args['order'] = $order;
		}

		if( ! empty( $offset ) ) {
			$args['offset'] = $offset;
		}

		if( ! empty( $meta_key ) ) {
			$args['meta_key'] = $meta_key;
		}

		if( ! empty( $orderby ) ) {
			$args['orderby'] = $orderby;
		}

	    $blog_query = new WP_Query($args);
	    ob_start();
       
        
	    $kitgreen_loop['img_size'] = $img_size;
	    $kitgreen_loop['loop'] = 0; ?>
    
	    <div class="kitgreen-portfolio-slider">

            <div class="portfolio-content-container row" data-slick='{"slidesToShow":1, "slidesToScroll":1 ,"fade":true , "arrows":false , "speed":700 , "dots":false , "asNavFor":".portfolio-thumbnail-container" }' >
        		<?php while ( $blog_query->have_posts() ) {
       			$blog_query->the_post(); ?>
                        <div class="portfolio-content ">
                                <div class="col-md-7 col-sm-6 col-xs-12">
                                    <?php echo kitgreen_get_post_thumbnail( 'large'); ?> 
                                </div>
                                <div class="col-md-5 col-sm-6 col-xs-12">
                                    <div class="content">
                                        <div class="title">
                                            <h4>
                                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                            </h4>
                                        </div>
                                         <div class="cat">
                                            <?php 
                                                $item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' );
                                                if ( $item_cats ):
                                            		foreach ( $item_cats as $item_cat ) {
                                            	    ?>
                                                         <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'portfolio_cat')); ?>">
                                                            <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                                                         </a><span>/</span> 
                                            		<?php }
                                    
                                               	endif;
                                          ?>
                                        </div>
                                        <div class="excerpt">
                                           <?php the_excerpt(); ?>
                                        </div>
                                        <div class="readmore">
                                            <a href="<?php the_permalink(); ?>"><?php esc_html_e("View Detail" , "kitgreen") ?><span class="lnr lnr-arrow-right"></span></a>
                                        </div>
                                    </div>
                                    <?php  ?> 
                                </div>    
                        </div>
        		<?php } ?>
            </div>
            <div class="portfolio-thumbnail-container" data-slick='{"slidesToShow":<?php echo wp_kses_post($number_show); ?>, "slidesToScroll":1 , "arrows":true , "speed":700 , "dots":false , "focusOnSelect":true , "asNavFor":".portfolio-content-container" }'>
                <?php while ( $blog_query->have_posts() ) {
     			$blog_query->the_post(); ?>
                        <div class="portfolio-thumbnail">
                                <?php if ( has_post_thumbnail() ) : ?>
                                        <?php echo kitgreen_get_post_thumbnail( '270x170'); ?>
                                <?php endif; ?> 
                        </div>
        		<?php } ?>
            </div>
    	   </div>
	    <?php unset( $kitgreen_loop );
        
        
	    wp_reset_postdata();
	    return ob_get_clean();
	    ob_flush();	
   }
   insert_shortcode( 'kitgreen_portfolio_slider', 'kitgreen_shortcode_portfolio_slider' );
}

if( ! function_exists( 'kitgreen_get_blog_shortcode_ajax' ) ) {
	add_action( 'wp_ajax_kitgreen_get_blog_shortcode', 'kitgreen_get_blog_shortcode_ajax' );
	add_action( 'wp_ajax_nopriv_kitgreen_get_blog_shortcode', 'kitgreen_get_blog_shortcode_ajax' );
	function kitgreen_get_blog_shortcode_ajax() {
		if( ! empty( $_POST['atts'] ) ) {
			$atts = $_POST['atts'];
			$paged = (empty($_POST['paged'])) ? 2 : (int) $_POST['paged'] + 1;
			$atts['ajax_page'] = $paged;

			$data = kitgreen_shortcode_blog($atts);
        
			echo json_encode( $data );

			die();
		}
	}
}
/**
* ------------------------------------------------------------------------------------------------
* Counter shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'extra_shortcode_animated_counter' )) {
	function extra_shortcode_animated_counter($atts) {
		$output = $label = $el_class = '';
		extract( shortcode_atts( array(
			'label' => '',
			'value' => 100,
            'icon' => '',
			'el_class' => '',
            'layout' => 'layout1',
            'animation' => '',
		), $atts ) );
        $animation_classes = getCSSAnimation( $animation );
		ob_start();
        wp_enqueue_script( 'counter-up.min', URI_PATH.'/assets/js/dev/jquery.counterup.min.js', array('jquery'), '', true  );
        wp_enqueue_script( 'setupap', URI_PATH.'/assets/js/dev/appear.js', array('jquery'), '', true  );
        wp_enqueue_script( 'setup', URI_PATH.'/assets/js/dev/setup_animation.js', array('jquery'), '', true  );
        wp_enqueue_style( 'csscout', URI_PATH.'/assets/css/cout_up.css', array(), '4.1.0');
		?>
        <div class="counter_up_out <?php echo esc_attr($animation_classes); echo esc_attr(' '.$layout); ?>">
			<div class="extra-counter <?php echo esc_attr($el_class ); ?>">
                <div class="text_content">
                    <?php if ($icon != ''): ?>
                        <span class="<?php echo esc_attr($icon);  ?> ct_icon"></span>
                    <?php endif ?>
				    <h2 class="counter-value odometer" data-number="<?php echo esc_attr( $value );  ?>" data-duration="2000"  ></h2>
				<?php if ($label != ''): ?>
					<p class="counter-label"><?php echo esc_html( $label ); ?></p>
                <?php endif ?>
                </div>  
			</div>
        </div>

		<?php
		$output .= ob_get_clean();
		return $output;

	}
	insert_shortcode( 'kitgreen_counter_up', 'extra_shortcode_animated_counter' );
}
/**
* ------------------------------------------------------------------------------------------------
* Portfolio shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_portfolio' ) ) {
	function kitgreen_shortcode_portfolio( $atts ) {
		global $kitgreen_portfolio_loop, $kitgreen_loop;
		$output = $title = $el_class = '';

	    $parsed_atts = shortcode_atts( array(
			'posts_per_page' => '',
			'filters' => '',
			'taxonomies' => '',
			'columns' => '4',
			'spacing' => '0',
			'ajax_page' => '',
			'pagination' => ' ',
			'orderby' => 'post_date',
			'order' => 'DESC',
			'el_class' => '',
            'img_size'=>"",
            'layout' =>'grid',
            'style' => 'st1',
            'animation' => '',
            'hover_style' => 'hover1',
            'view_all_text' => 'View All',
            'view_all_link' => '#'
		), $atts );

		extract( $parsed_atts );
		$encoded_atts = json_encode( $parsed_atts );
        $animation_classes = getCSSAnimation( $animation );       
		$is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);
		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
		if( $ajax_page > 1 ) $paged = $ajax_page;

		$args = array(
			'post_type' => 'portfolio',
			'posts_per_page' => $posts_per_page,
			'orderby' => $orderby,
			'order' => $order,
			'paged' => $paged
		);

		if( get_query_var('portfolio_cat') != '' ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'portfolio_cat',
					'field'    => 'slug',
					'terms'    => get_query_var('portfolio_cat')
				),
			);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies('portfolio');
            
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
		));
                
		if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}
        
        
	
              
        
        $style_nav = " ";
        if($style == 'st1') {
          $style_nav = ' nav_1 ';  
        }elseif($style == 'st2') {
            $style_nav = ' nav_2 ';
        }else {
            $style_nav = ' nav_3 ';
        }
        if($columns  == "4") {
            $size_pp = '3';
           }elseif($columns  == "3"){
            $size_pp = '4';
           }elseif($columns == "2"){
             $size_pp = '6';
           }else {
             $size_pp = '2';
         }    
		$kitgreen_portfolio_loop['columns'] = $columns;
        $kitgreen_portfolio_loop['img_size'] = $img_size;
        $kitgreen_portfolio_loop['layout'] = $layout;
        $kitgreen_portfolio_loop['spacing'] = $spacing;
        $class = $data = $sizer = '';
        $class = ' jws-masonry ';
       	$data  = 'data-masonry=\'{"selector":".item_portfolio   ","layoutMode":"masonryHorizontal"}\'';
       	$sizer = '<div class="grid-sizer size-'.$size_pp.'"></div>';
        

		$query = new WP_Query( $args );

		ob_start();
        if($layout == "grid2") :
           wp_enqueue_style( 'lightbox-css', URI_PATH.'/assets/css/css_jws/lightbox.css', false );
           wp_enqueue_style( 'black-css', URI_PATH.'/assets/css/css_jws/skin/black.css', false );
           wp_enqueue_script( 'lightbox-js', URI_PATH.'/assets/js/dev/lightbox.js', array('jquery'), '', true  );
           wp_enqueue_script( 'lightbox-ac', URI_PATH.'/assets/js/dev/start-video.js', array('jquery'), '', true  );
        endif;
		?>
		<?php if ( ! $is_ajax ): ?>
			<div class="<?php echo esc_attr($animation_classes); echo esc_attr($el_class); ?> site-content page-portfolio" role="main">
			<?php endif ?>
				<?php if ( $query->have_posts() ) : ?>
					<?php if ( ! $is_ajax ): ?>
						<div class="row row-spacing-<?php echo esc_attr( $spacing ); ?>">

							<?php if ( ! is_tax() && $filters ): ?>
								<?php
								    $taxonomy_names = get_object_taxonomies('portfolio');
                        			$cats = get_terms( $taxonomy_names, array(
                        				'orderby' => 'name',
                        				'include' => $taxonomies
                        			));
									if( ! is_wp_error( $cats ) && ! empty( $cats ) ) {
										?>
										<div class="portfolio-filter">
											<ul class="masonry-filter list-inline text-center <?php echo esc_attr($style_nav); ?>">
												<li><a href="#" data-filter="*" class="filter-active"><?php _e('All', 'kitgreen'); ?></a></li>
											<?php
											foreach ($cats as $key => $cat) {
												?>
													<li><a  href="#" data-filter="<?php echo ".".esc_attr( $cat->slug ); ?>"><?php echo esc_html( $cat->name ); ?></a></li>
												<?php
											}
											?>
											</ul>
										</div>
										<?php
									}
								 ?>

							<?php endif ?>

							<div class="clear"></div>

							<div class="masonry-container kitgreen-portfolio-holder <?php echo esc_attr($layout); echo esc_attr($class); echo esc_attr($el_class);?>" data-atts="<?php echo esc_attr( $encoded_atts ); ?>" data-source="shortcode" data-paged="1" <?php //echo wp_kses_post( $data ); ?>>
					<?php endif ?>

							<?php  //echo wp_kses_post( $sizer );   ?>
							<?php while ( $query->have_posts() ) : $query->the_post();?>
                            
							<?php
                            if($layout == "grid2") {
                               get_template_part( 'content', 'portfolio2' );  
                            }else {
                              get_template_part( 'content', 'portfolio' );  
                            }
                            ?>
							<?php endwhile; ?>

					<?php if ( ! $is_ajax ): ?>
							</div>
						</div>

						<?php
							if ( $query->max_num_pages > 1 && !$is_ajax && $pagination != 'disable' && $pagination != 'view-btn' ) {
								?>
							    	<div class="portfolio-footer">
							    		<?php if ( $pagination == 'more-btn'): ?>
							    			<a href="#" class="btn_load kitgreen-portfolio-load-more load-on-<?php echo wp_kses_post(($pagination == 'more-btn') ? 'click' : 'scroll'); ?>"><?php esc_html_e('LOAD MORE', 'kitgreen'); ?><span class="lnr lnr-arrow-down"></span></a>
                                        <?php else: ?>
							    			<?php query_pagination( $query->max_num_pages ); ?>
							    		<?php endif ?>
							    	</div>
							    <?php
							}else { if ( $pagination == 'view-btn') : ?>
                            <div class="portfolio-footer">
							 <a href="<?php echo esc_url($view_all_link); ?>" class="view_all btn_load"><?php echo esc_attr($view_all_text); ?><span class="lnr lnr-arrow-right"></span></a>
							</div>
                            <?php endif; }
						?>
					<?php endif ?>

				<?php elseif ( ! $is_ajax ) : ?>
					<?php get_template_part( 'content', 'none' ); ?>
				<?php endif; ?>
			<?php if ( ! $is_ajax ): ?>
			</div><!-- .site-content -->
			<?php endif ?>
		<?php

		$output .= ob_get_clean();

		wp_reset_postdata();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'items' => $output,
	    		'status' => ( $query->max_num_pages > $paged ) ? 'have-posts' : 'no-more-posts'
	    	);
	    }
		return $output;
	}

	insert_shortcode( 'kitgreen_portfolio', 'kitgreen_shortcode_portfolio' );
}
if( ! function_exists( 'kitgreen_get_portfolio_shortcode_ajax' ) ) {
	add_action( 'wp_ajax_kitgreen_get_portfolio_shortcode', 'kitgreen_get_portfolio_shortcode_ajax' );
	add_action( 'wp_ajax_nopriv_kitgreen_get_portfolio_shortcode', 'kitgreen_get_portfolio_shortcode_ajax' );
	function kitgreen_get_portfolio_shortcode_ajax() {
		if( ! empty( $_POST['atts'] ) ) {
			$atts = $_POST['atts'];
			$paged = (empty($_POST['paged'])) ? 2 : (int) $_POST['paged'] + 1;
			$atts['ajax_page'] = $paged;

			$data = kitgreen_shortcode_portfolio($atts);

			echo json_encode( $data );

			die();
		}
	}
}
/**
* ------------------------------------------------------------------------------------------------
* Categories grid shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_categories' )) {
	function kitgreen_shortcode_categories($atts, $content) {
		global $woocommerce_loop;
		$extra_class = '';	

		$parsed_atts = shortcode_atts( array_merge( kitgreen_get_owl_atts(), array(
			'title' => __( 'Categories', 'kitgreen' ),
			'number'     => null,
			'orderby'    => 'name',
			'order'      => 'ASC',
			'columns'    => '4',
			'hide_empty' => 1,
			'parent'     => '',
			'ids'        => '',
			'spacing' => 30,
			'style'      => 'default',
			'el_class' => '',
		) ), $atts );

		extract( $parsed_atts );

		if ( isset( $ids ) ) {
			$ids = explode( ',', $ids );
			$ids = array_map( 'trim', $ids );
		} else {
			$ids = array();
		}

		$hide_empty = ( $hide_empty == true || $hide_empty == 1 ) ? 1 : 0;

		// get terms and workaround WP bug with parents/pad counts
		$args = array(
			'orderby'    => $orderby,
			'order'      => $order,
			'hide_empty' => $hide_empty,
			'include'    => $ids,
			'pad_counts' => true,
			'child_of'   => $parent
		);

		$product_categories = get_terms( 'product_cat', $args );

		if ( '' !== $parent ) {
			$product_categories = wp_list_filter( $product_categories, array( 'parent' => $parent ) );
		}

		if ( $hide_empty ) {
			foreach ( $product_categories as $key => $category ) {
				if ( $category->count == 0 ) {
					unset( $product_categories[ $key ] );
				}
			}
		}

		if ( $number ) {
			$product_categories = array_slice( $product_categories, 0, $number );
		}
        
        if($columns == "4") {
            $columnsit = "col-md-3 col-sm-6 col-xs-12";
        }elseif($columns == "3") {
            $columnsit = "col-md-4 col-sm-6 col-xs-12";
        }elseif($columns == "2") { 
            $columnsit = "col-md-6 col-sm-6 col-xs-12";
        }else {
            $columnsit = "col-md-2 col-sm-6 col-xs-12";
        }
		$columns = absint( $columns );

		if( $style == 'masonry' ) {
			$extra_class = 'categories-masonry';
		}
		
		if( $style == 'masonry-first' ) {
			$woocommerce_loop['different_sizes'] = array(1);
			$extra_class = 'categories-masonry';
			$columns = 4;
		}

		$extra_class .= ' categories-space-' . $spacing;

		$woocommerce_loop['columns'] = $columns;
		$woocommerce_loop['style'] = $style;

		$carousel_id = 'carousel-' . rand(100,999);
		
		ob_start();

		// Reset loop/columns globals when starting a new loop
		$woocommerce_loop['loop'] = '';

		if ( $product_categories ) {
			//woocommerce_product_loop_start();

			if( $style == 'carousel' ) {
				?>

				<div id="<?php echo esc_attr( $carousel_id ); ?>" class="vc_carousel_container">
					<div class="owl-carousel carousel-items">
						<?php foreach ( $product_categories as $category ): ?>
							<div class="category-item">
								<?php 
									wc_get_template( 'content-product_cat.php', array(
										'category' => $category
									) );
								?>
							</div>
						<?php endforeach; ?>
					</div>
				</div> <!-- end #<?php echo esc_html( $carousel_id ); ?> -->

				<?php 
					$parsed_atts['carousel_id'] = $carousel_id;
					kitgreen_owl_carousel_init( $parsed_atts );
			} else {

				foreach ( $product_categories as $category ) {
				    ?> <div class="cat-item <?php echo esc_attr($columnsit); ?>"> <?php
					wc_get_template( 'content-product_cat.php', array(
						'category' => $category
					) );
                    ?></div><?php
				}
			}

			//woocommerce_product_loop_end();
		}

		unset($woocommerce_loop['different_sizes']);

		woocommerce_reset_loop();

		if( $style == 'carousel' ) {
			return '<div class="woocommerce categories-style-'. esc_attr( $style ) . ' ' . esc_attr( $extra_class ) . '">' . ob_get_clean() . '</div>';
		} else {
			return '<div class="woocommerce row categories-style-'. esc_attr( $style ) . ' ' . esc_attr( $extra_class ) . ' columns-' . $columns . '">' . ob_get_clean() . '</div>';
		}

	}

	insert_shortcode( 'kitgreen_categories', 'kitgreen_shortcode_categories' );

}

/**
* ------------------------------------------------------------------------------------------------
* Products widget shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_products_widget' )) {
	function kitgreen_shortcode_products_widget($atts, $content) {
		$output = $title = $el_class = '';
		extract( shortcode_atts( array(
			'title' => __( 'Products', 'kitgreen' ),
			'el_class' => ''
		), $atts ) );

		$output = '<div class="widget_products' . $el_class . '">';
		$type = 'WC_Widget_Products';

		$args = array('widget_id' => rand(10,99));

		ob_start();
		the_widget( $type, $atts, $args );
		$output .= ob_get_clean();

		$output .= '</div>';

		return $output;

	}

	insert_shortcode( 'kitgreen_shortcode_products_widget', 'kitgreen_shortcode_products_widget' );

}

/**
* ------------------------------------------------------------------------------------------------
* Counter shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_animated_counter' )) {
	function kitgreen_shortcode_animated_counter($atts) {
		$output = $label = $el_class = '';
		extract( shortcode_atts( array(
			'label' => '',
			'value' => 100,
			'time' => 1000,
			'size' => 'default',
			'el_class' => ''
		), $atts ) );

		$el_class .= ' counter-' . $size;

		ob_start();
		?>
			<div class="kitgreen-counter <?php echo esc_attr( $el_class ); ?>">
				<span class="counter-value" data-state="new" data-final="<?php echo esc_attr( $value ); ?>"><?php echo esc_attr( $value ); ?></span>
				<?php if ($label != ''): ?>
					<span class="counter-label"><?php echo esc_html( $label ); ?></span>
				<?php endif ?>
			</div>

		<?php
		$output .= ob_get_clean();


		return $output;

	}

	insert_shortcode( 'kitgreen_counter', 'kitgreen_shortcode_animated_counter' );

}
/**
* ------------------------------------------------------------------------------------------------
* testimonials shortcodes
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_testimonials' ) ) {
	function kitgreen_shortcode_testimonials($atts = array(), $content = null) {
		$output = $class = $autoplay = '';

		$parsed_atts = shortcode_atts( array_merge( kitgreen_get_owl_atts(), array(
			'style' => 'standard', // standard boxed
			'align' => 'center', // left center
			'name' => '',
			'title' => '',
			'el_class' => '',
            'slides_per_view' => '3',
            'slides_per_view_2' => '2',
            'slides_per_view_3' => '1',
            'layout' => 'layout1',
            'animation' => '',
            'image' => '',
		) ), $atts );

		extract( $parsed_atts );

		$class .= ' ' . $el_class;
		ob_start();
        $animation_classes = getCSSAnimation( $animation );
         ?>
			<div  class="testimonials-wrapper <?php echo esc_attr($layout); echo esc_attr($animation_classes); ?>">
                <?php if($layout == 'layout1') { ?>
				<div id="content" class="flexslider">
					<?php echo do_shortcode( $content ); ?>
				</div>
                <div id="thmbnail-img" class="flexslider" >
					<?php echo do_shortcode( $content ); ?>
				</div>
                <div id="content2" class="flexslider content_bottom">
					<?php echo do_shortcode( $content ); ?>
				</div>
                <?php }elseif($layout == 'layout4') { ?>
                    <div class="slider4">
    					<?php echo do_shortcode( $content ); ?>
    				</div>   
                <?php } else { ?>
                <div id="content" class="flexslider">
					<?php echo do_shortcode( $content ); ?>
				</div>   
               <?php } ?>
               
			</div>
             <?php if($layout == 'layout1' || $layout == 'layout2' || $layout == 'layout4'  ) { ?>
            <script>
           	    jQuery(document).ready(function($) {
                    	function jwsthemetestimonialSlider() {  
                    	     <?php if($layout == 'layout1') { ?>   
                    		 $('#content').not('.slick-initialized').slick({
                      	       slidesToShow:1,
                              slidesToScroll: 1,
                              arrows: false,
                              fade: false,
                              asNavFor: '#thmbnail-img , #content2 ',
                              arrows: true,
                              nextArrow: '<span class="lnr lnr-chevron-right"></span>',
                              prevArrow: '<span class="lnr lnr-chevron-left"></span>',
                            });
                             $('#content2').not('.slick-initialized').slick({
                      	       slidesToShow:1,
                              slidesToScroll: 1,
                              arrows: false,
                              fade: false,
                              asNavFor: '#thmbnail-img'
                            });
                            $('#thmbnail-img').not('.slick-initialized').slick({
                              slidesToShow: 3,
                     	      slidesToScroll: 1,
                              asNavFor: '#content',
                              dots: false,
                              centerMode: true,
                              arrows: false,
                              responsive: [
                                    {
                                      breakpoint: 768,
                                      settings: {
                                        arrows: true,
                                        centerMode: true,
                                        centerPadding: '0px',
                                        slidesToShow: 1
                                      }
                                    },
                                    {
                                      breakpoint: 480,
                                      settings: {
                                        arrows: true,
                                        centerMode: true,
                                        centerPadding: '0px',
                                        slidesToShow: 1
                                      }
                                    }
                                  ]
                            });
                            <?php } elseif($layout == 'layout4') { ?>
                            
                            $('.slider4').not('.slick-initialized').slick({
                              slidesToShow: <?php echo wp_kses_post($slides_per_view); ?>,
                     	      slidesToScroll: 1,
                              dots: false,
                              nextArrow: '<span class="lnr lnr-chevron-right"></span>',
                              prevArrow: '<span class="lnr lnr-chevron-left"></span>',
                              responsive: [
                                    {
                                      breakpoint: 991,
                                      settings: {
                                        slidesToShow: <?php echo wp_kses_post($slides_per_view_2); ?>,
                                      }
                                    },
                                    {
                                      breakpoint: 560,
                                      settings: {
                                        slidesToShow: <?php echo wp_kses_post($slides_per_view_3); ?>,
                                      }
                                    }
                                  ]
                            });  
                                
                            <?php } else { ?>
                                $('#content').not('.slick-initialized').slick({
                                  dots: false,
                                  arrows: true,  
                                  infinite: true,
                                  slidesToShow: 1,
                                  slidesToScroll:1,
                                  nextArrow: '<span class="lnr lnr-chevron-right"></span>',
                                  prevArrow: '<span class="lnr lnr-chevron-left"></span>',
                                  responsive: [
                                    {
                                      breakpoint: 1199,
                                      settings: {
                                        centerMode: true,
                                        centerPadding: '0px',
                                        slidesToShow: 1,
                                      }
                                    },
                                    {
                                      breakpoint: 480,
                                      settings: {
                                        centerMode: true,
                                        centerPadding: '0px',
                                        slidesToShow: 1 ,
                                      }
                                    }
                                  ]
                                });
                           <?php } ?>
                    		}
                    	jwsthemetestimonialSlider();
                        //Now it will not throw error, even if called multiple times.
                        $(window).on( 'resize', jwsthemetestimonialSlider );
                                                                                           
               	});
            </script>
             <?php } ?>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'testimonials', 'kitgreen_shortcode_testimonials' );
}


if( ! function_exists( 'kitgreen_shortcode_testimonial' ) ) {
	function kitgreen_shortcode_testimonial($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';
		extract(shortcode_atts( array(
			'image' => '',
            'image_before' => '',
            'image_after' => '',
			'img_size' => '100x100',
			'name' => '',
			'title' => '',
			'el_class' => '',
            'layout' => 'layout1',
            'date' => '',
            'project' => ''
            
		), $atts ));
		$img_id = preg_replace( '/[^\d]/', '', $image  );
        $img_id_bf = preg_replace( '/[^\d]/', '', $image_before  );
        $img_id_at = preg_replace( '/[^\d]/', '', $image_after );
		$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'testimonial-avatar-image' ) );
        $img_before = wpb_getImageBySize( array( 'attach_id' => $img_id_bf, 'thumb_size' => $img_size, 'class' => 'testimonial-before-image' ) );
        $img_after = wpb_getImageBySize( array( 'attach_id' => $img_id_at, 'thumb_size' => $img_size, 'class' => 'testimonial-after-image' ) );
		$class .= ' ' . $el_class;

		ob_start();
         ?>
			<div class="testimonial<?php echo esc_attr( $class ); ?>" >
                    <?php if($layout == 'layout1') { ?>
                    <div class="testimonial-content">
						<?php echo do_shortcode( $content ); ?>
					</div>
    				<div class="testimonial-avatar">
                        <div class="image">
    				    <?php echo wp_kses_post($img['thumbnail']); ?>
                        </div>
                        <footer>
							<h5><?php echo esc_html( $name ); ?> / </h5>
							<span><?php echo esc_html( $title ); ?></span>
						</footer>
    				</div>     
                    <?php }elseif($layout == 'layout2') { ?>
                    <div class="slider_container">
                    <div class="slider_inner">
                       <div class="image display_flex">
                            <div class="before">
                                 <span><?php esc_html_e('Before' , 'kitgreen'); ?></span>   
                                 <?php echo wp_kses_post($img_before['thumbnail']); ?>
                            </div>
                            <div class="after">
                                <span><?php esc_html_e('After' , 'kitgreen'); ?></span>   
                                 <?php echo wp_kses_post($img_after['thumbnail']); ?>
                            </div>
                       </div>
                        <div class="testimonial-content">
    						<?php echo do_shortcode( $content ); ?>
                            <footer>
    							<h5><?php echo esc_html( $name ); ?></h5>
    							<span> / <?php echo esc_html( $title ); ?></span>
    				    	</footer>
    					</div>
                    </div> 
                    </div>   
                    <?php } elseif($layout == 'layout3') { ?>
                        <div class="slider_container">
                        <div class="slider_inner">
                        <div class="slider_inner_child">
                        <div class="testimonial-content">
    						<?php echo do_shortcode( $content ); ?>
    					</div>
                        <div class="testimonial-avatar">
                            <div class="image">
        				    <?php echo wp_kses_post($img['thumbnail']); ?>
                            </div>
        				</div>
                        <footer>
    							<h5><?php echo esc_html( $name ); ?> </h5>
    							<span><?php echo esc_html( $title ); ?></span>
    					</footer>
                        </div>
                    </div> 
                    </div>     
                    <?php } else { ?>
                    
                   <div class="slider_container">
                         <div class="slider_inner">
                            <div class="slider_inner_child">
                            <div class="testimonial-content">
        						<?php echo do_shortcode( $content ); ?>
        					</div>
                            </div>
                            <div class="client_info">
                                <div class="info_top">
                                    <div class="testimonial-avatar">
                                        <div class="image">
                    				    <?php echo wp_kses_post($img['thumbnail']); ?>
                                        </div>
                    				</div>
                                    <footer>
                                            <h5><?php echo esc_html( $name ); ?> </h5>
                                            <?php if(!empty($name) || !empty($title) ) : ?>
                                                <span class="line">/</span>
                                            <?php endif; ?>    
                							<span><?php echo esc_html( $title ); ?></span>
                					</footer>
                                </div>
                                    <div class="info_bottom">
                                    <div class="date"><?php echo wp_kses_post($date); ?></div>
                                    <?php if(!empty($name) || !empty($title) ) : ?>
                                      <span class="line">|</span>
                                    <?php endif; ?>  
                                    <div class="project"><?php echo wp_kses_post($project); ?></div>
                                </div>
                            </div>
                        </div> 
                    </div>    
                   <?php } ?>	
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'testimonial', 'kitgreen_shortcode_testimonial' );
}

if( ! function_exists( 'kitgreen_shortcode_team' ) ) {
	function kitgreen_shortcode_team($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';
		extract(shortcode_atts( array(
			'image' => '',
			'img_size' => '100x100',
			'name' => '',
			'title' => '',
			'el_class' => '',
            'layout' => 'layout1',
		), $atts ));

		$img_id = preg_replace( '/[^\d]/', '', $image );

		$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'team-avatar-image' ) );

		$class .= ' ' . $el_class;

		ob_start();
         ?>
			<div class="team<?php echo esc_attr( $class ); ?>" >
                    <?php if($layout == 'layout1') { ?>
                    <div class="team_container">
                    <div class="content_container">
                    <div class="team-content">
						<?php echo do_shortcode( $content ); ?>
					</div>
                    </div>
    				<div class="team-avatar">
    				    <?php echo wp_kses_post($img['thumbnail']); ?>
                        <footer>
							<h5><?php echo esc_html( $name ); ?> </h5>
							<span><?php echo esc_html( $title ); ?></span>
						</footer>
    				</div>  
                     </div>     
                    <?php }else { ?>
                    <div class="slider_container">
                    <div class="slider_inner">
                        <div class="team-content">
    						<?php echo do_shortcode( $content ); ?>
    					</div>
                        <footer>
    							<h5><?php echo esc_html( $name ); ?> </h5>
    							<span><?php echo esc_html( $title ); ?></span>
    					</footer>
        				<div class="team-avatar">
                            <div class="image">
        				    <?php echo wp_kses_post($img['thumbnail']); ?>
                            </div>
        				</div>
                    </div> 
                    </div> 
                   
                    <?php } ?>
					
			</div>

		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'team', 'kitgreen_shortcode_team' );
}


/**
* ------------------------------------------------------------------------------------------------
* Pricing tables shortcodes
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_pricing_tables' ) ) {
	function kitgreen_shortcode_pricing_tables($atts = array(), $content = null) {
		$output = $class = $autoplay = '';
		extract(shortcode_atts( array(
			'el_class' => '',
            'view' => '3'
		), $atts ));

		$class .= ' ' . $el_class;

		ob_start();
         ?>
			<div class="pricing-tables-wrapper">
			<div class="pricing-tables<?php echo esc_attr( $class ); ?>" >
					<?php echo do_shortcode( $content ); ?> 
			</div>
            </div>
          
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'pricing_tables', 'kitgreen_shortcode_pricing_tables' );
}

if( ! function_exists( 'kitgreen_shortcode_pricing_plan' ) ) {
	function kitgreen_shortcode_pricing_plan($atts, $content) {
		global $wpdb, $post;
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';
		extract(shortcode_atts( array(
			'name' => '',
			'price_value' => '',
			'price_suffix' => '/ 1 kitchen',
			'features_list' => '',
            'image' => '',
			'link' => '#',
			'button_label' => 'Book Now',
			'el_class' => '',
            'animation' => '',
            'image_size' => '',
		), $atts ));
        $img_id = preg_replace( '/[^\d]/', '', $image  );
		$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $image_size, 'class' => 'pricing-image' ) );
        $animation_classes = getCSSAnimation( $animation );
		$class .= ' ' . $el_class;
        $class .= ' ' . $animation_classes;

        
		$features = explode(PHP_EOL, $features_list);

		ob_start(); ?>
		
			<div class="kitgreen-price-table text-center<?php echo esc_attr( $class ); ?>" >
                <div class="pricing_top">
                <div class="image_pr">
                <?php echo wp_kses_post($img['thumbnail']); ?>
                </div>
                </div>
				<div class="kitgreen-plan-inner">
   	                <div class="kitgreen-plan">
    					<div class="kitgreen-plan-name">
    						<h6><?php echo  wp_kses_post($name); ?></h6>
    					</div>
				    </div>
       	            <div class="kitgreen-plan-price">
    						<h3 class="kitgreen-price-value">
    							<?php echo  wp_kses_post($price_value); ?>
    						</h3>
    						<p class="kitgreen-price-suffix">
    							<?php echo  wp_kses_post($price_suffix); ?>
    						</p>
    				</div>
					<?php if ( count( $features ) > 0 ): ?>
						<div class="kitgreen-plan-features">
                        <div class="kitgreen-plan-feature">
                        <?php $features = str_ireplace('<br />', '', $features); ?>
							<?php foreach ($features as $value): ?>
								
									<div class="item"><?php echo  wp_kses_post($value); ?></div>
								
							<?php endforeach; ?>
                            </div>
						</div>
					<?php endif ?>
					<div class="kitgreen-plan-footer ">
							<a  href="<?php echo esc_url( $link ); ?>" class="button price-plan-btn">
								<?php echo  wp_kses_post($button_label); ?>
                                <span class="lnr lnr-arrow-right"></span>
							</a>
					</div>
				</div>
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();



		return $output; 
	}

	insert_shortcode( 'pricing_plan', 'kitgreen_shortcode_pricing_plan' );
}



/**
* ------------------------------------------------------------------------------------------------
* Products tabs shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_products_tabs' ) ) {
	function kitgreen_shortcode_products_tabs($atts = array(), $content = null) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = $autoplay = '';
		extract(shortcode_atts( array(
			'title' => '',
			'image' => '',
			'color' => '#1aada3',
			'el_class' => ''
		), $atts ));

		$img_id = preg_replace( '/[^\d]/', '', $image );

		$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => 'full', 'class' => 'tabs-icon' ) );

	    // Extract tab titles
	    preg_match_all( '/products_tab([^\]]+)/i', $content, $matches, PREG_OFFSET_CAPTURE );
	    $tab_titles = array();

	    if ( isset( $matches[1] ) ) {
	      	$tab_titles = $matches[1];
	    }
	    $tabs_nav = '';
	    $first_tab_title = '';
	    $tabs_nav .= '<ul class="products-tabs-title">';
	    $_i = 0;
	    foreach ( $tab_titles as $tab ) {
	    	$_i++;
			$tab_atts = shortcode_parse_atts( $tab[0] );
			$tab_atts['carousel_js_inline'] = 'yes';
			$encoded_atts = json_encode( $tab_atts );
			if( $_i == 1 ) $first_tab_title = $tab_atts['title'];
			$class = ( $_i == 1 ) ? 'active-tab-title' : '';
			if ( isset( $tab_atts['title'] ) ) {
				$tabs_nav .= '<li data-atts="' . esc_attr( $encoded_atts ) . '" class="' . esc_attr( $class ) . '""><span class="tab-label">' . $tab_atts['title'] . '</span></li>';
			}
	    }
	    $tabs_nav .= '</ul>';

		$tabs_id = rand(999,9999);

		$class .= ' tabs-' . $tabs_id;

		$class .= ' ' . $el_class;

		ob_start(); ?>
			<div class="kitgreen-products-tabs<?php echo esc_attr( $class ); ?>">
				<div class="kitgreen-products-loader">
                    <div class="overlay-loader">
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
                </div>
				<div class="kitgreen-tabs-header">
					<?php if ( ! empty( $title ) ): ?>
						<div class="tabs-name">
							<?php echo wp_kses_post($img['thumbnail']); ?>
							<span><?php echo wp_kses_post($title); ?></span>
						</div>
					<?php endif; ?>
					<div class="tabs-navigation-wrapper">
						<?php 
							echo wp_kses_post($tabs_nav);
						?>
					</div>
				</div>
				<?php 
					$first_tab_atts = shortcode_parse_atts( $tab_titles[0][0] );
					echo kitgreen_shortcode_products_tab( $first_tab_atts );
				?>
				<style type="text/css">
					.tabs-<?php echo esc_html( $tabs_id ); ?> .tabs-name {
						background: <?php echo esc_html( $color ); ?>
					}
					.kitgreen-products-tabs.tabs-<?php echo esc_html( $tabs_id ); ?> .products-tabs-title .active-tab-title {
						color: <?php echo esc_html( $color ); ?>
					}
                    .kitgreen-products-tabs .products-tabs-title li:hover {
						color: <?php echo esc_html( $color ); ?>
					}
					.tabs-<?php echo esc_html( $tabs_id ); ?> .kitgreen-tabs-header {
						border-color: <?php echo esc_html( $color ); ?>
					}
				</style>
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'products_tabs', 'kitgreen_shortcode_products_tabs' );
}

if( ! function_exists( 'kitgreen_shortcode_products_tab' ) ) {
	function kitgreen_shortcode_products_tab($atts) {
		global $wpdb, $post;
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';

	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);

		$parsed_atts = shortcode_atts( array_merge( array(
			'title' => '',
		), kitgreen_get_default_product_shortcode_atts()), $atts );

		extract( $parsed_atts );

		$parsed_atts['carousel_js_inline'] = 'yes';
		$parsed_atts['force_not_ajax'] = 'yes';

		ob_start(); ?>
			<?php if(!$is_ajax): ?>	
				<div class="kitgreen-tab-content<?php echo esc_attr( $class ); ?>" >
			<?php endif; ?>

				<?php 
					echo kitgreen_shortcode_products( $parsed_atts );
				 ?>
			<?php if(!$is_ajax): ?>	
				</div>
			<?php endif; ?>
		<?php
		$output = ob_get_clean();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'html' => $output
	    	);
	    }
	    
	    return $output;
	}

	insert_shortcode( 'products_tab', 'kitgreen_shortcode_products_tab' );
}

if( ! function_exists( 'kitgreen_get_products_tab_ajax' ) ) {
	add_action( 'wp_ajax_kitgreen_get_products_tab_shortcode', 'kitgreen_get_products_tab_ajax' );
	add_action( 'wp_ajax_nopriv_kitgreen_get_products_tab_shortcode', 'kitgreen_get_products_tab_ajax' );
	function kitgreen_get_products_tab_ajax() {
		if( ! empty( $_POST['atts'] ) ) {
			$atts = $_POST['atts'];
			$data = kitgreen_shortcode_products_tab($atts);
			echo json_encode( $data );
			die();
		}
	}
}

/**
* ------------------------------------------------------------------------------------------------
* Mega Menu widget
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_mega_menu' )) {
	function kitgreen_shortcode_mega_menu($atts, $content) {
		$output = $title_html = '';
		extract(shortcode_atts( array(
			'title' => '',
			'nav_menu' => '',
			'style' => '',
			'color' => '',
			'kitgreen_color_scheme' => 'light',
			'el_class' => ''
		), $atts ));

		$class = $el_class;

		if( $title != '' ) {
			$title_html = '<h5 class="widget-title color-scheme-' . $kitgreen_color_scheme . '">' . $title . '</h5>';
		}

		$widget_id = 'widget-' . rand(100,999);


		//if( $nav_menu == '') return;

		ob_start(); ?>
			
			<div id="<?php echo esc_attr( $widget_id ); ?>" class="widget_nav_mega_menu shortcode-mega-menu <?php echo esc_attr( $class ); ?>">
				
				<?php echo wp_kses_post($title_html); ?>

				<div class="kitgreen-navigation">
					<?php
						wp_nav_menu( array( 
							'fallback_cb' => '', 
							'menu' => $nav_menu,
							'walker' => new kitgreen_Mega_Menu_Walker()
						) );
					?>
				</div>	
			</div>

			<?php if ( $color != '' ): ?>
				<style type="text/css">
					#<?php echo esc_attr( $widget_id ); ?> {
						border-color: <?php echo esc_attr($color); ?>
					}
					#<?php echo esc_attr( $widget_id ); ?> .widget-title {
						background-color: <?php echo esc_attr($color); ?>
					}
				</style>
			<?php endif ?>
			
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 

	}

	insert_shortcode( 'kitgreen_mega_menu', 'kitgreen_shortcode_mega_menu' );

}


/**
* ------------------------------------------------------------------------------------------------
* Widget user panel
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_user_panel' )) {
	function kitgreen_shortcode_user_panel($atts) {
		if( ! kitgreen_woocommerce_installed() ) return;
		$click = $output = $title_out = $class = '';
		extract(shortcode_atts( array(
			'title' => '',
		), $atts ));

		$class .= ' ';

		$user = wp_get_current_user();

		ob_start(); ?>
				
			<div class="kitgreen-user-panel<?php echo esc_attr( $class ); ?>">

				<?php if ( ! is_user_logged_in() ): ?>
					<?php printf(__('Please, <a href="%s">log in</a>', 'kitgreen'), get_permalink( get_option('woocommerce_myaccount_page_id') )); ?>
				<?php else: ?>


					<div class="user-avatar">
						<?php echo get_avatar( $user->ID, 92 ); ?> 
					</div>

					<div class="user-info">
						<span><?php printf( __('Welcome, <strong>%s</strong>', 'kitgreen'), $user->user_login ) ?></span>
						<a href="<?php echo esc_url( wp_logout_url( home_url('/') ) ); ?>" class="logout-link"><?php _e('Logout', 'kitgreen'); ?></a>
					</div>

				<?php endif ?>
				
	
			</div>


		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'user_panel', 'kitgreen_shortcode_user_panel' );
}



/**
* ------------------------------------------------------------------------------------------------
* Widget with author info
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_author_area' )) {
	function kitgreen_shortcode_author_area($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $title_out = $class = '';
		extract(shortcode_atts( array(
			'title' => '',
			'image' => '',
			'img_size' => '800x600',
			'link' => '',
			'link_text' => '',
			'alignment' => 'left',
			'style' => '',
			'kitgreen_color_scheme' => 'dark',
			'el_class' => ''
		), $atts ));

		$img_id = preg_replace( '/[^\d]/', '', $image );

		$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'author-area-image' ) );


		$class .= ' text-' . $alignment;
		$class .= ' color-scheme-' . $kitgreen_color_scheme;
		$class .= ' ' . $el_class;

		if( $title != '' ) {
			$title_out = '<h3 class="title author-title">' . esc_html($title) . '</h3>';
		}

		if( $link != '') {
			$link = '<a href="' . esc_url( $link ) . '">' . esc_html($link_text) . '</a>';
		}

		ob_start(); ?>
				
			<div class="author-area<?php echo esc_attr( $class ); ?>">

				<?php echo wp_kses_post($title_out); ?>

				<div class="author-avatar">
					<?php echo wp_kses_post($img['thumbnail']); ?>
				</div>
				
				<div class="author-info">
					<?php echo do_shortcode( $content ); ?>
				</div>
				
				<?php echo wp_kses_post($link); ?>
	
			</div>


		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'author_area', 'kitgreen_shortcode_author_area' );
}

/**
* ------------------------------------------------------------------------------------------------
* Promo banner - image with text and hover effect
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_promo_banner' )) {
	function kitgreen_shortcode_promo_banner($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'image' => '',
			'img_size' => '800x600',
			'link' => '',
			'alignment' => 'left',
			'vertical_alignment' => 'top',
			'style' => '',
			'hover' => '',
			'kitgreen_color_scheme' => 'left',
			'el_class' => '',
            'animation' => '',
		), $atts ));


		//$img_id = preg_replace( '/[^\d]/', '', $image );

		$images = explode(',', $image);

		if( $link != '') {
			$class .= ' cursor-pointer'; 
		}
        $animation_classes = getCSSAnimation( $animation );
        $class .= $animation_classes;
		$class .= ' text-' . $alignment;
		$class .= ' vertical-alignment-' . $vertical_alignment;
		$class .= ' banner-' . $style;
		$class .= ' hover-' . $hover;
		$class .= ' position-' . $kitgreen_color_scheme;
		$class .= ' ' . $el_class;
        
		if ( count($images) > 1 ) {
			$class .= ' multi-banner';
		}

		ob_start(); ?>

			<div class="promo-banner<?php echo esc_attr( $class ); ?>" <?php if( ! empty( $link ) ): ?>onclick="window.location.href='<?php echo esc_js( $link ) ?>'"<?php endif; ?> >
				<div class="main-wrapp-img">
					<div class="banner-image">
						<?php if ( count($images) > 0 ): ?>
							<?php $i=0; foreach ($images as $img_id): $i++; ?>
								<?php $img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'promo-banner-image image-' . $i ) ); ?>
								<?php echo wp_kses_post($img['thumbnail']); ?>
							<?php endforeach ?>
						<?php endif ?>
					</div>
				</div>
				
				<div class="wrapper-content-baner ">
					<div class="banner-inner">
						<?php echo do_shortcode( $content ); ?>
					</div>
				</div>
				
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'promo_banner', 'kitgreen_shortcode_promo_banner' );

}


if( ! function_exists( 'kitgreen_shortcode_banners_carousel' ) ) {
	function kitgreen_shortcode_banners_carousel($atts = array(), $content = null) {
		$output = $class = $autoplay = '';

		$parsed_atts = shortcode_atts( array_merge( kitgreen_get_owl_atts(), array(
			'el_class' => '',
		) ), $atts );

		extract( $parsed_atts );

		$class .= ' ' . $el_class;

		$carousel_id = 'carousel-' . rand(100,999);

		ob_start(); ?>
			<div id="<?php echo wp_kses_post($carousel_id); ?>" class="banners-carousel-wrapper">
				<div class="owl-carousel banners-carousel<?php echo esc_attr( $class ); ?>" >
					<?php echo do_shortcode( $content ); ?>
				</div>
			</div>

			<?php 

				$parsed_atts['carousel_id'] = $carousel_id;
				kitgreen_owl_carousel_init( $parsed_atts );

			 ?>

		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'banners_carousel', 'kitgreen_shortcode_banners_carousel' );
}


/**
* ------------------------------------------------------------------------------------------------
* Info box
* ------------------------------------------------------------------------------------------------
*/
if( ! function_exists( 'kitgreen_shortcode_info_box' )) {
	function kitgreen_shortcode_info_box($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'image' => '',
			'img_size' => '800x600',
			'link' => '#',
			'link_target' => '_self',
			'alignment' => 'left',
			'image_alignment' => 'top',
			'style' => 'base',
			'hover' => '',
			'kitgreen_color_scheme' => 'dark',
			'css' => 'light',
			'btn_text' => '',
            'hover'=> 'hover1',
			'btn_position' => 'hover',
			'btn_color' 	 => 'default',
			'btn_style'   	 => 'link',
			'btn_size' 		 => 'default',
			'new_styles' => 'no',
			'el_class' => '',
            'color' => '',
            'icon' => '',
            'number'=> '1',
            'active' => false,
            'layout' => 'left_icon',
            'animation' => '',
            'text_btn' => 'View More',
		), $atts ));

        $animation_classes = getCSSAnimation( $animation );
        $class = $animation_classes; 
		$images = explode(',', $image);

		if( $link != '') {
			$class .= ' cursor-pointer'; 
		}

		$class .= ( $new_styles == 'yes') ? ' kitgreen-info-box2' : ' kitgreen-info-box';
		$class .= ' text-' . $alignment;
		$class .= ' icon-alignment-' . $image_alignment;
		$class .= ' box-style-' . $style;
		// $class .= ' hover-' . $hover;
		$class .= ' color-scheme-' . $kitgreen_color_scheme;
		$class .= ' ' . $el_class . ' ';

		if ( count($images) > 1 ) {
			$class .= ' multi-icons';
		}
         $class .= $hover;  
		if( ! empty( $btn_text ) ) {
			$class .= ' with-btn';
			$class .= ' btn-position-' . $btn_position;
		}

		if( function_exists( 'vc_shortcode_custom_css_class' ) ) {
			$class .= ' ' . vc_shortcode_custom_css_class( $css );
		}

		$rand = "svg-" . rand(1000,9999);

		$sizes = explode( 'x', $img_size );

		$width = $height = 128;
		if( count( $sizes ) == 2 ) {
			$width = $sizes[0];		
			$height = $sizes[1];		
		} 
        if( $link_target == '_blank' ) {
        	$onclick = 'onclick="window.open(\''. esc_url( $link ).'\',\'_blank\')"';
        } else {
        	$onclick = 'onclick="window.location.href=\''. esc_url( $link ).'\'"';
        }
         $class .= $layout;
        if($image_alignment == 'left' && $layout == 'left_icon' || $layout == 'left_icon_2'  ) {
            $class .= ' display_flex ';
        }
        if($active) {
          $class .= ' active ';  
        }
		ob_start(); ?>
			<div class="<?php echo esc_attr( $class ); ?>" <?php if( ! empty( $link ) ) echo wp_kses_post($onclick); ?> >
            <?php if($layout == 'top_icon') echo '<div class="info_inner_slider">';  ?>
                
				<?php if ( count($images) > 0 ): ?>
                    <?php if($layout == 'process_icon' || $layout == 'process_icon3') echo "<div class='number_process'><span class='overlay'></span><span class='number'>".esc_attr($number)."</span></div>"; ?>
					<div class="box-icon-wrapper">
						<div class="info-box-icon">
								<?php $i=0; foreach ($images as $img_id): $i++; ?>
									<?php $img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'info-icon image-' . $i ) ); ?>
									<?php 
										$src = isset($img['p_img_large'][0]) ? $img['p_img_large'][0] : '';
										if( substr($src, -3, 3) == 'svg' ) {
											echo '<div id="' . $rand . '" class="info-svg-wrapper" style="width: ' . $width . 'px;height: ' . $height . 'px;"></div>';
											?>
											<script type="text/javascript">
												jQuery(document).ready(function($) {
													new Vivus('<?php echo wp_kses_post($rand); ?>', {
													    type: 'delayed',
													    duration: 200,
													    start: 'inViewport',
													    file: '<?php echo wp_kses_post($src); ?>',
													    animTimingFunction: Vivus.EASE_OUT
													});
												});
											</script>
											<?php
										} else {
										 if(!empty($img['thumbnail'])) echo wp_kses_post($img['thumbnail']);
										}
									 ?>
								<?php endforeach ?>
                                <?php 
                                    if($icon) {
                                        echo '<div class="has_icon"><span style="color:'.$color.'" class="'.$icon.'"></span></div>';
                                    }
                                 ?>
                                
						</div>
					</div>
				<?php endif ?>
				<div class="info-box-content">
					<div class="info-box-inner">
                        <p>
						<?php 
							echo do_shortcode( $content ); 
							if( ! empty( $btn_text ) ) {
								printf( '<div class="info-btn-wrapper"><a href="%s" class="btn btn-style-link btn-color-primary info-box-btn">%s</a></div>', $link, $btn_text );
							}
						?>
					</div>
                    <?php if($layout == 'process_icon' || $layout == 'process_icon3') echo "<a href=".esc_url($link)." class='button_info'>".esc_attr($text_btn)."</a>"; ?>
				</div>
                <?php if($layout == 'top_icon') echo '</div>';  ?>
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'kitgreen_info_box', 'kitgreen_shortcode_info_box' );

}
/**
* ------------------------------------------------------------------------------------------------
* Heading Two Color
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_heading' )) {
	function kitgreen_shortcode_heading($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'title' => '',
  	        'title2' => '',
			'el_class' => '',
            'color' =>'',
            'color2' => '',
            'font_size1' => '',
            'font_weight1' => '',
            'font_size2' => '',
            'position' => 'left',
            'font_weight2' => '',
		), $atts ));
		$class .= ' headding_two ' . $el_class;
		ob_start();
        ?>
        <h3 style="text-align:<?php echo wp_kses_post($position); ?>;font-size:<?php echo wp_kses_post($font_size1); ?>; font-weight: <?php echo wp_kses_post($font_weight1); ?> ; color: <?php echo wp_kses_post($color); ?> ;  " class="<?php echo esc_attr($class); ?>"><?php echo wp_kses_post($title); ?>
            <span style="color: <?php echo wp_kses_post($color2); ?> ; font-size:<?php echo wp_kses_post($font_size2); ?>; font-weight: <?php echo wp_kses_post($font_weight2); ?> "><?php echo wp_kses_post($title2); ?></span>
        </h3> 
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'headingtwo', 'kitgreen_shortcode_heading' );

}
/**
* ------------------------------------------------------------------------------------------------
* Button
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_btn' )) {
	function kitgreen_shortcode_btn($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'link' => '',
			'btn_text' => '',
            'color' => '',
            'height' => '60px',
            'width' => '218px',
            'radius' => '25px',
            'position' =>'left',
            'size' =>'13px',
			'el_class' => '',
            'animation' =>'',
            'color3' => '#ffffff',
            'color_hv3'=> '',
            'color_hv1'=> ''
		), $atts ));

        $animation_classes = getCSSAnimation( $animation );
        $ntt = '';
        if($position == 'center') {
            $ntt = 'margin:0 auto;';
        }elseif($position == 'left') {
            $ntt = 'margin:0;';
        }else {
               $ntt = ' margin: 0 0 0 auto; ';
        }


        $onclick = 'onclick="window.location.href=\''. esc_url( $link ).'\'"';
        $id_btn = rand();    

		ob_start(); ?>
        <div class="button_kitgreen btn-<?php echo esc_attr($id_btn); ?><?php echo esc_attr($animation_classes); ?>">
			<div class="<?php echo esc_attr( $class,$el_class );?> button_kitgreen" <?php if( ! empty( $link ) ) echo wp_kses_post($onclick); ?> >
                <?php echo wp_kses_post($btn_text); ?>
            </div>
            <style type="text/css">
                .btn-<?php echo  esc_attr($id_btn); ?> {
                    border-radius: <?php echo wp_kses_post($radius); ?>;
                     background-color: <?php echo wp_kses_post($color);?> !important; 
                    <?php echo wp_kses_post($ntt); ?> width: <?php echo wp_kses_post($width);  ?>  ; 
                    height: <?php echo wp_kses_post($height);  ?> ;
                    line-height: <?php echo wp_kses_post($height);  ?> ;
                    text-align: center; color: <?php echo wp_kses_post($color3);  ?>;
                    font-size:  <?php echo wp_kses_post($size);  ?> ;
                    font-weight: 500;
                    display: block; 
                    cursor: pointer;
                    transition: 0.5s all;
                    -webkit-transition: 0.5s all;
                } 
                .btn-<?php echo  esc_attr($id_btn); ?>:hover { 
                <?php if(!empty($color_hv1)) : ?>
                   background-size: 200% auto; background-color:<?php echo wp_kses_post($color_hv1);  ?> !important; 
                 <?php endif; ?>
                 <?php if(!empty($color_hv3)) : ?>  
                   color: <?php echo wp_kses_post($color_hv3);  ?>; 
                 <?php endif; ?>  
                }    
            </style> 
        </div>  
       
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'kitgreen_button_click', 'kitgreen_shortcode_btn' );

}
/**
* ------------------------------------------------------------------------------------------------
* Info box
* ------------------------------------------------------------------------------------------------
*/
if( ! function_exists( 'kitgreen_shortcode_logo' )) {
	function kitgreen_shortcode_logo($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
	    $output = $class = '';
		extract(shortcode_atts( array(
			'image' => '',
            'animation' => '',
            'image_big_size' => 'full',
            'image_thumbnail_size' => 'full',
            'thumbnail_item' => '4',
		), $atts ));

        $animation_classes = getCSSAnimation( $animation );
        $class = $animation_classes; 
		$images = explode(',', $image);
		ob_start(); ?>
			<div class="slider_banner<?php echo esc_attr( $class ); ?>"  >
				<?php if ( count($images) > 0 ): ?>
					<div class="image_active" data-slick='{"slidesToShow":1, "slidesToScroll":1 , "fade":true , "arrows":true , "speed":700 , "dots":false , "asNavFor":".image_thumbnail" }' >
								<?php $i=0; foreach ($images as $img_id): $i++; ?>
                                <div class="logo_iteam">
									<?php $img = wpb_getImageBySize( array( 'attach_id' => $img_id,'thumb_size' => ''.$image_big_size.'', 'class' => 'info-icon image-' . $i ) ); ?>
                                    <div class="itema_inner"> 
									<?php 
											echo wp_kses_post($img['thumbnail']);
									 ?>
                                     </div>
                                </div>   
								<?php endforeach ?>
					</div>
    	           <div class="image_thumbnail" data-slick='{"slidesToShow":<?php echo wp_kses_post($thumbnail_item); ?>, "slidesToScroll":1 , "arrows":false , "speed":700 , "dots":false , "focusOnSelect":true , "asNavFor":".image_active" }'>
								<?php $i=0; foreach ($images as $img_id): $i++; ?>
                                <div class="logo_iteam">
									<?php $img = wpb_getImageBySize( array( 'attach_id' => $img_id,'thumb_size' => ''.$image_thumbnail_size.'', 'class' => 'info-icon image-' . $i ) ); ?>
                                    <div class="itema_inner"> 
									<?php 
											echo wp_kses_post($img['thumbnail']);
									 ?>
                                     </div>
                                </div>   
								<?php endforeach ?>
					</div>
				<?php endif ?>
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}

	insert_shortcode( 'kitgreen_log_bn', 'kitgreen_shortcode_logo' );

}

/**
* ------------------------------------------------------------------------------------------------
* 3D view - images in 360 slider
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_3d_view' )) {
	function kitgreen_shortcode_3d_view($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'images' => '',
			'img_size' => 'full',
			'title' => '',
			'link' => '',
			'style' => '',
			'el_class' => ''
		), $atts ));

		$id = rand(100,999);

		$images = explode(',', $images);

		if( $link != '') {
			$class .= ' cursor-pointer'; 
		}

		$class .= ' ' . $el_class;

		$frames_count = count($images);

		if ( $frames_count < 2 ) return;

		$images_js_string = '';

		$width = $height = 0;

		ob_start(); ?>
			<div class="kitgreen-threed-view<?php echo esc_attr( $class ); ?> threed-id-<?php echo esc_attr( $id ); ?>" <?php if( ! empty( $link ) ): ?>onclick="window.location.href='<?php echo esc_js( $link ) ?>'"<?php endif; ?> >
				<?php if ( ! empty( $title ) ): ?>
					<h3 class="threed-title"><span><?php echo wp_kses_post($title); ?></span></h3>
				<?php endif ?>
				<ul class="threed-view-images">
					<?php if ( count($images) > 0 ): ?>
						<?php $i=0; foreach ($images as $img_id): $i++; ?>
							<?php 
								$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => 'threed-view-image image-' . $i ) );
								$width = $img['p_img_large'][1];
								$height = $img['p_img_large'][2];
								$images_js_string .= "'" . $img['p_img_large'][0] . "'"; 
								if( $i < $frames_count ) {
									$images_js_string .= ","; 
								}
							?>
						<?php endforeach ?>
					<?php endif ?>
				</ul>
			    <div class="spinner">
			        <span>0%</span>
			    </div>
			</div>
			<script type="text/javascript">
				jQuery(document).ready(function( $ ) {
				    $('.threed-id-<?php echo esc_attr( $id ); ?>').ThreeSixty({
				        totalFrames: <?php echo wp_kses_post($frames_count); ?>,
				        endFrame: <?php echo wp_kses_post($frames_count); ?>, 
				        currentFrame: 1, 
				        imgList: '.threed-view-images', 
				        progress: '.spinner',
				        imgArray: [<?php echo wp_kses_post($images_js_string); ?>],
				        height: <?php echo wp_kses_post($height) ?>,
				        width: <?php echo wp_kses_post($width) ?>,
				        responsive: true,
				        navigation: true
				    });
				});
			</script>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'kitgreen_3d_view', 'kitgreen_shortcode_3d_view' );
}
/**
* ------------------------------------------------------------------------------------------------
* Countdown timer
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_countdown_timer' )) {
	function kitgreen_shortcode_countdown_timer($atts, $content) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$click = $output = $class = '';
		extract(shortcode_atts( array(
			'date' => '2018/12/12',
			'kitgreen_color_scheme' => 'light',
			'size' => 'medium',
			'align' => 'center',
			'style' => 'base',
			'el_class' => ''
		), $atts ));

		$class .= ' ' . $el_class;
		$class .= ' color-scheme-' . $kitgreen_color_scheme;
		$class .= ' timer-align-' . $align;
		$class .= ' timer-size-' . $size;
		$class .= ' timer-style-' . $style;

		ob_start(); ?>
			<div class="kitgreen-countdown-timer<?php echo esc_attr( $class ); ?>">
				<div class="kitgreen-timer" data-end-date="<?php echo esc_attr( $date ) ?>"></div>
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'kitgreen_countdown_timer', 'kitgreen_shortcode_countdown_timer' );
}




/**
* ------------------------------------------------------------------------------------------------
* Shortcode function to display posts teaser
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_posts_teaser' )) {
	function kitgreen_shortcode_posts_teaser($atts, $query = false) {
		global $woocommerce_loop;
		$posts_query = $el_class = $args = $my_query = $title_out = $output = '';
		$posts = array();
		extract( shortcode_atts( array(
			'el_class' => '',
			'posts_query' => '',
			'style' => 'default',
			'title' => '',
		), $atts ) );

		if( ! $query ) {
			list( $args, $query ) = vc_build_loop_query( $posts_query ); //
		}

		$carousel_id = 'teaser-' . rand(100,999);

		if( $title != '' ) {
			$title_out = '<h3 class="title teaser-title">' . $title . '</h3>';
		}

		ob_start();

		if($query->have_posts()) {
			echo wp_kses_post($title_out);
			?>
				<div id="<?php echo esc_html( $carousel_id ); ?>">
					<div class="posts-teaser teaser-style-<?php echo esc_attr( $style ); ?> <?php echo esc_attr( $el_class ); ?>">

						<?php
							$_i = 0;
							while ( $query->have_posts() ) {
								$_i++;
								$query->the_post(); // Get post from query
								?>
									<div class="post-teaser-item teaser-item-<?php echo esc_attr( $_i ); ?>">

										<?php if( has_post_thumbnail() ) {
											?>
												<a href="<?php echo esc_url( get_permalink() ); ?>"><?php the_post_thumbnail( ( $_i == 1 ) ? 'large' : 'medium' ); ?></a>
											<?php
										} ?>

										<a href="<?php echo esc_url( get_permalink() ); ?>" class="post-title"><?php the_title(); ?></a> 

										<?php kitgreen_post_meta(array(
											'author' => 0,
											'labels' => 1,
											'cats' => 0,
											'tags' => 0
										)); ?>

									</div>
								<?php
							}	
						?>

					</div> <!-- end posts-teaser -->
				</div> <!-- end #<?php echo esc_html( $carousel_id ); ?> -->
				<?php

		}
		wp_reset_postdata();

		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}

	insert_shortcode( 'kitgreen_posts_teaser', 'kitgreen_shortcode_posts_teaser' );
}



/**
* ------------------------------------------------------------------------------------------------
* Shortcode function to display posts as a slider or as a grid
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_posts' ) ) {

	function kitgreen_shortcode_posts( $atts ) {
		return kitgreen_generate_posts_slider( $atts );
	}

	insert_shortcode( 'kitgreen_posts', 'kitgreen_shortcode_posts' );
}

if( ! function_exists( 'kitgreen_generate_posts_slider' )) {
	function kitgreen_generate_posts_slider($atts, $query = false) {
		global $woocommerce_loop, $kitgreen_loop;
		$posts_query = $el_class = $args = $my_query = $speed = '';
		$slides_per_view = $wrap = $scroll_per_page = $title_out = '';
		$autoplay = $hide_pagination_control = $hide_prev_next_buttons = $output = '';
		$posts = array();

		$parsed_atts = shortcode_atts( array_merge( kitgreen_get_owl_atts(), array(
			'el_class' => '',
			'posts_query' => '',
	        'img_size' => 'large',
            'blog_layout' => '1',
			'title' => '',
            'review' => false,
            'like' => false,
            'thumbnail_show' => false,
		) ), $atts );

		extract( $parsed_atts );

		$kitgreen_loop['img_size'] = $img_size;
        $kitgreen_loop['blog_layout'] = $blog_layout;
        $kitgreen_loop['like'] = $like;
        $kitgreen_loop['review'] = $review;
        $kitgreen_loop[ 'thumbnail_show'] = $thumbnail_show;
		if( ! $query ) {
			list( $args, $query ) = vc_build_loop_query( $posts_query ); //
		}

		$carousel_id = 'carousel-' . rand(100,999);

		if( $title != '' ) {
			$title_out = '<h3 class="title slider-title">' . $title . '</h3>';
		}
        if ( $blog_layout == '1' ){ $layout = "default"; }else {
            $layout = "border-bottom";
        }
		ob_start();

		if($query->have_posts()) {
			echo wp_kses_post($title_out);
			?>
				<div id="<?php echo esc_attr( $carousel_id ); ?>" class="vc_carousel_container kitgreen-blog-holder <?php echo esc_attr($layout); ?>">
					<div class="owl-carousel post-slider  product-items <?php echo esc_attr( $el_class ); if ($blog_layout == '2') echo "ct-margin" ?>">

						<?php
							while ( $query->have_posts() ) {
								$query->the_post(); // Get post from query
								?>
									<div class="product-item owl-carousel-item">
										<div class="owl-carousel-item-inner">	
                                                <div class="post-item layout-2">
												    <?php get_template_part( 'framework/templates/blog/entry2' ); ?>
                                                </div>
										</div>
									</div>
								<?php
							}	

							unset( $woocommerce_loop['slider'] );

						?>

					</div> <!-- end product-items -->
				</div> <!-- end #<?php echo esc_html( $carousel_id ); ?> -->

			<?php

				$parsed_atts['carousel_id'] = $carousel_id;
				kitgreen_owl_carousel_init( $parsed_atts );

		}
		wp_reset_postdata();
		unset($kitgreen_loop['img_size']);

		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}
}


/**
* ------------------------------------------------------------------------------------------------
* Shortcode function to display posts as a slider or as a grid
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_products' ) ) {
	insert_shortcode( 'kitgreen_products', 'kitgreen_shortcode_products' );
	function kitgreen_shortcode_products($atts, $query = false) {
		global $woocommerce_loop, $kitgreen_loop;
	    $parsed_atts = shortcode_atts( kitgreen_get_default_product_shortcode_atts(), $atts );

	    extract( $parsed_atts );

		$kitgreen_loop['img_size'] = $img_size;

	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX && $force_not_ajax != 'yes' );

	    $parsed_atts['force_not_ajax'] = 'no'; // :)

	    $encoded_atts = json_encode( $parsed_atts );

		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

		if( $ajax_page > 1 ) $paged = $ajax_page;

		$ordering_args = WC()->query->get_catalog_ordering_args( $orderby, $order );

		$meta_query   = WC()->query->get_meta_query();

		if( $post_type == 'featured' ) {
			$meta_query[] = array(
			     'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => 'featured',
			);
		}

		if( $orderby == 'post__in' ) {
			$ordering_args['orderby'] = $orderby;
		}

	    $args = array(
	    	'post_type' 			=> 'product',
	    	'status' 				=> 'published',
			'ignore_sticky_posts' 	=> 1,
	    	'paged' 			  	=> $paged,	
			'orderby'             	=> $ordering_args['orderby'],
			'order'               	=> $ordering_args['order'],
	    	'posts_per_page' 		=> $items_per_page,
	    	'meta_query' 			=> $meta_query
		);

		if( ! empty( $ordering_args['meta_key'] ) ) {
			$args['meta_key'] = $ordering_args['meta_key'];
		}


		if( $post_type == 'ids' && $include != '' ) {
			$args['post__in'] = explode(',', $include);
		}

		if( ! empty( $exclude ) ) {
			$args['post__not_in'] = explode(',', $exclude);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies( 'product' );
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
			));

			if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN'  
					);
				}
			}
		}

		if( ! empty( $order ) ) {
			$args['order'] = $order;
		}

		if( ! empty( $offset ) ) {
			$args['offset'] = $offset;
		}


		if( $post_type == 'sale' ) {
			$args['post__in'] = array_merge( array( 0 ), wc_get_product_ids_on_sale() );
		}

		if( $post_type == 'bestselling' ) {
			$args['orderby'] = 'meta_value_num';
			$args['meta_key'] = 'total_sales';
		}

		$woocommerce_loop['timer']   = $sale_countdown;


		$products                    = new WP_Query( $args );

		// Simple products carousel
		

		$woocommerce_loop['columns'] = $columns;
		$woocommerce_loop['masonry'] = false;
        if($columns =="2") {
            $vccolumns = "col-md-6 col-sm-6 col-xs-12 col-xs-66";
            $columns_layout = "6";
        }elseif($columns == "3" ) {
            $vccolumns = "col-md-4 col-sm-6 col-xs-12 col-xs-66";
            $columns_layout = "4";
        }elseif($columns == "4" ) {
           $vccolumns = "col-md-3 col-sm-6 col-xs-12 col-xs-66" ;
           $columns_layout = "3";
        }elseif($columns == "5" ) {
           $vccolumns = " col-md-20 col-sm-6 col-xs-12 col-xs-66" ; 
           $columns_layout = "20";
        }else {
             $vccolumns = " col-md-2 col-sm-6 col-xs-12 col-xs-66" ; 
           $columns_layout = "2";
        }
        
		if ( $pagination == 'more-btn' ) {
			$woocommerce_loop['masonry'] = true;
		}

		if ( $pagination != 'arrows' ) {
			$woocommerce_loop['loop'] = $items_per_page * ( $paged - 1 );
		}
        $carousel_id = 'carousel-' . rand(100,999);
		$class .= ' pagination-' . $pagination;
		$class .= ' grid-columns-' . $columns;
		if( $woocommerce_loop['masonry'] ) {
			$class .= ' grid-masonry';
		}
        $classne = $data = $sizer = '';
        if ($layout != "carousel") {
       	$classne = ' jws-masonry';
       	$data  = 'data-masonry=\'{"selector":".tb-products-grid ", "columnWidth":".grid-sizer","layoutMode":"packery"}\'';
       	$sizer = '<div class="grid-sizer size-'.$columns_layout.'"></div>';
        }
		ob_start();

		if(!$is_ajax) echo '<div class="kitgreen-products-element ' .$pagination.'">';

	    if(!$is_ajax && $pagination != 'more-btn') echo '<div class="kitgreen-products-loader"><div class="overlay-loader">
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div></div>';
	    if(!$is_ajax) echo '<div class="products elements-grid row kitgreen-products-holder ' . esc_attr( $class) . ''.esc_attr( $classne ).'" data-paged="1" data-atts="' . esc_attr( $encoded_atts ) . '" '.wp_kses_post( $data ).' >';
		
		if ( $products->have_posts() ) : 
            if( $layout == 'carousel' ) echo '<div id="ptcarousel" ><div class="owl-carousel  product-items owl-theme owl-loaded"> ';
             echo wp_kses_post( $sizer );
			while ( $products->have_posts() ) :
				$products->the_post();
                ?> <div class="tb-products-grid <?php if ($layout == "grid") echo wp_kses_post($vccolumns); ?>"> <?php
				wc_get_template_part( 'content', 'productvc' ); 
                ?></div><?php   
			endwhile; 
            if( $layout == 'carousel' ) echo '</div></div> ';
		endif;

    	if(!$is_ajax) echo '</div>';

		woocommerce_reset_loop();
		wp_reset_postdata();

		if ( $products->max_num_pages > 1 && !$is_ajax ) {
			?>
		    	<div class="products-footer">
		    		<?php if ($pagination == 'more-btn'): ?>
		    			<a href="#" class=" kitgreen-products-load-more"><?php _e('Load More', 'kitgreen'); ?></a>
                        <p style="display: none;" class="loaded-all"><?php esc_html_e('All Product Loaded.' , 'kitgreen') ?></p>
		    		<?php elseif ($pagination == 'arrows'): ?>
		    			<a href="#" class="btn kitgreen-products-load-prev disabled"><?php _e('Prev', 'kitgreen'); ?></a>
		    			<a href="#" class="btn kitgreen-products-load-next"><?php _e('Next', 'kitgreen'); ?></a>
		    		<?php endif ?>
		    	</div>
                <div class="clear"></div>
		    <?php 
		}

    	if(!$is_ajax) echo '</div>';
        if ($layout == "carousel") {
           $items = array();
			$items['desktop'] = ($slides_per_view > 0) ? $slides_per_view : 1;
			$items['desktop_small'] = ($items['desktop'] > 1) ? $items['desktop'] - 1 : 1;
			$items['tablet'] = ($items['desktop_small'] > 1) ? $items['desktop_small'] -1 : 2;
			$items['mobile'] = ($items['tablet'] > 2) ? $items['tablet'] - 2 : 1;

			if($items['mobile'] > 2) {
				$items['mobile'] = 2;
			}

			?>
            
			<script type="text/javascript">
				jQuery( document ).ready(function( $ ) {

	                var owl = $("#ptcarousel .owl-carousel");

					$( window ).bind( "vc_js", function() {
						owl.trigger('refresh.owl.carousel');
					} );

					var options = {
	            		rtl: $('body').hasClass('rtl'),
			            items: <?php echo esc_js( $items['desktop'] ); ?>, 
			            responsive: {
			            	979: {
			            		items: <?php echo esc_js( $items['desktop'] ); ?>,
                                margin: 30,

			            	},
			            	768: {
			            		items: <?php echo esc_js( $items['desktop_small'] ); ?>,
                                margin: 10,
			            	},
			            	479: {
			            		items: <?php echo esc_js( $items['tablet'] ); ?>,
                                margin: 5,
			            	},
			            	0: {
			            		items: <?php echo esc_js( $items['tablet'] ); ?>,
                                margin: 0,
			            	}
			            },
			            autoplay: <?php echo wp_kses_post(($autoplay == 'no') ? 'true' : 'false'); ?>,
			            autoplayTimeout: <?php echo wp_kses_post($speed); ?>,
			            dots: <?php echo wp_kses_post(($hide_dots == 'yes') ? 'false' : 'true'); ?>,
			            nav: <?php echo wp_kses_post(($hide_prev_next_buttons == 'yes') ? 'false' : 'true'); ?>,
			            slideBy:  <?php echo wp_kses_post(($scroll_per_page == 'yes') ? '\'page\'' : 1); ?>,
			            navText:['<span class="ion-ios-arrow-thin-left"></span>','<span class="ion-ios-arrow-thin-right"></span>'],
			            loop: <?php echo wp_kses_post(($wrap == 'yes') ? 'true' : 'false'); ?>,
                        margin: <?php echo wp_kses_post($space); ?>,
			            onRefreshed: function() {
			            	$(window).resize();
			            }
					};

	                owl.owlCarousel(options);

				});
			</script>
           <?php
        
        }
        
		$output = ob_get_clean();

	    if( $is_ajax ) {
	    	$output =  array(
	    		'items' => $output,
	    		'status' => ( $products->max_num_pages > $paged ) ? 'have-posts' : 'no-more-posts'
	    	);
	    }
	    
	    return $output;

	}
}

if( ! function_exists( 'kitgreen_get_shortcode_products_ajax' ) ) {
	add_action( 'wp_ajax_kitgreen_get_products_shortcode', 'kitgreen_get_shortcode_products_ajax' );
	add_action( 'wp_ajax_nopriv_kitgreen_get_products_shortcode', 'kitgreen_get_shortcode_products_ajax' );
	function kitgreen_get_shortcode_products_ajax() {
		if( ! empty( $_POST['atts'] ) ) {
			$atts = $_POST['atts'];
			$paged = (empty($_POST['paged'])) ? 2 : (int) $_POST['paged'];
			$atts['ajax_page'] = $paged;

			$data = kitgreen_shortcode_products($atts);

			echo json_encode( $data );

			die();
		}
	}
}

if( ! function_exists( 'kitgreen_get_default_product_shortcode_atts' ) ) {
	function kitgreen_get_default_product_shortcode_atts() {
		return array(
	        'post_type'  => 'product',
	        'layout' => 'grid',
	        'include'  => '',
	        'custom_query'  => '',
	        'taxonomies'  => '',
	        'pagination'  => '',
	        'items_per_page'  => 12,
	        'columns'  => 4,
	        'sale_countdown'  => 0,
	        'offset'  => '',
	        'orderby'  => 'date',
	        'order'  => 'DESC',
	        'meta_key'  => '',
	        'exclude'  => '',
	        'class'  => '',
            'space' => '30',
	        'ajax_page' => '',
			'speed' => '5000',
			'slides_per_view' => '1',
			'wrap' => '',
			'autoplay' => 'no',
            'hide_dots' => ' ',
			'hide_pagination_control' => '',
			'hide_prev_next_buttons' => '',
			'scroll_per_page' => 'yes',
			'carousel_js_inline' => 'no',
	        'img_size' => 'shop_catalog',
	        'force_not_ajax' => 'no',
	    );
	}
}

// Register shortcode [html_block id="111"]
insert_shortcode('vc_content', 'kitgreen_html_block_shortcode');

if( ! function_exists( 'kitgreen_html_block_shortcode' ) ) {
	function kitgreen_html_block_shortcode($atts) {
		extract(shortcode_atts(array(
			'id' => 0
		), $atts));

		return kitgreen_get_html_block($id);
	}
}
/**
* ------------------------------------------------------------------------------------------------
* kitchen tabs shortcode
* ------------------------------------------------------------------------------------------------
*/

if( ! function_exists( 'kitgreen_shortcode_kitchen_tabs' ) ) {
	function kitgreen_shortcode_kitchen_tabs($atts = array(), $content = null) {
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';
		extract(shortcode_atts( array(
			'el_class' => '',
		), $atts ));
	    // Extract tab titles
	    preg_match_all( '/kitchen_tab([^\]]+)/i', $content, $matches, PREG_OFFSET_CAPTURE );
	    $tab_titles = array();

	    if ( isset( $matches[1] ) ) {
	      	$tab_titles = $matches[1];
	    }
	    $tabs_nav = '';
	    $first_tab_title = '';
	    $tabs_nav .= '<ul class="kitchen-tabs-title">';
	    $_i = 0;
	    foreach ( $tab_titles as $tab ) {
	    	$_i++;
			$tab_atts = shortcode_parse_atts( $tab[0] );
            $image = '';
            $image = $tab_atts['image']; 
            $img_id = preg_replace( '/[^\d]/', '', $image );
            $img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => '230x125' , 'class' => 'tabs-icon' ) );
			$encoded_atts = json_encode( $tab_atts );
			if( $_i == 1 ) $first_tab_title = $tab_atts['title'];
			$class = ( $_i == 1 ) ? 'active-tab-title' : '';
			if ( isset( $tab_atts['title'] ) ) {
				$tabs_nav .= '<li data-atts="' . esc_attr( $encoded_atts ) . '" class="' . esc_attr( $class ) . '"">'.$img['thumbnail'].' <span class="tab-label">'.$tab_atts['title'] . '</span></li>';
			}
	    }
	    $tabs_nav .= '</ul>';

		$tabs_id = rand(999,9999);

		$class .= ' tabs-' . $tabs_id;

		$class .= ' ' . $el_class;

		ob_start(); ?>
			<div class="kitgreen-kitchen-tabs-portfolio<?php echo esc_attr( $class ); ?>">
				<div class="kitgreen-tabs-header-portfolio">
					<div class="tabs-navigation-wrapper">
						<?php 
							echo wp_kses_post($tabs_nav);
						?>
					</div>
				</div>
                <div class="kitgreen_content_container">
                       <div class="kitgreen-kitchen-loader">
                          <div class="overlay-loader">
                                <div>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                <?php 
					$first_tab_atts = shortcode_parse_atts( $tab_titles[0][0] );
					echo kitgreen_shortcode_kitchen_tab( $first_tab_atts );
				?>        
                </div>
				
			</div>
		<?php
		$output = ob_get_contents();
		ob_end_clean();

		return $output; 
	}
	insert_shortcode( 'kitchen_tabs', 'kitgreen_shortcode_kitchen_tabs' );
}
if( ! function_exists( 'kitgreen_shortcode_kitchen_tab' ) ) {
	function kitgreen_shortcode_kitchen_tab($atts) {
		global $wpdb, $post;
		if( ! function_exists( 'wpb_getImageBySize' ) ) return;
		$output = $class = '';
	    $is_ajax = (defined( 'DOING_AJAX' ) && DOING_AJAX);
        extract(shortcode_atts( array(
          'iamge'=>'',
          'title'=>'',
          'img_size' =>'1520x750',
          'label' => 'View Detail',
          'taxonomies' => '',
      	    'orderby' => 'post_date',
			'order' => 'DESC',
            'posts_per_page' => '',
            'ajax_page' => ''
		), $atts ));
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
		if( $ajax_page > 1 ) $paged = $ajax_page;
        
        $args = array(
			'post_type' => 'portfolio',
			'posts_per_page' => $posts_per_page,
			'orderby' => $orderby,
			'order' => $order,
			'paged' => $paged
		);
        
		if( get_query_var('portfolio') != '' ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'portfolio',
					'field'    => 'slug',
					'terms'    => get_query_var('portfolio')
				),
			);
		}

		if( ! empty( $taxonomies ) ) {
			$taxonomy_names = get_object_taxonomies('portfolio');
			$terms = get_terms( $taxonomy_names, array(
				'orderby' => 'name',
				'include' => $taxonomies
			));

			if( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
				$args['tax_query'] = array('relation' => 'OR');
				foreach ($terms as $key => $term) {
					$args['tax_query'][] = array(
				        'taxonomy' => $term->taxonomy,     
				        'field' => 'slug',                  
				        'terms' => array( $term->slug ),   
				        'include_children' => true,        
				        'operator' => 'IN' ,
                        'include' => $taxonomies 
					);
				}
			}
		}
        
        $query = new WP_Query( $args );
		ob_start();
           wp_enqueue_style( 'twentytwenty-css', URI_PATH.'/assets/css/css_jws/twentytwenty.css', false );
           wp_enqueue_script( 'jquery-event', URI_PATH.'/assets/js/dev/jquery.event.move.js', array('jquery'), '', true  );
           wp_enqueue_script( 'jquery-twentytwenty', URI_PATH.'/assets/js/dev/jquery.twentytwenty.js', array('jquery'), '', true  );
         ?>
			<?php if(!$is_ajax): ?>	
				<div class="kitgreen-tab-portfolio kitgreen-tab-content">
			<?php endif; 
              if ( $query->have_posts() ) : 
    			while ( $query->have_posts() ) :
    				$query->the_post(); $options = get_post_meta( get_the_ID(), '_custom_wc_thumb_options', true ); 
                    $image_id ='';
                    if(isset($options['image_before'])) {
                      $image_id = $options['image_before'];  
                    }
                    $img_id = preg_replace( '/[^\d]/', '', $image_id );
                    $img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size , 'class' => 'tabs-icon' ) );
                    
                    
                    $image_id2 ='';
                    if(isset($options['image_after'])) {
                      $image_id2 = $options['image_after'];  
                    }
                    $img_id2 = preg_replace( '/[^\d]/', '', $image_id2 );
                    $img2 = wpb_getImageBySize( array( 'attach_id' => $img_id2, 'thumb_size' => $img_size , 'class' => 'tabs-icon' ) );
                
                    ?>
                    <div class="item_loc">
                        <div class="image_before_after">
                                <?php echo wp_kses_post($img['thumbnail']);  ?>
                                <?php echo wp_kses_post($img2['thumbnail']);  ?>
                        </div>
                        <div class="title">
                            <h4>
                                <span class="label_fi"><?php echo esc_html__('NAME PROJECT: ','kitgreen') ?></span><?php the_title(); ?>
                            </h4>
                        </div>
                        <div class="cat">
                                <?php 
                                    $item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' );
                                    if ( $item_cats ):
                                		foreach ( $item_cats as $item_cat ) {
                                	    ?>
                                             <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'portfolio_cat')); ?>">
                                                <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                                             </a><span>/</span> 
                                		<?php }
                        
                                   	endif;
                              ?>
                          </div>
                          <div class="excerpt">
                            <?php the_excerpt(); ?>
                          </div>
                          <div class="redmore ">
                          <a  href="<?php the_permalink(); ?>">
                                <?php echo esc_html($label); ?>
                                <span class="lnr lnr-arrow-right"></span>  
                          </a>
                          </div>
                     </div>
                        <?php
    			endwhile; 
    		  endif;
    	if(!$is_ajax) echo '</div>';
		wp_reset_postdata();
	    if(!$is_ajax): ?>
        <script>
           	    jQuery(document).ready(function($) {
                    $(window).load(function() {
                      $(".image_before_after").twentytwenty();
                    });                                                                     
               	});
        </script>	
		</div>
		<?php endif; ?>
		<?php
		$output = ob_get_clean();
	    if( $is_ajax ) {
	    	$output =  array(
	    		'html' => $output
	    	);
	    }
	    return $output;
	}
	insert_shortcode( 'kitchen_tab', 'kitgreen_shortcode_kitchen_tab' );
}
if( ! function_exists( 'kitgreen_get_kitchen_tab_ajax' ) ) {
	add_action( 'wp_ajax_kitgreen_get_kitchen_tab_shortcode', 'kitgreen_get_kitchen_tab_ajax' );
	add_action( 'wp_ajax_nopriv_kitgreen_get_kitchen_tab_shortcode', 'kitgreen_get_kitchen_tab_ajax' );
	function kitgreen_get_kitchen_tab_ajax() {
		if( ! empty( $_POST['atts'] ) ) {
			$atts = $_POST['atts'];
			$data = kitgreen_shortcode_kitchen_tab($atts);
			echo json_encode( $data );
			die();
		}
	}
}