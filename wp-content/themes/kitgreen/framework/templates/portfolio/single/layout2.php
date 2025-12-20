<?php get_header();
$options = get_post_meta( get_the_ID(), '_custom_pp_options', true );
$booking_popup = cs_get_option('booking-popup'); 
wp_enqueue_script( 'filter-design', URI_PATH.'/assets/js/dev/filter_design.js', array('jquery'), '', true  );
if(isset($options['currency'])) {
  $currency = $options['currency'];   
}
if(isset($options['filter1'])) {
    $color = $options['filter1'];
}
if(isset($options['filter2'])) {
 $unit = $options['filter2'];
}
if(isset($options['filter3'])) {
 $layout = $options['filter3'];
}
if(isset($options['filter4'])) {
 $worktop = $options['filter4'];
} 
if(isset($options['filter5'])) {
 $appliance = $options['filter5'];
} 
if(isset($options['filter6'])) {
 $installation = $options['filter6'];
}  
 ?>  
 <div class="design_container">
 <div style="background-image: url('<?php echo the_post_thumbnail_url( 'full' ); ?>');"  class="background_project">


<div class="detail">
    <div class="open_detail">
    <div class="detail_design">
        <?php if(isset($options['enble-color']) && $options['enble-color'] == "1" ) : ?>
        <div class="color_detail">
             <h6 class="label_filter"><?php esc_html_e("Color:" , "kitgreen"); ?></h6>
             <span class="color"></span> 
             <span class="color_pr"></span> 
        </div>
        <?php endif; ?>
        <?php if(isset($options['enble-cabinet']) && $options['enble-cabinet'] == "1" ) : ?>
        <div class="unit_detail">
              <h6 class="label_filter"><?php esc_html_e("Cabinet:" , "kitgreen"); ?></h6>
             <span class="unit"></span> 
             <span class="unit_pr"></span>   
        </div>
        <?php endif; ?>
        <?php if(isset($options['enble-layout']) && $options['enble-layout'] == "1" ) : ?>
        <div class="layout_detail">
              <h6 class="label_filter"><?php esc_html_e("Layout:" , "kitgreen"); ?></h6>
             <span class="layout"></span>
             <span class="layout_pr"></span>   
        </div>
        <?php endif; ?>
         <?php if(isset($options['enble-worktop']) && $options['enble-worktop'] == "1" ) : ?>
        <div class="worktop_detail">
              <h6 class="label_filter"><?php esc_html_e("Worktop:" , "kitgreen"); ?></h6>
             <span class="worktop"></span> 
             <span class="worktop_pr"></span> 
        </div>
        <?php endif; ?>
        <?php if(isset($options['enble-appliance']) && $options['enble-appliance'] == "1" ) : ?>
        <div class="appliance_detail">
              <h6 class="label_filter"><?php esc_html_e("Appliance:" , "kitgreen"); ?></h6>
             <span class="appliance"></span> 
             <span class="appliance_pr"></span>  
        </div>
        <?php endif; ?>
        <?php if(isset($options['enble-installation']) && $options['enble-installation'] == "1" ) : ?>
        <div class="installation_detail">
              <h6 class="label_filter"><?php esc_html_e("Installation:" , "kitgreen"); ?></h6>
             <span class="installation"></span> 
             <span class="installation_pr"></span>  
        </div>
        <?php endif; ?>
    </div>
 <div id="total"></div>
 </div>
 <div  class="currency" data-symbol = "<?php echo wp_kses_post($currency); ?>"></div>
  <div class="toget_detail">
            <a href="#" class="action_detail"><span class="hide_dt"><?php esc_html_e("Hidden Detail", "kitgreen"); ?></span><span class="show_dt"><?php esc_html_e("Show Detail", "kitgreen"); ?></span></a>
 </div>
</div>

