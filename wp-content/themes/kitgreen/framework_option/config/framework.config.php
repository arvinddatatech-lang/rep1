<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access pages directly.
// ===============================================================================================
// -----------------------------------------------------------------------------------------------
// FRAMEWORK SETTINGS
// -----------------------------------------------------------------------------------------------
// ===============================================================================================
$settings = array(
	'menu_title'     => esc_html__( 'Theme Options', 'kitgreen' ),
	'menu_parent'    => 'jws',
	'menu_type'      => 'menu',
	'menu_slug'      => 'jws-theme-options',
	'show_reset_all' => true,
	'ajax_save'      => true
);



// ===============================================================================================
// -----------------------------------------------------------------------------------------------
// FRAMEWORK OPTIONS
// -----------------------------------------------------------------------------------------------
// ===============================================================================================
$options = array();

// ----------------------------------------
// a option section for options layout    -
// ----------------------------------------
$options[] = array(
	'name'  => 'layout',
	'title' => esc_html__( 'General Layout', 'kitgreen' ),
	'icon'  => 'fa fa-cog',
	'fields' => array(

            array(
        	'id'      => 'golobal-enable-page-title',
        	'type'    => 'switcher',
        	'title'   => esc_html__( 'Enable Page Title', 'kitgreen' ),
        	'default' =>  true,
        	),
            array(
        	'id'         => 'golobal-enable-page-title-bg',
        	'type'       => 'background',
        	'title'      => esc_html__( 'Page Title Background', 'kitgreen' ),
            'dependency' => array( 'golobal-enable-page-title', '==', true ),
            'default'      => array(
                        'repeat'     => 'no-repeat',
                        'position'   => 'center center',
                        'attachment' => 'fixed',
                        'size'       => 'cover',
                        'color'      => '#f6f6f6',
                      ),
        	),
            array(
			'id'        => 'padding-top',
			'type'      => 'text',
			'title'     => esc_html__( 'Padding Top', 'kitgreen' ),
            'dependency' => array( 'golobal-enable-page-title', '==', true ),
            'default' => '58px',
		    ),
            array(
			'id'        => 'padding-bottom',
			'type'      => 'text',
			'title'     => esc_html__( 'Padding Bottom', 'kitgreen' ),
            'dependency' => array( 'golobal-enable-page-title', '==', true ),
            'default' => '50px',
		    ),
            array(
			'id'        => 'title-size',
			'type'      => 'text',
			'title'     => esc_html__( 'Font Size', 'kitgreen' ),
            'dependency' => array( 'golobal-enable-page-title', '==', true ),
            'default' => '30px',
		    ),
            array(
              'id'      => 'title-color',
              'type'    => 'color_picker',
              'title'   => 'Title Color',
              'default' => '#181818',
            ),  
		
	),
);


