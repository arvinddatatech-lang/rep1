"use strict";

/**
 * Blink specific HTML element to set attention to this element.
 *
 * @param {string} element_to_blink		  - class or id of element: '.wpbc_widget_available_unavailable'
 * @param {int} how_many_times			  - 4
 * @param {int} how_long_to_blink		  - 350
 */
function wpbc_blink_element(element_to_blink, how_many_times = 4, how_long_to_blink = 350) {
  for (let i = 0; i < how_many_times; i++) {
    jQuery(element_to_blink).fadeOut(how_long_to_blink).fadeIn(how_long_to_blink);
  }
  jQuery(element_to_blink).animate({
    opacity: 1
  }, 500);
}

/**
 *   Support Functions - Spin Icon in Buttons  ------------------------------------------------------------------ */

/**
 * Remove spin icon from  button and Enable this button.
 *
 * @param button_clicked_element_id		- HTML ID attribute of this button
 * @return string						- CSS classes that was previously in button icon
 */
function wpbc_button__remove_spin(button_clicked_element_id) {
  var previos_classes = '';
  if (undefined != button_clicked_element_id && '' != button_clicked_element_id) {
    var jElement = jQuery('#' + button_clicked_element_id);
    if (jElement.length) {
      previos_classes = wpbc_button_disable_loading_icon(jElement.get(0));
    }
  }
  return previos_classes;
}

/**
 * Show Loading (rotating arrow) icon for button that has been clicked
 *
 * @param this_button		- this object of specific button
 * @return string			- CSS classes that was previously in button icon
 */
function wpbc_button_enable_loading_icon(this_button) {
  var jButton = jQuery(this_button);
  var jIcon = jButton.find('i');
  var previos_classes = jIcon.attr('class');
  jIcon.removeClass().addClass('menu_icon icon-1x wpbc_icn_rotate_right wpbc_spin'); // Set Rotate icon.
  // jIcon.addClass( 'wpbc_animation_pause' );												// Pause animation.
  // jIcon.addClass( 'wpbc_ui_red' );														// Set icon color red.

  jIcon.attr('wpbc_previous_class', previos_classes);
  jButton.addClass('disabled'); // Disable button
  // We need to  set  here attr instead of prop, because for A elements,  attribute 'disabled' do  not added with jButton.prop( "disabled", true );.

  jButton.attr('wpbc_previous_onclick', jButton.attr('onclick')); // Save this value.
  jButton.attr('onclick', ''); // Disable actions "on click".

  return previos_classes;
}

/**
 * Hide Loading (rotating arrow) icon for button that was clicked and show previous icon and enable button
 *
 * @param this_button		- this object of specific button
 * @return string			- CSS classes that was previously in button icon
 */
function wpbc_button_disable_loading_icon(this_button) {
  var jButton = jQuery(this_button);
  var jIcon = jButton.find('i');
  var previos_classes = jIcon.attr('wpbc_previous_class');
  if (undefined != previos_classes && '' != previos_classes) {
    jIcon.removeClass().addClass(previos_classes);
  }
  jButton.removeClass('disabled'); // Remove Disable button.

  var previous_onclick = jButton.attr('wpbc_previous_onclick');
  if (undefined != previous_onclick && '' != previous_onclick) {
    jButton.attr('onclick', previous_onclick);
  }
  return previos_classes;
}

/**
 * On selection  of radio button, adjust attributes of radio container
 *
 * @param _this
 */
function wpbc_ui_el__radio_container_selection(_this) {
  if (jQuery(_this).is(':checked')) {
    jQuery(_this).parents('.wpbc_ui_radio_section').find('.wpbc_ui_radio_container').removeAttr('data-selected');
    jQuery(_this).parents('.wpbc_ui_radio_container:not(.disabled)').attr('data-selected', true);
  }
  if (jQuery(_this).is(':disabled')) {
    jQuery(_this).parents('.wpbc_ui_radio_container').addClass('disabled');
  }
}

/**
 * On click on Radio Container, we will  select  the  radio button    and then adjust attributes of radio container
 *
 * @param _this
 */
function wpbc_ui_el__radio_container_click(_this) {
  if (jQuery(_this).hasClass('disabled')) {
    return false;
  }
  var j_radio = jQuery(_this).find('input[type=radio]:not(.wpbc-form-radio-internal)');
  if (j_radio.length) {
    j_radio.prop('checked', true).trigger('change');
  }
}
"use strict";
// =====================================================================================================================
// == Full Screen  -  support functions   ==
// =====================================================================================================================

/**
 * Check Full  screen mode,  by  removing top tab
 */
function wpbc_check_full_screen_mode() {
  if (jQuery('body').hasClass('wpbc_admin_full_screen')) {
    jQuery('html').removeClass('wp-toolbar');
  } else {
    jQuery('html').addClass('wp-toolbar');
  }
  wpbc_check_buttons_max_min_in_full_screen_mode();
}
function wpbc_check_buttons_max_min_in_full_screen_mode() {
  if (jQuery('body').hasClass('wpbc_admin_full_screen')) {
    jQuery('.wpbc_ui__top_nav__btn_full_screen').addClass('wpbc_ui__hide');
    jQuery('.wpbc_ui__top_nav__btn_normal_screen').removeClass('wpbc_ui__hide');
  } else {
    jQuery('.wpbc_ui__top_nav__btn_full_screen').removeClass('wpbc_ui__hide');
    jQuery('.wpbc_ui__top_nav__btn_normal_screen').addClass('wpbc_ui__hide');
  }
}
jQuery(document).ready(function () {
  wpbc_check_full_screen_mode();
});
/**
 * Checkbox Selection functions for Listing.
 */

/**
 * Selections of several  checkboxes like in gMail with shift :)
 * Need to  have this structure:
 * .wpbc_selectable_table
 *      .wpbc_selectable_head
 *              .check-column
 *                  :checkbox
 *      .wpbc_selectable_body
 *          .wpbc_row
 *              .check-column
 *                  :checkbox
 *      .wpbc_selectable_foot
 *              .check-column
 *                  :checkbox
 */
function wpbc_define_gmail_checkbox_selection($) {
  var checks,
    first,
    last,
    checked,
    sliced,
    lastClicked = false;

  // Check all checkboxes.
  $('.wpbc_selectable_body').find('.check-column').find(':checkbox').on('click', function (e) {
    if ('undefined' == e.shiftKey) {
      return true;
    }
    if (e.shiftKey) {
      if (!lastClicked) {
        return true;
      }
      checks = $(lastClicked).closest('.wpbc_selectable_body').find(':checkbox').filter(':visible:enabled');
      first = checks.index(lastClicked);
      last = checks.index(this);
      checked = $(this).prop('checked');
      if (0 < first && 0 < last && first != last) {
        sliced = last > first ? checks.slice(first, last) : checks.slice(last, first);
        sliced.prop('checked', function () {
          if ($(this).closest('.wpbc_row').is(':visible')) {
            return checked;
          }
          return false;
        }).trigger('change');
      }
    }
    lastClicked = this;

    // toggle "check all" checkboxes.
    var unchecked = $(this).closest('.wpbc_selectable_body').find(':checkbox').filter(':visible:enabled').not(':checked');
    $(this).closest('.wpbc_selectable_table').children('.wpbc_selectable_head, .wpbc_selectable_foot').find(':checkbox').prop('checked', function () {
      return 0 === unchecked.length;
    }).trigger('change');
    return true;
  });

  // Head || Foot clicking to  select / deselect ALL.
  $('.wpbc_selectable_head, .wpbc_selectable_foot').find('.check-column :checkbox').on('click', function (event) {
    var $this = $(this),
      $table = $this.closest('.wpbc_selectable_table'),
      controlChecked = $this.prop('checked'),
      toggle = event.shiftKey || $this.data('wp-toggle');
    $table.children('.wpbc_selectable_body').filter(':visible').find('.check-column').find(':checkbox').prop('checked', function () {
      if ($(this).is(':hidden,:disabled')) {
        return false;
      }
      if (toggle) {
        return !$(this).prop('checked');
      } else if (controlChecked) {
        return true;
      }
      return false;
    }).trigger('change');
    $table.children('.wpbc_selectable_head,  .wpbc_selectable_foot').filter(':visible').find('.check-column').find(':checkbox').prop('checked', function () {
      if (toggle) {
        return false;
      } else if (controlChecked) {
        return true;
      }
      return false;
    });
  });

  // Visually  show selected border.
  $('.wpbc_selectable_body').find('.check-column :checkbox').on('change', function (event) {
    if (jQuery(this).is(':checked')) {
      jQuery(this).closest('.wpbc_list_row').addClass('row_selected_color');
    } else {
      jQuery(this).closest('.wpbc_list_row').removeClass('row_selected_color');
    }

    // Disable text selection while pressing 'shift'.
    document.getSelection().removeAllRanges();

    // Show or hide buttons on Actions toolbar  at  Booking Listing  page,  if we have some selected bookings.
    wpbc_show_hide_action_buttons_for_selected_bookings();
  });
  wpbc_show_hide_action_buttons_for_selected_bookings();
}

/**
 * Get ID array  of selected elements
 */
function wpbc_get_selected_row_id() {
  var $table = jQuery('.wpbc__wrap__booking_listing .wpbc_selectable_table');
  var checkboxes = $table.children('.wpbc_selectable_body').filter(':visible').find('.check-column').find(':checkbox');
  var selected_id = [];
  jQuery.each(checkboxes, function (key, checkbox) {
    if (jQuery(checkbox).is(':checked')) {
      var element_id = wpbc_get_row_id_from_element(checkbox);
      selected_id.push(element_id);
    }
  });
  return selected_id;
}

/**
 * Get ID of row,  based on clciked element
 *
 * @param this_inbound_element  - ususlly  this
 * @returns {number}
 */
function wpbc_get_row_id_from_element(this_inbound_element) {
  var element_id = jQuery(this_inbound_element).closest('.wpbc_listing_usual_row').attr('id');
  element_id = parseInt(element_id.replace('row_id_', ''));
  return element_id;
}

/**
 * == Booking Listing == Show or hide buttons on Actions toolbar  at    page,  if we have some selected bookings.
 */
function wpbc_show_hide_action_buttons_for_selected_bookings() {
  var selected_rows_arr = wpbc_get_selected_row_id();
  if (selected_rows_arr.length > 0) {
    jQuery('.hide_button_if_no_selection').show();
  } else {
    jQuery('.hide_button_if_no_selection').hide();
  }
}
"use strict";
// =====================================================================================================================
// == Left Bar  -  expand / colapse functions   ==
// =====================================================================================================================

/**
 * Expand Vertical Left Bar.
 */
function wpbc_admin_ui__sidebar_left__do_max() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min max compact none');
  jQuery('.wpbc_settings_page_wrapper').addClass('max');
  jQuery('.wpbc_ui__top_nav__btn_open_left_vertical_nav').addClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_left_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wp-admin').removeClass('wpbc_page_wrapper_left_min wpbc_page_wrapper_left_max wpbc_page_wrapper_left_compact wpbc_page_wrapper_left_none');
  jQuery('.wp-admin').addClass('wpbc_page_wrapper_left_max');
}

/**
 * Hide Vertical Left Bar.
 */
function wpbc_admin_ui__sidebar_left__do_min() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min max compact none');
  jQuery('.wpbc_settings_page_wrapper').addClass('min');
  jQuery('.wpbc_ui__top_nav__btn_open_left_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_left_vertical_nav').addClass('wpbc_ui__hide');
  jQuery('.wp-admin').removeClass('wpbc_page_wrapper_left_min wpbc_page_wrapper_left_max wpbc_page_wrapper_left_compact wpbc_page_wrapper_left_none');
  jQuery('.wp-admin').addClass('wpbc_page_wrapper_left_min');
}

/**
 * Colapse Vertical Left Bar.
 */
function wpbc_admin_ui__sidebar_left__do_compact() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min max compact none');
  jQuery('.wpbc_settings_page_wrapper').addClass('compact');
  jQuery('.wpbc_ui__top_nav__btn_open_left_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_left_vertical_nav').addClass('wpbc_ui__hide');
  jQuery('.wp-admin').removeClass('wpbc_page_wrapper_left_min wpbc_page_wrapper_left_max wpbc_page_wrapper_left_compact wpbc_page_wrapper_left_none');
  jQuery('.wp-admin').addClass('wpbc_page_wrapper_left_compact');
}

/**
 * Completely Hide Vertical Left Bar.
 */
function wpbc_admin_ui__sidebar_left__do_hide() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min max compact none');
  jQuery('.wpbc_settings_page_wrapper').addClass('none');
  jQuery('.wpbc_ui__top_nav__btn_open_left_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_left_vertical_nav').addClass('wpbc_ui__hide');
  // Hide top "Menu" button with divider.
  jQuery('.wpbc_ui__top_nav__btn_show_left_vertical_nav,.wpbc_ui__top_nav__btn_show_left_vertical_nav_divider').addClass('wpbc_ui__hide');
  jQuery('.wp-admin').removeClass('wpbc_page_wrapper_left_min wpbc_page_wrapper_left_max wpbc_page_wrapper_left_compact wpbc_page_wrapper_left_none');
  jQuery('.wp-admin').addClass('wpbc_page_wrapper_left_none');
}

/**
 * Action on click "Go Back" - show root menu
 * or some other section in left sidebar.
 *
 * @param string menu_to_show - menu slug.
 */
function wpbc_admin_ui__sidebar_left__show_section(menu_to_show) {
  jQuery('.wpbc_ui_el__vert_left_bar__section').addClass('wpbc_ui__hide');
  jQuery('.wpbc_ui_el__vert_left_bar__section_' + menu_to_show).removeClass('wpbc_ui__hide');
}

// =====================================================================================================================
// == Right Side Bar  -  expand / colapse functions   ==
// =====================================================================================================================

/**
 * Expand Vertical Right Bar.
 */
function wpbc_admin_ui__sidebar_right__do_max() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min_right max_right compact_right none_right');
  jQuery('.wpbc_settings_page_wrapper').addClass('max_right');
  jQuery('.wpbc_ui__top_nav__btn_open_right_vertical_nav').addClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_right_vertical_nav').removeClass('wpbc_ui__hide');
}

/**
 * Hide Vertical Right Bar.
 */
function wpbc_admin_ui__sidebar_right__do_min() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min_right max_right compact_right none_right');
  jQuery('.wpbc_settings_page_wrapper').addClass('min_right');
  jQuery('.wpbc_ui__top_nav__btn_open_right_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_right_vertical_nav').addClass('wpbc_ui__hide');
}

/**
 * Colapse Vertical Right Bar.
 */
function wpbc_admin_ui__sidebar_right__do_compact() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min_right max_right compact_right none_right');
  jQuery('.wpbc_settings_page_wrapper').addClass('compact_right');
  jQuery('.wpbc_ui__top_nav__btn_open_right_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_right_vertical_nav').addClass('wpbc_ui__hide');
}

/**
 * Completely Hide Vertical Right Bar.
 */
function wpbc_admin_ui__sidebar_right__do_hide() {
  jQuery('.wpbc_settings_page_wrapper').removeClass('min_right max_right compact_right none_right');
  jQuery('.wpbc_settings_page_wrapper').addClass('none_right');
  jQuery('.wpbc_ui__top_nav__btn_open_right_vertical_nav').removeClass('wpbc_ui__hide');
  jQuery('.wpbc_ui__top_nav__btn_hide_right_vertical_nav').addClass('wpbc_ui__hide');
  // Hide top "Menu" button with divider.
  jQuery('.wpbc_ui__top_nav__btn_show_right_vertical_nav,.wpbc_ui__top_nav__btn_show_right_vertical_nav_divider').addClass('wpbc_ui__hide');
}

/**
 * Action on click "Go Back" - show root menu
 * or some other section in right sidebar.
 *
 * @param string menu_to_show - menu slug.
 */
function wpbc_admin_ui__sidebar_right__show_section(menu_to_show) {
  jQuery('.wpbc_ui_el__vert_right_bar__section').addClass('wpbc_ui__hide');
  jQuery('.wpbc_ui_el__vert_right_bar__section_' + menu_to_show).removeClass('wpbc_ui__hide');
}

// =====================================================================================================================
// == End Right Side Bar  section   ==
// =====================================================================================================================

/**
 * Get anchor(s) array  from  URL.
 * Doc: https://developer.mozilla.org/en-US/docs/Web/API/Location
 *
 * @returns {*[]}
 */
function wpbc_url_get_anchors_arr() {
  var hashes = window.location.hash.replace('%23', '#');
  var hashes_arr = hashes.split('#');
  var result = [];
  var hashes_arr_length = hashes_arr.length;
  for (var i = 0; i < hashes_arr_length; i++) {
    if (hashes_arr[i].length > 0) {
      result.push(hashes_arr[i]);
    }
  }
  return result;
}

/**
 * Auto Expand Settings section based on URL anchor, after  page loaded.
 */
jQuery(document).ready(function () {
  wpbc_admin_ui__do_expand_section();
  setTimeout('wpbc_admin_ui__do_expand_section', 10);
});
jQuery(document).ready(function () {
  wpbc_admin_ui__do_expand_section();
  setTimeout('wpbc_admin_ui__do_expand_section', 150);
});

/**
 * Expand section in  General Settings page and select Menu item.
 */
function wpbc_admin_ui__do_expand_section() {
  // window.location.hash  = #section_id  /  doc: https://developer.mozilla.org/en-US/docs/Web/API/Location .
  var anchors_arr = wpbc_url_get_anchors_arr();
  var anchors_arr_length = anchors_arr.length;
  if (anchors_arr_length > 0) {
    var one_anchor_prop_value = anchors_arr[0].split('do_expand__');
    if (one_anchor_prop_value.length > 1) {
      // 'wpbc_general_settings_calendar_metabox'
      var section_to_show = one_anchor_prop_value[1];
      var section_id_to_show = '#' + section_to_show;

      // -- Remove selected background in all left  menu  items ---------------------------------------------------
      jQuery('.wpbc_ui_el__vert_nav_item ').removeClass('active');
      // Set left menu selected.
      jQuery('.do_expand__' + section_to_show + '_link').addClass('active');
      var selected_title = jQuery('.do_expand__' + section_to_show + '_link a .wpbc_ui_el__vert_nav_title ').text();

      // Expand section, if it colapsed.
      if (!jQuery('.do_expand__' + section_to_show + '_link').parents('.wpbc_ui_el__level__folder').hasClass('expanded')) {
        jQuery('.wpbc_ui_el__level__folder').removeClass('expanded');
        jQuery('.do_expand__' + section_to_show + '_link').parents('.wpbc_ui_el__level__folder').addClass('expanded');
      }

      // -- Expand section ---------------------------------------------------------------------------------------
      var container_to_hide_class = '.postbox';
      // Hide sections '.postbox' in admin page and show specific one.
      jQuery('.wpbc_admin_page ' + container_to_hide_class).hide();
      jQuery('.wpbc_container_always_hide__on_left_nav_click').hide();
      jQuery(section_id_to_show).show();

      // Show all other sections,  if provided in URL: ..?page=wpbc-settings#do_expand__wpbc_general_settings_capacity_metabox#wpbc_general_settings_capacity_upgrade_metabox .
      for (let i = 1; i < anchors_arr_length; i++) {
        jQuery('#' + anchors_arr[i]).show();
      }
      if (false) {
        var targetOffset = wpbc_scroll_to(section_id_to_show);
      }

      // -- Set Value to Input about selected Nav element  ---------------------------------------------------------------       // FixIn: 9.8.6.1.
      var section_id_tab = section_id_to_show.substring(0, section_id_to_show.length - 8) + '_tab';
      if (container_to_hide_class == section_id_to_show) {
        section_id_tab = '#wpbc_general_settings_all_tab';
      }
      if ('#wpbc_general_settings_capacity_metabox,#wpbc_general_settings_capacity_upgrade_metabox' == section_id_to_show) {
        section_id_tab = '#wpbc_general_settings_capacity_tab';
      }
      jQuery('#form_visible_section').val(section_id_tab);
    }

    // Like blinking some elements.
    wpbc_admin_ui__do__anchor__another_actions();
  }
}
function wpbc_admin_ui__is_in_mobile_screen_size() {
  return wpbc_admin_ui__is_in_this_screen_size(605);
}
function wpbc_admin_ui__is_in_this_screen_size(size) {
  return window.screen.width <= size;
}

/**
 * Open settings page  |  Expand section  |  Select Menu item.
 */
function wpbc_admin_ui__do__open_url__expand_section(url, section_id) {
  // window.location.href = url + '&do_expand=' + section_id + '#do_expand__' + section_id; //.
  window.location.href = url + '#do_expand__' + section_id;
  if (wpbc_admin_ui__is_in_mobile_screen_size()) {
    wpbc_admin_ui__sidebar_left__do_min();
  }
  wpbc_admin_ui__do_expand_section();
}

/**
 * Check  for Other actions:  Like blinking some elements in settings page. E.g. Days selection  or  change-over days.
 */
function wpbc_admin_ui__do__anchor__another_actions() {
  var anchors_arr = wpbc_url_get_anchors_arr();
  var anchors_arr_length = anchors_arr.length;

  // Other actions:  Like blinking some elements.
  for (var i = 0; i < anchors_arr_length; i++) {
    var this_anchor = anchors_arr[i];
    var this_anchor_prop_value = this_anchor.split('do_other_actions__');
    if (this_anchor_prop_value.length > 1) {
      var section_action = this_anchor_prop_value[1];
      switch (section_action) {
        case 'blink_day_selections':
          // wpbc_ui_settings__panel__click( '#wpbc_general_settings_calendar_tab a', '#wpbc_general_settings_calendar_metabox', 'Days Selection' );.
          wpbc_blink_element('.wpbc_tr_set_gen_booking_type_of_day_selections', 4, 350);
          wpbc_scroll_to('.wpbc_tr_set_gen_booking_type_of_day_selections');
          break;
        case 'blink_change_over_days':
          // wpbc_ui_settings__panel__click( '#wpbc_general_settings_calendar_tab a', '#wpbc_general_settings_calendar_metabox', 'Changeover Days' );.
          wpbc_blink_element('.wpbc_tr_set_gen_booking_range_selection_time_is_active', 4, 350);
          wpbc_scroll_to('.wpbc_tr_set_gen_booking_range_selection_time_is_active');
          break;
        case 'blink_captcha':
          wpbc_blink_element('.wpbc_tr_set_gen_booking_is_use_captcha', 4, 350);
          wpbc_scroll_to('.wpbc_tr_set_gen_booking_is_use_captcha');
          break;
        default:
      }
    }
  }
}
/**
 * Copy txt to clipbrd from Text fields.
 *
 * @param html_element_id  - e.g. 'data_field'
 * @returns {boolean}
 */
function wpbc_copy_text_to_clipbrd_from_element(html_element_id) {
  // Get the text field.
  var copyText = document.getElementById(html_element_id);

  // Select the text field.
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices.

  // Copy the text inside the text field.
  var is_copied = wpbc_copy_text_to_clipbrd(copyText.value);
  if (!is_copied) {
    console.error('Oops, unable to copy', copyText.value);
  }
  return is_copied;
}

/**
 * Copy txt to clipbrd.
 *
 * @param text
 * @returns {boolean}
 */
function wpbc_copy_text_to_clipbrd(text) {
  if (!navigator.clipboard) {
    return wpbc_fallback_copy_text_to_clipbrd(text);
  }
  navigator.clipboard.writeText(text).then(function () {
    // console.log( 'Async: Copying to clipboard was successful!' );.
    return true;
  }, function (err) {
    // console.error( 'Async: Could not copy text: ', err );.
    return false;
  });
}

/**
 * Copy txt to clipbrd - depricated method.
 *
 * @param text
 * @returns {boolean}
 */