</div> 
 <div class="tab container">
    <ul class="data_tab">
    <?php if(isset($options['enble-color']) && $options['enble-color'] == "1" ) : ?>
    <li class="color active"><a  data-tab="tab-1" href="#"><?php if(isset($options['label1'])) echo wp_kses_post($options['label1']); ?></a></li>
    <?php endif; ?>
    <?php if(isset($options['enble-cabinet']) && $options['enble-cabinet'] == "1" ) : ?>
    <li class="unit"><a data-tab="tab-2" href="#"><?php if(isset($options['label2'])) echo wp_kses_post($options['label2']); ?></a></li>
    <?php endif; ?>
    <?php if(isset($options['enble-layout']) && $options['enble-layout'] == "1" ) : ?>
    <li class="layout"><a data-tab="tab-3" href="#"><?php if(isset($options['label3'])) echo wp_kses_post($options['label3']); ?></a></li>
    <?php endif; ?>
    <?php if(isset($options['enble-worktop']) && $options['enble-worktop'] == "1" ) : ?>
    <li class="worktop"><a data-tab="tab-4" href="#"><?php if(isset($options['label4'])) echo wp_kses_post($options['label4']); ?></a></li>
    <?php endif; ?>
    <?php if(isset($options['enble-appliance']) && $options['enble-appliance'] == "1" ) : ?>
    <li class="appliance"><a data-tab="tab-5" href="#"><?php if(isset($options['label5'])) echo wp_kses_post($options['label5']); ?></a></li> 
    <?php endif; ?> 
    <?php if(isset($options['enble-installation']) && $options['enble-installation'] == "1" ) : ?>  
    <li class="installation"><a data-tab="tab-6" href="#"><?php if(isset($options['label6'])) echo wp_kses_post($options['label6']); ?></a></li> 
    <?php endif; ?>           
 </ul>
