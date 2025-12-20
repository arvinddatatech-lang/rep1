 <?php 
global $kitgreen_loop;
$num_comments = get_comments_number(); 
?>         
<div class="content-blog">
        <div class="title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </div>
       <div class="blog-innfo"> <span class="child"><?php  echo get_the_date(); ?></span>
        </div>
</div>