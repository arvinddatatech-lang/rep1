<?php
/**
 * Pagination - Show numbered pagination for catalog pages
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/loop/pagination.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates 
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;

if ( $wp_query->max_num_pages <= 1 ) {
	return;
}

$next = '';
$prev = '';
$paging_id = '';
$paging_class = '';
$nav_layout = cs_get_option( 'wc-pagination' );
	$paging_id = 'kitgreen-shop-infinite-loading';
	$paging_class = 'infinite';
	$prev = '';
	$next = '<span id="jws-products-loading" class="dots-loading">  '.esc_html__( 'Load More', 'kitgreen' ).' ';

?>
<?php if($nav_layout == "loadmore") { ?>
<nav class="woocommerce-pagination <?php echo esc_attr( $paging_class )?>" id="<?php echo esc_attr( $paging_id ); ?>">
	<?php
	echo paginate_links( apply_filters( 'woocommerce_pagination_args', array(
		'base'         => esc_url_raw( str_replace( 999999999, '%#%', remove_query_arg( 'add-to-cart', get_pagenum_link( 999999999, false ) ) ) ),
		'format'       => '',
		'add_args'     => false,
		'current'      => max( 1, get_query_var( 'paged' ) ),
		'total'        => $wp_query->max_num_pages,
		'prev_text'    => $prev,
		'next_text'    => $next,
		'type'         => 'list',
		'end_size'     => 3,
		'mid_size'     => 3
	) ) );
	?>
    <div class="loaded-product"><?php esc_html_e ('All Products Loaded.' , 'kitgreen') ?></div>
</nav>
<?php }else { ?>
  <nav class="woocommerce-pagination-number">
	<?php
		echo paginate_links( apply_filters( 'woocommerce_pagination_args', array(
			'base'         => esc_url_raw( str_replace( 999999999, '%#%', remove_query_arg( 'add-to-cart', get_pagenum_link( 999999999, false ) ) ) ),
			'format'       => '',
			'add_args'     => '',
			'current'      => max( 1, get_query_var( 'paged' ) ),
			'total'        => $wp_query->max_num_pages,
			'prev_text'    => '<span class="ion-ios-arrow-thin-left"></span>',
			'next_text'    => '<span class="ion-ios-arrow-thin-right"></span>',
			'type'         => 'list',
			'end_size'     => 3,
			'mid_size'     => 3
		) ) );
	?>
</nav>  
<?php } ?>