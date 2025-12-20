<?php get_header();
$options = get_post_meta( get_the_ID(), '_custom_pp_options', true );
$blog_shortcoe = cs_get_option('blog_before_footer'); 
 ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
endif; ?>
<div class="container team-single">
        <?php get_template_part( 'framework/templates/team/single/entry' );  ?>
    <div class="related_team ">
       <?php echo jws_related_post(); ?> 
    </div>                
</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>
<?php get_footer(); ?>