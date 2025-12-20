<?php 
$link_url = get_post_meta(get_the_ID(),'tb_post_audio_url',true);

 ?>      
 <div class="single-blog wow fadeIn text-center">              
                        <div class=" blog-image-sldie jws-carousel jws-theme jws-responsive-1000 jws-loaded">
                           <?php 
                           $images = get_post_meta(get_the_ID(), 'vdw_gallery_id', true);
                           foreach ($images as $image) {
                           ?>
                           <a><img src="<?php echo wp_get_attachment_url($image, 'jws-imge-crop-thumbnail-blog-page'); ?> "alt="" /> </a>
                           <?php                        
                           }
                           ?>
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