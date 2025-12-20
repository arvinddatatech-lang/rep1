<?php 
global $kitgreen_loop;
$num_comments = get_comments_number(); 
?>
<div class="item_inner" onclick="window.location.href='<?php the_permalink(); ?>'">
    <div class="bog-image">
            <?php echo kitgreen_get_post_thumbnail( 'large'); ?> 
    </div>
    <div class="content-blog">
         <div class="link_content">
            <a href="<?php the_permalink(); ?>"><span class="ion-ios-arrow-thin-right"></span></a>
        </div>
        <div class="blog-innfo"> <span class="child"><?php  echo get_the_date(); ?></span>
        </div>
        <div class="title">
            <h6><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6> </div>
        <div class="blog-bottom display_flex">
            <div class="comment"><span class="ion-ios-chatbubble-outline"></span>
                <?php echo wp_kses_post($num_comments) ?>
            </div>
            <?php if($kitgreen_loop[ 'review']) : ?>
            <div class="review"><span class="ion-ios-eye-outline"></span>
                <?php echo getPostViews(get_the_ID());?>
            </div>
            <?php endif; ?>
            <?php if($kitgreen_loop[ 'like'] && function_exists( 'zilla_likes') ) : ?>
            <div class="like">
                <?php zilla_likes(); ?>
            </div>
            <?php endif; ?>
            <div class="author"><span class="child"><?php esc_html_e('By ', 'kitgreen'); ?></span>
                <?php the_author() ?>
            </div>
        </div>
    </div>

</div>