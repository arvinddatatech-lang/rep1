<?php
$jwstheme_options = $GLOBALS['jwstheme_options'];
$tb_post_show_post_image = (int) isset($jwstheme_options['tb_post_show_post_image']) ? $jwstheme_options['tb_post_show_post_image'] : 1;
$tb_post_show_post_title = (int) isset($jwstheme_options['tb_post_show_post_title']) ? $jwstheme_options['tb_post_show_post_title'] : 1;
$tb_post_show_post_meta = (int) isset($jwstheme_options['tb_post_show_post_meta']) ? $jwstheme_options['tb_post_show_post_meta'] : 1;
$tb_post_show_post_desc = (int) isset($jwstheme_options['tb_post_show_post_desc']) ? $jwstheme_options['tb_post_show_post_desc'] : 1;
$quote_type = get_post_meta(get_the_ID(), 'tb_post_quote_type', true);
$quote_content = '';
if($quote_type == 'custom'){
	$quote_content = get_post_meta(get_the_ID(), 'tb_post_quote', true);
	$quote_author = get_post_meta(get_the_ID(), 'tb_post_author', true);
}
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="ro-blog-sub-article">
		<?php if ( has_post_thumbnail() && $tb_post_show_post_image ) { ?>
			<?php the_post_thumbnail('full'); ?>
		<?php } ?>
		<?php if ( $quote_content ) { ?>
		<div class="text-center wp-post-media">
			<blockquote><?php echo ''.$quote_content; ?></blockquote>
			<span class="ro-quote-author"><?php echo ''.$quote_author; ?></span>
		</div>
		<?php } ?>
		<?php if ( $tb_post_show_post_title ) { ?>
			<h5><?php the_title(); ?></h5>
		<?php } ?>
		<?php if ( $tb_post_show_post_meta ) { ?>
			<div class="ro-blog-meta">
				<?php if ( is_sticky() ) { ?>
					<span class="publish"><?php _e('<i class="fa fa-thumb-tack"></i> Sticky', 'kitgreen'); ?></span>
				<?php } ?>
				<span class="publish"><?php _e('<i class="fa fa-clock-o"></i> ', 'kitgreen'); echo get_the_date(); ?></span>
				<span class="author"><?php _e('<i class="fa fa-user"></i> ', 'kitgreen'); echo get_the_author(); ?></span>
				<span class="categories"><?php the_terms(get_the_ID(), 'category', __('<i class="fa fa-folder-open"></i> ', 'kitgreen') , ', ' ); ?></span>
				<span class="tags"><?php the_tags( __('<i class="fa fa-tags"></i> ', 'kitgreen'), ', ', '' ); ?> </span>
			</div>
		<?php } ?>
		<?php if ( $tb_post_show_post_desc ) { ?> 
			<div class="ro-sub-content clearfix">
				<?php
					the_content();
					wp_link_pages(array(
						'before' => '<div class="page-links">' . __('Pages:', 'kitgreen'),
						'after' => '</div>',
					));
				?>
			</div>
		<?php } ?>
	</div>
</article>
