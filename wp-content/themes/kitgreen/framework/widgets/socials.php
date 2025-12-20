<?php
class jwstheme_Social_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
                'social-widget', // Base ID
                __('Socials', 'kitgreen'), // Name
                array('description' => __('Social Widget', 'kitgreen'),) // Args
        );
    }
    function widget($args, $instance) {
        extract($args);
		$title = apply_filters( 'widget_title', $instance['title'], $instance, $this->id_base );
        $el_class = !empty($instance['el_class']) ? $instance['el_class'] : "";
        $icon_social_ = array();
        $link_social_ = array();
        for ($i = 1; $i <= 6; $i++) {
            $icon_social[$i] = !empty($instance['icon_social_' . $i]) ? esc_attr($instance['icon_social_' . $i]) : '';
            $link_social[$i] = !empty($instance['link_social_' . $i]) ? esc_url($instance['link_social_' . $i]) : '';
        }
        
		// no 'class' attribute - add one with the value of width
        if (strpos($before_widget, 'class') === false) {
            $before_widget = str_replace('>', 'class="' . esc_attr($el_class) . '"', $before_widget);
        }
        // there is 'class' attribute - append width value to it
        else {
            $before_widget = str_replace('class="', 'class="' . esc_attr($el_class) . ' ', $before_widget);
        }
		
        ob_start();
		
        echo wp_kses_post($before_widget );
		if ( $title )
				echo ''.$before_title . $title . $after_title;  
        ?>
        <div class='social-wrap'>
        <ul>
            <?php
            for ($i = 1; $i <= 6; $i++) {
                if($icon_social[$i]):
                ?>
            <li class="<?php echo esc_attr(str_replace('fa fa-', 's_', $icon_social[$i])); ?>">  
				<a  href="<?php echo esc_url($link_social[$i]); ?>">
					<i class="<?php echo esc_attr($icon_social[$i]); ?>"></i>
				</a>
            </li>      
			<?php endif; ?>
        <?php } ?>
        </ul>
        </div>
        <?php
        echo wp_kses_post($after_widget );
        echo ob_get_clean();
    }

    function update($new_instance, $old_instance) {
        $instance = $old_instance;
        for ($i = 1; $i <= 6; $i++) {
            $instance['icon_social_' . $i] = $new_instance['icon_social_' . $i];
            $instance['link_social_' . $i] = $new_instance['link_social_' . $i];
        }
        $instance['title'] = $new_instance['title'];
        $instance['el_class'] = $new_instance['el_class'];
        return $instance;
    }

    function form($instance) {
        $icon_social = array();
        $link_social = array();
        for ($i = 1; $i <= 6; $i++) {
           $icon_social[$i] = isset($instance['icon_social_' . $i]) ? esc_attr($instance['icon_social_' . $i]) : '';
            $link_social[$i] = isset($instance['link_social_' . $i]) ? esc_attr($instance['link_social_' . $i]) : '';
        }
        $title = isset($instance['title']) ? esc_attr($instance['title']) : 'Social';
        $el_class = isset($instance['el_class']) ? esc_attr($instance['el_class']) : '';
		?>
		<p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php _e('Title:', 'kitgreen'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" value="<?php echo wp_kses_post($title); ?>" />
        </p>
        <?php
        for ($i = 1; $i <= 6; $i++) {
            ?>
            <p>
                <label for="<?php echo esc_url($this->get_field_id('icon_social_' . $i)); ?>"><?php _e('Social Icon:', 'kitgreen');
            echo wp_kses_post($i); ?></label>
                <input class="widefat" id="<?php echo esc_attr($this->get_field_id('icon_social_' . $i)); ?>" name="<?php echo esc_attr($this->get_field_name('icon_social_' . $i)); ?>" type="text" value="<?php echo esc_attr($icon_social[$i]); ?>" />
            </p>
            <p>
                <label for="<?php echo esc_url($this->get_field_id('link_social_' . $i)); ?>"><?php _e('Social Link:', 'kitgreen');
            echo wp_kses_post($i); ?></label>
                <input class="widefat" id="<?php echo esc_attr($this->get_field_id('link_social_' . $i)); ?>" name="<?php echo esc_attr($this->get_field_name('link_social_' . $i)); ?>" type="text" value="<?php echo esc_attr($link_social[$i]); ?>" />
            </p>
        <?php } ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('el_class')); ?>"><?php _e('Extra Class:', 'kitgreen'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('el_class')); ?>" name="<?php echo esc_attr($this->get_field_name('el_class')); ?>" value="<?php echo wp_kses_post($el_class); ?>" />
        </p>
        <?php
    }
}
/**
 * Class jwstheme_Social_Widget
 */
function jwstheme_register_social_widget() {
    insert_widgets('jwstheme_Social_Widget');
}
add_action('widgets_init', 'jwstheme_register_social_widget');
?>
