<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access pages directly.
// ===============================================================================================
// -----------------------------------------------------------------------------------------------
// METABOX OPTIONS
// -----------------------------------------------------------------------------------------------
// ===============================================================================================
$options = array();

if ( isset( $_GET['post'] ) && $_GET['post'] == get_option( 'page_for_posts' ) ) return;

// -----------------------------------------
// Page Metabox Options                    -
// -----------------------------------------
$options[] = array(
	'id'        => '_custom_page_options',
	'title'     => esc_html__( 'Page Layout Options','kitgreen'),
	'post_type' => 'page',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
                array(
        	   	   'name' => 'main-options',
                   'title'     => esc_html__( 'General Options', 'kitgreen' ),
        	   	   'fields' => array(
          	        array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Main Color', 'kitgreen' ),
            		),
                 	array(
            			'id'      => 'primary-color-cutom',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Primary Color', 'kitgreen' ),
            			'desc'    => esc_html__( 'Main Color Scheme', 'kitgreen' ),
            		),
                    array(
            			'id'      => 'primary-color-cutom2',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Primary Color 2', 'kitgreen' ),
            			'desc'    => esc_html__( 'Main Color Scheme 2', 'kitgreen' ),
            		),
                    array(
                    	'id'      => 'show_cart',
                    	'type'    => 'switcher',
                    	'title'   => esc_html__( 'Enable Mini Cart', 'kitgreen' ),
                    	'default' =>  true,
                   	),
                    array(
                    	'id'      => 'show_search',
                    	'type'    => 'switcher',
                    	'title'   => esc_html__( 'Enable Search', 'kitgreen' ),
                    	'default' =>  true,
                   	),
                    array(
                    	'id'      => 'show_shortcode',
                    	'type'    => 'switcher',
                    	'title'   => esc_html__( 'Enable Shortcode', 'kitgreen' ),
                    	'default' =>  false,
                   	),
                    array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Title Bar Cutom', 'kitgreen' ),
            		),
                    array(
                	'id'      => 'page_title',
                	'type'    => 'switcher',
                	'title'   => esc_html__( 'Enable Page Title', 'kitgreen' ),
                	'default' =>  false,
                	),
                     array(
                	'id'         => 'page_title_pg',
                	'type'       => 'background',
                	'title'      => esc_html__( 'Page Title Background', 'kitgreen' ),
                    'dependency' => array( 'page_title', '==', true ),
                    'default'      => array(
                        'repeat'     => 'no-repeat',
                        'position'   => 'center center',
                        'attachment' => 'fixed',
                        'size'       => 'cover',
                        'color'      => '#f6f6f6',
                      ),
	                ),
                  ), 
                ),
	           	array(
        			'name' => 'header-options',
                    'title'     => esc_html__( 'Header Options', 'kitgreen' ),
        			'fields' => array(
                    array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Header Setting', 'kitgreen' ),
            		),
                	array(
        			'id'    => 'header-layout',
        			'type'  => 'image_select',
        			'title' => esc_html__( 'Layout Header', 'kitgreen' ),
        			'radio' => true,
        			'options' => array(
	        		    '1' => CS_URI . '/assets/images/layout/header1.jpg',
        				'2' => CS_URI . '/assets/images/layout/header2.jpg',
                        '3' => CS_URI . '/assets/images/layout/header3.jpg',
                        '4' => CS_URI . '/assets/images/layout/header4.jpg',
                        '5' => CS_URI . '/assets/images/layout/header5.jpg',
        			),
        			'default'    => '1',
        			'attributes' => array(
        				'data-depend-id' => 'header-layout',
        			),
        		),
                array(
        			'id'    => 'header-background',
        			'type'  => 'color_picker',
        			'title' => esc_html__( 'Header Background Color', 'kitgreen' ),
                    'default' => '#ffffff',
        		),
                array(
            			'id'      => 'background_sticky_header',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Background Stiky Header', 'kitgreen' ),
            			'default' => '#ffffff',
        	       	),
                  ),
                ),
                array(
    			'name' => 'footer-options',
                'title'     => esc_html__( 'Footer Options', 'kitgreen' ),
    			'fields' => array(
                 array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Footer Setting', 'kitgreen' ),
            		),
                	array(
        			'id'    => 'footer-layout',
        			'type'  => 'image_select',
        			'title' => esc_html__( 'Layout Footer', 'kitgreen' ),
        			'radio' => true,
        			'options' => array(
        				'1' => CS_URI . '/assets/images/layout/footer3.jpg',
        				'2' => CS_URI . '/assets/images/layout/footer1.jpg',
                        '3' => CS_URI . '/assets/images/layout/footer2.jpg',
        			),
        			'default'    => '1',
        			'attributes' => array(
        				'data-depend-id' => 'footer-layout',
        			),
        		  ),
                    array(
                    	'id'      => 'sticky_footer',
                    	'type'    => 'switcher',
                    	'title'   => esc_html__( 'Enable Sticky Footer', 'kitgreen' ),
                    	'default' =>  false,
                   	),
                  ),
                 ),
                 array(
            			'name' => 'menu-options',
                        'title'     => esc_html__( 'Menu Options', 'kitgreen' ),
            			'fields' => array(
               	    array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Logo Color', 'kitgreen' ),
            		),
                    array(
            			'id'        => 'logo',
            			'type'      => 'image',
            			'title'     => esc_html__( 'Logo', 'kitgreen' ),
            			'add_title' => esc_html__( 'Upload', 'kitgreen' ),
            		),
                    array(
            			'id'        => 'logo_text',
            			'type'      => 'text',
            			'title'     => esc_html__( 'Logo Text', 'kitgreen' ),
            		),
            		array(
            			'id'      => 'logo_color',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Logo Color 1', 'kitgreen' ),
            			'desc'    => esc_html__( 'Color 1', 'kitgreen' ),
            			'default' => '#43cea2',
            		),
             	    array(
            			'id'      => 'logo_color2',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Logo Color 1', 'kitgreen' ),
            			'desc'    => esc_html__( 'Color 2', 'kitgreen' ),
            			'default' => '#185b9d',
            		),
                     array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Top Menu Color', 'kitgreen' ),
            		),
                    array(
            			'id'      => 'top_menu_color',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Top Menu Color', 'kitgreen' ),
            		),
                     array(
            			'id'      => 'top_menu_hover_color',
            			'type'    => 'color_picker',
            			'title'   => esc_html__( 'Top Menu Hover Color', 'kitgreen' ),
            		),
             	    array(
            			'type'    => 'subheading',
            			'content' => esc_html__( 'Sub Menu Color', 'kitgreen' ),
            		),
            		array(
            			'id'    => 'sub_menu_color',
            			'type'  => 'color_picker',
            			'title' => esc_html__( 'Sub Menu Color', 'kitgreen' ),
            		),
                  ),
                ),    
			),
		);