// ----------------------------------------
// a option section for options rr    -
// ----------------------------------------
$options[] = array(
	'name'  => 'header',
	'title' => esc_html__( 'Header', 'kitgreen' ),
	'icon'  => 'fa fa-header',
	'fields' => array(
		array(
			'id'    => 'header-layout',
			'type'  => 'image_select',
			'title' => esc_html__( 'Layout', 'kitgreen' ),
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
			'id'         => 'header-bg',
			'type'       => 'background',
			'title'      => esc_html__( 'Background', 'kitgreen' ),
			'dependency' => array( 'header-layout', 'any', 5 ),
		),
       array(
      'id'        => 'logo_st',
      'type'      => 'fieldset',
      'title'     => 'Logo Setting',
      'un_array'  => true,
      'fields'    => array(
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
			'id'        => 'favicon',
			'type'      => 'image',
			'title'     => esc_html__( 'Favicon Icon', 'kitgreen' ),
			'add_title' => esc_html__( 'Upload', 'kitgreen' ),
		),
		array(
			'id'      => 'logo-max-width',
			'type'    => 'text',
			'title'   => esc_html__( 'Logo Max Width', 'kitgreen' ),
			'default' => 200,
			'desc'    => esc_html__( 'Defined in pixels. Do not add the \'px\' unit.', 'kitgreen' ),
		),
        array(
			'id'      => 'logo-light-height',
			'type'    => 'text',
			'title'   => esc_html__( 'Logo Line Height', 'kitgreen' ),
			'default' => 95,
			'desc'    => esc_html__( 'Defined in pixels. Do not add the \'px\' unit.', 'kitgreen' ),
		),
      )),  
       array(
      'id'        => 'menu_right',
      'type'      => 'fieldset',
      'title'     => 'Menu Right',
      'un_array'  => true,
      'fields'    => array(   
        array(
			'id'      => 'right-header-light-height',
			'type'    => 'text',
			'title'   => esc_html__( 'Right Header Height', 'kitgreen' ),
			'default' => 100,
			'desc'    => esc_html__( 'Defined in pixels. Do not add the \'px\' unit.', 'kitgreen' ),
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
			'id'         => 'header-menu-right',
			'type'       => 'textarea',
			'title'      => esc_html__( 'Content Shortcode Right Menunu', 'kitgreen' ),
			'desc'       => esc_html__( 'HTML, shortcode is allowed', 'kitgreen' ),
			'dependency' => array( 'show_shortcode', '==', true ),
		),
        )),
        array(
        	'id'         => 'header_bg',
        	'type'       => 'background',
        	'title'      => esc_html__( 'Background Header Verticle', 'kitgreen' ),
            'default'      => array(
            'image'      => get_template_directory_uri() .'/assets/images/bg_header.jpg',
            'repeat'     => 'repeat-x',
            'position'   => 'center center',
            'attachment' => 'fixed',
            'size'       => 'cover',
            'color'      => '#ffffff',
          ),
       	),
          array(
      'id'        => 'header_top',
      'type'      => 'fieldset',
      'title'     => 'Header Top',
      'un_array'  => true,
      'fields'    => array(   
          array(
            	'id'      => 'show_top_bar',
            	'type'    => 'switcher',
            	'title'   => esc_html__( 'Enable Header Top', 'kitgreen' ),
            	'default' =>  true,
           	),
          array(
			'id'      => 'header_top_ct',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Header Top One', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
			'default' => '[vc_content id="33"]',
		  ),
          array(
			'id'      => 'header_top_ct2',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Header Top Two', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
			'default' => '[vc_content id="206"]',
		  ),
          array(
			'id'      => 'header_top_ct3',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Header Top Three', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
			'default' => '[vc_content id="289"]',
		  ), 
          array(
			'id'      => 'header_top_ct4',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Header Top Four', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
			'default' => '[vc_content id="404"]',
		  ), 
          array(
			'id'      => 'header_top_ct5',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Header Top Five', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
			'default' => '[vc_content id="476"]',
		  ),  
        )),
	),
);

// ----------------------------------------
// a option section for options footer    -
// ----------------------------------------
$options[] = array(
	'name'  => 'footer',
	'title' => esc_html__( 'Footer', 'kitgreen' ),
	'icon'  => 'fa fa-sitemap',
	'fields' => array(
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
			'id'      => 'blog_before_footer',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Before Footer', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>'
		  ),
 	    array(
			'id'      => 'footer-1',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Footer One', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
		),
        array(
			'id'      => 'footer-2',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Footer Two', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
		),
        array(
			'id'      => 'footer-3',
			'type'    => 'textarea',
			'title'   => esc_html__( 'Content Footer Three', 'kitgreen' ),
			'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
		),
        array(
        	'id'      => 'sticky_footer',
        	'type'    => 'switcher',
        	'title'   => esc_html__( 'Enable Sticky Footer', 'kitgreen' ),
        	'default' =>  false,
       	),
	),
);
// ----------------------------------------
// a option section for options typography-
// ----------------------------------------
$options[] = array(
	'name'  => 'typography',
	'title' => esc_html__( 'Typography', 'kitgreen' ),
	'icon'  => 'fa fa-font',
	'fields' => array(
       array(
      'id'        => 'font_family',
      'type'      => 'fieldset',
      'title'     => 'Font Family',
      'un_array'  => true,
      'fields'    => array(
		array(
			'id'        => 'body-font',
			'type'      => 'typography',
			'title'     => esc_html__( 'Body Font Family', 'kitgreen' ),
			'default'   => array(
				'family'  => 'Raleway',
				'font'    => 'google',
				'variant' => 'regular',
			),
		),
        array(
			'id'        => 'heading-font',
			'type'      => 'typography',
			'title'     => esc_html__( 'Heading Font Family', 'kitgreen' ),
			'default'   => array(
				'family'  => 'Raleway',
				'font'    => 'google',
				'variant' => '600',
			),
		),
        )),
      array(
      'id'        => 'font_size',
      'type'      => 'fieldset',
      'title'     => 'Font Size',
      'un_array'  => true,
      'fields'    => array(
		array(
			'id'      => 'body-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'Body', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => 14
		),
		array(
			'id'      => 'h1-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H1', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '48'
		),
		array(
			'id'      => 'h2-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H2', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '36'
		),
		array(
			'id'      => 'h3-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H3', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '24'
		),
		array(
			'id'      => 'h4-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H4', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '21'
		),
		array(
			'id'      => 'h5-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H5', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '18'
		),
		array(
			'id'      => 'h6-font-size',
			'type'    => 'number',
			'title'   => esc_html__( 'H6', 'kitgreen' ),
			'after'   => ' <i class="cs-text-muted">px</i>',
			'default' => '16'
		),
        )),
	),
);

