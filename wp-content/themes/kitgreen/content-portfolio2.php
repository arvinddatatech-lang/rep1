<?php 
   global $kitgreen_portfolio_loop , $kitgreen_loop ;
   $options_2 = get_post_meta( get_the_ID(), '_custom_pp_options', true );
   $kitgreen_loop['img_size'] = $kitgreen_portfolio_loop['img_size'];
   $columns = "";
   if($kitgreen_portfolio_loop['columns']  == "4") {
    $columns = " col-lg-3 col-md-3 col-sm-6 col-xs-12 ";
   }elseif($kitgreen_portfolio_loop['columns']  == "3"){
    $columns = " col-lg-4 col-md-4 col-sm-6 col-xs-12 ";
   }elseif($kitgreen_portfolio_loop['columns']  == "2"){
    $columns = " col-lg-6 col-md-6 col-sm-6 col-xs-12 ";
   }else {
    $columns = " col-lg-2 col-md-2 col-sm-6 col-xs-12 ";
   }
    $class_slug = '';
	$item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' );
	if ( $item_cats ):
		foreach ( $item_cats as $item_cat ) {
			$class_slug .= $item_cat->slug . ' ';
		}
	endif;
    $image_attributes = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' ); 
?>
<div style="padding:<?php echo wp_kses_post($kitgreen_portfolio_loop['spacing']."px"); ?>;" class="item_portfolio <?php echo wp_kses_post($kitgreen_portfolio_loop['layout']);  echo wp_kses_post($columns);?> <?php echo wp_kses_post($class_slug) ; ?>">
<div  class="pp_inner">
    <div class="image_pp">
    <?php 
        echo kitgreen_get_post_thumbnail('large');
    ?>
    </div>
        <div class="content_pp">
    <div class="content_pp_inner">
    <h6 class="title"> 
        <?php 
            the_title();
        ?>
    </h6>
    <div class="popup">
        <a class="open_popup" href="<?php echo esc_url($image_attributes[0]); ?>"><span class="lnr lnr-magnifier"></span></a>
    </div>
    </div>
    </div>
</div>
</div>
