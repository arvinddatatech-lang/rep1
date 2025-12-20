(function($) {
    "use strict";
    // window.jws_theme_is_mobile_tablet = function() {
    $(document).ready(function() {
    /*---------- Tab Filter ------------*/
    
        var tab_filter  = function() {  
            $('ul.data_tab li').click(function(e){
                e.preventDefault();
        		var tab_id = $(this).find('a').attr('data-tab');
        
        		$('ul.data_tab li ').removeClass(' active');
        		$('.tab-content').removeClass(' active');
        
        		$(this).addClass(' active');
        		$("#"+tab_id).addClass(' active');
        	})     
       };
        
       tab_filter();
       
        var show_detail  = function() {  
            $('.action_detail').click(function(e){
                e.preventDefault();
                $(this).toggleClass('active');
                $('.open_detail').toggleClass('active');
        
        	})     
       };
        
       show_detail();
        
      
        /*---------Action When Click -------------*/
        $.fn.addClassAndRemove = function( select, timeAdd, timeRemove) {
              var element = this;
              var addIt = function(){
                   element.addClass(select);
                };
              var removeIt = function(){
                   element.removeClass(select);
                };
              setTimeout(function() { addIt(); setTimeout(removeIt, timeRemove); }, timeAdd);
              return this;
            };
        var filter_layout = function() {
 
                $( ".design_container ul .action_filter:first-child" ).find(' a').addClass('active') ;
                
                $('body').on('click', '.action_filter a', function(e) { 
                e.preventDefault();
                var _this = $(this),
                _col = _this.attr('data-image'),
                _parent = _this.closest('.design_container'),
                _background = _parent.find('.background_project')
                _parent.find('.tab-content.active .action_filter a').removeClass('active');
                _this.addClass('active');
                _background.addClassAndRemove('load_design', 0, 2000);
                /* change Background Design */
               _background.css("background-image", (  $(this).attr('data-image')    ));
               /* change Price Design */
                sum_price();
               detail_filter();
               });
             
        }
        filter_layout();
        
        /*---------Sum Price -------------*/
        
        var sum_price  = function() {
                var sum = 0;
                var curency = $('.currency').attr('data-symbol');
                

                    $( "ul .action_filter a.active" ).each(function(k, v){
                        sum += parseInt($(this).attr('data-price'));
                        if(k === $( "ul .action_filter a.active" ).length -1) $('#total').text(curency + sum);
                    }); 
                
                
                
       };
        sum_price();
        
        
        
         /*--------- Detail -------------*/
        
        var detail_filter  = function() {
            var curency = $('.currency').attr('data-symbol');
            var color_pr = "";
            var unit_pr = "";
            var layout_pr = "";
            var worktop_pr = "";
            var appliance_pr = "";
            var installation_pr = "";
            
            
            if($('.filter_color .action_filter .active').attr('data-price') != '0') {
               var color_pr = $('.filter_color .action_filter .active').attr('data-price');
                $('.detail .color_pr ').text(curency + color_pr);
            }else {
                var color_pr = ""; 
               $('.detail .color_pr ').text(color_pr);
            }
            
            if($('.filter_unit .action_filter .active').attr('data-price') != '0') {
                var unit_pr = $('.filter_unit .action_filter .active').attr('data-price');
                $('.detail .unit_pr ').text(curency + unit_pr);
            }else {
               var unit_pr = ""; 
               $('.detail .unit_pr ').text(unit_pr); 
            }
            if($('.filter_layout .action_filter .active').attr('data-price') != '0') {
                var layout_pr = $('.filter_layout .action_filter .active').attr('data-price');
                $('.detail .layout_pr ').text(curency + layout_pr);
            }else {
               var layout_pr = ""; 
               $('.detail .layout_pr ').text(layout_pr); 
            }
            if($('.filter_worktop .action_filter .active').attr('data-price') != '0') {
                var worktop_pr = $('.filter_worktop .action_filter .active').attr('data-price');
                $('.detail .worktop_pr ').text(curency + worktop_pr);
            }else {
               var worktop_pr = ""; 
               $('.detail .worktop_pr ').text(worktop_pr); 
            }
            
            if($('.filter_appliance .action_filter .active').attr('data-price') != '0') {
                var appliance_pr = $('.filter_appliance .action_filter .active').attr('data-price');
                $('.detail .appliance_pr ').text(curency + appliance_pr);
            }else {
               var appliance_pr = ""; 
               $('.detail .appliance_pr ').text(appliance_pr); 
            }
            if($('.filter_installation .action_filter .active').attr('data-price') != '0') {
                var installation_pr = $('.filter_installation .action_filter .active').attr('data-price');
                $('.detail .installation_pr ').text(curency + installation_pr);
            }else {
               var installation_pr = ""; 
               $('.detail .installation_pr ').text(installation_pr); 
            }
            
            
                var color = $('.filter_color .action_filter .active').attr('data-name');
                var unit = $('.filter_unit .action_filter .active').attr('data-name');
                var layout = $('.filter_layout .action_filter .active').attr('data-name');
                var worktop = $('.filter_worktop .action_filter .active').attr('data-name');
                var appliance = $('.filter_appliance .action_filter .active').attr('data-name');
                var installation = $('.filter_installation .action_filter .active').attr('data-name');
                
                $('.filter_color .action_filter .active').each(function(k, v){
                    if(k === $('.filter_color .action_filter .active').length -1) $('.detail .color ').text(color);
                });
                $('.filter_unit .action_filter .active').each(function(k, v){
                    if(k === $('.filter_unit .action_filter .active').length -1) $('.detail .unit ').text(unit);
                });  
                $('.filter_layout .action_filter .active').each(function(k, v){
                    if(k === $('.filter_layout .action_filter .active').length -1) $('.detail .layout ').text(layout);
                }); 
                $('.filter_worktop .action_filter .active').each(function(k, v){
                    if(k === $('.filter_worktop .action_filter .active').length -1) $('.detail .worktop ').text(worktop);
                });
                $('.filter_appliance .action_filter .active').each(function(k, v){
                    if(k === $('.filter_appliance .action_filter .active').length -1) $('.detail .appliance ').text(appliance);
                }); 
                 $('.filter_installation .action_filter .active').each(function(k, v){
                    if(k === $('.filter_installation .action_filter .active').length -1) $('.detail .installation ').text(installation);
                });               
       };
        detail_filter();
    });
})(window.jQuery)