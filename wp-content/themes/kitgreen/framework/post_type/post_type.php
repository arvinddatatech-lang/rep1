<?php 
function register_blocks() {
		$labels = array(
			'name'                => _x( 'Visul Composer Content', 'Post Type General Name', 'kitgreen' ),
			'singular_name'       => _x( 'Visul Composer Content', 'Post Type Singular Name', 'kitgreen' ),
			'menu_name'           => __( 'Visul Composer Content', 'kitgreen' ),
			'parent_item_colon'   => __( 'Parent Item:', 'kitgreen' ),
			'all_items'           => __( 'All Items', 'kitgreen' ),
			'view_item'           => __( 'View Item', 'kitgreen' ),
			'add_new_item'        => __( 'Add New Item', 'kitgreen' ),
			'add_new'             => __( 'Add New', 'kitgreen' ),
			'edit_item'           => __( 'Edit Item', 'kitgreen' ),
			'update_item'         => __( 'Update Item', 'kitgreen' ),
			'search_items'        => __( 'Search Item', 'kitgreen' ),
			'not_found'           => __( 'Not found', 'kitgreen' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'kitgreen' ),
		);

		$args = array(
			'label'               => __( 'visual_content', 'kitgreen' ),
			'description'         => __( 'Visual content for custom HTML to place in your pages', 'kitgreen' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 29,
			'menu_icon'           => 'dashicons-schedule',
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'rewrite'             => false,
			'capability_type'     => 'page',
		);
        if(function_exists('custom_reg_post_type')) {
            custom_reg_post_type( 'visual_content', $args );
        }


	};
    function register_portfolio() {
		$labels = array(
			'name'                => _x( 'Portfolio', 'Post Type General Name', 'kitgreen' ),
			'singular_name'       => _x( 'Portfolio', 'Post Type Singular Name', 'kitgreen' ),
			'menu_name'           => __( 'Portfolio', 'kitgreen' ),
			'parent_item_colon'   => __( 'Parent Item:', 'kitgreen' ),
			'all_items'           => __( 'All Items', 'kitgreen' ),
			'view_item'           => __( 'View Item', 'kitgreen' ),
			'add_new_item'        => __( 'Add New Item', 'kitgreen' ),
			'add_new'             => __( 'Add New', 'kitgreen' ),
			'edit_item'           => __( 'Edit Item', 'kitgreen' ),
			'update_item'         => __( 'Update Item', 'kitgreen' ),
			'search_items'        => __( 'Search Item', 'kitgreen' ),
			'not_found'           => __( 'Not found', 'kitgreen' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'kitgreen' ),
		);

		$args = array(
			'label'               => __( 'portfolio', 'kitgreen' ),
		      'labels'              => $labels,
            'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail','page-attributes', 'post-formats', ),
            'taxonomies'          => array( 'portfolio_cat' ),
            'hierarchical'        => true,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_nav_menus'   => true,
            'show_in_admin_bar'   => true,
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-yes',
            'can_export'          => true,
            'has_archive'         => true,
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
		);
        if(function_exists('custom_reg_post_type')) {
		  custom_reg_post_type( 'portfolio', $args );
        }
		/**
		 * Create a taxonomy category for portfolio
		 *
		 * @uses  Inserts new taxonomy object into the list
		 * @uses  Adds query vars
		 *
		 * @param string  Name of taxonomy object
		 * @param array|string  Name of the object type for the taxonomy object.
		 * @param array|string  Taxonomy arguments
		 * @return null|WP_Error WP_Error if errors, otherwise null.
		 */
		
		$labels = array(
			'name'					=> _x( 'Portfolio Categories', 'Taxonomy plural name', 'kitgreen' ),
			'singular_name'			=> _x( 'Portfolio Category', 'Taxonomy singular name', 'kitgreen' ),
			'search_items'			=> __( 'Search Categories', 'kitgreen' ),
			'popular_items'			=> __( 'Popular Portfolio Categories', 'kitgreen' ),
			'all_items'				=> __( 'All Portfolio Categories', 'kitgreen' ),
			'parent_item'			=> __( 'Parent Category', 'kitgreen' ),
			'parent_item_colon'		=> __( 'Parent Category', 'kitgreen' ),
			'edit_item'				=> __( 'Edit Category', 'kitgreen' ),
			'update_item'			=> __( 'Update Category', 'kitgreen' ),
			'add_new_item'			=> __( 'Add New Category', 'kitgreen' ),
			'new_item_name'			=> __( 'New Category', 'kitgreen' ),
			'add_or_remove_items'	=> __( 'Add or remove Categories', 'kitgreen' ),
			'choose_from_most_used'	=> __( 'Choose from most used text-domain', 'kitgreen' ),
			'menu_name'				=> __( 'Category', 'kitgreen' ),
		);
	
		$args = array(
			'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array( 'slug' => 'portfolio_cat' ),
		);
        if(function_exists('custom_reg_taxonomy')) {
            custom_reg_taxonomy('portfolio_cat', array( 'portfolio' ), $args );
        }


	};
    // **********************************************************************// 
	// ! Register Custom Post Type for Team
	// **********************************************************************// 
     function register_team() {

		$labels = array(
			'name'                => _x( 'Team', 'Post Type General Name', 'kitgreen' ),
			'singular_name'       => _x( 'Team', 'Post Type Singular Name', 'kitgreen' ),
			'menu_name'           => __( 'Team', 'kitgreen' ),
			'parent_item_colon'   => __( 'Parent Item:', 'kitgreen' ),
			'all_items'           => __( 'All Items', 'kitgreen' ),
			'view_item'           => __( 'View Item', 'kitgreen' ),
			'add_new_item'        => __( 'Add New Item', 'kitgreen' ),
			'add_new'             => __( 'Add New', 'kitgreen' ),
			'edit_item'           => __( 'Edit Item', 'kitgreen' ),
			'update_item'         => __( 'Update Item', 'kitgreen' ),
			'search_items'        => __( 'Search Item', 'kitgreen' ),
			'not_found'           => __( 'Not found', 'kitgreen' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'kitgreen' ),
		);

		$args = array(
			'label'               => __( 'team', 'kitgreen' ),
		      'labels'              => $labels,
            'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail',  'page-attributes', 'post-formats', ),
            'taxonomies'          => array( 'team_cat' ),
            'hierarchical'        => true,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_nav_menus'   => true,
            'show_in_admin_bar'   => true,
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-admin-users',
            'can_export'          => true,
            'has_archive'         => true,
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
		);
        if(function_exists('custom_reg_post_type')) {
            	custom_reg_post_type( 'team', $args );

        }
	
		/**
		 * Create a taxonomy category for Team
		 *
		 * @uses  Inserts new taxonomy object into the list
		 * @uses  Adds query vars
		 *
		 * @param string  Name of taxonomy object
		 * @param array|string  Name of the object type for the taxonomy object.
		 * @param array|string  Taxonomy arguments
		 * @return null|WP_Error WP_Error if errors, otherwise null.
		 */
		
		$labels = array(
			'name'					=> _x( 'Team Categories', 'Taxonomy plural name', 'kitgreen' ),
			'singular_name'			=> _x( 'Team Category', 'Taxonomy singular name', 'kitgreen' ),
			'search_items'			=> __( 'Search Categories', 'kitgreen' ),
			'popular_items'			=> __( 'Popular Team Categories', 'kitgreen' ),
			'all_items'				=> __( 'All Team Categories', 'kitgreen' ),
			'parent_item'			=> __( 'Parent Category', 'kitgreen' ),
			'parent_item_colon'		=> __( 'Parent Category', 'kitgreen' ),
			'edit_item'				=> __( 'Edit Category', 'kitgreen' ),
			'update_item'			=> __( 'Update Category', 'kitgreen' ),
			'add_new_item'			=> __( 'Add New Category', 'kitgreen' ),
			'new_item_name'			=> __( 'New Category', 'kitgreen' ),
			'add_or_remove_items'	=> __( 'Add or remove Categories', 'kitgreen' ),
			'choose_from_most_used'	=> __( 'Choose from most used text-domain', 'kitgreen' ),
			'menu_name'				=> __( 'Category', 'kitgreen' ),
		);
	
		$args = array(
			'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array( 'slug' => 'team_cat' ),
		);
        if(function_exists('custom_reg_taxonomy')) {
		custom_reg_taxonomy( 'team_cat', array( 'team' ), $args );
        }

	};
    // **********************************************************************// 
	// ! Register Custom Post Type for Team
	// **********************************************************************// 
    function register_service() {

		$labels = array(
			'name'                => _x( 'Service', 'Post Type General Name', 'kitgreen' ),
			'singular_name'       => _x( 'Service', 'Post Type Singular Name', 'kitgreen' ),
			'menu_name'           => __( 'Service', 'kitgreen' ),
			'parent_item_colon'   => __( 'Parent Item:', 'kitgreen' ),
			'all_items'           => __( 'All Items', 'kitgreen' ),
			'view_item'           => __( 'View Item', 'kitgreen' ),
			'add_new_item'        => __( 'Add New Item', 'kitgreen' ),
			'add_new'             => __( 'Add New', 'kitgreen' ),
			'edit_item'           => __( 'Edit Item', 'kitgreen' ),
			'update_item'         => __( 'Update Item', 'kitgreen' ),
			'search_items'        => __( 'Search Item', 'kitgreen' ),
			'not_found'           => __( 'Not found', 'kitgreen' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'kitgreen' ),
		);

		$args = array(
			'label'               => __( 'service', 'kitgreen' ),
		     'labels'              => $labels,
            'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail',  'page-attributes', 'post-formats', ),
            'taxonomies'          => array( 'service_cat' ),
            'hierarchical'        => true,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_nav_menus'   => true,
            'show_in_admin_bar'   => true,
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-admin-multisite',
            'can_export'          => true,
            'has_archive'         => true,
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
		);
        if(function_exists('custom_reg_post_type')) {
		  custom_reg_post_type( 'service', $args );
        }
		/**
		 * Create a taxonomy category for Service
		 *
		 * @uses  Inserts new taxonomy object into the list
		 * @uses  Adds query vars
		 *
		 * @param string  Name of taxonomy object
		 * @param array|string  Name of the object type for the taxonomy object.
		 * @param array|string  Taxonomy arguments
		 * @return null|WP_Error WP_Error if errors, otherwise null.
		 */
		
		$labels = array(
			'name'					=> _x( 'Service Categories', 'Taxonomy plural name', 'kitgreen' ),
			'singular_name'			=> _x( 'Service Category', 'Taxonomy singular name', 'kitgreen' ),
			'search_items'			=> __( 'Search Categories', 'kitgreen' ),
			'popular_items'			=> __( 'Popular Service Categories', 'kitgreen' ),
			'all_items'				=> __( 'All Service Categories', 'kitgreen' ),
			'parent_item'			=> __( 'Parent Category', 'kitgreen' ),
			'parent_item_colon'		=> __( 'Parent Category', 'kitgreen' ),
			'edit_item'				=> __( 'Edit Category', 'kitgreen' ),
			'update_item'			=> __( 'Update Category', 'kitgreen' ),
			'add_new_item'			=> __( 'Add New Category', 'kitgreen' ),
			'new_item_name'			=> __( 'New Category', 'kitgreen' ),
			'add_or_remove_items'	=> __( 'Add or remove Categories', 'kitgreen' ),
			'choose_from_most_used'	=> __( 'Choose from most used text-domain', 'kitgreen' ),
			'menu_name'				=> __( 'Category', 'kitgreen' ),
		);
	
		$args = array(
			'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array( 'slug' => 'service_cat' ),
		);
        if(function_exists('custom_reg_taxonomy')) {
		custom_reg_taxonomy( 'service_cat', array( 'service' ), $args );
        }

	}
         function edit_heading_columns( $columns ) {
    
    		$columns = array(
    			'cb' => '<input type="checkbox" />',
    			'title' => __( 'Title', 'kitgreen' ),
    			'shortcode' => __( 'Shortcode', 'kitgreen' ),	   
    			'date' => __( 'Date', 'kitgreen' ),
    		);
    
    		return $columns;
    	}
        function create_shortcode_vc($column, $post_id) {
    		switch( $column ) {
    			case 'shortcode' :
    				echo '<strong>[vc_content id="'.$post_id.'"]</strong>';
    			break;
    		}	
    	}
        function edit_portfolio_columns( $columns ) {

		$columns = array(
			'cb' => '<input type="checkbox" />',
			'thumb' => '',
			'title' => __( 'Title', 'kitgreen' ),
			'portfolio_cat' => __( 'Categories', 'kitgreen' ),	   
			'date' => __( 'Date', 'kitgreen' ),
		);

		return $columns;
	   }
        function edit_team_columns( $columns ) {
    
    		$columns = array(
    			'cb' => '<input type="checkbox" />',
    			'thumb' => '',
    			'title' => __( 'Title', 'kitgreen' ),
    			'team_cat' => __( 'Categories', 'kitgreen' ),	   
    			'date' => __( 'Date', 'kitgreen' ),
    		);
    
    		return $columns;
    	}
        function edit_service_columns( $columns ) {
    
    		$columns = array(
    			'cb' => '<input type="checkbox" />',
    			'thumb' => '',
    			'title' => __( 'Title', 'kitgreen' ),
    			'service_cat' => __( 'Categories', 'kitgreen' ),	   
    			'date' => __( 'Date', 'kitgreen' ),
    		);
    
    		return $columns;
    	}
    	function manage_portfolio_columns($column, $post_id) {
    		switch( $column ) {
    			case 'thumb' :
    				if( has_post_thumbnail( $post_id ) ) {
    					the_post_thumbnail( array(60,60) );
    				}
    			break;
    			case 'portfolio_cat' :
    				$terms = get_the_terms( $post_id, 'portfolio_cat' );
    										
    				if ( $terms && ! is_wp_error( $terms ) ) : 
    
    					$cats_links = array();
    
    					foreach ( $terms as $term ) {
    						$cats_links[] = $term->name;
    					}
    										
    					$cats = join( ", ", $cats_links );
    				?>
    
    				<span><?php echo wp_kses_post($cats); ?></span>
    
    				<?php endif; 
    			break;
    		}	
    	}
         function manage_team_columns($column, $post_id) {
    		switch( $column ) {
    			case 'thumb' :
    				if( has_post_thumbnail( $post_id ) ) {
    					the_post_thumbnail( array(60,60) );
    				}
    			break;
    			case 'team_cat' :
    				$terms = get_the_terms( $post_id, 'team_cat' );
    										
    				if ( $terms && ! is_wp_error( $terms ) ) : 
    
    					$cats_links = array();
    
    					foreach ( $terms as $term ) {
    						$cats_links[] = $term->name;
    					}
    										
    					$cats = join( ", ", $cats_links );
    				?>
    
    				<span><?php echo wp_kses_post($cats); ?></span>
    
    				<?php endif; 
    			break;
    		}	
    	}
        function manage_service_columns($column, $post_id) {
    		switch( $column ) {
    			case 'thumb' :
    				if( has_post_thumbnail( $post_id ) ) {
    					the_post_thumbnail( array(60,60) );
    				}
    			break;
    			case 'service_cat' :
    				$terms = get_the_terms( $post_id, 'service_cat' );
    										
    				if ( $terms && ! is_wp_error( $terms ) ) : 
    
    					$cats_links = array();
    
    					foreach ( $terms as $term ) {
    						$cats_links[] = $term->name;
    					}
    										
    					$cats = join( ", ", $cats_links );
    				?>
    
    				<span><?php echo wp_kses_post($cats); ?></span>
    
    				<?php endif; 
    			break;
    		}	
    	}    
    	// Hook into the 'init' action
        add_action( 'init', 'register_blocks', 1 );
        
		// Add shortcode column to block list
		add_filter( 'manage_edit-visual_content_columns', 'edit_heading_columns') ;
		add_action( 'manage_visual_content_posts_custom_column', 'create_shortcode_vc', 10, 2 );


		add_filter( 'manage_edit-portfolio_columns', 'edit_portfolio_columns' ) ;
		add_action( 'manage_portfolio_posts_custom_column', 'manage_portfolio_columns', 10, 2 );
		add_action( 'init', 'register_portfolio', 1 );
        
        
        add_action( 'manage_team_posts_custom_column', 'manage_team_columns', 10, 2 );
        add_filter( 'manage_edit-team_columns', 'edit_team_columns' ) ;
        add_action( 'init', 'register_team', 1 );
        
        add_action( 'manage_service_posts_custom_column', 'manage_service_columns', 10, 2 );
        add_filter( 'manage_edit-service_columns', 'edit_service_columns' ) ;
        add_action( 'init', 'register_service', 1 );
?>