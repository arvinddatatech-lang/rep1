<?php get_header(); ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
endif; ?>
	<div class="main-content">
		<div class="container">
			<div class="row jws-masonry" data-masonry='{"selector":".ss-item ", "layoutMode":"packery"}'>
				<?php
					if( have_posts() ) {
						while ( have_posts() ) : the_post();
                        ?><div class="col-xs-12 col-sm-12 col-md-6 ss-item"><?php
						get_template_part( 'framework/templates/search/entry' ); 
                        ?> </div> <?php
						endwhile;
					}else{
						get_template_part( 'framework/templates/entry', 'none');
					}
					?>
				</div>
			</div>
		</div>
<?php get_footer(); ?>