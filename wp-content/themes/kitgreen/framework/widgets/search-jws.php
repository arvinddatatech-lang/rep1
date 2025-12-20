<?php
class JWStheme_Search_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
                'jws_search_widget', // Base ID
                __('Search Ajax', 'kitgreen'), // Name
                array('description' => __('Search Widget', 'kitgreen'),) // Args
        );
    }
    function widget($args, $instance) {
        extract($args);
        ob_start();
		
        echo wp_kses_post($before_widget );  ?>
       
    	<div class="search-modal search-fix" tabindex="-1" role="dialog">
    		<div class="modal-content">
    				<form method="get" class="instance-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    					<div class="search-fields">
    						<input type="text" name="s" placeholder="<?php esc_attr_e( 'Enter your keywords', 'kitgreen' ); ?>" class="search-field" autocomplete="off">
    						<input type="hidden" name="post_type" value="product">
    						<span class="search-submit">
                            <button type="submit" class="ion-ios-search"></button>
    						</span>
    					</div>
    				</form>
    		</div>
    	</div>
    	<?php
        echo wp_kses_post($after_widget );
        echo ob_get_clean();
    }
}
/**
 * Class JWStheme_Search_Widget
 */
function jwstheme_register_search_widget() {
    insert_widgets('JWStheme_Search_Widget');
}
add_action('widgets_init', 'jwstheme_register_search_widget');
?>