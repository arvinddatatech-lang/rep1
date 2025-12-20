<?php get_header();
    $options = get_post_meta( get_the_ID(), '_custom_team_options', true );
 ?>   
 <div class="row team_lf">
        
       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 image_team">
           <?php if (has_post_thumbnail()) the_post_thumbnail( 'jws-imge-team-single-size' ); ?> 
       </div>
       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 content_team">
            <div class="content">
                <h6 class="name_team">
                    <?php the_title(); ?>
                </h6>
                <div class="position">
                    <p><?php 
                        if( isset($options['team_position']) && !empty($options['team_position'])) {
                            echo wp_kses_post($options['team_position']); 
                        }
                     ?></p>
                </div>
                <div class="description">
                    <?php 
                        if( isset($options['team_description']) && !empty($options['team_description'])) {
                            echo wp_kses_post($options['team_description']); 
                        }
                     ?>
                </div>
                 <ul class="social">
                    <?php if( isset($options['team_fa']) && !empty($options['team_fa'])) : ?>
                    <li><a href="<?php echo esc_url($options['team_fa']); ?>"><span class="ion-social-facebook-outline"></span></a></li>
                    <?php endif; ?>
                     <?php if( isset($options['team_tw']) && !empty($options['team_tw'])) : ?>
                    <li><a href="<?php echo esc_url($options['team_tw']); ?>"><span class="ion-social-twitter-outline"></span></a></li>
                    <?php endif; ?>
                    <?php if( isset($options['team_em']) && !empty($options['team_em'])) : ?>
                    <li><a href="<?php echo esc_url($options['team_em']); ?>"><span class="lnr lnr-envelope"></span></a></li>
                    <?php endif; ?>
                </ul>
                <div class="team_visub">
                    <?php 
                    while ( have_posts() ) : the_post();
            			 the_content();
                    endwhile;
                    ?>
                </div>
             </div>
       </div>
          <div class="nav-post">
        <?php 
            $prev_post = get_previous_post(); $next_post = get_next_post();    
                if(!empty($prev_post)):
                                ?><div class="nav-box previous"><?php
                                   echo '<a href="'.get_the_permalink($prev_post->ID).'" >'.'<span class="lnr lnr-chevron-left"></span></a>';  
                                ?></div> <?php    
                              endif;
                            if(!empty($next_post)):
                                ?><div class="nav-box next"><?php
                                   echo '<a href="'.get_the_permalink($next_post->ID).'" ><span class="lnr lnr-chevron-right"></span></a>';  
                                ?></div> <?php   
                 endif;
                ?>              
        </div> 
</div>