<?php
/*
 * Saves new field to postmeta for navigation
 */
add_filter( 'wp_nav_menu_args', 'modify_arguments', 100 );
function modify_arguments( $arguments ) {
    $arguments['walker']          = new HeroMenuWalker();
    return $arguments;
}
add_action('wp_update_nav_menu_item', 'custom_nav_update',10, 3);
function custom_nav_update($menu_id, $menu_item_db_id, $args ) {
    $fields = array('submenu_type','dropdown','widget_area', 'submenu_size' , 'column_width','group','hide_link','bg_image','menu_icon');
    foreach($fields as $i=>$field){
        if (isset($_REQUEST['menu-item-'.$field][$menu_item_db_id])) {
            $mega_value = $_REQUEST['menu-item-'.$field][$menu_item_db_id];
            update_post_meta( $menu_item_db_id, '_menu_item_'.$field, $mega_value );
        }
    }
}

/*
 * Adds value of new field to $item object that will be passed to     Walker_Nav_Menu_Edit_Custom
 */
add_filter( 'wp_setup_nav_menu_item','custom_nav_item' );
function custom_nav_item($menu_item) {
    $fields = array('submenu_type','dropdown','widget_area', 'submenu_size' ,'column_width','group','hide_link','bg_image','menu_icon');
    foreach($fields as $i=>$field){
        $menu_item->$field = get_post_meta( $menu_item->ID, '_menu_item_'.$field, true );
    }
    return $menu_item;
}
add_action( 'admin_enqueue_scripts','add_js_mega_menu');
function add_js_mega_menu(){
    wp_enqueue_script( 'set_background', trailingslashit( get_template_directory_uri() ) . 'framework/megamenu/js/set_background.js', array( 'jquery', 'jquery-ui-sortable' ), false, true );
    wp_enqueue_style('font-awesome', URI_PATH.'/assets/css/font-awesome.min.css', array(), '4.1.0');
    wp_enqueue_media();
    add_thickbox();
}

add_filter( 'wp_edit_nav_menu_walker', 'custom_nav_edit_walker',10,2 );
function custom_nav_edit_walker($walker,$menu_id) {
    return 'Walker_Nav_Menu_Edit_Custom';
}

/**
 * Create HTML list of nav menu input items.
 *
 * @package WordPress
 * @since 3.0.0
 * @uses Walker_Nav_Menu
 */