// ------------------------------------------
// a option section for options color_scheme-
// ------------------------------------------
$options[] = array(
	'name'  => 'color_scheme',
	'title' => esc_html__( 'Color Scheme', 'kitgreen' ),
	'icon'  => 'fa fa-picture-o',
	'fields' => array(
       array(
      'id'        => 'ft_main_color',
      'type'      => 'fieldset',
      'title'     => 'Main Color',
      'un_array'  => true,
      'fields'    => array(
		array(
			'id'      => 'primary-color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Primary Color', 'kitgreen' ),
			'desc'    => esc_html__( 'Main Color Scheme', 'kitgreen' ),
			'default' => '#41ca56',
		),
        array(
			'id'      => 'primary-color-2',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Primary Color 2', 'kitgreen' ),
			'desc'    => esc_html__( 'Main Color Scheme 2', 'kitgreen' ),
			'default' => '#41ca56',
		),
      )), 
      array(
      'id'        => 'ft_section_color',
      'type'      => 'fieldset',
      'title'     => 'Section Color',
      'un_array'  => true,
      'fields'    => array(  
		array(
			'id'      => 'body-background-color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Body Background Color', 'kitgreen' ),
			'default' => '#ffffff',
		),
		array(
			'id'      => 'body-color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Body Color', 'kitgreen' ),
			'default' => '#606060',
		),
		array(
			'id'      => 'heading-color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Heading Color', 'kitgreen' ),
			'default' => '#181818',
		),
        array(
			'id'      => 'heading-color2',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Heading Color', 'kitgreen' ),
			'default' => '#4a4a4a',
		),
        )),
	   array(
      'id'        => 'ft_header_color',
      'type'      => 'fieldset',
      'title'     => 'Header Color',
      'un_array'  => true,
      'fields'    => array(  
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
     )), 
       array (
      'id'        => 'ft_menu_color',
      'type'      => 'fieldset',
      'title'     => 'Menu Color',
      'un_array'  => true,
      'fields'    => array(    
         array(
			'type'    => 'subheading',
			'content' => esc_html__( 'Top Menu Color', 'kitgreen' ),
		),
        array(
			'id'      => 'top_menu_color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Top Menu Color', 'kitgreen' ),
			'default' => '#606060',
		),
        array(
			'id'      => 'top_menu_hover_color',
			'type'    => 'color_picker',
			'title'   => esc_html__( 'Top Menu Hover Color', 'kitgreen' ),
			'default' => '#41ca56',
		),
 	    array(
			'type'    => 'subheading',
			'content' => esc_html__( 'Sub Menu Color', 'kitgreen' ),
		),
		array(
			'id'    => 'sub_menu_color',
			'type'  => 'color_picker',
			'title' => esc_html__( 'Sub Menu Color', 'kitgreen' ),
            'default' => '#606060',
		),
        )),
	),
);
// ----------------------------------------
// a option section for options woocommerce-
// ----------------------------------------
if ( class_exists( 'WooCommerce' ) ) {
	$attributes = array();
	$attributes_tax = wc_get_attribute_taxonomies();
	foreach ( $attributes_tax as $attribute ) {
		$attributes[ $attribute->attribute_name ] = $attribute->attribute_label;
	}
	$options[]  = array(
		'name'  => 'woocommerce',
		'title' => esc_html__( 'WooCommerce', 'kitgreen' ),
		'icon'  => 'fa fa-shopping-cart',
		'sections' => array(



			// Product Listing Setting
			array(
				'name'   => 'wc_list_setting',
				'title'  => esc_html__( 'Product Shop Setting', 'kitgreen' ),
				'icon'   => 'fa fa-minus',
				'fields' => array(
					array(
						'type'    => 'heading',
						'content' => esc_html__( 'Product Listing', 'kitgreen' ),
					),
                      array(
                      'id'        => 'woo_title_bar',
                      'type'      => 'fieldset',
                      'title'     => 'Title Bar',
                      'un_array'  => true,
                      'fields'    => array(
    	           array(
						'id'      => 'wc-enable-page-title',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Page Title', 'kitgreen' ),
						'default' =>  true,
					),
					array(
						'id'         => 'wc-pagehead-bg',
						'type'       => 'background',
						'title'      => esc_html__( 'Page Title Background', 'kitgreen' ),
						'dependency' => array( 'wc-enable-page-title', '==', true ),
					),
                    )),
					array(
                      'id'        => 'woo_layout',
                      'type'      => 'fieldset',
                      'title'     => 'Layout',
                      'un_array'  => true,
                      'fields'    => array(
					array(
						'id'    => 'wc-style',
						'type'  => 'image_select',
						'title' => esc_html__( 'Layout', 'kitgreen' ),
						'desc'  => esc_html__( 'Display product listing as grid or masonry or metro', 'kitgreen' ),
						'radio' => true,
						'options' => array(
							'grid'    => CS_URI . '/assets/images/layout/left-sidebar.jpg',
							'masonry' => CS_URI . '/assets/images/layout/masonry-2.jpg',
							'metro'   => CS_URI . '/assets/images/layout/masonry-1.jpg'
						),
						'default' => 'grid',
					),
                    array(
						'id'    => 'wc-layout',
						'type'  => 'image_select',
						'title' => esc_html__( 'Sidebar Or Non Sidebar', 'kitgreen' ),
						'radio' => true,
						'options' => array(
							'left-sidebar'  => CS_URI . '/assets/images/layout/left-sidebar.jpg',
							'no-sidebar'    => CS_URI . '/assets/images/layout/3-col.jpg',
							'right-sidebar' => CS_URI . '/assets/images/layout/right-sidebar.jpg',
						),
						'default' => 'no-sidebar'
					),
                    	array(
						'id'    => 'wc-column',
						'type'  =>'image_select',
						'title' => esc_html__( 'Number Column', 'kitgreen' ),
						'desc'  => esc_html__( 'Display number of product per row', 'kitgreen' ),
						'radio' => true,
						'options' => array(
							'6' => CS_URI . '/assets/images/layout/2-col.jpg',
							'4' => CS_URI . '/assets/images/layout/3-col.jpg',
							'3' => CS_URI . '/assets/images/layout/4-col.jpg',
                            '20' => CS_URI . '/assets/images/layout/5-col-wide.jpg',
							'2' => CS_URI . '/assets/images/layout/6-col-wide.jpg',
						),
						'default' => '4'
					),
                    array(
						'id'      => 'wc-layout-full',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Full-Width', 'kitgreen' ),
						'default' => false,
					),
                    )),
                    array(
                      'id'        => 'woo_orther',
                      'type'      => 'fieldset',
                      'title'     => 'Orther Setting',
                      'un_array'  => true,
                      'fields'    => array(
					array(
						'id'         => 'wc-pagination',
						'type'       => 'select',
						'title'      => esc_html__( 'Pagination Style', 'kitgreen' ),
						'options' => array(
							'number'   => esc_html__( 'Number', 'kitgreen' ),
							'loadmore' => esc_html__( 'Load More', 'kitgreen' ),
						),
						'default' => 'loadmore'
					),
                    array(
						'id'      => 'wc-action-columns',
						'type'    => 'switcher',
						'title'   => esc_html__( 'On / Off Filter Columns', 'kitgreen' ),
						'default' => false,
					),
					array(
                      'id'        => 'shop-column-filter',
                      'type'      => 'fieldset',
                      'title'     => 'Shop Columns Filter',
                      'dependency' => array( 'wc-action-columns', '==', true ),
                      'fields'    => array(
                       array(
						'id'      => 'wc-2',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Turn On 2 columns', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-action-columns', '==', true ),
					   ),
                       array(
						'id'      => 'wc-3',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Turn On 3 columns', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-action-columns', '==', true ),
					   ),
                       array(
						'id'      => 'wc-4',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Turn On 4 columns', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-action-columns', '==', true ),
					   ),
                       array(
						'id'      => 'wc-5',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Turn On 5 columns', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-action-columns', '==', true ),
					   ),
                       array(
						'id'      => 'wc-6',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Turn On 6 columns', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-action-columns', '==', true ),
					   ),
                    
                      ),
                    ),
                    array(
						'id'      => 'wc-action-filter',
						'type'    => 'switcher',
						'title'   => esc_html__( 'On / Off Filter Product', 'kitgreen' ),
						'default' => false,
					),
                     array(
						'id'         => 'wc-filter-topbar-columns',
						'type'       => 'select',
                        'options'        => array(
                            '1'          => '1 Columns',
                            '2'     => '2 Columns',
                            '3'         => '3 Columns',
                            '4'         => '4 Columns',
                            '5'         => '5 Columns',
                            '6'         => '6 Columns',
                          ),
						'title'      => esc_html__( 'Select Sidebar', 'kitgreen' ),
						'dependency' => array( 'wc-action-filter', '==', true ),
					),
					array(
						'id'      => 'wc-number-per-page',
						'type'    => 'number',
						'title'   => esc_html__( 'Per Page', 'kitgreen' ),
						'desc'    => esc_html__( 'How much items per page to show (-1 to show all products)', 'kitgreen' ),
						'default' => '12',
					),
					array(
						'id'         => 'wc-sidebar',
						'type'       => 'select',
                        'options'    => jws_get_sidebars(),
						'title'      => esc_html__( 'Select Sidebar', 'kitgreen' ),
						'dependency' => array( 'wc-layout_no-sidebar', '==', false ),
					),
                    array(
						'id'      => 'wc-flip-thumb',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Flip Product Thumbnail', 'kitgreen' ),
						'default' => false,
					),
					array(
						'id'      => 'wc-attr',
						'type'           => 'select',
						'title'   => esc_html__( 'Enable Products Attribute On Product List', 'kitgreen' ),
						'options' => $attributes,
					),
                    )),
				)
			),
			// Product Detail Setting
			array(
				'name'   => 'wc_detail_setting',
				'title'  => esc_html__( 'Product Detail Setting', 'kitgreen' ),
				'icon'   => 'fa fa-minus',
				'fields' => array(
					array(
						'type'    => 'heading',
						'content' => esc_html__( 'Product Shop Detail Setting', 'kitgreen' ),
					),
                    array(
                      'id'        => 'woodt_title_bar',
                      'type'      => 'fieldset',
                      'title'     => 'Title Bar Setting',
                      'un_array'  => true,
                      'fields'    => array(
                     array(
						'id'      => 'wc-detail-enable-page-title',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Page Title', 'kitgreen' ),
						'default' =>  true,
					),
                    array(
						'id'         => 'wc-pagehead-single-bg',
						'type'       => 'background',
						'title'      => esc_html__( 'Page Title Background', 'kitgreen' ),
                        'dependency' => array( 'wc-detail-enable-page-title', '==', true ),
					),
                    )),
                    array(
                      'id'        => 'woodt_layout',
                      'type'      => 'fieldset',
                      'title'     => 'Layout Setting',
                      'un_array'  => true,
                      'fields'    => array(
					array(
						'id'      => 'wc-single-style',
						'type'    => 'image_select',
						'title'   => esc_html__( 'Product Detail Layout', 'kitgreen' ),
						'radio'   => true,
						'options' => array(
							'1' => CS_URI . '/assets/images/layout/thumbnail-bottom.jpg',
							'2' => CS_URI . '/assets/images/layout/layout-1.jpg',
							'3' => CS_URI . '/assets/images/layout/layout-2.jpg',
							'4' => CS_URI . '/assets/images/layout/layout-3.jpg',
						),
						'default' => '1'
					),
                    array(
						'id'      => 'wc-thumbnail-position',
						'type'    => 'image_select',
					       'title'      => esc_html__( 'Thumbnail Gallery Position', 'kitgreen' ),
                            'options' => array(
							'left'    => CS_URI . '/assets/images/layout/thumbnail-left.jpg',
							'bottom'  => CS_URI . '/assets/images/layout/thumbnail-bottom-right-sidebar.jpg',
							'right'   => CS_URI . '/assets/images/layout/thumbnail-right.jpg',
							'outside' => CS_URI . '/assets/images/layout/thumbnail-outside.jpg',
						),
						'default'    => 'left',
						'dependency' => array( 'wc-single-style_1', '==', true ),
					),
                    array(
						'id'      => 'wc-detail-full',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Full Width', 'kitgreen' ),
						'default' => false,
					),

                    )),
                     array(
                      'id'        => 'woodt_orther',
                      'type'      => 'fieldset',
                      'title'     => 'Orther Setting',
                      'un_array'  => true,
                      'fields'    => array(
						array(
						'id'      => 'enble-sidebar',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enble sidebar', 'kitgreen' ),
						'default' => false,
                        'dependency' => array( 'wc-single-style_1', '==', true ),
					),
					array(
						'type'    => 'subheading',
						'content' => esc_html__( 'Orther Setting', 'kitgreen' ),
					),
					array(
						'id'    => 'wc-single-size-guide',
						'title' => esc_html__( 'Size Guide Default', 'kitgreen' ),
						'type'  => 'upload',
					),
                    array(
						'id'    => 'wc-single-banner',
						'title' => esc_html__( 'Banner Product', 'kitgreen' ),
						'type'  => 'upload',
					),
                    array(
					'title' => esc_html__( 'Link Banner','kitgreen'),
					'id'    => 'wc-single-banner-link',
					'type'  => 'text',
					'info'  => sprintf( __( 'Add Link banner', 'kitgreen' ), esc_url( admin_url( 'admin.php?page=jws-theme-options' ) ) ),
				    ),
                    array(
						'id'    => 'wc-shortcode-title',
						'title' => esc_html__( 'Add Content title Product Related', 'kitgreen' ),
						'type'  => 'textarea',
						'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
                        'default' => 'RELATED PRODUCTS'
					),
                   )),	
				)
			),
		),
	);
}
// ----------------------------------------
// a option section for options portfolio-
// ----------------------------------------
	$options[]  = array(
		'name'  => 'portfolio',
		'title' => esc_html__( 'portfolio', 'kitgreen' ),
		'icon'  => 'fa fa-users',
		'sections' => array(

			// General Setting
			array(
				'name'   => 'pp_general_setting',
				'title'  => esc_html__( 'General Setting', 'kitgreen' ),
				'icon'   => 'fa fa-minus',
				'fields' => array(
					array(
						'type'    => 'heading',
						'content' => esc_html__( 'General Setting', 'kitgreen' ),
					),
					array(
						'id'      => 'pp-enable-page-title',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Page Title', 'kitgreen' ),
						'default' => true,
					),
					array(
						'id'         => 'pp-pagehead-bg',
						'type'       => 'background',
						'title'      => esc_html__( 'Page Title Background', 'kitgreen' ),
						'dependency' => array( 'pp-enable-page-title', '==', true ),
					),
				)
			),

			// Portfolio Listing Setting
			array(
				'name'   => 'pp_list_setting',
				'title'  => esc_html__( 'Archive Setting', 'kitgreen' ),
				'icon'   => 'fa fa-minus',
				'fields' => array(
					array(
						'type'    => 'heading',
						'content' => esc_html__( 'Archive Setting', 'kitgreen' ),
					),
					array(
						'id'      => 'pp-layout-full',
						'type'    => 'switcher',
						'title'   => esc_html__( 'Enable Full-Width', 'kitgreen' ),
						'default' => false,
					),
					array(
						'id'    => 'pp-column',
						'type'  =>'image_select',
						'title' => esc_html__( 'Number Of Column', 'kitgreen' ),
						'desc'  => esc_html__( 'Display number of portfolio per row', 'kitgreen' ),
						'radio' => true,
						'options' => array(
							'6' => CS_URI . '/assets/images/layout/2-col.jpg',
							'4' => CS_URI . '/assets/images/layout/3-col.jpg',
							'3' => CS_URI . '/assets/images/layout/4-col.jpg',
                            '20' => CS_URI . '/assets/images/layout/5-col-wide.jpg',
							'2' => CS_URI . '/assets/images/layout/6-col-wide.jpg',
						),
						'default' => '4'
					),
					array(
						'id'      => 'pp-number-per-page',
						'type'    => 'number',
						'title'   => esc_html__( 'Per Page', 'kitgreen' ),
						'desc'    => esc_html__( 'How much items per page to show (-1 to show all Portfolio)', 'kitgreen' ),
						'default' => '12',
					),
				)
			),
 		 // Portfolio Listing Setting
			array(
				'name'   => 'pp_list_single_setting',
				'title'  => esc_html__( 'Single Setting', 'kitgreen' ),
				'icon'   => 'fa fa-minus',
				'fields' => array(
					array(
						'type'    => 'heading',
						'content' => esc_html__( 'Single Setting', 'kitgreen' ),
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
                      'id'        => 'booking-popup',
                      'type'      => 'textarea',
                      'title'     => 'Add shortcode for booking popup',
                      'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
                    ),
				)
			),
		),
	);

