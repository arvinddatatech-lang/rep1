<?php
/**
 * Class for all WooCommerce template modification
 *
 * @version 1.0
 */
class kitgreen_WooCommerce {
    
	/**
	 * Construction function
	 *
	 * @since  1.0
	 * @return kitgreen_WooCommerce
	 */
	function __construct() {
		if ( ! in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
			return;
            
		}
        // remove add to cart link
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' );

		// Remove product link
		remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );    
        add_action( 'woocommerce_after_shop_loop_item', array( $this, 'product_attribute' ), 4 );
        add_filter( 'kitgreen_after_single_product_image', array( $this, 'product_thumbnails' ) );
        // Add Shop Toolbar
		add_action( 'woocommerce_filter_product_ajax', array( $this, 'shop_toolbar' ), 20 );
        add_action( 'wp_ajax_jws_search_products', array( $this, 'instance_search_result' ) );
		add_action( 'wp_ajax_nopriv_jws_search_products', array( $this, 'instance_search_result' ) );
		// Add Shop Topbar
		add_action( 'woocommerce_filter_product_ajax', array( $this, 'shop_topbar' ), 25 );    
	}
	/**
	 * Hooks to WooCommerce actions, filters
	 *
	 * @since  1.0
	 * @return void
	 */

	/**
	 * Change variation text
	 *
	 * @since 1.0
	 */
	function variation_attribute_options( $args ) {
		$attribute = $args['attribute'];
		if ( function_exists( 'wc_attribute_label' ) && $attribute ) {
			$args['show_option_none'] = esc_html__( 'Select', 'kitgreen' ) . ' ' . wc_attribute_label( $attribute );
		}

		return $args;
	}
    /**
	 * Search products
	 *
	 * @since 1.0
	 */
	public function instance_search_result() {
		check_ajax_referer( 'myajax-next-nonce', 'nonce' );

		$args_sku = array(
			'post_type'      => 'product',
			'posts_per_page' => 30,
			'meta_query'     => array(
				array(
					'key'     => '_sku',
					'value'   => trim( $_POST['term'] ),
					'compare' => 'like',
				),
			),
		);

		$args_variation_sku = array(
			'post_type'      => 'product_variation',
			'posts_per_page' => 30,
			'meta_query'     => array(
				array(
					'key'     => '_sku',
					'value'   => trim( $_POST['term'] ),
					'compare' => 'like',
				),
			),
		);

		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => 30,
			's'              => trim( $_POST['term'] ),
		);

		if ( isset( $_POST['cat'] ) && $_POST['cat'] != '' ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'slug',
					'terms'    => $_POST['cat'],
				),
			);

			$args_sku['tax_query'] = array(
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'slug',
					'terms'    => $_POST['cat'],
				),
			);
		}

		$products_sku           = get_posts( $args_sku );
		$products_s             = get_posts( $args );
		$products_variation_sku = get_posts( $args_variation_sku );

		$response    = array();
		$products    = array_merge( $products_sku, $products_s, $products_variation_sku );
		$product_ids = array();
		foreach ( $products as $product ) {
			$id = $product->ID;
            
			if ( ! in_array( $id, $product_ids ) ) {
				$product_ids[] = $id;

				$productw   = new WC_Product( $id );
				$response[] = sprintf(
					'<li>' .
					'<a class="search-item" href="%s">' .
					'%s' .
					'<span class="title">%s</span>' .
                    '<span class="price">%s</span>' .
					'</a>' .
					'</li>',
					esc_url( $productw->get_permalink() ),
					$productw->get_image( 'size-270x340' ),
					$productw->get_title(),$productw->get_price_html()
				);
			}
		}


		if ( empty( $response ) ) {
			$response[] = sprintf( '<li>%s</li>', esc_html__( 'Nothing found', 'kitgreen' ) );
		}

		$output = sprintf( '<ul>%s</ul>', implode( ' ', $response ) );

		wp_send_json_success( $output );
		die();
	}
	/**
	 * Display product attribute
	 *
	 * @since 1.0
	 */
	function product_attribute() {
				$attrs = cs_get_option( 'wc-attr' );
			
                
		$default_attribute = 'pa_'.$attrs.'';

		if ( $default_attribute == '' || $default_attribute == 'none' ) {
			return;
		}

		global $product;
		$attributes         = maybe_unserialize( get_post_meta( $product->get_id(), '_product_attributes', true ) );
		$product_attributes = maybe_unserialize( get_post_meta( $product->get_id(), 'attributes_extra', true ) );

		if ( $product_attributes == 'none' ) {
			return;
		}

		if ( $product_attributes == '' ) {
			$product_attributes = $default_attribute;
		}

		$variations = $this->get_variations( $product_attributes );


		if ( ! $attributes ) {
			return;
		}

		foreach ( $attributes as $attribute ) {


			if ( $product->get_type() == 'variable' ) {
				if ( ! $attribute['is_variation'] ) {
					continue;
				}
			}

			if ( sanitize_title( $attribute['name'] ) == $product_attributes ) {

				echo '<div class="jws-attr-swatches">';
				if ( $attribute['is_taxonomy'] ) {
					$post_terms = wp_get_post_terms( $product->get_id(), $attribute['name'] );

					$attr_type = '';

					if ( function_exists( 'TA_WCVS' ) ) {
						$attr = TA_WCVS()->get_tax_attribute( $attribute['name'] );
						if ( $attr ) {
							$attr_type = $attr->attribute_type;
						}
					}
					$found = false;
					foreach ( $post_terms as $term ) {
						$css_class = '';
						if ( is_wp_error( $term ) ) {
							continue;
						}
						if ( $variations && isset( $variations[$term->slug] ) ) {
							$attachment_id = $variations[$term->slug];
							$attachment    = wp_get_attachment_image_src( $attachment_id, 'shop_catalog' );
							if ( $attachment_id == get_post_thumbnail_id() && ! $found ) {
								$css_class .= ' selected';
								$found = true;
							}

							if ( $attachment ) {
								$css_class .= ' jws-swatch-variation-image';
								$img_src = $attachment[0];
								echo wp_kses_post($this->swatch_html( $term, $attr_type, $img_src, $css_class ));
							}

						}
					}
				}
				echo '</div>';
				break;
			}
		}

	}
	/**
	 * Print HTML of a single swatch
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function swatch_html( $term, $attr_type, $img_src, $css_class ) {

		$html = '';
		$name = $term->name;

		switch ( $attr_type ) {
			case 'color':
				$color = get_term_meta( $term->term_id, 'color', true );
				list( $r, $g, $b ) = sscanf( $color, "#%02x%02x%02x" );
				$html = sprintf(
					'<span class="swatch swatch-color %s" data-src="%s" title="%s"><span class="sub-swatch" style="background-color:%s;color:%s;"></span> </span>',
					esc_attr( $css_class ),
					esc_url( $img_src ),
					esc_attr( $name ),
					esc_attr( $color ),
					"rgba($r,$g,$b,0.5)"
				);
				break;

			case 'image':
				$image = get_term_meta( $term->term_id, 'image', true );
				if ( $image ) {
					$image = wp_get_attachment_image_src( $image );
					$image = $image ? $image[0] : WC()->plugin_url() . '/assets/images/placeholder.png';
					$html  = sprintf(
						'<span class="swatch swatch-image %s" data-src="%s" title="%s"><img src="%s" alt="%s"></span>',
						esc_attr( $css_class ),
						esc_url( $img_src ),
						esc_attr( $name ),
						esc_url( $image ),
						esc_attr( $name )
					);
				}

				break;

			default:
				$label = get_term_meta( $term->term_id, 'label', true );
				$label = $label ? $label : $name;
				$html  = sprintf(
					'<span class="swatch swatch-label %s" data-src="%s" title="%s">%s</span>',
					esc_attr( $css_class ),
					esc_url( $img_src ),
					esc_attr( $name ),
					esc_html( $label )
				);
				break;


		}

		return $html;
	}

	/**
	 * Get variations
	 *
	 * @since  1.0.0
	 * @return string
	 */
	function get_variations( $default_attribute ) {
		global $product;

		$variations = array();
		if ( $product->get_type() == 'variable' ) {
			$args = array(
				'post_parent' => $product->get_id(),
				'post_type'   => 'product_variation',
				'orderby'     => 'menu_order',
				'order'       => 'ASC',
				'fields'      => 'ids',
				'post_status' => 'publish',
				'numberposts' => - 1
			);

			if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
				$args['meta_query'][] = array(
					'key'     => '_stock_status',
					'value'   => 'instock',
					'compare' => '=',
				);
			}

			$thumbnail_id = get_post_thumbnail_id();

			$posts = get_posts( $args );

			foreach ( $posts as $post_id ) {
				$attachment_id = get_post_thumbnail_id( $post_id );
				$attribute     = $this->get_variation_attributes( $post_id, 'attribute_' . $default_attribute );

				if ( ! $attachment_id ) {
					$attachment_id = $thumbnail_id;
				}

				if ( $attribute ) {
					$variations[$attribute[0]] = $attachment_id;
				}

			}

		}

		return $variations;
	}

	/**
	 * Get variation attribute
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function get_variation_attributes( $child_id, $attribute ) {
		global $wpdb;

		$values = array_unique(
			$wpdb->get_col(
				$wpdb->prepare(
					"SELECT meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s AND post_id IN (" . $child_id . ")",
					$attribute
				)
			)
		);

		return $values;
	}
    /**
	 * Get product thumnails
	 *
	 * @since  1.0.0
	 * @return string
	 */
    
     
     
	function product_thumbnails() {
		global $post, $product, $woocommerce;
        $options = get_post_meta( get_the_ID(), '_custom_wc_options', true );
        $style = ( is_array( $options ) && $options['wc-single-style'] ) ? $options['wc-single-style'] : ( cs_get_option( 'wc-single-style' ) ? cs_get_option( 'wc-single-style' ) : '1' );
        $thumb_position = ( is_array( $options ) && $options['wc-single-style'] == 1 && $options['wc-thumbnail-position'] ) ? $options['wc-thumbnail-position'] : ( cs_get_option( 'wc-thumbnail-position' ) ? cs_get_option( 'wc-thumbnail-position' ) : 'left' );
		$attachment_ids = $product->get_gallery_image_ids();
        $data_slick = '';
        if($thumb_position == 'left' || $thumb_position == 'right') {
           $loc_slick = 'shop_single_2'; 
           $data_slick = 'data-slick=\'{"slidesToShow": 4,"slidesToScroll": 1,"asNavFor": "#product-images","arrows": false, "vertical":true ,  "focusOnSelect": true,  "responsive":[{"breakpoint": 736,"settings":{"slidesToShow": 4, "vertical":false}}]}\''; 
        }elseif ($thumb_position == 'bottom' || $thumb_position == 'outside'  ) {
            $loc_slick = 'shop_single_2';
            $data_slick = 'data-slick=\'{"slidesToShow": 4,"slidesToScroll": 1,"asNavFor": "#product-images","arrows": false, "focusOnSelect": true,  "responsive":[{"breakpoint": 736,"settings":{"slidesToShow": 4, "vertical":false}}]}\''; 
        }else {
            $data_slick = ''; 
            $loc_slick = 'shop_single';
        }

        if($style == 1 ) {
            	if ( $attachment_ids ) {
			$loop    = 1;
			$columns = apply_filters( 'woocommerce_product_thumbnails_columns', 3 );
			?>
			<div class="product-thumbnails" id="product-thumbnails">
				<div class="thumbnails <?php echo 'columns-' . $columns; ?>" <?php echo wp_kses_post( $data_slick); ?> ><?php

					$image_thumb = get_the_post_thumbnail( $post->ID, apply_filters( 'single_product_small_thumbnail_size', $loc_slick ) );

					if ( $image_thumb ) {

						printf(
							'<div class="thumb1">%s</div>',
							$image_thumb
						);

					}

					if ( $attachment_ids ) {
						foreach ( $attachment_ids as $attachment_id ) {



							$props = wc_get_product_attachment_props( $attachment_id, $post );

							if ( ! $props['url'] ) {
								continue;
							}

							echo apply_filters(
								'woocommerce_single_product_image_thumbnail_html',
								sprintf(
									'<div class="thumb1">%s</div>',
									wp_get_attachment_image( $attachment_id, apply_filters( 'single_product_small_thumbnail_size', $loc_slick ), 0, $props )
								),
								$attachment_id,
								$post->ID
							);

							$loop ++;
						}
					}



					?>
				</div>
			</div>
			<?php
		}
        }
	}
    /**
	 * Display a tool bar on top of product archive
	 *
	 * @since 1.0
	 */
	function shop_toolbar() {
		$elements = '1';
		if ( ! $elements ) {
			return;
		}
		$output = array();
		$filters = '';
		$filters = sprintf( '<a href="#" class="jws-filter filters"><span>+</span> %s</a>', esc_html__( 'Filters', 'kitgreen' ) );
		$found = '';
		$shop_view = '';
        
		$sort_by = '';
		if ( !$elements ) {
			ob_start();
			woocommerce_catalog_ordering();
			$sort_by = ob_get_clean();

		}
		$output[] = sprintf( '<div class="col-md-6 col-sm-6 col-xs-6 text-left toolbar-right">%s %s</div>', $shop_view, $filters );
        $found = '';
			global $wp_query;
			if ( $wp_query && isset( $wp_query->found_posts ) ) {
				$found = ' '.esc_html__( 'Showing', 'kitgreen' ).' <span>' . $wp_query->found_posts . ' </span>'.esc_html__( 'results', 'kitgreen' ).'';
			}
			if ( $found ) {
				$found = sprintf( '<span class="product-found">%s</span>', $found );
			}   
		if ( $output ) {
			?>
			<div id="jws-shop-toolbar" class="shop-toolbar">
				<div class="row">
					<?php echo implode( ' ', $output ); ?>
				</div>
			</div>
			<?php
		}
	}
    /**
	 * Display a top bar on top of product archive
	 *
	 * @since 1.0
	 */
	function shop_topbar() {
		$this->shop_filter_content();
	}
	/**
	 * Display a top bar on top of product archive
	 *
	 * @since 1.0
	 */
	function shop_filter_content() {

        
		$columns       = cs_get_option ('wc-filter-topbar-columns');
		$columns_class = 'widgets-' . $columns;
		?>
		<div id="jws-shop-topbar" class="widgets-area shop-topbar <?php echo esc_attr( $columns_class ); ?>">
			<div class="shop-topbar-content">
				<div class="shop-filter-actived">
					<?php
					global $wp_query;
					if ( $wp_query && isset( $wp_query->found_posts ) ) {
						echo ''. esc_html__( 'Showing ', 'kitgreen' ) . $wp_query->found_posts . esc_html__( ' results', 'kitgreen' );
					}
                    dynamic_sidebar( 'jws-sidebar-remove' );
					$link = kitgreen_get_page_base_url();

					if ( $_GET ) {
						printf( '<a  href="%s" id="remove-filter-actived" class="remove-filter-actived"><i class="icon-cross2"></i>%s</a>', esc_url( $link ), esc_html( 'Clear All Filter' ) );
					}

					?>
				</div>
                <?php
				$sidebar = 'jws-filter-shhop-color';
				if ( is_active_sidebar( $sidebar ) ) {
					dynamic_sidebar( $sidebar );
				}
				?>
			</div>
		</div>

		<?php
		$elements = '1';
		if ( ! $elements ) {
			return;
		}
		if (  ( !$elements ) ) {
			return;
		}

		echo '<div id="jws-filter-overlay" class="jws-filter-overlay"></div>';
	}
    
}