class Walker_Nav_Menu_Edit_Custom extends Walker_Nav_Menu  {
/**
 * @see Walker_Nav_Menu::start_lvl()
 * @since 3.0.0
 *
 * @param string $output Passed by reference.
 */
function start_lvl( &$output, $depth = 0, $args = array() ) {}

/**
 * @see Walker_Nav_Menu::end_lvl()
 * @since 3.0.0
 *
 * @param string $output Passed by reference.
 */
function end_lvl( &$output, $depth = 0, $args = array() ) {}

/**
 * @see Walker::start_el()
 * @since 3.0.0
 *
 * @param string $output Passed by reference. Used to append additional content.
 * @param object $item Menu item data object.
 * @param int $depth Depth of menu item. Used for padding.
 * @param object $args
 */
function start_el( &$output, $item, $depth = 0, $args = array(), $current_object_id = 0 ) {
    global $_wp_nav_menu_max_depth;
    $_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;

    $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

    ob_start();
    $item_id = esc_attr( $item->ID );
    $removed_args = array(
        'action',
        'customlink-tab',
        'edit-menu-item',
        'menu-item',
        'page-tab',
        '_wpnonce',
    );

    $original_title = '';
    if ( 'taxonomy' == $item->type ) {
        $original_title = get_term_field( 'name', $item->object_id, $item->object, 'raw' );
        if ( is_wp_error( $original_title ) )
            $original_title = false;
    } elseif ( 'post_type' == $item->type ) {
        $original_object = get_post( $item->object_id );
        $original_title = $original_object->post_title;
    }

    $classes = array(
        'menu-item menu-item-depth-' . $depth,
        'menu-item-' . esc_attr( $item->object ),
        'menu-item-edit-' . ( ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? 'active' : 'inactive'),
    );

    $title = $item->title;

    if ( ! empty( $item->_invalid ) ) {
        $classes[] = 'menu-item-invalid';
        /* translators: %s: title of menu item which is invalid */
        $title = sprintf( __( '%s (Invalid)', 'kitgreen'), $item->title );
    } elseif ( isset( $item->post_status ) && 'draft' == $item->post_status ) {
        $classes[] = 'pending';
        /* translators: %s: title of menu item in draft status */
        $title = sprintf( __('%s (Pending)', 'kitgreen'), $item->title );
    }

    $title = empty( $item->label ) ? $title : $item->label;

    ?>
    <li data-menuanchor="" id="menu-item-<?php echo esc_attr( $item_id ); ?>" class="<?php echo implode(' ', $classes ); ?>">
        <dl class="menu-item-bar">
            <dt class="menu-item-handle">
                <span class="item-title"><?php echo esc_html( $title ); ?></span>
                <span class="item-controls">
                    <span class="item-type"><?php echo esc_html( $item->type_label ); ?></span>
                    <span class="item-order hide-if-js">
                        <a href="<?php
                            echo wp_nonce_url(
                                add_query_arg(
                                    array(
                                        'action' => 'move-up-menu-item',
                                        'menu-item' => $item_id,
                                    ),
                                    remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
                                ),
                                'move-menu_item'
                            );
                        ?>" class="item-move-up"><abbr title="<?php esc_attr_e('Move up','kitgreen'); ?>">&#8593;</abbr></a>
                        |
                        <a href="<?php
                            echo wp_nonce_url(
                                add_query_arg(
                                    array(
                                        'action' => 'move-down-menu-item',
                                        'menu-item' => $item_id,
                                    ),
                                    remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
                                ),
                                'move-menu_item'
                            );
                        ?>" class="item-move-down"><abbr title="<?php esc_attr_e('Move down','kitgreen'); ?>">&#8595;</abbr></a>
                    </span>
                    <a class="item-edit" id="edit-<?php echo esc_attr( $item_id ); ?>" title="<?php esc_attr_e('Edit Menu Item','kitgreen'); ?>" href="<?php
                        echo ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? admin_url( 'nav-menus.php' ) : add_query_arg( 'edit-menu-item', $item_id, remove_query_arg( $removed_args, admin_url( 'nav-menus.php#menu-item-settings-' . $item_id ) ) );
                    ?>"><?php _e( 'Edit Menu Item' ,'kitgreen'); ?></a>
                </span>
            </dt>
        </dl>

        <div class="menu-item-settings" id="menu-item-settings-<?php echo esc_attr( $item_id ); ?>">
            <?php if( 'custom' == $item->type ) : ?>
                <p class="field-url description description-wide">
                    <label for="edit-menu-item-url-<?php echo esc_attr( $item_id ); ?>">
                        <?php _e( 'URL' ,'kitgreen'); ?><br />
                        <input type="text" id="edit-menu-item-url-<?php echo esc_attr( $item_id ); ?>" class="widefat code edit-menu-item-url" name="menu-item-url[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->url ); ?>" />
                    </label>
                </p>
            <?php endif; ?>
            <p class="description description-thin">
                <label for="edit-menu-item-title-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'Navigation Label' ,'kitgreen'); ?><br />
                    <input type="text" id="edit-menu-item-title-<?php echo esc_attr( $item_id ); ?>" class="widefat edit-menu-item-title" name="menu-item-title[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->title ); ?>" />
                </label>
            </p>
            <p class="description description-thin">
                <label for="edit-menu-item-attr-title-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'Title Attribute','kitgreen' ); ?><br />
                    <input type="text" id="edit-menu-item-attr-title-<?php echo esc_attr( $item_id ); ?>" class="widefat edit-menu-item-attr-title" name="menu-item-attr-title[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->post_excerpt ); ?>" />
                </label>
            </p>
            <p class="field-link-target description">
                <label for="edit-menu-item-target-<?php echo esc_attr( $item_id ); ?>">
                    <input type="checkbox" id="edit-menu-item-target-<?php echo esc_attr( $item_id ); ?>" value="_blank" name="menu-item-target[<?php echo esc_attr( $item_id ); ?>]"<?php checked( $item->target, '_blank' ); ?> />
                    <?php _e( 'Open link in a new window/tab' ,'kitgreen'); ?>
                </label>
            </p>
            <p class="field-css-classes description description-thin">
                <label for="edit-menu-item-classes-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'CSS Classes (optional)' ,'kitgreen'); ?><br />
                    <input type="text" id="edit-menu-item-classes-<?php echo esc_attr( $item_id ); ?>" class="widefat code edit-menu-item-classes" name="menu-item-classes[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( implode(' ', $item->classes ) ); ?>" />
                </label>
            </p>
            <p class="field-xfn description description-thin">
                <label for="edit-menu-item-xfn-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'Link Relationship (XFN)' ,'kitgreen'); ?><br />
                    <input type="text" id="edit-menu-item-xfn-<?php echo esc_attr( $item_id ); ?>" class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->xfn ); ?>" />
                </label>
            </p>
            <?php if ( ! $depth ) { ?>
            <p class="field-description description description-wide">
                <label for="edit-menu-item-description-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'Add Shortcode for mega menu' ,'kitgreen'); ?><br />
                    <textarea id="edit-menu-item-description-<?php echo esc_attr( $item_id ); ?>" class="widefat edit-menu-item-description" rows="3" cols="20" name="menu-item-description[<?php echo esc_attr( $item_id ); ?>]"><?php echo esc_html( $item->description ); ?></textarea>
                    <span class="description"><?php _e('The description will be displayed in the menu if the current theme supports it.','kitgreen'); ?></span>
                </label>
            </p>
            <?php }
            /*
             * This is the added field
             */
			if ( ! $depth ) {
			$title              = 'Submenu Type';
			$key = "menu-item-submenu_type";
			$value = $item->submenu_type;
			?>
			<p class="description description-thin">
				<?php echo esc_html( $title ); ?><br />
				<label for="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>">
					<select id="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>" class=" <?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key . "[" . $item_id . "]" ); ?>">
				     	<option value="standard" <?php echo wp_kses_post(( $value == 'standard' ) ? ' selected="selected" ' : ''); ?>><?php _e( 'Standard Dropdown', 'kitgreen' ); ?></option>
                        <option value="mega_menu" <?php echo wp_kses_post(( $value == 'mega_menu' ) ? ' selected="selected" ' : ''); ?>><?php _e( 'Mega Dropdown', 'kitgreen' ); ?></option>
                        <option value="mega_menu_full_width" <?php echo wp_kses_post(( $value == 'mega_menu_full_width' ) ? ' selected="selected" ' : ''); ?>><?php _e( 'Mega Full Width Dropdown', 'kitgreen' ); ?></option>
					</select>
				</label>
			</p>
            <?php
			}
            if ( ! $depth ) {
			$title              = 'Mega Menu Size';
			$key = "menu-item-submenu_size";
			$value = $item->submenu_size;
			?>
		    <p class="field-submenu_size description description-thin">
                <label for="edit-menu-item-submenu_size-<?php echo esc_attr( $item_id ); ?>">
                    <?php _e( 'Add Width Mega Menu ' ,'kitgreen'); ?><br />
                    <input type="text" id="edit-menu-item-submenu_size-<?php echo esc_attr( $item_id ); ?>" class="widefat code edit-menu-item-submenu_size" name="menu-item-submenu_size[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->submenu_size ); ?>" />
                </label>
            </p>
            <?php
			}
        $title = 'Menu Icon';
        $key = "menu-item-menu_icon";
        $value = $item->menu_icon;
        ?>
        <div id="<?php echo esc_attr( $key . '-' . $item_id . '-popup' ); ?>" data-item_id="<?php echo esc_attr( $item_id );?>" class="menu_icon_wrap" style="display:none;">
            <?php
            $icons = array( 'fa-adjust', 'fa-adn', 'fa-align-center', 'fa-align-justify', 'fa-align-left', 'fa-align-right', 'fa-ambulance', 'fa-anchor', 'fa-android', 'fa-angle-double-down', 'fa-angle-double-left', 'fa-angle-double-right', 'fa-angle-double-up', 'fa-angle-down', 'fa-angle-left', 'fa-angle-right', 'fa-angle-up', 'fa-apple', 'fa-archive', 'fa-arrow-circle-down', 'fa-arrow-circle-left', 'fa-arrow-circle-o-down', 'fa-arrow-circle-o-left', 'fa-arrow-circle-o-right', 'fa-arrow-circle-o-up', 'fa-arrow-circle-right', 'fa-arrow-circle-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right', 'fa-arrow-up', 'fa-arrows', 'fa-arrows-alt', 'fa-arrows-h', 'fa-arrows-v', 'fa-asterisk', 'fa-automobile', 'fa-backward', 'fa-ban', 'fa-bank', 'fa-bar-chart-o', 'fa-barcode', 'fa-bars', 'fa-beer', 'fa-behance', 'fa-behance-square', 'fa-bell', 'fa-bell-o', 'fa-bitbucket', 'fa-bitbucket-square', 'fa-bitcoin', 'fa-bold', 'fa-bolt', 'fa-bomb', 'fa-book', 'fa-bookmark', 'fa-bookmark-o', 'fa-briefcase', 'fa-btc', 'fa-bug', 'fa-building', 'fa-building-o', 'fa-bullhorn', 'fa-bullseye', 'fa-cab', 'fa-calendar', 'fa-calendar-o', 'fa-camera', 'fa-camera-retro', 'fa-car', 'fa-caret-down', 'fa-caret-left', 'fa-caret-right', 'fa-caret-square-o-down', 'fa-caret-square-o-left', 'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-caret-up', 'fa-certificate', 'fa-chain', 'fa-chain-broken', 'fa-check', 'fa-check-circle', 'fa-check-circle-o', 'fa-check-square', 'fa-check-square-o', 'fa-chevron-circle-down', 'fa-chevron-circle-left', 'fa-chevron-circle-right', 'fa-chevron-circle-up', 'fa-chevron-down', 'fa-chevron-left', 'fa-chevron-right', 'fa-chevron-up', 'fa-child', 'fa-circle', 'fa-circle-o', 'fa-circle-o-notch', 'fa-circle-thin', 'fa-clipboard', 'fa-clock-o', 'fa-cloud', 'fa-cloud-download', 'fa-cloud-upload', 'fa-cny', 'fa-code', 'fa-code-fork', 'fa-codepen', 'fa-coffee', 'fa-cog', 'fa-cogs', 'fa-columns', 'fa-comment', 'fa-comment-o', 'fa-comments', 'fa-comments-o', 'fa-compass', 'fa-compress', 'fa-copy', 'fa-credit-card', 'fa-crop', 'fa-crosshairs', 'fa-css3', 'fa-cube', 'fa-cubes', 'fa-cut', 'fa-cutlery', 'fa-dashboard', 'fa-database', 'fa-dedent', 'fa-delicious', 'fa-desktop', 'fa-deviantart', 'fa-digg', 'fa-dollar', 'fa-dot-circle-o', 'fa-download', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-edit', 'fa-eject', 'fa-ellipsis-h', 'fa-ellipsis-v', 'fa-empire', 'fa-envelope', 'fa-envelope-o', 'fa-envelope-square', 'fa-eraser', 'fa-eur', 'fa-euro', 'fa-exchange', 'fa-exclamation', 'fa-exclamation-circle', 'fa-exclamation-triangle', 'fa-expand', 'fa-external-link', 'fa-external-link-square', 'fa-eye', 'fa-eye-slash', 'fa-facebook', 'fa-facebook-square', 'fa-fast-backward', 'fa-fast-forward', 'fa-fax', 'fa-female', 'fa-fighter-jet', 'fa-file', 'fa-file-archive-o', 'fa-file-audio-o', 'fa-file-code-o', 'fa-file-excel-o', 'fa-file-image-o', 'fa-file-movie-o', 'fa-file-o', 'fa-file-pdf-o', 'fa-file-photo-o', 'fa-file-picture-o', 'fa-file-powerpoint-o', 'fa-file-sound-o', 'fa-file-text', 'fa-file-text-o', 'fa-file-video-o', 'fa-file-word-o', 'fa-file-zip-o', 'fa-files-o', 'fa-film', 'fa-filter', 'fa-fire', 'fa-fire-extinguisher', 'fa-flag', 'fa-flag-checkered', 'fa-flag-o', 'fa-flash', 'fa-flask', 'fa-flickr', 'fa-floppy-o', 'fa-folder', 'fa-folder-o', 'fa-folder-open', 'fa-folder-open-o', 'fa-font', 'fa-forward', 'fa-foursquare', 'fa-frown-o', 'fa-gamepad', 'fa-gavel', 'fa-gbp', 'fa-ge', 'fa-gear', 'fa-gears', 'fa-gift', 'fa-git', 'fa-git-square', 'fa-github', 'fa-github-alt', 'fa-github-square', 'fa-gittip', 'fa-glass', 'fa-globe', 'fa-google', 'fa-google-plus', 'fa-google-plus-square', 'fa-graduation-cap', 'fa-group', 'fa-h-square', 'fa-hacker-news', 'fa-hand-o-down', 'fa-hand-o-left', 'fa-hand-o-right', 'fa-hand-o-up', 'fa-hdd-o', 'fa-header', 'fa-headphones', 'fa-heart', 'fa-heart-o', 'fa-history', 'fa-home', 'fa-hospital-o', 'fa-html5', 'fa-image', 'fa-inbox', 'fa-indent', 'fa-info', 'fa-info-circle', 'fa-inr', 'fa-instagram', 'fa-institution', 'fa-italic', 'fa-joomla', 'fa-jpy', 'fa-jsfiddle', 'fa-key', 'fa-keyboard-o', 'fa-krw', 'fa-language', 'fa-laptop', 'fa-leaf', 'fa-legal', 'fa-lemon-o', 'fa-level-down', 'fa-level-up', 'fa-life-bouy', 'fa-life-ring', 'fa-life-saver', 'fa-lightbulb-o', 'fa-link', 'fa-linkedin', 'fa-linkedin-square', 'fa-linux', 'fa-list', 'fa-list-alt', 'fa-list-ol', 'fa-list-ul', 'fa-location-arrow', 'fa-lock', 'fa-long-arrow-down', 'fa-long-arrow-left', 'fa-long-arrow-right', 'fa-long-arrow-up', 'fa-magic', 'fa-magnet', 'fa-mail-forward', 'fa-mail-reply', 'fa-mail-reply-all', 'fa-male', 'fa-map-marker', 'fa-maxcdn', 'fa-medkit', 'fa-meh-o', 'fa-microphone', 'fa-microphone-slash', 'fa-minus', 'fa-minus-circle', 'fa-minus-square', 'fa-minus-square-o', 'fa-mobile', 'fa-mobile-phone', 'fa-money', 'fa-moon-o', 'fa-mortar-board', 'fa-music', 'fa-navicon', 'fa-openid', 'fa-outdent', 'fa-pagelines', 'fa-paper-plane', 'fa-paper-plane-o', 'fa-paperclip', 'fa-paragraph', 'fa-paste', 'fa-pause', 'fa-paw', 'fa-pencil', 'fa-pencil-square', 'fa-pencil-square-o', 'fa-phone', 'fa-phone-square', 'fa-photo', 'fa-picture-o', 'fa-pied-piper', 'fa-pied-piper-alt', 'fa-pied-piper-square', 'fa-pinterest', 'fa-pinterest-square', 'fa-plane', 'fa-play', 'fa-play-circle', 'fa-play-circle-o', 'fa-plus', 'fa-plus-circle', 'fa-plus-square', 'fa-plus-square-o', 'fa-power-off', 'fa-print', 'fa-puzzle-piece', 'fa-qq', 'fa-qrcode', 'fa-question', 'fa-question-circle', 'fa-quote-left', 'fa-quote-right', 'fa-ra', 'fa-random', 'fa-rebel', 'fa-recycle', 'fa-reddit', 'fa-reddit-square', 'fa-refresh', 'fa-renren', 'fa-reorder', 'fa-repeat', 'fa-reply', 'fa-reply-all', 'fa-retweet', 'fa-rmb', 'fa-road', 'fa-rocket', 'fa-rotate-left', 'fa-rotate-right', 'fa-rouble', 'fa-rss', 'fa-rss-square', 'fa-rub', 'fa-ruble', 'fa-rupee', 'fa-save', 'fa-scissors', 'fa-search', 'fa-search-minus', 'fa-search-plus', 'fa-send', 'fa-send-o', 'fa-share', 'fa-share-alt', 'fa-share-alt-square', 'fa-share-square', 'fa-share-square-o', 'fa-shield', 'fa-shopping-cart', 'fa-sign-in', 'fa-sign-out', 'fa-signal', 'fa-sitemap', 'fa-skype', 'fa-slack', 'fa-sliders', 'fa-smile-o', 'fa-sort', 'fa-sort-alpha-asc', 'fa-sort-alpha-desc', 'fa-sort-amount-asc', 'fa-sort-amount-desc', 'fa-sort-asc', 'fa-sort-desc', 'fa-sort-down', 'fa-sort-numeric-asc', 'fa-sort-numeric-desc', 'fa-sort-up', 'fa-soundcloud', 'fa-space-shuttle', 'fa-spinner', 'fa-spoon', 'fa-spotify', 'fa-square', 'fa-square-o', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-star', 'fa-star-half', 'fa-star-half-empty', 'fa-star-half-full', 'fa-star-half-o', 'fa-star-o', 'fa-steam', 'fa-steam-square', 'fa-step-backward', 'fa-step-forward', 'fa-stethoscope', 'fa-stop', 'fa-strikethrough', 'fa-stumbleupon', 'fa-stumbleupon-circle', 'fa-subscript', 'fa-suitcase', 'fa-sjws-o', 'fa-superscript', 'fa-support', 'fa-table', 'fa-tablet', 'fa-tachometer', 'fa-tag', 'fa-tags', 'fa-tasks', 'fa-taxi', 'fa-tencent-weibo', 'fa-terminal', 'fa-text-height', 'fa-text-width', 'fa-th', 'fa-th-large', 'fa-th-list', 'fa-thumb-tack', 'fa-thumbs-down', 'fa-thumbs-o-down', 'fa-thumbs-o-up', 'fa-thumbs-up', 'fa-ticket', 'fa-times', 'fa-times-circle', 'fa-times-circle-o', 'fa-tint', 'fa-toggle-down', 'fa-toggle-left', 'fa-toggle-right', 'fa-toggle-up', 'fa-trash-o', 'fa-tree', 'fa-trello', 'fa-trophy', 'fa-truck', 'fa-try', 'fa-tumblr', 'fa-tumblr-square', 'fa-turkish-lira', 'fa-twitter', 'fa-twitter-square', 'fa-umbrella', 'fa-underline', 'fa-undo', 'fa-university', 'fa-unlink', 'fa-unlock', 'fa-unlock-alt', 'fa-unsorted', 'fa-upload', 'fa-usd', 'fa-user', 'fa-user-md', 'fa-users', 'fa-video-camera', 'fa-vimeo-square', 'fa-vine', 'fa-vk', 'fa-volume-down', 'fa-volume-off', 'fa-volume-up', 'fa-warning', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-wheelchair', 'fa-windows', 'fa-won', 'fa-wordpress', 'fa-wrench', 'fa-xing', 'fa-xing-square', 'fa-yahoo', 'fa-yen', 'fa-youtube', 'fa-youtube-play', 'fa-youtube-square' );
            $html = '<input type="hidden" name="" class="wpb_vc_param_value" value="' . $value . '" id="trace"/> ';
            $html .= '<div class="icon-preview icon-preview-' . esc_attr( $item_id ) . '"><i class=" fa ' . esc_attr( $value ) . '"></i></div>';
            $html .= '<div id="' . esc_attr( $key ) . '-' . esc_attr( $item_id ) . '-icon-dropdown" >';
            $html .= '<ul class="icon-list">';
            $n = 1;
            foreach ( $icons as $icon ) {
                $selected = ( $icon == $value ) ? 'class="selected"' : '';
                $id       = esc_attr( 'icon-' . $n );
                $html .= '<li ' . esc_attr( $selected ) . ' data-icon="' . esc_attr( $icon ) . '"><i class="icon fa ' . esc_attr( $icon ) . '"></i></li>';
                $n ++;
            }
            $html .= '</ul>';
            $html .= '</div>';
            echo ''.$html;
            ?>
        </div>
        <p class="description description-wide">
            <label for="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>">
                <?php echo esc_html( $title ); ?><br />
                <input type="text" value="<?php echo esc_attr( $value ); ?>" id="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>" class=" <?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key . "[" . $item_id . "]" ); ?>" />
                <input alt="#TB_inline?height=400&width=500&inlineId=<?php echo esc_attr( $key . '-' . $item_id . '-popup' ); ?>" title="<?php _e( 'Click to browse icon', 'kitgreen' ) ?>" class="thickbox button-secondary submit-add-to-menu" type="button" value="<?php _e( 'Browse Icon', 'kitgreen' ) ?>" />
				<a class="button btn_clear button-primary" href="javascript: void(0);">Clear</a>
                <span class="icon-preview  icon-preview<?php echo esc_attr( '-' . $item_id ); ?>"><i class=" fa fa-<?php echo esc_attr( $value ); ?>"></i></span>
            </label>
        </p>
			<!-- Start background menu -->
            <?php
            $title = 'Image Logo';
            $key = "menu-item-bg_image";
            $value = $item->bg_image;
            ?>
            
            <p class="description description-wide">
                <label for="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>">
                    <?php echo esc_html( $title ); ?><br />
                    <input type="text" value="<?php echo esc_attr( $value ); ?>" id="edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>" class=" <?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key . "[" . $item_id . "]" ); ?>" />
                    <button id="browse-edit-<?php echo esc_attr( $key . '-' . $item_id ); ?>" class="set_custom_images button button-secondary submit-add-to-menu"><?php _e( 'Browse Image', 'kitgreen' ); ?></button>
					<a class="button btn_clear button-primary" href="javascript: void(0);">Clear</a>
                </label>
            </p>
			<!-- End background menu -->
            <div class="menu-item-actions description-wide submitbox">
                <?php if( 'custom' != $item->type && $original_title !== false ) : ?>
                    <p class="link-to-original">
                        <?php printf( __('Original: %s', 'kitgreen'), '<a href="' . esc_attr( $item->url ) . '">' . esc_html( $original_title ) . '</a>' ); ?>
                    </p>
                <?php endif; ?>
                <a class="item-delete submitdelete deletion" id="delete-<?php echo esc_attr( $item_id ); ?>" href="<?php
                echo wp_nonce_url(
                    add_query_arg(
                        array(
                            'action' => 'delete-menu-item',
                            'menu-item' => $item_id,
                        ),
                        remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
                    ),
                    'delete-menu_item_' . esc_attr( $item_id )
                ); ?>"><?php _e('Remove','kitgreen'); ?></a> <span class="meta-sep"> | </span> <a class="item-cancel submitcancel" id="cancel-<?php echo esc_attr( $item_id ); ?>" href="<?php echo esc_url( add_query_arg( array('edit-menu-item' => $item_id, 'cancel' => time()), remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) ) ) );
                    ?>#menu-item-settings-<?php echo esc_attr( $item_id ); ?>"><?php _e('Cancel','kitgreen'); ?></a>
            </div>

            <input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item_id ); ?>" />
            <input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->object_id ); ?>" />
            <input class="menu-item-data-object" type="hidden" name="menu-item-object[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->object ); ?>" />
            <input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->menu_item_parent ); ?>" />
            <input class="menu-item-data-position" type="hidden" name="menu-item-position[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->menu_order ); ?>" />
            <input class="menu-item-data-type" type="hidden" name="menu-item-type[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $item->type ); ?>" />
        </div><!-- .menu-item-settings-->
        <ul class="menu-item-transport"></ul>
    <?php
    $output .= ob_get_clean();
    }
}
class HeroMenuWalker extends Walker_Nav_Menu {
        private $type_sub = 'sub_no_container';
		/**
		 * Starts the list before the elements are added.
		 *
		 * @see Walker::start_lvl()
		 *
		 * @since 3.0.0
		 *
		 * @param string $output Passed by reference. Used to append additional content.
		 * @param int    $depth  Depth of menu item. Used for padding.
		 * @param array  $args   An array of arguments. @see wp_nav_menu()
		 */
		public function start_lvl( &$output, $depth = 0,  $args = array() ) {
			$indent = str_repeat("\t", $depth);
            $sub_position = get_post_meta( get_the_ID() , '_menu_item_submenu_position', true );
            $sub_type = get_post_meta( get_the_ID() , '_menu_item_submenu_design', true );
            $class_ss = '';
            if($depth < 1) {
                $class_ss = " no_shortcode ";
            }
            if( $sub_type == 'standard' ) {
                $this->type_sub = 'sub_standard';
                
            }elseif($sub_type == 'mega_menu') {
                $this->type_sub = 'sub_mega_menu'; 
            }elseif($sub_type == 'default') {
                $this->type_sub = 'sub_default'; 
            }elseif($sub_type == 'mega_menu_full_width') {
                $this->type_sub = 'sub_mega_menu_full_width'; 
            }
            
            
			if( $depth == 0) {
				$output .= "\n$indent<div class=\"sub-menu-dropdown ".$this->type_sub."".$class_ss." \">\n";


			}
			if( $depth < 1 ) {
				$sub_menu_class = "sub-menu";
			} else {
				$sub_menu_class = "sub-sub-menu";
			}
			
			$output .= "\n$indent<ul class=\"$sub_menu_class\">\n";


		}

