<?php
class jwstheme_Post_List_Widget extends jwstheme_Widget {
	function __construct() {
		parent::__construct(
			'bt_post_list', // Base ID
			__('Post List', 'kitgreen'), // Name
			array('description' => __('Display a list of your posts on your site.', 'kitgreen'),) // Args
        );
		$this->settings           = array(
			'title'  => array(
				'type'  => 'text',
				'std'   => __( 'Post List', 'kitgreen' ),
				'label' => __( 'Title', 'kitgreen' )
			),
			'category' => array(
				'type'   => 'bt_taxonomy',
				'std'    => '',
				'label'  => __( 'Categories', 'kitgreen' ),
			),
			'posts_per_page' => array(
				'type'  => 'number',
				'step'  => 1,
				'min'   => 1,
				'max'   => '',
				'std'   => 3,
				'label' => __( 'Number of posts to show', 'kitgreen' )
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
			'layout' => array(
				'type'  => 'select',
				'std'   => 'default',
				'label' => __( 'Layout', 'kitgreen' ),
				'options' => array(
					'default'  => __( 'Default', 'kitgreen' ),
					'layout2'  => __( 'Layout 2 - has thumbnail', 'kitgreen' ),
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
		$category               = isset($instance['category'])? $instance['category'] : '';
		$posts_per_page         = absint( $instance['posts_per_page'] );
		$orderby                = sanitize_title( $instance['orderby'] );
		$order                  = sanitize_title( $instance['order'] );
		$layout                 = sanitize_title( $instance['layout'] );
		$el_class               = sanitize_title( $instance['el_class'] );
		echo ''.$before_widget;
		if ( $title )
				echo ''.$before_title . $title . $after_title;
		$query_args = array(
			'posts_per_page' => $posts_per_page,
			'orderby' => $orderby,
			'order' => $order,
			'post_type' => 'services_spa',
			'post_status' => 'publish');
		if (isset($category) && $category != '') {
			$cats = explode(',', $category);
			$category = array();
			foreach ((array) $cats as $cat) :
			$category[] = trim($cat);
			endforeach;
			$query_args['tax_query'] = array(
									array(
										'taxonomy' => 'services_cat',
										'field' => 'id',
										'terms' => $category
									)
							);
		}
		$wp_query = new WP_Query($query_args);                
		if ($wp_query->have_posts()){
			?>
			<ul class="bt-post-list <?php echo esc_attr( $layout ); ?>">
				<?php 
				while ($wp_query->have_posts()) { 
					$wp_query->the_post(); 
                    ?> <li class="item"> <?php 
					$params = array(
						'title' => get_the_title(),
						'link' => get_the_permalink(),
						'date' => get_the_date( 'M d - Y' ),
						'author' => get_the_author(),
						);
					echo call_user_func_array( 'jwsthemes_widget_post_list_' . $layout, array( $params ) );
				?> </li> <?php
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
/* Class jwstheme_Post_List_Widget */
function jwstheme_post_list_widget() {
    insert_widgets('jwstheme_Post_List_Widget');
}
add_action('widgets_init', 'jwstheme_post_list_widget');
/**
 * jwsthemes_widget_post_list_default
 *
 * @param [array] $params
 */
if( ! function_exists( 'jwsthemes_widget_post_list_default' ) ) :
	function jwsthemes_widget_post_list_default( $params )
	{
		extract( $params );
		$output = "
		<li>
			<h6 class='bt-title bt-text-ellipsis'>
				<a href='{$link}'>{$title}</a>
			</h6>
			<div class='bt-meta'>
				<span>{$date}</span>
				<span>". __( 'By', 'kitgreen' ) ." {$author}</span>
			</div>
		</li>";
		return $output;
	}
endif;
/**
 * jwsthemes_widget_post_list_layout2
 *
 * @param [array] $params
 */
if( ! function_exists( 'jwsthemes_widget_post_list_layout2' ) ) :
	function jwsthemes_widget_post_list_layout2( $params )
	{
		global $post;
		extract( $params );
		/* thumbnail */
		$thumbnail = '';
		if( has_post_thumbnail() ):
        ?> <a href="<?php the_permalink(); ?>"> <?php
            $thumbnail_data = the_post_thumbnail();
        	$thumbnail = $thumbnail_data[0];
            ?>  </a> <?php
        endif;
		$output = "
		<div class='item-inner'>
				<img class='post-thumb' src='{$thumbnail}' alt=''>
				<div class='info-meta'>
                    <span>{$date}</span>
					<div class='title'><a href='{$link}' title='{$title}' data-smooth-link>{$title}</a></div>
			</div>
		</div>";
		return $output;
	}
endif;