<div class="content_tabs">
    <?php if(isset($options['enble-color']) && $options['enble-color'] == "1" ) : ?>
     <ul id="tab-1"  class="filter_color tab-content  active">
     <?php
     if(!empty($color)) {
        foreach ( $color as $color_c ) { 
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($color_c['name1']); ?>"  <?php if(!empty($color_c['price1'])) : echo 'data-price ="'.$color_c['price1'].'"'; else: echo 'data-price ="0"'; endif;  ?> <?php if(!empty($color_c['upload1'])) echo 'data-image="url('.$color_c['upload1'].'"'; ?>>
                           <?php if(!empty($color_c['value1'])) : ?>
                            <span class="label_fl">
                                    <?php echo wp_kses_post($color_c['value1']); ?>
                            </span>
                            <?php endif; ?>
                            
                            
                             <?php if(!empty($color_c['item1'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($color_c['item1']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
     }  
     ?>   
      </ul>
      <?php endif; ?> 
      <?php if(isset($options['enble-cabinet']) && $options['enble-cabinet'] == "1" ) : ?>
      <ul id="tab-2" class="filter_unit tab-content">
      <?php
      if(!empty($unit)) {
             foreach ( $unit as $unit_c ) {
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($unit_c['name2']); ?>"  <?php if(!empty($unit_c['price2'])) : echo  'data-price ="'.$unit_c['price2'].'"'; else: echo 'data-price ="0"'; endif; ?>  <?php if(!empty($unit_c['upload2'])) echo 'data-image="url('.$unit_c['upload2'].'"'; ?>>
                            <?php if(!empty($unit_c['value2'])) : ?>
                                <span class="label_fl">
                                        <?php echo wp_kses_post($unit_c['value2']); ?>
                                </span>
                            <?php endif; ?>

                             <?php if(!empty($unit_c['item2'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($unit_c['item2']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
         }   
      ?>   
     </ul>
     <?php endif; ?> 
     <?php if(isset($options['enble-layout']) && $options['enble-layout'] == "1" ) : ?>
     <ul id="tab-3" class="filter_layout tab-content">
      <?php
      if(!empty($layout)) {
             foreach ( $layout as $layout_c ) {
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($layout_c['name3']); ?>" <?php if(!empty($layout_c['price3'])) : echo  'data-price ="'.$layout_c['price3'].'"'; else: echo 'data-price ="0"'; endif; ?> <?php if(!empty($layout_c['upload3'])) echo 'data-image="url('.$layout_c['upload3'].'"'; ?>>
                            <?php if(!empty($layout_c['value3'])) : ?>
                                <span class="label_fl">
                                        <?php echo wp_kses_post($layout_c['value3']); ?>
                                </span>
                            <?php endif; ?>

                             <?php if(!empty($layout_c['item3'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($layout_c['item3']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
         }   
          ?>   
     </ul> 
     <?php endif; ?> 
     <?php if(isset($options['enble-worktop']) && $options['enble-worktop'] == "1" ) : ?>
     <ul id="tab-4" class="filter_worktop tab-content">
      <?php
      if(!empty($worktop)) {
             foreach ( $worktop as $worktop_c ) {
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($worktop_c['name4']); ?>"  <?php if(!empty($worktop_c['price4'])) : echo  'data-price ="'.$worktop_c['price4'].'"'; else: echo 'data-price ="0"'; endif; ?> <?php if(!empty($worktop_c['upload4'])) echo 'data-image="url('.$worktop_c['upload4'].'"'; ?>>
                            <?php if(!empty($worktop_c['value4'])) : ?>
                                <span class="label_fl">
                                        <?php echo wp_kses_post($worktop_c['value4']); ?>
                                </span>
                            <?php endif; ?>

                             <?php if(!empty($worktop_c['item4'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($worktop_c['item4']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
           }
        ?>   
     </ul>
     <?php endif; ?> 
     <?php if(isset($options['enble-appliance']) && $options['enble-appliance'] == "1" ) : ?>
     <ul id="tab-5" class="filter_appliance tab-content">
      <?php
      if(!empty($appliance)) {
             foreach ( $appliance as $appliance_c ) {
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($appliance_c['name5']); ?>"  <?php if(!empty($appliance_c['price5'])) : echo  'data-price ="'.$appliance_c['price5'].'"'; else: echo 'data-price ="0"'; endif; ?>  <?php if(!empty($appliance_c['upload5'])) echo 'data-image="url('.$appliance_c['upload5'].'"'; ?>>
                            <?php if(!empty($appliance_c['value5'])) : ?>
                                <span class="label_fl">
                                        <?php echo wp_kses_post($appliance_c['value5']); ?>
                                </span>
                            <?php endif; ?>

                             <?php if(!empty($appliance_c['item5'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($appliance_c['item5']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
        }
    ?>   
     </ul>
     <?php endif; ?>
     <?php if(isset($options['enble-installation']) && $options['enble-installation'] == "1" ) : ?>  
     <ul id="tab-6" class="filter_installation tab-content">
      <?php
      if(!empty($installation)) {
             foreach ( $installation as $installation_c ) {
                ?>
                    <li class="action_filter">
                        <a href="#" data-name = "<?php echo wp_kses_post($installation_c['name6']); ?>"  <?php if(!empty($installation_c['price6'])) : echo  'data-price =" '.$installation_c['price6'].'"'; else: echo 'data-price ="0"'; endif; ?> <?php if(!empty($installation_c['upload6'])) echo 'data-image="url('.$installation_c['upload6'].'"'; ?>>
                            <?php if(!empty($installation_c['value6'])) : ?>
                                <span class="label_fl">
                                        <?php echo wp_kses_post($installation_c['value6']); ?>
                                </span>
                            <?php endif; ?>

                             <?php if(!empty($installation_c['item6'])) : ?>
                                <span style="background-image: url(' <?php echo wp_kses_post($installation_c['item6']); ?>');" class="label_color"></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php
            }
           } 
          ?>   
     </ul>
      <?php endif; ?>
</div>
 <div class="content_vc">
        <?php 
        while ( have_posts() ) : the_post();
			 the_content();
        endwhile; ?>
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