		/**
		 * Ends the list of after the elements are added.
		 *
		 * @see Walker::end_lvl()
		 *
		 * @since 3.0.0
		 *
		 * @param string $output Passed by reference. Used to append additional content.
		 * @param int    $depth  Depth of menu item. Used for padding.
		 * @param array  $args   An array of arguments. @see wp_nav_menu()
		 */
		public function end_lvl( &$output, $depth = 0, $args = array() ) {
			$indent = str_repeat("\t", $depth);
			$output .= "$indent</ul>\n";
			if( $depth == 0) {
				$output .= "$indent</div>\n";

			}
		}

		/**
		 * Start the element output.
		 *
		 * @see Walker::start_el()
		 *
		 * @since 3.0.0
		 *
		 * @param string $output Passed by reference. Used to append additional content.
		 * @param object $item   Menu item data object.
		 * @param int    $depth  Depth of menu item. Used for padding.
		 * @param array  $args   An array of arguments. @see wp_nav_menu()
		 * @param int    $id     Current item ID.
		 */
		public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
			$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

			$classes = empty( $item->classes ) ? array() : (array) $item->classes;
			$classes[] = 'menu-item-' . $item->ID;

			$image = $label = $label_out = '';
			$width    = get_post_meta( $item->ID, '_menu_item_submenu_size',    true );
			$icon     = get_post_meta( $item->ID, '_menu_item_menu_icon',     true );
			$event    = get_post_meta( $item->ID, '_menu_item_event',    true );
			$label    = get_post_meta( $item->ID, '_menu_item_label',    true );
			$opanchor = get_post_meta( $item->ID, '_menu_item_opanchor', true );
			$callbtn  = get_post_meta( $item->ID, '_menu_item_callbtn', true );
            $sub_type = get_post_meta( $item->ID, '_menu_item_submenu_type', true );
            $image = get_post_meta( $item->ID, '_menu_item_bg_image', true );
            
