<?php
class JWStheme_Search_sidebar_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
                'jws_search_bar_widget', // Base ID
                __('Search Sidebar', 'kitgreen'), // Name
                array('description' => __('Search Widget', 'kitgreen'),) // Args
        );
    }
    function widget($args, $instance) {

		
        ob_start();
		
        ?>
        <div id="search-form" class="widget search-sidebar">
            <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" >
                <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="Search...">
                <button><i class="fa fa-search"></i></button>
            </form>
        </div>
        <?php
        echo ob_get_clean();
    }
}
/**
 * Class JWStheme_Search_sidebar_Widget
 */
function jwstheme_register_search_sidebar_widget() {
    insert_widgets('JWStheme_Search_sidebar_Widget');
}
add_action('widgets_init', 'jwstheme_register_search_sidebar_widget');
?>