// -----------------------------------------
// Product Metabox Options                    -
// -----------------------------------------
$attributes = array();
	if ( function_exists( 'wc_get_attribute_taxonomies' ) ) {
	$attributes_tax = wc_get_attribute_taxonomies();
	foreach ( $attributes_tax as $attribute ) {
	$attributes[ $attribute->attribute_name ] = $attribute->attribute_label;	
	}
}	
$options[] = array(
	'id'        => '_custom_wc_options',
	'title'     => esc_html__( 'Product Detail Layout Options', 'kitgreen'),
	'post_type' => 'product',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
		array(
			'name'  => 's2',
			'fields' => array(
				array(
					'id'    => 'wc-single-style',
					'type'  => 'image_select',
					'title' => esc_html__( 'Product Detail Style', 'kitgreen' ),
					'options' => array(
						    '1' => CS_URI . '/assets/images/layout/thumbnail-bottom.jpg',
							'2' => CS_URI . '/assets/images/layout/layout-1.jpg',
							'3' => CS_URI . '/assets/images/layout/layout-2.jpg',
							'4' => CS_URI . '/assets/images/layout/layout-3.jpg',
					),
                    'default'    => '1',
				),
				array(
					   'id'      => 'wc-thumbnail-position',
						'type'    => 'image_select',
					       'title'      => esc_html__( 'Thumbnail Position', 'kitgreen' ),
                            'options' => array(
                            'left'    => CS_URI . '/assets/images/layout/thumbnail-left.jpg',
							'bottom'  => CS_URI . '/assets/images/layout/thumbnail-bottom-right-sidebar.jpg',
							'right'   => CS_URI . '/assets/images/layout/thumbnail-right.jpg',
							'outside' => CS_URI . '/assets/images/layout/thumbnail-outside.jpg',
						),
						'default'    => 'bottom',
						'dependency' => array( 'wc-single-style_1', '==', true ),
				),
				array(
					'id'         => 'wc-single-video-url',
					'type'       => 'text',
					'title'      => esc_html__( 'Video Thumbnail Link', 'kitgreen' ),
				),
				array(
					'title' => esc_html__( 'Size Guide Image','kitgreen'),
					'id'    => 'wc-single-size-guide',
					'type'  => 'upload',
				),
                array(
					'title' => esc_html__( 'Banner Product','kitgreen'),
					'id'    => 'wc-single-banner',
					'type'  => 'upload',
				),
                array(
					'title' => esc_html__( 'Link Banner','kitgreen'),
					'id'    => 'wc-single-banner-link',
					'type'  => 'text',
				),
                array(
                  'id'          => 'gallery_2',
                  'type'        => 'gallery',
                  'title'       => 'Image 360',
                  'add_title'   => 'Add Images',
                  'edit_title'  => 'Edit Images',
                  'clear_title' => 'Remove Images',
                ),
                array(
					'id'         => 'wc-count-down',
					'type'       => 'text',
					'title'      => esc_html__( 'Add time count down for product  example: 2018/12/12 ', 'kitgreen' ),
				),
                array(
						'id'      => 'wc-attr',
						'type'    => 'checkbox',
						'title'   => esc_html__( 'Enable Products Attribute On Product List', 'kitgreen' ),
						'options' => $attributes,
				),	
			),
		),
	),
);
// -----------------------------------------
// Product Metabox Options                    -
// -----------------------------------------
$options[] = array(
	'id'        => '_custom_post_options',
	'title'     => esc_html__( 'Post Detail Layout Options', 'kitgreen'),
	'post_type' => 'post',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
		array(
			'name'  => 's2',
			'fields' => array(
				array(
					'id'    => 'post-single-style',
					'type'  => 'image_select',
					'title' => esc_html__( 'Post Detail Style', 'kitgreen' ),
					'info'  => sprintf( __( 'Change layout for only this post. You can setup global for all post page layout', 'kitgreen' ), esc_url( admin_url( 'admin.php?page=jws-theme-options' ) ) ),
					'options' => array(
						'1' => CS_URI . '/assets/images/layout/left-sidebar.jpg',
                    	'2' => CS_URI . '/assets/images/layout/3-col.jpg',
                    	'3' => CS_URI . '/assets/images/layout/right-sidebar.jpg',
					),
				),
			),
		),
	),
);
// -----------------------------------------
// Portfolio Metabox Options                    -
// -----------------------------------------
$options[] = array(
	'id'        => '_custom_pp_options',
	'title'     => esc_html__( 'Portfolio Detail Layout Options', 'kitgreen'),
	'post_type' => 'portfolio',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
		array(
			'name'  => 's2',
			'fields' => array(    
              array(
                  'id'       => 'column_metro',
                  'type'     => 'select',
                  'title'    => 'Column Metro',
                  'options'  => array(
                    '1'  => '1 Columns',
                    '2'   => '2 Columns',
                    '3' => '3 Columns',
                    '4' => '4 Columns',
                    '5' => '5 Columns',
                    '6' => '6 Columns',
                  ),
                  'default'  => '4',
              ),
              array(
					'title' => esc_html__( 'Height Metro','kitgreen'),
					'id'    => 'pp_height',
					'type'  => 'text',
                    'default' => '300px',
				),
   	         array(
					'type'    => 'heading',
					'content' => esc_html__( 'Single Layout', 'kitgreen' ),
					),    
    	     array(
						'id'    => 'pp-single-style',
						'type'  => 'image_select',
						'title' => esc_html__( 'Style', 'kitgreen' ),
						'radio' => true,
						'options' => array(
							'layout1'    => CS_URI . '/assets/images/layout/Lb-big-image.jpg',
							'layout2' => CS_URI . '/assets/images/layout/Lb-small-image.jpg',
						),
						'default' => 'layout1',
				),
                array(
    					'title' => esc_html__( 'Text Booking','kitgreen'),
    					'id'    => 'pp_booking',
    					'type'  => 'text',
                        'default' => 'Book Now',
    			 ),
               array(
                  'id'       => 'action-btn',
                  'type'     => 'select',
                  'title'    => 'Choose booking popup or new link',
                  'options'  => array(
                    '1'  => 'Popup',
                    '2'   => 'New Link',
                  ),
                  'default'  => '1',
              ),
                 array(
    					'title' => esc_html__( 'Link Booking','kitgreen'),
    					'id'    => 'pp_link_booking',
    					'type'  => 'text',
                        'default' => '#',
                        'dependency'   => array( 'action-btn', 'any', '2' ),
    			 ),
                 array(
						'type'    => 'heading',
						'content' => esc_html__( 'Filter Design For Layout One', 'kitgreen' ),
                        'dependency' => array( 'pp-single-style_layout1', '==', true ),
				), 
                 array(
					'title' => esc_html__( 'Layout','kitgreen'),
					'id'    => 'pp_layout',
					'type'  => 'text',
                    'default' => '3 Unit Shape',
                    'dependency' => array( 'pp-single-style_layout1', '==', true ),
    			 ),   
                  array(
    					'title' => esc_html__( 'Design Code','kitgreen'),
    					'id'    => 'pp_code',
    					'type'  => 'text',
                        'default' => '1150',
                        'dependency' => array( 'pp-single-style_layout1', '==', true ),
    			 ), 
                  array(
    					'title' => esc_html__( 'Price','kitgreen'),
    					'id'    => 'pp_price',
    					'type'  => 'text',
                        'default' => '$10,000',
                        'dependency' => array( 'pp-single-style_layout1', '==', true ),
    			 ),
                  array(
    					'title' => esc_html__( 'Created','kitgreen'),
    					'id'    => 'pp_created',
    					'type'  => 'text',
                        'default' => 'Chris Roll, James Smith',
                        'dependency' => array( 'pp-single-style_layout1', '==', true ),
    			 ),
                 array(
    					'title' => esc_html__( 'Project Description','kitgreen'),
    					'id'    => 'pp_description',
    					'type'  => 'wysiwyg',
                        'settings' => array(
                        'textarea_rows' => 5,
                        'tinymce'       => true,
                        'media_buttons' => true,
                        
                      ),
                      'dependency' => array( 'pp-single-style_layout1', '==', true ),
    			 ),   
                 array(
						'type'    => 'heading',
						'content' => esc_html__( 'Filter Design', 'kitgreen' ),
                        'dependency' => array( 'pp-single-style_layout2', '==', true ),
				), 
                 array(
                    'id'    => 'currency',
                    'type'  => 'text',
                    'title' => 'Currency',
                    'default'=> '$',
                    'dependency' => array( 'pp-single-style_layout2', '==', true ),
                 ),
                 
                 array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Color', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ), 
                          array(
				            'id'      => 'enble-color',
				            'type'    => 'switcher',
				            'title'   => esc_html__( 'Enble Color', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                  'id'    => 'label1',
                                  'type'  => 'text',
                                  'title' => 'Label In Tab',
                                  'default' => 'Color',
                                  'dependency' => array( 'enble-color', '==', true ),
                                ),
                          array(
                              'id'              => 'filter1',
                              'type'            => 'group',
                              'title'           => 'Color',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-color', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name1',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                array(
                                  'id'    => 'item1',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value1',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price1',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                array(
                                  'id'    => 'upload1',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ), 
                 
                 
                        array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Cabinet', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ),
                          array(
				            'id'      => 'enble-cabinet',
				            'type'    => 'switcher',
				            'title'   => esc_html__( 'Enble Cabinet', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                'id'    => 'label2',
                                'type'  => 'text',
                                'default' => 'Cabinet',
                                'title' => 'Label In Tab',
                                'dependency' => array( 'enble-cabinet', '==', true ),
                                ),
                          array(
                              'id'              => 'filter2',
                              'type'            => 'group',
                              'title'           => 'Cabinet',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-cabinet', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name2',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                array(
                                  'id'    => 'item2',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value2',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price2',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                array(
                                  'id'    => 'upload2',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ),
                    
                    
                    
                    array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Layout', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ),
                          array(
				            'id'      => 'enble-layout',
				            'type'    => 'switcher',
                            'default' => 'Layout',
				            'title'   => esc_html__( 'Enble Layout', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                'id'    => 'label3',
                                'type'  => 'text',
                                'title' => 'Label In Tab',
                                'dependency' => array( 'enble-layout', '==', true ),
                                ),
                          array(
                              'id'              => 'filter3',
                              'type'            => 'group',
                              'title'           => 'Layout',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-layout', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name3',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                 array(
                                  'id'    => 'item3',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value3',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price3',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                 array(
                                  'id'    => 'upload3',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ),
                    array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Worktop', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ),
                          array(
				            'id'      => 'enble-worktop',
				            'type'    => 'switcher',
				            'title'   => esc_html__( 'Enble Worktop', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                'id'    => 'label4',
                                'type'  => 'text',
                                'default' => 'Worktop',
                                'title' => 'Label In Tab',
                                'dependency' => array( 'enble-worktop', '==', true ),
                                ),
                          array(
                              'id'              => 'filter4',
                              'type'            => 'group',
                              'title'           => 'Worktop',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-worktop', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name4',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                 array(
                                  'id'    => 'item4',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value4',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price4',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                 array(
                                  'id'    => 'upload4',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ),
     
                       array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Appliance', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ),
                          array(
				            'id'      => 'enble-appliance',
				            'type'    => 'switcher',
				            'title'   => esc_html__( 'Enble Appliance', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                'id'    => 'label5',
                                'type'  => 'text',
                                'default' => 'Appliance',
                                'title' => 'Label In Tab',
                                'dependency' => array( 'enble-appliance', '==', true ),
                                ),
                          array(
                              'id'              => 'filter5',
                              'type'            => 'group',
                              'title'           => 'Appliance',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-appliance', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name5',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                 array(
                                  'id'    => 'item5',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value5',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price5',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                 array(
                                  'id'    => 'upload5',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ),
                      
                      
                           array(
    						'type'    => 'heading',
    						'content' => esc_html__( 'Installation', 'kitgreen' ),
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
				        ),
                          array(
				            'id'      => 'enble-installation',
				            'type'    => 'switcher',
				            'title'   => esc_html__( 'Enble Installation', 'kitgreen' ),
				            'default' => false,
                            'dependency' => array( 'pp-single-style_layout2', '==', true ),
			                 ),
                          array(
                                'id'    => 'label6',
                                'type'  => 'text',
                                'default' => 'Installation',
                                'title' => 'Label In Tab',
                                'dependency' => array( 'enble-installation', '==', true ),
                                ),
                          array(
                              'id'              => 'filter6',
                              'type'            => 'group',
                              'title'           => 'Installation',
                              'button_title'    => 'Add New',
                              'accordion_title' => 'Add New Field',
                              'dependency' => array( 'enble-installation', '==', true ),
                              'fields'          => array(
                                array(
                                  'id'    => 'name6',
                                  'type'  => 'text',
                                  'title' => 'Name',
                                ),
                                 array(
                                  'id'    => 'item6',
                                  'type'  => 'upload',
                                  'title' => 'Label Filter With Background',
                                ),
                                array(
                                  'id'    => 'value6',
                                  'type'  => 'text',
                                  'title' => 'Label Filter With Text',
                                ),
                                array(
                                  'id'    => 'price6',
                                  'type'  => 'text',
                                  'title' => 'Price',
                                ),
                                 array(
                                  'id'    => 'upload6',
                                  'type'  => 'upload',
                                  'title' => 'Imager Filter Background',
                                ),
                              ),
                            ),      
                       
			),
		),
	),
);
// -----------------------------------------
// Service Metabox Options                    -
// -----------------------------------------
$options[] = array(
	'id'        => '_custom_service_options',
	'title'     => esc_html__( 'Service Detail Layout Options', 'kitgreen'),
	'post_type' => 'service',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
		array(
			'name'  => 's2',
			'fields' => array(    

                array(
            			'id'        => 'icon_service',
            			'type'      => 'image',
            			'title'     => esc_html__( 'Icon Service', 'kitgreen' ),
            			'add_title' => esc_html__( 'Upload', 'kitgreen' ),
            		),
                array(
					'title' => esc_html__( 'Service Descriptions','kitgreen'),
					'id'    => 'service_description',
					'type'  => 'wysiwyg',
                    'settings' => array(
                    'textarea_rows' => 5,
                    'tinymce'       => true,
                    'media_buttons' => true,
                  )
			 ),

       
			),
		),
	),
);
// -----------------------------------------
// Team Metabox Options                    -
// -----------------------------------------
$options[] = array(
	'id'        => '_custom_team_options',
	'title'     => esc_html__( 'Team Options', 'kitgreen'),
	'post_type' => 'team',
	'context'   => 'normal',
	'priority'  => 'high',
	'sections'  => array(
		array(
			'name'  => 's2',
			'fields' => array(    
             array(
					'title' => esc_html__( 'Team Position','kitgreen'),
					'id'    => 'team_position',
					'type'  => 'text',
			 ),   
             array(
					'title' => esc_html__( 'Team Infomation','kitgreen'),
					'id'    => 'team_description',
					'type'  => 'wysiwyg',
                    'settings' => array(
                    'textarea_rows' => 5,
                    'tinymce'       => true,
                    'media_buttons' => true,
                  )
			 ),
             array(
					'title' => esc_html__( 'Team Link Social Facebook','kitgreen'),
					'id'    => 'team_fa',
					'type'  => 'text',
			 ), 
             array(
					'title' => esc_html__( 'Team Link Social Twiter','kitgreen'),
					'id'    => 'team_tw',
					'type'  => 'text',
			 ),
             array(
					'title' => esc_html__( 'Team Link Social Email','kitgreen'),
					'id'    => 'team_em',
					'type'  => 'text',
			 ),      
			),
		),
	),
);
$options[] = array(
	'id'        => '_custom_wc_thumb_options',
	'title'     => esc_html__( 'Custom Size For Image Thumbnail', 'kitgreen'),
	'post_type' => array('portfolio' ),
	'context'   => 'side',
	'priority'  => 'default',
	'sections'  => array(
		array(
			'name'  => 's3',
			'fields' => array(
				array(
					'id'      => 'wc-thumbnail-size',
					'type'    => 'switcher',
					'title'   => esc_html__( 'Enable Big Image', 'kitgreen' ),
					'desc'    => esc_html__( 'Apply for Product Layout Metro And Portdolio Metro', 'kitgreen' ),
					'default' => false
				),
              	array(
                  'id'        => 'image_before',
                  'type'      => 'image',
                  'title'     => 'Image Before',
                  'add_title' => 'Add Image',
                ),
                array(
                  'id'        => 'image_after',
                  'type'      => 'image',
                  'title'     => 'Image After',
                  'add_title' => 'Add Image',
                ),
			),
           
		),
	),
    );


CSFramework_Metabox::instance( $options );
