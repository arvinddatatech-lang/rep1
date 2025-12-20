<?php 



add_filter( 'wpsl_meta_box_fields', 'custom_meta_box_fields' );

function custom_meta_box_fields( $meta_fields ) {
    
    $meta_fields[__( 'Appointment', 'kitgreen' )] = array(
        'appointment_url' => array(
            'label' => __( 'Appointment', 'kitgreen' )
        )
    );

    return $meta_fields;
}

add_filter( 'wpsl_frontend_meta_fields', 'custom_frontend_meta_fields' );

function custom_frontend_meta_fields( $store_fields ) {

    $store_fields['wpsl_appointment_url'] = array( 
        'name' => 'appointment_url',
        'type' => 'url'
    );

    return $store_fields;
}
add_filter( 'wpsl_listing_template', 'custom_listing_template' );

function custom_listing_template() {

    global $wpsl, $wpsl_settings;
   
    $listing_template = '<li class="item_open" data-store-id="<%= id %>">' . "\r\n";
    
    $listing_template .= "\t\t\t\t" . wpsl_store_header_template( 'listing' ) . "\r\n"; // Check which header format we use
    $listing_template .= '<div class="open_wpsl">';     
    $listing_template .= "\t\t" . '<div class="wpsl-store-location">' . "\r\n";
    
    $listing_template .= "\t\t\t" . '<p><%= thumb %>' . "\r\n";
    $listing_template .= "\t\t\t\t" . '<span class="wpsl-street"><%= address %></span>' . "\r\n";
    $listing_template .= "\t\t\t\t" . '<% if ( address2 ) { %>' . "\r\n";
    $listing_template .= "\t\t\t\t" . '<span class="wpsl-street"><%= address2 %></span>' . "\r\n";
    $listing_template .= "\t\t\t\t" . '<% } %>' . "\r\n";
    $listing_template .= "\t\t\t\t" . '<span>' . wpsl_address_format_placeholders() . '</span>' . "\r\n"; // Use the correct address format

    if ( !$wpsl_settings['hide_country'] ) {
        $listing_template .= "\t\t\t\t" . '<span class="wpsl-country"><%= country %></span>' . "\r\n";
    }

    $listing_template .= "\t\t\t" . '</p>' . "\r\n";
    
    // Include the opening hours
    $listing_template .= "\t\t\t" . '<% if ( hours ) { %>' . "\r\n";
    $listing_template .= "\t\t\t" . '<p><%= hours %></p>' . "\r\n";
    $listing_template .= "\t\t\t" . '<% } %>' . "\r\n";

    // Show the phone, fax or email data if they exist.
    if ( $wpsl_settings['show_contact_details'] ) {
        $listing_template .= "\t\t\t" . '<p class="wpsl-contact-details">' . "\r\n";
        $listing_template .= "\t\t\t" . '<% if ( phone ) { %>' . "\r\n";
        $listing_template .= "\t\t\t" . '<span><strong>' . esc_html( $wpsl->i18n->get_translation( 'phone_label', __( 'Phone', 'kitgreen' ) ) ) . '</strong>: <%= formatPhoneNumber( phone ) %></span>' . "\r\n";
        $listing_template .= "\t\t\t" . '<% } %>' . "\r\n";
        $listing_template .= "\t\t\t" . '<% if ( fax ) { %>' . "\r\n";
        $listing_template .= "\t\t\t" . '<span><strong>' . esc_html( $wpsl->i18n->get_translation( 'fax_label', __( 'Fax', 'kitgreen' ) ) ) . '</strong>: <%= fax %></span>' . "\r\n";
        $listing_template .= "\t\t\t" . '<% } %>' . "\r\n";
        $listing_template .= "\t\t\t" . '<% if ( email ) { %>' . "\r\n";
        $listing_template .= "\t\t\t" . '<span><strong>' . esc_html( $wpsl->i18n->get_translation( 'email_label', __( 'Email', 'kitgreen' ) ) ) . '</strong>: <%= email %></span>' . "\r\n";
        $listing_template .= "\t\t\t" . '<% } %>' . "\r\n";
        $listing_template .= "\t\t\t" . '</p>' . "\r\n";
  
    }

    $listing_template .= "\t\t\t" . wpsl_more_info_template() . "\r\n"; // Check if we need to show the 'More Info' link and info
    $listing_template .= "\t\t" . '</div>' . "\r\n";
    
    $listing_template .= "\t\t" . '<div class="wpsl-direction-wrap">' . "\r\n";

    if ( !$wpsl_settings['hide_distance'] ) {
        $listing_template .= "\t\t\t"  . '<span class="lnr lnr-map-marker">' . '<%= distance %> ' . '</span>' . esc_html( $wpsl_settings['distance_unit'] ) . ''  . "\r\n";
    }
    $listing_template .= "\t\t\t" . '<%= createDirectionUrl() %>' . "\r\n"; 
    // Check if the 'appointment_url' contains data before including it.
    $listing_template .= "\t\t\t" . '<% if ( appointment_url ) { %>' . "\r\n";
    $listing_template .= "\t\t\t" . '<p><a class="book" target="_blank" href="<%= appointment_url %>">' . __( 'Book a Design Appointment', 'kitgreen' ) . '</a></p>' . "\r\n";
    $listing_template .= "\t\t\t" . '<% } %>' . "\r\n";
    $listing_template .= "\t\t" . '</div>' . "\r\n";
    $listing_template .= '</div>'; 
    $listing_template .= "\t" . '</li>';
    
    
    return $listing_template;
}
?>