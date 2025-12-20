<?php $link_url = get_post_meta(get_the_ID(),'tb_post_audio_url',true);
$jwstheme_options = $GLOBALS['jwstheme_options'];
$tb_post_show_post_author_date = (int) isset($jwstheme_options['tb_post_show_post_author']) ?  $jwstheme_options['tb_post_show_post_author']: 1;
 ?>
                 
                        <div class="blog-audio">
                             <iframe width="100" height="166" src="<?php echo esc_url($link_url); ?>"></iframe>
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