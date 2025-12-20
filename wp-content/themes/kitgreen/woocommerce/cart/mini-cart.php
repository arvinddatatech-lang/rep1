<?php
/**
 * Mini-cart
 *
 * Contains the markup for the mini-cart, used by the cart widget.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/mini-cart.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$nm_cart_empty_class_attr = ( WC()->cart->is_empty() ) ? ' class="jws-cart-panel-empty"' : '';
?>

<div id="jws-cart-panel"<?php echo wp_kses_post($nm_cart_empty_class_attr); ?>>
<div id="jws-cart-panel-loader"></div>   
<?php if($shipping = cs_get_option('cart-shipping') ) : ?> 
<div class="shipping"><i class="fa fa-check-square"></i><?php echo wp_kses_post($shipping = cs_get_option('cart-shipping')); ?></div>
<div  class="shipping-emtry"><?php echo wp_kses_post($shipping_emtry = cs_get_option('cart-shipping-emtry')); ?></div>
<?php endif;?> 
<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="button edit-cart"><?php _e( 'Edit Cart', 'kitgreen' ); ?></a>
<?php do_action( 'woocommerce_before_mini_cart' ); ?>

<div class="jws-cart-panel-list-wrap">

<ul  class="cart_list product_list_widget <?php echo esc_attr( $args['list_class'] ); ?>">
    
    <?php if ( ! WC()->cart->is_empty() ) : ?>

        <?php
            do_action( 'woocommerce_before_mini_cart_contents' );
    
            foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                $_product     = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
                $product_id   = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

                if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
                    $product_name      = apply_filters( 'woocommerce_cart_item_name', $_product->get_title(), $cart_item, $cart_item_key );
                    $thumbnail         = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image('jws-imge-minicart'), $cart_item, $cart_item_key );
                    //$product_price     = apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key );
                    $product_price     = apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key );
                    $product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );

                    // NM
                    $thumbnail = str_replace( array( 'http:', 'https:' ), '', $thumbnail );
                    if ( ! $_product->is_visible() ) {
                        $product_name = '<span class="jws-cart-panel-product-title">' . $product_name . '</span>';
                    } else {
                        $product_permalink = esc_url( $product_permalink );
                        $thumbnail = '<a href="' . $product_permalink . '">' . $thumbnail . '</a>';
                        $product_name = '<a href="' . $product_permalink . '" class="jws-cart-panel-product-title">' . $product_name . '</a>';
                    }
                    ?>
                    <li id="jws-cart-panel-item-<?php echo esc_attr( $cart_item_key ); ?>" class="woocommerce-mini-cart-item <?php echo esc_attr( apply_filters( 'woocommerce_mini_cart_item_class', 'mini_cart_item', $cart_item, $cart_item_key ) ); ?>">
                        <div class="jws-cart-panel-item-thumbnail">
                            <div class="jws-cart-panel-thumbnail-wrap">
                                <?php echo wp_kses_post($thumbnail); ?>
                                <?php
                                    echo apply_filters( 'woocommerce_cart_item_remove_link', sprintf(
                                        '<a href="%s" class="remove" title="%s" data-product_id="%s" data-product_sku="%s" data-cart-item-key="%s"><span class="lnr lnr-cross"></span></a>',    
                                        esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
                                        __( 'Remove this item', 'kitgreen' ),
                                        esc_attr( $product_id ),
                                        esc_attr( $_product->get_sku() ),
                                        $cart_item_key
                                    ), $cart_item_key );
                                    ?>
                                <div class="jws-cart-panel-thumbnail-loader jws-loader"></div>
                            </div>
                        </div>
                        <div class="jws-cart-panel-item-details">
                            <div class="jws-cart-item-loader jws-loader"></div>
                            <?php echo wp_kses_post($product_name); ?>
                            <div class="jws-cart-panel-item-price">
                                    <?php echo wp_kses_post($product_price); ?>
                            </div>
                            <?php echo wc_get_formatted_cart_item_data( $cart_item ); ?>
                        </div>
                        <div class="quanty-ajax <?php if ( $_product->is_sold_individually() ) echo "hidden"; ?>">
                            <div class="jws-cart-panel-quantity-pricing">
                                <?php if ( $_product->is_sold_individually() ) : ?>
                                    <?php
                                        echo apply_filters( 'woocommerce_widget_cart_item_quantity', '<span class="quantity">' . esc_html__( 'Qty', 'kitgreen' ) . ': ' . $cart_item['quantity'] . '</span>', $cart_item, $cart_item_key );
                                    ?>
                                <?php else: ?>
                                    <div class="product-quantity" data-title="<?php _e( 'Quantity', 'kitgreen' ); ?>">
                                        <?php
                                            $product_quantity = woocommerce_quantity_input( array(
                                                'input_name'  => "cart[{$cart_item_key}][qty]",
                                                'input_value' => $cart_item['quantity'],
                                                'max_value'   => $_product->backorders_allowed() ? '' : $_product->get_stock_quantity(),
                                                'min_value'   => '1',
                                                'nm_mini_cart_quantity' => true // NM: Makes it possible to check if the quantity-input is for the cart-panel when using the "woocommerce_quantity_input_args" filter
                                            ), $_product, false );
                                            
                                            echo apply_filters( 'woocommerce_widget_cart_item_quantity', $product_quantity, $cart_item, $cart_item_key );
                                        ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </li>
                    <?php
                }
            }
    
            do_action( 'woocommerce_mini_cart_contents' );
        ?>

    <?php endif; ?>

    <li class="empty"><?php _e( 'No products in the cart.', 'kitgreen' ); ?></li>

</ul><!-- end product list -->

</div>
    
<div class="jws-cart-panel-summary">
    
    <div class="jws-cart-panel-summary-inner">
       
        <?php if ( ! WC()->cart->is_empty() ) : ?>
         <div class="total-cart">
        <p class="woocommerce-mini-cart__total total">
            <strong><?php _e( 'Subtotal', 'kitgreen' ); ?>:</strong>
            <span class="jws-cart-panel-summary-subtotal">
                <?php echo WC()->cart->get_cart_subtotal(); ?>
            </span>
        </p>
      </div>
        <?php do_action( 'woocommerce_widget_shopping_cart_before_buttons' ); ?>

        <p class="woocommerce-mini-cart__buttons buttons in_product">
            <a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="button checkout wc-forward"><?php _e( 'proceed to checkout', 'kitgreen' ); ?></a>
        </p>
        
        <?php endif; ?>
        <p class="woocommerce-mini-cart__buttons buttons out_product"><a class="button checkout wc-forward" href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>"><?php _e( 'Continue Shopping', 'kitgreen' ) ?></a></p>			
        
    </div>

</div>

<?php do_action( 'woocommerce_after_mini_cart' ); ?>
    
</div>