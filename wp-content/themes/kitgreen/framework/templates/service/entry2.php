<?php 
global $kitgreen_loop;
$option = get_post_meta( get_the_ID(), '_custom_service_options', true );
if(isset($option['icon_service'])) {
  $icon_url = $option['icon_service'];  
}else {
  $icon_url = "";  
}
?>
<div class="service_inner" >
    <div class="service_icon">
        <?php $icon = wp_get_attachment_image_src( $icon_url , 'full', true ); ?>
        <img class="icon" src="<?php echo esc_url( $icon[0] ) ?>"  alt=" <?php echo get_bloginfo( 'name' ) ?>" />
    </div>
    <div class="service-content">
        <div class="title">
            <h6><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
        </div>
        <div class="excerpt">
            <?php the_excerpt(); ?>
        </div>
        <div class="readmore">
            <a href="<?php the_permalink(); ?>">[<?php echo esc_attr($kitgreen_loop['text_more']); ?>...]</a>
        </div>
    </div>

</div>