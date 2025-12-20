// ---------------------------------------------------------------------------------------------------------------------
// == File  /includes/page-form-builder/_out/core/bfb-core.js == | 2025-09-10 15:47
// ---------------------------------------------------------------------------------------------------------------------
(function ( w ) {
	'use strict';

	// Single global namespace (idempotent & load-order safe).
	const Core = ( w.WPBC_BFB_Core = w.WPBC_BFB_Core || {} );
	const UI   = ( Core.UI = Core.UI || {} );

	/**
	 * Core sanitize/escape/normalize helpers.
	 * All methods use snake_case; camelCase aliases are provided for backwards compatibility.
	 */
	Core.WPBC_BFB_Sanitize = class {

		/**
		 * Escape text for safe use in CSS selectors.
		 * @param {string} s - raw selector fragment
		 * @returns {string}
		 */
		static esc_css(s) {
			return (w.CSS && w.CSS.escape) ? w.CSS.escape( String( s ) ) : String( s ).replace( /([^\w-])/g, '\\$1' );
		}

		/**
		 * Escape a value for attribute selectors, e.g. [data-id="<value>"].
		 * @param {string} v
		 * @returns {string}
		 */
		static esc_attr_value_for_selector(v) {
			return String( v )
				.replace( /\\/g, '\\\\' )
				.replace( /"/g, '\\"' )
				.replace( /\n/g, '\\A ' )
				.replace( /\]/g, '\\]' );
		}

		/**
		 * Sanitize into a broadly compatible HTML id: letters, digits, - _ : . ; must start with a letter.
		 * @param {string} v
		 * @returns {string}
		 */
		static sanitize_html_id(v) {
			let s = (v == null ? '' : String( v )).trim();
			s     = s
				.replace( /\s+/g, '-' )
				.replace( /[^A-Za-z0-9\-_\:.]/g, '-' )
				.replace( /-+/g, '-' )
				.replace( /^[-_.:]+|[-_.:]+$/g, '' );
			if ( !s ) return 'field';
			if ( !/^[A-Za-z]/.test( s ) ) s = 'f-' + s;
			return s;
		}

		/**
		 * Sanitize into a safe HTML name token: letters, digits, _ -
		 * Must start with a letter; no dots/brackets/spaces.
		 * @param {string} v
		 * @returns {string}
		 */
		static sanitize_html_name(v) {

			let s = (v == null ? '' : String( v )).trim();

			s = s.replace( /\s+/g, '_' ).replace( /[^A-Za-z0-9_-]/g, '_' ).replace( /_+/g, '_' );

			if ( ! s ) {
				s = 'field';
			}
			if ( ! /^[A-Za-z]/.test( s ) ) {
				s = 'f_' + s;
			}
			return s;
		}

		/**
		 * Escape for HTML text/attributes (not URLs).
		 * @param {any} v
		 * @returns {string}
		 */
		static escape_html(v) {
			if ( v == null ) {
				return '';
			}
			return String( v )
				.replace( /&/g, '&amp;' )
				.replace( /"/g, '&quot;' )
				.replace( /'/g, '&#039;' )
				.replace( /</g, '&lt;' )
				.replace( />/g, '&gt;' );
		}

		/**
		 * Escape minimal set for attribute-safety without slugging.
		 * Keeps original human text; escapes &, <, >, " and ' only.
		 * @param {string} s
		 * @returns {string}
		 */
		static escape_value_for_attr(s) {
			return String( s == null ? '' : s )
				.replace( /&/g, '&amp;' )
				.replace( /</g, '&lt;' )
				.replace( />/g, '&gt;' )
				.replace( /"/g, '&quot;' )
				.replace( /'/g, '&#39;' );
		}

		/**
		 * Sanitize a space-separated CSS class list.
		 * @param {any} v
		 * @returns {string}
		 */
		static sanitize_css_classlist(v) {
			if ( v == null ) return '';
			return String( v ).replace( /[^\w\- ]+/g, ' ' ).replace( /\s+/g, ' ' ).trim();
		}
// == NEW ==
		/**
		 * Turn an arbitrary value into a conservative "token" (underscores, hyphens allowed).
		 * Useful for shortcode tokens, ids in plain text, etc.
		 * @param {any} v
		 * @returns {string}
		 */
		static to_token(v) {
			return String( v ?? '' )
				.trim()
				.replace( /\s+/g, '_' )
				.replace( /[^A-Za-z0-9_\-]/g, '' );
		}

		/**
		 * Convert to kebab-case (letters, digits, hyphens).
		 * @param {any} v
		 * @returns {string}
		 */
		static to_kebab(v) {
			return String( v ?? '' )
				.trim()
				.replace( /[_\s]+/g, '-' )
				.replace( /[^A-Za-z0-9-]/g, '' )
				.replace( /-+/g, '-' )
				.toLowerCase();
		}

		/**
		 * Truthy normalization for form-like inputs: true, 'true', 1, '1', 'yes', 'on'.
		 * @param {any} v
		 * @returns {boolean}
		 */
		static is_truthy(v) {
			if ( typeof v === 'boolean' ) return v;
			const s = String( v ?? '' ).trim().toLowerCase();
			return s === 'true' || s === '1' || s === 'yes' || s === 'on';
		}

		/**
		 * Coerce to boolean with an optional default for empty values.
		 * @param {any} v
		 * @param {boolean} [def=false]
		 * @returns {boolean}
		 */
		static coerce_boolean(v, def = false) {
			if ( v == null || v === '' ) return def;
			return this.is_truthy( v );
		}

		/**
		 * Parse a "percent-like" value ('33'|'33%'|33) with fallback.
		 * @param {string|number|null|undefined} v
		 * @param {number} fallback_value
		 * @returns {number}
		 */
		static parse_percent(v, fallback_value) {
			if ( v == null ) {
				return fallback_value;
			}
			const s = String( v ).trim();
			const n = parseFloat( s.replace( /%/g, '' ) );
			return Number.isFinite( n ) ? n : fallback_value;
		}

		/**
		 * Clamp a number to the [min, max] range.
		 * @param {number} n
		 * @param {number} min
		 * @param {number} max
		 * @returns {number}
		 */
		static clamp(n, min, max) {
			return Math.max( min, Math.min( max, n ) );
		}

		/**
		 * Escape a value for inclusion inside a quoted HTML attribute (double quotes).
		 * Replaces newlines with spaces and double quotes with single quotes.
		 * @param {any} v
		 * @returns {string}
		 */
		static escape_for_attr_quoted(v) {
			if ( v == null ) return '';
			return String( v ).replace( /\r?\n/g, ' ' ).replace( /"/g, '\'' );
		}

		/**
		 * Escape for shortcode-like tokens where double quotes and newlines should be neutralized.
		 * @param {any} v
		 * @returns {string}
		 */
		static escape_for_shortcode(v) {
			return String( v ?? '' ).replace( /"/g, '\\"' ).replace( /\r?\n/g, ' ' );
		}

		/**
		 * JSON.parse with fallback (no throw).
		 * @param {string} s
		 * @param {any} [fallback=null]
		 * @returns {any}
		 */
		static safe_json_parse(s, fallback = null) {
			try {
				return JSON.parse( s );
			} catch ( _ ) {
				return fallback;
			}
		}

		/**
		 * Stringify data-* attribute value safely (objects -> JSON, others -> String).
		 * @param {any} v
		 * @returns {string}
		 */
		static stringify_data_value(v) {
			if ( typeof v === 'object' && v !== null ) {
				try {
					return JSON.stringify( v );
				} catch {
					console.error( 'WPBC: stringify_data_value' );
					return '';
				}
			}
			return String( v );
		}

		// -------------------------------------------------------------------------------------------------------------
		// Strict value guards for CSS lengths and hex colors (defense-in-depth).
		// -------------------------------------------------------------------------------------------------------------
		/**
		 * Sanitize a CSS length. Allows: px, %, rem, em (lower/upper).
		 * Returns fallback if invalid.
		 * @param {any} v
		 * @param {string} [fallback='100%']
		 * @returns {string}
		 */
		static sanitize_css_len(v, fallback = '100%') {
			const s = String( v ?? '' ).trim();
			const m = s.match( /^(-?\d+(?:\.\d+)?)(px|%|rem|em)$/i );
			return m ? m[0] : String( fallback );
		}

		/**
		 * Sanitize a hex color. Allows #rgb or #rrggbb (case-insensitive).
		 * Returns fallback if invalid.
		 * @param {any} v
		 * @param {string} [fallback='#e0e0e0']
		 * @returns {string}
		 */
		static sanitize_hex_color(v, fallback = '#e0e0e0') {
			const s = String( v ?? '' ).trim();
			return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test( s ) ? s : String( fallback );
		}

	}

	/**
	 * WPBC ID / Name service. Generates, sanitizes, and ensures uniqueness for field ids/names/html_ids within the canvas.
	 */
	Core.WPBC_BFB_IdService = class  {

		/**
		 * Constructor. Set root container of the form pages.
		 *
		 * @param {HTMLElement} pages_container - Root container of the form pages.
		 */
		constructor( pages_container ) {
			this.pages_container = pages_container;
		}

		/**
		 * Ensure a unique **internal** field id (stored in data-id) within the canvas.
		 * Starts from a desired id (already sanitized or not) and appends suffixes if needed.
		 *
		 * @param {string} baseId - Desired id.
		 * @returns {string} Unique id.
		 */
		ensure_unique_field_id(baseId, currentEl = null) {
			const base    = Core.WPBC_BFB_Sanitize.sanitize_html_id( baseId );
			let id        = base || 'field';
			const esc     = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );
			const escUid  = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );
			const notSelf = currentEl?.dataset?.uid ? `:not([data-uid="${escUid( currentEl.dataset.uid )}"])` : '';
			while ( this.pages_container?.querySelector(
				`.wpbc_bfb__panel--preview .wpbc_bfb__field${notSelf}[data-id="${esc(id)}"], .wpbc_bfb__panel--preview .wpbc_bfb__section${notSelf}[data-id="${esc(id)}"]`
			) ) {
				// Excludes self by data-uid .
				const found = this.pages_container.querySelector( `.wpbc_bfb__panel--preview .wpbc_bfb__field[data-id="${esc( id )}"], .wpbc_bfb__panel--preview .wpbc_bfb__section[data-id="${esc( id )}"]` );
				if ( found && currentEl && found === currentEl ) {
					break;
				}
				id = `${base || 'field'}-${Math.random().toString( 36 ).slice( 2, 5 )}`;
			}
			return id;
		}

		/**
		 * Ensure a unique HTML name across the form.
		 *
		 * @param {string} base - Desired base name (un/sanitized).
		 * @param {HTMLElement|null} currentEl - If provided, ignore conflicts with this element.
		 * @returns {string} Unique name.
		 */
		ensure_unique_field_name(base, currentEl = null) {
			let name      = base || 'field';
			const esc     = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );
			const escUid  = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );
			// Exclude the current field *and any DOM mirrors of it* (same data-uid)
			const uid     = currentEl?.dataset?.uid;
			const notSelf = uid ? `:not([data-uid="${escUid( uid )}"])` : '';
			while ( true ) {
				const selector = `.wpbc_bfb__panel--preview .wpbc_bfb__field${notSelf}[data-name="${esc( name )}"]`;
				const clashes  = this.pages_container?.querySelectorAll( selector ) || [];
				if ( clashes.length === 0 ) break;           // nobody else uses this name
				const m = name.match( /-(\d+)$/ );
				name    = m ? name.replace( /-\d+$/, '-' + (Number( m[1] ) + 1) ) : `${base}-2`;
			}
			return name;
		}

		/**
		 * Set field's INTERNAL id (data-id) on an element. Ensures uniqueness and optionally asks caller to refresh preview.
		 *
		 * @param {HTMLElement} field_el - Field element in the canvas.
		 * @param {string} newIdRaw - Desired id (un/sanitized).
		 * @param {boolean} [renderPreview=false] - Caller can decide to re-render preview.
		 * @returns {string} Applied unique id.
		 */
		set_field_id( field_el, newIdRaw, renderPreview = false ) {
			const desired = Core.WPBC_BFB_Sanitize.sanitize_html_id( newIdRaw );
			const unique  = this.ensure_unique_field_id( desired, field_el );
			field_el.setAttribute( 'data-id', unique );
			if ( renderPreview ) {
				// Caller decides if / when to render.
			}
			return unique;
		}

		/**
		 * Set field's REQUIRED HTML name (data-name). Ensures sanitized + unique per form.
		 * Falls back to sanitized internal id if user provides empty value.
		 *
		 * @param {HTMLElement} field_el - Field element in the canvas.
		 * @param {string} newNameRaw - Desired name (un/sanitized).
		 * @param {boolean} [renderPreview=false] - Caller can decide to re-render preview.
		 * @returns {string} Applied unique name.
		 */
		set_field_name( field_el, newNameRaw, renderPreview = false ) {
			const raw  = (newNameRaw == null ? '' : String( newNameRaw )).trim();
			const base = raw
				? Core.WPBC_BFB_Sanitize.sanitize_html_name( raw )
				: Core.WPBC_BFB_Sanitize.sanitize_html_name( field_el.getAttribute( 'data-id' ) || 'field' );

			const unique = this.ensure_unique_field_name( base, field_el );
			field_el.setAttribute( 'data-name', unique );
			if ( renderPreview ) {
				// Caller decides if / when to render.
			}
			return unique;
		}

		/**
		 * Set field's OPTIONAL public HTML id (data-html_id). Empty value removes the attribute.
		 * Ensures sanitization + uniqueness among other declared HTML ids.
		 *
		 * @param {HTMLElement} field_el - Field element in the canvas.
		 * @param {string} newHtmlIdRaw - Desired html_id (optional).
		 * @param {boolean} [renderPreview=false] - Caller can decide to re-render preview.
		 * @returns {string} The applied html_id or empty string if removed.
		 */
		set_field_html_id( field_el, newHtmlIdRaw, renderPreview = false ) {
			const raw = (newHtmlIdRaw == null ? '' : String( newHtmlIdRaw )).trim();

			if ( raw === '' ) {
				field_el.removeAttribute( 'data-html_id' );
				if ( renderPreview ) {
					// Caller decides if / when to render.
				}
				return '';
			}

			const desired = Core.WPBC_BFB_Sanitize.sanitize_html_id( raw );
			let htmlId    = desired;
			const esc     = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );
			const escUid  = (v) => Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( v );

			while ( true ) {

				const uid     = field_el?.dataset?.uid;
				const notSelf = uid ? `:not([data-uid="${escUid( uid )}"])` : '';

				const clashInCanvas = this.pages_container?.querySelector(
					`.wpbc_bfb__panel--preview .wpbc_bfb__field${notSelf}[data-html_id="${esc( htmlId )}"],` +
					`.wpbc_bfb__panel--preview .wpbc_bfb__section${notSelf}[data-html_id="${esc( htmlId )}"]`
				);
				const domClash = document.getElementById( htmlId );

				// Allow when the only "clash" is inside this same field (e.g., the input you just rendered)
				const domClashIsSelf = domClash === field_el || (domClash && field_el.contains( domClash ));

				if ( !clashInCanvas && (!domClash || domClashIsSelf) ) {
					break;
				}

				const m = htmlId.match( /-(\d+)$/ );
				htmlId  = m ? htmlId.replace( /-\d+$/, '-' + (Number( m[1] ) + 1) ) : `${desired}-2`;
			}

			field_el.setAttribute( 'data-html_id', htmlId );
			if ( renderPreview ) {
				// Caller decides if / when to render.
			}
			return htmlId;
		}
	};

	/**
	 * WPBC Layout service. Encapsulates column width math with gap handling, presets, and utilities.
	 */
	Core.WPBC_BFB_LayoutService = class  {

		/**
		 * Constructor. Set options with gap between columns (%).
		 *
		 * @param {{ col_gap_percent?: number }} [opts] - Options with gap between columns (%).
		 */
		constructor( opts = {} ) {
			this.col_gap_percent = Number.isFinite( +opts.col_gap_percent ) ? +opts.col_gap_percent : 3;
		}

		/**
		 * Compute normalized flex-basis values for a row, respecting column gaps.
		 * Returns bases that sum to available = 100 - (n-1)*gap.
		 *
		 * @param {HTMLElement} row_el - Row element containing .wpbc_bfb__column children.
		 * @param {number} [gap_percent=this.col_gap_percent] - Gap percent between columns.
		 * @returns {{available:number,bases:number[]}} Available space and basis values.
		 */
		compute_effective_bases_from_row( row_el, gap_percent = this.col_gap_percent ) {
			const cols = Array.from( row_el?.querySelectorAll( ':scope > .wpbc_bfb__column' ) || [] );
			const n    = cols.length || 1;

			const raw = cols.map( ( col ) => {
				const w = col.style.flexBasis || '';
				const p = Core.WPBC_BFB_Sanitize.parse_percent( w, NaN );
				return Number.isFinite( p ) ? p : (100 / n);
			} );

			const sum_raw    = raw.reduce( ( a, b ) => a + b, 0 ) || 100;
			const gp         = Number.isFinite( +gap_percent ) ? +gap_percent : 3;
			const total_gaps = Math.max( 0, n - 1 ) * gp;
			const available  = Math.max( 0, 100 - total_gaps );
			const scale      = available / sum_raw;

			return {
				available,
				bases: raw.map( ( p ) => Math.max( 0, p * scale ) )
			};
		}

		/**
		 * Apply computed bases to the row's columns (sets flex-basis %).
		 *
		 * @param {HTMLElement} row_el - Row element.
		 * @param {number[]} bases - Array of basis values (percent of full 100).
		 * @returns {void}
		 */
		apply_bases_to_row( row_el, bases ) {
			const cols = Array.from( row_el?.querySelectorAll( ':scope > .wpbc_bfb__column' ) || [] );
			cols.forEach( ( col, i ) => {
				const p             = bases[i] ?? 0;
				col.style.flexBasis = `${p}%`;
			} );
		}

		/**
		 * Distribute columns evenly, respecting gap.
		 *
		 * @param {HTMLElement} row_el - Row element.
		 * @param {number} [gap_percent=this.col_gap_percent] - Gap percent.
		 * @returns {void}
		 */
		set_equal_bases( row_el, gap_percent = this.col_gap_percent ) {
			const cols       = Array.from( row_el?.querySelectorAll( ':scope > .wpbc_bfb__column' ) || [] );
			const n          = cols.length || 1;
			const gp         = Number.isFinite( +gap_percent ) ? +gap_percent : 3;
			const total_gaps = Math.max( 0, n - 1 ) * gp;
			const available  = Math.max( 0, 100 - total_gaps );
			const each       = available / n;
			this.apply_bases_to_row( row_el, Array( n ).fill( each ) );
		}

		/**
		 * Apply a preset of relative weights to a row/section.
		 *
		 * @param {HTMLElement} sectionOrRow - .wpbc_bfb__section or its child .wpbc_bfb__row.
		 * @param {number[]} weights - Relative weights (e.g., [1,3,1]).
		 * @param {number} [gap_percent=this.col_gap_percent] - Gap percent.
		 * @returns {void}
		 */
		apply_layout_preset( sectionOrRow, weights, gap_percent = this.col_gap_percent ) {
			const row = sectionOrRow?.classList?.contains( 'wpbc_bfb__row' )
				? sectionOrRow
				: sectionOrRow?.querySelector( ':scope > .wpbc_bfb__row' );

			if ( ! row ) {
				return;
			}

			const cols = Array.from( row.querySelectorAll( ':scope > .wpbc_bfb__column' ) || [] );
			const n    = cols.length || 1;

			if ( ! Array.isArray( weights ) || weights.length !== n ) {
				this.set_equal_bases( row, gap_percent );
				return;
			}

			const sum       = weights.reduce( ( a, b ) => a + Math.max( 0, Number( b ) || 0 ), 0 ) || 1;
			const gp        = Number.isFinite( +gap_percent ) ? +gap_percent : 3;
			const available = Math.max( 0, 100 - Math.max( 0, n - 1 ) * gp );
			const bases     = weights.map( ( w ) => Math.max( 0, (Number( w ) || 0) / sum * available ) );

			this.apply_bases_to_row( row, bases );
		}

		/**
		 * Build preset weight lists for a given column count.
		 *
		 * @param {number} n - Column count.
		 * @returns {number[][]} List of weight arrays.
		 */
		build_presets_for_columns( n ) {
			switch ( n ) {
				case 1:
					return [ [ 1 ] ];
				case 2:
					return [ [ 1, 2 ], [ 2, 1 ], [ 1, 3 ], [ 3, 1 ] ];
				case 3:
					return [ [ 1, 3, 1 ], [ 1, 2, 1 ], [ 2, 1, 1 ], [ 1, 1, 2 ] ];
				case 4:
					return [ [ 1, 2, 2, 1 ], [ 2, 1, 1, 1 ], [ 1, 1, 1, 2 ] ];
				default:
					return [ Array( n ).fill( 1 ) ];
			}
		}

		/**
		 * Format a human-readable label like "50%/25%/25%" from weights.
		 *
		 * @param {number[]} weights - Weight list.
		 * @returns {string} Label string.
		 */
		format_preset_label( weights ) {
			const sum = weights.reduce( ( a, b ) => a + (Number( b ) || 0), 0 ) || 1;
			return weights.map( ( w ) => Math.round( ((Number( w ) || 0) / sum) * 100 ) ).join( '%/' ) + '%';
		}

		/**
		 * Parse comma/space separated weights into numbers.
		 *
		 * @param {string} input - User input like "20,60,20".
		 * @returns {number[]} Parsed weights.
		 */
		parse_weights( input ) {
			if ( ! input ) {
				return [];
			}
			return String( input )
				.replace( /[^\d,.\s]/g, '' )
				.split( /[\s,]+/ )
				.map( ( s ) => parseFloat( s ) )
				.filter( ( n ) => Number.isFinite( n ) && n >= 0 );
		}
	};

	/**
	 * WPBC Usage Limit service.
	 * Counts field usage by key, compares to palette limits, and updates palette UI.
	 */
	Core.WPBC_BFB_UsageLimitService = class  {

		/**
		 * Constructor. Set pages_container and palette_ul.
		 *
		 * @param {HTMLElement} pages_container - Canvas root that holds placed fields.
		 * @param {HTMLElement[]|null} palette_uls?:   Palettes UL with .wpbc_bfb__field items (may be null).
		 */
		constructor(pages_container, palette_uls) {
			this.pages_container = pages_container;
			// Normalize to an array; we’ll still be robust if none provided.
			this.palette_uls     = Array.isArray( palette_uls ) ? palette_uls : (palette_uls ? [ palette_uls ] : []);
		}


		/**
		 * Parse usage limit from raw dataset value. Missing/invalid -> Infinity.
		 *
		 * @param {string|number|null|undefined} raw - Raw attribute value.
		 * @returns {number} Limit number or Infinity.
		 */
		static parse_usage_limit( raw ) {
			if ( raw == null ) {
				return Infinity;
			}
			const n = parseInt( raw, 10 );
			return Number.isFinite( n ) ? n : Infinity;
		}

		/**
		 * Count how many instances exist per usage_key in the canvas.
		 *
		 * @returns {Record<string, number>} Map of usage_key -> count.
		 */
		count_usage_by_key() {
			const used = {};
			const all  = this.pages_container?.querySelectorAll( '.wpbc_bfb__panel--preview .wpbc_bfb__field:not(.is-invalid)' ) || [];
			all.forEach( ( el ) => {
				const key = el.dataset.usage_key || el.dataset.type || el.dataset.id;
				if ( ! key ) {
					return;
				}
				used[key] = (used[key] || 0) + 1;
			} );
			return used;
		}

		/**
		 * Return palette limit for a given usage key (id of the palette item).
		 *
		 * @param {string} key - Usage key.
		 * @returns {number} Limit value or Infinity.
		 */
		get_limit_for_key(key) {
			if ( ! key ) {
				return Infinity;
			}
			// Query across all palettes present now (stored + any newly added in DOM).
			const roots            = this.palette_uls?.length ? this.palette_uls : document.querySelectorAll( '.wpbc_bfb__panel_field_types__ul' );
			const allPaletteFields = Array.from( roots ).flatMap( r => Array.from( r.querySelectorAll( '.wpbc_bfb__field' ) ) );
			let limit              = Infinity;

			allPaletteFields.forEach( (el) => {
				if ( el.dataset.id === key ) {
					const n = Core.WPBC_BFB_UsageLimitService.parse_usage_limit( el.dataset.usagenumber );
					// Choose the smallest finite limit (safest if palettes disagree).
					if ( n < limit ) {
						limit = n;
					}
				}
			} );

			return limit;
		}


		/**
		 * Disable/enable palette items based on current usage counts and limits.
		 *
		 * @returns {void}
		 */
		update_palette_ui() {
			// Always compute usage from the canvas:
			const usage = this.count_usage_by_key();

			// Update all palettes currently in DOM (not just the initially captured ones)
			const palettes = document.querySelectorAll( '.wpbc_bfb__panel_field_types__ul' );

			palettes.forEach( (pal) => {
				pal.querySelectorAll( '.wpbc_bfb__field' ).forEach( (panel_field) => {
					const paletteId   = panel_field.dataset.id;
					const raw_limit   = panel_field.dataset.usagenumber;
					const perElLimit  = Core.WPBC_BFB_UsageLimitService.parse_usage_limit( raw_limit );
					// Effective limit across all palettes is the global limit for this key.
					const globalLimit = this.get_limit_for_key( paletteId );
					const limit       = Number.isFinite( globalLimit ) ? globalLimit : perElLimit; // prefer global min

					const current = usage[paletteId] || 0;
					const disable = Number.isFinite( limit ) && current >= limit;

					panel_field.style.pointerEvents = disable ? 'none' : '';
					panel_field.style.opacity       = disable ? '0.4' : '';
					panel_field.setAttribute( 'aria-disabled', disable ? 'true' : 'false' );
					if ( disable ) {
						panel_field.setAttribute( 'tabindex', '-1' );
					} else {
						panel_field.removeAttribute( 'tabindex' );
					}
				} );
			} );
		}


		/**
		 * Return how many valid instances with this usage key exist in the canvas.
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @returns {number} Count of existing non-invalid instances.
		 */
		count_for_key( key ) {
			if ( ! key ) {
				return 0;
			}
			return ( this.pages_container?.querySelectorAll(
                `.wpbc_bfb__panel--preview .wpbc_bfb__field[data-usage_key="${Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( key )}"]:not(.is-invalid), 
                 .wpbc_bfb__panel--preview .wpbc_bfb__field[data-type="${Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( key )}"]:not(.is-invalid)`
			) || [] ).length;
		}

		/**
		 * Alias for limit lookup (readability).
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @returns {number} Limit value or Infinity.
		 */
		limit_for_key( key ) {
			return this.get_limit_for_key( key );
		}

		/**
		 * Remaining slots for this key (Infinity if unlimited).
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @returns {number} Remaining count (>= 0) or Infinity.
		 */
		remaining_for_key( key ) {
			const limit = this.limit_for_key( key );
			if ( limit === Infinity ) {
				return Infinity;
			}
			const used = this.count_for_key( key );
			return Math.max( 0, limit - used );
		}

		/**
		 * True if you can add `delta` more items for this key.
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @param {number} [delta=1] - How many items you intend to add.
		 * @returns {boolean} Whether adding is allowed.
		 */
		can_add( key, delta = 1 ) {
			const rem = this.remaining_for_key( key );
			return ( rem === Infinity ) ? true : ( rem >= delta );
		}

		/**
		 * UI-facing gate: alert when exceeded. Returns boolean allowed/blocked.
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @param {{label?: string, delta?: number}} [opts={}] - Optional UI info.
		 * @returns {boolean} True if allowed, false if blocked.
		 */
		gate_or_alert( key, { label = key, delta = 1 } = {} ) {
			if ( this.can_add( key, delta ) ) {
				return true;
			}
			const limit = this.limit_for_key( key );
			alert( `Only ${limit} instance${limit > 1 ? 's' : ''} of "${label}" allowed.` );
			return false;
		}

		/**
		 * Backward-compatible alias used elsewhere in the codebase.  - Check whether another instance with the given usage key can be added.
		 *
		 * @param {string} key - Usage key of a palette item.
		 * @returns {boolean} Whether adding one more is allowed.
		 */
		is_usage_ok( key ) {
			return this.can_add( key, 1 );
		}

	};

	/**
	 * Constant event names for the builder.
	 */
	Core.WPBC_BFB_Events = Object.freeze({
		SELECT            : 'wpbc:bfb:select',
		CLEAR_SELECTION   : 'wpbc:bfb:clear-selection',
		FIELD_ADD         : 'wpbc:bfb:field:add',
		FIELD_REMOVE      : 'wpbc:bfb:field:remove',
		STRUCTURE_CHANGE  : 'wpbc:bfb:structure:change',
		STRUCTURE_LOADED  : 'wpbc:bfb:structure:loaded'
	});

	/**
	 * Lightweight event bus that emits to both the pages container and document.
	 */
	Core.WPBC_BFB_EventBus =  class {
		/**
		 * @param {HTMLElement} scope_el - Element to dispatch bubbled events from.
		 */
		constructor( scope_el ) {
			this.scope_el = scope_el;
		}

		/**
		 * Emit a DOM CustomEvent with payload.
		 *
		 * @param {string} type - Event type (use Core.WPBC_BFB_Events. when possible).
		 * @param {Object} [detail={}] - Arbitrary serializable payload.
		 * @returns {void}
		 */
		emit( type, detail = {} ) {
			if ( ! this.scope_el ) {
				return;
			}
			this.scope_el.dispatchEvent( new CustomEvent( type, { detail: { ...detail }, bubbles: true } ) );
		}

		/**
		 * Subscribe to an event on document.
		 *
		 * @param {string} type - Event type.
		 * @param {(ev:CustomEvent)=>void} handler - Handler function.
		 * @returns {void}
		 */
		on( type, handler ) {
			document.addEventListener( type, handler );
		}

		/**
		 * Unsubscribe from an event on document.
		 *
		 * @param {string} type - Event type.
		 * @param {(ev:CustomEvent)=>void} handler - Handler function.
		 * @returns {void}
		 */
		off( type, handler ) {
			document.removeEventListener( type, handler );
		}
	};

	/**
	 * SortableJS manager: single point for consistent DnD config.
	 */
	Core.WPBC_BFB_SortableManager = class  {

		/**
		 * @param {WPBC_Form_Builder} builder - The active builder instance.
		 * @param {{ groupName?: string, animation?: number, ghostClass?: string, chosenClass?: string, dragClass?: string }} [opts={}] - Visual/behavior options.
		 */
		constructor( builder, opts = {} ) {
			this.builder = builder;
			const gid = this.builder?.instance_id || Math.random().toString( 36 ).slice( 2, 8 );
			this.opts = {
				// groupName  : 'form',
				groupName: `form-${gid}`,
				animation  : 150,
				ghostClass : 'wpbc_bfb__drag-ghost',
				chosenClass: 'wpbc_bfb__highlight',
				dragClass  : 'wpbc_bfb__drag-active',
				...opts
			};
			/** @type {Set<HTMLElement>} */
			this._containers = new Set();
		}

		/**
		 * Tag the drag mirror (element under cursor) with role: 'palette' | 'canvas'.
		 * Works with Sortable's fallback mirror (.sortable-fallback / .sortable-drag) and with your dragClass (.wpbc_bfb__drag-active).
		 */
		_tag_drag_mirror( evt ) {
			const fromPalette = this.builder?.palette_uls?.includes?.( evt.from );
			const role        = fromPalette ? 'palette' : 'canvas';
			// Wait a tick so the mirror exists.  - The window.requestAnimationFrame() method tells the browser you wish to perform an animation.
			requestAnimationFrame( () => {
				const mirror = document.querySelector( '.sortable-fallback, .sortable-drag, .' + this.opts.dragClass );
				if ( mirror ) {
					mirror.setAttribute( 'data-drag-role', role );
				}
			} );
		}

		_toggle_dnd_root_flags( active, from_palette = false ) {

			// set to root element of an HTML document, which is the <html>.
			const root = document.documentElement;
			if ( active ) {
				root.classList.add( 'wpbc_bfb__dnd-active' );
				if ( from_palette ) {
					root.classList.add( 'wpbc_bfb__drag-from-palette' );
				}
			} else {
				root.classList.remove( 'wpbc_bfb__dnd-active', 'wpbc_bfb__drag-from-palette' );
			}
		}


		/**
		 * Ensure Sortable is attached to a container with role 'palette' or 'canvas'.
		 *
		 *  -- Handle selectors: handle:  '.section-drag-handle, .wpbc_bfb__drag-handle, .wpbc_bfb__drag-anywhere, [data-draggable="true"]'
		 *  -- Draggable gate: draggable: '.wpbc_bfb__field:not([data-draggable="false"]), .wpbc_bfb__section'
		 *  -- Filter (overlay-safe):     ignore everything in overlay except the handle -  '.wpbc_bfb__overlay-controls *:not(.wpbc_bfb__drag-handle):not(.section-drag-handle):not(.wpbc_icn_drag_indicator)'
		 *  -- No-drag wrapper:           use .wpbc_bfb__no-drag-zone inside renderers for inputs/widgets.
		 *  -- Focus guard (optional):    flip [data-draggable] on focusin/focusout to prevent accidental drags while typing.
		 *
		 * @param {HTMLElement} container - The element to enhance with Sortable.
		 * @param {'palette'|'canvas'} role - Behavior profile to apply.
		 * @param {{ onAdd?: Function }} [handlers={}] - Optional handlers.
		 * @returns {void}
		 */
		ensure( container, role, handlers = {} ) {
			if ( ! container || typeof Sortable === 'undefined' ) {
				return;
			}
			if ( Sortable.get?.( container ) ) {
				return;
			}

			const common = {
				animation  : this.opts.animation,
				ghostClass : this.opts.ghostClass,
				chosenClass: this.opts.chosenClass,
				dragClass  : this.opts.dragClass,
				// == Element under the cursor  == Ensure we drag a real DOM mirror you can style via CSS (cross-browser).
				forceFallback    : true,
				fallbackOnBody   : true,
				fallbackTolerance: 6,
				// Add body/html flags so you can style differently when dragging from palette.
				onStart: (evt) => {
					this.builder?._add_dragging_class?.();

					const fromPalette = this.builder?.palette_uls?.includes?.( evt.from );
					this._toggle_dnd_root_flags( true, fromPalette );  // set to root HTML document: html.wpbc_bfb__dnd-active.wpbc_bfb__drag-from-palette .

					this._tag_drag_mirror( evt );                      // Add 'data-drag-role' attribute to  element under cursor.
				},
				onEnd  : () => {
					setTimeout( () => { this.builder._remove_dragging_class(); }, 50 );
					this._toggle_dnd_root_flags( false );
				}
			};

			if ( role === 'palette' ) {
				Sortable.create( container, {
					...common,
					group   : { name: this.opts.groupName, pull: 'clone', put: false },
					sort    : false
				} );
				this._containers.add( container );
				return;
			}

			// role === 'canvas'.
			Sortable.create( container, {
				...common,
				group    : {
					name: this.opts.groupName,
					pull: true,
					put : (to, from, draggedEl) => {
						return draggedEl.classList.contains( 'wpbc_bfb__field' ) ||
							   draggedEl.classList.contains( 'wpbc_bfb__section' );
					}
				},
				// ---------- DnD Handlers --------------                // Grab anywhere on fields that opt-in with the class or attribute.  - Sections still require their dedicated handle.
				handle   : '.section-drag-handle, .wpbc_bfb__drag-handle, .wpbc_bfb__drag-anywhere, [data-draggable="true"]',
				draggable: '.wpbc_bfb__field:not([data-draggable="false"]), .wpbc_bfb__section',                        // Per-field opt-out with [data-draggable="false"] (e.g., while editing).
				// ---------- Filters - No DnD ----------                // Declarative “no-drag zones”: anything inside these wrappers won’t start a drag.
				filter: [
					'.wpbc_bfb__no-drag-zone',
					'.wpbc_bfb__no-drag-zone *',
					'.wpbc_bfb__column-resizer',  // Ignore the resizer rails during DnD (prevents edge “snap”).
					                              // In the overlay toolbar, block everything EXCEPT the drag handle (and its icon).
					'.wpbc_bfb__overlay-controls *:not(.wpbc_bfb__drag-handle):not(.section-drag-handle):not(.wpbc_icn_drag_indicator)'
				].join( ',' ),
				preventOnFilter  : false,
					// ---------- anti-jitter tuning ----------
				direction            : 'vertical',           // columns are vertical lists.
				invertSwap           : true,                 // use swap on inverted overlap.
				swapThreshold        : 0.65,                 // be less eager to swap.
				invertedSwapThreshold: 0.85,                 // require deeper overlap when inverted.
				emptyInsertThreshold : 24,                   // don’t jump into empty containers too early.
				dragoverBubble       : false,                // keep dragover local.
				fallbackOnBody       : true,                 // more stable positioning.
				fallbackTolerance    : 6,                    // Reduce micro-moves when the mouse shakes a bit (esp. on touchpads).
				scroll               : true,
				scrollSensitivity    : 40,
				scrollSpeed          : 10,
				/**
				 * Enter/leave hysteresis for cross-column moves.    Only allow dropping into `to` when the pointer is well inside it.
				 */
				onMove: (evt, originalEvent) => {
					const { to, from } = evt;
					if ( !to || !from ) return true;

					// Only gate columns (not page containers), and only for cross-column moves in the same row
					const isColumn = to.classList?.contains( 'wpbc_bfb__column' );
					if ( !isColumn ) return true;

					const fromRow = from.closest( '.wpbc_bfb__row' );
					const toRow   = to.closest( '.wpbc_bfb__row' );
					if ( fromRow && toRow && fromRow !== toRow ) return true;

					const rect = to.getBoundingClientRect();
					const evtX = (originalEvent.touches?.[0]?.clientX) ?? originalEvent.clientX;
					const evtY = (originalEvent.touches?.[0]?.clientY) ?? originalEvent.clientY;

					// --- Edge fence (like you had), but clamped for tiny columns
					const paddingX = Core.WPBC_BFB_Sanitize.clamp( rect.width * 0.20, 12, 36 );
					const paddingY = Core.WPBC_BFB_Sanitize.clamp( rect.height * 0.10, 6, 16 );

					// Looser Y if the column is visually tiny/empty
					const isVisuallyEmpty = to.childElementCount === 0 || rect.height < 64;
					const innerTop        = rect.top + (isVisuallyEmpty ? 4 : paddingY);
					const innerBottom     = rect.bottom - (isVisuallyEmpty ? 4 : paddingY);
					const innerLeft       = rect.left + paddingX;
					const innerRight      = rect.right - paddingX;

					const insideX = evtX > innerLeft && evtX < innerRight;
					const insideY = evtY > innerTop && evtY < innerBottom;
					if ( !(insideX && insideY) ) return false;   // stay in current column until well inside new one

					// --- Sticky target commit distance: only switch if we’re clearly inside the new column
					const ds = this._dragState;
					if ( ds ) {
						if ( ds.stickyTo && ds.stickyTo !== to ) {
							// require a deeper penetration to switch columns
							const commitX = Core.WPBC_BFB_Sanitize.clamp( rect.width * 0.25, 18, 40 );   // 25% or 18–40px
							const commitY = Core.WPBC_BFB_Sanitize.clamp( rect.height * 0.15, 10, 28 );  // 15% or 10–28px

							const deepInside =
									  (evtX > rect.left + commitX && evtX < rect.right - commitX) &&
									  (evtY > rect.top + commitY && evtY < rect.bottom - commitY);

							if ( !deepInside ) return false;
						}
						// We accept the new target now.
						ds.stickyTo     = to;
						ds.lastSwitchTs = performance.now();
					}

					return true;
				},
				onStart: (evt) => {
					this.builder?._add_dragging_class?.();
					// Match the flags we set in common so CSS stays consistent on canvas drags too.
					const fromPalette = this.builder?.palette_uls?.includes?.( evt.from );
					this._toggle_dnd_root_flags( true, fromPalette );          // set to root HTML document: html.wpbc_bfb__dnd-active.wpbc_bfb__drag-from-palette .
					this._tag_drag_mirror( evt );                             // Tag the mirror under cursor.
					this._dragState = { stickyTo: null, lastSwitchTs: 0 };    // per-drag state.
				},
				onEnd  : () => {
					setTimeout( () => { this.builder._remove_dragging_class(); }, 50 );
					this._toggle_dnd_root_flags( false );                    // set to root HTML document without these classes: html.wpbc_bfb__dnd-active.wpbc_bfb__drag-from-palette .
					this._dragState = null;
				},
				// ----------------------------------------
				// onAdd: handlers.onAdd || this.builder.handle_on_add.bind( this.builder )
				onAdd: (evt) => {
					if ( this._on_add_section( evt ) ) {
						return;
					}
					// Fallback: original handler for normal fields.
					(handlers.onAdd || this.builder.handle_on_add.bind( this.builder ))( evt );
				},
				onUpdate: () => {
					this.builder.bus?.emit?.( Core.WPBC_BFB_Events.STRUCTURE_CHANGE, { reason: 'sort-update' } );
				}
			} );

			this._containers.add( container );
		}

		/**
		 * Handle adding/moving sections via Sortable onAdd.
		 * Returns true if handled (i.e., it was a section), false to let the default field handler run.
		 *
		 * - Palette -> canvas: remove the placeholder clone and build a fresh section via add_section()
		 * - Canvas -> canvas: keep the moved DOM (and its children), just re-wire overlays/sortables/metadata
		 *
		 * @param {Sortable.SortableEvent} evt
		 * @returns {boolean}
		 */
		_on_add_section(evt) {

			const item = evt.item;
			if ( ! item ) {
				return false;
			}

			// Identify sections both from palette items (li clones) and real canvas nodes.
			const data      = Core.WPBC_Form_Builder_Helper.get_all_data_attributes( item );
			const isSection = item.classList.contains( 'wpbc_bfb__section' ) || (data?.type || item.dataset?.type) === 'section';

			if ( ! isSection ) {
				return false;
			}

			const fromPalette = this.builder?.palette_uls?.includes?.( evt.from ) === true;

			if ( ! fromPalette ) {
				// Canvas -> canvas move: DO NOT rebuild/remove; preserve children.
				this.builder.add_overlay_toolbar?.( item );                       // ensure overlay exists
				this.builder.pages_sections?.init_all_nested_sortables?.( item ); // ensure inner sortables

				// Ensure metadata present/updated
				item.dataset.type    = 'section';
				const cols           = item.querySelectorAll( ':scope > .wpbc_bfb__row > .wpbc_bfb__column' ).length || 1;
				item.dataset.columns = String( cols );

				// Select & notify subscribers (layout/min guards, etc.)
				this.builder.select_field?.( item );
				this.builder.bus?.emit?.( Core.WPBC_BFB_Events.STRUCTURE_CHANGE, { el: item, reason: 'section-move' } );
				this.builder.usage?.update_palette_ui?.();
				return true; // handled.
			}

			// Palette -> canvas: build a brand-new section using the same path as the dropdown/menu
			const to   = evt.to?.closest?.( '.wpbc_bfb__column, .wpbc_bfb__form_preview_section_container' ) || evt.to;
			const cols = parseInt( data?.columns || item.dataset.columns || 1, 10 ) || 1;

			// Remove the palette clone placeholder.
			item.parentNode && item.parentNode.removeChild( item );

			// Create the real section.
			this.builder.pages_sections.add_section( to, cols );

			// Insert at the precise drop index.
			const section = to.lastElementChild; // add_section appends to end.
			if ( evt.newIndex != null && evt.newIndex < to.children.length - 1 ) {
				const ref = to.children[evt.newIndex] || null;
				to.insertBefore( section, ref );
			}

			// Finalize: overlay, selection, events, usage refresh.
			this.builder.add_overlay_toolbar?.( section );
			this.builder.select_field?.( section );
			this.builder.bus?.emit?.( Core.WPBC_BFB_Events.FIELD_ADD, {
				el : section,
				id : section.dataset.id,
				uid: section.dataset.uid
			} );
			this.builder.usage?.update_palette_ui?.();

			return true;
		}

		/**
		 * Destroy all Sortable instances created by this manager.
		 *
		 * @returns {void}
		 */
		destroyAll() {
			this._containers.forEach( ( el ) => {
				const inst = Sortable.get?.( el );
				if ( inst ) {
					inst.destroy();
				}
			} );
			this._containers.clear();
		}
	};

	/**
	 * Small DOM contract and renderer helper
	 *
	 * @type {Readonly<{
	 *                  SELECTORS: {pagePanel: string, field: string, validField: string, section: string, column: string, row: string, overlay: string},
	 *                  CLASSES: {selected: string},
	 *        	        ATTR: {id: string, name: string, htmlId: string, usageKey: string, uid: string}}
	 *        >}
	 */
	Core.WPBC_BFB_DOM = Object.freeze( {
		SELECTORS: {
			pagePanel : '.wpbc_bfb__panel--preview',
			field     : '.wpbc_bfb__field',
			validField: '.wpbc_bfb__field:not(.is-invalid)',
			section   : '.wpbc_bfb__section',
			column    : '.wpbc_bfb__column',
			row       : '.wpbc_bfb__row',
			overlay   : '.wpbc_bfb__overlay-controls'
		},
		CLASSES  : {
			selected: 'is-selected'
		},
		ATTR     : {
			id      : 'data-id',
			name    : 'data-name',
			htmlId  : 'data-html_id',
			usageKey: 'data-usage_key',
			uid     : 'data-uid'
		}
	} );

	Core.WPBC_Form_Builder_Helper = class {

		/**
		 * Create an HTML element.
		 *
		 * @param {string} tag - HTML tag name.
		 * @param {string} [class_name=''] - Optional CSS class name.
		 * @param {string} [inner_html=''] - Optional innerHTML.
		 * @returns {HTMLElement} Created element.
		 */
		static create_element( tag, class_name = '', inner_html = '' ) {
			const el = document.createElement( tag );
			if ( class_name ) {
				el.className = class_name;
			}
			if ( inner_html ) {
				el.innerHTML = inner_html;
			}
			return el;
		}

		/**
		 * Set multiple `data-*` attributes on a given element.
		 *
		 * @param {HTMLElement} el - Target element.
		 * @param {Object} data_obj - Key-value pairs for data attributes.
		 * @returns {void}
		 */
		static set_data_attributes( el, data_obj ) {
			Object.entries( data_obj ).forEach( ( [ key, val ] ) => {
				// Previously: 2025-09-01 17:09:
				// const value = (typeof val === 'object') ? JSON.stringify( val ) : val;
				//New:
				let value;
				if ( typeof val === 'object' && val !== null ) {
					try {
						value = JSON.stringify( val );
					} catch {
						value = '';
					}
				} else {
					value = val;
				}

				el.setAttribute( 'data-' + key, value );
			} );
		}

		/**
		 * Get all `data-*` attributes from an element and parse JSON where possible.
		 *
		 * @param {HTMLElement} el - Element to extract data from.
		 * @returns {Object} Parsed key-value map of data attributes.
		 */
		static get_all_data_attributes( el ) {
			const data = {};

			if ( ! el || ! el.attributes ) {
				return data;
			}

			Array.from( el.attributes ).forEach(
				( attr ) => {
					if ( attr.name.startsWith( 'data-' ) ) {
						const key = attr.name.replace( /^data-/, '' );
						try {
							data[key] = JSON.parse( attr.value );
						} catch ( e ) {
							data[key] = attr.value;
						}
					}
				}
			);

			// Only default the label if it's truly absent (undefined/null), not when it's an empty string.
			const hasExplicitLabel = Object.prototype.hasOwnProperty.call( data, 'label' );
			if ( ! hasExplicitLabel && data.id ) {
				data.label = data.id.charAt( 0 ).toUpperCase() + data.id.slice( 1 );
			}

			return data;
		}

		/**
		 * Render a simple label + type preview (used for unknown or fallback fields).
		 *
		 * @param {Object} field_data - Field data object.
		 * @returns {string} HTML content.
		 */
		static render_field_inner_html( field_data ) {
			// Make the fallback preview respect an empty label.
			const hasLabel = Object.prototype.hasOwnProperty.call( field_data, 'label' );
			const label    = hasLabel ? String( field_data.label ) : String( field_data.id || '(no label)' );

			const type        = String( field_data.type || 'unknown' );
			const is_required = field_data.required === true || field_data.required === 'true' || field_data.required === 1 || field_data.required === '1';

			const wrapper = document.createElement( 'div' );

			const spanLabel       = document.createElement( 'span' );
			spanLabel.className   = 'wpbc_bfb__field-label';
			spanLabel.textContent = label + (is_required ? ' *' : '');
			wrapper.appendChild( spanLabel );

			const spanType       = document.createElement( 'span' );
			spanType.className   = 'wpbc_bfb__field-type';
			spanType.textContent = type;
			wrapper.appendChild( spanType );

			return wrapper.innerHTML;
		}

		/**
		 * Debounce a function.
		 *
		 * @param {Function} fn - Function to debounce.
		 * @param {number} wait - Delay in ms.
		 * @returns {Function} Debounced function.
		 */
		static debounce( fn, wait = 120 ) {
			let t = null;
			return function debounced( ...args ) {
				if ( t ) {
					clearTimeout( t );
				}
				t = setTimeout( () => fn.apply( this, args ), wait );
			};
		}

	};

	// Renderer registry. Allows late registration and avoids tight coupling to a global map.
	Core.WPBC_BFB_Field_Renderer_Registry = (function () {
		const map = new Map();
		return {
			register( type, ClassRef ) {
				map.set( String( type ), ClassRef );
			},
			get( type ) {
				return map.get( String( type ) );
			}
		};
	})();

}( window ));
// ---------------------------------------------------------------------------------------------------------------------
// == File  /includes/page-form-builder/_out/core/bfb-fields.js == | 2025-09-10 15:47
// ---------------------------------------------------------------------------------------------------------------------
(function ( w ) {
	'use strict';

	// Single global namespace (idempotent & load-order safe).
	const Core = ( w.WPBC_BFB_Core = w.WPBC_BFB_Core || {} );
	const UI   = ( Core.UI = Core.UI || {} );

	/**
	 * Base class for field renderers (static-only contract).
	 * ================================================================================================================
	 * Contract exposed to the builder (static methods on the CLASS itself):
	 *   - render(el, data, ctx)              // REQUIRED
	 *   - on_field_drop(data, el, meta)      // OPTIONAL (default provided)
	 *
	 * Helpers for subclasses:
	 *   - get_defaults()     -> per-field defaults (MUST override in subclass to set type/label)
	 *   - normalize_data(d)  -> shallow merge with defaults
	 *   - get_template(id)   -> per-id cached wp.template compiler
	 *
	 * Subclass usage:
	 *   class WPBC_BFB_Field_Text extends Core.WPBC_BFB_Field_Base { static get_defaults(){ ... } }
	 *   WPBC_BFB_Field_Text.template_id = 'wpbc-bfb-field-text';
	 * ================================================================================================================
	 */
	Core.WPBC_BFB_Field_Base = class {

		/**
		 * Default field data (generic baseline).
		 * Subclasses MUST override to provide { type, label } appropriate for the field.
		 * @returns {Object}
		 */
		static get_defaults() {
			return {
				type        : 'field',
				label       : 'Field',
				name        : 'field',
				html_id     : '',
				placeholder : '',
				required    : false,
				minlength   : '',
				maxlength   : '',
				pattern     : '',
				cssclass    : '',
				help        : ''
			};
		}

		/**
		 * Shallow-merge incoming data with defaults.
		 * @param {Object} data
		 * @returns {Object}
		 */
		static normalize_data( data ) {
			var d        = data || {};
			var defaults = this.get_defaults();
			var out      = {};
			var k;

			for ( k in defaults ) {
				if ( Object.prototype.hasOwnProperty.call( defaults, k ) ) {
					out[k] = defaults[k];
				}
			}
			for ( k in d ) {
				if ( Object.prototype.hasOwnProperty.call( d, k ) ) {
					out[k] = d[k];
				}
			}
			return out;
		}

		/**
		 * Compile and cache a wp.template by id (per-id cache).
		 * @param {string} template_id
		 * @returns {Function|null}
		 */
		static get_template(template_id) {

			// Accept either "wpbc-bfb-field-text" or "tmpl-wpbc-bfb-field-text".
			if ( ! template_id || ! window.wp || ! wp.template ) {
				return null;
			}
			const domId = template_id.startsWith( 'tmpl-' ) ? template_id : ('tmpl-' + template_id);
			if ( ! document.getElementById( domId ) ) {
				return null;
			}

			if ( ! Core.__bfb_tpl_cache_map ) {
				Core.__bfb_tpl_cache_map = {};
			}

			// Normalize id for the compiler & cache. // wp.template expects id WITHOUT the "tmpl-" prefix !
			const key = template_id.replace( /^tmpl-/, '' );
			if ( Core.__bfb_tpl_cache_map[key] ) {
				return Core.__bfb_tpl_cache_map[key];
			}

			const compiler = wp.template( key );     // <-- normalized id here
			if ( compiler ) {
				Core.__bfb_tpl_cache_map[key] = compiler;
			}

			return compiler;
		}

		/**
		 * REQUIRED: render preview into host element (full redraw; idempotent).
		 * Subclasses should set static `template_id` to a valid wp.template id.
		 * @param {HTMLElement} el
		 * @param {Object}      data
		 * @param {{mode?:string,builder?:any,tpl?:Function,sanit?:any}} ctx
		 * @returns {void}
		 */
		static render( el, data, ctx ) {
			if ( ! el ) {
				return;
			}

			var compile = this.get_template( this.template_id );
			var d       = this.normalize_data( data );

			var s = (ctx && ctx.sanit) ? ctx.sanit : Core.WPBC_BFB_Sanitize;

			// Sanitize critical attributes before templating.
			if ( s ) {
				d.html_id = d.html_id ? s.sanitize_html_id( String( d.html_id ) ) : '';
				d.name    = s.sanitize_html_name( String( d.name || d.id || 'field' ) );
			} else {
				d.html_id = d.html_id ? String( d.html_id ) : '';
				d.name    = String( d.name || d.id || 'field' );
			}

			// Fall back to generic preview if template not available.
			if ( compile ) {
				el.innerHTML = compile( d );

				// After render, set attribute values via DOM so quotes/newlines are handled correctly.
				const input = el.querySelector( 'input, textarea, select' );
				if ( input ) {
					if ( d.placeholder != null ) input.setAttribute( 'placeholder', String( d.placeholder ) );
					if ( d.title != null ) input.setAttribute( 'title', String( d.title ) );
				}

			} else {
				el.innerHTML = Core.WPBC_Form_Builder_Helper.render_field_inner_html( d );
			}

			el.dataset.type = d.type || 'field';
			el.setAttribute( 'data-label', (d.label != null ? String( d.label ) : '') ); // allow "".
		}


		/**
		 * OPTIONAL hook executed after field is dropped/loaded/preview.
		 * Default extended:
		 * - On first drop: stamp default label (existing behavior) and mark field as "fresh" for auto-name.
		 * - On load: mark as loaded so later label edits do not rename the saved name.
		 */
		static on_field_drop(data, el, meta) {

			const context = (meta && meta.context) ? String( meta.context ) : '';

			// -----------------------------------------------------------------------------------------
			// NEW: Seed default "help" (and keep it in Structure) for all field packs that define it.
			// This fixes the mismatch where:
			//   - UI shows default help via normalize_data() / templates
			//   - but get_structure() / exporters see `help` as undefined/empty.
			//
			// Behavior:
			//   - Runs ONLY on initial drop (context === 'drop').
			//   - If get_defaults() exposes a non-empty "help", and data.help is
			//     missing / null / empty string -> we persist the default into `data`
			//     and notify Structure so exports see it.
			//   - On "load" we do nothing, so existing forms where user *cleared*
			//     help will not be overridden.
			// -----------------------------------------------------------------------------------------
			if ( context === 'drop' && data ) {
				try {
					const defs = (typeof this.get_defaults === 'function') ? this.get_defaults() : null;
					if ( defs && Object.prototype.hasOwnProperty.call( defs, 'help' ) ) {
						const current    = Object.prototype.hasOwnProperty.call( data, 'help' ) ? data.help : undefined;
						const hasValue   = (current !== undefined && current !== null && String( current ) !== '');
						const defaultVal = defs.help;

						if ( ! hasValue && defaultVal != null && String( defaultVal ) !== '' ) {
							// 1) persist into data object (used by Structure).
							data.help = defaultVal;

							// 2) mirror into dataset (for any DOM-based consumers).
							if ( el ) {
								el.dataset.help = String( defaultVal );

								// 3) notify Structure / listeners (if available).
								try {
									Core.Structure?.update_field_prop?.( el, 'help', defaultVal );
									el.dispatchEvent(
										new CustomEvent( 'wpbc_bfb_field_data_changed', { bubbles: true, detail : { key: 'help', value: defaultVal } } )
									);
								} catch ( _inner ) {}
							}
						}
					}
				} catch ( _e ) {}
			}
			// -----------------------------------------------------------------------------------------

			if ( context === 'drop' && !Object.prototype.hasOwnProperty.call( data, 'label' ) ) {
				const defs = this.get_defaults();
				data.label = defs.label || 'Field';
				el.setAttribute( 'data-label', data.label );
			}
			// Mark provenance flags.
			if ( context === 'drop' ) {
				el.dataset.fresh      = '1';   // can auto-name on first label edit.
				el.dataset.autoname   = '1';
				el.dataset.was_loaded = '0';
				// Seed a provisional unique name immediately.
				try {
					const b = meta?.builder;
					if ( b?.id && (!el.hasAttribute( 'data-name' ) || !el.getAttribute( 'data-name' )) ) {
						const S    = Core.WPBC_BFB_Sanitize;
						const base = S.sanitize_html_name( el.getAttribute( 'data-id' ) || data?.id || data?.type || 'field' );
						const uniq = b.id.ensure_unique_field_name( base, el );
						el.setAttribute( 'data-name', uniq );
						el.dataset.name_user_touched = '0';
					}
				} catch ( _ ) {}

			} else if ( context === 'load' ) {
				el.dataset.fresh      = '0';
				el.dataset.autoname   = '0';
				el.dataset.was_loaded = '1';   // never rename names for loaded fields.
			}
		}

		// --- Auto Rename "Fresh" field,  on entering the new Label ---

		/**
		 * Create a conservative field "name" from a human label.
		 * Uses the same constraints as sanitize_html_name (letters/digits/_- and leading letter).
		 */
		static name_from_label(label) {
			const s = Core.WPBC_BFB_Sanitize.sanitize_html_name( String( label ?? '' ) );
			return s.toLowerCase() || 'field';
		}

		/**
		 * Auto-fill data-name from label ONLY for freshly dropped fields that were not edited yet.
		 * - Never runs for sections.
		 * - Never runs for loaded/existing fields.
		 * - Stops as soon as user edits the Name manually.
		 *
		 * @param {WPBC_Form_Builder} builder
		 * @param {HTMLElement} el  - .wpbc_bfb__field element
		 * @param {string} labelVal
		 */
		static maybe_autoname_from_label(builder, el, labelVal) {
			if ( !builder || !el ) return;
			if ( el.classList.contains( 'wpbc_bfb__section' ) ) return;

			const allowAuto = el.dataset.autoname === '1';

			const userTouched = el.dataset.name_user_touched === '1';
			const isLoaded    = el.dataset.was_loaded === '1';

			if ( !allowAuto || userTouched || isLoaded ) return;

			// Only override placeholder-y names
			const S = Core.WPBC_BFB_Sanitize;

			const base   = this.name_from_label( labelVal );
			const unique = builder.id.ensure_unique_field_name( base, el );
			el.setAttribute( 'data-name', unique );

			const ins      = document.getElementById( 'wpbc_bfb__inspector' );
			const nameCtrl = ins?.querySelector( '[data-inspector-key="name"]' );
			if ( nameCtrl && 'value' in nameCtrl && nameCtrl.value !== unique ) nameCtrl.value = unique;
		}


	};

	/**
	 * Select_Base (shared base for select-like packs)
	 *
	 * @type {Core.WPBC_BFB_Select_Base}
	 */
	Core.WPBC_BFB_Select_Base = class extends Core.WPBC_BFB_Field_Base {

		static template_id            = null;                 // main preview template id
		static option_row_template_id = 'wpbc-bfb-inspector-select-option-row'; // row tpl id
		static kind                   = 'select';
		static __root_wired           = false;
		static __root_node            = null;

		// Single source of selectors used by the inspector UI.
		static ui = {
			list   : '.wpbc_bfb__options_list',
			holder : '.wpbc_bfb__options_state[data-inspector-key="options"]',
			row    : '.wpbc_bfb__options_row',
			label  : '.wpbc_bfb__opt-label',
			value  : '.wpbc_bfb__opt-value',
			toggle : '.wpbc_bfb__opt-selected-chk',
			add_btn: '.js-add-option',

			drag_handle      : '.wpbc_bfb__drag-handle',
			multiple_chk     : '.js-opt-multiple[data-inspector-key="multiple"]',
			default_text     : '.js-default-value[data-inspector-key="default_value"]',
			placeholder_input: '.js-placeholder[data-inspector-key="placeholder"]',
			placeholder_note : '.js-placeholder-note',
			size_input       : '.inspector__input[data-inspector-key="size"]',

			// Dropdown menu integration.
			menu_root  : '.wpbc_ui_el__dropdown',
			menu_toggle: '[data-toggle="wpbc_dropdown"]',
			menu_action: '.ul_dropdown_menu_li_action[data-action]',
			// Value-differs toggle.
			value_differs_chk: '.js-value-differs[data-inspector-key="value_differs"]',
		};

		/**
		 * Build option value from label.
		 * - If `differs === true` -> generate token (slug-like machine value).
		 * - If `differs === false` -> keep human text; escape only dangerous chars.
		 * @param {string} label
		 * @param {boolean} differs
		 * @returns {string}
		 */
		static build_value_from_label(label, differs) {
			const S = Core.WPBC_BFB_Sanitize;
			if ( differs ) {
				return (S && typeof S.to_token === 'function')
					? S.to_token( String( label || '' ) )
					: String( label || '' ).trim().toLowerCase().replace( /\s+/g, '_' ).replace( /[^\w-]/g, '' );
			}
			// single-input mode: keep human text; template will escape safely.
			return String( label == null ? '' : label );
		}

		/**
		 * Is the “value differs from label” toggle enabled?
		 * @param {HTMLElement} panel
		 * @returns {boolean}
		 */
		static is_value_differs_enabled(panel) {
			const chk = panel?.querySelector( this.ui.value_differs_chk );
			return !!(chk && chk.checked);
		}

		/**
		 * Ensure visibility/enabled state of Value inputs based on the toggle.
		 * When disabled -> hide Value inputs and keep them mirrored from Label.
		 * @param {HTMLElement} panel
		 * @returns {void}
		 */
		static sync_value_inputs_visibility(panel) {
			const differs = this.is_value_differs_enabled( panel );
			const rows    = panel?.querySelectorAll( this.ui.row ) || [];

			for ( let i = 0; i < rows.length; i++ ) {
				const r      = rows[i];
				const lbl_in = r.querySelector( this.ui.label );
				const val_in = r.querySelector( this.ui.value );
				if ( !val_in ) continue;

				if ( differs ) {
					// Re-enable & show value input
					val_in.removeAttribute( 'disabled' );
					val_in.style.display = '';

					// If we have a cached custom value and the row wasn't edited while OFF, restore it
					const hasCache   = !!val_in.dataset.cached_value;
					const userEdited = r.dataset.value_user_touched === '1';

					if ( hasCache && !userEdited ) {
						val_in.value = val_in.dataset.cached_value;
					} else if ( !hasCache ) {
						// No cache: if value is just a mirrored label, offer a tokenized default
						const lbl      = lbl_in ? lbl_in.value : '';
						const mirrored = this.build_value_from_label( lbl, /*differs=*/false );
						if ( val_in.value === mirrored ) {
							val_in.value = this.build_value_from_label( lbl, /*differs=*/true );
						}
					}
				} else {
					// ON -> OFF: cache once, then mirror
					if ( !val_in.dataset.cached_value ) {
						val_in.dataset.cached_value = val_in.value || '';
					}
					const lbl    = lbl_in ? lbl_in.value : '';
					val_in.value = this.build_value_from_label( lbl, /*differs=*/false );

					val_in.setAttribute( 'disabled', 'disabled' );
					val_in.style.display = 'none';
					// NOTE: do NOT mark as user_touched here
				}
			}
		}


		/**
		 * Return whether this row’s value has been edited by user.
		 * @param {HTMLElement} row
		 * @returns {boolean}
		 */
		static is_row_value_user_touched(row) {
			return row?.dataset?.value_user_touched === '1';
		}

		/**
		 * Mark this row’s value as edited by user.
		 * @param {HTMLElement} row
		 */
		static mark_row_value_user_touched(row) {
			if ( row ) row.dataset.value_user_touched = '1';
		}

		/**
		 * Initialize “freshness” flags on a row (value untouched).
		 * Call on creation/append of rows.
		 * @param {HTMLElement} row
		 */
		static init_row_fresh_flags(row) {
			if ( row ) {
				if ( !row.dataset.value_user_touched ) {
					row.dataset.value_user_touched = '0';
				}
			}
		}

		// ---- defaults (packs can override) ----
		static get_defaults() {
			return {
				type         : this.kind,
				label        : 'Select',
				name         : '',
				html_id      : '',
				placeholder  : '--- Select ---',
				required     : false,
				multiple     : false,
				size         : null,
				cssclass     : '',
				help         : '',
				default_value: '',
				options      : [
					{ label: 'Option 1', value: 'Option 1', selected: false },
					{ label: 'Option 2', value: 'Option 2', selected: false },
					{ label: 'Option 3', value: 'Option 3', selected: false },
					{ label: 'Option 4', value: 'Option 4', selected: false }
				],
				min_width    : '240px'
			};
		}

		// ---- preview render (idempotent) ----
		static render(el, data, ctx) {
			if ( !el ) return;

			const d = this.normalize_data( data );

			if ( d.min_width != null ) {
				el.dataset.min_width = String( d.min_width );
				try {
					el.style.setProperty( '--wpbc-col-min', String( d.min_width ) );
				} catch ( _ ) {
				}
			}
			if ( d.html_id != null ) el.dataset.html_id = String( d.html_id || '' );
			if ( d.cssclass != null ) el.dataset.cssclass = String( d.cssclass || '' );
			if ( d.placeholder != null ) el.dataset.placeholder = String( d.placeholder || '' );

			const tpl = this.get_template( this.template_id );
			if ( typeof tpl !== 'function' ) {
				el.innerHTML = '<div class="wpbc_bfb__error" role="alert">Template not found: ' + this.template_id + '.</div>';
				return;
			}

			try {
				el.innerHTML = tpl( d );
			} catch ( e ) {
				window._wpbc?.dev?.error?.( 'Select_Base.render', e );
				el.innerHTML = '<div class="wpbc_bfb__error" role="alert">Error rendering field preview.</div>';
				return;
			}

			el.dataset.type = d.type || this.kind;
			el.setAttribute( 'data-label', (d.label != null ? String( d.label ) : '') );

			try {
				Core.UI?.WPBC_BFB_Overlay?.ensure?.( ctx?.builder, el );
			} catch ( _ ) {
			}

			if ( !el.dataset.options && Array.isArray( d.options ) && d.options.length ) {
				try {
					el.dataset.options = JSON.stringify( d.options );
				} catch ( _ ) {
				}
			}
		}

		// ---- drop seeding (options + placeholder) ----
		static on_field_drop(data, el, meta) {
			try {
				super.on_field_drop?.( data, el, meta );
			} catch ( _ ) {
			}

			const is_drop = (meta && meta.context === 'drop');

			if ( is_drop ) {
				if ( !Array.isArray( data.options ) || !data.options.length ) {
					const opts   = (this.get_defaults().options || []).map( (o) => ({
						label   : o.label,
						value   : o.value,
						selected: !!o.selected
					}) );
					data.options = opts;
					try {
						el.dataset.options = JSON.stringify( opts );
						el.dispatchEvent( new CustomEvent( 'wpbc_bfb_field_data_changed', { bubbles: true,
							detail                                                                 : {
								key  : 'options',
								value: opts
							}
						} ) );
						Core.Structure?.update_field_prop?.( el, 'options', opts );
					} catch ( _ ) {
					}
				}

				const ph = (data.placeholder ?? '').toString().trim();
				if ( !ph ) {
					const dflt       = this.get_defaults().placeholder || '--- Select ---';
					data.placeholder = dflt;
					try {
						el.dataset.placeholder = String( dflt );
						el.dispatchEvent( new CustomEvent( 'wpbc_bfb_field_data_changed', { bubbles: true,
							detail                                                                 : {
								key  : 'placeholder',
								value: dflt
							}
						} ) );
						Core.Structure?.update_field_prop?.( el, 'placeholder', dflt );
					} catch ( _ ) {
					}
				}
			}
		}

		// ==============================
		// Inspector helpers (snake_case)
		// ==============================
		static get_panel_root(el) {
			return el?.closest?.( '.wpbc_bfb__inspector__body' ) || el?.closest?.( '.wpbc_bfb__inspector' ) || null;
		}

		static get_list(panel) {
			return panel ? panel.querySelector( this.ui.list ) : null;
		}

		static get_holder(panel) {
			return panel ? panel.querySelector( this.ui.holder ) : null;
		}

		static make_uid() {
			return 'wpbc_ins_auto_opt_' + Math.random().toString( 36 ).slice( 2, 10 );
		}

		static append_row(panel, data) {
			const list = this.get_list( panel );
			if ( !list ) return;

			const idx  = list.children.length;
			const rowd = Object.assign( { label: '', value: '', selected: false, index: idx }, (data || {}) );
			if ( !rowd.uid ) rowd.uid = this.make_uid();

			const tpl_id = this.option_row_template_id;
			const tpl    = (window.wp && wp.template) ? wp.template( tpl_id ) : null;
			const html   = tpl ? tpl( rowd ) : null;

			// In append_row() -> fallback HTML.
			const wrap     = document.createElement( 'div' );
			wrap.innerHTML = html || (
				'<div class="wpbc_bfb__options_row" data-index="' + (rowd.index || 0) + '">' +
					'<span class="wpbc_bfb__drag-handle"><span class="wpbc_icn_drag_indicator"></span></span>' +
					'<input type="text" class="wpbc_bfb__opt-label" placeholder="Label" value="' + (rowd.label || '') + '">' +
					'<input type="text" class="wpbc_bfb__opt-value" placeholder="Value" value="' + (rowd.value || '') + '">' +
					'<div class="wpbc_bfb__opt-selected">' +
						'<div class="inspector__control wpbc_ui__toggle">' +
							'<input type="checkbox" class="wpbc_bfb__opt-selected-chk inspector__input" id="' + rowd.uid + '" role="switch" ' + (rowd.selected ? 'checked aria-checked="true"' : 'aria-checked="false"') + '>' +
							'<label class="wpbc_ui__toggle_icon_radio" for="' + rowd.uid + '"></label>' +
							'<label class="wpbc_ui__toggle_label" for="' + rowd.uid + '">Default</label>' +
						'</div>' +
					'</div>' +
					// 3-dot dropdown (uses existing plugin dropdown JS).
					'<div class="wpbc_ui_el wpbc_ui_el_container wpbc_ui_el__dropdown">' +
						'<a href="javascript:void(0)" data-toggle="wpbc_dropdown" aria-expanded="false" class="ul_dropdown_menu_toggle">' +
							'<i class="menu_icon icon-1x wpbc_icn_more_vert"></i>' +
						'</a>' +
						'<ul class="ul_dropdown_menu" role="menu" style="right:0px; left:auto;">' +
							'<li>' +
								'<a class="ul_dropdown_menu_li_action" data-action="add_after" href="javascript:void(0)">' +
									'Add New' +
									'<i class="menu_icon icon-1x wpbc_icn_add_circle"></i>' +
								'</a>' +
							'</li>' +
							'<li>' +
								'<a class="ul_dropdown_menu_li_action" data-action="duplicate" href="javascript:void(0)">' +
									'Duplicate' +
									'<i class="menu_icon icon-1x wpbc_icn_content_copy"></i>' +
								'</a>' +
							'</li>' +
							'<li class="divider"></li>' +
							'<li>' +
								'<a class="ul_dropdown_menu_li_action" data-action="remove" href="javascript:void(0)">' +
									'Remove' +
									'<i class="menu_icon icon-1x wpbc_icn_delete_outline"></i>' +
								'</a>' +
							'</li>' +
						'</ul>' +
					'</div>' +
				'</div>'
			);

			const node = wrap.firstElementChild;
			 if (! node) {
				 return;
			 }
			// pre-hide Value input if toggle is OFF **before** appending.
			const differs = this.is_value_differs_enabled( panel );
			const valIn   = node.querySelector( this.ui.value );
			const lblIn   = node.querySelector( this.ui.label );

			if ( !differs && valIn ) {
				if ( !valIn.dataset.cached_value ) {
					valIn.dataset.cached_value = valIn.value || '';
				}
				if ( lblIn ) valIn.value = this.build_value_from_label( lblIn.value, false );
				valIn.setAttribute( 'disabled', 'disabled' );
				valIn.style.display = 'none';
			}


			this.init_row_fresh_flags( node );
			list.appendChild( node );

			// Keep your existing post-append sync as a safety net
			this.sync_value_inputs_visibility( panel );
		}

		static close_dropdown(anchor_el) {
			try {
				var root = anchor_el?.closest?.( this.ui.menu_root );
				if ( root ) {
					// If your dropdown toggler toggles a class like 'open', close it.
					root.classList.remove( 'open' );
					// Or if it relies on aria-expanded on the toggle.
					var t = root.querySelector( this.ui.menu_toggle );
					if ( t ) {
						t.setAttribute( 'aria-expanded', 'false' );
					}
				}
			} catch ( _ ) { }
		}

		static insert_after(new_node, ref_node) {
			if ( ref_node?.parentNode ) {
				if ( ref_node.nextSibling ) {
					ref_node.parentNode.insertBefore( new_node, ref_node.nextSibling );
				} else {
					ref_node.parentNode.appendChild( new_node );
				}
			}
		}

		static commit_options(panel) {
			const list   = this.get_list( panel );
			const holder = this.get_holder( panel );
			if ( !list || !holder ) return;

			const differs = this.is_value_differs_enabled( panel );

			const rows    = list.querySelectorAll( this.ui.row );
			const options = [];
			for ( let i = 0; i < rows.length; i++ ) {
				const r      = rows[i];
				const lbl_in = r.querySelector( this.ui.label );
				const val_in = r.querySelector( this.ui.value );
				const chk    = r.querySelector( this.ui.toggle );

				const lbl = (lbl_in && lbl_in.value) || '';
				let val   = (val_in && val_in.value) || '';

				// If single-input mode -> hard mirror to label.
				if ( ! differs ) {
					// single-input mode: mirror Label, minimal escaping (no slug).
					val = this.build_value_from_label( lbl, /*differs=*/false );
					if ( val_in ) {
						val_in.value = val;   // keep hidden input in sync for any previews/debug.
					}
				}

				const sel = !!(chk && chk.checked);
				options.push( { label: lbl, value: val, selected: sel } );
			}

			try {
				holder.value = JSON.stringify( options );
				holder.dispatchEvent( new Event( 'input', { bubbles: true } ) );
				holder.dispatchEvent( new Event( 'change', { bubbles: true } ) );
				panel.dispatchEvent( new CustomEvent( 'wpbc_bfb_field_data_changed', {
					bubbles: true, detail: {
						key: 'options', value: options
					}
				} ) );
			} catch ( _ ) {
			}

			this.sync_default_value_lock( panel );
			this.sync_placeholder_lock( panel );

			// Mirror to the selected field element so canvas/export sees current options immediately.
			const field = panel.__selectbase_field
				|| document.querySelector( '.wpbc_bfb__field.is-selected, .wpbc_bfb__field--selected' );
			if ( field ) {
				try {
					field.dataset.options = JSON.stringify( options );
				} catch ( _ ) {
				}
				Core.Structure?.update_field_prop?.( field, 'options', options );
				field.dispatchEvent( new CustomEvent( 'wpbc_bfb_field_data_changed', {
					bubbles: true, detail: { key: 'options', value: options }
				} ) );
			}
		}


		static ensure_sortable(panel) {
			const list = this.get_list( panel );
			if ( !list || list.dataset.sortable_init === '1' ) return;
			if ( window.Sortable?.create ) {
				try {
					window.Sortable.create( list, {
						handle   : this.ui.drag_handle,
						animation: 120,
						onSort   : () => this.commit_options( panel )
					} );
					list.dataset.sortable_init = '1';
				} catch ( e ) {
					window._wpbc?.dev?.error?.( 'Select_Base.ensure_sortable', e );
				}
			}
		}

		static rebuild_if_empty(panel) {
			const list   = this.get_list( panel );
			const holder = this.get_holder( panel );
			if ( !list || !holder || list.children.length ) return;

			let data = [];
			try {
				data = JSON.parse( holder.value || '[]' );
			} catch ( _ ) {
				data = [];
			}

			if ( !Array.isArray( data ) || !data.length ) {
				data = (this.get_defaults().options || []).slice( 0 );
				try {
					holder.value = JSON.stringify( data );
					holder.dispatchEvent( new Event( 'input', { bubbles: true } ) );
					holder.dispatchEvent( new Event( 'change', { bubbles: true } ) );
				} catch ( _ ) {
				}
			}

			for ( let i = 0; i < data.length; i++ ) {
				this.append_row( panel, {
					label   : data[i]?.label || '',
					value   : data[i]?.value || '',
					selected: !!data[i]?.selected,
					index   : i,
					uid     : this.make_uid()
				} );
			}

			this.sync_default_value_lock( panel );
			this.sync_placeholder_lock( panel );
			this.sync_value_inputs_visibility( panel );
		}

		static has_row_defaults(panel) {
			const checks = panel?.querySelectorAll( this.ui.toggle );
			if ( !checks?.length ) return false;
			for ( let i = 0; i < checks.length; i++ ) if ( checks[i].checked ) return true;
			return false;
		}

		static is_multiple_enabled(panel) {
			const chk = panel?.querySelector( this.ui.multiple_chk );
			return !!(chk && chk.checked);
		}

		static has_text_default_value(panel) {
			const dv = panel?.querySelector( this.ui.default_text );
			return !!(dv && String( dv.value || '' ).trim().length);
		}

		static sync_default_value_lock(panel) {
			const input = panel?.querySelector( this.ui.default_text );
			const note  = panel?.querySelector( '.js-default-value-note' );
			if ( !input ) return;

			const lock     = this.has_row_defaults( panel );
			input.disabled = !!lock;
			if ( lock ) {
				input.setAttribute( 'aria-disabled', 'true' );
				if ( note ) note.style.display = '';
			} else {
				input.removeAttribute( 'aria-disabled' );
				if ( note ) note.style.display = 'none';
			}
		}

		static sync_placeholder_lock(panel) {
			const input = panel?.querySelector( this.ui.placeholder_input );
			const note  = panel?.querySelector( this.ui.placeholder_note );

			// NEW: compute multiple and toggle row visibility
			const isMultiple     = this.is_multiple_enabled( panel );
			const placeholderRow = input?.closest( '.inspector__row' ) || null;
			const sizeInput      = panel?.querySelector( this.ui.size_input ) || null;
			const sizeRow        = sizeInput?.closest( '.inspector__row' ) || null;

			// Show placeholder only for single-select; show size only for multiple
			if ( placeholderRow ) placeholderRow.style.display = isMultiple ? 'none' : '';
			if ( sizeRow ) sizeRow.style.display = isMultiple ? '' : 'none';

			// Existing behavior (keep as-is)
			if ( !input ) return;

			const lock = isMultiple || this.has_row_defaults( panel ) || this.has_text_default_value( panel );
			if ( note && !note.id ) note.id = 'wpbc_placeholder_note_' + Math.random().toString( 36 ).slice( 2, 10 );

			input.disabled = !!lock;
			if ( lock ) {
				input.setAttribute( 'aria-disabled', 'true' );
				if ( note ) {
					note.style.display = '';
					input.setAttribute( 'aria-describedby', note.id );
				}
			} else {
				input.removeAttribute( 'aria-disabled' );
				input.removeAttribute( 'aria-describedby' );
				if ( note ) note.style.display = 'none';
			}
		}

		static enforce_single_default(panel, clicked) {
			if ( this.is_multiple_enabled( panel ) ) return;

			const checks = panel?.querySelectorAll( this.ui.toggle );
			if ( !checks?.length ) return;

			if ( clicked && clicked.checked ) {
				for ( let i = 0; i < checks.length; i++ ) if ( checks[i] !== clicked ) {
					checks[i].checked = false;
					checks[i].setAttribute( 'aria-checked', 'false' );
				}
				clicked.setAttribute( 'aria-checked', 'true' );
				return;
			}

			let kept = false;
			for ( let j = 0; j < checks.length; j++ ) if ( checks[j].checked ) {
				if ( !kept ) {
					kept = true;
				} else {
					checks[j].checked = false;
					checks[j].setAttribute( 'aria-checked', 'false' );
				}
			}

			this.sync_default_value_lock( panel );
			this.sync_placeholder_lock( panel );
		}

		// ---- one-time bootstrap of a panel ----
		static bootstrap_panel(panel) {
			if ( !panel ) return;
			if ( !panel.querySelector( '.wpbc_bfb__options_editor' ) ) return; // only select-like UIs
			if ( panel.dataset.selectbase_bootstrapped === '1' ) {
				this.ensure_sortable( panel );
				return;
			}

			this.rebuild_if_empty( panel );
			this.ensure_sortable( panel );
			panel.dataset.selectbase_bootstrapped = '1';

			this.sync_default_value_lock( panel );
			this.sync_placeholder_lock( panel );
			this.sync_value_inputs_visibility( panel );
		}

		// ---- hook into inspector lifecycle (fires ONCE) ----
		static wire_once() {
			if ( Core.__selectbase_wired ) return;
			Core.__selectbase_wired = true;

			const on_ready_or_render = (ev) => {
				const panel = ev?.detail?.panel;
				const field = ev?.detail?.el || ev?.detail?.field || null;
				if ( !panel ) return;
				if ( field ) panel.__selectbase_field = field;
				this.bootstrap_panel( panel );
				// If the inspector root was remounted, ensure root listeners are (re)bound.
				this.wire_root_listeners();
			};

			document.addEventListener( 'wpbc_bfb_inspector_ready', on_ready_or_render );
			document.addEventListener( 'wpbc_bfb_inspector_render', on_ready_or_render );

			this.wire_root_listeners();
		}

		static wire_root_listeners() {

			// If already wired AND the stored root is still in the DOM, bail out.
			if ( this.__root_wired && this.__root_node?.isConnected ) return;

			const root = document.getElementById( 'wpbc_bfb__inspector' );
			if ( !root ) {
				// Root missing (e.g., SPA re-render) — clear flags so we can wire later.
				this.__root_wired = false;
				this.__root_node  = null;
				return;
			}

			this.__root_node                   = root;
			this.__root_wired                  = true;
			root.dataset.selectbase_root_wired = '1';

			const get_panel = (target) =>
				target?.closest?.( '.wpbc_bfb__inspector__body' ) ||
				root.querySelector( '.wpbc_bfb__inspector__body' ) || null;

			// Click handlers: add / delete / duplicate
			root.addEventListener( 'click', (e) => {
				const panel = get_panel( e.target );
				if ( !panel ) return;

				this.bootstrap_panel( panel );

				const ui = this.ui;

				// Existing "Add option" button (top toolbar)
				const add = e.target.closest?.( ui.add_btn );
				if ( add ) {
					this.append_row( panel, { label: '', value: '', selected: false } );
					this.commit_options( panel );
					this.sync_value_inputs_visibility( panel );
					return;
				}

				// Dropdown menu actions.
				const menu_action = e.target.closest?.( ui.menu_action );
				if ( menu_action ) {
					e.preventDefault();
					e.stopPropagation();

					const action = (menu_action.getAttribute( 'data-action' ) || '').toLowerCase();
					const row    = menu_action.closest?.( ui.row );

					if ( !row ) {
						this.close_dropdown( menu_action );
						return;
					}

					if ( 'add_after' === action ) {
						// Add empty row after current
						const prev_count = this.get_list( panel )?.children.length || 0;
						this.append_row( panel, { label: '', value: '', selected: false } );
						// Move the newly added last row just after current row to preserve "add after"
						const list = this.get_list( panel );
						if ( list && list.lastElementChild && list.lastElementChild !== row ) {
							this.insert_after( list.lastElementChild, row );
						}
						this.commit_options( panel );
						this.sync_value_inputs_visibility( panel );
					} else if ( 'duplicate' === action ) {
						const lbl = (row.querySelector( ui.label ) || {}).value || '';
						const val = (row.querySelector( ui.value ) || {}).value || '';
						const sel = !!((row.querySelector( ui.toggle ) || {}).checked);
						this.append_row( panel, { label: lbl, value: val, selected: sel, uid: this.make_uid() } );
						// Place the new row right after the current.
						const list = this.get_list( panel );

						if ( list && list.lastElementChild && list.lastElementChild !== row ) {
							this.insert_after( list.lastElementChild, row );
						}
						this.enforce_single_default( panel, null );
						this.commit_options( panel );
						this.sync_value_inputs_visibility( panel );
					} else if ( 'remove' === action ) {
						if ( row && row.parentNode ) row.parentNode.removeChild( row );
						this.commit_options( panel );
						this.sync_value_inputs_visibility( panel );
					}

					this.close_dropdown( menu_action );
					return;
				}

			}, true );


			// Input delegation.
			root.addEventListener( 'input', (e) => {
				const panel = get_panel( e.target );
				if ( ! panel ) {
					return;
				}
				const ui                = this.ui;
				const is_label_or_value = e.target.classList?.contains( 'wpbc_bfb__opt-label' ) || e.target.classList?.contains( 'wpbc_bfb__opt-value' );
				const is_toggle         = e.target.classList?.contains( 'wpbc_bfb__opt-selected-chk' );
				const is_multiple       = e.target.matches?.( ui.multiple_chk );
				const is_default_text   = e.target.matches?.( ui.default_text );
				const is_value_differs  = e.target.matches?.( ui.value_differs_chk );

				// Handle "value differs" toggle live
				if ( is_value_differs ) {
					this.sync_value_inputs_visibility( panel );
					this.commit_options( panel );
					return;
				}

				// Track when the user edits VALUE explicitly
				if ( e.target.classList?.contains( 'wpbc_bfb__opt-value' ) ) {
					const row = e.target.closest( this.ui.row );
					this.mark_row_value_user_touched( row );
					// Keep the cache updated so toggling OFF/ON later restores the latest custom value
					e.target.dataset.cached_value = e.target.value || '';
				}

				// Auto-fill VALUE from LABEL if value is fresh (and differs is ON); if differs is OFF, we mirror anyway in commit
				if ( e.target.classList?.contains( 'wpbc_bfb__opt-label' ) ) {
					const row     = e.target.closest( ui.row );
					const val_in  = row?.querySelector( ui.value );
					const differs = this.is_value_differs_enabled( panel );

					if ( val_in ) {
						if ( !differs ) {
							// single-input mode: mirror human label with minimal escaping
							val_in.value = this.build_value_from_label( e.target.value, false );
						} else if ( !this.is_row_value_user_touched( row ) ) {
							// separate-value mode, only while fresh
							val_in.value = this.build_value_from_label( e.target.value, true );
						}
					}
				}


				if ( is_label_or_value || is_toggle || is_multiple ) {
					if ( is_toggle ) e.target.setAttribute( 'aria-checked', e.target.checked ? 'true' : 'false' );
					if ( is_toggle || is_multiple ) this.enforce_single_default( panel, is_toggle ? e.target : null );
					this.commit_options( panel );
				}

				if ( is_default_text ) {
					this.sync_default_value_lock( panel );
					this.sync_placeholder_lock( panel );
					const holder = this.get_holder( panel );
					if ( holder ) {
						holder.dispatchEvent( new Event( 'input', { bubbles: true } ) );
						holder.dispatchEvent( new Event( 'change', { bubbles: true } ) );
					}
				}
			}, true );


			// Change delegation
			root.addEventListener( 'change', (e) => {
				const panel = get_panel( e.target );
				if ( !panel ) return;

				const ui        = this.ui;
				const is_toggle = e.target.classList?.contains( 'wpbc_bfb__opt-selected-chk' );
				const is_multi  = e.target.matches?.( ui.multiple_chk );
				if ( !is_toggle && !is_multi ) return;

				if ( is_toggle ) e.target.setAttribute( 'aria-checked', e.target.checked ? 'true' : 'false' );
				this.enforce_single_default( panel, is_toggle ? e.target : null );
				this.commit_options( panel );
			}, true );

			// Lazy bootstrap
			root.addEventListener( 'mouseenter', (e) => {
				const panel = get_panel( e.target );
				if ( panel && e.target?.closest?.( this.ui.list ) ) this.bootstrap_panel( panel );
			}, true );

			root.addEventListener( 'mousedown', (e) => {
				const panel = get_panel( e.target );
				if ( panel && e.target?.closest?.( this.ui.drag_handle ) ) this.bootstrap_panel( panel );
			}, true );
		}

	};

	try { Core.WPBC_BFB_Select_Base.wire_once(); } catch (_) {}
	// Try immediately (if root is already in DOM), then again on DOMContentLoaded.
	Core.WPBC_BFB_Select_Base.wire_root_listeners();

	document.addEventListener('DOMContentLoaded', () => { Core.WPBC_BFB_Select_Base.wire_root_listeners();  });

}( window ));
// ---------------------------------------------------------------------------------------------------------------------
// == File  /includes/page-form-builder/_out/core/bfb-ui.js == | 2025-09-10 15:47
// ---------------------------------------------------------------------------------------------------------------------
(function (w, d) {
	'use strict';

	// Single global namespace (idempotent & load-order safe).
	const Core = (w.WPBC_BFB_Core = w.WPBC_BFB_Core || {});
	const UI   = (Core.UI = Core.UI || {});

	// --- Highlight Element,  like Generator brn  -  Tiny UI helpers ------------------------------------
	UI._pulse_timers = UI._pulse_timers || new Map();

	/**
	 * Force-restart a CSS animation on a class.
	 * @param {HTMLElement} el
	 * @param {string} cls
	 */
	UI._restart_css_animation = function (el, cls) {
		if ( ! el ) { return; }
		try {
			el.classList.remove( cls );
		} catch ( _ ) {}
		// Force reflow so the next add() retriggers the keyframes.
		void el.offsetWidth;
		try {
			el.classList.add( cls );
		} catch ( _ ) {}
	};

	/**
		Single pulse (back-compat).
		@param {HTMLElement} el
		@param {number} dur_ms
	 */
	UI.pulse_once = function (el, dur_ms) {
		if ( ! el ) { return; }
		var cls = 'wpbc_bfb__scroll-pulse';
		var ms  = Number.isFinite( dur_ms ) ? dur_ms : 700;

		try {
			clearTimeout( UI._pulse_timers.get( el ) );
		} catch ( _ ) {}
		UI._restart_css_animation( el, cls );
		var t = setTimeout( function () {
			try {
				el.classList.remove( cls );
			} catch ( _ ) {}
			UI._pulse_timers.delete( el );
		}, ms );
		UI._pulse_timers.set( el, t );
	};

	/**
		Multi-blink sequence with optional per-call color override.
		@param {HTMLElement} el
		@param {number} [times=3]
		@param {number} [on_ms=280]
		@param {number} [off_ms=180]
		@param {string} [hex_color] Optional CSS color (e.g. '#ff4d4f' or 'rgb(...)').
	 */
	UI.pulse_sequence = function (el, times, on_ms, off_ms, hex_color) {
		if ( !el || !d.body.contains( el ) ) {
			return;
		}
		var cls   = 'wpbc_bfb__highlight-pulse';
		var count = Number.isFinite( times ) ? times : 2;
		var on    = Number.isFinite( on_ms ) ? on_ms : 280;
		var off   = Number.isFinite( off_ms ) ? off_ms : 180;

		// cancel any running pulse and reset class.
		try {
			clearTimeout( UI._pulse_timers.get( el ) );
		} catch ( _ ) {}
		el.classList.remove( cls );

		var have_color = !!hex_color && typeof hex_color === 'string';
		if ( have_color ) {
			try {
				el.style.setProperty( '--wpbc-bfb-pulse-color', hex_color );
			} catch ( _ ) {}
		}

		var i = 0;
		(function tick() {
			if ( i >= count ) {
				UI._pulse_timers.delete( el );
				if ( have_color ) {
					try {
						el.style.removeProperty( '--wpbc-bfb-pulse-color' );
					} catch ( _ ) {}
				}
				return;
			}
			UI._restart_css_animation( el, cls );
			UI._pulse_timers.set( el, setTimeout( function () {     // ON -> OFF
				try {
					el.classList.remove( cls );
				} catch ( _ ) {
				}
				UI._pulse_timers.set( el, setTimeout( function () { // OFF gap -> next
					i++;
					tick();
				}, off ) );
			}, on ) );
		})();
	};

	/**
		Query + pulse:
		(BC) If only 3rd arg is a number and no 4th/5th -> single long pulse.
		Otherwise -> strong sequence (defaults 3×280/180).
		Optional 6th arg: color.
		@param {HTMLElement|string} root_or_selector
		@param {string} [selector]
		@param {number} [a]
		@param {number} [b]

		@param {number} [c]

		@param {string} [color]
	 */
	UI.pulse_query = function (root_or_selector, selector, a, b, c, color) {
		var root = (typeof root_or_selector === 'string') ? d : (root_or_selector || d);
		var sel  = (typeof root_or_selector === 'string') ? root_or_selector : selector;
		if ( !sel ) {
			return;
		}

		var el = root.querySelector( sel );
		if ( !el ) {
			return;
		}

// Back-compat: UI.pulseQuery(root, sel, dur_ms)
		if ( Number.isFinite( a ) && b === undefined && c === undefined ) {
			return UI.pulse_once( el, a );
		}
// New: sequence; params optional; supports optional color.
		UI.pulse_sequence( el, a, b, c, color );
	};

	/**
	Convenience helper (snake_case) to call a strong pulse with options.

	@param {HTMLElement} el

	@param {Object} [opts]

	@param {number} [opts.times=3]

	@param {number} [opts.on_ms=280]

	@param {number} [opts.off_ms=180]

	@param {string} [opts.color]
	 */
	UI.pulse_sequence_strong = function (el, opts) {
		opts = opts || {};
		UI.pulse_sequence(
			el,
			Number.isFinite( opts.times ) ? opts.times : 3,
			Number.isFinite( opts.on_ms ) ? opts.on_ms : 280,
			Number.isFinite( opts.off_ms ) ? opts.off_ms : 180,
			opts.color
		);
	};


	/**
	 * Base class for BFB modules.
	 */
	UI.WPBC_BFB_Module = class {
		/** @param {WPBC_Form_Builder} builder */
		constructor(builder) {
			this.builder = builder;
		}

		/** Initialize the module. */
		init() {
		}

		/** Cleanup the module. */
		destroy() {
		}
	};

	/**
	 * Central overlay/controls manager for fields/sections.
	 * Pure UI composition; all actions route back into the builder instance.
	 */
	UI.WPBC_BFB_Overlay = class {

		/**
		 * Ensure an overlay exists and is wired up on the element.
		 * @param {WPBC_Form_Builder} builder
		 * @param {HTMLElement} el - field or section element
		 */
		static ensure(builder, el) {

			if ( !el ) {
				return;
			}
			const isSection = el.classList.contains( 'wpbc_bfb__section' );

			// let overlay = el.querySelector( Core.WPBC_BFB_DOM.SELECTORS.overlay );
			let overlay = el.querySelector( `:scope > ${Core.WPBC_BFB_DOM.SELECTORS.overlay}` );
			if ( !overlay ) {
				overlay = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__overlay-controls' );
				el.prepend( overlay );
			}

			// Drag handle.
			if ( !overlay.querySelector( '.wpbc_bfb__drag-handle' ) ) {
				const dragClass = isSection ? 'wpbc_bfb__drag-handle section-drag-handle' : 'wpbc_bfb__drag-handle';
				overlay.appendChild(
					Core.WPBC_Form_Builder_Helper.create_element( 'span', dragClass, '<span class="wpbc_icn_drag_indicator"></span>' )
				);
			}

			// SETTINGS button (shown for both fields & sections).
			if ( !overlay.querySelector( '.wpbc_bfb__settings-btn' ) ) {
				const settings_btn   = Core.WPBC_Form_Builder_Helper.create_element( 'button', 'wpbc_bfb__settings-btn', '<i class="menu_icon icon-1x wpbc_icn_settings"></i>' );
				settings_btn.type    = 'button';
				settings_btn.title   = 'Open settings';
				settings_btn.onclick = (e) => {
					e.preventDefault();
					// Select THIS element and scroll it into view.
					builder.select_field( el, { scrollIntoView: true } );

					// Auto-open Inspector from the overlay “Settings” button.
					document.dispatchEvent( new CustomEvent( 'wpbc_bfb:show_panel', {
						detail: {
							panel_id: 'wpbc_bfb__inspector',
							tab_id  : 'wpbc_tab_inspector'
						}
					} ) );

					// Try to bring the inspector into view / focus first input.
					const ins = document.getElementById( 'wpbc_bfb__inspector' );
					if ( ins ) {
						ins.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
						// Focus first interactive control (best-effort).
						setTimeout( () => {
							const focusable = ins.querySelector( 'input,select,textarea,button,[contenteditable],[tabindex]:not([tabindex="-1"])' );
							focusable?.focus?.();
						}, 260 );
					}
				};

				overlay.appendChild( settings_btn );
			}

			overlay.setAttribute( 'role', 'toolbar' );
			overlay.setAttribute( 'aria-label', el.classList.contains( 'wpbc_bfb__section' ) ? 'Section tools' : 'Field tools' );

			return overlay;
		}
	};

	/**
	 * WPBC Layout Chips helper - visual layout picker (chips), e.g., "50%/50%", to a section overlay.
	 *
	 * Renders Equal/Presets/Custom chips into a host container and wires them to apply the layout.
	 */
	UI.WPBC_BFB_Layout_Chips = class {

		/** Read per-column min (px) from CSS var set by the guard. */
		static _get_col_min_px(col) {
			const v = getComputedStyle( col ).getPropertyValue( '--wpbc-col-min' ) || '0';
			const n = parseFloat( v );
			return Number.isFinite( n ) ? Math.max( 0, n ) : 0;
		}

		/**
		 * Turn raw weights (e.g. [1,1], [2,1,1]) into effective "available-%" bases that
		 * (a) sum to the row's available %, and (b) meet every column's min px.
		 * Returns an array of bases (numbers) or null if impossible to satisfy mins.
		 */
		static _fit_weights_respecting_min(builder, row, weights) {
			const cols = Array.from( row.querySelectorAll( ':scope > .wpbc_bfb__column' ) );
			const n    = cols.length;
			if ( !n ) return null;
			if ( !Array.isArray( weights ) || weights.length !== n ) return null;

			// available % after gaps (from LayoutService)
			const gp       = builder.col_gap_percent;
			const eff      = builder.layout.compute_effective_bases_from_row( row, gp );
			const availPct = eff.available;               // e.g. 94 if 2 cols and 3% gap
			const rowPx    = row.getBoundingClientRect().width;
			const availPx  = rowPx * (availPct / 100);

			// collect minima in % of "available"
			const minPct = cols.map( (c) => {
				const minPx = UI.WPBC_BFB_Layout_Chips._get_col_min_px( c );
				if ( availPx <= 0 ) return 0;
				return (minPx / availPx) * availPct;
			} );

			// If mins alone don't fit, bail.
			const sumMin = minPct.reduce( (a, b) => a + b, 0 );
			if ( sumMin > availPct - 1e-6 ) {
				return null; // impossible to respect mins; don't apply preset
			}

			// Target percentages from weights, normalized to availPct.
			const wSum      = weights.reduce( (a, w) => a + (Number( w ) || 0), 0 ) || n;
			const targetPct = weights.map( (w) => ((Number( w ) || 0) / wSum) * availPct );

			// Lock columns that would be below min, then distribute the remainder
			// across the remaining columns proportionally to their targetPct.
			const locked  = new Array( n ).fill( false );
			let lockedSum = 0;
			for ( let i = 0; i < n; i++ ) {
				if ( targetPct[i] < minPct[i] ) {
					locked[i] = true;
					lockedSum += minPct[i];
				}
			}

			let remaining     = availPct - lockedSum;
			const freeIdx     = [];
			let freeTargetSum = 0;
			for ( let i = 0; i < n; i++ ) {
				if ( !locked[i] ) {
					freeIdx.push( i );
					freeTargetSum += targetPct[i];
				}
			}

			const result = new Array( n ).fill( 0 );
			// Seed locked with their minima.
			for ( let i = 0; i < n; i++ ) {
				if ( locked[i] ) result[i] = minPct[i];
			}

			if ( freeIdx.length === 0 ) {
				// everything locked exactly at min; any leftover (shouldn't happen)
				// would be ignored to keep simplicity and stability.
				return result;
			}

			if ( remaining <= 0 ) {
				// nothing left to distribute; keep exactly mins on locked,
				// nothing for free (degenerate but consistent)
				return result;
			}

			if ( freeTargetSum <= 0 ) {
				// distribute equally among free columns
				const each = remaining / freeIdx.length;
				freeIdx.forEach( (i) => (result[i] = each) );
				return result;
			}

			// Distribute remaining proportionally to free columns' targetPct
			freeIdx.forEach( (i) => {
				result[i] = remaining * (targetPct[i] / freeTargetSum);
			} );
			return result;
		}

		/** Apply a preset but guard it by minima; returns true if applied, false if skipped. */
		static _apply_preset_with_min_guard(builder, section_el, weights) {
			const row = section_el.querySelector( ':scope > .wpbc_bfb__row' );
			if ( !row ) return false;

			const fitted = UI.WPBC_BFB_Layout_Chips._fit_weights_respecting_min( builder, row, weights );
			if ( !fitted ) {
				builder?._announce?.( 'Not enough space for this layout because of fields’ minimum widths.' );
				return false;
			}

			// `fitted` already sums to the row’s available %, so we can apply bases directly.
			builder.layout.apply_bases_to_row( row, fitted );
			return true;
		}


		/**
		 * Build and append layout chips for a section.
		 *
		 * @param {WPBC_Form_Builder} builder - The form builder instance.
		 * @param {HTMLElement} section_el - The .wpbc_bfb__section element.
		 * @param {HTMLElement} host_el - Container where chips should be rendered.
		 * @returns {void}
		 */
		static render_for_section(builder, section_el, host_el) {

			if ( !builder || !section_el || !host_el ) {
				return;
			}

			const row = section_el.querySelector( ':scope > .wpbc_bfb__row' );
			if ( !row ) {
				return;
			}

			const cols = row.querySelectorAll( ':scope > .wpbc_bfb__column' ).length || 1;

			// Clear host.
			host_el.innerHTML = '';

			// Equal chip.
			host_el.appendChild(
				UI.WPBC_BFB_Layout_Chips._make_chip( builder, section_el, Array( cols ).fill( 1 ), 'Equal' )
			);

			// Presets based on column count.
			const presets = builder.layout.build_presets_for_columns( cols );
			presets.forEach( (weights) => {
				host_el.appendChild(
					UI.WPBC_BFB_Layout_Chips._make_chip( builder, section_el, weights, null )
				);
			} );

			// Custom chip.
			const customBtn       = document.createElement( 'button' );
			customBtn.type        = 'button';
			customBtn.className   = 'wpbc_bfb__layout_chip';
			customBtn.textContent = 'Custom…';
			customBtn.title       = `Enter ${cols} percentages`;
			customBtn.addEventListener( 'click', () => {
				const example = (cols === 2) ? '50,50' : (cols === 3 ? '20,60,20' : '25,25,25,25');
				const text    = prompt( `Enter ${cols} percentages (comma or space separated):`, example );
				if ( text == null ) return;
				const weights = builder.layout.parse_weights( text );
				if ( weights.length !== cols ) {
					alert( `Please enter exactly ${cols} numbers.` );
					return;
				}
				// OLD:
				// builder.layout.apply_layout_preset( section_el, weights, builder.col_gap_percent );
				// Guarded apply:.
				if ( !UI.WPBC_BFB_Layout_Chips._apply_preset_with_min_guard( builder, section_el, weights ) ) {
					return;
				}
				host_el.querySelectorAll( '.wpbc_bfb__layout_chip' ).forEach( c => c.classList.remove( 'is-active' ) );
				customBtn.classList.add( 'is-active' );
			} );
			host_el.appendChild( customBtn );
		}

		/**
		 * Create a single layout chip button.
		 *
		 * @private
		 * @param {WPBC_Form_Builder} builder
		 * @param {HTMLElement} section_el
		 * @param {number[]} weights
		 * @param {string|null} label
		 * @returns {HTMLButtonElement}
		 */
		static _make_chip(builder, section_el, weights, label = null) {

			const btn     = document.createElement( 'button' );
			btn.type      = 'button';
			btn.className = 'wpbc_bfb__layout_chip';

			const title = label || builder.layout.format_preset_label( weights );
			btn.title   = title;

			// Visual miniature.
			const vis     = document.createElement( 'div' );
			vis.className = 'wpbc_bfb__layout_chip-vis';
			const sum     = weights.reduce( (a, b) => a + (Number( b ) || 0), 0 ) || 1;
			weights.forEach( (w) => {
				const bar      = document.createElement( 'span' );
				bar.style.flex = `0 0 calc( ${((Number( w ) || 0) / sum * 100).toFixed( 3 )}% - 1.5px )`;
				vis.appendChild( bar );
			} );
			btn.appendChild( vis );

			const txt       = document.createElement( 'span' );
			txt.className   = 'wpbc_bfb__layout_chip-label';
			txt.textContent = label || builder.layout.format_preset_label( weights );
			btn.appendChild( txt );

			btn.addEventListener( 'click', () => {
				// OLD:
				// builder.layout.apply_layout_preset( section_el, weights, builder.col_gap_percent );

				// NEW:
				if ( !UI.WPBC_BFB_Layout_Chips._apply_preset_with_min_guard( builder, section_el, weights ) ) {
					return; // do not toggle active if we didn't change layout
				}

				btn.parentElement?.querySelectorAll( '.wpbc_bfb__layout_chip' ).forEach( c => c.classList.remove( 'is-active' ) );
				btn.classList.add( 'is-active' );
			} );

			return btn;
		}
	};

	/**
	 * Selection controller for fields and announcements.
	 */
	UI.WPBC_BFB_Selection_Controller = class extends UI.WPBC_BFB_Module {

		init() {

			this._selected_uid              = null;
			this.builder.select_field       = this.select_field.bind( this );
			this.builder.get_selected_field = this.get_selected_field.bind( this );
			this._on_clear                  = this.on_clear.bind( this );

			// Centralized delete command used by keyboard + inspector + overlay.
			this.builder.delete_item = (el) => {
				if ( !el ) {
					return null;
				}
				const b        = this.builder;
				const neighbor = b._find_neighbor_selectable?.( el ) || null;
				el.remove();
				// Use local Core constants (not a global) to avoid ReferenceErrors.
				b.bus?.emit?.( Core.WPBC_BFB_Events.FIELD_REMOVE, { el, id: el?.dataset?.id, uid: el?.dataset?.uid } );
				b.usage?.update_palette_ui?.();
				// Notify generic structure listeners, too:
				b.bus?.emit?.( Core.WPBC_BFB_Events.STRUCTURE_CHANGE, { reason: 'delete', el } );
				// Defer selection a tick so the DOM is fully settled before Inspector hydrates.
				requestAnimationFrame( () => {
					// This calls inspector.bind_to_field() and opens the Inspector panel.
					b.select_field?.( neighbor || null, { scrollIntoView: !!neighbor } );
				} );
				return neighbor;
			};
			this.builder.bus.on( Core.WPBC_BFB_Events.CLEAR_SELECTION, this._on_clear );
			this.builder.bus.on( Core.WPBC_BFB_Events.STRUCTURE_LOADED, this._on_clear );
			// delegated click selection (capture ensures we win before bubbling to containers).
			this._on_canvas_click = this._handle_canvas_click.bind( this );
			this.builder.pages_container.addEventListener( 'click', this._on_canvas_click, true );
		}

		destroy() {
			this.builder.bus.off( Core.WPBC_BFB_Events.CLEAR_SELECTION, this._on_clear );

			if ( this._on_canvas_click ) {
				this.builder.pages_container.removeEventListener( 'click', this._on_canvas_click, true );
				this._on_canvas_click = null;
			}
		}

		/**
		 * Delegated canvas click -> select closest field/section (inner beats outer).
		 * @private
		 * @param {MouseEvent} e
		 */
		_handle_canvas_click(e) {
			const root = this.builder.pages_container;
			if ( !root ) return;

			// Ignore clicks on controls/handles/resizers, etc.
			const IGNORE = [
				'.wpbc_bfb__overlay-controls',
				'.wpbc_bfb__layout_picker',
				'.wpbc_bfb__drag-handle',
				'.wpbc_bfb__field-remove-btn',
				'.wpbc_bfb__field-move-up',
				'.wpbc_bfb__field-move-down',
				'.wpbc_bfb__column-resizer'
			].join( ',' );

			if ( e.target.closest( IGNORE ) ) {
				return; // let those controls do their own thing.
			}

			// Find the closest selectable (field OR section) from the click target.
			let hit = e.target.closest?.(
				`${Core.WPBC_BFB_DOM.SELECTORS.validField}, ${Core.WPBC_BFB_DOM.SELECTORS.section}, .wpbc_bfb__column`
			);

			if ( !hit || !root.contains( hit ) ) {
				this.select_field( null );           // Clear selection on blank click.
				return;                              // Empty space is handled elsewhere.
			}

			// NEW: if user clicked a COLUMN -> remember tab key on its SECTION, but still select the section.
			let preselect_tab_key = null;
			if ( hit.classList.contains( 'wpbc_bfb__column' ) ) {
				const row  = hit.closest( '.wpbc_bfb__row' );
				const cols = row ? Array.from( row.querySelectorAll( ':scope > .wpbc_bfb__column' ) ) : [];
				const idx  = Math.max( 0, cols.indexOf( hit ) );
				const sec  = hit.closest( '.wpbc_bfb__section' );
				if ( sec ) {
					preselect_tab_key = String( idx + 1 );              // tabs are 1-based in ui-column-styles.js
					// Hint for the renderer (it reads this BEFORE rendering and restores the tab).
					sec.dataset.col_styles_active_tab = preselect_tab_key;
					// promote selection to the section (same UX as before).
					hit                               = sec;
					// NEW: visually mark which column is being edited
					if ( UI && UI.WPBC_BFB_Column_Styles && UI.WPBC_BFB_Column_Styles.set_selected_col_flag ) {
						UI.WPBC_BFB_Column_Styles.set_selected_col_flag( sec, preselect_tab_key );
					}
				}
			}

			// Select and stop bubbling so outer containers don’t reselect a parent.
			this.select_field( hit );
			e.stopPropagation();

			// Also set the tab after the inspector renders (works even if it was already open).
			if ( preselect_tab_key ) {
				(window.requestAnimationFrame || setTimeout)( function () {
					try {
						const ins  = document.getElementById( 'wpbc_bfb__inspector' );
						const tabs = ins && ins.querySelector( '[data-bfb-slot="column_styles"] [data-wpbc-tabs]' );
						if ( tabs && window.wpbc_ui_tabs && typeof window.wpbc_ui_tabs.set_active === 'function' ) {
							window.wpbc_ui_tabs.set_active( tabs, preselect_tab_key );
						}
					} catch ( _e ) {
					}
				}, 0 );

				// Politely ask the Inspector to focus/open the "Column Styles" group and tab.
				try {
					document.dispatchEvent( new CustomEvent( 'wpbc_bfb:inspector_focus', {
						detail: {
							group  : 'column_styles',
							tab_key: preselect_tab_key
						}
					} ) );
				} catch ( _e ) {
				}
			}
		}


		/**
		 * Select a field element or clear selection.
		 *
		 * @param {HTMLElement|null} field_el
		 * @param {{scrollIntoView?: boolean}} [opts = {}]
		 */
		select_field(field_el, { scrollIntoView = false } = {}) {
			const root   = this.builder.pages_container;
			const prevEl = this.get_selected_field?.() || null;   // the one we’re leaving.

			// Ignore elements not in the canvas.
			if ( field_el && !root.contains( field_el ) ) {
				field_el = null; // treat as "no selection".
			}

			// NEW: if we are leaving a section, clear its column highlight
			if (
				prevEl && prevEl !== field_el &&
				prevEl.classList?.contains( 'wpbc_bfb__section' ) &&
				UI?.WPBC_BFB_Column_Styles?.clear_selected_col_flag
			) {
				UI.WPBC_BFB_Column_Styles.clear_selected_col_flag( prevEl );
			}

			// If we're leaving a field, permanently stop auto-name for it.
			if ( prevEl && prevEl !== field_el && prevEl.classList?.contains( 'wpbc_bfb__field' ) ) {
				prevEl.dataset.autoname = '0';
				prevEl.dataset.fresh    = '0';
			}

			root.querySelectorAll( '.is-selected' ).forEach( (n) => {
				n.classList.remove( 'is-selected' );
			} );
			if ( !field_el ) {
				const prev         = this._selected_uid || null;
				this._selected_uid = null;
				this.builder.inspector?.clear?.();
				root.classList.remove( 'has-selection' );
				this.builder.bus.emit( Core.WPBC_BFB_Events.CLEAR_SELECTION, { prev_uid: prev, source: 'builder' } );

				// Auto-open "Add Fields" when nothing is selected.
				document.dispatchEvent( new CustomEvent( 'wpbc_bfb:show_panel', {
					detail: {
						panel_id: 'wpbc_bfb__palette_add_new',
						tab_id  : 'wpbc_tab_library'
					}
				} ) );

				return;
			}
			field_el.classList.add( 'is-selected' );
			this._selected_uid = field_el.getAttribute( 'data-uid' ) || null;

			// Fallback: ensure sections announce themselves as type="section".
			if ( field_el.classList.contains( 'wpbc_bfb__section' ) && !field_el.dataset.type ) {
				field_el.dataset.type = 'section';
			}

			if ( scrollIntoView ) {
				field_el.scrollIntoView( { behavior: 'smooth', block: 'center' } );
			}
			this.builder.inspector?.bind_to_field?.( field_el );

			// Fallback: ensure inspector enhancers (incl. ValueSlider) run every bind.
			try {
				const ins = document.getElementById( 'wpbc_bfb__inspector' )
					|| document.querySelector( '.wpbc_bfb__inspector' );
				if ( ins ) {
					UI.InspectorEnhancers?.scan?.( ins );              // runs all enhancers
					UI.WPBC_BFB_ValueSlider?.init_on?.( ins );         // extra belt-and-suspenders
				}
			} catch ( _ ) {
			}

			// NEW: when selecting a section, reflect its active tab as the highlighted column.
			if ( field_el.classList.contains( 'wpbc_bfb__section' ) &&
				UI?.WPBC_BFB_Column_Styles?.set_selected_col_flag ) {
				var k = (field_el.dataset && field_el.dataset.col_styles_active_tab)
					? field_el.dataset.col_styles_active_tab : '1';
				UI.WPBC_BFB_Column_Styles.set_selected_col_flag( field_el, k );
			}

			// Keep sections & fields in the same flow:
			// 1) Generic hydrator for simple dataset-backed controls.
			if ( field_el ) {
				UI.WPBC_BFB_Inspector_Bridge._generic_hydrate_controls?.( this.builder, field_el );
				UI.WPBC_BFB_Inspector_Bridge._hydrate_special_controls?.( this.builder, field_el );
			}

			// Auto-open Inspector when a user selects a field/section .
			document.dispatchEvent( new CustomEvent( 'wpbc_bfb:show_panel', {
				detail: {
					panel_id: 'wpbc_bfb__inspector',
					tab_id  : 'wpbc_tab_inspector'
				}
			} ) );

			root.classList.add( 'has-selection' );
			this.builder.bus.emit( Core.WPBC_BFB_Events.SELECT, { uid: this._selected_uid, el: field_el } );
			const label = field_el?.querySelector( '.wpbc_bfb__field-label' )?.textContent || (field_el.classList.contains( 'wpbc_bfb__section' ) ? 'section' : '') || field_el?.dataset?.id || 'item';
			this.builder._announce( 'Selected ' + label + '.' );
		}

		/** @returns {HTMLElement|null} */
		get_selected_field() {
			if ( !this._selected_uid ) {
				return null;
			}
			const esc_attr = Core.WPBC_BFB_Sanitize.esc_attr_value_for_selector( this._selected_uid );
			return this.builder.pages_container.querySelector( `.wpbc_bfb__field[data-uid="${esc_attr}"], .wpbc_bfb__section[data-uid="${esc_attr}"]` );
		}

		/** @param {CustomEvent} ev */
		on_clear(ev) {
			const src = ev?.detail?.source ?? ev?.source;
			if ( src !== 'builder' ) {
				this.select_field( null );
			}
		}

	};

	/**
	 * Bridges the builder with the Inspector and sanitizes id/name edits.
	 */
	UI.WPBC_BFB_Inspector_Bridge = class extends UI.WPBC_BFB_Module {

		init() {
			this._attach_inspector();
			this._bind_id_sanitizer();
			this._open_inspector_after_field_added();
			this._bind_focus_shortcuts();
		}

		_attach_inspector() {
			const b      = this.builder;
			const attach = () => {
				if ( typeof window.WPBC_BFB_Inspector === 'function' ) {
					b.inspector = new WPBC_BFB_Inspector( document.getElementById( 'wpbc_bfb__inspector' ), b );
					this._bind_id_sanitizer();
					document.removeEventListener( 'wpbc_bfb_inspector_ready', attach );
				}
			};
			// Ensure we bind after late ready as well.
			if ( typeof window.WPBC_BFB_Inspector === 'function' ) {
				attach();
			} else {
				b.inspector = {
					bind_to_field() {
					}, clear() {
					}
				};
				document.addEventListener( 'wpbc_bfb_inspector_ready', attach );
				setTimeout( attach, 0 );
			}
		}

		/**
		 * Listen for "focus" hints from the canvas and open the right group/tab.
		 * - Supports: group === 'column_styles'
		 * - Also scrolls the group into view.
		 */
		_bind_focus_shortcuts() {
			/** @param {CustomEvent} e */
			const on_focus = (e) => {
				try {
					const grp_key = e && e.detail && e.detail.group;
					const tab_key = e && e.detail && e.detail.tab_key;
					if ( !grp_key ) {
						return;
					}

					const ins = document.getElementById( 'wpbc_bfb__inspector' ) || document.querySelector( '.wpbc_bfb__inspector' );
					if ( !ins ) {
						return;
					}

					if ( grp_key === 'column_styles' ) {
						// Find the Column Styles slot/group.
						const slot = ins.querySelector( '[data-bfb-slot="column_styles"]' )
							|| ins.querySelector( '[data-inspector-group-key="column_styles"]' );
						if ( slot ) {
							// Open collapsible container if present.
							const group_wrap = slot.closest( '.inspector__group' ) || slot.closest( '[data-inspector-group]' );
							if ( group_wrap && !group_wrap.classList.contains( 'is-open' ) ) {
								group_wrap.classList.add( 'is-open' );
								// Mirror ARIA state if your header uses aria-expanded.
								const header_btn = group_wrap.querySelector( '[aria-expanded]' );
								if ( header_btn ) {
									header_btn.setAttribute( 'aria-expanded', 'true' );
								}
							}

							// Optional: set the requested tab key if tabs exist in this group.
							if ( tab_key ) {
								const tabs = slot.querySelector( '[data-wpbc-tabs]' );
								if ( tabs && window.wpbc_ui_tabs && typeof window.wpbc_ui_tabs.set_active === 'function' ) {
									window.wpbc_ui_tabs.set_active( tabs, String( tab_key ) );
								}
							}

							// Bring into view for convenience.
							try {
								slot.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
							} catch ( _e ) {
							}
						}
					}
				} catch ( _e ) {
				}
			};

			this._on_inspector_focus = on_focus;
			document.addEventListener( 'wpbc_bfb:inspector_focus', on_focus, true );
		}

		destroy() {
			try {
				if ( this._on_inspector_focus ) {
					document.removeEventListener( 'wpbc_bfb:inspector_focus', this._on_inspector_focus, true );
					this._on_inspector_focus = null;
				}
			} catch ( _e ) {
			}
		}


		/**
		 * Hydrate inspector inputs for "special" keys that we handle explicitly.
		 * Works for both fields and sections.
		 * @param {WPBC_Form_Builder} builder
		 * @param {HTMLElement} sel
		 */
		static _hydrate_special_controls(builder, sel) {
			const ins = document.getElementById( 'wpbc_bfb__inspector' );
			if ( !ins || !sel ) return;

			const setVal = (key, val) => {
				const ctrl = ins.querySelector( `[data-inspector-key="${key}"]` );
				if ( ctrl && 'value' in ctrl ) ctrl.value = String( val ?? '' );
			};

			// Internal id / name / public html_id.
			setVal( 'id', sel.getAttribute( 'data-id' ) || '' );
			setVal( 'name', sel.getAttribute( 'data-name' ) || '' );
			setVal( 'html_id', sel.getAttribute( 'data-html_id' ) || '' );

			// Section-only extras are harmless to set for fields (controls may not exist).
			setVal( 'cssclass', sel.getAttribute( 'data-cssclass' ) || '' );
			setVal( 'label', sel.getAttribute( 'data-label' ) || '' );
		}


		/**
		 * Hydrate inspector inputs that declare a generic dataset mapping via
		 * [data-inspector-key] but do NOT declare a custom value_from adapter.
		 * This makes sections follow the same data flow as fields with almost no glue.
		 *
		 * @param {WPBC_Form_Builder} builder
		 * @param {HTMLElement} sel - currently selected field/section
		 */
		static _generic_hydrate_controls(builder, sel) {
			const ins = document.getElementById( 'wpbc_bfb__inspector' );
			if ( !ins || !sel ) return;

			const SKIP = /^(id|name|html_id|cssclass|label)$/; // handled by _hydrate_special_controls

			// NEW: read schema for the selected element’s type.
			const schemas     = window.WPBC_BFB_Schemas || {};
			const typeKey     = (sel.dataset && sel.dataset.type) || '';
			const schemaEntry = schemas[typeKey] || null;
			const propsSchema = (schemaEntry && schemaEntry.schema && schemaEntry.schema.props) ? schemaEntry.schema.props : {};
			const hasOwn      = Function.call.bind( Object.prototype.hasOwnProperty );
			const getDefault  = (key) => {
				const meta = propsSchema[key];
				return (meta && hasOwn( meta, 'default' )) ? meta.default : undefined;
			};

			ins.querySelectorAll( '[data-inspector-key]' ).forEach( (ctrl) => {
				const key = String( ctrl.dataset?.inspectorKey || '' ).toLowerCase();
				if ( !key || SKIP.test( key ) ) return;

				// Element-level lock.
				const dl = (ctrl.dataset?.locked || '').trim().toLowerCase();
				if ( dl === '1' || dl === 'true' || dl === 'yes' ) return;

				// Respect explicit adapters.
				if ( ctrl.dataset?.value_from || ctrl.dataset?.valueFrom ) return;

				const raw      = sel.dataset ? sel.dataset[key] : undefined;
				const hasRaw   = sel.dataset ? hasOwn( sel.dataset, key ) : false;
				const defValue = getDefault( key );

				// Best-effort control typing with schema default fallback when value is absent.

				if ( ctrl instanceof HTMLInputElement && (ctrl.type === 'checkbox' || ctrl.type === 'radio') ) {
					// If dataset is missing the key entirely -> use schema default (boolean).
					if ( !hasRaw ) {
						ctrl.checked = !!defValue;
					} else {
						ctrl.checked = Core.WPBC_BFB_Sanitize.coerce_boolean( raw, !!defValue );
					}
				} else if ( 'value' in ctrl ) {
					if ( hasRaw ) {
						ctrl.value = (raw != null) ? String( raw ) : '';
					} else {
						ctrl.value = (defValue == null) ? '' : String( defValue );
					}
				}
			} );
		}

		_bind_id_sanitizer() {
			const b   = this.builder;
			const ins = document.getElementById( 'wpbc_bfb__inspector' );
			if ( ! ins ) {
				return;
			}

			const handler = (e) => {

				const t = e.target;
				if ( !t || !('value' in t) ) {
					return;
				}
				const key       = (t.dataset?.inspectorKey || '').toLowerCase();
				const sel       = b.get_selected_field?.();
				const isSection = sel?.classList?.contains( 'wpbc_bfb__section' );
				if ( !sel ) return;

				// Unified emitter that always includes the element reference.
				const EV              = Core.WPBC_BFB_Events;
				const bus_emit_change = (reason, extra = {}) => b.bus?.emit?.( EV.STRUCTURE_CHANGE, {
					reason,
					el: sel, ...extra
				} );

				// ---- FIELD/SECTION: internal id ----
				if ( key === 'id' ) {
					const unique = b.id.set_field_id( sel, t.value );
					if ( b.preview_mode && !isSection ) {
						b.render_preview( sel );
					}
					if ( t.value !== unique ) {
						t.value = unique;
					}
					bus_emit_change( 'id-change' );
					return;
				}

				// ---- FIELD/SECTION: public HTML id ----
				if ( key === 'html_id' ) {
					const applied = b.id.set_field_html_id( sel, t.value );
					// For sections, also set the real DOM id so anchors/CSS can target it.
					if ( isSection ) {
						sel.id = applied || '';
					} else if ( b.preview_mode ) {
						b.render_preview( sel );
					}
					if ( t.value !== applied ) {
						t.value = applied;
					}
					bus_emit_change( 'html-id-change' );
					return;
				}

				// ---- FIELDS ONLY: name ----
				if ( key === 'name' && !isSection ) {

					// Live typing: sanitize only (NO uniqueness yet) to avoid "-2" spam
					if ( e.type === 'input' ) {
						const before    = t.value;
						const sanitized = Core.WPBC_BFB_Sanitize.sanitize_html_name( before );
						if ( before !== sanitized ) {
							// optional: preserve caret to avoid jump
							const selStart = t.selectionStart, selEnd = t.selectionEnd;
							t.value        = sanitized;
							try {
								t.setSelectionRange( selStart, selEnd );
							} catch ( _ ) {
							}
						}
						return; // uniqueness on change/blur
					}

					// Commit (change/blur)
					const raw = String( t.value ?? '' ).trim();

					if ( !raw ) {
						// RESEED: keep name non-empty and provisional (autoname stays ON)
						const S    = Core.WPBC_BFB_Sanitize;
						const base = S.sanitize_html_name( sel.getAttribute( 'data-id' ) || sel.dataset.id || sel.dataset.type || 'field' );
						const uniq = b.id.ensure_unique_field_name( base, sel );

						sel.setAttribute( 'data-name', uniq );
						sel.dataset.autoname          = '1';
						sel.dataset.name_user_touched = '0';

						// Keep DOM in sync if we’re not re-rendering
						if ( !b.preview_mode ) {
							const ctrl = sel.querySelector( 'input,textarea,select' );
							if ( ctrl ) ctrl.setAttribute( 'name', uniq );
						} else {
							b.render_preview( sel );
						}

						if ( t.value !== uniq ) t.value = uniq;
						bus_emit_change( 'name-reseed' );
						return;
					}

					// Non-empty commit: user takes control; disable autoname going forward
					sel.dataset.name_user_touched = '1';
					sel.dataset.autoname          = '0';

					const sanitized = Core.WPBC_BFB_Sanitize.sanitize_html_name( raw );
					const unique    = b.id.set_field_name( sel, sanitized );

					if ( !b.preview_mode ) {
						const ctrl = sel.querySelector( 'input,textarea,select' );
						if ( ctrl ) ctrl.setAttribute( 'name', unique );
					} else {
						b.render_preview( sel );
					}

					if ( t.value !== unique ) t.value = unique;
					bus_emit_change( 'name-change' );
					return;
				}

				// ---- SECTIONS & FIELDS: cssclass (live apply; no re-render) ----
				if ( key === 'cssclass' ) {
					const next       = Core.WPBC_BFB_Sanitize.sanitize_css_classlist( t.value || '' );
					const desiredArr = next.split( /\s+/ ).filter( Boolean );
					const desiredSet = new Set( desiredArr );

					// Core classes are never touched.
					const isCore = (cls) => cls === 'is-selected' || cls.startsWith( 'wpbc_' );

					// Snapshot before mutating (DOMTokenList is live).
					const beforeClasses = Array.from( sel.classList );
					const customBefore  = beforeClasses.filter( (c) => !isCore( c ) );

					// Remove stray non-core classes not in desired.
					customBefore.forEach( (c) => {
						if ( !desiredSet.has( c ) ) sel.classList.remove( c );
					} );

					// Add missing desired classes in one go.
					const missing = desiredArr.filter( (c) => !customBefore.includes( c ) );
					if ( missing.length ) sel.classList.add( ...missing );

					// Keep dataset in sync (avoid useless attribute writes).
					if ( sel.getAttribute( 'data-cssclass' ) !== next ) {
						sel.setAttribute( 'data-cssclass', next );
					}

					// Emit only if something actually changed.
					const afterClasses = Array.from( sel.classList );
					const changed      = afterClasses.length !== beforeClasses.length || beforeClasses.some( (c, i) => c !== afterClasses[i] );

					const detail = { key: 'cssclass', phase: e.type };
					if ( isSection ) {
						bus_emit_change( 'cssclass-change', detail );
					} else {
						bus_emit_change( 'prop-change', detail );
					}
					return;
				}


				// ---- SECTIONS: label ----
				if ( isSection && key === 'label' ) {
					const val = String( t.value ?? '' );
					sel.setAttribute( 'data-label', val );
					bus_emit_change( 'label-change' );
					return;
				}

				// ---- FIELDS: label (auto-name while typing; freeze on commit) ----
				if ( !isSection && key === 'label' ) {
					const val         = String( t.value ?? '' );
					sel.dataset.label = val;

					// while typing, allow auto-name (if flags permit)
					try {
						Core.WPBC_BFB_Field_Base.maybe_autoname_from_label( b, sel, val );
					} catch ( _ ) {
					}

					// if user committed the label (blur/change), freeze future auto-name
					if ( e.type !== 'input' ) {
						sel.dataset.autoname = '0';   // stop future label->name sync
						sel.dataset.fresh    = '0';   // also kill the "fresh" escape hatch
					}

					// Optional UI nicety: disable Name when auto is ON, enable when OFF
					const ins      = document.getElementById( 'wpbc_bfb__inspector' );
					const nameCtrl = ins?.querySelector( '[data-inspector-key="name"]' );
					if ( nameCtrl ) {
						const autoActive =
								  (sel.dataset.autoname ?? '1') !== '0' &&
								  sel.dataset.name_user_touched !== '1' &&
								  sel.dataset.was_loaded !== '1';
						nameCtrl.toggleAttribute( 'disabled', autoActive );
						if ( autoActive && !nameCtrl.placeholder ) {
							nameCtrl.placeholder = b?.i18n?.auto_from_label ?? 'auto — from label';
						}
						if ( !autoActive && nameCtrl.placeholder === (b?.i18n?.auto_from_label ?? 'auto — from label') ) {
							nameCtrl.placeholder = '';
						}
					}

					// Always re-render the preview so label changes are visible immediately.
					b.render_preview( sel );
					bus_emit_change( 'label-change' );
					return;
				}


				// ---- DEFAULT (GENERIC): dataset writer for both fields & sections ----
				// Any inspector control with [data-inspector-key] that doesn't have a custom
				// adapter/value_from will simply read/write sel.dataset[key].
				if ( key ) {

					const selfLocked = /^(1|true|yes)$/i.test( (t.dataset?.locked || '').trim() );
					if ( selfLocked ) {
						return;
					}

					// Skip keys we handled above to avoid double work.
					if ( key === 'id' || key === 'name' || key === 'html_id' || key === 'cssclass' || key === 'label' ) {
						return;
					}
					let nextVal = '';
					if ( t instanceof HTMLInputElement && (t.type === 'checkbox' || t.type === 'radio') ) {
						nextVal = t.checked ? '1' : '';
					} else if ( 'value' in t ) {
						nextVal = String( t.value ?? '' );
					}
					// Persist to dataset.
					if ( sel?.dataset ) sel.dataset[key] = nextVal;
					// Re-render on visual keys so preview stays in sync (calendar label/help, etc.).
					const visualKeys = new Set( [ 'help', 'placeholder', 'min_width', 'cssclass' ] );
					if ( !isSection && (visualKeys.has( key ) || key.startsWith( 'ui_' )) ) {
						// Light heuristic: only re-render on commit for heavy inputs; live for short ones is fine.
						if ( e.type === 'change' || key === 'help' || key === 'placeholder' ) {
							b.render_preview( sel );
						}
					}
					bus_emit_change( 'prop-change', { key, phase: e.type } );
					return;
				}
			};

			ins.addEventListener( 'change', handler, true );
			// reflect instantly while typing as well.
			ins.addEventListener( 'input', handler, true );
		}

		/**
		 * Open Inspector after a field is added.
		 * @private
		 */
		_open_inspector_after_field_added() {
			const EV = Core.WPBC_BFB_Events;
			this.builder?.bus?.on?.( EV.FIELD_ADD, (e) => {
				const el = e?.detail?.el || null;
				if ( el && this.builder?.select_field ) {
					this.builder.select_field( el, { scrollIntoView: true } );
				}
				// Show Inspector Palette.
				document.dispatchEvent( new CustomEvent( 'wpbc_bfb:show_panel', {
					detail: {
						panel_id: 'wpbc_bfb__inspector',
						tab_id  : 'wpbc_tab_inspector'
					}
				} ) );
			} );
		}
	};

	/**
	 * Keyboard shortcuts for selection, deletion, and movement.
	 */
	UI.WPBC_BFB_Keyboard_Controller = class extends UI.WPBC_BFB_Module {
		init() {
			this._on_key = this.on_key.bind( this );
			document.addEventListener( 'keydown', this._on_key, true );
		}

		destroy() {
			document.removeEventListener( 'keydown', this._on_key, true );
		}

		/** @param {KeyboardEvent} e */
		on_key(e) {
			const b         = this.builder;
			const is_typing = this._is_typing_anywhere();
			if ( e.key === 'Escape' ) {
				if ( is_typing ) {
					return;
				}
				this.builder.bus.emit( Core.WPBC_BFB_Events.CLEAR_SELECTION, { source: 'esc' } );
				return;
			}
			const selected = b.get_selected_field?.();
			if ( !selected || is_typing ) {
				return;
			}
			if ( e.key === 'Delete' || e.key === 'Backspace' ) {
				e.preventDefault();
				b.delete_item?.( selected );
				return;
			}
			if ( (e.altKey || e.ctrlKey || e.metaKey) && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey ) {
				e.preventDefault();
				const dir = (e.key === 'ArrowUp') ? 'up' : 'down';
				b.move_item?.( selected, dir );
				return;
			}
			if ( e.key === 'Enter' ) {
				e.preventDefault();
				b.select_field( selected, { scrollIntoView: true } );
			}
		}

		/** @returns {boolean} */
		_is_typing_anywhere() {
			const a   = document.activeElement;
			const tag = a?.tagName;
			if ( tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (a?.isContentEditable === true) ) {
				return true;
			}
			const ins = document.getElementById( 'wpbc_bfb__inspector' );
			return !!(ins && a && ins.contains( a ));
		}
	};

	/**
	 * Column resize logic for section rows.
	 */
	UI.WPBC_BFB_Resize_Controller = class extends UI.WPBC_BFB_Module {
		init() {
			this.builder.init_resize_handler = this.handle_resize.bind( this );
		}

		/**
		 * read the CSS var (kept local so it doesn’t depend on the Min-Width module)
		 *
		 * @param col
		 * @returns {number|number}
		 * @private
		 */
		_get_col_min_px(col) {
			const v = getComputedStyle( col ).getPropertyValue( '--wpbc-col-min' ) || '0';
			const n = parseFloat( v );
			return Number.isFinite( n ) ? Math.max( 0, n ) : 0;
		}

		/** @param {MouseEvent} e */
		handle_resize(e) {
			const b = this.builder;
			e.preventDefault();
			if ( e.button !== 0 ) return;

			const resizer   = e.currentTarget;
			const row_el    = resizer.parentElement;
			const cols      = Array.from( row_el.querySelectorAll( ':scope > .wpbc_bfb__column' ) );
			const left_col  = resizer?.previousElementSibling;
			const right_col = resizer?.nextElementSibling;
			if ( !left_col || !right_col || !left_col.classList.contains( 'wpbc_bfb__column' ) || !right_col.classList.contains( 'wpbc_bfb__column' ) ) return;

			const left_index  = cols.indexOf( left_col );
			const right_index = cols.indexOf( right_col );
			if ( left_index === -1 || right_index !== left_index + 1 ) return;

			const start_x        = e.clientX;
			const left_start_px  = left_col.getBoundingClientRect().width;
			const right_start_px = right_col.getBoundingClientRect().width;
			const pair_px        = Math.max( 0, left_start_px + right_start_px );

			const gp         = b.col_gap_percent;
			const computed   = b.layout.compute_effective_bases_from_row( row_el, gp );
			const available  = computed.available;                 // % of the “full 100” after gaps
			const bases      = computed.bases.slice( 0 );            // current effective %
			const pair_avail = bases[left_index] + bases[right_index];

			// Bail if we can’t compute sane deltas.
			if (!pair_px || !Number.isFinite(pair_avail) || pair_avail <= 0) return;

			// --- MIN CLAMPS (pixels) -------------------------------------------------
			const pctToPx       = (pct) => (pair_px * (pct / pair_avail)); // pair-local percent -> px
			const genericMinPct = Math.min( 0.1, available );                  // original 0.1% floor (in “available %” space)
			const genericMinPx  = pctToPx( genericMinPct );

			const leftMinPx  = Math.max( this._get_col_min_px( left_col ), genericMinPx );
			const rightMinPx = Math.max( this._get_col_min_px( right_col ), genericMinPx );

			// freeze text selection + cursor
			const prev_user_select         = document.body.style.userSelect;
			document.body.style.userSelect = 'none';
			row_el.style.cursor            = 'col-resize';

			const on_mouse_move = (ev) => {
				if ( !pair_px ) return;

				// work in pixels, clamp by each side’s min
				const delta_px   = ev.clientX - start_x;
				let newLeftPx    = left_start_px + delta_px;
				newLeftPx        = Math.max( leftMinPx, Math.min( pair_px - rightMinPx, newLeftPx ) );
				const newRightPx = pair_px - newLeftPx;

				// translate back to pair-local percentages
				const newLeftPct      = (newLeftPx / pair_px) * pair_avail;
				const newBases        = bases.slice( 0 );
				newBases[left_index]  = newLeftPct;
				newBases[right_index] = pair_avail - newLeftPct;

				b.layout.apply_bases_to_row( row_el, newBases );
			};

			const on_mouse_up = () => {
				document.removeEventListener( 'mousemove', on_mouse_move );
				document.removeEventListener( 'mouseup', on_mouse_up );
				window.removeEventListener( 'mouseup', on_mouse_up );
				document.removeEventListener( 'mouseleave', on_mouse_up );
				document.body.style.userSelect = prev_user_select || '';
				row_el.style.cursor            = '';

				// normalize to the row’s available % again
				const normalized = b.layout.compute_effective_bases_from_row( row_el, gp );
				b.layout.apply_bases_to_row( row_el, normalized.bases );
			};

			document.addEventListener( 'mousemove', on_mouse_move );
			document.addEventListener( 'mouseup', on_mouse_up );
			window.addEventListener( 'mouseup', on_mouse_up );
			document.addEventListener( 'mouseleave', on_mouse_up );
		}

	};

	/**
	 * Page and section creation, rebuilding, and nested Sortable setup.
	 */
	UI.WPBC_BFB_Pages_Sections = class extends UI.WPBC_BFB_Module {
		init() {
			this.builder.add_page                  = (opts) => this.add_page( opts );
			this.builder.add_section               = (container, cols) => this.add_section( container, cols );
			this.builder.rebuild_section           = (section_data, container) => this.rebuild_section( section_data, container );
			this.builder.init_all_nested_sortables = (el) => this.init_all_nested_sortables( el );
			this.builder.init_section_sortable     = (el) => this.init_section_sortable( el );
			this.builder.pages_sections            = this;
		}

		/**
		 * Give every field/section in a cloned subtree a fresh data-uid so
		 * uniqueness checks don't exclude their originals.
		 */
		_retag_uids_in_subtree(root) {
			const b = this.builder;
			if ( !root ) return;
			const nodes = [];
			if ( root.classList?.contains( 'wpbc_bfb__section' ) || root.classList?.contains( 'wpbc_bfb__field' ) ) {
				nodes.push( root );
			}
			nodes.push( ...root.querySelectorAll( '.wpbc_bfb__section, .wpbc_bfb__field' ) );
			nodes.forEach( (el) => {
				const prefix   = el.classList.contains( 'wpbc_bfb__section' ) ? 's' : 'f';
				el.dataset.uid = `${prefix}-${++b._uid_counter}-${Date.now()}-${Math.random().toString( 36 ).slice( 2, 7 )}`;
			} );
		}

		/**
		 * Bump "foo", "foo-2", "foo-3", ...
		 */
		_make_unique(base, taken) {
			const s = Core.WPBC_BFB_Sanitize;
			let v   = String( base || '' );
			if ( !v ) v = 'field';
			const m  = v.match( /-(\d+)$/ );
			let n    = m ? (parseInt( m[1], 10 ) || 1) : 1;
			let stem = m ? v.replace( /-\d+$/, '' ) : v;
			while ( taken.has( v ) ) {
				n = Math.max( 2, n + 1 );
				v = `${stem}-${n}`;
			}
			taken.add( v );
			return v;
		}

		/**
		 * Strict, one-pass de-duplication for a newly-inserted subtree.
		 * - Ensures unique data-id (internal), data-name (fields), data-html_id (public)
		 * - Also updates DOM: <section id>, <input id>, <label for>, and input[name].
		 */
		_dedupe_subtree_strict(root) {
			const b = this.builder;
			const s = Core.WPBC_BFB_Sanitize;
			if ( !root || !b?.pages_container ) return;

			// 1) Build "taken" sets from outside the subtree.
			const takenDataId   = new Set();
			const takenDataName = new Set();
			const takenHtmlId   = new Set();
			const takenDomId    = new Set();

			// All fields/sections outside root
			b.pages_container.querySelectorAll( '.wpbc_bfb__field, .wpbc_bfb__section' ).forEach( el => {
				if ( root.contains( el ) ) return;
				const did  = el.getAttribute( 'data-id' );
				const dnam = el.getAttribute( 'data-name' );
				const hid  = el.getAttribute( 'data-html_id' );
				if ( did ) takenDataId.add( did );
				if ( dnam ) takenDataName.add( dnam );
				if ( hid ) takenHtmlId.add( hid );
			} );

			// All DOM ids outside root (labels, inputs, anything)
			document.querySelectorAll( '[id]' ).forEach( el => {
				if ( root.contains( el ) ) return;
				if ( el.id ) takenDomId.add( el.id );
			} );

			const nodes = [];
			if ( root.classList?.contains( 'wpbc_bfb__section' ) || root.classList?.contains( 'wpbc_bfb__field' ) ) {
				nodes.push( root );
			}
			nodes.push( ...root.querySelectorAll( '.wpbc_bfb__section, .wpbc_bfb__field' ) );

			// 2) Walk the subtree and fix collisions deterministically.
			nodes.forEach( el => {
				const isField   = el.classList.contains( 'wpbc_bfb__field' );
				const isSection = el.classList.contains( 'wpbc_bfb__section' );

				// INTERNAL data-id
				{
					const raw  = el.getAttribute( 'data-id' ) || '';
					const base = s.sanitize_html_id( raw ) || (isSection ? 'section' : 'field');
					const uniq = this._make_unique( base, takenDataId );
					if ( uniq !== raw ) el.setAttribute( 'data-id', uniq );
				}

				// HTML name (fields only)
				if ( isField ) {
					const raw = el.getAttribute( 'data-name' ) || '';
					if ( raw ) {
						const base = s.sanitize_html_name( raw );
						const uniq = this._make_unique( base, takenDataName );
						if ( uniq !== raw ) {
							el.setAttribute( 'data-name', uniq );
							// Update inner control immediately
							const input = el.querySelector( 'input, textarea, select' );
							if ( input ) input.setAttribute( 'name', uniq );
						}
					}
				}

				// Public HTML id (fields + sections)
				{
					const raw = el.getAttribute( 'data-html_id' ) || '';
					if ( raw ) {
						const base          = s.sanitize_html_id( raw );
						// Reserve against BOTH known data-html_id and real DOM ids.
						const combinedTaken = new Set( [ ...takenHtmlId, ...takenDomId ] );
						let candidate       = this._make_unique( base, combinedTaken );
						// Record into the real sets so future checks see the reservation.
						takenHtmlId.add( candidate );
						takenDomId.add( candidate );

						if ( candidate !== raw ) el.setAttribute( 'data-html_id', candidate );

						// Reflect to DOM immediately
						if ( isSection ) {
							el.id = candidate || '';
						} else {
							const input = el.querySelector( 'input, textarea, select' );
							const label = el.querySelector( 'label.wpbc_bfb__field-label' );
							if ( input ) input.id = candidate || '';
							if ( label ) label.htmlFor = candidate || '';
						}
					} else if ( isSection ) {
						// Ensure no stale DOM id if data-html_id was cleared
						el.removeAttribute( 'id' );
					}
				}
			} );
		}

		_make_add_columns_control(page_el, section_container, insert_pos = 'bottom') {

			// Accept insert_pos ('top'|'bottom'), default 'bottom'.

			const tpl = document.getElementById( 'wpbc_bfb__add_columns_template' );
			if ( !tpl ) {
				return null;
			}

			// Clone *contents* (not the id), unhide, and add a page-scoped class.
			const src = (tpl.content && tpl.content.firstElementChild) ? tpl.content.firstElementChild : tpl.firstElementChild;
			if ( !src ) {
				return null;
			}

			const clone = src.cloneNode( true );
			clone.removeAttribute( 'hidden' );
			if ( clone.id ) {
				clone.removeAttribute( 'id' );
			}
			clone.querySelectorAll( '[id]' ).forEach( n => n.removeAttribute( 'id' ) );

			// Mark where this control inserts sections.
			clone.dataset.insert = insert_pos; // 'top' | 'bottom'

			// // Optional UI hint for users (keeps existing markup intact).
			// const hint = clone.querySelector( '.nav-tab-text .selected_value' );
			// if ( hint ) {
			// 	hint.textContent = (insert_pos === 'top') ? ' (add at top)' : ' (add at bottom)';
			// }

			// Click on options - add section with N columns.
			clone.addEventListener( 'click', (e) => {
				const a = e.target.closest( '.ul_dropdown_menu_li_action_add_sections' );
				if ( !a ) {
					return;
				}
				e.preventDefault();

				// Read N either from data-cols or fallback to parsing text like "3 Columns".
				let cols = parseInt( a.dataset.cols || (a.textContent.match( /\b(\d+)\s*Column/i )?.[1] ?? '1'), 10 );
				cols     = Math.max( 1, Math.min( 4, cols ) );

				// NEW: honor the control's insertion position
				this.add_section( section_container, cols, insert_pos );

				// Reflect last choice (unchanged)
				const val = clone.querySelector( '.selected_value' );
				if ( val ) {
					val.textContent = ` (${cols})`;
				}
			} );

			return clone;
		}


		/**
		 * @param {{scroll?: boolean}} [opts = {}]
		 * @returns {HTMLElement}
		 */
		add_page({ scroll = true } = {}) {
			const b       = this.builder;
			const page_el = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__panel wpbc_bfb__panel--preview  wpbc_bfb_form wpbc_container wpbc_form wpbc_container_booking_form' );
			page_el.setAttribute( 'data-page', ++b.page_counter );

			// Keep only the title and the section container placeholders here.
			page_el.innerHTML = `
				<div class="wpbc_bfb__controls"><h3 class="wpbc_bfb__page_number">Page ${b.page_counter}</h3></div>
				<div class="wpbc_bfb__form_preview_section_container wpbc_wizard__border_container"></div>
			  `;

			const delete_btn = Core.WPBC_Form_Builder_Helper.create_element( 'button', 'wpbc_bfb__field-remove-btn', '<i class="menu_icon icon-1x wpbc_icn_close"></i>' );
			delete_btn.type  = 'button';
			delete_btn.title = 'Remove page';
			delete_btn.setAttribute( 'aria-label', 'Remove page' );
			delete_btn.onclick = () => {
				const selected = b.get_selected_field?.();
				let neighbor   = null;
				if ( selected && page_el.contains( selected ) ) {
					neighbor = b.pages_container.querySelector( '.wpbc_bfb__panel--preview:not([data-page="' + page_el.getAttribute( 'data-page' ) + '"]) .wpbc_bfb__field:not(.is-invalid)' );
				}
				page_el.remove();
				b.usage?.update_palette_ui?.();

				// NEW: notify listeners that the overall structure changed due to page removal.
				try {
					const EV        = Core.WPBC_BFB_Events || {};
					const structure = (typeof b.get_structure === 'function') ? b.get_structure() : null;

					// Mirror the core builder helper:
					// this._emit_const( WPBC_BFB_Events.STRUCTURE_CHANGE, { source: 'page-remove', structure: ... } );
					b.bus?.emit?.( EV.STRUCTURE_CHANGE, { source: 'page-remove', structure: structure, page_el: page_el } );
				} catch ( _e ) {}

				b.select_field( neighbor || null );
			};
			page_el.querySelector( 'h3' ).appendChild( delete_btn );

			b.pages_container.appendChild( page_el );
			if ( scroll ) {
				page_el.scrollIntoView( { behavior: 'smooth', block: 'start' } );
			}

			const section_container         = page_el.querySelector( '.wpbc_bfb__form_preview_section_container' );
			const section_count_on_add_page = 2;
			this.init_section_sortable( section_container );
			this.add_section( section_container, section_count_on_add_page );

			// Dropdown control cloned from the hidden template.
			const controls_host_top = page_el.querySelector( '.wpbc_bfb__controls' );
			const ctrl_top          = this._make_add_columns_control( page_el, section_container, 'top' );
			if ( ctrl_top ) {
				controls_host_top.appendChild( ctrl_top );
			}
			// Bottom control bar after the section container.
			const controls_host_bottom = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__controls wpbc_bfb__controls--bottom' );
			section_container.after( controls_host_bottom );
			const ctrl_bottom = this._make_add_columns_control( page_el, section_container, 'bottom' );
			if ( ctrl_bottom ) {
				controls_host_bottom.appendChild( ctrl_bottom );
			}

			return page_el;
		}

		/**
		 * @param {HTMLElement} container
		 * @param {number}      cols
		 * @param {'top'|'bottom'} [insert_pos='bottom']  // NEW
		 */
		add_section(container, cols, insert_pos = 'bottom') {
			const b = this.builder;
			cols    = Math.max( 1, parseInt( cols, 10 ) || 1 );

			const section = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__section' );
			section.setAttribute( 'data-id', `section-${++b.section_counter}-${Date.now()}` );
			section.setAttribute( 'data-uid', `s-${++b._uid_counter}-${Date.now()}-${Math.random().toString( 36 ).slice( 2, 7 )}` );
			section.setAttribute( 'data-type', 'section' );
			section.setAttribute( 'data-label', 'Section' );
			section.setAttribute( 'data-columns', String( cols ) );
			// Do not persist or seed per-column styles by default (opt-in via inspector).

			const row = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__row wpbc__row' );
			for ( let i = 0; i < cols; i++ ) {
				const col           = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__column wpbc__field' );
				col.style.flexBasis = (100 / cols) + '%';
				// No default CSS vars here; real columns remain unaffected until user activates styles.
				b.init_sortable?.( col );
				row.appendChild( col );
				if ( i < cols - 1 ) {
					const resizer = Core.WPBC_Form_Builder_Helper.create_element( 'div', 'wpbc_bfb__column-resizer' );
					resizer.addEventListener( 'mousedown', b.init_resize_handler );
					row.appendChild( resizer );
				}
			}
			section.appendChild( row );
			b.layout.set_equal_bases( row, b.col_gap_percent );
			b.add_overlay_toolbar( section );
			section.setAttribute( 'tabindex', '0' );
			this.init_all_nested_sortables( section );

			// Insertion policy: top | bottom.
			if ( insert_pos === 'top' && container.firstElementChild ) {
				container.insertBefore( section, container.firstElementChild );
			} else {
				container.appendChild( section );
			}
		}

		/**
		 * @param {Object} section_data
		 * @param {HTMLElement} container
		 * @returns {HTMLElement} The rebuilt section element.
		 */
		rebuild_section(section_data, container) {
			const b         = this.builder;
			const cols_data = Array.isArray( section_data?.columns ) ? section_data.columns : [];
			this.add_section( container, cols_data.length || 1 );
			const section = container.lastElementChild;
			if ( !section.dataset.uid ) {
				section.setAttribute( 'data-uid', `s-${++b._uid_counter}-${Date.now()}-${Math.random().toString( 36 ).slice( 2, 7 )}` );
			}
			section.setAttribute( 'data-id', section_data?.id || `section-${++b.section_counter}-${Date.now()}` );
			section.setAttribute( 'data-type', 'section' );
			section.setAttribute( 'data-label', section_data?.label || 'Section' );
			section.setAttribute( 'data-columns', String( (section_data?.columns || []).length || 1 ) );
			// Persisted attributes
			if ( section_data?.html_id ) {
				section.setAttribute( 'data-html_id', String( section_data.html_id ) );
				// give the container a real id so anchors/CSS can target it
				section.id = String( section_data.html_id );
			}

			// NEW: restore persisted per-column styles (raw JSON string).
			if ( section_data?.col_styles != null ) {
				const json = String( section_data.col_styles );
				section.setAttribute( 'data-col_styles', json );
				try {
					section.dataset.col_styles = json;
				} catch ( _e ) {
				}
			}
			// (No render_preview() call here on purpose: sections’ builder DOM uses .wpbc_bfb__row/.wpbc_bfb__column.)


			if ( section_data?.cssclass ) {
				section.setAttribute( 'data-cssclass', String( section_data.cssclass ) );
				// keep core classes, then add custom class(es)
				String( section_data.cssclass ).split( /\s+/ ).filter( Boolean ).forEach( cls => section.classList.add( cls ) );
			}

			const row = section.querySelector( '.wpbc_bfb__row' );
			// Delegate parsing + activation + application to the Column Styles service.
			try {
				const json = section.getAttribute( 'data-col_styles' )
					|| (section.dataset ? (section.dataset.col_styles || '') : '');
				const arr  = UI.WPBC_BFB_Column_Styles.parse_col_styles( json );
				UI.WPBC_BFB_Column_Styles.apply( section, arr );
			} catch ( _e ) {
			}

			cols_data.forEach( (col_data, index) => {
				const columns_only  = row.querySelectorAll( ':scope > .wpbc_bfb__column' );
				const col           = columns_only[index];
				col.style.flexBasis = col_data.width || '100%';
				(col_data.items || []).forEach( (item) => {
					if ( !item || !item.type ) {
						return;
					}
					if ( item.type === 'field' ) {
						const el = b.build_field( item.data );
						if ( el ) {
							col.appendChild( el );
							b.trigger_field_drop_callback( el, 'load' );
						}
						return;
					}
					if ( item.type === 'section' ) {
						this.rebuild_section( item.data, col );
					}
				} );
			} );
			const computed = b.layout.compute_effective_bases_from_row( row, b.col_gap_percent );
			b.layout.apply_bases_to_row( row, computed.bases );
			this.init_all_nested_sortables( section );

			// NEW: retag UIDs first (so uniqueness checks don't exclude originals), then dedupe all keys.
			this._retag_uids_in_subtree( section );
			this._dedupe_subtree_strict( section );
			return section;
		}

		/** @param {HTMLElement} container */
		init_all_nested_sortables(container) {
			const b = this.builder;
			if ( container.classList.contains( 'wpbc_bfb__form_preview_section_container' ) ) {
				this.init_section_sortable( container );
			}
			container.querySelectorAll( '.wpbc_bfb__section' ).forEach( (section) => {
				section.querySelectorAll( '.wpbc_bfb__column' ).forEach( (col) => {
					this.init_section_sortable( col );
				} );
			} );
		}

		/** @param {HTMLElement} container */
		init_section_sortable(container) {
			const b = this.builder;
			if ( !container ) {
				return;
			}
			const is_column    = container.classList.contains( 'wpbc_bfb__column' );
			const is_top_level = container.classList.contains( 'wpbc_bfb__form_preview_section_container' );
			if ( !is_column && !is_top_level ) {
				return;
			}
			b.init_sortable?.( container );
		}
	};

	/**
	 * Serialization and deserialization of pages/sections/fields.
	 */
	UI.WPBC_BFB_Structure_IO = class extends UI.WPBC_BFB_Module {
		init() {
			this.builder.get_structure        = () => this.serialize();
			this.builder.load_saved_structure = (s, opts) => this.deserialize( s, opts );
		}

		/** @returns {Array} */
		serialize() {
			const b = this.builder;
			this._normalize_ids();
			this._normalize_names();
			const pages = [];
			b.pages_container.querySelectorAll( '.wpbc_bfb__panel--preview' ).forEach( (page_el, page_index) => {
				const container = page_el.querySelector( '.wpbc_bfb__form_preview_section_container' );
				const content   = [];
				if ( !container ) {
					pages.push( { page: page_index + 1, content } );
					return;
				}
				container.querySelectorAll( ':scope > *' ).forEach( (child) => {
					if ( child.classList.contains( 'wpbc_bfb__section' ) ) {
						content.push( { type: 'section', data: this.serialize_section( child ) } );
						return;
					}
					if ( child.classList.contains( 'wpbc_bfb__field' ) ) {
						if ( child.classList.contains( 'is-invalid' ) ) {
							return;
						}
						const f_data = Core.WPBC_Form_Builder_Helper.get_all_data_attributes( child );
						// Drop ephemeral/editor-only flags
						[ 'uid', 'fresh', 'autoname', 'was_loaded', 'name_user_touched' ]
							.forEach( k => {
								if ( k in f_data ) delete f_data[k];
							} );
						content.push( { type: 'field', data: f_data } );
					}
				} );
				pages.push( { page: page_index + 1, content } );
			} );
			return pages;
		}

		/**
		 * @param {HTMLElement} section_el
		 * @returns {{id:string,label:string,html_id:string,cssclass:string,col_styles:string,columns:Array}}
		 */
		serialize_section(section_el) {
			const row = section_el.querySelector( ':scope > .wpbc_bfb__row' );

			// NEW: read per-column styles from dataset/attributes (underscore & hyphen)
			var col_styles_raw =
					section_el.getAttribute( 'data-col_styles' ) ||
					(section_el.dataset ? (section_el.dataset.col_styles) : '') ||
					'';

			const base = {
				id        : section_el.dataset.id,
				label     : section_el.dataset.label || '',
				html_id   : section_el.dataset.html_id || '',
				cssclass  : section_el.dataset.cssclass || '',
				col_styles: String( col_styles_raw )        // <-- NEW: keep as raw JSON string
			};

			if ( !row ) {
				return Object.assign( {}, base, { columns: [] } );
			}

			const columns = [];
			row.querySelectorAll( ':scope > .wpbc_bfb__column' ).forEach( function (col) {
				const width = col.style.flexBasis || '100%';
				const items = [];
				Array.prototype.forEach.call( col.children, function (child) {
					if ( child.classList.contains( 'wpbc_bfb__section' ) ) {
						items.push( { type: 'section', data: this.serialize_section( child ) } );
						return;
					}
					if ( child.classList.contains( 'wpbc_bfb__field' ) ) {
						if ( child.classList.contains( 'is-invalid' ) ) {
							return;
						}
						const f_data = Core.WPBC_Form_Builder_Helper.get_all_data_attributes( child );
						[ 'uid', 'fresh', 'autoname', 'was_loaded', 'name_user_touched' ].forEach( function (k) {
							if ( k in f_data ) {
								delete f_data[k];
							}
						} );
						items.push( { type: 'field', data: f_data } );
					}
				}.bind( this ) );
				columns.push( { width: width, items: items } );
			}.bind( this ) );

			// Clamp persisted col_styles to the actual number of columns on Save.
			try {
				const colCount = columns.length;
				const raw      = String( col_styles_raw || '' ).trim();

				if ( raw ) {
					let arr = [];
					try {
						const parsed = JSON.parse( raw );
						arr          = Array.isArray( parsed ) ? parsed : (parsed && Array.isArray( parsed.columns ) ? parsed.columns : []);
					} catch ( _e ) {
						arr = [];
					}

					if ( colCount <= 0 ) {
						base.col_styles = '[]';
					} else {
						if ( arr.length > colCount ) arr.length = colCount;
						while ( arr.length < colCount ) arr.push( {} );
						base.col_styles = JSON.stringify( arr );
					}
				} else {
					base.col_styles = '';
				}
			} catch ( _e ) {
			}

			return Object.assign( {}, base, { columns: columns } );
		}

		/**
		 * @param {Array} structure
		 * @param {{deferIfTyping?: boolean}} [opts = {}]
		 */
		deserialize(structure, { deferIfTyping = true } = {}) {
			const b = this.builder;
			if ( deferIfTyping && this._is_typing_in_inspector() ) {
				clearTimeout( this._defer_timer );
				this._defer_timer = setTimeout( () => {
					this.deserialize( structure, { deferIfTyping: false } );
				}, 150 );
				return;
			}
			b.pages_container.innerHTML = '';
			b.page_counter              = 0;
			(structure || []).forEach( (page_data) => {
				const page_el               = b.pages_sections.add_page( { scroll: false } );
				const section_container     = page_el.querySelector( '.wpbc_bfb__form_preview_section_container' );
				section_container.innerHTML = '';
				b.init_section_sortable?.( section_container );
				(page_data.content || []).forEach( (item) => {
					if ( item.type === 'section' ) {
						// Now returns the element; attributes (incl. col_styles) are applied inside rebuild.
						b.pages_sections.rebuild_section( item.data, section_container );
						return;
					}
					if ( item.type === 'field' ) {
						const el = b.build_field( item.data );
						if ( el ) {
							section_container.appendChild( el );
							b.trigger_field_drop_callback( el, 'load' );
						}
					}
				} );
			} );
			b.usage?.update_palette_ui?.();
			b.bus.emit( Core.WPBC_BFB_Events.STRUCTURE_LOADED, { structure } );
		}

		_normalize_ids() {
			const b = this.builder;
			b.pages_container.querySelectorAll( '.wpbc_bfb__panel--preview .wpbc_bfb__field:not(.is-invalid)' ).forEach( (el) => {
				const data = Core.WPBC_Form_Builder_Helper.get_all_data_attributes( el );
				const want = Core.WPBC_BFB_Sanitize.sanitize_html_id( data.id || '' ) || 'field';
				const uniq = b.id.ensure_unique_field_id( want, el );
				if ( data.id !== uniq ) {
					el.setAttribute( 'data-id', uniq );
					if ( b.preview_mode ) {
						b.render_preview( el );
					}
				}
			} );
		}

		_normalize_names() {
			const b = this.builder;
			b.pages_container.querySelectorAll( '.wpbc_bfb__panel--preview .wpbc_bfb__field:not(.is-invalid)' ).forEach( (el) => {
				const data = Core.WPBC_Form_Builder_Helper.get_all_data_attributes( el );
				const base = Core.WPBC_BFB_Sanitize.sanitize_html_name( (data.name != null) ? data.name : data.id ) || 'field';
				const uniq = b.id.ensure_unique_field_name( base, el );
				if ( data.name !== uniq ) {
					el.setAttribute( 'data-name', uniq );
					if ( b.preview_mode ) {
						b.render_preview( el );
					}
				}
			} );
		}

		/** @returns {boolean} */
		_is_typing_in_inspector() {
			const ins = document.getElementById( 'wpbc_bfb__inspector' );
			return !!(ins && document.activeElement && ins.contains( document.activeElement ));
		}
	};

	/**
	 * Minimal, standalone guard that enforces per-column min widths based on fields' data-min_width.
	 *
	 * @type {UI.WPBC_BFB_Min_Width_Guard}
	 */
	UI.WPBC_BFB_Min_Width_Guard = class extends UI.WPBC_BFB_Module {

		constructor(builder) {
			super( builder );
			this._on_field_add        = this._on_field_add.bind( this );
			this._on_field_remove     = this._on_field_remove.bind( this );
			this._on_structure_loaded = this._on_structure_loaded.bind( this );
			this._on_window_resize    = this._on_window_resize.bind( this );
		}

		init() {
			const EV = Core.WPBC_BFB_Events;
			this.builder?.bus?.on?.( EV.FIELD_ADD, this._on_field_add );
			this.builder?.bus?.on?.( EV.FIELD_REMOVE, this._on_field_remove );
			this.builder?.bus?.on?.( EV.STRUCTURE_LOADED, this._on_structure_loaded );
			// Also refresh when columns are changed / sections duplicated, etc.
			this.builder?.bus?.on?.( EV.STRUCTURE_CHANGE, this._on_structure_loaded );
			window.addEventListener( 'resize', this._on_window_resize, { passive: true } );
			this.refresh_all();
		}

		destroy() {
			const EV = Core.WPBC_BFB_Events;
			this.builder?.bus?.off?.( EV.FIELD_ADD, this._on_field_add );
			this.builder?.bus?.off?.( EV.FIELD_REMOVE, this._on_field_remove );
			this.builder?.bus?.off?.( EV.STRUCTURE_LOADED, this._on_structure_loaded );
			window.removeEventListener( 'resize', this._on_window_resize );
		}

		_on_field_add(e) {
			// safe + simple: moving between columns updates both rows
			this.refresh_all();
			// if you really want to be minimal work here, keep your row-only version.
		}

		_on_field_remove(e) {
			const src_el = e?.detail?.el || null;
			const row    = (src_el && src_el.closest) ? src_el.closest( '.wpbc_bfb__row' ) : null;
			if ( row ) this.refresh_row( row ); else this.refresh_all();
		}

		_on_structure_loaded() {
			this.refresh_all();
		}

		_on_window_resize() {
			this.refresh_all();
		}

		refresh_all() {
			this.builder?.pages_container
				?.querySelectorAll?.( '.wpbc_bfb__row' )
				?.forEach?.( (row) => this.refresh_row( row ) );
		}

		refresh_row(row_el) {
			if ( !row_el ) return;

			const cols = row_el.querySelectorAll( ':scope > .wpbc_bfb__column' );

			// 1) Recalculate each column’s required min px and write it to the CSS var.
			cols.forEach( (col) => this.apply_col_min( col ) );

			// 2) Enforce it at the CSS level right away so layout can’t render narrower.
			cols.forEach( (col) => {
				const px           = parseFloat( getComputedStyle( col ).getPropertyValue( '--wpbc-col-min' ) || '0' ) || 0;
				col.style.minWidth = px > 0 ? Math.round( px ) + 'px' : '';
			} );

			// 3) Normalize current bases so the row respects all mins without overflow.
			try {
				const b   = this.builder;
				const gp  = b.col_gap_percent;
				const eff = b.layout.compute_effective_bases_from_row( row_el, gp );  // { bases, available }
				// Re-fit *current* bases against mins (same algorithm layout chips use).
				const fitted = UI.WPBC_BFB_Layout_Chips._fit_weights_respecting_min( b, row_el, eff.bases );
				if ( Array.isArray( fitted ) ) {
					const changed = fitted.some( (v, i) => Math.abs( v - eff.bases[i] ) > 0.01 );
					if ( changed ) {
						b.layout.apply_bases_to_row( row_el, fitted );
					}
				}
			} catch ( e ) {
				w._wpbc?.dev?.error?.( 'WPBC_BFB_Min_Width_Guard - refresh_row', e );
			}
		}

		apply_col_min(col_el) {
			if ( !col_el ) return;
			let max_px    = 0;
			const colRect = col_el.getBoundingClientRect();
			col_el.querySelectorAll( ':scope > .wpbc_bfb__field' ).forEach( (field) => {
				const raw = field.getAttribute( 'data-min_width' );
				let px    = 0;
				if ( raw ) {
					const s = String( raw ).trim().toLowerCase();
					if ( s.endsWith( '%' ) ) {
						const n = parseFloat( s );
						if ( Number.isFinite( n ) && colRect.width > 0 ) {
							px = (n / 100) * colRect.width;
						} else {
							px = 0;
						}
					} else {
						px = this.parse_len_px( s );
					}
				} else {
					const cs = getComputedStyle( field );
					px       = parseFloat( cs.minWidth || '0' ) || 0;
				}
				if ( px > max_px ) max_px = px;
			} );
			col_el.style.setProperty( '--wpbc-col-min', max_px > 0 ? Math.round( max_px ) + 'px' : '0px' );
		}

		parse_len_px(value) {
			if ( value == null ) return 0;
			const s = String( value ).trim().toLowerCase();
			if ( s === '' ) return 0;
			if ( s.endsWith( 'px' ) ) {
				const n = parseFloat( s );
				return Number.isFinite( n ) ? n : 0;
			}
			if ( s.endsWith( 'rem' ) || s.endsWith( 'em' ) ) {
				const n    = parseFloat( s );
				const base = parseFloat( getComputedStyle( document.documentElement ).fontSize ) || 16;
				return Number.isFinite( n ) ? n * base : 0;
			}
			const n = parseFloat( s );
			return Number.isFinite( n ) ? n : 0;
		}
	};

	/**
	 * WPBC_BFB_Toggle_Normalizer
	 *
	 * Converts plain checkboxes into toggle UI:
	 * <div class="inspector__control wpbc_ui__toggle">
	 *   <input type="checkbox" id="{unique}" data-inspector-key="..." class="inspector__input" role="switch" aria-checked="true|false">
	 *   <label class="wpbc_ui__toggle_icon"  for="{unique}"></label>
	 *   <label class="wpbc_ui__toggle_label" for="{unique}">Label</label>
	 * </div>
	 *
	 * - Skips inputs already inside `.wpbc_ui__toggle`.
	 * - Reuses an existing <label for="..."> text if present; otherwise falls back to nearby labels or attributes.
	 * - Auto-generates a unique id when absent.
	 */
	UI.WPBC_BFB_Toggle_Normalizer = class {

		/**
		 * Upgrade all raw checkboxes in a container to toggles.
		 * @param {HTMLElement} root_el
		 */
		static upgrade_checkboxes_in(root_el) {

			if ( !root_el || !root_el.querySelectorAll ) {
				return;
			}

			var inputs = root_el.querySelectorAll( 'input[type="checkbox"]' );
			if ( !inputs.length ) {
				return;
			}

			Array.prototype.forEach.call( inputs, function (input) {

				// 1) Skip if already inside toggle wrapper.
				if ( input.closest( '.wpbc_ui__toggle' ) ) {
					return;
				}
				// Skip rows / where input checkbox explicitly marked with  attribute 'data-wpbc-ui-no-toggle'.
				if ( input.hasAttribute( 'data-wpbc-ui-no-toggle' ) ) {
					return;
				}

				// 2) Ensure unique id; prefer existing.
				var input_id = input.getAttribute( 'id' );
				if ( !input_id ) {
					var key  = (input.dataset && input.dataset.inspectorKey) ? String( input.dataset.inspectorKey ) : 'opt';
					input_id = UI.WPBC_BFB_Toggle_Normalizer.generate_unique_id( 'wpbc_ins_auto_' + key + '_' );
					input.setAttribute( 'id', input_id );
				}

				// 3) Find best label text.
				var label_text = UI.WPBC_BFB_Toggle_Normalizer.resolve_label_text( root_el, input, input_id );

				// 4) Build the toggle wrapper.
				var wrapper       = document.createElement( 'div' );
				wrapper.className = 'inspector__control wpbc_ui__toggle';

				// Keep original input; just move it into wrapper.
				input.classList.add( 'inspector__input' );
				input.setAttribute( 'role', 'switch' );
				input.setAttribute( 'aria-checked', input.checked ? 'true' : 'false' );

				var icon_label       = document.createElement( 'label' );
				icon_label.className = 'wpbc_ui__toggle_icon';
				icon_label.setAttribute( 'for', input_id );

				var text_label       = document.createElement( 'label' );
				text_label.className = 'wpbc_ui__toggle_label';
				text_label.setAttribute( 'for', input_id );
				text_label.appendChild( document.createTextNode( label_text ) );

				// 5) Insert wrapper into DOM near the input.
				//    Preferred: replace the original labeled row if it matches typical inspector layout.
				var replaced = UI.WPBC_BFB_Toggle_Normalizer.try_replace_known_row( input, wrapper, label_text );

				if ( !replaced ) {
					if ( !input.parentNode ) return; // NEW guard
					// Fallback: just wrap the input in place and append labels.
					input.parentNode.insertBefore( wrapper, input );
					wrapper.appendChild( input );
					wrapper.appendChild( icon_label );
					wrapper.appendChild( text_label );
				}

				// 6) ARIA sync on change.
				input.addEventListener( 'change', function () {
					input.setAttribute( 'aria-checked', input.checked ? 'true' : 'false' );
				} );
			} );
		}

		/**
		 * Generate a unique id with a given prefix.
		 * @param {string} prefix
		 * @returns {string}
		 */
		static generate_unique_id(prefix) {
			var base = String( prefix || 'wpbc_ins_auto_' );
			var uid  = Math.random().toString( 36 ).slice( 2, 8 );
			var id   = base + uid;
			// Minimal collision guard in the current document scope.
			while ( document.getElementById( id ) ) {
				uid = Math.random().toString( 36 ).slice( 2, 8 );
				id  = base + uid;
			}
			return id;
		}

		/**
		 * Resolve the best human label for an input.
		 * Priority:
		 *  1) <label for="{id}">text</label>
		 *  2) nearest sibling/parent .inspector__label text
		 *  3) input.getAttribute('aria-label') || data-label || data-inspector-key || name || 'Option'
		 * @param {HTMLElement} root_el
		 * @param {HTMLInputElement} input
		 * @param {string} input_id
		 * @returns {string}
		 */
		static resolve_label_text(root_el, input, input_id) {
			// for= association
			if ( input_id ) {
				var assoc = root_el.querySelector( 'label[for="' + UI.WPBC_BFB_Toggle_Normalizer.css_escape( input_id ) + '"]' );
				if ( assoc && assoc.textContent ) {
					var txt = assoc.textContent.trim();
					// Remove the old label from DOM; its text will be used by toggle.
					assoc.parentNode && assoc.parentNode.removeChild( assoc );
					if ( txt ) {
						return txt;
					}
				}
			}

			// nearby inspector label
			var near_label = input.closest( '.inspector__row' );
			if ( near_label ) {
				var il = near_label.querySelector( '.inspector__label' );
				if ( il && il.textContent ) {
					var t2 = il.textContent.trim();
					// If this row had the standard label+control, drop the old text label to avoid duplicates.
					il.parentNode && il.parentNode.removeChild( il );
					if ( t2 ) {
						return t2;
					}
				}
			}

			// fallbacks
			var aria = input.getAttribute( 'aria-label' );
			if ( aria ) {
				return aria;
			}
			if ( input.dataset && input.dataset.label ) {
				return String( input.dataset.label );
			}
			if ( input.dataset && input.dataset.inspectorKey ) {
				return String( input.dataset.inspectorKey );
			}
			if ( input.name ) {
				return String( input.name );
			}
			return 'Option';
		}

		/**
		 * Try to replace a known inspector row pattern with a toggle wrapper.
		 * Patterns:
		 *  <div.inspector__row>
		 *    <label.inspector__label>Text</label>
		 *    <div.inspector__control> [input[type=checkbox]] </div>
		 *  </div>
		 *
		 * @param {HTMLInputElement} input
		 * @param {HTMLElement} wrapper
		 * @returns {boolean} replaced
		 */
		static try_replace_known_row(input, wrapper, label_text) {
			var row       = input.closest( '.inspector__row' );
			var ctrl_wrap = input.parentElement;

			if ( row && ctrl_wrap && ctrl_wrap.classList.contains( 'inspector__control' ) ) {
				// Clear control wrap and reinsert toggle structure.
				while ( ctrl_wrap.firstChild ) {
					ctrl_wrap.removeChild( ctrl_wrap.firstChild );
				}
				row.classList.add( 'inspector__row--toggle' );

				ctrl_wrap.classList.add( 'wpbc_ui__toggle' );
				ctrl_wrap.appendChild( input );

				var input_id       = input.getAttribute( 'id' );
				var icon_lbl       = document.createElement( 'label' );
				icon_lbl.className = 'wpbc_ui__toggle_icon';
				icon_lbl.setAttribute( 'for', input_id );

				var text_lbl       = document.createElement( 'label' );
				text_lbl.className = 'wpbc_ui__toggle_label';
				text_lbl.setAttribute( 'for', input_id );
				if ( label_text ) {
					text_lbl.appendChild( document.createTextNode( label_text ) );
				}
				// If the row previously had a .inspector__label (we removed it in resolve_label_text),
				// we intentionally do NOT recreate it; the toggle text label becomes the visible one.
				// The text content is already resolved in resolve_label_text() and set below by caller.

				ctrl_wrap.appendChild( icon_lbl );
				ctrl_wrap.appendChild( text_lbl );
				return true;
			}

			// Not a known pattern; caller will wrap in place.
			return false;
		}

		/**
		 * CSS.escape polyfill for selectors.
		 * @param {string} s
		 * @returns {string}
		 */
		static css_escape(s) {
			s = String( s );
			if ( window.CSS && typeof window.CSS.escape === 'function' ) {
				return window.CSS.escape( s );
			}
			return s.replace( /([^\w-])/g, '\\$1' );
		}
	};

	/**
	 * Apply all UI normalizers/enhancers to a container (post-render).
	 * Keep this file small and add more normalizers later in one place.
	 *
	 * @param {HTMLElement} root
	 */
	UI.apply_post_render = function (root) {
		if ( !root ) {
			return;
		}
		try {
			UI.WPBC_BFB_ValueSlider?.init_on?.( root );
		} catch ( e ) { /* noop */
		}
		try {
			var T = UI.WPBC_BFB_Toggle_Normalizer;
			if ( T && typeof T.upgrade_checkboxes_in === 'function' ) {
				T.upgrade_checkboxes_in( root );
			}
		} catch ( e ) {
			w._wpbc?.dev?.error?.( 'apply_post_render.toggle', e );
		}

		// Accessibility: keep aria-checked in sync for all toggles inside root.
		try {
			root.querySelectorAll( '.wpbc_ui__toggle input[type="checkbox"]' ).forEach( function (cb) {
				if ( cb.__wpbc_aria_hooked ) {
					return;
				}
				cb.__wpbc_aria_hooked = true;
				cb.setAttribute( 'aria-checked', cb.checked ? 'true' : 'false' );
				// Delegate ‘change’ just once per render – native delegation still works fine for your logic.
				cb.addEventListener( 'change', () => {
					cb.setAttribute( 'aria-checked', cb.checked ? 'true' : 'false' );
				}, { passive: true } );
			} );
		} catch ( e ) {
			w._wpbc?.dev?.error?.( 'apply_post_render.aria', e );
		}
	};

	UI.InspectorEnhancers = UI.InspectorEnhancers || (function () {
		var regs = [];

		function register(name, selector, init, destroy) {
			regs.push( { name, selector, init, destroy } );
		}

		function scan(root) {
			if ( !root ) return;
			regs.forEach( function (r) {
				root.querySelectorAll( r.selector ).forEach( function (node) {
					node.__wpbc_eh = node.__wpbc_eh || {};
					if ( node.__wpbc_eh[r.name] ) return;
					try {
						r.init && r.init( node, root );
						node.__wpbc_eh[r.name] = true;
					} catch ( _e ) {
					}
				} );
			} );
		}

		function destroy(root) {
			if ( !root ) return;
			regs.forEach( function (r) {
				root.querySelectorAll( r.selector ).forEach( function (node) {
					try {
						r.destroy && r.destroy( node, root );
					} catch ( _e ) {
					}
					if ( node.__wpbc_eh ) delete node.__wpbc_eh[r.name];
				} );
			} );
		}

		return { register, scan, destroy };
	})();

	UI.WPBC_BFB_ValueSlider = {
		init_on(root) {
			var groups = (root.nodeType === 1 ? [ root ] : []).concat( [].slice.call( root.querySelectorAll?.( '[data-len-group]' ) || [] ) );
			groups.forEach( function (g) {
				if ( !g.matches || !g.matches( '[data-len-group]' ) ) return;
				if ( g.__wpbc_len_wired ) return;

				var number = g.querySelector( '[data-len-value]' );
				var range  = g.querySelector( '[data-len-range]' );
				var unit   = g.querySelector( '[data-len-unit]' );

				if ( !number || !range ) return;

				// Mirror constraints if missing on the range.
				[ 'min', 'max', 'step' ].forEach( function (a) {
					if ( !range.hasAttribute( a ) && number.hasAttribute( a ) ) {
						range.setAttribute( a, number.getAttribute( a ) );
					}
				} );

				function syncRangeFromNumber() {
					if ( range.value !== number.value ) range.value = number.value;
				}

				function syncNumberFromRange() {
					if ( number.value !== range.value ) {
						number.value = range.value;
						// bubble so existing inspector listeners run
						try {
							number.dispatchEvent( new Event( 'input', { bubbles: true } ) );
						} catch ( _e ) {
						}
						try {
							number.dispatchEvent( new Event( 'change', { bubbles: true } ) );
						} catch ( _e ) {
						}
					}
				}

				function onNumber() {
					syncRangeFromNumber();
				}

				function onRange() {
					syncNumberFromRange();
				}

				number.addEventListener( 'input', onNumber );
				number.addEventListener( 'change', onNumber );
				range.addEventListener( 'input', onRange );
				range.addEventListener( 'change', onRange );

				if ( unit ) {
					unit.addEventListener( 'change', function () {
						// We just nudge the number so upstream handlers re-run.
						try {
							number.dispatchEvent( new Event( 'input', { bubbles: true } ) );
						} catch ( _e ) {
						}
					} );
				}

				// Initial sync
				syncRangeFromNumber();

				g.__wpbc_len_wired = {
					destroy() {
						number.removeEventListener( 'input', onNumber );
						number.removeEventListener( 'change', onNumber );
						range.removeEventListener( 'input', onRange );
						range.removeEventListener( 'change', onRange );
					}
				};
			} );
		},
		destroy_on(root) {
			(root.querySelectorAll?.( '[data-len-group]' ) || []).forEach( function (g) {
				try {
					g.__wpbc_len_wired && g.__wpbc_len_wired.destroy && g.__wpbc_len_wired.destroy();
				} catch ( _e ) {
				}
				delete g.__wpbc_len_wired;
			} );
		}
	};

	// Register with the global enhancers hub.
	UI.InspectorEnhancers && UI.InspectorEnhancers.register(
		'value-slider',
		'[data-len-group]',
		function (el, _root) {
			UI.WPBC_BFB_ValueSlider.init_on( el );
		},
		function (el, _root) {
			UI.WPBC_BFB_ValueSlider.destroy_on( el );
		}
	);

	// Single, load-order-safe patch so enhancers auto-run on every bind.
	(function patchInspectorEnhancers() {
		function applyPatch() {
			var Inspector = w.WPBC_BFB_Inspector;
			if ( !Inspector || Inspector.__wpbc_enhancers_patched ) return false;
			Inspector.__wpbc_enhancers_patched = true;
			var orig                           = Inspector.prototype.bind_to_field;
			Inspector.prototype.bind_to_field  = function (el) {
				orig.call( this, el );
				try {
					var ins = this.panel
						|| document.getElementById( 'wpbc_bfb__inspector' )
						|| document.querySelector( '.wpbc_bfb__inspector' );
					UI.InspectorEnhancers && UI.InspectorEnhancers.scan( ins );
				} catch ( _e ) {
				}
			};
			// Initial scan if the DOM is already present.
			try {
				var insEl = document.getElementById( 'wpbc_bfb__inspector' )
					|| document.querySelector( '.wpbc_bfb__inspector' );
				UI.InspectorEnhancers && UI.InspectorEnhancers.scan( insEl );
			} catch ( _e ) {
			}
			return true;
		}

		// Try now; if Inspector isn’t defined yet, patch when it becomes ready.
		if ( !applyPatch() ) {
			document.addEventListener(
				'wpbc_bfb_inspector_ready',
				function () {
					applyPatch();
				},
				{ once: true }
			);
		}
	})();

}( window, document ));
// ---------------------------------------------------------------------------------------------------------------------
// == File  /includes/page-form-builder/_out/core/bfb-inspector.js == Time point: 2025-09-06 14:08
// ---------------------------------------------------------------------------------------------------------------------
(function (w) {
	'use strict';

	// 1) Actions registry.

	/** @type {Record<string, (ctx: InspectorActionContext) => void>} */
	const __INSPECTOR_ACTIONS_MAP__ = Object.create( null );

	// Built-ins.
	__INSPECTOR_ACTIONS_MAP__['deselect'] = ({ builder }) => {
		builder?.select_field?.( null );
	};

	__INSPECTOR_ACTIONS_MAP__['scrollto'] = ({ builder, el }) => {
		if ( !el || !document.body.contains( el ) ) return;
		builder?.select_field?.( el, { scrollIntoView: true } );
		el.classList.add( 'wpbc_bfb__scroll-pulse' );
		setTimeout( () => el.classList.remove( 'wpbc_bfb__scroll-pulse' ), 700 );
	};

	__INSPECTOR_ACTIONS_MAP__['move-up'] = ({ builder, el }) => {
		if ( !el ) return;
		builder?.move_item?.( el, 'up' );
		// Scroll after the DOM has settled.
		requestAnimationFrame(() => __INSPECTOR_ACTIONS_MAP__['scrollto']({ builder, el }));
	};

	__INSPECTOR_ACTIONS_MAP__['move-down'] = ({ builder, el }) => {
		if ( !el ) return;
		builder?.move_item?.( el, 'down' );
		// Scroll after the DOM has settled.
		requestAnimationFrame(() => __INSPECTOR_ACTIONS_MAP__['scrollto']({ builder, el }));
	};

	__INSPECTOR_ACTIONS_MAP__['delete'] = ({ builder, el, confirm = w.confirm }) => {
		if ( !el ) return;
		const is_field = el.classList.contains( 'wpbc_bfb__field' );
		const label    = is_field
			? (el.querySelector( '.wpbc_bfb__field-label' )?.textContent || el.dataset?.id || 'field')
			: (el.dataset?.id || 'section');

		if ( confirm( 'Delete ' + label + '? This cannot be undone.' ) ) {
			// Central command will remove, emit events, and reselect neighbor (which re-binds Inspector).
			builder?.delete_item?.( el );
		}
	};

	__INSPECTOR_ACTIONS_MAP__['duplicate'] = ({ builder, el }) => {
		if ( !el ) return;
		const clone = builder?.duplicate_item?.( el );
		if ( clone ) builder?.select_field?.( clone, { scrollIntoView: true } );
	};

	// Public API.
	w.WPBC_BFB_Inspector_Actions = {
		run(name, ctx) {
			const fn = __INSPECTOR_ACTIONS_MAP__[name];
			if ( typeof fn === 'function' ) fn( ctx );
			else console.warn( 'WPBC. Inspector action not found:', name );
		},
		register(name, handler) {
			if ( !name || typeof handler !== 'function' ) {
				throw new Error( 'register(name, handler): invalid arguments' );
			}
			__INSPECTOR_ACTIONS_MAP__[name] = handler;
		},
		has(name) {
			return typeof __INSPECTOR_ACTIONS_MAP__[name] === 'function';
		}
	};

	// 2) Inspector Factory.

	var UI = (w.WPBC_BFB_Core.UI = w.WPBC_BFB_Core.UI || {});

	// Global Hybrid++ registries (keep public).
	w.wpbc_bfb_inspector_factory_slots      = w.wpbc_bfb_inspector_factory_slots || {};
	w.wpbc_bfb_inspector_factory_value_from = w.wpbc_bfb_inspector_factory_value_from || {};

	// Define Factory only if missing (no early return for the whole bundle).
	// always define/replace Factory
	{

		/**
		 * Utility: create element with attributes and children.
		 *
		 * @param {string} tag
		 * @param {Object=} attrs
		 * @param {(Node|string|Array<Node|string>)=} children
		 * @returns {HTMLElement}
		 */
		function el(tag, attrs, children) {
			var node = document.createElement( tag );
			if ( attrs ) {
				Object.keys( attrs ).forEach( function (k) {
					var v = attrs[k];
					if ( v == null ) return;
					if ( k === 'class' ) {
						node.className = v;
						return;
					}
					if ( k === 'dataset' ) {
						Object.keys( v ).forEach( function (dk) {
							node.dataset[dk] = String( v[dk] );
						} );
						return;
					}
					if ( k === 'checked' && typeof v === 'boolean' ) {
						if ( v ) node.setAttribute( 'checked', 'checked' );
						return;
					}
					if ( k === 'disabled' && typeof v === 'boolean' ) {
						if ( v ) node.setAttribute( 'disabled', 'disabled' );
						return;
					}
					// normalize boolean attributes to strings.
					if ( typeof v === 'boolean' ) {
						node.setAttribute( k, v ? 'true' : 'false' );
						return;
					}
					node.setAttribute( k, String( v ) );
				} );
			}
			if ( children ) {
				(Array.isArray( children ) ? children : [ children ]).forEach( function (c) {
					if ( c == null ) return;
					node.appendChild( (typeof c === 'string') ? document.createTextNode( c ) : c );
				} );
			}
			return node;
		}

		/**
		 * Build a toggle control row (checkbox rendered as toggle).
		 *
		 * Structure:
		 * <div class="inspector__row inspector__row--toggle">
		 *   <div class="inspector__control wpbc_ui__toggle">
		 *     <input type="checkbox" id="ID" data-inspector-key="KEY" class="inspector__input" checked>
		 *     <label class="wpbc_ui__toggle_icon"  for="ID"></label>
		 *     <label class="wpbc_ui__toggle_label" for="ID">Label text</label>
		 *   </div>
		 * </div>
		 *
		 * @param {string} input_id
		 * @param {string} key
		 * @param {boolean} checked
		 * @param {string} label_text
		 * @returns {HTMLElement}
		 */
		function build_toggle_row( input_id, key, checked, label_text ) {

			var row_el    = el( 'div', { 'class': 'inspector__row inspector__row--toggle' } );
			var ctrl_wrap = el( 'div', { 'class': 'inspector__control wpbc_ui__toggle' } );

			var input_el = el( 'input', {
				id                  : input_id,
				type                : 'checkbox',
				'data-inspector-key': key,
				'class'             : 'inspector__input',
				checked             : !!checked,
				role                : 'switch',
				'aria-checked'      : !!checked
			} );
			var icon_lbl = el( 'label', { 'class': 'wpbc_ui__toggle_icon', 'for': input_id } );
			var text_lbl = el( 'label', { 'class': 'wpbc_ui__toggle_label', 'for': input_id }, label_text || '' );

			ctrl_wrap.appendChild( input_el );
			ctrl_wrap.appendChild( icon_lbl );
			ctrl_wrap.appendChild( text_lbl );

			row_el.appendChild( ctrl_wrap );
			return row_el;
		}

		/**
	 * Utility: choose initial value from data or schema default.
	 */
		function get_initial_value(key, data, props_schema) {
			if ( data && Object.prototype.hasOwnProperty.call( data, key ) ) return data[key];
			var meta = props_schema && props_schema[key];
			return (meta && Object.prototype.hasOwnProperty.call( meta, 'default' )) ? meta.default : '';
		}

		/**
	 * Utility: coerce value by schema type.
	 */


		function coerce_by_type(value, type) {
			switch ( type ) {
				case 'number':
				case 'int':
				case 'float':
					if ( value === '' || value == null ) {
						return '';
					}
					var n = Number( value );
					return isNaN( n ) ? '' : n;
				case 'boolean':
					return !!value;
				case 'array':
					return Array.isArray( value ) ? value : [];
				default:
					return (value == null) ? '' : String( value );
			}
		}

		/**
	 * Normalize <select> options (array of {value,label} or map {value:label}).
	 */
		function normalize_select_options(options) {
			if ( Array.isArray( options ) ) {
				return options.map( function (o) {
					if ( typeof o === 'object' && o && 'value' in o ) {
						return { value: String( o.value ), label: String( o.label || o.value ) };
					}
					return { value: String( o ), label: String( o ) };
				} );
			}
			if ( options && typeof options === 'object' ) {
				return Object.keys( options ).map( function (k) {
					return { value: String( k ), label: String( options[k] ) };
				} );
			}
			return [];
		}

		/** Parse a CSS length like "120px" or "80%" into { value:number, unit:string }. */
		function parse_len(value, fallback_unit) {
			value = (value == null) ? '' : String( value ).trim();
			var m = value.match( /^(-?\d+(?:\.\d+)?)(px|%|rem|em)$/i );
			if ( m ) {
				return { value: parseFloat( m[1] ), unit: m[2].toLowerCase() };
			}
			// plain number -> assume fallback unit
			if ( value !== '' && !isNaN( Number( value ) ) ) {
				return { value: Number( value ), unit: (fallback_unit || 'px') };
			}
			return { value: 0, unit: (fallback_unit || 'px') };
		}

		/** Clamp helper. */
		function clamp_num(v, min, max) {
			if ( typeof v !== 'number' || isNaN( v ) ) return (min != null ? min : 0);
			if ( min != null && v < min ) v = min;
			if ( max != null && v > max ) v = max;
			return v;
		}

		// Initialize Coloris pickers in a given root.
		// Relies on Coloris being enqueued (see bfb-bootstrap.php).
		function init_coloris_pickers(root) {
			if ( !root || !w.Coloris ) return;
			// Mark inputs we want Coloris to handle.
			var inputs = root.querySelectorAll( 'input[data-inspector-type="color"]' );
			if ( !inputs.length ) return;

			// Add a stable class for Coloris targeting; avoid double-initializing.
			inputs.forEach( function (input) {
				if ( input.classList.contains( 'wpbc_bfb_coloris' ) ) return;
				input.classList.add( 'wpbc_bfb_coloris' );
			} );

			// Create/refresh a Coloris instance bound to these inputs.
			// Keep HEX output to match schema defaults (e.g., "#e0e0e0").
			try {
				w.Coloris( {
					el       : '.wpbc_bfb_coloris',
					alpha    : false,
					format   : 'hex',
					themeMode: 'auto'
				} );
				// Coloris already dispatches 'input' events on value changes.
			} catch ( e ) {
				// Non-fatal: if Coloris throws (rare), the text input still works.
				console.warn( 'WPBC Inspector: Coloris init failed:', e );
			}
		}

		/**
		 * Build: slider + number in one row (writes to a single data key).
		 * Control meta: { type:'range_number', key, label, min, max, step }
		 */
		function build_range_number_row(input_id, key, label_text, value, meta) {
			var row_el   = el('div', { 'class': 'inspector__row' });
			var label_el = el('label', { 'for': input_id, 'class': 'inspector__label' }, label_text || key || '');
			var ctrl     = el('div', { 'class': 'inspector__control' });

			var min  = (meta && meta.min != null)  ? meta.min  : 0;
			var max  = (meta && meta.max != null)  ? meta.max  : 100;
			var step = (meta && meta.step != null) ? meta.step : 1;

			var group = el('div', { 'class': 'wpbc_len_group wpbc_inline_inputs', 'data-len-group': key });

			var range = el('input', {
				type : 'range',
				'class': 'inspector__input',
				'data-len-range': '',
				min  : String(min),
				max  : String(max),
				step : String(step),
				value: String(value == null || value === '' ? min : value)
			});

			var num = el('input', {
				id   : input_id,
				type : 'number',
				'class': 'inspector__input inspector__w_30',
				'data-len-value': '',
				'data-inspector-key': key,
				min  : String(min),
				max  : String(max),
				step : String(step),
				value: (value == null || value === '') ? String(min) : String(value)
			});

			group.appendChild(range);
			group.appendChild(num);
			ctrl.appendChild(group);
			row_el.appendChild(label_el);
			row_el.appendChild(ctrl);
			return row_el;
		}

		/**
		 * Build: (number + unit) + slider, writing a *single* combined string to `key`.
		 * Control meta:
		 * {
		 *   type:'len', key, label, units:['px','%','rem','em'],
		 *   slider: { px:{min:0,max:512,step:1}, '%':{min:0,max:100,step:1}, rem:{min:0,max:10,step:0.1}, em:{...} },
		 *   fallback_unit:'px'
		 * }
		 */
		function build_len_compound_row(control, props_schema, data, uid) {
			var key        = control.key;
			var label_text = control.label || key || '';
			var def_str    = get_initial_value( key, data, props_schema );
			var fallback_u = control.fallback_unit || 'px';
			var parsed     = parse_len( def_str, fallback_u );

			var row   = el( 'div', { 'class': 'inspector__row' } );
			var label = el( 'label', { 'class': 'inspector__label' }, label_text );
			var ctrl  = el( 'div', { 'class': 'inspector__control' } );

			var units      = Array.isArray( control.units ) && control.units.length ? control.units : [ 'px', '%', 'rem', 'em' ];
			var slider_map = control.slider || {
				'px' : { min: 0, max: 512, step: 1 },
				'%'  : { min: 0, max: 100, step: 1 },
				'rem': { min: 0, max: 10, step: 0.1 },
				'em' : { min: 0, max: 10, step: 0.1 }
			};

			// Host with a hidden input that carries data-inspector-key to reuse the standard handler.
			var group = el( 'div', { 'class': 'wpbc_len_group', 'data-len-group': key } );

			var inline = el( 'div', { 'class': 'wpbc_inline_inputs' } );

			var num = el( 'input', {
				type            : 'number',
				'class'         : 'inspector__input',
				'data-len-value': '',
				min             : '0',
				step            : 'any',
				value           : String( parsed.value )
			} );

			var sel = el( 'select', { 'class': 'inspector__input', 'data-len-unit': '' } );
			units.forEach( function (u) {
				var opt = el( 'option', { value: u }, u );
				if ( u === parsed.unit ) opt.setAttribute( 'selected', 'selected' );
				sel.appendChild( opt );
			} );

			inline.appendChild( num );
			inline.appendChild( sel );

			// Slider (unit-aware)
			var current = slider_map[parsed.unit] || slider_map[units[0]];
			var range   = el( 'input', {
				type            : 'range',
				'class'         : 'inspector__input',
				'data-len-range': '',
				min             : String( current.min ),
				max             : String( current.max ),
				step            : String( current.step ),
				value           : String( clamp_num( parsed.value, current.min, current.max ) )
			} );

			// Hidden writer input that the default Inspector handler will catch.
			var hidden = el( 'input', {
				type                : 'text',
				'class'             : 'inspector__input',
				style               : 'display:none',
				'aria-hidden'       : 'true',
				tabindex            : '-1',
				id                  : 'wpbc_ins_' + key + '_' + uid + '_len_hidden',
				'data-inspector-key': key,
				value               : (String( parsed.value ) + parsed.unit)
			} );

			group.appendChild( inline );
			group.appendChild( range );
			group.appendChild( hidden );

			ctrl.appendChild( group );
			row.appendChild( label );
			row.appendChild( ctrl );
			return row;
		}

		/**
		 * Wire syncing for any .wpbc_len_group inside a given root (panel).
		 * - range ⇄ number sync
		 * - unit switches update slider bounds
		 * - hidden writer (if present) gets updated and emits 'input'
		 */
		function wire_len_group(root) {
			if ( !root ) return;

			function find_group(el) {
				return el && el.closest && el.closest( '.wpbc_len_group' );
			}

			root.addEventListener( 'input', function (e) {
				var t = e.target;
				// Slider moved -> update number (and writer/hidden)
				if ( t && t.hasAttribute( 'data-len-range' ) ) {
					var g = find_group( t );
					if ( !g ) return;
					var num = g.querySelector( '[data-len-value]' );
					if ( num ) {
						num.value = t.value;
					}
					var writer = g.querySelector( '[data-inspector-key]' );
					if ( writer && writer.type === 'text' ) {
						var unit     = g.querySelector( '[data-len-unit]' );
						unit         = unit ? unit.value : 'px';
						writer.value = String( t.value ) + String( unit );
						// trigger standard inspector handler:
						writer.dispatchEvent( new Event( 'input', { bubbles: true } ) );
					} else {
						// Plain range_number case (number has data-inspector-key) -> fire input on number
						if ( num && num.hasAttribute( 'data-inspector-key' ) ) {
							num.dispatchEvent( new Event( 'input', { bubbles: true } ) );
						}
					}
				}

				// Number typed -> update slider and writer/hidden
				if ( t && t.hasAttribute( 'data-len-value' ) ) {
					var g = find_group( t );
					if ( !g ) return;
					var r = g.querySelector( '[data-len-range]' );
					if ( r ) {
						// clamp within slider bounds if present
						var min = Number( r.min );
						var max = Number( r.max );
						var v   = Number( t.value );
						if ( !isNaN( v ) ) {
							v       = clamp_num( v, isNaN( min ) ? undefined : min, isNaN( max ) ? undefined : max );
							r.value = String( v );
							if ( String( v ) !== t.value ) t.value = String( v );
						}
					}
					var writer = g.querySelector( '[data-inspector-key]' );
					if ( writer && writer.type === 'text' ) {
						var unit     = g.querySelector( '[data-len-unit]' );
						unit         = unit ? unit.value : 'px';
						writer.value = String( t.value || 0 ) + String( unit );
						writer.dispatchEvent( new Event( 'input', { bubbles: true } ) );
					}
					// else: number itself likely carries data-inspector-key (range_number); default handler will run.
				}
			}, true );

			root.addEventListener( 'change', function (e) {
				var t = e.target;
				// Unit changed -> update slider limits and writer/hidden
				if ( t && t.hasAttribute( 'data-len-unit' ) ) {
					var g = find_group( t );
					if ( !g ) return;

					// Find the control meta via a data attribute on group if provided
					// (Factory path sets nothing here; we re-derive from current slider bounds.)
					var r      = g.querySelector( '[data-len-range]' );
					var num    = g.querySelector( '[data-len-value]' );
					var writer = g.querySelector( '[data-inspector-key]' );
					var unit   = t.value || 'px';

					// Adjust slider bounds heuristically (match Factory defaults)
					var bounds_by_unit = {
						'px' : { min: 0, max: 512, step: 1 },
						'%'  : { min: 0, max: 100, step: 1 },
						'rem': { min: 0, max: 10, step: 0.1 },
						'em' : { min: 0, max: 10, step: 0.1 }
					};
					if ( r ) {
						var b  = bounds_by_unit[unit] || bounds_by_unit['px'];
						r.min  = String( b.min );
						r.max  = String( b.max );
						r.step = String( b.step );
						// clamp to new bounds
						var v  = Number( num && num.value ? num.value : r.value );
						if ( !isNaN( v ) ) {
							v       = clamp_num( v, b.min, b.max );
							r.value = String( v );
							if ( num ) num.value = String( v );
						}
					}
					if ( writer && writer.type === 'text' ) {
						var v        = num && num.value ? num.value : (r ? r.value : '0');
						writer.value = String( v ) + String( unit );
						writer.dispatchEvent( new Event( 'input', { bubbles: true } ) );
					}
				}
			}, true );
		}

		// =============================================================================================================
		// ==  C O N T R O L  ==
		// =============================================================================================================

		/**
	 * Schema > Inspector > Control Element, e.g. Input!  Build a single control row:
	 * <div class="inspector__row">
	 *   <label class="inspector__label" for="...">Label</label>
	 *   <div class="inspector__control"><input|textarea|select class="inspector__input" ...></div>
	 * </div>
	 *
	 * @param {Object} control           - schema control meta ({type,key,label,...})
	 * @param {Object} props_schema      - schema.props
	 * @param {Object} data              - current element data-* map
	 * @param {string} uid               - unique suffix for input ids
	 * @param {Object} ctx               - { el, builder, type, data }
	 * @returns {HTMLElement}
	 */
		function build_control(control, props_schema, data, uid, ctx) {
			var type = control.type;
			var key  = control.key;

			var label_text = control.label || key || '';
			var prop_meta  = (key ? (props_schema[key] || { type: 'string' }) : { type: 'string' });
			var value      = coerce_by_type( get_initial_value( key, data, props_schema ), prop_meta.type );
		// Allow value_from override (computed at render-time).
		if ( control && control.value_from && w.wpbc_bfb_inspector_factory_value_from[control.value_from] ) {
				try {
					var computed = w.wpbc_bfb_inspector_factory_value_from[control.value_from]( ctx || {} );
					value        = coerce_by_type( computed, prop_meta.type );
				} catch ( e ) {
					console.warn( 'value_from failed for', control.value_from, e );
				}
			}

			var input_id = 'wpbc_ins_' + key + '_' + uid;

			var row_el    = el( 'div', { 'class': 'inspector__row' } );
			var label_el  = el( 'label', { 'for': input_id, 'class': 'inspector__label' }, label_text );
			var ctrl_wrap = el( 'div', { 'class': 'inspector__control' } );

			var field_el;

		// --- slot host (named UI injection) -----------------------------------
		if ( type === 'slot' && control.slot ) {
			// add a marker class for the layout chips row
			var classes = 'inspector__row inspector__row--slot';
			if ( control.slot === 'layout_chips' ) classes += ' inspector__row--layout-chips';

			var slot_row = el( 'div', { 'class': classes } );

			if ( label_text ) slot_row.appendChild( el( 'label', { 'class': 'inspector__label' }, label_text ) );

			// add a data attribute on the host so both CSS and the safety-net can target it
			var host_attrs = { 'class': 'inspector__control' };
			if ( control.slot === 'layout_chips' ) host_attrs['data-bfb-slot'] = 'layout_chips';

			var slot_host = el( 'div', host_attrs );
			slot_row.appendChild( slot_host );

			var slot_fn = w.wpbc_bfb_inspector_factory_slots[control.slot];
			if ( typeof slot_fn === 'function' ) {
				setTimeout( function () {
					try {
						slot_fn( slot_host, ctx || {} );
					} catch ( e ) {
						console.warn( 'slot "' + control.slot + '" failed:', e );
					}
				}, 0 );
			} else {
				slot_host.appendChild( el( 'div', { 'class': 'wpbc_bfb__slot__missing' }, '[slot: ' + control.slot + ']' ) );
			}
			return slot_row;
		}


			if ( type === 'textarea' ) {
				field_el = el( 'textarea', {
					id                  : input_id,
					'data-inspector-key': key,
					rows                : control.rows || 3,
					'class'             : 'inspector__input'
				}, (value == null ? '' : String( value )) );
			} else if ( type === 'select' ) {
				field_el = el( 'select', {
					id                  : input_id,
					'data-inspector-key': key,
					'class'             : 'inspector__input'
				} );
				normalize_select_options( control.options || [] ).forEach( function (opt) {
					var opt_el = el( 'option', { value: opt.value }, opt.label );
					if ( String( value ) === opt.value ) opt_el.setAttribute( 'selected', 'selected' );
					field_el.appendChild( opt_el );
				} );
			} else if ( type === 'checkbox' ) {
				// field_el = el( 'input', { id: input_id, type: 'checkbox', 'data-inspector-key': key, checked: !!value, 'class': 'inspector__input' } ); //.

				// Render as toggle UI instead of label-left + checkbox.  Note: we return the full toggle row here and skip the default row/label flow below.
				return build_toggle_row( input_id, key, !!value, label_text );

			} else if ( type === 'range_number' ) {
				// --- new: slider + number (single key).
				var rn_id  = 'wpbc_ins_' + key + '_' + uid;
				var rn_val = value; // from get_initial_value/prop_meta already.
				return build_range_number_row( rn_id, key, label_text, rn_val, control );

			} else if ( type === 'len' ) {
				// --- new: length compound (value+unit+slider -> writes a single string key).
				return build_len_compound_row( control, props_schema, data, uid );

			} else if ( type === 'color' ) {
				// Color picker (Coloris). Store as string (e.g., "#e0e0e0").
				field_el = el( 'input', {
					id                   : input_id,
					type                 : 'text',
					'data-inspector-key' : key,
					'data-inspector-type': 'color',
					'data-coloris'       : '',
					'class'              : 'inspector__input',
					'data-default-color' : ( value != null && value !== '' ? String(value) : (control.placeholder || '') )
				} );
				if ( value !== '' ) {
					field_el.value = String( value );
				}
			} else {
				// text/number default.
				var attrs = {
					id                  : input_id,
					type                : (type === 'number') ? 'number' : 'text',
					'data-inspector-key': key,
					'class'             : 'inspector__input'
				};
			// number constraints (schema or control)
				if ( type === 'number' ) {
					if ( Object.prototype.hasOwnProperty.call( prop_meta, 'min' ) ) attrs.min = prop_meta.min;
					if ( Object.prototype.hasOwnProperty.call( prop_meta, 'max' ) ) attrs.max = prop_meta.max;
					if ( Object.prototype.hasOwnProperty.call( prop_meta, 'step' ) ) attrs.step = prop_meta.step;
					if ( Object.prototype.hasOwnProperty.call( control, 'min' ) ) attrs.min = control.min;
					if ( Object.prototype.hasOwnProperty.call( control, 'max' ) ) attrs.max = control.max;
					if ( Object.prototype.hasOwnProperty.call( control, 'step' ) ) attrs.step = control.step;
				}
				field_el = el( 'input', attrs );
				if ( value !== '' ) field_el.value = String( value );
			}

			ctrl_wrap.appendChild( field_el );
			row_el.appendChild( label_el );
			row_el.appendChild( ctrl_wrap );
			return row_el;
		}

		/**
		 * Schema > Inspector > Groups! Build an inspector group (collapsible).
		 * Structure:
		 * <section class="wpbc_bfb__inspector__group wpbc_ui__collapsible_group is-open" data-group="...">
		 *   <button type="button" class="group__header" role="button" aria-expanded="true" aria-controls="wpbc_collapsible_panel_X">
		 *     <h3>Group Title</h3>
		 *     <i class="wpbc_ui_el__vert_menu_root_section_icon menu_icon icon-1x wpbc-bi-chevron-right"></i>
		 *   </button>
		 *   <div class="group__fields" id="wpbc_collapsible_panel_X" aria-hidden="false"> …rows… </div>
		 * </section>
		 *
		 * @param {Object} group
		 * @param {Object} props_schema
		 * @param {Object} data
		 * @param {string} uid
		 * @param {Object} ctx
		 * @returns {HTMLElement}
		 */
		function build_group(group, props_schema, data, uid, ctx) {
			var is_open  = !!group.open;
			var panel_id = 'wpbc_collapsible_panel_' + uid + '_' + (group.key || 'g');

			var section = el( 'section', {
				'class'     : 'wpbc_bfb__inspector__group wpbc_ui__collapsible_group' + (is_open ? ' is-open' : ''),
				'data-group': group.key || ''
			} );

			var header_btn = el( 'button', {
				type           : 'button',
				'class'        : 'group__header',
				role           : 'button',
				'aria-expanded': is_open ? 'true' : 'false',
				'aria-controls': panel_id
			}, [
				el( 'h3', null, group.title || group.label || group.key || '' ),
				el( 'i', { 'class': 'wpbc_ui_el__vert_menu_root_section_icon menu_icon icon-1x wpbc-bi-chevron-right' } )
			] );

			var fields = el( 'div', {
				'class'      : 'group__fields',
				id           : panel_id,
				'aria-hidden': is_open ? 'false' : 'true'
			} );

			function asArray(x) {
				if ( Array.isArray( x ) ) return x;
				if ( x && typeof x === 'object' ) return Object.values( x );
				return x != null ? [ x ] : [];
			}

			asArray( group.controls ).forEach( function (control) {
				fields.appendChild( build_control( control, props_schema, data, uid, ctx ) );
			} );

			section.appendChild( header_btn );
			section.appendChild( fields );
			return section;
		}

		/**
		 * Schema > Inspector > Header! Build inspector header with action buttons wired to existing data-action handlers.
		 *
		 * @param {Array<string>} header_actions
		 * @param {string}        title_text
		 * @returns {HTMLElement}
		 */
		function build_header(inspector_ui, title_fallback, schema_for_type) {

			inspector_ui      = inspector_ui || {};
			schema_for_type   = schema_for_type || {};
			var variant       = inspector_ui.header_variant || 'minimal';
			var headerActions = inspector_ui.header_actions
				|| schema_for_type.header_actions
				|| [ 'deselect', 'scrollto', 'move-up', 'move-down', 'duplicate', 'delete' ];

			var title       = inspector_ui.title || title_fallback || '';
			var description = inspector_ui.description || '';

			// helper to create a button for either header style
			function actionBtn(act, minimal) {
				if ( minimal ) {
					return el( 'button', { type: 'button', 'class': 'button-link', 'data-action': act }, '' );
				}
				// toolbar variant (rich)
				var iconMap = {
					'deselect' : 'wpbc_icn_remove_done',
					'scrollto' : 'wpbc_icn_ads_click filter_center_focus',
					'move-up'  : 'wpbc_icn_arrow_upward',
					'move-down': 'wpbc_icn_arrow_downward',
					'duplicate': 'wpbc_icn_content_copy',
					'delete'   : 'wpbc_icn_delete_outline'
				};
				var classes = 'button button-secondary wpbc_ui_control wpbc_ui_button';
				if ( act === 'delete' ) classes += ' wpbc_ui_button_danger button-link-delete';

				var btn = el( 'button', {
					type         : 'button',
					'class'      : classes,
					'data-action': act,
					'aria-label' : act.replace( /-/g, ' ' )
				} );

				if ( act === 'delete' ) {
					btn.appendChild( el( 'span', { 'class': 'in-button-text' }, 'Delete' ) );
					btn.appendChild( document.createTextNode( ' ' ) ); // minor spacing before icon
				}
				btn.appendChild( el( 'i', { 'class': 'menu_icon icon-1x ' + (iconMap[act] || '') } ) );
				return btn;
			}

			// === minimal header (existing look; default) ===
			if ( variant !== 'toolbar' ) {
				var header = el( 'header', { 'class': 'wpbc_bfb__inspector__header' } );
				header.appendChild( el( 'h3', null, title || '' ) );

				var actions = el( 'div', { 'class': 'wpbc_bfb__inspector__header_actions' } );
				headerActions.forEach( function (act) {
					actions.appendChild( actionBtn( act, /*minimal*/true ) );
				} );
				header.appendChild( actions );
				return header;
			}

			// === toolbar header (rich title/desc + grouped buttons) ===
			var root = el( 'div', { 'class': 'wpbc_bfb__inspector__head' } );
			var wrap = el( 'div', { 'class': 'header_container' } );
			var left = el( 'div', { 'class': 'header_title_content' } );
			var h3   = el( 'h3', { 'class': 'title' }, title || '' );
			left.appendChild( h3 );
			if ( description ) {
				left.appendChild( el( 'div', { 'class': 'desc' }, description ) );
			}

			var right = el( 'div', { 'class': 'actions wpbc_ajx_toolbar wpbc_no_borders' } );
			var uiC   = el( 'div', { 'class': 'ui_container ui_container_small' } );
			var uiG   = el( 'div', { 'class': 'ui_group' } );

			// Split into visual groups: first 2, next 2, then the rest.
			var g1 = el( 'div', { 'class': 'ui_element' } );
			var g2 = el( 'div', { 'class': 'ui_element' } );
			var g3 = el( 'div', { 'class': 'ui_element' } );

			headerActions.slice( 0, 2 ).forEach( function (act) {
				g1.appendChild( actionBtn( act, false ) );
			} );
			headerActions.slice( 2, 4 ).forEach( function (act) {
				g2.appendChild( actionBtn( act, false ) );
			} );
			headerActions.slice( 4 ).forEach( function (act) {
				g3.appendChild( actionBtn( act, false ) );
			} );

			uiG.appendChild( g1 );
			uiG.appendChild( g2 );
			uiG.appendChild( g3 );
			uiC.appendChild( uiG );
			right.appendChild( uiC );

			wrap.appendChild( left );
			wrap.appendChild( right );
			root.appendChild( wrap );

			return root;
		}


		function factory_render(panel_el, schema_for_type, data, opts) {
			if ( !panel_el ) return panel_el;

			schema_for_type  = schema_for_type || {};
			var props_schema = (schema_for_type.schema && schema_for_type.schema.props) ? schema_for_type.schema.props : {};
			var inspector_ui = (schema_for_type.inspector_ui || {});
			var groups       = inspector_ui.groups || [];

			var header_actions = inspector_ui.header_actions || schema_for_type.header_actions || [];
			var title_text     = (opts && opts.title) || inspector_ui.title || schema_for_type.label || (data && data.label) || '';

		// Prepare rendering context for slots/value_from, etc.
			var ctx = {
				el     : opts && opts.el || null,
				builder: opts && opts.builder || null,
				type   : opts && opts.type || null,
				data   : data || {}
			};

			// clear panel.
			while ( panel_el.firstChild ) panel_el.removeChild( panel_el.firstChild );

			var uid = Math.random().toString( 36 ).slice( 2, 8 );

			// header.
			panel_el.appendChild( build_header( inspector_ui, title_text, schema_for_type ) );


			// groups.
			groups.forEach( function (g) {
				panel_el.appendChild( build_group( g, props_schema, data || {}, uid, ctx ) );
			} );

			// ARIA sync for toggles created here (ensure aria-checked matches state).
			try {
				// Centralized UI normalizers (toggles + A11y): handled in Core.
				UI.apply_post_render( panel_el );
				try {
					wire_len_group( panel_el );
					// Initialize Coloris on color inputs rendered in this panel.
					init_coloris_pickers( panel_el );
				} catch ( _ ) { }
			} catch ( _ ) { }

			return panel_el;
		}

		UI.WPBC_BFB_Inspector_Factory = { render: factory_render };   // overwrite/refresh

		// ---- Built-in slot + value_from for Sections ----

		function slot_layout_chips(host, ctx) {
			try {
				var L = w.WPBC_BFB_Core &&  w.WPBC_BFB_Core.UI && w.WPBC_BFB_Core.UI.WPBC_BFB_Layout_Chips;
				if ( L && typeof L.render_for_section === 'function' ) {
					L.render_for_section( ctx.builder, ctx.el, host );
				} else {
					host.appendChild( document.createTextNode( '[layout_chips not available]' ) );
				}
			} catch ( e ) {
				console.warn( 'wpbc_bfb_slot_layout_chips failed:', e );
			}
		}

		w.wpbc_bfb_inspector_factory_slots.layout_chips = slot_layout_chips;

		function value_from_compute_section_columns(ctx) {
			try {
				var row = ctx && ctx.el && ctx.el.querySelector && ctx.el.querySelector( ':scope > .wpbc_bfb__row' );
				if ( !row ) return 1;
				var n = row.querySelectorAll( ':scope > .wpbc_bfb__column' ).length || 1;
				if ( n < 1 ) n = 1;
				if ( n > 4 ) n = 4;
				return n;
			} catch ( _ ) {
				return 1;
			}
		}

		w.wpbc_bfb_inspector_factory_value_from.compute_section_columns = value_from_compute_section_columns;
	}

	// 3) Inspector class.

	class WPBC_BFB_Inspector {

		constructor(panel_el, builder) {
			this.panel         = panel_el || this._create_fallback_panel();
			this.builder       = builder;
			this.selected_el   = null;
			this._render_timer = null;

			this._on_delegated_input  = (e) => this._apply_control_from_event( e );
			this._on_delegated_change = (e) => this._apply_control_from_event( e );
			this.panel.addEventListener( 'input', this._on_delegated_input, true );
			this.panel.addEventListener( 'change', this._on_delegated_change, true );

			this._on_delegated_click = (e) => {
				const btn = e.target.closest( '[data-action]' );
				if ( !btn || !this.panel.contains( btn ) ) return;
				e.preventDefault();
				e.stopPropagation();

				const action = btn.getAttribute( 'data-action' );
				const el     = this.selected_el;
				if ( !el ) return;

				w.WPBC_BFB_Inspector_Actions?.run( action, {
					builder: this.builder,
					el,
					panel  : this.panel,
					event  : e
				} );

				if ( action === 'delete' ) this.clear();
			};
			this.panel.addEventListener( 'click', this._on_delegated_click );
		}

		_post_render_ui() {
			try {
				var UI = w.WPBC_BFB_Core && w.WPBC_BFB_Core.UI;
				if ( UI && typeof UI.apply_post_render === 'function' ) {
					UI.apply_post_render( this.panel );
				}
				// NEW: wire slider/number/unit syncing for length & range_number groups.
				try {
					wire_len_group( this.panel );
					init_coloris_pickers( this.panel );
				} catch ( _ ) {
				}
			} catch ( e ) {
				_wpbc?.dev?.error?.( 'inspector._post_render_ui', e );
			}
		}


		_apply_control_from_event(e) {
			if ( !this.panel.contains( e.target ) ) return;

			const t   = /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */ (e.target);
			const key = t?.dataset?.inspectorKey;
			if ( !key ) return;

			const el = this.selected_el;
			if ( !el || !document.body.contains( el ) ) return;

			let v;
			if ( t instanceof HTMLInputElement && t.type === 'checkbox' ) {
				v = !!t.checked;
				t.setAttribute( 'aria-checked', v ? 'true' : 'false' );         // Keep ARIA state in sync for toggles (schema and template paths).
			} else if ( t instanceof HTMLInputElement && t.type === 'number' ) {
				v = (t.value === '' ? '' : Number( t.value ));
			} else {
				v = t.value;
			}

			if ( key === 'id' ) {
				const unique = this.builder?.id?.set_field_id?.( el, v );
				if ( unique != null && t.value !== unique ) t.value = unique;

			} else if ( key === 'name' ) {
				const unique = this.builder?.id?.set_field_name?.( el, v );
				if ( unique != null && t.value !== unique ) t.value = unique;

			} else if ( key === 'html_id' ) {
				const applied = this.builder?.id?.set_field_html_id?.( el, v );
				if ( applied != null && t.value !== applied ) t.value = applied;

			} else if ( key === 'columns' && el.classList.contains( 'wpbc_bfb__section' ) ) {
				const v_int = parseInt( String( v ), 10 );
				if ( Number.isFinite( v_int ) ) {
					const clamped = w.WPBC_BFB_Core.WPBC_BFB_Sanitize.clamp( v_int, 1, 4 );
					this.builder?.set_section_columns?.( el, clamped );
					if ( String( clamped ) !== t.value ) t.value = String( clamped );
				}

			} else {
				if ( t instanceof HTMLInputElement && t.type === 'checkbox' ) {
					el.setAttribute( 'data-' + key, String( !!v ) );
				} else if ( t instanceof HTMLInputElement && t.type === 'number' ) {
					if ( t.value === '' || !Number.isFinite( v ) ) {
						el.removeAttribute( 'data-' + key );
					} else {
						el.setAttribute( 'data-' + key, String( v ) );
					}
				} else if ( v == null ) {
					el.removeAttribute( 'data-' + key );
				} else {
					el.setAttribute( 'data-' + key, (typeof v === 'object') ? JSON.stringify( v ) : String( v ) );
				}
			}

			// Update preview/overlay
			if ( el.classList.contains( 'wpbc_bfb__field' ) ) {
				if ( this.builder?.preview_mode ) this.builder.render_preview( el );
				else this.builder.add_overlay_toolbar( el );
			} else {
				this.builder.add_overlay_toolbar( el );
			}

			if ( this._needs_rerender( el, key, e ) ) {
				this._schedule_render_preserving_focus( 0 );
			}
		}

		_needs_rerender(el, key, _e) {
			if ( el.classList.contains( 'wpbc_bfb__section' ) && key === 'columns' ) return true;
			return false;
		}

		bind_to_field(field_el) {
			this.selected_el = field_el;
			this.render();
		}

		clear() {
			this.selected_el = null;
			if ( this._render_timer ) {
				clearTimeout( this._render_timer );
				this._render_timer = null;
			}
			// Also clear the section-cols hint on empty state.
			this.panel.removeAttribute('data-bfb-section-cols');
			this.panel.innerHTML = '<div class="wpbc_bfb__inspector__empty">Select a field to edit its options.</div>';
		}

		_schedule_render_preserving_focus(delay = 200) {
			const active    = /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLElement|null} */ (document.activeElement);
			const activeKey = active?.dataset?.inspectorKey || null;
			let selStart    = null, selEnd = null;

			if ( active && 'selectionStart' in active && 'selectionEnd' in active ) {
				// @ts-ignore
				selStart = active.selectionStart;
				// @ts-ignore
				selEnd   = active.selectionEnd;
			}

			if ( this._render_timer ) clearTimeout( this._render_timer );
			this._render_timer = /** @type {unknown} */ (setTimeout( () => {
				this.render();
				if ( activeKey ) {
					const next = /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLElement|null} */ (
						this.panel.querySelector( `[data-inspector-key="${activeKey}"]` )
					);
					if ( next ) {
						next.focus();
						try {
							if ( selStart != null && selEnd != null && typeof next.setSelectionRange === 'function' ) {
								// @ts-ignore
								next.setSelectionRange( selStart, selEnd );
							}
						} catch( e ){ _wpbc?.dev?.error( '_render_timer', e ); }
					}
				}
			}, delay ));
		}

		render() {

			const el = this.selected_el;
			if ( !el || !document.body.contains( el ) ) return this.clear();

			// Reset section-cols hint unless we set it later for a section.
			this.panel.removeAttribute( 'data-bfb-section-cols' );

			const prev_scroll = this.panel.scrollTop;

			// Section
			if ( el.classList.contains( 'wpbc_bfb__section' ) ) {
				let tpl = null;
				try {
					tpl = (w.wp && wp.template && document.getElementById( 'tmpl-wpbc-bfb-inspector-section' )) ? wp.template( 'wpbc-bfb-inspector-section' ) : null;
				} catch ( _ ) {
					tpl = null;
				}

				if ( tpl ) {
					this.panel.innerHTML = tpl( {} );
					this._enforce_default_group_open();
					this._set_panel_section_cols( el );
					this._post_render_ui();
					this.panel.scrollTop = prev_scroll;
					return;
				}

				const Factory = w.WPBC_BFB_Core.UI && w.WPBC_BFB_Core.UI.WPBC_BFB_Inspector_Factory;
				const schemas = w.WPBC_BFB_Schemas || {};
				const entry   = schemas['section'] || null;
				if ( entry && Factory ) {
					this.panel.innerHTML = '';
					Factory.render(
						this.panel,
						entry,
						{},
						{ el, builder: this.builder, type: 'section', title: entry.label || 'Section' }
					);
					this._enforce_default_group_open();

					// --- Safety net: if for any reason the slot didn’t render chips, inject them now.
					try {
						const hasSlotHost =
								  this.panel.querySelector( '[data-bfb-slot="layout_chips"]' ) ||
								  this.panel.querySelector( '.inspector__row--layout-chips .wpbc_bfb__layout_chips' ) ||
								  this.panel.querySelector( '#wpbc_bfb__layout_chips_host' );

						const hasChips =
								  !!this.panel.querySelector( '.wpbc_bfb__layout_chip' );

						if ( !hasChips ) {
							// Create a host if missing and render chips into it.
							const host = (function ensureHost(root) {
								let h =
										root.querySelector( '[data-bfb-slot="layout_chips"]' ) ||
										root.querySelector( '.inspector__row--layout-chips .wpbc_bfb__layout_chips' ) ||
										root.querySelector( '#wpbc_bfb__layout_chips_host' );
								if ( h ) return h;
								// Fallback host inside (or after) the “layout” group
								const fields    =
										  root.querySelector( '.wpbc_bfb__inspector__group[data-group="layout"] .group__fields' ) ||
										  root.querySelector( '.group__fields' ) || root;
								const row       = document.createElement( 'div' );
								row.className   = 'inspector__row inspector__row--layout-chips';
								const lab       = document.createElement( 'label' );
								lab.className   = 'inspector__label';
								lab.textContent = 'Layout';
								const ctl       = document.createElement( 'div' );
								ctl.className   = 'inspector__control';
								h               = document.createElement( 'div' );
								h.className     = 'wpbc_bfb__layout_chips';
								h.setAttribute( 'data-bfb-slot', 'layout_chips' );
								ctl.appendChild( h );
								row.appendChild( lab );
								row.appendChild( ctl );
								fields.appendChild( row );
								return h;
							})( this.panel );

							const L = (w.WPBC_BFB_Core && w.WPBC_BFB_Core.UI && w.WPBC_BFB_Core.UI.WPBC_BFB_Layout_Chips) ;
							if ( L && typeof L.render_for_section === 'function' ) {
								host.innerHTML = '';
								L.render_for_section( this.builder, el, host );
							}
						}
					} catch( e ){ _wpbc?.dev?.error( 'WPBC_BFB_Inspector - render', e ); }

					this._set_panel_section_cols( el );
					this.panel.scrollTop = prev_scroll;
					return;
				}

				this.panel.innerHTML = '<div class="wpbc_bfb__inspector__empty">Select a field to edit its options.</div>';
				return;
			}

			// Field
			if ( !el.classList.contains( 'wpbc_bfb__field' ) ) return this.clear();

			const data = w.WPBC_BFB_Core.WPBC_Form_Builder_Helper.get_all_data_attributes( el );
			const type = data.type || 'text';

			function _get_tpl(id) {
				if ( !w.wp || !wp.template ) return null;
				if ( !document.getElementById( 'tmpl-' + id ) ) return null;
				try {
					return wp.template( id );
				} catch ( e ) {
					return null;
				}
			}

			const tpl_id      = `wpbc-bfb-inspector-${type}`;
			const tpl         = _get_tpl( tpl_id );
			const generic_tpl = _get_tpl( 'wpbc-bfb-inspector-generic' );

			const schemas         = w.WPBC_BFB_Schemas || {};
			const schema_for_type = schemas[type] || null;
			const Factory         = w.WPBC_BFB_Core.UI && w.WPBC_BFB_Core.UI.WPBC_BFB_Inspector_Factory;

			if ( tpl ) {
				// NEW: merge schema defaults so missing keys (esp. booleans) honor defaults on first paint
				const hasOwn = Function.call.bind( Object.prototype.hasOwnProperty );
				const props  = (schema_for_type && schema_for_type.schema && schema_for_type.schema.props) ? schema_for_type.schema.props : {};
				const merged = { ...data };
				if ( props ) {
					Object.keys( props ).forEach( (k) => {
						const meta = props[k] || {};
						if ( !hasOwn( data, k ) || data[k] === '' ) {
							if ( hasOwn( meta, 'default' ) ) {
								// Coerce booleans to a real boolean; leave others as-is
								merged[k] = (meta.type === 'boolean') ? !!meta.default : meta.default;
							}
						} else if ( meta.type === 'boolean' ) {
							// Normalize truthy strings into booleans for templates that check on truthiness
							const v   = data[k];
							merged[k] = (v === true || v === 'true' || v === 1 || v === '1');
						}
					} );
				}
				this.panel.innerHTML = tpl( merged );

				this._post_render_ui();
			} else if ( schema_for_type && Factory ) {
				this.panel.innerHTML = '';
				Factory.render(
					this.panel,
					schema_for_type,
					{ ...data },
					{ el, builder: this.builder, type, title: data.label || '' }
				);
				// Ensure toggle normalizers and slider/number/unit wiring are attached.
				this._post_render_ui();
			} else if ( generic_tpl ) {
				this.panel.innerHTML = generic_tpl( { ...data } );
				this._post_render_ui();
			} else {

				const msg            = `There are no Inspector wp.template "${tpl_id}" or Schema for this "${String( type || '' )}" element.`;
				this.panel.innerHTML = '';
				const div            = document.createElement( 'div' );
				div.className        = 'wpbc_bfb__inspector__empty';
				div.textContent      = msg; // safe.
				this.panel.appendChild( div );
			}

			this._enforce_default_group_open();
			this.panel.scrollTop = prev_scroll;
		}

		_enforce_default_group_open() {
			const groups = Array.from( this.panel.querySelectorAll( '.wpbc_bfb__inspector__group' ) );
			if ( !groups.length ) return;

			let found = false;
			groups.forEach( (g) => {
				if ( !found && g.classList.contains( 'is-open' ) ) {
					found = true;
				} else {
					if ( g.classList.contains( 'is-open' ) ) {
						g.classList.remove( 'is-open' );
						g.dispatchEvent( new Event( 'wpbc:collapsible:close', { bubbles: true } ) );
					} else {
						g.classList.remove( 'is-open' );
					}
				}
			} );

			if ( !found ) {
				groups[0].classList.add( 'is-open' );
				groups[0].dispatchEvent( new Event( 'wpbc:collapsible:open', { bubbles: true } ) );
			}
		}

		/**
		 * Set data-bfb-section-cols on the inspector panel based on the current section.
		 * Uses the registered compute fn if available; falls back to direct DOM.
		 * @param {HTMLElement} sectionEl
		 */
		_set_panel_section_cols(sectionEl) {
			try {
				// Prefer the already-registered value_from helper if present.
				var compute = w.wpbc_bfb_inspector_factory_value_from && w.wpbc_bfb_inspector_factory_value_from.compute_section_columns;

				var cols = 1;
				if ( typeof compute === 'function' ) {
					cols = compute( { el: sectionEl } ) || 1;
				} else {
					// Fallback: compute directly from the DOM.
					var row = sectionEl && sectionEl.querySelector( ':scope > .wpbc_bfb__row' );
					cols    = row ? (row.querySelectorAll( ':scope > .wpbc_bfb__column' ).length || 1) : 1;
					if ( cols < 1 ) cols = 1;
					if ( cols > 4 ) cols = 4;
				}
				this.panel.setAttribute( 'data-bfb-section-cols', String( cols ) );
			} catch ( _ ) {
			}
		}


		_create_fallback_panel() {
			const p     = document.createElement( 'div' );
			p.id        = 'wpbc_bfb__inspector';
			p.className = 'wpbc_bfb__inspector';
			document.body.appendChild( p );
			return /** @type {HTMLDivElement} */ (p);
		}
	}

	// Export class + ready signal.
	w.WPBC_BFB_Inspector = WPBC_BFB_Inspector;
	document.dispatchEvent( new Event( 'wpbc_bfb_inspector_ready' ) );

})( window );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJmYi1jb3JlLmpzIiwiYmZiLWZpZWxkcy5qcyIsImJmYi11aS5qcyIsImJmYi1pbnNwZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3AwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2htQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGhGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IndwYmNfYmZiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vID09IEZpbGUgIC9pbmNsdWRlcy9wYWdlLWZvcm0tYnVpbGRlci9fb3V0L2NvcmUvYmZiLWNvcmUuanMgPT0gfCAyMDI1LTA5LTEwIDE1OjQ3XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24gKCB3ICkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gU2luZ2xlIGdsb2JhbCBuYW1lc3BhY2UgKGlkZW1wb3RlbnQgJiBsb2FkLW9yZGVyIHNhZmUpLlxyXG5cdGNvbnN0IENvcmUgPSAoIHcuV1BCQ19CRkJfQ29yZSA9IHcuV1BCQ19CRkJfQ29yZSB8fCB7fSApO1xyXG5cdGNvbnN0IFVJICAgPSAoIENvcmUuVUkgPSBDb3JlLlVJIHx8IHt9ICk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvcmUgc2FuaXRpemUvZXNjYXBlL25vcm1hbGl6ZSBoZWxwZXJzLlxyXG5cdCAqIEFsbCBtZXRob2RzIHVzZSBzbmFrZV9jYXNlOyBjYW1lbENhc2UgYWxpYXNlcyBhcmUgcHJvdmlkZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxyXG5cdCAqL1xyXG5cdENvcmUuV1BCQ19CRkJfU2FuaXRpemUgPSBjbGFzcyB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFc2NhcGUgdGV4dCBmb3Igc2FmZSB1c2UgaW4gQ1NTIHNlbGVjdG9ycy5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBzIC0gcmF3IHNlbGVjdG9yIGZyYWdtZW50XHJcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgZXNjX2NzcyhzKSB7XHJcblx0XHRcdHJldHVybiAody5DU1MgJiYgdy5DU1MuZXNjYXBlKSA/IHcuQ1NTLmVzY2FwZSggU3RyaW5nKCBzICkgKSA6IFN0cmluZyggcyApLnJlcGxhY2UoIC8oW15cXHctXSkvZywgJ1xcXFwkMScgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEVzY2FwZSBhIHZhbHVlIGZvciBhdHRyaWJ1dGUgc2VsZWN0b3JzLCBlLmcuIFtkYXRhLWlkPVwiPHZhbHVlPlwiXS5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2XHJcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgZXNjX2F0dHJfdmFsdWVfZm9yX3NlbGVjdG9yKHYpIHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZyggdiApXHJcblx0XHRcdFx0LnJlcGxhY2UoIC9cXFxcL2csICdcXFxcXFxcXCcgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvXCIvZywgJ1xcXFxcIicgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvXFxuL2csICdcXFxcQSAnIClcclxuXHRcdFx0XHQucmVwbGFjZSggL1xcXS9nLCAnXFxcXF0nICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTYW5pdGl6ZSBpbnRvIGEgYnJvYWRseSBjb21wYXRpYmxlIEhUTUwgaWQ6IGxldHRlcnMsIGRpZ2l0cywgLSBfIDogLiA7IG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlci5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2XHJcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgc2FuaXRpemVfaHRtbF9pZCh2KSB7XHJcblx0XHRcdGxldCBzID0gKHYgPT0gbnVsbCA/ICcnIDogU3RyaW5nKCB2ICkpLnRyaW0oKTtcclxuXHRcdFx0cyAgICAgPSBzXHJcblx0XHRcdFx0LnJlcGxhY2UoIC9cXHMrL2csICctJyApXHJcblx0XHRcdFx0LnJlcGxhY2UoIC9bXkEtWmEtejAtOVxcLV9cXDouXS9nLCAnLScgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvLSsvZywgJy0nIClcclxuXHRcdFx0XHQucmVwbGFjZSggL15bLV8uOl0rfFstXy46XSskL2csICcnICk7XHJcblx0XHRcdGlmICggIXMgKSByZXR1cm4gJ2ZpZWxkJztcclxuXHRcdFx0aWYgKCAhL15bQS1aYS16XS8udGVzdCggcyApICkgcyA9ICdmLScgKyBzO1xyXG5cdFx0XHRyZXR1cm4gcztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNhbml0aXplIGludG8gYSBzYWZlIEhUTUwgbmFtZSB0b2tlbjogbGV0dGVycywgZGlnaXRzLCBfIC1cclxuXHRcdCAqIE11c3Qgc3RhcnQgd2l0aCBhIGxldHRlcjsgbm8gZG90cy9icmFja2V0cy9zcGFjZXMuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHNhbml0aXplX2h0bWxfbmFtZSh2KSB7XHJcblxyXG5cdFx0XHRsZXQgcyA9ICh2ID09IG51bGwgPyAnJyA6IFN0cmluZyggdiApKS50cmltKCk7XHJcblxyXG5cdFx0XHRzID0gcy5yZXBsYWNlKCAvXFxzKy9nLCAnXycgKS5yZXBsYWNlKCAvW15BLVphLXowLTlfLV0vZywgJ18nICkucmVwbGFjZSggL18rL2csICdfJyApO1xyXG5cclxuXHRcdFx0aWYgKCAhIHMgKSB7XHJcblx0XHRcdFx0cyA9ICdmaWVsZCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCAhIC9eW0EtWmEtel0vLnRlc3QoIHMgKSApIHtcclxuXHRcdFx0XHRzID0gJ2ZfJyArIHM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFc2NhcGUgZm9yIEhUTUwgdGV4dC9hdHRyaWJ1dGVzIChub3QgVVJMcykuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGVzY2FwZV9odG1sKHYpIHtcclxuXHRcdFx0aWYgKCB2ID09IG51bGwgKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTdHJpbmcoIHYgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvJi9nLCAnJmFtcDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggL1wiL2csICcmcXVvdDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggLycvZywgJyYjMDM5OycgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvPC9nLCAnJmx0OycgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvPi9nLCAnJmd0OycgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEVzY2FwZSBtaW5pbWFsIHNldCBmb3IgYXR0cmlidXRlLXNhZmV0eSB3aXRob3V0IHNsdWdnaW5nLlxyXG5cdFx0ICogS2VlcHMgb3JpZ2luYWwgaHVtYW4gdGV4dDsgZXNjYXBlcyAmLCA8LCA+LCBcIiBhbmQgJyBvbmx5LlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHNcclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBlc2NhcGVfdmFsdWVfZm9yX2F0dHIocykge1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nKCBzID09IG51bGwgPyAnJyA6IHMgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvJi9nLCAnJmFtcDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggLzwvZywgJyZsdDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggLz4vZywgJyZndDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggL1wiL2csICcmcXVvdDsnIClcclxuXHRcdFx0XHQucmVwbGFjZSggLycvZywgJyYjMzk7JyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2FuaXRpemUgYSBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzIGxpc3QuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHNhbml0aXplX2Nzc19jbGFzc2xpc3Qodikge1xyXG5cdFx0XHRpZiAoIHYgPT0gbnVsbCApIHJldHVybiAnJztcclxuXHRcdFx0cmV0dXJuIFN0cmluZyggdiApLnJlcGxhY2UoIC9bXlxcd1xcLSBdKy9nLCAnICcgKS5yZXBsYWNlKCAvXFxzKy9nLCAnICcgKS50cmltKCk7XHJcblx0XHR9XHJcbi8vID09IE5FVyA9PVxyXG5cdFx0LyoqXHJcblx0XHQgKiBUdXJuIGFuIGFyYml0cmFyeSB2YWx1ZSBpbnRvIGEgY29uc2VydmF0aXZlIFwidG9rZW5cIiAodW5kZXJzY29yZXMsIGh5cGhlbnMgYWxsb3dlZCkuXHJcblx0XHQgKiBVc2VmdWwgZm9yIHNob3J0Y29kZSB0b2tlbnMsIGlkcyBpbiBwbGFpbiB0ZXh0LCBldGMuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHRvX3Rva2VuKHYpIHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZyggdiA/PyAnJyApXHJcblx0XHRcdFx0LnRyaW0oKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvXFxzKy9nLCAnXycgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvW15BLVphLXowLTlfXFwtXS9nLCAnJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udmVydCB0byBrZWJhYi1jYXNlIChsZXR0ZXJzLCBkaWdpdHMsIGh5cGhlbnMpLlxyXG5cdFx0ICogQHBhcmFtIHthbnl9IHZcclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyB0b19rZWJhYih2KSB7XHJcblx0XHRcdHJldHVybiBTdHJpbmcoIHYgPz8gJycgKVxyXG5cdFx0XHRcdC50cmltKClcclxuXHRcdFx0XHQucmVwbGFjZSggL1tfXFxzXSsvZywgJy0nIClcclxuXHRcdFx0XHQucmVwbGFjZSggL1teQS1aYS16MC05LV0vZywgJycgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvLSsvZywgJy0nIClcclxuXHRcdFx0XHQudG9Mb3dlckNhc2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRydXRoeSBub3JtYWxpemF0aW9uIGZvciBmb3JtLWxpa2UgaW5wdXRzOiB0cnVlLCAndHJ1ZScsIDEsICcxJywgJ3llcycsICdvbicuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBpc190cnV0aHkodikge1xyXG5cdFx0XHRpZiAoIHR5cGVvZiB2ID09PSAnYm9vbGVhbicgKSByZXR1cm4gdjtcclxuXHRcdFx0Y29uc3QgcyA9IFN0cmluZyggdiA/PyAnJyApLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRyZXR1cm4gcyA9PT0gJ3RydWUnIHx8IHMgPT09ICcxJyB8fCBzID09PSAneWVzJyB8fCBzID09PSAnb24nO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29lcmNlIHRvIGJvb2xlYW4gd2l0aCBhbiBvcHRpb25hbCBkZWZhdWx0IGZvciBlbXB0eSB2YWx1ZXMuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbZGVmPWZhbHNlXVxyXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBjb2VyY2VfYm9vbGVhbih2LCBkZWYgPSBmYWxzZSkge1xyXG5cdFx0XHRpZiAoIHYgPT0gbnVsbCB8fCB2ID09PSAnJyApIHJldHVybiBkZWY7XHJcblx0XHRcdHJldHVybiB0aGlzLmlzX3RydXRoeSggdiApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUGFyc2UgYSBcInBlcmNlbnQtbGlrZVwiIHZhbHVlICgnMzMnfCczMyUnfDMzKSB3aXRoIGZhbGxiYWNrLlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfG51bGx8dW5kZWZpbmVkfSB2XHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gZmFsbGJhY2tfdmFsdWVcclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJ9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBwYXJzZV9wZXJjZW50KHYsIGZhbGxiYWNrX3ZhbHVlKSB7XHJcblx0XHRcdGlmICggdiA9PSBudWxsICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxsYmFja192YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBzID0gU3RyaW5nKCB2ICkudHJpbSgpO1xyXG5cdFx0XHRjb25zdCBuID0gcGFyc2VGbG9hdCggcy5yZXBsYWNlKCAvJS9nLCAnJyApICk7XHJcblx0XHRcdHJldHVybiBOdW1iZXIuaXNGaW5pdGUoIG4gKSA/IG4gOiBmYWxsYmFja192YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENsYW1wIGEgbnVtYmVyIHRvIHRoZSBbbWluLCBtYXhdIHJhbmdlLlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IG5cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJ9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBjbGFtcChuLCBtaW4sIG1heCkge1xyXG5cdFx0XHRyZXR1cm4gTWF0aC5tYXgoIG1pbiwgTWF0aC5taW4oIG1heCwgbiApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFc2NhcGUgYSB2YWx1ZSBmb3IgaW5jbHVzaW9uIGluc2lkZSBhIHF1b3RlZCBIVE1MIGF0dHJpYnV0ZSAoZG91YmxlIHF1b3RlcykuXHJcblx0XHQgKiBSZXBsYWNlcyBuZXdsaW5lcyB3aXRoIHNwYWNlcyBhbmQgZG91YmxlIHF1b3RlcyB3aXRoIHNpbmdsZSBxdW90ZXMuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGVzY2FwZV9mb3JfYXR0cl9xdW90ZWQodikge1xyXG5cdFx0XHRpZiAoIHYgPT0gbnVsbCApIHJldHVybiAnJztcclxuXHRcdFx0cmV0dXJuIFN0cmluZyggdiApLnJlcGxhY2UoIC9cXHI/XFxuL2csICcgJyApLnJlcGxhY2UoIC9cIi9nLCAnXFwnJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRXNjYXBlIGZvciBzaG9ydGNvZGUtbGlrZSB0b2tlbnMgd2hlcmUgZG91YmxlIHF1b3RlcyBhbmQgbmV3bGluZXMgc2hvdWxkIGJlIG5ldXRyYWxpemVkLlxyXG5cdFx0ICogQHBhcmFtIHthbnl9IHZcclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBlc2NhcGVfZm9yX3Nob3J0Y29kZSh2KSB7XHJcblx0XHRcdHJldHVybiBTdHJpbmcoIHYgPz8gJycgKS5yZXBsYWNlKCAvXCIvZywgJ1xcXFxcIicgKS5yZXBsYWNlKCAvXFxyP1xcbi9nLCAnICcgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEpTT04ucGFyc2Ugd2l0aCBmYWxsYmFjayAobm8gdGhyb3cpLlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHNcclxuXHRcdCAqIEBwYXJhbSB7YW55fSBbZmFsbGJhY2s9bnVsbF1cclxuXHRcdCAqIEByZXR1cm5zIHthbnl9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBzYWZlX2pzb25fcGFyc2UocywgZmFsbGJhY2sgPSBudWxsKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoIHMgKTtcclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdHJpbmdpZnkgZGF0YS0qIGF0dHJpYnV0ZSB2YWx1ZSBzYWZlbHkgKG9iamVjdHMgLT4gSlNPTiwgb3RoZXJzIC0+IFN0cmluZykuXHJcblx0XHQgKiBAcGFyYW0ge2FueX0gdlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHN0cmluZ2lmeV9kYXRhX3ZhbHVlKHYpIHtcclxuXHRcdFx0aWYgKCB0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgdiAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KCB2ICk7XHJcblx0XHRcdFx0fSBjYXRjaCB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCAnV1BCQzogc3RyaW5naWZ5X2RhdGFfdmFsdWUnICk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTdHJpbmcoIHYgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQvLyBTdHJpY3QgdmFsdWUgZ3VhcmRzIGZvciBDU1MgbGVuZ3RocyBhbmQgaGV4IGNvbG9ycyAoZGVmZW5zZS1pbi1kZXB0aCkuXHJcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQvKipcclxuXHRcdCAqIFNhbml0aXplIGEgQ1NTIGxlbmd0aC4gQWxsb3dzOiBweCwgJSwgcmVtLCBlbSAobG93ZXIvdXBwZXIpLlxyXG5cdFx0ICogUmV0dXJucyBmYWxsYmFjayBpZiBpbnZhbGlkLlxyXG5cdFx0ICogQHBhcmFtIHthbnl9IHZcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBbZmFsbGJhY2s9JzEwMCUnXVxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHNhbml0aXplX2Nzc19sZW4odiwgZmFsbGJhY2sgPSAnMTAwJScpIHtcclxuXHRcdFx0Y29uc3QgcyA9IFN0cmluZyggdiA/PyAnJyApLnRyaW0oKTtcclxuXHRcdFx0Y29uc3QgbSA9IHMubWF0Y2goIC9eKC0/XFxkKyg/OlxcLlxcZCspPykocHh8JXxyZW18ZW0pJC9pICk7XHJcblx0XHRcdHJldHVybiBtID8gbVswXSA6IFN0cmluZyggZmFsbGJhY2sgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNhbml0aXplIGEgaGV4IGNvbG9yLiBBbGxvd3MgI3JnYiBvciAjcnJnZ2JiIChjYXNlLWluc2Vuc2l0aXZlKS5cclxuXHRcdCAqIFJldHVybnMgZmFsbGJhY2sgaWYgaW52YWxpZC5cclxuXHRcdCAqIEBwYXJhbSB7YW55fSB2XHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gW2ZhbGxiYWNrPScjZTBlMGUwJ11cclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBzYW5pdGl6ZV9oZXhfY29sb3IodiwgZmFsbGJhY2sgPSAnI2UwZTBlMCcpIHtcclxuXHRcdFx0Y29uc3QgcyA9IFN0cmluZyggdiA/PyAnJyApLnRyaW0oKTtcclxuXHRcdFx0cmV0dXJuIC9eIyg/OlswLTlhLWZdezN9fFswLTlhLWZdezZ9KSQvaS50ZXN0KCBzICkgPyBzIDogU3RyaW5nKCBmYWxsYmFjayApO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFdQQkMgSUQgLyBOYW1lIHNlcnZpY2UuIEdlbmVyYXRlcywgc2FuaXRpemVzLCBhbmQgZW5zdXJlcyB1bmlxdWVuZXNzIGZvciBmaWVsZCBpZHMvbmFtZXMvaHRtbF9pZHMgd2l0aGluIHRoZSBjYW52YXMuXHJcblx0ICovXHJcblx0Q29yZS5XUEJDX0JGQl9JZFNlcnZpY2UgPSBjbGFzcyAge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29uc3RydWN0b3IuIFNldCByb290IGNvbnRhaW5lciBvZiB0aGUgZm9ybSBwYWdlcy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYWdlc19jb250YWluZXIgLSBSb290IGNvbnRhaW5lciBvZiB0aGUgZm9ybSBwYWdlcy5cclxuXHRcdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IoIHBhZ2VzX2NvbnRhaW5lciApIHtcclxuXHRcdFx0dGhpcy5wYWdlc19jb250YWluZXIgPSBwYWdlc19jb250YWluZXI7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFbnN1cmUgYSB1bmlxdWUgKippbnRlcm5hbCoqIGZpZWxkIGlkIChzdG9yZWQgaW4gZGF0YS1pZCkgd2l0aGluIHRoZSBjYW52YXMuXHJcblx0XHQgKiBTdGFydHMgZnJvbSBhIGRlc2lyZWQgaWQgKGFscmVhZHkgc2FuaXRpemVkIG9yIG5vdCkgYW5kIGFwcGVuZHMgc3VmZml4ZXMgaWYgbmVlZGVkLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlSWQgLSBEZXNpcmVkIGlkLlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gVW5pcXVlIGlkLlxyXG5cdFx0ICovXHJcblx0XHRlbnN1cmVfdW5pcXVlX2ZpZWxkX2lkKGJhc2VJZCwgY3VycmVudEVsID0gbnVsbCkge1xyXG5cdFx0XHRjb25zdCBiYXNlICAgID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5zYW5pdGl6ZV9odG1sX2lkKCBiYXNlSWQgKTtcclxuXHRcdFx0bGV0IGlkICAgICAgICA9IGJhc2UgfHwgJ2ZpZWxkJztcclxuXHRcdFx0Y29uc3QgZXNjICAgICA9ICh2KSA9PiBDb3JlLldQQkNfQkZCX1Nhbml0aXplLmVzY19hdHRyX3ZhbHVlX2Zvcl9zZWxlY3RvciggdiApO1xyXG5cdFx0XHRjb25zdCBlc2NVaWQgID0gKHYpID0+IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuZXNjX2F0dHJfdmFsdWVfZm9yX3NlbGVjdG9yKCB2ICk7XHJcblx0XHRcdGNvbnN0IG5vdFNlbGYgPSBjdXJyZW50RWw/LmRhdGFzZXQ/LnVpZCA/IGA6bm90KFtkYXRhLXVpZD1cIiR7ZXNjVWlkKCBjdXJyZW50RWwuZGF0YXNldC51aWQgKX1cIl0pYCA6ICcnO1xyXG5cdFx0XHR3aGlsZSAoIHRoaXMucGFnZXNfY29udGFpbmVyPy5xdWVyeVNlbGVjdG9yKFxyXG5cdFx0XHRcdGAud3BiY19iZmJfX3BhbmVsLS1wcmV2aWV3IC53cGJjX2JmYl9fZmllbGQke25vdFNlbGZ9W2RhdGEtaWQ9XCIke2VzYyhpZCl9XCJdLCAud3BiY19iZmJfX3BhbmVsLS1wcmV2aWV3IC53cGJjX2JmYl9fc2VjdGlvbiR7bm90U2VsZn1bZGF0YS1pZD1cIiR7ZXNjKGlkKX1cIl1gXHJcblx0XHRcdCkgKSB7XHJcblx0XHRcdFx0Ly8gRXhjbHVkZXMgc2VsZiBieSBkYXRhLXVpZCAuXHJcblx0XHRcdFx0Y29uc3QgZm91bmQgPSB0aGlzLnBhZ2VzX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCBgLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkW2RhdGEtaWQ9XCIke2VzYyggaWQgKX1cIl0sIC53cGJjX2JmYl9fcGFuZWwtLXByZXZpZXcgLndwYmNfYmZiX19zZWN0aW9uW2RhdGEtaWQ9XCIke2VzYyggaWQgKX1cIl1gICk7XHJcblx0XHRcdFx0aWYgKCBmb3VuZCAmJiBjdXJyZW50RWwgJiYgZm91bmQgPT09IGN1cnJlbnRFbCApIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZCA9IGAke2Jhc2UgfHwgJ2ZpZWxkJ30tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCAzNiApLnNsaWNlKCAyLCA1ICl9YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFbnN1cmUgYSB1bmlxdWUgSFRNTCBuYW1lIGFjcm9zcyB0aGUgZm9ybS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYmFzZSAtIERlc2lyZWQgYmFzZSBuYW1lICh1bi9zYW5pdGl6ZWQpLlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudHxudWxsfSBjdXJyZW50RWwgLSBJZiBwcm92aWRlZCwgaWdub3JlIGNvbmZsaWN0cyB3aXRoIHRoaXMgZWxlbWVudC5cclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9IFVuaXF1ZSBuYW1lLlxyXG5cdFx0ICovXHJcblx0XHRlbnN1cmVfdW5pcXVlX2ZpZWxkX25hbWUoYmFzZSwgY3VycmVudEVsID0gbnVsbCkge1xyXG5cdFx0XHRsZXQgbmFtZSAgICAgID0gYmFzZSB8fCAnZmllbGQnO1xyXG5cdFx0XHRjb25zdCBlc2MgICAgID0gKHYpID0+IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuZXNjX2F0dHJfdmFsdWVfZm9yX3NlbGVjdG9yKCB2ICk7XHJcblx0XHRcdGNvbnN0IGVzY1VpZCAgPSAodikgPT4gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5lc2NfYXR0cl92YWx1ZV9mb3Jfc2VsZWN0b3IoIHYgKTtcclxuXHRcdFx0Ly8gRXhjbHVkZSB0aGUgY3VycmVudCBmaWVsZCAqYW5kIGFueSBET00gbWlycm9ycyBvZiBpdCogKHNhbWUgZGF0YS11aWQpXHJcblx0XHRcdGNvbnN0IHVpZCAgICAgPSBjdXJyZW50RWw/LmRhdGFzZXQ/LnVpZDtcclxuXHRcdFx0Y29uc3Qgbm90U2VsZiA9IHVpZCA/IGA6bm90KFtkYXRhLXVpZD1cIiR7ZXNjVWlkKCB1aWQgKX1cIl0pYCA6ICcnO1xyXG5cdFx0XHR3aGlsZSAoIHRydWUgKSB7XHJcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBgLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkJHtub3RTZWxmfVtkYXRhLW5hbWU9XCIke2VzYyggbmFtZSApfVwiXWA7XHJcblx0XHRcdFx0Y29uc3QgY2xhc2hlcyAgPSB0aGlzLnBhZ2VzX2NvbnRhaW5lcj8ucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSB8fCBbXTtcclxuXHRcdFx0XHRpZiAoIGNsYXNoZXMubGVuZ3RoID09PSAwICkgYnJlYWs7ICAgICAgICAgICAvLyBub2JvZHkgZWxzZSB1c2VzIHRoaXMgbmFtZVxyXG5cdFx0XHRcdGNvbnN0IG0gPSBuYW1lLm1hdGNoKCAvLShcXGQrKSQvICk7XHJcblx0XHRcdFx0bmFtZSAgICA9IG0gPyBuYW1lLnJlcGxhY2UoIC8tXFxkKyQvLCAnLScgKyAoTnVtYmVyKCBtWzFdICkgKyAxKSApIDogYCR7YmFzZX0tMmA7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5hbWU7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZXQgZmllbGQncyBJTlRFUk5BTCBpZCAoZGF0YS1pZCkgb24gYW4gZWxlbWVudC4gRW5zdXJlcyB1bmlxdWVuZXNzIGFuZCBvcHRpb25hbGx5IGFza3MgY2FsbGVyIHRvIHJlZnJlc2ggcHJldmlldy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBmaWVsZF9lbCAtIEZpZWxkIGVsZW1lbnQgaW4gdGhlIGNhbnZhcy5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBuZXdJZFJhdyAtIERlc2lyZWQgaWQgKHVuL3Nhbml0aXplZCkuXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZW5kZXJQcmV2aWV3PWZhbHNlXSAtIENhbGxlciBjYW4gZGVjaWRlIHRvIHJlLXJlbmRlciBwcmV2aWV3LlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gQXBwbGllZCB1bmlxdWUgaWQuXHJcblx0XHQgKi9cclxuXHRcdHNldF9maWVsZF9pZCggZmllbGRfZWwsIG5ld0lkUmF3LCByZW5kZXJQcmV2aWV3ID0gZmFsc2UgKSB7XHJcblx0XHRcdGNvbnN0IGRlc2lyZWQgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnNhbml0aXplX2h0bWxfaWQoIG5ld0lkUmF3ICk7XHJcblx0XHRcdGNvbnN0IHVuaXF1ZSAgPSB0aGlzLmVuc3VyZV91bmlxdWVfZmllbGRfaWQoIGRlc2lyZWQsIGZpZWxkX2VsICk7XHJcblx0XHRcdGZpZWxkX2VsLnNldEF0dHJpYnV0ZSggJ2RhdGEtaWQnLCB1bmlxdWUgKTtcclxuXHRcdFx0aWYgKCByZW5kZXJQcmV2aWV3ICkge1xyXG5cdFx0XHRcdC8vIENhbGxlciBkZWNpZGVzIGlmIC8gd2hlbiB0byByZW5kZXIuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVuaXF1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldCBmaWVsZCdzIFJFUVVJUkVEIEhUTUwgbmFtZSAoZGF0YS1uYW1lKS4gRW5zdXJlcyBzYW5pdGl6ZWQgKyB1bmlxdWUgcGVyIGZvcm0uXHJcblx0XHQgKiBGYWxscyBiYWNrIHRvIHNhbml0aXplZCBpbnRlcm5hbCBpZCBpZiB1c2VyIHByb3ZpZGVzIGVtcHR5IHZhbHVlLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGZpZWxkX2VsIC0gRmllbGQgZWxlbWVudCBpbiB0aGUgY2FudmFzLlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG5ld05hbWVSYXcgLSBEZXNpcmVkIG5hbWUgKHVuL3Nhbml0aXplZCkuXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZW5kZXJQcmV2aWV3PWZhbHNlXSAtIENhbGxlciBjYW4gZGVjaWRlIHRvIHJlLXJlbmRlciBwcmV2aWV3LlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gQXBwbGllZCB1bmlxdWUgbmFtZS5cclxuXHRcdCAqL1xyXG5cdFx0c2V0X2ZpZWxkX25hbWUoIGZpZWxkX2VsLCBuZXdOYW1lUmF3LCByZW5kZXJQcmV2aWV3ID0gZmFsc2UgKSB7XHJcblx0XHRcdGNvbnN0IHJhdyAgPSAobmV3TmFtZVJhdyA9PSBudWxsID8gJycgOiBTdHJpbmcoIG5ld05hbWVSYXcgKSkudHJpbSgpO1xyXG5cdFx0XHRjb25zdCBiYXNlID0gcmF3XHJcblx0XHRcdFx0PyBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnNhbml0aXplX2h0bWxfbmFtZSggcmF3IClcclxuXHRcdFx0XHQ6IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuc2FuaXRpemVfaHRtbF9uYW1lKCBmaWVsZF9lbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWlkJyApIHx8ICdmaWVsZCcgKTtcclxuXHJcblx0XHRcdGNvbnN0IHVuaXF1ZSA9IHRoaXMuZW5zdXJlX3VuaXF1ZV9maWVsZF9uYW1lKCBiYXNlLCBmaWVsZF9lbCApO1xyXG5cdFx0XHRmaWVsZF9lbC5zZXRBdHRyaWJ1dGUoICdkYXRhLW5hbWUnLCB1bmlxdWUgKTtcclxuXHRcdFx0aWYgKCByZW5kZXJQcmV2aWV3ICkge1xyXG5cdFx0XHRcdC8vIENhbGxlciBkZWNpZGVzIGlmIC8gd2hlbiB0byByZW5kZXIuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVuaXF1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldCBmaWVsZCdzIE9QVElPTkFMIHB1YmxpYyBIVE1MIGlkIChkYXRhLWh0bWxfaWQpLiBFbXB0eSB2YWx1ZSByZW1vdmVzIHRoZSBhdHRyaWJ1dGUuXHJcblx0XHQgKiBFbnN1cmVzIHNhbml0aXphdGlvbiArIHVuaXF1ZW5lc3MgYW1vbmcgb3RoZXIgZGVjbGFyZWQgSFRNTCBpZHMuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZmllbGRfZWwgLSBGaWVsZCBlbGVtZW50IGluIHRoZSBjYW52YXMuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3SHRtbElkUmF3IC0gRGVzaXJlZCBodG1sX2lkIChvcHRpb25hbCkuXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZW5kZXJQcmV2aWV3PWZhbHNlXSAtIENhbGxlciBjYW4gZGVjaWRlIHRvIHJlLXJlbmRlciBwcmV2aWV3LlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGFwcGxpZWQgaHRtbF9pZCBvciBlbXB0eSBzdHJpbmcgaWYgcmVtb3ZlZC5cclxuXHRcdCAqL1xyXG5cdFx0c2V0X2ZpZWxkX2h0bWxfaWQoIGZpZWxkX2VsLCBuZXdIdG1sSWRSYXcsIHJlbmRlclByZXZpZXcgPSBmYWxzZSApIHtcclxuXHRcdFx0Y29uc3QgcmF3ID0gKG5ld0h0bWxJZFJhdyA9PSBudWxsID8gJycgOiBTdHJpbmcoIG5ld0h0bWxJZFJhdyApKS50cmltKCk7XHJcblxyXG5cdFx0XHRpZiAoIHJhdyA9PT0gJycgKSB7XHJcblx0XHRcdFx0ZmllbGRfZWwucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1odG1sX2lkJyApO1xyXG5cdFx0XHRcdGlmICggcmVuZGVyUHJldmlldyApIHtcclxuXHRcdFx0XHRcdC8vIENhbGxlciBkZWNpZGVzIGlmIC8gd2hlbiB0byByZW5kZXIuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiAnJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgZGVzaXJlZCA9IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuc2FuaXRpemVfaHRtbF9pZCggcmF3ICk7XHJcblx0XHRcdGxldCBodG1sSWQgICAgPSBkZXNpcmVkO1xyXG5cdFx0XHRjb25zdCBlc2MgICAgID0gKHYpID0+IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuZXNjX2F0dHJfdmFsdWVfZm9yX3NlbGVjdG9yKCB2ICk7XHJcblx0XHRcdGNvbnN0IGVzY1VpZCAgPSAodikgPT4gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5lc2NfYXR0cl92YWx1ZV9mb3Jfc2VsZWN0b3IoIHYgKTtcclxuXHJcblx0XHRcdHdoaWxlICggdHJ1ZSApIHtcclxuXHJcblx0XHRcdFx0Y29uc3QgdWlkICAgICA9IGZpZWxkX2VsPy5kYXRhc2V0Py51aWQ7XHJcblx0XHRcdFx0Y29uc3Qgbm90U2VsZiA9IHVpZCA/IGA6bm90KFtkYXRhLXVpZD1cIiR7ZXNjVWlkKCB1aWQgKX1cIl0pYCA6ICcnO1xyXG5cclxuXHRcdFx0XHRjb25zdCBjbGFzaEluQ2FudmFzID0gdGhpcy5wYWdlc19jb250YWluZXI/LnF1ZXJ5U2VsZWN0b3IoXHJcblx0XHRcdFx0XHRgLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkJHtub3RTZWxmfVtkYXRhLWh0bWxfaWQ9XCIke2VzYyggaHRtbElkICl9XCJdLGAgK1xyXG5cdFx0XHRcdFx0YC53cGJjX2JmYl9fcGFuZWwtLXByZXZpZXcgLndwYmNfYmZiX19zZWN0aW9uJHtub3RTZWxmfVtkYXRhLWh0bWxfaWQ9XCIke2VzYyggaHRtbElkICl9XCJdYFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0Y29uc3QgZG9tQ2xhc2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaHRtbElkICk7XHJcblxyXG5cdFx0XHRcdC8vIEFsbG93IHdoZW4gdGhlIG9ubHkgXCJjbGFzaFwiIGlzIGluc2lkZSB0aGlzIHNhbWUgZmllbGQgKGUuZy4sIHRoZSBpbnB1dCB5b3UganVzdCByZW5kZXJlZClcclxuXHRcdFx0XHRjb25zdCBkb21DbGFzaElzU2VsZiA9IGRvbUNsYXNoID09PSBmaWVsZF9lbCB8fCAoZG9tQ2xhc2ggJiYgZmllbGRfZWwuY29udGFpbnMoIGRvbUNsYXNoICkpO1xyXG5cclxuXHRcdFx0XHRpZiAoICFjbGFzaEluQ2FudmFzICYmICghZG9tQ2xhc2ggfHwgZG9tQ2xhc2hJc1NlbGYpICkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBtID0gaHRtbElkLm1hdGNoKCAvLShcXGQrKSQvICk7XHJcblx0XHRcdFx0aHRtbElkICA9IG0gPyBodG1sSWQucmVwbGFjZSggLy1cXGQrJC8sICctJyArIChOdW1iZXIoIG1bMV0gKSArIDEpICkgOiBgJHtkZXNpcmVkfS0yYDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmllbGRfZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1odG1sX2lkJywgaHRtbElkICk7XHJcblx0XHRcdGlmICggcmVuZGVyUHJldmlldyApIHtcclxuXHRcdFx0XHQvLyBDYWxsZXIgZGVjaWRlcyBpZiAvIHdoZW4gdG8gcmVuZGVyLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBodG1sSWQ7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogV1BCQyBMYXlvdXQgc2VydmljZS4gRW5jYXBzdWxhdGVzIGNvbHVtbiB3aWR0aCBtYXRoIHdpdGggZ2FwIGhhbmRsaW5nLCBwcmVzZXRzLCBhbmQgdXRpbGl0aWVzLlxyXG5cdCAqL1xyXG5cdENvcmUuV1BCQ19CRkJfTGF5b3V0U2VydmljZSA9IGNsYXNzICB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb25zdHJ1Y3Rvci4gU2V0IG9wdGlvbnMgd2l0aCBnYXAgYmV0d2VlbiBjb2x1bW5zICglKS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3sgY29sX2dhcF9wZXJjZW50PzogbnVtYmVyIH19IFtvcHRzXSAtIE9wdGlvbnMgd2l0aCBnYXAgYmV0d2VlbiBjb2x1bW5zICglKS5cclxuXHRcdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IoIG9wdHMgPSB7fSApIHtcclxuXHRcdFx0dGhpcy5jb2xfZ2FwX3BlcmNlbnQgPSBOdW1iZXIuaXNGaW5pdGUoICtvcHRzLmNvbF9nYXBfcGVyY2VudCApID8gK29wdHMuY29sX2dhcF9wZXJjZW50IDogMztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENvbXB1dGUgbm9ybWFsaXplZCBmbGV4LWJhc2lzIHZhbHVlcyBmb3IgYSByb3csIHJlc3BlY3RpbmcgY29sdW1uIGdhcHMuXHJcblx0XHQgKiBSZXR1cm5zIGJhc2VzIHRoYXQgc3VtIHRvIGF2YWlsYWJsZSA9IDEwMCAtIChuLTEpKmdhcC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb3dfZWwgLSBSb3cgZWxlbWVudCBjb250YWluaW5nIC53cGJjX2JmYl9fY29sdW1uIGNoaWxkcmVuLlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IFtnYXBfcGVyY2VudD10aGlzLmNvbF9nYXBfcGVyY2VudF0gLSBHYXAgcGVyY2VudCBiZXR3ZWVuIGNvbHVtbnMuXHJcblx0XHQgKiBAcmV0dXJucyB7e2F2YWlsYWJsZTpudW1iZXIsYmFzZXM6bnVtYmVyW119fSBBdmFpbGFibGUgc3BhY2UgYW5kIGJhc2lzIHZhbHVlcy5cclxuXHRcdCAqL1xyXG5cdFx0Y29tcHV0ZV9lZmZlY3RpdmVfYmFzZXNfZnJvbV9yb3coIHJvd19lbCwgZ2FwX3BlcmNlbnQgPSB0aGlzLmNvbF9nYXBfcGVyY2VudCApIHtcclxuXHRcdFx0Y29uc3QgY29scyA9IEFycmF5LmZyb20oIHJvd19lbD8ucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fY29sdW1uJyApIHx8IFtdICk7XHJcblx0XHRcdGNvbnN0IG4gICAgPSBjb2xzLmxlbmd0aCB8fCAxO1xyXG5cclxuXHRcdFx0Y29uc3QgcmF3ID0gY29scy5tYXAoICggY29sICkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHcgPSBjb2wuc3R5bGUuZmxleEJhc2lzIHx8ICcnO1xyXG5cdFx0XHRcdGNvbnN0IHAgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnBhcnNlX3BlcmNlbnQoIHcsIE5hTiApO1xyXG5cdFx0XHRcdHJldHVybiBOdW1iZXIuaXNGaW5pdGUoIHAgKSA/IHAgOiAoMTAwIC8gbik7XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdGNvbnN0IHN1bV9yYXcgICAgPSByYXcucmVkdWNlKCAoIGEsIGIgKSA9PiBhICsgYiwgMCApIHx8IDEwMDtcclxuXHRcdFx0Y29uc3QgZ3AgICAgICAgICA9IE51bWJlci5pc0Zpbml0ZSggK2dhcF9wZXJjZW50ICkgPyArZ2FwX3BlcmNlbnQgOiAzO1xyXG5cdFx0XHRjb25zdCB0b3RhbF9nYXBzID0gTWF0aC5tYXgoIDAsIG4gLSAxICkgKiBncDtcclxuXHRcdFx0Y29uc3QgYXZhaWxhYmxlICA9IE1hdGgubWF4KCAwLCAxMDAgLSB0b3RhbF9nYXBzICk7XHJcblx0XHRcdGNvbnN0IHNjYWxlICAgICAgPSBhdmFpbGFibGUgLyBzdW1fcmF3O1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRhdmFpbGFibGUsXHJcblx0XHRcdFx0YmFzZXM6IHJhdy5tYXAoICggcCApID0+IE1hdGgubWF4KCAwLCBwICogc2NhbGUgKSApXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBcHBseSBjb21wdXRlZCBiYXNlcyB0byB0aGUgcm93J3MgY29sdW1ucyAoc2V0cyBmbGV4LWJhc2lzICUpLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJvd19lbCAtIFJvdyBlbGVtZW50LlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJbXX0gYmFzZXMgLSBBcnJheSBvZiBiYXNpcyB2YWx1ZXMgKHBlcmNlbnQgb2YgZnVsbCAxMDApLlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdGFwcGx5X2Jhc2VzX3RvX3Jvdyggcm93X2VsLCBiYXNlcyApIHtcclxuXHRcdFx0Y29uc3QgY29scyA9IEFycmF5LmZyb20oIHJvd19lbD8ucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fY29sdW1uJyApIHx8IFtdICk7XHJcblx0XHRcdGNvbHMuZm9yRWFjaCggKCBjb2wsIGkgKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgcCAgICAgICAgICAgICA9IGJhc2VzW2ldID8/IDA7XHJcblx0XHRcdFx0Y29sLnN0eWxlLmZsZXhCYXNpcyA9IGAke3B9JWA7XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERpc3RyaWJ1dGUgY29sdW1ucyBldmVubHksIHJlc3BlY3RpbmcgZ2FwLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJvd19lbCAtIFJvdyBlbGVtZW50LlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IFtnYXBfcGVyY2VudD10aGlzLmNvbF9nYXBfcGVyY2VudF0gLSBHYXAgcGVyY2VudC5cclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHRzZXRfZXF1YWxfYmFzZXMoIHJvd19lbCwgZ2FwX3BlcmNlbnQgPSB0aGlzLmNvbF9nYXBfcGVyY2VudCApIHtcclxuXHRcdFx0Y29uc3QgY29scyAgICAgICA9IEFycmF5LmZyb20oIHJvd19lbD8ucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fY29sdW1uJyApIHx8IFtdICk7XHJcblx0XHRcdGNvbnN0IG4gICAgICAgICAgPSBjb2xzLmxlbmd0aCB8fCAxO1xyXG5cdFx0XHRjb25zdCBncCAgICAgICAgID0gTnVtYmVyLmlzRmluaXRlKCArZ2FwX3BlcmNlbnQgKSA/ICtnYXBfcGVyY2VudCA6IDM7XHJcblx0XHRcdGNvbnN0IHRvdGFsX2dhcHMgPSBNYXRoLm1heCggMCwgbiAtIDEgKSAqIGdwO1xyXG5cdFx0XHRjb25zdCBhdmFpbGFibGUgID0gTWF0aC5tYXgoIDAsIDEwMCAtIHRvdGFsX2dhcHMgKTtcclxuXHRcdFx0Y29uc3QgZWFjaCAgICAgICA9IGF2YWlsYWJsZSAvIG47XHJcblx0XHRcdHRoaXMuYXBwbHlfYmFzZXNfdG9fcm93KCByb3dfZWwsIEFycmF5KCBuICkuZmlsbCggZWFjaCApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBcHBseSBhIHByZXNldCBvZiByZWxhdGl2ZSB3ZWlnaHRzIHRvIGEgcm93L3NlY3Rpb24uXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2VjdGlvbk9yUm93IC0gLndwYmNfYmZiX19zZWN0aW9uIG9yIGl0cyBjaGlsZCAud3BiY19iZmJfX3Jvdy5cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyW119IHdlaWdodHMgLSBSZWxhdGl2ZSB3ZWlnaHRzIChlLmcuLCBbMSwzLDFdKS5cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbZ2FwX3BlcmNlbnQ9dGhpcy5jb2xfZ2FwX3BlcmNlbnRdIC0gR2FwIHBlcmNlbnQuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0YXBwbHlfbGF5b3V0X3ByZXNldCggc2VjdGlvbk9yUm93LCB3ZWlnaHRzLCBnYXBfcGVyY2VudCA9IHRoaXMuY29sX2dhcF9wZXJjZW50ICkge1xyXG5cdFx0XHRjb25zdCByb3cgPSBzZWN0aW9uT3JSb3c/LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fcm93JyApXHJcblx0XHRcdFx0PyBzZWN0aW9uT3JSb3dcclxuXHRcdFx0XHQ6IHNlY3Rpb25PclJvdz8ucXVlcnlTZWxlY3RvciggJzpzY29wZSA+IC53cGJjX2JmYl9fcm93JyApO1xyXG5cclxuXHRcdFx0aWYgKCAhIHJvdyApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNvbHMgPSBBcnJheS5mcm9tKCByb3cucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fY29sdW1uJyApIHx8IFtdICk7XHJcblx0XHRcdGNvbnN0IG4gICAgPSBjb2xzLmxlbmd0aCB8fCAxO1xyXG5cclxuXHRcdFx0aWYgKCAhIEFycmF5LmlzQXJyYXkoIHdlaWdodHMgKSB8fCB3ZWlnaHRzLmxlbmd0aCAhPT0gbiApIHtcclxuXHRcdFx0XHR0aGlzLnNldF9lcXVhbF9iYXNlcyggcm93LCBnYXBfcGVyY2VudCApO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3Qgc3VtICAgICAgID0gd2VpZ2h0cy5yZWR1Y2UoICggYSwgYiApID0+IGEgKyBNYXRoLm1heCggMCwgTnVtYmVyKCBiICkgfHwgMCApLCAwICkgfHwgMTtcclxuXHRcdFx0Y29uc3QgZ3AgICAgICAgID0gTnVtYmVyLmlzRmluaXRlKCArZ2FwX3BlcmNlbnQgKSA/ICtnYXBfcGVyY2VudCA6IDM7XHJcblx0XHRcdGNvbnN0IGF2YWlsYWJsZSA9IE1hdGgubWF4KCAwLCAxMDAgLSBNYXRoLm1heCggMCwgbiAtIDEgKSAqIGdwICk7XHJcblx0XHRcdGNvbnN0IGJhc2VzICAgICA9IHdlaWdodHMubWFwKCAoIHcgKSA9PiBNYXRoLm1heCggMCwgKE51bWJlciggdyApIHx8IDApIC8gc3VtICogYXZhaWxhYmxlICkgKTtcclxuXHJcblx0XHRcdHRoaXMuYXBwbHlfYmFzZXNfdG9fcm93KCByb3csIGJhc2VzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBCdWlsZCBwcmVzZXQgd2VpZ2h0IGxpc3RzIGZvciBhIGdpdmVuIGNvbHVtbiBjb3VudC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gbiAtIENvbHVtbiBjb3VudC5cclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJbXVtdfSBMaXN0IG9mIHdlaWdodCBhcnJheXMuXHJcblx0XHQgKi9cclxuXHRcdGJ1aWxkX3ByZXNldHNfZm9yX2NvbHVtbnMoIG4gKSB7XHJcblx0XHRcdHN3aXRjaCAoIG4gKSB7XHJcblx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0cmV0dXJuIFsgWyAxIF0gXTtcclxuXHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRyZXR1cm4gWyBbIDEsIDIgXSwgWyAyLCAxIF0sIFsgMSwgMyBdLCBbIDMsIDEgXSBdO1xyXG5cdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdHJldHVybiBbIFsgMSwgMywgMSBdLCBbIDEsIDIsIDEgXSwgWyAyLCAxLCAxIF0sIFsgMSwgMSwgMiBdIF07XHJcblx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0cmV0dXJuIFsgWyAxLCAyLCAyLCAxIF0sIFsgMiwgMSwgMSwgMSBdLCBbIDEsIDEsIDEsIDIgXSBdO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRyZXR1cm4gWyBBcnJheSggbiApLmZpbGwoIDEgKSBdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBGb3JtYXQgYSBodW1hbi1yZWFkYWJsZSBsYWJlbCBsaWtlIFwiNTAlLzI1JS8yNSVcIiBmcm9tIHdlaWdodHMuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJbXX0gd2VpZ2h0cyAtIFdlaWdodCBsaXN0LlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gTGFiZWwgc3RyaW5nLlxyXG5cdFx0ICovXHJcblx0XHRmb3JtYXRfcHJlc2V0X2xhYmVsKCB3ZWlnaHRzICkge1xyXG5cdFx0XHRjb25zdCBzdW0gPSB3ZWlnaHRzLnJlZHVjZSggKCBhLCBiICkgPT4gYSArIChOdW1iZXIoIGIgKSB8fCAwKSwgMCApIHx8IDE7XHJcblx0XHRcdHJldHVybiB3ZWlnaHRzLm1hcCggKCB3ICkgPT4gTWF0aC5yb3VuZCggKChOdW1iZXIoIHcgKSB8fCAwKSAvIHN1bSkgKiAxMDAgKSApLmpvaW4oICclLycgKSArICclJztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFBhcnNlIGNvbW1hL3NwYWNlIHNlcGFyYXRlZCB3ZWlnaHRzIGludG8gbnVtYmVycy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgLSBVc2VyIGlucHV0IGxpa2UgXCIyMCw2MCwyMFwiLlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcltdfSBQYXJzZWQgd2VpZ2h0cy5cclxuXHRcdCAqL1xyXG5cdFx0cGFyc2Vfd2VpZ2h0cyggaW5wdXQgKSB7XHJcblx0XHRcdGlmICggISBpbnB1dCApIHtcclxuXHRcdFx0XHRyZXR1cm4gW107XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0cmluZyggaW5wdXQgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvW15cXGQsLlxcc10vZywgJycgKVxyXG5cdFx0XHRcdC5zcGxpdCggL1tcXHMsXSsvIClcclxuXHRcdFx0XHQubWFwKCAoIHMgKSA9PiBwYXJzZUZsb2F0KCBzICkgKVxyXG5cdFx0XHRcdC5maWx0ZXIoICggbiApID0+IE51bWJlci5pc0Zpbml0ZSggbiApICYmIG4gPj0gMCApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFdQQkMgVXNhZ2UgTGltaXQgc2VydmljZS5cclxuXHQgKiBDb3VudHMgZmllbGQgdXNhZ2UgYnkga2V5LCBjb21wYXJlcyB0byBwYWxldHRlIGxpbWl0cywgYW5kIHVwZGF0ZXMgcGFsZXR0ZSBVSS5cclxuXHQgKi9cclxuXHRDb3JlLldQQkNfQkZCX1VzYWdlTGltaXRTZXJ2aWNlID0gY2xhc3MgIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENvbnN0cnVjdG9yLiBTZXQgcGFnZXNfY29udGFpbmVyIGFuZCBwYWxldHRlX3VsLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhZ2VzX2NvbnRhaW5lciAtIENhbnZhcyByb290IHRoYXQgaG9sZHMgcGxhY2VkIGZpZWxkcy5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXXxudWxsfSBwYWxldHRlX3Vscz86ICAgUGFsZXR0ZXMgVUwgd2l0aCAud3BiY19iZmJfX2ZpZWxkIGl0ZW1zIChtYXkgYmUgbnVsbCkuXHJcblx0XHQgKi9cclxuXHRcdGNvbnN0cnVjdG9yKHBhZ2VzX2NvbnRhaW5lciwgcGFsZXR0ZV91bHMpIHtcclxuXHRcdFx0dGhpcy5wYWdlc19jb250YWluZXIgPSBwYWdlc19jb250YWluZXI7XHJcblx0XHRcdC8vIE5vcm1hbGl6ZSB0byBhbiBhcnJheTsgd2XigJlsbCBzdGlsbCBiZSByb2J1c3QgaWYgbm9uZSBwcm92aWRlZC5cclxuXHRcdFx0dGhpcy5wYWxldHRlX3VscyAgICAgPSBBcnJheS5pc0FycmF5KCBwYWxldHRlX3VscyApID8gcGFsZXR0ZV91bHMgOiAocGFsZXR0ZV91bHMgPyBbIHBhbGV0dGVfdWxzIF0gOiBbXSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUGFyc2UgdXNhZ2UgbGltaXQgZnJvbSByYXcgZGF0YXNldCB2YWx1ZS4gTWlzc2luZy9pbnZhbGlkIC0+IEluZmluaXR5LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcnxudWxsfHVuZGVmaW5lZH0gcmF3IC0gUmF3IGF0dHJpYnV0ZSB2YWx1ZS5cclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJ9IExpbWl0IG51bWJlciBvciBJbmZpbml0eS5cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHBhcnNlX3VzYWdlX2xpbWl0KCByYXcgKSB7XHJcblx0XHRcdGlmICggcmF3ID09IG51bGwgKSB7XHJcblx0XHRcdFx0cmV0dXJuIEluZmluaXR5O1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IG4gPSBwYXJzZUludCggcmF3LCAxMCApO1xyXG5cdFx0XHRyZXR1cm4gTnVtYmVyLmlzRmluaXRlKCBuICkgPyBuIDogSW5maW5pdHk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb3VudCBob3cgbWFueSBpbnN0YW5jZXMgZXhpc3QgcGVyIHVzYWdlX2tleSBpbiB0aGUgY2FudmFzLlxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBudW1iZXI+fSBNYXAgb2YgdXNhZ2Vfa2V5IC0+IGNvdW50LlxyXG5cdFx0ICovXHJcblx0XHRjb3VudF91c2FnZV9ieV9rZXkoKSB7XHJcblx0XHRcdGNvbnN0IHVzZWQgPSB7fTtcclxuXHRcdFx0Y29uc3QgYWxsICA9IHRoaXMucGFnZXNfY29udGFpbmVyPy5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkOm5vdCguaXMtaW52YWxpZCknICkgfHwgW107XHJcblx0XHRcdGFsbC5mb3JFYWNoKCAoIGVsICkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGtleSA9IGVsLmRhdGFzZXQudXNhZ2Vfa2V5IHx8IGVsLmRhdGFzZXQudHlwZSB8fCBlbC5kYXRhc2V0LmlkO1xyXG5cdFx0XHRcdGlmICggISBrZXkgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHVzZWRba2V5XSA9ICh1c2VkW2tleV0gfHwgMCkgKyAxO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdHJldHVybiB1c2VkO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJuIHBhbGV0dGUgbGltaXQgZm9yIGEgZ2l2ZW4gdXNhZ2Uga2V5IChpZCBvZiB0aGUgcGFsZXR0ZSBpdGVtKS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVXNhZ2Uga2V5LlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gTGltaXQgdmFsdWUgb3IgSW5maW5pdHkuXHJcblx0XHQgKi9cclxuXHRcdGdldF9saW1pdF9mb3Jfa2V5KGtleSkge1xyXG5cdFx0XHRpZiAoICEga2V5ICkge1xyXG5cdFx0XHRcdHJldHVybiBJbmZpbml0eTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBRdWVyeSBhY3Jvc3MgYWxsIHBhbGV0dGVzIHByZXNlbnQgbm93IChzdG9yZWQgKyBhbnkgbmV3bHkgYWRkZWQgaW4gRE9NKS5cclxuXHRcdFx0Y29uc3Qgcm9vdHMgICAgICAgICAgICA9IHRoaXMucGFsZXR0ZV91bHM/Lmxlbmd0aCA/IHRoaXMucGFsZXR0ZV91bHMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19wYW5lbF9maWVsZF90eXBlc19fdWwnICk7XHJcblx0XHRcdGNvbnN0IGFsbFBhbGV0dGVGaWVsZHMgPSBBcnJheS5mcm9tKCByb290cyApLmZsYXRNYXAoIHIgPT4gQXJyYXkuZnJvbSggci5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19maWVsZCcgKSApICk7XHJcblx0XHRcdGxldCBsaW1pdCAgICAgICAgICAgICAgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGFsbFBhbGV0dGVGaWVsZHMuZm9yRWFjaCggKGVsKSA9PiB7XHJcblx0XHRcdFx0aWYgKCBlbC5kYXRhc2V0LmlkID09PSBrZXkgKSB7XHJcblx0XHRcdFx0XHRjb25zdCBuID0gQ29yZS5XUEJDX0JGQl9Vc2FnZUxpbWl0U2VydmljZS5wYXJzZV91c2FnZV9saW1pdCggZWwuZGF0YXNldC51c2FnZW51bWJlciApO1xyXG5cdFx0XHRcdFx0Ly8gQ2hvb3NlIHRoZSBzbWFsbGVzdCBmaW5pdGUgbGltaXQgKHNhZmVzdCBpZiBwYWxldHRlcyBkaXNhZ3JlZSkuXHJcblx0XHRcdFx0XHRpZiAoIG4gPCBsaW1pdCApIHtcclxuXHRcdFx0XHRcdFx0bGltaXQgPSBuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0cmV0dXJuIGxpbWl0O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERpc2FibGUvZW5hYmxlIHBhbGV0dGUgaXRlbXMgYmFzZWQgb24gY3VycmVudCB1c2FnZSBjb3VudHMgYW5kIGxpbWl0cy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0dXBkYXRlX3BhbGV0dGVfdWkoKSB7XHJcblx0XHRcdC8vIEFsd2F5cyBjb21wdXRlIHVzYWdlIGZyb20gdGhlIGNhbnZhczpcclxuXHRcdFx0Y29uc3QgdXNhZ2UgPSB0aGlzLmNvdW50X3VzYWdlX2J5X2tleSgpO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIGFsbCBwYWxldHRlcyBjdXJyZW50bHkgaW4gRE9NIChub3QganVzdCB0aGUgaW5pdGlhbGx5IGNhcHR1cmVkIG9uZXMpXHJcblx0XHRcdGNvbnN0IHBhbGV0dGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX2JmYl9fcGFuZWxfZmllbGRfdHlwZXNfX3VsJyApO1xyXG5cclxuXHRcdFx0cGFsZXR0ZXMuZm9yRWFjaCggKHBhbCkgPT4ge1xyXG5cdFx0XHRcdHBhbC5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19maWVsZCcgKS5mb3JFYWNoKCAocGFuZWxfZmllbGQpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IHBhbGV0dGVJZCAgID0gcGFuZWxfZmllbGQuZGF0YXNldC5pZDtcclxuXHRcdFx0XHRcdGNvbnN0IHJhd19saW1pdCAgID0gcGFuZWxfZmllbGQuZGF0YXNldC51c2FnZW51bWJlcjtcclxuXHRcdFx0XHRcdGNvbnN0IHBlckVsTGltaXQgID0gQ29yZS5XUEJDX0JGQl9Vc2FnZUxpbWl0U2VydmljZS5wYXJzZV91c2FnZV9saW1pdCggcmF3X2xpbWl0ICk7XHJcblx0XHRcdFx0XHQvLyBFZmZlY3RpdmUgbGltaXQgYWNyb3NzIGFsbCBwYWxldHRlcyBpcyB0aGUgZ2xvYmFsIGxpbWl0IGZvciB0aGlzIGtleS5cclxuXHRcdFx0XHRcdGNvbnN0IGdsb2JhbExpbWl0ID0gdGhpcy5nZXRfbGltaXRfZm9yX2tleSggcGFsZXR0ZUlkICk7XHJcblx0XHRcdFx0XHRjb25zdCBsaW1pdCAgICAgICA9IE51bWJlci5pc0Zpbml0ZSggZ2xvYmFsTGltaXQgKSA/IGdsb2JhbExpbWl0IDogcGVyRWxMaW1pdDsgLy8gcHJlZmVyIGdsb2JhbCBtaW5cclxuXHJcblx0XHRcdFx0XHRjb25zdCBjdXJyZW50ID0gdXNhZ2VbcGFsZXR0ZUlkXSB8fCAwO1xyXG5cdFx0XHRcdFx0Y29uc3QgZGlzYWJsZSA9IE51bWJlci5pc0Zpbml0ZSggbGltaXQgKSAmJiBjdXJyZW50ID49IGxpbWl0O1xyXG5cclxuXHRcdFx0XHRcdHBhbmVsX2ZpZWxkLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBkaXNhYmxlID8gJ25vbmUnIDogJyc7XHJcblx0XHRcdFx0XHRwYW5lbF9maWVsZC5zdHlsZS5vcGFjaXR5ICAgICAgID0gZGlzYWJsZSA/ICcwLjQnIDogJyc7XHJcblx0XHRcdFx0XHRwYW5lbF9maWVsZC5zZXRBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJywgZGlzYWJsZSA/ICd0cnVlJyA6ICdmYWxzZScgKTtcclxuXHRcdFx0XHRcdGlmICggZGlzYWJsZSApIHtcclxuXHRcdFx0XHRcdFx0cGFuZWxfZmllbGQuc2V0QXR0cmlidXRlKCAndGFiaW5kZXgnLCAnLTEnICk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwYW5lbF9maWVsZC5yZW1vdmVBdHRyaWJ1dGUoICd0YWJpbmRleCcgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm4gaG93IG1hbnkgdmFsaWQgaW5zdGFuY2VzIHdpdGggdGhpcyB1c2FnZSBrZXkgZXhpc3QgaW4gdGhlIGNhbnZhcy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVXNhZ2Uga2V5IG9mIGEgcGFsZXR0ZSBpdGVtLlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gQ291bnQgb2YgZXhpc3Rpbmcgbm9uLWludmFsaWQgaW5zdGFuY2VzLlxyXG5cdFx0ICovXHJcblx0XHRjb3VudF9mb3Jfa2V5KCBrZXkgKSB7XHJcblx0XHRcdGlmICggISBrZXkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICggdGhpcy5wYWdlc19jb250YWluZXI/LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICBgLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkW2RhdGEtdXNhZ2Vfa2V5PVwiJHtDb3JlLldQQkNfQkZCX1Nhbml0aXplLmVzY19hdHRyX3ZhbHVlX2Zvcl9zZWxlY3Rvcigga2V5ICl9XCJdOm5vdCguaXMtaW52YWxpZCksIFxyXG4gICAgICAgICAgICAgICAgIC53cGJjX2JmYl9fcGFuZWwtLXByZXZpZXcgLndwYmNfYmZiX19maWVsZFtkYXRhLXR5cGU9XCIke0NvcmUuV1BCQ19CRkJfU2FuaXRpemUuZXNjX2F0dHJfdmFsdWVfZm9yX3NlbGVjdG9yKCBrZXkgKX1cIl06bm90KC5pcy1pbnZhbGlkKWBcclxuXHRcdFx0KSB8fCBbXSApLmxlbmd0aDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFsaWFzIGZvciBsaW1pdCBsb29rdXAgKHJlYWRhYmlsaXR5KS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVXNhZ2Uga2V5IG9mIGEgcGFsZXR0ZSBpdGVtLlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gTGltaXQgdmFsdWUgb3IgSW5maW5pdHkuXHJcblx0XHQgKi9cclxuXHRcdGxpbWl0X2Zvcl9rZXkoIGtleSApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0X2xpbWl0X2Zvcl9rZXkoIGtleSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVtYWluaW5nIHNsb3RzIGZvciB0aGlzIGtleSAoSW5maW5pdHkgaWYgdW5saW1pdGVkKS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVXNhZ2Uga2V5IG9mIGEgcGFsZXR0ZSBpdGVtLlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gUmVtYWluaW5nIGNvdW50ICg+PSAwKSBvciBJbmZpbml0eS5cclxuXHRcdCAqL1xyXG5cdFx0cmVtYWluaW5nX2Zvcl9rZXkoIGtleSApIHtcclxuXHRcdFx0Y29uc3QgbGltaXQgPSB0aGlzLmxpbWl0X2Zvcl9rZXkoIGtleSApO1xyXG5cdFx0XHRpZiAoIGxpbWl0ID09PSBJbmZpbml0eSApIHtcclxuXHRcdFx0XHRyZXR1cm4gSW5maW5pdHk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgdXNlZCA9IHRoaXMuY291bnRfZm9yX2tleSgga2V5ICk7XHJcblx0XHRcdHJldHVybiBNYXRoLm1heCggMCwgbGltaXQgLSB1c2VkICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUcnVlIGlmIHlvdSBjYW4gYWRkIGBkZWx0YWAgbW9yZSBpdGVtcyBmb3IgdGhpcyBrZXkuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFVzYWdlIGtleSBvZiBhIHBhbGV0dGUgaXRlbS5cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsdGE9MV0gLSBIb3cgbWFueSBpdGVtcyB5b3UgaW50ZW5kIHRvIGFkZC5cclxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIGFkZGluZyBpcyBhbGxvd2VkLlxyXG5cdFx0ICovXHJcblx0XHRjYW5fYWRkKCBrZXksIGRlbHRhID0gMSApIHtcclxuXHRcdFx0Y29uc3QgcmVtID0gdGhpcy5yZW1haW5pbmdfZm9yX2tleSgga2V5ICk7XHJcblx0XHRcdHJldHVybiAoIHJlbSA9PT0gSW5maW5pdHkgKSA/IHRydWUgOiAoIHJlbSA+PSBkZWx0YSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVUktZmFjaW5nIGdhdGU6IGFsZXJ0IHdoZW4gZXhjZWVkZWQuIFJldHVybnMgYm9vbGVhbiBhbGxvd2VkL2Jsb2NrZWQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFVzYWdlIGtleSBvZiBhIHBhbGV0dGUgaXRlbS5cclxuXHRcdCAqIEBwYXJhbSB7e2xhYmVsPzogc3RyaW5nLCBkZWx0YT86IG51bWJlcn19IFtvcHRzPXt9XSAtIE9wdGlvbmFsIFVJIGluZm8uXHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBhbGxvd2VkLCBmYWxzZSBpZiBibG9ja2VkLlxyXG5cdFx0ICovXHJcblx0XHRnYXRlX29yX2FsZXJ0KCBrZXksIHsgbGFiZWwgPSBrZXksIGRlbHRhID0gMSB9ID0ge30gKSB7XHJcblx0XHRcdGlmICggdGhpcy5jYW5fYWRkKCBrZXksIGRlbHRhICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgbGltaXQgPSB0aGlzLmxpbWl0X2Zvcl9rZXkoIGtleSApO1xyXG5cdFx0XHRhbGVydCggYE9ubHkgJHtsaW1pdH0gaW5zdGFuY2Uke2xpbWl0ID4gMSA/ICdzJyA6ICcnfSBvZiBcIiR7bGFiZWx9XCIgYWxsb3dlZC5gICk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEJhY2t3YXJkLWNvbXBhdGlibGUgYWxpYXMgdXNlZCBlbHNld2hlcmUgaW4gdGhlIGNvZGViYXNlLiAgLSBDaGVjayB3aGV0aGVyIGFub3RoZXIgaW5zdGFuY2Ugd2l0aCB0aGUgZ2l2ZW4gdXNhZ2Uga2V5IGNhbiBiZSBhZGRlZC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVXNhZ2Uga2V5IG9mIGEgcGFsZXR0ZSBpdGVtLlxyXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgYWRkaW5nIG9uZSBtb3JlIGlzIGFsbG93ZWQuXHJcblx0XHQgKi9cclxuXHRcdGlzX3VzYWdlX29rKCBrZXkgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNhbl9hZGQoIGtleSwgMSApO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDb25zdGFudCBldmVudCBuYW1lcyBmb3IgdGhlIGJ1aWxkZXIuXHJcblx0ICovXHJcblx0Q29yZS5XUEJDX0JGQl9FdmVudHMgPSBPYmplY3QuZnJlZXplKHtcclxuXHRcdFNFTEVDVCAgICAgICAgICAgIDogJ3dwYmM6YmZiOnNlbGVjdCcsXHJcblx0XHRDTEVBUl9TRUxFQ1RJT04gICA6ICd3cGJjOmJmYjpjbGVhci1zZWxlY3Rpb24nLFxyXG5cdFx0RklFTERfQUREICAgICAgICAgOiAnd3BiYzpiZmI6ZmllbGQ6YWRkJyxcclxuXHRcdEZJRUxEX1JFTU9WRSAgICAgIDogJ3dwYmM6YmZiOmZpZWxkOnJlbW92ZScsXHJcblx0XHRTVFJVQ1RVUkVfQ0hBTkdFICA6ICd3cGJjOmJmYjpzdHJ1Y3R1cmU6Y2hhbmdlJyxcclxuXHRcdFNUUlVDVFVSRV9MT0FERUQgIDogJ3dwYmM6YmZiOnN0cnVjdHVyZTpsb2FkZWQnXHJcblx0fSk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExpZ2h0d2VpZ2h0IGV2ZW50IGJ1cyB0aGF0IGVtaXRzIHRvIGJvdGggdGhlIHBhZ2VzIGNvbnRhaW5lciBhbmQgZG9jdW1lbnQuXHJcblx0ICovXHJcblx0Q29yZS5XUEJDX0JGQl9FdmVudEJ1cyA9ICBjbGFzcyB7XHJcblx0XHQvKipcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNjb3BlX2VsIC0gRWxlbWVudCB0byBkaXNwYXRjaCBidWJibGVkIGV2ZW50cyBmcm9tLlxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3Rvciggc2NvcGVfZWwgKSB7XHJcblx0XHRcdHRoaXMuc2NvcGVfZWwgPSBzY29wZV9lbDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEVtaXQgYSBET00gQ3VzdG9tRXZlbnQgd2l0aCBwYXlsb2FkLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gRXZlbnQgdHlwZSAodXNlIENvcmUuV1BCQ19CRkJfRXZlbnRzLiB3aGVuIHBvc3NpYmxlKS5cclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbZGV0YWlsPXt9XSAtIEFyYml0cmFyeSBzZXJpYWxpemFibGUgcGF5bG9hZC5cclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHRlbWl0KCB0eXBlLCBkZXRhaWwgPSB7fSApIHtcclxuXHRcdFx0aWYgKCAhIHRoaXMuc2NvcGVfZWwgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc2NvcGVfZWwuZGlzcGF0Y2hFdmVudCggbmV3IEN1c3RvbUV2ZW50KCB0eXBlLCB7IGRldGFpbDogeyAuLi5kZXRhaWwgfSwgYnViYmxlczogdHJ1ZSB9ICkgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN1YnNjcmliZSB0byBhbiBldmVudCBvbiBkb2N1bWVudC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIEV2ZW50IHR5cGUuXHJcblx0XHQgKiBAcGFyYW0geyhldjpDdXN0b21FdmVudCk9PnZvaWR9IGhhbmRsZXIgLSBIYW5kbGVyIGZ1bmN0aW9uLlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdG9uKCB0eXBlLCBoYW5kbGVyICkge1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBoYW5kbGVyICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBVbnN1YnNjcmliZSBmcm9tIGFuIGV2ZW50IG9uIGRvY3VtZW50LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gRXZlbnQgdHlwZS5cclxuXHRcdCAqIEBwYXJhbSB7KGV2OkN1c3RvbUV2ZW50KT0+dm9pZH0gaGFuZGxlciAtIEhhbmRsZXIgZnVuY3Rpb24uXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0b2ZmKCB0eXBlLCBoYW5kbGVyICkge1xyXG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBoYW5kbGVyICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU29ydGFibGVKUyBtYW5hZ2VyOiBzaW5nbGUgcG9pbnQgZm9yIGNvbnNpc3RlbnQgRG5EIGNvbmZpZy5cclxuXHQgKi9cclxuXHRDb3JlLldQQkNfQkZCX1NvcnRhYmxlTWFuYWdlciA9IGNsYXNzICB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcGFyYW0ge1dQQkNfRm9ybV9CdWlsZGVyfSBidWlsZGVyIC0gVGhlIGFjdGl2ZSBidWlsZGVyIGluc3RhbmNlLlxyXG5cdFx0ICogQHBhcmFtIHt7IGdyb3VwTmFtZT86IHN0cmluZywgYW5pbWF0aW9uPzogbnVtYmVyLCBnaG9zdENsYXNzPzogc3RyaW5nLCBjaG9zZW5DbGFzcz86IHN0cmluZywgZHJhZ0NsYXNzPzogc3RyaW5nIH19IFtvcHRzPXt9XSAtIFZpc3VhbC9iZWhhdmlvciBvcHRpb25zLlxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3RvciggYnVpbGRlciwgb3B0cyA9IHt9ICkge1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIgPSBidWlsZGVyO1xyXG5cdFx0XHRjb25zdCBnaWQgPSB0aGlzLmJ1aWxkZXI/Lmluc3RhbmNlX2lkIHx8IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoIDM2ICkuc2xpY2UoIDIsIDggKTtcclxuXHRcdFx0dGhpcy5vcHRzID0ge1xyXG5cdFx0XHRcdC8vIGdyb3VwTmFtZSAgOiAnZm9ybScsXHJcblx0XHRcdFx0Z3JvdXBOYW1lOiBgZm9ybS0ke2dpZH1gLFxyXG5cdFx0XHRcdGFuaW1hdGlvbiAgOiAxNTAsXHJcblx0XHRcdFx0Z2hvc3RDbGFzcyA6ICd3cGJjX2JmYl9fZHJhZy1naG9zdCcsXHJcblx0XHRcdFx0Y2hvc2VuQ2xhc3M6ICd3cGJjX2JmYl9faGlnaGxpZ2h0JyxcclxuXHRcdFx0XHRkcmFnQ2xhc3MgIDogJ3dwYmNfYmZiX19kcmFnLWFjdGl2ZScsXHJcblx0XHRcdFx0Li4ub3B0c1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKiogQHR5cGUge1NldDxIVE1MRWxlbWVudD59ICovXHJcblx0XHRcdHRoaXMuX2NvbnRhaW5lcnMgPSBuZXcgU2V0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUYWcgdGhlIGRyYWcgbWlycm9yIChlbGVtZW50IHVuZGVyIGN1cnNvcikgd2l0aCByb2xlOiAncGFsZXR0ZScgfCAnY2FudmFzJy5cclxuXHRcdCAqIFdvcmtzIHdpdGggU29ydGFibGUncyBmYWxsYmFjayBtaXJyb3IgKC5zb3J0YWJsZS1mYWxsYmFjayAvIC5zb3J0YWJsZS1kcmFnKSBhbmQgd2l0aCB5b3VyIGRyYWdDbGFzcyAoLndwYmNfYmZiX19kcmFnLWFjdGl2ZSkuXHJcblx0XHQgKi9cclxuXHRcdF90YWdfZHJhZ19taXJyb3IoIGV2dCApIHtcclxuXHRcdFx0Y29uc3QgZnJvbVBhbGV0dGUgPSB0aGlzLmJ1aWxkZXI/LnBhbGV0dGVfdWxzPy5pbmNsdWRlcz8uKCBldnQuZnJvbSApO1xyXG5cdFx0XHRjb25zdCByb2xlICAgICAgICA9IGZyb21QYWxldHRlID8gJ3BhbGV0dGUnIDogJ2NhbnZhcyc7XHJcblx0XHRcdC8vIFdhaXQgYSB0aWNrIHNvIHRoZSBtaXJyb3IgZXhpc3RzLiAgLSBUaGUgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgpIG1ldGhvZCB0ZWxscyB0aGUgYnJvd3NlciB5b3Ugd2lzaCB0byBwZXJmb3JtIGFuIGFuaW1hdGlvbi5cclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgbWlycm9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5zb3J0YWJsZS1mYWxsYmFjaywgLnNvcnRhYmxlLWRyYWcsIC4nICsgdGhpcy5vcHRzLmRyYWdDbGFzcyApO1xyXG5cdFx0XHRcdGlmICggbWlycm9yICkge1xyXG5cdFx0XHRcdFx0bWlycm9yLnNldEF0dHJpYnV0ZSggJ2RhdGEtZHJhZy1yb2xlJywgcm9sZSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90b2dnbGVfZG5kX3Jvb3RfZmxhZ3MoIGFjdGl2ZSwgZnJvbV9wYWxldHRlID0gZmFsc2UgKSB7XHJcblxyXG5cdFx0XHQvLyBzZXQgdG8gcm9vdCBlbGVtZW50IG9mIGFuIEhUTUwgZG9jdW1lbnQsIHdoaWNoIGlzIHRoZSA8aHRtbD4uXHJcblx0XHRcdGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblx0XHRcdGlmICggYWN0aXZlICkge1xyXG5cdFx0XHRcdHJvb3QuY2xhc3NMaXN0LmFkZCggJ3dwYmNfYmZiX19kbmQtYWN0aXZlJyApO1xyXG5cdFx0XHRcdGlmICggZnJvbV9wYWxldHRlICkge1xyXG5cdFx0XHRcdFx0cm9vdC5jbGFzc0xpc3QuYWRkKCAnd3BiY19iZmJfX2RyYWctZnJvbS1wYWxldHRlJyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyb290LmNsYXNzTGlzdC5yZW1vdmUoICd3cGJjX2JmYl9fZG5kLWFjdGl2ZScsICd3cGJjX2JmYl9fZHJhZy1mcm9tLXBhbGV0dGUnICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBFbnN1cmUgU29ydGFibGUgaXMgYXR0YWNoZWQgdG8gYSBjb250YWluZXIgd2l0aCByb2xlICdwYWxldHRlJyBvciAnY2FudmFzJy5cclxuXHRcdCAqXHJcblx0XHQgKiAgLS0gSGFuZGxlIHNlbGVjdG9yczogaGFuZGxlOiAgJy5zZWN0aW9uLWRyYWctaGFuZGxlLCAud3BiY19iZmJfX2RyYWctaGFuZGxlLCAud3BiY19iZmJfX2RyYWctYW55d2hlcmUsIFtkYXRhLWRyYWdnYWJsZT1cInRydWVcIl0nXHJcblx0XHQgKiAgLS0gRHJhZ2dhYmxlIGdhdGU6IGRyYWdnYWJsZTogJy53cGJjX2JmYl9fZmllbGQ6bm90KFtkYXRhLWRyYWdnYWJsZT1cImZhbHNlXCJdKSwgLndwYmNfYmZiX19zZWN0aW9uJ1xyXG5cdFx0ICogIC0tIEZpbHRlciAob3ZlcmxheS1zYWZlKTogICAgIGlnbm9yZSBldmVyeXRoaW5nIGluIG92ZXJsYXkgZXhjZXB0IHRoZSBoYW5kbGUgLSAgJy53cGJjX2JmYl9fb3ZlcmxheS1jb250cm9scyAqOm5vdCgud3BiY19iZmJfX2RyYWctaGFuZGxlKTpub3QoLnNlY3Rpb24tZHJhZy1oYW5kbGUpOm5vdCgud3BiY19pY25fZHJhZ19pbmRpY2F0b3IpJ1xyXG5cdFx0ICogIC0tIE5vLWRyYWcgd3JhcHBlcjogICAgICAgICAgIHVzZSAud3BiY19iZmJfX25vLWRyYWctem9uZSBpbnNpZGUgcmVuZGVyZXJzIGZvciBpbnB1dHMvd2lkZ2V0cy5cclxuXHRcdCAqICAtLSBGb2N1cyBndWFyZCAob3B0aW9uYWwpOiAgICBmbGlwIFtkYXRhLWRyYWdnYWJsZV0gb24gZm9jdXNpbi9mb2N1c291dCB0byBwcmV2ZW50IGFjY2lkZW50YWwgZHJhZ3Mgd2hpbGUgdHlwaW5nLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBlbGVtZW50IHRvIGVuaGFuY2Ugd2l0aCBTb3J0YWJsZS5cclxuXHRcdCAqIEBwYXJhbSB7J3BhbGV0dGUnfCdjYW52YXMnfSByb2xlIC0gQmVoYXZpb3IgcHJvZmlsZSB0byBhcHBseS5cclxuXHRcdCAqIEBwYXJhbSB7eyBvbkFkZD86IEZ1bmN0aW9uIH19IFtoYW5kbGVycz17fV0gLSBPcHRpb25hbCBoYW5kbGVycy5cclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHRlbnN1cmUoIGNvbnRhaW5lciwgcm9sZSwgaGFuZGxlcnMgPSB7fSApIHtcclxuXHRcdFx0aWYgKCAhIGNvbnRhaW5lciB8fCB0eXBlb2YgU29ydGFibGUgPT09ICd1bmRlZmluZWQnICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIFNvcnRhYmxlLmdldD8uKCBjb250YWluZXIgKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNvbW1vbiA9IHtcclxuXHRcdFx0XHRhbmltYXRpb24gIDogdGhpcy5vcHRzLmFuaW1hdGlvbixcclxuXHRcdFx0XHRnaG9zdENsYXNzIDogdGhpcy5vcHRzLmdob3N0Q2xhc3MsXHJcblx0XHRcdFx0Y2hvc2VuQ2xhc3M6IHRoaXMub3B0cy5jaG9zZW5DbGFzcyxcclxuXHRcdFx0XHRkcmFnQ2xhc3MgIDogdGhpcy5vcHRzLmRyYWdDbGFzcyxcclxuXHRcdFx0XHQvLyA9PSBFbGVtZW50IHVuZGVyIHRoZSBjdXJzb3IgID09IEVuc3VyZSB3ZSBkcmFnIGEgcmVhbCBET00gbWlycm9yIHlvdSBjYW4gc3R5bGUgdmlhIENTUyAoY3Jvc3MtYnJvd3NlcikuXHJcblx0XHRcdFx0Zm9yY2VGYWxsYmFjayAgICA6IHRydWUsXHJcblx0XHRcdFx0ZmFsbGJhY2tPbkJvZHkgICA6IHRydWUsXHJcblx0XHRcdFx0ZmFsbGJhY2tUb2xlcmFuY2U6IDYsXHJcblx0XHRcdFx0Ly8gQWRkIGJvZHkvaHRtbCBmbGFncyBzbyB5b3UgY2FuIHN0eWxlIGRpZmZlcmVudGx5IHdoZW4gZHJhZ2dpbmcgZnJvbSBwYWxldHRlLlxyXG5cdFx0XHRcdG9uU3RhcnQ6IChldnQpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuYnVpbGRlcj8uX2FkZF9kcmFnZ2luZ19jbGFzcz8uKCk7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgZnJvbVBhbGV0dGUgPSB0aGlzLmJ1aWxkZXI/LnBhbGV0dGVfdWxzPy5pbmNsdWRlcz8uKCBldnQuZnJvbSApO1xyXG5cdFx0XHRcdFx0dGhpcy5fdG9nZ2xlX2RuZF9yb290X2ZsYWdzKCB0cnVlLCBmcm9tUGFsZXR0ZSApOyAgLy8gc2V0IHRvIHJvb3QgSFRNTCBkb2N1bWVudDogaHRtbC53cGJjX2JmYl9fZG5kLWFjdGl2ZS53cGJjX2JmYl9fZHJhZy1mcm9tLXBhbGV0dGUgLlxyXG5cclxuXHRcdFx0XHRcdHRoaXMuX3RhZ19kcmFnX21pcnJvciggZXZ0ICk7ICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCAnZGF0YS1kcmFnLXJvbGUnIGF0dHJpYnV0ZSB0byAgZWxlbWVudCB1bmRlciBjdXJzb3IuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRvbkVuZCAgOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IHRoaXMuYnVpbGRlci5fcmVtb3ZlX2RyYWdnaW5nX2NsYXNzKCk7IH0sIDUwICk7XHJcblx0XHRcdFx0XHR0aGlzLl90b2dnbGVfZG5kX3Jvb3RfZmxhZ3MoIGZhbHNlICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCByb2xlID09PSAncGFsZXR0ZScgKSB7XHJcblx0XHRcdFx0U29ydGFibGUuY3JlYXRlKCBjb250YWluZXIsIHtcclxuXHRcdFx0XHRcdC4uLmNvbW1vbixcclxuXHRcdFx0XHRcdGdyb3VwICAgOiB7IG5hbWU6IHRoaXMub3B0cy5ncm91cE5hbWUsIHB1bGw6ICdjbG9uZScsIHB1dDogZmFsc2UgfSxcclxuXHRcdFx0XHRcdHNvcnQgICAgOiBmYWxzZVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR0aGlzLl9jb250YWluZXJzLmFkZCggY29udGFpbmVyICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByb2xlID09PSAnY2FudmFzJy5cclxuXHRcdFx0U29ydGFibGUuY3JlYXRlKCBjb250YWluZXIsIHtcclxuXHRcdFx0XHQuLi5jb21tb24sXHJcblx0XHRcdFx0Z3JvdXAgICAgOiB7XHJcblx0XHRcdFx0XHRuYW1lOiB0aGlzLm9wdHMuZ3JvdXBOYW1lLFxyXG5cdFx0XHRcdFx0cHVsbDogdHJ1ZSxcclxuXHRcdFx0XHRcdHB1dCA6ICh0bywgZnJvbSwgZHJhZ2dlZEVsKSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBkcmFnZ2VkRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX2ZpZWxkJyApIHx8XHJcblx0XHRcdFx0XHRcdFx0ICAgZHJhZ2dlZEVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Ly8gLS0tLS0tLS0tLSBEbkQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0gICAgICAgICAgICAgICAgLy8gR3JhYiBhbnl3aGVyZSBvbiBmaWVsZHMgdGhhdCBvcHQtaW4gd2l0aCB0aGUgY2xhc3Mgb3IgYXR0cmlidXRlLiAgLSBTZWN0aW9ucyBzdGlsbCByZXF1aXJlIHRoZWlyIGRlZGljYXRlZCBoYW5kbGUuXHJcblx0XHRcdFx0aGFuZGxlICAgOiAnLnNlY3Rpb24tZHJhZy1oYW5kbGUsIC53cGJjX2JmYl9fZHJhZy1oYW5kbGUsIC53cGJjX2JmYl9fZHJhZy1hbnl3aGVyZSwgW2RhdGEtZHJhZ2dhYmxlPVwidHJ1ZVwiXScsXHJcblx0XHRcdFx0ZHJhZ2dhYmxlOiAnLndwYmNfYmZiX19maWVsZDpub3QoW2RhdGEtZHJhZ2dhYmxlPVwiZmFsc2VcIl0pLCAud3BiY19iZmJfX3NlY3Rpb24nLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlci1maWVsZCBvcHQtb3V0IHdpdGggW2RhdGEtZHJhZ2dhYmxlPVwiZmFsc2VcIl0gKGUuZy4sIHdoaWxlIGVkaXRpbmcpLlxyXG5cdFx0XHRcdC8vIC0tLS0tLS0tLS0gRmlsdGVycyAtIE5vIERuRCAtLS0tLS0tLS0tICAgICAgICAgICAgICAgIC8vIERlY2xhcmF0aXZlIOKAnG5vLWRyYWcgem9uZXPigJ06IGFueXRoaW5nIGluc2lkZSB0aGVzZSB3cmFwcGVycyB3b27igJl0IHN0YXJ0IGEgZHJhZy5cclxuXHRcdFx0XHRmaWx0ZXI6IFtcclxuXHRcdFx0XHRcdCcud3BiY19iZmJfX25vLWRyYWctem9uZScsXHJcblx0XHRcdFx0XHQnLndwYmNfYmZiX19uby1kcmFnLXpvbmUgKicsXHJcblx0XHRcdFx0XHQnLndwYmNfYmZiX19jb2x1bW4tcmVzaXplcicsICAvLyBJZ25vcmUgdGhlIHJlc2l6ZXIgcmFpbHMgZHVyaW5nIERuRCAocHJldmVudHMgZWRnZSDigJxzbmFw4oCdKS5cclxuXHRcdFx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluIHRoZSBvdmVybGF5IHRvb2xiYXIsIGJsb2NrIGV2ZXJ5dGhpbmcgRVhDRVBUIHRoZSBkcmFnIGhhbmRsZSAoYW5kIGl0cyBpY29uKS5cclxuXHRcdFx0XHRcdCcud3BiY19iZmJfX292ZXJsYXktY29udHJvbHMgKjpub3QoLndwYmNfYmZiX19kcmFnLWhhbmRsZSk6bm90KC5zZWN0aW9uLWRyYWctaGFuZGxlKTpub3QoLndwYmNfaWNuX2RyYWdfaW5kaWNhdG9yKSdcclxuXHRcdFx0XHRdLmpvaW4oICcsJyApLFxyXG5cdFx0XHRcdHByZXZlbnRPbkZpbHRlciAgOiBmYWxzZSxcclxuXHRcdFx0XHRcdC8vIC0tLS0tLS0tLS0gYW50aS1qaXR0ZXIgdHVuaW5nIC0tLS0tLS0tLS1cclxuXHRcdFx0XHRkaXJlY3Rpb24gICAgICAgICAgICA6ICd2ZXJ0aWNhbCcsICAgICAgICAgICAvLyBjb2x1bW5zIGFyZSB2ZXJ0aWNhbCBsaXN0cy5cclxuXHRcdFx0XHRpbnZlcnRTd2FwICAgICAgICAgICA6IHRydWUsICAgICAgICAgICAgICAgICAvLyB1c2Ugc3dhcCBvbiBpbnZlcnRlZCBvdmVybGFwLlxyXG5cdFx0XHRcdHN3YXBUaHJlc2hvbGQgICAgICAgIDogMC42NSwgICAgICAgICAgICAgICAgIC8vIGJlIGxlc3MgZWFnZXIgdG8gc3dhcC5cclxuXHRcdFx0XHRpbnZlcnRlZFN3YXBUaHJlc2hvbGQ6IDAuODUsICAgICAgICAgICAgICAgICAvLyByZXF1aXJlIGRlZXBlciBvdmVybGFwIHdoZW4gaW52ZXJ0ZWQuXHJcblx0XHRcdFx0ZW1wdHlJbnNlcnRUaHJlc2hvbGQgOiAyNCwgICAgICAgICAgICAgICAgICAgLy8gZG9u4oCZdCBqdW1wIGludG8gZW1wdHkgY29udGFpbmVycyB0b28gZWFybHkuXHJcblx0XHRcdFx0ZHJhZ292ZXJCdWJibGUgICAgICAgOiBmYWxzZSwgICAgICAgICAgICAgICAgLy8ga2VlcCBkcmFnb3ZlciBsb2NhbC5cclxuXHRcdFx0XHRmYWxsYmFja09uQm9keSAgICAgICA6IHRydWUsICAgICAgICAgICAgICAgICAvLyBtb3JlIHN0YWJsZSBwb3NpdGlvbmluZy5cclxuXHRcdFx0XHRmYWxsYmFja1RvbGVyYW5jZSAgICA6IDYsICAgICAgICAgICAgICAgICAgICAvLyBSZWR1Y2UgbWljcm8tbW92ZXMgd2hlbiB0aGUgbW91c2Ugc2hha2VzIGEgYml0IChlc3AuIG9uIHRvdWNocGFkcykuXHJcblx0XHRcdFx0c2Nyb2xsICAgICAgICAgICAgICAgOiB0cnVlLFxyXG5cdFx0XHRcdHNjcm9sbFNlbnNpdGl2aXR5ICAgIDogNDAsXHJcblx0XHRcdFx0c2Nyb2xsU3BlZWQgICAgICAgICAgOiAxMCxcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBFbnRlci9sZWF2ZSBoeXN0ZXJlc2lzIGZvciBjcm9zcy1jb2x1bW4gbW92ZXMuICAgIE9ubHkgYWxsb3cgZHJvcHBpbmcgaW50byBgdG9gIHdoZW4gdGhlIHBvaW50ZXIgaXMgd2VsbCBpbnNpZGUgaXQuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0b25Nb3ZlOiAoZXZ0LCBvcmlnaW5hbEV2ZW50KSA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCB7IHRvLCBmcm9tIH0gPSBldnQ7XHJcblx0XHRcdFx0XHRpZiAoICF0byB8fCAhZnJvbSApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdC8vIE9ubHkgZ2F0ZSBjb2x1bW5zIChub3QgcGFnZSBjb250YWluZXJzKSwgYW5kIG9ubHkgZm9yIGNyb3NzLWNvbHVtbiBtb3ZlcyBpbiB0aGUgc2FtZSByb3dcclxuXHRcdFx0XHRcdGNvbnN0IGlzQ29sdW1uID0gdG8uY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19jb2x1bW4nICk7XHJcblx0XHRcdFx0XHRpZiAoICFpc0NvbHVtbiApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0IGZyb21Sb3cgPSBmcm9tLmNsb3Nlc3QoICcud3BiY19iZmJfX3JvdycgKTtcclxuXHRcdFx0XHRcdGNvbnN0IHRvUm93ICAgPSB0by5jbG9zZXN0KCAnLndwYmNfYmZiX19yb3cnICk7XHJcblx0XHRcdFx0XHRpZiAoIGZyb21Sb3cgJiYgdG9Sb3cgJiYgZnJvbVJvdyAhPT0gdG9Sb3cgKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0ID0gdG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0XHRjb25zdCBldnRYID0gKG9yaWdpbmFsRXZlbnQudG91Y2hlcz8uWzBdPy5jbGllbnRYKSA/PyBvcmlnaW5hbEV2ZW50LmNsaWVudFg7XHJcblx0XHRcdFx0XHRjb25zdCBldnRZID0gKG9yaWdpbmFsRXZlbnQudG91Y2hlcz8uWzBdPy5jbGllbnRZKSA/PyBvcmlnaW5hbEV2ZW50LmNsaWVudFk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gLS0tIEVkZ2UgZmVuY2UgKGxpa2UgeW91IGhhZCksIGJ1dCBjbGFtcGVkIGZvciB0aW55IGNvbHVtbnNcclxuXHRcdFx0XHRcdGNvbnN0IHBhZGRpbmdYID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5jbGFtcCggcmVjdC53aWR0aCAqIDAuMjAsIDEyLCAzNiApO1xyXG5cdFx0XHRcdFx0Y29uc3QgcGFkZGluZ1kgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLmNsYW1wKCByZWN0LmhlaWdodCAqIDAuMTAsIDYsIDE2ICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gTG9vc2VyIFkgaWYgdGhlIGNvbHVtbiBpcyB2aXN1YWxseSB0aW55L2VtcHR5XHJcblx0XHRcdFx0XHRjb25zdCBpc1Zpc3VhbGx5RW1wdHkgPSB0by5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMCB8fCByZWN0LmhlaWdodCA8IDY0O1xyXG5cdFx0XHRcdFx0Y29uc3QgaW5uZXJUb3AgICAgICAgID0gcmVjdC50b3AgKyAoaXNWaXN1YWxseUVtcHR5ID8gNCA6IHBhZGRpbmdZKTtcclxuXHRcdFx0XHRcdGNvbnN0IGlubmVyQm90dG9tICAgICA9IHJlY3QuYm90dG9tIC0gKGlzVmlzdWFsbHlFbXB0eSA/IDQgOiBwYWRkaW5nWSk7XHJcblx0XHRcdFx0XHRjb25zdCBpbm5lckxlZnQgICAgICAgPSByZWN0LmxlZnQgKyBwYWRkaW5nWDtcclxuXHRcdFx0XHRcdGNvbnN0IGlubmVyUmlnaHQgICAgICA9IHJlY3QucmlnaHQgLSBwYWRkaW5nWDtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBpbnNpZGVYID0gZXZ0WCA+IGlubmVyTGVmdCAmJiBldnRYIDwgaW5uZXJSaWdodDtcclxuXHRcdFx0XHRcdGNvbnN0IGluc2lkZVkgPSBldnRZID4gaW5uZXJUb3AgJiYgZXZ0WSA8IGlubmVyQm90dG9tO1xyXG5cdFx0XHRcdFx0aWYgKCAhKGluc2lkZVggJiYgaW5zaWRlWSkgKSByZXR1cm4gZmFsc2U7ICAgLy8gc3RheSBpbiBjdXJyZW50IGNvbHVtbiB1bnRpbCB3ZWxsIGluc2lkZSBuZXcgb25lXHJcblxyXG5cdFx0XHRcdFx0Ly8gLS0tIFN0aWNreSB0YXJnZXQgY29tbWl0IGRpc3RhbmNlOiBvbmx5IHN3aXRjaCBpZiB3ZeKAmXJlIGNsZWFybHkgaW5zaWRlIHRoZSBuZXcgY29sdW1uXHJcblx0XHRcdFx0XHRjb25zdCBkcyA9IHRoaXMuX2RyYWdTdGF0ZTtcclxuXHRcdFx0XHRcdGlmICggZHMgKSB7XHJcblx0XHRcdFx0XHRcdGlmICggZHMuc3RpY2t5VG8gJiYgZHMuc3RpY2t5VG8gIT09IHRvICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHJlcXVpcmUgYSBkZWVwZXIgcGVuZXRyYXRpb24gdG8gc3dpdGNoIGNvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBjb21taXRYID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5jbGFtcCggcmVjdC53aWR0aCAqIDAuMjUsIDE4LCA0MCApOyAgIC8vIDI1JSBvciAxOOKAkzQwcHhcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBjb21taXRZID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5jbGFtcCggcmVjdC5oZWlnaHQgKiAwLjE1LCAxMCwgMjggKTsgIC8vIDE1JSBvciAxMOKAkzI4cHhcclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgZGVlcEluc2lkZSA9XHJcblx0XHRcdFx0XHRcdFx0XHRcdCAgKGV2dFggPiByZWN0LmxlZnQgKyBjb21taXRYICYmIGV2dFggPCByZWN0LnJpZ2h0IC0gY29tbWl0WCkgJiZcclxuXHRcdFx0XHRcdFx0XHRcdFx0ICAoZXZ0WSA+IHJlY3QudG9wICsgY29tbWl0WSAmJiBldnRZIDwgcmVjdC5ib3R0b20gLSBjb21taXRZKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCAhZGVlcEluc2lkZSApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBXZSBhY2NlcHQgdGhlIG5ldyB0YXJnZXQgbm93LlxyXG5cdFx0XHRcdFx0XHRkcy5zdGlja3lUbyAgICAgPSB0bztcclxuXHRcdFx0XHRcdFx0ZHMubGFzdFN3aXRjaFRzID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRvblN0YXJ0OiAoZXZ0KSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1aWxkZXI/Ll9hZGRfZHJhZ2dpbmdfY2xhc3M/LigpO1xyXG5cdFx0XHRcdFx0Ly8gTWF0Y2ggdGhlIGZsYWdzIHdlIHNldCBpbiBjb21tb24gc28gQ1NTIHN0YXlzIGNvbnNpc3RlbnQgb24gY2FudmFzIGRyYWdzIHRvby5cclxuXHRcdFx0XHRcdGNvbnN0IGZyb21QYWxldHRlID0gdGhpcy5idWlsZGVyPy5wYWxldHRlX3Vscz8uaW5jbHVkZXM/LiggZXZ0LmZyb20gKTtcclxuXHRcdFx0XHRcdHRoaXMuX3RvZ2dsZV9kbmRfcm9vdF9mbGFncyggdHJ1ZSwgZnJvbVBhbGV0dGUgKTsgICAgICAgICAgLy8gc2V0IHRvIHJvb3QgSFRNTCBkb2N1bWVudDogaHRtbC53cGJjX2JmYl9fZG5kLWFjdGl2ZS53cGJjX2JmYl9fZHJhZy1mcm9tLXBhbGV0dGUgLlxyXG5cdFx0XHRcdFx0dGhpcy5fdGFnX2RyYWdfbWlycm9yKCBldnQgKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRhZyB0aGUgbWlycm9yIHVuZGVyIGN1cnNvci5cclxuXHRcdFx0XHRcdHRoaXMuX2RyYWdTdGF0ZSA9IHsgc3RpY2t5VG86IG51bGwsIGxhc3RTd2l0Y2hUczogMCB9OyAgICAvLyBwZXItZHJhZyBzdGF0ZS5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG9uRW5kICA6ICgpID0+IHtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoICgpID0+IHsgdGhpcy5idWlsZGVyLl9yZW1vdmVfZHJhZ2dpbmdfY2xhc3MoKTsgfSwgNTAgKTtcclxuXHRcdFx0XHRcdHRoaXMuX3RvZ2dsZV9kbmRfcm9vdF9mbGFncyggZmFsc2UgKTsgICAgICAgICAgICAgICAgICAgIC8vIHNldCB0byByb290IEhUTUwgZG9jdW1lbnQgd2l0aG91dCB0aGVzZSBjbGFzc2VzOiBodG1sLndwYmNfYmZiX19kbmQtYWN0aXZlLndwYmNfYmZiX19kcmFnLWZyb20tcGFsZXR0ZSAuXHJcblx0XHRcdFx0XHR0aGlzLl9kcmFnU3RhdGUgPSBudWxsO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdC8vIG9uQWRkOiBoYW5kbGVycy5vbkFkZCB8fCB0aGlzLmJ1aWxkZXIuaGFuZGxlX29uX2FkZC5iaW5kKCB0aGlzLmJ1aWxkZXIgKVxyXG5cdFx0XHRcdG9uQWRkOiAoZXZ0KSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIHRoaXMuX29uX2FkZF9zZWN0aW9uKCBldnQgKSApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gRmFsbGJhY2s6IG9yaWdpbmFsIGhhbmRsZXIgZm9yIG5vcm1hbCBmaWVsZHMuXHJcblx0XHRcdFx0XHQoaGFuZGxlcnMub25BZGQgfHwgdGhpcy5idWlsZGVyLmhhbmRsZV9vbl9hZGQuYmluZCggdGhpcy5idWlsZGVyICkpKCBldnQgKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG9uVXBkYXRlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1aWxkZXIuYnVzPy5lbWl0Py4oIENvcmUuV1BCQ19CRkJfRXZlbnRzLlNUUlVDVFVSRV9DSEFOR0UsIHsgcmVhc29uOiAnc29ydC11cGRhdGUnIH0gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdHRoaXMuX2NvbnRhaW5lcnMuYWRkKCBjb250YWluZXIgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEhhbmRsZSBhZGRpbmcvbW92aW5nIHNlY3Rpb25zIHZpYSBTb3J0YWJsZSBvbkFkZC5cclxuXHRcdCAqIFJldHVybnMgdHJ1ZSBpZiBoYW5kbGVkIChpLmUuLCBpdCB3YXMgYSBzZWN0aW9uKSwgZmFsc2UgdG8gbGV0IHRoZSBkZWZhdWx0IGZpZWxkIGhhbmRsZXIgcnVuLlxyXG5cdFx0ICpcclxuXHRcdCAqIC0gUGFsZXR0ZSAtPiBjYW52YXM6IHJlbW92ZSB0aGUgcGxhY2Vob2xkZXIgY2xvbmUgYW5kIGJ1aWxkIGEgZnJlc2ggc2VjdGlvbiB2aWEgYWRkX3NlY3Rpb24oKVxyXG5cdFx0ICogLSBDYW52YXMgLT4gY2FudmFzOiBrZWVwIHRoZSBtb3ZlZCBET00gKGFuZCBpdHMgY2hpbGRyZW4pLCBqdXN0IHJlLXdpcmUgb3ZlcmxheXMvc29ydGFibGVzL21ldGFkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtTb3J0YWJsZS5Tb3J0YWJsZUV2ZW50fSBldnRcclxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdFx0ICovXHJcblx0XHRfb25fYWRkX3NlY3Rpb24oZXZ0KSB7XHJcblxyXG5cdFx0XHRjb25zdCBpdGVtID0gZXZ0Lml0ZW07XHJcblx0XHRcdGlmICggISBpdGVtICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWRlbnRpZnkgc2VjdGlvbnMgYm90aCBmcm9tIHBhbGV0dGUgaXRlbXMgKGxpIGNsb25lcykgYW5kIHJlYWwgY2FudmFzIG5vZGVzLlxyXG5cdFx0XHRjb25zdCBkYXRhICAgICAgPSBDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5nZXRfYWxsX2RhdGFfYXR0cmlidXRlcyggaXRlbSApO1xyXG5cdFx0XHRjb25zdCBpc1NlY3Rpb24gPSBpdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApIHx8IChkYXRhPy50eXBlIHx8IGl0ZW0uZGF0YXNldD8udHlwZSkgPT09ICdzZWN0aW9uJztcclxuXHJcblx0XHRcdGlmICggISBpc1NlY3Rpb24gKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBmcm9tUGFsZXR0ZSA9IHRoaXMuYnVpbGRlcj8ucGFsZXR0ZV91bHM/LmluY2x1ZGVzPy4oIGV2dC5mcm9tICkgPT09IHRydWU7XHJcblxyXG5cdFx0XHRpZiAoICEgZnJvbVBhbGV0dGUgKSB7XHJcblx0XHRcdFx0Ly8gQ2FudmFzIC0+IGNhbnZhcyBtb3ZlOiBETyBOT1QgcmVidWlsZC9yZW1vdmU7IHByZXNlcnZlIGNoaWxkcmVuLlxyXG5cdFx0XHRcdHRoaXMuYnVpbGRlci5hZGRfb3ZlcmxheV90b29sYmFyPy4oIGl0ZW0gKTsgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSBvdmVybGF5IGV4aXN0c1xyXG5cdFx0XHRcdHRoaXMuYnVpbGRlci5wYWdlc19zZWN0aW9ucz8uaW5pdF9hbGxfbmVzdGVkX3NvcnRhYmxlcz8uKCBpdGVtICk7IC8vIGVuc3VyZSBpbm5lciBzb3J0YWJsZXNcclxuXHJcblx0XHRcdFx0Ly8gRW5zdXJlIG1ldGFkYXRhIHByZXNlbnQvdXBkYXRlZFxyXG5cdFx0XHRcdGl0ZW0uZGF0YXNldC50eXBlICAgID0gJ3NlY3Rpb24nO1xyXG5cdFx0XHRcdGNvbnN0IGNvbHMgICAgICAgICAgID0gaXRlbS5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gLndwYmNfYmZiX19yb3cgPiAud3BiY19iZmJfX2NvbHVtbicgKS5sZW5ndGggfHwgMTtcclxuXHRcdFx0XHRpdGVtLmRhdGFzZXQuY29sdW1ucyA9IFN0cmluZyggY29scyApO1xyXG5cclxuXHRcdFx0XHQvLyBTZWxlY3QgJiBub3RpZnkgc3Vic2NyaWJlcnMgKGxheW91dC9taW4gZ3VhcmRzLCBldGMuKVxyXG5cdFx0XHRcdHRoaXMuYnVpbGRlci5zZWxlY3RfZmllbGQ/LiggaXRlbSApO1xyXG5cdFx0XHRcdHRoaXMuYnVpbGRlci5idXM/LmVtaXQ/LiggQ29yZS5XUEJDX0JGQl9FdmVudHMuU1RSVUNUVVJFX0NIQU5HRSwgeyBlbDogaXRlbSwgcmVhc29uOiAnc2VjdGlvbi1tb3ZlJyB9ICk7XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLnVzYWdlPy51cGRhdGVfcGFsZXR0ZV91aT8uKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7IC8vIGhhbmRsZWQuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFBhbGV0dGUgLT4gY2FudmFzOiBidWlsZCBhIGJyYW5kLW5ldyBzZWN0aW9uIHVzaW5nIHRoZSBzYW1lIHBhdGggYXMgdGhlIGRyb3Bkb3duL21lbnVcclxuXHRcdFx0Y29uc3QgdG8gICA9IGV2dC50bz8uY2xvc2VzdD8uKCAnLndwYmNfYmZiX19jb2x1bW4sIC53cGJjX2JmYl9fZm9ybV9wcmV2aWV3X3NlY3Rpb25fY29udGFpbmVyJyApIHx8IGV2dC50bztcclxuXHRcdFx0Y29uc3QgY29scyA9IHBhcnNlSW50KCBkYXRhPy5jb2x1bW5zIHx8IGl0ZW0uZGF0YXNldC5jb2x1bW5zIHx8IDEsIDEwICkgfHwgMTtcclxuXHJcblx0XHRcdC8vIFJlbW92ZSB0aGUgcGFsZXR0ZSBjbG9uZSBwbGFjZWhvbGRlci5cclxuXHRcdFx0aXRlbS5wYXJlbnROb2RlICYmIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggaXRlbSApO1xyXG5cclxuXHRcdFx0Ly8gQ3JlYXRlIHRoZSByZWFsIHNlY3Rpb24uXHJcblx0XHRcdHRoaXMuYnVpbGRlci5wYWdlc19zZWN0aW9ucy5hZGRfc2VjdGlvbiggdG8sIGNvbHMgKTtcclxuXHJcblx0XHRcdC8vIEluc2VydCBhdCB0aGUgcHJlY2lzZSBkcm9wIGluZGV4LlxyXG5cdFx0XHRjb25zdCBzZWN0aW9uID0gdG8ubGFzdEVsZW1lbnRDaGlsZDsgLy8gYWRkX3NlY3Rpb24gYXBwZW5kcyB0byBlbmQuXHJcblx0XHRcdGlmICggZXZ0Lm5ld0luZGV4ICE9IG51bGwgJiYgZXZ0Lm5ld0luZGV4IDwgdG8uY2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcclxuXHRcdFx0XHRjb25zdCByZWYgPSB0by5jaGlsZHJlbltldnQubmV3SW5kZXhdIHx8IG51bGw7XHJcblx0XHRcdFx0dG8uaW5zZXJ0QmVmb3JlKCBzZWN0aW9uLCByZWYgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmluYWxpemU6IG92ZXJsYXksIHNlbGVjdGlvbiwgZXZlbnRzLCB1c2FnZSByZWZyZXNoLlxyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuYWRkX292ZXJsYXlfdG9vbGJhcj8uKCBzZWN0aW9uICk7XHJcblx0XHRcdHRoaXMuYnVpbGRlci5zZWxlY3RfZmllbGQ/Liggc2VjdGlvbiApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuYnVzPy5lbWl0Py4oIENvcmUuV1BCQ19CRkJfRXZlbnRzLkZJRUxEX0FERCwge1xyXG5cdFx0XHRcdGVsIDogc2VjdGlvbixcclxuXHRcdFx0XHRpZCA6IHNlY3Rpb24uZGF0YXNldC5pZCxcclxuXHRcdFx0XHR1aWQ6IHNlY3Rpb24uZGF0YXNldC51aWRcclxuXHRcdFx0fSApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIudXNhZ2U/LnVwZGF0ZV9wYWxldHRlX3VpPy4oKTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVzdHJveSBhbGwgU29ydGFibGUgaW5zdGFuY2VzIGNyZWF0ZWQgYnkgdGhpcyBtYW5hZ2VyLlxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHRkZXN0cm95QWxsKCkge1xyXG5cdFx0XHR0aGlzLl9jb250YWluZXJzLmZvckVhY2goICggZWwgKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaW5zdCA9IFNvcnRhYmxlLmdldD8uKCBlbCApO1xyXG5cdFx0XHRcdGlmICggaW5zdCApIHtcclxuXHRcdFx0XHRcdGluc3QuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0XHR0aGlzLl9jb250YWluZXJzLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU21hbGwgRE9NIGNvbnRyYWN0IGFuZCByZW5kZXJlciBoZWxwZXJcclxuXHQgKlxyXG5cdCAqIEB0eXBlIHtSZWFkb25seTx7XHJcblx0ICogICAgICAgICAgICAgICAgICBTRUxFQ1RPUlM6IHtwYWdlUGFuZWw6IHN0cmluZywgZmllbGQ6IHN0cmluZywgdmFsaWRGaWVsZDogc3RyaW5nLCBzZWN0aW9uOiBzdHJpbmcsIGNvbHVtbjogc3RyaW5nLCByb3c6IHN0cmluZywgb3ZlcmxheTogc3RyaW5nfSxcclxuXHQgKiAgICAgICAgICAgICAgICAgIENMQVNTRVM6IHtzZWxlY3RlZDogc3RyaW5nfSxcclxuXHQgKiAgICAgICAgXHQgICAgICAgIEFUVFI6IHtpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGh0bWxJZDogc3RyaW5nLCB1c2FnZUtleTogc3RyaW5nLCB1aWQ6IHN0cmluZ319XHJcblx0ICogICAgICAgID59XHJcblx0ICovXHJcblx0Q29yZS5XUEJDX0JGQl9ET00gPSBPYmplY3QuZnJlZXplKCB7XHJcblx0XHRTRUxFQ1RPUlM6IHtcclxuXHRcdFx0cGFnZVBhbmVsIDogJy53cGJjX2JmYl9fcGFuZWwtLXByZXZpZXcnLFxyXG5cdFx0XHRmaWVsZCAgICAgOiAnLndwYmNfYmZiX19maWVsZCcsXHJcblx0XHRcdHZhbGlkRmllbGQ6ICcud3BiY19iZmJfX2ZpZWxkOm5vdCguaXMtaW52YWxpZCknLFxyXG5cdFx0XHRzZWN0aW9uICAgOiAnLndwYmNfYmZiX19zZWN0aW9uJyxcclxuXHRcdFx0Y29sdW1uICAgIDogJy53cGJjX2JmYl9fY29sdW1uJyxcclxuXHRcdFx0cm93ICAgICAgIDogJy53cGJjX2JmYl9fcm93JyxcclxuXHRcdFx0b3ZlcmxheSAgIDogJy53cGJjX2JmYl9fb3ZlcmxheS1jb250cm9scydcclxuXHRcdH0sXHJcblx0XHRDTEFTU0VTICA6IHtcclxuXHRcdFx0c2VsZWN0ZWQ6ICdpcy1zZWxlY3RlZCdcclxuXHRcdH0sXHJcblx0XHRBVFRSICAgICA6IHtcclxuXHRcdFx0aWQgICAgICA6ICdkYXRhLWlkJyxcclxuXHRcdFx0bmFtZSAgICA6ICdkYXRhLW5hbWUnLFxyXG5cdFx0XHRodG1sSWQgIDogJ2RhdGEtaHRtbF9pZCcsXHJcblx0XHRcdHVzYWdlS2V5OiAnZGF0YS11c2FnZV9rZXknLFxyXG5cdFx0XHR1aWQgICAgIDogJ2RhdGEtdWlkJ1xyXG5cdFx0fVxyXG5cdH0gKTtcclxuXHJcblx0Q29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIgPSBjbGFzcyB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGUgYW4gSFRNTCBlbGVtZW50LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgLSBIVE1MIHRhZyBuYW1lLlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IFtjbGFzc19uYW1lPScnXSAtIE9wdGlvbmFsIENTUyBjbGFzcyBuYW1lLlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IFtpbm5lcl9odG1sPScnXSAtIE9wdGlvbmFsIGlubmVySFRNTC5cclxuXHRcdCAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gQ3JlYXRlZCBlbGVtZW50LlxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgY3JlYXRlX2VsZW1lbnQoIHRhZywgY2xhc3NfbmFtZSA9ICcnLCBpbm5lcl9odG1sID0gJycgKSB7XHJcblx0XHRcdGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggdGFnICk7XHJcblx0XHRcdGlmICggY2xhc3NfbmFtZSApIHtcclxuXHRcdFx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc19uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggaW5uZXJfaHRtbCApIHtcclxuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBpbm5lcl9odG1sO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBlbDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldCBtdWx0aXBsZSBgZGF0YS0qYCBhdHRyaWJ1dGVzIG9uIGEgZ2l2ZW4gZWxlbWVudC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRhcmdldCBlbGVtZW50LlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGFfb2JqIC0gS2V5LXZhbHVlIHBhaXJzIGZvciBkYXRhIGF0dHJpYnV0ZXMuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHNldF9kYXRhX2F0dHJpYnV0ZXMoIGVsLCBkYXRhX29iaiApIHtcclxuXHRcdFx0T2JqZWN0LmVudHJpZXMoIGRhdGFfb2JqICkuZm9yRWFjaCggKCBbIGtleSwgdmFsIF0gKSA9PiB7XHJcblx0XHRcdFx0Ly8gUHJldmlvdXNseTogMjAyNS0wOS0wMSAxNzowOTpcclxuXHRcdFx0XHQvLyBjb25zdCB2YWx1ZSA9ICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeSggdmFsICkgOiB2YWw7XHJcblx0XHRcdFx0Ly9OZXc6XHJcblx0XHRcdFx0bGV0IHZhbHVlO1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgdmFsICE9PSBudWxsICkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSBKU09OLnN0cmluZ2lmeSggdmFsICk7XHJcblx0XHRcdFx0XHR9IGNhdGNoIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSAnJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSB2YWw7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdkYXRhLScgKyBrZXksIHZhbHVlICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEdldCBhbGwgYGRhdGEtKmAgYXR0cmlidXRlcyBmcm9tIGFuIGVsZW1lbnQgYW5kIHBhcnNlIEpTT04gd2hlcmUgcG9zc2libGUuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBFbGVtZW50IHRvIGV4dHJhY3QgZGF0YSBmcm9tLlxyXG5cdFx0ICogQHJldHVybnMge09iamVjdH0gUGFyc2VkIGtleS12YWx1ZSBtYXAgb2YgZGF0YSBhdHRyaWJ1dGVzLlxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgZ2V0X2FsbF9kYXRhX2F0dHJpYnV0ZXMoIGVsICkge1xyXG5cdFx0XHRjb25zdCBkYXRhID0ge307XHJcblxyXG5cdFx0XHRpZiAoICEgZWwgfHwgISBlbC5hdHRyaWJ1dGVzICkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRBcnJheS5mcm9tKCBlbC5hdHRyaWJ1dGVzICkuZm9yRWFjaChcclxuXHRcdFx0XHQoIGF0dHIgKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIGF0dHIubmFtZS5zdGFydHNXaXRoKCAnZGF0YS0nICkgKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGtleSA9IGF0dHIubmFtZS5yZXBsYWNlKCAvXmRhdGEtLywgJycgKTtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhW2tleV0gPSBKU09OLnBhcnNlKCBhdHRyLnZhbHVlICk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFba2V5XSA9IGF0dHIudmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBPbmx5IGRlZmF1bHQgdGhlIGxhYmVsIGlmIGl0J3MgdHJ1bHkgYWJzZW50ICh1bmRlZmluZWQvbnVsbCksIG5vdCB3aGVuIGl0J3MgYW4gZW1wdHkgc3RyaW5nLlxyXG5cdFx0XHRjb25zdCBoYXNFeHBsaWNpdExhYmVsID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBkYXRhLCAnbGFiZWwnICk7XHJcblx0XHRcdGlmICggISBoYXNFeHBsaWNpdExhYmVsICYmIGRhdGEuaWQgKSB7XHJcblx0XHRcdFx0ZGF0YS5sYWJlbCA9IGRhdGEuaWQuY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIGRhdGEuaWQuc2xpY2UoIDEgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZW5kZXIgYSBzaW1wbGUgbGFiZWwgKyB0eXBlIHByZXZpZXcgKHVzZWQgZm9yIHVua25vd24gb3IgZmFsbGJhY2sgZmllbGRzKS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZmllbGRfZGF0YSAtIEZpZWxkIGRhdGEgb2JqZWN0LlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gSFRNTCBjb250ZW50LlxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgcmVuZGVyX2ZpZWxkX2lubmVyX2h0bWwoIGZpZWxkX2RhdGEgKSB7XHJcblx0XHRcdC8vIE1ha2UgdGhlIGZhbGxiYWNrIHByZXZpZXcgcmVzcGVjdCBhbiBlbXB0eSBsYWJlbC5cclxuXHRcdFx0Y29uc3QgaGFzTGFiZWwgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIGZpZWxkX2RhdGEsICdsYWJlbCcgKTtcclxuXHRcdFx0Y29uc3QgbGFiZWwgICAgPSBoYXNMYWJlbCA/IFN0cmluZyggZmllbGRfZGF0YS5sYWJlbCApIDogU3RyaW5nKCBmaWVsZF9kYXRhLmlkIHx8ICcobm8gbGFiZWwpJyApO1xyXG5cclxuXHRcdFx0Y29uc3QgdHlwZSAgICAgICAgPSBTdHJpbmcoIGZpZWxkX2RhdGEudHlwZSB8fCAndW5rbm93bicgKTtcclxuXHRcdFx0Y29uc3QgaXNfcmVxdWlyZWQgPSBmaWVsZF9kYXRhLnJlcXVpcmVkID09PSB0cnVlIHx8IGZpZWxkX2RhdGEucmVxdWlyZWQgPT09ICd0cnVlJyB8fCBmaWVsZF9kYXRhLnJlcXVpcmVkID09PSAxIHx8IGZpZWxkX2RhdGEucmVxdWlyZWQgPT09ICcxJztcclxuXHJcblx0XHRcdGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG5cclxuXHRcdFx0Y29uc3Qgc3BhbkxhYmVsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7XHJcblx0XHRcdHNwYW5MYWJlbC5jbGFzc05hbWUgICA9ICd3cGJjX2JmYl9fZmllbGQtbGFiZWwnO1xyXG5cdFx0XHRzcGFuTGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbCArIChpc19yZXF1aXJlZCA/ICcgKicgOiAnJyk7XHJcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoIHNwYW5MYWJlbCApO1xyXG5cclxuXHRcdFx0Y29uc3Qgc3BhblR5cGUgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcclxuXHRcdFx0c3BhblR5cGUuY2xhc3NOYW1lICAgPSAnd3BiY19iZmJfX2ZpZWxkLXR5cGUnO1xyXG5cdFx0XHRzcGFuVHlwZS50ZXh0Q29udGVudCA9IHR5cGU7XHJcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoIHNwYW5UeXBlICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gd3JhcHBlci5pbm5lckhUTUw7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWJvdW5jZSBhIGZ1bmN0aW9uLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gRnVuY3Rpb24gdG8gZGVib3VuY2UuXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gd2FpdCAtIERlbGF5IGluIG1zLlxyXG5cdFx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBEZWJvdW5jZWQgZnVuY3Rpb24uXHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBkZWJvdW5jZSggZm4sIHdhaXQgPSAxMjAgKSB7XHJcblx0XHRcdGxldCB0ID0gbnVsbDtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCggLi4uYXJncyApIHtcclxuXHRcdFx0XHRpZiAoIHQgKSB7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHQgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dCA9IHNldFRpbWVvdXQoICgpID0+IGZuLmFwcGx5KCB0aGlzLCBhcmdzICksIHdhaXQgKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0Ly8gUmVuZGVyZXIgcmVnaXN0cnkuIEFsbG93cyBsYXRlIHJlZ2lzdHJhdGlvbiBhbmQgYXZvaWRzIHRpZ2h0IGNvdXBsaW5nIHRvIGEgZ2xvYmFsIG1hcC5cclxuXHRDb3JlLldQQkNfQkZCX0ZpZWxkX1JlbmRlcmVyX1JlZ2lzdHJ5ID0gKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlZ2lzdGVyKCB0eXBlLCBDbGFzc1JlZiApIHtcclxuXHRcdFx0XHRtYXAuc2V0KCBTdHJpbmcoIHR5cGUgKSwgQ2xhc3NSZWYgKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0KCB0eXBlICkge1xyXG5cdFx0XHRcdHJldHVybiBtYXAuZ2V0KCBTdHJpbmcoIHR5cGUgKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pKCk7XHJcblxyXG59KCB3aW5kb3cgKSk7IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vID09IEZpbGUgIC9pbmNsdWRlcy9wYWdlLWZvcm0tYnVpbGRlci9fb3V0L2NvcmUvYmZiLWZpZWxkcy5qcyA9PSB8IDIwMjUtMDktMTAgMTU6NDdcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbihmdW5jdGlvbiAoIHcgKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyBTaW5nbGUgZ2xvYmFsIG5hbWVzcGFjZSAoaWRlbXBvdGVudCAmIGxvYWQtb3JkZXIgc2FmZSkuXHJcblx0Y29uc3QgQ29yZSA9ICggdy5XUEJDX0JGQl9Db3JlID0gdy5XUEJDX0JGQl9Db3JlIHx8IHt9ICk7XHJcblx0Y29uc3QgVUkgICA9ICggQ29yZS5VSSA9IENvcmUuVUkgfHwge30gKTtcclxuXHJcblx0LyoqXHJcblx0ICogQmFzZSBjbGFzcyBmb3IgZmllbGQgcmVuZGVyZXJzIChzdGF0aWMtb25seSBjb250cmFjdCkuXHJcblx0ICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCAqIENvbnRyYWN0IGV4cG9zZWQgdG8gdGhlIGJ1aWxkZXIgKHN0YXRpYyBtZXRob2RzIG9uIHRoZSBDTEFTUyBpdHNlbGYpOlxyXG5cdCAqICAgLSByZW5kZXIoZWwsIGRhdGEsIGN0eCkgICAgICAgICAgICAgIC8vIFJFUVVJUkVEXHJcblx0ICogICAtIG9uX2ZpZWxkX2Ryb3AoZGF0YSwgZWwsIG1ldGEpICAgICAgLy8gT1BUSU9OQUwgKGRlZmF1bHQgcHJvdmlkZWQpXHJcblx0ICpcclxuXHQgKiBIZWxwZXJzIGZvciBzdWJjbGFzc2VzOlxyXG5cdCAqICAgLSBnZXRfZGVmYXVsdHMoKSAgICAgLT4gcGVyLWZpZWxkIGRlZmF1bHRzIChNVVNUIG92ZXJyaWRlIGluIHN1YmNsYXNzIHRvIHNldCB0eXBlL2xhYmVsKVxyXG5cdCAqICAgLSBub3JtYWxpemVfZGF0YShkKSAgLT4gc2hhbGxvdyBtZXJnZSB3aXRoIGRlZmF1bHRzXHJcblx0ICogICAtIGdldF90ZW1wbGF0ZShpZCkgICAtPiBwZXItaWQgY2FjaGVkIHdwLnRlbXBsYXRlIGNvbXBpbGVyXHJcblx0ICpcclxuXHQgKiBTdWJjbGFzcyB1c2FnZTpcclxuXHQgKiAgIGNsYXNzIFdQQkNfQkZCX0ZpZWxkX1RleHQgZXh0ZW5kcyBDb3JlLldQQkNfQkZCX0ZpZWxkX0Jhc2UgeyBzdGF0aWMgZ2V0X2RlZmF1bHRzKCl7IC4uLiB9IH1cclxuXHQgKiAgIFdQQkNfQkZCX0ZpZWxkX1RleHQudGVtcGxhdGVfaWQgPSAnd3BiYy1iZmItZmllbGQtdGV4dCc7XHJcblx0ICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCAqL1xyXG5cdENvcmUuV1BCQ19CRkJfRmllbGRfQmFzZSA9IGNsYXNzIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmF1bHQgZmllbGQgZGF0YSAoZ2VuZXJpYyBiYXNlbGluZSkuXHJcblx0XHQgKiBTdWJjbGFzc2VzIE1VU1Qgb3ZlcnJpZGUgdG8gcHJvdmlkZSB7IHR5cGUsIGxhYmVsIH0gYXBwcm9wcmlhdGUgZm9yIHRoZSBmaWVsZC5cclxuXHRcdCAqIEByZXR1cm5zIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBnZXRfZGVmYXVsdHMoKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0dHlwZSAgICAgICAgOiAnZmllbGQnLFxyXG5cdFx0XHRcdGxhYmVsICAgICAgIDogJ0ZpZWxkJyxcclxuXHRcdFx0XHRuYW1lICAgICAgICA6ICdmaWVsZCcsXHJcblx0XHRcdFx0aHRtbF9pZCAgICAgOiAnJyxcclxuXHRcdFx0XHRwbGFjZWhvbGRlciA6ICcnLFxyXG5cdFx0XHRcdHJlcXVpcmVkICAgIDogZmFsc2UsXHJcblx0XHRcdFx0bWlubGVuZ3RoICAgOiAnJyxcclxuXHRcdFx0XHRtYXhsZW5ndGggICA6ICcnLFxyXG5cdFx0XHRcdHBhdHRlcm4gICAgIDogJycsXHJcblx0XHRcdFx0Y3NzY2xhc3MgICAgOiAnJyxcclxuXHRcdFx0XHRoZWxwICAgICAgICA6ICcnXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTaGFsbG93LW1lcmdlIGluY29taW5nIGRhdGEgd2l0aCBkZWZhdWx0cy5cclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0XHQgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgbm9ybWFsaXplX2RhdGEoIGRhdGEgKSB7XHJcblx0XHRcdHZhciBkICAgICAgICA9IGRhdGEgfHwge307XHJcblx0XHRcdHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0X2RlZmF1bHRzKCk7XHJcblx0XHRcdHZhciBvdXQgICAgICA9IHt9O1xyXG5cdFx0XHR2YXIgaztcclxuXHJcblx0XHRcdGZvciAoIGsgaW4gZGVmYXVsdHMgKSB7XHJcblx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIGRlZmF1bHRzLCBrICkgKSB7XHJcblx0XHRcdFx0XHRvdXRba10gPSBkZWZhdWx0c1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yICggayBpbiBkICkge1xyXG5cdFx0XHRcdGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBkLCBrICkgKSB7XHJcblx0XHRcdFx0XHRvdXRba10gPSBkW2tdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb3V0O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29tcGlsZSBhbmQgY2FjaGUgYSB3cC50ZW1wbGF0ZSBieSBpZCAocGVyLWlkIGNhY2hlKS5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZV9pZFxyXG5cdFx0ICogQHJldHVybnMge0Z1bmN0aW9ufG51bGx9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBnZXRfdGVtcGxhdGUodGVtcGxhdGVfaWQpIHtcclxuXHJcblx0XHRcdC8vIEFjY2VwdCBlaXRoZXIgXCJ3cGJjLWJmYi1maWVsZC10ZXh0XCIgb3IgXCJ0bXBsLXdwYmMtYmZiLWZpZWxkLXRleHRcIi5cclxuXHRcdFx0aWYgKCAhIHRlbXBsYXRlX2lkIHx8ICEgd2luZG93LndwIHx8ICEgd3AudGVtcGxhdGUgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgZG9tSWQgPSB0ZW1wbGF0ZV9pZC5zdGFydHNXaXRoKCAndG1wbC0nICkgPyB0ZW1wbGF0ZV9pZCA6ICgndG1wbC0nICsgdGVtcGxhdGVfaWQpO1xyXG5cdFx0XHRpZiAoICEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGRvbUlkICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggISBDb3JlLl9fYmZiX3RwbF9jYWNoZV9tYXAgKSB7XHJcblx0XHRcdFx0Q29yZS5fX2JmYl90cGxfY2FjaGVfbWFwID0ge307XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE5vcm1hbGl6ZSBpZCBmb3IgdGhlIGNvbXBpbGVyICYgY2FjaGUuIC8vIHdwLnRlbXBsYXRlIGV4cGVjdHMgaWQgV0lUSE9VVCB0aGUgXCJ0bXBsLVwiIHByZWZpeCAhXHJcblx0XHRcdGNvbnN0IGtleSA9IHRlbXBsYXRlX2lkLnJlcGxhY2UoIC9edG1wbC0vLCAnJyApO1xyXG5cdFx0XHRpZiAoIENvcmUuX19iZmJfdHBsX2NhY2hlX21hcFtrZXldICkge1xyXG5cdFx0XHRcdHJldHVybiBDb3JlLl9fYmZiX3RwbF9jYWNoZV9tYXBba2V5XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcGlsZXIgPSB3cC50ZW1wbGF0ZSgga2V5ICk7ICAgICAvLyA8LS0gbm9ybWFsaXplZCBpZCBoZXJlXHJcblx0XHRcdGlmICggY29tcGlsZXIgKSB7XHJcblx0XHRcdFx0Q29yZS5fX2JmYl90cGxfY2FjaGVfbWFwW2tleV0gPSBjb21waWxlcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGNvbXBpbGVyO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUkVRVUlSRUQ6IHJlbmRlciBwcmV2aWV3IGludG8gaG9zdCBlbGVtZW50IChmdWxsIHJlZHJhdzsgaWRlbXBvdGVudCkuXHJcblx0XHQgKiBTdWJjbGFzc2VzIHNob3VsZCBzZXQgc3RhdGljIGB0ZW1wbGF0ZV9pZGAgdG8gYSB2YWxpZCB3cC50ZW1wbGF0ZSBpZC5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICAgICBkYXRhXHJcblx0XHQgKiBAcGFyYW0ge3ttb2RlPzpzdHJpbmcsYnVpbGRlcj86YW55LHRwbD86RnVuY3Rpb24sc2FuaXQ/OmFueX19IGN0eFxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyByZW5kZXIoIGVsLCBkYXRhLCBjdHggKSB7XHJcblx0XHRcdGlmICggISBlbCApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBjb21waWxlID0gdGhpcy5nZXRfdGVtcGxhdGUoIHRoaXMudGVtcGxhdGVfaWQgKTtcclxuXHRcdFx0dmFyIGQgICAgICAgPSB0aGlzLm5vcm1hbGl6ZV9kYXRhKCBkYXRhICk7XHJcblxyXG5cdFx0XHR2YXIgcyA9IChjdHggJiYgY3R4LnNhbml0KSA/IGN0eC5zYW5pdCA6IENvcmUuV1BCQ19CRkJfU2FuaXRpemU7XHJcblxyXG5cdFx0XHQvLyBTYW5pdGl6ZSBjcml0aWNhbCBhdHRyaWJ1dGVzIGJlZm9yZSB0ZW1wbGF0aW5nLlxyXG5cdFx0XHRpZiAoIHMgKSB7XHJcblx0XHRcdFx0ZC5odG1sX2lkID0gZC5odG1sX2lkID8gcy5zYW5pdGl6ZV9odG1sX2lkKCBTdHJpbmcoIGQuaHRtbF9pZCApICkgOiAnJztcclxuXHRcdFx0XHRkLm5hbWUgICAgPSBzLnNhbml0aXplX2h0bWxfbmFtZSggU3RyaW5nKCBkLm5hbWUgfHwgZC5pZCB8fCAnZmllbGQnICkgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkLmh0bWxfaWQgPSBkLmh0bWxfaWQgPyBTdHJpbmcoIGQuaHRtbF9pZCApIDogJyc7XHJcblx0XHRcdFx0ZC5uYW1lICAgID0gU3RyaW5nKCBkLm5hbWUgfHwgZC5pZCB8fCAnZmllbGQnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZhbGwgYmFjayB0byBnZW5lcmljIHByZXZpZXcgaWYgdGVtcGxhdGUgbm90IGF2YWlsYWJsZS5cclxuXHRcdFx0aWYgKCBjb21waWxlICkge1xyXG5cdFx0XHRcdGVsLmlubmVySFRNTCA9IGNvbXBpbGUoIGQgKTtcclxuXHJcblx0XHRcdFx0Ly8gQWZ0ZXIgcmVuZGVyLCBzZXQgYXR0cmlidXRlIHZhbHVlcyB2aWEgRE9NIHNvIHF1b3Rlcy9uZXdsaW5lcyBhcmUgaGFuZGxlZCBjb3JyZWN0bHkuXHJcblx0XHRcdFx0Y29uc3QgaW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yKCAnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnICk7XHJcblx0XHRcdFx0aWYgKCBpbnB1dCApIHtcclxuXHRcdFx0XHRcdGlmICggZC5wbGFjZWhvbGRlciAhPSBudWxsICkgaW5wdXQuc2V0QXR0cmlidXRlKCAncGxhY2Vob2xkZXInLCBTdHJpbmcoIGQucGxhY2Vob2xkZXIgKSApO1xyXG5cdFx0XHRcdFx0aWYgKCBkLnRpdGxlICE9IG51bGwgKSBpbnB1dC5zZXRBdHRyaWJ1dGUoICd0aXRsZScsIFN0cmluZyggZC50aXRsZSApICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5yZW5kZXJfZmllbGRfaW5uZXJfaHRtbCggZCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbC5kYXRhc2V0LnR5cGUgPSBkLnR5cGUgfHwgJ2ZpZWxkJztcclxuXHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1sYWJlbCcsIChkLmxhYmVsICE9IG51bGwgPyBTdHJpbmcoIGQubGFiZWwgKSA6ICcnKSApOyAvLyBhbGxvdyBcIlwiLlxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIE9QVElPTkFMIGhvb2sgZXhlY3V0ZWQgYWZ0ZXIgZmllbGQgaXMgZHJvcHBlZC9sb2FkZWQvcHJldmlldy5cclxuXHRcdCAqIERlZmF1bHQgZXh0ZW5kZWQ6XHJcblx0XHQgKiAtIE9uIGZpcnN0IGRyb3A6IHN0YW1wIGRlZmF1bHQgbGFiZWwgKGV4aXN0aW5nIGJlaGF2aW9yKSBhbmQgbWFyayBmaWVsZCBhcyBcImZyZXNoXCIgZm9yIGF1dG8tbmFtZS5cclxuXHRcdCAqIC0gT24gbG9hZDogbWFyayBhcyBsb2FkZWQgc28gbGF0ZXIgbGFiZWwgZWRpdHMgZG8gbm90IHJlbmFtZSB0aGUgc2F2ZWQgbmFtZS5cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIG9uX2ZpZWxkX2Ryb3AoZGF0YSwgZWwsIG1ldGEpIHtcclxuXHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSAobWV0YSAmJiBtZXRhLmNvbnRleHQpID8gU3RyaW5nKCBtZXRhLmNvbnRleHQgKSA6ICcnO1xyXG5cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly8gTkVXOiBTZWVkIGRlZmF1bHQgXCJoZWxwXCIgKGFuZCBrZWVwIGl0IGluIFN0cnVjdHVyZSkgZm9yIGFsbCBmaWVsZCBwYWNrcyB0aGF0IGRlZmluZSBpdC5cclxuXHRcdFx0Ly8gVGhpcyBmaXhlcyB0aGUgbWlzbWF0Y2ggd2hlcmU6XHJcblx0XHRcdC8vICAgLSBVSSBzaG93cyBkZWZhdWx0IGhlbHAgdmlhIG5vcm1hbGl6ZV9kYXRhKCkgLyB0ZW1wbGF0ZXNcclxuXHRcdFx0Ly8gICAtIGJ1dCBnZXRfc3RydWN0dXJlKCkgLyBleHBvcnRlcnMgc2VlIGBoZWxwYCBhcyB1bmRlZmluZWQvZW1wdHkuXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIEJlaGF2aW9yOlxyXG5cdFx0XHQvLyAgIC0gUnVucyBPTkxZIG9uIGluaXRpYWwgZHJvcCAoY29udGV4dCA9PT0gJ2Ryb3AnKS5cclxuXHRcdFx0Ly8gICAtIElmIGdldF9kZWZhdWx0cygpIGV4cG9zZXMgYSBub24tZW1wdHkgXCJoZWxwXCIsIGFuZCBkYXRhLmhlbHAgaXNcclxuXHRcdFx0Ly8gICAgIG1pc3NpbmcgLyBudWxsIC8gZW1wdHkgc3RyaW5nIC0+IHdlIHBlcnNpc3QgdGhlIGRlZmF1bHQgaW50byBgZGF0YWBcclxuXHRcdFx0Ly8gICAgIGFuZCBub3RpZnkgU3RydWN0dXJlIHNvIGV4cG9ydHMgc2VlIGl0LlxyXG5cdFx0XHQvLyAgIC0gT24gXCJsb2FkXCIgd2UgZG8gbm90aGluZywgc28gZXhpc3RpbmcgZm9ybXMgd2hlcmUgdXNlciAqY2xlYXJlZCpcclxuXHRcdFx0Ly8gICAgIGhlbHAgd2lsbCBub3QgYmUgb3ZlcnJpZGRlbi5cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0aWYgKCBjb250ZXh0ID09PSAnZHJvcCcgJiYgZGF0YSApIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Y29uc3QgZGVmcyA9ICh0eXBlb2YgdGhpcy5nZXRfZGVmYXVsdHMgPT09ICdmdW5jdGlvbicpID8gdGhpcy5nZXRfZGVmYXVsdHMoKSA6IG51bGw7XHJcblx0XHRcdFx0XHRpZiAoIGRlZnMgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBkZWZzLCAnaGVscCcgKSApIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudCAgICA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggZGF0YSwgJ2hlbHAnICkgPyBkYXRhLmhlbHAgOiB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGhhc1ZhbHVlICAgPSAoY3VycmVudCAhPT0gdW5kZWZpbmVkICYmIGN1cnJlbnQgIT09IG51bGwgJiYgU3RyaW5nKCBjdXJyZW50ICkgIT09ICcnKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZGVmYXVsdFZhbCA9IGRlZnMuaGVscDtcclxuXHJcblx0XHRcdFx0XHRcdGlmICggISBoYXNWYWx1ZSAmJiBkZWZhdWx0VmFsICE9IG51bGwgJiYgU3RyaW5nKCBkZWZhdWx0VmFsICkgIT09ICcnICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIDEpIHBlcnNpc3QgaW50byBkYXRhIG9iamVjdCAodXNlZCBieSBTdHJ1Y3R1cmUpLlxyXG5cdFx0XHRcdFx0XHRcdGRhdGEuaGVscCA9IGRlZmF1bHRWYWw7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIDIpIG1pcnJvciBpbnRvIGRhdGFzZXQgKGZvciBhbnkgRE9NLWJhc2VkIGNvbnN1bWVycykuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCBlbCApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGVsLmRhdGFzZXQuaGVscCA9IFN0cmluZyggZGVmYXVsdFZhbCApO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIDMpIG5vdGlmeSBTdHJ1Y3R1cmUgLyBsaXN0ZW5lcnMgKGlmIGF2YWlsYWJsZSkuXHJcblx0XHRcdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRDb3JlLlN0cnVjdHVyZT8udXBkYXRlX2ZpZWxkX3Byb3A/LiggZWwsICdoZWxwJywgZGVmYXVsdFZhbCApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbC5kaXNwYXRjaEV2ZW50KFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiX2ZpZWxkX2RhdGFfY2hhbmdlZCcsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsIDogeyBrZXk6ICdoZWxwJywgdmFsdWU6IGRlZmF1bHRWYWwgfSB9IClcclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBfaW5uZXIgKSB7fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHt9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHRcdGlmICggY29udGV4dCA9PT0gJ2Ryb3AnICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIGRhdGEsICdsYWJlbCcgKSApIHtcclxuXHRcdFx0XHRjb25zdCBkZWZzID0gdGhpcy5nZXRfZGVmYXVsdHMoKTtcclxuXHRcdFx0XHRkYXRhLmxhYmVsID0gZGVmcy5sYWJlbCB8fCAnRmllbGQnO1xyXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ2RhdGEtbGFiZWwnLCBkYXRhLmxhYmVsICk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gTWFyayBwcm92ZW5hbmNlIGZsYWdzLlxyXG5cdFx0XHRpZiAoIGNvbnRleHQgPT09ICdkcm9wJyApIHtcclxuXHRcdFx0XHRlbC5kYXRhc2V0LmZyZXNoICAgICAgPSAnMSc7ICAgLy8gY2FuIGF1dG8tbmFtZSBvbiBmaXJzdCBsYWJlbCBlZGl0LlxyXG5cdFx0XHRcdGVsLmRhdGFzZXQuYXV0b25hbWUgICA9ICcxJztcclxuXHRcdFx0XHRlbC5kYXRhc2V0Lndhc19sb2FkZWQgPSAnMCc7XHJcblx0XHRcdFx0Ly8gU2VlZCBhIHByb3Zpc2lvbmFsIHVuaXF1ZSBuYW1lIGltbWVkaWF0ZWx5LlxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRjb25zdCBiID0gbWV0YT8uYnVpbGRlcjtcclxuXHRcdFx0XHRcdGlmICggYj8uaWQgJiYgKCFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLW5hbWUnICkgfHwgIWVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtbmFtZScgKSkgKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IFMgICAgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBiYXNlID0gUy5zYW5pdGl6ZV9odG1sX25hbWUoIGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtaWQnICkgfHwgZGF0YT8uaWQgfHwgZGF0YT8udHlwZSB8fCAnZmllbGQnICk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHVuaXEgPSBiLmlkLmVuc3VyZV91bmlxdWVfZmllbGRfbmFtZSggYmFzZSwgZWwgKTtcclxuXHRcdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1uYW1lJywgdW5pcSApO1xyXG5cdFx0XHRcdFx0XHRlbC5kYXRhc2V0Lm5hbWVfdXNlcl90b3VjaGVkID0gJzAnO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfICkge31cclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIGNvbnRleHQgPT09ICdsb2FkJyApIHtcclxuXHRcdFx0XHRlbC5kYXRhc2V0LmZyZXNoICAgICAgPSAnMCc7XHJcblx0XHRcdFx0ZWwuZGF0YXNldC5hdXRvbmFtZSAgID0gJzAnO1xyXG5cdFx0XHRcdGVsLmRhdGFzZXQud2FzX2xvYWRlZCA9ICcxJzsgICAvLyBuZXZlciByZW5hbWUgbmFtZXMgZm9yIGxvYWRlZCBmaWVsZHMuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyAtLS0gQXV0byBSZW5hbWUgXCJGcmVzaFwiIGZpZWxkLCAgb24gZW50ZXJpbmcgdGhlIG5ldyBMYWJlbCAtLS1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZSBhIGNvbnNlcnZhdGl2ZSBmaWVsZCBcIm5hbWVcIiBmcm9tIGEgaHVtYW4gbGFiZWwuXHJcblx0XHQgKiBVc2VzIHRoZSBzYW1lIGNvbnN0cmFpbnRzIGFzIHNhbml0aXplX2h0bWxfbmFtZSAobGV0dGVycy9kaWdpdHMvXy0gYW5kIGxlYWRpbmcgbGV0dGVyKS5cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIG5hbWVfZnJvbV9sYWJlbChsYWJlbCkge1xyXG5cdFx0XHRjb25zdCBzID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5zYW5pdGl6ZV9odG1sX25hbWUoIFN0cmluZyggbGFiZWwgPz8gJycgKSApO1xyXG5cdFx0XHRyZXR1cm4gcy50b0xvd2VyQ2FzZSgpIHx8ICdmaWVsZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBdXRvLWZpbGwgZGF0YS1uYW1lIGZyb20gbGFiZWwgT05MWSBmb3IgZnJlc2hseSBkcm9wcGVkIGZpZWxkcyB0aGF0IHdlcmUgbm90IGVkaXRlZCB5ZXQuXHJcblx0XHQgKiAtIE5ldmVyIHJ1bnMgZm9yIHNlY3Rpb25zLlxyXG5cdFx0ICogLSBOZXZlciBydW5zIGZvciBsb2FkZWQvZXhpc3RpbmcgZmllbGRzLlxyXG5cdFx0ICogLSBTdG9wcyBhcyBzb29uIGFzIHVzZXIgZWRpdHMgdGhlIE5hbWUgbWFudWFsbHkuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtXUEJDX0Zvcm1fQnVpbGRlcn0gYnVpbGRlclxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgIC0gLndwYmNfYmZiX19maWVsZCBlbGVtZW50XHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbGFiZWxWYWxcclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIG1heWJlX2F1dG9uYW1lX2Zyb21fbGFiZWwoYnVpbGRlciwgZWwsIGxhYmVsVmFsKSB7XHJcblx0XHRcdGlmICggIWJ1aWxkZXIgfHwgIWVsICkgcmV0dXJuO1xyXG5cdFx0XHRpZiAoIGVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Y29uc3QgYWxsb3dBdXRvID0gZWwuZGF0YXNldC5hdXRvbmFtZSA9PT0gJzEnO1xyXG5cclxuXHRcdFx0Y29uc3QgdXNlclRvdWNoZWQgPSBlbC5kYXRhc2V0Lm5hbWVfdXNlcl90b3VjaGVkID09PSAnMSc7XHJcblx0XHRcdGNvbnN0IGlzTG9hZGVkICAgID0gZWwuZGF0YXNldC53YXNfbG9hZGVkID09PSAnMSc7XHJcblxyXG5cdFx0XHRpZiAoICFhbGxvd0F1dG8gfHwgdXNlclRvdWNoZWQgfHwgaXNMb2FkZWQgKSByZXR1cm47XHJcblxyXG5cdFx0XHQvLyBPbmx5IG92ZXJyaWRlIHBsYWNlaG9sZGVyLXkgbmFtZXNcclxuXHRcdFx0Y29uc3QgUyA9IENvcmUuV1BCQ19CRkJfU2FuaXRpemU7XHJcblxyXG5cdFx0XHRjb25zdCBiYXNlICAgPSB0aGlzLm5hbWVfZnJvbV9sYWJlbCggbGFiZWxWYWwgKTtcclxuXHRcdFx0Y29uc3QgdW5pcXVlID0gYnVpbGRlci5pZC5lbnN1cmVfdW5pcXVlX2ZpZWxkX25hbWUoIGJhc2UsIGVsICk7XHJcblx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ2RhdGEtbmFtZScsIHVuaXF1ZSApO1xyXG5cclxuXHRcdFx0Y29uc3QgaW5zICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdGNvbnN0IG5hbWVDdHJsID0gaW5zPy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtaW5zcGVjdG9yLWtleT1cIm5hbWVcIl0nICk7XHJcblx0XHRcdGlmICggbmFtZUN0cmwgJiYgJ3ZhbHVlJyBpbiBuYW1lQ3RybCAmJiBuYW1lQ3RybC52YWx1ZSAhPT0gdW5pcXVlICkgbmFtZUN0cmwudmFsdWUgPSB1bmlxdWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTZWxlY3RfQmFzZSAoc2hhcmVkIGJhc2UgZm9yIHNlbGVjdC1saWtlIHBhY2tzKVxyXG5cdCAqXHJcblx0ICogQHR5cGUge0NvcmUuV1BCQ19CRkJfU2VsZWN0X0Jhc2V9XHJcblx0ICovXHJcblx0Q29yZS5XUEJDX0JGQl9TZWxlY3RfQmFzZSA9IGNsYXNzIGV4dGVuZHMgQ29yZS5XUEJDX0JGQl9GaWVsZF9CYXNlIHtcclxuXHJcblx0XHRzdGF0aWMgdGVtcGxhdGVfaWQgICAgICAgICAgICA9IG51bGw7ICAgICAgICAgICAgICAgICAvLyBtYWluIHByZXZpZXcgdGVtcGxhdGUgaWRcclxuXHRcdHN0YXRpYyBvcHRpb25fcm93X3RlbXBsYXRlX2lkID0gJ3dwYmMtYmZiLWluc3BlY3Rvci1zZWxlY3Qtb3B0aW9uLXJvdyc7IC8vIHJvdyB0cGwgaWRcclxuXHRcdHN0YXRpYyBraW5kICAgICAgICAgICAgICAgICAgID0gJ3NlbGVjdCc7XHJcblx0XHRzdGF0aWMgX19yb290X3dpcmVkICAgICAgICAgICA9IGZhbHNlO1xyXG5cdFx0c3RhdGljIF9fcm9vdF9ub2RlICAgICAgICAgICAgPSBudWxsO1xyXG5cclxuXHRcdC8vIFNpbmdsZSBzb3VyY2Ugb2Ygc2VsZWN0b3JzIHVzZWQgYnkgdGhlIGluc3BlY3RvciBVSS5cclxuXHRcdHN0YXRpYyB1aSA9IHtcclxuXHRcdFx0bGlzdCAgIDogJy53cGJjX2JmYl9fb3B0aW9uc19saXN0JyxcclxuXHRcdFx0aG9sZGVyIDogJy53cGJjX2JmYl9fb3B0aW9uc19zdGF0ZVtkYXRhLWluc3BlY3Rvci1rZXk9XCJvcHRpb25zXCJdJyxcclxuXHRcdFx0cm93ICAgIDogJy53cGJjX2JmYl9fb3B0aW9uc19yb3cnLFxyXG5cdFx0XHRsYWJlbCAgOiAnLndwYmNfYmZiX19vcHQtbGFiZWwnLFxyXG5cdFx0XHR2YWx1ZSAgOiAnLndwYmNfYmZiX19vcHQtdmFsdWUnLFxyXG5cdFx0XHR0b2dnbGUgOiAnLndwYmNfYmZiX19vcHQtc2VsZWN0ZWQtY2hrJyxcclxuXHRcdFx0YWRkX2J0bjogJy5qcy1hZGQtb3B0aW9uJyxcclxuXHJcblx0XHRcdGRyYWdfaGFuZGxlICAgICAgOiAnLndwYmNfYmZiX19kcmFnLWhhbmRsZScsXHJcblx0XHRcdG11bHRpcGxlX2NoayAgICAgOiAnLmpzLW9wdC1tdWx0aXBsZVtkYXRhLWluc3BlY3Rvci1rZXk9XCJtdWx0aXBsZVwiXScsXHJcblx0XHRcdGRlZmF1bHRfdGV4dCAgICAgOiAnLmpzLWRlZmF1bHQtdmFsdWVbZGF0YS1pbnNwZWN0b3Ita2V5PVwiZGVmYXVsdF92YWx1ZVwiXScsXHJcblx0XHRcdHBsYWNlaG9sZGVyX2lucHV0OiAnLmpzLXBsYWNlaG9sZGVyW2RhdGEtaW5zcGVjdG9yLWtleT1cInBsYWNlaG9sZGVyXCJdJyxcclxuXHRcdFx0cGxhY2Vob2xkZXJfbm90ZSA6ICcuanMtcGxhY2Vob2xkZXItbm90ZScsXHJcblx0XHRcdHNpemVfaW5wdXQgICAgICAgOiAnLmluc3BlY3Rvcl9faW5wdXRbZGF0YS1pbnNwZWN0b3Ita2V5PVwic2l6ZVwiXScsXHJcblxyXG5cdFx0XHQvLyBEcm9wZG93biBtZW51IGludGVncmF0aW9uLlxyXG5cdFx0XHRtZW51X3Jvb3QgIDogJy53cGJjX3VpX2VsX19kcm9wZG93bicsXHJcblx0XHRcdG1lbnVfdG9nZ2xlOiAnW2RhdGEtdG9nZ2xlPVwid3BiY19kcm9wZG93blwiXScsXHJcblx0XHRcdG1lbnVfYWN0aW9uOiAnLnVsX2Ryb3Bkb3duX21lbnVfbGlfYWN0aW9uW2RhdGEtYWN0aW9uXScsXHJcblx0XHRcdC8vIFZhbHVlLWRpZmZlcnMgdG9nZ2xlLlxyXG5cdFx0XHR2YWx1ZV9kaWZmZXJzX2NoazogJy5qcy12YWx1ZS1kaWZmZXJzW2RhdGEtaW5zcGVjdG9yLWtleT1cInZhbHVlX2RpZmZlcnNcIl0nLFxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEJ1aWxkIG9wdGlvbiB2YWx1ZSBmcm9tIGxhYmVsLlxyXG5cdFx0ICogLSBJZiBgZGlmZmVycyA9PT0gdHJ1ZWAgLT4gZ2VuZXJhdGUgdG9rZW4gKHNsdWctbGlrZSBtYWNoaW5lIHZhbHVlKS5cclxuXHRcdCAqIC0gSWYgYGRpZmZlcnMgPT09IGZhbHNlYCAtPiBrZWVwIGh1bWFuIHRleHQ7IGVzY2FwZSBvbmx5IGRhbmdlcm91cyBjaGFycy5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbFxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBkaWZmZXJzXHJcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgYnVpbGRfdmFsdWVfZnJvbV9sYWJlbChsYWJlbCwgZGlmZmVycykge1xyXG5cdFx0XHRjb25zdCBTID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZTtcclxuXHRcdFx0aWYgKCBkaWZmZXJzICkge1xyXG5cdFx0XHRcdHJldHVybiAoUyAmJiB0eXBlb2YgUy50b190b2tlbiA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRcdD8gUy50b190b2tlbiggU3RyaW5nKCBsYWJlbCB8fCAnJyApIClcclxuXHRcdFx0XHRcdDogU3RyaW5nKCBsYWJlbCB8fCAnJyApLnRyaW0oKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoIC9cXHMrL2csICdfJyApLnJlcGxhY2UoIC9bXlxcdy1dL2csICcnICk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gc2luZ2xlLWlucHV0IG1vZGU6IGtlZXAgaHVtYW4gdGV4dDsgdGVtcGxhdGUgd2lsbCBlc2NhcGUgc2FmZWx5LlxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nKCBsYWJlbCA9PSBudWxsID8gJycgOiBsYWJlbCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSXMgdGhlIOKAnHZhbHVlIGRpZmZlcnMgZnJvbSBsYWJlbOKAnSB0b2dnbGUgZW5hYmxlZD9cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhbmVsXHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGlzX3ZhbHVlX2RpZmZlcnNfZW5hYmxlZChwYW5lbCkge1xyXG5cdFx0XHRjb25zdCBjaGsgPSBwYW5lbD8ucXVlcnlTZWxlY3RvciggdGhpcy51aS52YWx1ZV9kaWZmZXJzX2NoayApO1xyXG5cdFx0XHRyZXR1cm4gISEoY2hrICYmIGNoay5jaGVja2VkKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEVuc3VyZSB2aXNpYmlsaXR5L2VuYWJsZWQgc3RhdGUgb2YgVmFsdWUgaW5wdXRzIGJhc2VkIG9uIHRoZSB0b2dnbGUuXHJcblx0XHQgKiBXaGVuIGRpc2FibGVkIC0+IGhpZGUgVmFsdWUgaW5wdXRzIGFuZCBrZWVwIHRoZW0gbWlycm9yZWQgZnJvbSBMYWJlbC5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhbmVsXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHN5bmNfdmFsdWVfaW5wdXRzX3Zpc2liaWxpdHkocGFuZWwpIHtcclxuXHRcdFx0Y29uc3QgZGlmZmVycyA9IHRoaXMuaXNfdmFsdWVfZGlmZmVyc19lbmFibGVkKCBwYW5lbCApO1xyXG5cdFx0XHRjb25zdCByb3dzICAgID0gcGFuZWw/LnF1ZXJ5U2VsZWN0b3JBbGwoIHRoaXMudWkucm93ICkgfHwgW107XHJcblxyXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHRcdGNvbnN0IHIgICAgICA9IHJvd3NbaV07XHJcblx0XHRcdFx0Y29uc3QgbGJsX2luID0gci5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLmxhYmVsICk7XHJcblx0XHRcdFx0Y29uc3QgdmFsX2luID0gci5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLnZhbHVlICk7XHJcblx0XHRcdFx0aWYgKCAhdmFsX2luICkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdGlmICggZGlmZmVycyApIHtcclxuXHRcdFx0XHRcdC8vIFJlLWVuYWJsZSAmIHNob3cgdmFsdWUgaW5wdXRcclxuXHRcdFx0XHRcdHZhbF9pbi5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcclxuXHRcdFx0XHRcdHZhbF9pbi5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBhIGNhY2hlZCBjdXN0b20gdmFsdWUgYW5kIHRoZSByb3cgd2Fzbid0IGVkaXRlZCB3aGlsZSBPRkYsIHJlc3RvcmUgaXRcclxuXHRcdFx0XHRcdGNvbnN0IGhhc0NhY2hlICAgPSAhIXZhbF9pbi5kYXRhc2V0LmNhY2hlZF92YWx1ZTtcclxuXHRcdFx0XHRcdGNvbnN0IHVzZXJFZGl0ZWQgPSByLmRhdGFzZXQudmFsdWVfdXNlcl90b3VjaGVkID09PSAnMSc7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBoYXNDYWNoZSAmJiAhdXNlckVkaXRlZCApIHtcclxuXHRcdFx0XHRcdFx0dmFsX2luLnZhbHVlID0gdmFsX2luLmRhdGFzZXQuY2FjaGVkX3ZhbHVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggIWhhc0NhY2hlICkge1xyXG5cdFx0XHRcdFx0XHQvLyBObyBjYWNoZTogaWYgdmFsdWUgaXMganVzdCBhIG1pcnJvcmVkIGxhYmVsLCBvZmZlciBhIHRva2VuaXplZCBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdGNvbnN0IGxibCAgICAgID0gbGJsX2luID8gbGJsX2luLnZhbHVlIDogJyc7XHJcblx0XHRcdFx0XHRcdGNvbnN0IG1pcnJvcmVkID0gdGhpcy5idWlsZF92YWx1ZV9mcm9tX2xhYmVsKCBsYmwsIC8qZGlmZmVycz0qL2ZhbHNlICk7XHJcblx0XHRcdFx0XHRcdGlmICggdmFsX2luLnZhbHVlID09PSBtaXJyb3JlZCApIHtcclxuXHRcdFx0XHRcdFx0XHR2YWxfaW4udmFsdWUgPSB0aGlzLmJ1aWxkX3ZhbHVlX2Zyb21fbGFiZWwoIGxibCwgLypkaWZmZXJzPSovdHJ1ZSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIE9OIC0+IE9GRjogY2FjaGUgb25jZSwgdGhlbiBtaXJyb3JcclxuXHRcdFx0XHRcdGlmICggIXZhbF9pbi5kYXRhc2V0LmNhY2hlZF92YWx1ZSApIHtcclxuXHRcdFx0XHRcdFx0dmFsX2luLmRhdGFzZXQuY2FjaGVkX3ZhbHVlID0gdmFsX2luLnZhbHVlIHx8ICcnO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29uc3QgbGJsICAgID0gbGJsX2luID8gbGJsX2luLnZhbHVlIDogJyc7XHJcblx0XHRcdFx0XHR2YWxfaW4udmFsdWUgPSB0aGlzLmJ1aWxkX3ZhbHVlX2Zyb21fbGFiZWwoIGxibCwgLypkaWZmZXJzPSovZmFsc2UgKTtcclxuXHJcblx0XHRcdFx0XHR2YWxfaW4uc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XHJcblx0XHRcdFx0XHR2YWxfaW4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGRvIE5PVCBtYXJrIGFzIHVzZXJfdG91Y2hlZCBoZXJlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJuIHdoZXRoZXIgdGhpcyByb3figJlzIHZhbHVlIGhhcyBiZWVuIGVkaXRlZCBieSB1c2VyLlxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcm93XHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGlzX3Jvd192YWx1ZV91c2VyX3RvdWNoZWQocm93KSB7XHJcblx0XHRcdHJldHVybiByb3c/LmRhdGFzZXQ/LnZhbHVlX3VzZXJfdG91Y2hlZCA9PT0gJzEnO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogTWFyayB0aGlzIHJvd+KAmXMgdmFsdWUgYXMgZWRpdGVkIGJ5IHVzZXIuXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb3dcclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIG1hcmtfcm93X3ZhbHVlX3VzZXJfdG91Y2hlZChyb3cpIHtcclxuXHRcdFx0aWYgKCByb3cgKSByb3cuZGF0YXNldC52YWx1ZV91c2VyX3RvdWNoZWQgPSAnMSc7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbml0aWFsaXplIOKAnGZyZXNobmVzc+KAnSBmbGFncyBvbiBhIHJvdyAodmFsdWUgdW50b3VjaGVkKS5cclxuXHRcdCAqIENhbGwgb24gY3JlYXRpb24vYXBwZW5kIG9mIHJvd3MuXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb3dcclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGluaXRfcm93X2ZyZXNoX2ZsYWdzKHJvdykge1xyXG5cdFx0XHRpZiAoIHJvdyApIHtcclxuXHRcdFx0XHRpZiAoICFyb3cuZGF0YXNldC52YWx1ZV91c2VyX3RvdWNoZWQgKSB7XHJcblx0XHRcdFx0XHRyb3cuZGF0YXNldC52YWx1ZV91c2VyX3RvdWNoZWQgPSAnMCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gLS0tLSBkZWZhdWx0cyAocGFja3MgY2FuIG92ZXJyaWRlKSAtLS0tXHJcblx0XHRzdGF0aWMgZ2V0X2RlZmF1bHRzKCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHR5cGUgICAgICAgICA6IHRoaXMua2luZCxcclxuXHRcdFx0XHRsYWJlbCAgICAgICAgOiAnU2VsZWN0JyxcclxuXHRcdFx0XHRuYW1lICAgICAgICAgOiAnJyxcclxuXHRcdFx0XHRodG1sX2lkICAgICAgOiAnJyxcclxuXHRcdFx0XHRwbGFjZWhvbGRlciAgOiAnLS0tIFNlbGVjdCAtLS0nLFxyXG5cdFx0XHRcdHJlcXVpcmVkICAgICA6IGZhbHNlLFxyXG5cdFx0XHRcdG11bHRpcGxlICAgICA6IGZhbHNlLFxyXG5cdFx0XHRcdHNpemUgICAgICAgICA6IG51bGwsXHJcblx0XHRcdFx0Y3NzY2xhc3MgICAgIDogJycsXHJcblx0XHRcdFx0aGVscCAgICAgICAgIDogJycsXHJcblx0XHRcdFx0ZGVmYXVsdF92YWx1ZTogJycsXHJcblx0XHRcdFx0b3B0aW9ucyAgICAgIDogW1xyXG5cdFx0XHRcdFx0eyBsYWJlbDogJ09wdGlvbiAxJywgdmFsdWU6ICdPcHRpb24gMScsIHNlbGVjdGVkOiBmYWxzZSB9LFxyXG5cdFx0XHRcdFx0eyBsYWJlbDogJ09wdGlvbiAyJywgdmFsdWU6ICdPcHRpb24gMicsIHNlbGVjdGVkOiBmYWxzZSB9LFxyXG5cdFx0XHRcdFx0eyBsYWJlbDogJ09wdGlvbiAzJywgdmFsdWU6ICdPcHRpb24gMycsIHNlbGVjdGVkOiBmYWxzZSB9LFxyXG5cdFx0XHRcdFx0eyBsYWJlbDogJ09wdGlvbiA0JywgdmFsdWU6ICdPcHRpb24gNCcsIHNlbGVjdGVkOiBmYWxzZSB9XHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRtaW5fd2lkdGggICAgOiAnMjQwcHgnXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gLS0tLSBwcmV2aWV3IHJlbmRlciAoaWRlbXBvdGVudCkgLS0tLVxyXG5cdFx0c3RhdGljIHJlbmRlcihlbCwgZGF0YSwgY3R4KSB7XHJcblx0XHRcdGlmICggIWVsICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Y29uc3QgZCA9IHRoaXMubm9ybWFsaXplX2RhdGEoIGRhdGEgKTtcclxuXHJcblx0XHRcdGlmICggZC5taW5fd2lkdGggIT0gbnVsbCApIHtcclxuXHRcdFx0XHRlbC5kYXRhc2V0Lm1pbl93aWR0aCA9IFN0cmluZyggZC5taW5fd2lkdGggKTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0ZWwuc3R5bGUuc2V0UHJvcGVydHkoICctLXdwYmMtY29sLW1pbicsIFN0cmluZyggZC5taW5fd2lkdGggKSApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfICkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIGQuaHRtbF9pZCAhPSBudWxsICkgZWwuZGF0YXNldC5odG1sX2lkID0gU3RyaW5nKCBkLmh0bWxfaWQgfHwgJycgKTtcclxuXHRcdFx0aWYgKCBkLmNzc2NsYXNzICE9IG51bGwgKSBlbC5kYXRhc2V0LmNzc2NsYXNzID0gU3RyaW5nKCBkLmNzc2NsYXNzIHx8ICcnICk7XHJcblx0XHRcdGlmICggZC5wbGFjZWhvbGRlciAhPSBudWxsICkgZWwuZGF0YXNldC5wbGFjZWhvbGRlciA9IFN0cmluZyggZC5wbGFjZWhvbGRlciB8fCAnJyApO1xyXG5cclxuXHRcdFx0Y29uc3QgdHBsID0gdGhpcy5nZXRfdGVtcGxhdGUoIHRoaXMudGVtcGxhdGVfaWQgKTtcclxuXHRcdFx0aWYgKCB0eXBlb2YgdHBsICE9PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdGVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwid3BiY19iZmJfX2Vycm9yXCIgcm9sZT1cImFsZXJ0XCI+VGVtcGxhdGUgbm90IGZvdW5kOiAnICsgdGhpcy50ZW1wbGF0ZV9pZCArICcuPC9kaXY+JztcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZWwuaW5uZXJIVE1MID0gdHBsKCBkICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdHdpbmRvdy5fd3BiYz8uZGV2Py5lcnJvcj8uKCAnU2VsZWN0X0Jhc2UucmVuZGVyJywgZSApO1xyXG5cdFx0XHRcdGVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwid3BiY19iZmJfX2Vycm9yXCIgcm9sZT1cImFsZXJ0XCI+RXJyb3IgcmVuZGVyaW5nIGZpZWxkIHByZXZpZXcuPC9kaXY+JztcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGVsLmRhdGFzZXQudHlwZSA9IGQudHlwZSB8fCB0aGlzLmtpbmQ7XHJcblx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ2RhdGEtbGFiZWwnLCAoZC5sYWJlbCAhPSBudWxsID8gU3RyaW5nKCBkLmxhYmVsICkgOiAnJykgKTtcclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Q29yZS5VST8uV1BCQ19CRkJfT3ZlcmxheT8uZW5zdXJlPy4oIGN0eD8uYnVpbGRlciwgZWwgKTtcclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggIWVsLmRhdGFzZXQub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KCBkLm9wdGlvbnMgKSAmJiBkLm9wdGlvbnMubGVuZ3RoICkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRlbC5kYXRhc2V0Lm9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSggZC5vcHRpb25zICk7XHJcblx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gLS0tLSBkcm9wIHNlZWRpbmcgKG9wdGlvbnMgKyBwbGFjZWhvbGRlcikgLS0tLVxyXG5cdFx0c3RhdGljIG9uX2ZpZWxkX2Ryb3AoZGF0YSwgZWwsIG1ldGEpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRzdXBlci5vbl9maWVsZF9kcm9wPy4oIGRhdGEsIGVsLCBtZXRhICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBfICkge1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpc19kcm9wID0gKG1ldGEgJiYgbWV0YS5jb250ZXh0ID09PSAnZHJvcCcpO1xyXG5cclxuXHRcdFx0aWYgKCBpc19kcm9wICkge1xyXG5cdFx0XHRcdGlmICggIUFycmF5LmlzQXJyYXkoIGRhdGEub3B0aW9ucyApIHx8ICFkYXRhLm9wdGlvbnMubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0Y29uc3Qgb3B0cyAgID0gKHRoaXMuZ2V0X2RlZmF1bHRzKCkub3B0aW9ucyB8fCBbXSkubWFwKCAobykgPT4gKHtcclxuXHRcdFx0XHRcdFx0bGFiZWwgICA6IG8ubGFiZWwsXHJcblx0XHRcdFx0XHRcdHZhbHVlICAgOiBvLnZhbHVlLFxyXG5cdFx0XHRcdFx0XHRzZWxlY3RlZDogISFvLnNlbGVjdGVkXHJcblx0XHRcdFx0XHR9KSApO1xyXG5cdFx0XHRcdFx0ZGF0YS5vcHRpb25zID0gb3B0cztcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGVsLmRhdGFzZXQub3B0aW9ucyA9IEpTT04uc3RyaW5naWZ5KCBvcHRzICk7XHJcblx0XHRcdFx0XHRcdGVsLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiX2ZpZWxkX2RhdGFfY2hhbmdlZCcsIHsgYnViYmxlczogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRkZXRhaWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0a2V5ICA6ICdvcHRpb25zJyxcclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBvcHRzXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ICkgKTtcclxuXHRcdFx0XHRcdFx0Q29yZS5TdHJ1Y3R1cmU/LnVwZGF0ZV9maWVsZF9wcm9wPy4oIGVsLCAnb3B0aW9ucycsIG9wdHMgKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKCBfICkge1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgcGggPSAoZGF0YS5wbGFjZWhvbGRlciA/PyAnJykudG9TdHJpbmcoKS50cmltKCk7XHJcblx0XHRcdFx0aWYgKCAhcGggKSB7XHJcblx0XHRcdFx0XHRjb25zdCBkZmx0ICAgICAgID0gdGhpcy5nZXRfZGVmYXVsdHMoKS5wbGFjZWhvbGRlciB8fCAnLS0tIFNlbGVjdCAtLS0nO1xyXG5cdFx0XHRcdFx0ZGF0YS5wbGFjZWhvbGRlciA9IGRmbHQ7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRlbC5kYXRhc2V0LnBsYWNlaG9sZGVyID0gU3RyaW5nKCBkZmx0ICk7XHJcblx0XHRcdFx0XHRcdGVsLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiX2ZpZWxkX2RhdGFfY2hhbmdlZCcsIHsgYnViYmxlczogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRkZXRhaWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0a2V5ICA6ICdwbGFjZWhvbGRlcicsXHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogZGZsdFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSApICk7XHJcblx0XHRcdFx0XHRcdENvcmUuU3RydWN0dXJlPy51cGRhdGVfZmllbGRfcHJvcD8uKCBlbCwgJ3BsYWNlaG9sZGVyJywgZGZsdCApO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyBJbnNwZWN0b3IgaGVscGVycyAoc25ha2VfY2FzZSlcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0c3RhdGljIGdldF9wYW5lbF9yb290KGVsKSB7XHJcblx0XHRcdHJldHVybiBlbD8uY2xvc2VzdD8uKCAnLndwYmNfYmZiX19pbnNwZWN0b3JfX2JvZHknICkgfHwgZWw/LmNsb3Nlc3Q/LiggJy53cGJjX2JmYl9faW5zcGVjdG9yJyApIHx8IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGdldF9saXN0KHBhbmVsKSB7XHJcblx0XHRcdHJldHVybiBwYW5lbCA/IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoIHRoaXMudWkubGlzdCApIDogbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZ2V0X2hvbGRlcihwYW5lbCkge1xyXG5cdFx0XHRyZXR1cm4gcGFuZWwgPyBwYW5lbC5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLmhvbGRlciApIDogbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbWFrZV91aWQoKSB7XHJcblx0XHRcdHJldHVybiAnd3BiY19pbnNfYXV0b19vcHRfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoIDM2ICkuc2xpY2UoIDIsIDEwICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGFwcGVuZF9yb3cocGFuZWwsIGRhdGEpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMuZ2V0X2xpc3QoIHBhbmVsICk7XHJcblx0XHRcdGlmICggIWxpc3QgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBpZHggID0gbGlzdC5jaGlsZHJlbi5sZW5ndGg7XHJcblx0XHRcdGNvbnN0IHJvd2QgPSBPYmplY3QuYXNzaWduKCB7IGxhYmVsOiAnJywgdmFsdWU6ICcnLCBzZWxlY3RlZDogZmFsc2UsIGluZGV4OiBpZHggfSwgKGRhdGEgfHwge30pICk7XHJcblx0XHRcdGlmICggIXJvd2QudWlkICkgcm93ZC51aWQgPSB0aGlzLm1ha2VfdWlkKCk7XHJcblxyXG5cdFx0XHRjb25zdCB0cGxfaWQgPSB0aGlzLm9wdGlvbl9yb3dfdGVtcGxhdGVfaWQ7XHJcblx0XHRcdGNvbnN0IHRwbCAgICA9ICh3aW5kb3cud3AgJiYgd3AudGVtcGxhdGUpID8gd3AudGVtcGxhdGUoIHRwbF9pZCApIDogbnVsbDtcclxuXHRcdFx0Y29uc3QgaHRtbCAgID0gdHBsID8gdHBsKCByb3dkICkgOiBudWxsO1xyXG5cclxuXHRcdFx0Ly8gSW4gYXBwZW5kX3JvdygpIC0+IGZhbGxiYWNrIEhUTUwuXHJcblx0XHRcdGNvbnN0IHdyYXAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuXHRcdFx0d3JhcC5pbm5lckhUTUwgPSBodG1sIHx8IChcclxuXHRcdFx0XHQnPGRpdiBjbGFzcz1cIndwYmNfYmZiX19vcHRpb25zX3Jvd1wiIGRhdGEtaW5kZXg9XCInICsgKHJvd2QuaW5kZXggfHwgMCkgKyAnXCI+JyArXHJcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3cGJjX2JmYl9fZHJhZy1oYW5kbGVcIj48c3BhbiBjbGFzcz1cIndwYmNfaWNuX2RyYWdfaW5kaWNhdG9yXCI+PC9zcGFuPjwvc3Bhbj4nICtcclxuXHRcdFx0XHRcdCc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cIndwYmNfYmZiX19vcHQtbGFiZWxcIiBwbGFjZWhvbGRlcj1cIkxhYmVsXCIgdmFsdWU9XCInICsgKHJvd2QubGFiZWwgfHwgJycpICsgJ1wiPicgK1xyXG5cdFx0XHRcdFx0JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwid3BiY19iZmJfX29wdC12YWx1ZVwiIHBsYWNlaG9sZGVyPVwiVmFsdWVcIiB2YWx1ZT1cIicgKyAocm93ZC52YWx1ZSB8fCAnJykgKyAnXCI+JyArXHJcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIndwYmNfYmZiX19vcHQtc2VsZWN0ZWRcIj4nICtcclxuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpbnNwZWN0b3JfX2NvbnRyb2wgd3BiY191aV9fdG9nZ2xlXCI+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cIndwYmNfYmZiX19vcHQtc2VsZWN0ZWQtY2hrIGluc3BlY3Rvcl9faW5wdXRcIiBpZD1cIicgKyByb3dkLnVpZCArICdcIiByb2xlPVwic3dpdGNoXCIgJyArIChyb3dkLnNlbGVjdGVkID8gJ2NoZWNrZWQgYXJpYS1jaGVja2VkPVwidHJ1ZVwiJyA6ICdhcmlhLWNoZWNrZWQ9XCJmYWxzZVwiJykgKyAnPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8bGFiZWwgY2xhc3M9XCJ3cGJjX3VpX190b2dnbGVfaWNvbl9yYWRpb1wiIGZvcj1cIicgKyByb3dkLnVpZCArICdcIj48L2xhYmVsPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8bGFiZWwgY2xhc3M9XCJ3cGJjX3VpX190b2dnbGVfbGFiZWxcIiBmb3I9XCInICsgcm93ZC51aWQgKyAnXCI+RGVmYXVsdDwvbGFiZWw+JyArXHJcblx0XHRcdFx0XHRcdCc8L2Rpdj4nICtcclxuXHRcdFx0XHRcdCc8L2Rpdj4nICtcclxuXHRcdFx0XHRcdC8vIDMtZG90IGRyb3Bkb3duICh1c2VzIGV4aXN0aW5nIHBsdWdpbiBkcm9wZG93biBKUykuXHJcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIndwYmNfdWlfZWwgd3BiY191aV9lbF9jb250YWluZXIgd3BiY191aV9lbF9fZHJvcGRvd25cIj4nICtcclxuXHRcdFx0XHRcdFx0JzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLXRvZ2dsZT1cIndwYmNfZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBjbGFzcz1cInVsX2Ryb3Bkb3duX21lbnVfdG9nZ2xlXCI+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwibWVudV9pY29uIGljb24tMXggd3BiY19pY25fbW9yZV92ZXJ0XCI+PC9pPicgK1xyXG5cdFx0XHRcdFx0XHQnPC9hPicgK1xyXG5cdFx0XHRcdFx0XHQnPHVsIGNsYXNzPVwidWxfZHJvcGRvd25fbWVudVwiIHJvbGU9XCJtZW51XCIgc3R5bGU9XCJyaWdodDowcHg7IGxlZnQ6YXV0bztcIj4nICtcclxuXHRcdFx0XHRcdFx0XHQnPGxpPicgK1xyXG5cdFx0XHRcdFx0XHRcdFx0JzxhIGNsYXNzPVwidWxfZHJvcGRvd25fbWVudV9saV9hY3Rpb25cIiBkYXRhLWFjdGlvbj1cImFkZF9hZnRlclwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4nICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0J0FkZCBOZXcnICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwibWVudV9pY29uIGljb24tMXggd3BiY19pY25fYWRkX2NpcmNsZVwiPjwvaT4nICtcclxuXHRcdFx0XHRcdFx0XHRcdCc8L2E+JyArXHJcblx0XHRcdFx0XHRcdFx0JzwvbGk+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxsaT4nICtcclxuXHRcdFx0XHRcdFx0XHRcdCc8YSBjbGFzcz1cInVsX2Ryb3Bkb3duX21lbnVfbGlfYWN0aW9uXCIgZGF0YS1hY3Rpb249XCJkdXBsaWNhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JyArXHJcblx0XHRcdFx0XHRcdFx0XHRcdCdEdXBsaWNhdGUnICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwibWVudV9pY29uIGljb24tMXggd3BiY19pY25fY29udGVudF9jb3B5XCI+PC9pPicgK1xyXG5cdFx0XHRcdFx0XHRcdFx0JzwvYT4nICtcclxuXHRcdFx0XHRcdFx0XHQnPC9saT4nICtcclxuXHRcdFx0XHRcdFx0XHQnPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxsaT4nICtcclxuXHRcdFx0XHRcdFx0XHRcdCc8YSBjbGFzcz1cInVsX2Ryb3Bkb3duX21lbnVfbGlfYWN0aW9uXCIgZGF0YS1hY3Rpb249XCJyZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JyArXHJcblx0XHRcdFx0XHRcdFx0XHRcdCdSZW1vdmUnICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwibWVudV9pY29uIGljb24tMXggd3BiY19pY25fZGVsZXRlX291dGxpbmVcIj48L2k+JyArXHJcblx0XHRcdFx0XHRcdFx0XHQnPC9hPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8L2xpPicgK1xyXG5cdFx0XHRcdFx0XHQnPC91bD4nICtcclxuXHRcdFx0XHRcdCc8L2Rpdj4nICtcclxuXHRcdFx0XHQnPC9kaXY+J1xyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Y29uc3Qgbm9kZSA9IHdyYXAuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblx0XHRcdCBpZiAoISBub2RlKSB7XHJcblx0XHRcdFx0IHJldHVybjtcclxuXHRcdFx0IH1cclxuXHRcdFx0Ly8gcHJlLWhpZGUgVmFsdWUgaW5wdXQgaWYgdG9nZ2xlIGlzIE9GRiAqKmJlZm9yZSoqIGFwcGVuZGluZy5cclxuXHRcdFx0Y29uc3QgZGlmZmVycyA9IHRoaXMuaXNfdmFsdWVfZGlmZmVyc19lbmFibGVkKCBwYW5lbCApO1xyXG5cdFx0XHRjb25zdCB2YWxJbiAgID0gbm9kZS5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLnZhbHVlICk7XHJcblx0XHRcdGNvbnN0IGxibEluICAgPSBub2RlLnF1ZXJ5U2VsZWN0b3IoIHRoaXMudWkubGFiZWwgKTtcclxuXHJcblx0XHRcdGlmICggIWRpZmZlcnMgJiYgdmFsSW4gKSB7XHJcblx0XHRcdFx0aWYgKCAhdmFsSW4uZGF0YXNldC5jYWNoZWRfdmFsdWUgKSB7XHJcblx0XHRcdFx0XHR2YWxJbi5kYXRhc2V0LmNhY2hlZF92YWx1ZSA9IHZhbEluLnZhbHVlIHx8ICcnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIGxibEluICkgdmFsSW4udmFsdWUgPSB0aGlzLmJ1aWxkX3ZhbHVlX2Zyb21fbGFiZWwoIGxibEluLnZhbHVlLCBmYWxzZSApO1xyXG5cdFx0XHRcdHZhbEluLnNldEF0dHJpYnV0ZSggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xyXG5cdFx0XHRcdHZhbEluLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHR0aGlzLmluaXRfcm93X2ZyZXNoX2ZsYWdzKCBub2RlICk7XHJcblx0XHRcdGxpc3QuYXBwZW5kQ2hpbGQoIG5vZGUgKTtcclxuXHJcblx0XHRcdC8vIEtlZXAgeW91ciBleGlzdGluZyBwb3N0LWFwcGVuZCBzeW5jIGFzIGEgc2FmZXR5IG5ldFxyXG5cdFx0XHR0aGlzLnN5bmNfdmFsdWVfaW5wdXRzX3Zpc2liaWxpdHkoIHBhbmVsICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNsb3NlX2Ryb3Bkb3duKGFuY2hvcl9lbCkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciByb290ID0gYW5jaG9yX2VsPy5jbG9zZXN0Py4oIHRoaXMudWkubWVudV9yb290ICk7XHJcblx0XHRcdFx0aWYgKCByb290ICkge1xyXG5cdFx0XHRcdFx0Ly8gSWYgeW91ciBkcm9wZG93biB0b2dnbGVyIHRvZ2dsZXMgYSBjbGFzcyBsaWtlICdvcGVuJywgY2xvc2UgaXQuXHJcblx0XHRcdFx0XHRyb290LmNsYXNzTGlzdC5yZW1vdmUoICdvcGVuJyApO1xyXG5cdFx0XHRcdFx0Ly8gT3IgaWYgaXQgcmVsaWVzIG9uIGFyaWEtZXhwYW5kZWQgb24gdGhlIHRvZ2dsZS5cclxuXHRcdFx0XHRcdHZhciB0ID0gcm9vdC5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLm1lbnVfdG9nZ2xlICk7XHJcblx0XHRcdFx0XHRpZiAoIHQgKSB7XHJcblx0XHRcdFx0XHRcdHQuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKCBfICkgeyB9XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGluc2VydF9hZnRlcihuZXdfbm9kZSwgcmVmX25vZGUpIHtcclxuXHRcdFx0aWYgKCByZWZfbm9kZT8ucGFyZW50Tm9kZSApIHtcclxuXHRcdFx0XHRpZiAoIHJlZl9ub2RlLm5leHRTaWJsaW5nICkge1xyXG5cdFx0XHRcdFx0cmVmX25vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIG5ld19ub2RlLCByZWZfbm9kZS5uZXh0U2libGluZyApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZWZfbm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBuZXdfbm9kZSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBjb21taXRfb3B0aW9ucyhwYW5lbCkge1xyXG5cdFx0XHRjb25zdCBsaXN0ICAgPSB0aGlzLmdldF9saXN0KCBwYW5lbCApO1xyXG5cdFx0XHRjb25zdCBob2xkZXIgPSB0aGlzLmdldF9ob2xkZXIoIHBhbmVsICk7XHJcblx0XHRcdGlmICggIWxpc3QgfHwgIWhvbGRlciApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IGRpZmZlcnMgPSB0aGlzLmlzX3ZhbHVlX2RpZmZlcnNfZW5hYmxlZCggcGFuZWwgKTtcclxuXHJcblx0XHRcdGNvbnN0IHJvd3MgICAgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRoaXMudWkucm93ICk7XHJcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHRjb25zdCByICAgICAgPSByb3dzW2ldO1xyXG5cdFx0XHRcdGNvbnN0IGxibF9pbiA9IHIucXVlcnlTZWxlY3RvciggdGhpcy51aS5sYWJlbCApO1xyXG5cdFx0XHRcdGNvbnN0IHZhbF9pbiA9IHIucXVlcnlTZWxlY3RvciggdGhpcy51aS52YWx1ZSApO1xyXG5cdFx0XHRcdGNvbnN0IGNoayAgICA9IHIucXVlcnlTZWxlY3RvciggdGhpcy51aS50b2dnbGUgKTtcclxuXHJcblx0XHRcdFx0Y29uc3QgbGJsID0gKGxibF9pbiAmJiBsYmxfaW4udmFsdWUpIHx8ICcnO1xyXG5cdFx0XHRcdGxldCB2YWwgICA9ICh2YWxfaW4gJiYgdmFsX2luLnZhbHVlKSB8fCAnJztcclxuXHJcblx0XHRcdFx0Ly8gSWYgc2luZ2xlLWlucHV0IG1vZGUgLT4gaGFyZCBtaXJyb3IgdG8gbGFiZWwuXHJcblx0XHRcdFx0aWYgKCAhIGRpZmZlcnMgKSB7XHJcblx0XHRcdFx0XHQvLyBzaW5nbGUtaW5wdXQgbW9kZTogbWlycm9yIExhYmVsLCBtaW5pbWFsIGVzY2FwaW5nIChubyBzbHVnKS5cclxuXHRcdFx0XHRcdHZhbCA9IHRoaXMuYnVpbGRfdmFsdWVfZnJvbV9sYWJlbCggbGJsLCAvKmRpZmZlcnM9Ki9mYWxzZSApO1xyXG5cdFx0XHRcdFx0aWYgKCB2YWxfaW4gKSB7XHJcblx0XHRcdFx0XHRcdHZhbF9pbi52YWx1ZSA9IHZhbDsgICAvLyBrZWVwIGhpZGRlbiBpbnB1dCBpbiBzeW5jIGZvciBhbnkgcHJldmlld3MvZGVidWcuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBzZWwgPSAhIShjaGsgJiYgY2hrLmNoZWNrZWQpO1xyXG5cdFx0XHRcdG9wdGlvbnMucHVzaCggeyBsYWJlbDogbGJsLCB2YWx1ZTogdmFsLCBzZWxlY3RlZDogc2VsIH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRob2xkZXIudmFsdWUgPSBKU09OLnN0cmluZ2lmeSggb3B0aW9ucyApO1xyXG5cdFx0XHRcdGhvbGRlci5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoICdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9ICkgKTtcclxuXHRcdFx0XHRob2xkZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdHBhbmVsLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiX2ZpZWxkX2RhdGFfY2hhbmdlZCcsIHtcclxuXHRcdFx0XHRcdGJ1YmJsZXM6IHRydWUsIGRldGFpbDoge1xyXG5cdFx0XHRcdFx0XHRrZXk6ICdvcHRpb25zJywgdmFsdWU6IG9wdGlvbnNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICkgKTtcclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc3luY19kZWZhdWx0X3ZhbHVlX2xvY2soIHBhbmVsICk7XHJcblx0XHRcdHRoaXMuc3luY19wbGFjZWhvbGRlcl9sb2NrKCBwYW5lbCApO1xyXG5cclxuXHRcdFx0Ly8gTWlycm9yIHRvIHRoZSBzZWxlY3RlZCBmaWVsZCBlbGVtZW50IHNvIGNhbnZhcy9leHBvcnQgc2VlcyBjdXJyZW50IG9wdGlvbnMgaW1tZWRpYXRlbHkuXHJcblx0XHRcdGNvbnN0IGZpZWxkID0gcGFuZWwuX19zZWxlY3RiYXNlX2ZpZWxkXHJcblx0XHRcdFx0fHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fZmllbGQuaXMtc2VsZWN0ZWQsIC53cGJjX2JmYl9fZmllbGQtLXNlbGVjdGVkJyApO1xyXG5cdFx0XHRpZiAoIGZpZWxkICkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRmaWVsZC5kYXRhc2V0Lm9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSggb3B0aW9ucyApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfICkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRDb3JlLlN0cnVjdHVyZT8udXBkYXRlX2ZpZWxkX3Byb3A/LiggZmllbGQsICdvcHRpb25zJywgb3B0aW9ucyApO1xyXG5cdFx0XHRcdGZpZWxkLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiX2ZpZWxkX2RhdGFfY2hhbmdlZCcsIHtcclxuXHRcdFx0XHRcdGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBrZXk6ICdvcHRpb25zJywgdmFsdWU6IG9wdGlvbnMgfVxyXG5cdFx0XHRcdH0gKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHN0YXRpYyBlbnN1cmVfc29ydGFibGUocGFuZWwpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMuZ2V0X2xpc3QoIHBhbmVsICk7XHJcblx0XHRcdGlmICggIWxpc3QgfHwgbGlzdC5kYXRhc2V0LnNvcnRhYmxlX2luaXQgPT09ICcxJyApIHJldHVybjtcclxuXHRcdFx0aWYgKCB3aW5kb3cuU29ydGFibGU/LmNyZWF0ZSApIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0d2luZG93LlNvcnRhYmxlLmNyZWF0ZSggbGlzdCwge1xyXG5cdFx0XHRcdFx0XHRoYW5kbGUgICA6IHRoaXMudWkuZHJhZ19oYW5kbGUsXHJcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogMTIwLFxyXG5cdFx0XHRcdFx0XHRvblNvcnQgICA6ICgpID0+IHRoaXMuY29tbWl0X29wdGlvbnMoIHBhbmVsIClcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRcdGxpc3QuZGF0YXNldC5zb3J0YWJsZV9pbml0ID0gJzEnO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0d2luZG93Ll93cGJjPy5kZXY/LmVycm9yPy4oICdTZWxlY3RfQmFzZS5lbnN1cmVfc29ydGFibGUnLCBlICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHJlYnVpbGRfaWZfZW1wdHkocGFuZWwpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCAgID0gdGhpcy5nZXRfbGlzdCggcGFuZWwgKTtcclxuXHRcdFx0Y29uc3QgaG9sZGVyID0gdGhpcy5nZXRfaG9sZGVyKCBwYW5lbCApO1xyXG5cdFx0XHRpZiAoICFsaXN0IHx8ICFob2xkZXIgfHwgbGlzdC5jaGlsZHJlbi5sZW5ndGggKSByZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgZGF0YSA9IFtdO1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGRhdGEgPSBKU09OLnBhcnNlKCBob2xkZXIudmFsdWUgfHwgJ1tdJyApO1xyXG5cdFx0XHR9IGNhdGNoICggXyApIHtcclxuXHRcdFx0XHRkYXRhID0gW107XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggIUFycmF5LmlzQXJyYXkoIGRhdGEgKSB8fCAhZGF0YS5sZW5ndGggKSB7XHJcblx0XHRcdFx0ZGF0YSA9ICh0aGlzLmdldF9kZWZhdWx0cygpLm9wdGlvbnMgfHwgW10pLnNsaWNlKCAwICk7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGhvbGRlci52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBkYXRhICk7XHJcblx0XHRcdFx0XHRob2xkZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSApICk7XHJcblx0XHRcdFx0XHRob2xkZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfICkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHR0aGlzLmFwcGVuZF9yb3coIHBhbmVsLCB7XHJcblx0XHRcdFx0XHRsYWJlbCAgIDogZGF0YVtpXT8ubGFiZWwgfHwgJycsXHJcblx0XHRcdFx0XHR2YWx1ZSAgIDogZGF0YVtpXT8udmFsdWUgfHwgJycsXHJcblx0XHRcdFx0XHRzZWxlY3RlZDogISFkYXRhW2ldPy5zZWxlY3RlZCxcclxuXHRcdFx0XHRcdGluZGV4ICAgOiBpLFxyXG5cdFx0XHRcdFx0dWlkICAgICA6IHRoaXMubWFrZV91aWQoKVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zeW5jX2RlZmF1bHRfdmFsdWVfbG9jayggcGFuZWwgKTtcclxuXHRcdFx0dGhpcy5zeW5jX3BsYWNlaG9sZGVyX2xvY2soIHBhbmVsICk7XHJcblx0XHRcdHRoaXMuc3luY192YWx1ZV9pbnB1dHNfdmlzaWJpbGl0eSggcGFuZWwgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgaGFzX3Jvd19kZWZhdWx0cyhwYW5lbCkge1xyXG5cdFx0XHRjb25zdCBjaGVja3MgPSBwYW5lbD8ucXVlcnlTZWxlY3RvckFsbCggdGhpcy51aS50b2dnbGUgKTtcclxuXHRcdFx0aWYgKCAhY2hlY2tzPy5sZW5ndGggKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGNoZWNrcy5sZW5ndGg7IGkrKyApIGlmICggY2hlY2tzW2ldLmNoZWNrZWQgKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBpc19tdWx0aXBsZV9lbmFibGVkKHBhbmVsKSB7XHJcblx0XHRcdGNvbnN0IGNoayA9IHBhbmVsPy5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLm11bHRpcGxlX2NoayApO1xyXG5cdFx0XHRyZXR1cm4gISEoY2hrICYmIGNoay5jaGVja2VkKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgaGFzX3RleHRfZGVmYXVsdF92YWx1ZShwYW5lbCkge1xyXG5cdFx0XHRjb25zdCBkdiA9IHBhbmVsPy5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLmRlZmF1bHRfdGV4dCApO1xyXG5cdFx0XHRyZXR1cm4gISEoZHYgJiYgU3RyaW5nKCBkdi52YWx1ZSB8fCAnJyApLnRyaW0oKS5sZW5ndGgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBzeW5jX2RlZmF1bHRfdmFsdWVfbG9jayhwYW5lbCkge1xyXG5cdFx0XHRjb25zdCBpbnB1dCA9IHBhbmVsPy5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLmRlZmF1bHRfdGV4dCApO1xyXG5cdFx0XHRjb25zdCBub3RlICA9IHBhbmVsPy5xdWVyeVNlbGVjdG9yKCAnLmpzLWRlZmF1bHQtdmFsdWUtbm90ZScgKTtcclxuXHRcdFx0aWYgKCAhaW5wdXQgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBsb2NrICAgICA9IHRoaXMuaGFzX3Jvd19kZWZhdWx0cyggcGFuZWwgKTtcclxuXHRcdFx0aW5wdXQuZGlzYWJsZWQgPSAhIWxvY2s7XHJcblx0XHRcdGlmICggbG9jayApIHtcclxuXHRcdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJywgJ3RydWUnICk7XHJcblx0XHRcdFx0aWYgKCBub3RlICkgbm90ZS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aW5wdXQucmVtb3ZlQXR0cmlidXRlKCAnYXJpYS1kaXNhYmxlZCcgKTtcclxuXHRcdFx0XHRpZiAoIG5vdGUgKSBub3RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgc3luY19wbGFjZWhvbGRlcl9sb2NrKHBhbmVsKSB7XHJcblx0XHRcdGNvbnN0IGlucHV0ID0gcGFuZWw/LnF1ZXJ5U2VsZWN0b3IoIHRoaXMudWkucGxhY2Vob2xkZXJfaW5wdXQgKTtcclxuXHRcdFx0Y29uc3Qgbm90ZSAgPSBwYW5lbD8ucXVlcnlTZWxlY3RvciggdGhpcy51aS5wbGFjZWhvbGRlcl9ub3RlICk7XHJcblxyXG5cdFx0XHQvLyBORVc6IGNvbXB1dGUgbXVsdGlwbGUgYW5kIHRvZ2dsZSByb3cgdmlzaWJpbGl0eVxyXG5cdFx0XHRjb25zdCBpc011bHRpcGxlICAgICA9IHRoaXMuaXNfbXVsdGlwbGVfZW5hYmxlZCggcGFuZWwgKTtcclxuXHRcdFx0Y29uc3QgcGxhY2Vob2xkZXJSb3cgPSBpbnB1dD8uY2xvc2VzdCggJy5pbnNwZWN0b3JfX3JvdycgKSB8fCBudWxsO1xyXG5cdFx0XHRjb25zdCBzaXplSW5wdXQgICAgICA9IHBhbmVsPy5xdWVyeVNlbGVjdG9yKCB0aGlzLnVpLnNpemVfaW5wdXQgKSB8fCBudWxsO1xyXG5cdFx0XHRjb25zdCBzaXplUm93ICAgICAgICA9IHNpemVJbnB1dD8uY2xvc2VzdCggJy5pbnNwZWN0b3JfX3JvdycgKSB8fCBudWxsO1xyXG5cclxuXHRcdFx0Ly8gU2hvdyBwbGFjZWhvbGRlciBvbmx5IGZvciBzaW5nbGUtc2VsZWN0OyBzaG93IHNpemUgb25seSBmb3IgbXVsdGlwbGVcclxuXHRcdFx0aWYgKCBwbGFjZWhvbGRlclJvdyApIHBsYWNlaG9sZGVyUm93LnN0eWxlLmRpc3BsYXkgPSBpc011bHRpcGxlID8gJ25vbmUnIDogJyc7XHJcblx0XHRcdGlmICggc2l6ZVJvdyApIHNpemVSb3cuc3R5bGUuZGlzcGxheSA9IGlzTXVsdGlwbGUgPyAnJyA6ICdub25lJztcclxuXHJcblx0XHRcdC8vIEV4aXN0aW5nIGJlaGF2aW9yIChrZWVwIGFzLWlzKVxyXG5cdFx0XHRpZiAoICFpbnB1dCApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IGxvY2sgPSBpc011bHRpcGxlIHx8IHRoaXMuaGFzX3Jvd19kZWZhdWx0cyggcGFuZWwgKSB8fCB0aGlzLmhhc190ZXh0X2RlZmF1bHRfdmFsdWUoIHBhbmVsICk7XHJcblx0XHRcdGlmICggbm90ZSAmJiAhbm90ZS5pZCApIG5vdGUuaWQgPSAnd3BiY19wbGFjZWhvbGRlcl9ub3RlXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCAzNiApLnNsaWNlKCAyLCAxMCApO1xyXG5cclxuXHRcdFx0aW5wdXQuZGlzYWJsZWQgPSAhIWxvY2s7XHJcblx0XHRcdGlmICggbG9jayApIHtcclxuXHRcdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJywgJ3RydWUnICk7XHJcblx0XHRcdFx0aWYgKCBub3RlICkge1xyXG5cdFx0XHRcdFx0bm90ZS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcblx0XHRcdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoICdhcmlhLWRlc2NyaWJlZGJ5Jywgbm90ZS5pZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJyApO1xyXG5cdFx0XHRcdGlucHV0LnJlbW92ZUF0dHJpYnV0ZSggJ2FyaWEtZGVzY3JpYmVkYnknICk7XHJcblx0XHRcdFx0aWYgKCBub3RlICkgbm90ZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGVuZm9yY2Vfc2luZ2xlX2RlZmF1bHQocGFuZWwsIGNsaWNrZWQpIHtcclxuXHRcdFx0aWYgKCB0aGlzLmlzX211bHRpcGxlX2VuYWJsZWQoIHBhbmVsICkgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBjaGVja3MgPSBwYW5lbD8ucXVlcnlTZWxlY3RvckFsbCggdGhpcy51aS50b2dnbGUgKTtcclxuXHRcdFx0aWYgKCAhY2hlY2tzPy5sZW5ndGggKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAoIGNsaWNrZWQgJiYgY2xpY2tlZC5jaGVja2VkICkge1xyXG5cdFx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGNoZWNrcy5sZW5ndGg7IGkrKyApIGlmICggY2hlY2tzW2ldICE9PSBjbGlja2VkICkge1xyXG5cdFx0XHRcdFx0Y2hlY2tzW2ldLmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGNoZWNrc1tpXS5zZXRBdHRyaWJ1dGUoICdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNsaWNrZWQuc2V0QXR0cmlidXRlKCAnYXJpYS1jaGVja2VkJywgJ3RydWUnICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQga2VwdCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKCBsZXQgaiA9IDA7IGogPCBjaGVja3MubGVuZ3RoOyBqKysgKSBpZiAoIGNoZWNrc1tqXS5jaGVja2VkICkge1xyXG5cdFx0XHRcdGlmICggIWtlcHQgKSB7XHJcblx0XHRcdFx0XHRrZXB0ID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2tzW2pdLmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGNoZWNrc1tqXS5zZXRBdHRyaWJ1dGUoICdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnN5bmNfZGVmYXVsdF92YWx1ZV9sb2NrKCBwYW5lbCApO1xyXG5cdFx0XHR0aGlzLnN5bmNfcGxhY2Vob2xkZXJfbG9jayggcGFuZWwgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyAtLS0tIG9uZS10aW1lIGJvb3RzdHJhcCBvZiBhIHBhbmVsIC0tLS1cclxuXHRcdHN0YXRpYyBib290c3RyYXBfcGFuZWwocGFuZWwpIHtcclxuXHRcdFx0aWYgKCAhcGFuZWwgKSByZXR1cm47XHJcblx0XHRcdGlmICggIXBhbmVsLnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX29wdGlvbnNfZWRpdG9yJyApICkgcmV0dXJuOyAvLyBvbmx5IHNlbGVjdC1saWtlIFVJc1xyXG5cdFx0XHRpZiAoIHBhbmVsLmRhdGFzZXQuc2VsZWN0YmFzZV9ib290c3RyYXBwZWQgPT09ICcxJyApIHtcclxuXHRcdFx0XHR0aGlzLmVuc3VyZV9zb3J0YWJsZSggcGFuZWwgKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucmVidWlsZF9pZl9lbXB0eSggcGFuZWwgKTtcclxuXHRcdFx0dGhpcy5lbnN1cmVfc29ydGFibGUoIHBhbmVsICk7XHJcblx0XHRcdHBhbmVsLmRhdGFzZXQuc2VsZWN0YmFzZV9ib290c3RyYXBwZWQgPSAnMSc7XHJcblxyXG5cdFx0XHR0aGlzLnN5bmNfZGVmYXVsdF92YWx1ZV9sb2NrKCBwYW5lbCApO1xyXG5cdFx0XHR0aGlzLnN5bmNfcGxhY2Vob2xkZXJfbG9jayggcGFuZWwgKTtcclxuXHRcdFx0dGhpcy5zeW5jX3ZhbHVlX2lucHV0c192aXNpYmlsaXR5KCBwYW5lbCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIC0tLS0gaG9vayBpbnRvIGluc3BlY3RvciBsaWZlY3ljbGUgKGZpcmVzIE9OQ0UpIC0tLS1cclxuXHRcdHN0YXRpYyB3aXJlX29uY2UoKSB7XHJcblx0XHRcdGlmICggQ29yZS5fX3NlbGVjdGJhc2Vfd2lyZWQgKSByZXR1cm47XHJcblx0XHRcdENvcmUuX19zZWxlY3RiYXNlX3dpcmVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdGNvbnN0IG9uX3JlYWR5X29yX3JlbmRlciA9IChldikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHBhbmVsID0gZXY/LmRldGFpbD8ucGFuZWw7XHJcblx0XHRcdFx0Y29uc3QgZmllbGQgPSBldj8uZGV0YWlsPy5lbCB8fCBldj8uZGV0YWlsPy5maWVsZCB8fCBudWxsO1xyXG5cdFx0XHRcdGlmICggIXBhbmVsICkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICggZmllbGQgKSBwYW5lbC5fX3NlbGVjdGJhc2VfZmllbGQgPSBmaWVsZDtcclxuXHRcdFx0XHR0aGlzLmJvb3RzdHJhcF9wYW5lbCggcGFuZWwgKTtcclxuXHRcdFx0XHQvLyBJZiB0aGUgaW5zcGVjdG9yIHJvb3Qgd2FzIHJlbW91bnRlZCwgZW5zdXJlIHJvb3QgbGlzdGVuZXJzIGFyZSAocmUpYm91bmQuXHJcblx0XHRcdFx0dGhpcy53aXJlX3Jvb3RfbGlzdGVuZXJzKCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnd3BiY19iZmJfaW5zcGVjdG9yX3JlYWR5Jywgb25fcmVhZHlfb3JfcmVuZGVyICk7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3cGJjX2JmYl9pbnNwZWN0b3JfcmVuZGVyJywgb25fcmVhZHlfb3JfcmVuZGVyICk7XHJcblxyXG5cdFx0XHR0aGlzLndpcmVfcm9vdF9saXN0ZW5lcnMoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgd2lyZV9yb290X2xpc3RlbmVycygpIHtcclxuXHJcblx0XHRcdC8vIElmIGFscmVhZHkgd2lyZWQgQU5EIHRoZSBzdG9yZWQgcm9vdCBpcyBzdGlsbCBpbiB0aGUgRE9NLCBiYWlsIG91dC5cclxuXHRcdFx0aWYgKCB0aGlzLl9fcm9vdF93aXJlZCAmJiB0aGlzLl9fcm9vdF9ub2RlPy5pc0Nvbm5lY3RlZCApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdGlmICggIXJvb3QgKSB7XHJcblx0XHRcdFx0Ly8gUm9vdCBtaXNzaW5nIChlLmcuLCBTUEEgcmUtcmVuZGVyKSDigJQgY2xlYXIgZmxhZ3Mgc28gd2UgY2FuIHdpcmUgbGF0ZXIuXHJcblx0XHRcdFx0dGhpcy5fX3Jvb3Rfd2lyZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLl9fcm9vdF9ub2RlICA9IG51bGw7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9fcm9vdF9ub2RlICAgICAgICAgICAgICAgICAgID0gcm9vdDtcclxuXHRcdFx0dGhpcy5fX3Jvb3Rfd2lyZWQgICAgICAgICAgICAgICAgICA9IHRydWU7XHJcblx0XHRcdHJvb3QuZGF0YXNldC5zZWxlY3RiYXNlX3Jvb3Rfd2lyZWQgPSAnMSc7XHJcblxyXG5cdFx0XHRjb25zdCBnZXRfcGFuZWwgPSAodGFyZ2V0KSA9PlxyXG5cdFx0XHRcdHRhcmdldD8uY2xvc2VzdD8uKCAnLndwYmNfYmZiX19pbnNwZWN0b3JfX2JvZHknICkgfHxcclxuXHRcdFx0XHRyb290LnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX2luc3BlY3Rvcl9fYm9keScgKSB8fCBudWxsO1xyXG5cclxuXHRcdFx0Ly8gQ2xpY2sgaGFuZGxlcnM6IGFkZCAvIGRlbGV0ZSAvIGR1cGxpY2F0ZVxyXG5cdFx0XHRyb290LmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgcGFuZWwgPSBnZXRfcGFuZWwoIGUudGFyZ2V0ICk7XHJcblx0XHRcdFx0aWYgKCAhcGFuZWwgKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdHRoaXMuYm9vdHN0cmFwX3BhbmVsKCBwYW5lbCApO1xyXG5cclxuXHRcdFx0XHRjb25zdCB1aSA9IHRoaXMudWk7XHJcblxyXG5cdFx0XHRcdC8vIEV4aXN0aW5nIFwiQWRkIG9wdGlvblwiIGJ1dHRvbiAodG9wIHRvb2xiYXIpXHJcblx0XHRcdFx0Y29uc3QgYWRkID0gZS50YXJnZXQuY2xvc2VzdD8uKCB1aS5hZGRfYnRuICk7XHJcblx0XHRcdFx0aWYgKCBhZGQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFwcGVuZF9yb3coIHBhbmVsLCB7IGxhYmVsOiAnJywgdmFsdWU6ICcnLCBzZWxlY3RlZDogZmFsc2UgfSApO1xyXG5cdFx0XHRcdFx0dGhpcy5jb21taXRfb3B0aW9ucyggcGFuZWwgKTtcclxuXHRcdFx0XHRcdHRoaXMuc3luY192YWx1ZV9pbnB1dHNfdmlzaWJpbGl0eSggcGFuZWwgKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIERyb3Bkb3duIG1lbnUgYWN0aW9ucy5cclxuXHRcdFx0XHRjb25zdCBtZW51X2FjdGlvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LiggdWkubWVudV9hY3Rpb24gKTtcclxuXHRcdFx0XHRpZiAoIG1lbnVfYWN0aW9uICkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBhY3Rpb24gPSAobWVudV9hY3Rpb24uZ2V0QXR0cmlidXRlKCAnZGF0YS1hY3Rpb24nICkgfHwgJycpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0XHRjb25zdCByb3cgICAgPSBtZW51X2FjdGlvbi5jbG9zZXN0Py4oIHVpLnJvdyApO1xyXG5cclxuXHRcdFx0XHRcdGlmICggIXJvdyApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jbG9zZV9kcm9wZG93biggbWVudV9hY3Rpb24gKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggJ2FkZF9hZnRlcicgPT09IGFjdGlvbiApIHtcclxuXHRcdFx0XHRcdFx0Ly8gQWRkIGVtcHR5IHJvdyBhZnRlciBjdXJyZW50XHJcblx0XHRcdFx0XHRcdGNvbnN0IHByZXZfY291bnQgPSB0aGlzLmdldF9saXN0KCBwYW5lbCApPy5jaGlsZHJlbi5sZW5ndGggfHwgMDtcclxuXHRcdFx0XHRcdFx0dGhpcy5hcHBlbmRfcm93KCBwYW5lbCwgeyBsYWJlbDogJycsIHZhbHVlOiAnJywgc2VsZWN0ZWQ6IGZhbHNlIH0gKTtcclxuXHRcdFx0XHRcdFx0Ly8gTW92ZSB0aGUgbmV3bHkgYWRkZWQgbGFzdCByb3cganVzdCBhZnRlciBjdXJyZW50IHJvdyB0byBwcmVzZXJ2ZSBcImFkZCBhZnRlclwiXHJcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSB0aGlzLmdldF9saXN0KCBwYW5lbCApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIGxpc3QgJiYgbGlzdC5sYXN0RWxlbWVudENoaWxkICYmIGxpc3QubGFzdEVsZW1lbnRDaGlsZCAhPT0gcm93ICkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaW5zZXJ0X2FmdGVyKCBsaXN0Lmxhc3RFbGVtZW50Q2hpbGQsIHJvdyApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMuY29tbWl0X29wdGlvbnMoIHBhbmVsICk7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3luY192YWx1ZV9pbnB1dHNfdmlzaWJpbGl0eSggcGFuZWwgKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICdkdXBsaWNhdGUnID09PSBhY3Rpb24gKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGxibCA9IChyb3cucXVlcnlTZWxlY3RvciggdWkubGFiZWwgKSB8fCB7fSkudmFsdWUgfHwgJyc7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHZhbCA9IChyb3cucXVlcnlTZWxlY3RvciggdWkudmFsdWUgKSB8fCB7fSkudmFsdWUgfHwgJyc7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHNlbCA9ICEhKChyb3cucXVlcnlTZWxlY3RvciggdWkudG9nZ2xlICkgfHwge30pLmNoZWNrZWQpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFwcGVuZF9yb3coIHBhbmVsLCB7IGxhYmVsOiBsYmwsIHZhbHVlOiB2YWwsIHNlbGVjdGVkOiBzZWwsIHVpZDogdGhpcy5tYWtlX3VpZCgpIH0gKTtcclxuXHRcdFx0XHRcdFx0Ly8gUGxhY2UgdGhlIG5ldyByb3cgcmlnaHQgYWZ0ZXIgdGhlIGN1cnJlbnQuXHJcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSB0aGlzLmdldF9saXN0KCBwYW5lbCApO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCBsaXN0ICYmIGxpc3QubGFzdEVsZW1lbnRDaGlsZCAmJiBsaXN0Lmxhc3RFbGVtZW50Q2hpbGQgIT09IHJvdyApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmluc2VydF9hZnRlciggbGlzdC5sYXN0RWxlbWVudENoaWxkLCByb3cgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLmVuZm9yY2Vfc2luZ2xlX2RlZmF1bHQoIHBhbmVsLCBudWxsICk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY29tbWl0X29wdGlvbnMoIHBhbmVsICk7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3luY192YWx1ZV9pbnB1dHNfdmlzaWJpbGl0eSggcGFuZWwgKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICdyZW1vdmUnID09PSBhY3Rpb24gKSB7XHJcblx0XHRcdFx0XHRcdGlmICggcm93ICYmIHJvdy5wYXJlbnROb2RlICkgcm93LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHJvdyApO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbW1pdF9vcHRpb25zKCBwYW5lbCApO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN5bmNfdmFsdWVfaW5wdXRzX3Zpc2liaWxpdHkoIHBhbmVsICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZV9kcm9wZG93biggbWVudV9hY3Rpb24gKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LCB0cnVlICk7XHJcblxyXG5cclxuXHRcdFx0Ly8gSW5wdXQgZGVsZWdhdGlvbi5cclxuXHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHBhbmVsID0gZ2V0X3BhbmVsKCBlLnRhcmdldCApO1xyXG5cdFx0XHRcdGlmICggISBwYW5lbCApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29uc3QgdWkgICAgICAgICAgICAgICAgPSB0aGlzLnVpO1xyXG5cdFx0XHRcdGNvbnN0IGlzX2xhYmVsX29yX3ZhbHVlID0gZS50YXJnZXQuY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19vcHQtbGFiZWwnICkgfHwgZS50YXJnZXQuY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19vcHQtdmFsdWUnICk7XHJcblx0XHRcdFx0Y29uc3QgaXNfdG9nZ2xlICAgICAgICAgPSBlLnRhcmdldC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCAnd3BiY19iZmJfX29wdC1zZWxlY3RlZC1jaGsnICk7XHJcblx0XHRcdFx0Y29uc3QgaXNfbXVsdGlwbGUgICAgICAgPSBlLnRhcmdldC5tYXRjaGVzPy4oIHVpLm11bHRpcGxlX2NoayApO1xyXG5cdFx0XHRcdGNvbnN0IGlzX2RlZmF1bHRfdGV4dCAgID0gZS50YXJnZXQubWF0Y2hlcz8uKCB1aS5kZWZhdWx0X3RleHQgKTtcclxuXHRcdFx0XHRjb25zdCBpc192YWx1ZV9kaWZmZXJzICA9IGUudGFyZ2V0Lm1hdGNoZXM/LiggdWkudmFsdWVfZGlmZmVyc19jaGsgKTtcclxuXHJcblx0XHRcdFx0Ly8gSGFuZGxlIFwidmFsdWUgZGlmZmVyc1wiIHRvZ2dsZSBsaXZlXHJcblx0XHRcdFx0aWYgKCBpc192YWx1ZV9kaWZmZXJzICkge1xyXG5cdFx0XHRcdFx0dGhpcy5zeW5jX3ZhbHVlX2lucHV0c192aXNpYmlsaXR5KCBwYW5lbCApO1xyXG5cdFx0XHRcdFx0dGhpcy5jb21taXRfb3B0aW9ucyggcGFuZWwgKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFRyYWNrIHdoZW4gdGhlIHVzZXIgZWRpdHMgVkFMVUUgZXhwbGljaXRseVxyXG5cdFx0XHRcdGlmICggZS50YXJnZXQuY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19vcHQtdmFsdWUnICkgKSB7XHJcblx0XHRcdFx0XHRjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCB0aGlzLnVpLnJvdyApO1xyXG5cdFx0XHRcdFx0dGhpcy5tYXJrX3Jvd192YWx1ZV91c2VyX3RvdWNoZWQoIHJvdyApO1xyXG5cdFx0XHRcdFx0Ly8gS2VlcCB0aGUgY2FjaGUgdXBkYXRlZCBzbyB0b2dnbGluZyBPRkYvT04gbGF0ZXIgcmVzdG9yZXMgdGhlIGxhdGVzdCBjdXN0b20gdmFsdWVcclxuXHRcdFx0XHRcdGUudGFyZ2V0LmRhdGFzZXQuY2FjaGVkX3ZhbHVlID0gZS50YXJnZXQudmFsdWUgfHwgJyc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBBdXRvLWZpbGwgVkFMVUUgZnJvbSBMQUJFTCBpZiB2YWx1ZSBpcyBmcmVzaCAoYW5kIGRpZmZlcnMgaXMgT04pOyBpZiBkaWZmZXJzIGlzIE9GRiwgd2UgbWlycm9yIGFueXdheSBpbiBjb21taXRcclxuXHRcdFx0XHRpZiAoIGUudGFyZ2V0LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fb3B0LWxhYmVsJyApICkge1xyXG5cdFx0XHRcdFx0Y29uc3Qgcm93ICAgICA9IGUudGFyZ2V0LmNsb3Nlc3QoIHVpLnJvdyApO1xyXG5cdFx0XHRcdFx0Y29uc3QgdmFsX2luICA9IHJvdz8ucXVlcnlTZWxlY3RvciggdWkudmFsdWUgKTtcclxuXHRcdFx0XHRcdGNvbnN0IGRpZmZlcnMgPSB0aGlzLmlzX3ZhbHVlX2RpZmZlcnNfZW5hYmxlZCggcGFuZWwgKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHZhbF9pbiApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCAhZGlmZmVycyApIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBzaW5nbGUtaW5wdXQgbW9kZTogbWlycm9yIGh1bWFuIGxhYmVsIHdpdGggbWluaW1hbCBlc2NhcGluZ1xyXG5cdFx0XHRcdFx0XHRcdHZhbF9pbi52YWx1ZSA9IHRoaXMuYnVpbGRfdmFsdWVfZnJvbV9sYWJlbCggZS50YXJnZXQudmFsdWUsIGZhbHNlICk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICF0aGlzLmlzX3Jvd192YWx1ZV91c2VyX3RvdWNoZWQoIHJvdyApICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNlcGFyYXRlLXZhbHVlIG1vZGUsIG9ubHkgd2hpbGUgZnJlc2hcclxuXHRcdFx0XHRcdFx0XHR2YWxfaW4udmFsdWUgPSB0aGlzLmJ1aWxkX3ZhbHVlX2Zyb21fbGFiZWwoIGUudGFyZ2V0LnZhbHVlLCB0cnVlICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRpZiAoIGlzX2xhYmVsX29yX3ZhbHVlIHx8IGlzX3RvZ2dsZSB8fCBpc19tdWx0aXBsZSApIHtcclxuXHRcdFx0XHRcdGlmICggaXNfdG9nZ2xlICkgZS50YXJnZXQuc2V0QXR0cmlidXRlKCAnYXJpYS1jaGVja2VkJywgZS50YXJnZXQuY2hlY2tlZCA/ICd0cnVlJyA6ICdmYWxzZScgKTtcclxuXHRcdFx0XHRcdGlmICggaXNfdG9nZ2xlIHx8IGlzX211bHRpcGxlICkgdGhpcy5lbmZvcmNlX3NpbmdsZV9kZWZhdWx0KCBwYW5lbCwgaXNfdG9nZ2xlID8gZS50YXJnZXQgOiBudWxsICk7XHJcblx0XHRcdFx0XHR0aGlzLmNvbW1pdF9vcHRpb25zKCBwYW5lbCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCBpc19kZWZhdWx0X3RleHQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnN5bmNfZGVmYXVsdF92YWx1ZV9sb2NrKCBwYW5lbCApO1xyXG5cdFx0XHRcdFx0dGhpcy5zeW5jX3BsYWNlaG9sZGVyX2xvY2soIHBhbmVsICk7XHJcblx0XHRcdFx0XHRjb25zdCBob2xkZXIgPSB0aGlzLmdldF9ob2xkZXIoIHBhbmVsICk7XHJcblx0XHRcdFx0XHRpZiAoIGhvbGRlciApIHtcclxuXHRcdFx0XHRcdFx0aG9sZGVyLmRpc3BhdGNoRXZlbnQoIG5ldyBFdmVudCggJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0XHRob2xkZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdHJ1ZSApO1xyXG5cclxuXHJcblx0XHRcdC8vIENoYW5nZSBkZWxlZ2F0aW9uXHJcblx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIChlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgcGFuZWwgPSBnZXRfcGFuZWwoIGUudGFyZ2V0ICk7XHJcblx0XHRcdFx0aWYgKCAhcGFuZWwgKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGNvbnN0IHVpICAgICAgICA9IHRoaXMudWk7XHJcblx0XHRcdFx0Y29uc3QgaXNfdG9nZ2xlID0gZS50YXJnZXQuY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19vcHQtc2VsZWN0ZWQtY2hrJyApO1xyXG5cdFx0XHRcdGNvbnN0IGlzX211bHRpICA9IGUudGFyZ2V0Lm1hdGNoZXM/LiggdWkubXVsdGlwbGVfY2hrICk7XHJcblx0XHRcdFx0aWYgKCAhaXNfdG9nZ2xlICYmICFpc19tdWx0aSApIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCBpc190b2dnbGUgKSBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoICdhcmlhLWNoZWNrZWQnLCBlLnRhcmdldC5jaGVja2VkID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xyXG5cdFx0XHRcdHRoaXMuZW5mb3JjZV9zaW5nbGVfZGVmYXVsdCggcGFuZWwsIGlzX3RvZ2dsZSA/IGUudGFyZ2V0IDogbnVsbCApO1xyXG5cdFx0XHRcdHRoaXMuY29tbWl0X29wdGlvbnMoIHBhbmVsICk7XHJcblx0XHRcdH0sIHRydWUgKTtcclxuXHJcblx0XHRcdC8vIExhenkgYm9vdHN0cmFwXHJcblx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZW50ZXInLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHBhbmVsID0gZ2V0X3BhbmVsKCBlLnRhcmdldCApO1xyXG5cdFx0XHRcdGlmICggcGFuZWwgJiYgZS50YXJnZXQ/LmNsb3Nlc3Q/LiggdGhpcy51aS5saXN0ICkgKSB0aGlzLmJvb3RzdHJhcF9wYW5lbCggcGFuZWwgKTtcclxuXHRcdFx0fSwgdHJ1ZSApO1xyXG5cclxuXHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgKGUpID0+IHtcclxuXHRcdFx0XHRjb25zdCBwYW5lbCA9IGdldF9wYW5lbCggZS50YXJnZXQgKTtcclxuXHRcdFx0XHRpZiAoIHBhbmVsICYmIGUudGFyZ2V0Py5jbG9zZXN0Py4oIHRoaXMudWkuZHJhZ19oYW5kbGUgKSApIHRoaXMuYm9vdHN0cmFwX3BhbmVsKCBwYW5lbCApO1xyXG5cdFx0XHR9LCB0cnVlICk7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdHRyeSB7IENvcmUuV1BCQ19CRkJfU2VsZWN0X0Jhc2Uud2lyZV9vbmNlKCk7IH0gY2F0Y2ggKF8pIHt9XHJcblx0Ly8gVHJ5IGltbWVkaWF0ZWx5IChpZiByb290IGlzIGFscmVhZHkgaW4gRE9NKSwgdGhlbiBhZ2FpbiBvbiBET01Db250ZW50TG9hZGVkLlxyXG5cdENvcmUuV1BCQ19CRkJfU2VsZWN0X0Jhc2Uud2lyZV9yb290X2xpc3RlbmVycygpO1xyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBDb3JlLldQQkNfQkZCX1NlbGVjdF9CYXNlLndpcmVfcm9vdF9saXN0ZW5lcnMoKTsgIH0pO1xyXG5cclxufSggd2luZG93ICkpOyIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyA9PSBGaWxlICAvaW5jbHVkZXMvcGFnZS1mb3JtLWJ1aWxkZXIvX291dC9jb3JlL2JmYi11aS5qcyA9PSB8IDIwMjUtMDktMTAgMTU6NDdcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbihmdW5jdGlvbiAodywgZCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gU2luZ2xlIGdsb2JhbCBuYW1lc3BhY2UgKGlkZW1wb3RlbnQgJiBsb2FkLW9yZGVyIHNhZmUpLlxyXG5cdGNvbnN0IENvcmUgPSAody5XUEJDX0JGQl9Db3JlID0gdy5XUEJDX0JGQl9Db3JlIHx8IHt9KTtcclxuXHRjb25zdCBVSSAgID0gKENvcmUuVUkgPSBDb3JlLlVJIHx8IHt9KTtcclxuXHJcblx0Ly8gLS0tIEhpZ2hsaWdodCBFbGVtZW50LCAgbGlrZSBHZW5lcmF0b3IgYnJuICAtICBUaW55IFVJIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0VUkuX3B1bHNlX3RpbWVycyA9IFVJLl9wdWxzZV90aW1lcnMgfHwgbmV3IE1hcCgpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGb3JjZS1yZXN0YXJ0IGEgQ1NTIGFuaW1hdGlvbiBvbiBhIGNsYXNzLlxyXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsc1xyXG5cdCAqL1xyXG5cdFVJLl9yZXN0YXJ0X2Nzc19hbmltYXRpb24gPSBmdW5jdGlvbiAoZWwsIGNscykge1xyXG5cdFx0aWYgKCAhIGVsICkgeyByZXR1cm47IH1cclxuXHRcdHRyeSB7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoIGNscyApO1xyXG5cdFx0fSBjYXRjaCAoIF8gKSB7fVxyXG5cdFx0Ly8gRm9yY2UgcmVmbG93IHNvIHRoZSBuZXh0IGFkZCgpIHJldHJpZ2dlcnMgdGhlIGtleWZyYW1lcy5cclxuXHRcdHZvaWQgZWwub2Zmc2V0V2lkdGg7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCBjbHMgKTtcclxuXHRcdH0gY2F0Y2ggKCBfICkge31cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHRcdFNpbmdsZSBwdWxzZSAoYmFjay1jb21wYXQpLlxyXG5cdFx0QHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuXHRcdEBwYXJhbSB7bnVtYmVyfSBkdXJfbXNcclxuXHQgKi9cclxuXHRVSS5wdWxzZV9vbmNlID0gZnVuY3Rpb24gKGVsLCBkdXJfbXMpIHtcclxuXHRcdGlmICggISBlbCApIHsgcmV0dXJuOyB9XHJcblx0XHR2YXIgY2xzID0gJ3dwYmNfYmZiX19zY3JvbGwtcHVsc2UnO1xyXG5cdFx0dmFyIG1zICA9IE51bWJlci5pc0Zpbml0ZSggZHVyX21zICkgPyBkdXJfbXMgOiA3MDA7XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KCBVSS5fcHVsc2VfdGltZXJzLmdldCggZWwgKSApO1xyXG5cdFx0fSBjYXRjaCAoIF8gKSB7fVxyXG5cdFx0VUkuX3Jlc3RhcnRfY3NzX2FuaW1hdGlvbiggZWwsIGNscyApO1xyXG5cdFx0dmFyIHQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSggY2xzICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBfICkge31cclxuXHRcdFx0VUkuX3B1bHNlX3RpbWVycy5kZWxldGUoIGVsICk7XHJcblx0XHR9LCBtcyApO1xyXG5cdFx0VUkuX3B1bHNlX3RpbWVycy5zZXQoIGVsLCB0ICk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0XHRNdWx0aS1ibGluayBzZXF1ZW5jZSB3aXRoIG9wdGlvbmFsIHBlci1jYWxsIGNvbG9yIG92ZXJyaWRlLlxyXG5cdFx0QHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuXHRcdEBwYXJhbSB7bnVtYmVyfSBbdGltZXM9M11cclxuXHRcdEBwYXJhbSB7bnVtYmVyfSBbb25fbXM9MjgwXVxyXG5cdFx0QHBhcmFtIHtudW1iZXJ9IFtvZmZfbXM9MTgwXVxyXG5cdFx0QHBhcmFtIHtzdHJpbmd9IFtoZXhfY29sb3JdIE9wdGlvbmFsIENTUyBjb2xvciAoZS5nLiAnI2ZmNGQ0Zicgb3IgJ3JnYiguLi4pJykuXHJcblx0ICovXHJcblx0VUkucHVsc2Vfc2VxdWVuY2UgPSBmdW5jdGlvbiAoZWwsIHRpbWVzLCBvbl9tcywgb2ZmX21zLCBoZXhfY29sb3IpIHtcclxuXHRcdGlmICggIWVsIHx8ICFkLmJvZHkuY29udGFpbnMoIGVsICkgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHZhciBjbHMgICA9ICd3cGJjX2JmYl9faGlnaGxpZ2h0LXB1bHNlJztcclxuXHRcdHZhciBjb3VudCA9IE51bWJlci5pc0Zpbml0ZSggdGltZXMgKSA/IHRpbWVzIDogMjtcclxuXHRcdHZhciBvbiAgICA9IE51bWJlci5pc0Zpbml0ZSggb25fbXMgKSA/IG9uX21zIDogMjgwO1xyXG5cdFx0dmFyIG9mZiAgID0gTnVtYmVyLmlzRmluaXRlKCBvZmZfbXMgKSA/IG9mZl9tcyA6IDE4MDtcclxuXHJcblx0XHQvLyBjYW5jZWwgYW55IHJ1bm5pbmcgcHVsc2UgYW5kIHJlc2V0IGNsYXNzLlxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KCBVSS5fcHVsc2VfdGltZXJzLmdldCggZWwgKSApO1xyXG5cdFx0fSBjYXRjaCAoIF8gKSB7fVxyXG5cdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSggY2xzICk7XHJcblxyXG5cdFx0dmFyIGhhdmVfY29sb3IgPSAhIWhleF9jb2xvciAmJiB0eXBlb2YgaGV4X2NvbG9yID09PSAnc3RyaW5nJztcclxuXHRcdGlmICggaGF2ZV9jb2xvciApIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRlbC5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3BiYy1iZmItcHVsc2UtY29sb3InLCBoZXhfY29sb3IgKTtcclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpID0gMDtcclxuXHRcdChmdW5jdGlvbiB0aWNrKCkge1xyXG5cdFx0XHRpZiAoIGkgPj0gY291bnQgKSB7XHJcblx0XHRcdFx0VUkuX3B1bHNlX3RpbWVycy5kZWxldGUoIGVsICk7XHJcblx0XHRcdFx0aWYgKCBoYXZlX2NvbG9yICkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0ZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkoICctLXdwYmMtYmZiLXB1bHNlLWNvbG9yJyApO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0VUkuX3Jlc3RhcnRfY3NzX2FuaW1hdGlvbiggZWwsIGNscyApO1xyXG5cdFx0XHRVSS5fcHVsc2VfdGltZXJzLnNldCggZWwsIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHsgICAgIC8vIE9OIC0+IE9GRlxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCBjbHMgKTtcclxuXHRcdFx0XHR9IGNhdGNoICggXyApIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0VUkuX3B1bHNlX3RpbWVycy5zZXQoIGVsLCBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7IC8vIE9GRiBnYXAgLT4gbmV4dFxyXG5cdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdFx0dGljaygpO1xyXG5cdFx0XHRcdH0sIG9mZiApICk7XHJcblx0XHRcdH0sIG9uICkgKTtcclxuXHRcdH0pKCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0XHRRdWVyeSArIHB1bHNlOlxyXG5cdFx0KEJDKSBJZiBvbmx5IDNyZCBhcmcgaXMgYSBudW1iZXIgYW5kIG5vIDR0aC81dGggLT4gc2luZ2xlIGxvbmcgcHVsc2UuXHJcblx0XHRPdGhlcndpc2UgLT4gc3Ryb25nIHNlcXVlbmNlIChkZWZhdWx0cyAzw5cyODAvMTgwKS5cclxuXHRcdE9wdGlvbmFsIDZ0aCBhcmc6IGNvbG9yLlxyXG5cdFx0QHBhcmFtIHtIVE1MRWxlbWVudHxzdHJpbmd9IHJvb3Rfb3Jfc2VsZWN0b3JcclxuXHRcdEBwYXJhbSB7c3RyaW5nfSBbc2VsZWN0b3JdXHJcblx0XHRAcGFyYW0ge251bWJlcn0gW2FdXHJcblx0XHRAcGFyYW0ge251bWJlcn0gW2JdXHJcblxyXG5cdFx0QHBhcmFtIHtudW1iZXJ9IFtjXVxyXG5cclxuXHRcdEBwYXJhbSB7c3RyaW5nfSBbY29sb3JdXHJcblx0ICovXHJcblx0VUkucHVsc2VfcXVlcnkgPSBmdW5jdGlvbiAocm9vdF9vcl9zZWxlY3Rvciwgc2VsZWN0b3IsIGEsIGIsIGMsIGNvbG9yKSB7XHJcblx0XHR2YXIgcm9vdCA9ICh0eXBlb2Ygcm9vdF9vcl9zZWxlY3RvciA9PT0gJ3N0cmluZycpID8gZCA6IChyb290X29yX3NlbGVjdG9yIHx8IGQpO1xyXG5cdFx0dmFyIHNlbCAgPSAodHlwZW9mIHJvb3Rfb3Jfc2VsZWN0b3IgPT09ICdzdHJpbmcnKSA/IHJvb3Rfb3Jfc2VsZWN0b3IgOiBzZWxlY3RvcjtcclxuXHRcdGlmICggIXNlbCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlbCA9IHJvb3QucXVlcnlTZWxlY3Rvciggc2VsICk7XHJcblx0XHRpZiAoICFlbCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuLy8gQmFjay1jb21wYXQ6IFVJLnB1bHNlUXVlcnkocm9vdCwgc2VsLCBkdXJfbXMpXHJcblx0XHRpZiAoIE51bWJlci5pc0Zpbml0ZSggYSApICYmIGIgPT09IHVuZGVmaW5lZCAmJiBjID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdHJldHVybiBVSS5wdWxzZV9vbmNlKCBlbCwgYSApO1xyXG5cdFx0fVxyXG4vLyBOZXc6IHNlcXVlbmNlOyBwYXJhbXMgb3B0aW9uYWw7IHN1cHBvcnRzIG9wdGlvbmFsIGNvbG9yLlxyXG5cdFx0VUkucHVsc2Vfc2VxdWVuY2UoIGVsLCBhLCBiLCBjLCBjb2xvciApO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdENvbnZlbmllbmNlIGhlbHBlciAoc25ha2VfY2FzZSkgdG8gY2FsbCBhIHN0cm9uZyBwdWxzZSB3aXRoIG9wdGlvbnMuXHJcblxyXG5cdEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcblxyXG5cdEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cclxuXHJcblx0QHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVzPTNdXHJcblxyXG5cdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5vbl9tcz0yODBdXHJcblxyXG5cdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5vZmZfbXM9MTgwXVxyXG5cclxuXHRAcGFyYW0ge3N0cmluZ30gW29wdHMuY29sb3JdXHJcblx0ICovXHJcblx0VUkucHVsc2Vfc2VxdWVuY2Vfc3Ryb25nID0gZnVuY3Rpb24gKGVsLCBvcHRzKSB7XHJcblx0XHRvcHRzID0gb3B0cyB8fCB7fTtcclxuXHRcdFVJLnB1bHNlX3NlcXVlbmNlKFxyXG5cdFx0XHRlbCxcclxuXHRcdFx0TnVtYmVyLmlzRmluaXRlKCBvcHRzLnRpbWVzICkgPyBvcHRzLnRpbWVzIDogMyxcclxuXHRcdFx0TnVtYmVyLmlzRmluaXRlKCBvcHRzLm9uX21zICkgPyBvcHRzLm9uX21zIDogMjgwLFxyXG5cdFx0XHROdW1iZXIuaXNGaW5pdGUoIG9wdHMub2ZmX21zICkgPyBvcHRzLm9mZl9tcyA6IDE4MCxcclxuXHRcdFx0b3B0cy5jb2xvclxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQmFzZSBjbGFzcyBmb3IgQkZCIG1vZHVsZXMuXHJcblx0ICovXHJcblx0VUkuV1BCQ19CRkJfTW9kdWxlID0gY2xhc3Mge1xyXG5cdFx0LyoqIEBwYXJhbSB7V1BCQ19Gb3JtX0J1aWxkZXJ9IGJ1aWxkZXIgKi9cclxuXHRcdGNvbnN0cnVjdG9yKGJ1aWxkZXIpIHtcclxuXHRcdFx0dGhpcy5idWlsZGVyID0gYnVpbGRlcjtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogSW5pdGlhbGl6ZSB0aGUgbW9kdWxlLiAqL1xyXG5cdFx0aW5pdCgpIHtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogQ2xlYW51cCB0aGUgbW9kdWxlLiAqL1xyXG5cdFx0ZGVzdHJveSgpIHtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDZW50cmFsIG92ZXJsYXkvY29udHJvbHMgbWFuYWdlciBmb3IgZmllbGRzL3NlY3Rpb25zLlxyXG5cdCAqIFB1cmUgVUkgY29tcG9zaXRpb247IGFsbCBhY3Rpb25zIHJvdXRlIGJhY2sgaW50byB0aGUgYnVpbGRlciBpbnN0YW5jZS5cclxuXHQgKi9cclxuXHRVSS5XUEJDX0JGQl9PdmVybGF5ID0gY2xhc3Mge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRW5zdXJlIGFuIG92ZXJsYXkgZXhpc3RzIGFuZCBpcyB3aXJlZCB1cCBvbiB0aGUgZWxlbWVudC5cclxuXHRcdCAqIEBwYXJhbSB7V1BCQ19Gb3JtX0J1aWxkZXJ9IGJ1aWxkZXJcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZmllbGQgb3Igc2VjdGlvbiBlbGVtZW50XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyBlbnN1cmUoYnVpbGRlciwgZWwpIHtcclxuXHJcblx0XHRcdGlmICggIWVsICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBpc1NlY3Rpb24gPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fc2VjdGlvbicgKTtcclxuXHJcblx0XHRcdC8vIGxldCBvdmVybGF5ID0gZWwucXVlcnlTZWxlY3RvciggQ29yZS5XUEJDX0JGQl9ET00uU0VMRUNUT1JTLm92ZXJsYXkgKTtcclxuXHRcdFx0bGV0IG92ZXJsYXkgPSBlbC5xdWVyeVNlbGVjdG9yKCBgOnNjb3BlID4gJHtDb3JlLldQQkNfQkZCX0RPTS5TRUxFQ1RPUlMub3ZlcmxheX1gICk7XHJcblx0XHRcdGlmICggIW92ZXJsYXkgKSB7XHJcblx0XHRcdFx0b3ZlcmxheSA9IENvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmNyZWF0ZV9lbGVtZW50KCAnZGl2JywgJ3dwYmNfYmZiX19vdmVybGF5LWNvbnRyb2xzJyApO1xyXG5cdFx0XHRcdGVsLnByZXBlbmQoIG92ZXJsYXkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRHJhZyBoYW5kbGUuXHJcblx0XHRcdGlmICggIW92ZXJsYXkucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fZHJhZy1oYW5kbGUnICkgKSB7XHJcblx0XHRcdFx0Y29uc3QgZHJhZ0NsYXNzID0gaXNTZWN0aW9uID8gJ3dwYmNfYmZiX19kcmFnLWhhbmRsZSBzZWN0aW9uLWRyYWctaGFuZGxlJyA6ICd3cGJjX2JmYl9fZHJhZy1oYW5kbGUnO1xyXG5cdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoXHJcblx0XHRcdFx0XHRDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5jcmVhdGVfZWxlbWVudCggJ3NwYW4nLCBkcmFnQ2xhc3MsICc8c3BhbiBjbGFzcz1cIndwYmNfaWNuX2RyYWdfaW5kaWNhdG9yXCI+PC9zcGFuPicgKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNFVFRJTkdTIGJ1dHRvbiAoc2hvd24gZm9yIGJvdGggZmllbGRzICYgc2VjdGlvbnMpLlxyXG5cdFx0XHRpZiAoICFvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX3NldHRpbmdzLWJ0bicgKSApIHtcclxuXHRcdFx0XHRjb25zdCBzZXR0aW5nc19idG4gICA9IENvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmNyZWF0ZV9lbGVtZW50KCAnYnV0dG9uJywgJ3dwYmNfYmZiX19zZXR0aW5ncy1idG4nLCAnPGkgY2xhc3M9XCJtZW51X2ljb24gaWNvbi0xeCB3cGJjX2ljbl9zZXR0aW5nc1wiPjwvaT4nICk7XHJcblx0XHRcdFx0c2V0dGluZ3NfYnRuLnR5cGUgICAgPSAnYnV0dG9uJztcclxuXHRcdFx0XHRzZXR0aW5nc19idG4udGl0bGUgICA9ICdPcGVuIHNldHRpbmdzJztcclxuXHRcdFx0XHRzZXR0aW5nc19idG4ub25jbGljayA9IChlKSA9PiB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHQvLyBTZWxlY3QgVEhJUyBlbGVtZW50IGFuZCBzY3JvbGwgaXQgaW50byB2aWV3LlxyXG5cdFx0XHRcdFx0YnVpbGRlci5zZWxlY3RfZmllbGQoIGVsLCB7IHNjcm9sbEludG9WaWV3OiB0cnVlIH0gKTtcclxuXHJcblx0XHRcdFx0XHQvLyBBdXRvLW9wZW4gSW5zcGVjdG9yIGZyb20gdGhlIG92ZXJsYXkg4oCcU2V0dGluZ3PigJ0gYnV0dG9uLlxyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCggbmV3IEN1c3RvbUV2ZW50KCAnd3BiY19iZmI6c2hvd19wYW5lbCcsIHtcclxuXHRcdFx0XHRcdFx0ZGV0YWlsOiB7XHJcblx0XHRcdFx0XHRcdFx0cGFuZWxfaWQ6ICd3cGJjX2JmYl9faW5zcGVjdG9yJyxcclxuXHRcdFx0XHRcdFx0XHR0YWJfaWQgIDogJ3dwYmNfdGFiX2luc3BlY3RvcidcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSApICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVHJ5IHRvIGJyaW5nIHRoZSBpbnNwZWN0b3IgaW50byB2aWV3IC8gZm9jdXMgZmlyc3QgaW5wdXQuXHJcblx0XHRcdFx0XHRjb25zdCBpbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdFx0XHRpZiAoIGlucyApIHtcclxuXHRcdFx0XHRcdFx0aW5zLnNjcm9sbEludG9WaWV3KCB7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICduZWFyZXN0JyB9ICk7XHJcblx0XHRcdFx0XHRcdC8vIEZvY3VzIGZpcnN0IGludGVyYWN0aXZlIGNvbnRyb2wgKGJlc3QtZWZmb3J0KS5cclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCggKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZvY3VzYWJsZSA9IGlucy5xdWVyeVNlbGVjdG9yKCAnaW5wdXQsc2VsZWN0LHRleHRhcmVhLGJ1dHRvbixbY29udGVudGVkaXRhYmxlXSxbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknICk7XHJcblx0XHRcdFx0XHRcdFx0Zm9jdXNhYmxlPy5mb2N1cz8uKCk7XHJcblx0XHRcdFx0XHRcdH0sIDI2MCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoIHNldHRpbmdzX2J0biApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvdmVybGF5LnNldEF0dHJpYnV0ZSggJ3JvbGUnLCAndG9vbGJhcicgKTtcclxuXHRcdFx0b3ZlcmxheS5zZXRBdHRyaWJ1dGUoICdhcmlhLWxhYmVsJywgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX3NlY3Rpb24nICkgPyAnU2VjdGlvbiB0b29scycgOiAnRmllbGQgdG9vbHMnICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gb3ZlcmxheTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBXUEJDIExheW91dCBDaGlwcyBoZWxwZXIgLSB2aXN1YWwgbGF5b3V0IHBpY2tlciAoY2hpcHMpLCBlLmcuLCBcIjUwJS81MCVcIiwgdG8gYSBzZWN0aW9uIG92ZXJsYXkuXHJcblx0ICpcclxuXHQgKiBSZW5kZXJzIEVxdWFsL1ByZXNldHMvQ3VzdG9tIGNoaXBzIGludG8gYSBob3N0IGNvbnRhaW5lciBhbmQgd2lyZXMgdGhlbSB0byBhcHBseSB0aGUgbGF5b3V0LlxyXG5cdCAqL1xyXG5cdFVJLldQQkNfQkZCX0xheW91dF9DaGlwcyA9IGNsYXNzIHtcclxuXHJcblx0XHQvKiogUmVhZCBwZXItY29sdW1uIG1pbiAocHgpIGZyb20gQ1NTIHZhciBzZXQgYnkgdGhlIGd1YXJkLiAqL1xyXG5cdFx0c3RhdGljIF9nZXRfY29sX21pbl9weChjb2wpIHtcclxuXHRcdFx0Y29uc3QgdiA9IGdldENvbXB1dGVkU3R5bGUoIGNvbCApLmdldFByb3BlcnR5VmFsdWUoICctLXdwYmMtY29sLW1pbicgKSB8fCAnMCc7XHJcblx0XHRcdGNvbnN0IG4gPSBwYXJzZUZsb2F0KCB2ICk7XHJcblx0XHRcdHJldHVybiBOdW1iZXIuaXNGaW5pdGUoIG4gKSA/IE1hdGgubWF4KCAwLCBuICkgOiAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVHVybiByYXcgd2VpZ2h0cyAoZS5nLiBbMSwxXSwgWzIsMSwxXSkgaW50byBlZmZlY3RpdmUgXCJhdmFpbGFibGUtJVwiIGJhc2VzIHRoYXRcclxuXHRcdCAqIChhKSBzdW0gdG8gdGhlIHJvdydzIGF2YWlsYWJsZSAlLCBhbmQgKGIpIG1lZXQgZXZlcnkgY29sdW1uJ3MgbWluIHB4LlxyXG5cdFx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBiYXNlcyAobnVtYmVycykgb3IgbnVsbCBpZiBpbXBvc3NpYmxlIHRvIHNhdGlzZnkgbWlucy5cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIF9maXRfd2VpZ2h0c19yZXNwZWN0aW5nX21pbihidWlsZGVyLCByb3csIHdlaWdodHMpIHtcclxuXHRcdFx0Y29uc3QgY29scyA9IEFycmF5LmZyb20oIHJvdy5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gLndwYmNfYmZiX19jb2x1bW4nICkgKTtcclxuXHRcdFx0Y29uc3QgbiAgICA9IGNvbHMubGVuZ3RoO1xyXG5cdFx0XHRpZiAoICFuICkgcmV0dXJuIG51bGw7XHJcblx0XHRcdGlmICggIUFycmF5LmlzQXJyYXkoIHdlaWdodHMgKSB8fCB3ZWlnaHRzLmxlbmd0aCAhPT0gbiApIHJldHVybiBudWxsO1xyXG5cclxuXHRcdFx0Ly8gYXZhaWxhYmxlICUgYWZ0ZXIgZ2FwcyAoZnJvbSBMYXlvdXRTZXJ2aWNlKVxyXG5cdFx0XHRjb25zdCBncCAgICAgICA9IGJ1aWxkZXIuY29sX2dhcF9wZXJjZW50O1xyXG5cdFx0XHRjb25zdCBlZmYgICAgICA9IGJ1aWxkZXIubGF5b3V0LmNvbXB1dGVfZWZmZWN0aXZlX2Jhc2VzX2Zyb21fcm93KCByb3csIGdwICk7XHJcblx0XHRcdGNvbnN0IGF2YWlsUGN0ID0gZWZmLmF2YWlsYWJsZTsgICAgICAgICAgICAgICAvLyBlLmcuIDk0IGlmIDIgY29scyBhbmQgMyUgZ2FwXHJcblx0XHRcdGNvbnN0IHJvd1B4ICAgID0gcm93LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG5cdFx0XHRjb25zdCBhdmFpbFB4ICA9IHJvd1B4ICogKGF2YWlsUGN0IC8gMTAwKTtcclxuXHJcblx0XHRcdC8vIGNvbGxlY3QgbWluaW1hIGluICUgb2YgXCJhdmFpbGFibGVcIlxyXG5cdFx0XHRjb25zdCBtaW5QY3QgPSBjb2xzLm1hcCggKGMpID0+IHtcclxuXHRcdFx0XHRjb25zdCBtaW5QeCA9IFVJLldQQkNfQkZCX0xheW91dF9DaGlwcy5fZ2V0X2NvbF9taW5fcHgoIGMgKTtcclxuXHRcdFx0XHRpZiAoIGF2YWlsUHggPD0gMCApIHJldHVybiAwO1xyXG5cdFx0XHRcdHJldHVybiAobWluUHggLyBhdmFpbFB4KSAqIGF2YWlsUGN0O1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQvLyBJZiBtaW5zIGFsb25lIGRvbid0IGZpdCwgYmFpbC5cclxuXHRcdFx0Y29uc3Qgc3VtTWluID0gbWluUGN0LnJlZHVjZSggKGEsIGIpID0+IGEgKyBiLCAwICk7XHJcblx0XHRcdGlmICggc3VtTWluID4gYXZhaWxQY3QgLSAxZS02ICkge1xyXG5cdFx0XHRcdHJldHVybiBudWxsOyAvLyBpbXBvc3NpYmxlIHRvIHJlc3BlY3QgbWluczsgZG9uJ3QgYXBwbHkgcHJlc2V0XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRhcmdldCBwZXJjZW50YWdlcyBmcm9tIHdlaWdodHMsIG5vcm1hbGl6ZWQgdG8gYXZhaWxQY3QuXHJcblx0XHRcdGNvbnN0IHdTdW0gICAgICA9IHdlaWdodHMucmVkdWNlKCAoYSwgdykgPT4gYSArIChOdW1iZXIoIHcgKSB8fCAwKSwgMCApIHx8IG47XHJcblx0XHRcdGNvbnN0IHRhcmdldFBjdCA9IHdlaWdodHMubWFwKCAodykgPT4gKChOdW1iZXIoIHcgKSB8fCAwKSAvIHdTdW0pICogYXZhaWxQY3QgKTtcclxuXHJcblx0XHRcdC8vIExvY2sgY29sdW1ucyB0aGF0IHdvdWxkIGJlIGJlbG93IG1pbiwgdGhlbiBkaXN0cmlidXRlIHRoZSByZW1haW5kZXJcclxuXHRcdFx0Ly8gYWNyb3NzIHRoZSByZW1haW5pbmcgY29sdW1ucyBwcm9wb3J0aW9uYWxseSB0byB0aGVpciB0YXJnZXRQY3QuXHJcblx0XHRcdGNvbnN0IGxvY2tlZCAgPSBuZXcgQXJyYXkoIG4gKS5maWxsKCBmYWxzZSApO1xyXG5cdFx0XHRsZXQgbG9ja2VkU3VtID0gMDtcclxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgbjsgaSsrICkge1xyXG5cdFx0XHRcdGlmICggdGFyZ2V0UGN0W2ldIDwgbWluUGN0W2ldICkge1xyXG5cdFx0XHRcdFx0bG9ja2VkW2ldID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGxvY2tlZFN1bSArPSBtaW5QY3RbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcmVtYWluaW5nICAgICA9IGF2YWlsUGN0IC0gbG9ja2VkU3VtO1xyXG5cdFx0XHRjb25zdCBmcmVlSWR4ICAgICA9IFtdO1xyXG5cdFx0XHRsZXQgZnJlZVRhcmdldFN1bSA9IDA7XHJcblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IG47IGkrKyApIHtcclxuXHRcdFx0XHRpZiAoICFsb2NrZWRbaV0gKSB7XHJcblx0XHRcdFx0XHRmcmVlSWR4LnB1c2goIGkgKTtcclxuXHRcdFx0XHRcdGZyZWVUYXJnZXRTdW0gKz0gdGFyZ2V0UGN0W2ldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KCBuICkuZmlsbCggMCApO1xyXG5cdFx0XHQvLyBTZWVkIGxvY2tlZCB3aXRoIHRoZWlyIG1pbmltYS5cclxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgbjsgaSsrICkge1xyXG5cdFx0XHRcdGlmICggbG9ja2VkW2ldICkgcmVzdWx0W2ldID0gbWluUGN0W2ldO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGZyZWVJZHgubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdC8vIGV2ZXJ5dGhpbmcgbG9ja2VkIGV4YWN0bHkgYXQgbWluOyBhbnkgbGVmdG92ZXIgKHNob3VsZG4ndCBoYXBwZW4pXHJcblx0XHRcdFx0Ly8gd291bGQgYmUgaWdub3JlZCB0byBrZWVwIHNpbXBsaWNpdHkgYW5kIHN0YWJpbGl0eS5cclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHJlbWFpbmluZyA8PSAwICkge1xyXG5cdFx0XHRcdC8vIG5vdGhpbmcgbGVmdCB0byBkaXN0cmlidXRlOyBrZWVwIGV4YWN0bHkgbWlucyBvbiBsb2NrZWQsXHJcblx0XHRcdFx0Ly8gbm90aGluZyBmb3IgZnJlZSAoZGVnZW5lcmF0ZSBidXQgY29uc2lzdGVudClcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGZyZWVUYXJnZXRTdW0gPD0gMCApIHtcclxuXHRcdFx0XHQvLyBkaXN0cmlidXRlIGVxdWFsbHkgYW1vbmcgZnJlZSBjb2x1bW5zXHJcblx0XHRcdFx0Y29uc3QgZWFjaCA9IHJlbWFpbmluZyAvIGZyZWVJZHgubGVuZ3RoO1xyXG5cdFx0XHRcdGZyZWVJZHguZm9yRWFjaCggKGkpID0+IChyZXN1bHRbaV0gPSBlYWNoKSApO1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIERpc3RyaWJ1dGUgcmVtYWluaW5nIHByb3BvcnRpb25hbGx5IHRvIGZyZWUgY29sdW1ucycgdGFyZ2V0UGN0XHJcblx0XHRcdGZyZWVJZHguZm9yRWFjaCggKGkpID0+IHtcclxuXHRcdFx0XHRyZXN1bHRbaV0gPSByZW1haW5pbmcgKiAodGFyZ2V0UGN0W2ldIC8gZnJlZVRhcmdldFN1bSk7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogQXBwbHkgYSBwcmVzZXQgYnV0IGd1YXJkIGl0IGJ5IG1pbmltYTsgcmV0dXJucyB0cnVlIGlmIGFwcGxpZWQsIGZhbHNlIGlmIHNraXBwZWQuICovXHJcblx0XHRzdGF0aWMgX2FwcGx5X3ByZXNldF93aXRoX21pbl9ndWFyZChidWlsZGVyLCBzZWN0aW9uX2VsLCB3ZWlnaHRzKSB7XHJcblx0XHRcdGNvbnN0IHJvdyA9IHNlY3Rpb25fZWwucXVlcnlTZWxlY3RvciggJzpzY29wZSA+IC53cGJjX2JmYl9fcm93JyApO1xyXG5cdFx0XHRpZiAoICFyb3cgKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zdCBmaXR0ZWQgPSBVSS5XUEJDX0JGQl9MYXlvdXRfQ2hpcHMuX2ZpdF93ZWlnaHRzX3Jlc3BlY3RpbmdfbWluKCBidWlsZGVyLCByb3csIHdlaWdodHMgKTtcclxuXHRcdFx0aWYgKCAhZml0dGVkICkge1xyXG5cdFx0XHRcdGJ1aWxkZXI/Ll9hbm5vdW5jZT8uKCAnTm90IGVub3VnaCBzcGFjZSBmb3IgdGhpcyBsYXlvdXQgYmVjYXVzZSBvZiBmaWVsZHPigJkgbWluaW11bSB3aWR0aHMuJyApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gYGZpdHRlZGAgYWxyZWFkeSBzdW1zIHRvIHRoZSByb3figJlzIGF2YWlsYWJsZSAlLCBzbyB3ZSBjYW4gYXBwbHkgYmFzZXMgZGlyZWN0bHkuXHJcblx0XHRcdGJ1aWxkZXIubGF5b3V0LmFwcGx5X2Jhc2VzX3RvX3Jvdyggcm93LCBmaXR0ZWQgKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQnVpbGQgYW5kIGFwcGVuZCBsYXlvdXQgY2hpcHMgZm9yIGEgc2VjdGlvbi5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge1dQQkNfRm9ybV9CdWlsZGVyfSBidWlsZGVyIC0gVGhlIGZvcm0gYnVpbGRlciBpbnN0YW5jZS5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlY3Rpb25fZWwgLSBUaGUgLndwYmNfYmZiX19zZWN0aW9uIGVsZW1lbnQuXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBob3N0X2VsIC0gQ29udGFpbmVyIHdoZXJlIGNoaXBzIHNob3VsZCBiZSByZW5kZXJlZC5cclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgcmVuZGVyX2Zvcl9zZWN0aW9uKGJ1aWxkZXIsIHNlY3Rpb25fZWwsIGhvc3RfZWwpIHtcclxuXHJcblx0XHRcdGlmICggIWJ1aWxkZXIgfHwgIXNlY3Rpb25fZWwgfHwgIWhvc3RfZWwgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByb3cgPSBzZWN0aW9uX2VsLnF1ZXJ5U2VsZWN0b3IoICc6c2NvcGUgPiAud3BiY19iZmJfX3JvdycgKTtcclxuXHRcdFx0aWYgKCAhcm93ICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29scyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gLndwYmNfYmZiX19jb2x1bW4nICkubGVuZ3RoIHx8IDE7XHJcblxyXG5cdFx0XHQvLyBDbGVhciBob3N0LlxyXG5cdFx0XHRob3N0X2VsLmlubmVySFRNTCA9ICcnO1xyXG5cclxuXHRcdFx0Ly8gRXF1YWwgY2hpcC5cclxuXHRcdFx0aG9zdF9lbC5hcHBlbmRDaGlsZChcclxuXHRcdFx0XHRVSS5XUEJDX0JGQl9MYXlvdXRfQ2hpcHMuX21ha2VfY2hpcCggYnVpbGRlciwgc2VjdGlvbl9lbCwgQXJyYXkoIGNvbHMgKS5maWxsKCAxICksICdFcXVhbCcgKVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Ly8gUHJlc2V0cyBiYXNlZCBvbiBjb2x1bW4gY291bnQuXHJcblx0XHRcdGNvbnN0IHByZXNldHMgPSBidWlsZGVyLmxheW91dC5idWlsZF9wcmVzZXRzX2Zvcl9jb2x1bW5zKCBjb2xzICk7XHJcblx0XHRcdHByZXNldHMuZm9yRWFjaCggKHdlaWdodHMpID0+IHtcclxuXHRcdFx0XHRob3N0X2VsLmFwcGVuZENoaWxkKFxyXG5cdFx0XHRcdFx0VUkuV1BCQ19CRkJfTGF5b3V0X0NoaXBzLl9tYWtlX2NoaXAoIGJ1aWxkZXIsIHNlY3Rpb25fZWwsIHdlaWdodHMsIG51bGwgKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdC8vIEN1c3RvbSBjaGlwLlxyXG5cdFx0XHRjb25zdCBjdXN0b21CdG4gICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYnV0dG9uJyApO1xyXG5cdFx0XHRjdXN0b21CdG4udHlwZSAgICAgICAgPSAnYnV0dG9uJztcclxuXHRcdFx0Y3VzdG9tQnRuLmNsYXNzTmFtZSAgID0gJ3dwYmNfYmZiX19sYXlvdXRfY2hpcCc7XHJcblx0XHRcdGN1c3RvbUJ0bi50ZXh0Q29udGVudCA9ICdDdXN0b23igKYnO1xyXG5cdFx0XHRjdXN0b21CdG4udGl0bGUgICAgICAgPSBgRW50ZXIgJHtjb2xzfSBwZXJjZW50YWdlc2A7XHJcblx0XHRcdGN1c3RvbUJ0bi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgZXhhbXBsZSA9IChjb2xzID09PSAyKSA/ICc1MCw1MCcgOiAoY29scyA9PT0gMyA/ICcyMCw2MCwyMCcgOiAnMjUsMjUsMjUsMjUnKTtcclxuXHRcdFx0XHRjb25zdCB0ZXh0ICAgID0gcHJvbXB0KCBgRW50ZXIgJHtjb2xzfSBwZXJjZW50YWdlcyAoY29tbWEgb3Igc3BhY2Ugc2VwYXJhdGVkKTpgLCBleGFtcGxlICk7XHJcblx0XHRcdFx0aWYgKCB0ZXh0ID09IG51bGwgKSByZXR1cm47XHJcblx0XHRcdFx0Y29uc3Qgd2VpZ2h0cyA9IGJ1aWxkZXIubGF5b3V0LnBhcnNlX3dlaWdodHMoIHRleHQgKTtcclxuXHRcdFx0XHRpZiAoIHdlaWdodHMubGVuZ3RoICE9PSBjb2xzICkge1xyXG5cdFx0XHRcdFx0YWxlcnQoIGBQbGVhc2UgZW50ZXIgZXhhY3RseSAke2NvbHN9IG51bWJlcnMuYCApO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBPTEQ6XHJcblx0XHRcdFx0Ly8gYnVpbGRlci5sYXlvdXQuYXBwbHlfbGF5b3V0X3ByZXNldCggc2VjdGlvbl9lbCwgd2VpZ2h0cywgYnVpbGRlci5jb2xfZ2FwX3BlcmNlbnQgKTtcclxuXHRcdFx0XHQvLyBHdWFyZGVkIGFwcGx5Oi5cclxuXHRcdFx0XHRpZiAoICFVSS5XUEJDX0JGQl9MYXlvdXRfQ2hpcHMuX2FwcGx5X3ByZXNldF93aXRoX21pbl9ndWFyZCggYnVpbGRlciwgc2VjdGlvbl9lbCwgd2VpZ2h0cyApICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRob3N0X2VsLnF1ZXJ5U2VsZWN0b3JBbGwoICcud3BiY19iZmJfX2xheW91dF9jaGlwJyApLmZvckVhY2goIGMgPT4gYy5jbGFzc0xpc3QucmVtb3ZlKCAnaXMtYWN0aXZlJyApICk7XHJcblx0XHRcdFx0Y3VzdG9tQnRuLmNsYXNzTGlzdC5hZGQoICdpcy1hY3RpdmUnICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0aG9zdF9lbC5hcHBlbmRDaGlsZCggY3VzdG9tQnRuICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGUgYSBzaW5nbGUgbGF5b3V0IGNoaXAgYnV0dG9uLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1dQQkNfRm9ybV9CdWlsZGVyfSBidWlsZGVyXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWN0aW9uX2VsXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcltdfSB3ZWlnaHRzXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBsYWJlbFxyXG5cdFx0ICogQHJldHVybnMge0hUTUxCdXR0b25FbGVtZW50fVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgX21ha2VfY2hpcChidWlsZGVyLCBzZWN0aW9uX2VsLCB3ZWlnaHRzLCBsYWJlbCA9IG51bGwpIHtcclxuXHJcblx0XHRcdGNvbnN0IGJ0biAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYnV0dG9uJyApO1xyXG5cdFx0XHRidG4udHlwZSAgICAgID0gJ2J1dHRvbic7XHJcblx0XHRcdGJ0bi5jbGFzc05hbWUgPSAnd3BiY19iZmJfX2xheW91dF9jaGlwJztcclxuXHJcblx0XHRcdGNvbnN0IHRpdGxlID0gbGFiZWwgfHwgYnVpbGRlci5sYXlvdXQuZm9ybWF0X3ByZXNldF9sYWJlbCggd2VpZ2h0cyApO1xyXG5cdFx0XHRidG4udGl0bGUgICA9IHRpdGxlO1xyXG5cclxuXHRcdFx0Ly8gVmlzdWFsIG1pbmlhdHVyZS5cclxuXHRcdFx0Y29uc3QgdmlzICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcblx0XHRcdHZpcy5jbGFzc05hbWUgPSAnd3BiY19iZmJfX2xheW91dF9jaGlwLXZpcyc7XHJcblx0XHRcdGNvbnN0IHN1bSAgICAgPSB3ZWlnaHRzLnJlZHVjZSggKGEsIGIpID0+IGEgKyAoTnVtYmVyKCBiICkgfHwgMCksIDAgKSB8fCAxO1xyXG5cdFx0XHR3ZWlnaHRzLmZvckVhY2goICh3KSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgYmFyICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcclxuXHRcdFx0XHRiYXIuc3R5bGUuZmxleCA9IGAwIDAgY2FsYyggJHsoKE51bWJlciggdyApIHx8IDApIC8gc3VtICogMTAwKS50b0ZpeGVkKCAzICl9JSAtIDEuNXB4IClgO1xyXG5cdFx0XHRcdHZpcy5hcHBlbmRDaGlsZCggYmFyICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0YnRuLmFwcGVuZENoaWxkKCB2aXMgKTtcclxuXHJcblx0XHRcdGNvbnN0IHR4dCAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xyXG5cdFx0XHR0eHQuY2xhc3NOYW1lICAgPSAnd3BiY19iZmJfX2xheW91dF9jaGlwLWxhYmVsJztcclxuXHRcdFx0dHh0LnRleHRDb250ZW50ID0gbGFiZWwgfHwgYnVpbGRlci5sYXlvdXQuZm9ybWF0X3ByZXNldF9sYWJlbCggd2VpZ2h0cyApO1xyXG5cdFx0XHRidG4uYXBwZW5kQ2hpbGQoIHR4dCApO1xyXG5cclxuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICgpID0+IHtcclxuXHRcdFx0XHQvLyBPTEQ6XHJcblx0XHRcdFx0Ly8gYnVpbGRlci5sYXlvdXQuYXBwbHlfbGF5b3V0X3ByZXNldCggc2VjdGlvbl9lbCwgd2VpZ2h0cywgYnVpbGRlci5jb2xfZ2FwX3BlcmNlbnQgKTtcclxuXHJcblx0XHRcdFx0Ly8gTkVXOlxyXG5cdFx0XHRcdGlmICggIVVJLldQQkNfQkZCX0xheW91dF9DaGlwcy5fYXBwbHlfcHJlc2V0X3dpdGhfbWluX2d1YXJkKCBidWlsZGVyLCBzZWN0aW9uX2VsLCB3ZWlnaHRzICkgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47IC8vIGRvIG5vdCB0b2dnbGUgYWN0aXZlIGlmIHdlIGRpZG4ndCBjaGFuZ2UgbGF5b3V0XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRidG4ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX2JmYl9fbGF5b3V0X2NoaXAnICkuZm9yRWFjaCggYyA9PiBjLmNsYXNzTGlzdC5yZW1vdmUoICdpcy1hY3RpdmUnICkgKTtcclxuXHRcdFx0XHRidG4uY2xhc3NMaXN0LmFkZCggJ2lzLWFjdGl2ZScgKTtcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0cmV0dXJuIGJ0bjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTZWxlY3Rpb24gY29udHJvbGxlciBmb3IgZmllbGRzIGFuZCBhbm5vdW5jZW1lbnRzLlxyXG5cdCAqL1xyXG5cdFVJLldQQkNfQkZCX1NlbGVjdGlvbl9Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBVSS5XUEJDX0JGQl9Nb2R1bGUge1xyXG5cclxuXHRcdGluaXQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZF91aWQgICAgICAgICAgICAgID0gbnVsbDtcclxuXHRcdFx0dGhpcy5idWlsZGVyLnNlbGVjdF9maWVsZCAgICAgICA9IHRoaXMuc2VsZWN0X2ZpZWxkLmJpbmQoIHRoaXMgKTtcclxuXHRcdFx0dGhpcy5idWlsZGVyLmdldF9zZWxlY3RlZF9maWVsZCA9IHRoaXMuZ2V0X3NlbGVjdGVkX2ZpZWxkLmJpbmQoIHRoaXMgKTtcclxuXHRcdFx0dGhpcy5fb25fY2xlYXIgICAgICAgICAgICAgICAgICA9IHRoaXMub25fY2xlYXIuYmluZCggdGhpcyApO1xyXG5cclxuXHRcdFx0Ly8gQ2VudHJhbGl6ZWQgZGVsZXRlIGNvbW1hbmQgdXNlZCBieSBrZXlib2FyZCArIGluc3BlY3RvciArIG92ZXJsYXkuXHJcblx0XHRcdHRoaXMuYnVpbGRlci5kZWxldGVfaXRlbSA9IChlbCkgPT4ge1xyXG5cdFx0XHRcdGlmICggIWVsICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnN0IGIgICAgICAgID0gdGhpcy5idWlsZGVyO1xyXG5cdFx0XHRcdGNvbnN0IG5laWdoYm9yID0gYi5fZmluZF9uZWlnaGJvcl9zZWxlY3RhYmxlPy4oIGVsICkgfHwgbnVsbDtcclxuXHRcdFx0XHRlbC5yZW1vdmUoKTtcclxuXHRcdFx0XHQvLyBVc2UgbG9jYWwgQ29yZSBjb25zdGFudHMgKG5vdCBhIGdsb2JhbCkgdG8gYXZvaWQgUmVmZXJlbmNlRXJyb3JzLlxyXG5cdFx0XHRcdGIuYnVzPy5lbWl0Py4oIENvcmUuV1BCQ19CRkJfRXZlbnRzLkZJRUxEX1JFTU9WRSwgeyBlbCwgaWQ6IGVsPy5kYXRhc2V0Py5pZCwgdWlkOiBlbD8uZGF0YXNldD8udWlkIH0gKTtcclxuXHRcdFx0XHRiLnVzYWdlPy51cGRhdGVfcGFsZXR0ZV91aT8uKCk7XHJcblx0XHRcdFx0Ly8gTm90aWZ5IGdlbmVyaWMgc3RydWN0dXJlIGxpc3RlbmVycywgdG9vOlxyXG5cdFx0XHRcdGIuYnVzPy5lbWl0Py4oIENvcmUuV1BCQ19CRkJfRXZlbnRzLlNUUlVDVFVSRV9DSEFOR0UsIHsgcmVhc29uOiAnZGVsZXRlJywgZWwgfSApO1xyXG5cdFx0XHRcdC8vIERlZmVyIHNlbGVjdGlvbiBhIHRpY2sgc28gdGhlIERPTSBpcyBmdWxseSBzZXR0bGVkIGJlZm9yZSBJbnNwZWN0b3IgaHlkcmF0ZXMuXHJcblx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBUaGlzIGNhbGxzIGluc3BlY3Rvci5iaW5kX3RvX2ZpZWxkKCkgYW5kIG9wZW5zIHRoZSBJbnNwZWN0b3IgcGFuZWwuXHJcblx0XHRcdFx0XHRiLnNlbGVjdF9maWVsZD8uKCBuZWlnaGJvciB8fCBudWxsLCB7IHNjcm9sbEludG9WaWV3OiAhIW5laWdoYm9yIH0gKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0cmV0dXJuIG5laWdoYm9yO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuYnVzLm9uKCBDb3JlLldQQkNfQkZCX0V2ZW50cy5DTEVBUl9TRUxFQ1RJT04sIHRoaXMuX29uX2NsZWFyICk7XHJcblx0XHRcdHRoaXMuYnVpbGRlci5idXMub24oIENvcmUuV1BCQ19CRkJfRXZlbnRzLlNUUlVDVFVSRV9MT0FERUQsIHRoaXMuX29uX2NsZWFyICk7XHJcblx0XHRcdC8vIGRlbGVnYXRlZCBjbGljayBzZWxlY3Rpb24gKGNhcHR1cmUgZW5zdXJlcyB3ZSB3aW4gYmVmb3JlIGJ1YmJsaW5nIHRvIGNvbnRhaW5lcnMpLlxyXG5cdFx0XHR0aGlzLl9vbl9jYW52YXNfY2xpY2sgPSB0aGlzLl9oYW5kbGVfY2FudmFzX2NsaWNrLmJpbmQoIHRoaXMgKTtcclxuXHRcdFx0dGhpcy5idWlsZGVyLnBhZ2VzX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9vbl9jYW52YXNfY2xpY2ssIHRydWUgKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZXN0cm95KCkge1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuYnVzLm9mZiggQ29yZS5XUEJDX0JGQl9FdmVudHMuQ0xFQVJfU0VMRUNUSU9OLCB0aGlzLl9vbl9jbGVhciApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLl9vbl9jYW52YXNfY2xpY2sgKSB7XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLnBhZ2VzX2NvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9vbl9jYW52YXNfY2xpY2ssIHRydWUgKTtcclxuXHRcdFx0XHR0aGlzLl9vbl9jYW52YXNfY2xpY2sgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWxlZ2F0ZWQgY2FudmFzIGNsaWNrIC0+IHNlbGVjdCBjbG9zZXN0IGZpZWxkL3NlY3Rpb24gKGlubmVyIGJlYXRzIG91dGVyKS5cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGVcclxuXHRcdCAqL1xyXG5cdFx0X2hhbmRsZV9jYW52YXNfY2xpY2soZSkge1xyXG5cdFx0XHRjb25zdCByb290ID0gdGhpcy5idWlsZGVyLnBhZ2VzX2NvbnRhaW5lcjtcclxuXHRcdFx0aWYgKCAhcm9vdCApIHJldHVybjtcclxuXHJcblx0XHRcdC8vIElnbm9yZSBjbGlja3Mgb24gY29udHJvbHMvaGFuZGxlcy9yZXNpemVycywgZXRjLlxyXG5cdFx0XHRjb25zdCBJR05PUkUgPSBbXHJcblx0XHRcdFx0Jy53cGJjX2JmYl9fb3ZlcmxheS1jb250cm9scycsXHJcblx0XHRcdFx0Jy53cGJjX2JmYl9fbGF5b3V0X3BpY2tlcicsXHJcblx0XHRcdFx0Jy53cGJjX2JmYl9fZHJhZy1oYW5kbGUnLFxyXG5cdFx0XHRcdCcud3BiY19iZmJfX2ZpZWxkLXJlbW92ZS1idG4nLFxyXG5cdFx0XHRcdCcud3BiY19iZmJfX2ZpZWxkLW1vdmUtdXAnLFxyXG5cdFx0XHRcdCcud3BiY19iZmJfX2ZpZWxkLW1vdmUtZG93bicsXHJcblx0XHRcdFx0Jy53cGJjX2JmYl9fY29sdW1uLXJlc2l6ZXInXHJcblx0XHRcdF0uam9pbiggJywnICk7XHJcblxyXG5cdFx0XHRpZiAoIGUudGFyZ2V0LmNsb3Nlc3QoIElHTk9SRSApICkge1xyXG5cdFx0XHRcdHJldHVybjsgLy8gbGV0IHRob3NlIGNvbnRyb2xzIGRvIHRoZWlyIG93biB0aGluZy5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmluZCB0aGUgY2xvc2VzdCBzZWxlY3RhYmxlIChmaWVsZCBPUiBzZWN0aW9uKSBmcm9tIHRoZSBjbGljayB0YXJnZXQuXHJcblx0XHRcdGxldCBoaXQgPSBlLnRhcmdldC5jbG9zZXN0Py4oXHJcblx0XHRcdFx0YCR7Q29yZS5XUEJDX0JGQl9ET00uU0VMRUNUT1JTLnZhbGlkRmllbGR9LCAke0NvcmUuV1BCQ19CRkJfRE9NLlNFTEVDVE9SUy5zZWN0aW9ufSwgLndwYmNfYmZiX19jb2x1bW5gXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoICFoaXQgfHwgIXJvb3QuY29udGFpbnMoIGhpdCApICkge1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0X2ZpZWxkKCBudWxsICk7ICAgICAgICAgICAvLyBDbGVhciBzZWxlY3Rpb24gb24gYmxhbmsgY2xpY2suXHJcblx0XHRcdFx0cmV0dXJuOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVtcHR5IHNwYWNlIGlzIGhhbmRsZWQgZWxzZXdoZXJlLlxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBORVc6IGlmIHVzZXIgY2xpY2tlZCBhIENPTFVNTiAtPiByZW1lbWJlciB0YWIga2V5IG9uIGl0cyBTRUNUSU9OLCBidXQgc3RpbGwgc2VsZWN0IHRoZSBzZWN0aW9uLlxyXG5cdFx0XHRsZXQgcHJlc2VsZWN0X3RhYl9rZXkgPSBudWxsO1xyXG5cdFx0XHRpZiAoIGhpdC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fY29sdW1uJyApICkge1xyXG5cdFx0XHRcdGNvbnN0IHJvdyAgPSBoaXQuY2xvc2VzdCggJy53cGJjX2JmYl9fcm93JyApO1xyXG5cdFx0XHRcdGNvbnN0IGNvbHMgPSByb3cgPyBBcnJheS5mcm9tKCByb3cucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fY29sdW1uJyApICkgOiBbXTtcclxuXHRcdFx0XHRjb25zdCBpZHggID0gTWF0aC5tYXgoIDAsIGNvbHMuaW5kZXhPZiggaGl0ICkgKTtcclxuXHRcdFx0XHRjb25zdCBzZWMgID0gaGl0LmNsb3Nlc3QoICcud3BiY19iZmJfX3NlY3Rpb24nICk7XHJcblx0XHRcdFx0aWYgKCBzZWMgKSB7XHJcblx0XHRcdFx0XHRwcmVzZWxlY3RfdGFiX2tleSA9IFN0cmluZyggaWR4ICsgMSApOyAgICAgICAgICAgICAgLy8gdGFicyBhcmUgMS1iYXNlZCBpbiB1aS1jb2x1bW4tc3R5bGVzLmpzXHJcblx0XHRcdFx0XHQvLyBIaW50IGZvciB0aGUgcmVuZGVyZXIgKGl0IHJlYWRzIHRoaXMgQkVGT1JFIHJlbmRlcmluZyBhbmQgcmVzdG9yZXMgdGhlIHRhYikuXHJcblx0XHRcdFx0XHRzZWMuZGF0YXNldC5jb2xfc3R5bGVzX2FjdGl2ZV90YWIgPSBwcmVzZWxlY3RfdGFiX2tleTtcclxuXHRcdFx0XHRcdC8vIHByb21vdGUgc2VsZWN0aW9uIHRvIHRoZSBzZWN0aW9uIChzYW1lIFVYIGFzIGJlZm9yZSkuXHJcblx0XHRcdFx0XHRoaXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBzZWM7XHJcblx0XHRcdFx0XHQvLyBORVc6IHZpc3VhbGx5IG1hcmsgd2hpY2ggY29sdW1uIGlzIGJlaW5nIGVkaXRlZFxyXG5cdFx0XHRcdFx0aWYgKCBVSSAmJiBVSS5XUEJDX0JGQl9Db2x1bW5fU3R5bGVzICYmIFVJLldQQkNfQkZCX0NvbHVtbl9TdHlsZXMuc2V0X3NlbGVjdGVkX2NvbF9mbGFnICkge1xyXG5cdFx0XHRcdFx0XHRVSS5XUEJDX0JGQl9Db2x1bW5fU3R5bGVzLnNldF9zZWxlY3RlZF9jb2xfZmxhZyggc2VjLCBwcmVzZWxlY3RfdGFiX2tleSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU2VsZWN0IGFuZCBzdG9wIGJ1YmJsaW5nIHNvIG91dGVyIGNvbnRhaW5lcnMgZG9u4oCZdCByZXNlbGVjdCBhIHBhcmVudC5cclxuXHRcdFx0dGhpcy5zZWxlY3RfZmllbGQoIGhpdCApO1xyXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0Ly8gQWxzbyBzZXQgdGhlIHRhYiBhZnRlciB0aGUgaW5zcGVjdG9yIHJlbmRlcnMgKHdvcmtzIGV2ZW4gaWYgaXQgd2FzIGFscmVhZHkgb3BlbikuXHJcblx0XHRcdGlmICggcHJlc2VsZWN0X3RhYl9rZXkgKSB7XHJcblx0XHRcdFx0KHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgc2V0VGltZW91dCkoIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGlucyAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhYnMgPSBpbnMgJiYgaW5zLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1iZmItc2xvdD1cImNvbHVtbl9zdHlsZXNcIl0gW2RhdGEtd3BiYy10YWJzXScgKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0YWJzICYmIHdpbmRvdy53cGJjX3VpX3RhYnMgJiYgdHlwZW9mIHdpbmRvdy53cGJjX3VpX3RhYnMuc2V0X2FjdGl2ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHR3aW5kb3cud3BiY191aV90YWJzLnNldF9hY3RpdmUoIHRhYnMsIHByZXNlbGVjdF90YWJfa2V5ICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCAwICk7XHJcblxyXG5cdFx0XHRcdC8vIFBvbGl0ZWx5IGFzayB0aGUgSW5zcGVjdG9yIHRvIGZvY3VzL29wZW4gdGhlIFwiQ29sdW1uIFN0eWxlc1wiIGdyb3VwIGFuZCB0YWIuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudCggJ3dwYmNfYmZiOmluc3BlY3Rvcl9mb2N1cycsIHtcclxuXHRcdFx0XHRcdFx0ZGV0YWlsOiB7XHJcblx0XHRcdFx0XHRcdFx0Z3JvdXAgIDogJ2NvbHVtbl9zdHlsZXMnLFxyXG5cdFx0XHRcdFx0XHRcdHRhYl9rZXk6IHByZXNlbGVjdF90YWJfa2V5XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gKSApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZWxlY3QgYSBmaWVsZCBlbGVtZW50IG9yIGNsZWFyIHNlbGVjdGlvbi5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fG51bGx9IGZpZWxkX2VsXHJcblx0XHQgKiBAcGFyYW0ge3tzY3JvbGxJbnRvVmlldz86IGJvb2xlYW59fSBbb3B0cyA9IHt9XVxyXG5cdFx0ICovXHJcblx0XHRzZWxlY3RfZmllbGQoZmllbGRfZWwsIHsgc2Nyb2xsSW50b1ZpZXcgPSBmYWxzZSB9ID0ge30pIHtcclxuXHRcdFx0Y29uc3Qgcm9vdCAgID0gdGhpcy5idWlsZGVyLnBhZ2VzX2NvbnRhaW5lcjtcclxuXHRcdFx0Y29uc3QgcHJldkVsID0gdGhpcy5nZXRfc2VsZWN0ZWRfZmllbGQ/LigpIHx8IG51bGw7ICAgLy8gdGhlIG9uZSB3ZeKAmXJlIGxlYXZpbmcuXHJcblxyXG5cdFx0XHQvLyBJZ25vcmUgZWxlbWVudHMgbm90IGluIHRoZSBjYW52YXMuXHJcblx0XHRcdGlmICggZmllbGRfZWwgJiYgIXJvb3QuY29udGFpbnMoIGZpZWxkX2VsICkgKSB7XHJcblx0XHRcdFx0ZmllbGRfZWwgPSBudWxsOyAvLyB0cmVhdCBhcyBcIm5vIHNlbGVjdGlvblwiLlxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBORVc6IGlmIHdlIGFyZSBsZWF2aW5nIGEgc2VjdGlvbiwgY2xlYXIgaXRzIGNvbHVtbiBoaWdobGlnaHRcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHByZXZFbCAmJiBwcmV2RWwgIT09IGZpZWxkX2VsICYmXHJcblx0XHRcdFx0cHJldkVsLmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fc2VjdGlvbicgKSAmJlxyXG5cdFx0XHRcdFVJPy5XUEJDX0JGQl9Db2x1bW5fU3R5bGVzPy5jbGVhcl9zZWxlY3RlZF9jb2xfZmxhZ1xyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRVSS5XUEJDX0JGQl9Db2x1bW5fU3R5bGVzLmNsZWFyX3NlbGVjdGVkX2NvbF9mbGFnKCBwcmV2RWwgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWYgd2UncmUgbGVhdmluZyBhIGZpZWxkLCBwZXJtYW5lbnRseSBzdG9wIGF1dG8tbmFtZSBmb3IgaXQuXHJcblx0XHRcdGlmICggcHJldkVsICYmIHByZXZFbCAhPT0gZmllbGRfZWwgJiYgcHJldkVsLmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fZmllbGQnICkgKSB7XHJcblx0XHRcdFx0cHJldkVsLmRhdGFzZXQuYXV0b25hbWUgPSAnMCc7XHJcblx0XHRcdFx0cHJldkVsLmRhdGFzZXQuZnJlc2ggICAgPSAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJvb3QucXVlcnlTZWxlY3RvckFsbCggJy5pcy1zZWxlY3RlZCcgKS5mb3JFYWNoKCAobikgPT4ge1xyXG5cdFx0XHRcdG4uY2xhc3NMaXN0LnJlbW92ZSggJ2lzLXNlbGVjdGVkJyApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdGlmICggIWZpZWxkX2VsICkge1xyXG5cdFx0XHRcdGNvbnN0IHByZXYgICAgICAgICA9IHRoaXMuX3NlbGVjdGVkX3VpZCB8fCBudWxsO1xyXG5cdFx0XHRcdHRoaXMuX3NlbGVjdGVkX3VpZCA9IG51bGw7XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLmluc3BlY3Rvcj8uY2xlYXI/LigpO1xyXG5cdFx0XHRcdHJvb3QuY2xhc3NMaXN0LnJlbW92ZSggJ2hhcy1zZWxlY3Rpb24nICk7XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLmJ1cy5lbWl0KCBDb3JlLldQQkNfQkZCX0V2ZW50cy5DTEVBUl9TRUxFQ1RJT04sIHsgcHJldl91aWQ6IHByZXYsIHNvdXJjZTogJ2J1aWxkZXInIH0gKTtcclxuXHJcblx0XHRcdFx0Ly8gQXV0by1vcGVuIFwiQWRkIEZpZWxkc1wiIHdoZW4gbm90aGluZyBpcyBzZWxlY3RlZC5cclxuXHRcdFx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KCBuZXcgQ3VzdG9tRXZlbnQoICd3cGJjX2JmYjpzaG93X3BhbmVsJywge1xyXG5cdFx0XHRcdFx0ZGV0YWlsOiB7XHJcblx0XHRcdFx0XHRcdHBhbmVsX2lkOiAnd3BiY19iZmJfX3BhbGV0dGVfYWRkX25ldycsXHJcblx0XHRcdFx0XHRcdHRhYl9pZCAgOiAnd3BiY190YWJfbGlicmFyeSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICkgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZpZWxkX2VsLmNsYXNzTGlzdC5hZGQoICdpcy1zZWxlY3RlZCcgKTtcclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWRfdWlkID0gZmllbGRfZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS11aWQnICkgfHwgbnVsbDtcclxuXHJcblx0XHRcdC8vIEZhbGxiYWNrOiBlbnN1cmUgc2VjdGlvbnMgYW5ub3VuY2UgdGhlbXNlbHZlcyBhcyB0eXBlPVwic2VjdGlvblwiLlxyXG5cdFx0XHRpZiAoIGZpZWxkX2VsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApICYmICFmaWVsZF9lbC5kYXRhc2V0LnR5cGUgKSB7XHJcblx0XHRcdFx0ZmllbGRfZWwuZGF0YXNldC50eXBlID0gJ3NlY3Rpb24nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHNjcm9sbEludG9WaWV3ICkge1xyXG5cdFx0XHRcdGZpZWxkX2VsLnNjcm9sbEludG9WaWV3KCB7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuaW5zcGVjdG9yPy5iaW5kX3RvX2ZpZWxkPy4oIGZpZWxkX2VsICk7XHJcblxyXG5cdFx0XHQvLyBGYWxsYmFjazogZW5zdXJlIGluc3BlY3RvciBlbmhhbmNlcnMgKGluY2wuIFZhbHVlU2xpZGVyKSBydW4gZXZlcnkgYmluZC5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRjb25zdCBpbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InIClcclxuXHRcdFx0XHRcdHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX2luc3BlY3RvcicgKTtcclxuXHRcdFx0XHRpZiAoIGlucyApIHtcclxuXHRcdFx0XHRcdFVJLkluc3BlY3RvckVuaGFuY2Vycz8uc2Nhbj8uKCBpbnMgKTsgICAgICAgICAgICAgIC8vIHJ1bnMgYWxsIGVuaGFuY2Vyc1xyXG5cdFx0XHRcdFx0VUkuV1BCQ19CRkJfVmFsdWVTbGlkZXI/LmluaXRfb24/LiggaW5zICk7ICAgICAgICAgLy8gZXh0cmEgYmVsdC1hbmQtc3VzcGVuZGVyc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE5FVzogd2hlbiBzZWxlY3RpbmcgYSBzZWN0aW9uLCByZWZsZWN0IGl0cyBhY3RpdmUgdGFiIGFzIHRoZSBoaWdobGlnaHRlZCBjb2x1bW4uXHJcblx0XHRcdGlmICggZmllbGRfZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX3NlY3Rpb24nICkgJiZcclxuXHRcdFx0XHRVST8uV1BCQ19CRkJfQ29sdW1uX1N0eWxlcz8uc2V0X3NlbGVjdGVkX2NvbF9mbGFnICkge1xyXG5cdFx0XHRcdHZhciBrID0gKGZpZWxkX2VsLmRhdGFzZXQgJiYgZmllbGRfZWwuZGF0YXNldC5jb2xfc3R5bGVzX2FjdGl2ZV90YWIpXHJcblx0XHRcdFx0XHQ/IGZpZWxkX2VsLmRhdGFzZXQuY29sX3N0eWxlc19hY3RpdmVfdGFiIDogJzEnO1xyXG5cdFx0XHRcdFVJLldQQkNfQkZCX0NvbHVtbl9TdHlsZXMuc2V0X3NlbGVjdGVkX2NvbF9mbGFnKCBmaWVsZF9lbCwgayApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBLZWVwIHNlY3Rpb25zICYgZmllbGRzIGluIHRoZSBzYW1lIGZsb3c6XHJcblx0XHRcdC8vIDEpIEdlbmVyaWMgaHlkcmF0b3IgZm9yIHNpbXBsZSBkYXRhc2V0LWJhY2tlZCBjb250cm9scy5cclxuXHRcdFx0aWYgKCBmaWVsZF9lbCApIHtcclxuXHRcdFx0XHRVSS5XUEJDX0JGQl9JbnNwZWN0b3JfQnJpZGdlLl9nZW5lcmljX2h5ZHJhdGVfY29udHJvbHM/LiggdGhpcy5idWlsZGVyLCBmaWVsZF9lbCApO1xyXG5cdFx0XHRcdFVJLldQQkNfQkZCX0luc3BlY3Rvcl9CcmlkZ2UuX2h5ZHJhdGVfc3BlY2lhbF9jb250cm9scz8uKCB0aGlzLmJ1aWxkZXIsIGZpZWxkX2VsICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEF1dG8tb3BlbiBJbnNwZWN0b3Igd2hlbiBhIHVzZXIgc2VsZWN0cyBhIGZpZWxkL3NlY3Rpb24gLlxyXG5cdFx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KCBuZXcgQ3VzdG9tRXZlbnQoICd3cGJjX2JmYjpzaG93X3BhbmVsJywge1xyXG5cdFx0XHRcdGRldGFpbDoge1xyXG5cdFx0XHRcdFx0cGFuZWxfaWQ6ICd3cGJjX2JmYl9faW5zcGVjdG9yJyxcclxuXHRcdFx0XHRcdHRhYl9pZCAgOiAnd3BiY190YWJfaW5zcGVjdG9yJ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApICk7XHJcblxyXG5cdFx0XHRyb290LmNsYXNzTGlzdC5hZGQoICdoYXMtc2VsZWN0aW9uJyApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuYnVzLmVtaXQoIENvcmUuV1BCQ19CRkJfRXZlbnRzLlNFTEVDVCwgeyB1aWQ6IHRoaXMuX3NlbGVjdGVkX3VpZCwgZWw6IGZpZWxkX2VsIH0gKTtcclxuXHRcdFx0Y29uc3QgbGFiZWwgPSBmaWVsZF9lbD8ucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fZmllbGQtbGFiZWwnICk/LnRleHRDb250ZW50IHx8IChmaWVsZF9lbC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fc2VjdGlvbicgKSA/ICdzZWN0aW9uJyA6ICcnKSB8fCBmaWVsZF9lbD8uZGF0YXNldD8uaWQgfHwgJ2l0ZW0nO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuX2Fubm91bmNlKCAnU2VsZWN0ZWQgJyArIGxhYmVsICsgJy4nICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxudWxsfSAqL1xyXG5cdFx0Z2V0X3NlbGVjdGVkX2ZpZWxkKCkge1xyXG5cdFx0XHRpZiAoICF0aGlzLl9zZWxlY3RlZF91aWQgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgZXNjX2F0dHIgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLmVzY19hdHRyX3ZhbHVlX2Zvcl9zZWxlY3RvciggdGhpcy5fc2VsZWN0ZWRfdWlkICk7XHJcblx0XHRcdHJldHVybiB0aGlzLmJ1aWxkZXIucGFnZXNfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoIGAud3BiY19iZmJfX2ZpZWxkW2RhdGEtdWlkPVwiJHtlc2NfYXR0cn1cIl0sIC53cGJjX2JmYl9fc2VjdGlvbltkYXRhLXVpZD1cIiR7ZXNjX2F0dHJ9XCJdYCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldiAqL1xyXG5cdFx0b25fY2xlYXIoZXYpIHtcclxuXHRcdFx0Y29uc3Qgc3JjID0gZXY/LmRldGFpbD8uc291cmNlID8/IGV2Py5zb3VyY2U7XHJcblx0XHRcdGlmICggc3JjICE9PSAnYnVpbGRlcicgKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RfZmllbGQoIG51bGwgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBCcmlkZ2VzIHRoZSBidWlsZGVyIHdpdGggdGhlIEluc3BlY3RvciBhbmQgc2FuaXRpemVzIGlkL25hbWUgZWRpdHMuXHJcblx0ICovXHJcblx0VUkuV1BCQ19CRkJfSW5zcGVjdG9yX0JyaWRnZSA9IGNsYXNzIGV4dGVuZHMgVUkuV1BCQ19CRkJfTW9kdWxlIHtcclxuXHJcblx0XHRpbml0KCkge1xyXG5cdFx0XHR0aGlzLl9hdHRhY2hfaW5zcGVjdG9yKCk7XHJcblx0XHRcdHRoaXMuX2JpbmRfaWRfc2FuaXRpemVyKCk7XHJcblx0XHRcdHRoaXMuX29wZW5faW5zcGVjdG9yX2FmdGVyX2ZpZWxkX2FkZGVkKCk7XHJcblx0XHRcdHRoaXMuX2JpbmRfZm9jdXNfc2hvcnRjdXRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X2F0dGFjaF9pbnNwZWN0b3IoKSB7XHJcblx0XHRcdGNvbnN0IGIgICAgICA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0Y29uc3QgYXR0YWNoID0gKCkgPT4ge1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIHdpbmRvdy5XUEJDX0JGQl9JbnNwZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRiLmluc3BlY3RvciA9IG5ldyBXUEJDX0JGQl9JbnNwZWN0b3IoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnd3BiY19iZmJfX2luc3BlY3RvcicgKSwgYiApO1xyXG5cdFx0XHRcdFx0dGhpcy5fYmluZF9pZF9zYW5pdGl6ZXIoKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd3cGJjX2JmYl9pbnNwZWN0b3JfcmVhZHknLCBhdHRhY2ggKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8vIEVuc3VyZSB3ZSBiaW5kIGFmdGVyIGxhdGUgcmVhZHkgYXMgd2VsbC5cclxuXHRcdFx0aWYgKCB0eXBlb2Ygd2luZG93LldQQkNfQkZCX0luc3BlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRhdHRhY2goKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRiLmluc3BlY3RvciA9IHtcclxuXHRcdFx0XHRcdGJpbmRfdG9fZmllbGQoKSB7XHJcblx0XHRcdFx0XHR9LCBjbGVhcigpIHtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3cGJjX2JmYl9pbnNwZWN0b3JfcmVhZHknLCBhdHRhY2ggKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCBhdHRhY2gsIDAgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogTGlzdGVuIGZvciBcImZvY3VzXCIgaGludHMgZnJvbSB0aGUgY2FudmFzIGFuZCBvcGVuIHRoZSByaWdodCBncm91cC90YWIuXHJcblx0XHQgKiAtIFN1cHBvcnRzOiBncm91cCA9PT0gJ2NvbHVtbl9zdHlsZXMnXHJcblx0XHQgKiAtIEFsc28gc2Nyb2xscyB0aGUgZ3JvdXAgaW50byB2aWV3LlxyXG5cdFx0ICovXHJcblx0XHRfYmluZF9mb2N1c19zaG9ydGN1dHMoKSB7XHJcblx0XHRcdC8qKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBlICovXHJcblx0XHRcdGNvbnN0IG9uX2ZvY3VzID0gKGUpID0+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Y29uc3QgZ3JwX2tleSA9IGUgJiYgZS5kZXRhaWwgJiYgZS5kZXRhaWwuZ3JvdXA7XHJcblx0XHRcdFx0XHRjb25zdCB0YWJfa2V5ID0gZSAmJiBlLmRldGFpbCAmJiBlLmRldGFpbC50YWJfa2V5O1xyXG5cdFx0XHRcdFx0aWYgKCAhZ3JwX2tleSApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbnN0IGlucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnd3BiY19iZmJfX2luc3BlY3RvcicgKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdFx0XHRpZiAoICFpbnMgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIGdycF9rZXkgPT09ICdjb2x1bW5fc3R5bGVzJyApIHtcclxuXHRcdFx0XHRcdFx0Ly8gRmluZCB0aGUgQ29sdW1uIFN0eWxlcyBzbG90L2dyb3VwLlxyXG5cdFx0XHRcdFx0XHRjb25zdCBzbG90ID0gaW5zLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1iZmItc2xvdD1cImNvbHVtbl9zdHlsZXNcIl0nIClcclxuXHRcdFx0XHRcdFx0XHR8fCBpbnMucXVlcnlTZWxlY3RvciggJ1tkYXRhLWluc3BlY3Rvci1ncm91cC1rZXk9XCJjb2x1bW5fc3R5bGVzXCJdJyApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHNsb3QgKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gT3BlbiBjb2xsYXBzaWJsZSBjb250YWluZXIgaWYgcHJlc2VudC5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBncm91cF93cmFwID0gc2xvdC5jbG9zZXN0KCAnLmluc3BlY3Rvcl9fZ3JvdXAnICkgfHwgc2xvdC5jbG9zZXN0KCAnW2RhdGEtaW5zcGVjdG9yLWdyb3VwXScgKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIGdyb3VwX3dyYXAgJiYgIWdyb3VwX3dyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCAnaXMtb3BlbicgKSApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdyb3VwX3dyYXAuY2xhc3NMaXN0LmFkZCggJ2lzLW9wZW4nICk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBNaXJyb3IgQVJJQSBzdGF0ZSBpZiB5b3VyIGhlYWRlciB1c2VzIGFyaWEtZXhwYW5kZWQuXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBoZWFkZXJfYnRuID0gZ3JvdXBfd3JhcC5xdWVyeVNlbGVjdG9yKCAnW2FyaWEtZXhwYW5kZWRdJyApO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBoZWFkZXJfYnRuICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJfYnRuLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIE9wdGlvbmFsOiBzZXQgdGhlIHJlcXVlc3RlZCB0YWIga2V5IGlmIHRhYnMgZXhpc3QgaW4gdGhpcyBncm91cC5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIHRhYl9rZXkgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCB0YWJzID0gc2xvdC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtd3BiYy10YWJzXScgKTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICggdGFicyAmJiB3aW5kb3cud3BiY191aV90YWJzICYmIHR5cGVvZiB3aW5kb3cud3BiY191aV90YWJzLnNldF9hY3RpdmUgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy53cGJjX3VpX3RhYnMuc2V0X2FjdGl2ZSggdGFicywgU3RyaW5nKCB0YWJfa2V5ICkgKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIEJyaW5nIGludG8gdmlldyBmb3IgY29udmVuaWVuY2UuXHJcblx0XHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRcdHNsb3Quc2Nyb2xsSW50b1ZpZXcoIHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ25lYXJlc3QnIH0gKTtcclxuXHRcdFx0XHRcdFx0XHR9IGNhdGNoICggX2UgKSB7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoIF9lICkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuX29uX2luc3BlY3Rvcl9mb2N1cyA9IG9uX2ZvY3VzO1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnd3BiY19iZmI6aW5zcGVjdG9yX2ZvY3VzJywgb25fZm9jdXMsIHRydWUgKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZXN0cm95KCkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmICggdGhpcy5fb25faW5zcGVjdG9yX2ZvY3VzICkge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3dwYmNfYmZiOmluc3BlY3Rvcl9mb2N1cycsIHRoaXMuX29uX2luc3BlY3Rvcl9mb2N1cywgdHJ1ZSApO1xyXG5cdFx0XHRcdFx0dGhpcy5fb25faW5zcGVjdG9yX2ZvY3VzID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEh5ZHJhdGUgaW5zcGVjdG9yIGlucHV0cyBmb3IgXCJzcGVjaWFsXCIga2V5cyB0aGF0IHdlIGhhbmRsZSBleHBsaWNpdGx5LlxyXG5cdFx0ICogV29ya3MgZm9yIGJvdGggZmllbGRzIGFuZCBzZWN0aW9ucy5cclxuXHRcdCAqIEBwYXJhbSB7V1BCQ19Gb3JtX0J1aWxkZXJ9IGJ1aWxkZXJcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlbFxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgX2h5ZHJhdGVfc3BlY2lhbF9jb250cm9scyhidWlsZGVyLCBzZWwpIHtcclxuXHRcdFx0Y29uc3QgaW5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICd3cGJjX2JmYl9faW5zcGVjdG9yJyApO1xyXG5cdFx0XHRpZiAoICFpbnMgfHwgIXNlbCApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IHNldFZhbCA9IChrZXksIHZhbCkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGN0cmwgPSBpbnMucXVlcnlTZWxlY3RvciggYFtkYXRhLWluc3BlY3Rvci1rZXk9XCIke2tleX1cIl1gICk7XHJcblx0XHRcdFx0aWYgKCBjdHJsICYmICd2YWx1ZScgaW4gY3RybCApIGN0cmwudmFsdWUgPSBTdHJpbmcoIHZhbCA/PyAnJyApO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gSW50ZXJuYWwgaWQgLyBuYW1lIC8gcHVibGljIGh0bWxfaWQuXHJcblx0XHRcdHNldFZhbCggJ2lkJywgc2VsLmdldEF0dHJpYnV0ZSggJ2RhdGEtaWQnICkgfHwgJycgKTtcclxuXHRcdFx0c2V0VmFsKCAnbmFtZScsIHNlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLW5hbWUnICkgfHwgJycgKTtcclxuXHRcdFx0c2V0VmFsKCAnaHRtbF9pZCcsIHNlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWh0bWxfaWQnICkgfHwgJycgKTtcclxuXHJcblx0XHRcdC8vIFNlY3Rpb24tb25seSBleHRyYXMgYXJlIGhhcm1sZXNzIHRvIHNldCBmb3IgZmllbGRzIChjb250cm9scyBtYXkgbm90IGV4aXN0KS5cclxuXHRcdFx0c2V0VmFsKCAnY3NzY2xhc3MnLCBzZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1jc3NjbGFzcycgKSB8fCAnJyApO1xyXG5cdFx0XHRzZXRWYWwoICdsYWJlbCcsIHNlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWxhYmVsJyApIHx8ICcnICk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSHlkcmF0ZSBpbnNwZWN0b3IgaW5wdXRzIHRoYXQgZGVjbGFyZSBhIGdlbmVyaWMgZGF0YXNldCBtYXBwaW5nIHZpYVxyXG5cdFx0ICogW2RhdGEtaW5zcGVjdG9yLWtleV0gYnV0IGRvIE5PVCBkZWNsYXJlIGEgY3VzdG9tIHZhbHVlX2Zyb20gYWRhcHRlci5cclxuXHRcdCAqIFRoaXMgbWFrZXMgc2VjdGlvbnMgZm9sbG93IHRoZSBzYW1lIGRhdGEgZmxvdyBhcyBmaWVsZHMgd2l0aCBhbG1vc3Qgbm8gZ2x1ZS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge1dQQkNfRm9ybV9CdWlsZGVyfSBidWlsZGVyXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWwgLSBjdXJyZW50bHkgc2VsZWN0ZWQgZmllbGQvc2VjdGlvblxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgX2dlbmVyaWNfaHlkcmF0ZV9jb250cm9scyhidWlsZGVyLCBzZWwpIHtcclxuXHRcdFx0Y29uc3QgaW5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICd3cGJjX2JmYl9faW5zcGVjdG9yJyApO1xyXG5cdFx0XHRpZiAoICFpbnMgfHwgIXNlbCApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IFNLSVAgPSAvXihpZHxuYW1lfGh0bWxfaWR8Y3NzY2xhc3N8bGFiZWwpJC87IC8vIGhhbmRsZWQgYnkgX2h5ZHJhdGVfc3BlY2lhbF9jb250cm9sc1xyXG5cclxuXHRcdFx0Ly8gTkVXOiByZWFkIHNjaGVtYSBmb3IgdGhlIHNlbGVjdGVkIGVsZW1lbnTigJlzIHR5cGUuXHJcblx0XHRcdGNvbnN0IHNjaGVtYXMgICAgID0gd2luZG93LldQQkNfQkZCX1NjaGVtYXMgfHwge307XHJcblx0XHRcdGNvbnN0IHR5cGVLZXkgICAgID0gKHNlbC5kYXRhc2V0ICYmIHNlbC5kYXRhc2V0LnR5cGUpIHx8ICcnO1xyXG5cdFx0XHRjb25zdCBzY2hlbWFFbnRyeSA9IHNjaGVtYXNbdHlwZUtleV0gfHwgbnVsbDtcclxuXHRcdFx0Y29uc3QgcHJvcHNTY2hlbWEgPSAoc2NoZW1hRW50cnkgJiYgc2NoZW1hRW50cnkuc2NoZW1hICYmIHNjaGVtYUVudHJ5LnNjaGVtYS5wcm9wcykgPyBzY2hlbWFFbnRyeS5zY2hlbWEucHJvcHMgOiB7fTtcclxuXHRcdFx0Y29uc3QgaGFzT3duICAgICAgPSBGdW5jdGlvbi5jYWxsLmJpbmQoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgKTtcclxuXHRcdFx0Y29uc3QgZ2V0RGVmYXVsdCAgPSAoa2V5KSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgbWV0YSA9IHByb3BzU2NoZW1hW2tleV07XHJcblx0XHRcdFx0cmV0dXJuIChtZXRhICYmIGhhc093biggbWV0YSwgJ2RlZmF1bHQnICkpID8gbWV0YS5kZWZhdWx0IDogdW5kZWZpbmVkO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aW5zLnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1pbnNwZWN0b3Ita2V5XScgKS5mb3JFYWNoKCAoY3RybCkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGtleSA9IFN0cmluZyggY3RybC5kYXRhc2V0Py5pbnNwZWN0b3JLZXkgfHwgJycgKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdGlmICggIWtleSB8fCBTS0lQLnRlc3QoIGtleSApICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBFbGVtZW50LWxldmVsIGxvY2suXHJcblx0XHRcdFx0Y29uc3QgZGwgPSAoY3RybC5kYXRhc2V0Py5sb2NrZWQgfHwgJycpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdGlmICggZGwgPT09ICcxJyB8fCBkbCA9PT0gJ3RydWUnIHx8IGRsID09PSAneWVzJyApIHJldHVybjtcclxuXHJcblx0XHRcdFx0Ly8gUmVzcGVjdCBleHBsaWNpdCBhZGFwdGVycy5cclxuXHRcdFx0XHRpZiAoIGN0cmwuZGF0YXNldD8udmFsdWVfZnJvbSB8fCBjdHJsLmRhdGFzZXQ/LnZhbHVlRnJvbSApIHJldHVybjtcclxuXHJcblx0XHRcdFx0Y29uc3QgcmF3ICAgICAgPSBzZWwuZGF0YXNldCA/IHNlbC5kYXRhc2V0W2tleV0gOiB1bmRlZmluZWQ7XHJcblx0XHRcdFx0Y29uc3QgaGFzUmF3ICAgPSBzZWwuZGF0YXNldCA/IGhhc093biggc2VsLmRhdGFzZXQsIGtleSApIDogZmFsc2U7XHJcblx0XHRcdFx0Y29uc3QgZGVmVmFsdWUgPSBnZXREZWZhdWx0KCBrZXkgKTtcclxuXHJcblx0XHRcdFx0Ly8gQmVzdC1lZmZvcnQgY29udHJvbCB0eXBpbmcgd2l0aCBzY2hlbWEgZGVmYXVsdCBmYWxsYmFjayB3aGVuIHZhbHVlIGlzIGFic2VudC5cclxuXHJcblx0XHRcdFx0aWYgKCBjdHJsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiAoY3RybC50eXBlID09PSAnY2hlY2tib3gnIHx8IGN0cmwudHlwZSA9PT0gJ3JhZGlvJykgKSB7XHJcblx0XHRcdFx0XHQvLyBJZiBkYXRhc2V0IGlzIG1pc3NpbmcgdGhlIGtleSBlbnRpcmVseSAtPiB1c2Ugc2NoZW1hIGRlZmF1bHQgKGJvb2xlYW4pLlxyXG5cdFx0XHRcdFx0aWYgKCAhaGFzUmF3ICkge1xyXG5cdFx0XHRcdFx0XHRjdHJsLmNoZWNrZWQgPSAhIWRlZlZhbHVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y3RybC5jaGVja2VkID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5jb2VyY2VfYm9vbGVhbiggcmF3LCAhIWRlZlZhbHVlICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmICggJ3ZhbHVlJyBpbiBjdHJsICkge1xyXG5cdFx0XHRcdFx0aWYgKCBoYXNSYXcgKSB7XHJcblx0XHRcdFx0XHRcdGN0cmwudmFsdWUgPSAocmF3ICE9IG51bGwpID8gU3RyaW5nKCByYXcgKSA6ICcnO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y3RybC52YWx1ZSA9IChkZWZWYWx1ZSA9PSBudWxsKSA/ICcnIDogU3RyaW5nKCBkZWZWYWx1ZSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9iaW5kX2lkX3Nhbml0aXplcigpIHtcclxuXHRcdFx0Y29uc3QgYiAgID0gdGhpcy5idWlsZGVyO1xyXG5cdFx0XHRjb25zdCBpbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdGlmICggISBpbnMgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBoYW5kbGVyID0gKGUpID0+IHtcclxuXHJcblx0XHRcdFx0Y29uc3QgdCA9IGUudGFyZ2V0O1xyXG5cdFx0XHRcdGlmICggIXQgfHwgISgndmFsdWUnIGluIHQpICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25zdCBrZXkgICAgICAgPSAodC5kYXRhc2V0Py5pbnNwZWN0b3JLZXkgfHwgJycpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0Y29uc3Qgc2VsICAgICAgID0gYi5nZXRfc2VsZWN0ZWRfZmllbGQ/LigpO1xyXG5cdFx0XHRcdGNvbnN0IGlzU2VjdGlvbiA9IHNlbD8uY2xhc3NMaXN0Py5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApO1xyXG5cdFx0XHRcdGlmICggIXNlbCApIHJldHVybjtcclxuXHJcblx0XHRcdFx0Ly8gVW5pZmllZCBlbWl0dGVyIHRoYXQgYWx3YXlzIGluY2x1ZGVzIHRoZSBlbGVtZW50IHJlZmVyZW5jZS5cclxuXHRcdFx0XHRjb25zdCBFViAgICAgICAgICAgICAgPSBDb3JlLldQQkNfQkZCX0V2ZW50cztcclxuXHRcdFx0XHRjb25zdCBidXNfZW1pdF9jaGFuZ2UgPSAocmVhc29uLCBleHRyYSA9IHt9KSA9PiBiLmJ1cz8uZW1pdD8uKCBFVi5TVFJVQ1RVUkVfQ0hBTkdFLCB7XHJcblx0XHRcdFx0XHRyZWFzb24sXHJcblx0XHRcdFx0XHRlbDogc2VsLCAuLi5leHRyYVxyXG5cdFx0XHRcdH0gKTtcclxuXHJcblx0XHRcdFx0Ly8gLS0tLSBGSUVMRC9TRUNUSU9OOiBpbnRlcm5hbCBpZCAtLS0tXHJcblx0XHRcdFx0aWYgKCBrZXkgPT09ICdpZCcgKSB7XHJcblx0XHRcdFx0XHRjb25zdCB1bmlxdWUgPSBiLmlkLnNldF9maWVsZF9pZCggc2VsLCB0LnZhbHVlICk7XHJcblx0XHRcdFx0XHRpZiAoIGIucHJldmlld19tb2RlICYmICFpc1NlY3Rpb24gKSB7XHJcblx0XHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIHNlbCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCB0LnZhbHVlICE9PSB1bmlxdWUgKSB7XHJcblx0XHRcdFx0XHRcdHQudmFsdWUgPSB1bmlxdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXNfZW1pdF9jaGFuZ2UoICdpZC1jaGFuZ2UnICk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyAtLS0tIEZJRUxEL1NFQ1RJT046IHB1YmxpYyBIVE1MIGlkIC0tLS1cclxuXHRcdFx0XHRpZiAoIGtleSA9PT0gJ2h0bWxfaWQnICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgYXBwbGllZCA9IGIuaWQuc2V0X2ZpZWxkX2h0bWxfaWQoIHNlbCwgdC52YWx1ZSApO1xyXG5cdFx0XHRcdFx0Ly8gRm9yIHNlY3Rpb25zLCBhbHNvIHNldCB0aGUgcmVhbCBET00gaWQgc28gYW5jaG9ycy9DU1MgY2FuIHRhcmdldCBpdC5cclxuXHRcdFx0XHRcdGlmICggaXNTZWN0aW9uICkge1xyXG5cdFx0XHRcdFx0XHRzZWwuaWQgPSBhcHBsaWVkIHx8ICcnO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggYi5wcmV2aWV3X21vZGUgKSB7XHJcblx0XHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIHNlbCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCB0LnZhbHVlICE9PSBhcHBsaWVkICkge1xyXG5cdFx0XHRcdFx0XHR0LnZhbHVlID0gYXBwbGllZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJ1c19lbWl0X2NoYW5nZSggJ2h0bWwtaWQtY2hhbmdlJyApO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gLS0tLSBGSUVMRFMgT05MWTogbmFtZSAtLS0tXHJcblx0XHRcdFx0aWYgKCBrZXkgPT09ICduYW1lJyAmJiAhaXNTZWN0aW9uICkge1xyXG5cclxuXHRcdFx0XHRcdC8vIExpdmUgdHlwaW5nOiBzYW5pdGl6ZSBvbmx5IChOTyB1bmlxdWVuZXNzIHlldCkgdG8gYXZvaWQgXCItMlwiIHNwYW1cclxuXHRcdFx0XHRcdGlmICggZS50eXBlID09PSAnaW5wdXQnICkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBiZWZvcmUgICAgPSB0LnZhbHVlO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBzYW5pdGl6ZWQgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnNhbml0aXplX2h0bWxfbmFtZSggYmVmb3JlICk7XHJcblx0XHRcdFx0XHRcdGlmICggYmVmb3JlICE9PSBzYW5pdGl6ZWQgKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gb3B0aW9uYWw6IHByZXNlcnZlIGNhcmV0IHRvIGF2b2lkIGp1bXBcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWxTdGFydCA9IHQuc2VsZWN0aW9uU3RhcnQsIHNlbEVuZCA9IHQuc2VsZWN0aW9uRW5kO1xyXG5cdFx0XHRcdFx0XHRcdHQudmFsdWUgICAgICAgID0gc2FuaXRpemVkO1xyXG5cdFx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0LnNldFNlbGVjdGlvblJhbmdlKCBzZWxTdGFydCwgc2VsRW5kICk7XHJcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJldHVybjsgLy8gdW5pcXVlbmVzcyBvbiBjaGFuZ2UvYmx1clxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIENvbW1pdCAoY2hhbmdlL2JsdXIpXHJcblx0XHRcdFx0XHRjb25zdCByYXcgPSBTdHJpbmcoIHQudmFsdWUgPz8gJycgKS50cmltKCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAhcmF3ICkge1xyXG5cdFx0XHRcdFx0XHQvLyBSRVNFRUQ6IGtlZXAgbmFtZSBub24tZW1wdHkgYW5kIHByb3Zpc2lvbmFsIChhdXRvbmFtZSBzdGF5cyBPTilcclxuXHRcdFx0XHRcdFx0Y29uc3QgUyAgICA9IENvcmUuV1BCQ19CRkJfU2FuaXRpemU7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGJhc2UgPSBTLnNhbml0aXplX2h0bWxfbmFtZSggc2VsLmdldEF0dHJpYnV0ZSggJ2RhdGEtaWQnICkgfHwgc2VsLmRhdGFzZXQuaWQgfHwgc2VsLmRhdGFzZXQudHlwZSB8fCAnZmllbGQnICk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHVuaXEgPSBiLmlkLmVuc3VyZV91bmlxdWVfZmllbGRfbmFtZSggYmFzZSwgc2VsICk7XHJcblxyXG5cdFx0XHRcdFx0XHRzZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1uYW1lJywgdW5pcSApO1xyXG5cdFx0XHRcdFx0XHRzZWwuZGF0YXNldC5hdXRvbmFtZSAgICAgICAgICA9ICcxJztcclxuXHRcdFx0XHRcdFx0c2VsLmRhdGFzZXQubmFtZV91c2VyX3RvdWNoZWQgPSAnMCc7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBLZWVwIERPTSBpbiBzeW5jIGlmIHdl4oCZcmUgbm90IHJlLXJlbmRlcmluZ1xyXG5cdFx0XHRcdFx0XHRpZiAoICFiLnByZXZpZXdfbW9kZSApIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBjdHJsID0gc2VsLnF1ZXJ5U2VsZWN0b3IoICdpbnB1dCx0ZXh0YXJlYSxzZWxlY3QnICk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBjdHJsICkgY3RybC5zZXRBdHRyaWJ1dGUoICduYW1lJywgdW5pcSApO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIHNlbCApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIHQudmFsdWUgIT09IHVuaXEgKSB0LnZhbHVlID0gdW5pcTtcclxuXHRcdFx0XHRcdFx0YnVzX2VtaXRfY2hhbmdlKCAnbmFtZS1yZXNlZWQnICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBOb24tZW1wdHkgY29tbWl0OiB1c2VyIHRha2VzIGNvbnRyb2w7IGRpc2FibGUgYXV0b25hbWUgZ29pbmcgZm9yd2FyZFxyXG5cdFx0XHRcdFx0c2VsLmRhdGFzZXQubmFtZV91c2VyX3RvdWNoZWQgPSAnMSc7XHJcblx0XHRcdFx0XHRzZWwuZGF0YXNldC5hdXRvbmFtZSAgICAgICAgICA9ICcwJztcclxuXHJcblx0XHRcdFx0XHRjb25zdCBzYW5pdGl6ZWQgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnNhbml0aXplX2h0bWxfbmFtZSggcmF3ICk7XHJcblx0XHRcdFx0XHRjb25zdCB1bmlxdWUgICAgPSBiLmlkLnNldF9maWVsZF9uYW1lKCBzZWwsIHNhbml0aXplZCApO1xyXG5cclxuXHRcdFx0XHRcdGlmICggIWIucHJldmlld19tb2RlICkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBjdHJsID0gc2VsLnF1ZXJ5U2VsZWN0b3IoICdpbnB1dCx0ZXh0YXJlYSxzZWxlY3QnICk7XHJcblx0XHRcdFx0XHRcdGlmICggY3RybCApIGN0cmwuc2V0QXR0cmlidXRlKCAnbmFtZScsIHVuaXF1ZSApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Yi5yZW5kZXJfcHJldmlldyggc2VsICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCB0LnZhbHVlICE9PSB1bmlxdWUgKSB0LnZhbHVlID0gdW5pcXVlO1xyXG5cdFx0XHRcdFx0YnVzX2VtaXRfY2hhbmdlKCAnbmFtZS1jaGFuZ2UnICk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyAtLS0tIFNFQ1RJT05TICYgRklFTERTOiBjc3NjbGFzcyAobGl2ZSBhcHBseTsgbm8gcmUtcmVuZGVyKSAtLS0tXHJcblx0XHRcdFx0aWYgKCBrZXkgPT09ICdjc3NjbGFzcycgKSB7XHJcblx0XHRcdFx0XHRjb25zdCBuZXh0ICAgICAgID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5zYW5pdGl6ZV9jc3NfY2xhc3NsaXN0KCB0LnZhbHVlIHx8ICcnICk7XHJcblx0XHRcdFx0XHRjb25zdCBkZXNpcmVkQXJyID0gbmV4dC5zcGxpdCggL1xccysvICkuZmlsdGVyKCBCb29sZWFuICk7XHJcblx0XHRcdFx0XHRjb25zdCBkZXNpcmVkU2V0ID0gbmV3IFNldCggZGVzaXJlZEFyciApO1xyXG5cclxuXHRcdFx0XHRcdC8vIENvcmUgY2xhc3NlcyBhcmUgbmV2ZXIgdG91Y2hlZC5cclxuXHRcdFx0XHRcdGNvbnN0IGlzQ29yZSA9IChjbHMpID0+IGNscyA9PT0gJ2lzLXNlbGVjdGVkJyB8fCBjbHMuc3RhcnRzV2l0aCggJ3dwYmNfJyApO1xyXG5cclxuXHRcdFx0XHRcdC8vIFNuYXBzaG90IGJlZm9yZSBtdXRhdGluZyAoRE9NVG9rZW5MaXN0IGlzIGxpdmUpLlxyXG5cdFx0XHRcdFx0Y29uc3QgYmVmb3JlQ2xhc3NlcyA9IEFycmF5LmZyb20oIHNlbC5jbGFzc0xpc3QgKTtcclxuXHRcdFx0XHRcdGNvbnN0IGN1c3RvbUJlZm9yZSAgPSBiZWZvcmVDbGFzc2VzLmZpbHRlciggKGMpID0+ICFpc0NvcmUoIGMgKSApO1xyXG5cclxuXHRcdFx0XHRcdC8vIFJlbW92ZSBzdHJheSBub24tY29yZSBjbGFzc2VzIG5vdCBpbiBkZXNpcmVkLlxyXG5cdFx0XHRcdFx0Y3VzdG9tQmVmb3JlLmZvckVhY2goIChjKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICggIWRlc2lyZWRTZXQuaGFzKCBjICkgKSBzZWwuY2xhc3NMaXN0LnJlbW92ZSggYyApO1xyXG5cdFx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHRcdC8vIEFkZCBtaXNzaW5nIGRlc2lyZWQgY2xhc3NlcyBpbiBvbmUgZ28uXHJcblx0XHRcdFx0XHRjb25zdCBtaXNzaW5nID0gZGVzaXJlZEFyci5maWx0ZXIoIChjKSA9PiAhY3VzdG9tQmVmb3JlLmluY2x1ZGVzKCBjICkgKTtcclxuXHRcdFx0XHRcdGlmICggbWlzc2luZy5sZW5ndGggKSBzZWwuY2xhc3NMaXN0LmFkZCggLi4ubWlzc2luZyApO1xyXG5cclxuXHRcdFx0XHRcdC8vIEtlZXAgZGF0YXNldCBpbiBzeW5jIChhdm9pZCB1c2VsZXNzIGF0dHJpYnV0ZSB3cml0ZXMpLlxyXG5cdFx0XHRcdFx0aWYgKCBzZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1jc3NjbGFzcycgKSAhPT0gbmV4dCApIHtcclxuXHRcdFx0XHRcdFx0c2VsLnNldEF0dHJpYnV0ZSggJ2RhdGEtY3NzY2xhc3MnLCBuZXh0ICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gRW1pdCBvbmx5IGlmIHNvbWV0aGluZyBhY3R1YWxseSBjaGFuZ2VkLlxyXG5cdFx0XHRcdFx0Y29uc3QgYWZ0ZXJDbGFzc2VzID0gQXJyYXkuZnJvbSggc2VsLmNsYXNzTGlzdCApO1xyXG5cdFx0XHRcdFx0Y29uc3QgY2hhbmdlZCAgICAgID0gYWZ0ZXJDbGFzc2VzLmxlbmd0aCAhPT0gYmVmb3JlQ2xhc3Nlcy5sZW5ndGggfHwgYmVmb3JlQ2xhc3Nlcy5zb21lKCAoYywgaSkgPT4gYyAhPT0gYWZ0ZXJDbGFzc2VzW2ldICk7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgZGV0YWlsID0geyBrZXk6ICdjc3NjbGFzcycsIHBoYXNlOiBlLnR5cGUgfTtcclxuXHRcdFx0XHRcdGlmICggaXNTZWN0aW9uICkge1xyXG5cdFx0XHRcdFx0XHRidXNfZW1pdF9jaGFuZ2UoICdjc3NjbGFzcy1jaGFuZ2UnLCBkZXRhaWwgKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGJ1c19lbWl0X2NoYW5nZSggJ3Byb3AtY2hhbmdlJywgZGV0YWlsICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0Ly8gLS0tLSBTRUNUSU9OUzogbGFiZWwgLS0tLVxyXG5cdFx0XHRcdGlmICggaXNTZWN0aW9uICYmIGtleSA9PT0gJ2xhYmVsJyApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IFN0cmluZyggdC52YWx1ZSA/PyAnJyApO1xyXG5cdFx0XHRcdFx0c2VsLnNldEF0dHJpYnV0ZSggJ2RhdGEtbGFiZWwnLCB2YWwgKTtcclxuXHRcdFx0XHRcdGJ1c19lbWl0X2NoYW5nZSggJ2xhYmVsLWNoYW5nZScgKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIC0tLS0gRklFTERTOiBsYWJlbCAoYXV0by1uYW1lIHdoaWxlIHR5cGluZzsgZnJlZXplIG9uIGNvbW1pdCkgLS0tLVxyXG5cdFx0XHRcdGlmICggIWlzU2VjdGlvbiAmJiBrZXkgPT09ICdsYWJlbCcgKSB7XHJcblx0XHRcdFx0XHRjb25zdCB2YWwgICAgICAgICA9IFN0cmluZyggdC52YWx1ZSA/PyAnJyApO1xyXG5cdFx0XHRcdFx0c2VsLmRhdGFzZXQubGFiZWwgPSB2YWw7XHJcblxyXG5cdFx0XHRcdFx0Ly8gd2hpbGUgdHlwaW5nLCBhbGxvdyBhdXRvLW5hbWUgKGlmIGZsYWdzIHBlcm1pdClcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdENvcmUuV1BCQ19CRkJfRmllbGRfQmFzZS5tYXliZV9hdXRvbmFtZV9mcm9tX2xhYmVsKCBiLCBzZWwsIHZhbCApO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgdXNlciBjb21taXR0ZWQgdGhlIGxhYmVsIChibHVyL2NoYW5nZSksIGZyZWV6ZSBmdXR1cmUgYXV0by1uYW1lXHJcblx0XHRcdFx0XHRpZiAoIGUudHlwZSAhPT0gJ2lucHV0JyApIHtcclxuXHRcdFx0XHRcdFx0c2VsLmRhdGFzZXQuYXV0b25hbWUgPSAnMCc7ICAgLy8gc3RvcCBmdXR1cmUgbGFiZWwtPm5hbWUgc3luY1xyXG5cdFx0XHRcdFx0XHRzZWwuZGF0YXNldC5mcmVzaCAgICA9ICcwJzsgICAvLyBhbHNvIGtpbGwgdGhlIFwiZnJlc2hcIiBlc2NhcGUgaGF0Y2hcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBPcHRpb25hbCBVSSBuaWNldHk6IGRpc2FibGUgTmFtZSB3aGVuIGF1dG8gaXMgT04sIGVuYWJsZSB3aGVuIE9GRlxyXG5cdFx0XHRcdFx0Y29uc3QgaW5zICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdFx0XHRjb25zdCBuYW1lQ3RybCA9IGlucz8ucXVlcnlTZWxlY3RvciggJ1tkYXRhLWluc3BlY3Rvci1rZXk9XCJuYW1lXCJdJyApO1xyXG5cdFx0XHRcdFx0aWYgKCBuYW1lQ3RybCApIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgYXV0b0FjdGl2ZSA9XHJcblx0XHRcdFx0XHRcdFx0XHQgIChzZWwuZGF0YXNldC5hdXRvbmFtZSA/PyAnMScpICE9PSAnMCcgJiZcclxuXHRcdFx0XHRcdFx0XHRcdCAgc2VsLmRhdGFzZXQubmFtZV91c2VyX3RvdWNoZWQgIT09ICcxJyAmJlxyXG5cdFx0XHRcdFx0XHRcdFx0ICBzZWwuZGF0YXNldC53YXNfbG9hZGVkICE9PSAnMSc7XHJcblx0XHRcdFx0XHRcdG5hbWVDdHJsLnRvZ2dsZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJywgYXV0b0FjdGl2ZSApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIGF1dG9BY3RpdmUgJiYgIW5hbWVDdHJsLnBsYWNlaG9sZGVyICkge1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVDdHJsLnBsYWNlaG9sZGVyID0gYj8uaTE4bj8uYXV0b19mcm9tX2xhYmVsID8/ICdhdXRvIOKAlCBmcm9tIGxhYmVsJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoICFhdXRvQWN0aXZlICYmIG5hbWVDdHJsLnBsYWNlaG9sZGVyID09PSAoYj8uaTE4bj8uYXV0b19mcm9tX2xhYmVsID8/ICdhdXRvIOKAlCBmcm9tIGxhYmVsJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0bmFtZUN0cmwucGxhY2Vob2xkZXIgPSAnJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIEFsd2F5cyByZS1yZW5kZXIgdGhlIHByZXZpZXcgc28gbGFiZWwgY2hhbmdlcyBhcmUgdmlzaWJsZSBpbW1lZGlhdGVseS5cclxuXHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIHNlbCApO1xyXG5cdFx0XHRcdFx0YnVzX2VtaXRfY2hhbmdlKCAnbGFiZWwtY2hhbmdlJyApO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdC8vIC0tLS0gREVGQVVMVCAoR0VORVJJQyk6IGRhdGFzZXQgd3JpdGVyIGZvciBib3RoIGZpZWxkcyAmIHNlY3Rpb25zIC0tLS1cclxuXHRcdFx0XHQvLyBBbnkgaW5zcGVjdG9yIGNvbnRyb2wgd2l0aCBbZGF0YS1pbnNwZWN0b3Ita2V5XSB0aGF0IGRvZXNuJ3QgaGF2ZSBhIGN1c3RvbVxyXG5cdFx0XHRcdC8vIGFkYXB0ZXIvdmFsdWVfZnJvbSB3aWxsIHNpbXBseSByZWFkL3dyaXRlIHNlbC5kYXRhc2V0W2tleV0uXHJcblx0XHRcdFx0aWYgKCBrZXkgKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3Qgc2VsZkxvY2tlZCA9IC9eKDF8dHJ1ZXx5ZXMpJC9pLnRlc3QoICh0LmRhdGFzZXQ/LmxvY2tlZCB8fCAnJykudHJpbSgpICk7XHJcblx0XHRcdFx0XHRpZiAoIHNlbGZMb2NrZWQgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBTa2lwIGtleXMgd2UgaGFuZGxlZCBhYm92ZSB0byBhdm9pZCBkb3VibGUgd29yay5cclxuXHRcdFx0XHRcdGlmICgga2V5ID09PSAnaWQnIHx8IGtleSA9PT0gJ25hbWUnIHx8IGtleSA9PT0gJ2h0bWxfaWQnIHx8IGtleSA9PT0gJ2Nzc2NsYXNzJyB8fCBrZXkgPT09ICdsYWJlbCcgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBuZXh0VmFsID0gJyc7XHJcblx0XHRcdFx0XHRpZiAoIHQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmICh0LnR5cGUgPT09ICdjaGVja2JveCcgfHwgdC50eXBlID09PSAncmFkaW8nKSApIHtcclxuXHRcdFx0XHRcdFx0bmV4dFZhbCA9IHQuY2hlY2tlZCA/ICcxJyA6ICcnO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJ3ZhbHVlJyBpbiB0ICkge1xyXG5cdFx0XHRcdFx0XHRuZXh0VmFsID0gU3RyaW5nKCB0LnZhbHVlID8/ICcnICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBQZXJzaXN0IHRvIGRhdGFzZXQuXHJcblx0XHRcdFx0XHRpZiAoIHNlbD8uZGF0YXNldCApIHNlbC5kYXRhc2V0W2tleV0gPSBuZXh0VmFsO1xyXG5cdFx0XHRcdFx0Ly8gUmUtcmVuZGVyIG9uIHZpc3VhbCBrZXlzIHNvIHByZXZpZXcgc3RheXMgaW4gc3luYyAoY2FsZW5kYXIgbGFiZWwvaGVscCwgZXRjLikuXHJcblx0XHRcdFx0XHRjb25zdCB2aXN1YWxLZXlzID0gbmV3IFNldCggWyAnaGVscCcsICdwbGFjZWhvbGRlcicsICdtaW5fd2lkdGgnLCAnY3NzY2xhc3MnIF0gKTtcclxuXHRcdFx0XHRcdGlmICggIWlzU2VjdGlvbiAmJiAodmlzdWFsS2V5cy5oYXMoIGtleSApIHx8IGtleS5zdGFydHNXaXRoKCAndWlfJyApKSApIHtcclxuXHRcdFx0XHRcdFx0Ly8gTGlnaHQgaGV1cmlzdGljOiBvbmx5IHJlLXJlbmRlciBvbiBjb21taXQgZm9yIGhlYXZ5IGlucHV0czsgbGl2ZSBmb3Igc2hvcnQgb25lcyBpcyBmaW5lLlxyXG5cdFx0XHRcdFx0XHRpZiAoIGUudHlwZSA9PT0gJ2NoYW5nZScgfHwga2V5ID09PSAnaGVscCcgfHwga2V5ID09PSAncGxhY2Vob2xkZXInICkge1xyXG5cdFx0XHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIHNlbCApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXNfZW1pdF9jaGFuZ2UoICdwcm9wLWNoYW5nZScsIHsga2V5LCBwaGFzZTogZS50eXBlIH0gKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpbnMuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGhhbmRsZXIsIHRydWUgKTtcclxuXHRcdFx0Ly8gcmVmbGVjdCBpbnN0YW50bHkgd2hpbGUgdHlwaW5nIGFzIHdlbGwuXHJcblx0XHRcdGlucy5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBoYW5kbGVyLCB0cnVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBPcGVuIEluc3BlY3RvciBhZnRlciBhIGZpZWxkIGlzIGFkZGVkLlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0X29wZW5faW5zcGVjdG9yX2FmdGVyX2ZpZWxkX2FkZGVkKCkge1xyXG5cdFx0XHRjb25zdCBFViA9IENvcmUuV1BCQ19CRkJfRXZlbnRzO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXI/LmJ1cz8ub24/LiggRVYuRklFTERfQURELCAoZSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGVsID0gZT8uZGV0YWlsPy5lbCB8fCBudWxsO1xyXG5cdFx0XHRcdGlmICggZWwgJiYgdGhpcy5idWlsZGVyPy5zZWxlY3RfZmllbGQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1aWxkZXIuc2VsZWN0X2ZpZWxkKCBlbCwgeyBzY3JvbGxJbnRvVmlldzogdHJ1ZSB9ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFNob3cgSW5zcGVjdG9yIFBhbGV0dGUuXHJcblx0XHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCggbmV3IEN1c3RvbUV2ZW50KCAnd3BiY19iZmI6c2hvd19wYW5lbCcsIHtcclxuXHRcdFx0XHRcdGRldGFpbDoge1xyXG5cdFx0XHRcdFx0XHRwYW5lbF9pZDogJ3dwYmNfYmZiX19pbnNwZWN0b3InLFxyXG5cdFx0XHRcdFx0XHR0YWJfaWQgIDogJ3dwYmNfdGFiX2luc3BlY3RvcidcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICkgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEtleWJvYXJkIHNob3J0Y3V0cyBmb3Igc2VsZWN0aW9uLCBkZWxldGlvbiwgYW5kIG1vdmVtZW50LlxyXG5cdCAqL1xyXG5cdFVJLldQQkNfQkZCX0tleWJvYXJkX0NvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIFVJLldQQkNfQkZCX01vZHVsZSB7XHJcblx0XHRpbml0KCkge1xyXG5cdFx0XHR0aGlzLl9vbl9rZXkgPSB0aGlzLm9uX2tleS5iaW5kKCB0aGlzICk7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgdGhpcy5fb25fa2V5LCB0cnVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGVzdHJveSgpIHtcclxuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCB0aGlzLl9vbl9rZXksIHRydWUgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlICovXHJcblx0XHRvbl9rZXkoZSkge1xyXG5cdFx0XHRjb25zdCBiICAgICAgICAgPSB0aGlzLmJ1aWxkZXI7XHJcblx0XHRcdGNvbnN0IGlzX3R5cGluZyA9IHRoaXMuX2lzX3R5cGluZ19hbnl3aGVyZSgpO1xyXG5cdFx0XHRpZiAoIGUua2V5ID09PSAnRXNjYXBlJyApIHtcclxuXHRcdFx0XHRpZiAoIGlzX3R5cGluZyApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLmJ1cy5lbWl0KCBDb3JlLldQQkNfQkZCX0V2ZW50cy5DTEVBUl9TRUxFQ1RJT04sIHsgc291cmNlOiAnZXNjJyB9ICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHNlbGVjdGVkID0gYi5nZXRfc2VsZWN0ZWRfZmllbGQ/LigpO1xyXG5cdFx0XHRpZiAoICFzZWxlY3RlZCB8fCBpc190eXBpbmcgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggZS5rZXkgPT09ICdEZWxldGUnIHx8IGUua2V5ID09PSAnQmFja3NwYWNlJyApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Yi5kZWxldGVfaXRlbT8uKCBzZWxlY3RlZCApO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIChlLmFsdEtleSB8fCBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSAmJiAoZS5rZXkgPT09ICdBcnJvd1VwJyB8fCBlLmtleSA9PT0gJ0Fycm93RG93bicpICYmICFlLnNoaWZ0S2V5ICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb25zdCBkaXIgPSAoZS5rZXkgPT09ICdBcnJvd1VwJykgPyAndXAnIDogJ2Rvd24nO1xyXG5cdFx0XHRcdGIubW92ZV9pdGVtPy4oIHNlbGVjdGVkLCBkaXIgKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBlLmtleSA9PT0gJ0VudGVyJyApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Yi5zZWxlY3RfZmllbGQoIHNlbGVjdGVkLCB7IHNjcm9sbEludG9WaWV3OiB0cnVlIH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gKi9cclxuXHRcdF9pc190eXBpbmdfYW55d2hlcmUoKSB7XHJcblx0XHRcdGNvbnN0IGEgICA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblx0XHRcdGNvbnN0IHRhZyA9IGE/LnRhZ05hbWU7XHJcblx0XHRcdGlmICggdGFnID09PSAnSU5QVVQnIHx8IHRhZyA9PT0gJ1RFWFRBUkVBJyB8fCB0YWcgPT09ICdTRUxFQ1QnIHx8IChhPy5pc0NvbnRlbnRFZGl0YWJsZSA9PT0gdHJ1ZSkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaW5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICd3cGJjX2JmYl9faW5zcGVjdG9yJyApO1xyXG5cdFx0XHRyZXR1cm4gISEoaW5zICYmIGEgJiYgaW5zLmNvbnRhaW5zKCBhICkpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbHVtbiByZXNpemUgbG9naWMgZm9yIHNlY3Rpb24gcm93cy5cclxuXHQgKi9cclxuXHRVSS5XUEJDX0JGQl9SZXNpemVfQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgVUkuV1BCQ19CRkJfTW9kdWxlIHtcclxuXHRcdGluaXQoKSB7XHJcblx0XHRcdHRoaXMuYnVpbGRlci5pbml0X3Jlc2l6ZV9oYW5kbGVyID0gdGhpcy5oYW5kbGVfcmVzaXplLmJpbmQoIHRoaXMgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIHJlYWQgdGhlIENTUyB2YXIgKGtlcHQgbG9jYWwgc28gaXQgZG9lc27igJl0IGRlcGVuZCBvbiB0aGUgTWluLVdpZHRoIG1vZHVsZSlcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gY29sXHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfG51bWJlcn1cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdF9nZXRfY29sX21pbl9weChjb2wpIHtcclxuXHRcdFx0Y29uc3QgdiA9IGdldENvbXB1dGVkU3R5bGUoIGNvbCApLmdldFByb3BlcnR5VmFsdWUoICctLXdwYmMtY29sLW1pbicgKSB8fCAnMCc7XHJcblx0XHRcdGNvbnN0IG4gPSBwYXJzZUZsb2F0KCB2ICk7XHJcblx0XHRcdHJldHVybiBOdW1iZXIuaXNGaW5pdGUoIG4gKSA/IE1hdGgubWF4KCAwLCBuICkgOiAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcGFyYW0ge01vdXNlRXZlbnR9IGUgKi9cclxuXHRcdGhhbmRsZV9yZXNpemUoZSkge1xyXG5cdFx0XHRjb25zdCBiID0gdGhpcy5idWlsZGVyO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGlmICggZS5idXR0b24gIT09IDAgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCByZXNpemVyICAgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblx0XHRcdGNvbnN0IHJvd19lbCAgICA9IHJlc2l6ZXIucGFyZW50RWxlbWVudDtcclxuXHRcdFx0Y29uc3QgY29scyAgICAgID0gQXJyYXkuZnJvbSggcm93X2VsLnF1ZXJ5U2VsZWN0b3JBbGwoICc6c2NvcGUgPiAud3BiY19iZmJfX2NvbHVtbicgKSApO1xyXG5cdFx0XHRjb25zdCBsZWZ0X2NvbCAgPSByZXNpemVyPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRjb25zdCByaWdodF9jb2wgPSByZXNpemVyPy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdGlmICggIWxlZnRfY29sIHx8ICFyaWdodF9jb2wgfHwgIWxlZnRfY29sLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19jb2x1bW4nICkgfHwgIXJpZ2h0X2NvbC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fY29sdW1uJyApICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Y29uc3QgbGVmdF9pbmRleCAgPSBjb2xzLmluZGV4T2YoIGxlZnRfY29sICk7XHJcblx0XHRcdGNvbnN0IHJpZ2h0X2luZGV4ID0gY29scy5pbmRleE9mKCByaWdodF9jb2wgKTtcclxuXHRcdFx0aWYgKCBsZWZ0X2luZGV4ID09PSAtMSB8fCByaWdodF9pbmRleCAhPT0gbGVmdF9pbmRleCArIDEgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBzdGFydF94ICAgICAgICA9IGUuY2xpZW50WDtcclxuXHRcdFx0Y29uc3QgbGVmdF9zdGFydF9weCAgPSBsZWZ0X2NvbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdFx0Y29uc3QgcmlnaHRfc3RhcnRfcHggPSByaWdodF9jb2wuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRcdGNvbnN0IHBhaXJfcHggICAgICAgID0gTWF0aC5tYXgoIDAsIGxlZnRfc3RhcnRfcHggKyByaWdodF9zdGFydF9weCApO1xyXG5cclxuXHRcdFx0Y29uc3QgZ3AgICAgICAgICA9IGIuY29sX2dhcF9wZXJjZW50O1xyXG5cdFx0XHRjb25zdCBjb21wdXRlZCAgID0gYi5sYXlvdXQuY29tcHV0ZV9lZmZlY3RpdmVfYmFzZXNfZnJvbV9yb3coIHJvd19lbCwgZ3AgKTtcclxuXHRcdFx0Y29uc3QgYXZhaWxhYmxlICA9IGNvbXB1dGVkLmF2YWlsYWJsZTsgICAgICAgICAgICAgICAgIC8vICUgb2YgdGhlIOKAnGZ1bGwgMTAw4oCdIGFmdGVyIGdhcHNcclxuXHRcdFx0Y29uc3QgYmFzZXMgICAgICA9IGNvbXB1dGVkLmJhc2VzLnNsaWNlKCAwICk7ICAgICAgICAgICAgLy8gY3VycmVudCBlZmZlY3RpdmUgJVxyXG5cdFx0XHRjb25zdCBwYWlyX2F2YWlsID0gYmFzZXNbbGVmdF9pbmRleF0gKyBiYXNlc1tyaWdodF9pbmRleF07XHJcblxyXG5cdFx0XHQvLyBCYWlsIGlmIHdlIGNhbuKAmXQgY29tcHV0ZSBzYW5lIGRlbHRhcy5cclxuXHRcdFx0aWYgKCFwYWlyX3B4IHx8ICFOdW1iZXIuaXNGaW5pdGUocGFpcl9hdmFpbCkgfHwgcGFpcl9hdmFpbCA8PSAwKSByZXR1cm47XHJcblxyXG5cdFx0XHQvLyAtLS0gTUlOIENMQU1QUyAocGl4ZWxzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGNvbnN0IHBjdFRvUHggICAgICAgPSAocGN0KSA9PiAocGFpcl9weCAqIChwY3QgLyBwYWlyX2F2YWlsKSk7IC8vIHBhaXItbG9jYWwgcGVyY2VudCAtPiBweFxyXG5cdFx0XHRjb25zdCBnZW5lcmljTWluUGN0ID0gTWF0aC5taW4oIDAuMSwgYXZhaWxhYmxlICk7ICAgICAgICAgICAgICAgICAgLy8gb3JpZ2luYWwgMC4xJSBmbG9vciAoaW4g4oCcYXZhaWxhYmxlICXigJ0gc3BhY2UpXHJcblx0XHRcdGNvbnN0IGdlbmVyaWNNaW5QeCAgPSBwY3RUb1B4KCBnZW5lcmljTWluUGN0ICk7XHJcblxyXG5cdFx0XHRjb25zdCBsZWZ0TWluUHggID0gTWF0aC5tYXgoIHRoaXMuX2dldF9jb2xfbWluX3B4KCBsZWZ0X2NvbCApLCBnZW5lcmljTWluUHggKTtcclxuXHRcdFx0Y29uc3QgcmlnaHRNaW5QeCA9IE1hdGgubWF4KCB0aGlzLl9nZXRfY29sX21pbl9weCggcmlnaHRfY29sICksIGdlbmVyaWNNaW5QeCApO1xyXG5cclxuXHRcdFx0Ly8gZnJlZXplIHRleHQgc2VsZWN0aW9uICsgY3Vyc29yXHJcblx0XHRcdGNvbnN0IHByZXZfdXNlcl9zZWxlY3QgICAgICAgICA9IGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdDtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xyXG5cdFx0XHRyb3dfZWwuc3R5bGUuY3Vyc29yICAgICAgICAgICAgPSAnY29sLXJlc2l6ZSc7XHJcblxyXG5cdFx0XHRjb25zdCBvbl9tb3VzZV9tb3ZlID0gKGV2KSA9PiB7XHJcblx0XHRcdFx0aWYgKCAhcGFpcl9weCApIHJldHVybjtcclxuXHJcblx0XHRcdFx0Ly8gd29yayBpbiBwaXhlbHMsIGNsYW1wIGJ5IGVhY2ggc2lkZeKAmXMgbWluXHJcblx0XHRcdFx0Y29uc3QgZGVsdGFfcHggICA9IGV2LmNsaWVudFggLSBzdGFydF94O1xyXG5cdFx0XHRcdGxldCBuZXdMZWZ0UHggICAgPSBsZWZ0X3N0YXJ0X3B4ICsgZGVsdGFfcHg7XHJcblx0XHRcdFx0bmV3TGVmdFB4ICAgICAgICA9IE1hdGgubWF4KCBsZWZ0TWluUHgsIE1hdGgubWluKCBwYWlyX3B4IC0gcmlnaHRNaW5QeCwgbmV3TGVmdFB4ICkgKTtcclxuXHRcdFx0XHRjb25zdCBuZXdSaWdodFB4ID0gcGFpcl9weCAtIG5ld0xlZnRQeDtcclxuXHJcblx0XHRcdFx0Ly8gdHJhbnNsYXRlIGJhY2sgdG8gcGFpci1sb2NhbCBwZXJjZW50YWdlc1xyXG5cdFx0XHRcdGNvbnN0IG5ld0xlZnRQY3QgICAgICA9IChuZXdMZWZ0UHggLyBwYWlyX3B4KSAqIHBhaXJfYXZhaWw7XHJcblx0XHRcdFx0Y29uc3QgbmV3QmFzZXMgICAgICAgID0gYmFzZXMuc2xpY2UoIDAgKTtcclxuXHRcdFx0XHRuZXdCYXNlc1tsZWZ0X2luZGV4XSAgPSBuZXdMZWZ0UGN0O1xyXG5cdFx0XHRcdG5ld0Jhc2VzW3JpZ2h0X2luZGV4XSA9IHBhaXJfYXZhaWwgLSBuZXdMZWZ0UGN0O1xyXG5cclxuXHRcdFx0XHRiLmxheW91dC5hcHBseV9iYXNlc190b19yb3coIHJvd19lbCwgbmV3QmFzZXMgKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGNvbnN0IG9uX21vdXNlX3VwID0gKCkgPT4ge1xyXG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBvbl9tb3VzZV9tb3ZlICk7XHJcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBvbl9tb3VzZV91cCApO1xyXG5cdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG9uX21vdXNlX3VwICk7XHJcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbGVhdmUnLCBvbl9tb3VzZV91cCApO1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IHByZXZfdXNlcl9zZWxlY3QgfHwgJyc7XHJcblx0XHRcdFx0cm93X2VsLnN0eWxlLmN1cnNvciAgICAgICAgICAgID0gJyc7XHJcblxyXG5cdFx0XHRcdC8vIG5vcm1hbGl6ZSB0byB0aGUgcm934oCZcyBhdmFpbGFibGUgJSBhZ2FpblxyXG5cdFx0XHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBiLmxheW91dC5jb21wdXRlX2VmZmVjdGl2ZV9iYXNlc19mcm9tX3Jvdyggcm93X2VsLCBncCApO1xyXG5cdFx0XHRcdGIubGF5b3V0LmFwcGx5X2Jhc2VzX3RvX3Jvdyggcm93X2VsLCBub3JtYWxpemVkLmJhc2VzICk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgb25fbW91c2VfbW92ZSApO1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG9uX21vdXNlX3VwICk7XHJcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG9uX21vdXNlX3VwICk7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWxlYXZlJywgb25fbW91c2VfdXAgKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUGFnZSBhbmQgc2VjdGlvbiBjcmVhdGlvbiwgcmVidWlsZGluZywgYW5kIG5lc3RlZCBTb3J0YWJsZSBzZXR1cC5cclxuXHQgKi9cclxuXHRVSS5XUEJDX0JGQl9QYWdlc19TZWN0aW9ucyA9IGNsYXNzIGV4dGVuZHMgVUkuV1BCQ19CRkJfTW9kdWxlIHtcclxuXHRcdGluaXQoKSB7XHJcblx0XHRcdHRoaXMuYnVpbGRlci5hZGRfcGFnZSAgICAgICAgICAgICAgICAgID0gKG9wdHMpID0+IHRoaXMuYWRkX3BhZ2UoIG9wdHMgKTtcclxuXHRcdFx0dGhpcy5idWlsZGVyLmFkZF9zZWN0aW9uICAgICAgICAgICAgICAgPSAoY29udGFpbmVyLCBjb2xzKSA9PiB0aGlzLmFkZF9zZWN0aW9uKCBjb250YWluZXIsIGNvbHMgKTtcclxuXHRcdFx0dGhpcy5idWlsZGVyLnJlYnVpbGRfc2VjdGlvbiAgICAgICAgICAgPSAoc2VjdGlvbl9kYXRhLCBjb250YWluZXIpID0+IHRoaXMucmVidWlsZF9zZWN0aW9uKCBzZWN0aW9uX2RhdGEsIGNvbnRhaW5lciApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuaW5pdF9hbGxfbmVzdGVkX3NvcnRhYmxlcyA9IChlbCkgPT4gdGhpcy5pbml0X2FsbF9uZXN0ZWRfc29ydGFibGVzKCBlbCApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuaW5pdF9zZWN0aW9uX3NvcnRhYmxlICAgICA9IChlbCkgPT4gdGhpcy5pbml0X3NlY3Rpb25fc29ydGFibGUoIGVsICk7XHJcblx0XHRcdHRoaXMuYnVpbGRlci5wYWdlc19zZWN0aW9ucyAgICAgICAgICAgID0gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEdpdmUgZXZlcnkgZmllbGQvc2VjdGlvbiBpbiBhIGNsb25lZCBzdWJ0cmVlIGEgZnJlc2ggZGF0YS11aWQgc29cclxuXHRcdCAqIHVuaXF1ZW5lc3MgY2hlY2tzIGRvbid0IGV4Y2x1ZGUgdGhlaXIgb3JpZ2luYWxzLlxyXG5cdFx0ICovXHJcblx0XHRfcmV0YWdfdWlkc19pbl9zdWJ0cmVlKHJvb3QpIHtcclxuXHRcdFx0Y29uc3QgYiA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0aWYgKCAhcm9vdCApIHJldHVybjtcclxuXHRcdFx0Y29uc3Qgbm9kZXMgPSBbXTtcclxuXHRcdFx0aWYgKCByb290LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fc2VjdGlvbicgKSB8fCByb290LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fZmllbGQnICkgKSB7XHJcblx0XHRcdFx0bm9kZXMucHVzaCggcm9vdCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdG5vZGVzLnB1c2goIC4uLnJvb3QucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX2JmYl9fc2VjdGlvbiwgLndwYmNfYmZiX19maWVsZCcgKSApO1xyXG5cdFx0XHRub2Rlcy5mb3JFYWNoKCAoZWwpID0+IHtcclxuXHRcdFx0XHRjb25zdCBwcmVmaXggICA9IGVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApID8gJ3MnIDogJ2YnO1xyXG5cdFx0XHRcdGVsLmRhdGFzZXQudWlkID0gYCR7cHJlZml4fS0keysrYi5fdWlkX2NvdW50ZXJ9LSR7RGF0ZS5ub3coKX0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCAzNiApLnNsaWNlKCAyLCA3ICl9YDtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQnVtcCBcImZvb1wiLCBcImZvby0yXCIsIFwiZm9vLTNcIiwgLi4uXHJcblx0XHQgKi9cclxuXHRcdF9tYWtlX3VuaXF1ZShiYXNlLCB0YWtlbikge1xyXG5cdFx0XHRjb25zdCBzID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZTtcclxuXHRcdFx0bGV0IHYgICA9IFN0cmluZyggYmFzZSB8fCAnJyApO1xyXG5cdFx0XHRpZiAoICF2ICkgdiA9ICdmaWVsZCc7XHJcblx0XHRcdGNvbnN0IG0gID0gdi5tYXRjaCggLy0oXFxkKykkLyApO1xyXG5cdFx0XHRsZXQgbiAgICA9IG0gPyAocGFyc2VJbnQoIG1bMV0sIDEwICkgfHwgMSkgOiAxO1xyXG5cdFx0XHRsZXQgc3RlbSA9IG0gPyB2LnJlcGxhY2UoIC8tXFxkKyQvLCAnJyApIDogdjtcclxuXHRcdFx0d2hpbGUgKCB0YWtlbi5oYXMoIHYgKSApIHtcclxuXHRcdFx0XHRuID0gTWF0aC5tYXgoIDIsIG4gKyAxICk7XHJcblx0XHRcdFx0diA9IGAke3N0ZW19LSR7bn1gO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRha2VuLmFkZCggdiApO1xyXG5cdFx0XHRyZXR1cm4gdjtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN0cmljdCwgb25lLXBhc3MgZGUtZHVwbGljYXRpb24gZm9yIGEgbmV3bHktaW5zZXJ0ZWQgc3VidHJlZS5cclxuXHRcdCAqIC0gRW5zdXJlcyB1bmlxdWUgZGF0YS1pZCAoaW50ZXJuYWwpLCBkYXRhLW5hbWUgKGZpZWxkcyksIGRhdGEtaHRtbF9pZCAocHVibGljKVxyXG5cdFx0ICogLSBBbHNvIHVwZGF0ZXMgRE9NOiA8c2VjdGlvbiBpZD4sIDxpbnB1dCBpZD4sIDxsYWJlbCBmb3I+LCBhbmQgaW5wdXRbbmFtZV0uXHJcblx0XHQgKi9cclxuXHRcdF9kZWR1cGVfc3VidHJlZV9zdHJpY3Qocm9vdCkge1xyXG5cdFx0XHRjb25zdCBiID0gdGhpcy5idWlsZGVyO1xyXG5cdFx0XHRjb25zdCBzID0gQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZTtcclxuXHRcdFx0aWYgKCAhcm9vdCB8fCAhYj8ucGFnZXNfY29udGFpbmVyICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Ly8gMSkgQnVpbGQgXCJ0YWtlblwiIHNldHMgZnJvbSBvdXRzaWRlIHRoZSBzdWJ0cmVlLlxyXG5cdFx0XHRjb25zdCB0YWtlbkRhdGFJZCAgID0gbmV3IFNldCgpO1xyXG5cdFx0XHRjb25zdCB0YWtlbkRhdGFOYW1lID0gbmV3IFNldCgpO1xyXG5cdFx0XHRjb25zdCB0YWtlbkh0bWxJZCAgID0gbmV3IFNldCgpO1xyXG5cdFx0XHRjb25zdCB0YWtlbkRvbUlkICAgID0gbmV3IFNldCgpO1xyXG5cclxuXHRcdFx0Ly8gQWxsIGZpZWxkcy9zZWN0aW9ucyBvdXRzaWRlIHJvb3RcclxuXHRcdFx0Yi5wYWdlc19jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX2JmYl9fZmllbGQsIC53cGJjX2JmYl9fc2VjdGlvbicgKS5mb3JFYWNoKCBlbCA9PiB7XHJcblx0XHRcdFx0aWYgKCByb290LmNvbnRhaW5zKCBlbCApICkgcmV0dXJuO1xyXG5cdFx0XHRcdGNvbnN0IGRpZCAgPSBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWlkJyApO1xyXG5cdFx0XHRcdGNvbnN0IGRuYW0gPSBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLW5hbWUnICk7XHJcblx0XHRcdFx0Y29uc3QgaGlkICA9IGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtaHRtbF9pZCcgKTtcclxuXHRcdFx0XHRpZiAoIGRpZCApIHRha2VuRGF0YUlkLmFkZCggZGlkICk7XHJcblx0XHRcdFx0aWYgKCBkbmFtICkgdGFrZW5EYXRhTmFtZS5hZGQoIGRuYW0gKTtcclxuXHRcdFx0XHRpZiAoIGhpZCApIHRha2VuSHRtbElkLmFkZCggaGlkICk7XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdC8vIEFsbCBET00gaWRzIG91dHNpZGUgcm9vdCAobGFiZWxzLCBpbnB1dHMsIGFueXRoaW5nKVxyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnW2lkXScgKS5mb3JFYWNoKCBlbCA9PiB7XHJcblx0XHRcdFx0aWYgKCByb290LmNvbnRhaW5zKCBlbCApICkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICggZWwuaWQgKSB0YWtlbkRvbUlkLmFkZCggZWwuaWQgKTtcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0Y29uc3Qgbm9kZXMgPSBbXTtcclxuXHRcdFx0aWYgKCByb290LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fc2VjdGlvbicgKSB8fCByb290LmNsYXNzTGlzdD8uY29udGFpbnMoICd3cGJjX2JmYl9fZmllbGQnICkgKSB7XHJcblx0XHRcdFx0bm9kZXMucHVzaCggcm9vdCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdG5vZGVzLnB1c2goIC4uLnJvb3QucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX2JmYl9fc2VjdGlvbiwgLndwYmNfYmZiX19maWVsZCcgKSApO1xyXG5cclxuXHRcdFx0Ly8gMikgV2FsayB0aGUgc3VidHJlZSBhbmQgZml4IGNvbGxpc2lvbnMgZGV0ZXJtaW5pc3RpY2FsbHkuXHJcblx0XHRcdG5vZGVzLmZvckVhY2goIGVsID0+IHtcclxuXHRcdFx0XHRjb25zdCBpc0ZpZWxkICAgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fZmllbGQnICk7XHJcblx0XHRcdFx0Y29uc3QgaXNTZWN0aW9uID0gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX3NlY3Rpb24nICk7XHJcblxyXG5cdFx0XHRcdC8vIElOVEVSTkFMIGRhdGEtaWRcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjb25zdCByYXcgID0gZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1pZCcgKSB8fCAnJztcclxuXHRcdFx0XHRcdGNvbnN0IGJhc2UgPSBzLnNhbml0aXplX2h0bWxfaWQoIHJhdyApIHx8IChpc1NlY3Rpb24gPyAnc2VjdGlvbicgOiAnZmllbGQnKTtcclxuXHRcdFx0XHRcdGNvbnN0IHVuaXEgPSB0aGlzLl9tYWtlX3VuaXF1ZSggYmFzZSwgdGFrZW5EYXRhSWQgKTtcclxuXHRcdFx0XHRcdGlmICggdW5pcSAhPT0gcmF3ICkgZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1pZCcsIHVuaXEgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEhUTUwgbmFtZSAoZmllbGRzIG9ubHkpXHJcblx0XHRcdFx0aWYgKCBpc0ZpZWxkICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmF3ID0gZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1uYW1lJyApIHx8ICcnO1xyXG5cdFx0XHRcdFx0aWYgKCByYXcgKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGJhc2UgPSBzLnNhbml0aXplX2h0bWxfbmFtZSggcmF3ICk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHVuaXEgPSB0aGlzLl9tYWtlX3VuaXF1ZSggYmFzZSwgdGFrZW5EYXRhTmFtZSApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHVuaXEgIT09IHJhdyApIHtcclxuXHRcdFx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdkYXRhLW5hbWUnLCB1bmlxICk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGlubmVyIGNvbnRyb2wgaW1tZWRpYXRlbHlcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpbnB1dCA9IGVsLnF1ZXJ5U2VsZWN0b3IoICdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcgKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIGlucHV0ICkgaW5wdXQuc2V0QXR0cmlidXRlKCAnbmFtZScsIHVuaXEgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gUHVibGljIEhUTUwgaWQgKGZpZWxkcyArIHNlY3Rpb25zKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNvbnN0IHJhdyA9IGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtaHRtbF9pZCcgKSB8fCAnJztcclxuXHRcdFx0XHRcdGlmICggcmF3ICkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBiYXNlICAgICAgICAgID0gcy5zYW5pdGl6ZV9odG1sX2lkKCByYXcgKTtcclxuXHRcdFx0XHRcdFx0Ly8gUmVzZXJ2ZSBhZ2FpbnN0IEJPVEgga25vd24gZGF0YS1odG1sX2lkIGFuZCByZWFsIERPTSBpZHMuXHJcblx0XHRcdFx0XHRcdGNvbnN0IGNvbWJpbmVkVGFrZW4gPSBuZXcgU2V0KCBbIC4uLnRha2VuSHRtbElkLCAuLi50YWtlbkRvbUlkIF0gKTtcclxuXHRcdFx0XHRcdFx0bGV0IGNhbmRpZGF0ZSAgICAgICA9IHRoaXMuX21ha2VfdW5pcXVlKCBiYXNlLCBjb21iaW5lZFRha2VuICk7XHJcblx0XHRcdFx0XHRcdC8vIFJlY29yZCBpbnRvIHRoZSByZWFsIHNldHMgc28gZnV0dXJlIGNoZWNrcyBzZWUgdGhlIHJlc2VydmF0aW9uLlxyXG5cdFx0XHRcdFx0XHR0YWtlbkh0bWxJZC5hZGQoIGNhbmRpZGF0ZSApO1xyXG5cdFx0XHRcdFx0XHR0YWtlbkRvbUlkLmFkZCggY2FuZGlkYXRlICk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIGNhbmRpZGF0ZSAhPT0gcmF3ICkgZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1odG1sX2lkJywgY2FuZGlkYXRlICk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBSZWZsZWN0IHRvIERPTSBpbW1lZGlhdGVseVxyXG5cdFx0XHRcdFx0XHRpZiAoIGlzU2VjdGlvbiApIHtcclxuXHRcdFx0XHRcdFx0XHRlbC5pZCA9IGNhbmRpZGF0ZSB8fCAnJztcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpbnB1dCA9IGVsLnF1ZXJ5U2VsZWN0b3IoICdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcgKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoICdsYWJlbC53cGJjX2JmYl9fZmllbGQtbGFiZWwnICk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBpbnB1dCApIGlucHV0LmlkID0gY2FuZGlkYXRlIHx8ICcnO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggbGFiZWwgKSBsYWJlbC5odG1sRm9yID0gY2FuZGlkYXRlIHx8ICcnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCBpc1NlY3Rpb24gKSB7XHJcblx0XHRcdFx0XHRcdC8vIEVuc3VyZSBubyBzdGFsZSBET00gaWQgaWYgZGF0YS1odG1sX2lkIHdhcyBjbGVhcmVkXHJcblx0XHRcdFx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2lkJyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9tYWtlX2FkZF9jb2x1bW5zX2NvbnRyb2wocGFnZV9lbCwgc2VjdGlvbl9jb250YWluZXIsIGluc2VydF9wb3MgPSAnYm90dG9tJykge1xyXG5cclxuXHRcdFx0Ly8gQWNjZXB0IGluc2VydF9wb3MgKCd0b3AnfCdib3R0b20nKSwgZGVmYXVsdCAnYm90dG9tJy5cclxuXHJcblx0XHRcdGNvbnN0IHRwbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnd3BiY19iZmJfX2FkZF9jb2x1bW5zX3RlbXBsYXRlJyApO1xyXG5cdFx0XHRpZiAoICF0cGwgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENsb25lICpjb250ZW50cyogKG5vdCB0aGUgaWQpLCB1bmhpZGUsIGFuZCBhZGQgYSBwYWdlLXNjb3BlZCBjbGFzcy5cclxuXHRcdFx0Y29uc3Qgc3JjID0gKHRwbC5jb250ZW50ICYmIHRwbC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkKSA/IHRwbC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkIDogdHBsLmZpcnN0RWxlbWVudENoaWxkO1xyXG5cdFx0XHRpZiAoICFzcmMgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNsb25lID0gc3JjLmNsb25lTm9kZSggdHJ1ZSApO1xyXG5cdFx0XHRjbG9uZS5yZW1vdmVBdHRyaWJ1dGUoICdoaWRkZW4nICk7XHJcblx0XHRcdGlmICggY2xvbmUuaWQgKSB7XHJcblx0XHRcdFx0Y2xvbmUucmVtb3ZlQXR0cmlidXRlKCAnaWQnICk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2xvbmUucXVlcnlTZWxlY3RvckFsbCggJ1tpZF0nICkuZm9yRWFjaCggbiA9PiBuLnJlbW92ZUF0dHJpYnV0ZSggJ2lkJyApICk7XHJcblxyXG5cdFx0XHQvLyBNYXJrIHdoZXJlIHRoaXMgY29udHJvbCBpbnNlcnRzIHNlY3Rpb25zLlxyXG5cdFx0XHRjbG9uZS5kYXRhc2V0Lmluc2VydCA9IGluc2VydF9wb3M7IC8vICd0b3AnIHwgJ2JvdHRvbSdcclxuXHJcblx0XHRcdC8vIC8vIE9wdGlvbmFsIFVJIGhpbnQgZm9yIHVzZXJzIChrZWVwcyBleGlzdGluZyBtYXJrdXAgaW50YWN0KS5cclxuXHRcdFx0Ly8gY29uc3QgaGludCA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoICcubmF2LXRhYi10ZXh0IC5zZWxlY3RlZF92YWx1ZScgKTtcclxuXHRcdFx0Ly8gaWYgKCBoaW50ICkge1xyXG5cdFx0XHQvLyBcdGhpbnQudGV4dENvbnRlbnQgPSAoaW5zZXJ0X3BvcyA9PT0gJ3RvcCcpID8gJyAoYWRkIGF0IHRvcCknIDogJyAoYWRkIGF0IGJvdHRvbSknO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBDbGljayBvbiBvcHRpb25zIC0gYWRkIHNlY3Rpb24gd2l0aCBOIGNvbHVtbnMuXHJcblx0XHRcdGNsb25lLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgYSA9IGUudGFyZ2V0LmNsb3Nlc3QoICcudWxfZHJvcGRvd25fbWVudV9saV9hY3Rpb25fYWRkX3NlY3Rpb25zJyApO1xyXG5cdFx0XHRcdGlmICggIWEgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0Ly8gUmVhZCBOIGVpdGhlciBmcm9tIGRhdGEtY29scyBvciBmYWxsYmFjayB0byBwYXJzaW5nIHRleHQgbGlrZSBcIjMgQ29sdW1uc1wiLlxyXG5cdFx0XHRcdGxldCBjb2xzID0gcGFyc2VJbnQoIGEuZGF0YXNldC5jb2xzIHx8IChhLnRleHRDb250ZW50Lm1hdGNoKCAvXFxiKFxcZCspXFxzKkNvbHVtbi9pICk/LlsxXSA/PyAnMScpLCAxMCApO1xyXG5cdFx0XHRcdGNvbHMgICAgID0gTWF0aC5tYXgoIDEsIE1hdGgubWluKCA0LCBjb2xzICkgKTtcclxuXHJcblx0XHRcdFx0Ly8gTkVXOiBob25vciB0aGUgY29udHJvbCdzIGluc2VydGlvbiBwb3NpdGlvblxyXG5cdFx0XHRcdHRoaXMuYWRkX3NlY3Rpb24oIHNlY3Rpb25fY29udGFpbmVyLCBjb2xzLCBpbnNlcnRfcG9zICk7XHJcblxyXG5cdFx0XHRcdC8vIFJlZmxlY3QgbGFzdCBjaG9pY2UgKHVuY2hhbmdlZClcclxuXHRcdFx0XHRjb25zdCB2YWwgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCAnLnNlbGVjdGVkX3ZhbHVlJyApO1xyXG5cdFx0XHRcdGlmICggdmFsICkge1xyXG5cdFx0XHRcdFx0dmFsLnRleHRDb250ZW50ID0gYCAoJHtjb2xzfSlgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0cmV0dXJuIGNsb25lO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwYXJhbSB7e3Njcm9sbD86IGJvb2xlYW59fSBbb3B0cyA9IHt9XVxyXG5cdFx0ICogQHJldHVybnMge0hUTUxFbGVtZW50fVxyXG5cdFx0ICovXHJcblx0XHRhZGRfcGFnZSh7IHNjcm9sbCA9IHRydWUgfSA9IHt9KSB7XHJcblx0XHRcdGNvbnN0IGIgICAgICAgPSB0aGlzLmJ1aWxkZXI7XHJcblx0XHRcdGNvbnN0IHBhZ2VfZWwgPSBDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5jcmVhdGVfZWxlbWVudCggJ2RpdicsICd3cGJjX2JmYl9fcGFuZWwgd3BiY19iZmJfX3BhbmVsLS1wcmV2aWV3ICB3cGJjX2JmYl9mb3JtIHdwYmNfY29udGFpbmVyIHdwYmNfZm9ybSB3cGJjX2NvbnRhaW5lcl9ib29raW5nX2Zvcm0nICk7XHJcblx0XHRcdHBhZ2VfZWwuc2V0QXR0cmlidXRlKCAnZGF0YS1wYWdlJywgKytiLnBhZ2VfY291bnRlciApO1xyXG5cclxuXHRcdFx0Ly8gS2VlcCBvbmx5IHRoZSB0aXRsZSBhbmQgdGhlIHNlY3Rpb24gY29udGFpbmVyIHBsYWNlaG9sZGVycyBoZXJlLlxyXG5cdFx0XHRwYWdlX2VsLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwid3BiY19iZmJfX2NvbnRyb2xzXCI+PGgzIGNsYXNzPVwid3BiY19iZmJfX3BhZ2VfbnVtYmVyXCI+UGFnZSAke2IucGFnZV9jb3VudGVyfTwvaDM+PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cIndwYmNfYmZiX19mb3JtX3ByZXZpZXdfc2VjdGlvbl9jb250YWluZXIgd3BiY193aXphcmRfX2JvcmRlcl9jb250YWluZXJcIj48L2Rpdj5cclxuXHRcdFx0ICBgO1xyXG5cclxuXHRcdFx0Y29uc3QgZGVsZXRlX2J0biA9IENvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmNyZWF0ZV9lbGVtZW50KCAnYnV0dG9uJywgJ3dwYmNfYmZiX19maWVsZC1yZW1vdmUtYnRuJywgJzxpIGNsYXNzPVwibWVudV9pY29uIGljb24tMXggd3BiY19pY25fY2xvc2VcIj48L2k+JyApO1xyXG5cdFx0XHRkZWxldGVfYnRuLnR5cGUgID0gJ2J1dHRvbic7XHJcblx0XHRcdGRlbGV0ZV9idG4udGl0bGUgPSAnUmVtb3ZlIHBhZ2UnO1xyXG5cdFx0XHRkZWxldGVfYnRuLnNldEF0dHJpYnV0ZSggJ2FyaWEtbGFiZWwnLCAnUmVtb3ZlIHBhZ2UnICk7XHJcblx0XHRcdGRlbGV0ZV9idG4ub25jbGljayA9ICgpID0+IHtcclxuXHRcdFx0XHRjb25zdCBzZWxlY3RlZCA9IGIuZ2V0X3NlbGVjdGVkX2ZpZWxkPy4oKTtcclxuXHRcdFx0XHRsZXQgbmVpZ2hib3IgICA9IG51bGw7XHJcblx0XHRcdFx0aWYgKCBzZWxlY3RlZCAmJiBwYWdlX2VsLmNvbnRhaW5zKCBzZWxlY3RlZCApICkge1xyXG5cdFx0XHRcdFx0bmVpZ2hib3IgPSBiLnBhZ2VzX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19wYW5lbC0tcHJldmlldzpub3QoW2RhdGEtcGFnZT1cIicgKyBwYWdlX2VsLmdldEF0dHJpYnV0ZSggJ2RhdGEtcGFnZScgKSArICdcIl0pIC53cGJjX2JmYl9fZmllbGQ6bm90KC5pcy1pbnZhbGlkKScgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cGFnZV9lbC5yZW1vdmUoKTtcclxuXHRcdFx0XHRiLnVzYWdlPy51cGRhdGVfcGFsZXR0ZV91aT8uKCk7XHJcblxyXG5cdFx0XHRcdC8vIE5FVzogbm90aWZ5IGxpc3RlbmVycyB0aGF0IHRoZSBvdmVyYWxsIHN0cnVjdHVyZSBjaGFuZ2VkIGR1ZSB0byBwYWdlIHJlbW92YWwuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGNvbnN0IEVWICAgICAgICA9IENvcmUuV1BCQ19CRkJfRXZlbnRzIHx8IHt9O1xyXG5cdFx0XHRcdFx0Y29uc3Qgc3RydWN0dXJlID0gKHR5cGVvZiBiLmdldF9zdHJ1Y3R1cmUgPT09ICdmdW5jdGlvbicpID8gYi5nZXRfc3RydWN0dXJlKCkgOiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdC8vIE1pcnJvciB0aGUgY29yZSBidWlsZGVyIGhlbHBlcjpcclxuXHRcdFx0XHRcdC8vIHRoaXMuX2VtaXRfY29uc3QoIFdQQkNfQkZCX0V2ZW50cy5TVFJVQ1RVUkVfQ0hBTkdFLCB7IHNvdXJjZTogJ3BhZ2UtcmVtb3ZlJywgc3RydWN0dXJlOiAuLi4gfSApO1xyXG5cdFx0XHRcdFx0Yi5idXM/LmVtaXQ/LiggRVYuU1RSVUNUVVJFX0NIQU5HRSwgeyBzb3VyY2U6ICdwYWdlLXJlbW92ZScsIHN0cnVjdHVyZTogc3RydWN0dXJlLCBwYWdlX2VsOiBwYWdlX2VsIH0gKTtcclxuXHRcdFx0XHR9IGNhdGNoICggX2UgKSB7fVxyXG5cclxuXHRcdFx0XHRiLnNlbGVjdF9maWVsZCggbmVpZ2hib3IgfHwgbnVsbCApO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRwYWdlX2VsLnF1ZXJ5U2VsZWN0b3IoICdoMycgKS5hcHBlbmRDaGlsZCggZGVsZXRlX2J0biApO1xyXG5cclxuXHRcdFx0Yi5wYWdlc19jb250YWluZXIuYXBwZW5kQ2hpbGQoIHBhZ2VfZWwgKTtcclxuXHRcdFx0aWYgKCBzY3JvbGwgKSB7XHJcblx0XHRcdFx0cGFnZV9lbC5zY3JvbGxJbnRvVmlldyggeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnc3RhcnQnIH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3Qgc2VjdGlvbl9jb250YWluZXIgICAgICAgICA9IHBhZ2VfZWwucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fZm9ybV9wcmV2aWV3X3NlY3Rpb25fY29udGFpbmVyJyApO1xyXG5cdFx0XHRjb25zdCBzZWN0aW9uX2NvdW50X29uX2FkZF9wYWdlID0gMjtcclxuXHRcdFx0dGhpcy5pbml0X3NlY3Rpb25fc29ydGFibGUoIHNlY3Rpb25fY29udGFpbmVyICk7XHJcblx0XHRcdHRoaXMuYWRkX3NlY3Rpb24oIHNlY3Rpb25fY29udGFpbmVyLCBzZWN0aW9uX2NvdW50X29uX2FkZF9wYWdlICk7XHJcblxyXG5cdFx0XHQvLyBEcm9wZG93biBjb250cm9sIGNsb25lZCBmcm9tIHRoZSBoaWRkZW4gdGVtcGxhdGUuXHJcblx0XHRcdGNvbnN0IGNvbnRyb2xzX2hvc3RfdG9wID0gcGFnZV9lbC5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19jb250cm9scycgKTtcclxuXHRcdFx0Y29uc3QgY3RybF90b3AgICAgICAgICAgPSB0aGlzLl9tYWtlX2FkZF9jb2x1bW5zX2NvbnRyb2woIHBhZ2VfZWwsIHNlY3Rpb25fY29udGFpbmVyLCAndG9wJyApO1xyXG5cdFx0XHRpZiAoIGN0cmxfdG9wICkge1xyXG5cdFx0XHRcdGNvbnRyb2xzX2hvc3RfdG9wLmFwcGVuZENoaWxkKCBjdHJsX3RvcCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEJvdHRvbSBjb250cm9sIGJhciBhZnRlciB0aGUgc2VjdGlvbiBjb250YWluZXIuXHJcblx0XHRcdGNvbnN0IGNvbnRyb2xzX2hvc3RfYm90dG9tID0gQ29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIuY3JlYXRlX2VsZW1lbnQoICdkaXYnLCAnd3BiY19iZmJfX2NvbnRyb2xzIHdwYmNfYmZiX19jb250cm9scy0tYm90dG9tJyApO1xyXG5cdFx0XHRzZWN0aW9uX2NvbnRhaW5lci5hZnRlciggY29udHJvbHNfaG9zdF9ib3R0b20gKTtcclxuXHRcdFx0Y29uc3QgY3RybF9ib3R0b20gPSB0aGlzLl9tYWtlX2FkZF9jb2x1bW5zX2NvbnRyb2woIHBhZ2VfZWwsIHNlY3Rpb25fY29udGFpbmVyLCAnYm90dG9tJyApO1xyXG5cdFx0XHRpZiAoIGN0cmxfYm90dG9tICkge1xyXG5cdFx0XHRcdGNvbnRyb2xzX2hvc3RfYm90dG9tLmFwcGVuZENoaWxkKCBjdHJsX2JvdHRvbSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcGFnZV9lbDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9ICAgICAgY29sc1xyXG5cdFx0ICogQHBhcmFtIHsndG9wJ3wnYm90dG9tJ30gW2luc2VydF9wb3M9J2JvdHRvbSddICAvLyBORVdcclxuXHRcdCAqL1xyXG5cdFx0YWRkX3NlY3Rpb24oY29udGFpbmVyLCBjb2xzLCBpbnNlcnRfcG9zID0gJ2JvdHRvbScpIHtcclxuXHRcdFx0Y29uc3QgYiA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0Y29scyAgICA9IE1hdGgubWF4KCAxLCBwYXJzZUludCggY29scywgMTAgKSB8fCAxICk7XHJcblxyXG5cdFx0XHRjb25zdCBzZWN0aW9uID0gQ29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIuY3JlYXRlX2VsZW1lbnQoICdkaXYnLCAnd3BiY19iZmJfX3NlY3Rpb24nICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1pZCcsIGBzZWN0aW9uLSR7KytiLnNlY3Rpb25fY291bnRlcn0tJHtEYXRlLm5vdygpfWAgKTtcclxuXHRcdFx0c2VjdGlvbi5zZXRBdHRyaWJ1dGUoICdkYXRhLXVpZCcsIGBzLSR7KytiLl91aWRfY291bnRlcn0tJHtEYXRlLm5vdygpfS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoIDM2ICkuc2xpY2UoIDIsIDcgKX1gICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS10eXBlJywgJ3NlY3Rpb24nICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1sYWJlbCcsICdTZWN0aW9uJyApO1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSggJ2RhdGEtY29sdW1ucycsIFN0cmluZyggY29scyApICk7XHJcblx0XHRcdC8vIERvIG5vdCBwZXJzaXN0IG9yIHNlZWQgcGVyLWNvbHVtbiBzdHlsZXMgYnkgZGVmYXVsdCAob3B0LWluIHZpYSBpbnNwZWN0b3IpLlxyXG5cclxuXHRcdFx0Y29uc3Qgcm93ID0gQ29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIuY3JlYXRlX2VsZW1lbnQoICdkaXYnLCAnd3BiY19iZmJfX3JvdyB3cGJjX19yb3cnICk7XHJcblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGNvbHM7IGkrKyApIHtcclxuXHRcdFx0XHRjb25zdCBjb2wgICAgICAgICAgID0gQ29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIuY3JlYXRlX2VsZW1lbnQoICdkaXYnLCAnd3BiY19iZmJfX2NvbHVtbiB3cGJjX19maWVsZCcgKTtcclxuXHRcdFx0XHRjb2wuc3R5bGUuZmxleEJhc2lzID0gKDEwMCAvIGNvbHMpICsgJyUnO1xyXG5cdFx0XHRcdC8vIE5vIGRlZmF1bHQgQ1NTIHZhcnMgaGVyZTsgcmVhbCBjb2x1bW5zIHJlbWFpbiB1bmFmZmVjdGVkIHVudGlsIHVzZXIgYWN0aXZhdGVzIHN0eWxlcy5cclxuXHRcdFx0XHRiLmluaXRfc29ydGFibGU/LiggY29sICk7XHJcblx0XHRcdFx0cm93LmFwcGVuZENoaWxkKCBjb2wgKTtcclxuXHRcdFx0XHRpZiAoIGkgPCBjb2xzIC0gMSApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHJlc2l6ZXIgPSBDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5jcmVhdGVfZWxlbWVudCggJ2RpdicsICd3cGJjX2JmYl9fY29sdW1uLXJlc2l6ZXInICk7XHJcblx0XHRcdFx0XHRyZXNpemVyLmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBiLmluaXRfcmVzaXplX2hhbmRsZXIgKTtcclxuXHRcdFx0XHRcdHJvdy5hcHBlbmRDaGlsZCggcmVzaXplciApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRzZWN0aW9uLmFwcGVuZENoaWxkKCByb3cgKTtcclxuXHRcdFx0Yi5sYXlvdXQuc2V0X2VxdWFsX2Jhc2VzKCByb3csIGIuY29sX2dhcF9wZXJjZW50ICk7XHJcblx0XHRcdGIuYWRkX292ZXJsYXlfdG9vbGJhciggc2VjdGlvbiApO1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSggJ3RhYmluZGV4JywgJzAnICk7XHJcblx0XHRcdHRoaXMuaW5pdF9hbGxfbmVzdGVkX3NvcnRhYmxlcyggc2VjdGlvbiApO1xyXG5cclxuXHRcdFx0Ly8gSW5zZXJ0aW9uIHBvbGljeTogdG9wIHwgYm90dG9tLlxyXG5cdFx0XHRpZiAoIGluc2VydF9wb3MgPT09ICd0b3AnICYmIGNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCApIHtcclxuXHRcdFx0XHRjb250YWluZXIuaW5zZXJ0QmVmb3JlKCBzZWN0aW9uLCBjb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIHNlY3Rpb24gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHNlY3Rpb25fZGF0YVxyXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXHJcblx0XHQgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IFRoZSByZWJ1aWx0IHNlY3Rpb24gZWxlbWVudC5cclxuXHRcdCAqL1xyXG5cdFx0cmVidWlsZF9zZWN0aW9uKHNlY3Rpb25fZGF0YSwgY29udGFpbmVyKSB7XHJcblx0XHRcdGNvbnN0IGIgICAgICAgICA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0Y29uc3QgY29sc19kYXRhID0gQXJyYXkuaXNBcnJheSggc2VjdGlvbl9kYXRhPy5jb2x1bW5zICkgPyBzZWN0aW9uX2RhdGEuY29sdW1ucyA6IFtdO1xyXG5cdFx0XHR0aGlzLmFkZF9zZWN0aW9uKCBjb250YWluZXIsIGNvbHNfZGF0YS5sZW5ndGggfHwgMSApO1xyXG5cdFx0XHRjb25zdCBzZWN0aW9uID0gY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQ7XHJcblx0XHRcdGlmICggIXNlY3Rpb24uZGF0YXNldC51aWQgKSB7XHJcblx0XHRcdFx0c2VjdGlvbi5zZXRBdHRyaWJ1dGUoICdkYXRhLXVpZCcsIGBzLSR7KytiLl91aWRfY291bnRlcn0tJHtEYXRlLm5vdygpfS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoIDM2ICkuc2xpY2UoIDIsIDcgKX1gICk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2VjdGlvbi5zZXRBdHRyaWJ1dGUoICdkYXRhLWlkJywgc2VjdGlvbl9kYXRhPy5pZCB8fCBgc2VjdGlvbi0keysrYi5zZWN0aW9uX2NvdW50ZXJ9LSR7RGF0ZS5ub3coKX1gICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS10eXBlJywgJ3NlY3Rpb24nICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1sYWJlbCcsIHNlY3Rpb25fZGF0YT8ubGFiZWwgfHwgJ1NlY3Rpb24nICk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1jb2x1bW5zJywgU3RyaW5nKCAoc2VjdGlvbl9kYXRhPy5jb2x1bW5zIHx8IFtdKS5sZW5ndGggfHwgMSApICk7XHJcblx0XHRcdC8vIFBlcnNpc3RlZCBhdHRyaWJ1dGVzXHJcblx0XHRcdGlmICggc2VjdGlvbl9kYXRhPy5odG1sX2lkICkge1xyXG5cdFx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1odG1sX2lkJywgU3RyaW5nKCBzZWN0aW9uX2RhdGEuaHRtbF9pZCApICk7XHJcblx0XHRcdFx0Ly8gZ2l2ZSB0aGUgY29udGFpbmVyIGEgcmVhbCBpZCBzbyBhbmNob3JzL0NTUyBjYW4gdGFyZ2V0IGl0XHJcblx0XHRcdFx0c2VjdGlvbi5pZCA9IFN0cmluZyggc2VjdGlvbl9kYXRhLmh0bWxfaWQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTkVXOiByZXN0b3JlIHBlcnNpc3RlZCBwZXItY29sdW1uIHN0eWxlcyAocmF3IEpTT04gc3RyaW5nKS5cclxuXHRcdFx0aWYgKCBzZWN0aW9uX2RhdGE/LmNvbF9zdHlsZXMgIT0gbnVsbCApIHtcclxuXHRcdFx0XHRjb25zdCBqc29uID0gU3RyaW5nKCBzZWN0aW9uX2RhdGEuY29sX3N0eWxlcyApO1xyXG5cdFx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1jb2xfc3R5bGVzJywganNvbiApO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRzZWN0aW9uLmRhdGFzZXQuY29sX3N0eWxlcyA9IGpzb247XHJcblx0XHRcdFx0fSBjYXRjaCAoIF9lICkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyAoTm8gcmVuZGVyX3ByZXZpZXcoKSBjYWxsIGhlcmUgb24gcHVycG9zZTogc2VjdGlvbnPigJkgYnVpbGRlciBET00gdXNlcyAud3BiY19iZmJfX3Jvdy8ud3BiY19iZmJfX2NvbHVtbi4pXHJcblxyXG5cclxuXHRcdFx0aWYgKCBzZWN0aW9uX2RhdGE/LmNzc2NsYXNzICkge1xyXG5cdFx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCAnZGF0YS1jc3NjbGFzcycsIFN0cmluZyggc2VjdGlvbl9kYXRhLmNzc2NsYXNzICkgKTtcclxuXHRcdFx0XHQvLyBrZWVwIGNvcmUgY2xhc3NlcywgdGhlbiBhZGQgY3VzdG9tIGNsYXNzKGVzKVxyXG5cdFx0XHRcdFN0cmluZyggc2VjdGlvbl9kYXRhLmNzc2NsYXNzICkuc3BsaXQoIC9cXHMrLyApLmZpbHRlciggQm9vbGVhbiApLmZvckVhY2goIGNscyA9PiBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoIGNscyApICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJvdyA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fcm93JyApO1xyXG5cdFx0XHQvLyBEZWxlZ2F0ZSBwYXJzaW5nICsgYWN0aXZhdGlvbiArIGFwcGxpY2F0aW9uIHRvIHRoZSBDb2x1bW4gU3R5bGVzIHNlcnZpY2UuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Y29uc3QganNvbiA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCAnZGF0YS1jb2xfc3R5bGVzJyApXHJcblx0XHRcdFx0XHR8fCAoc2VjdGlvbi5kYXRhc2V0ID8gKHNlY3Rpb24uZGF0YXNldC5jb2xfc3R5bGVzIHx8ICcnKSA6ICcnKTtcclxuXHRcdFx0XHRjb25zdCBhcnIgID0gVUkuV1BCQ19CRkJfQ29sdW1uX1N0eWxlcy5wYXJzZV9jb2xfc3R5bGVzKCBqc29uICk7XHJcblx0XHRcdFx0VUkuV1BCQ19CRkJfQ29sdW1uX1N0eWxlcy5hcHBseSggc2VjdGlvbiwgYXJyICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29sc19kYXRhLmZvckVhY2goIChjb2xfZGF0YSwgaW5kZXgpID0+IHtcclxuXHRcdFx0XHRjb25zdCBjb2x1bW5zX29ubHkgID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoICc6c2NvcGUgPiAud3BiY19iZmJfX2NvbHVtbicgKTtcclxuXHRcdFx0XHRjb25zdCBjb2wgICAgICAgICAgID0gY29sdW1uc19vbmx5W2luZGV4XTtcclxuXHRcdFx0XHRjb2wuc3R5bGUuZmxleEJhc2lzID0gY29sX2RhdGEud2lkdGggfHwgJzEwMCUnO1xyXG5cdFx0XHRcdChjb2xfZGF0YS5pdGVtcyB8fCBbXSkuZm9yRWFjaCggKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGlmICggIWl0ZW0gfHwgIWl0ZW0udHlwZSApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBpdGVtLnR5cGUgPT09ICdmaWVsZCcgKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGVsID0gYi5idWlsZF9maWVsZCggaXRlbS5kYXRhICk7XHJcblx0XHRcdFx0XHRcdGlmICggZWwgKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29sLmFwcGVuZENoaWxkKCBlbCApO1xyXG5cdFx0XHRcdFx0XHRcdGIudHJpZ2dlcl9maWVsZF9kcm9wX2NhbGxiYWNrKCBlbCwgJ2xvYWQnICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBpdGVtLnR5cGUgPT09ICdzZWN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZWJ1aWxkX3NlY3Rpb24oIGl0ZW0uZGF0YSwgY29sICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gYi5sYXlvdXQuY29tcHV0ZV9lZmZlY3RpdmVfYmFzZXNfZnJvbV9yb3coIHJvdywgYi5jb2xfZ2FwX3BlcmNlbnQgKTtcclxuXHRcdFx0Yi5sYXlvdXQuYXBwbHlfYmFzZXNfdG9fcm93KCByb3csIGNvbXB1dGVkLmJhc2VzICk7XHJcblx0XHRcdHRoaXMuaW5pdF9hbGxfbmVzdGVkX3NvcnRhYmxlcyggc2VjdGlvbiApO1xyXG5cclxuXHRcdFx0Ly8gTkVXOiByZXRhZyBVSURzIGZpcnN0IChzbyB1bmlxdWVuZXNzIGNoZWNrcyBkb24ndCBleGNsdWRlIG9yaWdpbmFscyksIHRoZW4gZGVkdXBlIGFsbCBrZXlzLlxyXG5cdFx0XHR0aGlzLl9yZXRhZ191aWRzX2luX3N1YnRyZWUoIHNlY3Rpb24gKTtcclxuXHRcdFx0dGhpcy5fZGVkdXBlX3N1YnRyZWVfc3RyaWN0KCBzZWN0aW9uICk7XHJcblx0XHRcdHJldHVybiBzZWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgKi9cclxuXHRcdGluaXRfYWxsX25lc3RlZF9zb3J0YWJsZXMoY29udGFpbmVyKSB7XHJcblx0XHRcdGNvbnN0IGIgPSB0aGlzLmJ1aWxkZXI7XHJcblx0XHRcdGlmICggY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19mb3JtX3ByZXZpZXdfc2VjdGlvbl9jb250YWluZXInICkgKSB7XHJcblx0XHRcdFx0dGhpcy5pbml0X3NlY3Rpb25fc29ydGFibGUoIGNvbnRhaW5lciApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19zZWN0aW9uJyApLmZvckVhY2goIChzZWN0aW9uKSA9PiB7XHJcblx0XHRcdFx0c2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19jb2x1bW4nICkuZm9yRWFjaCggKGNvbCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5pbml0X3NlY3Rpb25fc29ydGFibGUoIGNvbCApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgKi9cclxuXHRcdGluaXRfc2VjdGlvbl9zb3J0YWJsZShjb250YWluZXIpIHtcclxuXHRcdFx0Y29uc3QgYiA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0aWYgKCAhY29udGFpbmVyICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBpc19jb2x1bW4gICAgPSBjb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX2NvbHVtbicgKTtcclxuXHRcdFx0Y29uc3QgaXNfdG9wX2xldmVsID0gY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19mb3JtX3ByZXZpZXdfc2VjdGlvbl9jb250YWluZXInICk7XHJcblx0XHRcdGlmICggIWlzX2NvbHVtbiAmJiAhaXNfdG9wX2xldmVsICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRiLmluaXRfc29ydGFibGU/LiggY29udGFpbmVyICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU2VyaWFsaXphdGlvbiBhbmQgZGVzZXJpYWxpemF0aW9uIG9mIHBhZ2VzL3NlY3Rpb25zL2ZpZWxkcy5cclxuXHQgKi9cclxuXHRVSS5XUEJDX0JGQl9TdHJ1Y3R1cmVfSU8gPSBjbGFzcyBleHRlbmRzIFVJLldQQkNfQkZCX01vZHVsZSB7XHJcblx0XHRpbml0KCkge1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIuZ2V0X3N0cnVjdHVyZSAgICAgICAgPSAoKSA9PiB0aGlzLnNlcmlhbGl6ZSgpO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIubG9hZF9zYXZlZF9zdHJ1Y3R1cmUgPSAocywgb3B0cykgPT4gdGhpcy5kZXNlcmlhbGl6ZSggcywgb3B0cyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBAcmV0dXJucyB7QXJyYXl9ICovXHJcblx0XHRzZXJpYWxpemUoKSB7XHJcblx0XHRcdGNvbnN0IGIgPSB0aGlzLmJ1aWxkZXI7XHJcblx0XHRcdHRoaXMuX25vcm1hbGl6ZV9pZHMoKTtcclxuXHRcdFx0dGhpcy5fbm9ybWFsaXplX25hbWVzKCk7XHJcblx0XHRcdGNvbnN0IHBhZ2VzID0gW107XHJcblx0XHRcdGIucGFnZXNfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcud3BiY19iZmJfX3BhbmVsLS1wcmV2aWV3JyApLmZvckVhY2goIChwYWdlX2VsLCBwYWdlX2luZGV4KSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgY29udGFpbmVyID0gcGFnZV9lbC5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19mb3JtX3ByZXZpZXdfc2VjdGlvbl9jb250YWluZXInICk7XHJcblx0XHRcdFx0Y29uc3QgY29udGVudCAgID0gW107XHJcblx0XHRcdFx0aWYgKCAhY29udGFpbmVyICkge1xyXG5cdFx0XHRcdFx0cGFnZXMucHVzaCggeyBwYWdlOiBwYWdlX2luZGV4ICsgMSwgY29udGVudCB9ICk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gKicgKS5mb3JFYWNoKCAoY2hpbGQpID0+IHtcclxuXHRcdFx0XHRcdGlmICggY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX3NlY3Rpb24nICkgKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQucHVzaCggeyB0eXBlOiAnc2VjdGlvbicsIGRhdGE6IHRoaXMuc2VyaWFsaXplX3NlY3Rpb24oIGNoaWxkICkgfSApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19maWVsZCcgKSApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoICdpcy1pbnZhbGlkJyApICkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjb25zdCBmX2RhdGEgPSBDb3JlLldQQkNfRm9ybV9CdWlsZGVyX0hlbHBlci5nZXRfYWxsX2RhdGFfYXR0cmlidXRlcyggY2hpbGQgKTtcclxuXHRcdFx0XHRcdFx0Ly8gRHJvcCBlcGhlbWVyYWwvZWRpdG9yLW9ubHkgZmxhZ3NcclxuXHRcdFx0XHRcdFx0WyAndWlkJywgJ2ZyZXNoJywgJ2F1dG9uYW1lJywgJ3dhc19sb2FkZWQnLCAnbmFtZV91c2VyX3RvdWNoZWQnIF1cclxuXHRcdFx0XHRcdFx0XHQuZm9yRWFjaCggayA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGsgaW4gZl9kYXRhICkgZGVsZXRlIGZfZGF0YVtrXTtcclxuXHRcdFx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQucHVzaCggeyB0eXBlOiAnZmllbGQnLCBkYXRhOiBmX2RhdGEgfSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRwYWdlcy5wdXNoKCB7IHBhZ2U6IHBhZ2VfaW5kZXggKyAxLCBjb250ZW50IH0gKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0XHRyZXR1cm4gcGFnZXM7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWN0aW9uX2VsXHJcblx0XHQgKiBAcmV0dXJucyB7e2lkOnN0cmluZyxsYWJlbDpzdHJpbmcsaHRtbF9pZDpzdHJpbmcsY3NzY2xhc3M6c3RyaW5nLGNvbF9zdHlsZXM6c3RyaW5nLGNvbHVtbnM6QXJyYXl9fVxyXG5cdFx0ICovXHJcblx0XHRzZXJpYWxpemVfc2VjdGlvbihzZWN0aW9uX2VsKSB7XHJcblx0XHRcdGNvbnN0IHJvdyA9IHNlY3Rpb25fZWwucXVlcnlTZWxlY3RvciggJzpzY29wZSA+IC53cGJjX2JmYl9fcm93JyApO1xyXG5cclxuXHRcdFx0Ly8gTkVXOiByZWFkIHBlci1jb2x1bW4gc3R5bGVzIGZyb20gZGF0YXNldC9hdHRyaWJ1dGVzICh1bmRlcnNjb3JlICYgaHlwaGVuKVxyXG5cdFx0XHR2YXIgY29sX3N0eWxlc19yYXcgPVxyXG5cdFx0XHRcdFx0c2VjdGlvbl9lbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbF9zdHlsZXMnICkgfHxcclxuXHRcdFx0XHRcdChzZWN0aW9uX2VsLmRhdGFzZXQgPyAoc2VjdGlvbl9lbC5kYXRhc2V0LmNvbF9zdHlsZXMpIDogJycpIHx8XHJcblx0XHRcdFx0XHQnJztcclxuXHJcblx0XHRcdGNvbnN0IGJhc2UgPSB7XHJcblx0XHRcdFx0aWQgICAgICAgIDogc2VjdGlvbl9lbC5kYXRhc2V0LmlkLFxyXG5cdFx0XHRcdGxhYmVsICAgICA6IHNlY3Rpb25fZWwuZGF0YXNldC5sYWJlbCB8fCAnJyxcclxuXHRcdFx0XHRodG1sX2lkICAgOiBzZWN0aW9uX2VsLmRhdGFzZXQuaHRtbF9pZCB8fCAnJyxcclxuXHRcdFx0XHRjc3NjbGFzcyAgOiBzZWN0aW9uX2VsLmRhdGFzZXQuY3NzY2xhc3MgfHwgJycsXHJcblx0XHRcdFx0Y29sX3N0eWxlczogU3RyaW5nKCBjb2xfc3R5bGVzX3JhdyApICAgICAgICAvLyA8LS0gTkVXOiBrZWVwIGFzIHJhdyBKU09OIHN0cmluZ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCAhcm93ICkge1xyXG5cdFx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKCB7fSwgYmFzZSwgeyBjb2x1bW5zOiBbXSB9ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNvbHVtbnMgPSBbXTtcclxuXHRcdFx0cm93LnF1ZXJ5U2VsZWN0b3JBbGwoICc6c2NvcGUgPiAud3BiY19iZmJfX2NvbHVtbicgKS5mb3JFYWNoKCBmdW5jdGlvbiAoY29sKSB7XHJcblx0XHRcdFx0Y29uc3Qgd2lkdGggPSBjb2wuc3R5bGUuZmxleEJhc2lzIHx8ICcxMDAlJztcclxuXHRcdFx0XHRjb25zdCBpdGVtcyA9IFtdO1xyXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoIGNvbC5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XHJcblx0XHRcdFx0XHRpZiAoIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApICkge1xyXG5cdFx0XHRcdFx0XHRpdGVtcy5wdXNoKCB7IHR5cGU6ICdzZWN0aW9uJywgZGF0YTogdGhpcy5zZXJpYWxpemVfc2VjdGlvbiggY2hpbGQgKSB9ICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICggY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX2ZpZWxkJyApICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyggJ2lzLWludmFsaWQnICkgKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNvbnN0IGZfZGF0YSA9IENvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmdldF9hbGxfZGF0YV9hdHRyaWJ1dGVzKCBjaGlsZCApO1xyXG5cdFx0XHRcdFx0XHRbICd1aWQnLCAnZnJlc2gnLCAnYXV0b25hbWUnLCAnd2FzX2xvYWRlZCcsICduYW1lX3VzZXJfdG91Y2hlZCcgXS5mb3JFYWNoKCBmdW5jdGlvbiAoaykge1xyXG5cdFx0XHRcdFx0XHRcdGlmICggayBpbiBmX2RhdGEgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgZl9kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdFx0XHRpdGVtcy5wdXNoKCB7IHR5cGU6ICdmaWVsZCcsIGRhdGE6IGZfZGF0YSB9ICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fS5iaW5kKCB0aGlzICkgKTtcclxuXHRcdFx0XHRjb2x1bW5zLnB1c2goIHsgd2lkdGg6IHdpZHRoLCBpdGVtczogaXRlbXMgfSApO1xyXG5cdFx0XHR9LmJpbmQoIHRoaXMgKSApO1xyXG5cclxuXHRcdFx0Ly8gQ2xhbXAgcGVyc2lzdGVkIGNvbF9zdHlsZXMgdG8gdGhlIGFjdHVhbCBudW1iZXIgb2YgY29sdW1ucyBvbiBTYXZlLlxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGNvbnN0IGNvbENvdW50ID0gY29sdW1ucy5sZW5ndGg7XHJcblx0XHRcdFx0Y29uc3QgcmF3ICAgICAgPSBTdHJpbmcoIGNvbF9zdHlsZXNfcmF3IHx8ICcnICkudHJpbSgpO1xyXG5cclxuXHRcdFx0XHRpZiAoIHJhdyApIHtcclxuXHRcdFx0XHRcdGxldCBhcnIgPSBbXTtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoIHJhdyApO1xyXG5cdFx0XHRcdFx0XHRhcnIgICAgICAgICAgPSBBcnJheS5pc0FycmF5KCBwYXJzZWQgKSA/IHBhcnNlZCA6IChwYXJzZWQgJiYgQXJyYXkuaXNBcnJheSggcGFyc2VkLmNvbHVtbnMgKSA/IHBhcnNlZC5jb2x1bW5zIDogW10pO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoIF9lICkge1xyXG5cdFx0XHRcdFx0XHRhcnIgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIGNvbENvdW50IDw9IDAgKSB7XHJcblx0XHRcdFx0XHRcdGJhc2UuY29sX3N0eWxlcyA9ICdbXSc7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoIGFyci5sZW5ndGggPiBjb2xDb3VudCApIGFyci5sZW5ndGggPSBjb2xDb3VudDtcclxuXHRcdFx0XHRcdFx0d2hpbGUgKCBhcnIubGVuZ3RoIDwgY29sQ291bnQgKSBhcnIucHVzaCgge30gKTtcclxuXHRcdFx0XHRcdFx0YmFzZS5jb2xfc3R5bGVzID0gSlNPTi5zdHJpbmdpZnkoIGFyciApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRiYXNlLmNvbF9zdHlsZXMgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oIHt9LCBiYXNlLCB7IGNvbHVtbnM6IGNvbHVtbnMgfSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gc3RydWN0dXJlXHJcblx0XHQgKiBAcGFyYW0ge3tkZWZlcklmVHlwaW5nPzogYm9vbGVhbn19IFtvcHRzID0ge31dXHJcblx0XHQgKi9cclxuXHRcdGRlc2VyaWFsaXplKHN0cnVjdHVyZSwgeyBkZWZlcklmVHlwaW5nID0gdHJ1ZSB9ID0ge30pIHtcclxuXHRcdFx0Y29uc3QgYiA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0aWYgKCBkZWZlcklmVHlwaW5nICYmIHRoaXMuX2lzX3R5cGluZ19pbl9pbnNwZWN0b3IoKSApIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRoaXMuX2RlZmVyX3RpbWVyICk7XHJcblx0XHRcdFx0dGhpcy5fZGVmZXJfdGltZXIgPSBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmRlc2VyaWFsaXplKCBzdHJ1Y3R1cmUsIHsgZGVmZXJJZlR5cGluZzogZmFsc2UgfSApO1xyXG5cdFx0XHRcdH0sIDE1MCApO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRiLnBhZ2VzX2NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0Yi5wYWdlX2NvdW50ZXIgICAgICAgICAgICAgID0gMDtcclxuXHRcdFx0KHN0cnVjdHVyZSB8fCBbXSkuZm9yRWFjaCggKHBhZ2VfZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHBhZ2VfZWwgICAgICAgICAgICAgICA9IGIucGFnZXNfc2VjdGlvbnMuYWRkX3BhZ2UoIHsgc2Nyb2xsOiBmYWxzZSB9ICk7XHJcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbl9jb250YWluZXIgICAgID0gcGFnZV9lbC5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19mb3JtX3ByZXZpZXdfc2VjdGlvbl9jb250YWluZXInICk7XHJcblx0XHRcdFx0c2VjdGlvbl9jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdFx0Yi5pbml0X3NlY3Rpb25fc29ydGFibGU/Liggc2VjdGlvbl9jb250YWluZXIgKTtcclxuXHRcdFx0XHQocGFnZV9kYXRhLmNvbnRlbnQgfHwgW10pLmZvckVhY2goIChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIGl0ZW0udHlwZSA9PT0gJ3NlY3Rpb24nICkge1xyXG5cdFx0XHRcdFx0XHQvLyBOb3cgcmV0dXJucyB0aGUgZWxlbWVudDsgYXR0cmlidXRlcyAoaW5jbC4gY29sX3N0eWxlcykgYXJlIGFwcGxpZWQgaW5zaWRlIHJlYnVpbGQuXHJcblx0XHRcdFx0XHRcdGIucGFnZXNfc2VjdGlvbnMucmVidWlsZF9zZWN0aW9uKCBpdGVtLmRhdGEsIHNlY3Rpb25fY29udGFpbmVyICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICggaXRlbS50eXBlID09PSAnZmllbGQnICkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBlbCA9IGIuYnVpbGRfZmllbGQoIGl0ZW0uZGF0YSApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIGVsICkge1xyXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25fY29udGFpbmVyLmFwcGVuZENoaWxkKCBlbCApO1xyXG5cdFx0XHRcdFx0XHRcdGIudHJpZ2dlcl9maWVsZF9kcm9wX2NhbGxiYWNrKCBlbCwgJ2xvYWQnICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0Yi51c2FnZT8udXBkYXRlX3BhbGV0dGVfdWk/LigpO1xyXG5cdFx0XHRiLmJ1cy5lbWl0KCBDb3JlLldQQkNfQkZCX0V2ZW50cy5TVFJVQ1RVUkVfTE9BREVELCB7IHN0cnVjdHVyZSB9ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0X25vcm1hbGl6ZV9pZHMoKSB7XHJcblx0XHRcdGNvbnN0IGIgPSB0aGlzLmJ1aWxkZXI7XHJcblx0XHRcdGIucGFnZXNfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcud3BiY19iZmJfX3BhbmVsLS1wcmV2aWV3IC53cGJjX2JmYl9fZmllbGQ6bm90KC5pcy1pbnZhbGlkKScgKS5mb3JFYWNoKCAoZWwpID0+IHtcclxuXHRcdFx0XHRjb25zdCBkYXRhID0gQ29yZS5XUEJDX0Zvcm1fQnVpbGRlcl9IZWxwZXIuZ2V0X2FsbF9kYXRhX2F0dHJpYnV0ZXMoIGVsICk7XHJcblx0XHRcdFx0Y29uc3Qgd2FudCA9IENvcmUuV1BCQ19CRkJfU2FuaXRpemUuc2FuaXRpemVfaHRtbF9pZCggZGF0YS5pZCB8fCAnJyApIHx8ICdmaWVsZCc7XHJcblx0XHRcdFx0Y29uc3QgdW5pcSA9IGIuaWQuZW5zdXJlX3VuaXF1ZV9maWVsZF9pZCggd2FudCwgZWwgKTtcclxuXHRcdFx0XHRpZiAoIGRhdGEuaWQgIT09IHVuaXEgKSB7XHJcblx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdkYXRhLWlkJywgdW5pcSApO1xyXG5cdFx0XHRcdFx0aWYgKCBiLnByZXZpZXdfbW9kZSApIHtcclxuXHRcdFx0XHRcdFx0Yi5yZW5kZXJfcHJldmlldyggZWwgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHRfbm9ybWFsaXplX25hbWVzKCkge1xyXG5cdFx0XHRjb25zdCBiID0gdGhpcy5idWlsZGVyO1xyXG5cdFx0XHRiLnBhZ2VzX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19wYW5lbC0tcHJldmlldyAud3BiY19iZmJfX2ZpZWxkOm5vdCguaXMtaW52YWxpZCknICkuZm9yRWFjaCggKGVsKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgZGF0YSA9IENvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmdldF9hbGxfZGF0YV9hdHRyaWJ1dGVzKCBlbCApO1xyXG5cdFx0XHRcdGNvbnN0IGJhc2UgPSBDb3JlLldQQkNfQkZCX1Nhbml0aXplLnNhbml0aXplX2h0bWxfbmFtZSggKGRhdGEubmFtZSAhPSBudWxsKSA/IGRhdGEubmFtZSA6IGRhdGEuaWQgKSB8fCAnZmllbGQnO1xyXG5cdFx0XHRcdGNvbnN0IHVuaXEgPSBiLmlkLmVuc3VyZV91bmlxdWVfZmllbGRfbmFtZSggYmFzZSwgZWwgKTtcclxuXHRcdFx0XHRpZiAoIGRhdGEubmFtZSAhPT0gdW5pcSApIHtcclxuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ2RhdGEtbmFtZScsIHVuaXEgKTtcclxuXHRcdFx0XHRcdGlmICggYi5wcmV2aWV3X21vZGUgKSB7XHJcblx0XHRcdFx0XHRcdGIucmVuZGVyX3ByZXZpZXcoIGVsICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqIEByZXR1cm5zIHtib29sZWFufSAqL1xyXG5cdFx0X2lzX3R5cGluZ19pbl9pbnNwZWN0b3IoKSB7XHJcblx0XHRcdGNvbnN0IGlucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnd3BiY19iZmJfX2luc3BlY3RvcicgKTtcclxuXHRcdFx0cmV0dXJuICEhKGlucyAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGlucy5jb250YWlucyggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCApKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBNaW5pbWFsLCBzdGFuZGFsb25lIGd1YXJkIHRoYXQgZW5mb3JjZXMgcGVyLWNvbHVtbiBtaW4gd2lkdGhzIGJhc2VkIG9uIGZpZWxkcycgZGF0YS1taW5fd2lkdGguXHJcblx0ICpcclxuXHQgKiBAdHlwZSB7VUkuV1BCQ19CRkJfTWluX1dpZHRoX0d1YXJkfVxyXG5cdCAqL1xyXG5cdFVJLldQQkNfQkZCX01pbl9XaWR0aF9HdWFyZCA9IGNsYXNzIGV4dGVuZHMgVUkuV1BCQ19CRkJfTW9kdWxlIHtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihidWlsZGVyKSB7XHJcblx0XHRcdHN1cGVyKCBidWlsZGVyICk7XHJcblx0XHRcdHRoaXMuX29uX2ZpZWxkX2FkZCAgICAgICAgPSB0aGlzLl9vbl9maWVsZF9hZGQuYmluZCggdGhpcyApO1xyXG5cdFx0XHR0aGlzLl9vbl9maWVsZF9yZW1vdmUgICAgID0gdGhpcy5fb25fZmllbGRfcmVtb3ZlLmJpbmQoIHRoaXMgKTtcclxuXHRcdFx0dGhpcy5fb25fc3RydWN0dXJlX2xvYWRlZCA9IHRoaXMuX29uX3N0cnVjdHVyZV9sb2FkZWQuYmluZCggdGhpcyApO1xyXG5cdFx0XHR0aGlzLl9vbl93aW5kb3dfcmVzaXplICAgID0gdGhpcy5fb25fd2luZG93X3Jlc2l6ZS5iaW5kKCB0aGlzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aW5pdCgpIHtcclxuXHRcdFx0Y29uc3QgRVYgPSBDb3JlLldQQkNfQkZCX0V2ZW50cztcclxuXHRcdFx0dGhpcy5idWlsZGVyPy5idXM/Lm9uPy4oIEVWLkZJRUxEX0FERCwgdGhpcy5fb25fZmllbGRfYWRkICk7XHJcblx0XHRcdHRoaXMuYnVpbGRlcj8uYnVzPy5vbj8uKCBFVi5GSUVMRF9SRU1PVkUsIHRoaXMuX29uX2ZpZWxkX3JlbW92ZSApO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXI/LmJ1cz8ub24/LiggRVYuU1RSVUNUVVJFX0xPQURFRCwgdGhpcy5fb25fc3RydWN0dXJlX2xvYWRlZCApO1xyXG5cdFx0XHQvLyBBbHNvIHJlZnJlc2ggd2hlbiBjb2x1bW5zIGFyZSBjaGFuZ2VkIC8gc2VjdGlvbnMgZHVwbGljYXRlZCwgZXRjLlxyXG5cdFx0XHR0aGlzLmJ1aWxkZXI/LmJ1cz8ub24/LiggRVYuU1RSVUNUVVJFX0NIQU5HRSwgdGhpcy5fb25fc3RydWN0dXJlX2xvYWRlZCApO1xyXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMuX29uX3dpbmRvd19yZXNpemUsIHsgcGFzc2l2ZTogdHJ1ZSB9ICk7XHJcblx0XHRcdHRoaXMucmVmcmVzaF9hbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZXN0cm95KCkge1xyXG5cdFx0XHRjb25zdCBFViA9IENvcmUuV1BCQ19CRkJfRXZlbnRzO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXI/LmJ1cz8ub2ZmPy4oIEVWLkZJRUxEX0FERCwgdGhpcy5fb25fZmllbGRfYWRkICk7XHJcblx0XHRcdHRoaXMuYnVpbGRlcj8uYnVzPy5vZmY/LiggRVYuRklFTERfUkVNT1ZFLCB0aGlzLl9vbl9maWVsZF9yZW1vdmUgKTtcclxuXHRcdFx0dGhpcy5idWlsZGVyPy5idXM/Lm9mZj8uKCBFVi5TVFJVQ1RVUkVfTE9BREVELCB0aGlzLl9vbl9zdHJ1Y3R1cmVfbG9hZGVkICk7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAncmVzaXplJywgdGhpcy5fb25fd2luZG93X3Jlc2l6ZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9vbl9maWVsZF9hZGQoZSkge1xyXG5cdFx0XHQvLyBzYWZlICsgc2ltcGxlOiBtb3ZpbmcgYmV0d2VlbiBjb2x1bW5zIHVwZGF0ZXMgYm90aCByb3dzXHJcblx0XHRcdHRoaXMucmVmcmVzaF9hbGwoKTtcclxuXHRcdFx0Ly8gaWYgeW91IHJlYWxseSB3YW50IHRvIGJlIG1pbmltYWwgd29yayBoZXJlLCBrZWVwIHlvdXIgcm93LW9ubHkgdmVyc2lvbi5cclxuXHRcdH1cclxuXHJcblx0XHRfb25fZmllbGRfcmVtb3ZlKGUpIHtcclxuXHRcdFx0Y29uc3Qgc3JjX2VsID0gZT8uZGV0YWlsPy5lbCB8fCBudWxsO1xyXG5cdFx0XHRjb25zdCByb3cgICAgPSAoc3JjX2VsICYmIHNyY19lbC5jbG9zZXN0KSA/IHNyY19lbC5jbG9zZXN0KCAnLndwYmNfYmZiX19yb3cnICkgOiBudWxsO1xyXG5cdFx0XHRpZiAoIHJvdyApIHRoaXMucmVmcmVzaF9yb3coIHJvdyApOyBlbHNlIHRoaXMucmVmcmVzaF9hbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHRfb25fc3RydWN0dXJlX2xvYWRlZCgpIHtcclxuXHRcdFx0dGhpcy5yZWZyZXNoX2FsbCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9vbl93aW5kb3dfcmVzaXplKCkge1xyXG5cdFx0XHR0aGlzLnJlZnJlc2hfYWxsKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVmcmVzaF9hbGwoKSB7XHJcblx0XHRcdHRoaXMuYnVpbGRlcj8ucGFnZXNfY29udGFpbmVyXHJcblx0XHRcdFx0Py5xdWVyeVNlbGVjdG9yQWxsPy4oICcud3BiY19iZmJfX3JvdycgKVxyXG5cdFx0XHRcdD8uZm9yRWFjaD8uKCAocm93KSA9PiB0aGlzLnJlZnJlc2hfcm93KCByb3cgKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlZnJlc2hfcm93KHJvd19lbCkge1xyXG5cdFx0XHRpZiAoICFyb3dfZWwgKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBjb2xzID0gcm93X2VsLnF1ZXJ5U2VsZWN0b3JBbGwoICc6c2NvcGUgPiAud3BiY19iZmJfX2NvbHVtbicgKTtcclxuXHJcblx0XHRcdC8vIDEpIFJlY2FsY3VsYXRlIGVhY2ggY29sdW1u4oCZcyByZXF1aXJlZCBtaW4gcHggYW5kIHdyaXRlIGl0IHRvIHRoZSBDU1MgdmFyLlxyXG5cdFx0XHRjb2xzLmZvckVhY2goIChjb2wpID0+IHRoaXMuYXBwbHlfY29sX21pbiggY29sICkgKTtcclxuXHJcblx0XHRcdC8vIDIpIEVuZm9yY2UgaXQgYXQgdGhlIENTUyBsZXZlbCByaWdodCBhd2F5IHNvIGxheW91dCBjYW7igJl0IHJlbmRlciBuYXJyb3dlci5cclxuXHRcdFx0Y29scy5mb3JFYWNoKCAoY29sKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgcHggICAgICAgICAgID0gcGFyc2VGbG9hdCggZ2V0Q29tcHV0ZWRTdHlsZSggY29sICkuZ2V0UHJvcGVydHlWYWx1ZSggJy0td3BiYy1jb2wtbWluJyApIHx8ICcwJyApIHx8IDA7XHJcblx0XHRcdFx0Y29sLnN0eWxlLm1pbldpZHRoID0gcHggPiAwID8gTWF0aC5yb3VuZCggcHggKSArICdweCcgOiAnJztcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0Ly8gMykgTm9ybWFsaXplIGN1cnJlbnQgYmFzZXMgc28gdGhlIHJvdyByZXNwZWN0cyBhbGwgbWlucyB3aXRob3V0IG92ZXJmbG93LlxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGNvbnN0IGIgICA9IHRoaXMuYnVpbGRlcjtcclxuXHRcdFx0XHRjb25zdCBncCAgPSBiLmNvbF9nYXBfcGVyY2VudDtcclxuXHRcdFx0XHRjb25zdCBlZmYgPSBiLmxheW91dC5jb21wdXRlX2VmZmVjdGl2ZV9iYXNlc19mcm9tX3Jvdyggcm93X2VsLCBncCApOyAgLy8geyBiYXNlcywgYXZhaWxhYmxlIH1cclxuXHRcdFx0XHQvLyBSZS1maXQgKmN1cnJlbnQqIGJhc2VzIGFnYWluc3QgbWlucyAoc2FtZSBhbGdvcml0aG0gbGF5b3V0IGNoaXBzIHVzZSkuXHJcblx0XHRcdFx0Y29uc3QgZml0dGVkID0gVUkuV1BCQ19CRkJfTGF5b3V0X0NoaXBzLl9maXRfd2VpZ2h0c19yZXNwZWN0aW5nX21pbiggYiwgcm93X2VsLCBlZmYuYmFzZXMgKTtcclxuXHRcdFx0XHRpZiAoIEFycmF5LmlzQXJyYXkoIGZpdHRlZCApICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY2hhbmdlZCA9IGZpdHRlZC5zb21lKCAodiwgaSkgPT4gTWF0aC5hYnMoIHYgLSBlZmYuYmFzZXNbaV0gKSA+IDAuMDEgKTtcclxuXHRcdFx0XHRcdGlmICggY2hhbmdlZCApIHtcclxuXHRcdFx0XHRcdFx0Yi5sYXlvdXQuYXBwbHlfYmFzZXNfdG9fcm93KCByb3dfZWwsIGZpdHRlZCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XHJcblx0XHRcdFx0dy5fd3BiYz8uZGV2Py5lcnJvcj8uKCAnV1BCQ19CRkJfTWluX1dpZHRoX0d1YXJkIC0gcmVmcmVzaF9yb3cnLCBlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRhcHBseV9jb2xfbWluKGNvbF9lbCkge1xyXG5cdFx0XHRpZiAoICFjb2xfZWwgKSByZXR1cm47XHJcblx0XHRcdGxldCBtYXhfcHggICAgPSAwO1xyXG5cdFx0XHRjb25zdCBjb2xSZWN0ID0gY29sX2VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRjb2xfZWwucXVlcnlTZWxlY3RvckFsbCggJzpzY29wZSA+IC53cGJjX2JmYl9fZmllbGQnICkuZm9yRWFjaCggKGZpZWxkKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgcmF3ID0gZmllbGQuZ2V0QXR0cmlidXRlKCAnZGF0YS1taW5fd2lkdGgnICk7XHJcblx0XHRcdFx0bGV0IHB4ICAgID0gMDtcclxuXHRcdFx0XHRpZiAoIHJhdyApIHtcclxuXHRcdFx0XHRcdGNvbnN0IHMgPSBTdHJpbmcoIHJhdyApLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdFx0aWYgKCBzLmVuZHNXaXRoKCAnJScgKSApIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgbiA9IHBhcnNlRmxvYXQoIHMgKTtcclxuXHRcdFx0XHRcdFx0aWYgKCBOdW1iZXIuaXNGaW5pdGUoIG4gKSAmJiBjb2xSZWN0LndpZHRoID4gMCApIHtcclxuXHRcdFx0XHRcdFx0XHRweCA9IChuIC8gMTAwKSAqIGNvbFJlY3Qud2lkdGg7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cHggPSAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRweCA9IHRoaXMucGFyc2VfbGVuX3B4KCBzICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZSggZmllbGQgKTtcclxuXHRcdFx0XHRcdHB4ICAgICAgID0gcGFyc2VGbG9hdCggY3MubWluV2lkdGggfHwgJzAnICkgfHwgMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCBweCA+IG1heF9weCApIG1heF9weCA9IHB4O1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdGNvbF9lbC5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3BiYy1jb2wtbWluJywgbWF4X3B4ID4gMCA/IE1hdGgucm91bmQoIG1heF9weCApICsgJ3B4JyA6ICcwcHgnICk7XHJcblx0XHR9XHJcblxyXG5cdFx0cGFyc2VfbGVuX3B4KHZhbHVlKSB7XHJcblx0XHRcdGlmICggdmFsdWUgPT0gbnVsbCApIHJldHVybiAwO1xyXG5cdFx0XHRjb25zdCBzID0gU3RyaW5nKCB2YWx1ZSApLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRpZiAoIHMgPT09ICcnICkgcmV0dXJuIDA7XHJcblx0XHRcdGlmICggcy5lbmRzV2l0aCggJ3B4JyApICkge1xyXG5cdFx0XHRcdGNvbnN0IG4gPSBwYXJzZUZsb2F0KCBzICk7XHJcblx0XHRcdFx0cmV0dXJuIE51bWJlci5pc0Zpbml0ZSggbiApID8gbiA6IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBzLmVuZHNXaXRoKCAncmVtJyApIHx8IHMuZW5kc1dpdGgoICdlbScgKSApIHtcclxuXHRcdFx0XHRjb25zdCBuICAgID0gcGFyc2VGbG9hdCggcyApO1xyXG5cdFx0XHRcdGNvbnN0IGJhc2UgPSBwYXJzZUZsb2F0KCBnZXRDb21wdXRlZFN0eWxlKCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgKS5mb250U2l6ZSApIHx8IDE2O1xyXG5cdFx0XHRcdHJldHVybiBOdW1iZXIuaXNGaW5pdGUoIG4gKSA/IG4gKiBiYXNlIDogMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBuID0gcGFyc2VGbG9hdCggcyApO1xyXG5cdFx0XHRyZXR1cm4gTnVtYmVyLmlzRmluaXRlKCBuICkgPyBuIDogMDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBXUEJDX0JGQl9Ub2dnbGVfTm9ybWFsaXplclxyXG5cdCAqXHJcblx0ICogQ29udmVydHMgcGxhaW4gY2hlY2tib3hlcyBpbnRvIHRvZ2dsZSBVSTpcclxuXHQgKiA8ZGl2IGNsYXNzPVwiaW5zcGVjdG9yX19jb250cm9sIHdwYmNfdWlfX3RvZ2dsZVwiPlxyXG5cdCAqICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwie3VuaXF1ZX1cIiBkYXRhLWluc3BlY3Rvci1rZXk9XCIuLi5cIiBjbGFzcz1cImluc3BlY3Rvcl9faW5wdXRcIiByb2xlPVwic3dpdGNoXCIgYXJpYS1jaGVja2VkPVwidHJ1ZXxmYWxzZVwiPlxyXG5cdCAqICAgPGxhYmVsIGNsYXNzPVwid3BiY191aV9fdG9nZ2xlX2ljb25cIiAgZm9yPVwie3VuaXF1ZX1cIj48L2xhYmVsPlxyXG5cdCAqICAgPGxhYmVsIGNsYXNzPVwid3BiY191aV9fdG9nZ2xlX2xhYmVsXCIgZm9yPVwie3VuaXF1ZX1cIj5MYWJlbDwvbGFiZWw+XHJcblx0ICogPC9kaXY+XHJcblx0ICpcclxuXHQgKiAtIFNraXBzIGlucHV0cyBhbHJlYWR5IGluc2lkZSBgLndwYmNfdWlfX3RvZ2dsZWAuXHJcblx0ICogLSBSZXVzZXMgYW4gZXhpc3RpbmcgPGxhYmVsIGZvcj1cIi4uLlwiPiB0ZXh0IGlmIHByZXNlbnQ7IG90aGVyd2lzZSBmYWxscyBiYWNrIHRvIG5lYXJieSBsYWJlbHMgb3IgYXR0cmlidXRlcy5cclxuXHQgKiAtIEF1dG8tZ2VuZXJhdGVzIGEgdW5pcXVlIGlkIHdoZW4gYWJzZW50LlxyXG5cdCAqL1xyXG5cdFVJLldQQkNfQkZCX1RvZ2dsZV9Ob3JtYWxpemVyID0gY2xhc3Mge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBncmFkZSBhbGwgcmF3IGNoZWNrYm94ZXMgaW4gYSBjb250YWluZXIgdG8gdG9nZ2xlcy5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJvb3RfZWxcclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIHVwZ3JhZGVfY2hlY2tib3hlc19pbihyb290X2VsKSB7XHJcblxyXG5cdFx0XHRpZiAoICFyb290X2VsIHx8ICFyb290X2VsLnF1ZXJ5U2VsZWN0b3JBbGwgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaW5wdXRzID0gcm9vdF9lbC5xdWVyeVNlbGVjdG9yQWxsKCAnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApO1xyXG5cdFx0XHRpZiAoICFpbnB1dHMubGVuZ3RoICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCggaW5wdXRzLCBmdW5jdGlvbiAoaW5wdXQpIHtcclxuXHJcblx0XHRcdFx0Ly8gMSkgU2tpcCBpZiBhbHJlYWR5IGluc2lkZSB0b2dnbGUgd3JhcHBlci5cclxuXHRcdFx0XHRpZiAoIGlucHV0LmNsb3Nlc3QoICcud3BiY191aV9fdG9nZ2xlJyApICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBTa2lwIHJvd3MgLyB3aGVyZSBpbnB1dCBjaGVja2JveCBleHBsaWNpdGx5IG1hcmtlZCB3aXRoICBhdHRyaWJ1dGUgJ2RhdGEtd3BiYy11aS1uby10b2dnbGUnLlxyXG5cdFx0XHRcdGlmICggaW5wdXQuaGFzQXR0cmlidXRlKCAnZGF0YS13cGJjLXVpLW5vLXRvZ2dsZScgKSApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIDIpIEVuc3VyZSB1bmlxdWUgaWQ7IHByZWZlciBleGlzdGluZy5cclxuXHRcdFx0XHR2YXIgaW5wdXRfaWQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoICdpZCcgKTtcclxuXHRcdFx0XHRpZiAoICFpbnB1dF9pZCApIHtcclxuXHRcdFx0XHRcdHZhciBrZXkgID0gKGlucHV0LmRhdGFzZXQgJiYgaW5wdXQuZGF0YXNldC5pbnNwZWN0b3JLZXkpID8gU3RyaW5nKCBpbnB1dC5kYXRhc2V0Lmluc3BlY3RvcktleSApIDogJ29wdCc7XHJcblx0XHRcdFx0XHRpbnB1dF9pZCA9IFVJLldQQkNfQkZCX1RvZ2dsZV9Ob3JtYWxpemVyLmdlbmVyYXRlX3VuaXF1ZV9pZCggJ3dwYmNfaW5zX2F1dG9fJyArIGtleSArICdfJyApO1xyXG5cdFx0XHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCAnaWQnLCBpbnB1dF9pZCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gMykgRmluZCBiZXN0IGxhYmVsIHRleHQuXHJcblx0XHRcdFx0dmFyIGxhYmVsX3RleHQgPSBVSS5XUEJDX0JGQl9Ub2dnbGVfTm9ybWFsaXplci5yZXNvbHZlX2xhYmVsX3RleHQoIHJvb3RfZWwsIGlucHV0LCBpbnB1dF9pZCApO1xyXG5cclxuXHRcdFx0XHQvLyA0KSBCdWlsZCB0aGUgdG9nZ2xlIHdyYXBwZXIuXHJcblx0XHRcdFx0dmFyIHdyYXBwZXIgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NOYW1lID0gJ2luc3BlY3Rvcl9fY29udHJvbCB3cGJjX3VpX190b2dnbGUnO1xyXG5cclxuXHRcdFx0XHQvLyBLZWVwIG9yaWdpbmFsIGlucHV0OyBqdXN0IG1vdmUgaXQgaW50byB3cmFwcGVyLlxyXG5cdFx0XHRcdGlucHV0LmNsYXNzTGlzdC5hZGQoICdpbnNwZWN0b3JfX2lucHV0JyApO1xyXG5cdFx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggJ3JvbGUnLCAnc3dpdGNoJyApO1xyXG5cdFx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggJ2FyaWEtY2hlY2tlZCcsIGlucHV0LmNoZWNrZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblxyXG5cdFx0XHRcdHZhciBpY29uX2xhYmVsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xhYmVsJyApO1xyXG5cdFx0XHRcdGljb25fbGFiZWwuY2xhc3NOYW1lID0gJ3dwYmNfdWlfX3RvZ2dsZV9pY29uJztcclxuXHRcdFx0XHRpY29uX2xhYmVsLnNldEF0dHJpYnV0ZSggJ2ZvcicsIGlucHV0X2lkICk7XHJcblxyXG5cdFx0XHRcdHZhciB0ZXh0X2xhYmVsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xhYmVsJyApO1xyXG5cdFx0XHRcdHRleHRfbGFiZWwuY2xhc3NOYW1lID0gJ3dwYmNfdWlfX3RvZ2dsZV9sYWJlbCc7XHJcblx0XHRcdFx0dGV4dF9sYWJlbC5zZXRBdHRyaWJ1dGUoICdmb3InLCBpbnB1dF9pZCApO1xyXG5cdFx0XHRcdHRleHRfbGFiZWwuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCBsYWJlbF90ZXh0ICkgKTtcclxuXHJcblx0XHRcdFx0Ly8gNSkgSW5zZXJ0IHdyYXBwZXIgaW50byBET00gbmVhciB0aGUgaW5wdXQuXHJcblx0XHRcdFx0Ly8gICAgUHJlZmVycmVkOiByZXBsYWNlIHRoZSBvcmlnaW5hbCBsYWJlbGVkIHJvdyBpZiBpdCBtYXRjaGVzIHR5cGljYWwgaW5zcGVjdG9yIGxheW91dC5cclxuXHRcdFx0XHR2YXIgcmVwbGFjZWQgPSBVSS5XUEJDX0JGQl9Ub2dnbGVfTm9ybWFsaXplci50cnlfcmVwbGFjZV9rbm93bl9yb3coIGlucHV0LCB3cmFwcGVyLCBsYWJlbF90ZXh0ICk7XHJcblxyXG5cdFx0XHRcdGlmICggIXJlcGxhY2VkICkge1xyXG5cdFx0XHRcdFx0aWYgKCAhaW5wdXQucGFyZW50Tm9kZSApIHJldHVybjsgLy8gTkVXIGd1YXJkXHJcblx0XHRcdFx0XHQvLyBGYWxsYmFjazoganVzdCB3cmFwIHRoZSBpbnB1dCBpbiBwbGFjZSBhbmQgYXBwZW5kIGxhYmVscy5cclxuXHRcdFx0XHRcdGlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCB3cmFwcGVyLCBpbnB1dCApO1xyXG5cdFx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZCggaW5wdXQgKTtcclxuXHRcdFx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoIGljb25fbGFiZWwgKTtcclxuXHRcdFx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoIHRleHRfbGFiZWwgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIDYpIEFSSUEgc3luYyBvbiBjaGFuZ2UuXHJcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggJ2FyaWEtY2hlY2tlZCcsIGlucHV0LmNoZWNrZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBHZW5lcmF0ZSBhIHVuaXF1ZSBpZCB3aXRoIGEgZ2l2ZW4gcHJlZml4LlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeFxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGdlbmVyYXRlX3VuaXF1ZV9pZChwcmVmaXgpIHtcclxuXHRcdFx0dmFyIGJhc2UgPSBTdHJpbmcoIHByZWZpeCB8fCAnd3BiY19pbnNfYXV0b18nICk7XHJcblx0XHRcdHZhciB1aWQgID0gTWF0aC5yYW5kb20oKS50b1N0cmluZyggMzYgKS5zbGljZSggMiwgOCApO1xyXG5cdFx0XHR2YXIgaWQgICA9IGJhc2UgKyB1aWQ7XHJcblx0XHRcdC8vIE1pbmltYWwgY29sbGlzaW9uIGd1YXJkIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IHNjb3BlLlxyXG5cdFx0XHR3aGlsZSAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApICkge1xyXG5cdFx0XHRcdHVpZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoIDM2ICkuc2xpY2UoIDIsIDggKTtcclxuXHRcdFx0XHRpZCAgPSBiYXNlICsgdWlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpZDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlc29sdmUgdGhlIGJlc3QgaHVtYW4gbGFiZWwgZm9yIGFuIGlucHV0LlxyXG5cdFx0ICogUHJpb3JpdHk6XHJcblx0XHQgKiAgMSkgPGxhYmVsIGZvcj1cIntpZH1cIj50ZXh0PC9sYWJlbD5cclxuXHRcdCAqICAyKSBuZWFyZXN0IHNpYmxpbmcvcGFyZW50IC5pbnNwZWN0b3JfX2xhYmVsIHRleHRcclxuXHRcdCAqICAzKSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSB8fCBkYXRhLWxhYmVsIHx8IGRhdGEtaW5zcGVjdG9yLWtleSB8fCBuYW1lIHx8ICdPcHRpb24nXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb290X2VsXHJcblx0XHQgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRfaWRcclxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHN0YXRpYyByZXNvbHZlX2xhYmVsX3RleHQocm9vdF9lbCwgaW5wdXQsIGlucHV0X2lkKSB7XHJcblx0XHRcdC8vIGZvcj0gYXNzb2NpYXRpb25cclxuXHRcdFx0aWYgKCBpbnB1dF9pZCApIHtcclxuXHRcdFx0XHR2YXIgYXNzb2MgPSByb290X2VsLnF1ZXJ5U2VsZWN0b3IoICdsYWJlbFtmb3I9XCInICsgVUkuV1BCQ19CRkJfVG9nZ2xlX05vcm1hbGl6ZXIuY3NzX2VzY2FwZSggaW5wdXRfaWQgKSArICdcIl0nICk7XHJcblx0XHRcdFx0aWYgKCBhc3NvYyAmJiBhc3NvYy50ZXh0Q29udGVudCApIHtcclxuXHRcdFx0XHRcdHZhciB0eHQgPSBhc3NvYy50ZXh0Q29udGVudC50cmltKCk7XHJcblx0XHRcdFx0XHQvLyBSZW1vdmUgdGhlIG9sZCBsYWJlbCBmcm9tIERPTTsgaXRzIHRleHQgd2lsbCBiZSB1c2VkIGJ5IHRvZ2dsZS5cclxuXHRcdFx0XHRcdGFzc29jLnBhcmVudE5vZGUgJiYgYXNzb2MucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggYXNzb2MgKTtcclxuXHRcdFx0XHRcdGlmICggdHh0ICkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHh0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbmVhcmJ5IGluc3BlY3RvciBsYWJlbFxyXG5cdFx0XHR2YXIgbmVhcl9sYWJlbCA9IGlucHV0LmNsb3Nlc3QoICcuaW5zcGVjdG9yX19yb3cnICk7XHJcblx0XHRcdGlmICggbmVhcl9sYWJlbCApIHtcclxuXHRcdFx0XHR2YXIgaWwgPSBuZWFyX2xhYmVsLnF1ZXJ5U2VsZWN0b3IoICcuaW5zcGVjdG9yX19sYWJlbCcgKTtcclxuXHRcdFx0XHRpZiAoIGlsICYmIGlsLnRleHRDb250ZW50ICkge1xyXG5cdFx0XHRcdFx0dmFyIHQyID0gaWwudGV4dENvbnRlbnQudHJpbSgpO1xyXG5cdFx0XHRcdFx0Ly8gSWYgdGhpcyByb3cgaGFkIHRoZSBzdGFuZGFyZCBsYWJlbCtjb250cm9sLCBkcm9wIHRoZSBvbGQgdGV4dCBsYWJlbCB0byBhdm9pZCBkdXBsaWNhdGVzLlxyXG5cdFx0XHRcdFx0aWwucGFyZW50Tm9kZSAmJiBpbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBpbCApO1xyXG5cdFx0XHRcdFx0aWYgKCB0MiApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHQyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZmFsbGJhY2tzXHJcblx0XHRcdHZhciBhcmlhID0gaW5wdXQuZ2V0QXR0cmlidXRlKCAnYXJpYS1sYWJlbCcgKTtcclxuXHRcdFx0aWYgKCBhcmlhICkge1xyXG5cdFx0XHRcdHJldHVybiBhcmlhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggaW5wdXQuZGF0YXNldCAmJiBpbnB1dC5kYXRhc2V0LmxhYmVsICkge1xyXG5cdFx0XHRcdHJldHVybiBTdHJpbmcoIGlucHV0LmRhdGFzZXQubGFiZWwgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIGlucHV0LmRhdGFzZXQgJiYgaW5wdXQuZGF0YXNldC5pbnNwZWN0b3JLZXkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFN0cmluZyggaW5wdXQuZGF0YXNldC5pbnNwZWN0b3JLZXkgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIGlucHV0Lm5hbWUgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFN0cmluZyggaW5wdXQubmFtZSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAnT3B0aW9uJztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRyeSB0byByZXBsYWNlIGEga25vd24gaW5zcGVjdG9yIHJvdyBwYXR0ZXJuIHdpdGggYSB0b2dnbGUgd3JhcHBlci5cclxuXHRcdCAqIFBhdHRlcm5zOlxyXG5cdFx0ICogIDxkaXYuaW5zcGVjdG9yX19yb3c+XHJcblx0XHQgKiAgICA8bGFiZWwuaW5zcGVjdG9yX19sYWJlbD5UZXh0PC9sYWJlbD5cclxuXHRcdCAqICAgIDxkaXYuaW5zcGVjdG9yX19jb250cm9sPiBbaW5wdXRbdHlwZT1jaGVja2JveF1dIDwvZGl2PlxyXG5cdFx0ICogIDwvZGl2PlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcclxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufSByZXBsYWNlZFxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgdHJ5X3JlcGxhY2Vfa25vd25fcm93KGlucHV0LCB3cmFwcGVyLCBsYWJlbF90ZXh0KSB7XHJcblx0XHRcdHZhciByb3cgICAgICAgPSBpbnB1dC5jbG9zZXN0KCAnLmluc3BlY3Rvcl9fcm93JyApO1xyXG5cdFx0XHR2YXIgY3RybF93cmFwID0gaW5wdXQucGFyZW50RWxlbWVudDtcclxuXHJcblx0XHRcdGlmICggcm93ICYmIGN0cmxfd3JhcCAmJiBjdHJsX3dyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCAnaW5zcGVjdG9yX19jb250cm9sJyApICkge1xyXG5cdFx0XHRcdC8vIENsZWFyIGNvbnRyb2wgd3JhcCBhbmQgcmVpbnNlcnQgdG9nZ2xlIHN0cnVjdHVyZS5cclxuXHRcdFx0XHR3aGlsZSAoIGN0cmxfd3JhcC5maXJzdENoaWxkICkge1xyXG5cdFx0XHRcdFx0Y3RybF93cmFwLnJlbW92ZUNoaWxkKCBjdHJsX3dyYXAuZmlyc3RDaGlsZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyb3cuY2xhc3NMaXN0LmFkZCggJ2luc3BlY3Rvcl9fcm93LS10b2dnbGUnICk7XHJcblxyXG5cdFx0XHRcdGN0cmxfd3JhcC5jbGFzc0xpc3QuYWRkKCAnd3BiY191aV9fdG9nZ2xlJyApO1xyXG5cdFx0XHRcdGN0cmxfd3JhcC5hcHBlbmRDaGlsZCggaW5wdXQgKTtcclxuXHJcblx0XHRcdFx0dmFyIGlucHV0X2lkICAgICAgID0gaW5wdXQuZ2V0QXR0cmlidXRlKCAnaWQnICk7XHJcblx0XHRcdFx0dmFyIGljb25fbGJsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xhYmVsJyApO1xyXG5cdFx0XHRcdGljb25fbGJsLmNsYXNzTmFtZSA9ICd3cGJjX3VpX190b2dnbGVfaWNvbic7XHJcblx0XHRcdFx0aWNvbl9sYmwuc2V0QXR0cmlidXRlKCAnZm9yJywgaW5wdXRfaWQgKTtcclxuXHJcblx0XHRcdFx0dmFyIHRleHRfbGJsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xhYmVsJyApO1xyXG5cdFx0XHRcdHRleHRfbGJsLmNsYXNzTmFtZSA9ICd3cGJjX3VpX190b2dnbGVfbGFiZWwnO1xyXG5cdFx0XHRcdHRleHRfbGJsLnNldEF0dHJpYnV0ZSggJ2ZvcicsIGlucHV0X2lkICk7XHJcblx0XHRcdFx0aWYgKCBsYWJlbF90ZXh0ICkge1xyXG5cdFx0XHRcdFx0dGV4dF9sYmwuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCBsYWJlbF90ZXh0ICkgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHJvdyBwcmV2aW91c2x5IGhhZCBhIC5pbnNwZWN0b3JfX2xhYmVsICh3ZSByZW1vdmVkIGl0IGluIHJlc29sdmVfbGFiZWxfdGV4dCksXHJcblx0XHRcdFx0Ly8gd2UgaW50ZW50aW9uYWxseSBkbyBOT1QgcmVjcmVhdGUgaXQ7IHRoZSB0b2dnbGUgdGV4dCBsYWJlbCBiZWNvbWVzIHRoZSB2aXNpYmxlIG9uZS5cclxuXHRcdFx0XHQvLyBUaGUgdGV4dCBjb250ZW50IGlzIGFscmVhZHkgcmVzb2x2ZWQgaW4gcmVzb2x2ZV9sYWJlbF90ZXh0KCkgYW5kIHNldCBiZWxvdyBieSBjYWxsZXIuXHJcblxyXG5cdFx0XHRcdGN0cmxfd3JhcC5hcHBlbmRDaGlsZCggaWNvbl9sYmwgKTtcclxuXHRcdFx0XHRjdHJsX3dyYXAuYXBwZW5kQ2hpbGQoIHRleHRfbGJsICk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE5vdCBhIGtub3duIHBhdHRlcm47IGNhbGxlciB3aWxsIHdyYXAgaW4gcGxhY2UuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENTUy5lc2NhcGUgcG9seWZpbGwgZm9yIHNlbGVjdG9ycy5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBzXHJcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgY3NzX2VzY2FwZShzKSB7XHJcblx0XHRcdHMgPSBTdHJpbmcoIHMgKTtcclxuXHRcdFx0aWYgKCB3aW5kb3cuQ1NTICYmIHR5cGVvZiB3aW5kb3cuQ1NTLmVzY2FwZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRyZXR1cm4gd2luZG93LkNTUy5lc2NhcGUoIHMgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcy5yZXBsYWNlKCAvKFteXFx3LV0pL2csICdcXFxcJDEnICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwbHkgYWxsIFVJIG5vcm1hbGl6ZXJzL2VuaGFuY2VycyB0byBhIGNvbnRhaW5lciAocG9zdC1yZW5kZXIpLlxyXG5cdCAqIEtlZXAgdGhpcyBmaWxlIHNtYWxsIGFuZCBhZGQgbW9yZSBub3JtYWxpemVycyBsYXRlciBpbiBvbmUgcGxhY2UuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb290XHJcblx0ICovXHJcblx0VUkuYXBwbHlfcG9zdF9yZW5kZXIgPSBmdW5jdGlvbiAocm9vdCkge1xyXG5cdFx0aWYgKCAhcm9vdCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0VUkuV1BCQ19CRkJfVmFsdWVTbGlkZXI/LmluaXRfb24/Liggcm9vdCApO1xyXG5cdFx0fSBjYXRjaCAoIGUgKSB7IC8qIG5vb3AgKi9cclxuXHRcdH1cclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBUID0gVUkuV1BCQ19CRkJfVG9nZ2xlX05vcm1hbGl6ZXI7XHJcblx0XHRcdGlmICggVCAmJiB0eXBlb2YgVC51cGdyYWRlX2NoZWNrYm94ZXNfaW4gPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0VC51cGdyYWRlX2NoZWNrYm94ZXNfaW4oIHJvb3QgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBjYXRjaCAoIGUgKSB7XHJcblx0XHRcdHcuX3dwYmM/LmRldj8uZXJyb3I/LiggJ2FwcGx5X3Bvc3RfcmVuZGVyLnRvZ2dsZScsIGUgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBY2Nlc3NpYmlsaXR5OiBrZWVwIGFyaWEtY2hlY2tlZCBpbiBzeW5jIGZvciBhbGwgdG9nZ2xlcyBpbnNpZGUgcm9vdC5cclxuXHRcdHRyeSB7XHJcblx0XHRcdHJvb3QucXVlcnlTZWxlY3RvckFsbCggJy53cGJjX3VpX190b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmZvckVhY2goIGZ1bmN0aW9uIChjYikge1xyXG5cdFx0XHRcdGlmICggY2IuX193cGJjX2FyaWFfaG9va2VkICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYi5fX3dwYmNfYXJpYV9ob29rZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGNiLnNldEF0dHJpYnV0ZSggJ2FyaWEtY2hlY2tlZCcsIGNiLmNoZWNrZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblx0XHRcdFx0Ly8gRGVsZWdhdGUg4oCYY2hhbmdl4oCZIGp1c3Qgb25jZSBwZXIgcmVuZGVyIOKAkyBuYXRpdmUgZGVsZWdhdGlvbiBzdGlsbCB3b3JrcyBmaW5lIGZvciB5b3VyIGxvZ2ljLlxyXG5cdFx0XHRcdGNiLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCAoKSA9PiB7XHJcblx0XHRcdFx0XHRjYi5zZXRBdHRyaWJ1dGUoICdhcmlhLWNoZWNrZWQnLCBjYi5jaGVja2VkID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xyXG5cdFx0XHRcdH0sIHsgcGFzc2l2ZTogdHJ1ZSB9ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHR3Ll93cGJjPy5kZXY/LmVycm9yPy4oICdhcHBseV9wb3N0X3JlbmRlci5hcmlhJywgZSApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFVJLkluc3BlY3RvckVuaGFuY2VycyA9IFVJLkluc3BlY3RvckVuaGFuY2VycyB8fCAoZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHJlZ3MgPSBbXTtcclxuXHJcblx0XHRmdW5jdGlvbiByZWdpc3RlcihuYW1lLCBzZWxlY3RvciwgaW5pdCwgZGVzdHJveSkge1xyXG5cdFx0XHRyZWdzLnB1c2goIHsgbmFtZSwgc2VsZWN0b3IsIGluaXQsIGRlc3Ryb3kgfSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNjYW4ocm9vdCkge1xyXG5cdFx0XHRpZiAoICFyb290ICkgcmV0dXJuO1xyXG5cdFx0XHRyZWdzLmZvckVhY2goIGZ1bmN0aW9uIChyKSB7XHJcblx0XHRcdFx0cm9vdC5xdWVyeVNlbGVjdG9yQWxsKCByLnNlbGVjdG9yICkuZm9yRWFjaCggZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdFx0XHRcdG5vZGUuX193cGJjX2VoID0gbm9kZS5fX3dwYmNfZWggfHwge307XHJcblx0XHRcdFx0XHRpZiAoIG5vZGUuX193cGJjX2VoW3IubmFtZV0gKSByZXR1cm47XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRyLmluaXQgJiYgci5pbml0KCBub2RlLCByb290ICk7XHJcblx0XHRcdFx0XHRcdG5vZGUuX193cGJjX2VoW3IubmFtZV0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoIF9lICkge1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRlc3Ryb3kocm9vdCkge1xyXG5cdFx0XHRpZiAoICFyb290ICkgcmV0dXJuO1xyXG5cdFx0XHRyZWdzLmZvckVhY2goIGZ1bmN0aW9uIChyKSB7XHJcblx0XHRcdFx0cm9vdC5xdWVyeVNlbGVjdG9yQWxsKCByLnNlbGVjdG9yICkuZm9yRWFjaCggZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHIuZGVzdHJveSAmJiByLmRlc3Ryb3koIG5vZGUsIHJvb3QgKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICggbm9kZS5fX3dwYmNfZWggKSBkZWxldGUgbm9kZS5fX3dwYmNfZWhbci5uYW1lXTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4geyByZWdpc3Rlciwgc2NhbiwgZGVzdHJveSB9O1xyXG5cdH0pKCk7XHJcblxyXG5cdFVJLldQQkNfQkZCX1ZhbHVlU2xpZGVyID0ge1xyXG5cdFx0aW5pdF9vbihyb290KSB7XHJcblx0XHRcdHZhciBncm91cHMgPSAocm9vdC5ub2RlVHlwZSA9PT0gMSA/IFsgcm9vdCBdIDogW10pLmNvbmNhdCggW10uc2xpY2UuY2FsbCggcm9vdC5xdWVyeVNlbGVjdG9yQWxsPy4oICdbZGF0YS1sZW4tZ3JvdXBdJyApIHx8IFtdICkgKTtcclxuXHRcdFx0Z3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uIChnKSB7XHJcblx0XHRcdFx0aWYgKCAhZy5tYXRjaGVzIHx8ICFnLm1hdGNoZXMoICdbZGF0YS1sZW4tZ3JvdXBdJyApICkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICggZy5fX3dwYmNfbGVuX3dpcmVkICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHR2YXIgbnVtYmVyID0gZy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtbGVuLXZhbHVlXScgKTtcclxuXHRcdFx0XHR2YXIgcmFuZ2UgID0gZy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtbGVuLXJhbmdlXScgKTtcclxuXHRcdFx0XHR2YXIgdW5pdCAgID0gZy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtbGVuLXVuaXRdJyApO1xyXG5cclxuXHRcdFx0XHRpZiAoICFudW1iZXIgfHwgIXJhbmdlICkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBNaXJyb3IgY29uc3RyYWludHMgaWYgbWlzc2luZyBvbiB0aGUgcmFuZ2UuXHJcblx0XHRcdFx0WyAnbWluJywgJ21heCcsICdzdGVwJyBdLmZvckVhY2goIGZ1bmN0aW9uIChhKSB7XHJcblx0XHRcdFx0XHRpZiAoICFyYW5nZS5oYXNBdHRyaWJ1dGUoIGEgKSAmJiBudW1iZXIuaGFzQXR0cmlidXRlKCBhICkgKSB7XHJcblx0XHRcdFx0XHRcdHJhbmdlLnNldEF0dHJpYnV0ZSggYSwgbnVtYmVyLmdldEF0dHJpYnV0ZSggYSApICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBzeW5jUmFuZ2VGcm9tTnVtYmVyKCkge1xyXG5cdFx0XHRcdFx0aWYgKCByYW5nZS52YWx1ZSAhPT0gbnVtYmVyLnZhbHVlICkgcmFuZ2UudmFsdWUgPSBudW1iZXIudmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBzeW5jTnVtYmVyRnJvbVJhbmdlKCkge1xyXG5cdFx0XHRcdFx0aWYgKCBudW1iZXIudmFsdWUgIT09IHJhbmdlLnZhbHVlICkge1xyXG5cdFx0XHRcdFx0XHRudW1iZXIudmFsdWUgPSByYW5nZS52YWx1ZTtcclxuXHRcdFx0XHRcdFx0Ly8gYnViYmxlIHNvIGV4aXN0aW5nIGluc3BlY3RvciBsaXN0ZW5lcnMgcnVuXHJcblx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0bnVtYmVyLmRpc3BhdGNoRXZlbnQoIG5ldyBFdmVudCggJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0XHR9IGNhdGNoICggX2UgKSB7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRudW1iZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0XHR9IGNhdGNoICggX2UgKSB7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIG9uTnVtYmVyKCkge1xyXG5cdFx0XHRcdFx0c3luY1JhbmdlRnJvbU51bWJlcigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gb25SYW5nZSgpIHtcclxuXHRcdFx0XHRcdHN5bmNOdW1iZXJGcm9tUmFuZ2UoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG51bWJlci5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBvbk51bWJlciApO1xyXG5cdFx0XHRcdG51bWJlci5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgb25OdW1iZXIgKTtcclxuXHRcdFx0XHRyYW5nZS5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBvblJhbmdlICk7XHJcblx0XHRcdFx0cmFuZ2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIG9uUmFuZ2UgKTtcclxuXHJcblx0XHRcdFx0aWYgKCB1bml0ICkge1xyXG5cdFx0XHRcdFx0dW5pdC5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHQvLyBXZSBqdXN0IG51ZGdlIHRoZSBudW1iZXIgc28gdXBzdHJlYW0gaGFuZGxlcnMgcmUtcnVuLlxyXG5cdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdG51bWJlci5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoICdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9ICkgKTtcclxuXHRcdFx0XHRcdFx0fSBjYXRjaCAoIF9lICkge1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBJbml0aWFsIHN5bmNcclxuXHRcdFx0XHRzeW5jUmFuZ2VGcm9tTnVtYmVyKCk7XHJcblxyXG5cdFx0XHRcdGcuX193cGJjX2xlbl93aXJlZCA9IHtcclxuXHRcdFx0XHRcdGRlc3Ryb3koKSB7XHJcblx0XHRcdFx0XHRcdG51bWJlci5yZW1vdmVFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBvbk51bWJlciApO1xyXG5cdFx0XHRcdFx0XHRudW1iZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIG9uTnVtYmVyICk7XHJcblx0XHRcdFx0XHRcdHJhbmdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIG9uUmFuZ2UgKTtcclxuXHRcdFx0XHRcdFx0cmFuZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIG9uUmFuZ2UgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9LFxyXG5cdFx0ZGVzdHJveV9vbihyb290KSB7XHJcblx0XHRcdChyb290LnF1ZXJ5U2VsZWN0b3JBbGw/LiggJ1tkYXRhLWxlbi1ncm91cF0nICkgfHwgW10pLmZvckVhY2goIGZ1bmN0aW9uIChnKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGcuX193cGJjX2xlbl93aXJlZCAmJiBnLl9fd3BiY19sZW5fd2lyZWQuZGVzdHJveSAmJiBnLl9fd3BiY19sZW5fd2lyZWQuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVsZXRlIGcuX193cGJjX2xlbl93aXJlZDtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIFJlZ2lzdGVyIHdpdGggdGhlIGdsb2JhbCBlbmhhbmNlcnMgaHViLlxyXG5cdFVJLkluc3BlY3RvckVuaGFuY2VycyAmJiBVSS5JbnNwZWN0b3JFbmhhbmNlcnMucmVnaXN0ZXIoXHJcblx0XHQndmFsdWUtc2xpZGVyJyxcclxuXHRcdCdbZGF0YS1sZW4tZ3JvdXBdJyxcclxuXHRcdGZ1bmN0aW9uIChlbCwgX3Jvb3QpIHtcclxuXHRcdFx0VUkuV1BCQ19CRkJfVmFsdWVTbGlkZXIuaW5pdF9vbiggZWwgKTtcclxuXHRcdH0sXHJcblx0XHRmdW5jdGlvbiAoZWwsIF9yb290KSB7XHJcblx0XHRcdFVJLldQQkNfQkZCX1ZhbHVlU2xpZGVyLmRlc3Ryb3lfb24oIGVsICk7XHJcblx0XHR9XHJcblx0KTtcclxuXHJcblx0Ly8gU2luZ2xlLCBsb2FkLW9yZGVyLXNhZmUgcGF0Y2ggc28gZW5oYW5jZXJzIGF1dG8tcnVuIG9uIGV2ZXJ5IGJpbmQuXHJcblx0KGZ1bmN0aW9uIHBhdGNoSW5zcGVjdG9yRW5oYW5jZXJzKCkge1xyXG5cdFx0ZnVuY3Rpb24gYXBwbHlQYXRjaCgpIHtcclxuXHRcdFx0dmFyIEluc3BlY3RvciA9IHcuV1BCQ19CRkJfSW5zcGVjdG9yO1xyXG5cdFx0XHRpZiAoICFJbnNwZWN0b3IgfHwgSW5zcGVjdG9yLl9fd3BiY19lbmhhbmNlcnNfcGF0Y2hlZCApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0SW5zcGVjdG9yLl9fd3BiY19lbmhhbmNlcnNfcGF0Y2hlZCA9IHRydWU7XHJcblx0XHRcdHZhciBvcmlnICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBJbnNwZWN0b3IucHJvdG90eXBlLmJpbmRfdG9fZmllbGQ7XHJcblx0XHRcdEluc3BlY3Rvci5wcm90b3R5cGUuYmluZF90b19maWVsZCAgPSBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRvcmlnLmNhbGwoIHRoaXMsIGVsICk7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBpbnMgPSB0aGlzLnBhbmVsXHJcblx0XHRcdFx0XHRcdHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnd3BiY19iZmJfX2luc3BlY3RvcicgKVxyXG5cdFx0XHRcdFx0XHR8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLndwYmNfYmZiX19pbnNwZWN0b3InICk7XHJcblx0XHRcdFx0XHRVSS5JbnNwZWN0b3JFbmhhbmNlcnMgJiYgVUkuSW5zcGVjdG9yRW5oYW5jZXJzLnNjYW4oIGlucyApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8vIEluaXRpYWwgc2NhbiBpZiB0aGUgRE9NIGlzIGFscmVhZHkgcHJlc2VudC5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgaW5zRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwYmNfYmZiX19pbnNwZWN0b3InIClcclxuXHRcdFx0XHRcdHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX2luc3BlY3RvcicgKTtcclxuXHRcdFx0XHRVSS5JbnNwZWN0b3JFbmhhbmNlcnMgJiYgVUkuSW5zcGVjdG9yRW5oYW5jZXJzLnNjYW4oIGluc0VsICk7XHJcblx0XHRcdH0gY2F0Y2ggKCBfZSApIHtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUcnkgbm93OyBpZiBJbnNwZWN0b3IgaXNu4oCZdCBkZWZpbmVkIHlldCwgcGF0Y2ggd2hlbiBpdCBiZWNvbWVzIHJlYWR5LlxyXG5cdFx0aWYgKCAhYXBwbHlQYXRjaCgpICkge1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG5cdFx0XHRcdCd3cGJjX2JmYl9pbnNwZWN0b3JfcmVhZHknLFxyXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGFwcGx5UGF0Y2goKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHsgb25jZTogdHJ1ZSB9XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fSkoKTtcclxuXHJcbn0oIHdpbmRvdywgZG9jdW1lbnQgKSk7IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vID09IEZpbGUgIC9pbmNsdWRlcy9wYWdlLWZvcm0tYnVpbGRlci9fb3V0L2NvcmUvYmZiLWluc3BlY3Rvci5qcyA9PSBUaW1lIHBvaW50OiAyMDI1LTA5LTA2IDE0OjA4XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24gKHcpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8vIDEpIEFjdGlvbnMgcmVnaXN0cnkuXHJcblxyXG5cdC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgKGN0eDogSW5zcGVjdG9yQWN0aW9uQ29udGV4dCkgPT4gdm9pZD59ICovXHJcblx0Y29uc3QgX19JTlNQRUNUT1JfQUNUSU9OU19NQVBfXyA9IE9iamVjdC5jcmVhdGUoIG51bGwgKTtcclxuXHJcblx0Ly8gQnVpbHQtaW5zLlxyXG5cdF9fSU5TUEVDVE9SX0FDVElPTlNfTUFQX19bJ2Rlc2VsZWN0J10gPSAoeyBidWlsZGVyIH0pID0+IHtcclxuXHRcdGJ1aWxkZXI/LnNlbGVjdF9maWVsZD8uKCBudWxsICk7XHJcblx0fTtcclxuXHJcblx0X19JTlNQRUNUT1JfQUNUSU9OU19NQVBfX1snc2Nyb2xsdG8nXSA9ICh7IGJ1aWxkZXIsIGVsIH0pID0+IHtcclxuXHRcdGlmICggIWVsIHx8ICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKCBlbCApICkgcmV0dXJuO1xyXG5cdFx0YnVpbGRlcj8uc2VsZWN0X2ZpZWxkPy4oIGVsLCB7IHNjcm9sbEludG9WaWV3OiB0cnVlIH0gKTtcclxuXHRcdGVsLmNsYXNzTGlzdC5hZGQoICd3cGJjX2JmYl9fc2Nyb2xsLXB1bHNlJyApO1xyXG5cdFx0c2V0VGltZW91dCggKCkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSggJ3dwYmNfYmZiX19zY3JvbGwtcHVsc2UnICksIDcwMCApO1xyXG5cdH07XHJcblxyXG5cdF9fSU5TUEVDVE9SX0FDVElPTlNfTUFQX19bJ21vdmUtdXAnXSA9ICh7IGJ1aWxkZXIsIGVsIH0pID0+IHtcclxuXHRcdGlmICggIWVsICkgcmV0dXJuO1xyXG5cdFx0YnVpbGRlcj8ubW92ZV9pdGVtPy4oIGVsLCAndXAnICk7XHJcblx0XHQvLyBTY3JvbGwgYWZ0ZXIgdGhlIERPTSBoYXMgc2V0dGxlZC5cclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBfX0lOU1BFQ1RPUl9BQ1RJT05TX01BUF9fWydzY3JvbGx0byddKHsgYnVpbGRlciwgZWwgfSkpO1xyXG5cdH07XHJcblxyXG5cdF9fSU5TUEVDVE9SX0FDVElPTlNfTUFQX19bJ21vdmUtZG93biddID0gKHsgYnVpbGRlciwgZWwgfSkgPT4ge1xyXG5cdFx0aWYgKCAhZWwgKSByZXR1cm47XHJcblx0XHRidWlsZGVyPy5tb3ZlX2l0ZW0/LiggZWwsICdkb3duJyApO1xyXG5cdFx0Ly8gU2Nyb2xsIGFmdGVyIHRoZSBET00gaGFzIHNldHRsZWQuXHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gX19JTlNQRUNUT1JfQUNUSU9OU19NQVBfX1snc2Nyb2xsdG8nXSh7IGJ1aWxkZXIsIGVsIH0pKTtcclxuXHR9O1xyXG5cclxuXHRfX0lOU1BFQ1RPUl9BQ1RJT05TX01BUF9fWydkZWxldGUnXSA9ICh7IGJ1aWxkZXIsIGVsLCBjb25maXJtID0gdy5jb25maXJtIH0pID0+IHtcclxuXHRcdGlmICggIWVsICkgcmV0dXJuO1xyXG5cdFx0Y29uc3QgaXNfZmllbGQgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9fZmllbGQnICk7XHJcblx0XHRjb25zdCBsYWJlbCAgICA9IGlzX2ZpZWxkXHJcblx0XHRcdD8gKGVsLnF1ZXJ5U2VsZWN0b3IoICcud3BiY19iZmJfX2ZpZWxkLWxhYmVsJyApPy50ZXh0Q29udGVudCB8fCBlbC5kYXRhc2V0Py5pZCB8fCAnZmllbGQnKVxyXG5cdFx0XHQ6IChlbC5kYXRhc2V0Py5pZCB8fCAnc2VjdGlvbicpO1xyXG5cclxuXHRcdGlmICggY29uZmlybSggJ0RlbGV0ZSAnICsgbGFiZWwgKyAnPyBUaGlzIGNhbm5vdCBiZSB1bmRvbmUuJyApICkge1xyXG5cdFx0XHQvLyBDZW50cmFsIGNvbW1hbmQgd2lsbCByZW1vdmUsIGVtaXQgZXZlbnRzLCBhbmQgcmVzZWxlY3QgbmVpZ2hib3IgKHdoaWNoIHJlLWJpbmRzIEluc3BlY3RvcikuXHJcblx0XHRcdGJ1aWxkZXI/LmRlbGV0ZV9pdGVtPy4oIGVsICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0X19JTlNQRUNUT1JfQUNUSU9OU19NQVBfX1snZHVwbGljYXRlJ10gPSAoeyBidWlsZGVyLCBlbCB9KSA9PiB7XHJcblx0XHRpZiAoICFlbCApIHJldHVybjtcclxuXHRcdGNvbnN0IGNsb25lID0gYnVpbGRlcj8uZHVwbGljYXRlX2l0ZW0/LiggZWwgKTtcclxuXHRcdGlmICggY2xvbmUgKSBidWlsZGVyPy5zZWxlY3RfZmllbGQ/LiggY2xvbmUsIHsgc2Nyb2xsSW50b1ZpZXc6IHRydWUgfSApO1xyXG5cdH07XHJcblxyXG5cdC8vIFB1YmxpYyBBUEkuXHJcblx0dy5XUEJDX0JGQl9JbnNwZWN0b3JfQWN0aW9ucyA9IHtcclxuXHRcdHJ1bihuYW1lLCBjdHgpIHtcclxuXHRcdFx0Y29uc3QgZm4gPSBfX0lOU1BFQ1RPUl9BQ1RJT05TX01BUF9fW25hbWVdO1xyXG5cdFx0XHRpZiAoIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyApIGZuKCBjdHggKTtcclxuXHRcdFx0ZWxzZSBjb25zb2xlLndhcm4oICdXUEJDLiBJbnNwZWN0b3IgYWN0aW9uIG5vdCBmb3VuZDonLCBuYW1lICk7XHJcblx0XHR9LFxyXG5cdFx0cmVnaXN0ZXIobmFtZSwgaGFuZGxlcikge1xyXG5cdFx0XHRpZiAoICFuYW1lIHx8IHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ3JlZ2lzdGVyKG5hbWUsIGhhbmRsZXIpOiBpbnZhbGlkIGFyZ3VtZW50cycgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRfX0lOU1BFQ1RPUl9BQ1RJT05TX01BUF9fW25hbWVdID0gaGFuZGxlcjtcclxuXHRcdH0sXHJcblx0XHRoYXMobmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gdHlwZW9mIF9fSU5TUEVDVE9SX0FDVElPTlNfTUFQX19bbmFtZV0gPT09ICdmdW5jdGlvbic7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gMikgSW5zcGVjdG9yIEZhY3RvcnkuXHJcblxyXG5cdHZhciBVSSA9ICh3LldQQkNfQkZCX0NvcmUuVUkgPSB3LldQQkNfQkZCX0NvcmUuVUkgfHwge30pO1xyXG5cclxuXHQvLyBHbG9iYWwgSHlicmlkKysgcmVnaXN0cmllcyAoa2VlcCBwdWJsaWMpLlxyXG5cdHcud3BiY19iZmJfaW5zcGVjdG9yX2ZhY3Rvcnlfc2xvdHMgICAgICA9IHcud3BiY19iZmJfaW5zcGVjdG9yX2ZhY3Rvcnlfc2xvdHMgfHwge307XHJcblx0dy53cGJjX2JmYl9pbnNwZWN0b3JfZmFjdG9yeV92YWx1ZV9mcm9tID0gdy53cGJjX2JmYl9pbnNwZWN0b3JfZmFjdG9yeV92YWx1ZV9mcm9tIHx8IHt9O1xyXG5cclxuXHQvLyBEZWZpbmUgRmFjdG9yeSBvbmx5IGlmIG1pc3NpbmcgKG5vIGVhcmx5IHJldHVybiBmb3IgdGhlIHdob2xlIGJ1bmRsZSkuXHJcblx0Ly8gYWx3YXlzIGRlZmluZS9yZXBsYWNlIEZhY3RvcnlcclxuXHR7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBVdGlsaXR5OiBjcmVhdGUgZWxlbWVudCB3aXRoIGF0dHJpYnV0ZXMgYW5kIGNoaWxkcmVuLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0YWdcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gYXR0cnNcclxuXHRcdCAqIEBwYXJhbSB7KE5vZGV8c3RyaW5nfEFycmF5PE5vZGV8c3RyaW5nPik9fSBjaGlsZHJlblxyXG5cdFx0ICogQHJldHVybnMge0hUTUxFbGVtZW50fVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBlbCh0YWcsIGF0dHJzLCBjaGlsZHJlbikge1xyXG5cdFx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZyApO1xyXG5cdFx0XHRpZiAoIGF0dHJzICkge1xyXG5cdFx0XHRcdE9iamVjdC5rZXlzKCBhdHRycyApLmZvckVhY2goIGZ1bmN0aW9uIChrKSB7XHJcblx0XHRcdFx0XHR2YXIgdiA9IGF0dHJzW2tdO1xyXG5cdFx0XHRcdFx0aWYgKCB2ID09IG51bGwgKSByZXR1cm47XHJcblx0XHRcdFx0XHRpZiAoIGsgPT09ICdjbGFzcycgKSB7XHJcblx0XHRcdFx0XHRcdG5vZGUuY2xhc3NOYW1lID0gdjtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBrID09PSAnZGF0YXNldCcgKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKCB2ICkuZm9yRWFjaCggZnVuY3Rpb24gKGRrKSB7XHJcblx0XHRcdFx0XHRcdFx0bm9kZS5kYXRhc2V0W2RrXSA9IFN0cmluZyggdltka10gKTtcclxuXHRcdFx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIGsgPT09ICdjaGVja2VkJyAmJiB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIHYgKSBub2RlLnNldEF0dHJpYnV0ZSggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBrID09PSAnZGlzYWJsZWQnICYmIHR5cGVvZiB2ID09PSAnYm9vbGVhbicgKSB7XHJcblx0XHRcdFx0XHRcdGlmICggdiApIG5vZGUuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIG5vcm1hbGl6ZSBib29sZWFuIGF0dHJpYnV0ZXMgdG8gc3RyaW5ncy5cclxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHYgPT09ICdib29sZWFuJyApIHtcclxuXHRcdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoIGssIHYgPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCBrLCBTdHJpbmcoIHYgKSApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIGNoaWxkcmVuICkge1xyXG5cdFx0XHRcdChBcnJheS5pc0FycmF5KCBjaGlsZHJlbiApID8gY2hpbGRyZW4gOiBbIGNoaWxkcmVuIF0pLmZvckVhY2goIGZ1bmN0aW9uIChjKSB7XHJcblx0XHRcdFx0XHRpZiAoIGMgPT0gbnVsbCApIHJldHVybjtcclxuXHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoICh0eXBlb2YgYyA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGMgKSA6IGMgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBCdWlsZCBhIHRvZ2dsZSBjb250cm9sIHJvdyAoY2hlY2tib3ggcmVuZGVyZWQgYXMgdG9nZ2xlKS5cclxuXHRcdCAqXHJcblx0XHQgKiBTdHJ1Y3R1cmU6XHJcblx0XHQgKiA8ZGl2IGNsYXNzPVwiaW5zcGVjdG9yX19yb3cgaW5zcGVjdG9yX19yb3ctLXRvZ2dsZVwiPlxyXG5cdFx0ICogICA8ZGl2IGNsYXNzPVwiaW5zcGVjdG9yX19jb250cm9sIHdwYmNfdWlfX3RvZ2dsZVwiPlxyXG5cdFx0ICogICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIklEXCIgZGF0YS1pbnNwZWN0b3Ita2V5PVwiS0VZXCIgY2xhc3M9XCJpbnNwZWN0b3JfX2lucHV0XCIgY2hlY2tlZD5cclxuXHRcdCAqICAgICA8bGFiZWwgY2xhc3M9XCJ3cGJjX3VpX190b2dnbGVfaWNvblwiICBmb3I9XCJJRFwiPjwvbGFiZWw+XHJcblx0XHQgKiAgICAgPGxhYmVsIGNsYXNzPVwid3BiY191aV9fdG9nZ2xlX2xhYmVsXCIgZm9yPVwiSURcIj5MYWJlbCB0ZXh0PC9sYWJlbD5cclxuXHRcdCAqICAgPC9kaXY+XHJcblx0XHQgKiA8L2Rpdj5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRfaWRcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcclxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZFxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsX3RleHRcclxuXHRcdCAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gYnVpbGRfdG9nZ2xlX3JvdyggaW5wdXRfaWQsIGtleSwgY2hlY2tlZCwgbGFiZWxfdGV4dCApIHtcclxuXHJcblx0XHRcdHZhciByb3dfZWwgICAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fcm93IGluc3BlY3Rvcl9fcm93LS10b2dnbGUnIH0gKTtcclxuXHRcdFx0dmFyIGN0cmxfd3JhcCA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnaW5zcGVjdG9yX19jb250cm9sIHdwYmNfdWlfX3RvZ2dsZScgfSApO1xyXG5cclxuXHRcdFx0dmFyIGlucHV0X2VsID0gZWwoICdpbnB1dCcsIHtcclxuXHRcdFx0XHRpZCAgICAgICAgICAgICAgICAgIDogaW5wdXRfaWQsXHJcblx0XHRcdFx0dHlwZSAgICAgICAgICAgICAgICA6ICdjaGVja2JveCcsXHJcblx0XHRcdFx0J2RhdGEtaW5zcGVjdG9yLWtleSc6IGtleSxcclxuXHRcdFx0XHQnY2xhc3MnICAgICAgICAgICAgIDogJ2luc3BlY3Rvcl9faW5wdXQnLFxyXG5cdFx0XHRcdGNoZWNrZWQgICAgICAgICAgICAgOiAhIWNoZWNrZWQsXHJcblx0XHRcdFx0cm9sZSAgICAgICAgICAgICAgICA6ICdzd2l0Y2gnLFxyXG5cdFx0XHRcdCdhcmlhLWNoZWNrZWQnICAgICAgOiAhIWNoZWNrZWRcclxuXHRcdFx0fSApO1xyXG5cdFx0XHR2YXIgaWNvbl9sYmwgPSBlbCggJ2xhYmVsJywgeyAnY2xhc3MnOiAnd3BiY191aV9fdG9nZ2xlX2ljb24nLCAnZm9yJzogaW5wdXRfaWQgfSApO1xyXG5cdFx0XHR2YXIgdGV4dF9sYmwgPSBlbCggJ2xhYmVsJywgeyAnY2xhc3MnOiAnd3BiY191aV9fdG9nZ2xlX2xhYmVsJywgJ2Zvcic6IGlucHV0X2lkIH0sIGxhYmVsX3RleHQgfHwgJycgKTtcclxuXHJcblx0XHRcdGN0cmxfd3JhcC5hcHBlbmRDaGlsZCggaW5wdXRfZWwgKTtcclxuXHRcdFx0Y3RybF93cmFwLmFwcGVuZENoaWxkKCBpY29uX2xibCApO1xyXG5cdFx0XHRjdHJsX3dyYXAuYXBwZW5kQ2hpbGQoIHRleHRfbGJsICk7XHJcblxyXG5cdFx0XHRyb3dfZWwuYXBwZW5kQ2hpbGQoIGN0cmxfd3JhcCApO1xyXG5cdFx0XHRyZXR1cm4gcm93X2VsO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdCAqIFV0aWxpdHk6IGNob29zZSBpbml0aWFsIHZhbHVlIGZyb20gZGF0YSBvciBzY2hlbWEgZGVmYXVsdC5cclxuXHQgKi9cclxuXHRcdGZ1bmN0aW9uIGdldF9pbml0aWFsX3ZhbHVlKGtleSwgZGF0YSwgcHJvcHNfc2NoZW1hKSB7XHJcblx0XHRcdGlmICggZGF0YSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIGRhdGEsIGtleSApICkgcmV0dXJuIGRhdGFba2V5XTtcclxuXHRcdFx0dmFyIG1ldGEgPSBwcm9wc19zY2hlbWEgJiYgcHJvcHNfc2NoZW1hW2tleV07XHJcblx0XHRcdHJldHVybiAobWV0YSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIG1ldGEsICdkZWZhdWx0JyApKSA/IG1ldGEuZGVmYXVsdCA6ICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdCAqIFV0aWxpdHk6IGNvZXJjZSB2YWx1ZSBieSBzY2hlbWEgdHlwZS5cclxuXHQgKi9cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gY29lcmNlX2J5X3R5cGUodmFsdWUsIHR5cGUpIHtcclxuXHRcdFx0c3dpdGNoICggdHlwZSApIHtcclxuXHRcdFx0XHRjYXNlICdudW1iZXInOlxyXG5cdFx0XHRcdGNhc2UgJ2ludCc6XHJcblx0XHRcdFx0Y2FzZSAnZmxvYXQnOlxyXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT0gbnVsbCApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIG4gPSBOdW1iZXIoIHZhbHVlICk7XHJcblx0XHRcdFx0XHRyZXR1cm4gaXNOYU4oIG4gKSA/ICcnIDogbjtcclxuXHRcdFx0XHRjYXNlICdib29sZWFuJzpcclxuXHRcdFx0XHRcdHJldHVybiAhIXZhbHVlO1xyXG5cdFx0XHRcdGNhc2UgJ2FycmF5JzpcclxuXHRcdFx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUgOiBbXTtcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0cmV0dXJuICh2YWx1ZSA9PSBudWxsKSA/ICcnIDogU3RyaW5nKCB2YWx1ZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0ICogTm9ybWFsaXplIDxzZWxlY3Q+IG9wdGlvbnMgKGFycmF5IG9mIHt2YWx1ZSxsYWJlbH0gb3IgbWFwIHt2YWx1ZTpsYWJlbH0pLlxyXG5cdCAqL1xyXG5cdFx0ZnVuY3Rpb24gbm9ybWFsaXplX3NlbGVjdF9vcHRpb25zKG9wdGlvbnMpIHtcclxuXHRcdFx0aWYgKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG9wdGlvbnMubWFwKCBmdW5jdGlvbiAobykge1xyXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgbyAmJiAndmFsdWUnIGluIG8gKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB7IHZhbHVlOiBTdHJpbmcoIG8udmFsdWUgKSwgbGFiZWw6IFN0cmluZyggby5sYWJlbCB8fCBvLnZhbHVlICkgfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB7IHZhbHVlOiBTdHJpbmcoIG8gKSwgbGFiZWw6IFN0cmluZyggbyApIH07XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggb3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSB7XHJcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKCBvcHRpb25zICkubWFwKCBmdW5jdGlvbiAoaykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IFN0cmluZyggayApLCBsYWJlbDogU3RyaW5nKCBvcHRpb25zW2tdICkgfTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBQYXJzZSBhIENTUyBsZW5ndGggbGlrZSBcIjEyMHB4XCIgb3IgXCI4MCVcIiBpbnRvIHsgdmFsdWU6bnVtYmVyLCB1bml0OnN0cmluZyB9LiAqL1xyXG5cdFx0ZnVuY3Rpb24gcGFyc2VfbGVuKHZhbHVlLCBmYWxsYmFja191bml0KSB7XHJcblx0XHRcdHZhbHVlID0gKHZhbHVlID09IG51bGwpID8gJycgOiBTdHJpbmcoIHZhbHVlICkudHJpbSgpO1xyXG5cdFx0XHR2YXIgbSA9IHZhbHVlLm1hdGNoKCAvXigtP1xcZCsoPzpcXC5cXGQrKT8pKHB4fCV8cmVtfGVtKSQvaSApO1xyXG5cdFx0XHRpZiAoIG0gKSB7XHJcblx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHBhcnNlRmxvYXQoIG1bMV0gKSwgdW5pdDogbVsyXS50b0xvd2VyQ2FzZSgpIH07XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gcGxhaW4gbnVtYmVyIC0+IGFzc3VtZSBmYWxsYmFjayB1bml0XHJcblx0XHRcdGlmICggdmFsdWUgIT09ICcnICYmICFpc05hTiggTnVtYmVyKCB2YWx1ZSApICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IE51bWJlciggdmFsdWUgKSwgdW5pdDogKGZhbGxiYWNrX3VuaXQgfHwgJ3B4JykgfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4geyB2YWx1ZTogMCwgdW5pdDogKGZhbGxiYWNrX3VuaXQgfHwgJ3B4JykgfTtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogQ2xhbXAgaGVscGVyLiAqL1xyXG5cdFx0ZnVuY3Rpb24gY2xhbXBfbnVtKHYsIG1pbiwgbWF4KSB7XHJcblx0XHRcdGlmICggdHlwZW9mIHYgIT09ICdudW1iZXInIHx8IGlzTmFOKCB2ICkgKSByZXR1cm4gKG1pbiAhPSBudWxsID8gbWluIDogMCk7XHJcblx0XHRcdGlmICggbWluICE9IG51bGwgJiYgdiA8IG1pbiApIHYgPSBtaW47XHJcblx0XHRcdGlmICggbWF4ICE9IG51bGwgJiYgdiA+IG1heCApIHYgPSBtYXg7XHJcblx0XHRcdHJldHVybiB2O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEluaXRpYWxpemUgQ29sb3JpcyBwaWNrZXJzIGluIGEgZ2l2ZW4gcm9vdC5cclxuXHRcdC8vIFJlbGllcyBvbiBDb2xvcmlzIGJlaW5nIGVucXVldWVkIChzZWUgYmZiLWJvb3RzdHJhcC5waHApLlxyXG5cdFx0ZnVuY3Rpb24gaW5pdF9jb2xvcmlzX3BpY2tlcnMocm9vdCkge1xyXG5cdFx0XHRpZiAoICFyb290IHx8ICF3LkNvbG9yaXMgKSByZXR1cm47XHJcblx0XHRcdC8vIE1hcmsgaW5wdXRzIHdlIHdhbnQgQ29sb3JpcyB0byBoYW5kbGUuXHJcblx0XHRcdHZhciBpbnB1dHMgPSByb290LnF1ZXJ5U2VsZWN0b3JBbGwoICdpbnB1dFtkYXRhLWluc3BlY3Rvci10eXBlPVwiY29sb3JcIl0nICk7XHJcblx0XHRcdGlmICggIWlucHV0cy5sZW5ndGggKSByZXR1cm47XHJcblxyXG5cdFx0XHQvLyBBZGQgYSBzdGFibGUgY2xhc3MgZm9yIENvbG9yaXMgdGFyZ2V0aW5nOyBhdm9pZCBkb3VibGUtaW5pdGlhbGl6aW5nLlxyXG5cdFx0XHRpbnB1dHMuZm9yRWFjaCggZnVuY3Rpb24gKGlucHV0KSB7XHJcblx0XHRcdFx0aWYgKCBpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoICd3cGJjX2JmYl9jb2xvcmlzJyApICkgcmV0dXJuO1xyXG5cdFx0XHRcdGlucHV0LmNsYXNzTGlzdC5hZGQoICd3cGJjX2JmYl9jb2xvcmlzJyApO1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQvLyBDcmVhdGUvcmVmcmVzaCBhIENvbG9yaXMgaW5zdGFuY2UgYm91bmQgdG8gdGhlc2UgaW5wdXRzLlxyXG5cdFx0XHQvLyBLZWVwIEhFWCBvdXRwdXQgdG8gbWF0Y2ggc2NoZW1hIGRlZmF1bHRzIChlLmcuLCBcIiNlMGUwZTBcIikuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dy5Db2xvcmlzKCB7XHJcblx0XHRcdFx0XHRlbCAgICAgICA6ICcud3BiY19iZmJfY29sb3JpcycsXHJcblx0XHRcdFx0XHRhbHBoYSAgICA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0Zm9ybWF0ICAgOiAnaGV4JyxcclxuXHRcdFx0XHRcdHRoZW1lTW9kZTogJ2F1dG8nXHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdC8vIENvbG9yaXMgYWxyZWFkeSBkaXNwYXRjaGVzICdpbnB1dCcgZXZlbnRzIG9uIHZhbHVlIGNoYW5nZXMuXHJcblx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdC8vIE5vbi1mYXRhbDogaWYgQ29sb3JpcyB0aHJvd3MgKHJhcmUpLCB0aGUgdGV4dCBpbnB1dCBzdGlsbCB3b3Jrcy5cclxuXHRcdFx0XHRjb25zb2xlLndhcm4oICdXUEJDIEluc3BlY3RvcjogQ29sb3JpcyBpbml0IGZhaWxlZDonLCBlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEJ1aWxkOiBzbGlkZXIgKyBudW1iZXIgaW4gb25lIHJvdyAod3JpdGVzIHRvIGEgc2luZ2xlIGRhdGEga2V5KS5cclxuXHRcdCAqIENvbnRyb2wgbWV0YTogeyB0eXBlOidyYW5nZV9udW1iZXInLCBrZXksIGxhYmVsLCBtaW4sIG1heCwgc3RlcCB9XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIGJ1aWxkX3JhbmdlX251bWJlcl9yb3coaW5wdXRfaWQsIGtleSwgbGFiZWxfdGV4dCwgdmFsdWUsIG1ldGEpIHtcclxuXHRcdFx0dmFyIHJvd19lbCAgID0gZWwoJ2RpdicsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fcm93JyB9KTtcclxuXHRcdFx0dmFyIGxhYmVsX2VsID0gZWwoJ2xhYmVsJywgeyAnZm9yJzogaW5wdXRfaWQsICdjbGFzcyc6ICdpbnNwZWN0b3JfX2xhYmVsJyB9LCBsYWJlbF90ZXh0IHx8IGtleSB8fCAnJyk7XHJcblx0XHRcdHZhciBjdHJsICAgICA9IGVsKCdkaXYnLCB7ICdjbGFzcyc6ICdpbnNwZWN0b3JfX2NvbnRyb2wnIH0pO1xyXG5cclxuXHRcdFx0dmFyIG1pbiAgPSAobWV0YSAmJiBtZXRhLm1pbiAhPSBudWxsKSAgPyBtZXRhLm1pbiAgOiAwO1xyXG5cdFx0XHR2YXIgbWF4ICA9IChtZXRhICYmIG1ldGEubWF4ICE9IG51bGwpICA/IG1ldGEubWF4ICA6IDEwMDtcclxuXHRcdFx0dmFyIHN0ZXAgPSAobWV0YSAmJiBtZXRhLnN0ZXAgIT0gbnVsbCkgPyBtZXRhLnN0ZXAgOiAxO1xyXG5cclxuXHRcdFx0dmFyIGdyb3VwID0gZWwoJ2RpdicsIHsgJ2NsYXNzJzogJ3dwYmNfbGVuX2dyb3VwIHdwYmNfaW5saW5lX2lucHV0cycsICdkYXRhLWxlbi1ncm91cCc6IGtleSB9KTtcclxuXHJcblx0XHRcdHZhciByYW5nZSA9IGVsKCdpbnB1dCcsIHtcclxuXHRcdFx0XHR0eXBlIDogJ3JhbmdlJyxcclxuXHRcdFx0XHQnY2xhc3MnOiAnaW5zcGVjdG9yX19pbnB1dCcsXHJcblx0XHRcdFx0J2RhdGEtbGVuLXJhbmdlJzogJycsXHJcblx0XHRcdFx0bWluICA6IFN0cmluZyhtaW4pLFxyXG5cdFx0XHRcdG1heCAgOiBTdHJpbmcobWF4KSxcclxuXHRcdFx0XHRzdGVwIDogU3RyaW5nKHN0ZXApLFxyXG5cdFx0XHRcdHZhbHVlOiBTdHJpbmcodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycgPyBtaW4gOiB2YWx1ZSlcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2YXIgbnVtID0gZWwoJ2lucHV0Jywge1xyXG5cdFx0XHRcdGlkICAgOiBpbnB1dF9pZCxcclxuXHRcdFx0XHR0eXBlIDogJ251bWJlcicsXHJcblx0XHRcdFx0J2NsYXNzJzogJ2luc3BlY3Rvcl9faW5wdXQgaW5zcGVjdG9yX193XzMwJyxcclxuXHRcdFx0XHQnZGF0YS1sZW4tdmFsdWUnOiAnJyxcclxuXHRcdFx0XHQnZGF0YS1pbnNwZWN0b3Ita2V5Jzoga2V5LFxyXG5cdFx0XHRcdG1pbiAgOiBTdHJpbmcobWluKSxcclxuXHRcdFx0XHRtYXggIDogU3RyaW5nKG1heCksXHJcblx0XHRcdFx0c3RlcCA6IFN0cmluZyhzdGVwKSxcclxuXHRcdFx0XHR2YWx1ZTogKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnKSA/IFN0cmluZyhtaW4pIDogU3RyaW5nKHZhbHVlKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGdyb3VwLmFwcGVuZENoaWxkKHJhbmdlKTtcclxuXHRcdFx0Z3JvdXAuYXBwZW5kQ2hpbGQobnVtKTtcclxuXHRcdFx0Y3RybC5hcHBlbmRDaGlsZChncm91cCk7XHJcblx0XHRcdHJvd19lbC5hcHBlbmRDaGlsZChsYWJlbF9lbCk7XHJcblx0XHRcdHJvd19lbC5hcHBlbmRDaGlsZChjdHJsKTtcclxuXHRcdFx0cmV0dXJuIHJvd19lbDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEJ1aWxkOiAobnVtYmVyICsgdW5pdCkgKyBzbGlkZXIsIHdyaXRpbmcgYSAqc2luZ2xlKiBjb21iaW5lZCBzdHJpbmcgdG8gYGtleWAuXHJcblx0XHQgKiBDb250cm9sIG1ldGE6XHJcblx0XHQgKiB7XHJcblx0XHQgKiAgIHR5cGU6J2xlbicsIGtleSwgbGFiZWwsIHVuaXRzOlsncHgnLCclJywncmVtJywnZW0nXSxcclxuXHRcdCAqICAgc2xpZGVyOiB7IHB4OnttaW46MCxtYXg6NTEyLHN0ZXA6MX0sICclJzp7bWluOjAsbWF4OjEwMCxzdGVwOjF9LCByZW06e21pbjowLG1heDoxMCxzdGVwOjAuMX0sIGVtOnsuLi59IH0sXHJcblx0XHQgKiAgIGZhbGxiYWNrX3VuaXQ6J3B4J1xyXG5cdFx0ICogfVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBidWlsZF9sZW5fY29tcG91bmRfcm93KGNvbnRyb2wsIHByb3BzX3NjaGVtYSwgZGF0YSwgdWlkKSB7XHJcblx0XHRcdHZhciBrZXkgICAgICAgID0gY29udHJvbC5rZXk7XHJcblx0XHRcdHZhciBsYWJlbF90ZXh0ID0gY29udHJvbC5sYWJlbCB8fCBrZXkgfHwgJyc7XHJcblx0XHRcdHZhciBkZWZfc3RyICAgID0gZ2V0X2luaXRpYWxfdmFsdWUoIGtleSwgZGF0YSwgcHJvcHNfc2NoZW1hICk7XHJcblx0XHRcdHZhciBmYWxsYmFja191ID0gY29udHJvbC5mYWxsYmFja191bml0IHx8ICdweCc7XHJcblx0XHRcdHZhciBwYXJzZWQgICAgID0gcGFyc2VfbGVuKCBkZWZfc3RyLCBmYWxsYmFja191ICk7XHJcblxyXG5cdFx0XHR2YXIgcm93ICAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fcm93JyB9ICk7XHJcblx0XHRcdHZhciBsYWJlbCA9IGVsKCAnbGFiZWwnLCB7ICdjbGFzcyc6ICdpbnNwZWN0b3JfX2xhYmVsJyB9LCBsYWJlbF90ZXh0ICk7XHJcblx0XHRcdHZhciBjdHJsICA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnaW5zcGVjdG9yX19jb250cm9sJyB9ICk7XHJcblxyXG5cdFx0XHR2YXIgdW5pdHMgICAgICA9IEFycmF5LmlzQXJyYXkoIGNvbnRyb2wudW5pdHMgKSAmJiBjb250cm9sLnVuaXRzLmxlbmd0aCA/IGNvbnRyb2wudW5pdHMgOiBbICdweCcsICclJywgJ3JlbScsICdlbScgXTtcclxuXHRcdFx0dmFyIHNsaWRlcl9tYXAgPSBjb250cm9sLnNsaWRlciB8fCB7XHJcblx0XHRcdFx0J3B4JyA6IHsgbWluOiAwLCBtYXg6IDUxMiwgc3RlcDogMSB9LFxyXG5cdFx0XHRcdCclJyAgOiB7IG1pbjogMCwgbWF4OiAxMDAsIHN0ZXA6IDEgfSxcclxuXHRcdFx0XHQncmVtJzogeyBtaW46IDAsIG1heDogMTAsIHN0ZXA6IDAuMSB9LFxyXG5cdFx0XHRcdCdlbScgOiB7IG1pbjogMCwgbWF4OiAxMCwgc3RlcDogMC4xIH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8vIEhvc3Qgd2l0aCBhIGhpZGRlbiBpbnB1dCB0aGF0IGNhcnJpZXMgZGF0YS1pbnNwZWN0b3Ita2V5IHRvIHJldXNlIHRoZSBzdGFuZGFyZCBoYW5kbGVyLlxyXG5cdFx0XHR2YXIgZ3JvdXAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3dwYmNfbGVuX2dyb3VwJywgJ2RhdGEtbGVuLWdyb3VwJzoga2V5IH0gKTtcclxuXHJcblx0XHRcdHZhciBpbmxpbmUgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3dwYmNfaW5saW5lX2lucHV0cycgfSApO1xyXG5cclxuXHRcdFx0dmFyIG51bSA9IGVsKCAnaW5wdXQnLCB7XHJcblx0XHRcdFx0dHlwZSAgICAgICAgICAgIDogJ251bWJlcicsXHJcblx0XHRcdFx0J2NsYXNzJyAgICAgICAgIDogJ2luc3BlY3Rvcl9faW5wdXQnLFxyXG5cdFx0XHRcdCdkYXRhLWxlbi12YWx1ZSc6ICcnLFxyXG5cdFx0XHRcdG1pbiAgICAgICAgICAgICA6ICcwJyxcclxuXHRcdFx0XHRzdGVwICAgICAgICAgICAgOiAnYW55JyxcclxuXHRcdFx0XHR2YWx1ZSAgICAgICAgICAgOiBTdHJpbmcoIHBhcnNlZC52YWx1ZSApXHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdHZhciBzZWwgPSBlbCggJ3NlbGVjdCcsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9faW5wdXQnLCAnZGF0YS1sZW4tdW5pdCc6ICcnIH0gKTtcclxuXHRcdFx0dW5pdHMuZm9yRWFjaCggZnVuY3Rpb24gKHUpIHtcclxuXHRcdFx0XHR2YXIgb3B0ID0gZWwoICdvcHRpb24nLCB7IHZhbHVlOiB1IH0sIHUgKTtcclxuXHRcdFx0XHRpZiAoIHUgPT09IHBhcnNlZC51bml0ICkgb3B0LnNldEF0dHJpYnV0ZSggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApO1xyXG5cdFx0XHRcdHNlbC5hcHBlbmRDaGlsZCggb3B0ICk7XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdGlubGluZS5hcHBlbmRDaGlsZCggbnVtICk7XHJcblx0XHRcdGlubGluZS5hcHBlbmRDaGlsZCggc2VsICk7XHJcblxyXG5cdFx0XHQvLyBTbGlkZXIgKHVuaXQtYXdhcmUpXHJcblx0XHRcdHZhciBjdXJyZW50ID0gc2xpZGVyX21hcFtwYXJzZWQudW5pdF0gfHwgc2xpZGVyX21hcFt1bml0c1swXV07XHJcblx0XHRcdHZhciByYW5nZSAgID0gZWwoICdpbnB1dCcsIHtcclxuXHRcdFx0XHR0eXBlICAgICAgICAgICAgOiAncmFuZ2UnLFxyXG5cdFx0XHRcdCdjbGFzcycgICAgICAgICA6ICdpbnNwZWN0b3JfX2lucHV0JyxcclxuXHRcdFx0XHQnZGF0YS1sZW4tcmFuZ2UnOiAnJyxcclxuXHRcdFx0XHRtaW4gICAgICAgICAgICAgOiBTdHJpbmcoIGN1cnJlbnQubWluICksXHJcblx0XHRcdFx0bWF4ICAgICAgICAgICAgIDogU3RyaW5nKCBjdXJyZW50Lm1heCApLFxyXG5cdFx0XHRcdHN0ZXAgICAgICAgICAgICA6IFN0cmluZyggY3VycmVudC5zdGVwICksXHJcblx0XHRcdFx0dmFsdWUgICAgICAgICAgIDogU3RyaW5nKCBjbGFtcF9udW0oIHBhcnNlZC52YWx1ZSwgY3VycmVudC5taW4sIGN1cnJlbnQubWF4ICkgKVxyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQvLyBIaWRkZW4gd3JpdGVyIGlucHV0IHRoYXQgdGhlIGRlZmF1bHQgSW5zcGVjdG9yIGhhbmRsZXIgd2lsbCBjYXRjaC5cclxuXHRcdFx0dmFyIGhpZGRlbiA9IGVsKCAnaW5wdXQnLCB7XHJcblx0XHRcdFx0dHlwZSAgICAgICAgICAgICAgICA6ICd0ZXh0JyxcclxuXHRcdFx0XHQnY2xhc3MnICAgICAgICAgICAgIDogJ2luc3BlY3Rvcl9faW5wdXQnLFxyXG5cdFx0XHRcdHN0eWxlICAgICAgICAgICAgICAgOiAnZGlzcGxheTpub25lJyxcclxuXHRcdFx0XHQnYXJpYS1oaWRkZW4nICAgICAgIDogJ3RydWUnLFxyXG5cdFx0XHRcdHRhYmluZGV4ICAgICAgICAgICAgOiAnLTEnLFxyXG5cdFx0XHRcdGlkICAgICAgICAgICAgICAgICAgOiAnd3BiY19pbnNfJyArIGtleSArICdfJyArIHVpZCArICdfbGVuX2hpZGRlbicsXHJcblx0XHRcdFx0J2RhdGEtaW5zcGVjdG9yLWtleSc6IGtleSxcclxuXHRcdFx0XHR2YWx1ZSAgICAgICAgICAgICAgIDogKFN0cmluZyggcGFyc2VkLnZhbHVlICkgKyBwYXJzZWQudW5pdClcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0Z3JvdXAuYXBwZW5kQ2hpbGQoIGlubGluZSApO1xyXG5cdFx0XHRncm91cC5hcHBlbmRDaGlsZCggcmFuZ2UgKTtcclxuXHRcdFx0Z3JvdXAuYXBwZW5kQ2hpbGQoIGhpZGRlbiApO1xyXG5cclxuXHRcdFx0Y3RybC5hcHBlbmRDaGlsZCggZ3JvdXAgKTtcclxuXHRcdFx0cm93LmFwcGVuZENoaWxkKCBsYWJlbCApO1xyXG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoIGN0cmwgKTtcclxuXHRcdFx0cmV0dXJuIHJvdztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFdpcmUgc3luY2luZyBmb3IgYW55IC53cGJjX2xlbl9ncm91cCBpbnNpZGUgYSBnaXZlbiByb290IChwYW5lbCkuXHJcblx0XHQgKiAtIHJhbmdlIOKHhCBudW1iZXIgc3luY1xyXG5cdFx0ICogLSB1bml0IHN3aXRjaGVzIHVwZGF0ZSBzbGlkZXIgYm91bmRzXHJcblx0XHQgKiAtIGhpZGRlbiB3cml0ZXIgKGlmIHByZXNlbnQpIGdldHMgdXBkYXRlZCBhbmQgZW1pdHMgJ2lucHV0J1xyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiB3aXJlX2xlbl9ncm91cChyb290KSB7XHJcblx0XHRcdGlmICggIXJvb3QgKSByZXR1cm47XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBmaW5kX2dyb3VwKGVsKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsICYmIGVsLmNsb3Nlc3QgJiYgZWwuY2xvc2VzdCggJy53cGJjX2xlbl9ncm91cCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XHJcblx0XHRcdFx0Ly8gU2xpZGVyIG1vdmVkIC0+IHVwZGF0ZSBudW1iZXIgKGFuZCB3cml0ZXIvaGlkZGVuKVxyXG5cdFx0XHRcdGlmICggdCAmJiB0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtbGVuLXJhbmdlJyApICkge1xyXG5cdFx0XHRcdFx0dmFyIGcgPSBmaW5kX2dyb3VwKCB0ICk7XHJcblx0XHRcdFx0XHRpZiAoICFnICkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0dmFyIG51bSA9IGcucXVlcnlTZWxlY3RvciggJ1tkYXRhLWxlbi12YWx1ZV0nICk7XHJcblx0XHRcdFx0XHRpZiAoIG51bSApIHtcclxuXHRcdFx0XHRcdFx0bnVtLnZhbHVlID0gdC52YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciB3cml0ZXIgPSBnLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1pbnNwZWN0b3Ita2V5XScgKTtcclxuXHRcdFx0XHRcdGlmICggd3JpdGVyICYmIHdyaXRlci50eXBlID09PSAndGV4dCcgKSB7XHJcblx0XHRcdFx0XHRcdHZhciB1bml0ICAgICA9IGcucXVlcnlTZWxlY3RvciggJ1tkYXRhLWxlbi11bml0XScgKTtcclxuXHRcdFx0XHRcdFx0dW5pdCAgICAgICAgID0gdW5pdCA/IHVuaXQudmFsdWUgOiAncHgnO1xyXG5cdFx0XHRcdFx0XHR3cml0ZXIudmFsdWUgPSBTdHJpbmcoIHQudmFsdWUgKSArIFN0cmluZyggdW5pdCApO1xyXG5cdFx0XHRcdFx0XHQvLyB0cmlnZ2VyIHN0YW5kYXJkIGluc3BlY3RvciBoYW5kbGVyOlxyXG5cdFx0XHRcdFx0XHR3cml0ZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSApICk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBQbGFpbiByYW5nZV9udW1iZXIgY2FzZSAobnVtYmVyIGhhcyBkYXRhLWluc3BlY3Rvci1rZXkpIC0+IGZpcmUgaW5wdXQgb24gbnVtYmVyXHJcblx0XHRcdFx0XHRcdGlmICggbnVtICYmIG51bS5oYXNBdHRyaWJ1dGUoICdkYXRhLWluc3BlY3Rvci1rZXknICkgKSB7XHJcblx0XHRcdFx0XHRcdFx0bnVtLmRpc3BhdGNoRXZlbnQoIG5ldyBFdmVudCggJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBOdW1iZXIgdHlwZWQgLT4gdXBkYXRlIHNsaWRlciBhbmQgd3JpdGVyL2hpZGRlblxyXG5cdFx0XHRcdGlmICggdCAmJiB0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtbGVuLXZhbHVlJyApICkge1xyXG5cdFx0XHRcdFx0dmFyIGcgPSBmaW5kX2dyb3VwKCB0ICk7XHJcblx0XHRcdFx0XHRpZiAoICFnICkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBnLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1sZW4tcmFuZ2VdJyApO1xyXG5cdFx0XHRcdFx0aWYgKCByICkge1xyXG5cdFx0XHRcdFx0XHQvLyBjbGFtcCB3aXRoaW4gc2xpZGVyIGJvdW5kcyBpZiBwcmVzZW50XHJcblx0XHRcdFx0XHRcdHZhciBtaW4gPSBOdW1iZXIoIHIubWluICk7XHJcblx0XHRcdFx0XHRcdHZhciBtYXggPSBOdW1iZXIoIHIubWF4ICk7XHJcblx0XHRcdFx0XHRcdHZhciB2ICAgPSBOdW1iZXIoIHQudmFsdWUgKTtcclxuXHRcdFx0XHRcdFx0aWYgKCAhaXNOYU4oIHYgKSApIHtcclxuXHRcdFx0XHRcdFx0XHR2ICAgICAgID0gY2xhbXBfbnVtKCB2LCBpc05hTiggbWluICkgPyB1bmRlZmluZWQgOiBtaW4sIGlzTmFOKCBtYXggKSA/IHVuZGVmaW5lZCA6IG1heCApO1xyXG5cdFx0XHRcdFx0XHRcdHIudmFsdWUgPSBTdHJpbmcoIHYgKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIFN0cmluZyggdiApICE9PSB0LnZhbHVlICkgdC52YWx1ZSA9IFN0cmluZyggdiApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgd3JpdGVyID0gZy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtaW5zcGVjdG9yLWtleV0nICk7XHJcblx0XHRcdFx0XHRpZiAoIHdyaXRlciAmJiB3cml0ZXIudHlwZSA9PT0gJ3RleHQnICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdW5pdCAgICAgPSBnLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1sZW4tdW5pdF0nICk7XHJcblx0XHRcdFx0XHRcdHVuaXQgICAgICAgICA9IHVuaXQgPyB1bml0LnZhbHVlIDogJ3B4JztcclxuXHRcdFx0XHRcdFx0d3JpdGVyLnZhbHVlID0gU3RyaW5nKCB0LnZhbHVlIHx8IDAgKSArIFN0cmluZyggdW5pdCApO1xyXG5cdFx0XHRcdFx0XHR3cml0ZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSApICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBlbHNlOiBudW1iZXIgaXRzZWxmIGxpa2VseSBjYXJyaWVzIGRhdGEtaW5zcGVjdG9yLWtleSAocmFuZ2VfbnVtYmVyKTsgZGVmYXVsdCBoYW5kbGVyIHdpbGwgcnVuLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdHJ1ZSApO1xyXG5cclxuXHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xyXG5cdFx0XHRcdC8vIFVuaXQgY2hhbmdlZCAtPiB1cGRhdGUgc2xpZGVyIGxpbWl0cyBhbmQgd3JpdGVyL2hpZGRlblxyXG5cdFx0XHRcdGlmICggdCAmJiB0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtbGVuLXVuaXQnICkgKSB7XHJcblx0XHRcdFx0XHR2YXIgZyA9IGZpbmRfZ3JvdXAoIHQgKTtcclxuXHRcdFx0XHRcdGlmICggIWcgKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0Ly8gRmluZCB0aGUgY29udHJvbCBtZXRhIHZpYSBhIGRhdGEgYXR0cmlidXRlIG9uIGdyb3VwIGlmIHByb3ZpZGVkXHJcblx0XHRcdFx0XHQvLyAoRmFjdG9yeSBwYXRoIHNldHMgbm90aGluZyBoZXJlOyB3ZSByZS1kZXJpdmUgZnJvbSBjdXJyZW50IHNsaWRlciBib3VuZHMuKVxyXG5cdFx0XHRcdFx0dmFyIHIgICAgICA9IGcucXVlcnlTZWxlY3RvciggJ1tkYXRhLWxlbi1yYW5nZV0nICk7XHJcblx0XHRcdFx0XHR2YXIgbnVtICAgID0gZy5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtbGVuLXZhbHVlXScgKTtcclxuXHRcdFx0XHRcdHZhciB3cml0ZXIgPSBnLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1pbnNwZWN0b3Ita2V5XScgKTtcclxuXHRcdFx0XHRcdHZhciB1bml0ICAgPSB0LnZhbHVlIHx8ICdweCc7XHJcblxyXG5cdFx0XHRcdFx0Ly8gQWRqdXN0IHNsaWRlciBib3VuZHMgaGV1cmlzdGljYWxseSAobWF0Y2ggRmFjdG9yeSBkZWZhdWx0cylcclxuXHRcdFx0XHRcdHZhciBib3VuZHNfYnlfdW5pdCA9IHtcclxuXHRcdFx0XHRcdFx0J3B4JyA6IHsgbWluOiAwLCBtYXg6IDUxMiwgc3RlcDogMSB9LFxyXG5cdFx0XHRcdFx0XHQnJScgIDogeyBtaW46IDAsIG1heDogMTAwLCBzdGVwOiAxIH0sXHJcblx0XHRcdFx0XHRcdCdyZW0nOiB7IG1pbjogMCwgbWF4OiAxMCwgc3RlcDogMC4xIH0sXHJcblx0XHRcdFx0XHRcdCdlbScgOiB7IG1pbjogMCwgbWF4OiAxMCwgc3RlcDogMC4xIH1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRpZiAoIHIgKSB7XHJcblx0XHRcdFx0XHRcdHZhciBiICA9IGJvdW5kc19ieV91bml0W3VuaXRdIHx8IGJvdW5kc19ieV91bml0WydweCddO1xyXG5cdFx0XHRcdFx0XHRyLm1pbiAgPSBTdHJpbmcoIGIubWluICk7XHJcblx0XHRcdFx0XHRcdHIubWF4ICA9IFN0cmluZyggYi5tYXggKTtcclxuXHRcdFx0XHRcdFx0ci5zdGVwID0gU3RyaW5nKCBiLnN0ZXAgKTtcclxuXHRcdFx0XHRcdFx0Ly8gY2xhbXAgdG8gbmV3IGJvdW5kc1xyXG5cdFx0XHRcdFx0XHR2YXIgdiAgPSBOdW1iZXIoIG51bSAmJiBudW0udmFsdWUgPyBudW0udmFsdWUgOiByLnZhbHVlICk7XHJcblx0XHRcdFx0XHRcdGlmICggIWlzTmFOKCB2ICkgKSB7XHJcblx0XHRcdFx0XHRcdFx0diAgICAgICA9IGNsYW1wX251bSggdiwgYi5taW4sIGIubWF4ICk7XHJcblx0XHRcdFx0XHRcdFx0ci52YWx1ZSA9IFN0cmluZyggdiApO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggbnVtICkgbnVtLnZhbHVlID0gU3RyaW5nKCB2ICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICggd3JpdGVyICYmIHdyaXRlci50eXBlID09PSAndGV4dCcgKSB7XHJcblx0XHRcdFx0XHRcdHZhciB2ICAgICAgICA9IG51bSAmJiBudW0udmFsdWUgPyBudW0udmFsdWUgOiAociA/IHIudmFsdWUgOiAnMCcpO1xyXG5cdFx0XHRcdFx0XHR3cml0ZXIudmFsdWUgPSBTdHJpbmcoIHYgKSArIFN0cmluZyggdW5pdCApO1xyXG5cdFx0XHRcdFx0XHR3cml0ZXIuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSApICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0cnVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gPT0gIEMgTyBOIFQgUiBPIEwgID09XHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdFx0LyoqXHJcblx0ICogU2NoZW1hID4gSW5zcGVjdG9yID4gQ29udHJvbCBFbGVtZW50LCBlLmcuIElucHV0ISAgQnVpbGQgYSBzaW5nbGUgY29udHJvbCByb3c6XHJcblx0ICogPGRpdiBjbGFzcz1cImluc3BlY3Rvcl9fcm93XCI+XHJcblx0ICogICA8bGFiZWwgY2xhc3M9XCJpbnNwZWN0b3JfX2xhYmVsXCIgZm9yPVwiLi4uXCI+TGFiZWw8L2xhYmVsPlxyXG5cdCAqICAgPGRpdiBjbGFzcz1cImluc3BlY3Rvcl9fY29udHJvbFwiPjxpbnB1dHx0ZXh0YXJlYXxzZWxlY3QgY2xhc3M9XCJpbnNwZWN0b3JfX2lucHV0XCIgLi4uPjwvZGl2PlxyXG5cdCAqIDwvZGl2PlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbnRyb2wgICAgICAgICAgIC0gc2NoZW1hIGNvbnRyb2wgbWV0YSAoe3R5cGUsa2V5LGxhYmVsLC4uLn0pXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzX3NjaGVtYSAgICAgIC0gc2NoZW1hLnByb3BzXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGEgICAgICAgICAgICAgIC0gY3VycmVudCBlbGVtZW50IGRhdGEtKiBtYXBcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdWlkICAgICAgICAgICAgICAgLSB1bmlxdWUgc3VmZml4IGZvciBpbnB1dCBpZHNcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gY3R4ICAgICAgICAgICAgICAgLSB7IGVsLCBidWlsZGVyLCB0eXBlLCBkYXRhIH1cclxuXHQgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XHJcblx0ICovXHJcblx0XHRmdW5jdGlvbiBidWlsZF9jb250cm9sKGNvbnRyb2wsIHByb3BzX3NjaGVtYSwgZGF0YSwgdWlkLCBjdHgpIHtcclxuXHRcdFx0dmFyIHR5cGUgPSBjb250cm9sLnR5cGU7XHJcblx0XHRcdHZhciBrZXkgID0gY29udHJvbC5rZXk7XHJcblxyXG5cdFx0XHR2YXIgbGFiZWxfdGV4dCA9IGNvbnRyb2wubGFiZWwgfHwga2V5IHx8ICcnO1xyXG5cdFx0XHR2YXIgcHJvcF9tZXRhICA9IChrZXkgPyAocHJvcHNfc2NoZW1hW2tleV0gfHwgeyB0eXBlOiAnc3RyaW5nJyB9KSA6IHsgdHlwZTogJ3N0cmluZycgfSk7XHJcblx0XHRcdHZhciB2YWx1ZSAgICAgID0gY29lcmNlX2J5X3R5cGUoIGdldF9pbml0aWFsX3ZhbHVlKCBrZXksIGRhdGEsIHByb3BzX3NjaGVtYSApLCBwcm9wX21ldGEudHlwZSApO1xyXG5cdFx0Ly8gQWxsb3cgdmFsdWVfZnJvbSBvdmVycmlkZSAoY29tcHV0ZWQgYXQgcmVuZGVyLXRpbWUpLlxyXG5cdFx0aWYgKCBjb250cm9sICYmIGNvbnRyb2wudmFsdWVfZnJvbSAmJiB3LndwYmNfYmZiX2luc3BlY3Rvcl9mYWN0b3J5X3ZhbHVlX2Zyb21bY29udHJvbC52YWx1ZV9mcm9tXSApIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGNvbXB1dGVkID0gdy53cGJjX2JmYl9pbnNwZWN0b3JfZmFjdG9yeV92YWx1ZV9mcm9tW2NvbnRyb2wudmFsdWVfZnJvbV0oIGN0eCB8fCB7fSApO1xyXG5cdFx0XHRcdFx0dmFsdWUgICAgICAgID0gY29lcmNlX2J5X3R5cGUoIGNvbXB1dGVkLCBwcm9wX21ldGEudHlwZSApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCAndmFsdWVfZnJvbSBmYWlsZWQgZm9yJywgY29udHJvbC52YWx1ZV9mcm9tLCBlICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaW5wdXRfaWQgPSAnd3BiY19pbnNfJyArIGtleSArICdfJyArIHVpZDtcclxuXHJcblx0XHRcdHZhciByb3dfZWwgICAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fcm93JyB9ICk7XHJcblx0XHRcdHZhciBsYWJlbF9lbCAgPSBlbCggJ2xhYmVsJywgeyAnZm9yJzogaW5wdXRfaWQsICdjbGFzcyc6ICdpbnNwZWN0b3JfX2xhYmVsJyB9LCBsYWJlbF90ZXh0ICk7XHJcblx0XHRcdHZhciBjdHJsX3dyYXAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fY29udHJvbCcgfSApO1xyXG5cclxuXHRcdFx0dmFyIGZpZWxkX2VsO1xyXG5cclxuXHRcdC8vIC0tLSBzbG90IGhvc3QgKG5hbWVkIFVJIGluamVjdGlvbikgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdGlmICggdHlwZSA9PT0gJ3Nsb3QnICYmIGNvbnRyb2wuc2xvdCApIHtcclxuXHRcdFx0Ly8gYWRkIGEgbWFya2VyIGNsYXNzIGZvciB0aGUgbGF5b3V0IGNoaXBzIHJvd1xyXG5cdFx0XHR2YXIgY2xhc3NlcyA9ICdpbnNwZWN0b3JfX3JvdyBpbnNwZWN0b3JfX3Jvdy0tc2xvdCc7XHJcblx0XHRcdGlmICggY29udHJvbC5zbG90ID09PSAnbGF5b3V0X2NoaXBzJyApIGNsYXNzZXMgKz0gJyBpbnNwZWN0b3JfX3Jvdy0tbGF5b3V0LWNoaXBzJztcclxuXHJcblx0XHRcdHZhciBzbG90X3JvdyA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiBjbGFzc2VzIH0gKTtcclxuXHJcblx0XHRcdGlmICggbGFiZWxfdGV4dCApIHNsb3Rfcm93LmFwcGVuZENoaWxkKCBlbCggJ2xhYmVsJywgeyAnY2xhc3MnOiAnaW5zcGVjdG9yX19sYWJlbCcgfSwgbGFiZWxfdGV4dCApICk7XHJcblxyXG5cdFx0XHQvLyBhZGQgYSBkYXRhIGF0dHJpYnV0ZSBvbiB0aGUgaG9zdCBzbyBib3RoIENTUyBhbmQgdGhlIHNhZmV0eS1uZXQgY2FuIHRhcmdldCBpdFxyXG5cdFx0XHR2YXIgaG9zdF9hdHRycyA9IHsgJ2NsYXNzJzogJ2luc3BlY3Rvcl9fY29udHJvbCcgfTtcclxuXHRcdFx0aWYgKCBjb250cm9sLnNsb3QgPT09ICdsYXlvdXRfY2hpcHMnICkgaG9zdF9hdHRyc1snZGF0YS1iZmItc2xvdCddID0gJ2xheW91dF9jaGlwcyc7XHJcblxyXG5cdFx0XHR2YXIgc2xvdF9ob3N0ID0gZWwoICdkaXYnLCBob3N0X2F0dHJzICk7XHJcblx0XHRcdHNsb3Rfcm93LmFwcGVuZENoaWxkKCBzbG90X2hvc3QgKTtcclxuXHJcblx0XHRcdHZhciBzbG90X2ZuID0gdy53cGJjX2JmYl9pbnNwZWN0b3JfZmFjdG9yeV9zbG90c1tjb250cm9sLnNsb3RdO1xyXG5cdFx0XHRpZiAoIHR5cGVvZiBzbG90X2ZuID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHNsb3RfZm4oIHNsb3RfaG9zdCwgY3R4IHx8IHt9ICk7XHJcblx0XHRcdFx0XHR9IGNhdGNoICggZSApIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCAnc2xvdCBcIicgKyBjb250cm9sLnNsb3QgKyAnXCIgZmFpbGVkOicsIGUgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCAwICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2xvdF9ob3N0LmFwcGVuZENoaWxkKCBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3dwYmNfYmZiX19zbG90X19taXNzaW5nJyB9LCAnW3Nsb3Q6ICcgKyBjb250cm9sLnNsb3QgKyAnXScgKSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzbG90X3JvdztcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0XHRpZiAoIHR5cGUgPT09ICd0ZXh0YXJlYScgKSB7XHJcblx0XHRcdFx0ZmllbGRfZWwgPSBlbCggJ3RleHRhcmVhJywge1xyXG5cdFx0XHRcdFx0aWQgICAgICAgICAgICAgICAgICA6IGlucHV0X2lkLFxyXG5cdFx0XHRcdFx0J2RhdGEtaW5zcGVjdG9yLWtleSc6IGtleSxcclxuXHRcdFx0XHRcdHJvd3MgICAgICAgICAgICAgICAgOiBjb250cm9sLnJvd3MgfHwgMyxcclxuXHRcdFx0XHRcdCdjbGFzcycgICAgICAgICAgICAgOiAnaW5zcGVjdG9yX19pbnB1dCdcclxuXHRcdFx0XHR9LCAodmFsdWUgPT0gbnVsbCA/ICcnIDogU3RyaW5nKCB2YWx1ZSApKSApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlID09PSAnc2VsZWN0JyApIHtcclxuXHRcdFx0XHRmaWVsZF9lbCA9IGVsKCAnc2VsZWN0Jywge1xyXG5cdFx0XHRcdFx0aWQgICAgICAgICAgICAgICAgICA6IGlucHV0X2lkLFxyXG5cdFx0XHRcdFx0J2RhdGEtaW5zcGVjdG9yLWtleSc6IGtleSxcclxuXHRcdFx0XHRcdCdjbGFzcycgICAgICAgICAgICAgOiAnaW5zcGVjdG9yX19pbnB1dCdcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0bm9ybWFsaXplX3NlbGVjdF9vcHRpb25zKCBjb250cm9sLm9wdGlvbnMgfHwgW10gKS5mb3JFYWNoKCBmdW5jdGlvbiAob3B0KSB7XHJcblx0XHRcdFx0XHR2YXIgb3B0X2VsID0gZWwoICdvcHRpb24nLCB7IHZhbHVlOiBvcHQudmFsdWUgfSwgb3B0LmxhYmVsICk7XHJcblx0XHRcdFx0XHRpZiAoIFN0cmluZyggdmFsdWUgKSA9PT0gb3B0LnZhbHVlICkgb3B0X2VsLnNldEF0dHJpYnV0ZSggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApO1xyXG5cdFx0XHRcdFx0ZmllbGRfZWwuYXBwZW5kQ2hpbGQoIG9wdF9lbCApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gJ2NoZWNrYm94JyApIHtcclxuXHRcdFx0XHQvLyBmaWVsZF9lbCA9IGVsKCAnaW5wdXQnLCB7IGlkOiBpbnB1dF9pZCwgdHlwZTogJ2NoZWNrYm94JywgJ2RhdGEtaW5zcGVjdG9yLWtleSc6IGtleSwgY2hlY2tlZDogISF2YWx1ZSwgJ2NsYXNzJzogJ2luc3BlY3Rvcl9faW5wdXQnIH0gKTsgLy8uXHJcblxyXG5cdFx0XHRcdC8vIFJlbmRlciBhcyB0b2dnbGUgVUkgaW5zdGVhZCBvZiBsYWJlbC1sZWZ0ICsgY2hlY2tib3guICBOb3RlOiB3ZSByZXR1cm4gdGhlIGZ1bGwgdG9nZ2xlIHJvdyBoZXJlIGFuZCBza2lwIHRoZSBkZWZhdWx0IHJvdy9sYWJlbCBmbG93IGJlbG93LlxyXG5cdFx0XHRcdHJldHVybiBidWlsZF90b2dnbGVfcm93KCBpbnB1dF9pZCwga2V5LCAhIXZhbHVlLCBsYWJlbF90ZXh0ICk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlID09PSAncmFuZ2VfbnVtYmVyJyApIHtcclxuXHRcdFx0XHQvLyAtLS0gbmV3OiBzbGlkZXIgKyBudW1iZXIgKHNpbmdsZSBrZXkpLlxyXG5cdFx0XHRcdHZhciBybl9pZCAgPSAnd3BiY19pbnNfJyArIGtleSArICdfJyArIHVpZDtcclxuXHRcdFx0XHR2YXIgcm5fdmFsID0gdmFsdWU7IC8vIGZyb20gZ2V0X2luaXRpYWxfdmFsdWUvcHJvcF9tZXRhIGFscmVhZHkuXHJcblx0XHRcdFx0cmV0dXJuIGJ1aWxkX3JhbmdlX251bWJlcl9yb3coIHJuX2lkLCBrZXksIGxhYmVsX3RleHQsIHJuX3ZhbCwgY29udHJvbCApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gJ2xlbicgKSB7XHJcblx0XHRcdFx0Ly8gLS0tIG5ldzogbGVuZ3RoIGNvbXBvdW5kICh2YWx1ZSt1bml0K3NsaWRlciAtPiB3cml0ZXMgYSBzaW5nbGUgc3RyaW5nIGtleSkuXHJcblx0XHRcdFx0cmV0dXJuIGJ1aWxkX2xlbl9jb21wb3VuZF9yb3coIGNvbnRyb2wsIHByb3BzX3NjaGVtYSwgZGF0YSwgdWlkICk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlID09PSAnY29sb3InICkge1xyXG5cdFx0XHRcdC8vIENvbG9yIHBpY2tlciAoQ29sb3JpcykuIFN0b3JlIGFzIHN0cmluZyAoZS5nLiwgXCIjZTBlMGUwXCIpLlxyXG5cdFx0XHRcdGZpZWxkX2VsID0gZWwoICdpbnB1dCcsIHtcclxuXHRcdFx0XHRcdGlkICAgICAgICAgICAgICAgICAgIDogaW5wdXRfaWQsXHJcblx0XHRcdFx0XHR0eXBlICAgICAgICAgICAgICAgICA6ICd0ZXh0JyxcclxuXHRcdFx0XHRcdCdkYXRhLWluc3BlY3Rvci1rZXknIDoga2V5LFxyXG5cdFx0XHRcdFx0J2RhdGEtaW5zcGVjdG9yLXR5cGUnOiAnY29sb3InLFxyXG5cdFx0XHRcdFx0J2RhdGEtY29sb3JpcycgICAgICAgOiAnJyxcclxuXHRcdFx0XHRcdCdjbGFzcycgICAgICAgICAgICAgIDogJ2luc3BlY3Rvcl9faW5wdXQnLFxyXG5cdFx0XHRcdFx0J2RhdGEtZGVmYXVsdC1jb2xvcicgOiAoIHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09ICcnID8gU3RyaW5nKHZhbHVlKSA6IChjb250cm9sLnBsYWNlaG9sZGVyIHx8ICcnKSApXHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdGlmICggdmFsdWUgIT09ICcnICkge1xyXG5cdFx0XHRcdFx0ZmllbGRfZWwudmFsdWUgPSBTdHJpbmcoIHZhbHVlICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIHRleHQvbnVtYmVyIGRlZmF1bHQuXHJcblx0XHRcdFx0dmFyIGF0dHJzID0ge1xyXG5cdFx0XHRcdFx0aWQgICAgICAgICAgICAgICAgICA6IGlucHV0X2lkLFxyXG5cdFx0XHRcdFx0dHlwZSAgICAgICAgICAgICAgICA6ICh0eXBlID09PSAnbnVtYmVyJykgPyAnbnVtYmVyJyA6ICd0ZXh0JyxcclxuXHRcdFx0XHRcdCdkYXRhLWluc3BlY3Rvci1rZXknOiBrZXksXHJcblx0XHRcdFx0XHQnY2xhc3MnICAgICAgICAgICAgIDogJ2luc3BlY3Rvcl9faW5wdXQnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0Ly8gbnVtYmVyIGNvbnN0cmFpbnRzIChzY2hlbWEgb3IgY29udHJvbClcclxuXHRcdFx0XHRpZiAoIHR5cGUgPT09ICdudW1iZXInICkge1xyXG5cdFx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHByb3BfbWV0YSwgJ21pbicgKSApIGF0dHJzLm1pbiA9IHByb3BfbWV0YS5taW47XHJcblx0XHRcdFx0XHRpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggcHJvcF9tZXRhLCAnbWF4JyApICkgYXR0cnMubWF4ID0gcHJvcF9tZXRhLm1heDtcclxuXHRcdFx0XHRcdGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBwcm9wX21ldGEsICdzdGVwJyApICkgYXR0cnMuc3RlcCA9IHByb3BfbWV0YS5zdGVwO1xyXG5cdFx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIGNvbnRyb2wsICdtaW4nICkgKSBhdHRycy5taW4gPSBjb250cm9sLm1pbjtcclxuXHRcdFx0XHRcdGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBjb250cm9sLCAnbWF4JyApICkgYXR0cnMubWF4ID0gY29udHJvbC5tYXg7XHJcblx0XHRcdFx0XHRpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggY29udHJvbCwgJ3N0ZXAnICkgKSBhdHRycy5zdGVwID0gY29udHJvbC5zdGVwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWVsZF9lbCA9IGVsKCAnaW5wdXQnLCBhdHRycyApO1xyXG5cdFx0XHRcdGlmICggdmFsdWUgIT09ICcnICkgZmllbGRfZWwudmFsdWUgPSBTdHJpbmcoIHZhbHVlICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGN0cmxfd3JhcC5hcHBlbmRDaGlsZCggZmllbGRfZWwgKTtcclxuXHRcdFx0cm93X2VsLmFwcGVuZENoaWxkKCBsYWJlbF9lbCApO1xyXG5cdFx0XHRyb3dfZWwuYXBwZW5kQ2hpbGQoIGN0cmxfd3JhcCApO1xyXG5cdFx0XHRyZXR1cm4gcm93X2VsO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NoZW1hID4gSW5zcGVjdG9yID4gR3JvdXBzISBCdWlsZCBhbiBpbnNwZWN0b3IgZ3JvdXAgKGNvbGxhcHNpYmxlKS5cclxuXHRcdCAqIFN0cnVjdHVyZTpcclxuXHRcdCAqIDxzZWN0aW9uIGNsYXNzPVwid3BiY19iZmJfX2luc3BlY3Rvcl9fZ3JvdXAgd3BiY191aV9fY29sbGFwc2libGVfZ3JvdXAgaXMtb3BlblwiIGRhdGEtZ3JvdXA9XCIuLi5cIj5cclxuXHRcdCAqICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJncm91cF9faGVhZGVyXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCIgYXJpYS1jb250cm9scz1cIndwYmNfY29sbGFwc2libGVfcGFuZWxfWFwiPlxyXG5cdFx0ICogICAgIDxoMz5Hcm91cCBUaXRsZTwvaDM+XHJcblx0XHQgKiAgICAgPGkgY2xhc3M9XCJ3cGJjX3VpX2VsX192ZXJ0X21lbnVfcm9vdF9zZWN0aW9uX2ljb24gbWVudV9pY29uIGljb24tMXggd3BiYy1iaS1jaGV2cm9uLXJpZ2h0XCI+PC9pPlxyXG5cdFx0ICogICA8L2J1dHRvbj5cclxuXHRcdCAqICAgPGRpdiBjbGFzcz1cImdyb3VwX19maWVsZHNcIiBpZD1cIndwYmNfY29sbGFwc2libGVfcGFuZWxfWFwiIGFyaWEtaGlkZGVuPVwiZmFsc2VcIj4g4oCmcm93c+KApiA8L2Rpdj5cclxuXHRcdCAqIDwvc2VjdGlvbj5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZ3JvdXBcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc19zY2hlbWFcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdWlkXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gY3R4XHJcblx0XHQgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIGJ1aWxkX2dyb3VwKGdyb3VwLCBwcm9wc19zY2hlbWEsIGRhdGEsIHVpZCwgY3R4KSB7XHJcblx0XHRcdHZhciBpc19vcGVuICA9ICEhZ3JvdXAub3BlbjtcclxuXHRcdFx0dmFyIHBhbmVsX2lkID0gJ3dwYmNfY29sbGFwc2libGVfcGFuZWxfJyArIHVpZCArICdfJyArIChncm91cC5rZXkgfHwgJ2cnKTtcclxuXHJcblx0XHRcdHZhciBzZWN0aW9uID0gZWwoICdzZWN0aW9uJywge1xyXG5cdFx0XHRcdCdjbGFzcycgICAgIDogJ3dwYmNfYmZiX19pbnNwZWN0b3JfX2dyb3VwIHdwYmNfdWlfX2NvbGxhcHNpYmxlX2dyb3VwJyArIChpc19vcGVuID8gJyBpcy1vcGVuJyA6ICcnKSxcclxuXHRcdFx0XHQnZGF0YS1ncm91cCc6IGdyb3VwLmtleSB8fCAnJ1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHR2YXIgaGVhZGVyX2J0biA9IGVsKCAnYnV0dG9uJywge1xyXG5cdFx0XHRcdHR5cGUgICAgICAgICAgIDogJ2J1dHRvbicsXHJcblx0XHRcdFx0J2NsYXNzJyAgICAgICAgOiAnZ3JvdXBfX2hlYWRlcicsXHJcblx0XHRcdFx0cm9sZSAgICAgICAgICAgOiAnYnV0dG9uJyxcclxuXHRcdFx0XHQnYXJpYS1leHBhbmRlZCc6IGlzX29wZW4gPyAndHJ1ZScgOiAnZmFsc2UnLFxyXG5cdFx0XHRcdCdhcmlhLWNvbnRyb2xzJzogcGFuZWxfaWRcclxuXHRcdFx0fSwgW1xyXG5cdFx0XHRcdGVsKCAnaDMnLCBudWxsLCBncm91cC50aXRsZSB8fCBncm91cC5sYWJlbCB8fCBncm91cC5rZXkgfHwgJycgKSxcclxuXHRcdFx0XHRlbCggJ2knLCB7ICdjbGFzcyc6ICd3cGJjX3VpX2VsX192ZXJ0X21lbnVfcm9vdF9zZWN0aW9uX2ljb24gbWVudV9pY29uIGljb24tMXggd3BiYy1iaS1jaGV2cm9uLXJpZ2h0JyB9IClcclxuXHRcdFx0XSApO1xyXG5cclxuXHRcdFx0dmFyIGZpZWxkcyA9IGVsKCAnZGl2Jywge1xyXG5cdFx0XHRcdCdjbGFzcycgICAgICA6ICdncm91cF9fZmllbGRzJyxcclxuXHRcdFx0XHRpZCAgICAgICAgICAgOiBwYW5lbF9pZCxcclxuXHRcdFx0XHQnYXJpYS1oaWRkZW4nOiBpc19vcGVuID8gJ2ZhbHNlJyA6ICd0cnVlJ1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBhc0FycmF5KHgpIHtcclxuXHRcdFx0XHRpZiAoIEFycmF5LmlzQXJyYXkoIHggKSApIHJldHVybiB4O1xyXG5cdFx0XHRcdGlmICggeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgKSByZXR1cm4gT2JqZWN0LnZhbHVlcyggeCApO1xyXG5cdFx0XHRcdHJldHVybiB4ICE9IG51bGwgPyBbIHggXSA6IFtdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhc0FycmF5KCBncm91cC5jb250cm9scyApLmZvckVhY2goIGZ1bmN0aW9uIChjb250cm9sKSB7XHJcblx0XHRcdFx0ZmllbGRzLmFwcGVuZENoaWxkKCBidWlsZF9jb250cm9sKCBjb250cm9sLCBwcm9wc19zY2hlbWEsIGRhdGEsIHVpZCwgY3R4ICkgKTtcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0c2VjdGlvbi5hcHBlbmRDaGlsZCggaGVhZGVyX2J0biApO1xyXG5cdFx0XHRzZWN0aW9uLmFwcGVuZENoaWxkKCBmaWVsZHMgKTtcclxuXHRcdFx0cmV0dXJuIHNlY3Rpb247XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTY2hlbWEgPiBJbnNwZWN0b3IgPiBIZWFkZXIhIEJ1aWxkIGluc3BlY3RvciBoZWFkZXIgd2l0aCBhY3Rpb24gYnV0dG9ucyB3aXJlZCB0byBleGlzdGluZyBkYXRhLWFjdGlvbiBoYW5kbGVycy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGhlYWRlcl9hY3Rpb25zXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgIHRpdGxlX3RleHRcclxuXHRcdCAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gYnVpbGRfaGVhZGVyKGluc3BlY3Rvcl91aSwgdGl0bGVfZmFsbGJhY2ssIHNjaGVtYV9mb3JfdHlwZSkge1xyXG5cclxuXHRcdFx0aW5zcGVjdG9yX3VpICAgICAgPSBpbnNwZWN0b3JfdWkgfHwge307XHJcblx0XHRcdHNjaGVtYV9mb3JfdHlwZSAgID0gc2NoZW1hX2Zvcl90eXBlIHx8IHt9O1xyXG5cdFx0XHR2YXIgdmFyaWFudCAgICAgICA9IGluc3BlY3Rvcl91aS5oZWFkZXJfdmFyaWFudCB8fCAnbWluaW1hbCc7XHJcblx0XHRcdHZhciBoZWFkZXJBY3Rpb25zID0gaW5zcGVjdG9yX3VpLmhlYWRlcl9hY3Rpb25zXHJcblx0XHRcdFx0fHwgc2NoZW1hX2Zvcl90eXBlLmhlYWRlcl9hY3Rpb25zXHJcblx0XHRcdFx0fHwgWyAnZGVzZWxlY3QnLCAnc2Nyb2xsdG8nLCAnbW92ZS11cCcsICdtb3ZlLWRvd24nLCAnZHVwbGljYXRlJywgJ2RlbGV0ZScgXTtcclxuXHJcblx0XHRcdHZhciB0aXRsZSAgICAgICA9IGluc3BlY3Rvcl91aS50aXRsZSB8fCB0aXRsZV9mYWxsYmFjayB8fCAnJztcclxuXHRcdFx0dmFyIGRlc2NyaXB0aW9uID0gaW5zcGVjdG9yX3VpLmRlc2NyaXB0aW9uIHx8ICcnO1xyXG5cclxuXHRcdFx0Ly8gaGVscGVyIHRvIGNyZWF0ZSBhIGJ1dHRvbiBmb3IgZWl0aGVyIGhlYWRlciBzdHlsZVxyXG5cdFx0XHRmdW5jdGlvbiBhY3Rpb25CdG4oYWN0LCBtaW5pbWFsKSB7XHJcblx0XHRcdFx0aWYgKCBtaW5pbWFsICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsKCAnYnV0dG9uJywgeyB0eXBlOiAnYnV0dG9uJywgJ2NsYXNzJzogJ2J1dHRvbi1saW5rJywgJ2RhdGEtYWN0aW9uJzogYWN0IH0sICcnICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIHRvb2xiYXIgdmFyaWFudCAocmljaClcclxuXHRcdFx0XHR2YXIgaWNvbk1hcCA9IHtcclxuXHRcdFx0XHRcdCdkZXNlbGVjdCcgOiAnd3BiY19pY25fcmVtb3ZlX2RvbmUnLFxyXG5cdFx0XHRcdFx0J3Njcm9sbHRvJyA6ICd3cGJjX2ljbl9hZHNfY2xpY2sgZmlsdGVyX2NlbnRlcl9mb2N1cycsXHJcblx0XHRcdFx0XHQnbW92ZS11cCcgIDogJ3dwYmNfaWNuX2Fycm93X3Vwd2FyZCcsXHJcblx0XHRcdFx0XHQnbW92ZS1kb3duJzogJ3dwYmNfaWNuX2Fycm93X2Rvd253YXJkJyxcclxuXHRcdFx0XHRcdCdkdXBsaWNhdGUnOiAnd3BiY19pY25fY29udGVudF9jb3B5JyxcclxuXHRcdFx0XHRcdCdkZWxldGUnICAgOiAnd3BiY19pY25fZGVsZXRlX291dGxpbmUnXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR2YXIgY2xhc3NlcyA9ICdidXR0b24gYnV0dG9uLXNlY29uZGFyeSB3cGJjX3VpX2NvbnRyb2wgd3BiY191aV9idXR0b24nO1xyXG5cdFx0XHRcdGlmICggYWN0ID09PSAnZGVsZXRlJyApIGNsYXNzZXMgKz0gJyB3cGJjX3VpX2J1dHRvbl9kYW5nZXIgYnV0dG9uLWxpbmstZGVsZXRlJztcclxuXHJcblx0XHRcdFx0dmFyIGJ0biA9IGVsKCAnYnV0dG9uJywge1xyXG5cdFx0XHRcdFx0dHlwZSAgICAgICAgIDogJ2J1dHRvbicsXHJcblx0XHRcdFx0XHQnY2xhc3MnICAgICAgOiBjbGFzc2VzLFxyXG5cdFx0XHRcdFx0J2RhdGEtYWN0aW9uJzogYWN0LFxyXG5cdFx0XHRcdFx0J2FyaWEtbGFiZWwnIDogYWN0LnJlcGxhY2UoIC8tL2csICcgJyApXHJcblx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHRpZiAoIGFjdCA9PT0gJ2RlbGV0ZScgKSB7XHJcblx0XHRcdFx0XHRidG4uYXBwZW5kQ2hpbGQoIGVsKCAnc3BhbicsIHsgJ2NsYXNzJzogJ2luLWJ1dHRvbi10ZXh0JyB9LCAnRGVsZXRlJyApICk7XHJcblx0XHRcdFx0XHRidG4uYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCAnICcgKSApOyAvLyBtaW5vciBzcGFjaW5nIGJlZm9yZSBpY29uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJ0bi5hcHBlbmRDaGlsZCggZWwoICdpJywgeyAnY2xhc3MnOiAnbWVudV9pY29uIGljb24tMXggJyArIChpY29uTWFwW2FjdF0gfHwgJycpIH0gKSApO1xyXG5cdFx0XHRcdHJldHVybiBidG47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vID09PSBtaW5pbWFsIGhlYWRlciAoZXhpc3RpbmcgbG9vazsgZGVmYXVsdCkgPT09XHJcblx0XHRcdGlmICggdmFyaWFudCAhPT0gJ3Rvb2xiYXInICkge1xyXG5cdFx0XHRcdHZhciBoZWFkZXIgPSBlbCggJ2hlYWRlcicsIHsgJ2NsYXNzJzogJ3dwYmNfYmZiX19pbnNwZWN0b3JfX2hlYWRlcicgfSApO1xyXG5cdFx0XHRcdGhlYWRlci5hcHBlbmRDaGlsZCggZWwoICdoMycsIG51bGwsIHRpdGxlIHx8ICcnICkgKTtcclxuXHJcblx0XHRcdFx0dmFyIGFjdGlvbnMgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3dwYmNfYmZiX19pbnNwZWN0b3JfX2hlYWRlcl9hY3Rpb25zJyB9ICk7XHJcblx0XHRcdFx0aGVhZGVyQWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiAoYWN0KSB7XHJcblx0XHRcdFx0XHRhY3Rpb25zLmFwcGVuZENoaWxkKCBhY3Rpb25CdG4oIGFjdCwgLyptaW5pbWFsKi90cnVlICkgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0aGVhZGVyLmFwcGVuZENoaWxkKCBhY3Rpb25zICk7XHJcblx0XHRcdFx0cmV0dXJuIGhlYWRlcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gPT09IHRvb2xiYXIgaGVhZGVyIChyaWNoIHRpdGxlL2Rlc2MgKyBncm91cGVkIGJ1dHRvbnMpID09PVxyXG5cdFx0XHR2YXIgcm9vdCA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnd3BiY19iZmJfX2luc3BlY3Rvcl9faGVhZCcgfSApO1xyXG5cdFx0XHR2YXIgd3JhcCA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnaGVhZGVyX2NvbnRhaW5lcicgfSApO1xyXG5cdFx0XHR2YXIgbGVmdCA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnaGVhZGVyX3RpdGxlX2NvbnRlbnQnIH0gKTtcclxuXHRcdFx0dmFyIGgzICAgPSBlbCggJ2gzJywgeyAnY2xhc3MnOiAndGl0bGUnIH0sIHRpdGxlIHx8ICcnICk7XHJcblx0XHRcdGxlZnQuYXBwZW5kQ2hpbGQoIGgzICk7XHJcblx0XHRcdGlmICggZGVzY3JpcHRpb24gKSB7XHJcblx0XHRcdFx0bGVmdC5hcHBlbmRDaGlsZCggZWwoICdkaXYnLCB7ICdjbGFzcyc6ICdkZXNjJyB9LCBkZXNjcmlwdGlvbiApICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciByaWdodCA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAnYWN0aW9ucyB3cGJjX2FqeF90b29sYmFyIHdwYmNfbm9fYm9yZGVycycgfSApO1xyXG5cdFx0XHR2YXIgdWlDICAgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3VpX2NvbnRhaW5lciB1aV9jb250YWluZXJfc21hbGwnIH0gKTtcclxuXHRcdFx0dmFyIHVpRyAgID0gZWwoICdkaXYnLCB7ICdjbGFzcyc6ICd1aV9ncm91cCcgfSApO1xyXG5cclxuXHRcdFx0Ly8gU3BsaXQgaW50byB2aXN1YWwgZ3JvdXBzOiBmaXJzdCAyLCBuZXh0IDIsIHRoZW4gdGhlIHJlc3QuXHJcblx0XHRcdHZhciBnMSA9IGVsKCAnZGl2JywgeyAnY2xhc3MnOiAndWlfZWxlbWVudCcgfSApO1xyXG5cdFx0XHR2YXIgZzIgPSBlbCggJ2RpdicsIHsgJ2NsYXNzJzogJ3VpX2VsZW1lbnQnIH0gKTtcclxuXHRcdFx0dmFyIGczID0gZWwoICdkaXYnLCB7ICdjbGFzcyc6ICd1aV9lbGVtZW50JyB9ICk7XHJcblxyXG5cdFx0XHRoZWFkZXJBY3Rpb25zLnNsaWNlKCAwLCAyICkuZm9yRWFjaCggZnVuY3Rpb24gKGFjdCkge1xyXG5cdFx0XHRcdGcxLmFwcGVuZENoaWxkKCBhY3Rpb25CdG4oIGFjdCwgZmFsc2UgKSApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdGhlYWRlckFjdGlvbnMuc2xpY2UoIDIsIDQgKS5mb3JFYWNoKCBmdW5jdGlvbiAoYWN0KSB7XHJcblx0XHRcdFx0ZzIuYXBwZW5kQ2hpbGQoIGFjdGlvbkJ0biggYWN0LCBmYWxzZSApICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0aGVhZGVyQWN0aW9ucy5zbGljZSggNCApLmZvckVhY2goIGZ1bmN0aW9uIChhY3QpIHtcclxuXHRcdFx0XHRnMy5hcHBlbmRDaGlsZCggYWN0aW9uQnRuKCBhY3QsIGZhbHNlICkgKTtcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0dWlHLmFwcGVuZENoaWxkKCBnMSApO1xyXG5cdFx0XHR1aUcuYXBwZW5kQ2hpbGQoIGcyICk7XHJcblx0XHRcdHVpRy5hcHBlbmRDaGlsZCggZzMgKTtcclxuXHRcdFx0dWlDLmFwcGVuZENoaWxkKCB1aUcgKTtcclxuXHRcdFx0cmlnaHQuYXBwZW5kQ2hpbGQoIHVpQyApO1xyXG5cclxuXHRcdFx0d3JhcC5hcHBlbmRDaGlsZCggbGVmdCApO1xyXG5cdFx0XHR3cmFwLmFwcGVuZENoaWxkKCByaWdodCApO1xyXG5cdFx0XHRyb290LmFwcGVuZENoaWxkKCB3cmFwICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gcm9vdDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gZmFjdG9yeV9yZW5kZXIocGFuZWxfZWwsIHNjaGVtYV9mb3JfdHlwZSwgZGF0YSwgb3B0cykge1xyXG5cdFx0XHRpZiAoICFwYW5lbF9lbCApIHJldHVybiBwYW5lbF9lbDtcclxuXHJcblx0XHRcdHNjaGVtYV9mb3JfdHlwZSAgPSBzY2hlbWFfZm9yX3R5cGUgfHwge307XHJcblx0XHRcdHZhciBwcm9wc19zY2hlbWEgPSAoc2NoZW1hX2Zvcl90eXBlLnNjaGVtYSAmJiBzY2hlbWFfZm9yX3R5cGUuc2NoZW1hLnByb3BzKSA/IHNjaGVtYV9mb3JfdHlwZS5zY2hlbWEucHJvcHMgOiB7fTtcclxuXHRcdFx0dmFyIGluc3BlY3Rvcl91aSA9IChzY2hlbWFfZm9yX3R5cGUuaW5zcGVjdG9yX3VpIHx8IHt9KTtcclxuXHRcdFx0dmFyIGdyb3VwcyAgICAgICA9IGluc3BlY3Rvcl91aS5ncm91cHMgfHwgW107XHJcblxyXG5cdFx0XHR2YXIgaGVhZGVyX2FjdGlvbnMgPSBpbnNwZWN0b3JfdWkuaGVhZGVyX2FjdGlvbnMgfHwgc2NoZW1hX2Zvcl90eXBlLmhlYWRlcl9hY3Rpb25zIHx8IFtdO1xyXG5cdFx0XHR2YXIgdGl0bGVfdGV4dCAgICAgPSAob3B0cyAmJiBvcHRzLnRpdGxlKSB8fCBpbnNwZWN0b3JfdWkudGl0bGUgfHwgc2NoZW1hX2Zvcl90eXBlLmxhYmVsIHx8IChkYXRhICYmIGRhdGEubGFiZWwpIHx8ICcnO1xyXG5cclxuXHRcdC8vIFByZXBhcmUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHNsb3RzL3ZhbHVlX2Zyb20sIGV0Yy5cclxuXHRcdFx0dmFyIGN0eCA9IHtcclxuXHRcdFx0XHRlbCAgICAgOiBvcHRzICYmIG9wdHMuZWwgfHwgbnVsbCxcclxuXHRcdFx0XHRidWlsZGVyOiBvcHRzICYmIG9wdHMuYnVpbGRlciB8fCBudWxsLFxyXG5cdFx0XHRcdHR5cGUgICA6IG9wdHMgJiYgb3B0cy50eXBlIHx8IG51bGwsXHJcblx0XHRcdFx0ZGF0YSAgIDogZGF0YSB8fCB7fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gY2xlYXIgcGFuZWwuXHJcblx0XHRcdHdoaWxlICggcGFuZWxfZWwuZmlyc3RDaGlsZCApIHBhbmVsX2VsLnJlbW92ZUNoaWxkKCBwYW5lbF9lbC5maXJzdENoaWxkICk7XHJcblxyXG5cdFx0XHR2YXIgdWlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZyggMzYgKS5zbGljZSggMiwgOCApO1xyXG5cclxuXHRcdFx0Ly8gaGVhZGVyLlxyXG5cdFx0XHRwYW5lbF9lbC5hcHBlbmRDaGlsZCggYnVpbGRfaGVhZGVyKCBpbnNwZWN0b3JfdWksIHRpdGxlX3RleHQsIHNjaGVtYV9mb3JfdHlwZSApICk7XHJcblxyXG5cclxuXHRcdFx0Ly8gZ3JvdXBzLlxyXG5cdFx0XHRncm91cHMuZm9yRWFjaCggZnVuY3Rpb24gKGcpIHtcclxuXHRcdFx0XHRwYW5lbF9lbC5hcHBlbmRDaGlsZCggYnVpbGRfZ3JvdXAoIGcsIHByb3BzX3NjaGVtYSwgZGF0YSB8fCB7fSwgdWlkLCBjdHggKSApO1xyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQvLyBBUklBIHN5bmMgZm9yIHRvZ2dsZXMgY3JlYXRlZCBoZXJlIChlbnN1cmUgYXJpYS1jaGVja2VkIG1hdGNoZXMgc3RhdGUpLlxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vIENlbnRyYWxpemVkIFVJIG5vcm1hbGl6ZXJzICh0b2dnbGVzICsgQTExeSk6IGhhbmRsZWQgaW4gQ29yZS5cclxuXHRcdFx0XHRVSS5hcHBseV9wb3N0X3JlbmRlciggcGFuZWxfZWwgKTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0d2lyZV9sZW5fZ3JvdXAoIHBhbmVsX2VsICk7XHJcblx0XHRcdFx0XHQvLyBJbml0aWFsaXplIENvbG9yaXMgb24gY29sb3IgaW5wdXRzIHJlbmRlcmVkIGluIHRoaXMgcGFuZWwuXHJcblx0XHRcdFx0XHRpbml0X2NvbG9yaXNfcGlja2VycyggcGFuZWxfZWwgKTtcclxuXHRcdFx0XHR9IGNhdGNoICggXyApIHsgfVxyXG5cdFx0XHR9IGNhdGNoICggXyApIHsgfVxyXG5cclxuXHRcdFx0cmV0dXJuIHBhbmVsX2VsO1xyXG5cdFx0fVxyXG5cclxuXHRcdFVJLldQQkNfQkZCX0luc3BlY3Rvcl9GYWN0b3J5ID0geyByZW5kZXI6IGZhY3RvcnlfcmVuZGVyIH07ICAgLy8gb3ZlcndyaXRlL3JlZnJlc2hcclxuXHJcblx0XHQvLyAtLS0tIEJ1aWx0LWluIHNsb3QgKyB2YWx1ZV9mcm9tIGZvciBTZWN0aW9ucyAtLS0tXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2xvdF9sYXlvdXRfY2hpcHMoaG9zdCwgY3R4KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIEwgPSB3LldQQkNfQkZCX0NvcmUgJiYgIHcuV1BCQ19CRkJfQ29yZS5VSSAmJiB3LldQQkNfQkZCX0NvcmUuVUkuV1BCQ19CRkJfTGF5b3V0X0NoaXBzO1xyXG5cdFx0XHRcdGlmICggTCAmJiB0eXBlb2YgTC5yZW5kZXJfZm9yX3NlY3Rpb24gPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRMLnJlbmRlcl9mb3Jfc2VjdGlvbiggY3R4LmJ1aWxkZXIsIGN0eC5lbCwgaG9zdCApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRob3N0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggJ1tsYXlvdXRfY2hpcHMgbm90IGF2YWlsYWJsZV0nICkgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybiggJ3dwYmNfYmZiX3Nsb3RfbGF5b3V0X2NoaXBzIGZhaWxlZDonLCBlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR3LndwYmNfYmZiX2luc3BlY3Rvcl9mYWN0b3J5X3Nsb3RzLmxheW91dF9jaGlwcyA9IHNsb3RfbGF5b3V0X2NoaXBzO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbHVlX2Zyb21fY29tcHV0ZV9zZWN0aW9uX2NvbHVtbnMoY3R4KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJvdyA9IGN0eCAmJiBjdHguZWwgJiYgY3R4LmVsLnF1ZXJ5U2VsZWN0b3IgJiYgY3R4LmVsLnF1ZXJ5U2VsZWN0b3IoICc6c2NvcGUgPiAud3BiY19iZmJfX3JvdycgKTtcclxuXHRcdFx0XHRpZiAoICFyb3cgKSByZXR1cm4gMTtcclxuXHRcdFx0XHR2YXIgbiA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gLndwYmNfYmZiX19jb2x1bW4nICkubGVuZ3RoIHx8IDE7XHJcblx0XHRcdFx0aWYgKCBuIDwgMSApIG4gPSAxO1xyXG5cdFx0XHRcdGlmICggbiA+IDQgKSBuID0gNDtcclxuXHRcdFx0XHRyZXR1cm4gbjtcclxuXHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR3LndwYmNfYmZiX2luc3BlY3Rvcl9mYWN0b3J5X3ZhbHVlX2Zyb20uY29tcHV0ZV9zZWN0aW9uX2NvbHVtbnMgPSB2YWx1ZV9mcm9tX2NvbXB1dGVfc2VjdGlvbl9jb2x1bW5zO1xyXG5cdH1cclxuXHJcblx0Ly8gMykgSW5zcGVjdG9yIGNsYXNzLlxyXG5cclxuXHRjbGFzcyBXUEJDX0JGQl9JbnNwZWN0b3Ige1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHBhbmVsX2VsLCBidWlsZGVyKSB7XHJcblx0XHRcdHRoaXMucGFuZWwgICAgICAgICA9IHBhbmVsX2VsIHx8IHRoaXMuX2NyZWF0ZV9mYWxsYmFja19wYW5lbCgpO1xyXG5cdFx0XHR0aGlzLmJ1aWxkZXIgICAgICAgPSBidWlsZGVyO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkX2VsICAgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9yZW5kZXJfdGltZXIgPSBudWxsO1xyXG5cclxuXHRcdFx0dGhpcy5fb25fZGVsZWdhdGVkX2lucHV0ICA9IChlKSA9PiB0aGlzLl9hcHBseV9jb250cm9sX2Zyb21fZXZlbnQoIGUgKTtcclxuXHRcdFx0dGhpcy5fb25fZGVsZWdhdGVkX2NoYW5nZSA9IChlKSA9PiB0aGlzLl9hcHBseV9jb250cm9sX2Zyb21fZXZlbnQoIGUgKTtcclxuXHRcdFx0dGhpcy5wYW5lbC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCB0aGlzLl9vbl9kZWxlZ2F0ZWRfaW5wdXQsIHRydWUgKTtcclxuXHRcdFx0dGhpcy5wYW5lbC5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgdGhpcy5fb25fZGVsZWdhdGVkX2NoYW5nZSwgdHJ1ZSApO1xyXG5cclxuXHRcdFx0dGhpcy5fb25fZGVsZWdhdGVkX2NsaWNrID0gKGUpID0+IHtcclxuXHRcdFx0XHRjb25zdCBidG4gPSBlLnRhcmdldC5jbG9zZXN0KCAnW2RhdGEtYWN0aW9uXScgKTtcclxuXHRcdFx0XHRpZiAoICFidG4gfHwgIXRoaXMucGFuZWwuY29udGFpbnMoIGJ0biApICkgcmV0dXJuO1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0XHRjb25zdCBhY3Rpb24gPSBidG4uZ2V0QXR0cmlidXRlKCAnZGF0YS1hY3Rpb24nICk7XHJcblx0XHRcdFx0Y29uc3QgZWwgICAgID0gdGhpcy5zZWxlY3RlZF9lbDtcclxuXHRcdFx0XHRpZiAoICFlbCApIHJldHVybjtcclxuXHJcblx0XHRcdFx0dy5XUEJDX0JGQl9JbnNwZWN0b3JfQWN0aW9ucz8ucnVuKCBhY3Rpb24sIHtcclxuXHRcdFx0XHRcdGJ1aWxkZXI6IHRoaXMuYnVpbGRlcixcclxuXHRcdFx0XHRcdGVsLFxyXG5cdFx0XHRcdFx0cGFuZWwgIDogdGhpcy5wYW5lbCxcclxuXHRcdFx0XHRcdGV2ZW50ICA6IGVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdGlmICggYWN0aW9uID09PSAnZGVsZXRlJyApIHRoaXMuY2xlYXIoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5wYW5lbC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9vbl9kZWxlZ2F0ZWRfY2xpY2sgKTtcclxuXHRcdH1cclxuXHJcblx0XHRfcG9zdF9yZW5kZXJfdWkoKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIFVJID0gdy5XUEJDX0JGQl9Db3JlICYmIHcuV1BCQ19CRkJfQ29yZS5VSTtcclxuXHRcdFx0XHRpZiAoIFVJICYmIHR5cGVvZiBVSS5hcHBseV9wb3N0X3JlbmRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFVJLmFwcGx5X3Bvc3RfcmVuZGVyKCB0aGlzLnBhbmVsICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIE5FVzogd2lyZSBzbGlkZXIvbnVtYmVyL3VuaXQgc3luY2luZyBmb3IgbGVuZ3RoICYgcmFuZ2VfbnVtYmVyIGdyb3Vwcy5cclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0d2lyZV9sZW5fZ3JvdXAoIHRoaXMucGFuZWwgKTtcclxuXHRcdFx0XHRcdGluaXRfY29sb3Jpc19waWNrZXJzKCB0aGlzLnBhbmVsICk7XHJcblx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoICggZSApIHtcclxuXHRcdFx0XHRfd3BiYz8uZGV2Py5lcnJvcj8uKCAnaW5zcGVjdG9yLl9wb3N0X3JlbmRlcl91aScsIGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRfYXBwbHlfY29udHJvbF9mcm9tX2V2ZW50KGUpIHtcclxuXHRcdFx0aWYgKCAhdGhpcy5wYW5lbC5jb250YWlucyggZS50YXJnZXQgKSApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IHQgICA9IC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fEhUTUxTZWxlY3RFbGVtZW50fSAqLyAoZS50YXJnZXQpO1xyXG5cdFx0XHRjb25zdCBrZXkgPSB0Py5kYXRhc2V0Py5pbnNwZWN0b3JLZXk7XHJcblx0XHRcdGlmICggIWtleSApIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IGVsID0gdGhpcy5zZWxlY3RlZF9lbDtcclxuXHRcdFx0aWYgKCAhZWwgfHwgIWRvY3VtZW50LmJvZHkuY29udGFpbnMoIGVsICkgKSByZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgdjtcclxuXHRcdFx0aWYgKCB0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiB0LnR5cGUgPT09ICdjaGVja2JveCcgKSB7XHJcblx0XHRcdFx0diA9ICEhdC5jaGVja2VkO1xyXG5cdFx0XHRcdHQuc2V0QXR0cmlidXRlKCAnYXJpYS1jaGVja2VkJywgdiA/ICd0cnVlJyA6ICdmYWxzZScgKTsgICAgICAgICAvLyBLZWVwIEFSSUEgc3RhdGUgaW4gc3luYyBmb3IgdG9nZ2xlcyAoc2NoZW1hIGFuZCB0ZW1wbGF0ZSBwYXRocykuXHJcblx0XHRcdH0gZWxzZSBpZiAoIHQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIHQudHlwZSA9PT0gJ251bWJlcicgKSB7XHJcblx0XHRcdFx0diA9ICh0LnZhbHVlID09PSAnJyA/ICcnIDogTnVtYmVyKCB0LnZhbHVlICkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHYgPSB0LnZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGtleSA9PT0gJ2lkJyApIHtcclxuXHRcdFx0XHRjb25zdCB1bmlxdWUgPSB0aGlzLmJ1aWxkZXI/LmlkPy5zZXRfZmllbGRfaWQ/LiggZWwsIHYgKTtcclxuXHRcdFx0XHRpZiAoIHVuaXF1ZSAhPSBudWxsICYmIHQudmFsdWUgIT09IHVuaXF1ZSApIHQudmFsdWUgPSB1bmlxdWU7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBrZXkgPT09ICduYW1lJyApIHtcclxuXHRcdFx0XHRjb25zdCB1bmlxdWUgPSB0aGlzLmJ1aWxkZXI/LmlkPy5zZXRfZmllbGRfbmFtZT8uKCBlbCwgdiApO1xyXG5cdFx0XHRcdGlmICggdW5pcXVlICE9IG51bGwgJiYgdC52YWx1ZSAhPT0gdW5pcXVlICkgdC52YWx1ZSA9IHVuaXF1ZTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIGtleSA9PT0gJ2h0bWxfaWQnICkge1xyXG5cdFx0XHRcdGNvbnN0IGFwcGxpZWQgPSB0aGlzLmJ1aWxkZXI/LmlkPy5zZXRfZmllbGRfaHRtbF9pZD8uKCBlbCwgdiApO1xyXG5cdFx0XHRcdGlmICggYXBwbGllZCAhPSBudWxsICYmIHQudmFsdWUgIT09IGFwcGxpZWQgKSB0LnZhbHVlID0gYXBwbGllZDtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIGtleSA9PT0gJ2NvbHVtbnMnICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApICkge1xyXG5cdFx0XHRcdGNvbnN0IHZfaW50ID0gcGFyc2VJbnQoIFN0cmluZyggdiApLCAxMCApO1xyXG5cdFx0XHRcdGlmICggTnVtYmVyLmlzRmluaXRlKCB2X2ludCApICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY2xhbXBlZCA9IHcuV1BCQ19CRkJfQ29yZS5XUEJDX0JGQl9TYW5pdGl6ZS5jbGFtcCggdl9pbnQsIDEsIDQgKTtcclxuXHRcdFx0XHRcdHRoaXMuYnVpbGRlcj8uc2V0X3NlY3Rpb25fY29sdW1ucz8uKCBlbCwgY2xhbXBlZCApO1xyXG5cdFx0XHRcdFx0aWYgKCBTdHJpbmcoIGNsYW1wZWQgKSAhPT0gdC52YWx1ZSApIHQudmFsdWUgPSBTdHJpbmcoIGNsYW1wZWQgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICggdCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdC50eXBlID09PSAnY2hlY2tib3gnICkge1xyXG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnZGF0YS0nICsga2V5LCBTdHJpbmcoICEhdiApICk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICggdCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdC50eXBlID09PSAnbnVtYmVyJyApIHtcclxuXHRcdFx0XHRcdGlmICggdC52YWx1ZSA9PT0gJycgfHwgIU51bWJlci5pc0Zpbml0ZSggdiApICkge1xyXG5cdFx0XHRcdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLScgKyBrZXkgKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ2RhdGEtJyArIGtleSwgU3RyaW5nKCB2ICkgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKCB2ID09IG51bGwgKSB7XHJcblx0XHRcdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLScgKyBrZXkgKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnZGF0YS0nICsga2V5LCAodHlwZW9mIHYgPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KCB2ICkgOiBTdHJpbmcoIHYgKSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIHByZXZpZXcvb3ZlcmxheVxyXG5cdFx0XHRpZiAoIGVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19maWVsZCcgKSApIHtcclxuXHRcdFx0XHRpZiAoIHRoaXMuYnVpbGRlcj8ucHJldmlld19tb2RlICkgdGhpcy5idWlsZGVyLnJlbmRlcl9wcmV2aWV3KCBlbCApO1xyXG5cdFx0XHRcdGVsc2UgdGhpcy5idWlsZGVyLmFkZF9vdmVybGF5X3Rvb2xiYXIoIGVsICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5idWlsZGVyLmFkZF9vdmVybGF5X3Rvb2xiYXIoIGVsICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy5fbmVlZHNfcmVyZW5kZXIoIGVsLCBrZXksIGUgKSApIHtcclxuXHRcdFx0XHR0aGlzLl9zY2hlZHVsZV9yZW5kZXJfcHJlc2VydmluZ19mb2N1cyggMCApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0X25lZWRzX3JlcmVuZGVyKGVsLCBrZXksIF9lKSB7XHJcblx0XHRcdGlmICggZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX3NlY3Rpb24nICkgJiYga2V5ID09PSAnY29sdW1ucycgKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGJpbmRfdG9fZmllbGQoZmllbGRfZWwpIHtcclxuXHRcdFx0dGhpcy5zZWxlY3RlZF9lbCA9IGZpZWxkX2VsO1xyXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNsZWFyKCkge1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkX2VsID0gbnVsbDtcclxuXHRcdFx0aWYgKCB0aGlzLl9yZW5kZXJfdGltZXIgKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aGlzLl9yZW5kZXJfdGltZXIgKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJfdGltZXIgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEFsc28gY2xlYXIgdGhlIHNlY3Rpb24tY29scyBoaW50IG9uIGVtcHR5IHN0YXRlLlxyXG5cdFx0XHR0aGlzLnBhbmVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1iZmItc2VjdGlvbi1jb2xzJyk7XHJcblx0XHRcdHRoaXMucGFuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJ3cGJjX2JmYl9faW5zcGVjdG9yX19lbXB0eVwiPlNlbGVjdCBhIGZpZWxkIHRvIGVkaXQgaXRzIG9wdGlvbnMuPC9kaXY+JztcclxuXHRcdH1cclxuXHJcblx0XHRfc2NoZWR1bGVfcmVuZGVyX3ByZXNlcnZpbmdfZm9jdXMoZGVsYXkgPSAyMDApIHtcclxuXHRcdFx0Y29uc3QgYWN0aXZlICAgID0gLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fEhUTUxUZXh0QXJlYUVsZW1lbnR8SFRNTEVsZW1lbnR8bnVsbH0gKi8gKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVLZXkgPSBhY3RpdmU/LmRhdGFzZXQ/Lmluc3BlY3RvcktleSB8fCBudWxsO1xyXG5cdFx0XHRsZXQgc2VsU3RhcnQgICAgPSBudWxsLCBzZWxFbmQgPSBudWxsO1xyXG5cclxuXHRcdFx0aWYgKCBhY3RpdmUgJiYgJ3NlbGVjdGlvblN0YXJ0JyBpbiBhY3RpdmUgJiYgJ3NlbGVjdGlvbkVuZCcgaW4gYWN0aXZlICkge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRzZWxTdGFydCA9IGFjdGl2ZS5zZWxlY3Rpb25TdGFydDtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0c2VsRW5kICAgPSBhY3RpdmUuc2VsZWN0aW9uRW5kO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuX3JlbmRlcl90aW1lciApIGNsZWFyVGltZW91dCggdGhpcy5fcmVuZGVyX3RpbWVyICk7XHJcblx0XHRcdHRoaXMuX3JlbmRlcl90aW1lciA9IC8qKiBAdHlwZSB7dW5rbm93bn0gKi8gKHNldFRpbWVvdXQoICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdFx0XHRcdGlmICggYWN0aXZlS2V5ICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgbmV4dCA9IC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fEhUTUxFbGVtZW50fG51bGx9ICovIChcclxuXHRcdFx0XHRcdFx0dGhpcy5wYW5lbC5xdWVyeVNlbGVjdG9yKCBgW2RhdGEtaW5zcGVjdG9yLWtleT1cIiR7YWN0aXZlS2V5fVwiXWAgKVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGlmICggbmV4dCApIHtcclxuXHRcdFx0XHRcdFx0bmV4dC5mb2N1cygpO1xyXG5cdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICggc2VsU3RhcnQgIT0gbnVsbCAmJiBzZWxFbmQgIT0gbnVsbCAmJiB0eXBlb2YgbmV4dC5zZXRTZWxlY3Rpb25SYW5nZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0XHRcdG5leHQuc2V0U2VsZWN0aW9uUmFuZ2UoIHNlbFN0YXJ0LCBzZWxFbmQgKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2goIGUgKXsgX3dwYmM/LmRldj8uZXJyb3IoICdfcmVuZGVyX3RpbWVyJywgZSApOyB9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBkZWxheSApKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZW5kZXIoKSB7XHJcblxyXG5cdFx0XHRjb25zdCBlbCA9IHRoaXMuc2VsZWN0ZWRfZWw7XHJcblx0XHRcdGlmICggIWVsIHx8ICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKCBlbCApICkgcmV0dXJuIHRoaXMuY2xlYXIoKTtcclxuXHJcblx0XHRcdC8vIFJlc2V0IHNlY3Rpb24tY29scyBoaW50IHVubGVzcyB3ZSBzZXQgaXQgbGF0ZXIgZm9yIGEgc2VjdGlvbi5cclxuXHRcdFx0dGhpcy5wYW5lbC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLWJmYi1zZWN0aW9uLWNvbHMnICk7XHJcblxyXG5cdFx0XHRjb25zdCBwcmV2X3Njcm9sbCA9IHRoaXMucGFuZWwuc2Nyb2xsVG9wO1xyXG5cclxuXHRcdFx0Ly8gU2VjdGlvblxyXG5cdFx0XHRpZiAoIGVsLmNsYXNzTGlzdC5jb250YWlucyggJ3dwYmNfYmZiX19zZWN0aW9uJyApICkge1xyXG5cdFx0XHRcdGxldCB0cGwgPSBudWxsO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0cGwgPSAody53cCAmJiB3cC50ZW1wbGF0ZSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3RtcGwtd3BiYy1iZmItaW5zcGVjdG9yLXNlY3Rpb24nICkpID8gd3AudGVtcGxhdGUoICd3cGJjLWJmYi1pbnNwZWN0b3Itc2VjdGlvbicgKSA6IG51bGw7XHJcblx0XHRcdFx0fSBjYXRjaCAoIF8gKSB7XHJcblx0XHRcdFx0XHR0cGwgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCB0cGwgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBhbmVsLmlubmVySFRNTCA9IHRwbCgge30gKTtcclxuXHRcdFx0XHRcdHRoaXMuX2VuZm9yY2VfZGVmYXVsdF9ncm91cF9vcGVuKCk7XHJcblx0XHRcdFx0XHR0aGlzLl9zZXRfcGFuZWxfc2VjdGlvbl9jb2xzKCBlbCApO1xyXG5cdFx0XHRcdFx0dGhpcy5fcG9zdF9yZW5kZXJfdWkoKTtcclxuXHRcdFx0XHRcdHRoaXMucGFuZWwuc2Nyb2xsVG9wID0gcHJldl9zY3JvbGw7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBGYWN0b3J5ID0gdy5XUEJDX0JGQl9Db3JlLlVJICYmIHcuV1BCQ19CRkJfQ29yZS5VSS5XUEJDX0JGQl9JbnNwZWN0b3JfRmFjdG9yeTtcclxuXHRcdFx0XHRjb25zdCBzY2hlbWFzID0gdy5XUEJDX0JGQl9TY2hlbWFzIHx8IHt9O1xyXG5cdFx0XHRcdGNvbnN0IGVudHJ5ICAgPSBzY2hlbWFzWydzZWN0aW9uJ10gfHwgbnVsbDtcclxuXHRcdFx0XHRpZiAoIGVudHJ5ICYmIEZhY3RvcnkgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBhbmVsLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRcdFx0RmFjdG9yeS5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdHRoaXMucGFuZWwsXHJcblx0XHRcdFx0XHRcdGVudHJ5LFxyXG5cdFx0XHRcdFx0XHR7fSxcclxuXHRcdFx0XHRcdFx0eyBlbCwgYnVpbGRlcjogdGhpcy5idWlsZGVyLCB0eXBlOiAnc2VjdGlvbicsIHRpdGxlOiBlbnRyeS5sYWJlbCB8fCAnU2VjdGlvbicgfVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHRoaXMuX2VuZm9yY2VfZGVmYXVsdF9ncm91cF9vcGVuKCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gLS0tIFNhZmV0eSBuZXQ6IGlmIGZvciBhbnkgcmVhc29uIHRoZSBzbG90IGRpZG7igJl0IHJlbmRlciBjaGlwcywgaW5qZWN0IHRoZW0gbm93LlxyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgaGFzU2xvdEhvc3QgPVxyXG5cdFx0XHRcdFx0XHRcdFx0ICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1iZmItc2xvdD1cImxheW91dF9jaGlwc1wiXScgKSB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0ICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3IoICcuaW5zcGVjdG9yX19yb3ctLWxheW91dC1jaGlwcyAud3BiY19iZmJfX2xheW91dF9jaGlwcycgKSB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0ICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3IoICcjd3BiY19iZmJfX2xheW91dF9jaGlwc19ob3N0JyApO1xyXG5cclxuXHRcdFx0XHRcdFx0Y29uc3QgaGFzQ2hpcHMgPVxyXG5cdFx0XHRcdFx0XHRcdFx0ICAhIXRoaXMucGFuZWwucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9fbGF5b3V0X2NoaXAnICk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoICFoYXNDaGlwcyApIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBDcmVhdGUgYSBob3N0IGlmIG1pc3NpbmcgYW5kIHJlbmRlciBjaGlwcyBpbnRvIGl0LlxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGhvc3QgPSAoZnVuY3Rpb24gZW5zdXJlSG9zdChyb290KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgaCA9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm9vdC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtYmZiLXNsb3Q9XCJsYXlvdXRfY2hpcHNcIl0nICkgfHxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb290LnF1ZXJ5U2VsZWN0b3IoICcuaW5zcGVjdG9yX19yb3ctLWxheW91dC1jaGlwcyAud3BiY19iZmJfX2xheW91dF9jaGlwcycgKSB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvb3QucXVlcnlTZWxlY3RvciggJyN3cGJjX2JmYl9fbGF5b3V0X2NoaXBzX2hvc3QnICk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGggKSByZXR1cm4gaDtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEZhbGxiYWNrIGhvc3QgaW5zaWRlIChvciBhZnRlcikgdGhlIOKAnGxheW91dOKAnSBncm91cFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRzICAgID1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgIHJvb3QucXVlcnlTZWxlY3RvciggJy53cGJjX2JmYl9faW5zcGVjdG9yX19ncm91cFtkYXRhLWdyb3VwPVwibGF5b3V0XCJdIC5ncm91cF9fZmllbGRzJyApIHx8XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICByb290LnF1ZXJ5U2VsZWN0b3IoICcuZ3JvdXBfX2ZpZWxkcycgKSB8fCByb290O1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgcm93ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJvdy5jbGFzc05hbWUgICA9ICdpbnNwZWN0b3JfX3JvdyBpbnNwZWN0b3JfX3Jvdy0tbGF5b3V0LWNoaXBzJztcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGxhYiAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsYWJlbCcgKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxhYi5jbGFzc05hbWUgICA9ICdpbnNwZWN0b3JfX2xhYmVsJztcclxuXHRcdFx0XHRcdFx0XHRcdGxhYi50ZXh0Q29udGVudCA9ICdMYXlvdXQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgY3RsICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuXHRcdFx0XHRcdFx0XHRcdGN0bC5jbGFzc05hbWUgICA9ICdpbnNwZWN0b3JfX2NvbnRyb2wnO1xyXG5cdFx0XHRcdFx0XHRcdFx0aCAgICAgICAgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuXHRcdFx0XHRcdFx0XHRcdGguY2xhc3NOYW1lICAgICA9ICd3cGJjX2JmYl9fbGF5b3V0X2NoaXBzJztcclxuXHRcdFx0XHRcdFx0XHRcdGguc2V0QXR0cmlidXRlKCAnZGF0YS1iZmItc2xvdCcsICdsYXlvdXRfY2hpcHMnICk7XHJcblx0XHRcdFx0XHRcdFx0XHRjdGwuYXBwZW5kQ2hpbGQoIGggKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJvdy5hcHBlbmRDaGlsZCggbGFiICk7XHJcblx0XHRcdFx0XHRcdFx0XHRyb3cuYXBwZW5kQ2hpbGQoIGN0bCApO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzLmFwcGVuZENoaWxkKCByb3cgKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBoO1xyXG5cdFx0XHRcdFx0XHRcdH0pKCB0aGlzLnBhbmVsICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IEwgPSAody5XUEJDX0JGQl9Db3JlICYmIHcuV1BCQ19CRkJfQ29yZS5VSSAmJiB3LldQQkNfQkZCX0NvcmUuVUkuV1BCQ19CRkJfTGF5b3V0X0NoaXBzKSA7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBMICYmIHR5cGVvZiBMLnJlbmRlcl9mb3Jfc2VjdGlvbiA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGhvc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRMLnJlbmRlcl9mb3Jfc2VjdGlvbiggdGhpcy5idWlsZGVyLCBlbCwgaG9zdCApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBjYXRjaCggZSApeyBfd3BiYz8uZGV2Py5lcnJvciggJ1dQQkNfQkZCX0luc3BlY3RvciAtIHJlbmRlcicsIGUgKTsgfVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuX3NldF9wYW5lbF9zZWN0aW9uX2NvbHMoIGVsICk7XHJcblx0XHRcdFx0XHR0aGlzLnBhbmVsLnNjcm9sbFRvcCA9IHByZXZfc2Nyb2xsO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5wYW5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cIndwYmNfYmZiX19pbnNwZWN0b3JfX2VtcHR5XCI+U2VsZWN0IGEgZmllbGQgdG8gZWRpdCBpdHMgb3B0aW9ucy48L2Rpdj4nO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmllbGRcclxuXHRcdFx0aWYgKCAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd3BiY19iZmJfX2ZpZWxkJyApICkgcmV0dXJuIHRoaXMuY2xlYXIoKTtcclxuXHJcblx0XHRcdGNvbnN0IGRhdGEgPSB3LldQQkNfQkZCX0NvcmUuV1BCQ19Gb3JtX0J1aWxkZXJfSGVscGVyLmdldF9hbGxfZGF0YV9hdHRyaWJ1dGVzKCBlbCApO1xyXG5cdFx0XHRjb25zdCB0eXBlID0gZGF0YS50eXBlIHx8ICd0ZXh0JztcclxuXHJcblx0XHRcdGZ1bmN0aW9uIF9nZXRfdHBsKGlkKSB7XHJcblx0XHRcdFx0aWYgKCAhdy53cCB8fCAhd3AudGVtcGxhdGUgKSByZXR1cm4gbnVsbDtcclxuXHRcdFx0XHRpZiAoICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3RtcGwtJyArIGlkICkgKSByZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHdwLnRlbXBsYXRlKCBpZCApO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCB0cGxfaWQgICAgICA9IGB3cGJjLWJmYi1pbnNwZWN0b3ItJHt0eXBlfWA7XHJcblx0XHRcdGNvbnN0IHRwbCAgICAgICAgID0gX2dldF90cGwoIHRwbF9pZCApO1xyXG5cdFx0XHRjb25zdCBnZW5lcmljX3RwbCA9IF9nZXRfdHBsKCAnd3BiYy1iZmItaW5zcGVjdG9yLWdlbmVyaWMnICk7XHJcblxyXG5cdFx0XHRjb25zdCBzY2hlbWFzICAgICAgICAgPSB3LldQQkNfQkZCX1NjaGVtYXMgfHwge307XHJcblx0XHRcdGNvbnN0IHNjaGVtYV9mb3JfdHlwZSA9IHNjaGVtYXNbdHlwZV0gfHwgbnVsbDtcclxuXHRcdFx0Y29uc3QgRmFjdG9yeSAgICAgICAgID0gdy5XUEJDX0JGQl9Db3JlLlVJICYmIHcuV1BCQ19CRkJfQ29yZS5VSS5XUEJDX0JGQl9JbnNwZWN0b3JfRmFjdG9yeTtcclxuXHJcblx0XHRcdGlmICggdHBsICkge1xyXG5cdFx0XHRcdC8vIE5FVzogbWVyZ2Ugc2NoZW1hIGRlZmF1bHRzIHNvIG1pc3Npbmcga2V5cyAoZXNwLiBib29sZWFucykgaG9ub3IgZGVmYXVsdHMgb24gZmlyc3QgcGFpbnRcclxuXHRcdFx0XHRjb25zdCBoYXNPd24gPSBGdW5jdGlvbi5jYWxsLmJpbmQoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgKTtcclxuXHRcdFx0XHRjb25zdCBwcm9wcyAgPSAoc2NoZW1hX2Zvcl90eXBlICYmIHNjaGVtYV9mb3JfdHlwZS5zY2hlbWEgJiYgc2NoZW1hX2Zvcl90eXBlLnNjaGVtYS5wcm9wcykgPyBzY2hlbWFfZm9yX3R5cGUuc2NoZW1hLnByb3BzIDoge307XHJcblx0XHRcdFx0Y29uc3QgbWVyZ2VkID0geyAuLi5kYXRhIH07XHJcblx0XHRcdFx0aWYgKCBwcm9wcyApIHtcclxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKCBwcm9wcyApLmZvckVhY2goIChrKSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IG1ldGEgPSBwcm9wc1trXSB8fCB7fTtcclxuXHRcdFx0XHRcdFx0aWYgKCAhaGFzT3duKCBkYXRhLCBrICkgfHwgZGF0YVtrXSA9PT0gJycgKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBoYXNPd24oIG1ldGEsICdkZWZhdWx0JyApICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ29lcmNlIGJvb2xlYW5zIHRvIGEgcmVhbCBib29sZWFuOyBsZWF2ZSBvdGhlcnMgYXMtaXNcclxuXHRcdFx0XHRcdFx0XHRcdG1lcmdlZFtrXSA9IChtZXRhLnR5cGUgPT09ICdib29sZWFuJykgPyAhIW1ldGEuZGVmYXVsdCA6IG1ldGEuZGVmYXVsdDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIG1ldGEudHlwZSA9PT0gJ2Jvb2xlYW4nICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIE5vcm1hbGl6ZSB0cnV0aHkgc3RyaW5ncyBpbnRvIGJvb2xlYW5zIGZvciB0ZW1wbGF0ZXMgdGhhdCBjaGVjayBvbiB0cnV0aGluZXNzXHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgdiAgID0gZGF0YVtrXTtcclxuXHRcdFx0XHRcdFx0XHRtZXJnZWRba10gPSAodiA9PT0gdHJ1ZSB8fCB2ID09PSAndHJ1ZScgfHwgdiA9PT0gMSB8fCB2ID09PSAnMScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucGFuZWwuaW5uZXJIVE1MID0gdHBsKCBtZXJnZWQgKTtcclxuXHJcblx0XHRcdFx0dGhpcy5fcG9zdF9yZW5kZXJfdWkoKTtcclxuXHRcdFx0fSBlbHNlIGlmICggc2NoZW1hX2Zvcl90eXBlICYmIEZhY3RvcnkgKSB7XHJcblx0XHRcdFx0dGhpcy5wYW5lbC5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0XHRGYWN0b3J5LnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMucGFuZWwsXHJcblx0XHRcdFx0XHRzY2hlbWFfZm9yX3R5cGUsXHJcblx0XHRcdFx0XHR7IC4uLmRhdGEgfSxcclxuXHRcdFx0XHRcdHsgZWwsIGJ1aWxkZXI6IHRoaXMuYnVpbGRlciwgdHlwZSwgdGl0bGU6IGRhdGEubGFiZWwgfHwgJycgfVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0Ly8gRW5zdXJlIHRvZ2dsZSBub3JtYWxpemVycyBhbmQgc2xpZGVyL251bWJlci91bml0IHdpcmluZyBhcmUgYXR0YWNoZWQuXHJcblx0XHRcdFx0dGhpcy5fcG9zdF9yZW5kZXJfdWkoKTtcclxuXHRcdFx0fSBlbHNlIGlmICggZ2VuZXJpY190cGwgKSB7XHJcblx0XHRcdFx0dGhpcy5wYW5lbC5pbm5lckhUTUwgPSBnZW5lcmljX3RwbCggeyAuLi5kYXRhIH0gKTtcclxuXHRcdFx0XHR0aGlzLl9wb3N0X3JlbmRlcl91aSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRjb25zdCBtc2cgICAgICAgICAgICA9IGBUaGVyZSBhcmUgbm8gSW5zcGVjdG9yIHdwLnRlbXBsYXRlIFwiJHt0cGxfaWR9XCIgb3IgU2NoZW1hIGZvciB0aGlzIFwiJHtTdHJpbmcoIHR5cGUgfHwgJycgKX1cIiBlbGVtZW50LmA7XHJcblx0XHRcdFx0dGhpcy5wYW5lbC5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0XHRjb25zdCBkaXYgICAgICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcblx0XHRcdFx0ZGl2LmNsYXNzTmFtZSAgICAgICAgPSAnd3BiY19iZmJfX2luc3BlY3Rvcl9fZW1wdHknO1xyXG5cdFx0XHRcdGRpdi50ZXh0Q29udGVudCAgICAgID0gbXNnOyAvLyBzYWZlLlxyXG5cdFx0XHRcdHRoaXMucGFuZWwuYXBwZW5kQ2hpbGQoIGRpdiApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9lbmZvcmNlX2RlZmF1bHRfZ3JvdXBfb3BlbigpO1xyXG5cdFx0XHR0aGlzLnBhbmVsLnNjcm9sbFRvcCA9IHByZXZfc2Nyb2xsO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9lbmZvcmNlX2RlZmF1bHRfZ3JvdXBfb3BlbigpIHtcclxuXHRcdFx0Y29uc3QgZ3JvdXBzID0gQXJyYXkuZnJvbSggdGhpcy5wYW5lbC5xdWVyeVNlbGVjdG9yQWxsKCAnLndwYmNfYmZiX19pbnNwZWN0b3JfX2dyb3VwJyApICk7XHJcblx0XHRcdGlmICggIWdyb3Vwcy5sZW5ndGggKSByZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgZm91bmQgPSBmYWxzZTtcclxuXHRcdFx0Z3JvdXBzLmZvckVhY2goIChnKSA9PiB7XHJcblx0XHRcdFx0aWYgKCAhZm91bmQgJiYgZy5jbGFzc0xpc3QuY29udGFpbnMoICdpcy1vcGVuJyApICkge1xyXG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoIGcuY2xhc3NMaXN0LmNvbnRhaW5zKCAnaXMtb3BlbicgKSApIHtcclxuXHRcdFx0XHRcdFx0Zy5jbGFzc0xpc3QucmVtb3ZlKCAnaXMtb3BlbicgKTtcclxuXHRcdFx0XHRcdFx0Zy5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoICd3cGJjOmNvbGxhcHNpYmxlOmNsb3NlJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Zy5jbGFzc0xpc3QucmVtb3ZlKCAnaXMtb3BlbicgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdGlmICggIWZvdW5kICkge1xyXG5cdFx0XHRcdGdyb3Vwc1swXS5jbGFzc0xpc3QuYWRkKCAnaXMtb3BlbicgKTtcclxuXHRcdFx0XHRncm91cHNbMF0uZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCAnd3BiYzpjb2xsYXBzaWJsZTpvcGVuJywgeyBidWJibGVzOiB0cnVlIH0gKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZXQgZGF0YS1iZmItc2VjdGlvbi1jb2xzIG9uIHRoZSBpbnNwZWN0b3IgcGFuZWwgYmFzZWQgb24gdGhlIGN1cnJlbnQgc2VjdGlvbi5cclxuXHRcdCAqIFVzZXMgdGhlIHJlZ2lzdGVyZWQgY29tcHV0ZSBmbiBpZiBhdmFpbGFibGU7IGZhbGxzIGJhY2sgdG8gZGlyZWN0IERPTS5cclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlY3Rpb25FbFxyXG5cdFx0ICovXHJcblx0XHRfc2V0X3BhbmVsX3NlY3Rpb25fY29scyhzZWN0aW9uRWwpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyBQcmVmZXIgdGhlIGFscmVhZHktcmVnaXN0ZXJlZCB2YWx1ZV9mcm9tIGhlbHBlciBpZiBwcmVzZW50LlxyXG5cdFx0XHRcdHZhciBjb21wdXRlID0gdy53cGJjX2JmYl9pbnNwZWN0b3JfZmFjdG9yeV92YWx1ZV9mcm9tICYmIHcud3BiY19iZmJfaW5zcGVjdG9yX2ZhY3RvcnlfdmFsdWVfZnJvbS5jb21wdXRlX3NlY3Rpb25fY29sdW1ucztcclxuXHJcblx0XHRcdFx0dmFyIGNvbHMgPSAxO1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIGNvbXB1dGUgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRjb2xzID0gY29tcHV0ZSggeyBlbDogc2VjdGlvbkVsIH0gKSB8fCAxO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBGYWxsYmFjazogY29tcHV0ZSBkaXJlY3RseSBmcm9tIHRoZSBET00uXHJcblx0XHRcdFx0XHR2YXIgcm93ID0gc2VjdGlvbkVsICYmIHNlY3Rpb25FbC5xdWVyeVNlbGVjdG9yKCAnOnNjb3BlID4gLndwYmNfYmZiX19yb3cnICk7XHJcblx0XHRcdFx0XHRjb2xzICAgID0gcm93ID8gKHJvdy5xdWVyeVNlbGVjdG9yQWxsKCAnOnNjb3BlID4gLndwYmNfYmZiX19jb2x1bW4nICkubGVuZ3RoIHx8IDEpIDogMTtcclxuXHRcdFx0XHRcdGlmICggY29scyA8IDEgKSBjb2xzID0gMTtcclxuXHRcdFx0XHRcdGlmICggY29scyA+IDQgKSBjb2xzID0gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wYW5lbC5zZXRBdHRyaWJ1dGUoICdkYXRhLWJmYi1zZWN0aW9uLWNvbHMnLCBTdHJpbmcoIGNvbHMgKSApO1xyXG5cdFx0XHR9IGNhdGNoICggXyApIHtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRfY3JlYXRlX2ZhbGxiYWNrX3BhbmVsKCkge1xyXG5cdFx0XHRjb25zdCBwICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcblx0XHRcdHAuaWQgICAgICAgID0gJ3dwYmNfYmZiX19pbnNwZWN0b3InO1xyXG5cdFx0XHRwLmNsYXNzTmFtZSA9ICd3cGJjX2JmYl9faW5zcGVjdG9yJztcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggcCApO1xyXG5cdFx0XHRyZXR1cm4gLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH0gKi8gKHApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gRXhwb3J0IGNsYXNzICsgcmVhZHkgc2lnbmFsLlxyXG5cdHcuV1BCQ19CRkJfSW5zcGVjdG9yID0gV1BCQ19CRkJfSW5zcGVjdG9yO1xyXG5cdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoIG5ldyBFdmVudCggJ3dwYmNfYmZiX2luc3BlY3Rvcl9yZWFkeScgKSApO1xyXG5cclxufSkoIHdpbmRvdyApO1xyXG4iXX0=
