<?php get_header();
    $options = get_post_meta( get_the_ID(), '_custom_pp_options', true );
    $booking_popup = cs_get_option('booking-popup'); 
 ?>
 <div class="defaul_container container">
   <div class="content_vc">
        <?php 
        while ( have_posts() ) : the_post();
			 the_content();
        endwhile; ?>
   </div> 
   <div class="content_meta row">
         <div class="pp_meta_left col-md-6">
                <div class="item"><span class="even"><i class="lnr lnr-calendar-full"></i><?php echo esc_html('Date' , 'kitgreen')?></span><span class="odd"><?php  echo get_the_date(); ?></span></div>
                <?php if(isset($options['pp_layout'])) : ?>
                <div class="item">
                    <span class="even"><i class="lnr lnr-layers"></i><?php esc_html_e('Layout' , 'kitgreen'); ?> </span><span class="odd"> <?php echo wp_kses_post($options['pp_layout']);  ?></span>
                </div>
                <?php endif; ?>
                <?php if(isset($options['pp_code'])) : ?>
                <div class="item">
                    <span class="even"><i class="lnr lnr-text-align-justify"></i><?php esc_html_e('Design Code' , 'kitgreen'); ?> </span><span class="odd"><?php echo wp_kses_post($options['pp_code']);?></span>
                </div>
                <?php endif; ?>
                <?php if(isset($options['pp_price'])) : ?>
                <div class="item">
                    <span class="even"><i class="ion-social-usd-outline"></i><?php esc_html_e('Price' , 'kitgreen'); ?> </span><span class="odd"><?php echo wp_kses_post($options['pp_price']);?></span>
                </div>
                <?php endif; ?>
                <?php if(isset($options['pp_created'])) : ?>
                <div class="item">
                    <span class="even"><i class="lnr lnr-users"></i><?php esc_html_e('Created By' , 'kitgreen'); ?> </span><span class="odd"><?php echo wp_kses_post($options['pp_created']);?></span>
                </div>
                <?php endif; ?>

        </div> 
       <div class="pp_meta_right col-md-6">
                <h3 class="pp-title"><?php the_title(); ?></h3>
                <div class="category">
                    <?php
                    if(is_object_in_term(get_the_ID(), 'portfolio_cat')) {  
                        $terms = get_the_terms( get_the_ID() , 'portfolio_cat' );  
                            foreach ( $terms as $term ) {
                                $term_link = get_term_link( $term );
                                if ( is_wp_error( $term_link ) ) {
                                continue;
                            }
                            echo '<a class="category-pp" href=" '.esc_url( $term_link ).'">' .$term->name. '' . '</a><span class="spec"> / </span>';
                        }
                     } ?>    
                </div>
                 <?php if(isset($options['pp_description'])) : ?>
                   <div class="pp_description_nn">
                        <?php echo wp_kses_post($options['pp_description']);  ?>
                   </div>
               <?php endif; ?>    
       </div>
      
    </div>
     <?php if(isset($options['pp_booking']) && isset($options['pp_link_booking'])) : ?>
       <div class="booking_pp"><a data-target="#<?php the_ID() ?>" <?php if(isset($options['action-btn']) && $options['action-btn'] == '1' )  echo 'data-toggle="modal" '; ?> href="<?php echo esc_url($options['pp_link_booking']); ?>"><?php echo wp_kses_post($options['pp_booking']); ?><span class="lnr lnr-arrow-right"></span></a></div> 
       <div class="modal fade" id="<?php the_ID(); ?>" role="dialog">
                    <div class="modal-dialog">
                      <!-- Modal content-->
                      <div class="modal-content">
                        <div class="modal-header">
                          <h4><?php esc_html_e('BOOK DESIGN','kitgreen'); ?></h4>
                        </div>
                        <div class="modal-body">
                            <?php echo do_shortcode( ''.$booking_popup.'' );?> 
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal"><i class="lnr lnr-cross"></i></button>
                        </div>
                      </div>
                    </div>
       </div>
       <?php endif; ?>  
       <div class="social">
        <?php echo jwstheme_social_single(); ?>
       </div>
 </div>