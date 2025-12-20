<div class="masonry-container">
<div class="item_portfolio grid">
<div  class="pp_inner">
    <div class="content_pp">
    <div class="content_ct">
    <div class="content_pp_inner">
    <h6 class="title">
    <a href="<?php the_permalink(); ?>">
    <?php 
        the_title();
    ?>
    </a>
    </h6>
    <div class="cat">
        <?php 
            $item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' );
            if ( $item_cats ):
        		foreach ( $item_cats as $item_cat ) {
        	    ?>
                     <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'portfolio_cat')); ?>">
                        <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                     </a><span>/</span> 
        		<?php }

           	endif;
      ?>
    </div>
    
    </div>
    </div>
    </div>
    <div class="redmore ">
        <a class="lnr lnr-link" href="<?php the_permalink(); ?>">
        </a>
    </div>
    <div class="image_pp">
    <?php 
     echo get_the_post_thumbnail( $post->ID, 'jws-imge-related_pp' );
    ?>
    </div>
</div>
</div>

</div>

