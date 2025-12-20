<?php get_header(); ?>
<?php 
$blog_tag = cs_get_option('blog-tag'); 
$blog_author = cs_get_option('blog-author'); 
$blog_socail = cs_get_option('blog-social'); 
$blog_related = cs_get_option('blog-related'); 
$blog_shortcoe = cs_get_option('blog_before_footer'); 
// Get page options
$options = get_post_meta( get_the_ID(), '_custom_post_options', true );

// Get product single style
$style = ( is_array( $options ) && $options['post-single-style'] ) ? $options['post-single-style'] : ( cs_get_option( 'post-single-style' ) ? cs_get_option( 'post-single-style' ) : '1' );
// Get all sidebars
$sidebar = cs_get_option( 'post-sidebar' );
$column_sb = "";
$column_ct = "";
$class_ct = "";
if($style == "1" || $style == "3"  ) {
$column_sb = "col-lg-3 col-md-3 col-sm-12 col-xs-12 ";
$column_ct = "col-lg-9 col-md-9 col-sm-12 col-xs-12 "; 
$class_ct = "has_sidebar"; 
}else{
$column_sb = " ";
$column_ct = "col-lg-12 col-md-12 col-sm-12 col-xs-12 no-sidebar";   
}


 ?>
    <?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
    endif; ?>
	<div class="main-content jws-blog-detail blog-page <?php echo esc_attr($class_ct); ?>">
		
			<div class="container">
            <div class="row row-same-height">
				<!-- Start Left Sidebar -->
                <?php if($style == "1" ) : ?>
                <div class="sidebar_blog mobile_mr <?php echo esc_attr($column_sb , "kitgreen") ?>">
                <div class=" sidesticky">
					  <?php if ( is_active_sidebar( $sidebar ) ) {
                            		dynamic_sidebar( $sidebar );
      	                 } elseif ( is_active_sidebar( 'jws-sidebar-blog' ) ) {
                      		dynamic_sidebar( 'jws-sidebar-blog' );
      	               } ?>  
                 </div>                  
                </div>
	            <?php endif; ?>
                <?php if($style == "3" ) : ?>
                <div class="sidebar_blog mobile_mr hidden-lg hidden-md <?php echo esc_attr($column_sb , "kitgreen") ?>">
                <div class=" sidesticky">
					  <?php if ( is_active_sidebar( $sidebar ) ) {
                            		//dynamic_sidebar( $sidebar );
      	                 } elseif ( is_active_sidebar( 'jws-sidebar-blog' ) ) {
                      		//dynamic_sidebar( 'jws-sidebar-blog' );
      	               } ?>  
                 </div>                  
                </div>
                <?php endif; ?>
				<!-- End Left Sidebar -->
				<!-- Start Content -->
				<div class="<?php echo esc_attr($column_ct , "kitgreen") ?>">
                    <div class=" single-blog-page single-blog  ">
					<?php
					while ( have_posts() ) : the_post();
						get_template_part( 'framework/templates/blog/single/entry', get_post_format());
						setPostViews(get_the_ID());
					endwhile;
                    
					?>
                    </div>
                    <div class="blog-meta">
                        <?php  
                               if($blog_tag){
                                   echo jws_kitgreen_get_tags(); 
                                } 
                               if($blog_socail)  echo jwstheme_social_single(); 
                         ?>
                    </div>
                    <?php if($blog_author)  echo jwstheme_author_render(); ?>
     
                    <?php if($blog_related) echo jws_related_post(); ?>
                    
                    <?php 
                     // If comments are open or we have at least one comment, load up the comment template.
						if ( comments_open() || get_comments_number()  ) {
				
							comments_template();
						}
                     ?>
				</div>
				<!-- End Content -->
                <?php if($style == "3" ) : ?>
                <div class="sidebar_blog hidden-sm hidden-xs <?php echo esc_attr($column_sb , "kitgreen") ?>">
                <div class=" sidesticky">
					  <?php if ( is_active_sidebar( $sidebar ) ) {
                            		dynamic_sidebar( $sidebar );
      	                 } elseif ( is_active_sidebar( 'jws-sidebar-blog' ) ) {
                      		dynamic_sidebar( 'jws-sidebar-blog' );
      	               } ?>  
                 </div>                  
                </div>
                <?php endif; ?>
			</div>
		</div>
	</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>    
<?php get_footer(); ?>