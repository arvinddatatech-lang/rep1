<?php
$jwstheme_options = $GLOBALS['jwstheme_options'];
$tb_blog_show_post_image = (int) isset($jwstheme_options['tb_blog_show_post_image']) ? $jwstheme_options['tb_blog_show_post_image'] : 1;
$tb_blog_show_post_title = (int) isset($jwstheme_options['tb_blog_show_post_title']) ? $jwstheme_options['tb_blog_show_post_title'] : 1;
$tb_blog_show_post_meta = (int) isset($jwstheme_options['tb_blog_show_post_meta']) ? $jwstheme_options['tb_blog_show_post_meta'] : 1;
$tb_blog_show_post_excerpt = (int) isset($jwstheme_options['tb_blog_show_post_excerpt']) ? $jwstheme_options['tb_blog_show_post_excerpt'] : 1;
$tb_blog_post_readmore_text = (int) isset($jwstheme_options['tb_blog_post_readmore_text']) ? $jwstheme_options['tb_blog_post_readmore_text'] : 1;
$audio_type = get_post_meta(get_the_ID(), 'tb_post_audio_type', true);
$audio_url = get_post_meta(get_the_ID(), 'tb_post_audio_url', true);
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="ro-blog-sub-article">
		<div class="wp-post-media">
			<?php
			if(!is_home()){
				if ($audio_type == 'post'){
					$shortcode = jwstheme_get_shortcode_from_content('audio');
					if($shortcode) echo do_shortcode($shortcode);
				} elseif ($audio_type == 'ogg' || $audio_type == 'mp3' || $audio_type == 'wav'){
					if($audio_url) echo do_shortcode('[audio '.$audio_type.'="'.$audio_url.'"][/audio]');
				}
			}
			?>
		</div>
		<?php if ( $tb_blog_show_post_title ) { ?>
			<h5><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h5>
		<?php } ?>
		<?php if ( $tb_blog_show_post_excerpt ) { ?> 
			<div class="ro-sub-content clearfix"><?php the_excerpt(); ?></div>
		<?php } ?>
		<?php if ( $tb_blog_post_readmore_text ) { ?>
			<a class="ro-btn ro-btn-2" href="<?php the_permalink() ?>"><?php echo esc_html( $tb_blog_post_readmore_text ); ?></a>
		<?php } ?>
	</div>
</article>