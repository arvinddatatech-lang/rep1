<?php 
/**
 * Layout Name: Header kitgreen One
 * Preview Image: /assets/images/headers/header-kitgreen-v1.jpg
 */


$option = get_post_meta( get_the_ID(), '_custom_page_options', true );
    if(!isset($option['show_cart'])) {
        $cart = cs_get_option( 'show_cart' );  
    }else {
        $cart = $option['show_cart'];  
    }
    if(!isset($option['show_search'])) {
        $search = cs_get_option( 'show_search' );  
    }else {
        $search = $option['show_search'];  
    }
    if(!isset($option['show_shortcode'])) {
        $shortcode = cs_get_option( 'show_shortcode' );  
    }else {
        $shortcode = $option['show_shortcode'];  
    }
    $shortcode_content =  cs_get_option( 'header-menu-right' );
    $header_top =  cs_get_option( 'header_top_ct3' );  
    $show_header_top =  cs_get_option( 'show_top_bar' );  
    
?>
<!-- Start Header -->
<header>
	<div id="jws_header" class="jws-header-v3">
		<!-- Start Header Menu -->
        <!-- Start Header Top -->
        <?php if($show_header_top == "1") : ?>
            <div class="top_bar">
               <?php
                    echo do_shortcode( ''.$header_top.'' );
               ?> 
            </div>
         <?php endif;?>
        <!-- End Header Top -->
        <div id="mainmenu-area-sticky-wrapper" class="sticky-wrapper">
		<div class="mainmenu-area">
            <nav class="menu_nav">
			<div class="container relative">
                <div class="logo-center hidden-md hidden-lg">
                            <?php jws_kitgreen_logo(); ?>
                </div>
				<div class="row_menu">
                        <div class="mainmenu text-center  hidden-sm hidden-xs">
						<?php
                        $local = "";
                        if(has_nav_menu( 'main_navigation2' )) {
                          $local = "main_navigation2";  
                        }
						$attr = array(
                            'theme_location' => 'main_navigation2',
							'menu_id' => 'nav',
							'menu' => '',
                            'container' => '',
							'container_class' => 'bt-menu-list hidden-xs hidden-sm ',
							'menu_class'      => ' nav',
							'echo'            => true,
							'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
							'depth'           => 0,
                            
						);
                        if(!empty($local)) {
                          wp_nav_menu( $attr );  
                        }else{
                            echo "<a href='".esc_url(  admin_url('/nav-menus.php') )."' class='add_menu'>".esc_html("Add Menu" , "kitgreen")."</a>";
                        }
                        
                        ?>
                        </div>   
				</div>
                <div class="button_menu hidden-lg hidden-md">
                            <span class="ion-android-menu"></span>
                </div> 
			</div>
          </nav>  
		</div>
       </div> 
		<!-- End Header Menu -->
	</div>
    <?php if ( class_exists( 'WooCommerce' ) && !is_cart() ) : ?>	
		<div class="jws-mini-cart jws-push-menu">
			<div class="jws-mini-cart-content">
				<h3 class="title"><?php esc_html_e( 'YOUR CART', 'kitgreen' );?> <i class="close-cart pe-7s-close pa"></i></h3>
				<div class="widget_shopping_cart_content">
                    <?php woocommerce_mini_cart(); ?>
                </div>
			</div>
		</div><!-- .jws-mini-cart -->
	<?php endif ?>
</header>
<!-- End Header -->
