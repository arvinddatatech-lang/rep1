<?php get_header();
$options = get_post_meta( get_the_ID(), '_custom_pp_options', true );
$layout = "";
if( !isset($options['pp-single-style'])) {
  $layout = cs_get_option('pp-single-style');  
}else {
  $layout = $options['pp-single-style'];  
}
$blog_shortcoe = cs_get_option('blog_before_footer'); 
 ?>
<?php $page_title = cs_get_option('golobal-enable-page-title'); if($page_title == "1") : 
        echo jwstheme_title_bar();
endif; ?>
<div class="portfolio-single <?php echo esc_attr($layout); ?>">
        <?php get_template_part( 'framework/templates/portfolio/single/'.$layout.'' );  ?>
           <div class="prp_bottom container">
               <div class="nav-post">
                    <?php 
                        $prev_post = get_previous_post(); $next_post = get_next_post();    
                            if(!empty($prev_post)):
                                        ?><div class="nav-box previous"><?php
                                               echo '<a href="'.get_the_permalink($prev_post->ID).'" >'.'<div class="text-nav"><h3>'.get_the_title($prev_post->ID).'</h3><p class="prev text_ac"><span class="lnr lnr-arrow-left"></span><span class="text_bt">'.esc_html('Previous Project' , 'kitgreen').'</span></p></div></a>';  
                                        ?></div> <?php    
                                        endif;
                                        if(!empty($next_post)):
                                            ?><div class="nav-box next"><?php
                                               echo '<a href="'.get_the_permalink($next_post->ID).'" ><div class="text-nav"><h3>'.get_the_title($next_post->ID).'</h3><p class="next text_ac"><span class="text_bt">'.esc_html('Next Post' , 'kitgreen').'</span><span class="lnr lnr-arrow-right"></span></p></div></a>';  
                                        ?></div> <?php   
                             endif;
                            ?>              
               </div> 
               <div class="icon-get-link"><a href="<?php echo esc_url(home_url('/')); ?>"><span class="lnr lnr-menu"></span></a></div>
           </div>               
</div>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div> 
<?php get_footer(); ?>