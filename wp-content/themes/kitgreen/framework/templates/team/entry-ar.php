<?php 
global $kitgreen_loop;
$option = get_post_meta( get_the_ID(), '_custom_team_options', true );

?>
<div class="item_inner" onclick="window.location.href='<?php the_permalink(); ?>'">
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