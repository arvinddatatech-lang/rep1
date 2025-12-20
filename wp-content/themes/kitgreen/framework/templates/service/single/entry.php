<?php 
global $kitgreen_loop;
$option = get_post_meta( get_the_ID(), '_custom_service_options', true );
$previous_post = get_previous_post();
$next_post = get_next_post();
if(!empty($previous_post)) {
  $prev_value = get_post_meta( $previous_post->ID, '_custom_service_options', $single = true);  
}
if(!empty($next_post)) {
  $next_value = get_post_meta( $next_post->ID, '_custom_service_options', $single = true);  
}


if(isset($option['icon_service'])) {
  $icon_url = $option['icon_service'];  
}else {
  $icon_url = "";  
}

if(isset($prev_value['icon_service'])) {
  $icon_url1 = $prev_value['icon_service'];  
}else {
  $icon_url1 = "";  
}

if(isset($next_value['icon_service'])) {
  $icon_url2 = $next_value['icon_service'];  
}else {
  $icon_url2 = "";  
}

if(isset($option['service_description'])) {
  $description = $option['service_description'];  
}else {
  $description = "";  
}

$icon = wp_get_attachment_image_src( $icon_url1 , 'full', true );
$icon2 = wp_get_attachment_image_src( $icon_url2 , 'full', true );  ?>
<div class="service_single_inner" >
    <div class="service_meta row">
        <div class="service-content col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="service_icon">
                <?php $icon = wp_get_attachment_image_src( $icon_url , 'full', true ); ?>
                <img class="icon" src="<?php echo esc_url( $icon[0] ) ?>"  alt=" <?php echo get_bloginfo( 'name' ) ?>" />
            </div>
            <div class="right">
                 <div class="title">
                <h6><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
                  </div>
                <div class="service_description">
                    <?php
                        echo  wp_kses_post($description);
                     ?>
                </div>
            </div>
        </div>
        <div class="service-image col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <?php if (has_post_thumbnail()) the_post_thumbnail( 'jws-imge-crop-thumbnail-service'); ?>
        </div>
    </div>
    <div class="content_vc">
        <?php 
            the_content();
         ?>
    </div>
    
</div>
<div class="nav-post display_flex">
        <?php 
                if(!empty($previous_post)):
                                ?><div class="nav-box previous"><?php
                                   echo '<a href="'.get_the_permalink($previous_post->ID).'" >'.'<div class="text-nav"><div class="prev_tt"><span class="lnr lnr-arrow-left"></span><span class="text_ser">'.esc_html('Previous Service' , 'kitgreen').'</span></div>'.get_the_title($previous_post->ID).'</div><img class="icon" src="'.esc_url( $icon[0] ).'"  alt="'.get_bloginfo( 'name' ).'" /></a>';  
                                ?></div> <?php    
                              endif;
                            if(!empty($next_post)):
                                ?><div class="nav-box next"><?php
                                    echo '<a href="'.get_the_permalink($next_post->ID).'" ><img class="icon" src="'.esc_url( $icon2[0] ).'"  alt="'.get_bloginfo( 'name' ).'" />'.'<div class="text-nav"><div class="prev_tt"><span class="text_ser">'.esc_html('Next Service' , 'kitgreen').'</span><span class="lnr lnr-arrow-right"></span></div>'.get_the_title($next_post->ID).'</div></a>';  
                                ?></div> <?php   
                 endif;
                ?>              
</div> 