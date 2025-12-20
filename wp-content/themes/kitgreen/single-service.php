<?php get_header();
$options = get_post_meta( get_the_ID(), '_custom_service_options', true );
$blog_shortcoe = cs_get_option('blog_before_footer'); 
if(isset($option['icon_service'])) {
  $icon_url = $option['icon_service'];  
}else {
  $icon_url = "";  
}
$icon = wp_get_attachment_image_src( $icon_url , 'full', true ); ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
endif; ?>
<div class="container service-single">

        <?php 		while ( have_posts() ) : the_post();
					   get_template_part( 'framework/templates/service/single/entry' ); 
					endwhile; 
         ?>
        <div class="icon-get-link"><a href="<?php echo esc_url(home_url('/')); ?>"><span class="lnr lnr-menu"></span></a></div>              
</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>  
<?php get_footer(); ?>