

jQuery(function($) {		

	"use strict"; 

	
		
		


		$.fn.counters = function(options)
		{
			"use strict"; 
			return this.each(function()
			{
				var container = $('.counter_up_out'), elements = container.find('.extra-counter .odometer');


				//trigger displaying of thumbnails
				container.appear( function()
				{
				
					elements.each(function(i)
					{
						var $count = $(this);
						var od;
						
						od = new Odometer({
						  el: $count[0],
						  format: '(.ddd).dd',
						  theme: 'minimal',
						  duration: $count.data('duration')
						});

						od.update($count.data('number'));					
												
												
					});
				});
			});	
				
		};




	

				
		if($.fn.counters)
		{
			$('.extra-counter').counters();

		}	
	});