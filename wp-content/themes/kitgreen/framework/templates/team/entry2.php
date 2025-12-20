<?php 
global $kitgreen_loop;
$option = get_post_meta( get_the_ID(), '_custom_team_options', true );

?>
<div class="item_inner" onclick="window.location.href='<?php the_permalink(); ?>'">
    <div class="team-image">
        <?php echo kitgreen_get_post_thumbnail( 'large'); ?> 
        <ul class="social">
            <?php if( isset($option['team_fa']) && !empty($option['team_fa'])) : ?>
            <li><a href="<?php echo esc_url($option['team_fa']); ?>"><span class="ion-social-facebook-outline"></span></a></li>
            <?php endif; ?>
             <?php if( isset($option['team_tw']) && !empty($option['team_tw'])) : ?>
            <li><a href="<?php echo esc_url($option['team_tw']); ?>"><span class="ion-social-twitter-outline"></span></a></li>
            <?php endif; ?>
            <?php if( isset($option['team_em']) && !empty($option['team_em'])) : ?>
            <li><a href="<?php echo esc_url($option['team_em']); ?>"><span class="lnr lnr-envelope"></span></a></li>
            <?php endif; ?>
        </ul>
    </div>
    <div class="team-infomation">
        <div class="title">
            <h6><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
        </div>
        <div class="position">
            <p><?php 
                if( isset($option['team_position']) && !empty($option['team_position'])) {
                    echo wp_kses_post($option['team_position']); 
                }
             ?></p>
        </div>
    </div>

</div>