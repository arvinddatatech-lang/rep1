 <?php 
global $kitgreen_loop;
?>  
<div class="item_inner">           
<?php if($kitgreen_loop[ 'thumbnail_show']=='1' ) : ?>
<div class="bog-image">
    <a href="<?php the_permalink() ?>">
        <?php echo kitgreen_get_post_thumbnail( 'large'); ?>
    </a>
</div>
<?php endif; ?>
<div class="content-blog <?php if($kitgreen_loop[ 'thumbnail_show'] != '1') echo " border_top "; ?>">
    <div class="content-inner">
        <div class="blog-info display_flex">
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

    </div>
</div>
</div>