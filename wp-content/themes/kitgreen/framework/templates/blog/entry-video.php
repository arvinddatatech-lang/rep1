<?php 
wp_enqueue_style( 'jws_ magnific-popup_css', URI_PATH.'/assets/css/css_jws/magnific-popup.css', false );
$link_url = get_post_meta(get_the_ID(),'tb_post_url_video',true);

 ?>    
 <div class="single-blog wow fadeIn text-center">                
                        <div class="blog-video">
                            <a href="<?php echo esc_url($link_url); ?>" class="blog-video-button" data-effect="mfp-zoom-in"><i class="fa fa-play"></i></a>
                            <a href="<?php the_permalink(); ?>"><img src="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'jws-imge-crop-thumbnail-blog-page' )[0]; ?>" alt="image"></a>
                        </div>
                        <div class="blog-details text-center">
                            <div class="title-and-meta">
                                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                <p class="post-meta">By <a href="#"><?php the_author(); ?></a> | <a href="#"><?php echo esc_attr(get_the_date('d M, Y')); ?></a></p>
                            </div>
                            <div class="blog-content">
                                <div class="blog-content">
                                <a href="<?php the_permalink(); ?>" class="read-more">Go to Detail</a>
                                </div>
                            </div>
                        </div>
 </div>                       