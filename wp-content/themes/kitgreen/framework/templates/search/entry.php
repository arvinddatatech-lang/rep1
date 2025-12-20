<div class="search_item">          
<div class="bog-image">
<?php if ( has_post_thumbnail() ) : ?>
    <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
        <?php the_post_thumbnail(); ?>
    </a>
<?php endif; ?>
</div>
<div class="content-blog">
    <div class="content-inner">
        <div class="title">
            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
        </div>
       <div class="blog-innfo"> <span class="child"><?php  echo get_the_date(); ?></span></span>
        </div>
    </div>
</div>
<div class="link_content">
        <a href="<?php the_permalink(); ?>"><?php  esc_html_e("Read More" , "kitgreen");  ?></a>
</div>
</div>