            if( $sub_type == 'standard' ) {
                $this->type_sub = 'sub_standard';
                
            }elseif($sub_type == 'mega_menu') {
                $this->type_sub = 'sub_mega_menu'; 
            }elseif($sub_type == 'default') {
                $this->type_sub = 'sub_default'; 
            }
            

			$classes[] = 'item-sub-type-' . $sub_type;
			if( empty($sub_type) ) $sub_type = 'default';
			$classes[] = 'menu-item-design-' . $sub_type;


			if( $opanchor == 'enable' ) {
				 $classes[] = 'onepage-link';
				if(($key = array_search('current-menu-item', $classes)) !== false) {
					unset($classes[$key]);
				}
			}

			if( $callbtn == 'enable' ) {
				$classes[] = 'callto-btn';
			}

			if( !empty( $label ) ) {
				$classes[] = 'item-with-label';
				$classes[] = 'item-label-' . $label;
				$label_text = '';
				switch ( $label ) {
					case 'hot':
						$label_text = esc_html__('Hot', 'kitgreen');
					break;
					case 'sale':
						$label_text = esc_html__('Sale', 'kitgreen');
					break;
					case 'new':
						$label_text = esc_html__('New', 'kitgreen');
					break;
				}
				$label_out = '<span class="menu-label menu-label-' . $label . '">' . esc_attr( $label_text ) . '</span>';
			}
            
