<?php if ( ! defined('URI_PATH')) exit('No direct script access allowed');

if( ! function_exists( 'kitgreen_vc_extra_classes' ) ) {

	if( defined( 'VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG' ) ) {
		add_filter( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, 'kitgreen_vc_extra_classes', 30, 3 );
	}

	function kitgreen_vc_extra_classes( $class, $base, $atts ) {
		if( ! empty( $atts['kitgreen_color_scheme'] ) ) {
			$class .= ' color-scheme-' . $atts['kitgreen_color_scheme'];
		}

		if( ! empty( $atts['kitgreen_parallax'] ) ) {
			$class .= ' container-in-full';
		}
        if( ! empty( $atts['jws_parallax'] ) ) {
			$class .= ' background-parallax';
		}
        if( ! empty( $atts['jws_100'] ) ) {
			$class .= ' container100 ';
		}
		return $class;
	}
}

if( ! function_exists( 'kitgreen_vc_map_shortcodes' ) ) {

	add_action( 'vc_before_init', 'kitgreen_vc_map_shortcodes' );

	function kitgreen_vc_map_shortcodes() {

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Parallax option
		 * ------------------------------------------------------------------------------------------------
		 */
		$attributes = array(
			'type' => 'checkbox',
			'heading' => __( 'Container In Full width', 'kitgreen' ),
			'param_name' => 'kitgreen_parallax',
			'value' => array( __( 'Yes, please', 'kitgreen' ) => 1 )
		);
        $parallaxs = array(
			'type' => 'checkbox',
			'heading' => __( 'Parallax background', 'kitgreen' ),
			'param_name' => 'jws_parallax',
			'value' => array( __( 'Yes, please', 'kitgreen' ) => 1 )
		);
        $container100 = array(
			'type' => 'checkbox',
			'heading' => __( 'Container Width 100%', 'kitgreen' ),
			'param_name' => 'jws_100',
			'value' => array( __( 'Yes, please', 'kitgreen' ) => 1 )
		);
        $number_tab = array(
			'type' => 'textarea',
			'heading' => __( 'Title', 'kitgreen' ),
			'param_name' => 'title',
		);
        $box_hover_height = array(
			'type' => 'textfield',
			'heading' => __( 'Height', 'kitgreen' ),
			'param_name' => 'el_height',
		);
        vc_add_param( 'vc_row', $container100 );
        vc_add_param( 'vc_section', $container100 );
        vc_add_param( 'vc_row', $parallaxs );
        vc_add_param( 'vc_section', $parallaxs );
        vc_add_param( 'vc_column', $parallaxs );
        
		vc_add_param( 'vc_row', $attributes );
		vc_add_param( 'vc_section', $attributes );
		vc_add_param( 'vc_column', $attributes );
        vc_add_param( 'vc_tta_section', $number_tab );
        vc_add_param( 'vc_hoverbox', $box_hover_height );
		$target_arr = array(
			__( 'Same window', 'kitgreen' ) => '_self',
			__( 'New window', 'kitgreen' ) => "_blank"
		);

		$post_types_list = array();
		$post_types_list[] = array( 'post', __( 'Post', 'kitgreen' ) );
		//$post_types_list[] = array( 'custom', __( 'Custom query', 'kitgreen' ) );
		$post_types_list[] = array( 'ids', __( 'List of IDs', 'kitgreen' ) );

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map blog shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => 'Blog',
			'base' => 'kitgreen_blog',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your blog posts on the page', 'kitgreen' ),
			'params' => array(
				array(
					'type' => 'dropdown',
					'heading' => __( 'Data source', 'kitgreen' ),
					'param_name' => 'post_type',
					'value' => $post_types_list,
					'description' => __( 'Select content type for your grid.', 'kitgreen' )
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Include only', 'kitgreen' ),
					'param_name' => 'include',
					'description' => __( 'Add posts, pages, etc. by title.', 'kitgreen' ),
					'settings' => array(
						'multiple' => true,
						'sortable' => true,
						'groups' => true,
					),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids' ),
						//'callback' => 'vc_grid_include_dependency_callback',
					),
				),
				// Custom query tab
				array(
					'type' => 'textarea_safe',
					'heading' => __( 'Custom query', 'kitgreen' ),
					'param_name' => 'custom_query',
					'description' => __( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts">WordPress Codex</a>.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'post' ),
					),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Narrow data source', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
						// 'values' => $taxonomies_for_filter,
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids', 'post' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Items per page', 'kitgreen' ),
					'param_name' => 'items_per_page',
					'description' => __( 'Number of items to show per page.', 'kitgreen' ),
					'value' => '10',
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Pagination', 'kitgreen' ),
					'param_name' => 'pagination',
					'value' => array(
	                    '' => '', 
	                    'Pagination' => 'pagination', 
	                    '"Load more" button' => 'more-btn', 
					),
				),
				// Design settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Style', 'kitgreen' ),
					'param_name' => 'blog_design',
					'value' => array(
	                    'Default' => 'border-bottom',
                        'Blog Image Left' => 'image-left',
                        'Blog On Footer' => 'blog-footer',
                        'Blog On Menu' => 'blog-menu',  
					),
					'description' => __( 'You can use different design for your blog styled for the theme', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
                	// Design settings
			
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Columns', 'kitgreen' ),
					'param_name' => 'blog_columns',
					 "value" => array(
        					"6 column" => "6",
                            "5 column" => "5",
                            "4 column" => "4",
                            "3 column" => "3",
                            "2 column" => "2",
                            "1 column" => "1",
        					
                        ),
					'description' => __( 'Blog items columns', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Remore Text', 'kitgreen' ),
					'param_name' => 'text_remore',
					'value' => 'Continue Reading',
                    'dependency' => array(
						'element' => 'blog_design',
						'value' => array( 'border-bottom' ),
					),
				),
				// Data settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => array(
						__( 'Date', 'kitgreen' ) => 'date',
						__( 'Order by post ID', 'kitgreen' ) => 'ID',
						__( 'Author', 'kitgreen' ) => 'author',
						__( 'Title', 'kitgreen' ) => 'title',
						__( 'Last modified date', 'kitgreen' ) => 'modified',
						__( 'Post/page parent ID', 'kitgreen' ) => 'parent',
						__( 'Number of comments', 'kitgreen' ) => 'comment_count',
						__( 'Menu order/Page Order', 'kitgreen' ) => 'menu_order',
						__( 'Meta value', 'kitgreen' ) => 'meta_value',
						__( 'Meta value number', 'kitgreen' ) => 'meta_value_num',
						// __('Matches same order you passed in via the 'include' parameter.', 'kitgreen') => 'post__in'
						__( 'Random order', 'kitgreen' ) => 'rand',
					),
					'description' => __( 'Select order type. If "Meta value" or "Meta value Number" is chosen then meta key is required.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
                        'value' => array( 'ids', 'post' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sorting', 'kitgreen' ),
					'param_name' => 'order',
					'group' => __( 'Data Settings', 'kitgreen' ),
					'value' => array(
						__( 'Descending', 'kitgreen' ) => 'DESC',
						__( 'Ascending', 'kitgreen' ) => 'ASC',
					),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'description' => __( 'Select sorting order.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids', 'post' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Meta key', 'kitgreen' ),
					'param_name' => 'meta_key',
					'description' => __( 'Input meta key for grid ordering.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'orderby',
						'value' => array( 'ids', 'post' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Offset', 'kitgreen' ),
					'param_name' => 'offset',
					'description' => __( 'Number of grid elements to displace or pass over.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids', 'post' ),
					),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Exclude', 'kitgreen' ),
					'param_name' => 'exclude',
					'description' => __( 'Exclude posts, pages, etc. by title.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'settings' => array(
						'multiple' => true,
					),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids', 'post' ),
						'callback' => 'vc_grid_exclude_dependency_callback',
					),
				),
                array(
                    "type" => "checkbox",
                    "heading" => __('Show Thumbnail', 'kitgreen'),
                    "param_name" => "thumbnail_show",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                ),
                  array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )

	      )
	
	    ) );
        
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map Team shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => 'Team',
			'base' => 'kitgreen_team',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your team posts on the page', 'kitgreen' ),
			'params' => array(
				// Custom query tab
				array(
					'type' => 'textarea_safe',
					'heading' => __( 'Custom query', 'kitgreen' ),
					'param_name' => 'custom_query',
					'description' => __( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts">WordPress Codex</a>.', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Narrow data source', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
						// 'values' => $taxonomies_for_filter,
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Items per page', 'kitgreen' ),
					'param_name' => 'items_per_page',
					'description' => __( 'Number of items to show per page.', 'kitgreen' ),
					'value' => '10',
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Pagination', 'kitgreen' ),
					'param_name' => 'pagination',
					'value' => array(
	                    '' => '', 
	                    'Pagination' => 'pagination', 
	                    '"Load more" button' => 'more-btn', 
					),
				),
				// Design settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Style', 'kitgreen' ),
					'param_name' => 'team_design',
					'value' => array(
	                    'Team Image Cicle' => 'default', 
	                    'Team Image Square' => 'default2',
					),
					'description' => __( 'You can use different design for your team styled for the theme', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
                	// Design settings
			
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Columns', 'kitgreen' ),
					'param_name' => 'team_columns',
					 "value" => array(
        					"6 column" => "6",
                            "5 column" => "5",
                            "4 column" => "4",
                            "3 column" => "3",
                            "2 column" => "2",
                            "1 column" => "1",
        					
                        ),
					'description' => __( 'Team items columns', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
				// Data settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => array(
						__( 'Date', 'kitgreen' ) => 'date',
						__( 'Order by post ID', 'kitgreen' ) => 'ID',
						__( 'Author', 'kitgreen' ) => 'author',
						__( 'Title', 'kitgreen' ) => 'title',
						__( 'Last modified date', 'kitgreen' ) => 'modified',
						__( 'Post/page parent ID', 'kitgreen' ) => 'parent',
						__( 'Number of comments', 'kitgreen' ) => 'comment_count',
						__( 'Menu order/Page Order', 'kitgreen' ) => 'menu_order',
						__( 'Meta value', 'kitgreen' ) => 'meta_value',
						__( 'Meta value number', 'kitgreen' ) => 'meta_value_num',
						// __('Matches same order you passed in via the 'include' parameter.', 'kitgreen') => 'post__in'
						__( 'Random order', 'kitgreen' ) => 'rand',
					),
					'description' => __( 'Select order type. If "Meta value" or "Meta value Number" is chosen then meta key is required.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sorting', 'kitgreen' ),
					'param_name' => 'order',
					'group' => __( 'Data Settings', 'kitgreen' ),
					'value' => array(
						__( 'Descending', 'kitgreen' ) => 'DESC',
						__( 'Ascending', 'kitgreen' ) => 'ASC',
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Meta key', 'kitgreen' ),
					'param_name' => 'meta_key',
					'description' => __( 'Input meta key for grid ordering.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Offset', 'kitgreen' ),
					'param_name' => 'offset',
					'description' => __( 'Number of grid elements to displace or pass over.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Exclude', 'kitgreen' ),
					'param_name' => 'exclude',
					'description' => __( 'Exclude posts, pages, etc. by title.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'settings' => array(
					'multiple' => true,
					),
				),
                  array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )

	      )
	
	    ) );
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map Team shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => 'Search Product',
			'base' => 'kitgreen_search',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your search product on the page', 'kitgreen' ),
			'params' => array(
				// Custom query tab
				array(
					'type' => 'textfield',
					'heading' => __( 'Add Class', 'kitgreen' ),
					'param_name' => 'el_class',
				),

	      )
	
	    ) );
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map Service shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => 'Service',
			'base' => 'kitgreen_service',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your service posts on the page', 'kitgreen' ),
			'params' => array(
				// Custom query tab
				array(
					'type' => 'textarea_safe',
					'heading' => __( 'Custom query', 'kitgreen' ),
					'param_name' => 'custom_query',
					'description' => __( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts">WordPress Codex</a>.', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Narrow data source', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
						// 'values' => $taxonomies_for_filter,
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Items per page', 'kitgreen' ),
					'param_name' => 'items_per_page',
					'description' => __( 'Number of items to show per page.', 'kitgreen' ),
					'value' => '10',
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Pagination', 'kitgreen' ),
					'param_name' => 'pagination',
					'value' => array(
	                    '' => '', 
	                    'Pagination' => 'pagination', 
	                    '"Load more" button' => 'more-btn', 
					),
				),
				// Design settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Style', 'kitgreen' ),
					'param_name' => 'service_design',
					'value' => array(
	                    'Service Slider' => 'slider', 
                        'Service Box With Thumbnail' => 'grid2', 
	                    'Service Box With Icon' => 'grid',
					),
					'description' => __( 'You can use different design for your service styled for the theme', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
                	// Design settings
			
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Text Read More', 'kitgreen' ),
					'param_name' => 'text_more',
                    'default' => 'Continue Reading',
                    'dependency' => array(
						'element' => 'service_design',
						'value' => array( 'grid' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Columns', 'kitgreen' ),
					'param_name' => 'service_columns',
					 "value" => array(
        					"6 column" => "6",
                            "5 column" => "5",
                            "4 column" => "4",
                            "3 column" => "3",
                            "2 column" => "2",
                            "1 column" => "1",
        					
                        ),
					'description' => __( 'Team items columns', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
				),
				// Data settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => array(
						__( 'Date', 'kitgreen' ) => 'date',
						__( 'Order by post ID', 'kitgreen' ) => 'ID',
						__( 'Author', 'kitgreen' ) => 'author',
						__( 'Title', 'kitgreen' ) => 'title',
						__( 'Last modified date', 'kitgreen' ) => 'modified',
						__( 'Post/page parent ID', 'kitgreen' ) => 'parent',
						__( 'Number of comments', 'kitgreen' ) => 'comment_count',
						__( 'Menu order/Page Order', 'kitgreen' ) => 'menu_order',
						__( 'Meta value', 'kitgreen' ) => 'meta_value',
						__( 'Meta value number', 'kitgreen' ) => 'meta_value_num',
						// __('Matches same order you passed in via the 'include' parameter.', 'kitgreen') => 'post__in'
						__( 'Random order', 'kitgreen' ) => 'rand',
					),
					'description' => __( 'Select order type. If "Meta value" or "Meta value Number" is chosen then meta key is required.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sorting', 'kitgreen' ),
					'param_name' => 'order',
					'group' => __( 'Data Settings', 'kitgreen' ),
					'value' => array(
						__( 'Descending', 'kitgreen' ) => 'DESC',
						__( 'Ascending', 'kitgreen' ) => 'ASC',
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Meta key', 'kitgreen' ),
					'param_name' => 'meta_key',
					'description' => __( 'Input meta key for grid ordering.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Offset', 'kitgreen' ),
					'param_name' => 'offset',
					'description' => __( 'Number of grid elements to displace or pass over.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Exclude', 'kitgreen' ),
					'param_name' => 'exclude',
					'description' => __( 'Exclude posts, pages, etc. by title.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'settings' => array(
					'multiple' => true,
					),
				),
                // Design settings
				array(
					'type' => 'textfield',
					'heading' => __( 'Number Slider', 'kitgreen' ),
					'param_name' => 'number_show',
					'group' => __( 'Slider', 'kitgreen' ),
                    'value' => '3',
                    'dependency' => array(
						'element' => 'service_design',
						'value' => array( 'slider' ),
					),
				),
                
                  array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )

	      )
	
	    ) );
        
        
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map Portfolio Slider shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => 'Portfolio Slider',
			'base' => 'kitgreen_portfolio_slider',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your portfolio posts on the page', 'kitgreen' ),
			'params' => array(
				// Custom query tab
				array(
					'type' => 'textarea_safe',
					'heading' => __( 'Custom query', 'kitgreen' ),
					'param_name' => 'custom_query',
					'description' => __( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts">WordPress Codex</a>.', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Narrow data source', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
						// 'values' => $taxonomies_for_filter,
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				// Data settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => array(
						__( 'Date', 'kitgreen' ) => 'date',
						__( 'Order by post ID', 'kitgreen' ) => 'ID',
						__( 'Author', 'kitgreen' ) => 'author',
						__( 'Title', 'kitgreen' ) => 'title',
						__( 'Last modified date', 'kitgreen' ) => 'modified',
						__( 'Post/page parent ID', 'kitgreen' ) => 'parent',
						__( 'Number of comments', 'kitgreen' ) => 'comment_count',
						__( 'Menu order/Page Order', 'kitgreen' ) => 'menu_order',
						__( 'Meta value', 'kitgreen' ) => 'meta_value',
						__( 'Meta value number', 'kitgreen' ) => 'meta_value_num',
						// __('Matches same order you passed in via the 'include' parameter.', 'kitgreen') => 'post__in'
						__( 'Random order', 'kitgreen' ) => 'rand',
					),
					'description' => __( 'Select order type. If "Meta value" or "Meta value Number" is chosen then meta key is required.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sorting', 'kitgreen' ),
					'param_name' => 'order',
					'group' => __( 'Data Settings', 'kitgreen' ),
					'value' => array(
						__( 'Descending', 'kitgreen' ) => 'DESC',
						__( 'Ascending', 'kitgreen' ) => 'ASC',
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Items per page', 'kitgreen' ),
					'param_name' => 'items_per_page',
					'description' => __( 'Number of items to show per page.', 'kitgreen' ),
					'value' => '10',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Meta key', 'kitgreen' ),
					'param_name' => 'meta_key',
					'description' => __( 'Input meta key for grid ordering.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Offset', 'kitgreen' ),
					'param_name' => 'offset',
					'description' => __( 'Number of grid elements to displace or pass over.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Exclude', 'kitgreen' ),
					'param_name' => 'exclude',
					'description' => __( 'Exclude posts, pages, etc. by title.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'settings' => array(
					'multiple' => true,
					),
				),
                // Design settings
				array(
					'type' => 'textfield',
					'heading' => __( 'Number Slider', 'kitgreen' ),
					'param_name' => 'number_show',
					'group' => __( 'Slider', 'kitgreen' ),
                    'value' => '3',
				),
                
                  array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )

	      )
	
	    ) );

		// Necessary hooks for blog autocomplete fields
		add_filter( 'vc_autocomplete_kitgreen_blog_include_callback',	'vc_include_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_kitgreen_blog_include_render','vc_include_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)

		// Narrow data taxonomies
        

        add_filter( 'vc_autocomplete_kitgreen_portfolio_slider_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_portfolio_slider_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

        add_filter( 'vc_autocomplete_kitgreen_portfolio_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_portfolio_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		add_filter( 'vc_autocomplete_kitgreen_blog_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_blog_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		// Narrow data taxonomies for exclude_filter
		add_filter( 'vc_autocomplete_kitgreen_blog_exclude_filter_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_blog_exclude_filter_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		add_filter( 'vc_autocomplete_kitgreen_blog_exclude_callback',	'vc_exclude_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_kitgreen_blog_exclude_render', 'vc_exclude_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)

	   
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map pricing tables shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => __( 'Pricing tables', 'kitgreen' ),
			'base' => 'pricing_tables',
			"as_parent" => array('only' => 'pricing_plan'),
			"content_element" => true,
			"show_settings_on_create" => false,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your pricing plans', 'kitgreen' ),
   
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Number Slider Review', 'kitgreen' ),
					'param_name' => 'view',
                    'dependency' => array(
						'element' => 'layout',
						'value' => array( 'layout2' ),
					),
				),
			),
		    "js_view" => 'VcColumnView'
		));

		vc_map( array(
			'name' => __( 'Price plan', 'kitgreen' ),
			'base' => 'pricing_plan',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Price option', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'colorpicker',
					'heading' => __( 'Background', 'kitgreen' ),
					'param_name' => 'color'
				),
                array(
					'type' => 'attach_image',
					'heading' => __( 'Image', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Image Size', 'kitgreen' ),
					'param_name' => 'image_size',
					'value' => '',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Pricing plan name', 'kitgreen' ),
					'param_name' => 'name',
					'value' => '',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Price value', 'kitgreen' ),
					'param_name' => 'price_value',
					'value' => '',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Number Iteam', 'kitgreen' ),
					'param_name' => 'price_suffix',
					'value' => '/ 1 kitchen',
					'description' => __( 'For example: / 1 kitchen', 'kitgreen' )
				),
				array(
					'type' => 'textarea',
					'heading' => __( 'Featured list', 'kitgreen' ),
					'param_name' => 'features_list',
					'description' => __( 'Start each feature text from a new line', 'kitgreen' )
				),
				array(
					'type' => 'href',
					'heading' => __( 'Button link', 'kitgreen'),
					'param_name' => 'link',
					'description' => __( 'Enter URL if you want this box to have a link.', 'kitgreen' ),
                    'value' => '#',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Button label', 'kitgreen' ),
					'param_name' => 'button_label',
					'value' => 'Book Now',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			)
		));
		// Necessary hooks for blog autocomplete fields
		add_filter( 'vc_autocomplete_pricing_plan_id_callback',	'vc_include_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_pricing_plan_id_render', 'vc_include_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)
		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map Google Map shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
        vc_map(array(
            "name" => 'Google Maps V3',
            "base" => "maps",
            "category" => __('Shortcode elements', 'kitgreen'),
        	"icon" => "tb-icon-for-vc",
            "description" => __('Google Maps API V3', 'kitgreen'),
            "params" => array(
                array(
                    "type" => "textfield",
                    "heading" => __('API Key', 'kitgreen'),
                    "param_name" => "api",
                    "value" => '',
                    "description" => __('Enter you api key of map, get key from (https://console.developers.google.com)', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Address', 'kitgreen'),
                    "param_name" => "address",
                    "value" => 'New York, United States',
                    "description" => __('Enter address of Map', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Coordinate', 'kitgreen'),
                    "param_name" => "coordinate",
                    "value" => '',
                    "description" => __('Enter coordinate of Map, format input (latitude, longitude)', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Click Show Info window', 'kitgreen'),
                    "param_name" => "infoclick",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Click a marker and show info window (Default Show).', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Marker Coordinate', 'kitgreen'),
                    "param_name" => "markercoordinate",
                    "value" => '',
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Enter marker coordinate of Map, format input (latitude, longitude)', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Marker Title', 'kitgreen'),
                    "param_name" => "markertitle",
                    "value" => '',
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Enter Title Info windows for marker', 'kitgreen')
                ),
                array(
                    "type" => "textarea",
                    "heading" => __('Marker Description', 'kitgreen'),
                    "param_name" => "markerdesc",
                    "value" => '',
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Enter Description Info windows for marker', 'kitgreen')
                ),
                array(
                    "type" => "attach_image",
                    "heading" => __('Marker Icon', 'kitgreen'),
                    "param_name" => "markericon",
                    "value" => '',
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Select image icon for marker', 'kitgreen')
                ),
                array(
                    "type" => "textarea_raw_html",
                    "heading" => __('Marker List', 'kitgreen'),
                    "param_name" => "markerlist",
                    "value" => '',
                    "group" => __("Multiple Marker", 'kitgreen'),
                    "description" => __('[{"coordinate":"41.058846,-73.539423","icon":"","title":"title demo 1","desc":"desc demo 1"},{"coordinate":"40.975699,-73.717636","icon":"","title":"title demo 2","desc":"desc demo 2"},{"coordinate":"41.082606,-73.469718","icon":"","title":"title demo 3","desc":"desc demo 3"}]', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Info Window Max Width', 'kitgreen'),
                    "param_name" => "infowidth",
                    "value" => '200',
                    "group" => __("Marker", 'kitgreen'),
                    "description" => __('Set max width for info window', 'kitgreen')
                ),
                array(
                    "type" => "dropdown",
                    "heading" => __("Map Type", 'kitgreen'),
                    "param_name" => "type",
                    "value" => array(
                        "ROADMAP" => "ROADMAP",
                        "HYBRID" => "HYBRID",
                        "SATELLITE" => "SATELLITE",
                        "TERRAIN" => "TERRAIN"
                    ),
                    "description" => __('Select the map type.', 'kitgreen')
                ),
                array(
                    "type" => "dropdown",
                    "heading" => __("Style Template", 'kitgreen'),
                    "param_name" => "style",
                    "value" => array(
                        "Default" => "",
                        "Subtle Grayscale" => "Subtle-Grayscale",
                        "Shades of Grey" => "Shades-of-Grey",
                        "Blue water" => "Blue-water",
                        "Pale Dawn" => "Pale-Dawn",
                        "Blue Essence" => "Blue-Essence",
                        "Apple Maps-esque" => "Apple-Maps-esque",
                    ),
                    "group" => __("Map Style", 'kitgreen'),
                    "description" => 'Select your heading size for title.'
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Zoom', 'kitgreen'),
                    "param_name" => "zoom",
                    "value" => '13',
                    "description" => __('zoom level of map, default is 13', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Width', 'kitgreen'),
                    "param_name" => "width",
                    "value" => 'auto',
                    "description" => __('Width of map without pixel, default is auto', 'kitgreen')
                ),
                array(
                    "type" => "textfield",
                    "heading" => __('Height', 'kitgreen'),
                    "param_name" => "height",
                    "value" => '350px',
                    "description" => __('Height of map without pixel, default is 350px', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Scroll Wheel', 'kitgreen'),
                    "param_name" => "scrollwheel",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('If false, disables scrollwheel zooming on the map. The scrollwheel is disable by default.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Pan Control', 'kitgreen'),
                    "param_name" => "pancontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Pan control.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Zoom Control', 'kitgreen'),
                    "param_name" => "zoomcontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Zoom Control.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Scale Control', 'kitgreen'),
                    "param_name" => "scalecontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Scale Control.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Map Type Control', 'kitgreen'),
                    "param_name" => "maptypecontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Map Type Control.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Street View Control', 'kitgreen'),
                    "param_name" => "streetviewcontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Street View Control.', 'kitgreen')
                ),
                array(
                    "type" => "checkbox",
                    "heading" => __('Over View Map Control', 'kitgreen'),
                    "param_name" => "overviewmapcontrol",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                    "group" => __("Controls", 'kitgreen'),
                    "description" => __('Show or hide Over View Map Control.', 'kitgreen')
                )
            )
        ));
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Map button shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map( array(
			'name' => __( 'Video Popup', 'kitgreen' ),
			'base' => 'kitgreen_button',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Simple button in different theme styles', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'attach_image',
					'heading' => __( 'Icon Image', 'kitgreen' ),
					'param_name' => 'img',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' )
				),
				array(
					'type' => 'href',
					'heading' => __( 'Link', 'kitgreen' ),
					'param_name' => 'link'
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Align', 'kitgreen' ),
					'param_name' => 'align',
					'value' => array(
						'' => '',
						__( 'left', 'kitgreen' ) => 'left',
						__( 'center', 'kitgreen' ) => 'center',
						__( 'right', 'kitgreen' ) => 'right',
					)
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				)
			),
		));
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Demo Mega Theme shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map( array(
			'name' => __( 'Image Demo Theme', 'kitgreen' ),
			'base' => 'kitgreen_demo_theme',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Simple button in different theme styles', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'attach_image',
					'heading' => __( 'Theme Image', 'kitgreen' ),
					'param_name' => 'img',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' )
				),
				array(
					'type' => 'href',
					'heading' => __( 'Link', 'kitgreen' ),
					'param_name' => 'link'
				),  
				array(
					'type' => 'textfield',
					'heading' => __( 'Name', 'kitgreen' ),
					'param_name' => 'name',
				)
			),
		));
		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map testimonial shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => __( 'Testimonials', 'kitgreen' ),
			'base' => 'testimonials',
			"as_parent" => array('only' => 'testimonial'),
			"content_element" => true,
			"show_settings_on_create" => false,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'User testimonials slider or grid', 'kitgreen' ),

			'params' => array(	
                array(
					'type' => 'dropdown',
					'heading' => __( 'Layout Slider', 'kitgreen' ),
					'param_name' => 'layout',
					'value' => array(
						'Thumbnail slider' => 'layout1',
                        'Carousel slider With Image Before After' => 'layout2',
                        'Grid' => 'layout3',
                        'Slider Grid' => 'layout4',
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode.', 'kitgreen' )
				),	
               	array(
					'type' => 'textfield',
					'heading' => __( 'Slider Review', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'description' => __( 'Add number slider views.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => array( 'layout2' , 'layout3' , 'layout4' , 'layout5' ),
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Slider Review Tablet', 'kitgreen' ),
					'param_name' => 'slides_per_view_2',
					'description' => __( 'Add number slider views.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => array( 'layout2' , 'layout3' , 'layout4' , 'layout5' ),
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Slider Review Mobile', 'kitgreen' ),
					'param_name' => 'slides_per_view_3',
					'description' => __( 'Add number slider views.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => array( 'layout2' , 'layout3' , 'layout4' , 'layout5' ),
					),
				),
                array(
					'type' => 'attach_image',
					'heading' => __( 'Background', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => 'layout1',
					),
				),			
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			),
		    "js_view" => 'VcColumnView'
		));
 	     
		vc_map( array(
			'name' => __( 'Testimonial', 'kitgreen' ),
			'base' => 'testimonial',
			'class' => '',
			"as_child" => array('only' => 'testimonials'),
			"content_element" => true,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'User testimonial', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'dropdown',
					'heading' => __( 'Layout Slider', 'kitgreen' ),
					'param_name' => 'layout',
					'value' => array(
						'Thumbnail slider' => 'layout1',
                        'Carousel slider With Image Before After' => 'layout2',
                        'Grid' => 'layout3',
                        'Slider Grid' => 'layout4',
					),
					'description' => __( 'Set layout for testimonial.', 'kitgreen' )
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Name', 'kitgreen' ),
					'param_name' => 'name',
					'value' => '',
					'description' => __( 'User name', 'kitgreen' )
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Title', 'kitgreen' ),
					'param_name' => 'title',
					'value' => '',
					'description' => __( 'User title', 'kitgreen' )
				),
				array(
					'type' => 'attach_image',
					'heading' => __( 'User Avatar', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => array(
                         'layout4' , 'layout1'
                        ),
					),
				),
                array(
					'type' => 'attach_image',
					'heading' => __( 'Image Before', 'kitgreen' ),
					'param_name' => 'image_before',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => 'layout2',
					),
				),
                array(
					'type' => 'attach_image',
					'heading' => __( 'Image After', 'kitgreen' ),
					'param_name' => 'image_after',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => 'layout2',
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Image size', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'textarea_html',
					'holder' => 'div',
					'heading' => __( 'Text', 'kitgreen' ),
					'param_name' => 'content'
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Date', 'kitgreen' ),
					'param_name' => 'date',
					'description' => __( 'Add date for clents', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => 'layout4',
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Name Project', 'kitgreen' ),
					'param_name' => 'project',
					'description' => __( 'Add project for clents', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
						'value' => 'layout4',
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				)
			)
		));
		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map instagram shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Instagram', 'kitgreen' ),
			'base' => 'kitgreen_instagram',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Instagram photos', 'kitgreen' ),
			'params' =>  kitgreen_get_instagram_params()
		));


		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map Author Widget shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Author area', 'kitgreen' ),
			'base' => 'author_area',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Widget for author information', 'kitgreen' ),
			'params' =>  kitgreen_get_author_area_params()
		));

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map promo banner shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Promo Banner', 'kitgreen' ),
			'base' => 'promo_banner',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Promo image with text and hover effect', 'kitgreen' ),
			'params' =>  kitgreen_get_banner_params()
		));

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map banners carousel shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => __( 'Infobox carousel', 'kitgreen' ),
			'base' => 'banners_carousel',
			"as_parent" => array('only' => 'kitgreen_info_box' ),
			"content_element" => true,
			"show_settings_on_create" => true,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show your banners as a carousel', 'kitgreen' ),
			'params' => array(
				array(
					'type' => 'dropdown',
					'heading' => __( 'Slides per view', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'value' => array(
						1,2,3,4,5,6,7,8
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode.', 'kitgreen' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Slider autoplay', 'kitgreen' ),
					'param_name' => 'autoplay',
					'description' => __( 'Enables autoplay mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Slider speed', 'kitgreen' ),
					'param_name' => 'speed',
					'value' => '5000',
					'description' => __( 'Duration of animation between slides (in ms)', 'kitgreen' ),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide pagination control', 'kitgreen' ),
					'param_name' => 'hide_pagination_control',
					'description' => __( 'If "YES" pagination control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide prev/next buttons', 'kitgreen' ),
					'param_name' => 'hide_prev_next_buttons',
					'description' => __( 'If "YES" prev/next control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Slider loop', 'kitgreen' ),
					'param_name' => 'wrap',
					'description' => __( 'Enables loop mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
			),
		    "js_view" => 'VcColumnView'
		));

        /**
		 * ------------------------------------------------------------------------------------------------
		 * Logo shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Slider Image Thumbnail', 'kitgreen' ),
			'base' => 'kitgreen_log_bn',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Slider Image', 'kitgreen' ),
			'params' => array(
				array(
					'type' => 'attach_images',
					'heading' => __( 'Images', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select images from media library.', 'kitgreen' )
				),
                 array(
					'type' => 'textfield',
					'heading' => __( 'Number Slider Thumbnail', 'kitgreen' ),
					'param_name' => 'thumbnail_item',
					'description' => __( 'Add Number Slider Thumbnail', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Size Image Big', 'kitgreen' ),
					'param_name' => 'image_big_size',
					'description' => __( 'Add Size Image Big', 'kitgreen' ),
                    'defaul' => 'full',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Size Image Thumbnail', 'kitgreen' ),
					'param_name' => 'image_thumbnail_size',
					'description' => __( 'Add Size Image Thumbnail', 'kitgreen' ),
                    'defaul' => 'full',
				),
             
			)
		));
         /**
		 * ------------------------------------------------------------------------------------------------
		 * Button shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Button kitgreen', 'kitgreen' ),
			'base' => 'kitgreen_button_click',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Button', 'kitgreen' ),
			'params' => array(
                 array(
					'type' => 'colorpicker',
					'heading' => __( 'Button Background', 'kitgreen' ),
					'param_name' => 'color'
				),
                array(
					'type' => 'colorpicker',
					'heading' => __( 'Font Color', 'kitgreen' ),
					'param_name' => 'color3'
				),
  	             array(
					'type' => 'textfield',
					'heading' => __( 'Link', 'kitgreen' ),
					'param_name' => 'link',
					'description' => __( 'Add Link For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Font Size', 'kitgreen' ),
					'param_name' => 'size',
					'description' => __( 'Add Font Size For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Text Button', 'kitgreen' ),
					'param_name' => 'btn_text',
					'description' => __( 'Add Text For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Text Width', 'kitgreen' ),
					'param_name' => 'width',
					'description' => __( 'Add Width For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( ' Height Button', 'kitgreen' ),
					'param_name' => 'height',
					'description' => __( 'Add Height For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Radius Button', 'kitgreen' ),
					'param_name' => 'radius',
					'description' => __( 'Add Radius For button.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Class', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'Add Class For button.', 'kitgreen' )
				),
                
              	array(
					'type' => 'dropdown',
					'heading' => __( 'Position', 'kitgreen' ),
					'param_name' => 'position',
					'description' => __( 'Choose position for button', 'kitgreen' ),
					'value' => array(
						'Left' => 'left',
						'right' => 'right',
                        'center' => 'center',
					),
				),
                 array(
					'type' => 'colorpicker',
					'heading' => __( 'Button Background', 'kitgreen' ),
					'param_name' => 'color_hv1',
                    'group' => __( 'Hover', 'kitgreen' ),
				),
                 array(
					'type' => 'colorpicker',
					'heading' => __( 'Font Color', 'kitgreen' ),
					'param_name' => 'color_hv3',
                    'group' => __( 'Hover', 'kitgreen' ),
				),
                 array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			)
		));
         /**
		 * ------------------------------------------------------------------------------------------------
		 * Heading Two Color Shortcode
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Heading Two Color', 'kitgreen' ),
			'base' => 'headingtwo',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Button', 'kitgreen' ),
			'params' => array(
                 array(
					'type' => 'colorpicker',
					'heading' => __( 'Color 1', 'kitgreen' ),
					'param_name' => 'color'
				),
                array(
					'type' => 'colorpicker',
					'heading' => __( 'Color 2', 'kitgreen' ),
					'param_name' => 'color2'
				),
  	             array(
					'type' => 'textfield',
					'heading' => __( 'Title', 'kitgreen' ),
					'param_name' => 'title',
				),
                 array(
					'type' => 'textfield',
					'heading' => __( 'Title 2', 'kitgreen' ),
					'param_name' => 'title2',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Font Size 1', 'kitgreen' ),
					'param_name' => 'font_size1',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Font Size 2', 'kitgreen' ),
					'param_name' => 'font_size2',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Font Weight 1', 'kitgreen' ),
					'param_name' => 'font_weight1',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Font Weight 2', 'kitgreen' ),
					'param_name' => 'font_weight2',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Class', 'kitgreen' ),
					'param_name' => 'el_class',
				),
              	array(
					'type' => 'dropdown',
					'heading' => __( 'Position', 'kitgreen' ),
					'param_name' => 'position',
					'description' => __( 'Choose position for button', 'kitgreen' ),
					'value' => array(
						'Left' => 'left',
						'right' => 'right',
                        'center' => 'center',
					),
				),
                 array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			)
		));
		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map countdown timer
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Countdown timer', 'kitgreen' ),
			'base' => 'kitgreen_countdown_timer',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Shows countdown timer', 'kitgreen' ),
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Date', 'kitgreen' ),
					'param_name' => 'date',
					'description' => __( 'Final date in the format Y/m/d. For example 2017/12/12', 'kitgreen' )
				),
				kitgreen_get_color_scheme_param(),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Size', 'kitgreen' ),
					'param_name' => 'size',
					'value' => array(
						'' => '',
						__( 'Small', 'kitgreen' ) => 'small',
						__( 'Medium', 'kitgreen' ) => 'medium',
						__( 'Large', 'kitgreen' ) => 'large',
					)
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Align', 'kitgreen' ),
					'param_name' => 'align',
					'value' => array(
						'' => '',
						__( 'left', 'kitgreen' ) => 'left',
						__( 'center', 'kitgreen' ) => 'center',
						__( 'right', 'kitgreen' ) => 'right',
					)
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Style', 'kitgreen' ),
					'param_name' => 'style',
					'value' => array(
						'' => '',
						__( 'Standard', 'kitgreen' ) => 'standard',
						__( 'Transparent', 'kitgreen' ) => 'transparent',
					)
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				)
			)
		));

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Information box with image (icon)
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Information box', 'kitgreen' ),
			'base' => 'kitgreen_info_box',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show some brief information', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'dropdown',
					'heading' => __( 'Layout', 'kitgreen' ),
					'param_name' => 'layout',
					'value' => array(
						'Layout Left Icon' => 'left_icon',
                        'Layout Left Icon With Border' => 'left_icon2',
                        'Layout Top Icon' => 'top_icon',
                        'Layout Top Icon With Background Icon' => 'top_icon2',
                        'Layout Process With Button' => 'process_icon',
                        'Layout Process With Border Bottom' => 'process_icon2',
                        'Layout Process With Button Content Left ' => 'process_icon3',
					),
					'description' => __( 'Set layout for infobox', 'kitgreen' )
				),
            	array(
					'type' => 'textfield',
					'heading' => __( 'Icon', 'kitgreen' ),
					'param_name' => 'icon',
					'description' => __( 'Add Class icon form http://fontawesome.io Example: comment-o  ', 'kitgreen' )
				),
                array(
					'type' => 'colorpicker',
					'heading' => __( 'Icon color', 'kitgreen' ),
					'param_name' => 'color'
				),
				array(
					'type' => 'attach_image',
					'heading' => __( 'Image', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Number Process', 'kitgreen' ),
					'param_name' => 'number',
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'process_icon' , 'process_icon3' ),
					),
				),
                
				array(
					'type' => 'textfield',
					'heading' => __( 'Image size', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'textarea_html',
					'holder' => 'div',
					'heading' => __( 'Brief content', 'kitgreen' ),
					'param_name' => 'content',
					'description' => __( 'Add here few words to your banner image.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Text Button', 'kitgreen' ),
					'param_name' => 'text_btn',
					'description' => __( 'Add Text For Button ', 'kitgreen' ),
                    'dependency' => array(
						'element' => 'layout',
					'value' => array( 'process_icon' , 'process_icon3' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Text alignment', 'kitgreen' ),
					'param_name' => 'alignment',
					'value' => array(
						__( 'Align left', 'kitgreen' ) => '',
						__( 'Align right', 'kitgreen' ) => 'right',
						__( 'Align center', 'kitgreen' ) => 'center'
					),
					'description' => __( 'Select image alignment.', 'kitgreen' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Hover', 'kitgreen' ),
					'param_name' => 'hover',
					'value' => array(
						__( 'BoxShaw', 'kitgreen' ) => 'hover1',
						__( 'Gradient Background', 'kitgreen' ) => 'hover2',
					)
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'New CSS structure', 'kitgreen' ),
					'param_name' => 'new_styles',
					'description' => __( 'Use improved version with CSS flexbox that was added in 2.9 version.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Link Box', 'kitgreen' ),
					'param_name' => 'link',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                 array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			)
		));
        /**
		 * ------------------------------------------------------------------------------------------------
		 * Information box with image (icon)
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map(array(
			'name' => __( 'Counter Up', 'kitgreen' ),
			'base' => 'kitgreen_counter_up',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Show some brief information', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'dropdown',
					'heading' => __( 'Layout', 'kitgreen' ),
					'param_name' => 'layout',
					'value' => array(
						__( 'Layout No Background' , 'kitgreen' ) => 'layout1',
						__( 'Layout With Background', 'kitgreen' ) => 'layout2',
					)
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Icon', 'kitgreen' ),
					'param_name' => 'icon',
                    'description' => 'Add class for icon from ionicons.com'
				),
            	array(
					'type' => 'textfield',
					'heading' => __( 'Label', 'kitgreen' ),
					'param_name' => 'label',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Value', 'kitgreen' ),
					'param_name' => 'value',
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Class', 'kitgreen' ),
					'param_name' => 'el_class',
				),
                
                 array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			)
		));
        /** 
        Portfolio Filter
        **/
       	$order_by_values = array(
			'',
			__( 'Date', 'kitgreen' ) => 'date',
			__( 'ID', 'kitgreen' ) => 'ID',
			__( 'Title', 'kitgreen' ) => 'title',
			__( 'Modified', 'kitgreen' ) => 'modified',
		);

		$order_way_values = array(
			'',
			__( 'Descending', 'kitgreen' ) => 'DESC',
			__( 'Ascending', 'kitgreen' ) => 'ASC',
		);
        vc_map( array(
			'name' => __( 'Portfolio', 'kitgreen' ),
			'base' => 'kitgreen_portfolio',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Showcase your projects or gallery', 'kitgreen' ),
			'params' => array(
                array(
					'type' => 'dropdown',
					'heading' => __( 'Layout', 'kitgreen' ),
					'param_name' => 'layout',
					'value' => array(
	                    'Grid' => 'grid',
                        'Grid 2' => 'grid2',
                        'Metro' => 'metro',
					)
				),
                
				array(
					'type' => 'textfield',
					'heading' => __( 'Number of posts per page', 'kitgreen' ),
					'param_name' => 'posts_per_page'
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Columns', 'kitgreen' ),
					'param_name' => 'columns',
					'value' => array(
	                     2,
	                     3,
	                     4,
	                     6,
					),
                    'dependency' => array(
						'element' => 'layout',
						'value' => array( 'grid', 'grid2' ),
					),
				),
  		        array(
					'type' => 'autocomplete',
					'heading' => __( 'Narrow data source', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
						// 'values' => $taxonomies_for_filter,
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Space between projects', 'kitgreen' ),
					'param_name' => 'spacing',
					'value' => array(
	                    'No Space' => '0',
                        'Have Space' => '15',
					),
                    'default' => '0',
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Show categories filters', 'kitgreen' ),
					'param_name' => 'filters',
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 1 )
				),
                
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => $order_by_values,
					'save_always' => true,
					'description' => sprintf( __( 'Select how to sort retrieved projects. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sort order', 'kitgreen' ),
					'param_name' => 'order',
					'value' => $order_way_values,
					'save_always' => true,
					'description' => sprintf( __( 'Designates the ascending or descending order. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Pagination', 'kitgreen' ),
					'param_name' => 'pagination',
					'value' => array(
	                    '' => '',
	                    'Pagination' => 'pagination',
	                    '"Load more" button' => 'more-btn',
                        '"View all" button' => 'view-btn',
	                    'Disable' => 'disable',
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Text View All', 'kitgreen' ),
					'param_name' => 'view_all_text',
                    'dependency' => array(
						'element' => 'pagination',
						'value' => array( 'view-btn' ),
					),
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Link View All', 'kitgreen' ),
					'param_name' => 'view_all_link',
                    'dependency' => array(
						'element' => 'pagination',
						'value' => array( 'view-btn' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                array(
					'type' => 'textfield',
					'heading' => __( 'Image Size', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
                 array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
			),
		));

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Add options to columns and text block 
		 * ------------------------------------------------------------------------------------------------
		 */

		add_action( 'init', 'kitgreen_update_vc_column');

		if( ! function_exists( 'kitgreen_update_vc_column' ) ) {
			function kitgreen_update_vc_column() {
				if(!function_exists('vc_map')) return;
				vc_remove_param( 'vc_column', 'el_class' );
				
		        vc_add_param( 'vc_column', kitgreen_get_color_scheme_param() ); 
				
		        vc_add_param( 'vc_column', array(
		            'type' => 'textfield',
		            'heading' => __( 'Extra class name', 'kitgreen' ),
		            'param_name' => 'el_class',
		            'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
		        ) ); 

				vc_remove_param( 'vc_column_text', 'el_class' );
				
		        vc_add_param( 'vc_column_text', kitgreen_get_color_scheme_param() ); 
				
		        vc_add_param( 'vc_column_text', array(
		            'type' => 'textfield',
		            'heading' => __( 'Extra class name', 'kitgreen' ),
		            'param_name' => 'el_class',
		            'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
		        ) ); 
			}
		}


		/**
		 * ------------------------------------------------------------------------------------------------
		 * Add new element to VC: Categories [kitgreen_categories]
		 * ------------------------------------------------------------------------------------------------
		 */


		$order_by_values = array(
			'',
			__( 'Date', 'kitgreen' ) => 'date',
			__( 'ID', 'kitgreen' ) => 'ID',
			__( 'Author', 'kitgreen' ) => 'author',
			__( 'Title', 'kitgreen' ) => 'title',
			__( 'Modified', 'kitgreen' ) => 'modified',
			__( 'Random', 'kitgreen' ) => 'rand',
			__( 'Comment count', 'kitgreen' ) => 'comment_count',
			__( 'Menu order', 'kitgreen' ) => 'menu_order',
			__( 'As IDs or slugs provided order', 'kitgreen' ) => 'include',
		);

		$order_way_values = array(
			'',
			__( 'Descending', 'kitgreen' ) => 'DESC',
			__( 'Ascending', 'kitgreen' ) => 'ASC',
		);

		vc_map( array(
			'name' => __( 'Product categories', 'kitgreen' ),
			'base' => 'kitgreen_categories',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Product categories grid', 'kitgreen' ), 
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Title', 'kitgreen' ),
					'param_name' => 'title',
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Number', 'kitgreen' ),
					'param_name' => 'number',
					'description' => __( 'The `number` field is used to display the number of categories.', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => $order_by_values,
					'save_always' => true,
					'description' => sprintf( __( 'Select how to sort retrieved categories. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sort order', 'kitgreen' ),
					'param_name' => 'order',
					'value' => $order_way_values,
					'save_always' => true,
					'description' => sprintf( __( 'Designates the ascending or descending order. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Layout', 'kitgreen' ),
					'value' => 4,
					'param_name' => 'style',
					'save_always' => true,
					'description' => __( 'Try out our creative styles for categories block', 'kitgreen' ),
					'value' => array(
						'Default' => 'default',
						'Carousel' => 'carousel',
					)
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Slides per view', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'value' => array(
						1,2,3,4,5,6,7,8
					),
					'dependency' => array(
						'element' => 'style',
						'value' => array( 'carousel' ),
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode.', 'kitgreen' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide pagination control', 'kitgreen' ),
					'param_name' => 'hide_pagination_control',
					'description' => __( 'If "YES" pagination control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'dependency' => array(
						'element' => 'style',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide prev/next buttons', 'kitgreen' ),
					'param_name' => 'hide_prev_next_buttons',
					'description' => __( 'If "YES" prev/next control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'dependency' => array(
						'element' => 'style',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Slider loop', 'kitgreen' ),
					'param_name' => 'wrap',
					'description' => __( 'Enables loop mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'dependency' => array(
						'element' => 'style',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Hide empty', 'kitgreen' ),
					'param_name' => 'hide_empty',
					'description' => __( 'Hide empty', 'kitgreen' ),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Categories', 'kitgreen' ),
					'param_name' => 'ids',
					'settings' => array(
						'multiple' => true,
						'sortable' => true,
					),
					'save_always' => true,
					'description' => __( 'List of product categories', 'kitgreen' ),
				)
			)
		) );

		//Filters For autocomplete param:
		//For suggestion: vc_autocomplete_[shortcode_name]_[param_name]_callback
		add_filter( 'vc_autocomplete_kitgreen_categories_ids_callback', 'kitgreen_productCategoryCategoryAutocompleteSuggester', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_kitgreen_categories_ids_render', 'kitgreen_productCategoryCategoryRenderByIdExact', 10, 1 ); 

		if( ! function_exists( 'kitgreen_productCategoryCategoryAutocompleteSuggester' ) ) {
			function kitgreen_productCategoryCategoryAutocompleteSuggester( $query, $slug = false ) {
				global $wpdb;
				$cat_id = (int) $query;
				$query = trim( $query );
				$post_meta_infos = $wpdb->get_results(
					$wpdb->prepare( "SELECT a.term_id AS id, b.name as name, b.slug AS slug
								FROM {$wpdb->term_taxonomy} AS a
								INNER JOIN {$wpdb->terms} AS b ON b.term_id = a.term_id
								WHERE a.taxonomy = 'product_cat' AND (a.term_id = '%d' OR b.slug LIKE '%%%s%%' OR b.name LIKE '%%%s%%' )",
						$cat_id > 0 ? $cat_id : - 1, stripslashes( $query ), stripslashes( $query ) ), ARRAY_A );

				$result = array();
				if ( is_array( $post_meta_infos ) && ! empty( $post_meta_infos ) ) {
					foreach ( $post_meta_infos as $value ) {
						$data = array();
						$data['value'] = $slug ? $value['slug'] : $value['id'];
						$data['label'] = __( 'Id', 'kitgreen' ) . ': ' .
						                 $value['id'] .
						                 ( ( strlen( $value['name'] ) > 0 ) ? ' - ' . __( 'Name', 'kitgreen' ) . ': ' .
						                                                      $value['name'] : '' ) .
						                 ( ( strlen( $value['slug'] ) > 0 ) ? ' - ' . __( 'Slug', 'kitgreen' ) . ': ' .
						                                                      $value['slug'] : '' );
						$result[] = $data;
					}
				}

				return $result;
			}
		}
		if( ! function_exists( 'kitgreen_productCategoryCategoryRenderByIdExact' ) ) {
			function kitgreen_productCategoryCategoryRenderByIdExact( $query ) {
				global $wpdb;
				$query = $query['value'];
				$cat_id = (int) $query;
				$term = get_term( $cat_id, 'product_cat' );

				return kitgreen_productCategoryTermOutput( $term );
			}
		}

		if( ! function_exists( 'kitgreen_productCategoryTermOutput' ) ) {
			function kitgreen_productCategoryTermOutput( $term ) {
				$term_slug = $term->slug;
				$term_title = $term->name;
				$term_id = $term->term_id;

				$term_slug_display = '';
				if ( ! empty( $term_sku ) ) {
					$term_slug_display = ' - ' . __( 'Sku', 'kitgreen' ) . ': ' . $term_slug;
				}

				$term_title_display = '';
				if ( ! empty( $product_title ) ) {
					$term_title_display = ' - ' . __( 'Title', 'kitgreen' ) . ': ' . $term_title;
				}

				$term_id_display = __( 'Id', 'kitgreen' ) . ': ' . $term_id;

				$data = array();
				$data['value'] = $term_id;
				$data['label'] = $term_id_display . $term_title_display . $term_slug_display;

				return ! empty( $data ) ? $data : false;
			}
		}
         vc_map( array(
			'name' => __( 'Kitchen ajax tabs', 'kitgreen' ),
			'base' => 'kitchen_tabs',
			"as_parent" => array('only' => 'kitchen_tab'),
			"content_element" => true,
			"show_settings_on_create" => true,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Kitchen tabs for your marketplace', 'kitgreen' ),
		    "js_view" => 'VcColumnView'
		));
		vc_map(array(
			'name' => __( 'Kitchen Content tab', 'kitgreen' ),
			'base' => 'kitchen_tab',
            "as_child" => array('only' => 'kitchen_tabs'),
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Kitchen Item Inner', 'kitgreen' ),
			'params' => array(
                	array(
    					'type' => 'textfield',
    					'heading' => __( 'Title', 'kitgreen' ),
    					'param_name' => 'title',
    					'description' => __( 'Tab Title', 'kitgreen' ),
                        'group' => __( 'Title Nav Content', 'kitgreen' ),
    				    ),
                    array(
    					'type' => 'attach_image',
    					'heading' => __( 'Image Thumbnail Nav', 'kitgreen' ),
    					'param_name' => 'image',
    					'value' => '',
                        'default' => 'full',
    					'description' => __( 'Select image for nav from media library.', 'kitgreen' ),
                        'group' => __( 'Title Nav Content', 'kitgreen' ),
				    ),
                    array(
					'type' => 'textfield',
					'heading' => __( 'Number of posts per page', 'kitgreen' ),
					'param_name' => 'posts_per_page'
			     	),
                     array(
					'type' => 'autocomplete',
					'heading' => __( 'Categories or tags', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
				),
                array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => $order_by_values,
					'save_always' => true,
					'description' => sprintf( __( 'Select how to sort retrieved projects. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sort order', 'kitgreen' ),
					'param_name' => 'order',
					'value' => $order_way_values,
					'save_always' => true,
					'description' => sprintf( __( 'Designates the ascending or descending order. More at %s.', 'kitgreen' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' )
				),
                array(
    					'type' => 'textfield',
    					'heading' => __( 'Image Before After Size', 'kitgreen' ),
    					'param_name' => 'img_size',
    					'description' => __( 'Add Image Size For Image Example: full , thumbnail or 300x300', 'kitgreen' ),
 				    ),
                array(
    					'type' => 'textfield',
    					'heading' => __( 'Label Button', 'kitgreen' ),
    					'param_name' => 'label',
    					'description' => __( 'Add Label For Button', 'kitgreen' ),
 				    ),           
			)
		));
        // Narrow data taxonomies
		add_filter( 'vc_autocomplete_kitchen_tab_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitchen_tab_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );
		/**
		 * ------------------------------------------------------------------------------------------------
		 * Add new element to VC: Posts [kitgreen_posts]
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map( array(
			'name' => __( 'Posts carousel', 'kitgreen' ),
			'base' => 'kitgreen_posts',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Animated carousel with posts', 'kitgreen' ), 
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Slider title', 'kitgreen' ),
					'param_name' => 'title',
				),
				array(
					'type' => 'loop',
					'heading' => __( 'Carousel content', 'kitgreen' ),
					'param_name' => 'posts_query',
					'settings' => array(
						'size' => array( 'hidden' => false, 'value' => 10 ),
						'post_type' => array( 'value' => 'post' ),
						'order_by' => array( 'value' => 'date' )
					),
					'description' => __( 'Create WordPress loop, to populate content from your site.', 'kitgreen' )
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Slider speed', 'kitgreen' ),
					'param_name' => 'speed',
					'value' => '5000',
					'description' => __( 'Duration of animation between slides (in ms)', 'kitgreen' )
				),
                	array(
					'type' => 'textfield',
					'heading' => __( 'Space Item', 'kitgreen' ),
					'param_name' => 'space',
					'value' => '15',
					'description' => __( 'Enter Space bewen item', 'kitgreen' ),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Slides per view', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'value' => array(
						1,2,3,4,5,6,7,8
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode. Also supports for "auto" value, in this case it will fit slides depending on container\'s width. "auto" mode doesn\'t compatible with loop mode.', 'kitgreen' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Scroll per page', 'kitgreen' ),
					'param_name' => 'scroll_per_page',
					'description' => __( 'Scroll per page not per item. This affect next/prev buttons and mouse/touch dragging.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Slider autoplay', 'kitgreen' ),
					'param_name' => 'autoplay',
					'description' => __( 'Enables autoplay mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide pagination control', 'kitgreen' ),
					'param_name' => 'hide_pagination_control',
					'description' => __( 'If "YES" pagination control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide prev/next buttons', 'kitgreen' ),
					'param_name' => 'hide_prev_next_buttons',
					'description' => __( 'If "YES" prev/next control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Slider loop', 'kitgreen' ),
					'param_name' => 'wrap',
					'description' => __( 'Enables loop mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				),
                  array(
                    "type" => "checkbox",
                    "heading" => __('Show Thumbnail', 'kitgreen'),
                    "param_name" => "thumbnail_show",
                    "value" => array(
                        __("Yes, please", 'kitgreen') => true
                    ),
                ),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				),
			)
		) );

		/**
		 * ------------------------------------------------------------------------------------------------
		 * Add new element to VC: Products [kitgreen_products]
		 * ------------------------------------------------------------------------------------------------
		 */

		vc_map( kitgreen_get_products_shortcode_map_params() );

		// Necessary hooks for blog autocomplete fields
		add_filter( 'vc_autocomplete_kitgreen_products_include_callback',	'vc_include_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_kitgreen_products_include_render',
			'vc_include_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)

		// Narrow data taxonomies
		add_filter( 'vc_autocomplete_kitgreen_products_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_products_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		// Narrow data taxonomies for exclude_filter
		add_filter( 'vc_autocomplete_kitgreen_products_exclude_filter_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_kitgreen_products_exclude_filter_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		add_filter( 'vc_autocomplete_kitgreen_products_exclude_callback',	'vc_exclude_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_kitgreen_products_exclude_render', 'vc_exclude_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)




		/**
		 * ------------------------------------------------------------------------------------------------
		 * Map products tabs shortcode
		 * ------------------------------------------------------------------------------------------------
		 */
		vc_map( array(
			'name' => __( 'AJAX Products tabs', 'kitgreen' ),
			'base' => 'products_tabs',
			"as_parent" => array('only' => 'products_tab'),
			"content_element" => true,
			"show_settings_on_create" => true,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Product tabs for your marketplace', 'kitgreen' ),
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Title', 'kitgreen' ),
					'param_name' => 'title',
				),
				array(
					'type' => 'attach_image',
					'heading' => __( 'Icon image', 'kitgreen' ),
					'param_name' => 'image',
					'value' => '',
					'description' => __( 'Select image from media library.', 'kitgreen' )
				),
				array(
					'type' => 'colorpicker',
					'heading' => __( 'Tabs color', 'kitgreen' ),
					'param_name' => 'color'
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Extra class name', 'kitgreen' ),
					'param_name' => 'el_class',
					'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
				)
			),
		    "js_view" => 'VcColumnView'
		));

		$kitgreen_prdoucts_params = vc_map_integrate_shortcode( kitgreen_get_products_shortcode_map_params(), '', '', array(
			'exclude' => array(
			),
		));

		vc_map( array(
			'name' => __( 'Products tab', 'kitgreen' ),
			'base' => 'products_tab',
			'class' => '',
			"as_child" => array('only' => 'products_tabі'),
			"content_element" => true,
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Products block', 'kitgreen' ),
			'params' => array_merge( array(
				array(
					'type' => 'textfield',
					'heading' => __( 'Title for the tab', 'kitgreen' ),
					'param_name' => 'title',
					'value' => '',
				)
			), $kitgreen_prdoucts_params )
		));

		// Necessary hooks for blog autocomplete fields
		add_filter( 'vc_autocomplete_products_tab_include_callback',	'vc_include_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_products_tab_include_render',
			'vc_include_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)

		// Narrow data taxonomies
		add_filter( 'vc_autocomplete_products_tab_taxonomies_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_products_tab_taxonomies_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		// Narrow data taxonomies for exclude_filter
		add_filter( 'vc_autocomplete_products_tab_exclude_filter_callback', 'vc_autocomplete_taxonomies_field_search', 10, 1 );
		add_filter( 'vc_autocomplete_products_tab_exclude_filter_render', 'vc_autocomplete_taxonomies_field_render', 10, 1 );

		add_filter( 'vc_autocomplete_products_tab_exclude_callback',	'vc_exclude_field_search', 10, 1 ); // Get suggestion(find). Must return an array
		add_filter( 'vc_autocomplete_products_tab_exclude_render', 'vc_exclude_field_render', 10, 1 ); // Render exact product. Must return an array (label,value)



		/**
		 * ------------------------------------------------------------------------------------------------
		 * Update images carousel parameters
		 * ------------------------------------------------------------------------------------------------
		 */
		add_action( 'init', 'kitgreen_update_vc_images_carousel');

		if( ! function_exists( 'kitgreen_update_vc_images_carousel' ) ) {
			function kitgreen_update_vc_images_carousel() {
				if(!function_exists('vc_map')) return;
				vc_remove_param( 'vc_images_carousel', 'mode' );
				vc_remove_param( 'vc_images_carousel', 'partial_view' );
				vc_remove_param( 'vc_images_carousel', 'el_class' );
				
		        vc_add_param( 'vc_images_carousel', array(
					'type' => 'checkbox',
					'heading' => __( 'Add spaces between images', 'kitgreen' ),
					'param_name' => 'spaces',
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' )
				) ); 
				
		        vc_add_param( 'vc_images_carousel', array(
					'type' => 'dropdown',
					'heading' => __( 'Specific design', 'kitgreen' ),
					'param_name' => 'design',
		            'description' => __( 'With this option your gallery will be styled in a different way, and sizes will be changed.', 'kitgreen' ),
					'value' => array(
						'' => 'none',
						__( 'Iphone', 'kitgreen' ) => 'iphone',
						__( 'MacBook', 'kitgreen' ) => 'macbook',
					)
				) ); 

		        vc_add_param( 'vc_images_carousel', array(
		            'type' => 'textfield',
		            'heading' => __( 'Extra class name', 'kitgreen' ),
		            'param_name' => 'el_class',
		            'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
		        ) ); 
			}
		}

	}
}


if( ! function_exists( 'kitgreen_get_products_shortcode_params' ) ) {
	function kitgreen_get_products_shortcode_map_params() {
		return array(
			'name' => __( 'Products (grid or carousel)', 'kitgreen' ),
			'base' => 'kitgreen_products',
			'class' => '',
			'category' => __( 'Shortcode elements', 'kitgreen' ),
			'description' => __( 'Animated carousel with posts', 'kitgreen' ),
			'params' => kitgreen_get_products_shortcode_params() 
		);
	}
}

if( ! function_exists( 'kitgreen_get_products_shortcode_params' ) ) {
	function kitgreen_get_products_shortcode_params() {
		return apply_filters( 'kitgreen_get_products_shortcode_params', array(
				array(
					'type' => 'dropdown',
					'heading' => __( 'Grid or carousel', 'kitgreen' ),
					'param_name' => 'layout',
					'value' =>  array(
						array( 'grid', __( 'Grid', 'kitgreen' ) ),
						array( 'carousel', __( 'Carousel', 'kitgreen' ) ),

					),
					'description' => __( 'Show products in standard grid or via slider carousel', 'kitgreen' )
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Data source', 'kitgreen' ),
					'param_name' => 'post_type',
					'value' =>  array(
						array( 'product', __( 'All Products', 'kitgreen' ) ),
						array( 'featured', __( 'Featured Products', 'kitgreen' ) ),
						array( 'sale', __( 'Sale Products', 'kitgreen' ) ),
						array( 'bestselling', __( 'Bestsellers', 'kitgreen' ) ),
						array( 'ids', __( 'List of IDs', 'kitgreen' ) )

					),
					'description' => __( 'Select content type for your grid.', 'kitgreen' )
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Include only', 'kitgreen' ),
					'param_name' => 'include',
					'description' => __( 'Add products by title.', 'kitgreen' ),
					'settings' => array(
						'multiple' => true,
						'sortable' => true,
						'groups' => true,
					),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'ids' ),
						//'callback' => 'vc_grid_include_dependency_callback',
					),
				),
				// Custom query tab
				array(
					'type' => 'textarea_safe',
					'heading' => __( 'Custom query', 'kitgreen' ),
					'param_name' => 'custom_query',
					'description' => __( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts">WordPress Codex</a>.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value' => array( 'custom' ),
					),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Categories or tags', 'kitgreen' ),
					'param_name' => 'taxonomies',
					'settings' => array(
						'multiple' => true,
						// is multiple values allowed? default false
						// 'sortable' => true, // is values are sortable? default false
						'min_length' => 1,
						// min length to start search -> default 2
						// 'no_hide' => true, // In UI after select doesn't hide an select list, default false
						'groups' => true,
						// In UI show results grouped by groups, default false
						'unique_values' => true,
						// In UI show results except selected. NB! You should manually check values in backend, default false
						'display_inline' => true,
						// In UI show results inline view, default false (each value in own line)
						'delay' => 500,
						// delay for search. default 500
						'auto_focus' => true,
						// auto focus input, default true
					),
					'param_holder_class' => 'vc_not-for-custom',
					'description' => __( 'Enter categories, tags or custom taxonomies.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value_not_equal_to' => array( 'ids', 'custom' ),
					),
				),
				array(
                    'type' => 'textfield',
					'heading' => __( 'Items per page', 'kitgreen' ),
					'param_name' => 'items_per_page',
					'description' => __( 'Number of items to show per page.', 'kitgreen' ),
					'value' => '10',
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Pagination', 'kitgreen' ),
					'param_name' => 'pagination',
					'value' => array(
	                    '' => '', 
	                    '"Load more" button' => 'more-btn', 
	                    'Arrows' => 'arrows', 
					),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'grid' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Columns', 'kitgreen' ),
					'param_name' => 'columns',
					'value' => array(
						1,2, 3, 4, 5 , 6
					),
					'description' => __( 'Columns', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'grid' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Images size', 'kitgreen' ),
					'group' => __( 'Design', 'kitgreen' ),
					'param_name' => 'img_size',
					'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Sale countdown', 'kitgreen' ),
					'description' => __( 'Countdown to the end sale date will be shown. Be sure you have set final date of the product sale price.', 'kitgreen' ),
					'param_name' => 'sale_countdown',
					'value' => 1,
					'group' => __( 'Design', 'kitgreen' ),
				),
				// Carousel settings
				array(
					'type' => 'textfield',
					'heading' => __( 'Slider speed', 'kitgreen' ),
					'param_name' => 'speed',
					'value' => '5000',
					'description' => __( 'Duration of animation between slides (in ms)', 'kitgreen' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Slides per view', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'value' => array(
						1,2,3,4,5,6,7,8
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode. Also supports for "auto" value, in this case it will fit slides depending on container\'s width. "auto" mode doesn\'t compatible with loop mode.', 'kitgreen' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Off Slider autoplay', 'kitgreen' ),
					'param_name' => 'autoplay',
					'description' => __( 'Enables autoplay mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide pagination control', 'kitgreen' ),
					'param_name' => 'hide_pagination_control',
					'description' => __( 'If "YES" pagination control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),
				array(
					'type' => 'checkbox',
					'heading' => __( 'Hide prev/next buttons', 'kitgreen' ),
					'param_name' => 'hide_prev_next_buttons',
					'description' => __( 'If "YES" prev/next control will be removed', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),

                
				array(
					'type' => 'checkbox',
					'heading' => __( 'Off Slider loop', 'kitgreen' ),
					'param_name' => 'wrap',
					'description' => __( 'Off loop mode.', 'kitgreen' ),
					'value' => array( __( 'Yes, please', 'kitgreen' ) => 'yes' ),
					'group' => __( 'Carousel Settings', 'kitgreen' ),
					'dependency' => array(
						'element' => 'layout',
						'value' => array( 'carousel' ),
					),
				),
				// Data settings
				array(
					'type' => 'dropdown',
					'heading' => __( 'Order by', 'kitgreen' ),
					'param_name' => 'orderby',
					'value' => array(
						__( 'Date', 'kitgreen' ) => 'date',
						__( 'Order by post ID', 'kitgreen' ) => 'ID',
						__( 'Author', 'kitgreen' ) => 'author',
						__( 'Title', 'kitgreen' ) => 'title',
						__( 'Last modified date', 'kitgreen' ) => 'modified',
						__( 'Number of comments', 'kitgreen' ) => 'comment_count',
						__( 'Menu order/Page Order', 'kitgreen' ) => 'menu_order',
						__( 'Meta value', 'kitgreen' ) => 'meta_value',
						__( 'Meta value number', 'kitgreen' ) => 'meta_value_num',
						__( 'Matches same order you passed in via the include parameter.', 'kitgreen') => 'post__in',
						__( 'Random order', 'kitgreen' ) => 'rand',
						__( 'Price', 'kitgreen' ) => 'price',
					),
					'description' => __( 'Select order type. If "Meta value" or "Meta value Number" is chosen then meta key is required.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
						'value_not_equal_to' => array( 'custom' ),
					),
				),
				array(
					'type' => 'dropdown',
					'heading' => __( 'Sorting', 'kitgreen' ),
					'param_name' => 'order',
					'group' => __( 'Data Settings', 'kitgreen' ),
					'value' => array(
						__( 'Descending', 'kitgreen' ) => 'DESC',
						__( 'Ascending', 'kitgreen' ) => 'ASC',
					),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'description' => __( 'Select sorting order.', 'kitgreen' ),
					'dependency' => array(
						'element' => 'post_type',
						'value_not_equal_to' => array( 'ids', 'custom' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Meta key', 'kitgreen' ),
					'param_name' => 'meta_key',
					'description' => __( 'Input meta key for grid ordering.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'orderby',
						'value' => array( 'meta_value', 'meta_value_num' ),
					),
				),
				array(
					'type' => 'textfield',
					'heading' => __( 'Offset', 'kitgreen' ),
					'param_name' => 'offset',
					'description' => __( 'Number of grid elements to displace or pass over.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
						'value_not_equal_to' => array( 'ids', 'custom' ),
					),
				),
				array(
					'type' => 'autocomplete',
					'heading' => __( 'Exclude', 'kitgreen' ),
					'param_name' => 'exclude',
					'description' => __( 'Exclude posts, pages, etc. by title.', 'kitgreen' ),
					'group' => __( 'Data Settings', 'kitgreen' ),
					'settings' => array(
						'multiple' => true,
					),
					'param_holder_class' => 'vc_grid-data-type-not-ids',
					'dependency' => array(
						'element' => 'post_type',
						'value_not_equal_to' => array( 'ids', 'custom' ),
						'callback' => 'vc_grid_exclude_dependency_callback',
					),
				)
			)
		);
	}
}


if( ! function_exists( 'kitgreen_get_color_scheme_param' ) ) {
	function kitgreen_get_color_scheme_param() {
		return apply_filters( 'kitgreen_get_color_scheme_param', array(
			'type' => 'dropdown',
			'heading' => __( 'Content Position', 'kitgreen' ),
			'param_name' => 'kitgreen_color_scheme',
			'value' => array(
				__( 'Content Position Left', 'kitgreen' ) => 'left',
                __( 'Content Position Center', 'kitgreen' ) => 'center',
				__( 'Content Position Right', 'kitgreen' ) => 'right',
			),
		) );
	}
}


if( ! function_exists( 'kitgreen_get_user_panel_params' ) ) {
	function kitgreen_get_user_panel_params() {
		return apply_filters( 'kitgreen_get_user_panel_params', array(
			array(
				'type' => 'textfield',
				'heading' => __( 'Title', 'kitgreen' ),
				'param_name' => 'title',
			)
		));
	}
}

if( ! function_exists( 'kitgreen_get_author_area_params' ) ) {
	function kitgreen_get_author_area_params() {
		return apply_filters( 'kitgreen_get_author_area_params', array(
			array(
				'type' => 'textfield',
				'heading' => __( 'Title', 'kitgreen' ),
				'param_name' => 'title',
			),
			array(
				'type' => 'attach_image',
				'heading' => __( 'Image', 'kitgreen' ),
				'param_name' => 'image',
				'value' => '',
				'description' => __( 'Select image from media library.', 'kitgreen' )
			),
			array(
				'type' => 'textfield',
				'heading' => __( 'Image size', 'kitgreen' ),
				'param_name' => 'img_size',
				'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
			),
			array(
				'type' => 'textarea_html',
				'holder' => 'div',
				'heading' => __( 'Author bio', 'kitgreen' ),
				'param_name' => 'content',
				'description' => __( 'Add here few words to your author info.', 'kitgreen' )
			),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Text alignment', 'kitgreen' ),
				'param_name' => 'alignment',
				'value' => array(
					__( 'Align left', 'kitgreen' ) => '',
					__( 'Align right', 'kitgreen' ) => 'right',
					__( 'Align center', 'kitgreen' ) => 'center'
				),
				'description' => __( 'Select image alignment.', 'kitgreen' )
			),
			array(
				'type' => 'href',
				'heading' => __( 'Author link', 'kitgreen'),
				'param_name' => 'link',
			),
			array(
				'type' => 'textfield',
				'heading' => __( 'Link text', 'kitgreen'),
				'param_name' => 'link_text',
			),
			kitgreen_get_color_scheme_param(),
			array(
				'type' => 'textfield',
				'heading' => __( 'Extra class name', 'kitgreen' ),
				'param_name' => 'el_class',
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
			)
		));
	}
}


if( ! function_exists( 'kitgreen_get_banner_params' ) ) {
	function kitgreen_get_banner_params() {
		return apply_filters( 'kitgreen_get_banner_params', array(
			array(
				'type' => 'attach_image',
				'heading' => __( 'Image', 'kitgreen' ),
				'param_name' => 'image',
				'value' => '',
				'description' => __( 'Select image from media library.', 'kitgreen' )
			),
			array(
				'type' => 'textfield',
				'heading' => __( 'Image size', 'kitgreen' ),
				'param_name' => 'img_size',
				'description' => __( 'Enter image size. Example: "thumbnail", "medium", "large", "full" or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size.', 'kitgreen' )
			),
			array(
				'type' => 'href',
				'heading' => __( 'Banner link', 'kitgreen'),
				'param_name' => 'link',
				'description' => __( 'Enter URL if you want this banner to have a link.', 'kitgreen' )
			),
			array(
				'type' => 'textarea_html',
				'holder' => 'div',
				'heading' => __( 'Banner content', 'kitgreen' ),
				'param_name' => 'content',
				'description' => __( 'Add here few words to your banner image.', 'kitgreen' )
			),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Text alignment', 'kitgreen' ),
				'param_name' => 'alignment',
				'value' => array(
					__( 'Align left', 'kitgreen' ) => '',
					__( 'Align right', 'kitgreen' ) => 'right',
					__( 'Align center', 'kitgreen' ) => 'center'
				),
				'description' => __( 'Select image alignment.', 'kitgreen' )
			),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Content vertical alignment', 'kitgreen' ),
				'param_name' => 'vertical_alignment',
				'value' => array(
					__( 'Top', 'kitgreen' ) => '',
					__( 'Middle', 'kitgreen' ) => 'middle',
					__( 'Bottom', 'kitgreen' ) => 'bottom'
				)
			),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Hover effect', 'kitgreen' ),
				'param_name' => 'hover',
				'value' => array(
					__( 'Default', 'kitgreen' ) => '',
					__( 'Zoom image', 'kitgreen' ) => '1',
					__( 'Bordered', 'kitgreen' ) => '2',
					__( 'Content animation', 'kitgreen' ) => '3',
					__( 'Translate and scale', 'kitgreen' ) => '4',
				),
				'description' => __( 'Set beautiful hover effects for your banner.', 'kitgreen' )
			),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Content style', 'kitgreen' ),
				'param_name' => 'style',
				'value' => array(
					__( 'Default', 'kitgreen' ) => '',
					__( 'Color mask', 'kitgreen' ) => '2',
					__( 'Mask with border', 'kitgreen' ) => '3',
					__( 'Content with line background', 'kitgreen' ) => '1',
					__( 'Content with rectangular background', 'kitgreen' ) => '5',
					//__( 'Style 4', 'kitgreen' ) => '4',
					//__( 'Style 5', 'kitgreen' ) => '5',
				),
				'description' => __( 'You can use some of our predefined styles for your banner content.', 'kitgreen' )
			),
			kitgreen_get_color_scheme_param(),
			array(
				'type' => 'textfield',
				'heading' => __( 'Extra class name', 'kitgreen' ),
				'param_name' => 'el_class',
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'kitgreen' )
			),
            array(
                'type' => 'animation_style',
                'heading' => __( 'Animation Style', 'kitgreen' ),
                'param_name' => 'animation',
                'description' => __( 'Choose your animation style', 'kitgreen' ),
                'admin_label' => false,
                'weight' => 0,
                )
		));
	}
}

if( ! function_exists( 'kitgreen_get_instagram_params' ) ) {
	function kitgreen_get_instagram_params() {
		return apply_filters( 'kitgreen_get_instagram_params', array(
			array(
					'type' => 'dropdown',
					'heading' => __( 'Design', 'kitgreen' ),
					'param_name' => 'design',
					'value' => array(
						__( 'Default', 'kitgreen' ) => 'default',
						__( 'Slider', 'kitgreen' ) => 'slider',
					),
				),
			array(
				'type' => 'textfield',
				'heading' => __( 'Username', 'kitgreen' ),
				'param_name' => 'username',
			),
			array(
				'type' => 'textfield',
				'heading' => __( 'Number of photos', 'kitgreen' ),
				'param_name' => 'number',
			),
            array(
					'type' => 'dropdown',
					'heading' => __( 'Slides per view', 'kitgreen' ),
					'param_name' => 'slides_per_view',
					'value' => array(
						1,2,3,4,5,6,7,8
					),
                    'dependency' => array(
						'element' => 'design',
						'value' => array( 'slider' ),
					),
					'description' => __( 'Set numbers of slides you want to display at the same time on slider\'s container for carousel mode. Also supports for "auto" value, in this case it will fit slides depending on container\'s width. "auto" mode doesn\'t compatible with loop mode.', 'kitgreen' )
				),
			array(
				'type' => 'dropdown',
				'heading' => __( 'Photo size', 'kitgreen' ),
				'param_name' => 'size',
				'value' => array(
					__( 'Thumbnail', 'kitgreen' ) => 'thumbnail',
    	           __( 'Medium', 'kitgreen' ) => 'medium',
					__( 'Large', 'kitgreen' ) => 'large',
				),
			),
		));
	}
}

// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_testimonials extends WPBakeryShortCodesContainer {
 
    }
}
 
// Replace Wbc_Inner_Item with your base name from mapping for nested element
if(class_exists('WPBakeryShortCode')){
    class WPBakeryShortCode_testimonial extends WPBakeryShortCode {
 
    }
}

if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_banners_carousel extends WPBakeryShortCodesContainer {
 
    }
}

// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_pricing_tables extends WPBakeryShortCodesContainer {
 
    }
}
 
// Replace Wbc_Inner_Item with your base name from mapping for nested element
if(class_exists('WPBakeryShortCode')){
    class WPBakeryShortCode_pricing_plan extends WPBakeryShortCode {
 
    }
}

// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_products_tabs extends WPBakeryShortCodesContainer {
 
    }
}
 
// Replace Wbc_Inner_Item with your base name from mapping for nested element
if(class_exists('WPBakeryShortCode')){
    class WPBakeryShortCode_products_tab extends WPBakeryShortCode {
 
    }
}

// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_kitgreen_carousel extends WPBakeryShortCodesContainer {}
}
 
// Replace Wbc_Inner_Item with your base name from mapping for nested element
if(class_exists('WPBakeryShortCode')){
    class WPBakeryShortCode_kitgreen_carousel_item extends WPBakeryShortCode {}
}


// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
if(class_exists('WPBakeryShortCodesContainer')){
    class WPBakeryShortCode_kitgreen_google_map extends WPBakeryShortCodesContainer {
 
    }
}

// A must for container functionality, replace Wbc_Item with your base name from mapping for parent container
        if(class_exists('WPBakeryShortCodesContainer')){
            class WPBakeryShortCode_kitchen_tabs extends WPBakeryShortCodesContainer {
         
            }
        }
         
        // Replace Wbc_Inner_Item with your base name from mapping for nested element
        if(class_exists('WPBakeryShortCode')){
            class WPBakeryShortCode_kitchen_tab extends WPBakeryShortCode {
         
            }
        }