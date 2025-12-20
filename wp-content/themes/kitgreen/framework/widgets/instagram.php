<?php
	class JWS_Instagram_Widget extends jwstheme_Widget {
		/**
			* Constructor
		*/
		function __construct() {
			parent::__construct(
			'instagram', // Base ID
			__('Instagram', 'kitgreen'), // Name
			array('description' => __('Display a instagram of your on your site.', 'kitgreen'),) // Args
			);
			$this->settings           = array(
			'title'  => array(
			'type'  => 'text',
			'std'   => __( 'Instagram Feed', 'kitgreen' ),
			'label' => __( 'Title', 'kitgreen' )
			),
			'access_token' => array(
			'type'  => 'text',
			'std'   => '',
			'label' => __("Please, enter <a href='http://instagram.pixelunion.net/' title'What is it?'>access token</a> in this element, demo: 2713900256.1677ed0.b25664f30f2c4ebe8af325eec77e9cf0.", 'kitgreen')
			),
			'tpl' => array(
			'type'  => 'select',
			'std'   => '',
			'label' => __( "Show Photos From", 'kitgreen'),
			'options' => array(
			"popular" =>__("Popular", 'kitgreen'),
			"tagged" => __("Hashtag", 'kitgreen'),
			"location" => __("Location", 'kitgreen'),
			'user' => __("User ID", 'kitgreen'),
			),
			),
			'item' => array(
			'type'  => 'text',
			'label' => __("TagName/ LocationId/ UserId", 'kitgreen'),
			'std'   => '',
			),
			'limit' => array(
			'type'  => 'text',
			"label" => __("Limit", 'kitgreen'),
			'std'   => '',
			),
			'el_class'  => array(
			'type'  => 'text',
			'std'   => '',
			'label' => __( 'Extra Class', 'kitgreen' )
			)
			);
		}
		/**
			* widget function.
			*
			* @see WP_Widget
			*
			* @param array $args
			* @param array $instance
		*/
		function widget( $args, $instance ) {
			global $post;
			extract( $args );
			$title          = apply_filters( 'widget_title', $instance['title'] );
			$access_token   = apply_filters( 'access_token', $instance['access_token'] );
			$item           = apply_filters( 'item', $instance['item'] );
			$limit           = apply_filters( 'limit', $instance['limit'] );
			$tpl        = esc_attr( $instance['tpl'] );
			$el_class       = esc_attr( $instance['el_class'] );
			echo wp_kses_post($before_widget );
			if( !empty( $title ) ){
				echo wp_kses_post($before_title . $title . $after_title );;
			}
			wp_enqueue_script( 'instafeed-custom' );
			if( empty( $access_token ) ) return;
		?>
		<div class="clearfix tb-col-instagram">
            <ul id="instafeed" class="blog-instagram-feed-widget"></ul>
        </div>
		<script type="text/javascript">
			(function($){
				$(document).ready(function(){
					var ops = {
						accessToken: '<?php echo esc_attr( $access_token );?>',
						resolution: '<?php echo esc_attr( 'thumbnail' );?>',
						template: '<li><a target="_blank" href="{{link}}"><img class="img-responsive" src="{{image}}" /></a></li>',
						limit: <?php echo intval( $limit );?>
					};
					<?php if( ! empty( $tpl ) ): ?>
					ops.get = '<?php echo esc_attr( $tpl );?>';
					<?php endif; ?>
					<?php if( $tpl == 'tagged' ):?>
					ops.tagName = '<?php echo wp_kses_post($item);?>';
					<?php elseif( $tpl == 'location'): ?>
					ops.locationId = '<?php echo wp_kses_post($item);?>';
					<?php elseif( $tpl == 'user'): ?>
					ops.userId  = '<?php echo wp_kses_post($item);?>';
					<?php endif; ?>
					var feed = new Instafeed( ops );
					feed.run();
				});
			})(window.jQuery)
		</script>
		<?php
			echo wp_kses_post($after_widget );
		}
	}
	function register_instagram_grid_widget() {
		insert_widgets('JWS_Instagram_Widget');
	}
add_action('widgets_init', 'register_instagram_grid_widget');