function wpbc_fallback_copy_text_to_clipbrd(text) {
  // -----------------------------------------------------------------------------------------------------------------
  // var textArea   = document.createElement( "textarea" );
  // textArea.value = text;
  //
  // // Avoid scrolling to bottom.
  // textArea.style.top      = "0";
  // textArea.style.left     = "0";
  // textArea.style.position = "fixed";
  // textArea.style.zIndex   = "999999999";
  // document.body.appendChild( textArea );
  // textArea.focus();
  // textArea.select();

  // -----------------------------------------------------------------------------------------------------------------
  // Now get it as HTML  (original here https://stackoverflow.com/questions/34191780/javascript-copy-string-to-clipboard-as-text-html ).

  // [1] - Create container for the HTML.
  var container = document.createElement('div');
  container.innerHTML = text;

  // [2] - Hide element.
  container.style.position = 'fixed';
  container.style.pointerEvents = 'none';
  container.style.opacity = 0;

  // Detect all style sheets of the page.
  var activeSheets = Array.prototype.slice.call(document.styleSheets).filter(function (sheet) {
    return !sheet.disabled;
  });

  // [3] - Mount the container to the DOM to make `contentWindow` available.
  document.body.appendChild(container);

  // [4] - Copy to clipboard.
  window.getSelection().removeAllRanges();
  var range = document.createRange();
  range.selectNode(container);
  window.getSelection().addRange(range);
  // -----------------------------------------------------------------------------------------------------------------

  var result = false;
  try {
    result = document.execCommand('copy');
    // console.log( 'Fallback: Copying text command was ' + msg ); //.
  } catch (err) {
    // console.error( 'Fallback: Oops, unable to copy', err ); //.
  }
  // document.body.removeChild( textArea ); //.

  // [5.4] - Enable CSS.
  var activeSheets_length = activeSheets.length;
  for (var i = 0; i < activeSheets_length; i++) {
    activeSheets[i].disabled = false;
  }

  // [6] - Remove the container
  document.body.removeChild(container);
  return result;
}
/**
 * WPBC Collapsible Groups
 *
 * Universal, dependency-free controller for expanding/collapsing grouped sections in right-side panels (Inspector/Library/Form Settings, or any other WPBC page).
 *
 * 		=== How to use it (quick) ? ===
 *
 *		-- 1. Markup (independent mode: multiple open allowed) --
 *			<div class="wpbc_collapsible">
 *			  <section class="wpbc_ui__collapsible_group is-open">
 *				<button type="button" class="group__header"><h3>General</h3></button>
 *				<div class="group__fields">…</div>
 *			  </section>
 *			  <section class="wpbc_ui__collapsible_group">
 *				<button type="button" class="group__header"><h3>Advanced</h3></button>
 *				<div class="group__fields">…</div>
 *			  </section>
 *			</div>
 *
 *		-- 2. Exclusive/accordion mode (one open at a time) --
 *			<div class="wpbc_collapsible wpbc_collapsible--exclusive">…</div>
 *
 *		-- 3. Auto-init --
 *			The script auto-initializes on DOMContentLoaded. No extra code needed.
 *
 *		-- 4. Programmatic control (optional)
 *			const root = document.querySelector('#wpbc_bfb__inspector');
 *			const api  = root.__wpbc_collapsible_instance; // set by auto-init
 *
 *			api.open_by_heading('Validation'); // open by heading text
 *			api.open_by_index(0);              // open the first group
 *
 *		-- 5.Listen to events (e.g., to persist “open group” state) --
 *			root.addEventListener('wpbc:collapsible:open',  (e) => { console.log(  e.detail.group ); });
 *			root.addEventListener('wpbc:collapsible:close', (e) => { console.log(  e.detail.group ); });
 *
 *
 *
 * Markup expectations (minimal):
 *  <div class="wpbc_collapsible [wpbc_collapsible--exclusive]">
 *    <section class="wpbc_ui__collapsible_group [is-open]">
 *      <button type="button" class="group__header"> ... </button>
 *      <div class="group__fields"> ... </div>
 *    </section>
 *    ... more <section> ...
 *  </div>
 *
 * Notes:
 *  - Add `is-open` to any section you want initially expanded.
 *  - Add `wpbc_collapsible--exclusive` to the container for "open one at a time" behavior.
 *  - Works with your existing BFB markup (classes used there are the defaults).
 *
 * Accessibility:
 *  - Sets aria-expanded on .group__header
 *  - Sets aria-hidden + [hidden] on .group__fields
 *  - ArrowUp/ArrowDown move focus between headers; Enter/Space toggles
 *
 * Events (bubbles from the <section>):
 *  - 'wpbc:collapsible:open'  (detail: { group, root, instance })
 *  - 'wpbc:collapsible:close' (detail: { group, root, instance })
 *
 * Public API (instance methods):
 *  - init(), destroy(), refresh()
 *  - expand(group, [exclusive]), collapse(group), toggle(group)
 *  - open_by_index(index), open_by_heading(text)
 *  - is_exclusive(), is_open(group)
 *
 * @version 2025-08-26
 * @since 2025-08-26
 */
// ---------------------------------------------------------------------------------------------------------------------
// == File  /collapsible_groups.js == Time point: 2025-08-26 14:13
// ---------------------------------------------------------------------------------------------------------------------
(function (w, d) {
  'use strict';

  class WPBC_Collapsible_Groups {
    /**
     * Create a collapsible controller for a container.
     *
     * @param {HTMLElement|string} root_el
     *        The container element (or CSS selector) that wraps collapsible groups.
     *        The container usually has the class `.wpbc_collapsible`.
     * @param {Object} [opts={}]
     * @param {string}  [opts.group_selector='.wpbc_ui__collapsible_group']
     *        Selector for each collapsible group inside the container.
     * @param {string}  [opts.header_selector='.group__header']
     *        Selector for the clickable header inside a group.
     * @param {string}  [opts.fields_selector='.group__fields']
     *        Selector for the content/panel element inside a group.
     * @param {string}  [opts.open_class='is-open']
     *        Class name that indicates the group is open.
     * @param {boolean} [opts.exclusive=false]
     *        If true, only one group can be open at a time in this container.
     *
     * @constructor
     * @since 2025-08-26
     */
    constructor(root_el, opts = {}) {
      this.root = typeof root_el === 'string' ? d.querySelector(root_el) : root_el;
      this.opts = Object.assign({
        group_selector: '.wpbc_ui__collapsible_group',
        header_selector: '.group__header',
        fields_selector: '.group__fields,.group__content',
        open_class: 'is-open',
        exclusive: false
      }, opts);

      // Bound handlers (for add/removeEventListener symmetry).
      /** @private */
      this._on_click = this._on_click.bind(this);
      /** @private */
      this._on_keydown = this._on_keydown.bind(this);

      /** @type {HTMLElement[]} @private */
      this._groups = [];
      /** @type {MutationObserver|null} @private */
      this._observer = null;
    }

    /**
     * Initialize the controller: cache groups, attach listeners, set ARIA,
     * and start observing DOM changes inside the container.
     *
     * @returns {WPBC_Collapsible_Groups} The instance (chainable).
     * @listens click
     * @listens keydown
     * @since 2025-08-26
     */
    init() {
      if (!this.root) {
        return this;
      }
      this._groups = Array.prototype.slice.call(this.root.querySelectorAll(this.opts.group_selector));
      this.root.addEventListener('click', this._on_click, false);
      this.root.addEventListener('keydown', this._on_keydown, false);

      // Observe dynamic inserts/removals (Inspector re-renders).
      this._observer = new MutationObserver(() => {
        this.refresh();
      });
      this._observer.observe(this.root, {
        childList: true,
        subtree: true
      });
      this._sync_all_aria();
      return this;
    }

    /**
     * Tear down the controller: detach listeners, stop the observer,
     * and drop internal references.
     *
     * @returns {void}
     * @since 2025-08-26
     */
    destroy() {
      if (!this.root) {
        return;
      }
      this.root.removeEventListener('click', this._on_click, false);
      this.root.removeEventListener('keydown', this._on_keydown, false);
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      this._groups = [];
    }

    /**
     * Re-scan the DOM for current groups and re-apply ARIA to all of them.
     * Useful after dynamic (re)renders.
     *
     * @returns {void}
     * @since 2025-08-26
     */
    refresh() {
      if (!this.root) {
        return;
      }
      this._groups = Array.prototype.slice.call(this.root.querySelectorAll(this.opts.group_selector));
      this._sync_all_aria();
    }

    /**
     * Check whether the container is in exclusive (accordion) mode.
     *
     * Order of precedence:
     *  1) Explicit option `opts.exclusive`
     *  2) Container has class `.wpbc_collapsible--exclusive`
     *  3) Container matches `[data-wpbc-accordion="exclusive"]`
     *
     * @returns {boolean} True if exclusive mode is active.
     * @since 2025-08-26
     */
    is_exclusive() {
      return !!(this.opts.exclusive || this.root.classList.contains('wpbc_collapsible--exclusive') || this.root.matches('[data-wpbc-accordion="exclusive"]'));
    }

    /**
     * Determine whether a specific group is open.
     *
     * @param {HTMLElement} group The group element to test.
     * @returns {boolean} True if the group is currently open.
     * @since 2025-08-26
     */
    is_open(group) {
      return group.classList.contains(this.opts.open_class);
    }

    /**
     * Open a group. Honors exclusive mode by collapsing all sibling groups
     * (queried from the live DOM at call-time).
     *
     * @param {HTMLElement} group The group element to open.
     * @param {boolean} [exclusive]
     *        If provided, overrides container mode for this action only.
     * @returns {void}
     * @fires CustomEvent#wpbc:collapsible:open
     * @since 2025-08-26
     */
    expand(group, exclusive) {
      if (!group) {
        return;
      }
      const do_exclusive = typeof exclusive === 'boolean' ? exclusive : this.is_exclusive();
      if (do_exclusive) {
        // Always use the live DOM, not the cached list.
        Array.prototype.forEach.call(this.root.querySelectorAll(this.opts.group_selector), g => {
          if (g !== group) {
            this._set_open(g, false);
          }
        });
      }
      this._set_open(group, true);
    }

    /**
     * Close a group.
     *
     * @param {HTMLElement} group The group element to close.
     * @returns {void}
     * @fires CustomEvent#wpbc:collapsible:close
     * @since 2025-08-26
     */
    collapse(group) {
      if (!group) {
        return;
      }
      this._set_open(group, false);
    }

    /**
     * Toggle a group's open/closed state.
     *
     * @param {HTMLElement} group The group element to toggle.
     * @returns {void}
     * @since 2025-08-26
     */
    toggle(group) {
      if (!group) {
        return;
      }
      this[this.is_open(group) ? 'collapse' : 'expand'](group);
    }

    /**
     * Open a group by its index within the container (0-based).
     *
     * @param {number} index Zero-based index of the group.
     * @returns {void}
     * @since 2025-08-26
     */
    open_by_index(index) {
      const group = this._groups[index];
      if (group) {
        this.expand(group);
      }
    }

    /**
     * Open a group by matching text contained within the <h3> inside the header.
     * The comparison is case-insensitive and substring-based.
     *
     * @param {string} text Text to match against the heading contents.
     * @returns {void}
     * @since 2025-08-26
     */
    open_by_heading(text) {
      if (!text) {
        return;
      }
      const t = String(text).toLowerCase();
      const match = this._groups.find(g => {
        const h = g.querySelector(this.opts.header_selector + ' h3');
        return h && h.textContent.toLowerCase().indexOf(t) !== -1;
      });
      if (match) {
        this.expand(match);
      }
    }

    // -------------------------------------------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------------------------------------------

    /**
     * Delegated click handler for headers.
     *
     * @private
     * @param {MouseEvent} ev The click event.
     * @returns {void}
     * @since 2025-08-26
     */
    _on_click(ev) {
      const btn = ev.target.closest(this.opts.header_selector);
      if (!btn || !this.root.contains(btn)) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      const group = btn.closest(this.opts.group_selector);
      if (group) {
        this.toggle(group);
      }
    }

    /**
     * Keyboard handler for header interactions and roving focus:
     *  - Enter/Space toggles the active group.
     *  - ArrowUp/ArrowDown moves focus between group headers.
     *
     * @private
     * @param {KeyboardEvent} ev The keyboard event.
     * @returns {void}
     * @since 2025-08-26
     */
    _on_keydown(ev) {
      const btn = ev.target.closest(this.opts.header_selector);
      if (!btn) {
        return;
      }
      const key = ev.key;

      // Toggle on Enter / Space.
      if (key === 'Enter' || key === ' ') {
        ev.preventDefault();
        const group = btn.closest(this.opts.group_selector);
        if (group) {
          this.toggle(group);
        }
        return;
      }

      // Move focus with ArrowUp/ArrowDown between headers in this container.
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        ev.preventDefault();
        const headers = Array.prototype.map.call(this.root.querySelectorAll(this.opts.group_selector), g => g.querySelector(this.opts.header_selector)).filter(Boolean);
        const idx = headers.indexOf(btn);
        if (idx !== -1) {
          const next_idx = key === 'ArrowDown' ? Math.min(headers.length - 1, idx + 1) : Math.max(0, idx - 1);
          headers[next_idx].focus();
        }
      }
    }

    /**
     * Apply ARIA synchronization to all known groups based on their open state.
     *
     * @private
     * @returns {void}
     * @since 2025-08-26
     */
    _sync_all_aria() {
      this._groups.forEach(g => this._sync_group_aria(g));
    }

    /**
     * Sync ARIA attributes and visibility on a single group.
     *
     * @private
     * @param {HTMLElement} group The group element to sync.
     * @returns {void}
     * @since 2025-08-26
     */
    _sync_group_aria(group) {
      const is_open = this.is_open(group);
      const header = group.querySelector(this.opts.header_selector);
      // Only direct children that match.
      const panels = Array.prototype.filter.call(group.children, el => el.matches(this.opts.fields_selector));

      // Header ARIA.
      if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', is_open ? 'true' : 'false');
        if (panels.length) {
          // Ensure each panel has an id; then wire aria-controls with space-separated ids.
          const ids = panels.map(p => {
            if (!p.id) p.id = this._generate_id('wpbc_collapsible_panel');
            return p.id;
          });
          header.setAttribute('aria-controls', ids.join(' '));
        }
      }

      // (3) Panels ARIA + visibility.
      panels.forEach(p => {
        p.hidden = !is_open; // actual visibility.
        p.setAttribute('aria-hidden', is_open ? 'false' : 'true'); // ARIA.
      });
    }

    /**
     * Internal state change: set a group's open/closed state, sync ARIA,
     * manage focus on collapse, and emit a custom event.
     *
     * @private
     * @param {HTMLElement} group The group element to mutate.
     * @param {boolean} open Whether the group should be open.
     * @returns {void}
     * @fires CustomEvent#wpbc:collapsible:open
     * @fires CustomEvent#wpbc:collapsible:close
     * @since 2025-08-26
     */
    _set_open(group, open) {
      if (!open && group.contains(document.activeElement)) {
        const header = group.querySelector(this.opts.header_selector);
        header && header.focus();
      }
      group.classList.toggle(this.opts.open_class, open);
      this._sync_group_aria(group);
      const ev_name = open ? 'wpbc:collapsible:open' : 'wpbc:collapsible:close';
      group.dispatchEvent(new CustomEvent(ev_name, {
        bubbles: true,
        detail: {
          group,
          root: this.root,
          instance: this
        }
      }));
    }

    /**
     * Generate a unique DOM id with the specified prefix.
     *
     * @private
     * @param {string} prefix The id prefix to use.
     * @returns {string} A unique element id not present in the document.
     * @since 2025-08-26
     */
    _generate_id(prefix) {
      let i = 1;
      let id;
      do {
        id = prefix + '_' + i++;
      } while (d.getElementById(id));
      return id;
    }
  }

  /**
   * Auto-initialize collapsible controllers on the page.
   * Finds top-level `.wpbc_collapsible` containers (ignoring nested ones),
   * and instantiates {@link WPBC_Collapsible_Groups} on each.
   *
   * @function WPBC_Collapsible_AutoInit
   * @returns {void}
   * @since 2025-08-26
   * @example
   * // Runs automatically on DOMContentLoaded; can also be called manually:
   * WPBC_Collapsible_AutoInit();
   */
  function wpbc_collapsible__auto_init() {
    var ROOT = '.wpbc_collapsible';
    var nodes = Array.prototype.slice.call(d.querySelectorAll(ROOT)).filter(function (n) {
      return !n.parentElement || !n.parentElement.closest(ROOT);
    });
    nodes.forEach(function (node) {
      if (node.__wpbc_collapsible_instance) {
        return;
      }
      var exclusive = node.classList.contains('wpbc_collapsible--exclusive') || node.matches('[data-wpbc-accordion="exclusive"]');
      node.__wpbc_collapsible_instance = new WPBC_Collapsible_Groups(node, {
        exclusive
      }).init();
    });
  }

  // Export to global for manual control if needed.
  w.WPBC_Collapsible_Groups = WPBC_Collapsible_Groups;
  w.WPBC_Collapsible_AutoInit = wpbc_collapsible__auto_init;

  // DOM-ready auto init.
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', wpbc_collapsible__auto_init, {
      once: true
    });
  } else {
    wpbc_collapsible__auto_init();
  }
})(window, document);

/**
 * Booking Calendar — Generic UI Tabs Utility (JS)
 *
 * Purpose: Lightweight, dependency-free tabs controller for any small tab group in admin UIs.
 * - Auto-initializes groups marked with data-wpbc-tabs.
 * - Assigns ARIA roles and toggles aria-selected/aria-hidden/tabindex.
 * - Supports keyboard navigation (Left/Right/Home/End).
 * - Public API: window.wpbc_ui_tabs.{init_on, init_group, set_active}
 * - Emits 'wpbc:tabs:change' on the group root when the active tab changes.
 *
 * Markup contract:
 * - Root:   [data-wpbc-tabs]
 * - Tabs:   [data-wpbc-tab-key="K"]
 * - Panels: [data-wpbc-tab-panel="K"]
 *
 * @package   Booking Calendar
 * @subpackage Admin\UI
 * @since     11.0.0
 * @version   1.0.0
 * @see       /includes/__js/admin/ui_tabs/ui_tabs.js
 *
 *
 * How it works:
 * - Root node must have [data-wpbc-tabs] attribute (any value).
 * - Tab buttons must carry [data-wpbc-tab-key="..."] (unique per group).
 * - Panels must carry [data-wpbc-tab-panel="..."] with matching keys.
 * - Adds WAI-ARIA roles and aria-selected/hidden wiring.
 *
 * <div data-wpbc-tabs="column-styles" data-wpbc-tab-active="1"    class="wpbc_ui_tabs_root" >
 *    <!-- Top Tabs -->
 *    <div data-wpbc-tablist="" role="tablist"                    class=" wpbc_ui_el__horis_top_bar__wrapper" >
 *        <div class="wpbc_ui_el__horis_top_bar__content">
 *            <h2 class="wpbc_ui_el__horis_nav_label">Column:</h2>
 *
 *            <div class="wpbc_ui_el__horis_nav_item wpbc_ui_el__horis_nav_item__1">
 *                <a
 *                    data-wpbc-tab-key="1"
 *                    aria-selected="true" role="tab" tabindex="0" aria-controls="wpbc_tab_panel_col_1"
 *
 *                        href="javascript:void(0);"
 *                        class="wpbc_ui_el__horis_nav_item__a wpbc_ui_el__horis_nav_item__single"
 *                        id="wpbc_tab_col_1"
 *                        title="Column 1"
 *                ><span class="wpbc_ui_el__horis_nav_title">Title 1</span></a>
 *            </div>
 *            ...
 *        </div>
 *    </div>
 *    <!-- Tabs Content -->
 *    <div class="wpbc_tab__panel group__fields" data-wpbc-tab-panel="1" id="wpbc_tab_panel_col_1" role="tabpanel" aria-labelledby="wpbc_tab_col_1">
 *        ...
 *    </div>
 *    ...
 * </div>
 *
 * Public API:
 *   - wpbc_ui_tabs.init_on(root_or_selector)   // find and init groups within a container
 *   - wpbc_ui_tabs.init_group(root_el)         // init a single group root
 *   - wpbc_ui_tabs.set_active(root_el, key)    // programmatically change active tab
 *
 * Events:
 *   - Dispatches CustomEvent 'wpbc:tabs:change' on root when tab changes:
 *       detail: { active_key: '2', prev_key: '1' }
 *
 * Switch a local (generic) tabs group to tab 3:     var group = document.querySelector('[data-wpbc-tabs="column-styles"]'); if ( group ) { wpbc_ui_tabs.set_active(group, '3'); }
 */
