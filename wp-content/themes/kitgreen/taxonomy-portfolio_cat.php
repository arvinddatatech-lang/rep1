<?php
get_header( );  ?>
    <?php 
        $post_per_page_pp = cs_get_option('pp-number-per-page');
        $args = array(
	    	'post_type' => 'portfolio',
	    	'status' => 'published',
	    	'paged' => $paged,	
	    	'posts_per_page' => $post_per_page_pp,

		);
        $blog_shortcoe = cs_get_option('blog_before_footer');  
        $columns_layout =  cs_get_option( 'pp-column' );
        $turn_full_width = cs_get_option('pp-layout-full');
        $portfolio_query = new WP_Query($args);
                            $class = $data = $sizer = '';
                            $class = 'jws-masonry';
                        	$data  = 'data-masonry=\'{"selector":".masonry-inner  ", "columnWidth":".grid-sizer","layoutMode":"packery"}\'';
                        	$sizer = '<div class="grid-sizer size-'.$columns_layout.'"></div>';
                    
    ?>
   <?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
    endif; ?>
					<div  class="<?php if($turn_full_width == '1') {echo 'no_' ; } ?>container main-content">
                      <div class="portfolio-container ">
                            <div class="row kitgreen-portfolio-holder  <?php echo esc_attr( $class ); ?>" <?php echo wp_kses_post( $data ); ?>>
                            <?php
					        echo wp_kses_post( $sizer );
        					if( have_posts() ) {
        						while ( have_posts() ) : the_post();
        						 ?><div class="masonry-inner  col-md-<?php echo esc_attr($columns_layout); ?> col-sm-6 col-xs-12"> 
								<?php  get_template_part( 'framework/templates/portfolio/entry' );  ?>
                                </div>   
                                <?php 
        						endwhile;
        					}else{
        						get_template_part( 'framework/templates/entry', 'none');
        					}
        					?>    
                            </div>
						</div>  
				</div>
<div class="before-footer">   
    <?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>
<?php get_footer( ); ?>
