<?php get_header(); ?>
<?php $page_title = cs_get_option('golobal-enable-page-title');
if ($page_title == "1"):
    echo jwstheme_title_bar();
endif; ?>
<?php if (is_front_page() || !is_home()) {
    $fields = get_field('mp4_url'); 
    // echo '<pre>';
    // print_r( $fields);
    if( $fields ){
    ?>    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" />
        <style>
  .video-container {
  margin: 0 auto;
  max-width: 100%;
  width: 100%;
  height: 590px;
  position: relative;
}
video {
  pointer-events: none;
}
/* Video Slider */
.video-slider {
  display: none;
}
video::-webkit-media-controls-panel {
  display: none !important;
  opacity: 1 !important;
}
a.popup-youtube {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
/* Individual Slide: Container */
.video-slide {
  position: relative;
  margin: 0 auto;
}
/* Individual Slide: Video */
.video-slide video {
  width: 100%;
  height: 590px;
  object-fit: cover;
}
/* Navigation */
.video-slider-btn {
  border: none;
  display: inline-block;
  color: #ff0000;
  font-size: 100px;
  padding: 10px;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  background-color: transparent;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  z-index: 9;
  opacity: 0.7;
  transition: all 350ms ease-in-out;
}
.video-slider-btn:hover {
  opacity: 1;
  transition: all 350ms ease-in-out;
}
.video-slider-btn.left-side {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(0%, -50%);
  -ms-transform: translate(-0%, -50%);
}
.video-slider-btn.right-side {
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(0%, -50%);
  -ms-transform: translate(0%, -50%);
}
</style>
        <div class="main">
            <!-- partial:index.partial.html -->
             <div class="main-content ro-container">
            <div class="video-container">
                <a class="video-slider, videobox">
                    <?php if ($fields): ?>
                        <ul>
                            <?php foreach ($fields as $value): ?>
                                <div class="video-slide">
                                    <video autoplay muted>
                                        <source src="<?php echo $value['mp4']; ?>" type="video/mp4" />
                                    </video>
                                    <a class="popup-youtube" href="<?php echo $value['mp4']; ?>"></a>
                                </div>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </a>
                <button class="video-slider-btn left-side" onclick="plusDivs(-1)">
                    &#10094;
                </button>
                <button class="video-slider-btn right-side" onclick="plusDivs(1)">
                    &#10095;
                </button>
            </div>
        </div>
        <!-- partial -->
        <script>
            var slideIndex = 1;
            showDivs(slideIndex);

            function plusDivs(n) {
                showDivs((slideIndex += n));
            }
            function showDivs(n) {
                var i,
                    x = document.getElementsByClassName('video-slide'),
                    y = document.getElementsByTagName('video');

                if (n > x.length) {
                    slideIndex = 1;
                }

                if (n < 1) {
                    slideIndex = x.length;
                }

                for (i = 0; i < x.length; i++) {
                    x[i].style.display = 'none';
                    // y[i].pause();
                }

                x[slideIndex - 1].style.display = 'block';
            }

            $(function () {
                $('.popup-youtube, .popup-vimeo').magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                });
            });

        </script>

    <?php } } ?>


    <?php while (have_posts()):
        the_post(); ?>

        <?php
        the_content();
        wp_link_pages(array(
            'before' => '<div class="page-links"><span class="page-links-title">' . esc_html__('Pages:', 'kitgreen') . '</span>',
            'after' => '</div>',
            'link_before' => '<span>',
            'link_after' => '</span>',
        ));
        ?>
        <div style="clear: both;"></div>


        <?php //if ( comments_open() || get_comments_number() ) comments_template(); ?>



    <?php endwhile; // end of the loop. ?>
</div>

    <?php 
    ?>



<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css"  />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css" />
  <style type="text/css"> 
  .MainMontainnerSlider {
  overflow: hidden;  
  width: 90%;   
  margin-left: auto;
  margin-right: auto;
}
.custom-slider{
  width: 90%;
  margin: auto;
}
.custom-box{
  width: 200px;
  height: 100px;
  
}
.slick-prev, .slick-next{
  position: absolute;
  line-height: 0;
  top: 50%;
  width: 30px;
  height: 30px;
  display: block;
  padding: 0;
  -webkit-transform: translate(0, -30%);
  transform: translate(0, -30%);
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 50px;
  background: #07f527ff;
}

.slick-next{
  right: -30px;
}
.slick-prev{
  left: -35px;
}  

.slick-next::before, .slick-prev::before {
  font-size: 35px;
  color: #52EF6A;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*


.slick-next{
  right: -30px;
}
.slick-prev{
  left: -30px;
}
.slick-next:before{
  content: 'Next';
  font-size: 1.2em;
  font-weight: 1000;
  padding-left: 12px;
  color: rgb(209, 18, 18);
}
.slick-prev:before{
  content: 'Pre';
  font-size: 1.2em;
  font-weight: 1000;
  padding-left: 9px;
  color: rgb(17, 5, 231);
}
  .slick-prev:hover{
 
  color: rgb(231, 5, 31);
}
.slick-next.slick-arrow:hover{
  background:blueviolet;
  	z-index: 1;

}
 .slick-prev.slick-arrow:hover{
  background:blueviolet;
}
.slick-next::before, [dir="rtl"] .slick-prev::before {
  content: '→';
}
  */
  </style>
 <div class="MainMontainnerSlider">
  
<div class="custom-slider">
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/25.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/24.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/23.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/24.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/25.jpg"></div> 
  <div class="custom-box"> <img src="https://inovviointeriors.com/wp-content/uploads/2018/01/23.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/24.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/24.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/23.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/24.jpg"></div> 
  <div class="custom-box"><img src="https://inovviointeriors.com/wp-content/uploads/2018/01/25.jpg"></div> 
</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js" ></script>
<script>
$('.custom-slider').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
   dots: true,
  infinite: true,
  
 responsive: [
    {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
    {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
    {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      }
    ]
});
</script>



<?php get_footer(); ?>