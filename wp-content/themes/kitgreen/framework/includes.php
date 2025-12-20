<?php
/* Load Shortcodes */
require_once ABS_PATH_FR . '/megamenu/mega-menu.php';
if(function_exists('insert_shortcode')) {
    require_once ABS_PATH_FR . '/shortcodes/shortcodes.php';
    require_once ABS_PATH_FR . '/shortcodes/vc_config.php';  
}
require_once ABS_PATH_FR . '/woocommerce-function.php';
require_once ABS_PATH_FR . '/css_inline.php';
require_once ABS_PATH_FR . '/function_theme.php';
require_once ABS_PATH_FR . '/post_type/post_type.php';
/* Load Mega menu admin */
/* Vc extra Fields */
if (class_exists('Vc_Manager')) {
    function vc_add_extra_field( $name, $form_field_callback, $script_url = null ) {
            return WpbakeryShortcodeParams::addField( $name, $form_field_callback, $script_url );
    }
}
