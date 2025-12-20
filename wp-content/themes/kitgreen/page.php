<?php get_header(); ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1"  ) : 
        echo jwstheme_title_bar();
    endif; ?>
	<div class="main-content ro-container">
		<?php while ( have_posts() ) : the_post(); ?>

			<?php 
             the_content();
             wp_link_pages(array(
                'before' => '<div class="page-links"><span class="page-links-title">' . esc_html__('Pages:', 'kitgreen') . '</span>',
                'after' => '</div>',
                'link_before' => '<span>',
                'link_after' => '</span>',
            ));
             ?>
			<div style="clear: both;"></div>

				
					<?php //if ( comments_open() || get_comments_number() ) comments_template(); ?>
				


		<?php endwhile; // end of the loop. ?>
	</div>
<?php get_footer(); ?>