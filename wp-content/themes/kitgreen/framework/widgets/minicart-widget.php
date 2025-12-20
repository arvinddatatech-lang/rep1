<?php

	class Bearstheme_Widget_Mini_Cart extends WC_Widget {

		/**

			* Constructor

		*/

		function __construct() {

			$this->widget_cssclass    = 'woocommerce bt_widget_mini_cart';

			$this->widget_description = __( "Display the user's Cart in the sidebar.", 'kitgreen' );

			$this->widget_id          = 'bt_widget_mini_cart';

			$this->widget_name        = __( 'Mini Cart', 'kitgreen' );

			$this->settings           = array(

			'title'  => array(

			'type'  => 'text',

			'std'   => __( 'Cart', 'kitgreen' ),

			'label' => __( 'Title', 'kitgreen' )

			),

			'hide_if_empty' => array(

			'type'  => 'checkbox',

			'std'   => 0,

			'label' => __( 'Hide Search', 'kitgreen' )

			),
            'hide_if_empty2' => array(

			'type'  => 'checkbox',

			'std'   => 0,

			'label' => __( 'Hide Cart', 'kitgreen' )

			)

			);

			parent::__construct();

		}

		/**

			* widget function.

			*

			* @see WP_Widget

			*

			* @param array $args

			* @param array $instance

		*/

		function widget( $args, $instance ) {

			/*if ( apply_filters( 'woocommerce_widget_cart_is_hidden', is_cart() || is_checkout() ) ) {

				return;

			}*/

			$hide_if_empty = empty( $instance['hide_if_empty'] ) ? 0 : 1;
            $hide_if_empty2 = empty( $instance['hide_if_empty2'] ) ? 0 : 1;

			$this->widget_start( $args, $instance );
            ?> 
            
            <div class="search-left <?php  if($hide_if_empty) {
                echo esc_attr('hidden' , 'kitgreen');  
            } ?>">
            <div class="search-form-overlay"></div>
                <a class="search-form-trigger" href="#search-form"><span></span></a>
                <div id="search-form" class="search-form-jws">
                <form  role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" >
                    <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="Search...">
                </form>
            </div>
            </div>
            <div class="cart-right <?php  if($hide_if_empty2) {
                echo esc_attr('hidden' , 'kitgreen');  
            } ?>  ">
            <?php 
				
			echo '<div class="bt-cart-header"><a class="bt-icon" href="javascript:void(0)">
            <span aria-hidden="true" class="icon_bag_alt" ></span>
			</a><span class="cart_total" ></div>';

			// Insert cart widget placeholder - code in woocommerce.js will update this on page load

			echo '<div class="bt-cart-content"><div class="widget_shopping_cart_content"></div></div>';

				echo '</div>';

			$this->widget_end( $args );

		}

	}

add_filter('woocommerce_add_to_cart_fragments', 'woocommerce_icon_add_to_cart_fragment');

	if(!function_exists('woocommerce_icon_add_to_cart_fragment')){

		function woocommerce_icon_add_to_cart_fragment( $fragments ) {

			global $woocommerce;

			ob_start();

		?>

		<span class="cart_total"><?php echo wp_kses_post($woocommerce->cart->cart_contents_count); ?></span>

		<?php

			$fragments['span.cart_total'] = ob_get_clean();

			return $fragments;

		}

	}

	/**

		* Class Bearstheme_Widget_Mini_Cart

	*/

	function register_bt_widget_mini_cart() {

		insert_widgets('Bearstheme_Widget_Mini_Cart');

	}

add_action('widgets_init', 'register_bt_widget_mini_cart');