            if( !empty( $image ) ) {
				$classes[] = 'item-with-logo';
				$label_out = '<img src="'.esc_url( $image ).'" class="menu-logo" alt="logo_menu">';
			}


			/**
			 * Filter the CSS class(es) applied to a menu item's list item element.
			 *
			 * @since 3.0.0
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param array  $classes The CSS classes that are applied to the menu item's `<li>` element.
			 * @param object $item    The current menu item.
			 * @param array  $args    An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth   Depth of menu item. Used for padding.
			 */
			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

			/**
			 * Filter the ID applied to a menu item's list item element.
			 *
			 * @since 3.0.1
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param string $menu_id The ID that is applied to the menu item's `<li>` element.
			 * @param object $item    The current menu item.
			 * @param array  $args    An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth   Depth of menu item. Used for padding.
			 */
			$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args, $depth );
			$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

			$output .= $indent . '<li' . $id . $class_names .'>';

			$atts = array();
			$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
			$atts['target'] = ! empty( $item->target )     ? $item->target     : '';
			$atts['rel']    = ! empty( $item->xfn )        ? $item->xfn        : '';
			$atts['href']   = ! empty( $item->url )        ? $item->url        : '';

			/**
			 * Filter the HTML attributes applied to a menu item's anchor element.
			 *
			 * @since 3.6.0
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param array $atts {
			 *     The HTML attributes applied to the menu item's `<a>` element, empty strings are ignored.
			 *
			 *     @type string $title  Title attribute.
			 *     @type string $target Target attribute.
			 *     @type string $rel    The rel attribute.
			 *     @type string $href   The href attribute.
			 * }
			 * @param object $item  The current menu item.
			 * @param array  $args  An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth Depth of menu item. Used for padding.
			 */
			$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

			$attributes = '';
			foreach ( $atts as $attr => $value ) {
				if ( ! empty( $value ) ) {
					$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
					$attributes .= ' ' . $attr . '="' . $value . '"';
				}
			}

			$item_output = $args->before;
			$item_output .= '<a'. $attributes .'>';
			if($icon != '') {
				$item_output .= '<i class="fa fa-' . $icon . '"></i>';
			}
			/** This filter is documented in wp-includes/post-template.php */
			$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
			$item_output .= $label_out;
			$item_output .= '</a>';
			$item_output .= $args->after;

			$styles = '';

			if( $depth == 0) {
				/**
				 * Add background image to dropdown
				 **/


				if( has_post_thumbnail( $item->ID ) ) {
					$post_thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $item->ID ), 'full' );

					//ar($post_thumbnail);

					$styles .= '.menu-item-' . $item->ID . ' > .sub-menu-dropdown {';
						$styles .= 'background-image: url(' . $post_thumbnail[0] .'); ';
					$styles .= '}';
				}

				if( ! empty( $item->description ) && !in_array("menu-item-has-children", $item->classes) ) {
					$item_output .= "\n$indent<div class=\"sub-menu-dropdown ".$this->type_sub."\"><div class='megasub'>\n";
						$item_output .= do_shortcode( $item->description );
					$item_output .= "\n$indent</div></div>\n";


				}
			}

			if($sub_type == 'mega_menu' && !empty($width)) {
				$styles .= '.menu-item-' . $item->ID . ' > .sub-menu-dropdown {';
					$styles .= 'width: ' . $width .'px !important; ';
				$styles .= '}';
			}


			if( $styles != '' ) {
				$item_output .= '<style type="text/css">';
				$item_output .= $styles;
				$item_output .= '</style>';
			}

			/**
			 * Filter a menu item's starting output.
			 *
			 * The menu item's starting output only includes `$args->before`, the opening `<a>`,
			 * the menu item's title, the closing `</a>`, and `$args->after`. Currently, there is
			 * no filter for modifying the opening and closing `<li>` for a menu item.
			 *
			 * @since 3.0.0
			 *
			 * @param string $item_output The menu item's starting HTML output.
			 * @param object $item        Menu item data object.
			 * @param int    $depth       Depth of menu item. Used for padding.
			 * @param array  $args        An array of {@see wp_nav_menu()} arguments.
			 */
			$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
		}    
}



