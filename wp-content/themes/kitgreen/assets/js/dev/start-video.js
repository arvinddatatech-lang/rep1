!function($){"use strict";$(document).ready(function(){
    function lightbox() {
        $('.action-popup-url').each(function(){
                             $(this).iLightBox({
                               skin: "metro-black",
                               path: "horizontal",
                               type: "video",
                               maxScale: 1,
                               controls: {
                                  slideshow: false,
                                  arrows: false
                               },
                               overlay: {
                                  opacity: "0.95"
                               }
                            }); 
                        })};
                        lightbox();  
                        function galleryIlightbox() {
                         if (jQuery(".masonry-container").length) {
                            jQuery("a.open_popup").iLightBox({
                               skin: "metro-black",
                               path: "horizontal",
                               type: "inline, video, image",
                               maxScale: 1,
                               controls: {
                                  slideshow: true,
                                  arrows: true
                               },
                               overlay: {
                                  opacity: "0.7"
                               }
                            });
                         }
                      }
                      galleryIlightbox();     
})}(window.jQuery);