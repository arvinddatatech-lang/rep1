<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive.
 *
 * Override this template by copying it to yourtheme/woocommerce/archive-product.php
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
global $woocommerce_loop;
$class = $data = $sizer = '';
$blog_shortcoe = cs_get_option('blog_before_footer'); 
 $layout_see = cs_get_option( 'wc-style' );
    if($layout_see == 'masonry' || $layout_see == 'metro') {
        $data_layout = "masonry";
    }else {
        $data_layout = "packery";   
    }
$class = 'jws-masonry';
$data  = 'data-masonry=\'{"selector":".tb-products-grid ", "columnWidth":".grid-sizer","layoutMode":"'.$data_layout.'"}\'';
$sizer = '<div class="grid-sizer size-'.$columns_layout =  cs_get_option( 'wc-column' ).'"></div>';
$layout = cs_get_option( 'wc-layout' );
$turn_full_width = cs_get_option('wc-layout-full');
$page_title = cs_get_option('wc-enable-page-title');
$action_filter = cs_get_option('wc-action-filter');
$action_columns = cs_get_option('wc-action-columns');
// Get all sidebars
$sidebar = cs_get_option( 'wc-sidebar' );
get_header(  );  ?>
    <?php   
        echo jwstheme_title_bar();
		/**
		 * woocommerce_before_main_content hook
		 *
		 * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
		 * @hooked woocommerce_breadcrumb - 20
		 */
		do_action( 'woocommerce_output_content_wrapper' );
	?>
		<?php
			/**
			 * woocommerce_archive_description hook
			 *
			 * @hooked woocommerce_taxonomy_archive_description - 10
			 * @hooked woocommerce_product_archive_description - 10
			 */
			do_action( 'woocommerce_archive_description' );
		?>
					<div class="<?php if($turn_full_width == '1') {echo 'no_' ; } ?>container">
                  
                      <div class="product-container row">
                       <?php if($layout == 'left-sidebar') : ?>
                        <div class="catalog-sidebar left col-sm-12 col-md-3">
                                <?php if ( is_active_sidebar( $sidebar ) ) {
                            		dynamic_sidebar( $sidebar );
                            	} elseif ( is_active_sidebar( 'jws-filter-shhop-left-right' ) ) {
                            		dynamic_sidebar( 'jws-filter-shhop-left-right' );
                            	} ?>
                        </div>
                       <?php endif; ?> 
                       	 <?php if($layout == 'right-sidebar' && $layout != 'no-sidebar') : ?>
                        <div class="catalog-sidebar right col-sm-12 col-md-3 hidden-lg hidden-md">
                                <?php if ( is_active_sidebar( $sidebar ) ) {
                            		dynamic_sidebar( $sidebar );
                            	} elseif ( is_active_sidebar( 'jws-filter-shhop-left-right' ) ) {
                            		dynamic_sidebar( 'jws-filter-shhop-left-right' );
                            	} ?>
                        </div>
                     <?php endif; ?> 
                     <?php if ( have_posts() ) : ?>
                     <div class="action-filter-swaper rela">
                            <?php 
                            if($action_filter) {
                              do_action('woocommerce_filter_product_ajax');  
                            }
                            if($action_columns) { 
                               echo get_colunm_shop();   
                            }    
                             ?>
                    </div>
						<div class="bt-product-items<?php if($layout == 'left-sidebar'   || $layout == 'right-sidebar' && !isset( $_GET['columns'] )  ) {  echo " col-sm-12 col-md-9" ;} else {echo " col-sm-12 col-md-12" ;} ?> ">
                            
                            <div class="<?php if($layout == 'left-sidebar' || $layout == 'right-sidebar' ) echo "row"; ?>  rela  product-list row <?php echo esc_attr( $class ); ?>" <?php echo wp_kses_post( $data ); ?>>
                            <div class="kitgreen-products-loaders">
                                <div class="overlay-loader">
                                    <div>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <?php
        						echo wp_kses_post( $sizer );
        					?>
                            
					       	<?php while ( have_posts() ) : the_post(); ?>
                            
								<?php wc_get_template_part( 'content', 'product' ); ?>
                                
							<?php endwhile; // end of the loop. ?>
                            
                            </div>
                            <?php
            				/**
            				 * woocommerce_after_shop_loop hook
            				 *
            				 * @hooked woocommerce_pagination - 10
            				 */
            				do_action( 'woocommerce_after_shop_loop' );
                            ?>
                            
						</div>
                        <?php woocommerce_product_loop_end(); ?>
                        <?php if($layout == 'right-sidebar' && !isset( $_GET['columns'] ) ) : ?>
                        <div class="catalog-sidebar right col-sm-3 hidden-xs hidden-sm">
                                <?php if ( is_active_sidebar( $sidebar ) ) {
                            		dynamic_sidebar( $sidebar );
                            	} elseif ( is_active_sidebar( 'jws-filter-shhop-left-right' ) ) {
                            		dynamic_sidebar( 'jws-filter-shhop-left-right' );
                            	} ?>
                        </div>
                     <?php endif; ?> 
                       
                       <?php elseif ( ! woocommerce_product_subcategories( array( 'before' => woocommerce_product_loop_start( false ), 'after' => woocommerce_product_loop_end( false ) ) ) ) : ?>
                       
                       <div class="bt-product-items<?php if($layout == 'left-sidebar' || $layout == 'right-sidebar' ) { echo " col-sm-9" ;} ?> ">
                       <div class="kitgreen-products-loader">
                       <div class="overlay-loader">
                                    <div>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                       </div>
                			<?php wc_get_template( 'loop/no-products-found.php' ); ?>
                       </div>     
                        <?php endif; ?>
                        
					</div>
				</div>
	<?php
		/**
		 * woocommerce_after_main_content hook
		 *
		 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
		 */
		do_action( 'woocommerce_output_content_wrapper_end' );
	?>
<div class="before-footer">   
<?php echo do_shortcode( ''.$blog_shortcoe.'' );?> 
</div>
<?php get_footer( 'shop' ); ?>
