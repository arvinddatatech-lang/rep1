<?php 
$jwstheme_options = $GLOBALS['jwstheme_options'];
$tb_post_show_post_author_date = (int) isset($jwstheme_options['tb_post_show_post_author']) ?  $jwstheme_options['tb_post_show_post_author']: 1;
wp_enqueue_style( 'jws_ magnific-popup_css', URI_PATH.'/assets/css/css_jws/magnific-popup.css', false );
$link_url = get_post_meta(get_the_ID(),'tb_post_url_video',true);

 ?>                    
                        <div class="blog-video">
                            <a href="<?php echo esc_url($link_url); ?>" class="blog-video-button" data-effect="mfp-zoom-in"><i class="fa fa-play"></i></a>
                            <a href="<?php the_permalink(); ?>"><img src="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'jws-imge-crop-thumbnail-blog-page' )[0]; ?>" alt="image"></a>
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