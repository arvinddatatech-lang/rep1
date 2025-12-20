<?php 
   global $kitgreen_portfolio_loop , $kitgreen_loop ;
   $options = get_post_meta( get_the_ID(), '_custom_wc_thumb_options', true );
   $options_2 = get_post_meta( get_the_ID(), '_custom_pp_options', true );
   $kitgreen_loop['img_size'] = $kitgreen_portfolio_loop['img_size'];
   $columns = "";
   if(isset($options_2['column_metro'])) {
    $col = $options_2['column_metro'];
   }else {
    $col = "";
   }
   if($kitgreen_portfolio_loop['layout'] == 'masonry2' || $kitgreen_portfolio_loop['layout'] == 'masonry' || $kitgreen_portfolio_loop['layout'] == 'grid' ) {
    
    if($kitgreen_portfolio_loop['columns']  == "4") {
    $columns = " col-lg-3 col-md-3 col-sm-6 col-xs-12 col-xs-66 ";
   }elseif($kitgreen_portfolio_loop['columns']  == "3"){
    $columns = " col-lg-4 col-md-4 col-sm-6 col-xs-12 col-xs-66 ";
   }elseif($kitgreen_portfolio_loop['columns']  == "2"){
    $columns = " col-lg-6 col-md-6 col-sm-6 col-xs-12 col-xs-66 ";
   }else {
    $columns = " col-lg-2 col-md-2 col-sm-6 col-xs-12 col-xs-66 ";
   }
   }else {
    $columns = " col-lg-".$col." col-md-".$col." col-sm-6 col-xs-6 col-xs-66 ";
   }
   
   
    $class_slug = '';
	$item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' );
	if ( $item_cats ):
		foreach ( $item_cats as $item_cat ) {
			$class_slug .= $item_cat->slug . ' ';
		}
	endif;
    
    $class_masonry = "";
    $background = "" ;
    $class_metro = "";
    $width = "";
    $height = "";
     
    if(  $kitgreen_portfolio_loop['layout'] == 'masonry' && isset($options['wc-thumbnail-size']) && $options['wc-thumbnail-size'] == "1" ) { 
      $class_masonry = " x2 "; 
     
    }
    if(  $kitgreen_portfolio_loop['layout'] == 'masonry2' && isset($options['wc-thumbnail-size']) && $options['wc-thumbnail-size'] == "1" ) { 
      $class_masonry = " x2 "; 
     
    }
    if( $kitgreen_portfolio_loop['layout'] == 'masonry' && $options['wc-thumbnail-size'] != "1"   ) { 
          $class_masonry = " x1 ";    
    }
    if( $kitgreen_portfolio_loop['layout'] == 'masonry2' && $options['wc-thumbnail-size'] != "1"   ) { 
          $class_masonry = " x1 ";    
    }
    if($kitgreen_portfolio_loop['layout'] == 'masonry2' || $kitgreen_portfolio_loop['layout'] == 'masonry' || $kitgreen_portfolio_loop['layout'] == 'metro' ){
      $thumb_id = get_post_thumbnail_id();
          $thumb_url = wp_get_attachment_image_src($thumb_id,'thumbnail-size', true);
          $background = "
            background-image:url('".$thumb_url[0]."')
          ";        
    }
    if(isset($options_2['pp_width'])) {
      $width = $options_2['pp_width'];
    }
    if(isset($options_2['pp_height'])) {
      $height = $options_2['pp_height'];
    }
    if($kitgreen_portfolio_loop['layout'] == 'metro'  ) { 
          $class_metro = " height: ".esc_attr($height)."; "; 
             
    }
    
?>
<div style=" <?php echo wp_kses_post($class_metro); ?> padding:<?php echo wp_kses_post($kitgreen_portfolio_loop['spacing']."px"); ?>;" class="item_portfolio <?php echo wp_kses_post($kitgreen_portfolio_loop['layout']);  echo wp_kses_post($columns); echo wp_kses_post($class_masonry); ?> <?php echo wp_kses_post($class_slug) ; ?>">
<div style="<?php echo wp_kses_post($background); ?>" class="pp_inner">
    <div class="content_pp">
    <div class="content_ct">
    <div class="content_pp_inner">
    <h6 class="title">
    <a href="<?php the_permalink(); ?>">
    <?php 
        the_title();
    ?>
    </a>
    </h6>
    <div class="cat">
        <?php 
            if ( $item_cats ):
        		foreach ( $item_cats as $item_cat ) {
        	    ?>
                     <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'portfolio_cat')); ?>">
                        <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                     </a><span>/</span> 
        		<?php }

           	endif;
      ?>
    </div>
    
    </div>
    </div>
    </div>
    <div class="redmore ">
        <a class="lnr lnr-link" href="<?php the_permalink(); ?>">
        </a>
    </div>
    <div class="image_pp">
    <?php 
    if($kitgreen_portfolio_loop['layout'] == 'grid' ) {
        echo kitgreen_get_post_thumbnail('large');
    }
    ?>
    </div>
</div>
</div>
