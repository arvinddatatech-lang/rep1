<?php 
global $kitgreen_loop;
?> 
<div class="post-item col-lg-4 col-md-4 col-sm-6 col-xs-12">            
<div class="bog-image">
    <a href="<?php the_permalink() ?>">
        <?php echo get_the_post_thumbnail( $post->ID, 'jws-imge-related_post' ); ?>
    </a>
</div>
<div class="content-blog">
    <div class="content-inner">
        <div class="blog-innfo display_flex">
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
        <div class="title">
            <h6><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
        </div>
        <div class="blog-excrept">
            <?php the_excerpt(); ?>
        </div>
        <div class="blog-bottom">
            <div class="link_content">
                <a href="<?php the_permalink(); ?>"><?php echo esc_attr($kitgreen_loop[ 'text_remore']) ?><span class="lnr lnr-arrow-right"></span></a>
            </div>    
        </div>

    </div>
</div>
</div>