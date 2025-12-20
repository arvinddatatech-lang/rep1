/**
 * General Option Loader/Saver (client)
 *
 * - Provides:
 *     window.wpbc_save_option_from_element(el)
 *     window.wpbc_load_option_from_element(el)
 * - Busy UI (spinner + disabled)
 * - JSON path: send raw JSON string untouched.
 * - RAW scalar path: send as-is.
 * - Fields path: serialize to query-string via jQuery.param.
 *
 * file: ../includes/save-load-option/_out/save-load-option.js
 *
 * Events:
 *   $(document).on('wpbc:option:beforeSave', (e, $el, payload) => {})
 *   $(document).on('wpbc:option:afterSave',  (e, response) => {})
 *   $(document).on('wpbc:option:beforeLoad', (e, $el, name) => {})
 *   $(document).on('wpbc:option:afterLoad',  (e, response) => {})
 */
(function (w, $) {
	'use strict';

	function wpbc_uix_escape_html(s) {
		return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
	}

	function wpbc_uix_busy_on($el) {
		if ( !$el || !$el.length || $el.data('wpbc-uix-busy') ) { return; }
		$el.data('wpbc-uix-busy', 1);
		$el.data('wpbc-uix-original-html', $el.html());
		var busy_text = $el.data('wpbc-u-busy-text');
		//var spinner = '<span class="spinner is-active wpbc-btn__spinner" aria-hidden="true"></span>';
		var spinner = '<span class="wpbc_icn_rotate_right wpbc_spin wpbc_ajax_icon wpbc_processing wpbc_icn_autorenew" aria-hidden="true"></span>';
		if ( typeof busy_text === 'string' && busy_text.length ) {
			$el.html( wpbc_uix_escape_html(busy_text) + ' ' + spinner );
		} else {
			$el.append( spinner );
		}
		$el.addClass('wpbc-is-busy').attr('aria-disabled','true').prop('disabled', true);
	}

	function wpbc_uix_busy_off($el) {
		if ( !$el || !$el.length || !$el.data('wpbc-uix-busy') ) { return; }
		var original = $el.data('wpbc-uix-original-html');
		if ( typeof original === 'string' ) { $el.html(original); }
		$el.removeClass('wpbc-is-busy').removeAttr('aria-disabled').prop('disabled', false);
		$el.removeData('wpbc-uix-busy').removeData('wpbc-uix-original-html');
	}

	/**
	 * Save Option - send ajax request  to  save data.
	 *     data-wpbc-u-save-name      — option key (required)
	 *     data-wpbc-u-save-nonce     — nonce value (required for SAVE)
	 *     data-wpbc-u-save-action    — nonce action (required for SAVE)
	 *     data-wpbc-u-save-value     — RAW scalar to save (optional)
	 *     data-wpbc-u-save-value-json— JSON string to save (optional)
	 *     data-wpbc-u-save-fields    — CSV of selectors; values serialized with jQuery.param (optional)
	 *     data-wpbc-u-busy-text      — custom text during AJAX (optional)
	 *     data-wpbc-u-save-callback  — window function name to call on success (optional)
	 *
	 * @param el - element mark  for jQuery with  data attributes.
	 */
	w.wpbc_save_option_from_element = function (el) {

		if ( !w.wpbc_option_saver_loader_config ) {
			console.error('WPBC | config missing');
			return;
		}

		var $el          = $(el);
		var nonce        = $el.data('wpbc-u-save-nonce');
		var nonce_action = $el.data('wpbc-u-save-action');
		var data_name    = $el.data('wpbc-u-save-name');
		var fields_raw   = $el.data('wpbc-u-save-fields') || '';
		var inline_value = $el.data('wpbc-u-save-value');
		var json         = $el.data('wpbc-u-save-value-json');
		var cb_id        = $el.data('wpbc-u-save-callback');
		var cb_fn        = (cb_id && typeof w[cb_id] === 'function') ? w[cb_id] : null;

		if ( !nonce || !nonce_action || !data_name ) {
			console.error('WPBC | missing nonce/action/name');
			return;
		}

		var payload = '';

		if ( typeof json === 'string' && json.trim() !== '' ) {
			payload = json.trim();                                   // RAW JSON path
		} else if ( typeof inline_value !== 'undefined' ) {
			payload = String(inline_value);                          // RAW scalar path
		} else if ( fields_raw ) {
			var fields = fields_raw.split(',').map(function(s){return s.trim();}).filter(Boolean);
			var data   = {};
			fields.forEach(function (sel) {
				var $f = $(sel);
				if ( $f.length ) {
					var key = $f.attr('name') || $f.attr('id');
					if ( key ) { data[key] = $f.val(); }
				}
			});
			payload = $.param(data);                                 // query-string path
		} else {
			console.error('WPBC | provide value or fields');
			return;
		}

		$(document).trigger('wpbc:option:beforeSave', [ $el, payload ]);
		wpbc_uix_busy_on($el);

		$.ajax({
			url:  w.wpbc_option_saver_loader_config.ajax_url,
			type: 'POST',
			data: {
				action:       w.wpbc_option_saver_loader_config.action_save,
				nonce:        nonce,
				nonce_action: nonce_action,
				data_name:    data_name,
				data_value:   payload
			}
		})
		.done(function (resp) {
			if ( resp && resp.success ) {
				if ( cb_fn ) { try { cb_fn(resp); } catch (e) { console.error(e); } }
			} else {
				console.error('WPBC | ' + (resp && resp.data && resp.data.message ? resp.data.message : 'Save error'));
			}
			$(document).trigger('wpbc:option:afterSave', [ resp ]);
		})
		.fail(function (xhr) {
			console.error('WPBC | AJAX ' + xhr.status + ' ' + xhr.statusText);
			$(document).trigger('wpbc:option:afterSave', [ { success:false, data:{ message:xhr.statusText } } ]);
		})
		.always(function () {
			wpbc_uix_busy_off($el);
		});
	};

	w.wpbc_load_option_from_element = function (el) {
		if ( !w.wpbc_option_saver_loader_config ) {
			console.error('WPBC | config missing');
			return;
		}

		var $el   = $(el);
		var name  = $el.data('wpbc-u-load-name') || $el.data('wpbc-u-save-name');
		var cb_id = $el.data('wpbc-u-load-callback');
		var cb_fn = (cb_id && typeof w[cb_id] === 'function') ? w[cb_id] : null;

		if ( !name ) {
			console.error('WPBC | missing data-wpbc-u-load-name');
			return;
		}

		$(document).trigger('wpbc:option:beforeLoad', [ $el, name ]);
		wpbc_uix_busy_on($el);

		$.ajax({
			url:  w.wpbc_option_saver_loader_config.ajax_url,
			type: 'GET',
			data: {
				action:    w.wpbc_option_saver_loader_config.action_load,
				data_name: name
			}
		})
		.done(function (resp) {
			if ( resp && resp.success ) {
				if ( cb_fn ) { try { cb_fn(resp.data && resp.data.value); } catch (e) { console.error(e); } }
			} else {
				console.error('WPBC | ' + (resp && resp.data && resp.data.message ? resp.data.message : 'Load error'));
			}
			$(document).trigger('wpbc:option:afterLoad', [ resp ]);
		})
		.fail(function (xhr) {
			console.error('WPBC | AJAX ' + xhr.status + ' ' + xhr.statusText);
			$(document).trigger('wpbc:option:afterLoad', [ { success:false, data:{ message:xhr.statusText } } ]);
		})
		.always(function () {
			wpbc_uix_busy_off($el);
		});
	};

}(window, jQuery));
