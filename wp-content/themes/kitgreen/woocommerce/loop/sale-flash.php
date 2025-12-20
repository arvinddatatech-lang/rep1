<?php
    if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
    global $post, $product;
    if ( ! $product->is_in_stock() ) return;
    $sale_price = get_post_meta( $product->get_id(), '_sale_price', true);
    $regular_price = get_post_meta( $product->get_id(), '_regular_price', true);
    
?>
<?php if ( !empty( $regular_price ) && !empty( $sale_price ) && $regular_price > $sale_price ) : $sale = ceil(( ($regular_price - $sale_price) / $regular_price ) * 100);   ?>
    <?php echo
        apply_filters( 'woocommerce_sale_flash', '<div class="onsale"><span>' . $sale . '% </span></div>', $post, $product );
    ?>
<?php endif; ?>