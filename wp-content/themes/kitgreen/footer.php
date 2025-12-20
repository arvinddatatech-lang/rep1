<div id="back-to-top">
    <i class="lnr lnr-chevron-up" ></i>
</div>
<div id="quick-view-modal" class="quick-view-modal action kitgreen-modal woocommerce" tabindex="-1" role="dialog">
		<div class="modal-content">
               <a href="#" class="close-modal">
				<span class="lnr lnr-cross"></span>
			 </a>
			<div class="container">
            
				<div class="product">
             
                </div>
			</div>
		</div>
		<div class="jws-ajax-loader">
            <div class="overlay-loader">
                <div>
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
            </div>
        </div>
</div>
<div id="jws-page-overlay" class="jws-page-overlay"></div>
<div id="jws-widget-panel-overlay" class="jws-page-overlay"></div>
<div class="mobile-overplay"></div>
<?php 
$option = get_post_meta( get_the_ID(), '_custom_page_options', true ); 
if(!isset($option['sticky_footer'])) {
  $vertical = cs_get_option( 'sticky_footer' );  
}else {
  $vertical = $option['sticky_footer'];   
}
if($vertical == '1') {
    $footer_stiky = ' sticky-footer-on ';
}else {
    $footer_stiky = '';
}
?>
<div class="footer-main <?php echo esc_attr($footer_stiky); ?>">
<?php jws_kitgreen_footer();?>
</div>
<?php wp_footer(); ?>

<?php 
    $vertical = cs_get_option( 'header-layout' ); 
    if($vertical == '8' || isset($option['header-layout']) && $option['header-layout'] == '8' ) echo '</div>';
 ?>
<!-- End Vetical  -->
</body>
</html>