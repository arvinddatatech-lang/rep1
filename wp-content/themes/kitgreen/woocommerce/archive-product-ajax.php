<script>    
(function($) {
	"use strict";
	
        
    $(document).ready(function() {
        
        
})(window.jQuery)  
</script>
<?php
/**
 *	NM: The template for displaying AJAX loaded products
 */
 $class = $data = $sizer = '';

    $layout = cs_get_option( 'wc-layout' );
    $layout_see = cs_get_option( 'wc-style' );
    if($layout_see == 'masonry' || $layout_see == 'metro') {
        $data_layout = "masonry";
    }else {
        $data_layout = "fitRows";   
    }
	$class = 'jws-masonry';
	$data  = 'data-masonry=\'{"selector":".tb-products-grid ", "columnWidth":".grid-sizer","layoutMode":"'.$data_layout.'"}\'';
	$sizer = '<div class="grid-sizer size-3"></div>';
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
 if($layout == 'left-sidebar' || $layout == 'right-sidebar' ) {$row = "row";};
if ( have_posts() ) {
		
	echo '<div class="rela row  '.$row.'   product-list '.esc_attr( $class ).'" '.wp_kses_post( $data ).'>';
        						echo wp_kses_post( $sizer );
	while ( have_posts() ) { 
		the_post();
		wc_get_template_part( 'content', 'product' );
	}
	echo '</div>';
			
	?>
	<div class="jws-infload-link"><?php next_posts_link( '&nbsp;' ); ?></div>
	<?php

}
