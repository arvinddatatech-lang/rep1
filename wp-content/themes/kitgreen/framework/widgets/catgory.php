<?php

// Register our tweaked Category Archives widget
function myprefix_widgets_init() {
  insert_widgets( 'WP_Widget_Categories_custom' );
}
add_action( 'widgets_init', 'myprefix_widgets_init' );


/**
 * Duplicated and tweaked WP core Categories widget class
 */
class WP_Widget_Categories_Custom extends WP_Widget {

  function __construct() {
    $widget_ops = array( 'classname' => 'widget_categories widget_categories_custom', 'description' => __( "A list of categories, with slightly tweaked output.", 'kitgreen'  ) );
    parent::__construct( 'categories_custom', __( 'Categories Custom', 'kitgreen' ), $widget_ops );
  }

  function widget( $args, $instance ) {
    extract( $args );

    $title = apply_filters( 'widget_title', $instance['title'], $instance, $this->id_base );

    echo wp_kses_post($before_widget );
    if ( $title )
      echo wp_kses_post($before_title . $title . $after_title );;
    ?>

    <ul>
    <?php
      // Get the category list, and tweak the output of the markup.
      $pattern = '#<li([^>]*)><a([^>]*)>(.*?)<\/a>\s*\(([0-9]*)\)\s*<\/li>#i';  // removed ( and )

      // $replacement = '<li$1><a$2>$3</a><span class="cat-count">$4</span>'; // no link on span
      // $replacement = '<li$1><a$2>$3</a><span class="cat-count"><a$2>$4</a></span>'; // wrap link in span
      $replacement = '<li$1><a$2><span class="cat-name">$3</span><span class="cat-count">( $4 )</span></a>'; // give cat name and count a span, wrap it all in a link

      $subject      = wp_list_categories( 'echo=0&orderby=name&exclude=&title_li=&depth=1&show_count=1' );    
      echo preg_replace( $pattern, $replacement, $subject );
    ?>
    </ul>
    <?php
    echo wp_kses_post($after_widget );
  }

  function update( $new_instance, $old_instance ) {
    $instance = $old_instance;
    $instance['title'] = strip_tags( $new_instance['title'] );
    $instance['count'] = 1;
    $instance['hierarchical'] = 0;
    $instance['dropdown'] = 0;

    return $instance;
  }

  function form( $instance ) {
    //Defaults
    $instance = wp_parse_args( (array) $instance, array( 'title' => '') );
    $title = esc_attr( $instance['title'] );
    $count = true;
    $hierarchical = false;
    $dropdown = false;
?>
    <p><label for="<?php echo wp_kses_post($this->get_field_id('title', 'kitgreen' )); ?>"><?php _e( 'Title:', 'kitgreen'  ); ?></label>
    <input class="widefat" id="<?php echo wp_kses_post($this->get_field_id('title')); ?>" name="<?php echo wp_kses_post($this->get_field_name('title')); ?>" type="text" value="<?php echo wp_kses_post($title); ?>" /></p>

    <input type="checkbox" class="checkbox" id="<?php echo wp_kses_post($this->get_field_id('count')); ?>" name="<?php echo wp_kses_post($this->get_field_name('count')); ?>"<?php checked( $count ); ?> disabled="disabled" />
    <label for="<?php echo wp_kses_post($this->get_field_id('count')); ?>"><?php _e( 'Show post counts', 'kitgreen'  ); ?></label><br />
<?php
  }

}