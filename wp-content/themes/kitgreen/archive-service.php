<?php
/* 
Template Name: Service Page
*/
get_header( );  ?>
    <?php 

        $blog_shortcoe = cs_get_option('blog_before_footer');     
     
        $args = array(
	    	'post_type' => 'service',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => -1
		);
        $service_query = new WP_Query($args);
                            $class = $data = $sizer = '';
                            $class = 'jws-masonry';
                        	$data  = 'data-masonry=\'{"selector":".masonry-inner  ", "columnWidth":".grid-sizer","layoutMode":"packery"}\'';
                    
    ?>
   <?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
    endif; ?>
	<?php if ( have_posts() ) : ?>
					<div  class="container main-content">
                      <div class="service-container kitgreen-service-holder grid2 ">
                            <div class="row  <?php echo esc_attr( $class ); ?>" <?php echo wp_kses_post( $data ); ?>>
					       	<?php while ( $service_query->have_posts() ) :
                               $service_query->the_post(); 
                            ?>
                            <div class="service-item  col-md-4 col-sm-6 col-xs-12"> 
								<?php  get_template_part( 'framework/templates/service/entry-ar' );  ?>
                            </div>    
							<?php endwhile; // end of the loop. ?>
                            </div>
						</div>  
                        <?php endif; ?>
				</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>  
<?php get_footer( ); ?>
