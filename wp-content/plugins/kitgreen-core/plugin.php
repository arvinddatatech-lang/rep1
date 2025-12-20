<?php
/**
 * Plugin Name: Kitgreen Core
 * Plugin URI: https://jwsuperthemes.com/
 * Description: Add Themeoption And Function Config for themes.
 * Author: JWSThemes
 * Author URI: https://jwsuperthemes.com/
 * Version: 1.0.0
 * License: GPL3
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add Post Type.
 */
define("Kazroncore", "Active"); 
define("ct_metas", "add_meta_boxes");

//require_once plugin_dir_path( __FILE__ ) . 'lessc.inc.php';

if(!function_exists('insert_widgets')){
	function insert_widgets($tag){
	  register_widget($tag);
	}
}
if(!function_exists('insert_shortcode')){
	function insert_shortcode($tag, $func){
	 add_shortcode($tag, $func);
	}
}
if(!function_exists('custom_reg_post_type')){
	function custom_reg_post_type( $post_type, $args = array() ) {
		register_post_type( $post_type, $args );
	}
}
if(!function_exists('custom_reg_taxonomy')){
	function custom_reg_taxonomy( $taxonomy, $object_type, $args = array() ) {
		register_taxonomy( $taxonomy, $object_type, $args );
	}
}
if (!function_exists('output_ech')) { 
    function output_ech($ech) {
        echo $ech;
    }
}
if (!function_exists('decode_ct')) { 
    function decode_ct($loc) {
        echo rawurldecode(base64_decode(strip_tags($loc)));
    }
}
if(!function_exists('jws_removes_filter')){
	function jws_removes_filter($tag){
        remove_filter($tag);
	}
}

if (class_exists('Vc_Manager') && function_exists('kazron_attach_images_form_field')) {
    vc_add_shortcode_param( 'kazron_attach_image', 'kazron_attach_images_form_field' );
}



if(!function_exists('jws_add_meta_boss2')){
	function jws_add_meta_boss2($tag,$tag2,$tag3,$tag4,$tag5,$tag6,$tag7){
       	add_meta_box(
		$tag,$tag2,$tag3,$tag4,$tag5,$tag6,$tag7
		);
	}
}