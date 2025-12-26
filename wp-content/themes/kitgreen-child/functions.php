<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

// END ENQUEUE PARENT ACTION


function enqueue_our_required_stylesheets(){
wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/5.4.0/css/font-awesome.min.css');
}
add_action('wp_enqueue_scripts','enqueue_our_required_stylesheets');
function enqueue_load_fa() {
  wp_enqueue_style( 'load-fa', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_load_fa');



function abhirawp_create_cf7_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cf7_entries';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        form_id int NOT NULL,
        submission_time datetime DEFAULT CURRENT_TIMESTAMP,
        data longtext NOT NULL,
		ip_data longtext NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
 }

 add_action('init', 'abhirawp_create_cf7_table');

 //register_activation_hook(__FILE__, 'abhirawp_create_cf7_table');

 add_action('wpcf7_before_send_mail', 'abhirawp_store_cf7_data');

  function abhirawp_store_cf7_data($contact_form) {
    global $wpdb;
    $submission = WPCF7_Submission::get_instance();
    if (!$submission) return;
    $data = $submission->get_posted_data();	
	$data['page-url'] = esc_url_raw($_SERVER['HTTP_REFERER']);	
    $form_id = $contact_form->id();
	$table = $wpdb->prefix . 'cf7_entries';
    $id = $wpdb->insert(
        $table,
        [
            'form_id' => $form_id,
            'data'    => json_encode($data),
			'ip_data'    => json_encode(get_IP_address()),
        ]
    );
    
  }


function get_IP_address()
{
    foreach (array('HTTP_CLIENT_IP',
                   'HTTP_X_FORWARDED_FOR',
                   'HTTP_X_FORWARDED',
                   'HTTP_X_CLUSTER_CLIENT_IP',
                   'HTTP_FORWARDED_FOR',
                   'HTTP_FORWARDED',
                   'REMOTE_ADDR') as $key){
        if (array_key_exists($key, $_SERVER) === true){
            foreach (explode(',', $_SERVER[$key]) as $IPaddress){
                $IPaddress = trim($IPaddress); // Just to be safe

                if (filter_var($IPaddress,
                               FILTER_VALIDATE_IP,
                               FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)
                    !== false) {

                    return $IPaddress;
                }
            }
        }
    }
}


add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
function woocommerce_template_single_add_to_cart() {
echo '<button type="submit" id="trigger_cf" class="button alt single_add_to_cart_buttons">Send us your enquiry</button>';
echo '<div id="product_inq" style="display:none">';
echo do_shortcode('[contact-form-7 id="c7c0b4b" title="Contact form 1"]');
echo '</div>';
?>
<script type="text/javascript">
        jQuery('#trigger_cf').on('click', function(){
        if ( jQuery(this).text() == 'Send us your enquiry' ) {
                    jQuery('#product_inq').css("display","block");
            jQuery("#trigger_cf").html('Close');
        } else {
            jQuery('#product_inq').hide();
            jQuery("#trigger_cf").html('Send us your enquiry');
        }
        });
    </script>
<?php
}

// function that runs when shortcode is called