if(!function_exists('hero_get_main_menu_parent_items')){
    function hero_get_main_menu_parent_items(){
        $menu_name = 'cs_main_menu';
        $locations = get_nav_menu_locations();
        $items = array();

        if ( isset( $locations[ $menu_name ] ) && $locations[ $menu_name ] != 0) {
            $menu_id = $locations[ $menu_name ];

            $items = hero_get_menu_parent_items($menu_id);


            //get the WPML translated items
            $trans_items = hero_get_translation_items($menu_id);
            if(!empty($trans_items)){
                $items = array_merge($items, $trans_items);
            }

        }

        return $items;
    }
}

if(!function_exists('hero_get_menu_parent_items')){
    function hero_get_menu_parent_items($menu_id){
        $menu = wp_get_nav_menu_object( $menu_id );

        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $items = array();

        if(sizeof($menu_items)){
            foreach ($menu_items as $item) {
                if($item->menu_item_parent==0){
                    $items[]= array('id'=>$item->ID, 'name'=>$item->title);
                }
            }
        }

        return $items;
    }
}

if(!function_exists('hero_get_translation_items')){
    function hero_get_translation_items($main_id){
        $items = array();
        if(function_exists('icl_object_id') && function_exists('icl_get_languages')){
            //get the WPML languages
            $languages = icl_get_languages('skip_missing=0');
            foreach ($languages as $lang) {
                $code = $lang['language_code'];
                if(!empty($code)){
                    $menu_id_str = icl_object_id($main_id, 'nav_menu', false, $code);
                    if(!empty($menu_id_str)){
                        $menu_id = intval($menu_id_str);

                        if($menu_id!=$main_id){
                            $menu_items = hero_get_menu_parent_items($menu_id);

                            if(!empty($menu_items)){
                                $items = array_merge($items, $menu_items);
                            }
                        }

                    }
                }
            }
        }

        return $items;
    }
}