(function (w) {
  'use strict';

  if (w.wpbc_ui_tabs) {
    return;
  }

  /**
   * Internal: toggle active state.
   *
   * @param {HTMLElement} root_el
   * @param {string}      key
   * @param {boolean}     should_emit
   */
  function set_active_internal(root_el, key, should_emit) {
    var tab_btns = root_el.querySelectorAll('[data-wpbc-tab-key]');
    var panels = root_el.querySelectorAll('[data-wpbc-tab-panel]');
    var prev_key = root_el.getAttribute('data-wpbc-tab-active') || null;
    if (String(prev_key) === String(key)) {
      return;
    }

    // Buttons: aria + class
    for (var i = 0; i < tab_btns.length; i++) {
      var btn = tab_btns[i];
      var b_key = btn.getAttribute('data-wpbc-tab-key');
      var is_on = String(b_key) === String(key);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', is_on ? 'true' : 'false');
      btn.setAttribute('tabindex', is_on ? '0' : '-1');
      if (is_on) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }

    // Panels: aria + visibility
    for (var j = 0; j < panels.length; j++) {
      var pn = panels[j];
      var pkey = pn.getAttribute('data-wpbc-tab-panel');
      var show = String(pkey) === String(key);
      pn.setAttribute('role', 'tabpanel');
      pn.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) {
        pn.removeAttribute('hidden');
      } else {
        pn.setAttribute('hidden', '');
      }
    }
    root_el.setAttribute('data-wpbc-tab-active', String(key));
    if (should_emit) {
      try {
        var ev = new w.CustomEvent('wpbc:tabs:change', {
          bubbles: true,
          detail: {
            active_key: String(key),
            prev_key: prev_key
          }
        });
        root_el.dispatchEvent(ev);
      } catch (_e) {}
    }
  }

  /**
   * Internal: get ordered keys from buttons.
   *
   * @param {HTMLElement} root_el
   * @returns {string[]}
   */
  function get_keys(root_el) {
    var list = [];
    var btns = root_el.querySelectorAll('[data-wpbc-tab-key]');
    for (var i = 0; i < btns.length; i++) {
      var k = btns[i].getAttribute('data-wpbc-tab-key');
      if (k != null && k !== '') {
        list.push(String(k));
      }
    }
    return list;
  }

  /**
   * Internal: move focus between tabs using keyboard.
   *
   * @param {HTMLElement} root_el
   * @param {number}      dir  +1 (next) / -1 (prev)
   */
  function focus_relative(root_el, dir) {
    var keys = get_keys(root_el);
    var current = root_el.getAttribute('data-wpbc-tab-active') || keys[0] || null;
    var idx = Math.max(0, keys.indexOf(String(current)));
    var next = keys[(idx + (dir > 0 ? 1 : keys.length - 1)) % keys.length];
    var next_btn = root_el.querySelector('[data-wpbc-tab-key="' + next + '"]');
    if (next_btn) {
      next_btn.focus();
      set_active_internal(root_el, next, true);
    }
  }

  /**
   * Initialize a single tabs group root.
   *
   * @param {HTMLElement} root_el
   */
  function init_group(root_el) {
    if (!root_el || root_el.__wpbc_tabs_inited) {
      return;
    }
    root_el.__wpbc_tabs_inited = true;

    // Roles
    var tablist = root_el.querySelector('[data-wpbc-tablist]') || root_el;
    tablist.setAttribute('role', 'tablist');

    // Default active: from attribute or first button
    var keys = get_keys(root_el);
    var def = root_el.getAttribute('data-wpbc-tab-active') || keys[0] || '1';
    set_active_internal(root_el, def, false);

    // Clicks
    root_el.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-wpbc-tab-key]') : null;
      if (!btn || !root_el.contains(btn)) {
        return;
      }
      e.preventDefault();
      var key = btn.getAttribute('data-wpbc-tab-key');
      if (key != null) {
        set_active_internal(root_el, key, true);
      }
    }, true);

    // Keyboard (Left/Right/Home/End)
    root_el.addEventListener('keydown', function (e) {
      var tgt = e.target;
      if (!tgt || !tgt.hasAttribute || !tgt.hasAttribute('data-wpbc-tab-key')) {
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          focus_relative(root_el, -1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          focus_relative(root_el, +1);
          break;
        case 'Home':
          e.preventDefault();
          set_active_internal(root_el, get_keys(root_el)[0] || '1', true);
          break;
        case 'End':
          e.preventDefault();
          var ks = get_keys(root_el);
          set_active_internal(root_el, ks[ks.length - 1] || '1', true);
          break;
      }
    }, true);
  }

  /**
   * Initialize all groups within a container (or document).
   *
   * @param {HTMLElement|string|null} container
   */
  function init_on(container) {
    var ctx = container ? typeof container === 'string' ? document.querySelector(container) : container : document;
    if (!ctx) {
      return;
    }
    var groups = ctx.querySelectorAll('[data-wpbc-tabs]');
    for (var i = 0; i < groups.length; i++) {
      init_group(groups[i]);
    }
  }

  /**
   * Programmatically set active tab by key.
   *
   * @param {HTMLElement} root_el
   * @param {string|number} key
   */
  function set_active(root_el, key) {
    if (root_el && root_el.hasAttribute && root_el.hasAttribute('data-wpbc-tabs')) {
      set_active_internal(root_el, String(key), true);
    }
  }

  // Public API (snake_case)
  w.wpbc_ui_tabs = {
    init_on: init_on,
    init_group: init_group,
    set_active: set_active
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init_on(document);
    });
  } else {
    init_on(document);
  }
})(window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2Rpc3QvYWxsL19vdXQvd3BiY19hbGxfYWRtaW4uanMiLCJuYW1lcyI6WyJ3cGJjX2JsaW5rX2VsZW1lbnQiLCJlbGVtZW50X3RvX2JsaW5rIiwiaG93X21hbnlfdGltZXMiLCJob3dfbG9uZ190b19ibGluayIsImkiLCJqUXVlcnkiLCJmYWRlT3V0IiwiZmFkZUluIiwiYW5pbWF0ZSIsIm9wYWNpdHkiLCJ3cGJjX2J1dHRvbl9fcmVtb3ZlX3NwaW4iLCJidXR0b25fY2xpY2tlZF9lbGVtZW50X2lkIiwicHJldmlvc19jbGFzc2VzIiwidW5kZWZpbmVkIiwiakVsZW1lbnQiLCJsZW5ndGgiLCJ3cGJjX2J1dHRvbl9kaXNhYmxlX2xvYWRpbmdfaWNvbiIsImdldCIsIndwYmNfYnV0dG9uX2VuYWJsZV9sb2FkaW5nX2ljb24iLCJ0aGlzX2J1dHRvbiIsImpCdXR0b24iLCJqSWNvbiIsImZpbmQiLCJhdHRyIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInByZXZpb3VzX29uY2xpY2siLCJ3cGJjX3VpX2VsX19yYWRpb19jb250YWluZXJfc2VsZWN0aW9uIiwiX3RoaXMiLCJpcyIsInBhcmVudHMiLCJyZW1vdmVBdHRyIiwid3BiY191aV9lbF9fcmFkaW9fY29udGFpbmVyX2NsaWNrIiwiaGFzQ2xhc3MiLCJqX3JhZGlvIiwicHJvcCIsInRyaWdnZXIiLCJ3cGJjX2NoZWNrX2Z1bGxfc2NyZWVuX21vZGUiLCJ3cGJjX2NoZWNrX2J1dHRvbnNfbWF4X21pbl9pbl9mdWxsX3NjcmVlbl9tb2RlIiwiZG9jdW1lbnQiLCJyZWFkeSIsIndwYmNfZGVmaW5lX2dtYWlsX2NoZWNrYm94X3NlbGVjdGlvbiIsIiQiLCJjaGVja3MiLCJmaXJzdCIsImxhc3QiLCJjaGVja2VkIiwic2xpY2VkIiwibGFzdENsaWNrZWQiLCJvbiIsImUiLCJzaGlmdEtleSIsImNsb3Nlc3QiLCJmaWx0ZXIiLCJpbmRleCIsInNsaWNlIiwidW5jaGVja2VkIiwibm90IiwiY2hpbGRyZW4iLCJldmVudCIsIiR0aGlzIiwiJHRhYmxlIiwiY29udHJvbENoZWNrZWQiLCJ0b2dnbGUiLCJkYXRhIiwiZ2V0U2VsZWN0aW9uIiwicmVtb3ZlQWxsUmFuZ2VzIiwid3BiY19zaG93X2hpZGVfYWN0aW9uX2J1dHRvbnNfZm9yX3NlbGVjdGVkX2Jvb2tpbmdzIiwid3BiY19nZXRfc2VsZWN0ZWRfcm93X2lkIiwiY2hlY2tib3hlcyIsInNlbGVjdGVkX2lkIiwiZWFjaCIsImtleSIsImNoZWNrYm94IiwiZWxlbWVudF9pZCIsIndwYmNfZ2V0X3Jvd19pZF9mcm9tX2VsZW1lbnQiLCJwdXNoIiwidGhpc19pbmJvdW5kX2VsZW1lbnQiLCJwYXJzZUludCIsInJlcGxhY2UiLCJzZWxlY3RlZF9yb3dzX2FyciIsInNob3ciLCJoaWRlIiwid3BiY19hZG1pbl91aV9fc2lkZWJhcl9sZWZ0X19kb19tYXgiLCJ3cGJjX2FkbWluX3VpX19zaWRlYmFyX2xlZnRfX2RvX21pbiIsIndwYmNfYWRtaW5fdWlfX3NpZGViYXJfbGVmdF9fZG9fY29tcGFjdCIsIndwYmNfYWRtaW5fdWlfX3NpZGViYXJfbGVmdF9fZG9faGlkZSIsIndwYmNfYWRtaW5fdWlfX3NpZGViYXJfbGVmdF9fc2hvd19zZWN0aW9uIiwibWVudV90b19zaG93Iiwid3BiY19hZG1pbl91aV9fc2lkZWJhcl9yaWdodF9fZG9fbWF4Iiwid3BiY19hZG1pbl91aV9fc2lkZWJhcl9yaWdodF9fZG9fbWluIiwid3BiY19hZG1pbl91aV9fc2lkZWJhcl9yaWdodF9fZG9fY29tcGFjdCIsIndwYmNfYWRtaW5fdWlfX3NpZGViYXJfcmlnaHRfX2RvX2hpZGUiLCJ3cGJjX2FkbWluX3VpX19zaWRlYmFyX3JpZ2h0X19zaG93X3NlY3Rpb24iLCJ3cGJjX3VybF9nZXRfYW5jaG9yc19hcnIiLCJoYXNoZXMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhhc2giLCJoYXNoZXNfYXJyIiwic3BsaXQiLCJyZXN1bHQiLCJoYXNoZXNfYXJyX2xlbmd0aCIsIndwYmNfYWRtaW5fdWlfX2RvX2V4cGFuZF9zZWN0aW9uIiwic2V0VGltZW91dCIsImFuY2hvcnNfYXJyIiwiYW5jaG9yc19hcnJfbGVuZ3RoIiwib25lX2FuY2hvcl9wcm9wX3ZhbHVlIiwic2VjdGlvbl90b19zaG93Iiwic2VjdGlvbl9pZF90b19zaG93Iiwic2VsZWN0ZWRfdGl0bGUiLCJ0ZXh0IiwiY29udGFpbmVyX3RvX2hpZGVfY2xhc3MiLCJ0YXJnZXRPZmZzZXQiLCJ3cGJjX3Njcm9sbF90byIsInNlY3Rpb25faWRfdGFiIiwic3Vic3RyaW5nIiwidmFsIiwid3BiY19hZG1pbl91aV9fZG9fX2FuY2hvcl9fYW5vdGhlcl9hY3Rpb25zIiwid3BiY19hZG1pbl91aV9faXNfaW5fbW9iaWxlX3NjcmVlbl9zaXplIiwid3BiY19hZG1pbl91aV9faXNfaW5fdGhpc19zY3JlZW5fc2l6ZSIsInNpemUiLCJzY3JlZW4iLCJ3aWR0aCIsIndwYmNfYWRtaW5fdWlfX2RvX19vcGVuX3VybF9fZXhwYW5kX3NlY3Rpb24iLCJ1cmwiLCJzZWN0aW9uX2lkIiwiaHJlZiIsInRoaXNfYW5jaG9yIiwidGhpc19hbmNob3JfcHJvcF92YWx1ZSIsInNlY3Rpb25fYWN0aW9uIiwid3BiY19jb3B5X3RleHRfdG9fY2xpcGJyZF9mcm9tX2VsZW1lbnQiLCJodG1sX2VsZW1lbnRfaWQiLCJjb3B5VGV4dCIsImdldEVsZW1lbnRCeUlkIiwic2VsZWN0Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJpc19jb3BpZWQiLCJ3cGJjX2NvcHlfdGV4dF90b19jbGlwYnJkIiwidmFsdWUiLCJjb25zb2xlIiwiZXJyb3IiLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cGJjX2ZhbGxiYWNrX2NvcHlfdGV4dF90b19jbGlwYnJkIiwid3JpdGVUZXh0IiwidGhlbiIsImVyciIsImNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInBvc2l0aW9uIiwicG9pbnRlckV2ZW50cyIsImFjdGl2ZVNoZWV0cyIsIkFycmF5IiwicHJvdG90eXBlIiwiY2FsbCIsInN0eWxlU2hlZXRzIiwic2hlZXQiLCJkaXNhYmxlZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJhbmdlIiwiY3JlYXRlUmFuZ2UiLCJzZWxlY3ROb2RlIiwiYWRkUmFuZ2UiLCJleGVjQ29tbWFuZCIsImFjdGl2ZVNoZWV0c19sZW5ndGgiLCJyZW1vdmVDaGlsZCIsInciLCJkIiwiV1BCQ19Db2xsYXBzaWJsZV9Hcm91cHMiLCJjb25zdHJ1Y3RvciIsInJvb3RfZWwiLCJvcHRzIiwicm9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJPYmplY3QiLCJhc3NpZ24iLCJncm91cF9zZWxlY3RvciIsImhlYWRlcl9zZWxlY3RvciIsImZpZWxkc19zZWxlY3RvciIsIm9wZW5fY2xhc3MiLCJleGNsdXNpdmUiLCJfb25fY2xpY2siLCJiaW5kIiwiX29uX2tleWRvd24iLCJfZ3JvdXBzIiwiX29ic2VydmVyIiwiaW5pdCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiTXV0YXRpb25PYnNlcnZlciIsInJlZnJlc2giLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIl9zeW5jX2FsbF9hcmlhIiwiZGVzdHJveSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNjb25uZWN0IiwiaXNfZXhjbHVzaXZlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJtYXRjaGVzIiwiaXNfb3BlbiIsImdyb3VwIiwiZXhwYW5kIiwiZG9fZXhjbHVzaXZlIiwiZm9yRWFjaCIsImciLCJfc2V0X29wZW4iLCJjb2xsYXBzZSIsIm9wZW5fYnlfaW5kZXgiLCJvcGVuX2J5X2hlYWRpbmciLCJ0IiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJtYXRjaCIsImgiLCJ0ZXh0Q29udGVudCIsImluZGV4T2YiLCJldiIsImJ0biIsInRhcmdldCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGVhZGVycyIsIm1hcCIsIkJvb2xlYW4iLCJpZHgiLCJuZXh0X2lkeCIsIk1hdGgiLCJtaW4iLCJtYXgiLCJmb2N1cyIsIl9zeW5jX2dyb3VwX2FyaWEiLCJoZWFkZXIiLCJwYW5lbHMiLCJlbCIsInNldEF0dHJpYnV0ZSIsImlkcyIsInAiLCJpZCIsIl9nZW5lcmF0ZV9pZCIsImpvaW4iLCJoaWRkZW4iLCJvcGVuIiwiYWN0aXZlRWxlbWVudCIsImV2X25hbWUiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJidWJibGVzIiwiZGV0YWlsIiwiaW5zdGFuY2UiLCJwcmVmaXgiLCJ3cGJjX2NvbGxhcHNpYmxlX19hdXRvX2luaXQiLCJST09UIiwibm9kZXMiLCJuIiwicGFyZW50RWxlbWVudCIsIm5vZGUiLCJfX3dwYmNfY29sbGFwc2libGVfaW5zdGFuY2UiLCJXUEJDX0NvbGxhcHNpYmxlX0F1dG9Jbml0IiwicmVhZHlTdGF0ZSIsIm9uY2UiLCJ3cGJjX3VpX3RhYnMiLCJzZXRfYWN0aXZlX2ludGVybmFsIiwic2hvdWxkX2VtaXQiLCJ0YWJfYnRucyIsInByZXZfa2V5IiwiZ2V0QXR0cmlidXRlIiwiYl9rZXkiLCJpc19vbiIsImFkZCIsInJlbW92ZSIsImoiLCJwbiIsInBrZXkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJhY3RpdmVfa2V5IiwiX2UiLCJnZXRfa2V5cyIsImxpc3QiLCJidG5zIiwiayIsImZvY3VzX3JlbGF0aXZlIiwiZGlyIiwia2V5cyIsImN1cnJlbnQiLCJuZXh0IiwibmV4dF9idG4iLCJpbml0X2dyb3VwIiwiX193cGJjX3RhYnNfaW5pdGVkIiwidGFibGlzdCIsImRlZiIsInRndCIsImhhc0F0dHJpYnV0ZSIsImtzIiwiaW5pdF9vbiIsImN0eCIsImdyb3VwcyIsInNldF9hY3RpdmUiXSwic291cmNlcyI6WyJ1aV9lbGVtZW50cy5qcyIsInVpX2xvYWRpbmdfc3Bpbi5qcyIsInVpX3JhZGlvX2NvbnRhaW5lci5qcyIsInVpX2Z1bGxfc2NyZWVuX21vZGUuanMiLCJnbWFpbF9jaGVja2JveF9zZWxlY3Rpb24uanMiLCJib29raW5nc19jaGVja2JveF9zZWxlY3Rpb24uanMiLCJ1aV9zaWRlYmFyX2xlZnRfX2FjdGlvbnMuanMiLCJjb3B5X3RleHRfdG9fY2xpcGJyZC5qcyIsImNvbGxhcHNpYmxlX2dyb3Vwcy5qcyIsInVpX3RhYnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiBCbGluayBzcGVjaWZpYyBIVE1MIGVsZW1lbnQgdG8gc2V0IGF0dGVudGlvbiB0byB0aGlzIGVsZW1lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50X3RvX2JsaW5rXHRcdCAgLSBjbGFzcyBvciBpZCBvZiBlbGVtZW50OiAnLndwYmNfd2lkZ2V0X2F2YWlsYWJsZV91bmF2YWlsYWJsZSdcclxuICogQHBhcmFtIHtpbnR9IGhvd19tYW55X3RpbWVzXHRcdFx0ICAtIDRcclxuICogQHBhcmFtIHtpbnR9IGhvd19sb25nX3RvX2JsaW5rXHRcdCAgLSAzNTBcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYmxpbmtfZWxlbWVudCggZWxlbWVudF90b19ibGluaywgaG93X21hbnlfdGltZXMgPSA0LCBob3dfbG9uZ190b19ibGluayA9IDM1MCApe1xyXG5cclxuXHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBob3dfbWFueV90aW1lczsgaSsrICl7XHJcblx0XHRqUXVlcnkoIGVsZW1lbnRfdG9fYmxpbmsgKS5mYWRlT3V0KCBob3dfbG9uZ190b19ibGluayApLmZhZGVJbiggaG93X2xvbmdfdG9fYmxpbmsgKTtcclxuXHR9XHJcbiAgICBqUXVlcnkoIGVsZW1lbnRfdG9fYmxpbmsgKS5hbmltYXRlKCB7b3BhY2l0eTogMX0sIDUwMCApO1xyXG59XHJcbiIsIi8qKlxyXG4gKiAgIFN1cHBvcnQgRnVuY3Rpb25zIC0gU3BpbiBJY29uIGluIEJ1dHRvbnMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBzcGluIGljb24gZnJvbSAgYnV0dG9uIGFuZCBFbmFibGUgdGhpcyBidXR0b24uXHJcbiAqXHJcbiAqIEBwYXJhbSBidXR0b25fY2xpY2tlZF9lbGVtZW50X2lkXHRcdC0gSFRNTCBJRCBhdHRyaWJ1dGUgb2YgdGhpcyBidXR0b25cclxuICogQHJldHVybiBzdHJpbmdcdFx0XHRcdFx0XHQtIENTUyBjbGFzc2VzIHRoYXQgd2FzIHByZXZpb3VzbHkgaW4gYnV0dG9uIGljb25cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYnV0dG9uX19yZW1vdmVfc3BpbihidXR0b25fY2xpY2tlZF9lbGVtZW50X2lkKSB7XHJcblxyXG5cdHZhciBwcmV2aW9zX2NsYXNzZXMgPSAnJztcclxuXHRpZiAoXHJcblx0XHQodW5kZWZpbmVkICE9IGJ1dHRvbl9jbGlja2VkX2VsZW1lbnRfaWQpXHJcblx0XHQmJiAoJycgIT0gYnV0dG9uX2NsaWNrZWRfZWxlbWVudF9pZClcclxuXHQpIHtcclxuXHRcdHZhciBqRWxlbWVudCA9IGpRdWVyeSggJyMnICsgYnV0dG9uX2NsaWNrZWRfZWxlbWVudF9pZCApO1xyXG5cdFx0aWYgKCBqRWxlbWVudC5sZW5ndGggKSB7XHJcblx0XHRcdHByZXZpb3NfY2xhc3NlcyA9IHdwYmNfYnV0dG9uX2Rpc2FibGVfbG9hZGluZ19pY29uKCBqRWxlbWVudC5nZXQoIDAgKSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHByZXZpb3NfY2xhc3NlcztcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBTaG93IExvYWRpbmcgKHJvdGF0aW5nIGFycm93KSBpY29uIGZvciBidXR0b24gdGhhdCBoYXMgYmVlbiBjbGlja2VkXHJcbiAqXHJcbiAqIEBwYXJhbSB0aGlzX2J1dHRvblx0XHQtIHRoaXMgb2JqZWN0IG9mIHNwZWNpZmljIGJ1dHRvblxyXG4gKiBAcmV0dXJuIHN0cmluZ1x0XHRcdC0gQ1NTIGNsYXNzZXMgdGhhdCB3YXMgcHJldmlvdXNseSBpbiBidXR0b24gaWNvblxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19idXR0b25fZW5hYmxlX2xvYWRpbmdfaWNvbih0aGlzX2J1dHRvbikge1xyXG5cclxuXHR2YXIgakJ1dHRvbiAgICAgICAgID0galF1ZXJ5KCB0aGlzX2J1dHRvbiApO1xyXG5cdHZhciBqSWNvbiAgICAgICAgICAgPSBqQnV0dG9uLmZpbmQoICdpJyApO1xyXG5cdHZhciBwcmV2aW9zX2NsYXNzZXMgPSBqSWNvbi5hdHRyKCAnY2xhc3MnICk7XHJcblxyXG5cdGpJY29uLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoICdtZW51X2ljb24gaWNvbi0xeCB3cGJjX2ljbl9yb3RhdGVfcmlnaHQgd3BiY19zcGluJyApO1x0Ly8gU2V0IFJvdGF0ZSBpY29uLlxyXG5cdC8vIGpJY29uLmFkZENsYXNzKCAnd3BiY19hbmltYXRpb25fcGF1c2UnICk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gUGF1c2UgYW5pbWF0aW9uLlxyXG5cdC8vIGpJY29uLmFkZENsYXNzKCAnd3BiY191aV9yZWQnICk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNldCBpY29uIGNvbG9yIHJlZC5cclxuXHJcblx0akljb24uYXR0ciggJ3dwYmNfcHJldmlvdXNfY2xhc3MnLCBwcmV2aW9zX2NsYXNzZXMgKVxyXG5cclxuXHRqQnV0dG9uLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRGlzYWJsZSBidXR0b25cclxuXHQvLyBXZSBuZWVkIHRvICBzZXQgIGhlcmUgYXR0ciBpbnN0ZWFkIG9mIHByb3AsIGJlY2F1c2UgZm9yIEEgZWxlbWVudHMsICBhdHRyaWJ1dGUgJ2Rpc2FibGVkJyBkbyAgbm90IGFkZGVkIHdpdGggakJ1dHRvbi5wcm9wKCBcImRpc2FibGVkXCIsIHRydWUgKTsuXHJcblxyXG5cdGpCdXR0b24uYXR0ciggJ3dwYmNfcHJldmlvdXNfb25jbGljaycsIGpCdXR0b24uYXR0ciggJ29uY2xpY2snICkgKTtcdFx0Ly8gU2F2ZSB0aGlzIHZhbHVlLlxyXG5cdGpCdXR0b24uYXR0ciggJ29uY2xpY2snLCAnJyApO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEaXNhYmxlIGFjdGlvbnMgXCJvbiBjbGlja1wiLlxyXG5cclxuXHRyZXR1cm4gcHJldmlvc19jbGFzc2VzO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEhpZGUgTG9hZGluZyAocm90YXRpbmcgYXJyb3cpIGljb24gZm9yIGJ1dHRvbiB0aGF0IHdhcyBjbGlja2VkIGFuZCBzaG93IHByZXZpb3VzIGljb24gYW5kIGVuYWJsZSBidXR0b25cclxuICpcclxuICogQHBhcmFtIHRoaXNfYnV0dG9uXHRcdC0gdGhpcyBvYmplY3Qgb2Ygc3BlY2lmaWMgYnV0dG9uXHJcbiAqIEByZXR1cm4gc3RyaW5nXHRcdFx0LSBDU1MgY2xhc3NlcyB0aGF0IHdhcyBwcmV2aW91c2x5IGluIGJ1dHRvbiBpY29uXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2J1dHRvbl9kaXNhYmxlX2xvYWRpbmdfaWNvbih0aGlzX2J1dHRvbikge1xyXG5cclxuXHR2YXIgakJ1dHRvbiA9IGpRdWVyeSggdGhpc19idXR0b24gKTtcclxuXHR2YXIgakljb24gICA9IGpCdXR0b24uZmluZCggJ2knICk7XHJcblxyXG5cdHZhciBwcmV2aW9zX2NsYXNzZXMgPSBqSWNvbi5hdHRyKCAnd3BiY19wcmV2aW91c19jbGFzcycgKTtcclxuXHRpZiAoXHJcblx0XHQodW5kZWZpbmVkICE9IHByZXZpb3NfY2xhc3NlcylcclxuXHRcdCYmICgnJyAhPSBwcmV2aW9zX2NsYXNzZXMpXHJcblx0KSB7XHJcblx0XHRqSWNvbi5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCBwcmV2aW9zX2NsYXNzZXMgKTtcclxuXHR9XHJcblxyXG5cdGpCdXR0b24ucmVtb3ZlQ2xhc3MoICdkaXNhYmxlZCcgKTtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBSZW1vdmUgRGlzYWJsZSBidXR0b24uXHJcblxyXG5cdHZhciBwcmV2aW91c19vbmNsaWNrID0gakJ1dHRvbi5hdHRyKCAnd3BiY19wcmV2aW91c19vbmNsaWNrJyApXHJcblx0aWYgKFxyXG5cdFx0KHVuZGVmaW5lZCAhPSBwcmV2aW91c19vbmNsaWNrKVxyXG5cdFx0JiYgKCcnICE9IHByZXZpb3VzX29uY2xpY2spXHJcblx0KSB7XHJcblx0XHRqQnV0dG9uLmF0dHIoICdvbmNsaWNrJywgcHJldmlvdXNfb25jbGljayApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHByZXZpb3NfY2xhc3NlcztcclxufVxyXG4iLCIvKipcclxuICogT24gc2VsZWN0aW9uICBvZiByYWRpbyBidXR0b24sIGFkanVzdCBhdHRyaWJ1dGVzIG9mIHJhZGlvIGNvbnRhaW5lclxyXG4gKlxyXG4gKiBAcGFyYW0gX3RoaXNcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfdWlfZWxfX3JhZGlvX2NvbnRhaW5lcl9zZWxlY3Rpb24oX3RoaXMpIHtcclxuXHJcblx0aWYgKCBqUXVlcnkoIF90aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcclxuXHRcdGpRdWVyeSggX3RoaXMgKS5wYXJlbnRzKCAnLndwYmNfdWlfcmFkaW9fc2VjdGlvbicgKS5maW5kKCAnLndwYmNfdWlfcmFkaW9fY29udGFpbmVyJyApLnJlbW92ZUF0dHIoICdkYXRhLXNlbGVjdGVkJyApO1xyXG5cdFx0alF1ZXJ5KCBfdGhpcyApLnBhcmVudHMoICcud3BiY191aV9yYWRpb19jb250YWluZXI6bm90KC5kaXNhYmxlZCknICkuYXR0ciggJ2RhdGEtc2VsZWN0ZWQnLCB0cnVlICk7XHJcblx0fVxyXG5cclxuXHRpZiAoIGpRdWVyeSggX3RoaXMgKS5pcyggJzpkaXNhYmxlZCcgKSApIHtcclxuXHRcdGpRdWVyeSggX3RoaXMgKS5wYXJlbnRzKCAnLndwYmNfdWlfcmFkaW9fY29udGFpbmVyJyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogT24gY2xpY2sgb24gUmFkaW8gQ29udGFpbmVyLCB3ZSB3aWxsICBzZWxlY3QgIHRoZSAgcmFkaW8gYnV0dG9uICAgIGFuZCB0aGVuIGFkanVzdCBhdHRyaWJ1dGVzIG9mIHJhZGlvIGNvbnRhaW5lclxyXG4gKlxyXG4gKiBAcGFyYW0gX3RoaXNcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfdWlfZWxfX3JhZGlvX2NvbnRhaW5lcl9jbGljayhfdGhpcykge1xyXG5cclxuXHRpZiAoIGpRdWVyeSggX3RoaXMgKS5oYXNDbGFzcyggJ2Rpc2FibGVkJyApICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dmFyIGpfcmFkaW8gPSBqUXVlcnkoIF90aGlzICkuZmluZCggJ2lucHV0W3R5cGU9cmFkaW9dOm5vdCgud3BiYy1mb3JtLXJhZGlvLWludGVybmFsKScgKTtcclxuXHRpZiAoIGpfcmFkaW8ubGVuZ3RoICkge1xyXG5cdFx0al9yYWRpby5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xyXG5cdH1cclxuXHJcbn0iLCJcInVzZSBzdHJpY3RcIjtcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vID09IEZ1bGwgU2NyZWVuICAtICBzdXBwb3J0IGZ1bmN0aW9ucyAgID09XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIEZ1bGwgIHNjcmVlbiBtb2RlLCAgYnkgIHJlbW92aW5nIHRvcCB0YWJcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfY2hlY2tfZnVsbF9zY3JlZW5fbW9kZSgpe1xyXG5cdGlmICggalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ3dwYmNfYWRtaW5fZnVsbF9zY3JlZW4nICkgKSB7XHJcblx0XHRqUXVlcnkoICdodG1sJyApLnJlbW92ZUNsYXNzKCAnd3AtdG9vbGJhcicgKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0alF1ZXJ5KCAnaHRtbCcgKS5hZGRDbGFzcyggJ3dwLXRvb2xiYXInICk7XHJcblx0fVxyXG5cdHdwYmNfY2hlY2tfYnV0dG9uc19tYXhfbWluX2luX2Z1bGxfc2NyZWVuX21vZGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3BiY19jaGVja19idXR0b25zX21heF9taW5faW5fZnVsbF9zY3JlZW5fbW9kZSgpIHtcclxuXHRpZiAoIGpRdWVyeSggJ2JvZHknICkuaGFzQ2xhc3MoICd3cGJjX2FkbWluX2Z1bGxfc2NyZWVuJyApICkge1xyXG5cdFx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9mdWxsX3NjcmVlbicgICApLmFkZENsYXNzKCAgICAnd3BiY191aV9faGlkZScgKTtcclxuXHRcdGpRdWVyeSggJy53cGJjX3VpX190b3BfbmF2X19idG5fbm9ybWFsX3NjcmVlbicgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGpRdWVyeSggJy53cGJjX3VpX190b3BfbmF2X19idG5fZnVsbF9zY3JlZW4nICAgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0XHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX25vcm1hbF9zY3JlZW4nICkuYWRkQ2xhc3MoICAgICd3cGJjX3VpX19oaWRlJyApO1xyXG5cdH1cclxufVxyXG5cclxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoKSB7XHJcblx0d3BiY19jaGVja19mdWxsX3NjcmVlbl9tb2RlKCk7XHJcbn0gKTsiLCIvKipcclxuICogQ2hlY2tib3ggU2VsZWN0aW9uIGZ1bmN0aW9ucyBmb3IgTGlzdGluZy5cclxuICovXHJcblxyXG4vKipcclxuICogU2VsZWN0aW9ucyBvZiBzZXZlcmFsICBjaGVja2JveGVzIGxpa2UgaW4gZ01haWwgd2l0aCBzaGlmdCA6KVxyXG4gKiBOZWVkIHRvICBoYXZlIHRoaXMgc3RydWN0dXJlOlxyXG4gKiAud3BiY19zZWxlY3RhYmxlX3RhYmxlXHJcbiAqICAgICAgLndwYmNfc2VsZWN0YWJsZV9oZWFkXHJcbiAqICAgICAgICAgICAgICAuY2hlY2stY29sdW1uXHJcbiAqICAgICAgICAgICAgICAgICAgOmNoZWNrYm94XHJcbiAqICAgICAgLndwYmNfc2VsZWN0YWJsZV9ib2R5XHJcbiAqICAgICAgICAgIC53cGJjX3Jvd1xyXG4gKiAgICAgICAgICAgICAgLmNoZWNrLWNvbHVtblxyXG4gKiAgICAgICAgICAgICAgICAgIDpjaGVja2JveFxyXG4gKiAgICAgIC53cGJjX3NlbGVjdGFibGVfZm9vdFxyXG4gKiAgICAgICAgICAgICAgLmNoZWNrLWNvbHVtblxyXG4gKiAgICAgICAgICAgICAgICAgIDpjaGVja2JveFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19kZWZpbmVfZ21haWxfY2hlY2tib3hfc2VsZWN0aW9uKCAkICl7XHJcblxyXG5cdHZhciBjaGVja3MsIGZpcnN0LCBsYXN0LCBjaGVja2VkLCBzbGljZWQsIGxhc3RDbGlja2VkID0gZmFsc2U7XHJcblxyXG5cdC8vIENoZWNrIGFsbCBjaGVja2JveGVzLlxyXG5cdCQoICcud3BiY19zZWxlY3RhYmxlX2JvZHknICkuZmluZCggJy5jaGVjay1jb2x1bW4nICkuZmluZCggJzpjaGVja2JveCcgKS5vbihcclxuXHRcdCdjbGljaycsXHJcblx0XHRmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09IGUuc2hpZnRLZXkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBlLnNoaWZ0S2V5ICkge1xyXG5cdFx0XHRcdGlmICggISBsYXN0Q2xpY2tlZCApIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGVja3MgID0gJCggbGFzdENsaWNrZWQgKS5jbG9zZXN0KCAnLndwYmNfc2VsZWN0YWJsZV9ib2R5JyApLmZpbmQoICc6Y2hlY2tib3gnICkuZmlsdGVyKCAnOnZpc2libGU6ZW5hYmxlZCcgKTtcclxuXHRcdFx0XHRmaXJzdCAgID0gY2hlY2tzLmluZGV4KCBsYXN0Q2xpY2tlZCApO1xyXG5cdFx0XHRcdGxhc3QgICAgPSBjaGVja3MuaW5kZXgoIHRoaXMgKTtcclxuXHRcdFx0XHRjaGVja2VkID0gJCggdGhpcyApLnByb3AoICdjaGVja2VkJyApO1xyXG5cdFx0XHRcdGlmICggMCA8IGZpcnN0ICYmIDAgPCBsYXN0ICYmIGZpcnN0ICE9IGxhc3QgKSB7XHJcblx0XHRcdFx0XHRzbGljZWQgPSAobGFzdCA+IGZpcnN0KSA/IGNoZWNrcy5zbGljZSggZmlyc3QsIGxhc3QgKSA6IGNoZWNrcy5zbGljZSggbGFzdCwgZmlyc3QgKTtcclxuXHRcdFx0XHRcdHNsaWNlZC5wcm9wKFxyXG5cdFx0XHRcdFx0XHQnY2hlY2tlZCcsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnLndwYmNfcm93JyApLmlzKCAnOnZpc2libGUnICkgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2hlY2tlZDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpLnRyaWdnZXIoICdjaGFuZ2UnICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxhc3RDbGlja2VkID0gdGhpcztcclxuXHJcblx0XHRcdC8vIHRvZ2dsZSBcImNoZWNrIGFsbFwiIGNoZWNrYm94ZXMuXHJcblx0XHRcdHZhciB1bmNoZWNrZWQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53cGJjX3NlbGVjdGFibGVfYm9keScgKS5maW5kKCAnOmNoZWNrYm94JyApLmZpbHRlciggJzp2aXNpYmxlOmVuYWJsZWQnICkubm90KCAnOmNoZWNrZWQnICk7XHJcblx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndwYmNfc2VsZWN0YWJsZV90YWJsZScgKS5jaGlsZHJlbiggJy53cGJjX3NlbGVjdGFibGVfaGVhZCwgLndwYmNfc2VsZWN0YWJsZV9mb290JyApLmZpbmQoICc6Y2hlY2tib3gnICkucHJvcChcclxuXHRcdFx0XHQnY2hlY2tlZCcsXHJcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICgwID09PSB1bmNoZWNrZWQubGVuZ3RoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCkudHJpZ2dlciggJ2NoYW5nZScgKTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdCk7XHJcblxyXG5cdC8vIEhlYWQgfHwgRm9vdCBjbGlja2luZyB0byAgc2VsZWN0IC8gZGVzZWxlY3QgQUxMLlxyXG5cdCQoICcud3BiY19zZWxlY3RhYmxlX2hlYWQsIC53cGJjX3NlbGVjdGFibGVfZm9vdCcgKS5maW5kKCAnLmNoZWNrLWNvbHVtbiA6Y2hlY2tib3gnICkub24oXHJcblx0XHQnY2xpY2snLFxyXG5cdFx0ZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdHZhciAkdGhpcyAgICAgICAgICA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHQkdGFibGUgICAgICAgICA9ICR0aGlzLmNsb3Nlc3QoICcud3BiY19zZWxlY3RhYmxlX3RhYmxlJyApLFxyXG5cdFx0XHRcdGNvbnRyb2xDaGVja2VkID0gJHRoaXMucHJvcCggJ2NoZWNrZWQnICksXHJcblx0XHRcdFx0dG9nZ2xlICAgICAgICAgPSBldmVudC5zaGlmdEtleSB8fCAkdGhpcy5kYXRhKCAnd3AtdG9nZ2xlJyApO1xyXG5cclxuXHRcdFx0JHRhYmxlLmNoaWxkcmVuKCAnLndwYmNfc2VsZWN0YWJsZV9ib2R5JyApLmZpbHRlciggJzp2aXNpYmxlJyApXHJcblx0XHRcdFx0LmZpbmQoICcuY2hlY2stY29sdW1uJyApLmZpbmQoICc6Y2hlY2tib3gnIClcclxuXHRcdFx0XHQucHJvcChcclxuXHRcdFx0XHRcdCdjaGVja2VkJyxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6aGlkZGVuLDpkaXNhYmxlZCcgKSApIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKCB0b2dnbGUgKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEgJCggdGhpcyApLnByb3AoICdjaGVja2VkJyApO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBjb250cm9sQ2hlY2tlZCApIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KS50cmlnZ2VyKCAnY2hhbmdlJyApO1xyXG5cclxuXHRcdFx0JHRhYmxlLmNoaWxkcmVuKCAnLndwYmNfc2VsZWN0YWJsZV9oZWFkLCAgLndwYmNfc2VsZWN0YWJsZV9mb290JyApLmZpbHRlciggJzp2aXNpYmxlJyApXHJcblx0XHRcdFx0LmZpbmQoICcuY2hlY2stY29sdW1uJyApLmZpbmQoICc6Y2hlY2tib3gnIClcclxuXHRcdFx0XHQucHJvcChcclxuXHRcdFx0XHRcdCdjaGVja2VkJyxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCB0b2dnbGUgKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBjb250cm9sQ2hlY2tlZCApIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdH1cclxuXHQpO1xyXG5cclxuXHJcblx0Ly8gVmlzdWFsbHkgIHNob3cgc2VsZWN0ZWQgYm9yZGVyLlxyXG5cdCQoICcud3BiY19zZWxlY3RhYmxlX2JvZHknICkuZmluZCggJy5jaGVjay1jb2x1bW4gOmNoZWNrYm94JyApLm9uKFxyXG5cdFx0J2NoYW5nZScsXHJcblx0XHRmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICkge1xyXG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud3BiY19saXN0X3JvdycgKS5hZGRDbGFzcyggJ3Jvd19zZWxlY3RlZF9jb2xvcicgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndwYmNfbGlzdF9yb3cnICkucmVtb3ZlQ2xhc3MoICdyb3dfc2VsZWN0ZWRfY29sb3InICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIERpc2FibGUgdGV4dCBzZWxlY3Rpb24gd2hpbGUgcHJlc3NpbmcgJ3NoaWZ0Jy5cclxuXHRcdFx0ZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblxyXG5cdFx0XHQvLyBTaG93IG9yIGhpZGUgYnV0dG9ucyBvbiBBY3Rpb25zIHRvb2xiYXIgIGF0ICBCb29raW5nIExpc3RpbmcgIHBhZ2UsICBpZiB3ZSBoYXZlIHNvbWUgc2VsZWN0ZWQgYm9va2luZ3MuXHJcblx0XHRcdHdwYmNfc2hvd19oaWRlX2FjdGlvbl9idXR0b25zX2Zvcl9zZWxlY3RlZF9ib29raW5ncygpO1xyXG5cdFx0fVxyXG5cdCk7XHJcblxyXG5cdHdwYmNfc2hvd19oaWRlX2FjdGlvbl9idXR0b25zX2Zvcl9zZWxlY3RlZF9ib29raW5ncygpO1xyXG59XHJcbiIsIlxyXG4vKipcclxuICogR2V0IElEIGFycmF5ICBvZiBzZWxlY3RlZCBlbGVtZW50c1xyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19nZXRfc2VsZWN0ZWRfcm93X2lkKCkge1xyXG5cclxuXHR2YXIgJHRhYmxlICAgICAgPSBqUXVlcnkoICcud3BiY19fd3JhcF9fYm9va2luZ19saXN0aW5nIC53cGJjX3NlbGVjdGFibGVfdGFibGUnICk7XHJcblx0dmFyIGNoZWNrYm94ZXMgID0gJHRhYmxlLmNoaWxkcmVuKCAnLndwYmNfc2VsZWN0YWJsZV9ib2R5JyApLmZpbHRlciggJzp2aXNpYmxlJyApLmZpbmQoICcuY2hlY2stY29sdW1uJyApLmZpbmQoICc6Y2hlY2tib3gnICk7XHJcblx0dmFyIHNlbGVjdGVkX2lkID0gW107XHJcblxyXG5cdGpRdWVyeS5lYWNoKFxyXG5cdFx0Y2hlY2tib3hlcyxcclxuXHRcdGZ1bmN0aW9uIChrZXksIGNoZWNrYm94KSB7XHJcblx0XHRcdGlmICggalF1ZXJ5KCBjaGVja2JveCApLmlzKCAnOmNoZWNrZWQnICkgKSB7XHJcblx0XHRcdFx0dmFyIGVsZW1lbnRfaWQgPSB3cGJjX2dldF9yb3dfaWRfZnJvbV9lbGVtZW50KCBjaGVja2JveCApO1xyXG5cdFx0XHRcdHNlbGVjdGVkX2lkLnB1c2goIGVsZW1lbnRfaWQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcblxyXG5cdHJldHVybiBzZWxlY3RlZF9pZDtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBHZXQgSUQgb2Ygcm93LCAgYmFzZWQgb24gY2xjaWtlZCBlbGVtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB0aGlzX2luYm91bmRfZWxlbWVudCAgLSB1c3VzbGx5ICB0aGlzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2dldF9yb3dfaWRfZnJvbV9lbGVtZW50KHRoaXNfaW5ib3VuZF9lbGVtZW50KSB7XHJcblxyXG5cdHZhciBlbGVtZW50X2lkID0galF1ZXJ5KCB0aGlzX2luYm91bmRfZWxlbWVudCApLmNsb3Nlc3QoICcud3BiY19saXN0aW5nX3VzdWFsX3JvdycgKS5hdHRyKCAnaWQnICk7XHJcblxyXG5cdGVsZW1lbnRfaWQgPSBwYXJzZUludCggZWxlbWVudF9pZC5yZXBsYWNlKCAncm93X2lkXycsICcnICkgKTtcclxuXHJcblx0cmV0dXJuIGVsZW1lbnRfaWQ7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogPT0gQm9va2luZyBMaXN0aW5nID09IFNob3cgb3IgaGlkZSBidXR0b25zIG9uIEFjdGlvbnMgdG9vbGJhciAgYXQgICAgcGFnZSwgIGlmIHdlIGhhdmUgc29tZSBzZWxlY3RlZCBib29raW5ncy5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfc2hvd19oaWRlX2FjdGlvbl9idXR0b25zX2Zvcl9zZWxlY3RlZF9ib29raW5ncygpe1xyXG5cclxuXHR2YXIgc2VsZWN0ZWRfcm93c19hcnIgPSB3cGJjX2dldF9zZWxlY3RlZF9yb3dfaWQoKTtcclxuXHJcblx0aWYgKCBzZWxlY3RlZF9yb3dzX2Fyci5sZW5ndGggPiAwICkge1xyXG5cdFx0alF1ZXJ5KCAnLmhpZGVfYnV0dG9uX2lmX25vX3NlbGVjdGlvbicgKS5zaG93KCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGpRdWVyeSggJy5oaWRlX2J1dHRvbl9pZl9ub19zZWxlY3Rpb24nICkuaGlkZSgpO1xyXG5cdH1cclxufSIsIlwidXNlIHN0cmljdFwiO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gPT0gTGVmdCBCYXIgIC0gIGV4cGFuZCAvIGNvbGFwc2UgZnVuY3Rpb25zICAgPT1cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogRXhwYW5kIFZlcnRpY2FsIExlZnQgQmFyLlxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hZG1pbl91aV9fc2lkZWJhcl9sZWZ0X19kb19tYXgoKSB7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnbWluIG1heCBjb21wYWN0IG5vbmUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLmFkZENsYXNzKCAnbWF4JyApO1xyXG5cdGpRdWVyeSggJy53cGJjX3VpX190b3BfbmF2X19idG5fb3Blbl9sZWZ0X3ZlcnRpY2FsX25hdicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9oaWRlX2xlZnRfdmVydGljYWxfbmF2JyApLnJlbW92ZUNsYXNzKCAnd3BiY191aV9faGlkZScgKTtcclxuXHJcblx0alF1ZXJ5KCAnLndwLWFkbWluJyApLnJlbW92ZUNsYXNzKCAnd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9taW4gd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9tYXggd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9jb21wYWN0IHdwYmNfcGFnZV93cmFwcGVyX2xlZnRfbm9uZScgKTtcclxuXHRqUXVlcnkoICcud3AtYWRtaW4nICkuYWRkQ2xhc3MoICd3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X21heCcgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgVmVydGljYWwgTGVmdCBCYXIuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FkbWluX3VpX19zaWRlYmFyX2xlZnRfX2RvX21pbigpIHtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdtaW4gbWF4IGNvbXBhY3Qgbm9uZScgKTtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkuYWRkQ2xhc3MoICdtaW4nICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9vcGVuX2xlZnRfdmVydGljYWxfbmF2JyApLnJlbW92ZUNsYXNzKCAnd3BiY191aV9faGlkZScgKTtcclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX2hpZGVfbGVmdF92ZXJ0aWNhbF9uYXYnICkuYWRkQ2xhc3MoICd3cGJjX3VpX19oaWRlJyApO1xyXG5cclxuXHRqUXVlcnkoICcud3AtYWRtaW4nICkucmVtb3ZlQ2xhc3MoICd3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X21pbiB3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X21heCB3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X2NvbXBhY3Qgd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9ub25lJyApO1xyXG5cdGpRdWVyeSggJy53cC1hZG1pbicgKS5hZGRDbGFzcyggJ3dwYmNfcGFnZV93cmFwcGVyX2xlZnRfbWluJyApO1xyXG59XHJcblxyXG4vKipcclxuICogQ29sYXBzZSBWZXJ0aWNhbCBMZWZ0IEJhci5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX3NpZGViYXJfbGVmdF9fZG9fY29tcGFjdCgpIHtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdtaW4gbWF4IGNvbXBhY3Qgbm9uZScgKTtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkuYWRkQ2xhc3MoICdjb21wYWN0JyApO1xyXG5cdGpRdWVyeSggJy53cGJjX3VpX190b3BfbmF2X19idG5fb3Blbl9sZWZ0X3ZlcnRpY2FsX25hdicgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9oaWRlX2xlZnRfdmVydGljYWxfbmF2JyApLmFkZENsYXNzKCAnd3BiY191aV9faGlkZScgKTtcclxuXHJcblx0alF1ZXJ5KCAnLndwLWFkbWluJyApLnJlbW92ZUNsYXNzKCAnd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9taW4gd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9tYXggd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9jb21wYWN0IHdwYmNfcGFnZV93cmFwcGVyX2xlZnRfbm9uZScgKTtcclxuXHRqUXVlcnkoICcud3AtYWRtaW4nICkuYWRkQ2xhc3MoICd3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X2NvbXBhY3QnICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wbGV0ZWx5IEhpZGUgVmVydGljYWwgTGVmdCBCYXIuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FkbWluX3VpX19zaWRlYmFyX2xlZnRfX2RvX2hpZGUoKSB7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnbWluIG1heCBjb21wYWN0IG5vbmUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLmFkZENsYXNzKCAnbm9uZScgKTtcclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX29wZW5fbGVmdF92ZXJ0aWNhbF9uYXYnICkucmVtb3ZlQ2xhc3MoICd3cGJjX3VpX19oaWRlJyApO1xyXG5cdGpRdWVyeSggJy53cGJjX3VpX190b3BfbmF2X19idG5faGlkZV9sZWZ0X3ZlcnRpY2FsX25hdicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0Ly8gSGlkZSB0b3AgXCJNZW51XCIgYnV0dG9uIHdpdGggZGl2aWRlci5cclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX3Nob3dfbGVmdF92ZXJ0aWNhbF9uYXYsLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9zaG93X2xlZnRfdmVydGljYWxfbmF2X2RpdmlkZXInICkuYWRkQ2xhc3MoICd3cGJjX3VpX19oaWRlJyApO1xyXG5cclxuXHRqUXVlcnkoICcud3AtYWRtaW4nICkucmVtb3ZlQ2xhc3MoICd3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X21pbiB3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X21heCB3cGJjX3BhZ2Vfd3JhcHBlcl9sZWZ0X2NvbXBhY3Qgd3BiY19wYWdlX3dyYXBwZXJfbGVmdF9ub25lJyApO1xyXG5cdGpRdWVyeSggJy53cC1hZG1pbicgKS5hZGRDbGFzcyggJ3dwYmNfcGFnZV93cmFwcGVyX2xlZnRfbm9uZScgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFjdGlvbiBvbiBjbGljayBcIkdvIEJhY2tcIiAtIHNob3cgcm9vdCBtZW51XHJcbiAqIG9yIHNvbWUgb3RoZXIgc2VjdGlvbiBpbiBsZWZ0IHNpZGViYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHJpbmcgbWVudV90b19zaG93IC0gbWVudSBzbHVnLlxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hZG1pbl91aV9fc2lkZWJhcl9sZWZ0X19zaG93X3NlY3Rpb24oIG1lbnVfdG9fc2hvdyApIHtcclxuXHRqUXVlcnkoICcud3BiY191aV9lbF9fdmVydF9sZWZ0X2Jhcl9fc2VjdGlvbicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnIClcclxuXHRqUXVlcnkoICcud3BiY191aV9lbF9fdmVydF9sZWZ0X2Jhcl9fc2VjdGlvbl8nICsgbWVudV90b19zaG93ICkucmVtb3ZlQ2xhc3MoICd3cGJjX3VpX19oaWRlJyApO1xyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gPT0gUmlnaHQgU2lkZSBCYXIgIC0gIGV4cGFuZCAvIGNvbGFwc2UgZnVuY3Rpb25zICAgPT1cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogRXhwYW5kIFZlcnRpY2FsIFJpZ2h0IEJhci5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX3NpZGViYXJfcmlnaHRfX2RvX21heCgpIHtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdtaW5fcmlnaHQgbWF4X3JpZ2h0IGNvbXBhY3RfcmlnaHQgbm9uZV9yaWdodCcgKTtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkuYWRkQ2xhc3MoICdtYXhfcmlnaHQnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9vcGVuX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9oaWRlX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIFZlcnRpY2FsIFJpZ2h0IEJhci5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX3NpZGViYXJfcmlnaHRfX2RvX21pbigpIHtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdtaW5fcmlnaHQgbWF4X3JpZ2h0IGNvbXBhY3RfcmlnaHQgbm9uZV9yaWdodCcgKTtcclxuXHRqUXVlcnkoICcud3BiY19zZXR0aW5nc19wYWdlX3dyYXBwZXInICkuYWRkQ2xhc3MoICdtaW5fcmlnaHQnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9vcGVuX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9oaWRlX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb2xhcHNlIFZlcnRpY2FsIFJpZ2h0IEJhci5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX3NpZGViYXJfcmlnaHRfX2RvX2NvbXBhY3QoKSB7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnbWluX3JpZ2h0IG1heF9yaWdodCBjb21wYWN0X3JpZ2h0IG5vbmVfcmlnaHQnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfc2V0dGluZ3NfcGFnZV93cmFwcGVyJyApLmFkZENsYXNzKCAnY29tcGFjdF9yaWdodCcgKTtcclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX29wZW5fcmlnaHRfdmVydGljYWxfbmF2JyApLnJlbW92ZUNsYXNzKCAnd3BiY191aV9faGlkZScgKTtcclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX2hpZGVfcmlnaHRfdmVydGljYWxfbmF2JyApLmFkZENsYXNzKCAnd3BiY191aV9faGlkZScgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXBsZXRlbHkgSGlkZSBWZXJ0aWNhbCBSaWdodCBCYXIuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FkbWluX3VpX19zaWRlYmFyX3JpZ2h0X19kb19oaWRlKCkge1xyXG5cdGpRdWVyeSggJy53cGJjX3NldHRpbmdzX3BhZ2Vfd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ21pbl9yaWdodCBtYXhfcmlnaHQgY29tcGFjdF9yaWdodCBub25lX3JpZ2h0JyApO1xyXG5cdGpRdWVyeSggJy53cGJjX3NldHRpbmdzX3BhZ2Vfd3JhcHBlcicgKS5hZGRDbGFzcyggJ25vbmVfcmlnaHQnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9vcGVuX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfX3RvcF9uYXZfX2J0bl9oaWRlX3JpZ2h0X3ZlcnRpY2FsX25hdicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcblx0Ly8gSGlkZSB0b3AgXCJNZW51XCIgYnV0dG9uIHdpdGggZGl2aWRlci5cclxuXHRqUXVlcnkoICcud3BiY191aV9fdG9wX25hdl9fYnRuX3Nob3dfcmlnaHRfdmVydGljYWxfbmF2LC53cGJjX3VpX190b3BfbmF2X19idG5fc2hvd19yaWdodF92ZXJ0aWNhbF9uYXZfZGl2aWRlcicgKS5hZGRDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBY3Rpb24gb24gY2xpY2sgXCJHbyBCYWNrXCIgLSBzaG93IHJvb3QgbWVudVxyXG4gKiBvciBzb21lIG90aGVyIHNlY3Rpb24gaW4gcmlnaHQgc2lkZWJhci5cclxuICpcclxuICogQHBhcmFtIHN0cmluZyBtZW51X3RvX3Nob3cgLSBtZW51IHNsdWcuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FkbWluX3VpX19zaWRlYmFyX3JpZ2h0X19zaG93X3NlY3Rpb24oIG1lbnVfdG9fc2hvdyApIHtcclxuXHRqUXVlcnkoICcud3BiY191aV9lbF9fdmVydF9yaWdodF9iYXJfX3NlY3Rpb24nICkuYWRkQ2xhc3MoICd3cGJjX3VpX19oaWRlJyApXHJcblx0alF1ZXJ5KCAnLndwYmNfdWlfZWxfX3ZlcnRfcmlnaHRfYmFyX19zZWN0aW9uXycgKyBtZW51X3RvX3Nob3cgKS5yZW1vdmVDbGFzcyggJ3dwYmNfdWlfX2hpZGUnICk7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyA9PSBFbmQgUmlnaHQgU2lkZSBCYXIgIHNlY3Rpb24gICA9PVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW5jaG9yKHMpIGFycmF5ICBmcm9tICBVUkwuXHJcbiAqIERvYzogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0xvY2F0aW9uXHJcbiAqXHJcbiAqIEByZXR1cm5zIHsqW119XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX3VybF9nZXRfYW5jaG9yc19hcnIoKSB7XHJcblx0dmFyIGhhc2hlcyAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggJyUyMycsICcjJyApO1xyXG5cdHZhciBoYXNoZXNfYXJyICAgICAgICA9IGhhc2hlcy5zcGxpdCggJyMnICk7XHJcblx0dmFyIHJlc3VsdCAgICAgICAgICAgID0gW107XHJcblx0dmFyIGhhc2hlc19hcnJfbGVuZ3RoID0gaGFzaGVzX2Fyci5sZW5ndGg7XHJcblxyXG5cdGZvciAoIHZhciBpID0gMDsgaSA8IGhhc2hlc19hcnJfbGVuZ3RoOyBpKysgKSB7XHJcblx0XHRpZiAoIGhhc2hlc19hcnJbaV0ubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goIGhhc2hlc19hcnJbaV0gKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEF1dG8gRXhwYW5kIFNldHRpbmdzIHNlY3Rpb24gYmFzZWQgb24gVVJMIGFuY2hvciwgYWZ0ZXIgIHBhZ2UgbG9hZGVkLlxyXG4gKi9cclxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoKSB7IHdwYmNfYWRtaW5fdWlfX2RvX2V4cGFuZF9zZWN0aW9uKCk7IHNldFRpbWVvdXQoICd3cGJjX2FkbWluX3VpX19kb19leHBhbmRfc2VjdGlvbicsIDEwICk7IH0gKTtcclxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoKSB7IHdwYmNfYWRtaW5fdWlfX2RvX2V4cGFuZF9zZWN0aW9uKCk7IHNldFRpbWVvdXQoICd3cGJjX2FkbWluX3VpX19kb19leHBhbmRfc2VjdGlvbicsIDE1MCApOyB9ICk7XHJcblxyXG4vKipcclxuICogRXhwYW5kIHNlY3Rpb24gaW4gIEdlbmVyYWwgU2V0dGluZ3MgcGFnZSBhbmQgc2VsZWN0IE1lbnUgaXRlbS5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX2RvX2V4cGFuZF9zZWN0aW9uKCkge1xyXG5cclxuXHQvLyB3aW5kb3cubG9jYXRpb24uaGFzaCAgPSAjc2VjdGlvbl9pZCAgLyAgZG9jOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTG9jYXRpb24gLlxyXG5cdHZhciBhbmNob3JzX2FyciAgICAgICAgPSB3cGJjX3VybF9nZXRfYW5jaG9yc19hcnIoKTtcclxuXHR2YXIgYW5jaG9yc19hcnJfbGVuZ3RoID0gYW5jaG9yc19hcnIubGVuZ3RoO1xyXG5cclxuXHRpZiAoIGFuY2hvcnNfYXJyX2xlbmd0aCA+IDAgKSB7XHJcblx0XHR2YXIgb25lX2FuY2hvcl9wcm9wX3ZhbHVlID0gYW5jaG9yc19hcnJbMF0uc3BsaXQoICdkb19leHBhbmRfXycgKTtcclxuXHRcdGlmICggb25lX2FuY2hvcl9wcm9wX3ZhbHVlLmxlbmd0aCA+IDEgKSB7XHJcblxyXG5cdFx0XHQvLyAnd3BiY19nZW5lcmFsX3NldHRpbmdzX2NhbGVuZGFyX21ldGFib3gnXHJcblx0XHRcdHZhciBzZWN0aW9uX3RvX3Nob3cgICAgPSBvbmVfYW5jaG9yX3Byb3BfdmFsdWVbMV07XHJcblx0XHRcdHZhciBzZWN0aW9uX2lkX3RvX3Nob3cgPSAnIycgKyBzZWN0aW9uX3RvX3Nob3c7XHJcblxyXG5cclxuXHRcdFx0Ly8gLS0gUmVtb3ZlIHNlbGVjdGVkIGJhY2tncm91bmQgaW4gYWxsIGxlZnQgIG1lbnUgIGl0ZW1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRqUXVlcnkoICcud3BiY191aV9lbF9fdmVydF9uYXZfaXRlbSAnICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XHJcblx0XHRcdC8vIFNldCBsZWZ0IG1lbnUgc2VsZWN0ZWQuXHJcblx0XHRcdGpRdWVyeSggJy5kb19leHBhbmRfXycgKyBzZWN0aW9uX3RvX3Nob3cgKyAnX2xpbmsnICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XHJcblx0XHRcdHZhciBzZWxlY3RlZF90aXRsZSA9IGpRdWVyeSggJy5kb19leHBhbmRfXycgKyBzZWN0aW9uX3RvX3Nob3cgKyAnX2xpbmsgYSAud3BiY191aV9lbF9fdmVydF9uYXZfdGl0bGUgJyApLnRleHQoKTtcclxuXHJcblx0XHRcdC8vIEV4cGFuZCBzZWN0aW9uLCBpZiBpdCBjb2xhcHNlZC5cclxuXHRcdFx0aWYgKCAhIGpRdWVyeSggJy5kb19leHBhbmRfXycgKyBzZWN0aW9uX3RvX3Nob3cgKyAnX2xpbmsnICkucGFyZW50cyggJy53cGJjX3VpX2VsX19sZXZlbF9fZm9sZGVyJyApLmhhc0NsYXNzKCAnZXhwYW5kZWQnICkgKSB7XHJcblx0XHRcdFx0alF1ZXJ5KCAnLndwYmNfdWlfZWxfX2xldmVsX19mb2xkZXInICkucmVtb3ZlQ2xhc3MoICdleHBhbmRlZCcgKTtcclxuXHRcdFx0XHRqUXVlcnkoICcuZG9fZXhwYW5kX18nICsgc2VjdGlvbl90b19zaG93ICsgJ19saW5rJyApLnBhcmVudHMoICcud3BiY191aV9lbF9fbGV2ZWxfX2ZvbGRlcicgKS5hZGRDbGFzcyggJ2V4cGFuZGVkJyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyAtLSBFeHBhbmQgc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0dmFyIGNvbnRhaW5lcl90b19oaWRlX2NsYXNzID0gJy5wb3N0Ym94JztcclxuXHRcdFx0Ly8gSGlkZSBzZWN0aW9ucyAnLnBvc3Rib3gnIGluIGFkbWluIHBhZ2UgYW5kIHNob3cgc3BlY2lmaWMgb25lLlxyXG5cdFx0XHRqUXVlcnkoICcud3BiY19hZG1pbl9wYWdlICcgKyBjb250YWluZXJfdG9faGlkZV9jbGFzcyApLmhpZGUoKTtcclxuXHRcdFx0alF1ZXJ5KCAnLndwYmNfY29udGFpbmVyX2Fsd2F5c19oaWRlX19vbl9sZWZ0X25hdl9jbGljaycgKS5oaWRlKCk7XHJcblx0XHRcdGpRdWVyeSggc2VjdGlvbl9pZF90b19zaG93ICkuc2hvdygpO1xyXG5cclxuXHRcdFx0Ly8gU2hvdyBhbGwgb3RoZXIgc2VjdGlvbnMsICBpZiBwcm92aWRlZCBpbiBVUkw6IC4uP3BhZ2U9d3BiYy1zZXR0aW5ncyNkb19leHBhbmRfX3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYXBhY2l0eV9tZXRhYm94I3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYXBhY2l0eV91cGdyYWRlX21ldGFib3ggLlxyXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDE7IGkgPCBhbmNob3JzX2Fycl9sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHRqUXVlcnkoICcjJyArIGFuY2hvcnNfYXJyW2ldICkuc2hvdygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGZhbHNlICkge1xyXG5cdFx0XHRcdHZhciB0YXJnZXRPZmZzZXQgPSB3cGJjX3Njcm9sbF90byggc2VjdGlvbl9pZF90b19zaG93ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIC0tIFNldCBWYWx1ZSB0byBJbnB1dCBhYm91dCBzZWxlY3RlZCBOYXYgZWxlbWVudCAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgICAgIC8vIEZpeEluOiA5LjguNi4xLlxyXG5cdFx0XHR2YXIgc2VjdGlvbl9pZF90YWIgPSBzZWN0aW9uX2lkX3RvX3Nob3cuc3Vic3RyaW5nKCAwLCBzZWN0aW9uX2lkX3RvX3Nob3cubGVuZ3RoIC0gOCApICsgJ190YWInO1xyXG5cdFx0XHRpZiAoIGNvbnRhaW5lcl90b19oaWRlX2NsYXNzID09IHNlY3Rpb25faWRfdG9fc2hvdyApIHtcclxuXHRcdFx0XHRzZWN0aW9uX2lkX3RhYiA9ICcjd3BiY19nZW5lcmFsX3NldHRpbmdzX2FsbF90YWInXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCAnI3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYXBhY2l0eV9tZXRhYm94LCN3cGJjX2dlbmVyYWxfc2V0dGluZ3NfY2FwYWNpdHlfdXBncmFkZV9tZXRhYm94JyA9PSBzZWN0aW9uX2lkX3RvX3Nob3cgKSB7XHJcblx0XHRcdFx0c2VjdGlvbl9pZF90YWIgPSAnI3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYXBhY2l0eV90YWInXHJcblx0XHRcdH1cclxuXHRcdFx0alF1ZXJ5KCAnI2Zvcm1fdmlzaWJsZV9zZWN0aW9uJyApLnZhbCggc2VjdGlvbl9pZF90YWIgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBMaWtlIGJsaW5raW5nIHNvbWUgZWxlbWVudHMuXHJcblx0XHR3cGJjX2FkbWluX3VpX19kb19fYW5jaG9yX19hbm90aGVyX2FjdGlvbnMoKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX2lzX2luX21vYmlsZV9zY3JlZW5fc2l6ZSgpIHtcclxuXHRyZXR1cm4gd3BiY19hZG1pbl91aV9faXNfaW5fdGhpc19zY3JlZW5fc2l6ZSggNjA1ICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX2lzX2luX3RoaXNfc2NyZWVuX3NpemUoc2l6ZSkge1xyXG5cdHJldHVybiAod2luZG93LnNjcmVlbi53aWR0aCA8PSBzaXplKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE9wZW4gc2V0dGluZ3MgcGFnZSAgfCAgRXhwYW5kIHNlY3Rpb24gIHwgIFNlbGVjdCBNZW51IGl0ZW0uXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FkbWluX3VpX19kb19fb3Blbl91cmxfX2V4cGFuZF9zZWN0aW9uKHVybCwgc2VjdGlvbl9pZCkge1xyXG5cclxuXHQvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybCArICcmZG9fZXhwYW5kPScgKyBzZWN0aW9uX2lkICsgJyNkb19leHBhbmRfXycgKyBzZWN0aW9uX2lkOyAvLy5cclxuXHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybCArICcjZG9fZXhwYW5kX18nICsgc2VjdGlvbl9pZDtcclxuXHJcblx0aWYgKCB3cGJjX2FkbWluX3VpX19pc19pbl9tb2JpbGVfc2NyZWVuX3NpemUoKSApIHtcclxuXHRcdHdwYmNfYWRtaW5fdWlfX3NpZGViYXJfbGVmdF9fZG9fbWluKCk7XHJcblx0fVxyXG5cclxuXHR3cGJjX2FkbWluX3VpX19kb19leHBhbmRfc2VjdGlvbigpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIENoZWNrICBmb3IgT3RoZXIgYWN0aW9uczogIExpa2UgYmxpbmtpbmcgc29tZSBlbGVtZW50cyBpbiBzZXR0aW5ncyBwYWdlLiBFLmcuIERheXMgc2VsZWN0aW9uICBvciAgY2hhbmdlLW92ZXIgZGF5cy5cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWRtaW5fdWlfX2RvX19hbmNob3JfX2Fub3RoZXJfYWN0aW9ucygpIHtcclxuXHJcblx0dmFyIGFuY2hvcnNfYXJyICAgICAgICA9IHdwYmNfdXJsX2dldF9hbmNob3JzX2FycigpO1xyXG5cdHZhciBhbmNob3JzX2Fycl9sZW5ndGggPSBhbmNob3JzX2Fyci5sZW5ndGg7XHJcblxyXG5cdC8vIE90aGVyIGFjdGlvbnM6ICBMaWtlIGJsaW5raW5nIHNvbWUgZWxlbWVudHMuXHJcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgYW5jaG9yc19hcnJfbGVuZ3RoOyBpKysgKSB7XHJcblxyXG5cdFx0dmFyIHRoaXNfYW5jaG9yID0gYW5jaG9yc19hcnJbaV07XHJcblxyXG5cdFx0dmFyIHRoaXNfYW5jaG9yX3Byb3BfdmFsdWUgPSB0aGlzX2FuY2hvci5zcGxpdCggJ2RvX290aGVyX2FjdGlvbnNfXycgKTtcclxuXHJcblx0XHRpZiAoIHRoaXNfYW5jaG9yX3Byb3BfdmFsdWUubGVuZ3RoID4gMSApIHtcclxuXHJcblx0XHRcdHZhciBzZWN0aW9uX2FjdGlvbiA9IHRoaXNfYW5jaG9yX3Byb3BfdmFsdWVbMV07XHJcblxyXG5cdFx0XHRzd2l0Y2ggKCBzZWN0aW9uX2FjdGlvbiApIHtcclxuXHJcblx0XHRcdFx0Y2FzZSAnYmxpbmtfZGF5X3NlbGVjdGlvbnMnOlxyXG5cdFx0XHRcdFx0Ly8gd3BiY191aV9zZXR0aW5nc19fcGFuZWxfX2NsaWNrKCAnI3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYWxlbmRhcl90YWIgYScsICcjd3BiY19nZW5lcmFsX3NldHRpbmdzX2NhbGVuZGFyX21ldGFib3gnLCAnRGF5cyBTZWxlY3Rpb24nICk7LlxyXG5cdFx0XHRcdFx0d3BiY19ibGlua19lbGVtZW50KCAnLndwYmNfdHJfc2V0X2dlbl9ib29raW5nX3R5cGVfb2ZfZGF5X3NlbGVjdGlvbnMnLCA0LCAzNTAgKTtcclxuXHRcdFx0XHRcdFx0d3BiY19zY3JvbGxfdG8oICcud3BiY190cl9zZXRfZ2VuX2Jvb2tpbmdfdHlwZV9vZl9kYXlfc2VsZWN0aW9ucycgKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdibGlua19jaGFuZ2Vfb3Zlcl9kYXlzJzpcclxuXHRcdFx0XHRcdC8vIHdwYmNfdWlfc2V0dGluZ3NfX3BhbmVsX19jbGljayggJyN3cGJjX2dlbmVyYWxfc2V0dGluZ3NfY2FsZW5kYXJfdGFiIGEnLCAnI3dwYmNfZ2VuZXJhbF9zZXR0aW5nc19jYWxlbmRhcl9tZXRhYm94JywgJ0NoYW5nZW92ZXIgRGF5cycgKTsuXHJcblx0XHRcdFx0XHR3cGJjX2JsaW5rX2VsZW1lbnQoICcud3BiY190cl9zZXRfZ2VuX2Jvb2tpbmdfcmFuZ2Vfc2VsZWN0aW9uX3RpbWVfaXNfYWN0aXZlJywgNCwgMzUwICk7XHJcblx0XHRcdFx0XHRcdHdwYmNfc2Nyb2xsX3RvKCAnLndwYmNfdHJfc2V0X2dlbl9ib29raW5nX3JhbmdlX3NlbGVjdGlvbl90aW1lX2lzX2FjdGl2ZScgKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdibGlua19jYXB0Y2hhJzpcclxuXHRcdFx0XHRcdHdwYmNfYmxpbmtfZWxlbWVudCggJy53cGJjX3RyX3NldF9nZW5fYm9va2luZ19pc191c2VfY2FwdGNoYScsIDQsIDM1MCApO1xyXG5cdFx0XHRcdFx0XHR3cGJjX3Njcm9sbF90byggJy53cGJjX3RyX3NldF9nZW5fYm9va2luZ19pc191c2VfY2FwdGNoYScgKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIENvcHkgdHh0IHRvIGNsaXBicmQgZnJvbSBUZXh0IGZpZWxkcy5cclxuICpcclxuICogQHBhcmFtIGh0bWxfZWxlbWVudF9pZCAgLSBlLmcuICdkYXRhX2ZpZWxkJ1xyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfY29weV90ZXh0X3RvX2NsaXBicmRfZnJvbV9lbGVtZW50KCBodG1sX2VsZW1lbnRfaWQgKSB7XHJcblx0Ly8gR2V0IHRoZSB0ZXh0IGZpZWxkLlxyXG5cdHZhciBjb3B5VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBodG1sX2VsZW1lbnRfaWQgKTtcclxuXHJcblx0Ly8gU2VsZWN0IHRoZSB0ZXh0IGZpZWxkLlxyXG5cdGNvcHlUZXh0LnNlbGVjdCgpO1xyXG5cdGNvcHlUZXh0LnNldFNlbGVjdGlvblJhbmdlKCAwLCA5OTk5OSApOyAvLyBGb3IgbW9iaWxlIGRldmljZXMuXHJcblxyXG5cdC8vIENvcHkgdGhlIHRleHQgaW5zaWRlIHRoZSB0ZXh0IGZpZWxkLlxyXG5cdHZhciBpc19jb3BpZWQgPSB3cGJjX2NvcHlfdGV4dF90b19jbGlwYnJkKCBjb3B5VGV4dC52YWx1ZSApO1xyXG5cdGlmICggISBpc19jb3BpZWQgKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCAnT29wcywgdW5hYmxlIHRvIGNvcHknLCBjb3B5VGV4dC52YWx1ZSApO1xyXG5cdH1cclxuXHRyZXR1cm4gaXNfY29waWVkO1xyXG59XHJcblxyXG4vKipcclxuICogQ29weSB0eHQgdG8gY2xpcGJyZC5cclxuICpcclxuICogQHBhcmFtIHRleHRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2NvcHlfdGV4dF90b19jbGlwYnJkKHRleHQpIHtcclxuXHJcblx0aWYgKCAhIG5hdmlnYXRvci5jbGlwYm9hcmQgKSB7XHJcblx0XHRyZXR1cm4gd3BiY19mYWxsYmFja19jb3B5X3RleHRfdG9fY2xpcGJyZCggdGV4dCApO1xyXG5cdH1cclxuXHJcblx0bmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoIHRleHQgKS50aGVuKFxyXG5cdFx0ZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyggJ0FzeW5jOiBDb3B5aW5nIHRvIGNsaXBib2FyZCB3YXMgc3VjY2Vzc2Z1bCEnICk7LlxyXG5cdFx0XHRyZXR1cm4gIHRydWU7XHJcblx0XHR9LFxyXG5cdFx0ZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHQvLyBjb25zb2xlLmVycm9yKCAnQXN5bmM6IENvdWxkIG5vdCBjb3B5IHRleHQ6ICcsIGVyciApOy5cclxuXHRcdFx0cmV0dXJuICBmYWxzZTtcclxuXHRcdH1cclxuXHQpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29weSB0eHQgdG8gY2xpcGJyZCAtIGRlcHJpY2F0ZWQgbWV0aG9kLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGV4dFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfZmFsbGJhY2tfY29weV90ZXh0X3RvX2NsaXBicmQoIHRleHQgKSB7XHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly8gdmFyIHRleHRBcmVhICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInRleHRhcmVhXCIgKTtcclxuXHQvLyB0ZXh0QXJlYS52YWx1ZSA9IHRleHQ7XHJcblx0Ly9cclxuXHQvLyAvLyBBdm9pZCBzY3JvbGxpbmcgdG8gYm90dG9tLlxyXG5cdC8vIHRleHRBcmVhLnN0eWxlLnRvcCAgICAgID0gXCIwXCI7XHJcblx0Ly8gdGV4dEFyZWEuc3R5bGUubGVmdCAgICAgPSBcIjBcIjtcclxuXHQvLyB0ZXh0QXJlYS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcclxuXHQvLyB0ZXh0QXJlYS5zdHlsZS56SW5kZXggICA9IFwiOTk5OTk5OTk5XCI7XHJcblx0Ly8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggdGV4dEFyZWEgKTtcclxuXHQvLyB0ZXh0QXJlYS5mb2N1cygpO1xyXG5cdC8vIHRleHRBcmVhLnNlbGVjdCgpO1xyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vIE5vdyBnZXQgaXQgYXMgSFRNTCAgKG9yaWdpbmFsIGhlcmUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQxOTE3ODAvamF2YXNjcmlwdC1jb3B5LXN0cmluZy10by1jbGlwYm9hcmQtYXMtdGV4dC1odG1sICkuXHJcblxyXG5cdC8vIFsxXSAtIENyZWF0ZSBjb250YWluZXIgZm9yIHRoZSBIVE1MLlxyXG5cdHZhciBjb250YWluZXIgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cclxuXHQvLyBbMl0gLSBIaWRlIGVsZW1lbnQuXHJcblx0Y29udGFpbmVyLnN0eWxlLnBvc2l0aW9uICAgICAgPSAnZml4ZWQnO1xyXG5cdGNvbnRhaW5lci5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG5cdGNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ICAgICAgID0gMDtcclxuXHJcblx0Ly8gRGV0ZWN0IGFsbCBzdHlsZSBzaGVldHMgb2YgdGhlIHBhZ2UuXHJcblx0dmFyIGFjdGl2ZVNoZWV0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBkb2N1bWVudC5zdHlsZVNoZWV0cyApLmZpbHRlcihcclxuXHRcdGZ1bmN0aW9uIChzaGVldCkge1xyXG5cdFx0XHRyZXR1cm4gISBzaGVldC5kaXNhYmxlZDtcclxuXHRcdH1cclxuXHQpO1xyXG5cclxuXHQvLyBbM10gLSBNb3VudCB0aGUgY29udGFpbmVyIHRvIHRoZSBET00gdG8gbWFrZSBgY29udGVudFdpbmRvd2AgYXZhaWxhYmxlLlxyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xyXG5cclxuXHQvLyBbNF0gLSBDb3B5IHRvIGNsaXBib2FyZC5cclxuXHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblxyXG5cdHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHJcblx0cmFuZ2Uuc2VsZWN0Tm9kZSggY29udGFpbmVyICk7XHJcblx0d2luZG93LmdldFNlbGVjdGlvbigpLmFkZFJhbmdlKCByYW5nZSApO1xyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHZhciByZXN1bHQgPSBmYWxzZTtcclxuXHJcblx0dHJ5IHtcclxuXHRcdHJlc3VsdCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCAnRmFsbGJhY2s6IENvcHlpbmcgdGV4dCBjb21tYW5kIHdhcyAnICsgbXNnICk7IC8vLlxyXG5cdH0gY2F0Y2ggKCBlcnIgKSB7XHJcblx0XHQvLyBjb25zb2xlLmVycm9yKCAnRmFsbGJhY2s6IE9vcHMsIHVuYWJsZSB0byBjb3B5JywgZXJyICk7IC8vLlxyXG5cdH1cclxuXHQvLyBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCB0ZXh0QXJlYSApOyAvLy5cclxuXHJcblx0Ly8gWzUuNF0gLSBFbmFibGUgQ1NTLlxyXG5cdHZhciBhY3RpdmVTaGVldHNfbGVuZ3RoID0gYWN0aXZlU2hlZXRzLmxlbmd0aDtcclxuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBhY3RpdmVTaGVldHNfbGVuZ3RoOyBpKysgKSB7XHJcblx0XHRhY3RpdmVTaGVldHNbaV0uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8vIFs2XSAtIFJlbW92ZSB0aGUgY29udGFpbmVyXHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggY29udGFpbmVyICk7XHJcblxyXG5cdHJldHVybiAgcmVzdWx0O1xyXG59IiwiLyoqXHJcbiAqIFdQQkMgQ29sbGFwc2libGUgR3JvdXBzXHJcbiAqXHJcbiAqIFVuaXZlcnNhbCwgZGVwZW5kZW5jeS1mcmVlIGNvbnRyb2xsZXIgZm9yIGV4cGFuZGluZy9jb2xsYXBzaW5nIGdyb3VwZWQgc2VjdGlvbnMgaW4gcmlnaHQtc2lkZSBwYW5lbHMgKEluc3BlY3Rvci9MaWJyYXJ5L0Zvcm0gU2V0dGluZ3MsIG9yIGFueSBvdGhlciBXUEJDIHBhZ2UpLlxyXG4gKlxyXG4gKiBcdFx0PT09IEhvdyB0byB1c2UgaXQgKHF1aWNrKSA/ID09PVxyXG4gKlxyXG4gKlx0XHQtLSAxLiBNYXJrdXAgKGluZGVwZW5kZW50IG1vZGU6IG11bHRpcGxlIG9wZW4gYWxsb3dlZCkgLS1cclxuICpcdFx0XHQ8ZGl2IGNsYXNzPVwid3BiY19jb2xsYXBzaWJsZVwiPlxyXG4gKlx0XHRcdCAgPHNlY3Rpb24gY2xhc3M9XCJ3cGJjX3VpX19jb2xsYXBzaWJsZV9ncm91cCBpcy1vcGVuXCI+XHJcbiAqXHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImdyb3VwX19oZWFkZXJcIj48aDM+R2VuZXJhbDwvaDM+PC9idXR0b24+XHJcbiAqXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ3JvdXBfX2ZpZWxkc1wiPuKApjwvZGl2PlxyXG4gKlx0XHRcdCAgPC9zZWN0aW9uPlxyXG4gKlx0XHRcdCAgPHNlY3Rpb24gY2xhc3M9XCJ3cGJjX3VpX19jb2xsYXBzaWJsZV9ncm91cFwiPlxyXG4gKlx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJncm91cF9faGVhZGVyXCI+PGgzPkFkdmFuY2VkPC9oMz48L2J1dHRvbj5cclxuICpcdFx0XHRcdDxkaXYgY2xhc3M9XCJncm91cF9fZmllbGRzXCI+4oCmPC9kaXY+XHJcbiAqXHRcdFx0ICA8L3NlY3Rpb24+XHJcbiAqXHRcdFx0PC9kaXY+XHJcbiAqXHJcbiAqXHRcdC0tIDIuIEV4Y2x1c2l2ZS9hY2NvcmRpb24gbW9kZSAob25lIG9wZW4gYXQgYSB0aW1lKSAtLVxyXG4gKlx0XHRcdDxkaXYgY2xhc3M9XCJ3cGJjX2NvbGxhcHNpYmxlIHdwYmNfY29sbGFwc2libGUtLWV4Y2x1c2l2ZVwiPuKApjwvZGl2PlxyXG4gKlxyXG4gKlx0XHQtLSAzLiBBdXRvLWluaXQgLS1cclxuICpcdFx0XHRUaGUgc2NyaXB0IGF1dG8taW5pdGlhbGl6ZXMgb24gRE9NQ29udGVudExvYWRlZC4gTm8gZXh0cmEgY29kZSBuZWVkZWQuXHJcbiAqXHJcbiAqXHRcdC0tIDQuIFByb2dyYW1tYXRpYyBjb250cm9sIChvcHRpb25hbClcclxuICpcdFx0XHRjb25zdCByb290ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dwYmNfYmZiX19pbnNwZWN0b3InKTtcclxuICpcdFx0XHRjb25zdCBhcGkgID0gcm9vdC5fX3dwYmNfY29sbGFwc2libGVfaW5zdGFuY2U7IC8vIHNldCBieSBhdXRvLWluaXRcclxuICpcclxuICpcdFx0XHRhcGkub3Blbl9ieV9oZWFkaW5nKCdWYWxpZGF0aW9uJyk7IC8vIG9wZW4gYnkgaGVhZGluZyB0ZXh0XHJcbiAqXHRcdFx0YXBpLm9wZW5fYnlfaW5kZXgoMCk7ICAgICAgICAgICAgICAvLyBvcGVuIHRoZSBmaXJzdCBncm91cFxyXG4gKlxyXG4gKlx0XHQtLSA1Lkxpc3RlbiB0byBldmVudHMgKGUuZy4sIHRvIHBlcnNpc3Qg4oCcb3BlbiBncm91cOKAnSBzdGF0ZSkgLS1cclxuICpcdFx0XHRyb290LmFkZEV2ZW50TGlzdGVuZXIoJ3dwYmM6Y29sbGFwc2libGU6b3BlbicsICAoZSkgPT4geyBjb25zb2xlLmxvZyggIGUuZGV0YWlsLmdyb3VwICk7IH0pO1xyXG4gKlx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignd3BiYzpjb2xsYXBzaWJsZTpjbG9zZScsIChlKSA9PiB7IGNvbnNvbGUubG9nKCAgZS5kZXRhaWwuZ3JvdXAgKTsgfSk7XHJcbiAqXHJcbiAqXHJcbiAqXHJcbiAqIE1hcmt1cCBleHBlY3RhdGlvbnMgKG1pbmltYWwpOlxyXG4gKiAgPGRpdiBjbGFzcz1cIndwYmNfY29sbGFwc2libGUgW3dwYmNfY29sbGFwc2libGUtLWV4Y2x1c2l2ZV1cIj5cclxuICogICAgPHNlY3Rpb24gY2xhc3M9XCJ3cGJjX3VpX19jb2xsYXBzaWJsZV9ncm91cCBbaXMtb3Blbl1cIj5cclxuICogICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImdyb3VwX19oZWFkZXJcIj4gLi4uIDwvYnV0dG9uPlxyXG4gKiAgICAgIDxkaXYgY2xhc3M9XCJncm91cF9fZmllbGRzXCI+IC4uLiA8L2Rpdj5cclxuICogICAgPC9zZWN0aW9uPlxyXG4gKiAgICAuLi4gbW9yZSA8c2VjdGlvbj4gLi4uXHJcbiAqICA8L2Rpdj5cclxuICpcclxuICogTm90ZXM6XHJcbiAqICAtIEFkZCBgaXMtb3BlbmAgdG8gYW55IHNlY3Rpb24geW91IHdhbnQgaW5pdGlhbGx5IGV4cGFuZGVkLlxyXG4gKiAgLSBBZGQgYHdwYmNfY29sbGFwc2libGUtLWV4Y2x1c2l2ZWAgdG8gdGhlIGNvbnRhaW5lciBmb3IgXCJvcGVuIG9uZSBhdCBhIHRpbWVcIiBiZWhhdmlvci5cclxuICogIC0gV29ya3Mgd2l0aCB5b3VyIGV4aXN0aW5nIEJGQiBtYXJrdXAgKGNsYXNzZXMgdXNlZCB0aGVyZSBhcmUgdGhlIGRlZmF1bHRzKS5cclxuICpcclxuICogQWNjZXNzaWJpbGl0eTpcclxuICogIC0gU2V0cyBhcmlhLWV4cGFuZGVkIG9uIC5ncm91cF9faGVhZGVyXHJcbiAqICAtIFNldHMgYXJpYS1oaWRkZW4gKyBbaGlkZGVuXSBvbiAuZ3JvdXBfX2ZpZWxkc1xyXG4gKiAgLSBBcnJvd1VwL0Fycm93RG93biBtb3ZlIGZvY3VzIGJldHdlZW4gaGVhZGVyczsgRW50ZXIvU3BhY2UgdG9nZ2xlc1xyXG4gKlxyXG4gKiBFdmVudHMgKGJ1YmJsZXMgZnJvbSB0aGUgPHNlY3Rpb24+KTpcclxuICogIC0gJ3dwYmM6Y29sbGFwc2libGU6b3BlbicgIChkZXRhaWw6IHsgZ3JvdXAsIHJvb3QsIGluc3RhbmNlIH0pXHJcbiAqICAtICd3cGJjOmNvbGxhcHNpYmxlOmNsb3NlJyAoZGV0YWlsOiB7IGdyb3VwLCByb290LCBpbnN0YW5jZSB9KVxyXG4gKlxyXG4gKiBQdWJsaWMgQVBJIChpbnN0YW5jZSBtZXRob2RzKTpcclxuICogIC0gaW5pdCgpLCBkZXN0cm95KCksIHJlZnJlc2goKVxyXG4gKiAgLSBleHBhbmQoZ3JvdXAsIFtleGNsdXNpdmVdKSwgY29sbGFwc2UoZ3JvdXApLCB0b2dnbGUoZ3JvdXApXHJcbiAqICAtIG9wZW5fYnlfaW5kZXgoaW5kZXgpLCBvcGVuX2J5X2hlYWRpbmcodGV4dClcclxuICogIC0gaXNfZXhjbHVzaXZlKCksIGlzX29wZW4oZ3JvdXApXHJcbiAqXHJcbiAqIEB2ZXJzaW9uIDIwMjUtMDgtMjZcclxuICogQHNpbmNlIDIwMjUtMDgtMjZcclxuICovXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyA9PSBGaWxlICAvY29sbGFwc2libGVfZ3JvdXBzLmpzID09IFRpbWUgcG9pbnQ6IDIwMjUtMDgtMjYgMTQ6MTNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbihmdW5jdGlvbiAodywgZCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Y2xhc3MgV1BCQ19Db2xsYXBzaWJsZV9Hcm91cHMge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRlIGEgY29sbGFwc2libGUgY29udHJvbGxlciBmb3IgYSBjb250YWluZXIuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudHxzdHJpbmd9IHJvb3RfZWxcclxuXHRcdCAqICAgICAgICBUaGUgY29udGFpbmVyIGVsZW1lbnQgKG9yIENTUyBzZWxlY3RvcikgdGhhdCB3cmFwcyBjb2xsYXBzaWJsZSBncm91cHMuXHJcblx0XHQgKiAgICAgICAgVGhlIGNvbnRhaW5lciB1c3VhbGx5IGhhcyB0aGUgY2xhc3MgYC53cGJjX2NvbGxhcHNpYmxlYC5cclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV1cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgW29wdHMuZ3JvdXBfc2VsZWN0b3I9Jy53cGJjX3VpX19jb2xsYXBzaWJsZV9ncm91cCddXHJcblx0XHQgKiAgICAgICAgU2VsZWN0b3IgZm9yIGVhY2ggY29sbGFwc2libGUgZ3JvdXAgaW5zaWRlIHRoZSBjb250YWluZXIuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gIFtvcHRzLmhlYWRlcl9zZWxlY3Rvcj0nLmdyb3VwX19oZWFkZXInXVxyXG5cdFx0ICogICAgICAgIFNlbGVjdG9yIGZvciB0aGUgY2xpY2thYmxlIGhlYWRlciBpbnNpZGUgYSBncm91cC5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgW29wdHMuZmllbGRzX3NlbGVjdG9yPScuZ3JvdXBfX2ZpZWxkcyddXHJcblx0XHQgKiAgICAgICAgU2VsZWN0b3IgZm9yIHRoZSBjb250ZW50L3BhbmVsIGVsZW1lbnQgaW5zaWRlIGEgZ3JvdXAuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gIFtvcHRzLm9wZW5fY2xhc3M9J2lzLW9wZW4nXVxyXG5cdFx0ICogICAgICAgIENsYXNzIG5hbWUgdGhhdCBpbmRpY2F0ZXMgdGhlIGdyb3VwIGlzIG9wZW4uXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmV4Y2x1c2l2ZT1mYWxzZV1cclxuXHRcdCAqICAgICAgICBJZiB0cnVlLCBvbmx5IG9uZSBncm91cCBjYW4gYmUgb3BlbiBhdCBhIHRpbWUgaW4gdGhpcyBjb250YWluZXIuXHJcblx0XHQgKlxyXG5cdFx0ICogQGNvbnN0cnVjdG9yXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3Rvcihyb290X2VsLCBvcHRzID0ge30pIHtcclxuXHRcdFx0dGhpcy5yb290ID0gKHR5cGVvZiByb290X2VsID09PSAnc3RyaW5nJykgPyBkLnF1ZXJ5U2VsZWN0b3IoIHJvb3RfZWwgKSA6IHJvb3RfZWw7XHJcblx0XHRcdHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24oIHtcclxuXHRcdFx0XHRncm91cF9zZWxlY3RvciA6ICcud3BiY191aV9fY29sbGFwc2libGVfZ3JvdXAnLFxyXG5cdFx0XHRcdGhlYWRlcl9zZWxlY3RvcjogJy5ncm91cF9faGVhZGVyJyxcclxuXHRcdFx0XHRmaWVsZHNfc2VsZWN0b3I6ICcuZ3JvdXBfX2ZpZWxkcywuZ3JvdXBfX2NvbnRlbnQnLFxyXG5cdFx0XHRcdG9wZW5fY2xhc3MgICAgIDogJ2lzLW9wZW4nLFxyXG5cdFx0XHRcdGV4Y2x1c2l2ZSAgICAgIDogZmFsc2VcclxuXHRcdFx0fSwgb3B0cyApO1xyXG5cclxuXHRcdFx0Ly8gQm91bmQgaGFuZGxlcnMgKGZvciBhZGQvcmVtb3ZlRXZlbnRMaXN0ZW5lciBzeW1tZXRyeSkuXHJcblx0XHRcdC8qKiBAcHJpdmF0ZSAqL1xyXG5cdFx0XHR0aGlzLl9vbl9jbGljayA9IHRoaXMuX29uX2NsaWNrLmJpbmQoIHRoaXMgKTtcclxuXHRcdFx0LyoqIEBwcml2YXRlICovXHJcblx0XHRcdHRoaXMuX29uX2tleWRvd24gPSB0aGlzLl9vbl9rZXlkb3duLmJpbmQoIHRoaXMgKTtcclxuXHJcblx0XHRcdC8qKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX0gQHByaXZhdGUgKi9cclxuXHRcdFx0dGhpcy5fZ3JvdXBzID0gW107XHJcblx0XHRcdC8qKiBAdHlwZSB7TXV0YXRpb25PYnNlcnZlcnxudWxsfSBAcHJpdmF0ZSAqL1xyXG5cdFx0XHR0aGlzLl9vYnNlcnZlciA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbml0aWFsaXplIHRoZSBjb250cm9sbGVyOiBjYWNoZSBncm91cHMsIGF0dGFjaCBsaXN0ZW5lcnMsIHNldCBBUklBLFxyXG5cdFx0ICogYW5kIHN0YXJ0IG9ic2VydmluZyBET00gY2hhbmdlcyBpbnNpZGUgdGhlIGNvbnRhaW5lci5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7V1BCQ19Db2xsYXBzaWJsZV9Hcm91cHN9IFRoZSBpbnN0YW5jZSAoY2hhaW5hYmxlKS5cclxuXHRcdCAqIEBsaXN0ZW5zIGNsaWNrXHJcblx0XHQgKiBAbGlzdGVucyBrZXlkb3duXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRpbml0KCkge1xyXG5cdFx0XHRpZiAoICF0aGlzLnJvb3QgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fZ3JvdXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXHJcblx0XHRcdFx0dGhpcy5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoIHRoaXMub3B0cy5ncm91cF9zZWxlY3RvciApXHJcblx0XHRcdCk7XHJcblx0XHRcdHRoaXMucm9vdC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9vbl9jbGljaywgZmFsc2UgKTtcclxuXHRcdFx0dGhpcy5yb290LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgdGhpcy5fb25fa2V5ZG93biwgZmFsc2UgKTtcclxuXHJcblx0XHRcdC8vIE9ic2VydmUgZHluYW1pYyBpbnNlcnRzL3JlbW92YWxzIChJbnNwZWN0b3IgcmUtcmVuZGVycykuXHJcblx0XHRcdHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnJlZnJlc2goKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0XHR0aGlzLl9vYnNlcnZlci5vYnNlcnZlKCB0aGlzLnJvb3QsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0gKTtcclxuXHJcblx0XHRcdHRoaXMuX3N5bmNfYWxsX2FyaWEoKTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUZWFyIGRvd24gdGhlIGNvbnRyb2xsZXI6IGRldGFjaCBsaXN0ZW5lcnMsIHN0b3AgdGhlIG9ic2VydmVyLFxyXG5cdFx0ICogYW5kIGRyb3AgaW50ZXJuYWwgcmVmZXJlbmNlcy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdGRlc3Ryb3koKSB7XHJcblx0XHRcdGlmICggIXRoaXMucm9vdCApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIHRoaXMuX29uX2NsaWNrLCBmYWxzZSApO1xyXG5cdFx0XHR0aGlzLnJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCB0aGlzLl9vbl9rZXlkb3duLCBmYWxzZSApO1xyXG5cdFx0XHRpZiAoIHRoaXMuX29ic2VydmVyICkge1xyXG5cdFx0XHRcdHRoaXMuX29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuXHRcdFx0XHR0aGlzLl9vYnNlcnZlciA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fZ3JvdXBzID0gW107XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZS1zY2FuIHRoZSBET00gZm9yIGN1cnJlbnQgZ3JvdXBzIGFuZCByZS1hcHBseSBBUklBIHRvIGFsbCBvZiB0aGVtLlxyXG5cdFx0ICogVXNlZnVsIGFmdGVyIGR5bmFtaWMgKHJlKXJlbmRlcnMuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRyZWZyZXNoKCkge1xyXG5cdFx0XHRpZiAoICF0aGlzLnJvb3QgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuX2dyb3VwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxyXG5cdFx0XHRcdHRoaXMucm9vdC5xdWVyeVNlbGVjdG9yQWxsKCB0aGlzLm9wdHMuZ3JvdXBfc2VsZWN0b3IgKVxyXG5cdFx0XHQpO1xyXG5cdFx0XHR0aGlzLl9zeW5jX2FsbF9hcmlhKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDaGVjayB3aGV0aGVyIHRoZSBjb250YWluZXIgaXMgaW4gZXhjbHVzaXZlIChhY2NvcmRpb24pIG1vZGUuXHJcblx0XHQgKlxyXG5cdFx0ICogT3JkZXIgb2YgcHJlY2VkZW5jZTpcclxuXHRcdCAqICAxKSBFeHBsaWNpdCBvcHRpb24gYG9wdHMuZXhjbHVzaXZlYFxyXG5cdFx0ICogIDIpIENvbnRhaW5lciBoYXMgY2xhc3MgYC53cGJjX2NvbGxhcHNpYmxlLS1leGNsdXNpdmVgXHJcblx0XHQgKiAgMykgQ29udGFpbmVyIG1hdGNoZXMgYFtkYXRhLXdwYmMtYWNjb3JkaW9uPVwiZXhjbHVzaXZlXCJdYFxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGV4Y2x1c2l2ZSBtb2RlIGlzIGFjdGl2ZS5cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdGlzX2V4Y2x1c2l2ZSgpIHtcclxuXHRcdFx0cmV0dXJuICEhKFxyXG5cdFx0XHRcdHRoaXMub3B0cy5leGNsdXNpdmUgfHxcclxuXHRcdFx0XHR0aGlzLnJvb3QuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19jb2xsYXBzaWJsZS0tZXhjbHVzaXZlJyApIHx8XHJcblx0XHRcdFx0dGhpcy5yb290Lm1hdGNoZXMoICdbZGF0YS13cGJjLWFjY29yZGlvbj1cImV4Y2x1c2l2ZVwiXScgKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBzcGVjaWZpYyBncm91cCBpcyBvcGVuLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGdyb3VwIFRoZSBncm91cCBlbGVtZW50IHRvIHRlc3QuXHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgZ3JvdXAgaXMgY3VycmVudGx5IG9wZW4uXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRpc19vcGVuKGdyb3VwKSB7XHJcblx0XHRcdHJldHVybiBncm91cC5jbGFzc0xpc3QuY29udGFpbnMoIHRoaXMub3B0cy5vcGVuX2NsYXNzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBPcGVuIGEgZ3JvdXAuIEhvbm9ycyBleGNsdXNpdmUgbW9kZSBieSBjb2xsYXBzaW5nIGFsbCBzaWJsaW5nIGdyb3Vwc1xyXG5cdFx0ICogKHF1ZXJpZWQgZnJvbSB0aGUgbGl2ZSBET00gYXQgY2FsbC10aW1lKS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBncm91cCBUaGUgZ3JvdXAgZWxlbWVudCB0byBvcGVuLlxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbZXhjbHVzaXZlXVxyXG5cdFx0ICogICAgICAgIElmIHByb3ZpZGVkLCBvdmVycmlkZXMgY29udGFpbmVyIG1vZGUgZm9yIHRoaXMgYWN0aW9uIG9ubHkuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBmaXJlcyBDdXN0b21FdmVudCN3cGJjOmNvbGxhcHNpYmxlOm9wZW5cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdGV4cGFuZChncm91cCwgZXhjbHVzaXZlKSB7XHJcblx0XHRcdGlmICggIWdyb3VwICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBkb19leGNsdXNpdmUgPSAodHlwZW9mIGV4Y2x1c2l2ZSA9PT0gJ2Jvb2xlYW4nKSA/IGV4Y2x1c2l2ZSA6IHRoaXMuaXNfZXhjbHVzaXZlKCk7XHJcblx0XHRcdGlmICggZG9fZXhjbHVzaXZlICkge1xyXG5cdFx0XHRcdC8vIEFsd2F5cyB1c2UgdGhlIGxpdmUgRE9NLCBub3QgdGhlIGNhY2hlZCBsaXN0LlxyXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXHJcblx0XHRcdFx0XHR0aGlzLnJvb3QucXVlcnlTZWxlY3RvckFsbCggdGhpcy5vcHRzLmdyb3VwX3NlbGVjdG9yICksXHJcblx0XHRcdFx0XHQoZykgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoIGcgIT09IGdyb3VwICkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuX3NldF9vcGVuKCBnLCBmYWxzZSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9zZXRfb3BlbiggZ3JvdXAsIHRydWUgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENsb3NlIGEgZ3JvdXAuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZ3JvdXAgVGhlIGdyb3VwIGVsZW1lbnQgdG8gY2xvc2UuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBmaXJlcyBDdXN0b21FdmVudCN3cGJjOmNvbGxhcHNpYmxlOmNsb3NlXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRjb2xsYXBzZShncm91cCkge1xyXG5cdFx0XHRpZiAoICFncm91cCApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fc2V0X29wZW4oIGdyb3VwLCBmYWxzZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVG9nZ2xlIGEgZ3JvdXAncyBvcGVuL2Nsb3NlZCBzdGF0ZS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBncm91cCBUaGUgZ3JvdXAgZWxlbWVudCB0byB0b2dnbGUuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdHRvZ2dsZShncm91cCkge1xyXG5cdFx0XHRpZiAoICFncm91cCApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpc1t0aGlzLmlzX29wZW4oIGdyb3VwICkgPyAnY29sbGFwc2UnIDogJ2V4cGFuZCddKCBncm91cCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogT3BlbiBhIGdyb3VwIGJ5IGl0cyBpbmRleCB3aXRoaW4gdGhlIGNvbnRhaW5lciAoMC1iYXNlZCkuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGdyb3VwLlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRvcGVuX2J5X2luZGV4KGluZGV4KSB7XHJcblx0XHRcdGNvbnN0IGdyb3VwID0gdGhpcy5fZ3JvdXBzW2luZGV4XTtcclxuXHRcdFx0aWYgKCBncm91cCApIHtcclxuXHRcdFx0XHR0aGlzLmV4cGFuZCggZ3JvdXAgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogT3BlbiBhIGdyb3VwIGJ5IG1hdGNoaW5nIHRleHQgY29udGFpbmVkIHdpdGhpbiB0aGUgPGgzPiBpbnNpZGUgdGhlIGhlYWRlci5cclxuXHRcdCAqIFRoZSBjb21wYXJpc29uIGlzIGNhc2UtaW5zZW5zaXRpdmUgYW5kIHN1YnN0cmluZy1iYXNlZC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHRvIG1hdGNoIGFnYWluc3QgdGhlIGhlYWRpbmcgY29udGVudHMuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdG9wZW5fYnlfaGVhZGluZyh0ZXh0KSB7XHJcblx0XHRcdGlmICggIXRleHQgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHQgICAgID0gU3RyaW5nKCB0ZXh0ICkudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0Y29uc3QgbWF0Y2ggPSB0aGlzLl9ncm91cHMuZmluZCggKGcpID0+IHtcclxuXHRcdFx0XHRjb25zdCBoID0gZy5xdWVyeVNlbGVjdG9yKCB0aGlzLm9wdHMuaGVhZGVyX3NlbGVjdG9yICsgJyBoMycgKTtcclxuXHRcdFx0XHRyZXR1cm4gaCAmJiBoLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggdCApICE9PSAtMTtcclxuXHRcdFx0fSApO1xyXG5cdFx0XHRpZiAoIG1hdGNoICkge1xyXG5cdFx0XHRcdHRoaXMuZXhwYW5kKCBtYXRjaCApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0Ly8gSW50ZXJuYWxcclxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlbGVnYXRlZCBjbGljayBoYW5kbGVyIGZvciBoZWFkZXJzLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2IFRoZSBjbGljayBldmVudC5cclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICogQHNpbmNlIDIwMjUtMDgtMjZcclxuXHRcdCAqL1xyXG5cdFx0X29uX2NsaWNrKGV2KSB7XHJcblx0XHRcdGNvbnN0IGJ0biA9IGV2LnRhcmdldC5jbG9zZXN0KCB0aGlzLm9wdHMuaGVhZGVyX3NlbGVjdG9yICk7XHJcblx0XHRcdGlmICggIWJ0biB8fCAhdGhpcy5yb290LmNvbnRhaW5zKCBidG4gKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdGNvbnN0IGdyb3VwID0gYnRuLmNsb3Nlc3QoIHRoaXMub3B0cy5ncm91cF9zZWxlY3RvciApO1xyXG5cdFx0XHRpZiAoIGdyb3VwICkge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlKCBncm91cCApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBLZXlib2FyZCBoYW5kbGVyIGZvciBoZWFkZXIgaW50ZXJhY3Rpb25zIGFuZCByb3ZpbmcgZm9jdXM6XHJcblx0XHQgKiAgLSBFbnRlci9TcGFjZSB0b2dnbGVzIHRoZSBhY3RpdmUgZ3JvdXAuXHJcblx0XHQgKiAgLSBBcnJvd1VwL0Fycm93RG93biBtb3ZlcyBmb2N1cyBiZXR3ZWVuIGdyb3VwIGhlYWRlcnMuXHJcblx0XHQgKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXYgVGhlIGtleWJvYXJkIGV2ZW50LlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRfb25fa2V5ZG93bihldikge1xyXG5cdFx0XHRjb25zdCBidG4gPSBldi50YXJnZXQuY2xvc2VzdCggdGhpcy5vcHRzLmhlYWRlcl9zZWxlY3RvciApO1xyXG5cdFx0XHRpZiAoICFidG4gKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBrZXkgPSBldi5rZXk7XHJcblxyXG5cdFx0XHQvLyBUb2dnbGUgb24gRW50ZXIgLyBTcGFjZS5cclxuXHRcdFx0aWYgKCBrZXkgPT09ICdFbnRlcicgfHwga2V5ID09PSAnICcgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb25zdCBncm91cCA9IGJ0bi5jbG9zZXN0KCB0aGlzLm9wdHMuZ3JvdXBfc2VsZWN0b3IgKTtcclxuXHRcdFx0XHRpZiAoIGdyb3VwICkge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGUoIGdyb3VwICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTW92ZSBmb2N1cyB3aXRoIEFycm93VXAvQXJyb3dEb3duIGJldHdlZW4gaGVhZGVycyBpbiB0aGlzIGNvbnRhaW5lci5cclxuXHRcdFx0aWYgKCBrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICdBcnJvd0Rvd24nICkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29uc3QgaGVhZGVycyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcclxuXHRcdFx0XHRcdHRoaXMucm9vdC5xdWVyeVNlbGVjdG9yQWxsKCB0aGlzLm9wdHMuZ3JvdXBfc2VsZWN0b3IgKSxcclxuXHRcdFx0XHRcdChnKSA9PiBnLnF1ZXJ5U2VsZWN0b3IoIHRoaXMub3B0cy5oZWFkZXJfc2VsZWN0b3IgKVxyXG5cdFx0XHRcdCkuZmlsdGVyKCBCb29sZWFuICk7XHJcblx0XHRcdFx0Y29uc3QgaWR4ICAgICA9IGhlYWRlcnMuaW5kZXhPZiggYnRuICk7XHJcblx0XHRcdFx0aWYgKCBpZHggIT09IC0xICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgbmV4dF9pZHggPSAoa2V5ID09PSAnQXJyb3dEb3duJylcclxuXHRcdFx0XHRcdFx0PyBNYXRoLm1pbiggaGVhZGVycy5sZW5ndGggLSAxLCBpZHggKyAxIClcclxuXHRcdFx0XHRcdFx0OiBNYXRoLm1heCggMCwgaWR4IC0gMSApO1xyXG5cdFx0XHRcdFx0aGVhZGVyc1tuZXh0X2lkeF0uZm9jdXMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFwcGx5IEFSSUEgc3luY2hyb25pemF0aW9uIHRvIGFsbCBrbm93biBncm91cHMgYmFzZWQgb24gdGhlaXIgb3BlbiBzdGF0ZS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRfc3luY19hbGxfYXJpYSgpIHtcclxuXHRcdFx0dGhpcy5fZ3JvdXBzLmZvckVhY2goIChnKSA9PiB0aGlzLl9zeW5jX2dyb3VwX2FyaWEoIGcgKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3luYyBBUklBIGF0dHJpYnV0ZXMgYW5kIHZpc2liaWxpdHkgb24gYSBzaW5nbGUgZ3JvdXAuXHJcblx0XHQgKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGdyb3VwIFRoZSBncm91cCBlbGVtZW50IHRvIHN5bmMuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBzaW5jZSAyMDI1LTA4LTI2XHJcblx0XHQgKi9cclxuXHRcdF9zeW5jX2dyb3VwX2FyaWEoZ3JvdXApIHtcclxuXHRcdFx0Y29uc3QgaXNfb3BlbiA9IHRoaXMuaXNfb3BlbiggZ3JvdXAgKTtcclxuXHRcdFx0Y29uc3QgaGVhZGVyICA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoIHRoaXMub3B0cy5oZWFkZXJfc2VsZWN0b3IgKTtcclxuXHRcdFx0Ly8gT25seSBkaXJlY3QgY2hpbGRyZW4gdGhhdCBtYXRjaC5cclxuXHRcdFx0Y29uc3QgcGFuZWxzID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKCBncm91cC5jaGlsZHJlbiwgKGVsKSA9PiBlbC5tYXRjaGVzKCB0aGlzLm9wdHMuZmllbGRzX3NlbGVjdG9yICkgKTtcclxuXHJcblx0XHRcdC8vIEhlYWRlciBBUklBLlxyXG5cdFx0XHRpZiAoIGhlYWRlciApIHtcclxuXHRcdFx0XHRoZWFkZXIuc2V0QXR0cmlidXRlKCAncm9sZScsICdidXR0b24nICk7XHJcblx0XHRcdFx0aGVhZGVyLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCBpc19vcGVuID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xyXG5cclxuXHRcdFx0XHRpZiAoIHBhbmVscy5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHQvLyBFbnN1cmUgZWFjaCBwYW5lbCBoYXMgYW4gaWQ7IHRoZW4gd2lyZSBhcmlhLWNvbnRyb2xzIHdpdGggc3BhY2Utc2VwYXJhdGVkIGlkcy5cclxuXHRcdFx0XHRcdGNvbnN0IGlkcyA9IHBhbmVscy5tYXAoIChwKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICggIXAuaWQgKSBwLmlkID0gdGhpcy5fZ2VuZXJhdGVfaWQoICd3cGJjX2NvbGxhcHNpYmxlX3BhbmVsJyApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcC5pZDtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRcdGhlYWRlci5zZXRBdHRyaWJ1dGUoICdhcmlhLWNvbnRyb2xzJywgaWRzLmpvaW4oICcgJyApICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyAoMykgUGFuZWxzIEFSSUEgKyB2aXNpYmlsaXR5LlxyXG5cdFx0XHRwYW5lbHMuZm9yRWFjaCggKHApID0+IHtcclxuXHRcdFx0XHRwLmhpZGRlbiA9ICFpc19vcGVuOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhY3R1YWwgdmlzaWJpbGl0eS5cclxuXHRcdFx0XHRwLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgaXNfb3BlbiA/ICdmYWxzZScgOiAndHJ1ZScgKTsgLy8gQVJJQS5cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW50ZXJuYWwgc3RhdGUgY2hhbmdlOiBzZXQgYSBncm91cCdzIG9wZW4vY2xvc2VkIHN0YXRlLCBzeW5jIEFSSUEsXHJcblx0XHQgKiBtYW5hZ2UgZm9jdXMgb24gY29sbGFwc2UsIGFuZCBlbWl0IGEgY3VzdG9tIGV2ZW50LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBncm91cCBUaGUgZ3JvdXAgZWxlbWVudCB0byBtdXRhdGUuXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IG9wZW4gV2hldGhlciB0aGUgZ3JvdXAgc2hvdWxkIGJlIG9wZW4uXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqIEBmaXJlcyBDdXN0b21FdmVudCN3cGJjOmNvbGxhcHNpYmxlOm9wZW5cclxuXHRcdCAqIEBmaXJlcyBDdXN0b21FdmVudCN3cGJjOmNvbGxhcHNpYmxlOmNsb3NlXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRfc2V0X29wZW4oZ3JvdXAsIG9wZW4pIHtcclxuXHRcdFx0aWYgKCAhb3BlbiAmJiBncm91cC5jb250YWlucyggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCApICkge1xyXG5cdFx0XHRcdGNvbnN0IGhlYWRlciA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoIHRoaXMub3B0cy5oZWFkZXJfc2VsZWN0b3IgKTtcclxuXHRcdFx0XHRoZWFkZXIgJiYgaGVhZGVyLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3JvdXAuY2xhc3NMaXN0LnRvZ2dsZSggdGhpcy5vcHRzLm9wZW5fY2xhc3MsIG9wZW4gKTtcclxuXHRcdFx0dGhpcy5fc3luY19ncm91cF9hcmlhKCBncm91cCApO1xyXG5cdFx0XHRjb25zdCBldl9uYW1lID0gb3BlbiA/ICd3cGJjOmNvbGxhcHNpYmxlOm9wZW4nIDogJ3dwYmM6Y29sbGFwc2libGU6Y2xvc2UnO1xyXG5cdFx0XHRncm91cC5kaXNwYXRjaEV2ZW50KCBuZXcgQ3VzdG9tRXZlbnQoIGV2X25hbWUsIHtcclxuXHRcdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRcdGRldGFpbCA6IHsgZ3JvdXAsIHJvb3Q6IHRoaXMucm9vdCwgaW5zdGFuY2U6IHRoaXMgfVxyXG5cdFx0XHR9ICkgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEdlbmVyYXRlIGEgdW5pcXVlIERPTSBpZCB3aXRoIHRoZSBzcGVjaWZpZWQgcHJlZml4LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IFRoZSBpZCBwcmVmaXggdG8gdXNlLlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gQSB1bmlxdWUgZWxlbWVudCBpZCBub3QgcHJlc2VudCBpbiB0aGUgZG9jdW1lbnQuXHJcblx0XHQgKiBAc2luY2UgMjAyNS0wOC0yNlxyXG5cdFx0ICovXHJcblx0XHRfZ2VuZXJhdGVfaWQocHJlZml4KSB7XHJcblx0XHRcdGxldCBpID0gMTtcclxuXHRcdFx0bGV0IGlkO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0aWQgPSBwcmVmaXggKyAnXycgKyAoaSsrKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR3aGlsZSAoIGQuZ2V0RWxlbWVudEJ5SWQoIGlkICkgKTtcclxuXHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXV0by1pbml0aWFsaXplIGNvbGxhcHNpYmxlIGNvbnRyb2xsZXJzIG9uIHRoZSBwYWdlLlxyXG5cdCAqIEZpbmRzIHRvcC1sZXZlbCBgLndwYmNfY29sbGFwc2libGVgIGNvbnRhaW5lcnMgKGlnbm9yaW5nIG5lc3RlZCBvbmVzKSxcclxuXHQgKiBhbmQgaW5zdGFudGlhdGVzIHtAbGluayBXUEJDX0NvbGxhcHNpYmxlX0dyb3Vwc30gb24gZWFjaC5cclxuXHQgKlxyXG5cdCAqIEBmdW5jdGlvbiBXUEJDX0NvbGxhcHNpYmxlX0F1dG9Jbml0XHJcblx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0ICogQHNpbmNlIDIwMjUtMDgtMjZcclxuXHQgKiBAZXhhbXBsZVxyXG5cdCAqIC8vIFJ1bnMgYXV0b21hdGljYWxseSBvbiBET01Db250ZW50TG9hZGVkOyBjYW4gYWxzbyBiZSBjYWxsZWQgbWFudWFsbHk6XHJcblx0ICogV1BCQ19Db2xsYXBzaWJsZV9BdXRvSW5pdCgpO1xyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHdwYmNfY29sbGFwc2libGVfX2F1dG9faW5pdCgpIHtcclxuXHRcdHZhciBST09UICA9ICcud3BiY19jb2xsYXBzaWJsZSc7XHJcblx0XHR2YXIgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggZC5xdWVyeVNlbGVjdG9yQWxsKCBST09UICkgKVxyXG5cdFx0XHQuZmlsdGVyKCBmdW5jdGlvbiAobikge1xyXG5cdFx0XHRcdHJldHVybiAhbi5wYXJlbnRFbGVtZW50IHx8ICFuLnBhcmVudEVsZW1lbnQuY2xvc2VzdCggUk9PVCApO1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0bm9kZXMuZm9yRWFjaCggZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdFx0aWYgKCBub2RlLl9fd3BiY19jb2xsYXBzaWJsZV9pbnN0YW5jZSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGV4Y2x1c2l2ZSA9IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19jb2xsYXBzaWJsZS0tZXhjbHVzaXZlJyApIHx8IG5vZGUubWF0Y2hlcyggJ1tkYXRhLXdwYmMtYWNjb3JkaW9uPVwiZXhjbHVzaXZlXCJdJyApO1xyXG5cclxuXHRcdFx0bm9kZS5fX3dwYmNfY29sbGFwc2libGVfaW5zdGFuY2UgPSBuZXcgV1BCQ19Db2xsYXBzaWJsZV9Hcm91cHMoIG5vZGUsIHsgZXhjbHVzaXZlIH0gKS5pbml0KCk7XHJcblx0XHR9ICk7XHJcblx0fVxyXG5cclxuXHQvLyBFeHBvcnQgdG8gZ2xvYmFsIGZvciBtYW51YWwgY29udHJvbCBpZiBuZWVkZWQuXHJcblx0dy5XUEJDX0NvbGxhcHNpYmxlX0dyb3VwcyAgID0gV1BCQ19Db2xsYXBzaWJsZV9Hcm91cHM7XHJcblx0dy5XUEJDX0NvbGxhcHNpYmxlX0F1dG9Jbml0ID0gd3BiY19jb2xsYXBzaWJsZV9fYXV0b19pbml0O1xyXG5cclxuXHQvLyBET00tcmVhZHkgYXV0byBpbml0LlxyXG5cdGlmICggZC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycgKSB7XHJcblx0XHRkLmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgd3BiY19jb2xsYXBzaWJsZV9fYXV0b19pbml0LCB7IG9uY2U6IHRydWUgfSApO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3cGJjX2NvbGxhcHNpYmxlX19hdXRvX2luaXQoKTtcclxuXHR9XHJcbn0pKCB3aW5kb3csIGRvY3VtZW50ICk7XHJcbiIsIi8qKlxyXG4gKiBCb29raW5nIENhbGVuZGFyIOKAlCBHZW5lcmljIFVJIFRhYnMgVXRpbGl0eSAoSlMpXHJcbiAqXHJcbiAqIFB1cnBvc2U6IExpZ2h0d2VpZ2h0LCBkZXBlbmRlbmN5LWZyZWUgdGFicyBjb250cm9sbGVyIGZvciBhbnkgc21hbGwgdGFiIGdyb3VwIGluIGFkbWluIFVJcy5cclxuICogLSBBdXRvLWluaXRpYWxpemVzIGdyb3VwcyBtYXJrZWQgd2l0aCBkYXRhLXdwYmMtdGFicy5cclxuICogLSBBc3NpZ25zIEFSSUEgcm9sZXMgYW5kIHRvZ2dsZXMgYXJpYS1zZWxlY3RlZC9hcmlhLWhpZGRlbi90YWJpbmRleC5cclxuICogLSBTdXBwb3J0cyBrZXlib2FyZCBuYXZpZ2F0aW9uIChMZWZ0L1JpZ2h0L0hvbWUvRW5kKS5cclxuICogLSBQdWJsaWMgQVBJOiB3aW5kb3cud3BiY191aV90YWJzLntpbml0X29uLCBpbml0X2dyb3VwLCBzZXRfYWN0aXZlfVxyXG4gKiAtIEVtaXRzICd3cGJjOnRhYnM6Y2hhbmdlJyBvbiB0aGUgZ3JvdXAgcm9vdCB3aGVuIHRoZSBhY3RpdmUgdGFiIGNoYW5nZXMuXHJcbiAqXHJcbiAqIE1hcmt1cCBjb250cmFjdDpcclxuICogLSBSb290OiAgIFtkYXRhLXdwYmMtdGFic11cclxuICogLSBUYWJzOiAgIFtkYXRhLXdwYmMtdGFiLWtleT1cIktcIl1cclxuICogLSBQYW5lbHM6IFtkYXRhLXdwYmMtdGFiLXBhbmVsPVwiS1wiXVxyXG4gKlxyXG4gKiBAcGFja2FnZSAgIEJvb2tpbmcgQ2FsZW5kYXJcclxuICogQHN1YnBhY2thZ2UgQWRtaW5cXFVJXHJcbiAqIEBzaW5jZSAgICAgMTEuMC4wXHJcbiAqIEB2ZXJzaW9uICAgMS4wLjBcclxuICogQHNlZSAgICAgICAvaW5jbHVkZXMvX19qcy9hZG1pbi91aV90YWJzL3VpX3RhYnMuanNcclxuICpcclxuICpcclxuICogSG93IGl0IHdvcmtzOlxyXG4gKiAtIFJvb3Qgbm9kZSBtdXN0IGhhdmUgW2RhdGEtd3BiYy10YWJzXSBhdHRyaWJ1dGUgKGFueSB2YWx1ZSkuXHJcbiAqIC0gVGFiIGJ1dHRvbnMgbXVzdCBjYXJyeSBbZGF0YS13cGJjLXRhYi1rZXk9XCIuLi5cIl0gKHVuaXF1ZSBwZXIgZ3JvdXApLlxyXG4gKiAtIFBhbmVscyBtdXN0IGNhcnJ5IFtkYXRhLXdwYmMtdGFiLXBhbmVsPVwiLi4uXCJdIHdpdGggbWF0Y2hpbmcga2V5cy5cclxuICogLSBBZGRzIFdBSS1BUklBIHJvbGVzIGFuZCBhcmlhLXNlbGVjdGVkL2hpZGRlbiB3aXJpbmcuXHJcbiAqXHJcbiAqIDxkaXYgZGF0YS13cGJjLXRhYnM9XCJjb2x1bW4tc3R5bGVzXCIgZGF0YS13cGJjLXRhYi1hY3RpdmU9XCIxXCIgICAgY2xhc3M9XCJ3cGJjX3VpX3RhYnNfcm9vdFwiID5cclxuICogICAgPCEtLSBUb3AgVGFicyAtLT5cclxuICogICAgPGRpdiBkYXRhLXdwYmMtdGFibGlzdD1cIlwiIHJvbGU9XCJ0YWJsaXN0XCIgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiIHdwYmNfdWlfZWxfX2hvcmlzX3RvcF9iYXJfX3dyYXBwZXJcIiA+XHJcbiAqICAgICAgICA8ZGl2IGNsYXNzPVwid3BiY191aV9lbF9faG9yaXNfdG9wX2Jhcl9fY29udGVudFwiPlxyXG4gKiAgICAgICAgICAgIDxoMiBjbGFzcz1cIndwYmNfdWlfZWxfX2hvcmlzX25hdl9sYWJlbFwiPkNvbHVtbjo8L2gyPlxyXG4gKlxyXG4gKiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cGJjX3VpX2VsX19ob3Jpc19uYXZfaXRlbSB3cGJjX3VpX2VsX19ob3Jpc19uYXZfaXRlbV9fMVwiPlxyXG4gKiAgICAgICAgICAgICAgICA8YVxyXG4gKiAgICAgICAgICAgICAgICAgICAgZGF0YS13cGJjLXRhYi1rZXk9XCIxXCJcclxuICogICAgICAgICAgICAgICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCIgcm9sZT1cInRhYlwiIHRhYmluZGV4PVwiMFwiIGFyaWEtY29udHJvbHM9XCJ3cGJjX3RhYl9wYW5lbF9jb2xfMVwiXHJcbiAqXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIlxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwid3BiY191aV9lbF9faG9yaXNfbmF2X2l0ZW1fX2Egd3BiY191aV9lbF9faG9yaXNfbmF2X2l0ZW1fX3NpbmdsZVwiXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ3cGJjX3RhYl9jb2xfMVwiXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJDb2x1bW4gMVwiXHJcbiAqICAgICAgICAgICAgICAgID48c3BhbiBjbGFzcz1cIndwYmNfdWlfZWxfX2hvcmlzX25hdl90aXRsZVwiPlRpdGxlIDE8L3NwYW4+PC9hPlxyXG4gKiAgICAgICAgICAgIDwvZGl2PlxyXG4gKiAgICAgICAgICAgIC4uLlxyXG4gKiAgICAgICAgPC9kaXY+XHJcbiAqICAgIDwvZGl2PlxyXG4gKiAgICA8IS0tIFRhYnMgQ29udGVudCAtLT5cclxuICogICAgPGRpdiBjbGFzcz1cIndwYmNfdGFiX19wYW5lbCBncm91cF9fZmllbGRzXCIgZGF0YS13cGJjLXRhYi1wYW5lbD1cIjFcIiBpZD1cIndwYmNfdGFiX3BhbmVsX2NvbF8xXCIgcm9sZT1cInRhYnBhbmVsXCIgYXJpYS1sYWJlbGxlZGJ5PVwid3BiY190YWJfY29sXzFcIj5cclxuICogICAgICAgIC4uLlxyXG4gKiAgICA8L2Rpdj5cclxuICogICAgLi4uXHJcbiAqIDwvZGl2PlxyXG4gKlxyXG4gKiBQdWJsaWMgQVBJOlxyXG4gKiAgIC0gd3BiY191aV90YWJzLmluaXRfb24ocm9vdF9vcl9zZWxlY3RvcikgICAvLyBmaW5kIGFuZCBpbml0IGdyb3VwcyB3aXRoaW4gYSBjb250YWluZXJcclxuICogICAtIHdwYmNfdWlfdGFicy5pbml0X2dyb3VwKHJvb3RfZWwpICAgICAgICAgLy8gaW5pdCBhIHNpbmdsZSBncm91cCByb290XHJcbiAqICAgLSB3cGJjX3VpX3RhYnMuc2V0X2FjdGl2ZShyb290X2VsLCBrZXkpICAgIC8vIHByb2dyYW1tYXRpY2FsbHkgY2hhbmdlIGFjdGl2ZSB0YWJcclxuICpcclxuICogRXZlbnRzOlxyXG4gKiAgIC0gRGlzcGF0Y2hlcyBDdXN0b21FdmVudCAnd3BiYzp0YWJzOmNoYW5nZScgb24gcm9vdCB3aGVuIHRhYiBjaGFuZ2VzOlxyXG4gKiAgICAgICBkZXRhaWw6IHsgYWN0aXZlX2tleTogJzInLCBwcmV2X2tleTogJzEnIH1cclxuICpcclxuICogU3dpdGNoIGEgbG9jYWwgKGdlbmVyaWMpIHRhYnMgZ3JvdXAgdG8gdGFiIDM6ICAgICB2YXIgZ3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS13cGJjLXRhYnM9XCJjb2x1bW4tc3R5bGVzXCJdJyk7IGlmICggZ3JvdXAgKSB7IHdwYmNfdWlfdGFicy5zZXRfYWN0aXZlKGdyb3VwLCAnMycpOyB9XHJcbiAqL1xyXG4oZnVuY3Rpb24gKCB3ICkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYgKCB3LndwYmNfdWlfdGFicyApIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVybmFsOiB0b2dnbGUgYWN0aXZlIHN0YXRlLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcm9vdF9lbFxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIGtleVxyXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIHNob3VsZF9lbWl0XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gc2V0X2FjdGl2ZV9pbnRlcm5hbCggcm9vdF9lbCwga2V5LCBzaG91bGRfZW1pdCApIHtcclxuXHRcdHZhciB0YWJfYnRucyA9IHJvb3RfZWwucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLXdwYmMtdGFiLWtleV0nICk7XHJcblx0XHR2YXIgcGFuZWxzICAgPSByb290X2VsLnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS13cGJjLXRhYi1wYW5lbF0nICk7XHJcblxyXG5cdFx0dmFyIHByZXZfa2V5ID0gcm9vdF9lbC5nZXRBdHRyaWJ1dGUoICdkYXRhLXdwYmMtdGFiLWFjdGl2ZScgKSB8fCBudWxsO1xyXG5cdFx0aWYgKCBTdHJpbmcoIHByZXZfa2V5ICkgPT09IFN0cmluZygga2V5ICkgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBCdXR0b25zOiBhcmlhICsgY2xhc3NcclxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHRhYl9idG5zLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHR2YXIgYnRuICAgPSB0YWJfYnRuc1tpXTtcclxuXHRcdFx0dmFyIGJfa2V5ID0gYnRuLmdldEF0dHJpYnV0ZSggJ2RhdGEtd3BiYy10YWIta2V5JyApO1xyXG5cdFx0XHR2YXIgaXNfb24gPSBTdHJpbmcoIGJfa2V5ICkgPT09IFN0cmluZygga2V5ICk7XHJcblxyXG5cdFx0XHRidG4uc2V0QXR0cmlidXRlKCAncm9sZScsICd0YWInICk7XHJcblx0XHRcdGJ0bi5zZXRBdHRyaWJ1dGUoICdhcmlhLXNlbGVjdGVkJywgaXNfb24gPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblx0XHRcdGJ0bi5zZXRBdHRyaWJ1dGUoICd0YWJpbmRleCcsIGlzX29uID8gJzAnIDogJy0xJyApO1xyXG5cclxuXHRcdFx0aWYgKCBpc19vbiApIHtcclxuXHRcdFx0XHRidG4uY2xhc3NMaXN0LmFkZCggJ2FjdGl2ZScgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRidG4uY2xhc3NMaXN0LnJlbW92ZSggJ2FjdGl2ZScgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBhbmVsczogYXJpYSArIHZpc2liaWxpdHlcclxuXHRcdGZvciAoIHZhciBqID0gMDsgaiA8IHBhbmVscy5sZW5ndGg7IGorKyApIHtcclxuXHRcdFx0dmFyIHBuICAgPSBwYW5lbHNbal07XHJcblx0XHRcdHZhciBwa2V5ID0gcG4uZ2V0QXR0cmlidXRlKCAnZGF0YS13cGJjLXRhYi1wYW5lbCcgKTtcclxuXHRcdFx0dmFyIHNob3cgPSBTdHJpbmcoIHBrZXkgKSA9PT0gU3RyaW5nKCBrZXkgKTtcclxuXHJcblx0XHRcdHBuLnNldEF0dHJpYnV0ZSggJ3JvbGUnLCAndGFicGFuZWwnICk7XHJcblx0XHRcdHBuLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgc2hvdyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcclxuXHRcdFx0aWYgKCBzaG93ICkge1xyXG5cdFx0XHRcdHBuLnJlbW92ZUF0dHJpYnV0ZSggJ2hpZGRlbicgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwbi5zZXRBdHRyaWJ1dGUoICdoaWRkZW4nLCAnJyApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cm9vdF9lbC5zZXRBdHRyaWJ1dGUoICdkYXRhLXdwYmMtdGFiLWFjdGl2ZScsIFN0cmluZygga2V5ICkgKTtcclxuXHJcblx0XHRpZiAoIHNob3VsZF9lbWl0ICkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciBldiA9IG5ldyB3LkN1c3RvbUV2ZW50KCAnd3BiYzp0YWJzOmNoYW5nZScsIHtcclxuXHRcdFx0XHRcdGJ1YmJsZXMgOiB0cnVlLFxyXG5cdFx0XHRcdFx0ZGV0YWlsICA6IHsgYWN0aXZlX2tleSA6IFN0cmluZygga2V5ICksIHByZXZfa2V5IDogcHJldl9rZXkgfVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRyb290X2VsLmRpc3BhdGNoRXZlbnQoIGV2ICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBfZSApIHt9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbnRlcm5hbDogZ2V0IG9yZGVyZWQga2V5cyBmcm9tIGJ1dHRvbnMuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb290X2VsXHJcblx0ICogQHJldHVybnMge3N0cmluZ1tdfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGdldF9rZXlzKCByb290X2VsICkge1xyXG5cdFx0dmFyIGxpc3QgPSBbXTtcclxuXHRcdHZhciBidG5zID0gcm9vdF9lbC5xdWVyeVNlbGVjdG9yQWxsKCAnW2RhdGEtd3BiYy10YWIta2V5XScgKTtcclxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGJ0bnMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdHZhciBrID0gYnRuc1tpXS5nZXRBdHRyaWJ1dGUoICdkYXRhLXdwYmMtdGFiLWtleScgKTtcclxuXHRcdFx0aWYgKCBrICE9IG51bGwgJiYgayAhPT0gJycgKSB7XHJcblx0XHRcdFx0bGlzdC5wdXNoKCBTdHJpbmcoIGsgKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGlzdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVybmFsOiBtb3ZlIGZvY3VzIGJldHdlZW4gdGFicyB1c2luZyBrZXlib2FyZC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJvb3RfZWxcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gICAgICBkaXIgICsxIChuZXh0KSAvIC0xIChwcmV2KVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGZvY3VzX3JlbGF0aXZlKCByb290X2VsLCBkaXIgKSB7XHJcblx0XHR2YXIga2V5cyAgICA9IGdldF9rZXlzKCByb290X2VsICk7XHJcblx0XHR2YXIgY3VycmVudCA9IHJvb3RfZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS13cGJjLXRhYi1hY3RpdmUnICkgfHwga2V5c1swXSB8fCBudWxsO1xyXG5cdFx0dmFyIGlkeCAgICAgPSBNYXRoLm1heCggMCwga2V5cy5pbmRleE9mKCBTdHJpbmcoIGN1cnJlbnQgKSApICk7XHJcblx0XHR2YXIgbmV4dCAgICA9IGtleXNbICggaWR4ICsgKCBkaXIgPiAwID8gMSA6IGtleXMubGVuZ3RoIC0gMSApICkgJSBrZXlzLmxlbmd0aCBdO1xyXG5cclxuXHRcdHZhciBuZXh0X2J0biA9IHJvb3RfZWwucXVlcnlTZWxlY3RvciggJ1tkYXRhLXdwYmMtdGFiLWtleT1cIicgKyBuZXh0ICsgJ1wiXScgKTtcclxuXHRcdGlmICggbmV4dF9idG4gKSB7XHJcblx0XHRcdG5leHRfYnRuLmZvY3VzKCk7XHJcblx0XHRcdHNldF9hY3RpdmVfaW50ZXJuYWwoIHJvb3RfZWwsIG5leHQsIHRydWUgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemUgYSBzaW5nbGUgdGFicyBncm91cCByb290LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcm9vdF9lbFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGluaXRfZ3JvdXAoIHJvb3RfZWwgKSB7XHJcblx0XHRpZiAoICEgcm9vdF9lbCB8fCByb290X2VsLl9fd3BiY190YWJzX2luaXRlZCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0cm9vdF9lbC5fX3dwYmNfdGFic19pbml0ZWQgPSB0cnVlO1xyXG5cclxuXHRcdC8vIFJvbGVzXHJcblx0XHR2YXIgdGFibGlzdCA9IHJvb3RfZWwucXVlcnlTZWxlY3RvciggJ1tkYXRhLXdwYmMtdGFibGlzdF0nICkgfHwgcm9vdF9lbDtcclxuXHRcdHRhYmxpc3Quc2V0QXR0cmlidXRlKCAncm9sZScsICd0YWJsaXN0JyApO1xyXG5cclxuXHRcdC8vIERlZmF1bHQgYWN0aXZlOiBmcm9tIGF0dHJpYnV0ZSBvciBmaXJzdCBidXR0b25cclxuXHRcdHZhciBrZXlzID0gZ2V0X2tleXMoIHJvb3RfZWwgKTtcclxuXHRcdHZhciBkZWYgID0gcm9vdF9lbC5nZXRBdHRyaWJ1dGUoICdkYXRhLXdwYmMtdGFiLWFjdGl2ZScgKSB8fCAoIGtleXNbMF0gfHwgJzEnICk7XHJcblx0XHRzZXRfYWN0aXZlX2ludGVybmFsKCByb290X2VsLCBkZWYsIGZhbHNlICk7XHJcblxyXG5cdFx0Ly8gQ2xpY2tzXHJcblx0XHRyb290X2VsLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uICggZSApIHtcclxuXHRcdFx0dmFyIGJ0biA9IGUudGFyZ2V0LmNsb3Nlc3QgPyBlLnRhcmdldC5jbG9zZXN0KCAnW2RhdGEtd3BiYy10YWIta2V5XScgKSA6IG51bGw7XHJcblx0XHRcdGlmICggISBidG4gfHwgISByb290X2VsLmNvbnRhaW5zKCBidG4gKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIga2V5ID0gYnRuLmdldEF0dHJpYnV0ZSggJ2RhdGEtd3BiYy10YWIta2V5JyApO1xyXG5cdFx0XHRpZiAoIGtleSAhPSBudWxsICkge1xyXG5cdFx0XHRcdHNldF9hY3RpdmVfaW50ZXJuYWwoIHJvb3RfZWwsIGtleSwgdHJ1ZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9LCB0cnVlICk7XHJcblxyXG5cdFx0Ly8gS2V5Ym9hcmQgKExlZnQvUmlnaHQvSG9tZS9FbmQpXHJcblx0XHRyb290X2VsLmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgZnVuY3Rpb24gKCBlICkge1xyXG5cdFx0XHR2YXIgdGd0ID0gZS50YXJnZXQ7XHJcblx0XHRcdGlmICggISB0Z3QgfHwgISB0Z3QuaGFzQXR0cmlidXRlIHx8ICEgdGd0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtd3BiYy10YWIta2V5JyApICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRzd2l0Y2ggKCBlLmtleSApIHtcclxuXHRcdFx0Y2FzZSAnQXJyb3dMZWZ0JzpcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7IGZvY3VzX3JlbGF0aXZlKCByb290X2VsLCAtMSApOyBicmVhaztcclxuXHRcdFx0Y2FzZSAnQXJyb3dSaWdodCc6XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyBmb2N1c19yZWxhdGl2ZSggcm9vdF9lbCwgKzEgKTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgJ0hvbWUnOlxyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgc2V0X2FjdGl2ZV9pbnRlcm5hbCggcm9vdF9lbCwgKCBnZXRfa2V5cyggcm9vdF9lbCApWzBdIHx8ICcxJyApLCB0cnVlICk7IGJyZWFrO1xyXG5cdFx0XHRjYXNlICdFbmQnOlxyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgdmFyIGtzID0gZ2V0X2tleXMoIHJvb3RfZWwgKTsgc2V0X2FjdGl2ZV9pbnRlcm5hbCggcm9vdF9lbCwgKCBrc1sga3MubGVuZ3RoIC0gMSBdIHx8ICcxJyApLCB0cnVlICk7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9LCB0cnVlICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXplIGFsbCBncm91cHMgd2l0aGluIGEgY29udGFpbmVyIChvciBkb2N1bWVudCkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fHN0cmluZ3xudWxsfSBjb250YWluZXJcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBpbml0X29uKCBjb250YWluZXIgKSB7XHJcblx0XHR2YXIgY3R4ID0gY29udGFpbmVyID8gKCB0eXBlb2YgY29udGFpbmVyID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGNvbnRhaW5lciApIDogY29udGFpbmVyICkgOiBkb2N1bWVudDtcclxuXHRcdGlmICggISBjdHggKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHZhciBncm91cHMgPSBjdHgucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLXdwYmMtdGFic10nICk7XHJcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdGluaXRfZ3JvdXAoIGdyb3Vwc1tpXSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUHJvZ3JhbW1hdGljYWxseSBzZXQgYWN0aXZlIHRhYiBieSBrZXkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb290X2VsXHJcblx0ICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBrZXlcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBzZXRfYWN0aXZlKCByb290X2VsLCBrZXkgKSB7XHJcblx0XHRpZiAoIHJvb3RfZWwgJiYgcm9vdF9lbC5oYXNBdHRyaWJ1dGUgJiYgcm9vdF9lbC5oYXNBdHRyaWJ1dGUoICdkYXRhLXdwYmMtdGFicycgKSApIHtcclxuXHRcdFx0c2V0X2FjdGl2ZV9pbnRlcm5hbCggcm9vdF9lbCwgU3RyaW5nKCBrZXkgKSwgdHJ1ZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gUHVibGljIEFQSSAoc25ha2VfY2FzZSlcclxuXHR3LndwYmNfdWlfdGFicyA9IHtcclxuXHRcdGluaXRfb24gICAgOiBpbml0X29uLFxyXG5cdFx0aW5pdF9ncm91cCA6IGluaXRfZ3JvdXAsXHJcblx0XHRzZXRfYWN0aXZlIDogc2V0X2FjdGl2ZVxyXG5cdH07XHJcblxyXG5cdC8vIEF1dG8taW5pdCBvbiBET00gcmVhZHlcclxuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJyApIHtcclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkgeyBpbml0X29uKCBkb2N1bWVudCApOyB9ICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGluaXRfb24oIGRvY3VtZW50ICk7XHJcblx0fVxyXG5cclxufSkoIHdpbmRvdyApO1xyXG4iXSwibWFwcGluZ3MiOiI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFBQSxtQkFBQUMsZ0JBQUEsRUFBQUMsY0FBQSxNQUFBQyxpQkFBQTtFQUVBLFNBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBRixjQUFBLEVBQUFFLENBQUE7SUFDQUMsTUFBQSxDQUFBSixnQkFBQSxFQUFBSyxPQUFBLENBQUFILGlCQUFBLEVBQUFJLE1BQUEsQ0FBQUosaUJBQUE7RUFDQTtFQUNBRSxNQUFBLENBQUFKLGdCQUFBLEVBQUFPLE9BQUE7SUFBQUMsT0FBQTtFQUFBO0FBQ0E7O0FDZEE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFBQyx5QkFBQUMseUJBQUE7RUFFQSxJQUFBQyxlQUFBO0VBQ0EsSUFDQUMsU0FBQSxJQUFBRix5QkFBQSxJQUNBLE1BQUFBLHlCQUFBLEVBQ0E7SUFDQSxJQUFBRyxRQUFBLEdBQUFULE1BQUEsT0FBQU0seUJBQUE7SUFDQSxJQUFBRyxRQUFBLENBQUFDLE1BQUE7TUFDQUgsZUFBQSxHQUFBSSxnQ0FBQSxDQUFBRixRQUFBLENBQUFHLEdBQUE7SUFDQTtFQUNBO0VBRUEsT0FBQUwsZUFBQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQUFNLGdDQUFBQyxXQUFBO0VBRUEsSUFBQUMsT0FBQSxHQUFBZixNQUFBLENBQUFjLFdBQUE7RUFDQSxJQUFBRSxL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
