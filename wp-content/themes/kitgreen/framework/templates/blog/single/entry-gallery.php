<?php 
$jwstheme_options = $GLOBALS['jwstheme_options'];
$tb_post_show_post_author_date = (int) isset($jwstheme_options['tb_post_show_post_author']) ?  $jwstheme_options['tb_post_show_post_author']: 1;
$link_url = get_post_meta(get_the_ID(),'tb_post_audio_url',true);

 ?>                    
                        <div class="blog-image-sldie jws-carousel jws-theme jws-responsive-1000 jws-loaded">
                           <?php 
                           $images = get_post_meta(get_the_ID(), 'vdw_gallery_id', true);
                           foreach ($images as $image) {
                           ?>
                           <a><img src="<?php echo wp_get_attachment_url($image, 'jws-imge-crop-thumbnail-blog-page'); ?> "alt="" /> </a>
                           <?php
                                                    
                           }
                           ?>
                        </div>
                        <div class="blog-details">
                            <div class="title-and-meta">
                                <h3><?php the_title(); ?></h3>
                                <?php if ($tb_post_show_post_author_date ) : ?>
                                <p class="post-meta">By <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"><?php the_author(); ?></a> | <a><?php echo esc_attr(get_the_date('d M, Y')); ?></a></p>
                                <?php endif; ?>
                            </div>
                            <div class="blog-content">
                                <?php the_content(); ?>
                            </div>
                        </div>