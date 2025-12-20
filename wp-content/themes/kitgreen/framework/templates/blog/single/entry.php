<?php 
      $blog_img = cs_get_option('blog-thumbnail');
      $blog_tt = cs_get_option('blog-title'); 
      $blog_meta = cs_get_option('blog-meta');  
      $num_comments = get_comments_number();
 ?>   
<?php if($blog_img) : ?>
<div class="blog-details-img">
    <?php if (has_post_thumbnail()) the_post_thumbnail( 'jws-imge-crop-thumbnail-blog-classic'); ?>
    <div class="blog-details">
        <?php if($blog_meta) : ?>
        <div class="post-meta display_flex">
            <div class="date_cat">
                <div class="cat">
                   <?php 
                        $item_cats  = get_the_terms( get_the_ID(), 'category' );
                        if ( $item_cats ):
                    		foreach ( $item_cats as $item_cat ) {
                    	    ?>
                                 <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'category')); ?>">
                                    <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                                 </a><span>/</span> 
                    		<?php }
            
                       	endif;
                  ?>
                  </div>
                <span class="child"><?php  echo get_the_date(); ?></span>
            </div>
            <div class="info_post">
                <span class="line">/</span>
                <div class="author">
                <?php esc_html_e( 'Post by : ' , 'kitgreen'); ?><span class="name"><?php the_author(); ?></span>
                </div>
                <div class="review">
                    <span class="lnr lnr-menu-circle"></span>
                    <?php echo esc_html($num_comments); ?>
                </div>
                <div class="like">
                    <?php if( function_exists( 'zilla_likes') ) zilla_likes(); ?>
                </div>
            </div>
            
        </div>
        <?php endif; ?>
        <?php if($blog_tt) : ?>
            <h3><?php the_title(); ?></h3>
        <?php endif; ?>
</div>
</div>
<?php endif; ?>
<div class="blog-content">
    <?php the_content(); ?>
</div>                       