// ----------------------------------------
// a option section for options blog      -
// ----------------------------------------
$options[] = array(
	'name'  => 'blog',
	'title' => esc_html__( 'Blog Single', 'kitgreen' ),
	'icon'  => 'fa fa-file-text-o',
	'fields' => array(
        array(
        	'id'      => 'post-single-style',
        	'type'    => 'image_select',
        	'title'   => esc_html__( 'Post Detail Style', 'kitgreen' ),
        	'radio'   => true,
        	'options' => array(
        	'1' => CS_URI . '/assets/images/layout/left-sidebar.jpg',
        	'2' => CS_URI . '/assets/images/layout/3-col.jpg',
        	'3' => CS_URI . '/assets/images/layout/right-sidebar.jpg',
        	),
        	'default' => '2'
        	),
		array(
			'id'      => 'blog-thumbnail',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Thumbnail', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-title',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog title', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-meta',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Meta ', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-tag',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Tags ', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-social',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Social ', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-author',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Author ', 'kitgreen' ),
			'default' => true,
		),
        array(
			'id'      => 'blog-related',
			'type'    => 'switcher',
			'title'   => esc_html__( 'Enable Blog Post Related ', 'kitgreen' ),
			'default' => true,
		),
		array(
			'id'         => 'blog-sidebar',
			'type'       => 'select',
            'options'    => jws_get_sidebars(),
			'title'      => esc_html__( 'Select Sidebar', 'kitgreen' ),
		),
	),
);

// ----------------------------------------
// a option section for 404    -
// ----------------------------------------
$options[] = array(
	'name'  => '404',
	'title' => esc_html__( '404 Page', 'kitgreen' ),
	'icon'  => 'fa fa-times',
	'fields' => array(
       
				array(
                  'id'        => 'image_404',
                  'type'      => 'textarea',
                  'title'     => 'Add shortcode',
                  'add_title' => 'Add Short code for 404',
                  'default' => '[vc_content id="759"]',
                  'desc'    => esc_html__( 'Add Html Or Shortcode Here', 'kitgreen' ).'<p><a target="_blank" href="'.esc_url(  admin_url('/edit.php?post_type=visual_content') ).'">Link Content Shortcode</a></p>',
                ),
		
	),
);
// ------------------------------
// backup                       -
// ------------------------------
$options[]   = array(
	'name'     => 'backup_section',
	'title'    => 'Backup',
	'icon'     => 'fa fa-shield',
	'fields'   => array(
		array(
			'type'    => 'notice',
			'class'   => 'warning',
			'content' => esc_html__( 'You can save your current options. Download a Backup and Import.', 'kitgreen' ),
		),
		array(
			'type'    => 'backup',
		),
  	)
);
CSFramework::instance( $settings, $options );
