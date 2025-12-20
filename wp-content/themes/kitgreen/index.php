<?php get_header();$blog_shortcoe = cs_get_option('blog_before_footer');  ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
endif; ?>
	<div class="main-content">
		<div class="container">
            <div class="kitgreen-blog-holder jws-masonry border-bottom row" data-masonry='{"selector":".post-item ", "columnWidth":".grid-sizer","layoutMode":"packery"}'>  
			     <div class="grid-sizer size-4"></div>
            	<?php
					if( have_posts() ) {
						while ( have_posts() ) : the_post();
                        ?> <div class="post-item layout-2  col-lg-4 col-md-4 col-sm-6 col-xs-12<?php if(is_sticky()) echo ' sticky'; ?>"><?php
						get_template_part( 'framework/templates/blog/entry-ar', get_post_format());
                        ?></div><?php
                  
						endwhile;
                            
					}else{
						get_template_part( 'framework/templates/entry', 'none');
					}
					?>
				</div>
                <?php    query_pagination(); ?>
			</div>
		</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>         
<?php get_footer(); ?>