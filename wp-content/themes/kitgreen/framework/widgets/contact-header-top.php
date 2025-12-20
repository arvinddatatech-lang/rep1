<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Layered Navigation Widget
 *
 * @author   WooThemes
 * @category Widgets
 * @package  WooCommerce/Widgets
 * @version  2.3.0
 * @extends  WC_Widget
 */
class kitgreen_WC_Widget_Banner extends WC_Widget {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->widget_cssclass    = 'contact-header-widget ';
		$this->widget_description = __( 'Shows Contact Header Top', 'kitgreen' );
		$this->widget_id          = 'contact-header-top';
		$this->widget_name        = __( 'Contact Header', 'kitgreen' );
		
		$this->settings = array(
			'title' => array(
				'type'  => 'text',
				'std'   => __( '', 'kitgreen' ),
				'label' => __( 'Title', 'kitgreen' )
			),
			'heading' => array(
				'type'  => 'text',
				'std'   => __( 'Enter Text this', 'kitgreen' ),
				'label' => __( 'Heading banner', 'kitgreen' )
			),
			'sub_head' => array(
				'type'  => 'text',
				'std'   => __( 'Enter Text this', 'kitgreen' ),
				'label' => __( 'Subheading', 'kitgreen' )
			),
            'col_contact' => array(
				'type'  => 'text',
				'std'   => __( 'col-lg-12 col-md-12 col-sm-12 col-xs-12', 'kitgreen' ),
				'label' => __( 'Subheading', 'kitgreen' )
			),
			'icon' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'icon', 'kitgreen' )
			),
		);


		parent::__construct();
	}
	/**
	 * widget function.
	 *
	 * @see WP_Widget
	 *
	 * @param array $args
	 * @param array $instance
	 */
	public function widget( $args, $instance ) {
		ob_start();
		$this->widget_start( $args, $instance );
		$heading = esc_attr( $instance['heading'] );
		$sub_head = esc_attr( $instance['sub_head'] );
        $icon = esc_attr( $instance['icon'] );
        $col_contact = esc_attr( $instance['col_contact'] );
		?>
			<div class="contact-header <?php echo wp_kses_post($col_contact); ?>">
				<span aria-hidden="true" class="<?php echo wp_kses_post($icon) ?>"></span>
				<div class="hgroup">
				<?php if( ! empty( $heading ) ){ ?>
					<h6><?php echo wp_kses_post($heading); ?></h6>
				<?php } ?>
				<?php if( ! empty( $sub_head ) ): ?>
					<p><?php echo wp_kses_post($sub_head); ?></p>
				<?php endif; ?>
				</div>
			</div>
		<?php

		$this->widget_end( $args );

		echo ob_get_clean();
	}
}

function register_kitgreen_banner() {
    insert_widgets('kitgreen_WC_Widget_Banner');
}
add_action('widgets_init', 'register_kitgreen_banner');
