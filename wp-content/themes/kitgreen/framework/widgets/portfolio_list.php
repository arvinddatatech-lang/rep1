<?php
class jwstheme_portfolio2_List_Widget extends jwstheme_Widget {
	function __construct() {
		parent::__construct(
			'portfolio-list', // Base ID
			__('portfolio List', 'kitgreen'), // Name
			array('description' => __('Display a list of your portfolios on your site.', 'kitgreen'),) // Args
        );
		$this->settings           = array(
			'title'  => array(
				'type'  => 'text',
				'std'   => __( 'portfolio List', 'kitgreen' ),
				'label' => __( 'Title', 'kitgreen' )
			),
			'posts_per_page' => array(
				'type'  => 'number',
				'step'  => 1,
				'min'   => 1,
				'max'   => '',
				'std'   => 3,
				'label' => __( 'Number of portfolios to show', 'kitgreen' )
			),
			'orderby' => array(
				'type'  => 'select',
				'std'   => 'none',
				'label' => __( 'Order by', 'kitgreen' ),
				'options' => array(
					'none'   => __( 'None', 'kitgreen' ),
					'comment_count'  => __( 'Comment Count', 'kitgreen' ),
					'title'  => __( 'Title', 'kitgreen' ),
					'date'   => __( 'Date', 'kitgreen' ),
					'ID'  => __( 'ID', 'kitgreen' ),
				)
			),
			'order' => array(
				'type'  => 'select',
				'std'   => 'none',
				'label' => __( 'Order', 'kitgreen' ),
				'options' => array(
					'none'  => __( 'None', 'kitgreen' ),
					'asc'  => __( 'ASC', 'kitgreen' ),
					'desc' => __( 'DESC', 'kitgreen' ),
				)
			),
			'el_class'  => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'Extra Class', 'kitgreen' )
			)
		);
		add_action('admin_enqueue_scripts', array($this, 'widget_scripts'));
	}
	function widget_scripts() {
		wp_enqueue_script('widget_scripts', URI_PATH . '/framework/widgets/widgets.js');
	}
	function widget( $args, $instance ) {
		ob_start();
		global $post;
		extract( $args );
		$title                  = apply_filters( 'widget_title', $instance['title'], $instance, $this->id_base );
		$posts_per_page         = absint( $instance['posts_per_page'] );
		$orderby                = sanitize_title( $instance['orderby'] );
		$order                  = sanitize_title( $instance['order'] );
		$el_class               = sanitize_title( $instance['el_class'] );
		echo ''.$before_widget;
		if ( $title )
				echo ''.$before_title . $title . $after_title;
		$query_args = array(
			'posts_per_page' => $posts_per_page,
			'orderby' => $orderby,
			'order' => $order,
			'post_type' => 'portfolio',
			'post_status' => 'publish');
        
		$wp_query = new WP_Query($query_args);                
		if ($wp_query->have_posts()){
		     
			?>
			<ul class="portfolio-list">
				<?php 
				while ($wp_query->have_posts()) { 
					$wp_query->the_post(); 
                    ?> <li class="item">
                            <div class="img"> 
                                <?php the_post_thumbnail ('jws-imge-crop-thumbnail-portfolio'); ?>
                            </div>
                            <h6 class="title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h6>
                             <div class="cat">
                                <?php 
                                    $item_cats  = get_the_terms( get_the_ID(), 'portfolio_cat' ); 
                               	    foreach ( $item_cats as $item_cat ) {
                            	    ?>
                                         <a href="<?php echo esc_url(get_term_link($item_cat->slug, 'portfolio_cat')); ?>">
                                            <?php echo wp_kses_post($item_cat->name . ' ' ); ?>
                                         </a><span>,</span> 
                            		<?php }
                                ?>
                            </div> 
                     </li> <?php
                } 
				?>
			</ul>
		<?php 
		}
		wp_reset_postdata();
		echo ''.$after_widget;
		$content = ob_get_clean();
		echo ''.$content;
	}
}
/* Class jwstheme_portfolio_List_Widget */
function jwstheme_portfolio_list2_widget() {
    insert_widgets('jwstheme_portfolio2_List_Widget');
}
add_action('widgets_init', 'jwstheme_portfolio_list2_widget');
