<?php
get_header(); 
$content = cs_get_option( 'image_404' );
?>
<div id="jws-content">
    <div class="text-inner">
		<section class="error-404 not-found">
			<div id="content-wrapper">
                <?php echo do_shortcode($content); ?>
			</div>
		</section><!-- .error-404 -->
	</div>
</div>


<?php get_footer(); ?>