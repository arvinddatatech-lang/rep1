(function($) {
	
	'use strict';
	
	// Extend core script
	$.extend($.nmTheme, {
		/**
		 *	Initialize single product scripts
		 */
		singleProduct_init: function() {
			var self = this;
            //self.singleProductVariationsInit();
            self.quantityInputsBindButtons($('.action'));
		},	
	});
	
	// Add extension so it can be called from $.nmThemeExtensions
	$.nmThemeExtensions.singleProduct = $.nmTheme.singleProduct_init;
	
})(jQuery);